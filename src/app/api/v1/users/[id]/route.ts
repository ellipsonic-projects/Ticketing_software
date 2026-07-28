import { NextRequest, NextResponse } from 'next/server';

import { authenticate, RouteContext } from '@/middleware/authenticate';
import { Role } from '@prisma/client';

import { userService } from '@/services/user/user.service';
import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';
import { UpdateUserSchema } from '@/lib/user/user.schema';

export const GET = withErrorHandler(
  authenticate(async (req: NextRequest, ctx?: RouteContext) => {
    const { id } = await ctx!.params;
    const reqCtx = getRequestContext();
    const tenantId = reqCtx?.identity?.tenantId;
    const role = reqCtx?.identity?.role;

    if (!tenantId) throw new ForbiddenError('Tenant context missing');
    if (role !== Role.TENANT_ADMIN) throw new ForbiddenError();

    const user = await userService.getUserById(tenantId, id);
    const { password, ...safeUser } = user;

    return NextResponse.json({ data: safeUser });
  }),
);

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
    const parsedBody = UpdateUserSchema.parse(body);
    const user = await userService.updateUser(tenantId, id, parsedBody, actorId);
    const { password, ...safeUser } = user;

    return NextResponse.json({ message: 'User updated successfully', data: safeUser });
  }),
);

export const DELETE = withErrorHandler(
  authenticate(async (req: NextRequest, ctx?: RouteContext) => {
    const { id } = await ctx!.params;
    const reqCtx = getRequestContext();
    const tenantId = reqCtx?.identity?.tenantId;
    const actorId = reqCtx?.identity?.id;
    const role = reqCtx?.identity?.role;

    if (!tenantId || !actorId) throw new ForbiddenError('Tenant context missing');
    if (role !== Role.TENANT_ADMIN) throw new ForbiddenError();

    await userService.deleteUser(tenantId, id, actorId);

    return NextResponse.json({ message: 'User deleted successfully' });
  }),
);
