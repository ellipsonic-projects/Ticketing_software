import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const fetchTicketAttachments = async (ticketId: string) => {
  const res = await fetch(`/api/v1/tickets/${ticketId}/attachments`);
  if (!res.ok) throw new Error('Failed to fetch attachments');
  const json = await res.json();
  return json.data.attachments;
};

export function useTicketAttachments(ticketId: string) {
  return useQuery({
    queryKey: ['tickets', ticketId, 'attachments'],
    queryFn: () => fetchTicketAttachments(ticketId),
    staleTime: 60000,
  });
}

export function useUploadAttachment(ticketId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch(`/api/v1/tickets/${ticketId}/attachments`, {
        method: 'POST',
        body: formData, // Browser sets Content-Type automatically for FormData
      });
      if (!res.ok) throw new Error('Failed to upload attachment');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets', ticketId, 'attachments'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', ticketId, 'timeline'] });
    },
  });
}
