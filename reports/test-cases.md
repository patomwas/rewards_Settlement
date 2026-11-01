# Test Cases and Expected Results

**Environment:** Local Node.js/TypeScript reference implementation  
**Currency/value:** Test credits only; no real financial processing  
**Settlement period:** `[2026-11-02T00:00:00Z, 2026-11-09T00:00:00Z)`  
**Reward:** 10 credits per unique qualifying task

| ID | Scenario / input | Expected result | Automated check |
|---|---|---|---|
| TC01 | Three unique completed tasks inside the period | One payout for 30 credits | `TC01` |
| TC02 | Task timestamp equals period start | Task qualifies; 10 credits | `TC02` |
| TC03 | Task timestamp equals period end | Task is excluded; no payout | `TC03` |
| TC04 | `2026-11-09T02:59:59+03:00` EAT | Converts to `2026-11-08T23:59:59Z`; qualifies | `TC04` |
| TC05 | Same task ID delivered twice | Count once; 10 credits | `TC05` |
| TC06 | Same user/period settlement submitted twice | One payout total; retry creates no additional payout | `TC06` |
| TC07 | Payout succeeds; notification delivery fails | Payout remains recorded; notification marked failed | `TC07` |
| TC08 | Payout operation fails | No payout recorded and no success notification | `TC08` |

## Execution results

Populate this table with actual command output before submission.

| Check | Expected result | Actual result |
|---|---|---|
| Faulty reproduction | Fails the one-payout assertion because two payouts are created | **Observed:** expected length 1, received length 2; two payouts of 30 credits each were recorded |
| Corrected regression suite | 8 tests pass | **Observed:** 8 passed, 0 failed, 630 ms |
| Combined run before suite separation | 8 regression tests pass; intentional reproduction fails | **Observed:** 8 passed, 1 intentional failure |


## Additional exploratory checks recommended
- Retry after process restart using a persistent idempotency record.
- Two concurrent settlement requests for the same user and period.
- Same task ID submitted with conflicting user IDs or completion timestamps.
- Empty settlement period.
- Cancelled task inside the period.
- Invalid or missing timestamp.
- Duplicate settlement request after notification retry.
- Database failure between payout persistence and idempotency-record persistence.

These additional checks are not claimed as implemented in the supplied minimal fixture.
