import { NextRequest } from 'next/server';
import { authenticate, RouteContext } from '@/middleware/authenticate';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { ApiResponder } from '@/lib/api-response';
import { getRequestContext } from '@/lib/request-context';
import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { TicketService } from '@/services/ticket/ticket.service';
import { CreateTicketSchema } from '@/lib/ticket/ticket.schema';
import { AppError } from '@/lib/errors/app-error';
import { TicketStatus, TicketPriority } from '@prisma/client';

async function getTicketsHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const user = reqCtx!.identity!;
  const tenantId = reqCtx!.tenantId!;
  if (!tenantId) throw new ForbiddenError('Tenant context required');
  
  const searchParams = req.nextUrl.searchParams;
  
  const query = {
    search: searchParams.get('search') || undefined,
    status: (searchParams.get('status') as TicketStatus | 'all') || undefined,
    priority: (searchParams.get('priority') as TicketPriority | 'all') || undefined,
    projectId: searchParams.get('projectId') || undefined,
    clientId: searchParams.get('clientId') || undefined,
    assignedToId: searchParams.get('assignedToId') || undefined,
    reportedById: searchParams.get('reportedById') || undefined,
    sort: searchParams.get('sort') || undefined,
    order: (searchParams.get('order') as 'asc' | 'desc') || undefined,
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: parseInt(searchParams.get('limit') || '25', 10),
  };

  // If user is CLIENT, they can only see their own company's tickets
  // If they are restricted to only their own created tickets, we would set reportedById
  // For now, let's assume clients can see their tenant's tickets if they have permission,
  // but wait, clients belong to a specific Client. The system doesn't explicitly link user.clientId yet.
  // We'll enforce basic tenant isolation. In Phase 4 we can tighten Client-User linkage.

  const result = await TicketService.getTickets(tenantId, user, query);
  return ApiResponder.success(result);
}

async function createTicketHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const user = reqCtx!.identity!;
  const tenantId = reqCtx!.tenantId!;
  if (!tenantId) throw new ForbiddenError('Tenant context required');
  
  const body = await req.json();
  const data = CreateTicketSchema.parse(body);

  const ticket = await TicketService.createTicket(tenantId, user.id, data);
  
  return ApiResponder.success({ ticket }, 'Ticket created', 201);
}

export const GET = withErrorHandler(authenticate(getTicketsHandler));
export const POST = withErrorHandler(authenticate(createTicketHandler));
