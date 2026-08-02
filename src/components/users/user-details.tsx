/* eslint-disable */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Role, User, UserStatus } from '@prisma/client';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Save,
  ShieldAlert,
  Trash2,
  XCircle,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/ui/status-badge';
import { userApi } from '@/services/api/user-api';
import { UpdateUserInput, UpdateUserSchema } from '@/lib/user/user.schema';

export function UserDetails({ id }: { id: string }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModifying, setIsModifying] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [error, setError] = useState('');

  // Modals
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(UpdateUserSchema),
  });

  const fetchUser = async () => {
    try {
      const response = await userApi.getUser(id);
      setUser(response.data);
      reset({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        role: response.data.role,
      });
    } catch (_err: unknown) {
      setError('Failed to load user details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const onSubmit = async (data: UpdateUserInput) => {
    try {
      await userApi.updateUser(id, data);
      toast.success('User updated successfully');
      fetchUser();
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to update user');
    }
  };

  const updateStatus = async (id: string) => {
    if (!user) return;
    setIsStatusUpdating(true);
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await userApi.updateUserStatus(id, newStatus);
      toast.success(`User ${newStatus.toLowerCase()} successfully`);
      fetchUser();
    } catch (_err: unknown) {
      toast.error('Failed to update status');
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsModifying(true);
    try {
      await userApi.deleteUser(id);
      toast.success('User deleted successfully');
      router.push('/users');
    } catch (_err: unknown) {
      toast.error('Failed to delete user');
      setIsModifying(false);
      setShowDeleteDialog(false);
    }
  };

  const handleBack = () => {
    if (isDirty) {
      setShowUnsavedDialog(true);
    } else {
      router.push('/users');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-500">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || 'User not found'}</AlertDescription>
        </Alert>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/users')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={handleBack}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-sm text-slate-500">Manage user configuration and permissions</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col pb-24">
        <div className="mx-auto w-full max-w-3xl space-y-8">
          <form id="user-details-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* General Section */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 border-b border-slate-100 pb-4">
                <h2 className="text-lg font-semibold text-slate-900">General Information</h2>
                <p className="text-sm text-slate-500">Basic details about this user.</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-semibold text-slate-700">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    {...register('firstName')}
                    className={`h-10 bg-slate-50 ${errors.firstName ? 'border-red-400' : 'border-slate-200'}`}
                    disabled={isSubmitting}
                  />
                  {errors.firstName && (
                    <span className="text-[11px] text-red-500">{errors.firstName.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-semibold text-slate-700">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    {...register('lastName')}
                    className={`h-10 bg-slate-50 ${errors.lastName ? 'border-red-400' : 'border-slate-200'}`}
                    disabled={isSubmitting}
                  />
                  {errors.lastName && (
                    <span className="text-[11px] text-red-500">{errors.lastName.message}</span>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-sm font-semibold text-slate-700">Email Address</Label>
                  <Input
                    value={user.email}
                    className="h-10 cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                    disabled
                  />
                  <p className="text-[11px] text-slate-500">Email cannot be changed.</p>
                </div>
              </div>
            </div>

            {/* Role Section */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 border-b border-slate-100 pb-4">
                <h2 className="text-lg font-semibold text-slate-900">Role & Permissions</h2>
                <p className="text-sm text-slate-500">
                  Determine what this user can access in the platform.
                </p>
              </div>

              <div className="max-w-md space-y-2">
                <Label htmlFor="role" className="text-sm font-semibold text-slate-700">
                  System Role
                </Label>
                <select
                  id="role"
                  {...register('role')}
                  disabled={isSubmitting || user.role === 'PLATFORM_ADMIN'} // Don't allow changing platform admin role
                  className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none disabled:opacity-50"
                >
                  <option value="TENANT_ADMIN">Tenant Admin</option>
                  <option value="ENGINEER">Engineer</option>
                </select>
                {errors.role && (
                  <span className="text-[11px] text-red-500">{errors.role.message}</span>
                )}
              </div>
            </div>
          </form>

          {/* Status Section */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 border-b border-slate-100 pb-4">
              <h2 className="text-lg font-semibold text-slate-900">Account Status</h2>
              <p className="text-sm text-slate-500">Manage user access to the system.</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="flex items-center text-sm font-medium text-slate-900">
                  Current Status:{' '}
                  <StatusBadge status={user.status} variant="ring" className="ml-2" />
                </p>
                <div className="mt-1 flex items-center gap-2">
                  {user.status === 'ACTIVE' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : user.status === 'INVITED' ? (
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <p className="text-[13px] text-slate-500">
                    {user.status === 'ACTIVE'
                      ? 'This user can log in and access the system.'
                      : user.status === 'INVITED'
                        ? 'This user has been invited but has not yet activated their account.'
                        : 'This user is currently prevented from logging in.'}
                  </p>
                </div>
              </div>
              <Button
                variant={user.status === 'ACTIVE' ? 'outline' : 'default'}
                onClick={() => updateStatus(user.id)}
                disabled={isStatusUpdating}
                className={`h-9 w-full sm:w-auto ${
                  user.status === 'ACTIVE'
                    ? 'border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {isStatusUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {user.status === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
              </Button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-xl border border-red-200 bg-red-50/50 p-6 shadow-sm">
            <div className="mb-4 border-b border-red-100 pb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-600" />
                <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
              </div>
              <p className="mt-1 text-sm text-red-600/80">Irreversible and destructive actions.</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Delete User</h3>
                <p className="mt-1 text-[13px] text-slate-500">
                  Permanently remove this user. This action cannot be undone.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                disabled={isModifying}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete User
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Save Bar */}
      {isDirty && (
        <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-slate-200 bg-white p-4 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] lg:left-64">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
              <p className="text-sm font-medium text-slate-600">You have unsaved changes</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => reset()}
                disabled={isSubmitting}
                className="h-9 px-4 text-sm font-medium"
              >
                Discard
              </Button>
              <Button
                type="submit"
                form="user-details-form"
                disabled={isSubmitting}
                className="h-9 bg-indigo-600 px-6 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Unsaved Changes Dialog */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to leave? Your changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => router.push('/users')}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account and remove
              their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isModifying}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isModifying}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            >
              {isModifying ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
