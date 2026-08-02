import { NextRequest, NextResponse } from 'next/server';

import { authenticate, RouteContext } from '@/middleware/authenticate';

import { holidayService } from '@/services/project/holiday.service';
import { ROLES } from '@/lib/auth';
import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { ValidationError } from '@/lib/errors/validation-error';
import { HolidayUpdateSchema } from '@/lib/project/sla.schema';
import { getRequestContext } from '@/lib/request-context';

async function updateHolidayHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const identity = reqCtx!.identity!;
  if (!identity.tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  // Only Tenant Admins and Platform Admins can configure Holidays
  if (identity.role !== ROLES.TENANT_ADMIN && identity.role !== ROLES.PLATFORM_ADMIN) {
    throw new ForbiddenError('Only Tenant Admins can configure Holidays');
  }

  const { id, holidayId } = await ctx!.params;
  const body = await req.json();
  const parseResult = HolidayUpdateSchema.safeParse(body);

  if (!parseResult.success) {
    throw new ValidationError(
      parseResult.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      'Invalid Holiday data',
    );
  }

  const holiday = await holidayService.update(
    identity.tenantId,
    id,
    holidayId,
    parseResult.data,
    identity.id,
  );

  return NextResponse.json({ holiday });
}

async function deleteHolidayHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const identity = reqCtx!.identity!;
  if (!identity.tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  // Only Tenant Admins and Platform Admins can configure Holidays
  if (identity.role !== ROLES.TENANT_ADMIN && identity.role !== ROLES.PLATFORM_ADMIN) {
    throw new ForbiddenError('Only Tenant Admins can configure Holidays');
  }

  const { id, holidayId } = await ctx!.params;

  await holidayService.delete(identity.tenantId, id, holidayId, identity.id);

  return new NextResponse(null, { status: 204 });
}

export const PATCH = withErrorHandler(authenticate(updateHolidayHandler));
export const DELETE = withErrorHandler(authenticate(deleteHolidayHandler));
