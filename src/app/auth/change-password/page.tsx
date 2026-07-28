'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/auth-context';
import { ChangePasswordSchema } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/services/api/auth-api';

type ChangePasswordForm = z.infer<typeof ChangePasswordSchema>;

export default function ChangePasswordPage() {
  const { accessToken, user, refresh } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    if (!accessToken) {
      toast.error('You must be logged in to change your password.');
      return;
    }

    try {
      setIsLoading(true);
      await authApi.changePassword(data, accessToken);
      toast.success('Password changed successfully! Redirecting...');

      // Refresh context to pull updated user object (mustChangePassword = false)
      await refresh();
      router.push('/');
    } catch (error: unknown) {
      toast.error(
        (error as Error).message ||
          'Failed to change password. Please check your current password.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="bg-card w-full max-w-md space-y-8 rounded-2xl p-8 shadow-xl">
        <div className="text-center">
          <div className="bg-primary/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
            <KeyRound className="text-primary h-6 w-6" />
          </div>
          <h2 className="text-foreground mt-6 text-3xl font-bold tracking-tight">
            {user?.mustChangePassword ? 'Security Update Required' : 'Change Password'}
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            {user?.mustChangePassword
              ? 'You must change your temporary password before continuing.'
              : 'Update your password to keep your account secure.'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Enter current password"
                {...register('currentPassword')}
              />
              {errors.currentPassword && (
                <p className="text-destructive text-sm">{errors.currentPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new secure password"
                {...register('newPassword')}
              />
              {errors.newPassword && (
                <p className="text-destructive text-sm">{errors.newPassword.message}</p>
              )}
              <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-4 text-xs">
                <li>At least 8 characters long</li>
                <li>One uppercase and one lowercase letter</li>
                <li>One number and one special character</li>
              </ul>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Password
          </Button>
        </form>
      </div>
    </div>
  );
}
