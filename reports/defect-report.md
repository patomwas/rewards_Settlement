# Defect Report: Duplicate Payout on Settlement Retry

**Defect ID:** RWD-PAY-001  
**Title:** Repeated settlement request creates a second payout for the same user and period  
**Severity:** Critical (proposed)  
**Priority:** High (proposed)  
**Environment:** Local fictional rewards-service fixture  
**Status:** Reproduced in intentionally faulty reference implementation; corrected in local reference implementation

## Preconditions
- A user has at least one completed qualifying task.
- A settlement period is configured.
- The settlement service is available.
- The same user and settlement period can be submitted more than once.

## Steps to reproduce
1. Start with an empty payout store.
2. Submit settlement `SETTLEMENT-2026-W45` for user `user-100`.
3. Confirm that the service creates a payout for the qualifying tasks.
4. Submit the exact same settlement request again, simulating a retry after an uncertain response.
5. Inspect the payout store and total credits.

## Expected result
The service recognizes that the user/period has already been paid. The retry creates no additional payout and the total paid credits remain unchanged.

## Actual result
The faulty reference implementation creates a second payout for the same user and settlement period. The payout count becomes two.

## Severity rationale
If this behaviour existed in a live rewards or financial workflow, it could over-credit users, distort balances and reconciliation, and require manual correction. Severity is proposed based on potential business impact, not on a claim of a real production incident.

## Root-cause hypothesis
The faulty implementation processes each request as a new settlement and does not enforce an idempotency key or unique business constraint for the user/settlement-period pair. A timeout or retry can therefore repeat the side effect.

## Proposed correction
- Define a stable idempotency key, for example `settlementId:userId`.
- Enforce uniqueness at the persistence layer, not only in application memory.
- Make payout creation and recording of the idempotency outcome atomic in a database transaction.
- On retry, return or recognize the existing payout instead of creating another.
- Keep notification delivery downstream and independently retryable; notification failure must not roll back the payout.

## Evidence to attach
- Terminal output from `npm run test:faulty` showing the expected failing assertion.
- Terminal output from `npm test` showing the corrected regression suite passing.
- Relevant source files and Playwright HTML report.
- Loom recording showing reproduction, fix and final run.

## Release checks that should block this defect
1. Idempotency regression test for repeated user/period settlement.
2. Database uniqueness constraint and transaction test.
3. Retry-after-timeout integration test.
4. Concurrent duplicate-request test.
5. Payout/notification failure-isolation tests.
6. Reconciliation check comparing eligible credits with recorded payouts.
7. CI gate requiring all settlement regression tests to pass.
