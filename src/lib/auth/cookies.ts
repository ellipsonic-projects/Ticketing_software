import { cookies } from 'next/headers';

import { env } from '@/config/env';

export const REFRESH_TOKEN_COOKIE = 'refreshToken';

export async function setRefreshTokenCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(REFRESH_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
}

export async function clearRefreshTokenCookie() {
  const cookieStore = await cookies();

  cookieStore.set(REFRESH_TOKEN_COOKIE, '', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export async function getRefreshTokenCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
}
