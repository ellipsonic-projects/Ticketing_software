import { NextResponse } from 'next/server';

import { TenantStatus } from '@prisma/client';
import { z } from 'zod';

import { TenantService } from '@/services/tenant/tenant.service';

const StatusSchema = z.object({
  status: z.nativeEnum(TenantStatus),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const result = StatusSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    const actorId = 'SYSTEM'; // TODO: from auth context

    const tenant = await TenantService.updateStatus(id, result.data.status, actorId);
    return NextResponse.json({ data: tenant });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Tenant not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
