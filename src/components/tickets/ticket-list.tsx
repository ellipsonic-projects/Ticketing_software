/* eslint-disable */
'use client';

import { useSearchParams } from 'next/navigation';
import { useTickets } from '@/hooks/use-tickets';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TicketPriority, TicketStatus } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

import { DataTableToolbar } from '@/components/shared/data-table/data-table-toolbar';
import { SearchInput } from '@/components/shared/data-table/search-input';
import { StatusFilter } from '@/components/shared/data-table/status-filter';
import { SortDropdown } from '@/components/shared/data-table/sort-dropdown';
import { Pagination } from '@/components/shared/data-table/pagination';
import { EmptyState } from '@/components/shared/data-table/empty-state';

export function TicketList() {
  const searchParams = useSearchParams();
  const { data, isLoading } = useTickets(searchParams);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IN_PROGRESS': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'RESOLVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CLOSED': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      <DataTableToolbar>
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <SearchInput placeholder="Search tickets..." />
          <StatusFilter
            paramName="status"
            options={Object.keys(TicketStatus).map((s) => ({
              label: s.replace(/_/g, ' '),
              value: s,
            }))}
            placeholder="Status"
          />
          <StatusFilter
            paramName="priority"
            options={Object.keys(TicketPriority).map((p) => ({
              label: p,
              value: p,
            }))}
            placeholder="Priority"
          />
        </div>
        <SortDropdown
          options={[
            { label: 'Newest First', value: 'createdAt:desc' },
            { label: 'Oldest First', value: 'createdAt:asc' },
            { label: 'Highest Priority', value: 'priority:desc' },
            { label: 'Lowest Priority', value: 'priority:asc' },
            { label: 'Recently Updated', value: 'updatedAt:desc' },
          ]}
        />
      </DataTableToolbar>

      <Card className="border shadow-sm bg-white/50 backdrop-blur-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : !data || data.items.length === 0 ? (
          <EmptyState
            title="No tickets found"
            description="We couldn't find any tickets matching your filters."
          />
        ) : (
          <div className="divide-y">
            {data.items.map((ticket: any) => (
              <div
                key={ticket.id}
                className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link
                      href={`/tickets/${ticket.id}`}
                      className="font-semibold text-slate-900 hover:text-blue-600 truncate transition-colors"
                    >
                      {ticket.title}
                    </Link>
                    <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(ticket.status)}>
                      {ticket.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="font-medium text-slate-700">#{ticket.number}</span>
                    <span>•</span>
                    <span className="truncate max-w-[150px]">{ticket.project?.name}</span>
                    <span>•</span>
                    <span className="truncate max-w-[150px]">{ticket.client?.name}</span>
                    <span>•</span>
                    <span>Opened {formatDistanceToNow(new Date(ticket.createdAt))} ago</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm sm:min-w-[180px] justify-end">
                  <div className="flex flex-col items-end">
                    <span className="text-slate-500">Assignee</span>
                    <span className="font-medium text-slate-900">
                      {ticket.assignedTo
                        ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
                        : 'Unassigned'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {data && data.totalPages > 1 && (
        <Pagination
          totalPages={data.totalPages}
          totalItems={data.totalItems}
        />
      )}
    </div>
  );
}
