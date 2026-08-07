import { Prisma, Ticket } from '@prisma/client';

import { ClientDashboardTicketSort } from '@/lib/client-dashboard/client-dashboard.types';
import prisma from '@/lib/prisma';

export class TicketRepository {
  async create(
    data: Prisma.TicketUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Ticket> {
    const client = tx || prisma;
    return client.ticket.create({ data });
  }

  async findById(id: string, tenantId: string): Promise<Ticket | null> {
    return prisma.ticket.findUnique({
      where: { id, tenantId },
      include: {
        project: { select: { id: true, name: true, code: true } },
        client: { select: { id: true, name: true } },
        assignedTo: {
          select: { id: true, firstName: true, lastName: true, email: true, role: true },
        },
        reportedBy: {
          select: { id: true, firstName: true, lastName: true, email: true, role: true },
        },
        sla: true,
        category: true,
        tags: true,
      },
    });
  }

  async getNextTicketNumber(tenantId: string, tx?: Prisma.TransactionClient): Promise<number> {
    const client = tx || prisma;
    const result = await client.ticket.aggregate({
      where: { tenantId },
      _max: { number: true },
    });
    return (result._max.number || 0) + 1;
  }

  async update(
    id: string,
    tenantId: string,
    data: Prisma.TicketUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Ticket> {
    const client = tx || prisma;
    return client.ticket.update({
      where: { id, tenantId },
      data,
    });
  }

  async findMany(args: Prisma.TicketFindManyArgs): Promise<[Ticket[], number]> {
    return Promise.all([prisma.ticket.findMany(args), prisma.ticket.count({ where: args.where })]);
  }

  // ---------------------------------------------------------------------------
  // Client Dashboard queries
  // ---------------------------------------------------------------------------

  async getDashboardSummaryCounts(
    options: { clientId?: string; assignedToId?: string },
    tenantId: string,
  ) {
    const now = new Date();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - now.getDay());
    startOfThisWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    const conditions: Prisma.Sql[] = [Prisma.sql`"tenantId" = ${tenantId}`];

    if (options.clientId) {
      conditions.push(Prisma.sql`"clientId" = ${options.clientId}`);
    }

    if (options.assignedToId) {
      conditions.push(Prisma.sql`"assignedToId" = ${options.assignedToId}`);
    }

    const whereClause = Prisma.sql`${Prisma.join(conditions, ' AND ')}`;

    const result = await prisma.$queryRaw<
      Array<{
        open_count: bigint;
        in_progress_count: bigint;
        resolved_count: bigint;
        closed_count: bigint;
        resolved_this_week: bigint;
        resolved_last_week: bigint;
        closed_this_week: bigint;
        closed_last_week: bigint;
      }>
    >`
      SELECT 
        COUNT(CASE WHEN status = 'OPEN' THEN 1 END) as open_count,
        COUNT(CASE WHEN status = 'IN_PROGRESS' THEN 1 END) as in_progress_count,
        COUNT(CASE WHEN status = 'RESOLVED' THEN 1 END) as resolved_count,
        COUNT(CASE WHEN status = 'CLOSED' THEN 1 END) as closed_count,
        COUNT(CASE WHEN status = 'RESOLVED' AND "resolvedAt" >= ${startOfThisWeek} THEN 1 END) as resolved_this_week,
        COUNT(CASE WHEN status = 'RESOLVED' AND "resolvedAt" >= ${startOfLastWeek} AND "resolvedAt" < ${startOfThisWeek} THEN 1 END) as resolved_last_week,
        COUNT(CASE WHEN status = 'CLOSED' AND "closedAt" >= ${startOfThisWeek} THEN 1 END) as closed_this_week,
        COUNT(CASE WHEN status = 'CLOSED' AND "closedAt" >= ${startOfLastWeek} AND "closedAt" < ${startOfThisWeek} THEN 1 END) as closed_last_week
      FROM "Ticket"
      WHERE ${whereClause}
    `;

    const row = result[0];
    return {
      openCount: Number(row?.open_count || 0),
      inProgressCount: Number(row?.in_progress_count || 0),
      resolvedCount: Number(row?.resolved_count || 0),
      closedCount: Number(row?.closed_count || 0),
      resolvedThisWeek: Number(row?.resolved_this_week || 0),
      resolvedLastWeek: Number(row?.resolved_last_week || 0),
      closedThisWeek: Number(row?.closed_this_week || 0),
      closedLastWeek: Number(row?.closed_last_week || 0),
    };
  }

  async findRecentForClient(
    clientId: string,
    tenantId: string,
    page: number,
    limit: number,
    sort: ClientDashboardTicketSort,
    order: Prisma.SortOrder,
    projectId?: string,
    reportedById?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: Prisma.TicketWhereInput = {
      clientId,
      tenantId,
      ...(projectId ? { projectId } : {}),
      ...(reportedById ? { reportedById } : {}),
    };
    const orderBy: Prisma.TicketOrderByWithRelationInput =
      sort === 'project'
        ? { project: { name: order } }
        : sort === 'title'
          ? { title: order }
          : sort === 'status'
            ? { status: order }
            : sort === 'priority'
              ? { priority: order }
              : { updatedAt: order };

    const [items, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        include: {
          project: { select: { name: true } },
          assignedTo: { select: { firstName: true, lastName: true, avatarUrl: true } },
          reportedBy: { select: { firstName: true, lastName: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.ticket.count({ where }),
    ]);
    return { items, total };
  }

  async getTicketProjectsForClient(clientId: string, tenantId: string) {
    return prisma.project.findMany({
      where: { clientId, tenantId, archivedAt: null },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
  }

  async getSLAStatsForClient(clientId: string, tenantId: string) {
    // Only process SLA stats for tickets created in the last 60 days
    // to prevent unbounded memory growth as tickets accumulate over years.
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 60);

    const tickets = await prisma.ticket.findMany({
      where: {
        clientId,
        tenantId,
        createdAt: { gte: cutoffDate },
      },
      include: { sla: true },
    });

    const now = new Date();
    let withinSLA = 0,
      atRisk = 0,
      breached = 0,
      paused = 0;
    let totalResponseMs = 0,
      responseCount = 0;
    let totalResolutionMs = 0,
      resolutionCount = 0;

    for (const ticket of tickets) {
      if (!ticket.sla) {
        paused++;
        continue;
      }
      const sla = ticket.sla;

      if (sla.firstRespondedAt) {
        totalResponseMs += sla.firstRespondedAt.getTime() - ticket.createdAt.getTime();
        responseCount++;
      }
      if (sla.resolvedAt) {
        totalResolutionMs += sla.resolvedAt.getTime() - ticket.createdAt.getTime();
        resolutionCount++;
      }

      if (!sla.resolutionBreachAt) {
        withinSLA++;
        continue;
      }

      if (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') {
        if (sla.resolvedAt && sla.resolvedAt > sla.resolutionBreachAt) {
          breached++;
        } else {
          withinSLA++;
        }
      } else {
        if (now > sla.resolutionBreachAt) {
          breached++;
        } else {
          const hoursLeft = (sla.resolutionBreachAt.getTime() - now.getTime()) / 3_600_000;
          if (hoursLeft < 2) atRisk++;
          else withinSLA++;
        }
      }
    }

    const total = tickets.length || 1;
    return {
      withinSLACount: withinSLA,
      atRiskCount: atRisk,
      breachedCount: breached,
      pausedCount: paused,
      withinSLAPercent: Math.round((withinSLA / total) * 100),
      atRiskPercent: Math.round((atRisk / total) * 100),
      breachedPercent: Math.round((breached / total) * 100),
      pausedPercent: Math.round((paused / total) * 100),
      avgResponseTimeMinutes:
        responseCount > 0 ? Math.round(totalResponseMs / responseCount / 60_000) : 0,
      avgResolutionTimeMinutes:
        resolutionCount > 0 ? Math.round(totalResolutionMs / resolutionCount / 60_000) : 0,
    };
  }

  async getProjectHealthForClient(clientId: string, tenantId: string, page: number, limit: number) {
    // Only fetch OPEN/IN_PROGRESS tickets for project health calculations
    // Since resolved/closed tickets no longer put a project "at risk"
    const where = { clientId, tenantId };
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          tickets: {
            where: { status: { in: ['OPEN', 'IN_PROGRESS'] } },
            include: { sla: true },
          },
        },
      }),
      prisma.project.count({ where }),
    ]);

    const now = new Date();

    return {
      items: projects.map((project) => {
        const tickets = project.tickets;
        const openCount = tickets.length;

        let atRiskCount = 0,
          breachedCount = 0;
        for (const ticket of tickets) {
          if (!ticket.sla?.resolutionBreachAt) continue;
          if (now > ticket.sla.resolutionBreachAt) {
            breachedCount++;
          } else {
            const hoursLeft = (ticket.sla.resolutionBreachAt.getTime() - now.getTime()) / 3_600_000;
            if (hoursLeft < 2) atRiskCount++;
          }
        }

        const health: 'Healthy' | 'At Risk' | 'Critical' =
          breachedCount >= 3
            ? 'Critical'
            : atRiskCount > 0 || breachedCount > 0
              ? 'At Risk'
              : 'Healthy';

        return {
          id: project.id,
          name: project.name,
          color: project.color,
          openCount,
          atRiskCount,
          health,
        };
      }),
      total,
    };
  }

  async getProjectStatsForClient(clientId: string, tenantId: string) {
    const tickets = await prisma.ticket.findMany({
      where: { clientId, tenantId },
      include: { sla: true },
    });

    const projectStatsMap = new Map<
      string,
      {
        totalTickets: number;
        openTickets: number;
        engineers: Set<string>;
        withinSLA: number;
        atRisk: number;
        breached: number;
        paused: number;
      }
    >();

    const now = new Date();

    for (const ticket of tickets) {
      if (!projectStatsMap.has(ticket.projectId)) {
        projectStatsMap.set(ticket.projectId, {
          totalTickets: 0,
          openTickets: 0,
          engineers: new Set<string>(),
          withinSLA: 0,
          atRisk: 0,
          breached: 0,
          paused: 0,
        });
      }

      const stats = projectStatsMap.get(ticket.projectId)!;
      stats.totalTickets++;

      if (ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS') {
        stats.openTickets++;
      }

      if (ticket.assignedToId) {
        stats.engineers.add(ticket.assignedToId);
      }

      if (!ticket.sla) {
        stats.paused++;
        continue;
      }

      const sla = ticket.sla;
      if (!sla.resolutionBreachAt) {
        stats.withinSLA++;
        continue;
      }

      if (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') {
        if (sla.resolvedAt && sla.resolvedAt > sla.resolutionBreachAt) {
          stats.breached++;
        } else {
          stats.withinSLA++;
        }
      } else {
        if (now > sla.resolutionBreachAt) {
          stats.breached++;
        } else {
          const hoursLeft = (sla.resolutionBreachAt.getTime() - now.getTime()) / 3_600_000;
          if (hoursLeft < 2) stats.atRisk++;
          else stats.withinSLA++;
        }
      }
    }

    const result: Record<
      string,
      {
        totalTickets: number;
        openTickets: number;
        engineersCount: number;
        slaHealthPercent: number;
      }
    > = {};

    for (const [projectId, stats] of projectStatsMap.entries()) {
      const totalSLA = stats.withinSLA + stats.atRisk + stats.breached + stats.paused || 1;
      const slaHealthPercent = Math.round(((stats.withinSLA + stats.atRisk) / totalSLA) * 100);

      result[projectId] = {
        totalTickets: stats.totalTickets,
        openTickets: stats.openTickets,
        engineersCount: stats.engineers.size,
        slaHealthPercent,
      };
    }

    return result;
  }
}

export const ticketRepository = new TicketRepository();
