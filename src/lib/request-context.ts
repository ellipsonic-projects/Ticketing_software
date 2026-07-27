import { AsyncLocalStorage } from 'node:async_hooks';

import { AuthContext } from './auth/auth-context';
import { logger } from './logger';

export interface RequestContextOptions {
  tenantId?: string;
  userId?: string;
  requestId?: string;
  correlationId?: string;
  identity?: AuthContext | null;
}

export class RequestContext {
  public readonly tenantId?: string;
  public readonly userId?: string;
  public readonly requestId: string;
  public readonly correlationId?: string;
  public readonly identity?: AuthContext | null;
  public readonly logger: typeof logger;

  constructor(options: RequestContextOptions = {}) {
    this.tenantId = options.tenantId;
    this.userId = options.userId;
    this.requestId = options.requestId || crypto.randomUUID();
    this.correlationId = options.correlationId;
    this.identity = options.identity;
    this.logger = logger;
  }
}

export const requestContextStore = new AsyncLocalStorage<RequestContext>();

export function getRequestContext(): RequestContext | undefined {
  return requestContextStore.getStore();
}

/**
 * Resolves the authenticated identity from the current request context.
 * Returns undefined if no user is authenticated.
 */
export function getCurrentUser(): AuthContext | undefined {
  return getRequestContext()?.identity ?? undefined;
}
