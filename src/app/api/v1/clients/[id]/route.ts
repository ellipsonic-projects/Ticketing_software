import { NextRequest, NextResponse } from 'next/server';

import { ROLES } from '@/lib/auth';
import { UpdateClientSchema } from '@/lib/client/client.schema';

import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { ValidationError } from '@/lib/errors/validation-error';
import { authenticate, RouteContext } from '@/middleware/authenticate';
import { clientService } from '@/services/client/client.service';
import { getRequestContext } from '@/lib/request-context';

async function getClientHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const identity = reqCtx!.identity!;
  if (!identity.tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  const { id } = await ctx!.params;
  const client = await clientService.getClientById(identity.tenantId, id);

  return NextResponse.json({ client });
}

async function updateClientHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const identity = reqCtx!.identity!;
  if (!identity.tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  if (identity.role !== ROLES.TENANT_ADMIN && identity.role !== ROLES.PLATFORM_ADMIN) {
    throw new ForbiddenError('Only Tenant Admins can update clients');
  }

  const { id } = await ctx!.params;
  const body = await req.json();
  const parseResult = UpdateClientSchema.safeParse(body);

  if (!parseResult.success) {
    throw new ValidationError(
      parseResult.error.issues.map(i => ({ field: i.path.join('.'), message: i.message })),
      'Invalid client data'
    );
  }

  const client = await clientService.updateClient(
    identity.tenantId,
    id,
    parseResult.data,
    identity.id,
  );

  return NextResponse.json({ client });
}

async function deleteClientHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const identity = reqCtx!.identity!;
  if (!identity.tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  if (identity.role !== ROLES.TENANT_ADMIN && identity.role !== ROLES.PLATFORM_ADMIN) {
    throw new ForbiddenError('Only Tenant Admins can delete clients');
  }

  const { id } = await ctx!.params;
  
  await clientService.archiveClient(identity.tenantId, id, identity.id);

  return NextResponse.json({ message: 'Client deleted successfully' });
}

export const GET = withErrorHandler(authenticate(getClientHandler));
export const PATCH = withErrorHandler(authenticate(updateClientHandler));
export const DELETE = withErrorHandler(authenticate(deleteClientHandler));
