import { NextRequest } from 'next/server';

import { authenticate, RouteContext } from '@/middleware/authenticate';

import { TicketAttachmentService } from '@/services/ticket/ticket-attachment.service';
import { ApiResponder } from '@/lib/api-response';
import { AppError } from '@/lib/errors/app-error';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { ValidationError } from '@/lib/errors/validation-error';
import { getRequestContext } from '@/lib/request-context';

async function getAttachmentsHandler(req: NextRequest, ctx?: RouteContext) {
  const context = getRequestContext();
  const tenantId = context?.identity?.tenantId;
  const params = await ctx!.params;

  if (!tenantId) throw new Error('Tenant ID required');

  const attachments = await TicketAttachmentService.getAttachments(params.id, tenantId);
  return ApiResponder.success({ attachments });
}

async function createAttachmentHandler(req: NextRequest, ctx?: RouteContext) {
  const context = getRequestContext();
  const tenantId = context?.identity?.tenantId;
  const uploaderId = context?.identity?.id;
  const params = await ctx!.params;

  if (!tenantId || !uploaderId) throw new Error('Tenant ID and User ID required');

  const body = await req.json();
  const { filename, size, mimeType, url } = body;

  if (!filename || !size || !mimeType || !url) {
    return ApiResponder.error('Missing required attachment fields', [], 400);
  }

  const attachment = await TicketAttachmentService.createAttachment(
    params.id,
    tenantId,
    uploaderId,
    { filename, size, mimeType, url },
  );

  return ApiResponder.success({ attachment });
}

export const GET = withErrorHandler(authenticate(getAttachmentsHandler));
export const POST = withErrorHandler(authenticate(createAttachmentHandler));
