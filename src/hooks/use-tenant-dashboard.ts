import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/use-auth';
import { tenantDashboardApi } from '@/services/api/tenant-dashboard-api';

export function useTenantDashboard() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ['tenant-dashboard-stats'],
    queryFn: async () => {
      if (!accessToken) throw new Error('Not authenticated');
      const response = await tenantDashboardApi.getStats(accessToken);
      return response.data;
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}
