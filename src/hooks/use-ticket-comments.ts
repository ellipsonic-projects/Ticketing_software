import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateCommentInput } from '@/lib/ticket/ticket.schema';

const fetchTicketComments = async (ticketId: string) => {
  const res = await fetch(`/api/v1/tickets/${ticketId}/comments`);
  if (!res.ok) throw new Error('Failed to fetch comments');
  const json = await res.json();
  return json.data.comments;
};

export function useTicketComments(ticketId: string) {
  return useQuery({
    queryKey: ['tickets', ticketId, 'comments'],
    queryFn: () => fetchTicketComments(ticketId),
    staleTime: 10000, // Shorter stale time for comments
  });
}

export function useCreateComment(ticketId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateCommentInput) => {
      const res = await fetch(`/api/v1/tickets/${ticketId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to add comment');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets', ticketId, 'comments'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', ticketId, 'timeline'] });
    },
  });
}
