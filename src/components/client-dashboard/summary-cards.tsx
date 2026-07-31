'use client';

import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  Inbox,
  Clock3,
  CheckCircle2,
  Archive,
  ShieldCheck,
} from 'lucide-react';

import { DashboardSummary } from '@/lib/client-dashboard/client-dashboard.types';
import { cn } from '@/lib/utils';

interface SummaryCardsProps {
  summary: DashboardSummary;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBg: string;
  valueColor: string;
  delta?: number;
  suffix?: string;
}

function TrendBadge({
  delta,
}: {
  delta?: number;
}) {
  if (delta === undefined) return null;

  if (delta === 0) {
    return (
      <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
        <Minus className="h-3 w-3" />
        No change
      </div>
    );
  }

  const positive = delta > 0;

  return (
    <div
      className={cn(
        'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold',
        positive
          ? 'bg-emerald-50 text-emerald-600'
          : 'bg-red-50 text-red-600',
      )}
    >
      {positive ? (
        <ArrowUpRight className="h-3 w-3" />
      ) : (
        <ArrowDownRight className="h-3 w-3" />
      )}

      {positive ? '+' : ''}
      {delta}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  iconBg,
  valueColor,
  delta,
  suffix,
}: StatCardProps) {
  return (
    <div
      className="
        group
        rounded-3xl
        border
        border-slate-200
        bg-white
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      <div className="flex items-start justify-between">

        <div
          className={cn(
            'flex h-14 w-14 items-center justify-center rounded-2xl',
            iconBg,
          )}
        >
          {icon}
        </div>

        <TrendBadge delta={delta} />

      </div>

      <div className="mt-8">

        <p
          className={cn(
            'text-4xl font-bold tracking-tight',
            valueColor,
          )}
        >
          {value}
          {suffix}
        </p>

        <p className="mt-2 text-sm font-medium text-slate-500">
          {title}
        </p>

      </div>
    </div>
  );
}

export function SummaryCards({
  summary,
}: SummaryCardsProps) {
  return (
    <section
      className="
        grid
        grid-cols-1
        gap-6
        sm:grid-cols-2
        xl:grid-cols-5
      "
    >
      <StatCard
        title="Open Requests"
        value={summary.openRequests}
        delta={summary.openRequestsDelta}
        valueColor="text-slate-900"
        iconBg="bg-blue-50"
        icon={
          <Inbox className="h-7 w-7 text-blue-600" />
        }
      />

      <StatCard
        title="In Progress"
        value={summary.inProgress}
        delta={summary.inProgressDelta}
        valueColor="text-slate-900"
        iconBg="bg-amber-50"
        icon={
          <Clock3 className="h-7 w-7 text-amber-500" />
        }
      />
            <StatCard
        title="Resolved This Week"
        value={summary.resolvedThisWeek}
        delta={summary.resolvedThisWeekDelta}
        valueColor="text-slate-900"
        iconBg="bg-emerald-50"
        icon={
          <CheckCircle2 className="h-7 w-7 text-emerald-600" />
        }
      />

      <StatCard
        title="Closed This Week"
        value={summary.closedThisWeek}
        delta={summary.closedThisWeekDelta}
        valueColor="text-slate-900"
        iconBg="bg-slate-100"
        icon={
          <Archive className="h-7 w-7 text-slate-600" />
        }
      />

      <StatCard
        title="SLA Compliance"
        value={summary.slaCompliance}
        suffix="%"
        valueColor="text-blue-600"
        iconBg="bg-indigo-50"
        icon={
          <ShieldCheck className="h-7 w-7 text-indigo-600" />
        }
      />

    </section>
  );
}