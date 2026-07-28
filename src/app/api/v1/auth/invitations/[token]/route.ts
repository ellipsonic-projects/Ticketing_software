import crypto from 'crypto';
import { NextRequest } from 'next/server';

import { withErrorHandler } from '@/lib/errors/global-handler';
import prisma from '@/lib/prisma';
import { successResponse } from '@/lib/response';
import { clock } from '@/lib/time';

async function getInvitationHandler(req: NextRequest, { params }: { params: { token: string } }) {
  const { token } = await params;
  if (!token) {
    return new Response('Token is required', { status: 400 });
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const user = await prisma.user.findUnique({
    where: { invitationTokenHash: tokenHash },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      status: true,
      invitationExpiresAt: true,
    },
  });

  if (
    !user ||
    user.status !== 'INVITED' ||
    !user.invitationExpiresAt ||
    user.invitationExpiresAt < clock.now()
  ) {
    return new Response('Invalid or expired invitation token', { status: 400 });
  }

  return successResponse({
    user: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
}

export const GET = withErrorHandler(getInvitationHandler);
