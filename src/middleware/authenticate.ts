import { NextRequest } from 'next/server';

import { authService } from '@/services/auth/auth.service';
import {
  InvalidTenantContextError,
  MissingTokenError,
  MustChangePasswordError,
} from '@/lib/errors/auth-errors';
import { getRequestContext, RequestContext, requestContextStore } from '@/lib/request-context';

/**
 * Extracts Bearer token from the Authorization header.
 */
function extractBearerToken(req: NextRequest): string | undefined {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return undefined;
}

/**
 * Type for Next.js App Router dynamic segment context.
 * Route handlers should use this type for their second parameter when they need typed params.
 *
 * @example
 * authenticate(async (req, ctx) => {
 *   const { id } = await ctx!.params;
 * })
 */
export type RouteContext<P extends Record<string, string> = Record<string, string>> = {
  params: Promise<P>;
};

/**
 * HOC that enforces authentication on API routes.
 * Populates RequestContext with the verified user identity.
 */
export function authenticate(handler: (req: NextRequest, ctx?: RouteContext) => Promise<Response>) {
  return async (req: NextRequest, ctx?: RouteContext): Promise<Response> => {
    const token = extractBearerToken(req);
    if (!token) {
      throw new MissingTokenError();
    }

    const payload = await authService.authenticate(token);

    if (
      payload.mustChangePassword &&
      !req.nextUrl.pathname.startsWith('/api/v1/auth/change-password') &&
      !req.nextUrl.pathname.startsWith('/api/v1/auth/logout')
    ) {
      throw new MustChangePasswordError();
    }

    const currentContext = getRequestContext();
    if (!currentContext) {
      throw new Error(
        'RequestContext is missing. Ensure authenticate is used inside withErrorHandler.',
      );
    }

    if (currentContext.tenantId && currentContext.tenantId !== payload.tenantId) {
      throw new InvalidTenantContextError();
    }

    const newContext = new RequestContext({
      tenantId: currentContext.tenantId || payload.tenantId || undefined,
      userId: payload.sub,
      requestId: currentContext.requestId,
      correlationId: currentContext.correlationId,
      identity: {
        id: payload.sub,
        tenantId: payload.tenantId,
        role: payload.role,
        sessionId: payload.sessionId,
      },
    });

    return requestContextStore.run(newContext, () => handler(req, ctx));
  };
}

/**
 * HOC that optionally authenticates the user.
 * Populates RequestContext if a valid token is present; proceeds unauthenticated if not.
 */
export function optionalAuthenticate(
  handler: (req: NextRequest, ctx?: RouteContext) => Promise<Response>,
) {
  return async (req: NextRequest, ctx?: RouteContext): Promise<Response> => {
    const token = extractBearerToken(req);

    if (!token) {
      return handler(req, ctx);
    }

    try {
      const payload = await authService.authenticate(token);
      const currentContext = getRequestContext();

      if (currentContext) {
        if (currentContext.tenantId && currentContext.tenantId !== payload.tenantId) {
          throw new InvalidTenantContextError();
        }

        const newContext = new RequestContext({
          tenantId: currentContext.tenantId || payload.tenantId || undefined,
          userId: payload.sub,
          requestId: currentContext.requestId,
          correlationId: currentContext.correlationId,
          identity: {
            id: payload.sub,
            tenantId: payload.tenantId,
            role: payload.role,
            sessionId: payload.sessionId,
          },
        });

        return requestContextStore.run(newContext, () => handler(req, ctx));
      }
    } catch {
      // Ignore errors — optional authentication degrades gracefully
    }

    return handler(req, ctx);
  };
}
