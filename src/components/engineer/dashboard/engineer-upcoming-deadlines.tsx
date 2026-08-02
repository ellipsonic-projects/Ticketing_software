'use client';

import Link from 'next/link';

import { ArrowRight, Loader2 } from 'lucide-react';

import { TicketPriorityBadge } from '@/components/tickets/ticket-priority-badge';
import { useAuth } from '@/hooks/use-auth';
import { useTickets } from '@/hooks/use-tickets';

export function EngineerUpcomingDeadlines() {
  const { user } = useAuth();

  // We need to fetch tickets assigned to this engineer that are open/in progress, sorted by SLA deadline.
  const searchParams = new URLSearchParams();
  if (user?.id) {
    searchParams.set('assignedToId', user.id);
  }
  searchParams.set('status', 'OPEN,IN_PROGRESS');
  searchParams.set('sort', 'resolutionBreachAt');
  searchParams.set('order', 'asc');
  searchParams.set('limit', '4'); // Fit well in the widget

  const { data: ticketsData, isLoading, isError } = useTickets(searchParams);

  // Helper to format remaining time
  const formatTimeRemaining = (breachAt: Date | string | null) => {
    if (!breachAt) return 'No SLA';
    const breachTime = new Date(breachAt).getTime();
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    const diff = breachTime - now;

    if (diff < 0) return 'Breached';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      return `${Math.floor(hours / 24)}d ${hours % 24}h`;
    }

    return `${hours}h ${minutes}m`;
  };

  const getUrgencyColor = (breachAt: Date | string | null) => {
    if (!breachAt) return 'text-slate-500';
    // eslint-disable-next-line react-hooks/purity
    const diff = new Date(breachAt).getTime() - Date.now();
    if (diff < 0) return 'text-red-600 font-bold'; // Breached
    if (diff < 4 * 60 * 60 * 1000) return 'text-red-500 font-semibold'; // < 4 hours
    if (diff < 12 * 60 * 60 * 1000) return 'text-amber-500 font-medium'; // < 12 hours
    return 'text-green-600';
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="font-semibold text-slate-900">Upcoming Deadlines</h3>
        <Link
          href="/engineer/tickets?sort=resolutionBreachAt"
          className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View all
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : isError ? (
          <div className="flex h-full items-center justify-center text-sm text-red-500">
            Failed to load deadlines
          </div>
        ) : ticketsData?.items.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            No upcoming deadlines
          </div>
        ) : (
          <div className="space-y-4">
            {ticketsData?.items.map((ticket) => (
              <div
                key={ticket.id}
                className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <TicketPriorityBadge priority={ticket.priority} />
                    <Link
                      href={`/engineer/tickets/${ticket.id}`}
                      className="text-sm font-bold text-slate-900 hover:text-blue-600 hover:underline"
                    >
                      {ticket.number}
                    </Link>
                  </div>
                  <span
                    className={`text-sm ${getUrgencyColor((ticket as any).resolutionBreachAt)}`}
                  >
                    {formatTimeRemaining((ticket as any).resolutionBreachAt)}
                  </span>
                </div>
                <div>
                  <p className="line-clamp-1 text-sm font-medium text-slate-700">{ticket.title}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                    {ticket.client?.name || 'Unknown Client'} •{' '}
                    {ticket.project?.name || 'Unknown Project'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
