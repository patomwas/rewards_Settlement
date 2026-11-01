import { Payout, SettlementPeriod, SettlementResult, Task } from "./types";

/**
 * Intentionally faulty reference implementation for defect reproduction.
 * It has no idempotency protection: every retry creates another payout.
 */
export class FaultyRewardsService {
  readonly payouts: Payout[] = [];
  readonly notifications: string[] = [];

  async settle(period: SettlementPeriod, tasks: Task[], userId: string): Promise<SettlementResult> {
    const qualifying = new Map<string, Task>();
    for (const task of tasks) {
      const timestamp = Date.parse(task.completedAt);
      if (
        task.userId === userId &&
        task.status === "COMPLETED" &&
        timestamp >= Date.parse(period.startUtc) &&
        timestamp < Date.parse(period.endUtc)
      ) qualifying.set(task.id, task);
    }

    const credits = qualifying.size * 10;
    if (credits === 0) return { payout: null, notificationSent: false };

    const payout: Payout = {
      id: `PAY-${this.payouts.length + 1}`,
      settlementId: period.id,
      userId,
      credits
    };
    this.payouts.push(payout);
    this.notifications.push(payout.id);
    return { payout, notificationSent: true };
  }
}
