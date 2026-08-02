import { apiClient } from './api-client';

export interface TenantDashboardStatsResponse {
  summary: {
    clients: { total: number; percentChange: number };
    projects: { total: number; active: number; paused: number };
    engineers: { total: number; onLeave: number };
    tickets: { total: number; active: number; critical: number };
    slaBreaches: { total: number; requiresAttention: number };
    pendingInvites: { total: number };
  };
  slaCompliance: { withinSLA: number; atRisk: number; breached: number };
  ticketTrends: Array<{ date: string; opened: number; resolved: number; closed: number }>;
  recentTickets: Array<{
    id: string;
    number: number;
    title: string;
    status: string;
    priority: string;
    projectName: string;
    assignedTo: string;
    assignedToAvatar: string | null;
    updatedAt: Date;
  }>;
  recentClients: Array<{
    id: string;
    name: string;
    projectsCount: number;
    ticketsCount: number;
    createdAt: Date;
  }>;
  recentLogs: Array<{
    id: string;
    action: string;
    ticketNumber: number | null;
    ticketTitle: string | null;
    changedBy: string;
    createdAt: Date;
  }>;
}

export const tenantDashboardApi = {
  getStats: async (token: string) => {
    return apiClient<{ data: TenantDashboardStatsResponse }>('/tenant/dashboard/stats', {
      token,
    });
  },
};
