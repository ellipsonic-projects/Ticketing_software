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
      trend: '2 more than yesterday',
      trendUp: true,
      icon: FolderOpen,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'In Progress',
      value: stats.inProgressCount,
      trend: '1 more than yesterday',
      trendUp: true,
      icon: PlayCircle,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
    },
    {
      title: 'Resolved',
      value: stats.resolvedCount,
      trend: '1 more than yesterday',
      trendUp: true,
      icon: CheckCircle2,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      title: 'Overdue',
      value: 5, // Mock data for now since we don't have overdue count in standard stats
      trend: '2 more than yesterday',
      trendUp: false,
      icon: Clock,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Total Assigned',
      value: stats.openCount + stats.inProgressCount + stats.resolvedCount + stats.closedCount,
      trend: 'Updated just now',
      trendUp: true,
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
          <div className="mt-4 flex items-center text-sm">
            <svg
              className={cn('mr-1.5 h-4 w-4', kpi.trendUp ? 'text-green-500' : 'text-red-500')}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {kpi.trendUp ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              )}
            </svg>
            <span className={cn('font-medium', kpi.trendUp ? 'text-green-600' : 'text-red-600')}>
              {kpi.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
