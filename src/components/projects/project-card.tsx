import Link from 'next/link';

import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, MoreVertical, ShieldCheck, Ticket, Users } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/ui/status-badge';
import { ProjectWithClient } from '@/lib/project/project.types';

interface ProjectCardProps {
  project: ProjectWithClient & {
    stats?: {
      totalTickets: number;
      openTickets: number;
      engineersCount: number;
      slaHealthPercent: number;
    };
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const stats = project.stats ?? {
    totalTickets: 0,
    openTickets: 0,
    engineersCount: 0,
    slaHealthPercent: 100,
  };

  const slaColor =
    stats.slaHealthPercent >= 90
      ? 'bg-emerald-50 text-emerald-600'
      : stats.slaHealthPercent >= 75
        ? 'bg-amber-50 text-amber-600'
        : 'bg-red-50 text-red-600';

  return (
    <div className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
      {/* ================= HEADER ================= */}

      <div className="flex items-start justify-between p-6 pb-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h3 className="truncate text-xl font-semibold tracking-tight text-slate-900">
              {project.name}
            </h3>

            <StatusBadge status={project.status} />
          </div>

          <p className="mt-3 line-clamp-2 min-h-[42px] text-sm leading-6 text-slate-500">
            {project.description ?? 'No description has been provided for this project.'}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="ml-3 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
            <MoreVertical className="h-5 w-5" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44 rounded-xl">
            <DropdownMenuItem asChild>
              <Link href={`/projects/${project.id}/edit`}>Edit Project</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ================= METRICS ================= */}

      <div className="grid grid-cols-4 gap-3 px-6">
        {/* Tickets */}

        <div className="rounded-xl bg-blue-50 p-3 text-center">
          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
            <Ticket className="h-4 w-4 text-blue-600" />
          </div>

          <p className="text-lg font-bold text-slate-900">{stats.totalTickets}</p>

          <p className="mt-1 text-[11px] font-medium tracking-wide text-slate-500 uppercase">
            Tickets
          </p>
        </div>

        {/* Open */}

        <div className="rounded-xl bg-red-50 p-3 text-center">
          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-4 w-4 text-red-600" />
          </div>

          <p className="text-lg font-bold text-slate-900">{stats.openTickets}</p>

          <p className="mt-1 text-[11px] font-medium tracking-wide text-slate-500 uppercase">
            Open
          </p>
        </div>

        {/* Engineers */}

        <div className="rounded-xl bg-violet-50 p-3 text-center">
          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-violet-100">
            <Users className="h-4 w-4 text-violet-600" />
          </div>

          <p className="text-lg font-bold text-slate-900">{stats.engineersCount}</p>

          <p className="mt-1 text-[11px] font-medium tracking-wide text-slate-500 uppercase">
            Engineers
          </p>
        </div>

        {/* SLA */}

        <div className="rounded-xl bg-emerald-50 p-3 text-center">
          <div
            className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full ${slaColor}`}
          >
            <ShieldCheck className="h-4 w-4" />
          </div>

          <p className="text-lg font-bold text-slate-900">{stats.slaHealthPercent}%</p>

          <p className="mt-1 text-[11px] font-medium tracking-wide text-slate-500 uppercase">SLA</p>
        </div>
      </div>

      <div className="mx-6 mt-6 border-t border-slate-100" />
      {/* ================= FOOTER ================= */}

      <div className="mt-auto flex items-center justify-between px-6 py-5">
        <div>
          <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">Last Updated</p>

          <p className="mt-1 text-sm text-slate-600">
            {formatDistanceToNow(new Date(project.updatedAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
