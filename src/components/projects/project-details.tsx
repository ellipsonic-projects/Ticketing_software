'use client';

import { ArrowLeft, Building2, Calendar, FileText, Pencil, Settings2, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectSupportConfig } from './project-support-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useProject } from '@/hooks/use-projects';
import { useProjectSLA, useProjectHolidays } from '@/hooks/use-sla';
import { useCan } from '@/hooks/use-can';
import { SLAPolicyCard } from './sla/sla-policy-card';
import { BusinessHoursCard } from './sla/business-hours-card';
import { HolidaysCard } from './sla/holidays-card';
import { ActivityTimeline } from '@/components/shared/activity-timeline';
import { useProjectActivity } from '@/hooks/use-projects';

export function ProjectDetails({ projectId }: { projectId: string }) {
  const router = useRouter();
  const { data: project, isLoading, error } = useProject(projectId);
  const { data: slaData } = useProjectSLA(projectId);
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
          <div className="md:col-span-2 space-y-6">
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
        <p className="mt-2 text-slate-500">The project you are looking for does not exist or you do not have permission to view it.</p>
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
          <Button onClick={() => router.push('/projects')} variant="outline" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {project.name}
              </h1>
              <StatusBadge status={project.status} />
              {project.archivedAt && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  Archived
                </span>
              )}
            </div>
            {project.code && <p className="text-sm text-slate-500 mt-1">Project Code: {project.code}</p>}
          </div>
        </div>

        {canUpdateProject && !project.archivedAt && (
          <Button onClick={() => router.push(`/projects/${project.id}/edit`)} className="bg-indigo-600 hover:bg-indigo-700">
            <Pencil className="mr-2 h-4 w-4" /> Edit Project
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Column */}
        <div className="space-y-6 md:col-span-2">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-6 w-full justify-start border-b border-slate-200 rounded-none bg-transparent h-auto p-0">
              <TabsTrigger 
                value="general"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-4 py-2 text-sm font-medium data-[state=active]:text-indigo-600 data-[state=inactive]:text-slate-500 data-[state=inactive]:hover:text-slate-700 data-[state=active]:shadow-none"
              >
                General
              </TabsTrigger>
              <TabsTrigger 
                value="support"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-4 py-2 text-sm font-medium data-[state=active]:text-indigo-600 data-[state=inactive]:text-slate-500 data-[state=inactive]:hover:text-slate-700 data-[state=active]:shadow-none"
              >
                Support
              </TabsTrigger>
              <TabsTrigger 
                value="sla"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-4 py-2 text-sm font-medium data-[state=active]:text-indigo-600 data-[state=inactive]:text-slate-500 data-[state=inactive]:hover:text-slate-700 data-[state=active]:shadow-none"
              >
                SLA
              </TabsTrigger>
              <TabsTrigger 
                value="activity"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent px-4 py-2 text-sm font-medium data-[state=active]:text-indigo-600 data-[state=inactive]:text-slate-500 data-[state=inactive]:hover:text-slate-700 data-[state=active]:shadow-none"
              >
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6 mt-0">
              {/* General Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-500" /> General Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-500">Description</h4>
                      <p className="mt-1 text-sm text-slate-900 whitespace-pre-wrap">
                        {project.description || 'No description provided.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tickets Placeholder */}
              <Card className="opacity-50 grayscale select-none border-dashed">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-slate-500" /> Tickets
                  </CardTitle>
                  <span className="text-xs font-semibold bg-slate-200 text-slate-600 px-2 py-1 rounded">Coming Soon (Phase 3)</span>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-slate-100 rounded-lg flex items-center justify-center text-sm font-medium text-slate-400">
                    Ticket management will be available here.
                  </div>
                </CardContent>
              </Card>
              
              <Card className="opacity-50 grayscale select-none border-dashed">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-slate-500" /> Tickets
                  </CardTitle>
                  <span className="text-xs font-semibold bg-slate-200 text-slate-600 px-2 py-1 rounded">Coming Soon (Phase 3)</span>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-slate-100 rounded-lg flex items-center justify-center text-sm font-medium text-slate-400">
                    Ticket management will be available here.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="support" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
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
              <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-4 rounded-lg border">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">SLA:</span>
                  {slaData?.policy ? (
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Enabled</span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">Unconfigured</span>
                  )}
                </div>
                
                {slaData?.policy && (
                  <>
                    <div className="w-px h-4 bg-slate-300" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">Business Hours:</span>
                      {slaData.policy.businessHoursEnabled ? (
                        <span className="text-sm font-medium text-slate-900">Enabled</span>
                      ) : (
                        <span className="text-sm font-medium text-slate-500">Disabled</span>
                      )}
                    </div>
                    <div className="w-px h-4 bg-slate-300" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">Holidays:</span>
                      <span className="text-sm font-medium text-slate-900">{holidaysData?.holidays?.length || 0}</span>
                    </div>
                    <div className="w-px h-4 bg-slate-300" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">Response:</span>
                      <span className="text-sm font-medium text-slate-900">{slaData.policy.responseTimeMinutes} min</span>
                    </div>
                    <div className="w-px h-4 bg-slate-300" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">Resolution:</span>
                      <span className="text-sm font-medium text-slate-900">{slaData.policy.resolutionTimeMinutes >= 60 ? `${Math.round(slaData.policy.resolutionTimeMinutes / 60)} hrs` : `${slaData.policy.resolutionTimeMinutes} min`}</span>
                    </div>
                  </>
                )}
              </div>

              <SLAPolicyCard projectId={project.id} isArchived={!!project.archivedAt} />
              <BusinessHoursCard projectId={project.id} isArchived={!!project.archivedAt} />
              <HolidaysCard projectId={project.id} isArchived={!!project.archivedAt} />
            </TabsContent>

            <TabsContent value="activity" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-500" /> Activity History
                  </CardTitle>
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
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
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
              <div className="mt-4 pt-4 border-t border-slate-100">
                <Button onClick={() => router.push(`/clients/${project.clientId}`)} variant="link" className="px-0 h-auto text-indigo-600">
                  View Client Details &rarr;
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Support Summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-indigo-500" /> Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Status</span>
                  {project.supportStatus === 'ENABLED' ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Enabled
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
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
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-sm text-slate-500">Email</span>
                    <span className="text-sm text-slate-900 truncate max-w-[150px]" title={project.supportEmail}>
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
                <Button variant="outline" className="w-full text-xs mt-2" onClick={() => {
                  const supportTab = document.querySelector('[value="support"]') as HTMLElement;
                  if (supportTab) supportTab.click();
                }}>
                  View Configuration
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* SLA Placeholder */}
          <Card className="opacity-50 grayscale select-none border-dashed">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-slate-500" /> SLA Policy
              </CardTitle>
              <span className="text-[10px] font-semibold bg-slate-200 text-slate-600 px-2 py-1 rounded uppercase tracking-wider">Sprint 2.4</span>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">
                Service Level Agreement configurations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
