import { NextRequest, NextResponse } from 'next/server';

import { ForgotPasswordSchema } from '@/validations/auth';

import { authService } from '@/services/auth/auth.service';
import { withErrorHandler } from '@/lib/errors/global-handler';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { email } = ForgotPasswordSchema.parse(body);

  await authService.forgotPassword(email);

  // Return success even if email doesn't exist for security (prevent user enumeration)
  const responseData: Record<string, unknown> = {
    success: true,
    message: 'If your email is registered, you will receive a password reset link.',
  };

  return NextResponse.json(responseData);
});
