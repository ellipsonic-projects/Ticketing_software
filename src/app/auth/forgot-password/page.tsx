'use client';

import React, { useState } from 'react';
import Link from 'next/link';

import { ForgotPasswordSchema } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/services/api/auth-api';

type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [devLink, setDevLink] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setIsLoading(true);
      const response = await authApi.forgotPassword(data.email);
      setIsSuccess(true);
      toast.success('Reset email sent successfully');

      // For development, display the link so the developer can click it
      if (response && typeof response === 'object' && 'devResetLink' in response) {
        setDevLink(response.devResetLink as string);
      }
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="bg-card w-full max-w-md space-y-8 rounded-2xl p-8 shadow-xl">
        <div className="text-center">
          <div className="bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
            <Mail className="text-primary h-6 w-6" />
          </div>
          <h2 className="text-foreground mt-6 text-3xl font-bold tracking-tight">
            Forgot Password
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            {isSuccess
              ? 'Check your inbox for a password reset link.'
              : "Enter your email address and we'll send you a link to reset your password."}
          </p>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                {...register('email')}
              />
              {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Reset Link
            </Button>

            <div className="text-center text-sm">
              <Link href="/auth/login" className="text-primary font-medium hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            {devLink && (
              <div className="rounded-md border border-amber-500/20 bg-amber-500/10 p-4">
                <p className="mb-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  DEVELOPMENT MODE ONLY
                </p>
                <p className="text-sm break-all">
                  Click here to reset: <br />
                  <a href={devLink} className="text-primary font-medium hover:underline">
                    {devLink}
                  </a>
                </p>
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsSuccess(false)}
            >
              Try another email
            </Button>
            <div className="text-center text-sm">
              <Link href="/auth/login" className="text-primary font-medium hover:underline">
                Return to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
