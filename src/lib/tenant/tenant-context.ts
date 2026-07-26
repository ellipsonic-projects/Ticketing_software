import { TenantRequiredError } from '../errors/tenant-required-error';
import { getRequestContext } from '../request-context';

/**
 * Safely fetches the tenant ID from the active context.
 * Throws a TenantRequiredError if missing.
 */
export function requireTenantContext(): string {
  const ctx = getRequestContext();
  if (!ctx?.tenantId) {
    throw new TenantRequiredError();
  }
  return ctx.tenantId;
}
