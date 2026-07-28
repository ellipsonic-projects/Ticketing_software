'use client';

import { useEffect, useState } from 'react';

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
import { useAuth } from '@/hooks/use-auth';
import { tenantApi } from '@/services/api/tenant-api';
import { CreateTenantInput, CreateTenantSchema } from '@/lib/tenant/tenant.schema';

export function CreateTenantDialog() {
  const [open, setOpen] = useState(false);
  const { accessToken } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateTenantInput>({
    resolver: zodResolver(CreateTenantSchema),
    defaultValues: {
      name: '',
      domain: null,
      contactEmail: null,
      contactPhone: null,
      timezone: 'UTC',
      currency: 'USD',
      admin: {
        firstName: '',
        lastName: '',
        email: '',
      },
    },
  });

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = async (data: CreateTenantInput) => {
    try {
      await tenantApi.createTenant(data, accessToken!);
      toast.success(`Tenant created. An invitation email has been sent to ${data.admin?.email}.`, {
        duration: 5000,
      });
      setOpen(false);
      reset();
      window.location.reload();
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Failed to create tenant');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700">
        <Plus className="mr-2 h-4 w-4" /> New Tenant
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New Tenant</DialogTitle>
          <DialogDescription className="text-slate-500">
            Set up a new tenant workspace and provisioning the first administrator.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6">
          {/* Organization Section */}
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-sm font-bold text-slate-900">
              Organization Information
            </h3>

            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
                Company Name *
              </Label>
              <Input
                id="name"
                {...register('name')}
                className={`h-10 bg-slate-50 ${errors.name ? 'border-red-400' : 'border-slate-200'}`}
                placeholder="Acme Inc"
                disabled={isSubmitting}
              />
              {errors.name && (
                <span className="text-[11px] text-red-500">{errors.name.message}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="contactEmail" className="text-xs font-semibold text-slate-700">
                  Contact Email
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  {...register('contactEmail')}
                  className="h-10 border-slate-200 bg-slate-50"
                  placeholder="admin@acme.com"
                  disabled={isSubmitting}
                />
                {errors.contactEmail && (
                  <span className="text-[11px] text-red-500">{errors.contactEmail.message}</span>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="timezone" className="text-xs font-semibold text-slate-700">
                  Timezone
                </Label>
                <Input
                  id="timezone"
                  {...register('timezone')}
                  className="h-10 border-slate-200 bg-slate-50"
                  disabled={isSubmitting}
                />
                {errors.timezone && (
                  <span className="text-[11px] text-red-500">{errors.timezone.message}</span>
                )}
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Administrator Section */}
          <div className="space-y-4">
            <h3 className="border-b pb-2 text-sm font-bold text-slate-900">Tenant Administrator</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="adminFirstName" className="text-xs font-semibold text-slate-700">
                  First Name *
                </Label>
                <Input
                  id="adminFirstName"
                  {...register('admin.firstName')}
                  className={`h-10 bg-slate-50 ${errors.admin?.firstName ? 'border-red-400' : 'border-slate-200'}`}
                  placeholder="Jane"
                  disabled={isSubmitting}
                />
                {errors.admin?.firstName && (
                  <span className="text-[11px] text-red-500">{errors.admin.firstName.message}</span>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="adminLastName" className="text-xs font-semibold text-slate-700">
                  Last Name *
                </Label>
                <Input
                  id="adminLastName"
                  {...register('admin.lastName')}
                  className={`h-10 bg-slate-50 ${errors.admin?.lastName ? 'border-red-400' : 'border-slate-200'}`}
                  placeholder="Doe"
                  disabled={isSubmitting}
                />
                {errors.admin?.lastName && (
                  <span className="text-[11px] text-red-500">{errors.admin.lastName.message}</span>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="adminEmail" className="text-xs font-semibold text-slate-700">
                Admin Email *
              </Label>
              <Input
                id="adminEmail"
                type="email"
                {...register('admin.email')}
                className={`h-10 bg-slate-50 ${errors.admin?.email ? 'border-red-400' : 'border-slate-200'}`}
                placeholder="jane.doe@acme.com"
                disabled={isSubmitting}
              />
              {errors.admin?.email && (
                <span className="text-[11px] text-red-500">{errors.admin.email.message}</span>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t pt-6">
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
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Tenant'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
