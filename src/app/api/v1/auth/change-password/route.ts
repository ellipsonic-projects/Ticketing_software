import { NextResponse } from 'next/server';

import { authenticate } from '@/middleware/authenticate';
import { ChangePasswordSchema } from '@/validations/auth';

import { authService } from '@/services/auth/auth.service';
import { withErrorHandler } from '@/lib/errors/global-handler';
import { getRequestContext } from '@/lib/request-context';

export const POST = withErrorHandler(
  authenticate(async (req: Request) => {
    const ctx = getRequestContext();
    const userId = ctx?.identity?.id;

    if (!userId) {
      throw new Error('User context missing');
    }

    const body = await req.json();
    const data = ChangePasswordSchema.parse(body);

    await authService.changePassword(userId, data.currentPassword, data.newPassword);

    return NextResponse.json({ success: true, message: 'Password changed successfully.' });
  }),
);
