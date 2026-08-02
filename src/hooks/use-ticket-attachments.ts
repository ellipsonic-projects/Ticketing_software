import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { apiClient } from '@/services/api/api-client';

const fetchTicketAttachments = async (ticketId: string) => {
  const res = await apiClient<{ data: { attachments: any[] } }>(`/tickets/${ticketId}/attachments`);
  return res.data.attachments;
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
      // 1. Get presigned URL
      const presignRes = await apiClient<{ data: { url: string; key: string; publicUrl: string } }>(
        `/tickets/${ticketId}/attachments/presign`,
        {
          method: 'POST',
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type || 'application/octet-stream',
          }),
        },
      );

      const { url, publicUrl } = presignRes.data;

      // 2. Upload file directly to S3 using PUT
      const uploadRes = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to upload file to S3');
      }

      // 3. Save attachment metadata to database
      const saveRes = await apiClient<{ data: { attachment: any } }>(
        `/tickets/${ticketId}/attachments`,
        {
          method: 'POST',
          body: JSON.stringify({
            filename: file.name,
            size: file.size,
            mimeType: file.type || 'application/octet-stream',
            url: publicUrl,
          }),
        },
      );

      return saveRes.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets', ticketId, 'attachments'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', ticketId, 'timeline'] });
    },
  });
}
