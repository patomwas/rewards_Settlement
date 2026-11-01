export interface Task {
  id: string;
  userId: string;
  completedAt: string; // ISO-8601 timestamp with timezone
  status: "COMPLETED" | "CANCELLED";
}

export interface SettlementPeriod {
  id: string;
  startUtc: string; // inclusive
  endUtc: string;   // exclusive
}

export interface Payout {
  id: string;
  settlementId: string;
  userId: string;
  credits: number;
}

export interface SettlementResult {
  payout: Payout | null;
  notificationSent: boolean;
  notificationError?: string;
}
