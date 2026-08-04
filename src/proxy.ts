import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { REFRESH_TOKEN_COOKIE } from '@/lib/auth/cookies';

// ---------------------------------------------------------------------------
// Rate Limiter Engine (In-Memory Fixed Window)
// ---------------------------------------------------------------------------

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

function passiveGarbageCollection() {
  if (Math.random() < 0.01) {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (record.resetAt < now) {
        rateLimitStore.delete(key);
      }
    }
  }
}

function applyRateLimit(identifier: string, limit: number, windowMs: number) {
  passiveGarbageCollection();

  const now = Date.now();
  let record = rateLimitStore.get(identifier);

  if (!record || record.resetAt < now) {
    record = { count: 0, resetAt: now + windowMs };
  }

  record.count += 1;
  rateLimitStore.set(identifier, record);

  const isAllowed = record.count <= limit;
  const remaining = Math.max(0, limit - record.count);
  const resetInSeconds = Math.ceil((record.resetAt - now) / 1000);

  return {
    isAllowed,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': resetInSeconds.toString(),
    },
  };
}

function tooManyRequestsResponse(headers: Record<string, string>) {
  return new NextResponse(
    JSON.stringify({
      statusCode: 429,
      errorCode: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later.',
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }
  );
}

function decodeJwtPayload(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Auth Routing Paths
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

const guestOnlyPaths = ['/auth/login', '/auth/register', '/auth/forgot-password'];

const authFlowPaths = [
  '/auth/change-password',
  '/auth/accept-invitation',
  '/auth/reset-password',
  '/auth/session-expired',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ---------------------------------------------------------------------------
  // RATE LIMITING for API Routes
  // ---------------------------------------------------------------------------
  if (pathname.startsWith('/api/v1/')) {
    const method = request.method;
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';

    let userId = 'anonymous';
    let role = 'ANONYMOUS';
    
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = decodeJwtPayload(token);
      if (payload) {
        userId = payload.sub || userId;
        role = payload.role || role;
      }
    }

    if (pathname === '/api/v1/auth/login' && method === 'POST') {
      const { isAllowed, headers } = applyRateLimit(`LOGIN:${ip}`, 5, 60 * 1000);
      if (!isAllowed) return tooManyRequestsResponse(headers);
    } 
    else if (pathname.includes('/otp/request') && method === 'POST') {
      const { isAllowed, headers } = applyRateLimit(`OTP_REQ:${ip}`, 3, 5 * 60 * 1000);
      if (!isAllowed) return tooManyRequestsResponse(headers);
    } 
    else if (pathname.includes('/otp/verify') && method === 'POST') {
      const { isAllowed, headers } = applyRateLimit(`OTP_VER:${ip}`, 10, 10 * 60 * 1000);
      if (!isAllowed) return tooManyRequestsResponse(headers);
    } 
    else if ((pathname.includes('forgot-password') || pathname.includes('reset-password')) && method === 'POST') {
      const { isAllowed, headers } = applyRateLimit(`PWD_RST:${ip}`, 3, 60 * 60 * 1000);
      if (!isAllowed) return tooManyRequestsResponse(headers);
    } 
    else if (pathname === '/api/v1/auth/refresh' && method === 'POST') {
      const { isAllowed, headers } = applyRateLimit(`REFRESH:${userId}`, 30, 60 * 1000);
      if (!isAllowed) return tooManyRequestsResponse(headers);
    }
    else if (pathname === '/api/v1/tickets' && method === 'POST') {
      const { isAllowed, headers } = applyRateLimit(`TKT_CREATE:${userId}`, 30, 60 * 60 * 1000);
      if (!isAllowed) return tooManyRequestsResponse(headers);
    }
    else if (pathname.includes('/attachments') && method === 'POST') {
      const { isAllowed, headers } = applyRateLimit(`FILE_UPLOAD:${userId}`, 20, 60 * 1000);
      if (!isAllowed) return tooManyRequestsResponse(headers);
    }
    else {
      let limitResponse;
      const isSearch = method === 'GET' && request.nextUrl.searchParams.has('search');
      const isAdminAction = role === 'PLATFORM_ADMIN' || role === 'TENANT_ADMIN' || pathname.startsWith('/api/v1/platform');

      if (userId === 'anonymous') {
        limitResponse = applyRateLimit(`PUBLIC_API:${ip}`, 100, 60 * 1000);
      } 
      else if (isAdminAction) {
        limitResponse = applyRateLimit(`ADMIN_ACTION:${userId}`, 120, 60 * 1000);
      } 
      else if (isSearch) {
        limitResponse = applyRateLimit(`SEARCH_API:${userId}`, 60, 60 * 1000);
      } 
      else if (method === 'GET') {
        limitResponse = applyRateLimit(`READ_API:${userId}`, 300, 60 * 1000);
      } 
      else {
        limitResponse = applyRateLimit(`WRITE_API:${userId}`, 60, 60 * 1000);
      }

      if (!limitResponse.isAllowed) {
        return tooManyRequestsResponse(limitResponse.headers);
      }
    }
    return NextResponse.next();
  }

  // ---------------------------------------------------------------------------
  // AUTH ROUTING for Pages
  // ---------------------------------------------------------------------------
  // Skip middleware for internal Next.js assets
  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const hasRefreshToken = request.cookies.has(REFRESH_TOKEN_COOKIE);

  const isAuthFlowPath = authFlowPaths.some((path) => pathname.startsWith(path));
  if (isAuthFlowPath) {
    return NextResponse.next();
  }

  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));
  if (isProtectedPath && !hasRefreshToken) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

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
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
