import { Suspense } from 'react';
import Link from 'next/link';

import { Download, Plus } from 'lucide-react';
import { Metadata } from 'next';

import { RequirePermission } from '@/components/auth/require-permission';
import { TicketList } from '@/components/tickets/ticket-list';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Tickets | Elipdesk',
  description: 'Manage support tickets',
};

export default function TicketsPage() {
  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Header */}
      <div className="flex flex-col items-start justify-between border-b border-transparent px-6 py-6 sm:flex-row sm:items-center lg:px-8">
        <div>
          <h1 className="mb-1 text-2xl font-bold tracking-tight text-slate-900">Tickets</h1>
          <p className="text-sm text-slate-500">View and manage tickets assigned to you.</p>
        </div>

        <div className="mt-4 flex items-center gap-3 sm:mt-0">
          <Button
            variant="outline"
            className="h-9 rounded-lg border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Download className="mr-2 h-4 w-4 text-slate-500" />
            Export
          </Button>

          <RequirePermission permission="TICKET_CREATE">
            <Link
              href="/engineer/tickets/new"
              className={cn(
                buttonVariants({ variant: 'default' }),
                'h-9 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700',
              )}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Ticket
            </Link>
          </RequirePermission>
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col">
        <Suspense
          fallback={<div className="p-8 text-center text-slate-500">Loading tickets...</div>}
        >
          <TicketList />
        </Suspense>
      </div>
    </div>
  );
}
