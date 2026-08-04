'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn, getStringColorGradient, getStringColorHover } from '@/lib/utils';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

import { TicketPriority, TicketStatus } from '@prisma/client';
import { format } from 'date-fns';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  MoreHorizontal,
  RefreshCcw,
  Search,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/hooks/use-auth';
import { useTickets } from '@/hooks/use-tickets';
import { AssignEngineerSidebar } from './assign-engineer-sidebar';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const getStatusColor = (status: string) => {
  switch (status) {
    case 'OPEN':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'WAITING_ON_CLIENT':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'RESOLVED':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'CLOSED':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

const getStatusLabel = (status: string) => {
  if (status === 'WAITING_ON_CLIENT') return 'WAITING FOR CLIENT';
  return status.replace(/_/g, ' ');
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'URGENT':
      return 'bg-red-100 text-red-600 border-red-200';
    case 'HIGH':
      return 'bg-orange-100 text-orange-600 border-orange-200';
    case 'MEDIUM':
      return 'bg-amber-100 text-amber-600 border-amber-200';
    case 'LOW':
      return 'bg-green-100 text-green-600 border-green-200';
    default:
      return 'bg-slate-100 text-slate-600 border-slate-200';
  }
};

const getSlaStatus = (ticket: any) => {
  if (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') {
    return { label: 'On Track', color: 'text-emerald-500', icon: CheckCircle2 };
  }

  const now = new Date();
  if (ticket.sla?.resolutionBreachAt) {
    const breachAt = new Date(ticket.sla.resolutionBreachAt);
    if (now > breachAt) {
      return { label: 'Breached', color: 'text-red-500', icon: AlertTriangle };
    }
    const hoursLeft = (breachAt.getTime() - now.getTime()) / 3_600_000;
    if (hoursLeft < 4) {
      return { label: 'At Risk', color: 'text-amber-500', icon: Clock };
    }
  }
  return { label: 'On Track', color: 'text-emerald-500', icon: CheckCircle2 };
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export function TicketList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [selectedTicketToAssign, setSelectedTicketToAssign] = useState<any | null>(null);

  // Derive current active tab from URL parameters
  const currentTab = (() => {
    if (searchParams.get('assignedToId') === user?.id) return 'My Tickets';
    if (searchParams.get('assignedToId') === 'unassigned') return 'Unassigned';
    if (searchParams.get('isOverdue') === 'true') return 'Overdue';
    if (searchParams.get('dueToday') === 'true') return 'Due Today';
    if (searchParams.get('status') === 'RESOLVED') return 'Resolved';
    if (searchParams.get('status') === 'CLOSED') return 'Closed';
    return 'All Tickets';
  })();

  const queryParams = new URLSearchParams(searchParams.toString());
  if (!queryParams.has('limit')) queryParams.set('limit', '6');
  const { data, isLoading } = useTickets(queryParams);

  // ---------------------------------------------------------------------------
  // Navigation Handlers
  // ---------------------------------------------------------------------------
  const updateQuery = (key: string, value: string | null, clearOthers = false) => {
    const params = new URLSearchParams(clearOthers ? '' : searchParams.toString());

    // If setting a tab, clear pagination
    if (key === 'page') {
      // keep
    } else {
      params.delete('page');
    }

    if (value === null || value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`?${params.toString()}`);
  };

  const setTab = (tabName: string) => {
    const params = new URLSearchParams();
    if (tabName === 'My Tickets' && user) params.set('assignedToId', user.id);
    if (tabName === 'Unassigned') params.set('assignedToId', 'unassigned');
    if (tabName === 'Overdue') params.set('isOverdue', 'true');
    if (tabName === 'Due Today') params.set('dueToday', 'true');
    if (tabName === 'Resolved') params.set('status', 'RESOLVED');
    if (tabName === 'Closed') params.set('status', 'CLOSED');
    router.push(`?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery('search', searchValue || null);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  const TABS = [
    'All Tickets',
    'My Tickets',
    'Unassigned',
    'Overdue',
    'Due Today',
    'Resolved',
    'Closed',
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white/70 shadow-sm backdrop-blur-xl">
      {/* 1. Tabs Row */}
      <div className="w-full border-b border-slate-200/60 bg-white/40 px-6 lg:px-8">
        <div className="scrollbar-hide flex space-x-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setTab(tab)}
              className={`border-b-2 px-1 pt-2 pb-4 text-sm font-medium whitespace-nowrap transition-colors ${
                currentTab === tab
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Filters Row */}
      <div className="flex flex-col gap-4 border-b border-slate-200/60 bg-white/40 px-6 py-4 lg:px-8 xl:flex-row">
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex w-full shrink-0 items-center xl:max-w-sm"
        >
          <Search className="pointer-events-none absolute left-4 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, title, or keyword..."
            className="h-10 w-full rounded-full border border-slate-200/60 bg-white/60 pr-4 pl-10 text-sm text-slate-900 shadow-sm backdrop-blur transition-all placeholder:text-slate-400 hover:bg-white/80 focus:border-indigo-500/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>

        <div className="flex flex-1 flex-wrap items-center gap-3">
          <select
            className="h-10 rounded-full border border-slate-200/60 bg-white/60 px-4 py-2 text-sm text-slate-700 shadow-sm backdrop-blur transition-all hover:bg-white/80 focus:border-indigo-500/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
            value={searchParams.get('projectId') || 'all'}
            onChange={(e) => updateQuery('projectId', e.target.value)}
          >
            <option value="all">All Projects</option>
            {/* Populated dynamically in real app, assuming simple select for mockup parity */}
          </select>

          <select
            className="h-10 rounded-full border border-slate-200/60 bg-white/60 px-4 py-2 text-sm text-slate-700 shadow-sm backdrop-blur transition-all hover:bg-white/80 focus:border-indigo-500/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
            value={searchParams.get('clientId') || 'all'}
            onChange={(e) => updateQuery('clientId', e.target.value)}
          >
            <option value="all">All Clients</option>
          </select>

          <select
            className="h-10 rounded-full border border-slate-200/60 bg-white/60 px-4 py-2 text-sm text-slate-700 shadow-sm backdrop-blur transition-all hover:bg-white/80 focus:border-indigo-500/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
            value={searchParams.get('status') || 'all'}
            onChange={(e) => updateQuery('status', e.target.value)}
          >
            <option value="all">All Status</option>
            {Object.keys(TicketStatus).map((s) => (
              <option key={s} value={s}>
                {getStatusLabel(s)}
              </option>
            ))}
          </select>

          <select
            className="h-10 rounded-full border border-slate-200/60 bg-white/60 px-4 py-2 text-sm text-slate-700 shadow-sm backdrop-blur transition-all hover:bg-white/80 focus:border-indigo-500/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
            value={searchParams.get('priority') || 'all'}
            onChange={(e) => updateQuery('priority', e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="URGENT">URGENT</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {/* 3. Table */}
      <div className="flex-1 overflow-x-auto px-6 lg:px-8">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-200 bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="w-[40px] pl-0">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Ticket ID</TableHead>
              <TableHead className="min-w-[200px] text-[11px] font-semibold uppercase tracking-wider text-slate-500">Title</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Client</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Project</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Priority</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Status</TableHead>
              <TableHead className="min-w-[180px] text-[11px] font-semibold uppercase tracking-wider text-slate-500">Engineer</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">SLA Status</TableHead>
              <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <motion.tbody 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="[&_tr:last-child]:border-0"
          >
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="h-48 text-center text-slate-500">
                  <RefreshCcw className="mx-auto mb-2 h-6 w-6 animate-spin text-indigo-500" />
                  Loading tickets...
                </TableCell>
              </TableRow>
            ) : !data || data.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-48 text-center text-slate-500">
                  No tickets found.
                </TableCell>
              </TableRow>
            ) : (
              data.items.map((ticket: any) => {
                const sla = getSlaStatus(ticket);

                return (
                  <motion.tr
                    variants={rowVariants}
                    key={ticket.id}
                    className={cn(
                      "group cursor-pointer border-b border-slate-100/50 transition-colors",
                      getStringColorHover(ticket.client?.name || 'ticket')
                    )}
                  >
                    <TableCell className="pl-0">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100 focus:ring-indigo-500"
                      />
                    </TableCell>

                    <TableCell className="font-medium text-indigo-600">
                      <Link href={`/tickets/${ticket.id}`} className="hover:underline">
                        TKT-{new Date(ticket.createdAt).getFullYear()}-
                        {ticket.number.toString().padStart(5, '0')}
                      </Link>
                    </TableCell>

                    <TableCell>
                      <Link
                        href={`/tickets/${ticket.id}`}
                        className="line-clamp-2 pr-4 text-slate-700 hover:text-indigo-600"
                      >
                        {ticket.title}
                      </Link>
                    </TableCell>

                    <TableCell className="text-slate-600">{ticket.client?.name}</TableCell>

                    <TableCell className="text-slate-600">{ticket.project?.name}</TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 font-bold text-[11px]">
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full shadow-sm",
                            ticket.priority === 'URGENT' ? 'bg-red-500 ring-1 ring-red-500/30 shadow-red-500/50' : 
                            ticket.priority === 'HIGH' ? 'bg-orange-500 ring-1 ring-orange-500/30' : 
                            ticket.priority === 'MEDIUM' ? 'bg-blue-500 ring-1 ring-blue-500/30' : 
                            'bg-slate-400 ring-1 ring-slate-400/30'
                          )}
                        />
                        <span className="text-slate-700 uppercase tracking-wide">
                          {ticket.priority}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 font-bold text-[11px]">
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full shadow-sm",
                            ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS' || ticket.status === 'WAITING_ON_CLIENT' 
                              ? 'bg-blue-500 ring-1 ring-blue-500/30 shadow-blue-500/50' 
                              : ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'
                                ? 'bg-emerald-500 ring-1 ring-emerald-500/30 shadow-emerald-500/50'
                                : 'bg-slate-400 ring-1 ring-slate-400/30'
                          )}
                        />
                        <span className="text-slate-700 uppercase tracking-wide">
                          {getStatusLabel(ticket.status)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      {ticket.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7 border-0">
                            <AvatarImage src={ticket.assignedTo.avatarUrl || ''} />
                            <AvatarFallback 
                              className={cn(
                                "text-[10px] bg-gradient-to-br font-bold shadow-sm ring-1 ring-inset",
                                getStringColorGradient(ticket.assignedTo.firstName)
                              )}
                            >
                              {ticket.assignedTo.firstName[0]}
                              {ticket.assignedTo.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm leading-tight font-medium text-slate-900">
                              {ticket.assignedTo.firstName} {ticket.assignedTo.lastName}
                            </span>
                            <span className="text-[11px] leading-tight text-slate-500">
                              Engineer
                            </span>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedTicketToAssign(ticket);
                          }}
                          className="flex items-center gap-2 text-slate-400 transition-colors hover:text-indigo-600"
                        >
                          <span>—</span>
                          <span className="text-sm">Unassigned</span>
                        </button>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 font-bold text-[11px]">
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full shadow-sm",
                            sla.label === 'Breached' ? 'bg-red-500 ring-1 ring-red-500/30 shadow-red-500/50' : 
                            sla.label === 'Warning' ? 'bg-amber-500 ring-1 ring-amber-500/30 shadow-amber-500/50' : 
                            'bg-emerald-500 ring-1 ring-emerald-500/30 shadow-emerald-500/50'
                          )}
                        />
                        <span className="text-slate-700 uppercase tracking-wide">
                          {sla.label}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <div>{format(new Date(ticket.createdAt), 'MMM d, yyyy')}</div>
                      <div className="text-[10px] text-slate-300">
                        {format(new Date(ticket.createdAt), 'hh:mm a')}
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })
            )}
          </motion.tbody>
        </Table>
      </div>

      {/* 4. Pagination Footer */}
      <div className="flex flex-col items-center justify-between border-t border-slate-200/60 bg-white/40 px-6 py-4 sm:flex-row lg:px-8">
        <div className="mb-4 text-sm text-slate-500 sm:mb-0">
          Showing{' '}
          {data?.totalItems === 0
            ? 0
            : ((data?.page || 1) - 1) * ((data as any)?.pageSize || 8) + 1}{' '}
          to {Math.min((data?.page || 1) * ((data as any)?.pageSize || 8), data?.totalItems || 0)}{' '}
          of {data?.totalItems || 0} tickets
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <select
              className="h-8 rounded border border-slate-200 bg-white px-2 text-sm text-slate-700 shadow-sm outline-none"
              // @ts-ignore
              value={(data as any)?.pageSize || '6'}
              onChange={(e) => updateQuery('limit', e.target.value)}
            >
              <option value="6">6 per page</option>
              <option value="15">15 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              className="h-8 w-8 rounded border-slate-200 p-0 shadow-sm"
              disabled={!data || data.page <= 1}
              onClick={() => updateQuery('page', String((data?.page || 1) - 1))}
            >
              <ChevronLeft className="h-4 w-4 text-slate-500" />
            </Button>

            {Array.from({ length: Math.min(3, data?.totalPages || 1) }, (_, i) => i + 1).map(
              (pageNum) => (
                <Button
                  key={pageNum}
                  variant={data?.page === pageNum ? 'default' : 'outline'}
                  className={`h-8 w-8 rounded p-0 shadow-sm ${
                    data?.page === pageNum
                      ? 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                      : 'border-slate-200 text-slate-700'
                  }`}
                  onClick={() => updateQuery('page', String(pageNum))}
                >
                  {pageNum}
                </Button>
              ),
            )}

            {(data?.totalPages || 1) > 3 && (
              <>
                <div className="flex w-8 items-center justify-center text-slate-400">
                  <MoreHorizontal className="h-4 w-4" />
                </div>
                <Button
                  variant="outline"
                  className="h-8 w-8 rounded border-slate-200 p-0 text-slate-700 shadow-sm"
                  onClick={() => updateQuery('page', String(data?.totalPages))}
                >
                  {data?.totalPages}
                </Button>
              </>
            )}

            <Button
              variant="outline"
              className="h-8 w-8 rounded border-slate-200 p-0 shadow-sm"
              disabled={!data || data.page >= data.totalPages}
              onClick={() => updateQuery('page', String((data?.page || 1) + 1))}
            >
              <ChevronRight className="h-4 w-4 text-slate-500" />
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar Panel overlay for Assign Engineer */}
      <AssignEngineerSidebar
        ticket={selectedTicketToAssign}
        onClose={() => setSelectedTicketToAssign(null)}
      />
    </div>
  );
}
