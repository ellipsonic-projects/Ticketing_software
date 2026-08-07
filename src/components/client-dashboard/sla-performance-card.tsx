'use client';

import { useEffect, useState } from 'react';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';

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
  reduceMotion?: boolean | null;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CircularProgress({
  value,
  size = 118,
  strokeWidth = 8,
  reduceMotion = false,
}: CircularProgressProps) {
  const percentage = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setHasAnimated(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
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
          strokeDashoffset={hasAnimated ? offset : circumference}
          style={{
            transition: reduceMotion
              ? undefined
              : 'stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </svg>
      <div className="absolute text-center">
        <motion.p
          initial={{ opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : 0.35 }}
          className={cn('text-2xl font-semibold', getSlaColor(percentage))}
        >
          {percentage}%
        </motion.p>
        <p className="text-[10px] font-medium text-slate-500">SLA</p>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle }: MetricCardProps) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2.5">
      <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{title}</p>
      <h3 className="mt-1 text-lg font-semibold text-slate-900">{value}</h3>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SlaPerformanceCard({ sla }: SlaPerformanceCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        show: { opacity: 1, scale: 1, transition: { type: 'spring', duration: 0.8 } },
      }}
      initial="hidden"
      animate="show"
      className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">SLA performance</h2>
          <p className="mt-0.5 text-xs text-slate-500">Current service health</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50">
          <ShieldCheck className="h-4 w-4 text-indigo-600" />
        </div>
      </div>

      {/* Circular chart */}
      <div className="mt-5 flex items-center gap-4">
        <CircularProgress value={sla.complianceRate} reduceMotion={reduceMotion} />
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
          <ArrowUpRight className="h-4 w-4" />
          {sla.change}% this month
        </div>
      </div>

      {/* Metric grid */}
      <div className="mt-5 grid grid-cols-2 gap-2">
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

      <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
        Target: {SLA_TARGET}% compliance
      </p>
    </motion.div>
  );
}
