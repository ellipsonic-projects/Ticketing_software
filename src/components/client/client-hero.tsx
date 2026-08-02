'use client';

import { Building2, Calendar, FolderKanban, Mail, Phone, ShieldCheck, Ticket } from 'lucide-react';

import { StatCard } from '@/components/ui/stat-card';
import { useClient } from '@/hooks/use-clients';
import { useProjects } from '@/hooks/use-projects';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProjectWithStats {
  id: string;
  stats?: {
    totalTickets?: number;
    slaHealthPercent?: number;
  };
}

interface ClientHeroProps {
  clientId: string;
}

// ---------------------------------------------------------------------------
// Loading Skeleton
// ---------------------------------------------------------------------------

function ClientHeroSkeleton() {
  return (
    <section className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-10 p-8 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 items-start gap-6">
          <div className="h-24 w-24 shrink-0 rounded-3xl bg-slate-200" />
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-64 rounded-lg bg-slate-200" />
              <div className="h-6 w-16 rounded-full bg-slate-200" />
            </div>
            <div className="grid gap-3 pt-2">
              <div className="h-4 w-48 rounded bg-slate-200" />
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="h-4 w-40 rounded bg-slate-200" />
            </div>
          </div>
        </div>
        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 xl:w-[500px] xl:shrink-0">
          <div className="h-24 rounded-2xl bg-slate-200" />
          <div className="h-24 rounded-2xl bg-slate-200" />
          <div className="h-24 rounded-2xl bg-slate-200" />
        </div>
      </div>
      <div className="border-t border-slate-200 bg-slate-50 px-8 py-4">
        <div className="flex gap-8">
          <div className="h-5 w-32 rounded bg-slate-200" />
          <div className="h-5 w-32 rounded bg-slate-200" />
          <div className="h-5 w-32 rounded bg-slate-200" />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ClientHero({ clientId }: ClientHeroProps) {
  const { data: projectsData, isLoading: isProjectsLoading } = useProjects({
    clientId,
    page: 1,
    limit: 100,
    sort: 'createdAt',
    order: 'desc',
    withStats: true,
  });

  const { data: clientResponse, isLoading: isClientLoading } = useClient(clientId);
  const clientInfo = clientResponse?.client;

  const projects = (projectsData?.data ?? []) as ProjectWithStats[];

  const totalProjects = projects.length;

  const totalTickets = projects.reduce(
    (sum, project) => sum + (project.stats?.totalTickets ?? 0),
    0,
  );

  const avgSla =
    projects.length === 0
      ? 100
      : Math.round(
          projects.reduce((sum, project) => sum + (project.stats?.slaHealthPercent ?? 100), 0) /
            projects.length,
        );

  if (isProjectsLoading || isClientLoading) {
    return <ClientHeroSkeleton />;
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm">
      <div className="flex flex-col gap-10 p-8 xl:flex-row xl:items-center xl:justify-between">
        {/* Left — Company info */}
        <div className="flex flex-1 items-start gap-6">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-blue-100">
            <Building2 className="h-11 w-11 text-blue-600" />
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                  {clientInfo?.name ?? 'Client'}
                </h1>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {clientInfo?.status === 'ACTIVE' ? 'Active' : (clientInfo?.status ?? 'Active')}
                </span>
              </div>
            </div>

            <div className="grid gap-3 text-sm text-slate-600">
              {clientInfo?.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>{clientInfo.email}</span>
                </div>
              )}

              {clientInfo?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{clientInfo.phone}</span>
                </div>
              )}

              {clientInfo?.createdAt && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>Client since {new Date(clientInfo.createdAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right — Stat cards */}
        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 xl:w-[500px] xl:shrink-0">
          <StatCard icon={FolderKanban} label="Projects" value={totalProjects} color="blue" />
          <StatCard icon={Ticket} label="Tickets" value={totalTickets} color="indigo" />
          <StatCard icon={ShieldCheck} label="SLA" value={`${avgSla}%`} color="emerald" />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white/60 px-8 py-4">
        <div className="flex flex-wrap items-center gap-8 text-sm">
          <div>
            <span className="text-slate-500">Total Projects</span>
            <span className="ml-2 font-semibold text-slate-900">{totalProjects}</span>
          </div>
          <div>
            <span className="text-slate-500">Total Tickets</span>
            <span className="ml-2 font-semibold text-slate-900">{totalTickets}</span>
          </div>
          <div>
            <span className="text-slate-500">Average SLA</span>
            <span className="ml-2 font-semibold text-emerald-600">{avgSla}%</span>
          </div>
        </div>
      </div>
    </section>
  );
}
