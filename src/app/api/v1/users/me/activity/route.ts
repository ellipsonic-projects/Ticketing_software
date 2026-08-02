import { NextRequest } from 'next/server';

import { authenticate, RouteContext } from '@/middleware/authenticate';

import { activityTimelineService } from '@/services/activity/activity-timeline.service';
import { ApiResponder } from '@/lib/api-response';
import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';

async function getMyActivityHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const user = reqCtx!.identity!;
  const tenantId = reqCtx!.tenantId!;

  if (!tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  // Currently designed specifically for engineers to get an aggregate timeline
  if (user.role !== 'ENGINEER' && user.role !== 'TENANT_ADMIN' && user.role !== 'PLATFORM_ADMIN') {
    throw new ForbiddenError('Only internal staff can access aggregate activity feeds');
  }

  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  const result = await activityTimelineService.getTimelineForEngineer(
    tenantId,
    user.id,
    page,
    limit,
  );

  return ApiResponder.success(result);
}

export const GET = withErrorHandler(authenticate(getMyActivityHandler));
