'use client';

import { AlertCircle, Archive, CheckCircle2, Clock, LucideIcon, Ticket } from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';
import { useTicketStats } from '@/hooks/use-tickets';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StatPillConfig {
  label: string;
  sublabel: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  cardBg: string;
  sublabelColor: string;
  value: number;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatPill({
  label,
  sublabel,
  icon: Icon,
  iconBg,
  iconColor,
  cardBg,
  sublabelColor,
  value,
}: StatPillConfig) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl ${cardBg} p-4 text-center shadow-sm`}
    >
      <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full ${iconBg}`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <span className="text-2xl font-bold text-slate-900">{value}</span>
      <span className="mt-1 text-sm font-semibold text-slate-800">{label}</span>
      <span className={`mt-1 text-xs font-semibold ${sublabelColor}`}>{sublabel}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TicketsHero() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useTicketStats(user?.clientId);

  if (isLoading) {
    return (
      <section className="animate-pulse space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-slate-200" />
          <div className="space-y-2">
            <div className="h-6 w-48 rounded-lg bg-slate-200" />
            <div className="h-4 w-72 rounded-md bg-slate-200" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[100px] rounded-2xl bg-slate-200" />
          ))}
        </div>
      </section>
    );
  }

  const statPills: StatPillConfig[] = [
    {
      label: 'Open',
      sublabel: 'Needs attention',
      icon: AlertCircle,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      cardBg: 'bg-[#FFF5F5]',
      sublabelColor: 'text-red-500',
      value: stats?.openCount ?? 0,
    },
    {
      label: 'In Progress',
      sublabel: 'Being worked on',
      icon: Clock,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      cardBg: 'bg-[#F0F5FF]',
      sublabelColor: 'text-blue-600',
      value: stats?.inProgressCount ?? 0,
    },
    {
      label: 'Resolved',
      sublabel: 'Completed',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      cardBg: 'bg-[#F0FDF4]',
      sublabelColor: 'text-emerald-600',
      value: stats?.resolvedCount ?? 0,
    },
    {
      label: 'Closed',
      sublabel: 'Closed tickets',
      icon: Archive,
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
      cardBg: 'border border-slate-100 bg-white',
      sublabelColor: 'text-slate-500',
      value: stats?.closedCount ?? 0,
    },
  ];

  return (
    <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
          <Ticket className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Tickets</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Track and collaborate on your support requests.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statPills.map((pill) => (
          <StatPill key={pill.label} {...pill} />
        ))}
      </div>
    </section>
  );
}
