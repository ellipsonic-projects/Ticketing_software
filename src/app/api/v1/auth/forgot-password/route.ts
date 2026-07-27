import { NextResponse } from 'next/server';

import { ForgotPasswordSchema } from '@/validations/auth';

import { authService } from '@/services/auth/auth.service';
import { withErrorHandler } from '@/lib/errors/global-handler';

export const POST = withErrorHandler(async (req: Request) => {
  const body = await req.json();
  const data = ForgotPasswordSchema.parse(body);

  await authService.forgotPassword(data.email);

  return NextResponse.json({
    success: true,
    message: 'If an account exists, a reset link has been sent.',
  });
});
