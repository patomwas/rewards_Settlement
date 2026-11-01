# Loom Demonstration Script (maximum 5 minutes)

## 0:00–0:35 — Introduction
"Hello. This assessment demonstrates how I investigated and prevented a duplicate-payout defect in a fictional rewards settlement service. The project is local-only and uses test credits; it does not connect to a live financial system."

## 0:35–1:10 — Business rule and impact
"The core rule is one successful payout per user and settlement period. Each unique completed task earns 10 credits. A retry must not create another payout. Duplicate payouts can over-credit users and make reconciliation inaccurate."

## 1:10–2:00 — Reproduce the defect
"Here is the intentionally faulty implementation. It processes the same settlement request twice without an idempotency check. I will run the focused reproduction test."
Run: `npm run test:faulty`
Show the failing assertion and explain that two payouts were created where one was expected.

## 2:00–3:15 — Explain the correction and tests
"The corrected reference implementation uses a settlement-and-user idempotency key. It also keeps notification delivery separate from payout success. The suite covers the happy path, inclusive start, exclusive end, EAT-to-UTC conversion, duplicate task input, retry, notification failure and payout failure."
Show `src/rewards-service.ts` and the test names.

## 3:15–4:15 — Run regression suite
Run: `npm test`
Show the actual passing test output and the Playwright report. Do not claim a pass unless the command completes successfully.

## 4:15–5:00 — Readiness and handoff
"The local regression suite verifies the defined rules, but this is not production-ready. Durable database uniqueness, atomic writes, concurrent retries, restart behaviour and reconciliation remain release gates. The handoff includes the intent, directive, test cases, defect report and release checklist."
