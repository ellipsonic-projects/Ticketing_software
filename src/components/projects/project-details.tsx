'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ArrowLeft, Building2, Calendar, FileText, Pencil, Settings2, Users } from 'lucide-react';

import { ActivityTimeline } from '@/components/shared/activity-timeline';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/ui/status-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCan } from '@/hooks/use-can';
import { useProject, useProjectActivity } from '@/hooks/use-projects';
import { useProjectHolidays, useTenantSLA } from '@/hooks/use-sla';

import { ProjectSupportConfig } from './project-support-config';
import { BusinessHoursCard } from './sla/business-hours-card';
import { HolidaysCard } from './sla/holidays-card';
import { SLAPolicyCard } from './sla/sla-policy-card';

export function ProjectDetails({ projectId }: { projectId: string }) {
  const router = useRouter();
  const { data: project, isLoading, error } = useProject(projectId);
  const { data: slaData } = useTenantSLA();
  const { data: holidaysData } = useProjectHolidays(projectId);
  const { data: activityData, isLoading: isActivityLoading } = useProjectActivity(projectId);
  const canUpdateProject = useCan('PROJECT_UPDATE');

  if (isLoading) {
    return (
      <div className="flex h-full flex-col p-8">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[250px] w-full rounded-xl" />
            <Skeleton className="h-[150px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <FileText className="mb-4 h-12 w-12 text-slate-300" />
        <h2 className="text-xl font-semibold text-slate-900">Project Not Found</h2>
        <p className="mt-2 text-slate-500">
          The project you are looking for does not exist or you do not have permission to view it.
        </p>
        <Button onClick={() => router.push('/projects')} className="mt-6" variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-auto p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push('/projects')}
            variant="outline"
            size="icon"
            className="h-9 w-9"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{project.name}</h1>
              <StatusBadge status={project.status} />
              {project.archivedAt && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  Archived
                </span>
              )}
            </div>
            {project.code && (
              <p className="mt-1 text-sm text-slate-500">Project Code: {project.code}</p>
            )}
          </div>
        </div>

        {canUpdateProject && !project.archivedAt && (
          <Button
            onClick={() => router.push(`/projects/${project.id}/edit`)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Pencil className="mr-2 h-4 w-4" /> Edit Project
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Column */}
        <div className="space-y-6 md:col-span-2">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-6 h-auto w-full justify-start rounded-none border-b border-slate-200 bg-transparent p-0">
              <TabsTrigger
                value="general"
                className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 data-[state=active]:shadow-none data-[state=inactive]:text-slate-500 data-[state=inactive]:hover:text-slate-700"
              >
                General
              </TabsTrigger>
              <TabsTrigger
                value="support"
                className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 data-[state=active]:shadow-none data-[state=inactive]:text-slate-500 data-[state=inactive]:hover:text-slate-700"
              >
                Support
              </TabsTrigger>
              <TabsTrigger
                value="sla"
                className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 data-[state=active]:shadow-none data-[state=inactive]:text-slate-500 data-[state=inactive]:hover:text-slate-700"
              >
                SLA
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 data-[state=active]:shadow-none data-[state=inactive]:text-slate-500 data-[state=inactive]:hover:text-slate-700"
              >
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-0 space-y-6">
              {/* General Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-indigo-500" /> General Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">Description</h4>
                      <p className="mt-1 text-sm whitespace-pre-wrap text-slate-900">
                        {project.description || 'No description provided.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tickets Placeholder */}
              <Card className="border-dashed opacity-50 grayscale select-none">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings2 className="h-5 w-5 text-slate-500" /> Tickets
                  </CardTitle>
                  <span className="rounded bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-600">
                    Coming Soon (Phase 3)
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="flex h-32 items-center justify-center rounded-lg bg-slate-100 text-sm font-medium text-slate-400">
                    Ticket management will be available here.
                  </div>
                </CardContent>
              </Card>

              <Card className="border-dashed opacity-50 grayscale select-none">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings2 className="h-5 w-5 text-slate-500" /> Tickets
                  </CardTitle>
                  <span className="rounded bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-600">
                    Coming Soon (Phase 3)
                  </span>
                </CardHeader>
                <CardContent>
                  <div className="flex h-32 items-center justify-center rounded-lg bg-slate-100 text-sm font-medium text-slate-400">
                    Ticket management will be available here.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="support" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings2 className="h-5 w-5 text-indigo-500" /> Support Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ProjectSupportConfig project={project} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sla" className="mt-0 space-y-6">
              {/* SLA Summary Badge */}
              <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-slate-50 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">SLA:</span>
                  {slaData?.policy ? (
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                      Enabled
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-500/10 ring-inset">
                      Unconfigured
                    </span>
                  )}
                </div>

                {slaData?.policy && (
                  <>
                    <div className="h-4 w-px bg-slate-300" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">Business Hours:</span>
                      {slaData.policy.businessHoursEnabled ? (
                        <span className="text-sm font-medium text-slate-900">Enabled</span>
                      ) : (
                        <span className="text-sm font-medium text-slate-500">Disabled</span>
                      )}
                    </div>
                    <div className="h-4 w-px bg-slate-300" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">Holidays:</span>
                      <span className="text-sm font-medium text-slate-900">
                        {holidaysData?.holidays?.length || 0}
                      </span>
                    </div>
                    <div className="h-4 w-px bg-slate-300" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">Response:</span>
                      <span className="text-sm font-medium text-slate-900">
                        {slaData.policy.responseTimeMinutes} min
                      </span>
                    </div>
                    <div className="h-4 w-px bg-slate-300" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">Resolution:</span>
                      <span className="text-sm font-medium text-slate-900">
                        {slaData.policy.resolutionTimeMinutes >= 60
                          ? `${Math.round(slaData.policy.resolutionTimeMinutes / 60)} hrs`
                          : `${slaData.policy.resolutionTimeMinutes} min`}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <BusinessHoursCard projectId={project.id} isArchived={!!project.archivedAt} />
              <HolidaysCard projectId={project.id} isArchived={!!project.archivedAt} />
            </TabsContent>

            <TabsContent value="activity" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-indigo-500" /> Activity History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ActivityTimeline events={activityData?.data} isLoading={isActivityLoading} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-indigo-500" /> Client Organization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 font-bold text-slate-600">
                  {project.client?.name?.substring(0, 2).toUpperCase() || '??'}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{project.client?.name}</p>
                  {project.client?.code && (
                    <p className="text-xs text-slate-500">{project.client.code}</p>
                  )}
                </div>
              </div>
              <div className="mt-4 border-t border-slate-100 pt-4">
                <Button
                  onClick={() => router.push(`/clients/${project.clientId}`)}
                  variant="link"
                  className="h-auto px-0 text-indigo-600"
                >
                  View Client Details &rarr;
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Support Summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings2 className="h-5 w-5 text-indigo-500" /> Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Status</span>
                  {project.supportStatus === 'ENABLED' ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Enabled
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-800 ring-1 ring-yellow-600/20 ring-inset">
                      <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                      Paused
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Default Priority</span>
                  <span className="text-sm font-medium text-slate-900 capitalize">
                    {project.defaultPriority?.toLowerCase() || 'Medium'}
                  </span>
                </div>
                {project.supportEmail && (
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                    <span className="text-sm text-slate-500">Email</span>
                    <span
                      className="max-w-[150px] truncate text-sm text-slate-900"
                      title={project.supportEmail}
                    >
                      {project.supportEmail}
                    </span>
                  </div>
                )}
                {project.supportPhone && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Phone</span>
                    <span className="text-sm text-slate-900">{project.supportPhone}</span>
                  </div>
                )}
                <Button
                  variant="outline"
                  className="mt-2 w-full text-xs"
                  onClick={() => {
                    const supportTab = document.querySelector('[value="support"]') as HTMLElement;
                    if (supportTab) supportTab.click();
                  }}
                >
                  View Configuration
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* SLA Placeholder */}
          <Card className="border-dashed opacity-50 grayscale select-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings2 className="h-5 w-5 text-slate-500" /> SLA Policy
              </CardTitle>
              <span className="rounded bg-slate-200 px-2 py-1 text-[10px] font-semibold tracking-wider text-slate-600 uppercase">
                Sprint 2.4
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">Service Level Agreement configurations.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
