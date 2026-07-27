'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { CheckCircle2, Loader2 } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { authApi } from '@/services/api/auth-api';

import { AuthButton } from './auth-button';
import { AuthCard } from './auth-card';
import { PasswordField } from './password-field';

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!token) {
    return (
      <AuthCard title="Invalid Link">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            The password reset link is invalid or missing the reset token. Please request a new
            link.
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => (window.location.href = '/auth/forgot-password')}
          >
            Request new link
          </Button>
        </div>
      </AuthCard>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      await authApi.resetPassword({ token, password });
      setSuccess(true);
    } catch (err: unknown) {
      setError(
        (err instanceof Error ? err.message : 'An error occurred') ||
          'An error occurred while resetting your password',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <AuthCard title="Password Reset">
        <Alert className="border-primary/50 bg-primary/10">
          <CheckCircle2 className="text-primary h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Your password has been successfully reset. You can now sign in with your new password.
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Button className="w-full" onClick={() => (window.location.href = '/auth/login')}>
            Sign in
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Create new password"
      description="Your new password must be different from previously used passwords."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <PasswordField
          id="password"
          label="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isSubmitting}
        />

        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isSubmitting}
        />

        <AuthButton type="submit" isLoading={isSubmitting}>
          Reset Password
        </AuthButton>
      </form>
    </AuthCard>
  );
}
