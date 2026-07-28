import { NextRequest, NextResponse } from 'next/server';

import { ResetPasswordSchema } from '@/validations/auth';

import { authService } from '@/services/auth/auth.service';
import { withErrorHandler } from '@/lib/errors/global-handler';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { token, password } = ResetPasswordSchema.parse(body);

  await authService.resetPassword(token, password);

  return NextResponse.json({
    success: true,
    message: 'Your password has been successfully reset. You can now log in.',
  });
});
