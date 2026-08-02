'use client';

import Image from 'next/image';
import Link from 'next/link';

import { format, formatDistanceToNow } from 'date-fns';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FolderOpen,
  MailWarning,
  MoreHorizontal,
  ShieldAlert,
  Ticket,
  UserCog,
  Users,
} from 'lucide-react';
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
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
    <div className={cn('flex h-12 w-12 items-center justify-center rounded-full', bg)}>
      <Icon className={cn('h-6 w-6', color)} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function TenantDashboardPage() {
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
  const formattedTrends = stats.ticketTrends.map((t) => ({
    ...t,
    displayDate: format(new Date(t.date), 'MMM d'),
  }));

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 pb-10">
      {/* 1. TOP SUMMARY CARDS */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {/* Clients Card */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <MetricBadge icon={Users} color="text-indigo-600" bg="bg-indigo-50" />
            <div>
              <p className="text-sm font-medium text-slate-500">Clients</p>
              <p className="mt-0.5 text-2xl font-bold text-slate-900">
                {stats.summary.clients.total}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-medium">
            {stats.summary.clients.percentChange >= 0 ? (
              <span className="flex items-center text-emerald-600">
                <ArrowUp className="mr-1 h-3.5 w-3.5" />
                {stats.summary.clients.percentChange}%
              </span>
            ) : (
              <span className="flex items-center text-red-600">
                <ArrowDown className="mr-1 h-3.5 w-3.5" />
                {Math.abs(stats.summary.clients.percentChange)}%
              </span>
            )}
            <span className="ml-1 text-slate-500">vs last month</span>
          </div>
        </div>

        {/* Projects Card */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <MetricBadge icon={FolderOpen} color="text-blue-600" bg="bg-blue-50" />
            <div>
              <p className="text-sm font-medium text-slate-500">Projects</p>
              <p className="mt-0.5 text-2xl font-bold text-slate-900">
                {stats.summary.projects.total}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-medium">
            <span className="text-emerald-600">{stats.summary.projects.active} Active</span>
            <span className="text-slate-300">•</span>
            <span className="text-amber-500">{stats.summary.projects.paused} Paused</span>
          </div>
        </div>

        {/* Engineers Card */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <MetricBadge icon={UserCog} color="text-emerald-600" bg="bg-emerald-50" />
            <div>
              <p className="text-sm font-medium text-slate-500">Engineers</p>
              <p className="mt-0.5 text-2xl font-bold text-slate-900">
                {stats.summary.engineers.total}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-medium text-amber-500">
            {stats.summary.engineers.onLeave} On Leave
          </div>
        </div>

        {/* Active Tickets Card */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <MetricBadge icon={Ticket} color="text-purple-600" bg="bg-purple-50" />
            <div>
              <p className="text-sm font-medium text-slate-500">Active Tickets</p>
              <p className="mt-0.5 text-2xl font-bold text-slate-900">
                {stats.summary.tickets.active}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-medium text-red-500">
            {stats.summary.tickets.critical} Critical
          </div>
        </div>

        {/* SLA Breaches Card */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <MetricBadge icon={ShieldAlert} color="text-red-600" bg="bg-red-50" />
            <div>
              <p className="text-sm font-medium text-slate-500">SLA Breaches</p>
              <p className="mt-0.5 text-2xl font-bold text-slate-900">
                {stats.summary.slaBreaches.total}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-medium text-red-500">
            Requires Attention
          </div>
        </div>

        {/* Pending Invites Card */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <MetricBadge icon={MailWarning} color="text-orange-500" bg="bg-orange-50" />
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Invites</p>
              <p className="mt-0.5 text-2xl font-bold text-slate-900">
                {stats.summary.pendingInvites.total}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-medium text-amber-500">
            Awaiting Acceptance
          </div>
        </div>
      </div>

      {/* 2. MIDDLE ROW (Trends + SLA) */}
      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        {/* Ticket Trends Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-semibold text-slate-900">
              Ticket Trends <span className="font-normal text-slate-500">(Last 30 Days)</span>
            </h3>
            <select className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 outline-none hover:bg-slate-50">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
            </select>
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center gap-5 text-sm">
            <div className="flex items-center gap-2 font-medium text-slate-500">
              <div className="h-0.5 w-4 bg-blue-500" /> Opened
            </div>
            <div className="flex items-center gap-2 font-medium text-slate-500">
              <div className="h-0.5 w-4 bg-emerald-500" /> Resolved
            </div>
            <div className="flex items-center gap-2 font-medium text-slate-500">
              <div className="h-0.5 w-4 bg-slate-400" /> Closed
            </div>
          </div>

          <div className="mt-8 h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedTrends} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="displayDate"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                  minTickGap={30}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}
                />
                <Line
                  type="monotone"
                  dataKey="opened"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#3b82f6' }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#10b981' }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="closed"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#94a3b8' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SLA Compliance */}
        <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-[15px] font-semibold text-slate-900">SLA Compliance</h3>

          <div className="mt-8 flex flex-1 items-center justify-between">
            {/* Donut Chart */}
            <div className="relative h-[180px] w-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900">{slaPercent}%</span>
                <span className="text-xs font-semibold text-slate-500">Within SLA</span>
              </div>
            </div>

            {/* Legend List */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <div className="w-[80px] text-sm font-medium text-slate-700">Within SLA</div>
                <div className="text-sm text-slate-500">
                  {slaPercent}% ({stats.slaCompliance.withinSLA})
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <div className="w-[80px] text-sm font-medium text-slate-700">At Risk</div>
                <div className="text-sm text-slate-500">
                  {Math.round((stats.slaCompliance.atRisk / slaTotal) * 100)}% (
                  {stats.slaCompliance.atRisk})
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <div className="w-[80px] text-sm font-medium text-slate-700">Breached</div>
                <div className="text-sm text-slate-500">
                  {Math.round((stats.slaCompliance.breached / slaTotal) * 100)}% (
                  {stats.slaCompliance.breached})
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <ArrowUp className="h-3 w-3" />
              3% improvement vs last month
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ROW (Recent Tickets + Clients) */}
      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        {/* Recent Tickets Table */}
        <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <h3 className="text-[15px] font-semibold text-slate-900">Recent Tickets</h3>
            <Link
              href="/tickets"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View All
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-medium tracking-wider text-slate-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-4 text-xs font-medium tracking-wider text-slate-500 uppercase">
                    Subject
                  </th>
                  <th className="px-6 py-4 text-xs font-medium tracking-wider text-slate-500 uppercase">
                    Project
                  </th>
                  <th className="px-6 py-4 text-xs font-medium tracking-wider text-slate-500 uppercase">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-xs font-medium tracking-wider text-slate-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-medium tracking-wider text-slate-500 uppercase">
                    Engineer
                  </th>
                  <th className="px-6 py-4 text-xs font-medium tracking-wider text-slate-500 uppercase">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentTickets.map((ticket) => (
                  <tr key={ticket.id} className="transition hover:bg-slate-50">
                    <td className="cursor-pointer px-6 py-4 font-semibold text-blue-600 hover:underline">
                      TCK-{ticket.number}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{ticket.title}</td>
                    <td className="px-6 py-4 font-medium text-slate-700">{ticket.projectName}</td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold tracking-wider uppercase',
                          ticket.priority === 'CRITICAL' || ticket.priority === 'URGENT'
                            ? 'bg-red-50 text-red-600'
                            : ticket.priority === 'HIGH'
                              ? 'bg-orange-50 text-orange-600'
                              : ticket.priority === 'MEDIUM'
                                ? 'bg-amber-50 text-amber-600'
                                : 'bg-emerald-50 text-emerald-600',
                        )}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold tracking-wider uppercase',
                          ticket.status === 'IN_PROGRESS'
                            ? 'bg-blue-50 text-blue-600'
                            : ticket.status === 'OPEN'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-purple-50 text-purple-600',
                        )}
                      >
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {ticket.assignedToAvatar ? (
                          <div className="relative h-6 w-6 overflow-hidden rounded-full">
                            <Image
                              src={ticket.assignedToAvatar}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600">
                            {ticket.assignedTo !== 'Unassigned'
                              ? ticket.assignedTo.substring(0, 2).toUpperCase()
                              : '?'}
                          </div>
                        )}
                        <span className="font-medium text-slate-700">{ticket.assignedTo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium whitespace-nowrap text-slate-500">
                      {formatDistanceToNow(new Date(ticket.updatedAt))} ago
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-sm text-slate-500">
            <p>
              Showing 1 to {stats.recentTickets.length} of {stats.summary.tickets.total} tickets
            </p>
          </div>
        </div>

        {/* Recent Clients List */}
        <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <h3 className="text-[15px] font-semibold text-slate-900">Recent Clients</h3>
            <Link
              href="/clients"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View All
            </Link>
          </div>

          <div className="flex flex-col divide-y divide-slate-100 px-6">
            {stats.recentClients.map((client) => {
              const days = Math.floor(
                (new Date().getTime() - new Date(client.createdAt).getTime()) / (1000 * 3600 * 24),
              );
              const timeDisplay =
                days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`;

              return (
                <div key={client.id} className="flex items-center gap-4 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600">
                    {client.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">{client.name}</p>
                    <p className="mt-0.5 truncate text-xs font-medium text-slate-500">
                      {client.projectsCount} projects • {client.ticketsCount} tickets
                    </p>
                  </div>
                  <p className="shrink-0 text-xs font-medium text-slate-500">{timeDisplay}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. RECENT ACTIVITY WIDE BAR */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between pb-6">
          <h3 className="text-[15px] font-semibold text-slate-900">Recent Activity</h3>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.recentLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-blue-500 shadow-sm">
                <Ticket className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-slate-900">
                  <span className="font-semibold text-slate-700">{log.changedBy}</span>{' '}
                  {log.action.replace(/_/g, ' ').toLowerCase()}
                  {log.ticketNumber ? ` TCK-${log.ticketNumber}` : ''}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-500">
                  {log.ticketTitle ?? 'No subject'}
                </p>
                <p className="mt-0.5 text-xs font-medium text-slate-400">
                  {formatDistanceToNow(new Date(log.createdAt))} ago
                </p>
              </div>
            </div>
          ))}
          {stats.recentLogs.length === 0 && (
            <p className="col-span-full py-4 text-center text-sm text-slate-500">
              No recent activity found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
