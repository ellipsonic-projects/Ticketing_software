import { NextRequest, NextResponse } from 'next/server';

import { ROLES } from '@/lib/auth';
import { CreateClientSchema, ClientQuerySchema } from '@/lib/client/client.schema';

import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { ValidationError } from '@/lib/errors/validation-error';
import { authenticate, RouteContext } from '@/middleware/authenticate';
import { clientService } from '@/services/client/client.service';
import { getRequestContext } from '@/lib/request-context';

async function getClientsHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const identity = reqCtx!.identity!;
  if (!identity.tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  const { searchParams } = new URL(req.url);
  const queryResult = ClientQuerySchema.safeParse({
    page: searchParams.get('page') || undefined,
    limit: searchParams.get('limit') || undefined,
    search: searchParams.get('search') || undefined,
    status: searchParams.get('status') || undefined,
    sort: searchParams.get('sort') || undefined,
    order: searchParams.get('order') || undefined,
  });

  if (!queryResult.success) {
    throw new ValidationError(
      queryResult.error.issues.map(i => ({ field: i.path.join('.'), message: i.message })),
      'Invalid query parameters'
    );
  }

  const result = await clientService.getClients(identity.tenantId, queryResult.data);
  return NextResponse.json(result);
}

async function createClientHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const identity = reqCtx!.identity!;
  if (!identity.tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  if (identity.role !== ROLES.TENANT_ADMIN && identity.role !== ROLES.PLATFORM_ADMIN) {
    throw new ForbiddenError('Only Tenant Admins can create clients');
  }

  const body = await req.json();
  const parseResult = CreateClientSchema.safeParse(body);

  if (!parseResult.success) {
    throw new ValidationError(
      parseResult.error.issues.map(i => ({ field: i.path.join('.'), message: i.message })),
      'Invalid client data'
    );
  }

  const client = await clientService.createClient(
    identity.tenantId,
    parseResult.data,
    identity.id,
  );

  return NextResponse.json({ client }, { status: 201 });
}

export const GET = withErrorHandler(authenticate(getClientsHandler));
export const POST = withErrorHandler(authenticate(createClientHandler));
