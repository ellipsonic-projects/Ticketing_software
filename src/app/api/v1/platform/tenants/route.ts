import { NextResponse } from 'next/server';

import { TenantService } from '@/services/tenant/tenant.service';
import { CreateTenantSchema, ListTenantSchema } from '@/lib/tenant/tenant.schema';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = CreateTenantSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    const actorId = 'SYSTEM'; // TODO: extract from auth context

    const tenant = await TenantService.createTenant(result.data, actorId);
    return NextResponse.json({ data: tenant }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Domain is already in use') {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = Object.fromEntries(url.searchParams.entries());
    const result = ListTenantSchema.safeParse(query);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues }, { status: 400 });
    }

    const { page, pageSize, search, status, sort, sortOrder } = result.data;

    const tenants = await TenantService.getTenants(page, pageSize, search, status, sort, sortOrder);
    return NextResponse.json(tenants);
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
