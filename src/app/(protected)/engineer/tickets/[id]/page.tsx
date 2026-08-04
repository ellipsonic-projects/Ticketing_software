/* eslint-disable */

// @ts-nocheck
import Link from 'next/link';

import { ChevronLeft } from 'lucide-react';
import { Metadata } from 'next';

import { TicketDetails } from '@/components/tickets/ticket-details';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Ticket Details | Elipdesk',
  description: 'View and manage support ticket',
};

// Next.js 15 requires async params access
export default async function TicketPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6 lg:p-8">
      <div className="flex flex-col gap-2">
        <Link
          href="/engineer/tickets"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            '-ml-4 w-fit text-slate-500 hover:text-slate-900',
          )}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Tickets
        </Link>
      </div>

      <TicketDetails id={params.id} />
    </div>
  );
}
