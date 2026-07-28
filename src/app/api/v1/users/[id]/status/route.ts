import { NextRequest, NextResponse } from 'next/server';

import { authenticate, RouteContext } from '@/middleware/authenticate';
import { Role } from '@prisma/client';

import { userService } from '@/services/user/user.service';
import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';
import { UpdateUserStatusSchema } from '@/lib/user/user.schema';

export const PATCH = withErrorHandler(
  authenticate(async (req: NextRequest, ctx?: RouteContext) => {
    const { id } = await ctx!.params;
    const reqCtx = getRequestContext();
    const tenantId = reqCtx?.identity?.tenantId;
    const actorId = reqCtx?.identity?.id;
    const role = reqCtx?.identity?.role;

    if (!tenantId || !actorId) throw new ForbiddenError('Tenant context missing');
    if (role !== Role.TENANT_ADMIN) throw new ForbiddenError();

    const body = await req.json();
    const parsedBody = UpdateUserStatusSchema.parse(body);
    const user = await userService.updateUserStatus(tenantId, id, parsedBody.status, actorId);
    const { password, ...safeUser } = user;

    return NextResponse.json({
      message: `User status updated to ${parsedBody.status}`,
      data: safeUser,
    });
  }),
);
