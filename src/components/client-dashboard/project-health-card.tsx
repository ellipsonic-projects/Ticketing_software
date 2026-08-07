'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, FolderKanban } from 'lucide-react';

import { ProjectHealth } from '@/lib/client-dashboard/client-dashboard.types';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ProjectHealthCardProps {
  projects: ProjectHealth[];
  page: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function HealthBar({ value }: { value: number }) {
  const percentage = Math.max(0, Math.min(100, value));
  const color =
    percentage >= 90 ? 'bg-emerald-500' : percentage >= 70 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/50"
      role="progressbar"
      aria-label={`Project health score: ${percentage}%`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percentage}
    >
      <div
        className={cn('h-full rounded-full transition-all duration-1000 ease-out', color)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

function ProjectBar({ project, index }: { project: ProjectHealth; index: number }) {
  const scoreColor =
    project.healthScore >= 90
      ? 'text-emerald-600'
      : project.healthScore >= 70
        ? 'text-amber-600'
        : 'text-red-600';

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="flex items-center gap-3 rounded-lg py-1.5 transition-colors hover:bg-slate-50/70"
    >
      <div className="w-24 shrink-0 overflow-hidden">
        <h3 className="truncate text-xs font-semibold text-slate-900">{project.name}</h3>
        <p className="mt-px text-[10px] text-slate-500">{project.openTickets} open</p>
      </div>
      <div className="min-w-0 flex-1">
        <HealthBar value={project.healthScore} />
      </div>
      <div className="w-16 shrink-0 text-right">
        <p className={cn('text-sm font-bold tabular-nums', scoreColor)}>{project.healthScore}%</p>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProjectHealthCard({
  projects,
  page,
  total,
  totalPages,
  onPageChange,
  isLoading = false,
}: ProjectHealthCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Project health</h2>
          <p className="mt-px text-xs text-slate-500">Active projects at a glance</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
          <FolderKanban className="h-4 w-4 text-blue-600" />
        </div>
      </div>

      {/* List */}
      <div className={cn('mt-3 divide-y divide-slate-100', isLoading && 'opacity-60')}>
        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 py-12 text-center">
            <FolderKanban className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-4 font-medium text-slate-500">No active projects</p>
          </div>
        ) : (
          projects.map((project, idx) => (
            <ProjectBar key={project.id} project={project} index={idx} />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700">{projects.length}</span> of{' '}
            <span className="font-semibold text-slate-700">{total}</span> projects
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous project health page"
              disabled={page <= 1 || isLoading}
              onClick={() => onPageChange(page - 1)}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-lg border transition',
                page <= 1 || isLoading
                  ? 'cursor-not-allowed border-slate-200 text-slate-300'
                  : 'border-slate-300 hover:bg-slate-100',
              )}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="px-1 text-xs font-semibold text-slate-700">
              Page {page} / {totalPages}
            </span>
            <button
              type="button"
              aria-label="Next project health page"
              disabled={page >= totalPages || isLoading}
              onClick={() => onPageChange(page + 1)}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-lg border transition',
                page >= totalPages || isLoading
                  ? 'cursor-not-allowed border-slate-200 text-slate-300'
                  : 'border-slate-300 hover:bg-slate-100',
              )}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
