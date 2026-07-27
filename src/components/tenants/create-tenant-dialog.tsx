/* eslint-disable @typescript-eslint/no-explicit-any */
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
    resolver: zodResolver(CreateTenantSchema) as any,
    defaultValues: {
      name: '',
      domain: '',
      logoUrl: '',
      primaryColor: '#4f46e5',
      contactEmail: '',
      contactPhone: '',
      timezone: 'UTC',
      currency: 'USD',
    },
  });

  const onSubmit = async (data: CreateTenantInput) => {
    try {
      await tenantApi.createTenant(data, accessToken!);
      toast.success('Tenant created successfully');
      setOpen(false);
      reset();
      // Force reload list to see new tenant
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create tenant');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700">
        <Plus className="mr-2 h-4 w-4" /> New Tenant
      </DialogTrigger>
      <DialogContent className="rounded-2xl p-6 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New Tenant</DialogTitle>
          <DialogDescription className="text-slate-500">
            Set up a new tenant workspace and configuration.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit as any)} className="mt-4 space-y-4">
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
            {errors.name && <span className="text-[11px] text-red-500">{errors.name.message}</span>}
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
              <Label htmlFor="contactPhone" className="text-xs font-semibold text-slate-700">
                Contact Phone
              </Label>
              <Input
                id="contactPhone"
                {...register('contactPhone')}
                className="h-10 border-slate-200 bg-slate-50"
                placeholder="+1 234 567 8900"
                disabled={isSubmitting}
              />
              {errors.contactPhone && (
                <span className="text-[11px] text-red-500">{errors.contactPhone.message}</span>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="domain" className="text-xs font-semibold text-slate-700">
              Custom Domain
            </Label>
            <Input
              id="domain"
              {...register('domain')}
              className="h-10 border-slate-200 bg-slate-50"
              placeholder="support.acme.com"
              disabled={isSubmitting}
            />
            {errors.domain && (
              <span className="text-[11px] text-red-500">{errors.domain.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="primaryColor" className="text-xs font-semibold text-slate-700">
                Brand Color
              </Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  id="primaryColorColor"
                  {...register('primaryColor')}
                  className="h-10 w-12 cursor-pointer rounded border-slate-200 p-1"
                  disabled={isSubmitting}
                />
                <Input
                  type="text"
                  {...register('primaryColor')}
                  className="h-10 flex-1 border-slate-200 bg-slate-50 font-mono text-xs uppercase"
                  disabled={isSubmitting}
                />
              </div>
              {errors.primaryColor && (
                <span className="text-[11px] text-red-500">{errors.primaryColor.message}</span>
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
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Tenant'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
