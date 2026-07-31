import { NextRequest, NextResponse } from 'next/server';
import { ROLES } from '@/lib/auth';
import { BusinessHoursSchema } from '@/lib/project/sla.schema';
import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { ValidationError } from '@/lib/errors/validation-error';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { authenticate, RouteContext } from '@/middleware/authenticate';
import { businessHoursService } from '@/services/project/business-hours.service';
import { getRequestContext } from '@/lib/request-context';

async function getBusinessHoursHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const identity = reqCtx!.identity!;
  if (!identity.tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  const { id } = await ctx!.params;
  const businessHours = await businessHoursService.getByProject(identity.tenantId, id);

  return NextResponse.json({ businessHours });
}

async function updateBusinessHoursHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const identity = reqCtx!.identity!;
  if (!identity.tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  // Only Tenant Admins and Platform Admins can configure Business Hours
  if (identity.role !== ROLES.TENANT_ADMIN && identity.role !== ROLES.PLATFORM_ADMIN) {
    throw new ForbiddenError('Only Tenant Admins can configure Business Hours');
  }

  const { id } = await ctx!.params;
  const body = await req.json();
  const parseResult = BusinessHoursSchema.safeParse(body);

  if (!parseResult.success) {
    throw new ValidationError(
      parseResult.error.issues.map(i => ({ field: i.path.join('.'), message: i.message })),
      'Invalid Business Hours data'
    );
  }

  const businessHours = await businessHoursService.replaceSchedule(
    identity.tenantId,
    id,
    parseResult.data,
    identity.id
  );

  return NextResponse.json({ businessHours });
}

export const GET = withErrorHandler(authenticate(getBusinessHoursHandler));
export const PUT = withErrorHandler(authenticate(updateBusinessHoursHandler));
