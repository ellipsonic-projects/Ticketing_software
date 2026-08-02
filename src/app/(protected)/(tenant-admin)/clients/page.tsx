import { Metadata } from 'next';

import { ClientManager } from '@/components/clients/client-manager';

export const metadata: Metadata = {
  title: 'Clients | Multi-Tenant Ticketing System',
  description: 'Manage your clients',
};

export default function ClientsPage() {
  return <ClientManager />;
}
