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
 * HOC that enforces authentication on API routes.
 */
export function authenticate(handler: (req: NextRequest, ...args: unknown[]) => Promise<Response>) {
  return async (req: NextRequest, ...args: unknown[]): Promise<Response> => {
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

    return requestContextStore.run(newContext, async () => {
      return handler(req, ...args);
    });
  };
}

/**
 * HOC that optionally authenticates the user, populating the context if a token exists.
 */
export function optionalAuthenticate(
  handler: (req: NextRequest, ...args: unknown[]) => Promise<Response>,
) {
  return async (req: NextRequest, ...args: unknown[]): Promise<Response> => {
    const token = extractBearerToken(req);

    if (!token) {
      return handler(req, ...args);
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

        return requestContextStore.run(newContext, async () => {
          return handler(req, ...args);
        });
      }
    } catch {
      // Ignore errors for optional authentication
    }

    return handler(req, ...args);
  };
}
