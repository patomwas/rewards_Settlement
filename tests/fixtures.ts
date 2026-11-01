import { SettlementPeriod, Task } from "../src/types";

export const USER = "user-100";
export const PERIOD: SettlementPeriod = {
  id: "SETTLEMENT-2026-W45",
  startUtc: "2026-11-02T00:00:00.000Z",
  endUtc: "2026-11-09T00:00:00.000Z"
};

export const tasks: Task[] = [
  { id: "TASK-001", userId: USER, completedAt: "2026-11-02T00:00:00.000Z", status: "COMPLETED" },
  { id: "TASK-002", userId: USER, completedAt: "2026-11-04T12:00:00.000Z", status: "COMPLETED" },
  { id: "TASK-003", userId: USER, completedAt: "2026-11-08T20:59:59.000Z", status: "COMPLETED" },
  { id: "TASK-004", userId: USER, completedAt: "2026-11-09T00:00:00.000Z", status: "COMPLETED" }
];
