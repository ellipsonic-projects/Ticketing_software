import { AsyncLocalStorage } from 'node:async_hooks';

import { logger } from './logger';

export interface RequestContextOptions {
  tenantId?: string;
  userId?: string;
  requestId?: string;
  correlationId?: string;
}

export class RequestContext {
  public readonly tenantId?: string;
  public readonly userId?: string;
  public readonly requestId: string;
  public readonly correlationId?: string;
  public readonly logger: typeof logger;

  constructor(options: RequestContextOptions = {}) {
    this.tenantId = options.tenantId;
    this.userId = options.userId;
    this.requestId = options.requestId || crypto.randomUUID();
    this.correlationId = options.correlationId;
    this.logger = logger;
  }
}

export const requestContextStore = new AsyncLocalStorage<RequestContext>();

export function getRequestContext(): RequestContext | undefined {
  return requestContextStore.getStore();
}
