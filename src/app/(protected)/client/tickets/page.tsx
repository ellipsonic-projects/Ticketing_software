'use client';

import { TicketList } from '@/components/client/tickets/ticket-list';
import { TicketsHero } from '@/components/client/tickets/tickets-hero';

export default function ClientTicketsPage() {
  return (
    <div className="space-y-6">
      <TicketsHero />
      <TicketList />
    </div>
  );
}
