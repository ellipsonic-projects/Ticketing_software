import { NextRequest, NextResponse } from 'next/server';

import { authenticate } from '@/middleware/authenticate';
import { Role } from '@prisma/client';

import { TenantService } from '@/services/tenant/tenant.service';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';
import { UpdateTenantSchema } from '@/lib/tenant/tenant.schema';

export const GET = withErrorHandler(
  authenticate(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const ctx = getRequestContext();
      const role = ctx?.identity?.role;

      if (role !== Role.PLATFORM_ADMIN) {
        throw new Error('Unauthorized');
      }
      const { id } = await params;
      const tenant = await TenantService.getTenantById(id);
      return NextResponse.json({ data: tenant });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Tenant not found') {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }),
);

export const PATCH = withErrorHandler(
  authenticate(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params;
      const body = await req.json();
      const result = UpdateTenantSchema.safeParse(body);

      if (!result.success) {
        return NextResponse.json({ error: result.error.issues }, { status: 400 });
      }

      const ctx = getRequestContext();
      const actorId = ctx?.identity?.id;
      const role = ctx?.identity?.role;

      if (!actorId || role !== Role.PLATFORM_ADMIN) {
        throw new Error('Unauthorized');
      }

      const tenant = await TenantService.updateTenant(id, result.data, actorId);
      return NextResponse.json({ data: tenant });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Tenant not found') {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      if (error instanceof Error && error.message === 'Domain is already in use') {
        return NextResponse.json({ error: error.message }, { status: 409 });
      }
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }),
);

export const DELETE = withErrorHandler(
  authenticate(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params;
      const ctx = getRequestContext();
      const actorId = ctx?.identity?.id;
      const role = ctx?.identity?.role;

      if (!actorId || role !== Role.PLATFORM_ADMIN) {
        throw new Error('Unauthorized');
      }
      const tenant = await TenantService.softDeleteTenant(id, actorId);
      return NextResponse.json({ data: tenant });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Tenant not found') {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }),
);
