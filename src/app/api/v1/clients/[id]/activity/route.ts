import { NextRequest, NextResponse } from 'next/server';
import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { authenticate, RouteContext } from '@/middleware/authenticate';
import { activityTimelineService } from '@/services/activity/activity-timeline.service';
import { getRequestContext } from '@/lib/request-context';

async function getClientActivityHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const identity = reqCtx!.identity!;
  if (!identity.tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  const { id } = await ctx!.params;
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);

  const result = await activityTimelineService.getTimelineForEntity(
    identity.tenantId,
    'Client',
    id,
    page,
    pageSize
  );

  return NextResponse.json(result);
}

export const GET = withErrorHandler(authenticate(getClientActivityHandler));
