import { test, expect } from "@playwright/test";
import { RewardsService } from "../src/rewards-service";
import { PERIOD, USER, tasks } from "./fixtures";

test("TC01 - pays 10 credits for each qualifying completed task", async () => {
  const service = new RewardsService();
  const result = await service.settle(PERIOD, tasks, USER);
  expect(result.payout?.credits).toBe(30);
  expect(service.payouts).toHaveLength(1);
});

test("TC02 - includes a task exactly at the inclusive period start", async () => {
  const service = new RewardsService();
  const result = await service.settle(PERIOD, [tasks[0]], USER);
  expect(result.payout?.credits).toBe(10);
});

test("TC03 - excludes a task exactly at the exclusive period end", async () => {
  const service = new RewardsService();
  const result = await service.settle(PERIOD, [tasks[3]], USER);
  expect(result.payout).toBeNull();
  expect(service.payouts).toHaveLength(0);
});

test("TC04 - converts an EAT timestamp to UTC before applying the cut-off", async () => {
  const service = new RewardsService();
  // 2026-11-09 02:59:59 EAT equals 2026-11-08 23:59:59 UTC: included.
  const justBeforeEndInEAT = {
    id: "TASK-EAT-001",
    userId: USER,
    completedAt: "2026-11-09T02:59:59+03:00",
    status: "COMPLETED" as const
  };
  const result = await service.settle(PERIOD, [justBeforeEndInEAT], USER);
  expect(result.payout?.credits).toBe(10);
});

test("TC05 - counts a repeated task ID only once", async () => {
  const service = new RewardsService();
  const duplicatedInput = [tasks[0], { ...tasks[0] }];
  const result = await service.settle(PERIOD, duplicatedInput, USER);
  expect(result.payout?.credits).toBe(10);
});

test("TC06 - does not create a second payout when settlement is retried", async () => {
  const service = new RewardsService();
  await service.settle(PERIOD, tasks, USER);
  const retry = await service.settle(PERIOD, tasks, USER);
  expect(retry.payout).toBeNull();
  expect(service.payouts).toHaveLength(1);
  expect(service.payouts[0].credits).toBe(30);
});

test("TC07 - keeps a successful payout when notification delivery fails", async () => {
  const service = new RewardsService({ notificationShouldFail: true });
  const result = await service.settle(PERIOD, tasks, USER);
  expect(result.payout?.credits).toBe(30);
  expect(result.notificationSent).toBe(false);
  expect(service.payouts).toHaveLength(1);
});

test("TC08 - sends no notification and creates no payout when payout fails", async () => {
  const service = new RewardsService({ payoutShouldFail: true });
  await expect(service.settle(PERIOD, tasks, USER)).rejects.toThrow("PAYOUT_FAILED");
  expect(service.payouts).toHaveLength(0);
  expect(service.notifications).toHaveLength(0);
});
