'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { User } from '@prisma/client';
import { ChevronLeft, ChevronRight, MoreHorizontal, Search, Settings } from 'lucide-react';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { userApi } from '@/services/api/user-api';

import { CreateUserDialog } from './create-user-dialog';

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModifying, setIsModifying] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await userApi.getUsers({
        page,
        pageSize: 10,
        search,
      });
      setUsers(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (_err: unknown) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const updateStatus = async (id: string, currentStatus: string) => {
    if (isModifying) return;
    setIsModifying(true);
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await userApi.updateUserStatus(id, newStatus);
      toast.success(`User ${newStatus.toLowerCase()} successfully`);
      fetchUsers();
    } catch (_err: unknown) {
      toast.error('Failed to update status');
    } finally {
      setIsModifying(false);
    }
  };

  return (
    <div className="flex h-full flex-col p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Users</h1>
          <p className="text-sm text-slate-500">Manage your organization&apos;s users and roles.</p>
        </div>
        <CreateUserDialog onSuccess={fetchUsers} />
      </div>

      {/* Main Content Area */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/50 p-4">
          <div className="relative w-72">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-9 w-full bg-white pl-9 text-sm focus-visible:ring-1 focus-visible:ring-indigo-500"
            />
          </div>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <Search className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">No users found</h3>
              <p className="mt-1 text-sm text-slate-500">
                {search
                  ? 'Try adjusting your search terms.'
                  : 'Get started by creating a new user.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 text-xs font-semibold text-slate-500 backdrop-blur">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="w-[50px] px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="group transition-colors duration-150 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 font-bold text-slate-600">
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="truncate font-medium text-slate-900">
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
                            : 'Engineer'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={user.status} variant="ring" />
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-slate-200 hover:text-slate-600 data-[state=open]:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px] rounded-xl">
                          <DropdownMenuLabel className="text-xs text-slate-500">
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => (window.location.href = `/users/${user.id}`)}
                            className="cursor-pointer"
                          >
                            <Settings className="mr-2 h-4 w-4" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => updateStatus(user.id, user.status)}
                            disabled={isModifying}
                            className={`cursor-pointer ${
                              user.status === 'ACTIVE'
                                ? 'text-orange-600 focus:text-orange-600'
                                : 'text-emerald-600 focus:text-emerald-600'
                            }`}
                          >
                            {user.status === 'ACTIVE' ? 'Deactivate User' : 'Activate User'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-6 py-4">
            <span className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-8 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                <ChevronLeft className="mr-1 h-4 w-4" /> Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-8 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
