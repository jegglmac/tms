# Consolidated Batch 2B-2 / verification preparation

Builds on the locked local 6de1aec and remote df17b169 assignment foundation.
No migration, RLS or database function changes. No automatic write retries.

Load details now read company-scoped, paginated roster/reservation/history data.
Unavailable resources are labelled and disabled; PostgreSQL remains authoritative
when a selection becomes unavailable after rendering. Current assignments, release
via Unassigned, atomic pair replacement and versioned history use the accepted RPC.
Names in history are explicitly identified as current roster labels, not historical
snapshots. Queries fail visibly on database errors, including absent tables.

The save action authorizes before making the RPC, validates UUIDs and expected version,
and distinguishes stale edits, conflicting reservations, ineligible selections and
unconfirmed writes. Only a validated RPC result redirects to refreshed server data.
Forms have identity/version keys, disabled pending controls and accessible error alerts.

CI extracts the accepted Batch 2A source into a runner-temporary directory and builds
it independently for pre-assignment schema checks. Existing fingerprints remain in
place. Only after the assignment migration is applied does the current code's full
suite execute. The reporter separates nested polling/expectation attempts from outer
expectation results; nested error counts are not failed tests.

## Bounded owner manual checklist (about 15 minutes)

Use an expressly authorized disposable environment with synthetic records only.
This checklist does not authorize applying migrations to retained Windows databases.

1. Sign in as Company A dispatcher. Open a Draft load. Confirm Unassigned defaults.
2. Select an active driver and active in-service vehicle. Save once. Confirm current
   labels, enabled Save button, and one history event. Reload to confirm persistence.
3. In a separate mobile session (390px or Android), open the same load. Confirm both
   selections. Replace the driver; desktop reload must show the replacement.
4. Select Unassigned for both and save. Confirm release and preserved history.
5. Assign that pair to another load. The first load must show them unavailable.
   Inactive drivers and inactive/maintenance/out-of-service vehicles must be disabled.
6. Keep two sessions on one load. Save a change in one; save the stale form in the
   other. Expect a reload-required message and no overwritten reservation.
7. Repeat with a Ready load. Assignments remain optional and status stays Ready.
8. Sign in as Company B. Company A load URLs must be denied; A resources/history
   must not appear. Sign out and verify protected access is denied.
9. In a disposable service-failure exercise, failed writes must show an unconfirmed
   message, never a success. Read back before any explicit resubmission; no auto retry.
10. Check mobile controls, history wrapping and absence of horizontal overflow.

Automated fault injection/concurrency tests supplement this bounded checklist.

## Rollback and risks

No retained database has been changed. Reverting interface and workflow changes to
the accepted foundation preserves assignment records and reservations; it removes
their UI, so operator release requires a reviewed authorized path. Do not drop tables
or unwind migrations. Existing deploy suppression must remain in place during review.

Carry forward unresolved ECONNRESET, unverified ownership/ACL restore, existing lint
warnings and moderate development-dependency findings. Full visual redesign, calendar
scheduling, emergency availability, automatic release, GPS and new lifecycle statuses
are outside this batch. Native selects page in all company resources for correctness;
very large rosters may need server-side search in a later usability batch.
