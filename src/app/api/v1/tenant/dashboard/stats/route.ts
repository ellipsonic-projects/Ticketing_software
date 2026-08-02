import { NextRequest, NextResponse } from 'next/server';

import { authenticate, RouteContext } from '@/middleware/authenticate';
import { Role } from '@prisma/client';

import { TenantDashboardService } from '@/services/tenant/tenant-dashboard.service';
import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';

async function getTenantDashboardStats(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const user = reqCtx!.identity!;
  const tenantId = reqCtx!.tenantId!;

  if (!tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  if (user.role !== Role.TENANT_ADMIN && user.role !== Role.ENGINEER) {
    throw new ForbiddenError('Insufficient permissions');
  }

  const stats = await TenantDashboardService.getDashboardStats(tenantId);
  return NextResponse.json({ data: stats });
}

export const GET = withErrorHandler(authenticate(getTenantDashboardStats));
