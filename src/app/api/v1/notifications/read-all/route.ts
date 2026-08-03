import { NextRequest, NextResponse } from 'next/server';

import { authenticate } from '@/middleware/authenticate';

import { NotificationService } from '@/services/notifications/notification.service';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';

export const POST = withErrorHandler(
  authenticate(async (req: NextRequest) => {
    const ctx = getRequestContext();
    const userId = ctx?.identity?.id;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const result = await NotificationService.markAllAsRead(userId);

    return NextResponse.json({ data: { count: result.count } });
  }),
);
