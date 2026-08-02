import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/services/api/api-client';
import { CreateCommentInput } from '@/lib/ticket/ticket.schema';

const fetchTicketComments = async (ticketId: string) => {
  const res = await apiClient<{ data: { comments: any[] } }>(`/tickets/${ticketId}/comments`);
  return res.data.comments;
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
      const res = await apiClient<{ data: { comment: any } }>(`/tickets/${ticketId}/comments`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets', ticketId, 'comments'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', ticketId, 'timeline'] });
    },
  });
}
