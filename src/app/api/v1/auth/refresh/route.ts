import { NextResponse } from 'next/server';

import { authService } from '@/services/auth/auth.service';
import {
  clearRefreshTokenCookie,
  getRefreshTokenCookie,
  setRefreshTokenCookie,
} from '@/lib/auth/cookies';
import { InvalidTokenError, MissingTokenError } from '@/lib/errors/auth-errors';
import { withErrorHandler } from '@/lib/errors/global-handler';

export const POST = withErrorHandler(async () => {
  const refreshToken = await getRefreshTokenCookie();

  if (!refreshToken) {
    throw new MissingTokenError('Refresh token missing');
  }

  try {
    const parts = refreshToken.split(':');
    if (parts.length !== 2) {
      throw new InvalidTokenError('Malformed refresh token');
    }

    const [sessionId, rawToken] = parts;
    const result = await authService.refresh(sessionId, rawToken);

    await setRefreshTokenCookie(result.tokens.refreshToken);

    return NextResponse.json({
      accessToken: result.tokens.accessToken,
    });
  } catch (error) {
    await clearRefreshTokenCookie();
    throw error;
  }
});
