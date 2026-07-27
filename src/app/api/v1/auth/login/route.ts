import { NextResponse } from 'next/server';

import { LoginSchema } from '@/validations/auth';

import { authService } from '@/services/auth/auth.service';
import { setRefreshTokenCookie } from '@/lib/auth/cookies';
import { withErrorHandler } from '@/lib/errors/global-handler';

export const POST = withErrorHandler(async (req: Request) => {
  const body = await req.json();
  const data = LoginSchema.parse(body);

  const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;
  const userAgent = req.headers.get('user-agent') || undefined;

  const result = await authService.login(data.email, data.password, ipAddress, userAgent);

  await setRefreshTokenCookie(result.tokens.refreshToken);

  // Return user without password
  const { password, ...userWithoutPassword } = result.user;

  return NextResponse.json({
    user: userWithoutPassword,
    accessToken: result.tokens.accessToken,
  });
});
