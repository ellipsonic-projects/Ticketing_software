import { ClientDashboardResponse } from '@/lib/client-dashboard/client-dashboard.types';

import { apiClient } from './api-client';

export const clientDashboardApi = {
  getDashboard: async (page = 1, limit = 6): Promise<ClientDashboardResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const response = await apiClient<{ data: ClientDashboardResponse }>(
      `/client/dashboard?${params}`,
      { method: 'GET' },
    );
    return response.data;
  },
};
