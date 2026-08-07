export type TicketStatusValue = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriorityValue = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ClientDashboardTicketSort = 'title' | 'project' | 'status' | 'priority' | 'updatedAt';
export type ProjectHealthStatus = 'Healthy' | 'At Risk' | 'Critical';

export type TimelineAction =
  | 'CREATED'
  | 'STATUS_CHANGED'
  | 'PRIORITY_CHANGED'
  | 'ASSIGNED'
  | 'REASSIGNED'
  | 'UNASSIGNED'
  | 'COMMENT_ADDED'
  | 'ATTACHMENT_ADDED'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REOPENED';

// ---------------------------------------------------------------------------
// Summary KPI cards
// ---------------------------------------------------------------------------

export interface DashboardSummary {
  openRequests: number;
  openRequestsDelta: number; // positive = increase vs yesterday
  inProgress: number;
  inProgressDelta: number;
  resolvedThisWeek: number;
  resolvedThisWeekDelta: number; // vs same period last week
  closedThisWeek: number;
  closedThisWeekDelta: number;
  slaCompliance: number; // 0–100 percentage
}

// ---------------------------------------------------------------------------
// Ticket list (recent tickets table)
// ---------------------------------------------------------------------------

export interface TicketListItem {
  id: string;
  number: number;
  title: string;
  projectName: string;
  status: TicketStatusValue;
  priority: TicketPriorityValue;
  updatedAt: string; // ISO 8601
  assignedEngineerName: string | null;
  assignedEngineerAvatar: string | null;
}

export interface PaginatedTickets {
  items: TicketListItem[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

export interface TicketProjectFilter {
  id: string;
  name: string;
}

// ---------------------------------------------------------------------------
// SLA performance card
// ---------------------------------------------------------------------------

export interface DashboardSLA {
  compliance: number; // 0–100
  withinSLACount: number;
  withinSLAPercent: number;
  atRiskCount: number;
  atRiskPercent: number;
  breachedCount: number;
  breachedPercent: number;
  pausedCount: number;
  pausedPercent: number;
  avgResponseTimeMinutes: number;
  avgResolutionTimeMinutes: number;
}

// ---------------------------------------------------------------------------
// Project health card
// ---------------------------------------------------------------------------

export interface ProjectHealthItem {
  id: string;
  name: string;
  color: string | null;
  openCount: number;
  atRiskCount: number;
  health: ProjectHealthStatus;
}

export interface PaginatedProjectHealth {
  items: ProjectHealthItem[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

// ---------------------------------------------------------------------------
// Timeline (TicketHistory feed)
// ---------------------------------------------------------------------------

export interface TimelineItem {
  id: string;
  ticketNumber: number;
  ticketTitle: string;
  action: TimelineAction;
  /** Human-readable description of the change. */
  description: string;
  /** Actor display name — engineer or system. */
  actor: string;
  occurredAt: string; // ISO 8601
}

// ---------------------------------------------------------------------------
// Top-level response
// ---------------------------------------------------------------------------

export interface ClientDashboardResponse {
  summary: DashboardSummary;
  recentTickets: PaginatedTickets;
  ticketProjects: TicketProjectFilter[];
  sla: DashboardSLA;
  projectHealth: PaginatedProjectHealth;
  notificationCount: number;
}

// ---------------------------------------------------------------------------
// New UI Component Types
// ---------------------------------------------------------------------------

export interface SlaPerformance {
  complianceRate: number;
  change: number;
  withinSla: number;
  breached: number;
  averageResponseTime: string | number;
  averageResolutionTime: string | number;
}

export interface ProjectHealth {
  id: string;
  name: string;
  openTickets: number;
  healthScore: number;
  slaStatus: 'ON_TRACK' | 'AT_RISK';
}

export interface SupportTimelineEvent {
  id: string;
  type: 'COMMENT' | 'STATUS_CHANGED' | 'RESOLVED' | 'OTHER';
  title: string;
  description: string;
  time: string;
}
