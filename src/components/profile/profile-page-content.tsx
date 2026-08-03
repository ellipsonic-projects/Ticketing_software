'use client';

import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Shield, User as UserIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { profileApi } from '@/services/api/profile-api';
import { UpdateProfileInput, UpdateProfileSchema } from '@/lib/user/user.schema';

export function ProfilePageContent() {
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
        const profile = response.data;
        reset({
          firstName: profile.firstName ?? '',
          lastName: profile.lastName ?? '',
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
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <div className="h-full w-full p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Profile Settings</h1>
        <p className="mt-1.5 text-slate-500">
          Manage your personal information, security preferences, and account settings.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-[320px_1fr] lg:gap-10">
        {/* Left Column: Avatar & Summary */}
        <div className="space-y-6">
          <Card className="overflow-hidden border-slate-200/60 shadow-sm transition-all hover:shadow-md">
            <div className="h-28 w-full bg-gradient-to-r from-blue-600 to-violet-600"></div>
            <CardContent className="flex flex-col items-center pb-8 text-center">
              <div className="-mt-14 mb-4 flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-4xl font-bold text-white shadow-md">
                {initials}
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <div className="mt-1.5 flex items-center justify-center space-x-1.5 rounded-full bg-slate-100 px-3 py-1">
                <Shield className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-xs font-semibold text-slate-600 capitalize">
                  {user?.role?.replace('_', ' ').toLowerCase()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Edit Form */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="border-slate-200/60 shadow-sm transition-all hover:shadow-md">
              <CardHeader className="pb-5">
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
                  <UserIcon className="h-5 w-5 text-blue-600" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Update your basic profile details. This information will be displayed across the
                  platform.
                </CardDescription>
              </CardHeader>
              <Separator className="mb-6 opacity-60" />
              <CardContent className="space-y-6 px-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-semibold text-slate-700">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      className="border-slate-200 bg-white transition-all focus-visible:ring-2 focus-visible:ring-blue-500/20"
                      {...register('firstName')}
                    />
                    {errors.firstName && (
                      <p className="text-sm font-medium text-red-500">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-semibold text-slate-700">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      className="border-slate-200 bg-white transition-all focus-visible:ring-2 focus-visible:ring-blue-500/20"
                      {...register('lastName')}
                    />
                    {errors.lastName && (
                      <p className="text-sm font-medium text-red-500">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700">Email Address</Label>
                  <Input
                    disabled
                    value={user?.email || ''}
                    className="border-slate-200 bg-slate-50 font-medium text-slate-500"
                  />
                  <p className="mt-1.5 text-xs text-slate-400">
                    Email addresses are linked to your identity provider and cannot be changed
                    directly.
                  </p>
                </div>
              </CardContent>
              <Separator className="mt-6 opacity-60" />
              <CardFooter className="flex justify-end rounded-b-xl bg-slate-50/50 p-6">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="min-w-[140px] bg-blue-600 font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
