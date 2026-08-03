import { NextRequest, NextResponse } from 'next/server';

import { authenticate } from '@/middleware/authenticate';
import { Role } from '@prisma/client';

import { TenantService } from '@/services/tenant/tenant.service';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';

export const GET = withErrorHandler(
  authenticate(async (req: NextRequest) => {
    const ctx = getRequestContext();
    const role = ctx?.identity?.role;

    if (role !== Role.PLATFORM_ADMIN) {
      throw new Error('Unauthorized');
    }

    const stats = await TenantService.getTenantStats();
    return NextResponse.json({ data: stats });
  }),
);
