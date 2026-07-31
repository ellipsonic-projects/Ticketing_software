import { Metadata } from 'next';

import { ClientList } from '@/components/clients/client-list';

export const metadata: Metadata = {
  title: 'Clients | Multi-Tenant Ticketing System',
  description: 'Manage your clients',
};

export default function ClientsPage() {
  return <ClientList />;
}
