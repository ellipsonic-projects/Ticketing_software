import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { notificationApi } from '@/services/api/notification-api';

export function useNotifications(token: string) {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationApi.getNotifications(token),
    enabled: !!token,
    // Poll every minute to keep unread counts fresh
    refetchInterval: 60000,
  });
}

export function useMarkNotificationAsRead(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsAsRead(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationApi.markAllAsRead(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
