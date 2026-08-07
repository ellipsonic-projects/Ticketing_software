import { tenantDashboardRepository } from '@/repositories/tenant/tenant-dashboard.repository';

export class TenantDashboardService {
  static async getDashboardStats(tenantId: string) {
    const [summary, sla, trends] = await Promise.all([
      tenantDashboardRepository.getSummaryCounts(tenantId),
      tenantDashboardRepository.getSLACompliance(tenantId),
      tenantDashboardRepository.getTicketTrends(tenantId),
    ]);

    // Calculate percentage changes vs last month safely
    const calcPercent = (current: number, lastMonth: number) => {
      if (lastMonth === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - lastMonth) / lastMonth) * 100);
    };

    return {
      summary: {
        clients: {
          total: summary.clients.total,
          percentChange: calcPercent(summary.clients.total, summary.clients.lastMonth),
        },
        projects: {
          total: summary.projects.total,
          active: summary.projects.active,
          paused: summary.projects.paused,
        },
        engineers: {
          total: summary.engineers.total,
          onLeave: summary.engineers.onLeave, // Mapping INACTIVE to onLeave
        },
        tickets: {
          total: summary.tickets.total,
          active: summary.tickets.active,
          critical: summary.tickets.critical,
        },
        slaBreaches: {
          total: sla.breached,
          requiresAttention: sla.atRisk,
        },
        pendingInvites: {
          total: summary.pendingInvites,
        },
      },
      slaCompliance: {
        withinSLA: sla.withinSLA,
        atRisk: sla.atRisk,
        breached: sla.breached,
      },
      ticketTrends: trends,
    };
  }
}
