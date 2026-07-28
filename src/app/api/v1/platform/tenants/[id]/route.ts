import { NextRequest, NextResponse } from 'next/server';

import { authenticate, RouteContext } from '@/middleware/authenticate';
import { Role } from '@prisma/client';

import { TenantService } from '@/services/tenant/tenant.service';
import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { TenantNotFoundError } from '@/lib/errors/tenant-not-found-error';
import { getRequestContext } from '@/lib/request-context';
import { UpdateTenantSchema } from '@/lib/tenant/tenant.schema';

export const GET = withErrorHandler(
  authenticate(async (req: NextRequest, ctx?: RouteContext) => {
    const { id } = await ctx!.params;
    const reqCtx = getRequestContext();
    const role = reqCtx?.identity?.role;

    if (role !== Role.PLATFORM_ADMIN) throw new ForbiddenError();

    const tenant = await TenantService.getTenantById(id);
    return NextResponse.json({ data: tenant });
  }),
);

export const PATCH = withErrorHandler(
  authenticate(async (req: NextRequest, ctx?: RouteContext) => {
    const { id } = await ctx!.params;
    const reqCtx = getRequestContext();
    const actorId = reqCtx?.identity?.id;
    const role = reqCtx?.identity?.role;

    if (!actorId || role !== Role.PLATFORM_ADMIN) throw new ForbiddenError();

    const body = await req.json();
    const result = UpdateTenantSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    const tenant = await TenantService.updateTenant(id, result.data, actorId);
    return NextResponse.json({ data: tenant });
  }),
);

export const DELETE = withErrorHandler(
  authenticate(async (req: NextRequest, ctx?: RouteContext) => {
    const { id } = await ctx!.params;
    const reqCtx = getRequestContext();
    const actorId = reqCtx?.identity?.id;
    const role = reqCtx?.identity?.role;

    if (!actorId || role !== Role.PLATFORM_ADMIN) throw new ForbiddenError();

    const tenant = await TenantService.softDeleteTenant(id, actorId);
    return NextResponse.json({ data: tenant });
  }),
);
