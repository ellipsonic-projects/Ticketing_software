'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

import { useTickets } from '@/hooks/use-tickets';
import { TicketWithDetails } from '@/lib/ticket/ticket.types';
import { TicketCard } from './ticket-card';
import { Button } from '@/components/ui/button';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 25;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TicketList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { data, isLoading, isError } = useTickets(searchParams);

  const currentPage = parseInt(searchParams.get('page') ?? String(DEFAULT_PAGE), 10);
  const limit = parseInt(searchParams.get('limit') ?? String(DEFAULT_LIMIT), 10);

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 w-full animate-pulse rounded-2xl bg-slate-200" />
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
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-lg font-semibold text-slate-900">
          Total Tickets <span className="ml-2 font-bold">{totalItems}</span>
        </h2>
        <Button
          className="rounded-lg bg-blue-600 text-white shadow-sm hover:bg-blue-700"
          onClick={() => router.push('/client/tickets/new')}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {items.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-500">
            <p>No tickets found.</p>
          </div>
        ) : (
          items.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />)
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-4 sm:flex-row">
          <span className="text-sm text-slate-600">
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
