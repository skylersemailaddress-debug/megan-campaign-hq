export type ApprovalType =
  | 'calendar_write'
  | 'website_publish'
  | 'public_message_release'
  | 'campaign_brain_update'
  | 'strategic_decision';

export type IntakeItem = {
  id: string;
  createdAt: string;
  sourceType: string;
  submittedBy?: string;
  content: Record<string, unknown>;
  status: 'new' | 'processed' | 'error';
  routerProcessed: boolean;
};

export type DashboardState = {
  today: {
    summary: string;
    priorityCount: number;
  };
  signals: Array<Record<string, unknown>>;
  approvals: Array<Record<string, unknown>>;
  events: Array<Record<string, unknown>>;
  websiteQueue: Array<Record<string, unknown>>;
};
