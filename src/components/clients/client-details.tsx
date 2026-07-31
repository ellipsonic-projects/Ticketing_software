'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useClient, useUpdateClient } from '@/hooks/use-clients';
import { UpdateClientInput, UpdateClientSchema } from '@/lib/client/client.schema';
import { StatusBadge } from '@/components/ui/status-badge';
import { useCan } from '@/hooks/use-can';
import { ProjectGrid } from '@/components/projects/project-grid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActivityTimeline } from '@/components/shared/activity-timeline';
import { useClientActivity } from '@/hooks/use-clients';
import { useClientOverviewStats } from '@/hooks/use-client-stats';
import { format } from 'date-fns';
import { Building2, Folder, Ticket, Users, Shield, Clock } from 'lucide-react';

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <button onClick={() => router.push('/clients')} className="hover:text-slate-900 transition-colors">
            Clients
          </button>
          <span>›</span>
          <span className="font-medium text-slate-900">{client.name}</span>
        </div>
        <div className="flex items-center gap-4">
          {!isEditMode && canUpdate && (
            <Button
              variant="outline"
              onClick={() => router.push(`/clients/${id}?tab=edit`)}
            >
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
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-2xl font-bold tracking-tighter text-red-600 shadow-sm border border-slate-100">
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
                    <span className="text-slate-400">📅</span> Created on {format(new Date(client.createdAt), 'MMM d, yyyy')}
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
              <span className="text-xl font-bold text-slate-900">{isStatsLoading ? '-' : statsData?.totalProjects}</span>
              <span className="text-xs text-slate-500">Total Projects</span>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4 text-center">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Ticket className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-slate-900">{isStatsLoading ? '-' : statsData?.totalTickets}</span>
              <span className="text-xs text-slate-500">Total Tickets</span>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4 text-center">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-slate-900">{isStatsLoading ? '-' : statsData?.engineersCount}</span>
              <span className="text-xs text-slate-500">Engineers</span>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4 text-center">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-slate-900">{isStatsLoading ? '-' : `${statsData?.slaHealthPercent}%`}</span>
              <span className="text-xs text-slate-500">SLA Health</span>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4 text-center">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <Clock className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                {isStatsLoading || !statsData?.lastActivity ? '-' : format(new Date(statsData.lastActivity), 'MMM d')}
              </span>
              <span className="text-xs text-slate-500">Last Activity</span>
            </Card>
          </div>
        </div>
      )}

      {isEditMode && (

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input id="name" {...register('name')} disabled={!isEditMode} />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Client Code</Label>
                <Input id="code" {...register('code')} disabled={!isEditMode} />
                {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactName">Primary Contact</Label>
                <Input id="contactName" {...register('contactName')} disabled={!isEditMode} />
                {errors.contactName && <p className="text-xs text-red-500">{errors.contactName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" {...register('email')} disabled={!isEditMode} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" {...register('phone')} disabled={!isEditMode} />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input id="website" {...register('website')} disabled={!isEditMode} />
                {errors.website && <p className="text-xs text-red-500">{errors.website.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Billing Address</Label>
              <Textarea id="address" {...register('address')} disabled={!isEditMode} className="min-h-[100px]" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Internal Notes</Label>
              <Textarea id="notes" {...register('notes')} disabled={!isEditMode} className="min-h-[100px]" />
            </div>

            {isEditMode && (
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/clients/${id}`)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={isPending}>
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
          <TabsList className="bg-transparent border-b border-slate-200 rounded-none w-full justify-start h-auto p-0 gap-6">
            <TabsTrigger 
              value="overview" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-1"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="projects"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-1"
            >
              Projects
            </TabsTrigger>
            <TabsTrigger 
              value="activity"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-1"
            >
              Activity
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="text-sm text-slate-500 p-8 text-center bg-white border border-slate-200 rounded-xl">
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
                <ActivityTimeline 
                  events={activityData?.data} 
                  isLoading={isActivityLoading} 
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
