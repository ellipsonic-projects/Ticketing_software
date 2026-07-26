import { NextRequest } from 'next/server';

import { prisma } from '@/lib/db';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';
import { successResponse } from '@/lib/response';
import { resolveTenantId } from '@/lib/tenant';
import { clock } from '@/lib/time';
import { AppInfo } from '@/constants/app-info';

async function healthCheckHandler(req: NextRequest) {
  // Simple DB check
  let dbStatus = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch {
    dbStatus = 'error';
  }

  const ctx = getRequestContext();
  const resolvedTenantId = resolveTenantId(req);

  return successResponse(
    {
      app: AppInfo.APP_NAME,
      version: AppInfo.VERSION,
      environment: AppInfo.NODE_ENV,
      status: 'healthy',
      database: dbStatus,
      timestamp: clock.iso(),
      requestId: ctx?.requestId,
      resolvedTenantId,
    },
    'System is operating normally',
  );
}

export const GET = withErrorHandler(healthCheckHandler);
