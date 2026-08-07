'use client';

import { useMemo, useState } from 'react';

import { format } from 'date-fns';
import { motion, Variants } from 'framer-motion';
import {
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FolderKanban,
  FolderOpen,
  Plus,
  SlidersHorizontal,
  Ticket,
  UserRound,
} from 'lucide-react';

import { ClientTicketSidePanel } from '@/components/client/tickets/client-ticket-side-panel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ClientDashboardTicketSort,
  PaginatedTickets,
  TicketListItem,
  TicketProjectFilter,
} from '@/lib/client-dashboard/client-dashboard.types';
import { cn, getStringColorGradient, getStringColorHover } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export type TicketSortKey = ClientDashboardTicketSort;

const SORT_OPTIONS: { value: TicketSortKey; label: string }[] = [
  { value: 'updatedAt', label: 'Last updated' },
  { value: 'title', label: 'Ticket name' },
  { value: 'project', label: 'Project' },
  { value: 'status', label: 'Status' },
  { value: 'priority', label: 'Priority' },
];

const STATUS_STYLES: Record<TicketListItem['status'], string> = {
  OPEN: 'bg-blue-50 text-blue-700 border border-blue-200',
  IN_PROGRESS: 'bg-amber-50 text-amber-700 border border-amber-200',
  RESOLVED: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  CLOSED: 'bg-slate-100 text-slate-600 border border-slate-200',
};

const PRIORITY_STYLES: Record<TicketListItem['priority'], string> = {
  LOW: 'bg-slate-100 text-slate-600',
  MEDIUM: 'bg-blue-50 text-blue-600',
  HIGH: 'bg-orange-50 text-orange-600',
  URGENT: 'bg-red-50 text-red-600',
};

const STATUS_LABELS: Record<TicketListItem['status'], string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface RecentTicketsTableProps {
  data: PaginatedTickets;
  page: number;
  onPageChange: (page: number) => void;
  sortKey: TicketSortKey;
  sortDirection: 'asc' | 'desc';
  onSort: (key: TicketSortKey, direction: 'asc' | 'desc') => void;
  projectFilterId?: string;
  projectOptions: TicketProjectFilter[];
  onProjectFilterChange: (projectId: string | undefined) => void;
  isLoading?: boolean;
  onCreateTicket: () => void;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function AssigneeCell({ name }: { name: string | null }) {
  if (!name) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-slate-400 italic">
        <UserRound className="h-3.5 w-3.5" />
        Unassigned
      </span>
    );
  }

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br font-bold shadow-sm ring-1 ring-inset',
          getStringColorGradient(name),
        )}
      >
        <span className="text-xs">{initials}</span>
      </div>
      <span className="text-xs font-medium text-slate-700">{name}</span>
    </div>
  );
}

function TableHeader({
  sortKey,
  sortDirection,
  onOpenSort,
}: {
  sortKey: TicketSortKey;
  sortDirection: 'asc' | 'desc';
  onOpenSort: (key: TicketSortKey) => void;
}) {
  const cols = ['Ticket', 'Project', 'Status', 'Priority', 'Engineer', 'Updated'];
  const sortableColumns: Partial<Record<string, TicketSortKey>> = {
    Ticket: 'title',
    Project: 'project',
    Status: 'status',
    Priority: 'priority',
    Updated: 'updatedAt',
  };
  return (
    <thead className="bg-slate-50/50">
      <tr className="border-b border-slate-200 text-left">
        {cols.map((col, i) => {
          const key = sortableColumns[col];
          const isSorted = key === sortKey;
          return (
            <th
              key={col}
              className={cn(
                'py-3 text-[11px] font-semibold tracking-wide text-slate-500 uppercase',
                i === 0 ? 'px-5' : 'px-3',
              )}
            >
              {key ? (
                <button
                  type="button"
                  onClick={() => onOpenSort(key)}
                  className="inline-flex items-center gap-1 transition hover:text-slate-900"
                >
                  {col}
                  <ArrowDownUp className={cn('h-3 w-3', isSorted && 'text-blue-600')} />
                  {isSorted && (
                    <span className="sr-only">
                      sorted {sortDirection === 'asc' ? 'ascending' : 'descending'}
                    </span>
                  )}
                </button>
              ) : (
                col
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RecentTicketsTable({
  data,
  page,
  onPageChange,
  sortKey,
  sortDirection,
  onSort,
  projectFilterId,
  projectOptions,
  onProjectFilterChange,
  isLoading,
  onCreateTicket,
}: RecentTicketsTableProps) {
  const [statusFilter, setStatusFilter] = useState<'ALL' | TicketListItem['status']>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | TicketListItem['priority']>('ALL');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [sortDialogOpen, setSortDialogOpen] = useState(false);
  const [draftSortKey, setDraftSortKey] = useState<TicketSortKey>(sortKey);
  const [draftSortDirection, setDraftSortDirection] = useState<'asc' | 'desc'>(sortDirection);

  const openSortDialog = (key: TicketSortKey = sortKey) => {
    setDraftSortKey(key);
    setDraftSortDirection(key === sortKey ? sortDirection : key === 'updatedAt' ? 'desc' : 'asc');
    setSortDialogOpen(true);
  };

  const visibleTickets = useMemo(() => {
    return data.items
      .filter((ticket) => statusFilter === 'ALL' || ticket.status === statusFilter)
      .filter((ticket) => priorityFilter === 'ALL' || ticket.priority === priorityFilter);
  }, [data.items, priorityFilter, statusFilter]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/60 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
            <Ticket className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">My tickets</h2>
            <p className="mt-0.5 text-xs text-slate-500">Track and manage your support requests</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCreateTicket}
          className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700"
        >
          <Plus className="h-3.5 w-3.5" />
          New ticket
        </button>
      </div>

      <div className="flex flex-col gap-2 border-b border-slate-100 bg-slate-50/50 px-5 py-2.5 sm:flex-row sm:items-center">
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Filter tickets by project"
            value={projectFilterId ?? 'ALL'}
            onChange={(event) =>
              onProjectFilterChange(event.target.value === 'ALL' ? undefined : event.target.value)
            }
            className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none hover:border-slate-300 focus:border-blue-500"
          >
            <option value="ALL">All projects</option>
            {projectOptions.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter tickets by status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
            className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none hover:border-slate-300 focus:border-blue-500"
          >
            <option value="ALL">All statuses</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter tickets by priority"
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value as typeof priorityFilter)}
            className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none hover:border-slate-300 focus:border-blue-500"
          >
            <option value="ALL">All priorities</option>
            {Object.keys(PRIORITY_STYLES).map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => openSortDialog()}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <ArrowDownUp className="h-3.5 w-3.5 text-slate-500" />
            Sort
          </button>
          {(projectFilterId || statusFilter !== 'ALL' || priorityFilter !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                onProjectFilterChange(undefined);
                setStatusFilter('ALL');
                setPriorityFilter('ALL');
              }}
              className="px-1 text-xs font-medium text-slate-500 transition hover:text-slate-900"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader
            sortKey={sortKey}
            sortDirection={sortDirection}
            onOpenSort={openSortDialog}
          />
          <motion.tbody
            key={`tickets-page-${data.page}`}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="divide-y divide-slate-100/50"
          >
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                </td>
              </tr>
            ) : visibleTickets.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <FolderOpen className="mx-auto h-10 w-10 text-slate-300" />
                  <p className="mt-4 font-medium text-slate-500">No Tickets Found</p>
                </td>
              </tr>
            ) : (
              visibleTickets.map((ticket) => (
                <motion.tr
                  variants={rowVariants}
                  key={ticket.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedTicketId(ticket.id);
                    }
                  }}
                  className={cn(
                    'group cursor-pointer border-b border-slate-100/50 transition-colors outline-none focus-visible:bg-blue-50',
                    getStringColorHover(ticket.projectName),
                  )}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-indigo-500 shadow-sm ring-1 ring-slate-200/50 transition group-hover:bg-white group-hover:shadow">
                        <Ticket className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900">{ticket.title}</span>
                        <span className="mt-0.5 text-[11px] text-slate-400">#{ticket.number}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                      <FolderKanban className="h-3.5 w-3.5 text-orange-500" />
                      <span>{ticket.projectName}</span>
                    </div>
                  </td>

                  <td className="px-3 py-3.5">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold',
                        STATUS_STYLES[ticket.status],
                      )}
                    >
                      {STATUS_LABELS[ticket.status]}
                    </span>
                  </td>

                  <td className="px-3 py-3.5">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold',
                        PRIORITY_STYLES[ticket.priority],
                      )}
                    >
                      {ticket.priority}
                    </span>
                  </td>

                  <td className="px-3 py-3.5">
                    <AssigneeCell name={ticket.assignedEngineerName} />
                  </td>

                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                      <span>{format(new Date(ticket.updatedAt), 'MMM d, HH:mm')}</span>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </motion.tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-200/60 bg-slate-50/50 px-5 py-3">
        <p className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-700">{visibleTickets.length}</span> of{' '}
          <span className="font-semibold text-slate-700">{data.total}</span> tickets
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg border transition',
              page <= 1
                ? 'cursor-not-allowed border-slate-200 text-slate-300'
                : 'border-slate-300 hover:bg-slate-100',
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="px-2 text-xs font-semibold text-slate-700">
            Page {page} / {data.totalPages}
          </span>

          <button
            type="button"
            disabled={page >= data.totalPages}
            onClick={() => onPageChange(page + 1)}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg border transition',
              page >= data.totalPages
                ? 'cursor-not-allowed border-slate-200 text-slate-300'
                : 'border-slate-300 hover:bg-slate-100',
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Dialog
        open={Boolean(selectedTicketId)}
        onOpenChange={(open) => !open && setSelectedTicketId(null)}
      >
        <DialogContent
          showCloseButton={false}
          className="h-[min(760px,calc(100vh-2rem))] max-w-[calc(100%-2rem)] overflow-hidden p-0 sm:max-w-[920px]"
        >
          {selectedTicketId && (
            <ClientTicketSidePanel
              ticketId={selectedTicketId}
              onClose={() => setSelectedTicketId(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={sortDialogOpen} onOpenChange={setSortDialogOpen}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
          <DialogHeader className="px-5 pt-5 pb-4">
            <DialogTitle>Sort tickets</DialogTitle>
            <DialogDescription>Choose how tickets are ordered across every page.</DialogDescription>
          </DialogHeader>

          <div className="space-y-5 px-5 pb-5">
            <fieldset>
              <legend className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Sort by
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDraftSortKey(option.value)}
                    className={cn(
                      'rounded-lg border px-3 py-2 text-left text-xs font-medium transition',
                      draftSortKey === option.value
                        ? 'border-blue-200 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50',
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Direction
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {(['asc', 'desc'] as const).map((direction) => (
                  <button
                    key={direction}
                    type="button"
                    onClick={() => setDraftSortDirection(direction)}
                    className={cn(
                      'rounded-lg border px-3 py-2 text-xs font-medium transition',
                      draftSortDirection === direction
                        ? 'border-blue-200 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50',
                    )}
                  >
                    {direction === 'asc' ? 'Ascending' : 'Descending'}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <DialogFooter className="mx-0 mb-0 rounded-none px-5">
            <button
              type="button"
              onClick={() => setSortDialogOpen(false)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onSort(draftSortKey, draftSortDirection);
                setSortDialogOpen(false);
              }}
              className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
            >
              Apply sort
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
