import { Prisma } from '@prisma/client';

import { notificationRepository } from '@/repositories/notifications/notification.repository';

export class NotificationService {
  static async createNotification(data: Prisma.NotificationUncheckedCreateInput) {
    return notificationRepository.create(data);
  }

  static async getUserNotifications(userId: string) {
    return notificationRepository.findManyByUserId(userId);
  }

  static async getUnreadCount(userId: string) {
    return notificationRepository.getUnreadCount(userId);
  }

  static async markAsRead(id: string, userId: string) {
    return notificationRepository.markAsRead(id, userId);
  }

  static async markAllAsRead(userId: string) {
    return notificationRepository.markAllAsRead(userId);
  }
}
