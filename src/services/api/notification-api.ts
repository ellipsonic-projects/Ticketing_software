import { Notification } from '@prisma/client';

import { apiClient } from './api-client';

export interface NotificationMeta {
  unreadCount: number;
}

export const notificationApi = {
  getNotifications: async (token: string) => {
    return apiClient<{ data: Notification[]; meta: NotificationMeta }>('/notifications', { token });
  },

  markAsRead: async (id: string, token: string) => {
    return apiClient<{ data: Notification }>(`/notifications/${id}/read`, {
      method: 'PATCH',
      token,
    });
  },

  markAllAsRead: async (token: string) => {
    return apiClient<{ data: { count: number } }>('/notifications/read-all', {
      method: 'POST',
      token,
    });
  },
};
