import { Metadata } from 'next';

import { PlatformDashboard } from '@/components/platform-admin/platform-dashboard';

export const metadata: Metadata = {
  title: 'Dashboard | Platform Admin',
  description: 'Overview of all tenants and platform metrics',
};

export default function PlatformDashboardPage() {
  return <PlatformDashboard />;
}
