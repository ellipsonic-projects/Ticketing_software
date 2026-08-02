import { NextRequest, NextResponse } from 'next/server';

import { authenticate, RouteContext } from '@/middleware/authenticate';

import { holidayService } from '@/services/project/holiday.service';
import { ROLES } from '@/lib/auth';
import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { ValidationError } from '@/lib/errors/validation-error';
import { HolidayCreateSchema } from '@/lib/project/sla.schema';
import { getRequestContext } from '@/lib/request-context';

async function listHolidaysHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const identity = reqCtx!.identity!;
  if (!identity.tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  const { id } = await ctx!.params;
  const holidays = await holidayService.list(identity.tenantId, id);

  return NextResponse.json({ holidays });
}

async function createHolidayHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const identity = reqCtx!.identity!;
  if (!identity.tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  // Only Tenant Admins and Platform Admins can configure Holidays
  if (identity.role !== ROLES.TENANT_ADMIN && identity.role !== ROLES.PLATFORM_ADMIN) {
    throw new ForbiddenError('Only Tenant Admins can configure Holidays');
  }

  const { id } = await ctx!.params;
  const body = await req.json();
  const parseResult = HolidayCreateSchema.safeParse(body);

  if (!parseResult.success) {
    throw new ValidationError(
      parseResult.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      'Invalid Holiday data',
    );
  }

  const holiday = await holidayService.create(identity.tenantId, id, parseResult.data, identity.id);

  return NextResponse.json({ holiday }, { status: 201 });
}

export const GET = withErrorHandler(authenticate(listHolidaysHandler));
export const POST = withErrorHandler(authenticate(createHolidayHandler));
