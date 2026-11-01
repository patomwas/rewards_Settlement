# Rewards Settlement QA Regression Suite

A small, local-only TypeScript and Playwright assessment project demonstrating a duplicate-payout defect caused by settlement retries.

## Requirements
- Node.js 20 or later
- npm

## Install
```bash
npm install
```

## Reproduce the defect (expected to fail)
```bash
npm run test:faulty
```
The test asserts the business rule of one payout per user/settlement period. The intentionally faulty implementation creates two payouts on retry, so this test should fail. A failing result here is deliberate evidence of the reproduced defect.

## Run the corrected regression suite
```bash
npm test
```
The corrected reference implementation should pass all eight tests.

## Reports
- `intent.md`
- `directive.md`
- `reports/test-cases.md`
- `reports/execution-evidence.md`
- `reports/defect-report.md`
- `reports/release-readiness.md`

## Important limitations
This is an in-memory reference fixture, not a production payment system. It does not prove database durability, atomic transactions, distributed locking, concurrent request safety, restart behaviour or real notification delivery. Those are explicit release gaps.
