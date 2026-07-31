import { NextRequest, NextResponse } from 'next/server';

import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { authenticate, RouteContext } from '@/middleware/authenticate';
import { projectService } from '@/services/project/project.service';
import { getRequestContext } from '@/lib/request-context';

async function getProjectStatsHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const identity = reqCtx!.identity!;
  if (!identity.tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  const stats = await projectService.getStats(identity.tenantId);
  return NextResponse.json({ stats });
}

export const GET = withErrorHandler(authenticate(getProjectStatsHandler));
