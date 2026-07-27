import { NextResponse } from 'next/server';

import { authenticate } from '@/middleware/authenticate';

import { authService } from '@/services/auth/auth.service';
import { clearRefreshTokenCookie } from '@/lib/auth/cookies';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';

export const POST = withErrorHandler(
  authenticate(async () => {
    const ctx = getRequestContext();

    if (ctx?.identity?.sessionId) {
      await authService.logout(ctx.identity.sessionId);
    }

    await clearRefreshTokenCookie();

    return NextResponse.json({ success: true });
  }),
);
