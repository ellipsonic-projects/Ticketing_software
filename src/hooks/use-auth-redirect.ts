'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@/hooks/use-auth';

// ---------------------------------------------------------------------------
// Auth-flow pages that must NEVER be redirect targets — keeps symmetry
// with the same list in middleware.ts.
// ---------------------------------------------------------------------------
const AUTH_FLOW_PATHS = [
  '/auth/change-password',
  '/auth/accept-invitation',
  '/auth/reset-password',
  '/auth/session-expired',
  '/auth/login',
];

/**
 * useAuthRedirect
 *
 * Handles redirecting the user to /auth/login when they are confirmed to be
 * unauthenticated at the React layer (token expired mid-session, etc.) or
 * when they lack the required role for the current layout.
 *
 * Edge-cases handled:
 * - isLoading === true  → do nothing, wait for auth to resolve
 * - Already on an auth-flow page → do nothing, avoids infinite loops
 * - allowedRoles is empty/undefined → only checks authentication (not role)
 */
export function useAuthRedirect(allowedRoles?: string[]) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Still bootstrapping — wait for refresh to complete
    if (isLoading) return;

    // Already on an auth-flow page — never redirect from these
    const isAuthFlowPage = AUTH_FLOW_PATHS.some((p) => pathname.startsWith(p));
    if (isAuthFlowPage) return;

    // Not authenticated at all → redirect to login, preserving intended destination
    if (!user) {
      const loginUrl = `/auth/login?redirect=${encodeURIComponent(pathname)}`;
      router.replace(loginUrl);
      return;
    }

    // Authenticated but wrong role → redirect to login (not their section)
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      const loginUrl = `/auth/login?redirect=${encodeURIComponent(pathname)}`;
      router.replace(loginUrl);
    }
  }, [isLoading, user, allowedRoles, pathname, router]);

  return { user, isLoading };
}
