import { Metadata } from 'next';

import { UserList } from '@/components/users/user-list';

export const metadata: Metadata = {
  title: 'Users | Multi-Tenant Ticketing System',
  description: 'Manage users in your organization.',
};

export default function UsersPage() {
  return <UserList />;
}
