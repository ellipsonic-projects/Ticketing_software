'use client';

import Link from 'next/link';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
} from 'lucide-react';

import {
  PaginatedTickets,
  TicketListItem,
} from '@/lib/client-dashboard/client-dashboard.types';

import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_STYLES: Record<TicketListItem['status'], string> = {
  OPEN:        'bg-blue-50 text-blue-700 border border-blue-200',
  IN_PROGRESS: 'bg-amber-50 text-amber-700 border border-amber-200',
  RESOLVED:    'bg-emerald-50 text-emerald-700 border border-emerald-200',
  CLOSED:      'bg-slate-100 text-slate-600 border border-slate-200',
};

const PRIORITY_STYLES: Record<TicketListItem['priority'], string> = {
  LOW:    'bg-slate-100 text-slate-600',
  MEDIUM: 'bg-blue-50 text-blue-600',
  HIGH:   'bg-orange-50 text-orange-600',
  URGENT: 'bg-red-50 text-red-600',
};

const STATUS_LABELS: Record<TicketListItem['status'], string> = {
  OPEN:        'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED:    'Resolved',
  CLOSED:      'Closed',
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface RecentTicketsTableProps {
  data: PaginatedTickets;
  page: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function AssigneeCell({
  name,
}: {
  name: string | null;
}) {
  if (!name) {
    return <span className="text-xs italic text-slate-400">Unassigned</span>;
  }

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-blue-100">
        <span className="text-xs font-semibold text-blue-600">{initials}</span>
      </div>
      <span className="text-sm font-medium text-slate-700">{name}</span>
    </div>
  );
}

function TableHeader() {
  const cols = ['Ticket', 'Project', 'Status', 'Priority', 'Engineer', 'Updated'];
  return (
    <thead className="bg-slate-50">
      <tr className="text-left">
        {cols.map((col, i) => (
          <th
            key={col}
            className={cn(
              'py-4 text-xs font-semibold uppercase tracking-wide text-slate-500',
              i === 0 ? 'px-8' : 'px-4',
            )}
          >
            {col}
          </th>
        ))}
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
  isLoading,
}: RecentTicketsTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-8 py-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Recent Tickets</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage and track your latest support requests
          </p>
        </div>
        <Link
          href="/client/tickets"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader />
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                </td>
              </tr>
            ) : data.items.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <FolderOpen className="mx-auto h-10 w-10 text-slate-300" />
                  <p className="mt-4 font-medium text-slate-500">No Tickets Found</p>
                </td>
              </tr>
            ) : (
              data.items.map((ticket) => (
                <tr key={ticket.id} className="transition hover:bg-slate-50">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{ticket.title}</span>
                      <span className="mt-1 text-xs text-slate-400">#{ticket.number}</span>
                    </div>
                  </td>

                  <td className="px-4 py-5">
                    <span className="text-sm font-medium text-slate-700">
                      {ticket.projectName}
                    </span>
                  </td>

                  <td className="px-4 py-5">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                        STATUS_STYLES[ticket.status],
                      )}
                    >
                      {STATUS_LABELS[ticket.status]}
                    </span>
                  </td>

                  <td className="px-4 py-5">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                        PRIORITY_STYLES[ticket.priority],
                      )}
                    >
                      {ticket.priority}
                    </span>
                  </td>

                  <td className="px-4 py-5">
                    <AssigneeCell name={ticket.assignedEngineerName} />
                  </td>

                  <td className="px-4 py-5">
                    <span className="text-sm text-slate-500">{ticket.updatedAt}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 px-8 py-5">
        <p className="text-sm text-slate-500">
          Showing{' '}
          <span className="font-semibold text-slate-700">{data.items.length}</span>{' '}
          of{' '}
          <span className="font-semibold text-slate-700">{data.total}</span>{' '}
          tickets
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl border transition',
              page <= 1
                ? 'cursor-not-allowed border-slate-200 text-slate-300'
                : 'border-slate-300 hover:bg-slate-100',
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="px-3 text-sm font-semibold text-slate-700">
            Page {page} / {data.totalPages}
          </span>

          <button
            type="button"
            disabled={page >= data.totalPages}
            onClick={() => onPageChange(page + 1)}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl border transition',
              page >= data.totalPages
                ? 'cursor-not-allowed border-slate-200 text-slate-300'
                : 'border-slate-300 hover:bg-slate-100',
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}