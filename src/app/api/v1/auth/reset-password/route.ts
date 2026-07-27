import { NextResponse } from 'next/server';

import { ResetPasswordSchema } from '@/validations/auth';

import { authService } from '@/services/auth/auth.service';
import { withErrorHandler } from '@/lib/errors/global-handler';

export const POST = withErrorHandler(async (req: Request) => {
  const body = await req.json();
  const data = ResetPasswordSchema.parse(body);

  await authService.resetPassword(data.token, data.password);

  return NextResponse.json({ success: true, message: 'Password has been reset successfully.' });
});
