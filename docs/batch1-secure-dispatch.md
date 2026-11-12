# Batch 1 secure dispatch

The development branch begins at audited commit fa3ab36ee54662c4509699cc5db0d40f428c121b. The real dispatch application starts at /dispatch. /shipments redirects to the protected workflow. The previous tracking display remains at /demo/shipments with a demonstration label. Existing source history and other prototype feature files are retained.

## Disposable setup

1. Use Node 22.22.3 and Docker in an isolated environment. Run npm ci and npx supabase start. The checked-in local configuration disables public signup and applies the migrations on a clean database.
2. Configure SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY from local Supabase status. The application needs only the publishable key. Copy the variable names from .env.example. Never provide a service credential to the app, a browser, a NEXT_PUBLIC variable, or a live preview.
3. For manual testing, use the disposable Supabase Auth admin UI or Admin API to create a confirmed synthetic user. In the same local database create a companies row, a users row with that Auth ID, and a memberships row for the company and user with role dispatcher. Visit /sign-in.
4. Run npm run lint, npm run typecheck, npm run build, and npm audit --audit-level=high. For automated integration, install Chromium using npx playwright install chromium. Set TMS_TEST_SUPABASE_SERVICE_KEY for the local Node test process only, then run npx playwright test. The suite refuses a non-loopback Supabase URL and creates synthetic data. It launches and restarts a production-mode Next.js process on port 3000. Start it on an unused port 3000 in a fresh runner.

## Data and access

The migration creates companies, Auth-linked user profiles, memberships, loads, load stops, shipment events, audit logs, idempotency records and tenant load-number counters. Operational relations use composite company keys. Authenticated users have scoped reads through RLS and no direct table mutations. The dispatch RPC verifies dispatcher membership and executes with a dedicated no-login role subject to RLS. Load creation and editing, Draft → Ready, idempotency and audit writes share one transaction. Appointments are entered in Eastern Time, rejected when ambiguous, and stored as absolute timestamps. A version mismatch requires reopening the load. Request-key reuse with a changed payload fails.

The existing prototype worker is retired so it cannot cache private data. Auth and dispatch responses use private no-store directives. The original worker is preserved under legacy/pwa. Production TLS, operational MFA, backup/restore drills, private diagnostic route controls and real user provisioning are deployment gates outside this development batch. Treat remaining demo screens as synthetic. A physical mobile device and old installed browser worker require a separate manual check.

## Rollback

Stop using the development branch or stop the local app first. The verified baseline is available by its commit SHA, but it is vulnerable and must stay isolated. To back out branch code after a review, use a forward revert on the development branch. Keep migration history and any retained data. For a disposable environment, discard the whole test environment after preserving test evidence as needed. If this schema is ever applied to a persistent database, disable writes, take a recovery snapshot, and restore or validate a forward correction in isolation before resuming. Avoid dropping tables or replaying the migration against production as a rollback.

## Lint scope

The production build and type check compile active routes. Historical copies and backups are retained. The lint configuration leaves specific pre-existing prototype issues as warnings, including existing React effects and inline components, HTML anchors and unused variables. Dispatch and sign-in code use the normal lint rules. See the verification run for actual counts and results.
