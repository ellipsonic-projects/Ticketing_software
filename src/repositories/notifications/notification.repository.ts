import { Notification, Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';

export class NotificationRepository {
  async create(
    data: Prisma.NotificationUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Notification> {
    const db = tx || prisma;
    return db.notification.create({ data });
  }

  async findManyByUserId(userId: string, tx?: Prisma.TransactionClient): Promise<Notification[]> {
    const db = tx || prisma;
    return db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(
    id: string,
    userId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Notification> {
    const db = tx || prisma;
    return db.notification.update({
      where: { id, userId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: string, tx?: Prisma.TransactionClient): Promise<Prisma.BatchPayload> {
    const db = tx || prisma;
    return db.notification.updateMany({
      where: { userId, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async getUnreadCount(userId: string, tx?: Prisma.TransactionClient): Promise<number> {
    const db = tx || prisma;
    return db.notification.count({
      where: { userId, isRead: false },
    });
  }
}

export const notificationRepository = new NotificationRepository();
