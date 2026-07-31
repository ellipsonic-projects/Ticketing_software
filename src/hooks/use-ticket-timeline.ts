import { useQuery } from '@tanstack/react-query';

const fetchTicketTimeline = async (ticketId: string) => {
  const res = await fetch(`/api/v1/tickets/${ticketId}/timeline`);
  if (!res.ok) throw new Error('Failed to fetch timeline');
  const json = await res.json();
  return json.data.events;
};

export function useTicketTimeline(ticketId: string) {
  return useQuery({
    queryKey: ['tickets', ticketId, 'timeline'],
    queryFn: () => fetchTicketTimeline(ticketId),
    staleTime: 60000,
  });
}
