import { getRequestContext } from '../request-context';

/**
 * Injects contextual information (like requestId and tenantId)
 * from the active RequestContext into the log metadata.
 */
export function injectContext(meta?: Record<string, unknown>): Record<string, unknown> {
  const ctx = getRequestContext();
  if (!ctx) return meta || {};

  return {
    requestId: ctx.requestId,
    tenantId: ctx.tenantId,
    ...meta,
  };
}
