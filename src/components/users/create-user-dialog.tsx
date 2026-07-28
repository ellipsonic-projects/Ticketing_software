'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { userApi } from '@/services/api/user-api';
import { CreateUserInput, CreateUserSchema } from '@/lib/user/user.schema';

export function CreateUserDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateUserInput>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'ENGINEER',
    },
  });

  const onSubmit = async (data: CreateUserInput) => {
    try {
      await userApi.createUser(data);
      toast.success(
        `User created successfully. An invitation email has been sent to ${data.email}.`,
        { duration: 5000 },
      );
      setOpen(false);
      reset();
      onSuccess?.();
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Failed to create user');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700">
        <Plus className="h-4 w-4" /> New User
      </DialogTrigger>
      <DialogContent className="rounded-2xl p-6 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New User</DialogTitle>
          <DialogDescription className="text-slate-500">
            Add a new user to your tenant organization.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName" className="text-xs font-semibold text-slate-700">
                First Name *
              </Label>
              <Input
                id="firstName"
                {...register('firstName')}
                className={`h-10 bg-slate-50 ${errors.firstName ? 'border-red-400' : 'border-slate-200'}`}
                placeholder="John"
                disabled={isSubmitting}
              />
              {errors.firstName && (
                <span className="text-[11px] text-red-500">{errors.firstName.message}</span>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lastName" className="text-xs font-semibold text-slate-700">
                Last Name *
              </Label>
              <Input
                id="lastName"
                {...register('lastName')}
                className={`h-10 bg-slate-50 ${errors.lastName ? 'border-red-400' : 'border-slate-200'}`}
                placeholder="Doe"
                disabled={isSubmitting}
              />
              {errors.lastName && (
                <span className="text-[11px] text-red-500">{errors.lastName.message}</span>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className={`h-10 bg-slate-50 ${errors.email ? 'border-red-400' : 'border-slate-200'}`}
              placeholder="john@example.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <span className="text-[11px] text-red-500">{errors.email.message}</span>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="role" className="text-xs font-semibold text-slate-700">
              Role *
            </Label>
            <select
              id="role"
              {...register('role')}
              className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              disabled={isSubmitting}
            >
              <option value="TENANT_ADMIN">Tenant Admin</option>
              <option value="ENGINEER">Engineer</option>
            </select>
            {errors.role && <span className="text-[11px] text-red-500">{errors.role.message}</span>}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="h-10 px-5 font-semibold text-slate-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 min-w-[120px] rounded-lg bg-indigo-600 px-6 font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create User'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
