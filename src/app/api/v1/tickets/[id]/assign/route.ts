import { NextRequest } from 'next/server';

import { authenticate, RouteContext } from '@/middleware/authenticate';

import { TicketService } from '@/services/ticket/ticket.service';
import { ApiResponder } from '@/lib/api-response';
import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';
import { AssignTicketSchema } from '@/lib/ticket/ticket.schema';

async function assignTicketHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const user = reqCtx!.identity!;
  const tenantId = reqCtx!.tenantId!;
  if (!tenantId) throw new ForbiddenError('Tenant context required');
  const params = await ctx!.params;

  const body = await req.json();
  const data = AssignTicketSchema.parse(body);

  const ticket = await TicketService.assignTicket(params.id, tenantId, user, data);

  return ApiResponder.success({ ticket });
}

export const PATCH = withErrorHandler(authenticate(assignTicketHandler));
