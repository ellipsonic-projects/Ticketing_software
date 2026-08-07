'use client';

import { useState } from 'react';

import { useClientDashboard } from '@/hooks/use-client-dashboard';
import { ClientDashboardTicketSort } from '@/lib/client-dashboard/client-dashboard.types';
import { mapDashboardSla, mapProjectHealth } from '@/lib/client-dashboard/mappers';

import { CreateTicketModal } from './create-ticket-modal';
import { ProjectHealthCard } from './project-health-card';
import { RecentTicketsTable, TicketSortKey } from './recent-tickets-table';
import { DashboardSkeleton } from './skeletons';
import { SlaPerformanceCard } from './sla-performance-card';
import { SummaryCards } from './summary-cards';

const TICKETS_PER_PAGE = 7;
const PROJECTS_PER_PAGE = 3;

export function ClientDashboard() {
  const [ticketPage, setTicketPage] = useState(1);
  const [ticketSort, setTicketSort] = useState<ClientDashboardTicketSort>('updatedAt');
  const [ticketSortDirection, setTicketSortDirection] = useState<'asc' | 'desc'>('desc');
  const [ticketProjectId, setTicketProjectId] = useState<string | undefined>();
  const [projectPage, setProjectPage] = useState(1);
  const [createTicketOpen, setCreateTicketOpen] = useState(false);
  const { data, isLoading, isFetching, isError, refetch } = useClientDashboard(
    ticketPage,
    TICKETS_PER_PAGE,
    ticketSort,
    ticketSortDirection,
    ticketProjectId,
    projectPage,
    PROJECTS_PER_PAGE,
  );

  if (isLoading && !data) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="text-4xl">⚠️</div>
          <h2 className="font-heading text-xl font-semibold text-slate-800">
            Failed to load dashboard
          </h2>
          <p className="text-sm text-slate-500">Something went wrong. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="mt-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { summary, recentTickets, ticketProjects, sla, projectHealth } = data;

  const handleTicketSort = (sort: TicketSortKey, direction: 'asc' | 'desc') => {
    setTicketSort(sort);
    setTicketSortDirection(direction);
    setTicketPage(1);
  };

  const handleProjectFilterChange = (projectId: string | undefined) => {
    setTicketProjectId(projectId);
    setTicketPage(1);
  };

  // NOTE: The sidebar + header shell is provided by ClientPortalLayout (layout.tsx).
  // This component renders only the scrollable page content that lives inside <main>.
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-4 py-5">
      {/* Row 1 — KPI summary cards */}
      <SummaryCards summary={summary} />

      {/* Row 2 — Recent tickets + SLA performance */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <RecentTicketsTable
            data={recentTickets}
            page={ticketPage}
            onPageChange={setTicketPage}
            sortKey={ticketSort}
            sortDirection={ticketSortDirection}
            onSort={handleTicketSort}
            projectFilterId={ticketProjectId}
            projectOptions={ticketProjects}
            onProjectFilterChange={handleProjectFilterChange}
            isLoading={isFetching}
            onCreateTicket={() => setCreateTicketOpen(true)}
          />
        </div>
        <div className="space-y-4">
          <SlaPerformanceCard sla={mapDashboardSla(sla)} />
          <ProjectHealthCard
            projects={mapProjectHealth(projectHealth.items)}
            page={projectHealth.page}
            total={projectHealth.total}
            totalPages={projectHealth.totalPages}
            onPageChange={setProjectPage}
            isLoading={isFetching}
          />
        </div>
      </div>

      {/* Row 3 — Project health + Support timeline */}
      <CreateTicketModal
        open={createTicketOpen}
        onOpenChange={setCreateTicketOpen}
        onCreated={() => refetch()}
      />
    </div>
  );
}
