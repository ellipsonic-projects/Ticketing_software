import { NextRequest, NextResponse } from 'next/server';

import { authenticate } from '@/middleware/authenticate';
import { Role } from '@prisma/client';

import { userService } from '@/services/user/user.service';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';
import { UpdateUserSchema } from '@/lib/user/user.schema';

export const GET = withErrorHandler(
  authenticate(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const ctx = getRequestContext();
    const tenantId = ctx?.identity?.tenantId;
    const role = ctx?.identity?.role;

    if (!tenantId) {
      throw new Error('Tenant context missing');
    }

    if (role !== Role.TENANT_ADMIN) {
      throw new Error('Unauthorized');
    }

    const user = await userService.getUserById(tenantId, id);

    const { password, ...safeUser } = user;

    return NextResponse.json({ data: safeUser });
  }),
);

export const PATCH = withErrorHandler(
  authenticate(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const ctx = getRequestContext();
    const tenantId = ctx?.identity?.tenantId;
    const actorId = ctx?.identity?.id;
    const role = ctx?.identity?.role;

    if (!tenantId || !actorId) {
      throw new Error('Tenant context missing');
    }

    if (role !== Role.TENANT_ADMIN) {
      throw new Error('Unauthorized');
    }

    const body = await req.json();
    const parsedBody = UpdateUserSchema.parse(body);

    const user = await userService.updateUser(tenantId, id, parsedBody, actorId);

    const { password, ...safeUser } = user;

    return NextResponse.json({ message: 'User updated successfully', data: safeUser });
  }),
);

export const DELETE = withErrorHandler(
  authenticate(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const ctx = getRequestContext();
    const tenantId = ctx?.identity?.tenantId;
    const actorId = ctx?.identity?.id;
    const role = ctx?.identity?.role;

    if (!tenantId || !actorId) {
      throw new Error('Tenant context missing');
    }

    if (role !== Role.TENANT_ADMIN) {
      throw new Error('Unauthorized');
    }

    await userService.deleteUser(tenantId, id, actorId);

    return NextResponse.json({ message: 'User deleted successfully' });
  }),
);
