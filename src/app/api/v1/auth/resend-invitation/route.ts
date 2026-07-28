import { NextRequest } from 'next/server';

import { z } from 'zod';

import { authService } from '@/services/auth/auth.service';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';
import { successResponse } from '@/lib/response';

const ResendInvitationSchema = z.object({
  email: z.string().email('Invalid email address'),
});

async function resendInvitationHandler(req: NextRequest) {
  const body = await req.json();
  const data = ResendInvitationSchema.parse(body);

  const context = getRequestContext();
  const actorId = context?.identity?.id || 'SYSTEM';

  await authService.resendInvitation(data.email, actorId);

  return successResponse({
    message: 'If the user exists and is invited, a new invitation has been sent.',
  });
}

export const POST = withErrorHandler(resendInvitationHandler);
