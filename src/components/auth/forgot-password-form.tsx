'use client';

import { useState } from 'react';
import Link from 'next/link';

import { CheckCircle2, Mail } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { authApi } from '@/services/api/auth-api';

import { AuthButton } from './auth-button';
import { AuthCard } from './auth-card';
import { AuthInput } from './auth-input';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await authApi.forgotPassword(email);
      setSuccess(true);
    } catch (err: unknown) {
      setError(
        (err instanceof Error ? err.message : 'An error occurred') ||
          'An error occurred while processing your request',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <AuthCard title="Check your email">
        <Alert className="border-primary/50 bg-primary/10">
          <CheckCircle2 className="text-primary h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            If an account exists for {email}, you will receive a password reset link shortly.
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <AuthButton type="button" onClick={() => (window.location.href = '/auth/login')}>
            Return to login
          </AuthButton>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot Password"
      description="Enter your email address and we'll send you a link to reset your password."
      footer={
        <div className="text-muted-foreground w-full text-center text-sm">
          Remember your password?{' '}
          <Link href="/auth/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <AuthInput
          id="email"
          label="Email"
          type="email"
          placeholder="name@example.com"
          icon={<Mail className="h-[18px] w-[18px]" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />

        <AuthButton type="submit" isLoading={isSubmitting}>
          Send Reset Link
        </AuthButton>
      </form>
    </AuthCard>
  );
}
