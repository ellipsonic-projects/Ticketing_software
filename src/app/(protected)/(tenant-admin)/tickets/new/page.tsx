/* eslint-disable */

// @ts-nocheck
import Link from 'next/link';

import { ChevronLeft } from 'lucide-react';
import { Metadata } from 'next';

import { CreateTicketForm } from '@/components/tickets/create-ticket-form';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'New Ticket | Elipdesk',
  description: 'Create a new support ticket',
};

export default function NewTicketPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6 lg:p-8">
      <div className="flex flex-col gap-2">
        <Link
          href="/tickets"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            '-ml-4 w-fit text-slate-500 hover:text-slate-900',
          )}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Tickets
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create New Ticket</h1>
        <p className="text-slate-500">
          Submit a new support request. Please provide as much detail as possible.
        </p>
      </div>

      <CreateTicketForm />
    </div>
  );
}
