import { NextRequest } from 'next/server';
import { authenticate, RouteContext } from '@/middleware/authenticate';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { ApiResponder } from '@/lib/api-response';
import { getRequestContext } from '@/lib/request-context';
import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { TicketService } from '@/services/ticket/ticket.service';

async function getTicketStatsHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const user = reqCtx!.identity!;
  const tenantId = reqCtx!.tenantId!;

  if (!tenantId) {
    throw new ForbiddenError('Tenant context required');
  }

  const searchParams = req.nextUrl.searchParams;
  const clientId = searchParams.get('clientId') || undefined;

  const stats = await TicketService.getTicketStats(tenantId, user, clientId);

  return ApiResponder.success(stats);
}

export const GET = withErrorHandler(authenticate(getTicketStatsHandler));
