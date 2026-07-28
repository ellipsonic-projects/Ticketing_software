import { Metadata } from 'next';

import { UserDetails } from '@/components/users/user-details';

export const metadata: Metadata = {
  title: 'User Details | Multi-Tenant Ticketing System',
  description: 'Manage user details, roles, and status.',
};

export default async function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <UserDetails id={id} />;
}
