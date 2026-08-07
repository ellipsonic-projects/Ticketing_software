'use client';

import {
  Archive,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Inbox,
  Minus,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';

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

function TrendBadge({ delta }: { delta?: number }) {
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
        positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600',
      )}
    >
      {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}

      {positive ? '+' : ''}
      {delta}
    </div>
  );
}

function StatCard({ title, value, icon, iconBg, valueColor, delta, suffix }: StatCardProps) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
      className="group rounded-2xl border border-slate-200/70 bg-white px-4 py-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-3">
        <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', iconBg)}>
          {icon}
        </div>

        <TrendBadge delta={delta} />
      </div>

      <div className="mt-3">
        <p className={cn('text-2xl font-semibold tracking-tight', valueColor)}>
          {value}
          {suffix}
        </p>

        <p className="mt-0.5 text-xs font-medium text-slate-500">{title}</p>
      </div>
    </motion.div>
  );
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <motion.section 
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-3 lg:grid-cols-5"
    >
      <StatCard
        title="Open Requests"
        value={summary.openRequests}
        delta={summary.openRequestsDelta}
        valueColor="text-slate-900"
        iconBg="bg-blue-50"
        icon={<Inbox className="h-4 w-4 text-blue-600" />}
      />

      <StatCard
        title="In Progress"
        value={summary.inProgress}
        delta={summary.inProgressDelta}
        valueColor="text-slate-900"
        iconBg="bg-amber-50"
        icon={<Clock3 className="h-4 w-4 text-amber-500" />}
      />
      <StatCard
        title="Resolved This Week"
        value={summary.resolvedThisWeek}
        delta={summary.resolvedThisWeekDelta}
        valueColor="text-slate-900"
        iconBg="bg-emerald-50"
        icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
      />

      <StatCard
        title="Closed This Week"
        value={summary.closedThisWeek}
        delta={summary.closedThisWeekDelta}
        valueColor="text-slate-900"
        iconBg="bg-slate-100"
        icon={<Archive className="h-4 w-4 text-slate-600" />}
      />

      <StatCard
        title="SLA Compliance"
        value={summary.slaCompliance}
        suffix="%"
        valueColor="text-blue-600"
        iconBg="bg-indigo-50"
        icon={<ShieldCheck className="h-4 w-4 text-indigo-600" />}
      />
    </motion.section>
  );
}
