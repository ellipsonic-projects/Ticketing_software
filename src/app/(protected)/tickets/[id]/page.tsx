/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Metadata } from 'next';
import { TicketDetails } from '@/components/tickets/ticket-details';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Ticket Details | Elipsonics',
  description: 'View and manage support ticket',
};

// Next.js 15 requires async params access
export default async function TicketPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <Button variant="ghost" asChild className="w-fit -ml-4 text-slate-500 hover:text-slate-900">
          <Link href="/tickets">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Tickets
          </Link>
        </Button>
      </div>

      <TicketDetails id={params.id} />
    </div>
  );
}
