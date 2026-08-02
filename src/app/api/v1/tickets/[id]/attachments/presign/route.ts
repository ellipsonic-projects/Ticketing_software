import { NextRequest } from 'next/server';

import { authenticate, RouteContext } from '@/middleware/authenticate';

import { s3Service } from '@/services/storage/s3.service';
import { ApiResponder } from '@/lib/api-response';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';

async function presignHandler(req: NextRequest, ctx?: RouteContext) {
  const context = getRequestContext();
  const tenantId = context?.identity?.tenantId;
  const params = await ctx!.params;

  if (!tenantId) throw new Error('Tenant ID required');

  const body = await req.json();
  const { filename, contentType } = body;

  if (!filename || !contentType) {
    return ApiResponder.error('Filename and contentType are required', [], 400);
  }

  const folder = `tenants/${tenantId}/tickets/${params.id}`;

  const presignedData = await s3Service.generatePresignedPutUrl(filename, contentType, folder);

  return ApiResponder.success(presignedData);
}

export const POST = withErrorHandler(authenticate(presignHandler));
