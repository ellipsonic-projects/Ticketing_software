'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { ResetPasswordSchema } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/services/api/auth-api';

type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  useEffect(() => {
    if (token) {
      setValue('token', token);
    } else {
      toast.error('Invalid or missing reset token');
    }
  }, [token, setValue]);

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      setIsLoading(true);
      await authApi.resetPassword(data);
      setIsSuccess(true);
      toast.success('Password reset successfully');

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (error: unknown) {
      toast.error(
        (error as Error).message || 'Failed to reset password. The token may be expired.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="bg-card w-full max-w-md space-y-8 rounded-2xl p-8 text-center shadow-xl">
          <h2 className="text-destructive text-2xl font-bold">Invalid Link</h2>
          <p className="text-muted-foreground">The password reset link is invalid or missing.</p>
          <Button onClick={() => router.push('/auth/forgot-password')} className="mt-4 w-full">
            Request a new link
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="bg-card w-full max-w-md space-y-8 rounded-2xl p-8 shadow-xl">
        <div className="text-center">
          <div className="bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
            <ShieldCheck className="text-primary h-6 w-6" />
          </div>
          <h2 className="text-foreground mt-6 text-3xl font-bold tracking-tight">
            Set New Password
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            {isSuccess
              ? 'Your password has been reset successfully.'
              : 'Please enter your new secure password below.'}
          </p>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <input type="hidden" {...register('token')} />

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new secure password"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-destructive text-sm">{errors.password.message}</p>
              )}
              <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-4 text-xs">
                <li>At least 8 characters long</li>
                <li>One uppercase and one lowercase letter</li>
                <li>One number and one special character</li>
              </ul>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset Password
            </Button>
          </form>
        ) : (
          <div className="mt-8 space-y-6 text-center">
            <Button onClick={() => router.push('/auth/login')} className="w-full">
              Go to Login
            </Button>
            <p className="text-muted-foreground text-xs">You will be redirected automatically...</p>
          </div>
        )}
      </div>
    </div>
  );
}
