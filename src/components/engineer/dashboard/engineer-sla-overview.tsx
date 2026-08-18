'use client';

import Link from 'next/link';

import { AlertCircle, AlertTriangle, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

import { useTicketStats } from '@/hooks/use-tickets';
import { cn } from '@/lib/utils';

export function EngineerSlaOverview() {
  const { data: stats, isLoading, isError } = useTicketStats();

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-600">
        Failed to load SLA data
      </div>
    );
  }

  const slaStats = [
    {
      label: 'On Track',
      count: stats.sla.withinSLACount,
      percentage: stats.sla.withinSLAPercent,
      icon: CheckCircle2,
      color: 'text-green-500',
      bg: 'bg-green-100',
      barColor: 'bg-green-500',
    },
    {
      label: 'At Risk',
      count: stats.sla.atRiskCount,
      percentage: stats.sla.atRiskPercent,
      icon: AlertTriangle,
      color: 'text-amber-500',
      bg: 'bg-amber-100',
      barColor: 'bg-amber-500',
    },
    {
      label: 'Breached',
      count: stats.sla.breachedCount,
      percentage: stats.sla.breachedPercent,
      icon: AlertCircle,
      color: 'text-red-500',
      bg: 'bg-red-100',
      barColor: 'bg-red-500',
    },
  ];

  return (
    <div className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:h-[390px]">
      <div className="mb-4 flex flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
        <h3 className="font-semibold text-slate-900">SLA Overview</h3>
        <Link
          href="/engineer/tickets?sort=resolutionBreachAt"
          className="inline-flex w-fit items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View all SLAs
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="flex flex-1 flex-col justify-center space-y-4">
        {slaStats.map((stat) => (
          <div key={stat.label}>
            <div className="mb-2 flex min-w-0 items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={cn('flex h-8 w-8 items-center justify-center rounded-full', stat.bg)}
                >
                  <stat.icon className={cn('h-4 w-4', stat.color)} />
                </div>
                <span className="truncate font-semibold text-slate-900">{stat.label}</span>
              </div>
              <div className="flex shrink-0 items-baseline gap-4">
                <span className="text-xl font-bold text-slate-900">{stat.count}</span>
                <span className="w-12 text-right text-sm font-medium text-slate-500">
                  {stat.percentage}%
                </span>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn('h-full rounded-full', stat.barColor)}
                style={{ width: `${stat.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
