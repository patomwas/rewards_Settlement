# Final Directive: Rewards Settlement Idempotency Regression Assessment

## Objective
Reproduce and prevent duplicate rewards payouts caused by repeated settlement requests. Establish explicit settlement rules, implement a minimal local fixture, automate regression checks, document the defect and provide a release-readiness decision.

## Scope
Use only the fictional local rewards service in this repository. Do not connect to a live financial system or use real customer information.

## Business requirements
1. Settlement runs on Tuesday at 09:00 UTC.
2. The settlement window is the previous Monday 00:00 UTC through the following Monday 00:00 UTC.
3. The lower boundary is inclusive; the upper boundary is exclusive.
4. Each unique completed task earns 10 test credits.
5. A task ID is counted once.
6. A successful user/settlement-period payout must not be duplicated by retries.
7. A success notification is sent only after payout succeeds.
8. Notification failure must not reverse a successful payout.
9. Payout failure must not send a success notification.

## Deliverables
- `intent.md`: problem selection, prioritization, scope and assumptions.
- `src/`: faulty and corrected local service implementations.
- `tests/`: eight regression cases and a deliberate faulty-behaviour reproduction.
- `reports/test-cases.md`: scenarios, expected results and execution evidence.
- `reports/execution-evidence.md`: actual local run outcomes supplied during assessment development.
- `reports/defect-report.md`: reproduction, expected/actual, severity, root cause and proposed correction.
- `reports/release-readiness.md`: release gates, gaps and decision.
- Loom recording, maximum five minutes.

## Completion criteria
- The deliberate reproduction test fails against the faulty implementation for the expected reason.
- The corrected implementation passes all eight regression tests.
- Evidence is captured from actual test execution; no results are fabricated.
- The final handoff identifies limitations and does not claim production readiness without durable and concurrent idempotency validation.

## Run instructions
1. Install Node.js (LTS) and npm.
2. Run `npm install`.
3. Run `npx playwright install` if required by your environment. These tests exercise service logic and do not require a browser.
4. Run `npm run test:faulty` and capture the expected failure.
5. Run `npm test` and capture the passing regression suite.
6. Open the HTML report with `npm run test:report`.

## Results and handoff appendix
- Repository URL: **Add your public or reviewer-accessible repository URL**
- Faulty reproduction evidence: **Add link to terminal capture or CI run**
- Passing regression evidence: **Add link to terminal capture or CI run**
- Playwright report: **Add accessible report link or attach exported report**
- Loom video: **Add accessible Loom URL**
- Reviewer handoff: Start with `README.md`, then review `intent.md`, `reports/defect-report.md`, test source, execution results and release-readiness checklist.

## Final release position
The local corrected reference implementation is suitable as assessment evidence for the stated in-memory rules after execution is verified. It is not a production financial implementation. Production approval requires durable database-level idempotency, atomic writes, concurrency/restart testing and reconciliation controls.
