import { NextRequest, NextResponse } from 'next/server';

import { authenticate } from '@/middleware/authenticate';
import { Role } from '@prisma/client';

import { userService } from '@/services/user/user.service';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';
import { CreateUserSchema, ListUsersSchema } from '@/lib/user/user.schema';

export const POST = withErrorHandler(
  authenticate(async (req: NextRequest) => {
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
    const parsedBody = CreateUserSchema.parse(body);

    const user = await userService.createUser(tenantId, parsedBody, actorId);

    // Remove password before sending to client
    const { password, ...safeUser } = user;

    return NextResponse.json(
      { message: 'User created successfully', data: safeUser },
      { status: 201 },
    );
  }),
);

export const GET = withErrorHandler(
  authenticate(async (req: NextRequest) => {
    const ctx = getRequestContext();
    const tenantId = ctx?.identity?.tenantId;
    const role = ctx?.identity?.role;

    if (!tenantId) {
      throw new Error('Tenant context missing');
    }

    if (role !== Role.TENANT_ADMIN) {
      throw new Error('Unauthorized');
    }

    const { searchParams } = new URL(req.url);
    const query = {
      page: searchParams.get('page') || undefined,
      pageSize: searchParams.get('pageSize') || undefined,
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status') || undefined,
      role: searchParams.get('role') || undefined,
      sort: searchParams.get('sort') || undefined,
      sortOrder: searchParams.get('sortOrder') || undefined,
    };

    const parsedQuery = ListUsersSchema.parse(query);

    const result = await userService.listUsers(tenantId, parsedQuery);

    // Remove passwords
    const safeData = result.data.map((u) => {
      const { password, ...safeUser } = u;
      return safeUser;
    });

    return NextResponse.json({
      data: safeData,
      meta: {
        total: result.total,
        page: parsedQuery.page,
        pageSize: parsedQuery.pageSize,
        totalPages: Math.ceil(result.total / parsedQuery.pageSize),
      },
    });
  }),
);
