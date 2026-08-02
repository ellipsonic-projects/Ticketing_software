'use client';

import { useState } from 'react';

import { useClientDashboard } from '@/hooks/use-client-dashboard';
import { mapDashboardSla, mapProjectHealth, mapTimeline } from '@/lib/client-dashboard/mappers';

import { ProjectHealthCard } from './project-health-card';
import { RecentTicketsTable } from './recent-tickets-table';
import { DashboardSkeleton } from './skeletons';
import { SlaPerformanceCard } from './sla-performance-card';
import { SummaryCards } from './summary-cards';
import { SupportTimelineCard } from './support-timeline-card';

const TICKETS_PER_PAGE = 6;

export function ClientDashboard() {
  const [ticketPage, setTicketPage] = useState(1);
  const { data, isLoading, isError, refetch } = useClientDashboard(ticketPage, TICKETS_PER_PAGE);

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

  const { summary, recentTickets, sla, projectHealth, timeline } = data;

  // NOTE: The sidebar + header shell is provided by ClientPortalLayout (layout.tsx).
  // This component renders only the scrollable page content that lives inside <main>.
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      {/* Row 1 — KPI summary cards */}
      <SummaryCards summary={summary} />

      {/* Row 2 — Recent tickets + SLA performance */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentTicketsTable
            data={recentTickets}
            page={ticketPage}
            onPageChange={setTicketPage}
            isLoading={isLoading}
          />
        </div>
        <SlaPerformanceCard sla={mapDashboardSla(sla)} />
      </div>

      {/* Row 3 — Project health + Support timeline */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProjectHealthCard projects={mapProjectHealth(projectHealth)} />
        <SupportTimelineCard events={mapTimeline(timeline)} />
      </div>
    </div>
  );
}
