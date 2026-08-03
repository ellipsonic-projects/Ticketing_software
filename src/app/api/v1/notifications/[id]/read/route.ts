import { NextRequest, NextResponse } from 'next/server';

import { authenticate, RouteContext } from '@/middleware/authenticate';

import { NotificationService } from '@/services/notifications/notification.service';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';

export const PATCH = withErrorHandler(
  authenticate(async (req: NextRequest, ctx?: RouteContext) => {
    const params = await ctx?.params;
    const id = params?.id;
    if (!id) throw new Error('Missing ID');
    const reqCtx = getRequestContext();
    const userId = reqCtx?.identity?.id;

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const notification = await NotificationService.markAsRead(id, userId);

    return NextResponse.json({ data: notification });
  }),
);
