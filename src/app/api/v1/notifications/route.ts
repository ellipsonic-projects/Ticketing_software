import { NextRequest, NextResponse } from 'next/server';

import { authenticate } from '@/middleware/authenticate';

import { NotificationService } from '@/services/notifications/notification.service';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';

export const GET = withErrorHandler(
  authenticate(async (req: NextRequest) => {
    const ctx = getRequestContext();
    const userId = ctx?.identity?.id;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const notifications = await NotificationService.getUserNotifications(userId);
    const unreadCount = await NotificationService.getUnreadCount(userId);

    return NextResponse.json({
      data: notifications,
      meta: { unreadCount },
    });
  }),
);
