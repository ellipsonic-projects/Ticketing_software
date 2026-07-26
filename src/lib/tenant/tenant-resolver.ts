import { NextRequest } from 'next/server';

/**
 * Resolves the tenant ID from the incoming request.
 * Currently supports the X-Tenant-Id header.
 * Future: Subdomain or JWT claims.
 */
export function resolveTenantId(req: NextRequest): string | undefined {
  return req.headers.get('x-tenant-id') || undefined;
}
