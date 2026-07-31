import { Metadata } from 'next';
import { ClientDashboard } from '@/components/client-dashboard';

export const metadata: Metadata = {
  title: 'Dashboard | Client Portal',
  description: 'View your support tickets, SLA performance, and project health at a glance.',
};

export default function ClientDashboardPage() {
  return <ClientDashboard />;
}
