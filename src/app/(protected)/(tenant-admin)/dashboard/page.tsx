'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { format, formatDistanceToNow } from 'date-fns';
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
  CircleDot,
  CheckCircle2,
  XCircle,
  Clock,
  PlusCircle,
  Pencil
} from 'lucide-react';
import {
  AreaChart,
  Area,
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
    <div className={cn('relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),_0_2px_5px_rgba(0,0,0,0.04)]', bg)}>
      <Icon className={cn('h-[22px] w-[22px]', color)} />
    </div>
  );
}

const CardHover = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    whileHover={{ y: -3, boxShadow: '0 12px 30px -10px rgba(0,0,0,0.08)' }}
    transition={{ duration: 0.25, ease: 'easeOut' }}
    className={cn(
      "flex flex-col justify-between rounded-[20px] bg-white/90 p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_10px_rgba(0,0,0,0.03)] backdrop-blur-xl ring-1 ring-white/60",
      className
    )}
  >
    {children}
  </motion.div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
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
  const formattedTrends = stats.ticketTrends
    .slice(-trendDays)
    .map((t) => ({
      ...t,
      displayDate: format(new Date(t.date), 'MMM d'),
    }));

  return (
    <div className="relative min-h-screen pb-12 pt-8">
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
                  <p className="text-[13px] font-semibold tracking-wide text-slate-500 uppercase">Clients</p>
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
                  <p className="text-[13px] font-semibold tracking-wide text-slate-500 uppercase">Projects</p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                    {stats.summary.projects.total}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> {stats.summary.projects.active} Active
                </span>
                <span className="flex items-center gap-1.5 text-amber-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span> {stats.summary.projects.paused} Paused
                </span>
              </div>
            </CardHover>
          </motion.div>

          <motion.div variants={itemVariants} className="h-full">
            <CardHover className="h-full">
              <div className="flex items-start gap-4">
                <MetricBadge icon={UserCog} color="text-emerald-600" bg="bg-emerald-100/50" />
                <div>
                  <p className="text-[13px] font-semibold tracking-wide text-slate-500 uppercase">Engineers</p>
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
                  <p className="text-[13px] font-semibold tracking-wide text-slate-500 uppercase">Tickets</p>
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
                  <p className="text-[13px] font-semibold tracking-wide text-slate-500 uppercase">Breaches</p>
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
                  <p className="text-[13px] font-semibold tracking-wide text-slate-500 uppercase">Invites</p>
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
            <CardHover className="h-[480px] p-8 flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-slate-900">Ticket Trends</h3>
                  <p className="text-sm font-medium text-slate-500">Ticket volume over the last {trendDays} days</p>
                </div>
                <select 
                  value={trendDays}
                  onChange={(e) => setTrendDays(parseInt(e.target.value, 10))}
                  className="rounded-xl border border-slate-200 bg-white/50 px-4 py-2 text-xs font-bold text-slate-700 shadow-sm outline-none transition-colors hover:bg-slate-50 focus:ring-2 focus:ring-blue-500/20"
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
                  <AreaChart data={formattedTrends} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
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
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid rgba(226, 232, 240, 0.8)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        padding: '12px 16px',
                        fontWeight: 600,
                        color: '#0f172a'
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
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6', style: { filter: 'drop-shadow(0 4px 6px rgba(59, 130, 246, 0.4))' } }}
                    />
                    <Area
                      type="monotone"
                      dataKey="resolved"
                      stroke="#10b981"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorResolved)"
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981', style: { filter: 'drop-shadow(0 4px 6px rgba(16, 185, 129, 0.4))' } }}
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
            <CardHover className="h-[480px] p-8 flex flex-col">
              <div>
                <h3 className="text-lg font-bold tracking-tight text-slate-900">SLA Compliance</h3>
                <p className="text-sm font-medium text-slate-500">60-day rolling performance</p>
              </div>

              <div className="relative mt-8 flex flex-1 items-center justify-center">
                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                  <span className="text-4xl font-black tracking-tighter text-slate-900">{slaPercent}%</span>
                  <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Within SLA</span>
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
                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
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
                    {Math.round((stats.slaCompliance.withinSLA / slaTotal) * 100)}% <span className="font-medium text-slate-400">({stats.slaCompliance.withinSLA})</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span> At Risk
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {Math.round((stats.slaCompliance.atRisk / slaTotal) * 100)}% <span className="font-medium text-slate-400">({stats.slaCompliance.atRisk})</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <span className="h-2 w-2 rounded-full bg-red-500"></span> Breached
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {Math.round((stats.slaCompliance.breached / slaTotal) * 100)}% <span className="font-medium text-slate-400">({stats.slaCompliance.breached})</span>
                  </div>
                </div>
              </div>
            </CardHover>
          </motion.div>
        </div>

        {/* 3. RECENT TICKETS & CLIENTS */}
        <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
          {/* Recent Tickets Table */}
          <motion.div variants={itemVariants}>
            <CardHover className="p-0 h-full overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 p-6">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-slate-900">Recent Tickets</h3>
                  <p className="text-sm font-medium text-slate-500">Latest support requests</p>
                </div>
                <Link
                  href="/tickets"
                  className="rounded-lg bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 ring-1 ring-slate-200/50"
                >
                  View All
                </Link>
              </div>

              <div className="w-full overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Subject</th>
                      <th className="px-6 py-4">Project</th>
                      <th className="px-6 py-4">Priority</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Engineer</th>
                      <th className="px-6 py-4">Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80">
                    {stats.recentTickets.map((ticket) => (
                      <tr key={ticket.id} className="group transition-colors hover:bg-slate-50/80">
                        <td className="cursor-pointer px-6 py-4 font-bold text-blue-600 transition-colors group-hover:text-blue-700">
                          TCK-{ticket.number}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-900">{ticket.title}</td>
                        <td className="px-6 py-4 font-medium text-slate-500">{ticket.projectName}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 font-bold text-[11px]">
                            <span className={cn("h-1.5 w-1.5 rounded-full shadow-sm", 
                              ticket.priority === 'CRITICAL' || ticket.priority === 'URGENT' ? 'bg-red-500 ring-1 ring-red-500/30 shadow-red-500/50' :
                              ticket.priority === 'HIGH' ? 'bg-orange-500 ring-1 ring-orange-500/30 shadow-orange-500/50' :
                              ticket.priority === 'MEDIUM' ? 'bg-amber-500 ring-1 ring-amber-500/30 shadow-amber-500/50' : 'bg-emerald-500 ring-1 ring-emerald-500/30 shadow-emerald-500/50'
                            )}></span>
                            <span className="text-slate-700 uppercase tracking-wide">{ticket.priority}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 font-bold text-[11px]">
                            <span className={cn("h-1.5 w-1.5 rounded-full shadow-sm", 
                              ticket.status === 'IN_PROGRESS' ? 'bg-blue-500 ring-1 ring-blue-500/30 shadow-blue-500/50' :
                              ticket.status === 'OPEN' ? 'bg-emerald-500 ring-1 ring-emerald-500/30 shadow-emerald-500/50' : 'bg-slate-400 ring-1 ring-slate-400/30'
                            )}></span>
                            <span className="text-slate-700 uppercase tracking-wide">{ticket.status.replace('_', ' ')}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            {ticket.assignedToAvatar ? (
                              <div className="relative h-6 w-6 overflow-hidden rounded-full ring-1 ring-slate-200 shadow-sm">
                                <Image
                                  src={ticket.assignedToAvatar}
                                  alt=""
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 ring-1 ring-slate-200 shadow-sm">
                                {ticket.assignedTo !== 'Unassigned'
                                  ? ticket.assignedTo.substring(0, 2).toUpperCase()
                                  : '?'}
                              </div>
                            )}
                            <span className="font-semibold text-slate-700">{ticket.assignedTo}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {formatDistanceToNow(new Date(ticket.updatedAt))} ago
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardHover>
          </motion.div>

          {/* Recent Clients List */}
          <motion.div variants={itemVariants}>
            <CardHover className="p-0 h-full overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 p-6">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-slate-900">Recent Clients</h3>
                  <p className="text-sm font-medium text-slate-500">New organizations</p>
                </div>
                <Link
                  href="/clients"
                  className="rounded-lg bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 ring-1 ring-slate-200/50"
                >
                  View All
                </Link>
              </div>

              <div className="flex flex-col divide-y divide-slate-100/80 px-2 pb-2 pt-2">
                {stats.recentClients.map((client) => {
                  const days = Math.floor(
                    (new Date().getTime() - new Date(client.createdAt).getTime()) / (1000 * 3600 * 24),
                  );
                  const timeDisplay =
                    days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days}d ago`;

                  return (
                    <motion.div 
                      whileHover={{ x: 4, backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
                      key={client.id} 
                      className="flex cursor-pointer items-center gap-4 rounded-xl px-4 py-3.5 transition-colors"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 text-sm font-black text-indigo-700 shadow-sm ring-1 ring-indigo-100/50">
                        {client.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-slate-900">{client.name}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                            {client.projectsCount} Proj
                          </span>
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                            {client.ticketsCount} Tck
                          </span>
                        </div>
                      </div>
                      <p className="shrink-0 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{timeDisplay}</p>
                    </motion.div>
                  );
                })}
              </div>
            </CardHover>
          </motion.div>
        </div>

        {/* 4. RECENT ACTIVITY TIMELINE */}
        <motion.div variants={itemVariants}>
          <CardHover className="p-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <div>
                <h3 className="text-lg font-bold tracking-tight text-slate-900">Activity Timeline</h3>
                <p className="text-sm font-medium text-slate-500">System and user events</p>
              </div>
              <button className="rounded-lg bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 ring-1 ring-slate-200/50">
                View Log
              </button>
            </div>

            <div className="p-6 md:px-10">
              <div className="relative">
                {/* Vertical Line connecting timeline items */}
                <div className="absolute bottom-4 left-[15px] top-4 w-[2px] bg-slate-100" />
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {stats.recentLogs.map((log) => {
                    // Determine icon and color based on action type
                    let IconComponent = Ticket;
                    let iconBg = "bg-blue-50";
                    let iconColor = "text-blue-600";
                    let ringColor = "ring-blue-100";
                    
                    if (log.action.includes('CREATE')) {
                      IconComponent = PlusCircle;
                      iconBg = "bg-emerald-50";
                      iconColor = "text-emerald-600";
                      ringColor = "ring-emerald-100";
                    } else if (log.action.includes('UPDATE')) {
                      IconComponent = Pencil;
                      iconBg = "bg-amber-50";
                      iconColor = "text-amber-600";
                      ringColor = "ring-amber-100";
                    } else if (log.action.includes('DELETE')) {
                      IconComponent = AlertTriangle;
                      iconBg = "bg-red-50";
                      iconColor = "text-red-600";
                      ringColor = "ring-red-100";
                    }

                    return (
                      <motion.div
                        whileHover={{ y: -2 }}
                        key={log.id}
                        className="relative flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200/50 transition-shadow hover:shadow-md md:ml-6"
                      >
                        {/* Connecting node dot for desktop grid layout */}
                        <div className="absolute -left-[45px] top-1/2 hidden h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-slate-300 shadow-sm md:block" />
                        
                        <div className={cn("relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-4 shadow-sm", iconBg, iconColor, ringColor)}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-medium leading-relaxed text-slate-700">
                            <span className="font-bold text-slate-900">{log.changedBy}</span>{' '}
                            {log.action.replace(/_/g, ' ').toLowerCase()}
                            {log.ticketNumber ? (
                              <span className="font-bold text-blue-600"> TCK-{log.ticketNumber}</span>
                            ) : ''}
                          </p>
                          <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                            {log.ticketTitle ?? 'System event'}
                          </p>
                          <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {formatDistanceToNow(new Date(log.createdAt))} ago
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                  {stats.recentLogs.length === 0 && (
                    <p className="py-4 text-sm font-medium text-slate-500">
                      No recent activity found.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardHover>
        </motion.div>
      </motion.div>
    </div>
  );
}
