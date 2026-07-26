import { NextRequest } from 'next/server';

import { prisma } from '@/lib/db';
import { TenantInactiveError } from '@/lib/errors/tenant-inactive-error';
import { TenantNotFoundError } from '@/lib/errors/tenant-not-found-error';
import { TenantRequiredError } from '@/lib/errors/tenant-required-error';
import { getRequestContext, RequestContext, requestContextStore } from '@/lib/request-context';
import { resolveTenantId } from '@/lib/tenant';

export function withTenant(handler: (req: NextRequest, ...args: unknown[]) => Promise<Response>) {
  return async (req: NextRequest, ...args: unknown[]): Promise<Response> => {
    const tenantId = resolveTenantId(req);
    if (!tenantId) {
      throw new TenantRequiredError();
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new TenantNotFoundError();
    }

    if (tenant.status !== 'ACTIVE') {
      throw new TenantInactiveError();
    }

    const currentContext = getRequestContext();
    if (!currentContext) {
      // If there is no existing RequestContext, it means withErrorHandler was not used
      // or withTenant is placed outside of withErrorHandler. We should fail safely.
      throw new Error(
        'RequestContext is missing. Ensure withTenant is used inside withErrorHandler.',
      );
    }

    // Create a new immutable context overriding the tenantId
    const newContext = new RequestContext({
      tenantId,
      userId: currentContext.userId,
      requestId: currentContext.requestId,
      correlationId: currentContext.correlationId,
    });

    return requestContextStore.run(newContext, async () => {
      return handler(req, ...args);
    });
  };
}
