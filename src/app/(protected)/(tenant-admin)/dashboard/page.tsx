'use client';

import { useState } from 'react';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  FolderOpen,
  MailWarning,
  ShieldAlert,
  Ticket,
  UserCog,
  Users,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useTenantDashboard } from '@/hooks/use-tenant-dashboard';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function MetricBadge({
  icon: Icon,
  color,
  bg,
}: {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
}) {
  return (
    <div
      className={cn(
        'relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),_0_2px_5px_rgba(0,0,0,0.04)]',
        bg,
      )}
    >
      <Icon className={cn('h-[22px] w-[22px]', color)} />
    </div>
  );
}

const CardHover = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    whileHover={{ y: -3, boxShadow: '0 12px 30px -10px rgba(0,0,0,0.08)' }}
    transition={{ duration: 0.25, ease: 'easeOut' }}
    className={cn(
      'flex flex-col justify-between rounded-[20px] bg-white/90 p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_10px_rgba(0,0,0,0.03)] ring-1 ring-white/60 backdrop-blur-xl',
      className,
    )}
  >
    {children}
  </motion.div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function TenantDashboardPage() {
  const [trendDays, setTrendDays] = useState(7);
  const { data: stats, isLoading, isError } = useTenantDashboard();

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600">
        <AlertTriangle className="mb-4 h-10 w-10" />
        <p className="font-semibold">Failed to load dashboard statistics.</p>
      </div>
    );
  }

  const slaTotal =
    stats.slaCompliance.withinSLA + stats.slaCompliance.atRisk + stats.slaCompliance.breached || 1;
  const slaPercent = Math.round((stats.slaCompliance.withinSLA / slaTotal) * 100);

  // Prepare Pie Chart Data
  const pieData = [
    { name: 'Within SLA', value: stats.slaCompliance.withinSLA, color: '#10b981' }, // Emerald
    { name: 'At Risk', value: stats.slaCompliance.atRisk, color: '#f59e0b' }, // Amber
    { name: 'Breached', value: stats.slaCompliance.breached, color: '#ef4444' }, // Red
  ];

  // Format Trends Data for Line Chart
  const formattedTrends = stats.ticketTrends.slice(-trendDays).map((t) => ({
    ...t,
    displayDate: format(new Date(t.date), 'MMM d'),
  }));

  return (
    <div className="relative min-h-screen pt-8 pb-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-[1600px] space-y-6 px-6 lg:px-8"
      >
        {/* 1. TOP SUMMARY CARDS */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          <motion.div variants={itemVariants} className="h-full">
            <CardHover className="h-full">
              <div className="flex items-start gap-4">
                <MetricBadge icon={Users} color="text-indigo-600" bg="bg-indigo-100/50" />
                <div>
                  <p className="text-[13px] font-semibold tracking-wide text-slate-500 uppercase">
                    Clients
                  </p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                    {stats.summary.clients.total}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center text-xs font-semibold">
                {stats.summary.clients.percentChange >= 0 ? (
                  <span className="flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700 ring-1 ring-emerald-600/20">
                    <ArrowUp className="mr-1 h-3.5 w-3.5" />
                    {stats.summary.clients.percentChange}%
                  </span>
                ) : (
                  <span className="flex items-center rounded-full bg-red-50 px-2 py-0.5 text-red-700 ring-1 ring-red-600/20">
                    <ArrowDown className="mr-1 h-3.5 w-3.5" />
                    {Math.abs(stats.summary.clients.percentChange)}%
                  </span>
                )}
                <span className="ml-2 text-slate-500">vs last month</span>
              </div>
            </CardHover>
          </motion.div>

          <motion.div variants={itemVariants} className="h-full">
            <CardHover className="h-full">
              <div className="flex items-start gap-4">
                <MetricBadge icon={FolderOpen} color="text-blue-600" bg="bg-blue-100/50" />
                <div>
                  <p className="text-[13px] font-semibold tracking-wide text-slate-500 uppercase">
                    Projects
                  </p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                    {stats.summary.projects.total}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase">
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>{' '}
                  {stats.summary.projects.active} Active
                </span>
                <span className="flex items-center gap-1.5 text-amber-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>{' '}
                  {stats.summary.projects.paused} Paused
                </span>
              </div>
            </CardHover>
          </motion.div>

          <motion.div variants={itemVariants} className="h-full">
            <CardHover className="h-full">
              <div className="flex items-start gap-4">
                <MetricBadge icon={UserCog} color="text-emerald-600" bg="bg-emerald-100/50" />
                <div>
                  <p className="text-[13px] font-semibold tracking-wide text-slate-500 uppercase">
                    Engineers
                  </p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                    {stats.summary.engineers.total}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center">
                <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                  {stats.summary.engineers.onLeave} On Leave
                </span>
              </div>
            </CardHover>
          </motion.div>

          <motion.div variants={itemVariants} className="h-full">
            <CardHover className="h-full">
              <div className="flex items-start gap-4">
                <MetricBadge icon={Ticket} color="text-purple-600" bg="bg-purple-100/50" />
                <div>
                  <p className="text-[13px] font-semibold tracking-wide text-slate-500 uppercase">
                    Tickets
                  </p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                    {stats.summary.tickets.active}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center">
                <span className="flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 ring-1 ring-red-600/20">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                  </span>
                  {stats.summary.tickets.critical} Critical
                </span>
              </div>
            </CardHover>
          </motion.div>

          <motion.div variants={itemVariants} className="h-full">
            <CardHover className="h-full">
              <div className="flex items-start gap-4">
                <MetricBadge icon={ShieldAlert} color="text-rose-600" bg="bg-rose-100/50" />
                <div>
                  <p className="text-[13px] font-semibold tracking-wide text-slate-500 uppercase">
                    Breaches
                  </p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                    {stats.summary.slaBreaches.total}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center text-xs font-semibold text-rose-600">
                <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
                {stats.summary.slaBreaches.requiresAttention} Requires Attention
              </div>
            </CardHover>
          </motion.div>

          <motion.div variants={itemVariants} className="h-full">
            <CardHover className="h-full">
              <div className="flex items-start gap-4">
                <MetricBadge icon={MailWarning} color="text-amber-500" bg="bg-amber-100/50" />
                <div>
                  <p className="text-[13px] font-semibold tracking-wide text-slate-500 uppercase">
                    Invites
                  </p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                    {stats.summary.pendingInvites.total}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center">
                <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-600/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                  Awaiting Acceptance
                </span>
              </div>
            </CardHover>
          </motion.div>
        </div>

        {/* 2. MIDDLE ROW (Trends + SLA) */}
        <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
          {/* Ticket Trends Chart */}
          <motion.div variants={itemVariants}>
            <CardHover className="flex h-[480px] flex-col p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-slate-900">Ticket Trends</h3>
                  <p className="text-sm font-medium text-slate-500">
                    Ticket volume over the last {trendDays} days
                  </p>
                </div>
                <select
                  value={trendDays}
                  onChange={(e) => setTrendDays(parseInt(e.target.value, 10))}
                  className="rounded-xl border border-slate-200 bg-white/50 px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition-colors outline-none hover:bg-slate-50 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value={30}>Last 30 Days</option>
                  <option value={7}>Last 7 Days</option>
                </select>
              </div>

              {/* Legend */}
              <div className="mt-6 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 font-semibold text-slate-600">
                  <div className="h-2 w-2 rounded-full bg-blue-500" /> Opened
                </div>
                <div className="flex items-center gap-2 font-semibold text-slate-600">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" /> Resolved
                </div>
                <div className="flex items-center gap-2 font-semibold text-slate-600">
                  <div className="h-2 w-2 rounded-full bg-slate-400" /> Closed
                </div>
              </div>

              <div className="mt-8 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={formattedTrends}
                    margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="displayDate"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                      dy={10}
                      minTickGap={20}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(8px)',
                        boxShadow:
                          '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        padding: '12px 16px',
                        fontWeight: 600,
                        color: '#0f172a',
                      }}
                      itemStyle={{ fontWeight: 600, fontSize: '13px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="opened"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorOpened)"
                      activeDot={{
                        r: 6,
                        strokeWidth: 0,
                        fill: '#3b82f6',
                        style: { filter: 'drop-shadow(0 4px 6px rgba(59, 130, 246, 0.4))' },
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="resolved"
                      stroke="#10b981"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorResolved)"
                      activeDot={{
                        r: 6,
                        strokeWidth: 0,
                        fill: '#10b981',
                        style: { filter: 'drop-shadow(0 4px 6px rgba(16, 185, 129, 0.4))' },
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="closed"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      fill="none"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardHover>
          </motion.div>

          {/* SLA Compliance */}
          <motion.div variants={itemVariants}>
            <CardHover className="flex h-[480px] flex-col p-8">
              <div>
                <h3 className="text-lg font-bold tracking-tight text-slate-900">SLA Compliance</h3>
                <p className="text-sm font-medium text-slate-500">60-day rolling performance</p>
              </div>

              <div className="relative mt-8 flex flex-1 items-center justify-center">
                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                  <span className="text-4xl font-black tracking-tighter text-slate-900">
                    {slaPercent}%
                  </span>
                  <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    Within SLA
                  </span>
                </div>

                {/* Donut Chart */}
                <div className="relative h-[220px] w-[220px] drop-shadow-md">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={78}
                        outerRadius={95}
                        paddingAngle={4}
                        cornerRadius={10}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: '10px',
                          border: 'none',
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        }}
                        itemStyle={{ fontWeight: 600 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 px-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Within SLA
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {Math.round((stats.slaCompliance.withinSLA / slaTotal) * 100)}%{' '}
                    <span className="font-medium text-slate-400">
                      ({stats.slaCompliance.withinSLA})
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span> At Risk
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {Math.round((stats.slaCompliance.atRisk / slaTotal) * 100)}%{' '}
                    <span className="font-medium text-slate-400">
                      ({stats.slaCompliance.atRisk})
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <span className="h-2 w-2 rounded-full bg-red-500"></span> Breached
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {Math.round((stats.slaCompliance.breached / slaTotal) * 100)}%{' '}
                    <span className="font-medium text-slate-400">
                      ({stats.slaCompliance.breached})
                    </span>
                  </div>
                </div>
              </div>
            </CardHover>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
