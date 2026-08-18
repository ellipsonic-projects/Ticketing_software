import { usePathname, useRouter } from 'next/navigation';

import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, ShieldCheck, Ticket, Users } from 'lucide-react';

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
  onOpen?: (project: ProjectCardProps['project']) => void;
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dashboardHref = pathname.startsWith('/client')
    ? `/client/dashboard?ticketProjectId=${encodeURIComponent(project.id)}`
    : `/dashboard?projectId=${encodeURIComponent(project.id)}`;

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
    <div
      className="group flex h-full cursor-pointer flex-col rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
      role="link"
      tabIndex={0}
      onClick={() => {
        if (onOpen) onOpen(project);
        else router.push(dashboardHref);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (onOpen) onOpen(project);
          else router.push(dashboardHref);
        }
      }}
      aria-label={`Open ${project.name} project details`}
    >
      {/* ================= HEADER ================= */}

      <div className="flex items-start justify-between p-4 pb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-semibold tracking-tight text-slate-900">
              {project.name}
            </h3>

            <StatusBadge status={project.status} />
          </div>

          <p className="mt-2 line-clamp-2 min-h-[36px] text-sm leading-5 text-slate-500">
            {project.description ?? 'No description has been provided for this project.'}
          </p>
        </div>
      </div>

      {/* ================= METRICS ================= */}

      <div className="grid grid-cols-4 gap-2 px-4">
        {/* Tickets */}

        <div className="rounded-lg bg-blue-50 p-2 text-center">
          <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
            <Ticket className="h-4 w-4 text-blue-600" />
          </div>

          <p className="text-base font-bold text-slate-900">{stats.totalTickets}</p>

          <p className="text-[10px] font-medium tracking-wide text-slate-500 uppercase">Tickets</p>
        </div>

        {/* Open */}

        <div className="rounded-lg bg-red-50 p-2 text-center">
          <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-4 w-4 text-red-600" />
          </div>

          <p className="text-base font-bold text-slate-900">{stats.openTickets}</p>

          <p className="text-[10px] font-medium tracking-wide text-slate-500 uppercase">Open</p>
        </div>

        {/* Engineers */}

        <div className="rounded-lg bg-violet-50 p-2 text-center">
          <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-violet-100">
            <Users className="h-4 w-4 text-violet-600" />
          </div>

          <p className="text-base font-bold text-slate-900">{stats.engineersCount}</p>

          <p className="text-[10px] font-medium tracking-wide text-slate-500 uppercase">
            Engineers
          </p>
        </div>

        {/* SLA */}

        <div className="rounded-lg bg-emerald-50 p-2 text-center">
          <div
            className={`mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full ${slaColor}`}
          >
            <ShieldCheck className="h-4 w-4" />
          </div>

          <p className="text-base font-bold text-slate-900">{stats.slaHealthPercent}%</p>

          <p className="text-[10px] font-medium tracking-wide text-slate-500 uppercase">SLA</p>
        </div>
      </div>

      <div className="mx-4 mt-4 border-t border-slate-100" />
      {/* ================= FOOTER ================= */}

      <div className="mt-auto flex items-center justify-between px-4 py-3">
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
