/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Metadata } from 'next';
import { CreateTicketForm } from '@/components/tickets/create-ticket-form';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'New Ticket | Elipsonics',
  description: 'Create a new support ticket',
};

export default function NewTicketPage() {
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-4xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <Button variant="ghost" asChild className="w-fit -ml-4 text-slate-500 hover:text-slate-900">
          <Link href="/tickets">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Tickets
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create New Ticket</h1>
        <p className="text-slate-500">Submit a new support request. Please provide as much detail as possible.</p>
      </div>

      <CreateTicketForm />
    </div>
  );
}
