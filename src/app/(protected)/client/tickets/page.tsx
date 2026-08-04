'use client';

import { useState } from 'react';

import { ClientTicketSidePanel } from '@/components/client/tickets/client-ticket-side-panel';
import { TicketList } from '@/components/client/tickets/ticket-list';
import { TicketsHero } from '@/components/client/tickets/tickets-hero';

export default function ClientTicketsPage() {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Hero Stats */}
      <div className="shrink-0">
        <TicketsHero />
      </div>

      {/* Main Content Area */}
      <div
        className={`grid gap-6 transition-all duration-300 ease-in-out ${
          selectedTicketId ? 'grid-cols-[1fr_400px] xl:grid-cols-[1fr_500px]' : 'grid-cols-1'
        }`}
      >
        <div className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
          <TicketList selectedTicketId={selectedTicketId} onSelectTicket={setSelectedTicketId} />
        </div>

        {selectedTicketId && (
          <div className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
            <ClientTicketSidePanel
              ticketId={selectedTicketId}
              onClose={() => setSelectedTicketId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
