import { NextRequest, NextResponse } from 'next/server';

import { authenticate } from '@/middleware/authenticate';
import { Role } from '@prisma/client';

import { TenantService } from '@/services/tenant/tenant.service';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';
import { CreateTenantSchema, ListTenantSchema } from '@/lib/tenant/tenant.schema';

export const POST = withErrorHandler(
  authenticate(async (req: NextRequest) => {
    const body = await req.json();
    const result = CreateTenantSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    const ctx = getRequestContext();
    const actorId = ctx?.identity?.id;
    const role = ctx?.identity?.role;

    if (!actorId || role !== Role.PLATFORM_ADMIN) {
      throw new Error('Unauthorized');
    }
    const tenant = await TenantService.createTenant(result.data, actorId);
    return NextResponse.json({ data: tenant }, { status: 201 });
  }),
);

export const GET = withErrorHandler(
  authenticate(async (req: NextRequest) => {
    const ctx = getRequestContext();
    const role = ctx?.identity?.role;

    if (role !== Role.PLATFORM_ADMIN) {
      throw new Error('Unauthorized');
    }
    const url = new URL(req.url);
    const query = Object.fromEntries(url.searchParams.entries());
    const result = ListTenantSchema.safeParse(query);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    const { page, pageSize, search, status, sort, sortOrder } = result.data;

    const tenants = await TenantService.getTenants(page, pageSize, search, status, sort, sortOrder);
    return NextResponse.json(tenants);
  }),
);
