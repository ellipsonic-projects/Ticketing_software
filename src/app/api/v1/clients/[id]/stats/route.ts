import { NextRequest, NextResponse } from 'next/server';

import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { authenticate, RouteContext } from '@/middleware/authenticate';
import { clientService } from '@/services/client/client.service';
import { getRequestContext } from '@/lib/request-context';

async function getClientStatsHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const identity = reqCtx!.identity!;
  if (!identity.tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  const { id } = await ctx!.params;
  const stats = await clientService.getClientOverviewStats(identity.tenantId, id);

  return NextResponse.json(stats);
}

export const GET = withErrorHandler(authenticate(getClientStatsHandler));
