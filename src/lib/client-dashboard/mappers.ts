import { formatDistanceToNow } from 'date-fns';

import {
  DashboardSLA,
  ProjectHealthItem,
  SlaPerformance,
  ProjectHealth,
  SupportTimelineEvent,
  TimelineItem,
} from './client-dashboard.types';

// ---------------------------------------------------------------------------
// SLA
// ---------------------------------------------------------------------------

export function mapDashboardSla(raw: DashboardSLA): SlaPerformance {
  return {
    complianceRate: raw.compliance,
    change: 0,
    withinSla: raw.withinSLACount,
    breached: raw.breachedCount,
    averageResponseTime: `${raw.avgResponseTimeMinutes}m`,
    averageResolutionTime: `${raw.avgResolutionTimeMinutes}m`,
  };
}

// ---------------------------------------------------------------------------
// Project health
// ---------------------------------------------------------------------------

const HEALTH_SCORE: Record<ProjectHealthItem['health'], number> = {
  Healthy: 100,
  'At Risk': 75,
  Critical: 50,
};

export function mapProjectHealth(raw: ProjectHealthItem[]): ProjectHealth[] {
  return raw.map((p) => ({
    id: p.id,
    name: p.name,
    openTickets: p.openCount,
    healthScore: HEALTH_SCORE[p.health],
    slaStatus: p.health === 'Critical' ? 'AT_RISK' : 'ON_TRACK',
  }));
}

// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------

const TIMELINE_ACTION_MAP: Record<string, SupportTimelineEvent['type']> = {
  COMMENT_ADDED: 'COMMENT',
  STATUS_CHANGED: 'STATUS_CHANGED',
  RESOLVED: 'RESOLVED',
};

export function mapTimeline(raw: TimelineItem[]): SupportTimelineEvent[] {
  return raw.map((t) => ({
    id: t.id,
    type: TIMELINE_ACTION_MAP[t.action] ?? 'OTHER',
    title: t.ticketTitle,
    description: t.description,
    time: formatDistanceToNow(new Date(t.occurredAt), { addSuffix: true }),
  }));
}
