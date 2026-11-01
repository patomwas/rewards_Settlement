import { test, expect } from "@playwright/test";
import { FaultyRewardsService } from "../src/faulty-rewards-service";
import { PERIOD, USER, tasks } from "./fixtures";

test("DEFECT REPRODUCTION - retry incorrectly creates a duplicate payout", async () => {
  const service = new FaultyRewardsService();
  await service.settle(PERIOD, tasks, USER);
  await service.settle(PERIOD, tasks, USER);

  // This assertion represents the business requirement.
  // It is expected to FAIL against the faulty implementation (2 payouts instead of 1).
  expect(service.payouts).toHaveLength(1);
});
