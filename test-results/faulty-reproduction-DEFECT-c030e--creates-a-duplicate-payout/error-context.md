# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: faulty-reproduction.spec.ts >> DEFECT REPRODUCTION - retry incorrectly creates a duplicate payout
- Location: tests\faulty-reproduction.spec.ts:5:5

# Error details

```
Error: expect(received).toHaveLength(expected)

Expected length: 1
Received length: 2
Received array:  [{"credits": 30, "id": "PAY-1", "settlementId": "SETTLEMENT-2026-W45", "userId": "user-100"}, {"credits": 30, "id": "PAY-2", "settlementId": "SETTLEMENT-2026-W45", "userId": "user-100"}]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import { FaultyRewardsService } from "../src/faulty-rewards-service";
  3  | import { PERIOD, USER, tasks } from "./fixtures";
  4  | 
  5  | test("DEFECT REPRODUCTION - retry incorrectly creates a duplicate payout", async () => {
  6  |   const service = new FaultyRewardsService();
  7  |   await service.settle(PERIOD, tasks, USER);
  8  |   await service.settle(PERIOD, tasks, USER);
  9  | 
  10 |   // This assertion represents the business requirement.
  11 |   // It is expected to FAIL against the faulty implementation (2 payouts instead of 1).
> 12 |   expect(service.payouts).toHaveLength(1);
     |                           ^ Error: expect(received).toHaveLength(expected)
  13 | });
  14 | 
```