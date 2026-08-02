'use client';

import { ArrowUpRight, Clock3, ShieldCheck } from 'lucide-react';

import { SlaPerformance } from '@/lib/client-dashboard/client-dashboard.types';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SLA_EXCELLENT = 95;
const SLA_GOOD = 90;
const SLA_TARGET = 95;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getSlaColor(value: number): string {
  if (value >= SLA_EXCELLENT) return 'text-emerald-600';
  if (value >= SLA_GOOD) return 'text-amber-600';
  return 'text-red-600';
}

function getSlaStrokeColor(value: number): string {
  if (value >= SLA_EXCELLENT) return '#16a34a';
  if (value >= SLA_GOOD) return '#f59e0b';
  return '#ef4444';
}

function getSlaInsight(value: number): string {
  if (value >= SLA_EXCELLENT) {
    return 'Excellent performance. Your team is consistently meeting SLA commitments with minimal breaches.';
  }
  if (value >= SLA_GOOD) {
    return 'Good SLA performance. A small reduction in response and resolution time can push compliance above the target.';
  }
  return 'SLA compliance is below the recommended target. Review ticket assignment, workload distribution, and response processes to reduce future breaches.';
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SlaPerformanceCardProps {
  sla: SlaPerformance;
}

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CircularProgress({ value, size = 150, strokeWidth = 10 }: CircularProgressProps) {
  const percentage = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getSlaStrokeColor(percentage)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset .8s ease' }}
        />
      </svg>
      <div className="absolute text-center">
        <p className={cn('text-4xl font-bold', getSlaColor(percentage))}>{percentage}%</p>
        <p className="mt-1 text-xs font-medium text-slate-500">Compliance</p>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:border-slate-300 hover:bg-white">
      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{title}</p>
      <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SlaPerformanceCard({ sla }: SlaPerformanceCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">SLA Performance</h2>
          <p className="mt-1 text-sm text-slate-500">Current service level compliance</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
          <ShieldCheck className="h-7 w-7 text-indigo-600" />
        </div>
      </div>

      {/* Circular chart */}
      <div className="mt-10 flex flex-col items-center">
        <CircularProgress value={sla.complianceRate} />
        <div className="mt-6 flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600">
          <ArrowUpRight className="h-4 w-4" />
          {sla.change}% this month
        </div>
      </div>

      {/* Metric grid */}
      <div className="mt-10 grid grid-cols-2 gap-4">
        <MetricCard title="Within SLA" value={sla.withinSla} subtitle="Tickets" />
        <MetricCard title="Breached" value={sla.breached} subtitle="Tickets" />
        <MetricCard
          title="Avg Response"
          value={sla.averageResponseTime}
          subtitle="First response"
        />
        <MetricCard
          title="Avg Resolution"
          value={sla.averageResolutionTime}
          subtitle="Resolution time"
        />
      </div>

      {/* Insight block */}
      <div className="mt-8 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100">
            <Clock3 className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">SLA Insights</h3>
            <p className="text-sm text-slate-500">
              Performance summary for the current reporting period
            </p>
          </div>
        </div>

        <p className="mt-5 text-sm leading-7 text-slate-600">{getSlaInsight(sla.complianceRate)}</p>

        <div className="mt-6 grid grid-cols-2 gap-5">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Target SLA
            </p>
            <h4 className="mt-2 text-3xl font-bold text-slate-900">{SLA_TARGET}%</h4>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Current SLA
            </p>
            <h4 className={cn('mt-2 text-3xl font-bold', getSlaColor(sla.complianceRate))}>
              {sla.complianceRate}%
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}
