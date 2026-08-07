import {
  ClientDashboardResponse,
  ClientDashboardTicketSort,
} from '@/lib/client-dashboard/client-dashboard.types';

import { apiClient } from './api-client';

export const clientDashboardApi = {
  getDashboard: async (
    page = 1,
    limit = 6,
    ticketSort: ClientDashboardTicketSort = 'updatedAt',
    ticketOrder: 'asc' | 'desc' = 'desc',
    ticketProjectId?: string,
    ticketReportedByMe = false,
    projectPage = 1,
    projectLimit = 6,
  ): Promise<ClientDashboardResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ticketSort,
      ticketOrder,
      projectPage: projectPage.toString(),
      projectLimit: projectLimit.toString(),
    });
    if (ticketProjectId) {
      params.set('ticketProjectId', ticketProjectId);
    }
    if (ticketReportedByMe) {
      params.set('ticketReportedByMe', 'true');
    }
    const response = await apiClient<{ data: ClientDashboardResponse }>(
      `/client/dashboard?${params}`,
      { method: 'GET' },
    );
    return response.data;
  },
};
