import { NextRequest } from 'next/server';

import { z } from 'zod';

import { authService } from '@/services/auth/auth.service';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';
import { successResponse } from '@/lib/response';

const CreateInvitationSchema = z.object({
  email: z.string().email('Invalid email address'),
});

async function createInvitationHandler(req: NextRequest) {
  const body = await req.json();
  const data = CreateInvitationSchema.parse(body);

  const context = getRequestContext();
  const actorId = context?.identity?.id || 'SYSTEM';

  await authService.resendInvitation(data.email, actorId);

  return successResponse({
    message: 'Invitation processed.',
  });
}

export const POST = withErrorHandler(createInvitationHandler);
