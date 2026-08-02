import { useQuery } from '@tanstack/react-query';

import { clientDashboardApi } from '@/services/api/client-dashboard-api';

export function useClientDashboard(page = 1, limit = 6) {
  return useQuery({
    queryKey: ['client-dashboard', page, limit],
    queryFn: () => clientDashboardApi.getDashboard(page, limit),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
