import { NextRequest, NextResponse } from 'next/server';
import { ROLES } from '@/lib/auth';
import { SLAPolicySchema } from '@/lib/project/sla.schema';
import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { ValidationError } from '@/lib/errors/validation-error';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { authenticate, RouteContext } from '@/middleware/authenticate';
import { slaService } from '@/services/project/sla.service';
import { getRequestContext } from '@/lib/request-context';

async function getSLAHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const identity = reqCtx!.identity!;
  if (!identity.tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  const { id } = await ctx!.params;
  const policy = await slaService.getPolicy(identity.tenantId, id);

  return NextResponse.json({ policy });
}

async function upsertSLAHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const identity = reqCtx!.identity!;
  if (!identity.tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  // Only Tenant Admins and Platform Admins can configure SLA
  if (identity.role !== ROLES.TENANT_ADMIN && identity.role !== ROLES.PLATFORM_ADMIN) {
    throw new ForbiddenError('Only Tenant Admins can configure SLA');
  }

  const { id } = await ctx!.params;
  const body = await req.json();
  const parseResult = SLAPolicySchema.safeParse(body);

  if (!parseResult.success) {
    throw new ValidationError(
      parseResult.error.issues.map(i => ({ field: i.path.join('.'), message: i.message })),
      'Invalid SLA policy data'
    );
  }

  const policy = await slaService.upsertPolicy(
    identity.tenantId,
    id,
    parseResult.data,
    identity.id
  );

  return NextResponse.json({ policy });
}

export const GET = withErrorHandler(authenticate(getSLAHandler));
export const PUT = withErrorHandler(authenticate(upsertSLAHandler));
