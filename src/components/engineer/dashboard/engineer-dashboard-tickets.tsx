'use client';

import { useState } from 'react';
import Link from 'next/link';

import { formatDistanceToNow } from 'date-fns';
import { ArrowRight, Eye, Loader2, MessageSquare } from 'lucide-react';

import { TicketPriorityBadge } from '@/components/tickets/ticket-priority-badge';
import { TicketStatusBadge } from '@/components/tickets/ticket-status-badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useTickets } from '@/hooks/use-tickets';
import { cn } from '@/lib/utils';

type TabType = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'OVERDUE';

export function EngineerDashboardTickets() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('OPEN');

  const searchParams = new URLSearchParams();
  if (user?.id) {
    searchParams.set('assignedToId', user.id);
  }

  if (activeTab !== 'OVERDUE') {
    searchParams.set('status', activeTab);
  } else {
    // Handling OVERDUE might require special query or 'isOverdue=true'
    // depending on backend implementation. We'll set isOverdue=true if supported.
    searchParams.set('isOverdue', 'true');
    searchParams.set('status', 'OPEN,IN_PROGRESS'); // usually overdue are not resolved
  }

  searchParams.set('limit', '5');

  const { data: ticketsData, isLoading, isError } = useTickets(searchParams);

  const tabs: { id: TabType; label: string }[] = [
    { id: 'OPEN', label: 'Open' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'RESOLVED', label: 'Resolved' },
    { id: 'OVERDUE', label: 'Overdue' },
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-6 pb-0">
        <h3 className="mb-4 font-semibold text-slate-900">My Tickets</h3>
        <div className="flex gap-6 border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'pb-3 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-500 hover:text-slate-900',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">Ticket ID</th>
              <th className="px-6 py-4 font-semibold">Title</th>
              <th className="px-6 py-4 font-semibold">Client</th>
              <th className="px-6 py-4 font-semibold">Project</th>
              <th className="px-6 py-4 font-semibold">Priority</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Updated</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-8 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-600" />
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-red-500">
                  Failed to load tickets
                </td>
              </tr>
            ) : ticketsData?.items.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500">
                  No tickets found for {tabs.find((t) => t.id === activeTab)?.label.toLowerCase()}
                </td>
              </tr>
            ) : (
              ticketsData?.items.map((ticket) => (
                <tr key={ticket.id} className="transition-colors hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/engineer/tickets/${ticket.id}`}
                      className="font-bold text-blue-600 hover:underline"
                    >
                      {ticket.number}
                    </Link>
                  </td>
                  <td className="line-clamp-1 max-w-[200px] px-6 py-4 font-medium text-slate-900">
                    {ticket.title}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{ticket.client?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 text-slate-600">{ticket.project?.name || 'Unknown'}</td>
                  <td className="px-6 py-4">
                    <TicketPriorityBadge priority={ticket.priority} />
                  </td>
                  <td className="px-6 py-4">
                    <TicketStatusBadge status={ticket.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                    {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/engineer/tickets/${ticket.id}`}
                        className={cn(
                          buttonVariants({ variant: 'ghost', size: 'icon' }),
                          'h-8 w-8 text-slate-400 hover:text-blue-600',
                        )}
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/engineer/tickets/${ticket.id}#comments`}
                        className={cn(
                          buttonVariants({ variant: 'ghost', size: 'icon' }),
                          'h-8 w-8 text-slate-400 hover:text-blue-600',
                        )}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-100 p-4 px-6 text-right">
        <Link
          href={`/engineer/tickets?assignedToId=${user?.id || ''}${activeTab !== 'OPEN' ? `&status=${activeTab}` : ''}`}
          className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View all my tickets
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
