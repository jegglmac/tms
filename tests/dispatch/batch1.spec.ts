import { expect, test, type Page } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { spawn, type ChildProcess } from "node:child_process";
import { once } from "node:events";
import { randomUUID } from "node:crypto";
import { createServer, request } from "node:http";

const url = process.env.SUPABASE_URL ?? "";
const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? "";
const adminKey = process.env.TMS_TEST_SUPABASE_SERVICE_KEY ?? "";
if (url !== "http://127.0.0.1:54321" || !key || !adminKey) {
  throw new Error("These tests require a disposable local Supabase instance.");
}
const base = "http://127.0.0.1:3000";
const clientOptions = { auth: { persistSession: false, autoRefreshToken: false } };
const admin = createClient(url, adminKey, clientOptions);
const a = createClient(url, key, clientOptions);
const b = createClient(url, key, clientOptions);
const anonymous = createClient(url, key, clientOptions);
const companyA = randomUUID();
const companyB = randomUUID();
const password = randomUUID();
const emailA = `a-${companyA}@example.test`;
const emailB = `b-${companyB}@example.test`;
let userA: string;
let app: ChildProcess | undefined;

function noError(error: unknown) {
  expect(error).toBeNull();
}

async function startApp(command: "start" | "dev" = "start", gateway?: { url: string; output: string[] }) {
  const appEnv = { ...process.env };
  delete appEnv.TMS_TEST_SUPABASE_SERVICE_KEY;
  if (gateway) appEnv.SUPABASE_URL = gateway.url;
  app = spawn(process.execPath, ["node_modules/next/dist/bin/next", command, "--hostname", "127.0.0.1"],
    { env: appEnv, stdio: gateway ? "pipe" : "inherit" });
  if (gateway) {
    app.stdout?.on("data", (chunk: Buffer) => gateway.output.push(chunk.toString()));
    app.stderr?.on("data", (chunk: Buffer) => gateway.output.push(chunk.toString()));
  }
  await expect.poll(async () => {
    try { return (await fetch(`${base}/sign-in`)).status; } catch { return 0; }
  }, { timeout: 30_000 }).toBe(200);
}

async function stopApp() {
  if (!app || app.exitCode !== null || app.signalCode !== null) return;
  const exited = once(app, "exit");
  app.kill("SIGTERM");
  await exited;
}

async function seedTenant(id: string, email: string, client: typeof a) {
  const user = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  noError(user.error);
  const userId = user.data.user!.id;
  noError((await admin.from("companies").insert({ id, slug: `test-${id}`, name: `Carrier ${email[0].toUpperCase()}` })).error);
  noError((await admin.from("users").insert({ id: userId, display_name: email[0] })).error);
  noError((await admin.from("memberships").insert({ company_id: id, user_id: userId, role: "dispatcher" })).error);
  noError((await client.auth.signInWithPassword({ email, password })).error);
  return userId;
}

function details(reference = randomUUID()) {
  return {
    counterparty: "Keystone Broker", reference, rateCents: 52500, cargo: "Dry goods",
    pickupAddress: "100 Example St, Uniontown, PA", deliveryAddress: "200 Example St, Pittsburgh, PA",
    pickupStart: "2027-01-04T13:00:00Z", pickupEnd: "2027-01-04T14:00:00Z",
    deliveryStart: "2027-01-04T16:00:00Z", deliveryEnd: "2027-01-04T17:00:00Z",
  };
}

function save(client: typeof a, company: string, fields = {}) {
  return client.rpc("tms_save_load", {
    p_company: company, p_request: randomUUID(), p_action: "create", p_data: details(), ...fields,
  });
}

async function login(page: Page, email = emailA) {
  await page.goto("/sign-in");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Dispatch Center" })).toBeVisible();
}

async function fill(page: Page, reference: string, delivery = "200 Example St, Pittsburgh, PA") {
  for (const [label, value] of Object.entries({
    "Customer or broker": "Keystone Broker",
    "Customer or broker reference": reference,
    "Agreed rate (USD)": "525.00",
    "Cargo description": "Dry goods",
    "Pickup address": "100 Example St, Uniontown, PA",
    "Pickup window start": "2027-01-04T08:00",
    "Pickup window end": "2027-01-04T09:00",
    "Delivery address": delivery,
    "Delivery window start": "2027-01-04T11:00",
    "Delivery window end": "2027-01-04T12:00",
  })) await page.getByLabel(label, { exact: true }).fill(value);
}

test.beforeAll(async () => {
  userA = await seedTenant(companyA, emailA, a);
  await seedTenant(companyB, emailB, b);
  await startApp();
});
test.afterAll(stopApp);

test("requires authentication, rejects invalid login, and signs out", async ({ page }) => {
  const denied = await page.goto(`/dispatch/${companyA}`);
  await expect(page).toHaveURL(/sign-in/);
  expect(denied?.headers()["cache-control"]).toContain("no-store");
  await page.getByLabel("Email").fill(emailA);
  await page.getByLabel("Password").fill("invalid-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText("Sign-in failed");
  await login(page);
  const authCookies = (await page.context().cookies()).filter((cookie) => cookie.name.includes("-auth-token"));
  expect(authCookies.length).toBeGreaterThan(0);
  expect(authCookies.every((cookie) => cookie.httpOnly && cookie.sameSite === "Lax")).toBe(true);
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/sign-in/);
  await page.goto(`/dispatch/${companyA}`);
  await expect(page).toHaveURL(/sign-in/);
  const signup = await anonymous.auth.signUp({ email: `denied-${randomUUID()}@example.test`, password });
  expect(signup.error).not.toBeNull();
  expect((await anonymous.from("loads").select("*")).error).not.toBeNull();
  expect((await save(anonymous, companyA)).error).not.toBeNull();
});

test("isolates both companies across queries, mutations, and routes", async ({ page }) => {
  const own = await save(a, companyA);
  const other = await save(b, companyB);
  noError(own.error); noError(other.error);
  const loadNumber = await b.from("loads").select("load_number").eq("id", other.data).single();
  expect(loadNumber.data?.load_number).toBe(1);
  for (const table of ["loads", "load_stops", "shipment_events", "audit_logs"]) {
    const blocked = await a.from(table).select("*").eq("company_id", companyB);
    noError(blocked.error);
    expect(blocked.data).toEqual([]);
  }
  expect((await b.from("loads").select("*").eq("company_id", companyA)).data).toEqual([]);
  expect((await save(a, companyB)).error?.code).toBe("42501");
  expect((await save(a, companyB, { p_action: "edit", p_load: other.data, p_version: 1 })).error?.code).toBe("42501");
  expect((await save(a, companyA, { p_action: "edit", p_load: other.data, p_version: 1 })).error?.code).toBe("40001");
  expect((await a.from("loads").insert({ company_id: companyB })).error?.code).toBe("42501");
  expect((await a.from("loads").update({ status: "ready" }).eq("id", other.data)).error?.code).toBe("42501");
  expect((await a.from("loads").delete().eq("id", other.data)).error?.code).toBe("42501");
  expect((await a.from("audit_logs").delete().eq("load_id", own.data)).error?.code).toBe("42501");
  await login(page);
  await page.goto(`/dispatch/${companyB}/${other.data}`);
  await expect(page.getByText("This page could not be found.")).toBeVisible();
  const check = await b.from("loads").select("status,version").eq("id", other.data).single();
  expect(check.data).toEqual({ status: "draft", version: 1 });
});

test("enforces role downgrade and revocation on existing sessions", async () => {
  const change = async (data: { role?: string; revoked_at?: string | null }) =>
    noError((await admin.from("memberships").update(data).eq("company_id", companyA).eq("user_id", userA)).error);
  try {
    await change({ role: "viewer" });
    expect((await save(a, companyA)).error?.code).toBe("42501");
    expect((await a.from("loads").select("*").eq("company_id", companyA)).data).toEqual([]);
    await change({ role: "dispatcher", revoked_at: new Date().toISOString() });
    expect((await save(a, companyA)).error?.code).toBe("42501");
  } finally {
    await change({ role: "dispatcher", revoked_at: null });
  }
});

test("deduplicates simultaneous submits and rejects a changed replay", async () => {
  const input = { p_request: randomUUID(), p_data: details() };
  const [first, second] = await Promise.all([save(a, companyA, input), save(a, companyA, input)]);
  noError(first.error); noError(second.error);
  expect(first.data).toBeTruthy();
  expect(second.data).toBe(first.data);
  expect((await save(a, companyA, { ...input, p_data: details() })).error?.code).toBe("23505");
  const load = await a.from("loads").select("id,load_stops(kind),shipment_events(version),audit_logs(version)")
    .eq("id", first.data).single();
  noError(load.error);
  expect(load.data!.load_stops).toHaveLength(2);
  expect(load.data!.shipment_events).toHaveLength(1);
  expect(load.data!.audit_logs).toHaveLength(1);
});

test("allows only one concurrent update and records the actor", async () => {
  const created = await save(a, companyA);
  noError(created.error);
  const updates = await Promise.all([save(a, companyA, { p_action: "ready", p_load: created.data, p_version: 1, p_data: null }),
    save(a, companyA, { p_action: "ready", p_load: created.data, p_version: 1, p_data: null })]);
  expect(updates.filter((result) => !result.error)).toHaveLength(1);
  expect(updates.find((result) => result.error)?.error?.code).toBe("40001");
  const events = await a.from("shipment_events").select("from_status,to_status,actor_id")
    .eq("load_id", created.data).order("version");
  noError(events.error);
  expect(events.data).toEqual([{ from_status: null, to_status: "draft", actor_id: userA },
    { from_status: "draft", to_status: "ready", actor_id: userA }]);
});

test("rolls back a database failure after load insertion", async () => {
  const input = details();
  const result = await save(a, companyA, { p_data: { ...input, deliveryAddress: "" } });
  expect(result.error?.code).toBe("23514");
  const record = await a.from("loads").select("id").eq("reference", input.reference);
  noError(record.error);
  expect(record.data).toEqual([]);
});

test("shows a real failed database save without losing form details", async ({ page }) => {
  await login(page);
  await page.getByRole("link", { name: "New load" }).click();
  const reference = randomUUID();
  await fill(page, reference);
  // First render is valid. Insert a conflicting request key via the same authenticated RPC.
  const request = await page.locator('input[name="requestId"]').inputValue();
  const seeded = await save(a, companyA, { p_request: request, p_data: details() });
  noError(seeded.error);
  await page.getByRole("button", { name: "Save load" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText("changed");
  await expect(page.getByLabel("Customer or broker reference")).toHaveValue(reference);
  expect((await a.from("loads").select("id").eq("reference", reference)).data).toEqual([]);
});

test("desktop and mobile share create, edit, status, and restart persistence", async ({ page, browser }) => {
  await login(page);
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  try {
    await login(mobile);
    const desktopReference = `Desktop-${randomUUID()}`;
    const mobileReference = `Mobile-${randomUUID()}`;
    await page.getByRole("link", { name: "New load" }).click();
    await fill(page, desktopReference);
    await page.getByRole("button", { name: "Save load" }).click();
    await expect(page.getByRole("heading", { name: /Load #/ })).toBeVisible();
    const desktopURL = page.url();
    await mobile.reload();
    await mobile.getByRole("link", { name: new RegExp(desktopReference) }).click();
    await expect(mobile.getByLabel("Customer or broker reference")).toHaveValue(desktopReference);
    await mobile.getByLabel("Cargo description").fill("Edited on mobile");
    await mobile.getByRole("button", { name: "Save load" }).click();
    await expect.poll(async () => {
      const updated = await a.from("loads").select("cargo").eq("reference", desktopReference).single();
      return updated.data?.cargo;
    }).toBe("Edited on mobile");
    await mobile.reload();
    await mobile.getByRole("button", { name: "Mark Ready" }).click();
    await expect(mobile.getByText("draft → ready")).toBeVisible();
    await expect(mobile.getByRole("button", { name: "Mark Ready" })).toHaveCount(0);
    await expect(mobile.getByRole("button", { name: /Saving/ })).toHaveCount(0);
    await expect(mobile.getByRole("button", { name: "Save load" })).toBeEnabled();
    await mobile.getByRole("link", { name: "Back to loads" }).click();
    await mobile.getByRole("link", { name: "New load" }).click();
    await fill(mobile, mobileReference);
    await mobile.getByRole("button", { name: "Save load" }).click();
    await expect(mobile.getByRole("heading", { name: /Load #/ })).toBeVisible();
    await page.getByRole("link", { name: "Back to loads" }).click();
    await expect(page.getByRole("link", { name: new RegExp(mobileReference) })).toBeVisible();
    await stopApp();
    await startApp();
    await page.goto(desktopURL);
    await expect(page.getByText("draft → ready")).toBeVisible();
    await expect(page.getByLabel("Cargo description")).toHaveValue("Edited on mobile");
    const id = desktopURL.split("/").at(-1);
    const audit = await a.from("audit_logs").select("action").eq("load_id", id).order("version");
    noError(audit.error);
    expect(audit.data).toEqual([{ action: "create" }, { action: "edit" }, { action: "ready" }]);
  } finally {
    await mobile.close();
  }
});

test("rejects invalid DST times and keeps prototype route reachable", async ({ page }) => {
  await login(page);
  await page.getByRole("link", { name: "New load" }).click();
  const reference = randomUUID();
  await fill(page, reference);
  await page.getByLabel("Pickup window start").fill("2027-03-14T02:30");
  await page.getByRole("button", { name: "Save load" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText("unambiguous");
  expect((await a.from("loads").select("id").eq("reference", reference)).data).toEqual([]);
  await page.goto("/demo/shipments");
  await expect(page.getByText("Demonstration data")).toBeVisible();
});


const driverFields = {
  display_name: "Synthetic Driver", work_email: "driver@example.test", work_phone: "555-0100", relationship: "contractor",
};
const vehicleFields = {
  unit_number: "TMS-TEST", equipment_type: "box_truck", operating_status: "in_service",
  make: "", model: "", model_year: "",
};

function rosterWrite(client: typeof a, company: string, kind: "drivers" | "vehicles", id: string,
  action: string, version: number | null, data: Record<string, string> | null) {
  return client.rpc("tms_save_roster", {
    p_company: company, p_kind: kind, p_action: action, p_id: id, p_version: version, p_data: data,
  });
}

test("roster RLS blocks cross-company reads and all unauthorized write paths", async ({ page }) => {
  for (const [kind, fields] of [["drivers", driverFields], ["vehicles", vehicleFields]] as const) {
    const foreignId = randomUUID();
    noError((await rosterWrite(b, companyB, kind, foreignId, "create", null, fields)).error);
    expect((await a.from(kind).select("id").eq("company_id", companyB)).data).toEqual([]);
    expect((await a.from(kind).select("id").eq("id", foreignId)).data).toEqual([]);
    const auditKey = kind === "drivers" ? "driver_id" : "vehicle_id";
    expect((await a.from("roster_events").select("id").eq(auditKey, foreignId)).data).toEqual([]);
    expect((await rosterWrite(anonymous, companyA, kind, randomUUID(), "create", null, fields)).error).not.toBeNull();
    expect((await rosterWrite(a, companyB, kind, randomUUID(), "create", null, fields)).error?.code).toBe("42501");
    for (const action of ["edit", "activate", "deactivate"]) {
      const data = action === "edit" ? fields : null;
      expect((await rosterWrite(a, companyB, kind, foreignId, action, 1, data)).error?.code).toBe("42501");
      expect((await rosterWrite(a, companyA, kind, foreignId, action, 1, data)).error?.code).toBe("40001");
    }
    expect((await a.from(kind).insert({ company_id: companyA, id: randomUUID(), ...fields })).error?.code).toBe("42501");
    expect((await a.from(kind).update({ active: false }).eq("id", foreignId)).error?.code).toBe("42501");
    expect((await a.from(kind).delete().eq("id", foreignId)).error?.code).toBe("42501");
    expect((await a.from("roster_events").insert({ company_id: companyA, actor_id: userA, action: "create" })).error?.code).toBe("42501");
    expect((await a.from("roster_events").update({ action: "edit" }).eq(auditKey, foreignId)).error?.code).toBe("42501");
    const original = await b.from(kind).select("active,version").eq("id", foreignId).single();
    noError(original.error);
    expect(original.data).toEqual({ active: true, version: 1 });
    await login(page);
    for (const path of [`/dispatch/${companyB}/${kind}`, `/dispatch/${companyA}/${kind}?record=${foreignId}`]) {
      expect((await page.goto(path))?.status()).toBe(404);
      await expect(page.getByText("This page could not be found.")).toBeVisible();
    }
  }

  const membership = async (data: { role?: string; revoked_at?: string | null }) =>
    noError((await admin.from("memberships").update(data).eq("company_id", companyA).eq("user_id", userA)).error);
  try {
    await membership({ role: "viewer" });
    expect((await rosterWrite(a, companyA, "drivers", randomUUID(), "create", null, driverFields)).error?.code).toBe("42501");
    await membership({ role: "dispatcher", revoked_at: new Date().toISOString() });
    expect((await rosterWrite(a, companyA, "vehicles", randomUUID(), "create", null, vehicleFields)).error?.code).toBe("42501");
  } finally {
    await membership({ role: "dispatcher", revoked_at: null });
  }
});

test("roster enforces normalized units, equipment types, versions, and atomic audit", async () => {
  const id = randomUUID();
  const unit = `U-${randomUUID().slice(0, 8)}`;
  const payload = { ...vehicleFields, unit_number: unit };
  noError((await rosterWrite(a, companyA, "vehicles", id, "create", null, payload)).error);
  noError((await rosterWrite(a, companyA, "vehicles", id, "deactivate", 1, null)).error);
  expect((await rosterWrite(a, companyA, "vehicles", randomUUID(), "create", null, {
    ...payload, unit_number: ` ${unit.toLowerCase()} `,
  })).error?.code).toBe("23505");
  noError((await rosterWrite(b, companyB, "vehicles", randomUUID(), "create", null, payload)).error);
  for (const equipment_type of ["cargo_van", "straight_truck", "tractor_trailer"]) {
    noError((await rosterWrite(a, companyA, "vehicles", randomUUID(), "create", null, {
      ...payload, unit_number: `${unit}-${equipment_type}`, equipment_type,
    })).error);
  }
  expect((await rosterWrite(a, companyA, "vehicles", id, "edit", 1, payload)).error?.code).toBe("40001");
  expect((await rosterWrite(a, companyA, "vehicles", id, "edit", 2, {
    ...payload, equipment_type: "invalid",
  })).error?.code).toBe("23514");
  const edits = await Promise.all(["maintenance", "out_of_service"].map((operating_status) =>
    rosterWrite(a, companyA, "vehicles", id, "edit", 2, { ...payload, operating_status })));
  expect(edits.filter((result) => !result.error)).toHaveLength(1);
  expect(edits.find((result) => result.error)?.error?.code).toBe("40001");
  noError((await rosterWrite(a, companyA, "vehicles", id, "activate", 3, null)).error);
  const row = await a.from("vehicles").select("id,active,version,operating_status").eq("id", id).single();
  noError(row.error);
  expect(row.data).toMatchObject({ id, active: true, version: 4 });
  expect(["maintenance", "out_of_service"]).toContain(row.data?.operating_status);
  const audit = await a.from("roster_events").select("*").eq("vehicle_id", id).order("version");
  noError(audit.error);
  expect(audit.data?.map(({ action, actor_id, version }) => [action, actor_id, version])).toEqual([
    ["create", userA, 1], ["deactivate", userA, 2], ["edit", userA, 3], ["activate", userA, 4],
  ]);
  expect(Object.keys(audit.data![0]).sort()).toEqual(
    ["action", "actor_id", "company_id", "driver_id", "id", "recorded_at", "vehicle_id", "version"],
  );
});

test("desktop and mobile share persistent driver and vehicle rosters", async ({ page, browser }) => {
  await login(page);
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  try {
    const driver = `Driver ${randomUUID().slice(0, 8)}`;
    const unit = `MOB-${randomUUID().slice(0, 8).toUpperCase()}`;
    const root = `/dispatch/${companyA}`;
    await page.getByRole("link", { name: "Drivers", exact: true }).click();
    await page.getByRole("link", { name: "New driver" }).click();
    await page.getByLabel("Driver name").fill(driver);
    await page.getByLabel("Work email").fill("roster-test@example.test");
    await page.getByRole("button", { name: "Save driver" }).click();
    await expect(page.getByRole("heading", { name: driver })).toBeVisible();
    const driverPath = new URL(page.url()).pathname + new URL(page.url()).search;

    await login(mobile);
    await mobile.goto(driverPath);
    await mobile.getByLabel("Driver name").fill(`${driver} Updated`);
    await mobile.getByRole("button", { name: "Save driver" }).click();
    await expect(mobile.getByRole("heading", { name: `${driver} Updated` })).toBeVisible();
    await mobile.getByRole("button", { name: "Deactivate", exact: true }).click();
    await expect(mobile.getByText("Record status: Inactive")).toBeVisible();
    await mobile.getByRole("link", { name: "Back to drivers" }).click();
    await mobile.getByRole("link", { name: "Inactive", exact: true }).click();
    await mobile.getByRole("link", { name: new RegExp(driver) }).click();
    await mobile.getByRole("button", { name: "Activate", exact: true }).click();
    await expect(mobile.getByText("Record status: Active")).toBeVisible();

    await mobile.goto(`${root}/vehicles?record=new`);
    await mobile.getByLabel("Unit number").fill(unit);
    await mobile.getByLabel("Equipment type").selectOption("tractor_trailer");
    await mobile.getByLabel("Operating status").selectOption("maintenance");
    await mobile.getByRole("button", { name: "Save vehicle" }).click();
    await expect(mobile.getByRole("heading", { name: unit })).toBeVisible();
    const vehiclePath = new URL(mobile.url()).pathname + new URL(mobile.url()).search;
    expect(await mobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    await stopApp();
    await startApp();
    await page.goto(driverPath);
    await expect(page.getByLabel("Driver name")).toHaveValue(`${driver} Updated`);
    await expect(page.getByLabel("Work email")).toHaveValue("roster-test@example.test");
    await page.goto(vehiclePath);
    await expect(page.getByLabel("Equipment type")).toHaveValue("tractor_trailer");
    await expect(page.getByLabel("Operating status")).toHaveValue("maintenance");
  } finally {
    await mobile.close();
  }
});

test("draft forms have distinct keys and Mark Ready clears without a reload in development", async ({ page }) => {
  test.setTimeout(120_000);
  await stopApp();
  await startApp("dev");

  const duplicateKeys: string[] = [];
  page.on("console", (message) => {
    if (/two children with the same key|each child in a list should have a unique/i.test(message.text())) {
      duplicateKeys.push(message.text());
    }
  });

  const created = await save(a, companyA);
  noError(created.error);
  await login(page);
  await page.goto(`/dispatch/${companyA}/${created.data}`);
  await expect(page.getByRole("button", { name: "Mark Ready" })).toBeEnabled();
  await expect(page.getByRole("button", { name: "Save load" })).toBeEnabled();
  expect(duplicateKeys).toEqual([]);

  await page.getByRole("button", { name: "Mark Ready" }).click();
  await expect(page.getByText("draft → ready")).toBeVisible();
  await expect(page.getByRole("button", { name: "Mark Ready" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Saving/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Save load" })).toBeEnabled();
  expect(duplicateKeys).toEqual([]);
});

test("authorization failures stay closed and log only safe metadata", async ({ page }) => {
  test.setTimeout(90_000);
  const marker = "SYNTHETIC_UPSTREAM_SECRET_MARKER";
  const output: string[] = [];
  let rpcFault: { status: number; code: string } | undefined;
  let refreshFault: { status: number; code: string } | undefined;
  let saveCalls = 0;
  let refreshCalls = 0;

  const gateway = createServer((incoming, outgoing) => {
    const endpoint = new URL(incoming.url ?? "/", url);
    if (endpoint.origin !== url) {
      incoming.resume();
      outgoing.writeHead(400).end();
      return;
    }
    const companyCheck = endpoint.pathname === "/rest/v1/rpc/tms_can_dispatch";
    const refresh = endpoint.pathname === "/auth/v1/token" && endpoint.searchParams.get("grant_type") === "refresh_token";
    if (endpoint.pathname === "/rest/v1/rpc/tms_save_load") saveCalls++;
    if (refresh) refreshCalls++;
    const fault = companyCheck ? rpcFault :
      refresh ? refreshFault : undefined;

    if (fault) {
      incoming.resume();
      outgoing.writeHead(fault.status, { "content-type": "application/json" });
      outgoing.end(JSON.stringify({
        code: fault.code, error_code: fault.code, message: marker, msg: marker, details: marker, hint: marker,
      }));
      return;
    }

    const upstream = request(endpoint, {
      method: incoming.method,
      headers: { ...incoming.headers, host: endpoint.host },
    }, (response) => {
      outgoing.writeHead(response.statusCode ?? 502, response.headers);
      response.pipe(outgoing);
    });
    upstream.on("error", () => {
      if (!outgoing.headersSent) outgoing.writeHead(502);
      outgoing.end();
    });
    incoming.pipe(upstream);
  });
  gateway.listen(0, "127.0.0.1");
  await once(gateway, "listening");
  const address = gateway.address();
  if (!address || typeof address === "string") throw new Error("Missing disposable gateway port");
  const testGateway = { url: `http://127.0.0.1:${address.port}`, output };
  const diagnostics = () => output.join("").split("\n").flatMap((line) => {
    const json = line.match(/\{"event":"dispatch_authorization_failure".*\}/)?.[0];
    return json ? [JSON.parse(json)] : [];
  });

  try {
    await stopApp();
    await startApp("start", testGateway);
    await login(page);
    const companyPath = `/dispatch/${companyA}`;
    const denied = await page.goto(`/dispatch/${companyB}`);
    expect(denied?.status()).toBe(404);
    await expect(page.getByText("This page could not be found.")).toBeVisible();

    rpcFault = { status: 401, code: "PGRST301" };
    await page.goto(companyPath);
    await expect(page).toHaveURL(/\/sign-in$/);
    await expect.poll(diagnostics).toContainEqual(expect.objectContaining({
      stage: "company_rpc", status: 401, code: "PGRST301",
    }));

    rpcFault = undefined;
    await login(page);
    await page.getByRole("link", { name: "New load" }).click();
    const reference = `Blocked-${randomUUID()}`;
    await fill(page, reference);
    rpcFault = { status: 503, code: marker };
    const before = saveCalls;
    await page.getByRole("button", { name: "Save load" }).click();
    await expect.poll(diagnostics).toContainEqual(expect.objectContaining({ stage: "company_rpc", status: 503 }));
    await expect(page.getByRole("heading", { name: "Dispatch could not be loaded" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Retry" })).toBeVisible();
    expect(saveCalls).toBe(before);
    const missing = await a.from("loads").select("id").eq("reference", reference);
    noError(missing.error);
    expect(missing.data).toEqual([]);

    rpcFault = undefined;
    await page.goto(companyPath);
    await expect(page.getByRole("heading", { name: "Dispatch Center" })).toBeVisible();

    const authCookies = (await page.context().cookies(base)).filter((cookie) => /-auth-token(?:\.\d+)?$/.test(cookie.name));
    expect(authCookies.length).toBeGreaterThan(0);
    const cookieName = authCookies[0].name.replace(/\.\d+$/, "");
    const { data, error } = await a.auth.getSession();
    noError(error);
    expect(data.session).not.toBeNull();
    const expiredSession = { ...data.session, expires_at: 1, refresh_token: marker };
    const cookieValue = "base64-" + Buffer.from(JSON.stringify(expiredSession)).toString("base64url");
    await page.context().clearCookies({ name: /-auth-token(?:\.\d+)?$/ });
    await page.context().addCookies([{ name: cookieName, value: cookieValue, url: base, httpOnly: true }]);
    refreshFault = { status: 429, code: "over_request_rate_limit" };
    await page.goto(companyPath);
    await expect(page.getByRole("heading", { name: "Dispatch could not be loaded" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Retry" })).toBeVisible();
    await expect.poll(diagnostics).toContainEqual(expect.objectContaining({
      stage: "session", code: "over_request_rate_limit", status: 429,
    }));

    refreshFault = { status: 400, code: "refresh_token_not_found" };
    await page.goto(companyPath);
    await expect(page).toHaveURL(/\/sign-in$/);
    expect(refreshCalls).toBeGreaterThan(0);
    await expect.poll(diagnostics).toContainEqual(expect.objectContaining({
      stage: "proxy_session", code: "refresh_token_not_found", status: 400,
    }));

    for (const entry of diagnostics()) {
      expect(entry).toEqual({
        event: "dispatch_authorization_failure", stage: expect.stringMatching(/^(proxy_session|session|company_rpc)$/),
        timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
        correlationId: expect.stringMatching(/^[a-f0-9-]{36}$/), elapsedMs: expect.any(Number),
        ...(entry.code === undefined ? {} : { code: expect.stringMatching(/^(PGRST301|refresh_token_not_found|over_request_rate_limit)$/) }),
        ...(entry.status === undefined ? {} : { status: expect.any(Number) }),
      });
      expect(entry.elapsedMs).toBeGreaterThanOrEqual(0);
    }
    expect(output.join("").includes(marker)).toBe(false);
  } finally {
    await stopApp();
    gateway.closeAllConnections();
    await new Promise<void>((resolve) => gateway.close(() => resolve()));
  }
});
