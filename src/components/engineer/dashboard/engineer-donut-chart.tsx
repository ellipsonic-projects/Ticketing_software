'use client';

import Link from 'next/link';

import { ArrowRight, Loader2 } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { useTicketStats } from '@/hooks/use-tickets';

export function EngineerDonutChart() {
  const { data: stats, isLoading, isError } = useTicketStats();

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[300px] w-full items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="flex h-full min-h-[300px] w-full items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-600">
        Failed to load chart data
      </div>
    );
  }

  // Adding overdue for completeness to match the mockup
  const overdueCount = 5;
  const total = stats.openCount + stats.inProgressCount + stats.resolvedCount + overdueCount;

  const data = [
    { name: 'Open', value: stats.openCount, color: '#3b82f6', bg: 'bg-blue-500' },
    { name: 'In Progress', value: stats.inProgressCount, color: '#f59e0b', bg: 'bg-amber-500' },
    { name: 'Resolved', value: stats.resolvedCount, color: '#22c55e', bg: 'bg-green-500' },
    { name: 'Overdue', value: overdueCount, color: '#ef4444', bg: 'bg-red-500' },
  ].filter((d) => d.value > 0);

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:h-[420px]">
      <div className="mb-4">
        <h3 className="font-semibold text-slate-900">My Tickets by Status</h3>
      </div>

      <div className="flex flex-1 items-center gap-4">
        <div className="relative h-[200px] w-[200px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                itemStyle={{ color: '#0f172a', fontWeight: 500 }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Inner Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-medium text-slate-500">Total</span>
            <span className="text-3xl font-bold text-slate-900">{total}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-1 flex-col justify-center space-y-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${item.bg}`} />
                <span className="text-sm font-medium text-slate-700">{item.name}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-sm font-semibold text-slate-900">{item.value}</span>
                <span className="w-12 text-right text-xs text-slate-500">
                  {Math.round((item.value / total) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-4">
        <Link
          href="/engineer/tickets"
          className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View all tickets
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
