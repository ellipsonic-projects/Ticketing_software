import { NextRequest, NextResponse } from 'next/server';

import { authenticate } from '@/middleware/authenticate';
import { Role, TenantStatus } from '@prisma/client';
import { z } from 'zod';

import { TenantService } from '@/services/tenant/tenant.service';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';

const StatusSchema = z.object({
  status: z.nativeEnum(TenantStatus),
});

export const PATCH = withErrorHandler(
  authenticate(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params;
      const body = await req.json();
      const result = StatusSchema.safeParse(body);

      if (!result.success) {
        return NextResponse.json({ error: result.error.issues }, { status: 400 });
      }

      const ctx = getRequestContext();
      const actorId = ctx?.identity?.id;
      const role = ctx?.identity?.role;

      if (!actorId || role !== Role.PLATFORM_ADMIN) {
        throw new Error('Unauthorized');
      }

      const tenant = await TenantService.updateStatus(id, result.data.status, actorId);
      return NextResponse.json({ data: tenant });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Tenant not found') {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }),
);
