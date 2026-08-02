import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { REFRESH_TOKEN_COOKIE } from '@/lib/auth/cookies';

// ---------------------------------------------------------------------------
// Routes that require a valid session to access
// ---------------------------------------------------------------------------
const protectedPaths = [
  '/dashboard',
  '/account',
  '/admin',
  '/tenant',
  '/engineer',
  '/tickets',
  '/platform',
  '/users',
  '/client',
  '/projects',
  '/clients',
  '/profile',
];

// ---------------------------------------------------------------------------
// Routes only for unauthenticated (guest) users.
// Authenticated users visiting these are redirected away.
// ---------------------------------------------------------------------------
const guestOnlyPaths = ['/auth/login', '/auth/register', '/auth/forgot-password'];

// ---------------------------------------------------------------------------
// Auth-flow paths that must NEVER trigger a guest-redirect even when the
// user has a refresh cookie (e.g., forced password-change after first login,
// accepting an invitation, resetting a password, or an expired session page).
// ---------------------------------------------------------------------------
const authFlowPaths = [
  '/auth/change-password',
  '/auth/accept-invitation',
  '/auth/reset-password',
  '/auth/session-expired',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes and static assets
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const hasRefreshToken = request.cookies.has(REFRESH_TOKEN_COOKIE);

  // Always allow auth-flow pages — these must never be blocked or redirect-looped.
  // e.g. user is forced to /auth/change-password after first login: still has a cookie.
  const isAuthFlowPath = authFlowPaths.some((path) => pathname.startsWith(path));
  if (isAuthFlowPath) {
    return NextResponse.next();
  }

  // Unauthenticated user hitting a protected route → send to login with ?redirect=
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));
  if (isProtectedPath && !hasRefreshToken) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Authenticated user hitting a guest-only route → send to home
  const isGuestOnlyPath = guestOnlyPaths.some((path) => pathname.startsWith(path));
  if (isGuestOnlyPath && hasRefreshToken) {
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
