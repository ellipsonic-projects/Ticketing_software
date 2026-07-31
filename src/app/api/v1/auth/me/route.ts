import { NextResponse } from 'next/server';

import { authenticate } from '@/middleware/authenticate';

import { authRepository } from '@/repositories/auth/auth.repository';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';

export const GET = withErrorHandler(
  authenticate(async () => {
    const ctx = getRequestContext();
    const userId = ctx?.identity?.id;

    if (!userId) {
      throw new Error('User context missing');
    }

    const { prisma } = await import('@/lib/db');

    // We fetch user without password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
        role: true,
        tenantId: true,
        clientId: true,
        tenant: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return NextResponse.json({ user });
  }),
);
