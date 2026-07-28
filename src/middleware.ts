import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { REFRESH_TOKEN_COOKIE } from '@/lib/auth/cookies';

// Add paths that require authentication here
const protectedPaths = [
  '/account',
  '/admin',
  '/tenant',
  '/engineer',
  '/tickets',
  '/platform',
  '/users',
];

// Add paths that are only for guests (unauthenticated users)
const guestPaths = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes and static assets
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const hasRefreshToken = request.cookies.has(REFRESH_TOKEN_COOKIE);

  // Protect authenticated routes
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));
  if (isProtectedPath && !hasRefreshToken) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from guest routes
  const isGuestPath = guestPaths.some((path) => pathname.startsWith(path));
  if (isGuestPath && hasRefreshToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
