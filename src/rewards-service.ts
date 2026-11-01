import { Payout, SettlementPeriod, SettlementResult, Task } from "./types";

interface ServiceOptions {
  payoutShouldFail?: boolean;
  notificationShouldFail?: boolean;
}

export class RewardsService {
  readonly payouts: Payout[] = [];
  readonly notifications: string[] = [];
  private readonly completedSettlementKeys = new Set<string>();

  constructor(private readonly options: ServiceOptions = {}) {}

  async settle(period: SettlementPeriod, tasks: Task[], userId: string): Promise<SettlementResult> {
    const idempotencyKey = `${period.id}:${userId}`;

    // Idempotency check: a successful settlement for this user/period cannot pay twice.
    if (this.completedSettlementKeys.has(idempotencyKey)) {
      return { payout: null, notificationSent: false };
    }

    const qualifyingTasks = new Map<string, Task>();
    for (const task of tasks) {
      const timestamp = Date.parse(task.completedAt);
      const start = Date.parse(period.startUtc);
      const end = Date.parse(period.endUtc);

      if (
        task.userId === userId &&
        task.status === "COMPLETED" &&
        Number.isFinite(timestamp) &&
        timestamp >= start &&
        timestamp < end
      ) {
        qualifyingTasks.set(task.id, task);
      }
    }

    const credits = qualifyingTasks.size * 10;
    if (credits === 0) {
      return { payout: null, notificationSent: false };
    }

    if (this.options.payoutShouldFail) {
      throw new Error("PAYOUT_FAILED");
    }

    const payout: Payout = {
      id: `PAY-${this.payouts.length + 1}`,
      settlementId: period.id,
      userId,
      credits
    };

    this.payouts.push(payout);

    // Mark the settlement complete only after payout succeeds.
    this.completedSettlementKeys.add(idempotencyKey);

    // Notification is downstream and must not roll back a successful payout.
    try {
      if (this.options.notificationShouldFail) throw new Error("NOTIFICATION_FAILED");
      this.notifications.push(payout.id);
      return { payout, notificationSent: true };
    } catch (error) {
      return {
        payout,
        notificationSent: false,
        notificationError: error instanceof Error ? error.message : "UNKNOWN_NOTIFICATION_ERROR"
      };
    }
  }
}
