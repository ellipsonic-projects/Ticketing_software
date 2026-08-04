import { Metadata } from 'next';

import { UserManager } from '@/components/users/user-manager';

export const metadata: Metadata = {
  title: 'Users | Multi-Tenant Ticketing System',
  description: 'Manage users in your organization.',
};

export default function UsersPage() {
  return <UserManager />;
}
