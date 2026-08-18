'use client';

import { CheckCircle2, Clock, FolderOpen, Loader2, PlayCircle } from 'lucide-react';

import { useTicketStats } from '@/hooks/use-tickets';
import { cn } from '@/lib/utils';

export function EngineerKpiCards() {
  const { data: stats, isLoading, isError } = useTicketStats();

  if (isLoading) {
    return (
      <div className="flex h-32 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="flex h-32 w-full items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-600">
        Failed to load stats
      </div>
    );
  }

  const kpis = [
    {
      title: 'Open',
      value: stats.openCount,
      trend: 'Current assigned tickets',
      icon: FolderOpen,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'In Progress',
      value: stats.inProgressCount,
      trend: 'Current assigned tickets',
      icon: PlayCircle,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
    },
    {
      title: 'Resolved',
      value: stats.resolvedCount,
      trend: 'Current assigned tickets',
      icon: CheckCircle2,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Overdue',
      value: stats.overdueCount,
      trend: 'Past resolution SLA',
      icon: Clock,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Total Assigned',
      value: stats.openCount + stats.inProgressCount + stats.resolvedCount + stats.closedCount,
      trend: 'All assigned tickets',
      icon: FolderOpen,
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
      {kpis.map((kpi, idx) => (
        <div
          key={idx}
          className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{kpi.title}</p>
              <h3 className="mt-2 text-3xl font-bold text-slate-900">{kpi.value}</h3>
            </div>
            <div
              className={cn('flex h-12 w-12 items-center justify-center rounded-xl', kpi.iconBg)}
            >
              <kpi.icon className={cn('h-6 w-6', kpi.iconColor)} />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <span className="font-medium text-slate-500">{kpi.trend}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
