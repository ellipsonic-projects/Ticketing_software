'use client';

import { useState } from 'react';
import Link from 'next/link';

import { ChevronLeft, ChevronRight, Eye, Loader2, MoreHorizontal, Pencil, Search, Trash2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { useClients, useDeleteClient, useUpdateClient } from '@/hooks/use-clients';
import { useCan } from '@/hooks/use-can';

import { OnboardClientWizard } from './onboard-client-wizard';

import { DataTableToolbar } from '@/components/shared/data-table/data-table-toolbar';
import { SearchInput } from '@/components/shared/data-table/search-input';
import { StatusFilter } from '@/components/shared/data-table/status-filter';
import { SortDropdown } from '@/components/shared/data-table/sort-dropdown';
import { Pagination } from '@/components/shared/data-table/pagination';
import { EmptyState } from '@/components/shared/data-table/empty-state';

export function ClientList() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const search = searchParams.get('search') || undefined;
  const status = searchParams.get('status') as any || undefined;
  const sort = searchParams.get('sort') as any || 'createdAt';
  const order = searchParams.get('order') as any || 'desc';

  const { data, isLoading } = useClients({ page, limit, search, status, sort, order });
  const { mutateAsync: deleteClient, isPending: isDeleting } = useDeleteClient();
  const { mutateAsync: updateClient, isPending: isUpdating } = useUpdateClient();
  const canCreateClient = useCan('CLIENT_CREATE');
  const canDeleteClient = useCan('CLIENT_DELETE');
  const canUpdateClient = useCan('CLIENT_UPDATE');

  const [clientToDelete, setClientToDelete] = useState<{ id: string; name: string } | null>(null);

  const confirmDelete = async () => {
    if (!clientToDelete) return;
    try {
      await deleteClient(clientToDelete.id);
      toast.success('Client archived successfully');
      setClientToDelete(null);
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to archive client');
    }
  };

  const clients = data?.data || [];
  const totalClients = data?.total || 0;
  const totalPages = data?.pages || 1;

  return (
    <div className="flex h-full flex-col p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Clients</h1>
          <p className="text-sm text-slate-500">Manage your organization&apos;s clients and their details.</p>
        </div>
        {canCreateClient && <OnboardClientWizard />}
      </div>

      {/* Main Content Area */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Toolbar */}
        <div className="border-b border-slate-200 bg-slate-50/50 px-4">
          <DataTableToolbar>
            <SearchInput placeholder="Search clients..." />
            <StatusFilter
              paramName="status"
              options={[
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Archived', value: 'ARCHIVED' },
              ]}
            />
            <SortDropdown
              options={[
                { label: 'Recently Created', value: 'createdAt:desc' },
                { label: 'Oldest', value: 'createdAt:asc' },
                { label: 'Recently Updated', value: 'updatedAt:desc' },
                { label: 'Name (A-Z)', value: 'name:asc' },
                { label: 'Name (Z-A)', value: 'name:desc' },
              ]}
            />
          </DataTableToolbar>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            </div>
          ) : clients.length === 0 ? (
            <div className="p-8">
              <EmptyState 
                title="No clients found" 
                description={search ? 'Try adjusting your search or filters.' : 'Get started by creating a new client.'} 
              />
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 text-xs font-semibold text-slate-500 backdrop-blur">
                <tr>
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="w-[50px] px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className="group transition-colors duration-150 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 font-bold text-slate-600">
                          {client.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="truncate font-medium text-slate-900">
                            {client.name}
                          </span>
                          {client.code && (
                            <span className="truncate text-xs text-slate-500">{client.code}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {client.email ? (
                        <span className="font-medium text-slate-700">{client.email}</span>
                      ) : (
                        <span className="text-xs italic text-slate-400">No email</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={client.status} variant="ring" />
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(client.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 opacity-0 transition-all hover:bg-slate-200 hover:text-slate-600 group-hover:opacity-100 data-[state=open]:opacity-100">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px] rounded-xl">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel className="text-xs text-slate-500">
                              Actions
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => (window.location.href = `/clients/${client.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4 text-slate-400" /> View Details
                            </DropdownMenuItem>
                            {canUpdateClient && (
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => (window.location.href = `/clients/${client.id}?tab=edit`)}
                              >
                                <Pencil className="mr-2 h-4 w-4 text-slate-400" /> Edit Client
                              </DropdownMenuItem>
                            )}
                            {canDeleteClient && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"
                                  onClick={() =>
                                    setClientToDelete({ id: client.id, name: client.name })
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Archive Client
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuGroup>
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
        {!isLoading && (
          <div className="border-t border-slate-200 bg-slate-50/50">
            <Pagination totalPages={totalPages} totalItems={totalClients} />
          </div>
        )}
      </div>

      {/* Confirmation Dialogs */}
      <AlertDialog
        open={!!clientToDelete}
        onOpenChange={(open) => !open && !isDeleting && setClientToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will archive the client {clientToDelete?.name}. You can&apos;t undo this action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
