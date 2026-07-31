import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/services/api/api-client';
import { useAuth } from '@/hooks/use-auth';

export interface ClientOverviewStats {
  totalProjects: number;
  totalTickets: number;
  engineersCount: number;
  slaHealthPercent: number;
  lastActivity: string;
}

export function useClientOverviewStats(clientId: string) {
  const { isAuthenticated } = useAuth();
  
  return useQuery<ClientOverviewStats, Error>({
    queryKey: ['client-stats', clientId],
    queryFn: async () => {
      const data = await apiClient<ClientOverviewStats>(`/clients/${clientId}/stats`, {
        method: 'GET'
      });
      return data;
    },
    enabled: !!clientId && isAuthenticated,
  });
}
