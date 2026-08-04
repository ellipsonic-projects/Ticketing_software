import { Suspense } from 'react';

import { Metadata } from 'next';

import { ExportTicketsButton } from '@/components/tickets/export-tickets-button';
import { TicketList } from '@/components/tickets/ticket-list';

export const metadata: Metadata = {
  title: 'Tickets | Elipdesk',
  description: 'Manage support tickets',
};

export default function TicketsPage() {
  return (
    <div className="flex flex-col p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tickets</h1>
          <p className="text-sm text-slate-500">View, manage and assign tickets to engineers.</p>
        </div>

        <div className="mt-4 flex items-center gap-3 sm:mt-0">
          <ExportTicketsButton />
        </div>
      </div>

      <div className="flex flex-col">
        <Suspense
          fallback={<div className="p-8 text-center text-slate-500">Loading tickets...</div>}
        >
          <TicketList />
        </Suspense>
      </div>
    </div>
  );
}
