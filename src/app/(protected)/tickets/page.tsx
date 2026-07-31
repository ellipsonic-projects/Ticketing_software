/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Metadata } from 'next';
import { TicketList } from '@/components/tickets/ticket-list';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { RequirePermission } from '@/components/auth/require-permission';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Tickets | Elipsonics',
  description: 'Manage support tickets',
};

export default function TicketsPage() {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tickets</h1>
          <p className="text-slate-500">Manage and track support requests across all projects.</p>
        </div>
        
        <RequirePermission permission="TICKET_CREATE">
          {/* Note: In a real app this would likely open a modal or link to a /tickets/new page */}
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            <Link href="/tickets/new">
              <Plus className="mr-2 h-4 w-4" />
              New Ticket
            </Link>
          </Button>
        </RequirePermission>
      </div>

      <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading tickets...</div>}>
        <TicketList />
      </Suspense>
    </div>
  );
}
