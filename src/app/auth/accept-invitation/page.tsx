'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, MailCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/services/api/auth-api';

// Accept Invitation Form Schema
const AcceptInvitationFormSchema = z
  .object({
    token: z.string(),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type AcceptInvitationForm = z.infer<typeof AcceptInvitationFormSchema>;

function AcceptInvitationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [userName, setUserName] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AcceptInvitationForm>({
    resolver: zodResolver(AcceptInvitationFormSchema),
  });

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsVerifying(false);
        return;
      }

      try {
        const response = await fetch(`/api/v1/auth/invitations/${token}`);
        if (!response.ok) throw new Error('Invalid token');

        const data = await response.json();
        setUserName(data.data.user.firstName);
        setValue('token', token);
        setIsValidToken(true);
      } catch (err) {
        toast.error('This invitation link is invalid or has expired.');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token, setValue]);

  const onSubmit = async (data: AcceptInvitationForm) => {
    try {
      setIsLoading(true);
      // We assume authApi has an acceptInvitation method.
      // If it doesn't, we can just fetch it directly.
      const response = await fetch('/api/v1/auth/accept-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: data.token, password: data.password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to accept invitation');
      }

      setIsSuccess(true);
      toast.success('Account activated successfully!');

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (error: unknown) {
      toast.error(
        (error as Error).message || 'Failed to activate account. The link may be expired.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isValidToken && !isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="bg-card w-full max-w-md space-y-8 rounded-2xl p-8 text-center shadow-xl">
          <h2 className="text-destructive text-2xl font-bold">Invalid Invitation</h2>
          <p className="text-muted-foreground">This invitation link is invalid or has expired.</p>
          <Button onClick={() => router.push('/auth/login')} className="mt-4 w-full">
            Go to Login
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
            <MailCheck className="text-primary h-6 w-6" />
          </div>
          <h2 className="text-foreground mt-6 text-3xl font-bold tracking-tight">
            {isSuccess ? 'Account Activated' : `Welcome, ${userName}!`}
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            {isSuccess
              ? 'Your account is ready. You will be redirected to log in.'
              : 'Please set a secure password to activate your account.'}
          </p>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <input type="hidden" {...register('token')} />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Set Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter a secure password"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-destructive text-sm">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Activate Account
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

export default function AcceptInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center p-4">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      }
    >
      <AcceptInvitationContent />
    </Suspense>
  );
}
