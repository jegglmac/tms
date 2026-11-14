import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_PUBLISHABLE_KEY;
const secret = process.env.TMS_TEST_SUPABASE_SERVICE_KEY;
if (url !== "http://127.0.0.1:54321" || !key || !secret) throw new Error("Disposable loopback Supabase required");
const options = { auth: { persistSession: false, autoRefreshToken: false } };
const admin = createClient(url, secret, options);
const anonymous = createClient(url, key, options);
const ok = (error: unknown) => expect(error).toBeNull();

async function tenant() {
  const company = randomUUID();
  const email = `${company}@example.test`;
  const password = randomUUID();
  const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  ok(created.error);
  const actor = created.data.user!.id;
  ok((await admin.from("companies").insert({ id: company, slug: `assign-${company}`, name: "Synthetic carrier" })).error);
  ok((await admin.from("users").insert({ id: actor, display_name: "Synthetic dispatcher" })).error);
  ok((await admin.from("memberships").insert({ company_id: company, user_id: actor, role: "dispatcher" })).error);
  const client = createClient(url!, key!, options);
  ok((await client.auth.signInWithPassword({ email, password })).error);
  return { company, actor, client };
}
type Tenant = Awaited<ReturnType<typeof tenant>>;
const details = () => ({ counterparty: "Synthetic broker", reference: randomUUID(), cargo: "Test cargo", rateCents: 10000,
  pickupAddress: "Synthetic pickup", deliveryAddress: "Synthetic delivery",
  pickupStart: "2027-01-04T13:00:00Z", pickupEnd: "2027-01-04T14:00:00Z",
  deliveryStart: "2027-01-04T16:00:00Z", deliveryEnd: "2027-01-04T17:00:00Z" });
async function load(t: Tenant) {
  const r = await t.client.rpc("tms_save_load", { p_company: t.company, p_request: randomUUID(), p_action: "create", p_data: details() });
  ok(r.error); return r.data as string;
}
async function resource(t: Tenant, kind: "drivers" | "vehicles") {
  const id = randomUUID();
  const r = await t.client.rpc("tms_save_roster", { p_company: t.company, p_kind: kind, p_action: "create", p_id: id, p_version: null,
    p_data: kind === "drivers" ? { display_name: "Synthetic driver" } : { unit_number: id, equipment_type: "box_truck", operating_status: "in_service" } });
  ok(r.error); return id;
}
function assign(t: Tenant, id: string, version: number, driver: string | null, vehicle: string | null, request = randomUUID()) {
  return t.client.rpc("tms_set_load_assignment", { p_company: t.company, p_load: id, p_version: version, p_request: request, p_driver: driver, p_vehicle: vehicle });
}
function deactivate(t: Tenant, kind: string, id: string) {
  return t.client.rpc("tms_save_roster", { p_company: t.company, p_kind: kind, p_action: "deactivate", p_id: id, p_version: 1, p_data: null });
}
function vehicleStatus(t: Tenant, id: string, status: string) {
  return t.client.rpc("tms_save_roster", { p_company: t.company, p_kind: "vehicles", p_action: "edit", p_id: id, p_version: 1,
    p_data: { unit_number: id, equipment_type: "box_truck", operating_status: status } });
}
async function current(t: Tenant, id: string) {
  const r = await t.client.from("load_assignments").select("*").eq("company_id", t.company).eq("load_id", id).maybeSingle();
  ok(r.error); return r.data;
}

test("assignment lifecycle, optional Ready, audit privacy and durable reads", async () => {
  const t = await tenant(); const id = await load(t); const d = await resource(t, "drivers"); const v = await resource(t, "vehicles");
  ok((await t.client.rpc("tms_save_load", { p_company: t.company, p_request: randomUUID(), p_action: "ready", p_load: id, p_version: 1 })).error);
  expect((await assign(t, id, 2, d, null)).data).toMatchObject({ version: 3, changed: true });
  expect((await assign(t, id, 3, d, v)).data).toMatchObject({ version: 4, changed: true });
  expect((await assign(t, id, 4, null, null)).data).toMatchObject({ version: 5, changed: true });
  expect(await current(t, id)).toMatchObject({ driver_id: null, vehicle_id: null });
  const events = await t.client.from("load_assignment_events").select("*").eq("load_id", id).order("version");
  ok(events.error); expect(events.data).toHaveLength(3);
  expect(events.data![2]).toMatchObject({ previous_driver_id: d, previous_vehicle_id: v, driver_id: null, vehicle_id: null, actor_id: t.actor, version: 5 });
  expect(Object.keys(events.data![0]).sort()).toEqual(["company_id", "load_id", "version", "actor_id", "request_id", "previous_driver_id", "driver_id", "previous_vehicle_id", "vehicle_id", "recorded_at"].sort());
  const fresh = createClient(url!, key!, options);
  const session = (await t.client.auth.getSession()).data.session!;
  ok((await fresh.auth.setSession({ access_token: session.access_token, refresh_token: session.refresh_token })).error);
  expect((await fresh.from("loads").select("version,status").eq("id", id).single()).data).toEqual({ version: 5, status: "ready" });
});

test("unchanged assignments create receipts without misleading events or version increments", async () => {
  const t = await tenant(); const id = await load(t); const d = await resource(t, "drivers");
  const empty = randomUUID();
  expect((await assign(t, id, 1, null, null, empty)).data).toMatchObject({ version: 1, changed: false });
  expect(await current(t, id)).toBeNull();
  ok((await assign(t, id, 1, d, null)).error);
  expect((await assign(t, id, 2, d, null)).data).toMatchObject({ version: 2, changed: false });
  const events = await t.client.from("load_assignment_events").select("version").eq("load_id", id);
  expect(events.data).toHaveLength(1);
  expect((await assign(t, id, 1, d, null)).error?.code).toBe("40001");
});

test("simultaneous duplicate submissions produce one event and reject changed payload", async () => {
  const t = await tenant(); const id = await load(t); const d = await resource(t, "drivers"); const request = randomUUID();
  const results = await Promise.all([assign(t, id, 1, d, null, request), assign(t, id, 1, d, null, request)]);
  results.forEach(r => ok(r.error)); expect(results[0].data).toEqual(results[1].data);
  expect((await assign(t, id, 1, null, null, request)).error?.code).toBe("23505");
  expect((await t.client.from("load_assignment_events").select("version").eq("load_id", id)).data).toHaveLength(1);
});

test("revoked authorization cannot retrieve an earlier duplicate receipt", async () => {
  const t = await tenant(); const id = await load(t); const d = await resource(t, "drivers"); const request = randomUUID();
  ok((await assign(t, id, 1, d, null, request)).error);
  ok((await admin.from("memberships").update({ revoked_at: new Date().toISOString() }).eq("company_id", t.company).eq("user_id", t.actor)).error);
  expect((await assign(t, id, 1, d, null, request)).error?.code).toBe("42501");
});

for (const kind of ["drivers", "vehicles"] as const) {
  test(`simultaneous ${kind} reservation conflicts have exactly one winner`, async () => {
    const t = await tenant(); const first = await load(t); const second = await load(t); const r = await resource(t, kind);
    const results = await Promise.all([first, second].map(id => assign(t, id, 1, kind === "drivers" ? r : null, kind === "vehicles" ? r : null)));
    expect(results.filter(x => !x.error)).toHaveLength(1);
    expect(results.filter(x => x.error).map(x => x.error!.code)).toEqual(["23505"]);
  });
}

test("failed reassignment preserves both original reservations and audit count", async () => {
  const t = await tenant(); const a = await load(t); const b = await load(t);
  const d = await resource(t, "drivers"); const v = await resource(t, "vehicles"); const occupied = await resource(t, "vehicles");
  ok((await assign(t, a, 1, d, v)).error); ok((await assign(t, b, 1, null, occupied)).error);
  expect((await assign(t, a, 2, null, occupied)).error?.code).toBe("23505");
  expect(await current(t, a)).toMatchObject({ driver_id: d, vehicle_id: v });
  expect((await t.client.from("loads").select("version").eq("id", a).single()).data?.version).toBe(2);
  expect((await t.client.from("load_assignment_events").select("version").eq("load_id", a)).data).toHaveLength(1);
  ok((await assign(t, b, 2, null, null)).error);
  ok((await assign(t, a, 2, d, occupied)).error);
  expect(await current(t, a)).toMatchObject({ driver_id: d, vehicle_id: occupied });
});

test("ineligible resources are rejected and assigned availability changes are guarded", async () => {
  const t = await tenant(); const id = await load(t); const d = await resource(t, "drivers"); const v = await resource(t, "vehicles");
  ok((await assign(t, id, 1, d, v)).error);
  expect((await deactivate(t, "drivers", d)).error?.code).toBe("23514");
  expect((await deactivate(t, "vehicles", v)).error?.code).toBe("23514");
  for (const status of ["maintenance", "out_of_service"]) expect((await vehicleStatus(t, v, status)).error?.code).toBe("23514");
  ok((await assign(t, id, 2, null, null)).error);
  ok((await deactivate(t, "drivers", d)).error); ok((await deactivate(t, "vehicles", v)).error);
  expect((await assign(t, id, 3, d, null)).error?.code).toBe("22023");
  expect((await assign(t, id, 3, null, v)).error?.code).toBe("22023");
  for (const status of ["maintenance", "out_of_service"]) {
    const vehicle = await resource(t, "vehicles"); ok((await vehicleStatus(t, vehicle, status)).error);
    expect((await assign(t, id, 3, null, vehicle)).error?.code).toBe("22023");
  }
});

test("availability races cannot leave an assigned inactive or maintenance resource", async () => {
  const t = await tenant();
  for (const kind of ["drivers", "vehicles"] as const) {
    for (let i = 0; i < 4; i++) {
      const id = await load(t); const r = await resource(t, kind);
      const results = await Promise.all([assign(t, id, 1, kind === "drivers" ? r : null, kind === "vehicles" ? r : null),
        kind === "drivers" ? deactivate(t, kind, r) : vehicleStatus(t, r, "maintenance")]);
      expect(results.filter(x => !x.error)).toHaveLength(1);
      const row = (await t.client.from(kind).select("*").eq("id", r).single()).data!;
      if (await current(t, id)) { expect(row.active).toBe(true); if (kind === "vehicles") expect(row.operating_status).toBe("in_service"); }
      expect(results.some(x => x.error?.code === "40P01")).toBe(false);
    }
  }
});

test("load edit and Ready races share the load-version boundary", async () => {
  const t = await tenant();
  for (const action of ["edit", "ready"]) {
    const id = await load(t); const d = await resource(t, "drivers");
    const results = await Promise.all([assign(t, id, 1, d, null), t.client.rpc("tms_save_load", {
      p_company: t.company, p_request: randomUUID(), p_action: action, p_load: id, p_version: 1, p_data: action === "edit" ? details() : null })]);
    expect(results.filter(x => !x.error)).toHaveLength(1);
    expect(results.filter(x => x.error).map(x => x.error!.code)).toEqual(["40001"]);
  }
});

test("simultaneous different assignments to one load cannot overwrite each other", async () => {
  const t = await tenant(); const id = await load(t); const first = await resource(t, "drivers"); const second = await resource(t, "drivers");
  const results = await Promise.all([assign(t, id, 1, first, null), assign(t, id, 1, second, null)]);
  expect(results.filter(r => !r.error)).toHaveLength(1);
  expect(results.filter(r => r.error).map(r => r.error!.code)).toEqual(["40001"]);
  expect([first, second]).toContain((await current(t, id))?.driver_id);
});

test("disabled user or company cannot mutate reservations or obtain duplicate receipts", async () => {
  for (const scope of ["users", "companies"]) {
    const t = await tenant(); const id = await load(t); const d = await resource(t, "drivers"); const request = randomUUID();
    ok((await assign(t, id, 1, d, null, request)).error);
    ok((await admin.from(scope).update(scope === "users" ? { disabled_at: new Date().toISOString() } : { active: false })
      .eq("id", scope === "users" ? t.actor : t.company)).error);
    expect((await assign(t, id, 1, d, null, request)).error?.code).toBe("42501");
    expect((await assign(t, id, 2, null, null)).error?.code).toBe("42501");
    expect((await admin.from("load_assignments").select("driver_id").eq("company_id", t.company).eq("load_id", id).single()).data?.driver_id).toBe(d);
    expect((await admin.from("load_assignment_events").select("version").eq("company_id", t.company).eq("load_id", id)).data).toHaveLength(1);
  }
});

test("composite foreign keys reject mixed-company records even through privileged fixture access", async () => {
  const a = await tenant(); const b = await tenant(); const id = await load(a); const foreignLoad = await load(b);
  const d = await resource(b, "drivers"); const v = await resource(b, "vehicles");
  for (const values of [{ driver_id: d }, { vehicle_id: v }, { load_id: foreignLoad }, { updated_by: b.actor }]) {
    const result = await admin.from("load_assignments").insert({ company_id: a.company, load_id: id, updated_by: a.actor, ...values });
    expect(result.error?.code).toBe("23503");
  }
  expect(await current(a, id)).toBeNull();
});

test("company isolation, forged identifiers, viewer and anonymous denial", async () => {
  const a = await tenant(); const b = await tenant(); const own = await load(a); const foreign = await load(b);
  const d = await resource(b, "drivers"); const v = await resource(b, "vehicles");
  ok((await assign(b, foreign, 1, d, v)).error);
  expect((await assign(a, foreign, 1, null, null)).error?.code).toBe("40001");
  expect((await assign(a, own, 1, d, null)).error?.code).toBe("22023");
  expect((await assign(a, own, 1, null, v)).error?.code).toBe("22023");
  for (const table of ["load_assignments", "load_assignment_events"]) {
    const r = await a.client.from(table).select("*").eq("company_id", b.company); ok(r.error); expect(r.data).toEqual([]);
  }
  const args = { p_company: b.company, p_load: foreign, p_version: 2, p_request: randomUUID(), p_driver: null, p_vehicle: null };
  expect((await a.client.rpc("tms_set_load_assignment", args)).error?.code).toBe("42501");
  expect((await anonymous.rpc("tms_set_load_assignment", args)).error).not.toBeNull();
  ok((await admin.from("memberships").update({ role: "viewer" }).eq("company_id", a.company)).error);
  expect((await assign(a, own, 1, null, null)).error?.code).toBe("42501");
});

test("no direct writes, private receipts or unguarded roster RPC bypass", async () => {
  const t = await tenant(); const id = await load(t); const d = await resource(t, "drivers");
  ok((await assign(t, id, 1, d, null)).error);
  for (const client of [t.client, anonymous]) {
    for (const table of ["load_assignments", "load_assignment_events", "assignment_requests"]) {
      expect((await client.from(table).insert({ company_id: t.company, load_id: id })).error).not.toBeNull();
      expect((await client.from(table).update({ load_id: id }).eq("company_id", t.company)).error).not.toBeNull();
      expect((await client.from(table).delete().eq("company_id", t.company)).error).not.toBeNull();
    }
    expect((await client.rpc("tms_save_roster_unreserved", { p_company: t.company, p_kind: "drivers", p_action: "deactivate", p_id: d, p_version: 1, p_data: null })).error).not.toBeNull();
    expect((await client.from("assignment_requests").select("*")).error).not.toBeNull();
  }
  expect(await current(t, id)).toMatchObject({ driver_id: d });
});

function sql(statement: string) {
  const db = process.env.TMS_TEST_DB_URL;
  if (!db || new URL(db).hostname !== "127.0.0.1" || new URL(db).port !== "54322" || process.env.TMS_DISPOSABLE_CI !== "1") {
    throw new Error("Explicit disposable CI database required for fault injection");
  }
  // PGDATABASE is a database name, not a URI. Keep credentials out of arguments
  // and output; pass explicit libpq connection variables to this fixture only.
  const connection = new URL(db);
  const sqlEnv = { ...process.env, PGHOST: connection.hostname, PGPORT: connection.port,
    PGDATABASE: decodeURIComponent(connection.pathname.slice(1)),
    PGUSER: decodeURIComponent(connection.username), PGPASSWORD: decodeURIComponent(connection.password) };
  try { return execFileSync("psql", ["-X", "-v", "ON_ERROR_STOP=1", "-At"], { input: statement, encoding: "utf8", env: sqlEnv, stdio: ["pipe", "pipe", "pipe"] }).trim(); }
  catch { throw new Error("Disposable SQL verification failed (upstream output redacted)"); }
}

test("event insertion failure rolls back assignment, version, audit and receipt", async () => {
  const t = await tenant(); const id = await load(t); const d = await resource(t, "drivers"); const replacement = await resource(t, "drivers");
  ok((await assign(t, id, 1, d, null)).error);
  const request = randomUUID();
  sql(`create function public.assignment_test_failure() returns trigger language plpgsql as $$ begin if new.company_id = '${t.company}'::uuid then raise exception 'Synthetic event failure'; end if; return new; end $$;
    create trigger assignment_test_failure before insert on public.load_assignment_events for each row execute function public.assignment_test_failure();`);
  try {
    expect((await assign(t, id, 2, replacement, null, request)).error).not.toBeNull();
    expect(await current(t, id)).toMatchObject({ driver_id: d });
    expect(sql(`select version from public.loads where company_id='${t.company}' and id='${id}'`)).toBe("2");
    expect(sql(`select count(*) from public.audit_logs where company_id='${t.company}' and load_id='${id}'`)).toBe("2");
    expect(sql(`select count(*) from public.assignment_requests where company_id='${t.company}' and request_id='${request}'`)).toBe("0");
  } finally { sql("drop trigger assignment_test_failure on public.load_assignment_events; drop function public.assignment_test_failure();"); }
  ok((await assign(t, id, 2, replacement, null, request)).error);
});

test("catalog security verifies RLS, restricted ownership and grants", async () => {
  expect(sql(`select count(*) from pg_class where oid in ('public.load_assignments'::regclass,'public.load_assignment_events'::regclass,'public.assignment_requests'::regclass) and relrowsecurity`)).toBe("3");
  expect(sql(`select count(*) from pg_roles where rolname in ('tms_dispatch_executor','tms_roster_executor') and not rolcanlogin and not rolbypassrls and not rolsuper`)).toBe("2");
  expect(sql(`select pg_get_userbyid(proowner) from pg_proc where oid='public.tms_set_load_assignment(uuid,uuid,integer,uuid,uuid,uuid)'::regprocedure`)).toBe("tms_dispatch_executor");
  expect(sql(`select has_function_privilege('authenticated','public.tms_save_roster_unreserved(uuid,text,text,uuid,integer,jsonb)','EXECUTE')`)).toBe("f");
  expect(sql(`select count(*) from pg_proc where oid in ('public.tms_set_load_assignment(uuid,uuid,integer,uuid,uuid,uuid)'::regprocedure,'public.tms_save_roster(uuid,text,text,uuid,integer,jsonb)'::regprocedure) and prosecdef and 'search_path=""'=any(proconfig)`)).toBe("2");
});
