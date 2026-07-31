import { NextRequest } from 'next/server';
import { authenticate, RouteContext } from '@/middleware/authenticate';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { ApiResponder } from '@/lib/api-response';
import { getRequestContext } from '@/lib/request-context';
import { ForbiddenError } from '@/lib/errors/forbidden-error';
import { TicketCommentService } from '@/services/ticket/ticket-comment.service';
import { CreateCommentSchema } from '@/lib/ticket/ticket.schema';

async function getCommentsHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const user = reqCtx!.identity!;
  const tenantId = reqCtx!.tenantId!;
  if (!tenantId) throw new ForbiddenError('Tenant context required');
  const params = await ctx!.params;
  
  const comments = await TicketCommentService.getComments(params.id, tenantId, user.role);
  return ApiResponder.success({ comments });
}

async function createCommentHandler(req: NextRequest, ctx?: RouteContext) {
  const reqCtx = getRequestContext();
  const user = reqCtx!.identity!;
  const tenantId = reqCtx!.tenantId!;
  if (!tenantId) throw new ForbiddenError('Tenant context required');
  const params = await ctx!.params;
  
  const body = await req.json();
  const data = CreateCommentSchema.parse(body);

  // If client, force internal to false
  if (user.role === 'CLIENT') {
    data.isInternal = false;
  }

  const comment = await TicketCommentService.addComment(params.id, tenantId, user.id, data);
  
  return ApiResponder.success({ comment }, 'Comment created', 201);
}

export const GET = withErrorHandler(authenticate(getCommentsHandler));
export const POST = withErrorHandler(authenticate(createCommentHandler));
