import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@/services/api/api-client';

const fetchTicketTimeline = async (ticketId: string) => {
  const res = await apiClient<{ data: { events: any[] } }>(`/tickets/${ticketId}/timeline`);
  return res.data.events;
};

export function useTicketTimeline(ticketId: string) {
  return useQuery({
    queryKey: ['tickets', ticketId, 'timeline'],
    queryFn: () => fetchTicketTimeline(ticketId),
    staleTime: 60000,
  });
}
