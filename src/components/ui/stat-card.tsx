'use client';

import { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: 'blue' | 'indigo' | 'emerald' | 'violet' | 'amber' | 'red';
}

const COLORS = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
  },
  indigo: {
    bg: 'bg-indigo-50',
    icon: 'text-indigo-600',
  },
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
  },
  violet: {
    bg: 'bg-violet-50',
    icon: 'text-violet-600',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'text-amber-600',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
  },
};

export function StatCard({ icon: Icon, label, value, color = 'blue' }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div
        className={cn(
          'mb-4 flex h-12 w-12 items-center justify-center rounded-xl',
          COLORS[color].bg,
        )}
      >
        <Icon className={cn('h-6 w-6', COLORS[color].icon)} />
      </div>

      <h3 className="text-3xl font-bold tracking-tight text-slate-900">{value}</h3>

      <p className="mt-2 text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}
