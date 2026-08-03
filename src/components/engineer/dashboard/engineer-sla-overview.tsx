'use client';

import Link from 'next/link';

import { AlertCircle, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

import { cn } from '@/lib/utils';

export function EngineerSlaOverview() {
  // Mock data for SLA overview until stats endpoint provides this granular breakdown.
  // In a full implementation, this would be computed from backend stats.
  const slaStats = [
    {
      label: 'On Track',
      count: 24,
      percentage: 75,
      icon: CheckCircle2,
      color: 'text-green-500',
      bg: 'bg-green-100',
      barColor: 'bg-green-500',
    },
    {
      label: 'At Risk',
      count: 6,
      percentage: 18.8,
      icon: AlertTriangle,
      color: 'text-amber-500',
      bg: 'bg-amber-100',
      barColor: 'bg-amber-500',
    },
    {
      label: 'Breached',
      count: 2,
      percentage: 6.2,
      icon: AlertCircle,
      color: 'text-red-500',
      bg: 'bg-red-100',
      barColor: 'bg-red-500',
    },
  ];

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">SLA Overview</h3>
        <Link
          href="/engineer/tickets?sort=resolutionBreachAt"
          className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View all SLAs
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="flex flex-1 flex-col justify-center space-y-5">
        {slaStats.map((stat) => (
          <div key={stat.label}>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn('flex h-8 w-8 items-center justify-center rounded-full', stat.bg)}
                >
                  <stat.icon className={cn('h-4 w-4', stat.color)} />
                </div>
                <span className="font-semibold text-slate-900">{stat.label}</span>
              </div>
              <div className="flex items-baseline gap-4">
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
