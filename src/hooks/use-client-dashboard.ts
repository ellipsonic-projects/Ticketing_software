import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { clientDashboardApi } from '@/services/api/client-dashboard-api';
import { ClientDashboardTicketSort } from '@/lib/client-dashboard/client-dashboard.types';

export function useClientDashboard(
  page = 1,
  limit = 6,
  ticketSort: ClientDashboardTicketSort = 'updatedAt',
  ticketOrder: 'asc' | 'desc' = 'desc',
  ticketProjectId?: string,
  ticketReportedByMe = false,
  projectPage = 1,
  projectLimit = 6,
) {
  return useQuery({
    queryKey: [
      'client-dashboard',
      page,
      limit,
      ticketSort,
      ticketOrder,
      ticketProjectId,
      ticketReportedByMe,
      projectPage,
      projectLimit,
    ],
    queryFn: () =>
      clientDashboardApi.getDashboard(
        page,
        limit,
        ticketSort,
        ticketOrder,
        ticketProjectId,
        ticketReportedByMe,
        projectPage,
        projectLimit,
      ),
    placeholderData: keepPreviousData,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
