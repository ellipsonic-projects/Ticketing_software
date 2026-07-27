import { NextResponse } from 'next/server';

import { TenantService } from '@/services/tenant/tenant.service';
import { UpdateTenantSchema } from '@/lib/tenant/tenant.schema';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tenant = await TenantService.getTenantById(id);
    return NextResponse.json({ data: tenant });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Tenant not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const result = UpdateTenantSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    const actorId = 'SYSTEM'; // TODO: from auth context

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
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const actorId = 'SYSTEM'; // TODO: from auth context
    const tenant = await TenantService.softDeleteTenant(id, actorId);
    return NextResponse.json({ data: tenant });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Tenant not found') {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
