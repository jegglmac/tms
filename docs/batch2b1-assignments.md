# Batch 2B-1 database foundation — local, unverified draft

Baseline: cb2c3636ec150d931cc94d852154723824d82ed3.
Branch: tms-pro-batch2b1-assignments. No assignment UI (Batch 2B-2).

## Contract

`tms_set_load_assignment(p_company, p_load, p_version, p_request, p_driver, p_vehicle)`
returns `{load_id, version, changed}`. Both resource arguments must be supplied;
null explicitly releases a reservation. Either resource may be reserved separately.
Draft and Ready allow assignments but do not require them. A driver must be active;
a vehicle must be active and in_service. Reservations are exclusive until explicit
release, regardless of appointment dates. Reassigning both resources is atomic.

Unchanged commands require the current version, return changed=false and store a
receipt without touching the load, reservation, or audit history. Duplicate commands
with the same actor/company/request ID and identical payload return the original
receipt (which is not a promise that the load still has that historical version).
Reused request IDs with different payloads fail. Every call verifies authorization,
including duplicate requests after revocation. No automatic write retries are added.
After an uncertain response, read current records before any explicit user retry.

Assignment events contain resource IDs, actor, request, time and shared load version;
they do not snapshot names, email addresses, phone numbers or raw form values.
General audit_logs receives an assignment event in the same transaction. Existing
shipment_events remains exclusively status history.

## Database security and locking

All new tables have RLS, company-scoped keys and composite foreign keys. Authenticated
clients have SELECT only on reservations/events and no access to internal receipts.
The assignment function belongs to the existing NOLOGIN/NOBYPASSRLS dispatch executor;
the roster wrapper belongs to the existing restricted roster executor. Both have an
empty search_path and explicit dispatcher checks. No client table writes are added.

Assignment and roster commands acquire the same two-integer transaction advisory
lock `(20261114, hashtext(company_id))` before any row lock. A hash collision only
serializes unrelated companies; it does not mix their data. Assignment then locks
the load row and acquires unique-index reservations. Roster commands never acquire
load locks. The accepted load RPC acquires its bigint request lock and then load
row locks; it never waits for the company lock. The advisory lock namespaces are
separate. Consequently these paths do not create an inverse lock acquisition cycle.
All waits still depend on database transaction completion; no new application timeout
or retry is introduced. Company-wide serialization trades throughput for simplicity.

The accepted roster function is renamed to an executor-only delegate with client
EXECUTE revoked. Its public signature is retained by a guarded wrapper. Availability
changes on reserved resources fail; ordinary contact edits still work. Internal
function exposure in PostgREST does not grant permission to call it. Tests explicitly
attempt that bypass. Trusted service-role/DB-owner maintenance remains privileged;
never use those credentials in the application.

## Compatibility and migration verification

Only new migration 20261114000100_load_assignments.sql is added. Existing migrations
remain byte-for-byte unchanged. No existing rows are backfilled or assigned. Audit
action validation is extended without changing existing audit records. Existing
loads retain versions and status. Roster RPC signature remains unchanged.

CI stages withhold the new migration, run accepted migration and regression checks,
fingerprint loads/stops/history/audit/drivers/vehicles/roster-events, then apply the
new migration and compare fingerprints. The full suite runs after migration, followed
by a disposable PostgreSQL restart and persistence fingerprint comparison. SQL fault
injection requires explicit CI opt-in and the exact loopback database endpoint.
Database credentials are removed from the spawned Next process environment.

## Deployment gate — must be resolved before first push

vercel.json suppresses Git deployments for this exact branch only. This has NOT been
verified against project settings. Owner must inspect BOTH tms and tms-6axy:

1. Open each project in Vercel, Settings > Git: confirm connected repo jegglmac/tms.
2. Settings > Build and Deployment > Root Directory: record the value; repository
   root is required for this root-level vercel.json. Do not change it.
3. Settings > Environments > Production > Branch Tracking: record the branch and
   verify it is not tms-pro-batch2b1-assignments. Inspect custom environment branch
   tracking if present. Do not change settings.
4. Identify any alternative configuration path or external deployment automation.
   Root config suppression covers automatic Git integration, not CLI/manual deploys.
5. Provide the non-secret settings values or redacted screenshots. Do not share
   environment values, deploy-hook URLs, API tokens, cookies or credentials.

If either project reads a different configuration or any bypass is unresolved,
STOP. Do not test suppression by pushing, disconnect projects, or change global
settings. Owner authorization is conditional; no push is allowed until verified.

## Rollback and limitations

No retained environment migration is authorized. Before pushing: local branch can
be abandoned; accepted baseline and Windows records are untouched. CI uses disposable
runner-local infrastructure and always stops Supabase without preserving a backup.
Do not run that cleanup against the owner's Windows project.

Once a future retained environment has assignment data, do not blindly run a down
migration or old application rollback: reservations/availability guards remain in
force. Use a reviewed forward repair or verified full recovery with roles/grants/RLS.
Original ownership and ACL recovery remains unverified. No backup certification is
claimed here.

Emergency vehicle-unavailability workflows (including atomic release-and-mark-down),
calendar scheduling, travel feasibility, completion/cancellation release, driver/vehicle
pairing, multi-driver loads and UI are deferred. In this batch, explicitly release or
reassign before marking a reserved resource unavailable.

The original approximately 30-second ECONNRESET remains unresolved and was not
reproduced in the latest controlled Windows tests. Experimental a391640 is neither
included nor enabled. No production deployment, merge or existing PR update is allowed.

Acceptance requires actual disposable database/browser results; static review or
test discovery does not constitute passing integration verification.

## Recovery checkpoint and actual verification — November 14, 2026

The interrupted session left all implementation files uncommitted on the intended
local branch at the protected baseline. Recovery preserved that work. No migration
has been executed and no branch has been pushed. The following results were observed
in the preceding implementation session and are retained, not represented as reruns:

| Check | Observed result |
| --- | --- |
| Local install | npm ci --ignore-scripts completed; 447 packages added. CI still requires normal npm ci. |
| TypeScript | Final npm run typecheck completed without errors after installation. An earlier attempt during incomplete installation failed; it is superseded. |
| ESLint | 0 errors, 265 existing warnings. |
| Dependency audit | 8 moderate development-dependency findings; runtime audit: 0 vulnerabilities. No dependency changes made. |
| Production build | FAILED: compiled and completed TypeScript, then EPERM creating analytics prerender output under .next. No passing build claimed. |
| Test discovery | 31 tests discovered: 17 assignments + 14 accepted regressions. No integration tests or integration assertions executed. |
| Workflow | YAML parsed successfully; exact branch trigger and local Vercel suppression key verified. |
| Accepted migrations | No content changes; protected dependencies and tsconfig also unchanged. |

Next.js automatically adjusted jsx in tsconfig during its attempted build; that
generated source change was reverted before checkpointing to preserve the baseline.
No framework workaround was introduced for the Windows filesystem build failure.

During recovery, opening the Vercel project settings redirected to the sign-in page.
The effective root/configuration and branch settings for BOTH projects remain
unverified. Owner access is needed using the read-only instructions above. No global
settings, deployments, PRs, retained data, or database recovery operations were changed.

Status: BLOCKED for acceptance and remote push pending the deployment gate and actual
runner-local integration/build verification. This local checkpoint preserves authored
work; it is not a verified implementation release. No Batch 2B-2 or 2B-3 work is included.
