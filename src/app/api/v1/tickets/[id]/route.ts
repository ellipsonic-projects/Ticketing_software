import { NextRequest } from 'next/server';
import { authenticate, RouteContext } from '@/middleware/authenticate';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { ApiResponder } from '@/lib/api-response';
import { getRequestContext } from '@/lib/request-context';
import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { TicketService } from '@/services/ticket/ticket.service';
import { UpdateTicketSchema } from '@/lib/ticket/ticket.schema';

async function getTicketHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const user = reqCtx!.identity!;
  const tenantId = reqCtx!.tenantId!;
  if (!tenantId) throw new ForbiddenError('Tenant context required');
  const params = await ctx!.params;
  
  const ticket = await TicketService.getTicketById(params.id, tenantId, user);
  return ApiResponder.success({ ticket });
}

async function updateTicketHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const user = reqCtx!.identity!;
  const tenantId = reqCtx!.tenantId!;
  if (!tenantId) throw new ForbiddenError('Tenant context required');
  const params = await ctx!.params;
  
  const body = await req.json();
  const data = UpdateTicketSchema.parse(body);

  const ticket = await TicketService.updateTicket(params.id, tenantId, user, data);
  
  return ApiResponder.success({ ticket });
}

export const GET = withErrorHandler(authenticate(getTicketHandler));
export const PATCH = withErrorHandler(authenticate(updateTicketHandler));
