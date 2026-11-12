import { expect, test, type Page } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { spawn, type ChildProcess } from "node:child_process";
import { once } from "node:events";
import { randomUUID } from "node:crypto";

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

async function startApp() {
  const appEnv = { ...process.env };
  delete appEnv.TMS_TEST_SUPABASE_SERVICE_KEY;
  app = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1"],
    { env: appEnv, stdio: "inherit" });
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
