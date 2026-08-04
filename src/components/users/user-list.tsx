'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { MoreHorizontal, Search, Settings } from 'lucide-react';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/ui/status-badge';
import { userApi } from '@/services/api/user-api';
import { useUsers } from '@/hooks/use-users';
import { DataTableToolbar } from '@/components/shared/data-table/data-table-toolbar';
import { SearchInput } from '@/components/shared/data-table/search-input';
import { StatusFilter } from '@/components/shared/data-table/status-filter';
import { SortDropdown } from '@/components/shared/data-table/sort-dropdown';
import { Pagination } from '@/components/shared/data-table/pagination';
import { cn, getStringColorGradient, getStringColorHover } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export interface UserListProps {
  selectedUserId?: string | null;
  onSelectUser?: (id: string) => void;
}

export function UserList({ selectedUserId, onSelectUser }: UserListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '6', 10);
  
  const search = searchParams.get('search') || undefined;
  const status = (searchParams.get('status') as any) || undefined;
  const role = (searchParams.get('role') as any) || undefined;
  
  const sortParam = searchParams.get('sort') || 'createdAt:desc';
  const [sortField, sortOrder] = sortParam.split(':') as [any, any];

  const queryParams = new URLSearchParams(searchParams.toString());
  if (!queryParams.has('limit')) queryParams.set('limit', '6');
  
  const { data, isLoading } = useUsers({ 
    page, 
    pageSize: limit, 
    search, 
    status, 
    role,
    excludeRole: role ? undefined : 'CLIENT',
    sort: sortField, 
    sortOrder 
  });

  const users = data?.data || [];
  const totalUsers = data?.meta.total || 0;
  const totalPages = data?.meta.totalPages || 1;

  return (
    <div className="flex h-full flex-col">
      {/* Main Content Area */}
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white/70 shadow-sm backdrop-blur-xl">
        {/* Toolbar */}
        <div className="border-b border-slate-200/60 bg-white/40 p-4">
          <DataTableToolbar>
            <SearchInput placeholder="Search users by name or email..." />
            <StatusFilter
              paramName="role"
              placeholder="Role..."
              options={[
                { label: 'Platform Admin', value: 'PLATFORM_ADMIN' },
                { label: 'Tenant Admin', value: 'TENANT_ADMIN' },
                { label: 'Engineer', value: 'ENGINEER' },
              ]}
            />
            <StatusFilter
              paramName="status"
              options={[
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Inactive', value: 'INACTIVE' },
                { label: 'Invited', value: 'INVITED' },
                { label: 'Suspended', value: 'SUSPENDED' },
              ]}
            />
            <SortDropdown
              options={[
                { label: 'Recently Added', value: 'createdAt:desc' },
                { label: 'Oldest First', value: 'createdAt:asc' },
                { label: 'Name (A-Z)', value: 'firstName:asc' },
                { label: 'Name (Z-A)', value: 'firstName:desc' },
              ]}
            />
          </DataTableToolbar>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex h-[400px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Search className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">No users found</h3>
              <p className="mt-1 text-sm text-slate-500">
                {search || status || role
                  ? 'Try adjusting your filters.'
                  : 'Get started by creating a new user.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined</th>
                </tr>
              </thead>
              <motion.tbody 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="divide-y divide-slate-100/80"
              >
                {users.map((user) => (
                  <motion.tr
                    variants={rowVariants}
                    key={user.id}
                    onClick={() => onSelectUser?.(user.id)}
                    data-selected={selectedUserId === user.id}
                    className={cn(
                      'group transition-colors',
                      onSelectUser ? 'cursor-pointer' : '',
                      getStringColorHover(user.firstName)
                    )}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200/60 bg-gradient-to-br font-bold shadow-sm ring-1",
                          getStringColorGradient(user.firstName)
                        )}>
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className={cn("truncate font-medium transition-colors", selectedUserId === user.id ? "text-indigo-600" : "text-slate-900")}>
                            {user.firstName} {user.lastName}
                          </span>
                          <span className="truncate text-xs text-slate-500">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-700">
                        {user.role === 'PLATFORM_ADMIN'
                          ? 'Platform Admin'
                          : user.role === 'TENANT_ADMIN'
                            ? 'Tenant Admin'
                            : user.role === 'CLIENT'
                              ? 'Client'
                              : 'Engineer'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={user.status} variant="ring" />
                    </td>
                    <td className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        {!isLoading && (
          <div className="border-t border-slate-200/60 bg-white/40">
            <Pagination totalPages={totalPages} totalItems={totalUsers} />
          </div>
        )}
      </div>
    </div>
  );
}
