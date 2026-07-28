import { NextRequest, NextResponse } from 'next/server';

import { ForgotPasswordSchema } from '@/validations/auth';

import { authService } from '@/services/auth/auth.service';
import { withErrorHandler } from '@/lib/errors/global-handler';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { email } = ForgotPasswordSchema.parse(body);

  const resetLink = await authService.forgotPassword(email);

  // Return success even if email doesn't exist for security (prevent user enumeration)
  const responseData: Record<string, unknown> = {
    success: true,
    message: 'If your email is registered, you will receive a password reset link.',
  };

  // In development, return the link so it can be seen without an email service
  if (process.env.NODE_ENV !== 'production' && resetLink) {
    responseData.devResetLink = resetLink;
  }

  return NextResponse.json(responseData);
});
