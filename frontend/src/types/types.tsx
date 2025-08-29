export interface Report {
  id: number;
  timestamp: string;
  users_deleted: number;
  active_users_remaining: number;
  was_manual: boolean;
}

export interface ManualReportResponse {
  report_id: number;
  users_deleted: number;
  users_remaining: number;
}
