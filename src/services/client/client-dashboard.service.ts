import { TicketHistoryAction, TicketPriority, TicketStatus } from '@prisma/client';

import { ticketHistoryRepository } from '@/repositories/ticket/ticket-history.repository';
import { ticketRepository } from '@/repositories/ticket/ticket.repository';
import {
  ClientDashboardResponse,
  DashboardSLA,
  DashboardSummary,
  PaginatedTickets,
  ProjectHealthItem,
  TicketListItem,
  TimelineItem,
} from '@/lib/client-dashboard/client-dashboard.types';
import prisma from '@/lib/prisma';

// ---------------------------------------------------------------------------
// Local intermediary types for Prisma result shapes
// ---------------------------------------------------------------------------

interface TicketRaw {
  id: string;
  number: number;
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  updatedAt: Date;
  project: { name: string };
  assignedTo: {
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  } | null;
}

interface HistoryRaw {
  id: string;
  action: TicketHistoryAction;
  oldValue: string | null;
  newValue: string | null;
  createdAt: Date;
  ticket: { number: number; title: string };
  changedBy: { firstName: string; lastName: string } | null;
}

export class ClientDashboardService {
  static async getDashboardData(
    clientId: string,
    tenantId: string,
    accountId: string,
    ticketPage: number,
    ticketLimit: number,
  ): Promise<ClientDashboardResponse> {
    // Fire all queries in parallel
    const [
      summaryCounts,
      recentTicketsRaw,
      slaRaw,
      projectHealthRaw,
      timelineRaw,
      notificationCount,
    ] = await Promise.all([
      ticketRepository.getDashboardSummaryCounts(clientId, tenantId),
      ticketRepository.findRecentForClient(clientId, tenantId, ticketPage, ticketLimit),
      ticketRepository.getSLAStatsForClient(clientId, tenantId),
      ticketRepository.getProjectHealthForClient(clientId, tenantId),
      ticketHistoryRepository.getTimelineForClient(clientId, tenantId, 12),
      prisma.notification.count({ where: { userId: accountId, isRead: false } }),
    ]);

    // ---------------------------------------------------------------------------
    // Summary KPI cards
    // ---------------------------------------------------------------------------
    const summary: DashboardSummary = {
      openRequests: summaryCounts.openCount,
      openRequestsDelta: 0, // No yesterday-snapshot available without separate tracking
      inProgress: summaryCounts.inProgressCount,
      inProgressDelta: 0,
      resolvedThisWeek: summaryCounts.resolvedThisWeek,
      resolvedThisWeekDelta: summaryCounts.resolvedThisWeek - summaryCounts.resolvedLastWeek,
      closedThisWeek: summaryCounts.closedThisWeek,
      closedThisWeekDelta: summaryCounts.closedThisWeek - summaryCounts.closedLastWeek,
      slaCompliance: slaRaw.withinSLAPercent,
    };

    // ---------------------------------------------------------------------------
    // Recent tickets table
    // ---------------------------------------------------------------------------
    const ticketItems: TicketListItem[] = (recentTicketsRaw.items as TicketRaw[]).map((t) => ({
      id: t.id,
      number: t.number,
      title: t.title,
      projectName: t.project.name,
      status: t.status,
      priority: t.priority,
      updatedAt: t.updatedAt.toISOString(),
      assignedEngineerName: t.assignedTo
        ? `${t.assignedTo.firstName} ${t.assignedTo.lastName}`
        : null,
      assignedEngineerAvatar: t.assignedTo?.avatarUrl ?? null,
    }));

    const recentTickets: PaginatedTickets = {
      items: ticketItems,
      total: recentTicketsRaw.total,
      totalPages: Math.ceil(recentTicketsRaw.total / ticketLimit),
      page: ticketPage,
      pageSize: ticketLimit,
    };

    // ---------------------------------------------------------------------------
    // SLA card
    // ---------------------------------------------------------------------------
    const sla: DashboardSLA = {
      compliance: slaRaw.withinSLAPercent,
      ...slaRaw,
    };

    // ---------------------------------------------------------------------------
    // Project health
    // ---------------------------------------------------------------------------
    const projectHealth: ProjectHealthItem[] = projectHealthRaw;

    // ---------------------------------------------------------------------------
    // Timeline
    // ---------------------------------------------------------------------------
    const timeline: TimelineItem[] = (timelineRaw as HistoryRaw[]).map((h) => ({
      id: h.id,
      ticketNumber: h.ticket.number,
      ticketTitle: h.ticket.title,
      action: h.action,
      description: ClientDashboardService.formatHistoryDescription(
        h.action,
        h.oldValue,
        h.newValue,
        h.ticket.title,
      ),
      actor: h.changedBy ? `${h.changedBy.firstName} ${h.changedBy.lastName}` : 'System',
      occurredAt: h.createdAt.toISOString(),
    }));

    return {
      summary,
      recentTickets,
      sla,
      projectHealth,
      timeline,
      notificationCount,
    };
  }

  private static formatHistoryDescription(
    action: TicketHistoryAction,
    oldValue: string | null,
    newValue: string | null,
    ticketTitle: string,
  ): string {
    switch (action) {
      case 'CREATED':
        return `Ticket "${ticketTitle}" was created`;
      case 'STATUS_CHANGED':
        return `Status changed from ${oldValue ?? '—'} to ${newValue ?? '—'}`;
      case 'PRIORITY_CHANGED':
        return `Priority changed from ${oldValue ?? '—'} to ${newValue ?? '—'}`;
      case 'ASSIGNED':
        return `Ticket assigned to ${newValue ?? 'an engineer'}`;
      case 'REASSIGNED':
        return `Ticket reassigned from ${oldValue ?? '—'} to ${newValue ?? '—'}`;
      case 'UNASSIGNED':
        return 'Ticket was unassigned';
      case 'COMMENT_ADDED':
        return 'A comment was added';
      case 'ATTACHMENT_ADDED':
        return 'An attachment was uploaded';
      case 'RESOLVED':
        return `Ticket "${ticketTitle}" was resolved`;
      case 'CLOSED':
        return `Ticket "${ticketTitle}" was closed`;
      case 'REOPENED':
        return `Ticket "${ticketTitle}" was reopened`;
      default:
        return 'Ticket updated';
    }
  }
}
