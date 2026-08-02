'use client';

import { AlertTriangle, CheckCircle2, FolderKanban } from 'lucide-react';

import { ProjectHealth } from '@/lib/client-dashboard/client-dashboard.types';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ProjectHealthCardProps {
  projects: ProjectHealth[];
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function HealthBar({ value }: { value: number }) {
  const percentage = Math.max(0, Math.min(100, value));
  const color =
    percentage >= 90 ? 'bg-emerald-500' : percentage >= 70 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className={cn('h-full rounded-full transition-all duration-500', color)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

function HealthBadge({ score }: { score: number }) {
  if (score >= 90) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Healthy
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
      <AlertTriangle className="h-3.5 w-3.5" />
      Attention
    </span>
  );
}

function ProjectRow({ project }: { project: ProjectHealth }) {
  const scoreColor =
    project.healthScore >= 90
      ? 'text-emerald-600'
      : project.healthScore >= 70
        ? 'text-amber-600'
        : 'text-red-600';

  const slaOnTrack = project.slaStatus === 'ON_TRACK';

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all duration-300 hover:border-slate-200 hover:bg-white hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{project.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{project.openTickets} Open Tickets</p>
        </div>
        <HealthBadge score={project.healthScore} />
      </div>

      <HealthBar value={project.healthScore} />

      <div className="mt-5 flex items-center justify-between">
        <div>
          <p className="text-xs tracking-wide text-slate-500 uppercase">Health Score</p>
          <p className={cn('mt-1 text-xl font-bold', scoreColor)}>{project.healthScore}%</p>
        </div>
        <div className="text-right">
          <p className="text-xs tracking-wide text-slate-500 uppercase">SLA</p>
          <p
            className={cn(
              'mt-1 text-lg font-semibold',
              slaOnTrack ? 'text-emerald-600' : 'text-red-600',
            )}
          >
            {slaOnTrack ? 'On Track' : 'At Risk'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProjectHealthCard({ projects }: ProjectHealthCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Project Health</h2>
          <p className="mt-1 text-sm text-slate-500">Current health across active projects</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
          <FolderKanban className="h-7 w-7 text-blue-600" />
        </div>
      </div>

      {/* List */}
      <div className="mt-8 space-y-6">
        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 py-12 text-center">
            <FolderKanban className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-4 font-medium text-slate-500">No active projects</p>
          </div>
        ) : (
          projects.map((project) => <ProjectRow key={project.id} project={project} />)
        )}
      </div>
    </div>
  );
}
