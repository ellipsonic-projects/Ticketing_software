import { NextRequest } from 'next/server';
import { authenticate, RouteContext } from '@/middleware/authenticate';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { ApiResponder } from '@/lib/api-response';
import { TicketAttachmentService } from '@/services/ticket/ticket-attachment.service';
import { AppError } from '@/lib/errors/app-error';

import { getRequestContext } from '@/lib/request-context';
import { ValidationError } from '@/lib/errors/validation-error';

async function getAttachmentsHandler(req: NextRequest, ctx?: RouteContext) {
  const context = getRequestContext();
  const tenantId = context?.identity?.tenantId;
  const params = await ctx!.params;
  
  if (!tenantId) throw new Error('Tenant ID required');
  
  const attachments = await TicketAttachmentService.getAttachments(params.id, tenantId);
  return ApiResponder.success({ attachments });
}

export const GET = withErrorHandler(authenticate(getAttachmentsHandler));
