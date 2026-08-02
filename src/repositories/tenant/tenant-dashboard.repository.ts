import prisma from '@/lib/prisma';

export class TenantDashboardRepository {
  /**
   * Get basic counts (Clients, Projects, Engineers, Tickets, Pending Invites)
   */
  async getSummaryCounts(tenantId: string) {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // 1. Clients
    const [totalClients, lastMonthClients, pendingClients] = await Promise.all([
      prisma.client.count({ where: { tenantId } }),
      prisma.client.count({
        where: { tenantId, createdAt: { lt: startOfThisMonth, gte: startOfLastMonth } },
      }),
      prisma.client.count({ where: { tenantId, status: 'PENDING_ACTIVATION' } }),
    ]);

    // 2. Projects
    const [totalProjects, activeProjects, pausedProjects] = await Promise.all([
      prisma.project.count({ where: { tenantId } }),
      prisma.project.count({ where: { tenantId, status: 'ACTIVE', supportStatus: 'ENABLED' } }),
      prisma.project.count({ where: { tenantId, supportStatus: 'PAUSED' } }),
    ]);

    // 3. Engineers
    const [totalEngineers, onLeaveEngineers, pendingEngineers] = await Promise.all([
      prisma.user.count({ where: { tenantId, role: 'ENGINEER' } }),
      prisma.user.count({ where: { tenantId, role: 'ENGINEER', status: 'INACTIVE' } }),
      prisma.user.count({ where: { tenantId, role: 'ENGINEER', status: 'INVITED' } }),
    ]);

    // 4. Tickets — only URGENT is the highest priority in the schema (no CRITICAL)
    const [totalTickets, activeTickets, urgentTickets, lastMonthTickets] = await Promise.all([
      prisma.ticket.count({ where: { tenantId } }),
      prisma.ticket.count({ where: { tenantId, status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
      prisma.ticket.count({
        where: { tenantId, status: { in: ['OPEN', 'IN_PROGRESS'] }, priority: 'URGENT' },
      }),
      prisma.ticket.count({
        where: { tenantId, createdAt: { lt: startOfThisMonth, gte: startOfLastMonth } },
      }),
    ]);

    return {
      clients: { total: totalClients, lastMonth: lastMonthClients },
      projects: { total: totalProjects, active: activeProjects, paused: pausedProjects },
      engineers: { total: totalEngineers, onLeave: onLeaveEngineers },
      tickets: {
        total: totalTickets,
        active: activeTickets,
        critical: urgentTickets,
        lastMonth: lastMonthTickets,
      },
      pendingInvites: pendingClients + pendingEngineers,
    };
  }

  /**
   * Get SLA stats across the tenant for the last 60 days
   */
  async getSLACompliance(tenantId: string) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 60);

    const tickets = await prisma.ticket.findMany({
      where: { tenantId, createdAt: { gte: cutoffDate } },
      select: {
        status: true,
        sla: {
          select: { resolutionBreachAt: true, resolvedAt: true },
        },
      },
    });

    const now = new Date();
    let withinSLA = 0,
      atRisk = 0,
      breached = 0;

    for (const ticket of tickets) {
      if (!ticket.sla?.resolutionBreachAt) continue;

      if (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') {
        if (ticket.sla.resolvedAt && ticket.sla.resolvedAt > ticket.sla.resolutionBreachAt) {
          breached++;
        } else {
          withinSLA++;
        }
      } else {
        if (now > ticket.sla.resolutionBreachAt) {
          breached++;
        } else {
          const hoursLeft = (ticket.sla.resolutionBreachAt.getTime() - now.getTime()) / 3_600_000;
          if (hoursLeft < 2) atRisk++;
          else withinSLA++;
        }
      }
    }

    return { withinSLA, atRisk, breached };
  }

  /**
   * Get ticket trends (Opened, Resolved, Closed) grouped by day for the last 30 days
   */
  async getTicketTrends(tenantId: string) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    cutoff.setHours(0, 0, 0, 0);

    const tickets = await prisma.ticket.findMany({
      where: { tenantId, createdAt: { gte: cutoff } },
      select: { createdAt: true, resolvedAt: true, closedAt: true },
    });

    // Initialize the last 30 days
    const trendMap = new Map<string, { opened: number; resolved: number; closed: number }>();
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      trendMap.set(dateStr, { opened: 0, resolved: 0, closed: 0 });
    }

    for (const t of tickets) {
      const openDate = t.createdAt.toISOString().split('T')[0];
      if (trendMap.has(openDate)) trendMap.get(openDate)!.opened++;

      if (t.resolvedAt) {
        const resolvedDate = t.resolvedAt.toISOString().split('T')[0];
        if (trendMap.has(resolvedDate)) trendMap.get(resolvedDate)!.resolved++;
      }

      if (t.closedAt) {
        const closedDate = t.closedAt.toISOString().split('T')[0];
        if (trendMap.has(closedDate)) trendMap.get(closedDate)!.closed++;
      }
    }

    return Array.from(trendMap.entries())
      .map(([date, counts]) => ({ date, ...counts }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Get recent items (Tickets, Clients, Activity)
   */
  async getRecentActivity(tenantId: string) {
    const [recentTickets, recentClients, recentLogs] = await Promise.all([
      prisma.ticket.findMany({
        where: { tenantId },
        take: 5,
        orderBy: { updatedAt: 'desc' },
        include: {
          project: { select: { name: true } },
          assignedTo: { select: { firstName: true, lastName: true, avatarUrl: true } },
        },
      }),
      prisma.client.findMany({
        where: { tenantId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { projects: true, tickets: true } },
        },
      }),
      // AuditLog has no tenantId — use tenant-scoped TicketHistory instead
      prisma.ticketHistory.findMany({
        where: { tenantId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          action: true,
          createdAt: true,
          ticket: { select: { number: true, title: true } },
          changedBy: { select: { firstName: true, lastName: true } },
        },
      }),
    ]);

    return { recentTickets, recentClients, recentLogs };
  }
}

export const tenantDashboardRepository = new TenantDashboardRepository();
