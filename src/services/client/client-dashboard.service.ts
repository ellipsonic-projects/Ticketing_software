import { TicketHistoryAction, TicketPriority, TicketStatus } from '@prisma/client';

import { ticketRepository } from '@/repositories/ticket/ticket.repository';
import {
  ClientDashboardResponse,
  ClientDashboardTicketSort,
  DashboardSLA,
  DashboardSummary,
  PaginatedProjectHealth,
  PaginatedTickets,
  ProjectHealthItem,
  TicketListItem,
  TicketProjectFilter,
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
  reportedBy: {
    firstName: string;
    lastName: string;
  };
}

export class ClientDashboardService {
  static async getDashboardData(
    clientId: string,
    tenantId: string,
    accountId: string,
    ticketPage: number,
    ticketLimit: number,
    ticketSort: ClientDashboardTicketSort,
    ticketOrder: 'asc' | 'desc',
    ticketProjectId: string | undefined,
    ticketReportedByMe: boolean,
    projectPage: number,
    projectLimit: number,
  ): Promise<ClientDashboardResponse> {
    // Fire all queries in parallel
    const [
      summaryCounts,
      recentTicketsRaw,
      slaRaw,
      projectHealthRaw,
      notificationCount,
      ticketProjects,
    ] = await Promise.all([
      // @ts-ignore
      ticketRepository.getDashboardSummaryCounts(clientId, tenantId),
      ticketRepository.findRecentForClient(
        clientId,
        tenantId,
        ticketPage,
        ticketLimit,
        ticketSort,
        ticketOrder,
        ticketProjectId,
        ticketReportedByMe ? accountId : undefined,
      ),
      ticketRepository.getSLAStatsForClient(clientId, tenantId),
      ticketRepository.getProjectHealthForClient(clientId, tenantId, projectPage, projectLimit),
      prisma.notification.count({ where: { userId: accountId, isRead: false } }),
      ticketRepository.getTicketProjectsForClient(clientId, tenantId),
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
      reportedByName: `${t.reportedBy.firstName} ${t.reportedBy.lastName}`,
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
    const projectHealth: PaginatedProjectHealth = {
      items: projectHealthRaw.items as ProjectHealthItem[],
      total: projectHealthRaw.total,
      totalPages: Math.ceil(projectHealthRaw.total / projectLimit),
      page: projectPage,
      pageSize: projectLimit,
    };

    // ---------------------------------------------------------------------------
    // Timeline
    // ---------------------------------------------------------------------------
    return {
      summary,
      recentTickets,
      ticketProjects: ticketProjects as TicketProjectFilter[],
      sla,
      projectHealth,
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
