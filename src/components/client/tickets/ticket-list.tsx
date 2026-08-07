'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { TicketPriority, TicketStatus } from '@prisma/client';
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTickets } from '@/hooks/use-tickets';
import { TicketWithDetails } from '@/lib/ticket/ticket.types';

import { TicketCard } from './ticket-card';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 25;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface TicketListProps {
  selectedTicketId?: string | null;
  onSelectTicket?: (id: string) => void;
}

export function TicketList({ selectedTicketId, onSelectTicket }: TicketListProps = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { data, isLoading, isError } = useTickets(searchParams);

  const currentPage = parseInt(searchParams.get('page') ?? String(DEFAULT_PAGE), 10);
  const limit = parseInt(searchParams.get('limit') ?? String(DEFAULT_LIMIT), 10);

  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');

  const updateQuery = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key !== 'page') params.delete('page'); // Reset to page 1 on filter change

    if (value === null || value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery('search', searchValue || null);
  };

  const setPage = (page: number) => {
    updateQuery('page', page.toString());
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 w-full animate-pulse rounded-xl bg-slate-200" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-32 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-600">
        Failed to load tickets. Please try again later.
      </div>
    );
  }

  const items: TicketWithDetails[] = data?.items ?? [];
  const totalItems = data?.totalItems ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <div className="flex flex-col">
      <div className="shrink-0">
        {/* Toolbar */}
        <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center lg:px-5">
          <h2 className="text-sm font-semibold text-slate-900">
            All tickets <span className="ml-1.5 text-slate-400">{totalItems}</span>
          </h2>
          <Button
            size="sm"
            className="bg-slate-900 text-white shadow-sm hover:bg-slate-700"
            onClick={() => router.push('/client/tickets/new')}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col gap-2 border-b border-slate-200 px-4 pb-3 sm:flex-row lg:px-5">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex w-full shrink-0 items-center sm:max-w-sm"
          >
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              className="h-9 w-full rounded-lg border border-slate-200 bg-white pr-4 pl-9 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </form>

          <div className="flex flex-1 flex-wrap items-center gap-3">
            <select
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={searchParams.get('status') || 'all'}
              onChange={(e) => updateQuery('status', e.target.value)}
            >
              <option value="all">All Statuses</option>
              {Object.keys(TicketStatus).map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, ' ')}
                </option>
              ))}
            </select>

            <select
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={searchParams.get('priority') || 'all'}
              onChange={(e) => updateQuery('priority', e.target.value)}
            >
              <option value="all">All Priorities</option>
              {Object.keys(TicketPriority).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="p-3 lg:p-4">
        <div className="flex flex-col gap-2">
          {items.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-500">
              <p>No tickets found.</p>
            </div>
          ) : (
            items.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                isSelected={selectedTicketId === ticket.id}
                onClick={() => onSelectTicket?.(ticket.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex shrink-0 flex-col items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/50 px-4 py-3 sm:flex-row lg:px-5">
          <span className="text-xs text-slate-600">
            Showing {startItem} to {endItem} of {totalItems} tickets
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              const isActive = page === currentPage;
              return (
                <Button
                  key={page}
                  variant={isActive ? 'default' : 'outline'}
                  className={`h-8 w-8 rounded-lg p-0 ${isActive ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  onClick={() => setPage(page)}
                >
                  {page}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
