import { NextRequest } from 'next/server';

import { authenticate, RouteContext } from '@/middleware/authenticate';

import { TicketService } from '@/services/ticket/ticket.service';
import { ApiResponder } from '@/lib/api-response';
import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';

async function getTicketStatsHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const user = reqCtx!.identity!;
  const tenantId = reqCtx!.tenantId!;

  if (!tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  const searchParams = req.nextUrl.searchParams;
  const clientId = searchParams.get('clientId') || undefined;
  let assignedToId = searchParams.get('assignedToId') || undefined;

  // If user is an engineer, by default they get stats for tickets assigned to them
  if (user.role === 'ENGINEER' && !assignedToId) {
    assignedToId = user.id;
  }

  const stats = await TicketService.getTicketStats(tenantId, user, clientId, assignedToId);

  return ApiResponder.success(stats);
}

export const GET = withErrorHandler(authenticate(getTicketStatsHandler));
