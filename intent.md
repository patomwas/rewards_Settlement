# Assessment Intent: Rewards Settlement Retry / Duplicate Payout

## Objective
Identify and prevent a high-impact duplicate-payout defect in a fictional rewards settlement service. The assessment uses a local, in-memory reference implementation only; it does not connect to a live financial system.

## Why this problem was selected
A retry can occur after a timeout or an uncertain response. If the service does not make settlement processing idempotent, the same user and settlement period can produce more than one payout. This can over-credit a user and make balances and reconciliation records inaccurate.

This scenario is suitable for a focused QA assessment because it has:
- A clear business invariant: one successful payout per user per settlement period.
- A deterministic reproduction.
- Observable evidence: payout count and credit balance.
- A testable correction: idempotency protection.
- Relevant failure modes involving retries and downstream notifications.

## Alternatives considered and prioritization
Scores below are reasoned assessment estimates, not measured production incident data. Impact and likelihood are scored 1 (low) to 5 (high); effort is scored 1 (low) to 5 (high).

| Candidate | Impact | Likelihood | Effort | Rationale |
|---|---:|---:|---:|---|
| Duplicate payout after retry | 5 | 3 | 3 | Directly creates an incorrect credit balance; retries are a normal distributed-system behaviour. |
| Incorrect settlement cut-off/timezone handling | 4 | 3 | 2 | Can include or exclude tasks incorrectly, especially around UTC/local-time boundaries. |
| Notification failure reverses payout | 4 | 2 | 3 | Can create confusing user experience and inconsistent business state if side effects are coupled. |

The duplicate-payout issue is selected because its impact is highest and the invariant can be demonstrated clearly in a small, reproducible fixture. Likelihood remains an estimate because no live incident history was supplied. The implementation and tests will establish the defect in the deliberately faulty sample, not claim it occurred in a real service.

## Scope
In scope:
- One fictional user and one settlement period.
- Completed tasks worth 10 credits each.
- Inclusive lower time boundary and exclusive upper boundary.
- Deduplication by task ID.
- Retry/idempotency behaviour.
- Payout and notification failure separation.
- Automated checks and a local regression demonstration.

Out of scope:
- Real money, bank integrations, payment gateways or live customer data.
- Authentication, authorization, fraud detection, tax, currency conversion and multi-currency accounting.
- Distributed locking or database transaction guarantees in a production database.
- Admin changes during an active settlement unless explicitly added as a later test.

## Assumptions
1. Only tasks with status `COMPLETED` qualify.
2. Each task belongs to one user and earns 10 credits.
3. The settlement period is represented in UTC.
4. The start timestamp is inclusive; the end timestamp is exclusive.
5. A task ID is unique within the business domain; duplicate delivery of the same ID must not increase credits.
6. A successful payout is final for that user and settlement period.
7. A retry after an uncertain response must return or recognize the existing successful outcome rather than create a second payout.
8. Notification delivery is downstream. A notification failure must not undo a successful payout.
9. A payout failure must not trigger a success notification.
10. Account status and administrator reward-setting changes are held constant during each test. A production system would need an explicit policy for changes during an open settlement period.

## Success criteria
- The faulty implementation produces two payouts when the same settlement is retried.
- The corrected implementation produces only one payout.
- All eight core regression tests pass against the corrected implementation.
- The defect report, test results, limitations and release decision are documented.
