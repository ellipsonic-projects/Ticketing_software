import { NextRequest, NextResponse } from 'next/server';

import { authenticate } from '@/middleware/authenticate';
import { Role } from '@prisma/client';

import { userService } from '@/services/user/user.service';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';
import { UpdateUserStatusSchema } from '@/lib/user/user.schema';

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
    const parsedBody = UpdateUserStatusSchema.parse(body);

    const user = await userService.updateUserStatus(tenantId, id, parsedBody.status, actorId);

    const { password, ...safeUser } = user;

    return NextResponse.json({
      message: `User status updated to ${parsedBody.status}`,
      data: safeUser,
    });
  }),
);
