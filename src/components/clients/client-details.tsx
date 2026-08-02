'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Building2,
  Clock,
  Folder,
  Loader2,
  Save,
  Shield,
  Ticket,
  Users,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { ProjectGrid } from '@/components/projects/project-grid';
import { ActivityTimeline } from '@/components/shared/activity-timeline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useCan } from '@/hooks/use-can';
import { useClientOverviewStats } from '@/hooks/use-client-stats';
import { useClient, useClientActivity, useUpdateClient } from '@/hooks/use-clients';
import { UpdateClientInput, UpdateClientSchema } from '@/lib/client/client.schema';

interface ClientDetailsProps {
  id: string;
}

export function ClientDetails({ id }: ClientDetailsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('tab') === 'edit';

  const { data, isLoading } = useClient(id);
  const { mutateAsync: updateClient, isPending } = useUpdateClient();
  const canUpdate = useCan('CLIENT_UPDATE');

  const { data: activityData, isLoading: isActivityLoading } = useClientActivity(id);
  const { data: statsData, isLoading: isStatsLoading } = useClientOverviewStats(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateClientInput>({
    resolver: zodResolver(UpdateClientSchema),
  });

  useEffect(() => {
    if (data?.client) {
      reset({
        name: data.client.name,
        code: data.client.code || '',
        email: data.client.email || '',
        phone: data.client.phone || '',
        website: data.client.website || '',
        contactName: data.client.contactName || '',
        address: data.client.address || '',
        notes: data.client.notes || '',
        status: data.client.status as 'ACTIVE' | 'INACTIVE',
      });
    }
  }, [data?.client, reset]);

  const onSubmit = async (formData: UpdateClientInput) => {
    try {
      await updateClient({ id, data: formData });
      toast.success('Client updated successfully');
      router.push(`/clients/${id}`); // Exit edit mode
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to update client');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const client = data?.client;
  if (!client) {
    return <div className="p-8 text-center text-slate-500">Client not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => router.push('/clients')}
            className="text-slate-500 transition-colors hover:text-slate-900"
          >
            Clients
          </button>
          <span className="mb-0.5 text-lg leading-none text-slate-400">›</span>
          <span className="font-semibold text-slate-900">{client.name}</span>
        </div>
        <div className="flex items-center gap-4">
          {!isEditMode && canUpdate && (
            <Button variant="outline" onClick={() => router.push(`/clients/${id}?tab=edit`)}>
              Edit Client
            </Button>
          )}
        </div>
      </div>

      {!isEditMode && (
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Client Info Card */}
          <Card className="flex-1">
            <CardContent className="flex items-start gap-6 p-6">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-2xl font-bold tracking-tighter text-red-600 shadow-sm">
                {client.code || client.name.substring(0, 4).toUpperCase()}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-slate-900">{client.name}</h1>
                  <StatusBadge status={client.status} />
                </div>
                <div className="flex flex-col gap-1 text-sm text-slate-500">
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">✉</span> {client.email}
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">📞</span> {client.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">📅</span> Created on{' '}
                    {format(new Date(client.createdAt), 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 lg:flex-1">
            <Card className="flex flex-col items-center justify-center p-4 text-center">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Folder className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                {isStatsLoading ? '-' : statsData?.totalProjects}
              </span>
              <span className="text-xs text-slate-500">Total Projects</span>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4 text-center">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Ticket className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                {isStatsLoading ? '-' : statsData?.totalTickets}
              </span>
              <span className="text-xs text-slate-500">Total Tickets</span>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4 text-center">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                {isStatsLoading ? '-' : statsData?.engineersCount}
              </span>
              <span className="text-xs text-slate-500">Engineers</span>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4 text-center">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                {isStatsLoading ? '-' : `${statsData?.slaHealthPercent}%`}
              </span>
              <span className="text-xs text-slate-500">SLA Health</span>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4 text-center">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <Clock className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                {isStatsLoading || !statsData?.lastActivity
                  ? '-'
                  : format(new Date(statsData.lastActivity), 'MMM d')}
              </span>
              <span className="text-xs text-slate-500">Last Activity</span>
            </Card>
          </div>
        </div>
      )}

      {isEditMode && (
        <Card className="mt-6 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-white pt-6 pb-4">
            <CardTitle className="text-lg font-medium text-slate-900">Client Information</CardTitle>
          </CardHeader>
          <CardContent className="bg-white p-0">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
              <div className="space-y-8 p-6 md:p-8">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-medium text-slate-700">
                      Company Name
                    </Label>
                    <Input
                      id="name"
                      {...register('name')}
                      disabled={!isEditMode}
                      className="h-10 border-slate-200 bg-white shadow-none focus-visible:ring-indigo-500"
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-xs font-medium text-slate-700">
                      Client Code
                    </Label>
                    <Input
                      id="code"
                      {...register('code')}
                      disabled={!isEditMode}
                      className="h-10 border-slate-200 bg-white shadow-none focus-visible:ring-indigo-500"
                    />
                    {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactName" className="text-xs font-medium text-slate-700">
                      Primary Contact
                    </Label>
                    <Input
                      id="contactName"
                      {...register('contactName')}
                      disabled={!isEditMode}
                      className="h-10 border-slate-200 bg-white shadow-none focus-visible:ring-indigo-500"
                    />
                    {errors.contactName && (
                      <p className="text-xs text-red-500">{errors.contactName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-medium text-slate-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      disabled={!isEditMode}
                      className="h-10 border-slate-200 bg-white shadow-none focus-visible:ring-indigo-500"
                    />
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-medium text-slate-700">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      {...register('phone')}
                      disabled={!isEditMode}
                      className="h-10 border-slate-200 bg-white shadow-none focus-visible:ring-indigo-500"
                    />
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-xs font-medium text-slate-700">
                      Website URL
                    </Label>
                    <Input
                      id="website"
                      {...register('website')}
                      disabled={!isEditMode}
                      className="h-10 border-slate-200 bg-white shadow-none focus-visible:ring-indigo-500"
                    />
                    {errors.website && (
                      <p className="text-xs text-red-500">{errors.website.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-xs font-medium text-slate-700">
                    Billing Address
                  </Label>
                  <Textarea
                    id="address"
                    {...register('address')}
                    disabled={!isEditMode}
                    className="min-h-[120px] resize-y border-slate-200 bg-white shadow-none focus-visible:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-xs font-medium text-slate-700">
                    Internal Notes
                  </Label>
                  <Textarea
                    id="notes"
                    {...register('notes')}
                    disabled={!isEditMode}
                    className="min-h-[120px] resize-y border-slate-200 bg-white shadow-none focus-visible:ring-indigo-500"
                  />
                </div>
              </div>

              {isEditMode && (
                <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 md:px-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(`/clients/${id}`)}
                    disabled={isPending}
                    className="h-9 rounded-lg border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="h-9 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                  >
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      )}

      {!isEditMode && (
        <Tabs defaultValue="projects" className="mt-8">
          <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b border-slate-200 bg-transparent p-0">
            <TabsTrigger
              value="overview"
              className="rounded-none border-b-2 border-transparent px-1 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="rounded-none border-b-2 border-transparent px-1 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Projects
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="rounded-none border-b-2 border-transparent px-1 py-3 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              Overview content goes here.
            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <ProjectGrid clientId={id} />
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity History</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityTimeline events={activityData?.data} isLoading={isActivityLoading} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
