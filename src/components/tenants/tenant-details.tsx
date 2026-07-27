/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Tenant, TenantStatus } from '@prisma/client';
import { ArrowLeft, Building2, Loader2, Palette, Save, ShieldAlert, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { tenantApi } from '@/services/api/tenant-api';
import { UpdateTenantInput, UpdateTenantSchema } from '@/lib/tenant/tenant.schema';

export function TenantDetails({ id }: { id: string }) {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateTenantInput>({
    resolver: zodResolver(UpdateTenantSchema),
  });

  const fetchTenant = async () => {
    if (!accessToken) return;
    try {
      setLoading(true);
      const res = await tenantApi.getTenant(id, accessToken);
      setTenant(res.data);
      reset({
        name: res.data.name,
        domain: res.data.domain,
        logoUrl: res.data.logoUrl,
        primaryColor: res.data.primaryColor,
        contactEmail: res.data.contactEmail,
        contactPhone: res.data.contactPhone,
        timezone: res.data.timezone,
        currency: res.data.currency,
      });
    } catch (err: unknown) {
      toast.error('Failed to load tenant details');
      router.push('/platform/tenants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchTenant(), 0);
    return () => clearTimeout(timer);
  }, [id, accessToken]);

  const onSubmit = async (data: UpdateTenantInput) => {
    try {
      await tenantApi.updateTenant(id, data, accessToken!);
      toast.success('Tenant updated successfully');
      setIsEditing(false);
      fetchTenant();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to update tenant');
    }
  };

  const handleStatusChange = async (status: TenantStatus) => {
    try {
      await tenantApi.updateTenantStatus(id, status, accessToken!);
      toast.success(`Tenant marked as ${status}`);
      fetchTenant();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    }
  };

  if (loading || !tenant) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/platform/tenants')}
          className="h-10 w-10 rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-50"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{tenant.name}</h1>
            <span
              className={`rounded-md px-2.5 py-0.5 text-xs font-bold ${tenant.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : tenant.status === 'SUSPENDED' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}
            >
              {tenant.status}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500">
            {tenant.slug} {tenant.domain && `• ${tenant.domain}`}
          </p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-indigo-600 font-semibold text-white hover:bg-indigo-700"
          >
            Edit Details
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsEditing(false);
                reset();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="gap-2 bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}{' '}
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs defaultValue="general" className="w-full">
            <div className="border-b border-slate-100 px-6">
              <TabsList className="h-14 gap-8 bg-transparent p-0">
                <TabsTrigger
                  value="general"
                  className="h-14 rounded-none px-0 text-sm font-semibold text-slate-500 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 data-[state=active]:shadow-none"
                >
                  <Building2 className="mr-2 h-4 w-4" /> General
                </TabsTrigger>
                <TabsTrigger
                  value="branding"
                  className="h-14 rounded-none px-0 text-sm font-semibold text-slate-500 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 data-[state=active]:shadow-none"
                >
                  <Palette className="mr-2 h-4 w-4" /> Branding
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className="h-14 rounded-none px-0 text-sm font-semibold text-slate-500 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 data-[state=active]:shadow-none"
                >
                  <Users className="mr-2 h-4 w-4" /> Contact
                </TabsTrigger>
                <TabsTrigger
                  value="status"
                  className="h-14 rounded-none px-0 text-sm font-semibold text-slate-500 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 data-[state=active]:shadow-none"
                >
                  <ShieldAlert className="mr-2 h-4 w-4" /> Status
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-8">
              <TabsContent value="general" className="m-0 max-w-xl space-y-6">
                <div className="space-y-2">
                  <Label className="font-semibold text-slate-700">Company Name</Label>
                  <Input {...register('name')} disabled={!isEditing} className="bg-slate-50" />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-slate-700">Custom Domain</Label>
                  <Input
                    {...register('domain')}
                    disabled={!isEditing}
                    className="bg-slate-50"
                    placeholder="e.g. support.acme.com"
                  />
                  {errors.domain && (
                    <p className="mt-1 text-xs text-red-500">{errors.domain.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-semibold text-slate-700">Timezone</Label>
                    <Input
                      {...register('timezone')}
                      disabled={!isEditing}
                      className="bg-slate-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold text-slate-700">Currency</Label>
                    <Input
                      {...register('currency')}
                      disabled={!isEditing}
                      className="bg-slate-50"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="branding" className="m-0 max-w-xl space-y-6">
                <div className="space-y-2">
                  <Label className="font-semibold text-slate-700">Logo URL</Label>
                  <div className="flex items-start gap-4">
                    {tenant.logoUrl ? (
                      <img
                        src={tenant.logoUrl}
                        alt="Logo"
                        className="h-16 w-16 rounded-lg border border-slate-200 object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-400">
                        No Logo
                      </div>
                    )}
                    <div className="flex-1">
                      <Input
                        {...register('logoUrl')}
                        disabled={!isEditing}
                        className="bg-slate-50"
                        placeholder="https://"
                      />
                      {errors.logoUrl && (
                        <p className="mt-1 text-xs text-red-500">{errors.logoUrl.message}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-slate-700">Primary Brand Color</Label>
                  <div className="flex gap-3">
                    <Input
                      type="color"
                      {...register('primaryColor')}
                      disabled={!isEditing}
                      className="h-10 w-12 cursor-pointer rounded p-1"
                    />
                    <Input
                      {...register('primaryColor')}
                      disabled={!isEditing}
                      className="bg-slate-50 font-mono uppercase"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="m-0 max-w-xl space-y-6">
                <div className="space-y-2">
                  <Label className="font-semibold text-slate-700">Contact Email</Label>
                  <Input
                    type="email"
                    {...register('contactEmail')}
                    disabled={!isEditing}
                    className="bg-slate-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-slate-700">Contact Phone</Label>
                  <Input
                    {...register('contactPhone')}
                    disabled={!isEditing}
                    className="bg-slate-50"
                  />
                </div>
              </TabsContent>

              <TabsContent value="status" className="m-0 max-w-xl space-y-6">
                <div>
                  <h3 className="mb-1 text-lg font-bold text-slate-900">Tenant Status</h3>
                  <p className="mb-6 text-sm text-slate-500">
                    Manage the active state and access to this tenant workspace.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                      <div>
                        <p className="font-semibold text-slate-900">Active</p>
                        <p className="mt-1 text-xs text-slate-500">Tenant functions normally.</p>
                      </div>
                      <Button
                        type="button"
                        variant={tenant.status === 'ACTIVE' ? 'default' : 'outline'}
                        className={
                          tenant.status === 'ACTIVE' ? 'bg-emerald-600 hover:bg-emerald-700' : ''
                        }
                        onClick={() => handleStatusChange('ACTIVE')}
                        disabled={tenant.status === 'ACTIVE'}
                      >
                        Set Active
                      </Button>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                      <div>
                        <p className="font-semibold text-amber-900">Suspended</p>
                        <p className="mt-1 text-xs text-amber-700/70">
                          Temporarily block all access.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant={tenant.status === 'SUSPENDED' ? 'default' : 'outline'}
                        className={
                          tenant.status === 'SUSPENDED'
                            ? 'bg-amber-600 hover:bg-amber-700'
                            : 'border-amber-200 text-amber-700 hover:bg-amber-100'
                        }
                        onClick={() => handleStatusChange('SUSPENDED')}
                        disabled={tenant.status === 'SUSPENDED'}
                      >
                        Suspend Tenant
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </form>
      </div>
    </div>
  );
}
