# Execution Evidence Record

**Project:** Rewards Settlement QA  
**Environment:** Windows PowerShell, Node.js/npm local environment  
**Evidence source:** Actual terminal output supplied by the assessor during the assessment build  
**Execution date:** Record the actual date of your local run before submission.

## 1. Dependency installation

Command:
```powershell
npm install
```

Observed:
```text
added 6 packages, and audited 7 packages
found 0 vulnerabilities
```

## 2. Faulty implementation reproduction

Command:
```powershell
npm run test:faulty
```

Observed result:
```text
1 failed

Expected length: 1
Received length: 2

Received array:
PAY-1, settlement SETTLEMENT-2026-W45, user user-100, credits 30
PAY-2, settlement SETTLEMENT-2026-W45, user user-100, credits 30
```

Interpretation: the same user and settlement period produced two payouts of 30 credits each. This is the expected failing result for the intentionally faulty implementation and confirms the defect in the local fixture.

## 3. Corrected regression suite

Command:
```powershell
npm test
```

Observed result:
```text
Running 8 tests using 1 worker

8 passed (630ms)
```

All eight regression scenarios passed:
- TC01 happy path
- TC02 inclusive start boundary
- TC03 exclusive end boundary
- TC04 EAT-to-UTC conversion
- TC05 duplicate task ID
- TC06 retry idempotency in the corrected in-memory implementation
- TC07 notification failure isolation
- TC08 payout failure and no success notification

## 4. Submission evidence still to capture

The terminal output was shared in the assessment conversation. Before final submission, save your own evidence files from your machine:
- Screenshot or text capture of the `npm run test:faulty` failure.
- Screenshot or text capture of the `npm test` result showing 8 passed.
- Playwright HTML report, generated with `npx playwright show-report` (or attach/export the report folder).
- Loom recording, no longer than five minutes.

Do not describe the intentional reproduction failure as a failed corrected regression suite. Report it separately as the successful reproduction of the defect.

## 5. Verification limitations

The passing tests verify the supplied in-memory reference implementation. They do not verify:
- Database uniqueness constraints.
- Atomic payout and idempotency-record persistence.
- Two truly concurrent requests.
- Retry after process restart.
- Real notification delivery or payment processing.

These remain production release gates and must not be represented as completed tests.
