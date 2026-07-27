'use client';

import { useState } from 'react';

import { CheckCircle2 } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { authApi } from '@/services/api/auth-api';

import { AuthButton } from './auth-button';
import { PasswordField } from './password-field';

export function ChangePasswordForm() {
  const { accessToken } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      if (!accessToken) throw new Error('Not authenticated');
      await authApi.changePassword({ currentPassword, newPassword }, accessToken);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      setError(
        (err instanceof Error ? err.message : 'An error occurred') ||
          'An error occurred while changing your password',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-border/50 w-full max-w-md shadow-sm">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your password to keep your account secure.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-primary/50 bg-primary/10">
              <CheckCircle2 className="text-primary h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Your password has been changed successfully.</AlertDescription>
            </Alert>
          )}

          <PasswordField
            id="currentPassword"
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />

          <PasswordField
            id="newPassword"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />

          <PasswordField
            id="confirmPassword"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isSubmitting}
          />

          <AuthButton type="submit" isLoading={isSubmitting}>
            Update Password
          </AuthButton>
        </form>
      </CardContent>
    </Card>
  );
}
