import { NextRequest } from 'next/server';

import { z } from 'zod';

import { authService } from '@/services/auth/auth.service';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { successResponse } from '@/lib/response';

const AcceptInvitationSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

async function acceptInvitationHandler(req: NextRequest) {
  const body = await req.json();
  const data = AcceptInvitationSchema.parse(body);

  await authService.acceptInvitation(data.token, data.password);

  return successResponse({
    message: 'Invitation accepted and account activated successfully',
  });
}

export const POST = withErrorHandler(acceptInvitationHandler);
