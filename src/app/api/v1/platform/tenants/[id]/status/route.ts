import { NextRequest, NextResponse } from 'next/server';

import { authenticate, RouteContext } from '@/middleware/authenticate';
import { Role, TenantStatus } from '@prisma/client';
import { z } from 'zod';

import { TenantService } from '@/services/tenant/tenant.service';
import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';

const StatusSchema = z.object({
  status: z.nativeEnum(TenantStatus),
});

export const PATCH = withErrorHandler(
  authenticate(async (req: NextRequest, ctx?: RouteContext) => {
    const { id } = await ctx!.params;
    const reqCtx = getRequestContext();
    const actorId = reqCtx?.identity?.id;
    const role = reqCtx?.identity?.role;

    if (!actorId || role !== Role.PLATFORM_ADMIN) throw new ForbiddenError();

    const body = await req.json();
    const result = StatusSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    const tenant = await TenantService.updateStatus(id, result.data.status, actorId);
    return NextResponse.json({ data: tenant });
  }),
);
