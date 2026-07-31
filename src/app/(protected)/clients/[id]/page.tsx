import { Metadata } from 'next';

import { ClientDetails } from '@/components/clients/client-details';

export const metadata: Metadata = {
  title: 'Client Details | Multi-Tenant Ticketing System',
  description: 'View and edit client information',
};

// Use an async layout wrapper to properly unwrap params in Next.js 15
export default async function ClientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <ClientDetails id={id} />
    </div>
  );
}
