'use client';

import { TicketsHero } from '@/components/client/tickets/tickets-hero';
import { TicketList } from '@/components/client/tickets/ticket-list';

export default function ClientTicketsPage() {
  return (
    <div className="space-y-6">
      <TicketsHero />
      <TicketList />
    </div>
  );
}
