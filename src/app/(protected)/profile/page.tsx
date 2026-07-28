'use client';

import React, { useEffect, useState } from 'react';

import { useAuth } from '@/contexts/auth-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { profileApi } from '@/services/api/profile-api';
import { UpdateProfileInput, UpdateProfileSchema } from '@/lib/user/user.schema';

export default function ProfilePage() {
  const { user, accessToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(UpdateProfileSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!accessToken) return;
      try {
        const response = await profileApi.getProfile(accessToken);
        const profile = response.data as Record<string, unknown>;
        reset({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
        });
      } catch {
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [accessToken, reset]);

  const onSubmit = async (data: UpdateProfileInput) => {
    if (!accessToken) return;
    try {
      setIsSaving(true);
      await profileApi.updateProfile(data, accessToken);
      toast.success('Profile updated successfully');
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  const initials = `${user?.name?.split(' ')[0]?.[0] || ''}${
    user?.name?.split(' ')[1]?.[0] || ''
  }`.toUpperCase();

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-card rounded-xl border p-6 shadow-sm">
        <div className="mb-8 flex items-center space-x-6">
          <div className="bg-primary text-primary-foreground flex h-24 w-24 items-center justify-center rounded-full text-3xl font-semibold">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Enter your first name"
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className="text-destructive text-sm">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Enter your last name" {...register('lastName')} />
              {errors.lastName && (
                <p className="text-destructive text-sm">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input disabled value={user?.email || ''} className="bg-muted" />
            <p className="text-muted-foreground text-xs">
              Email addresses cannot be changed. Contact support if you need assistance.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Role</Label>
              <Input disabled value={user?.role || ''} className="bg-muted" />
            </div>

            <div className="space-y-2">
              <Label>Tenant ID</Label>
              <Input disabled value={user?.tenantId || ''} className="bg-muted" />
            </div>
          </div>

          <div className="flex justify-end border-t pt-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
