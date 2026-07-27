/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { Tenant, TenantStatus } from '@prisma/client';
import { Loader2, MoreHorizontal, Search, Settings, ShieldAlert, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { tenantApi } from '@/services/api/tenant-api';

export function TenantList() {
  const { accessToken } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTenants = async () => {
    if (!accessToken) return;
    try {
      setLoading(true);
      const res = await tenantApi.getTenants(
        { page, pageSize: 10, search } as unknown as any,
        accessToken,
      );
      setTenants(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch (err: unknown) {
      console.error('Failed to fetch tenants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchTenants(), 0);
    return () => clearTimeout(timer);
  }, [accessToken, page, search]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tenant?')) return;
    try {
      await tenantApi.deleteTenant(id, accessToken!);
      fetchTenants();
    } catch (err: unknown) {
      alert('Failed to delete tenant');
    }
  };

  const handleStatusChange = async (id: string, status: TenantStatus) => {
    try {
      await tenantApi.updateTenantStatus(id, status, accessToken!);
      fetchTenants();
    } catch (err: unknown) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search tenants..."
            className="h-10 border-slate-200 bg-slate-50 pl-9 focus:bg-white"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-500">
            <thead className="border-b border-slate-100 bg-slate-50/80 text-xs text-slate-700 uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Company Name</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Domain</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Created Date</th>
                <th className="px-6 py-4 text-right font-semibold tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-slate-400" />
                  </td>
                </tr>
              ) : tenants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No tenants found.
                  </td>
                </tr>
              ) : (
                tenants.map((tenant) => (
                  <tr
                    key={tenant.id}
                    className="border-b border-slate-50 bg-white transition-colors hover:bg-slate-50/50"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        {tenant.logoUrl ? (
                          <img
                            src={tenant.logoUrl}
                            alt={tenant.name}
                            className="h-8 w-8 rounded-md border border-slate-100 object-cover"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-indigo-100 bg-indigo-50 text-xs font-bold text-indigo-600">
                            {tenant.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div>{tenant.name}</div>
                          <div className="text-[11px] font-normal text-slate-400">
                            {tenant.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {tenant.domain ? (
                        <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
                          {tenant.domain}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No custom domain</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          tenant.status === 'ACTIVE'
                            ? 'default'
                            : tenant.status === 'SUSPENDED'
                              ? 'destructive'
                              : 'secondary'
                        }
                        className={
                          tenant.status === 'ACTIVE' ? 'bg-emerald-500 hover:bg-emerald-600' : ''
                        }
                      >
                        {tenant.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(tenant.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md p-0 text-sm font-medium transition-colors hover:bg-slate-100 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4 text-slate-500" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-lg">
                          <DropdownMenuLabel className="text-xs font-semibold text-slate-500">
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer">
                            <Link
                              href={`/platform/tenants/${tenant.id}`}
                              className="flex w-full items-center gap-2"
                            >
                              <Settings className="h-4 w-4 text-slate-400" /> Edit Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {tenant.status === 'ACTIVE' ? (
                            <DropdownMenuItem
                              className="flex cursor-pointer items-center gap-2 text-amber-600 focus:text-amber-700"
                              onClick={() => handleStatusChange(tenant.id, 'SUSPENDED')}
                            >
                              <ShieldAlert className="h-4 w-4" /> Suspend Tenant
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="flex cursor-pointer items-center gap-2 text-emerald-600 focus:text-emerald-700"
                              onClick={() => handleStatusChange(tenant.id, 'ACTIVE')}
                            >
                              <ShieldAlert className="h-4 w-4" /> Activate Tenant
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="flex cursor-pointer items-center gap-2 text-red-600 focus:bg-red-50 focus:text-red-700"
                            onClick={() => handleDelete(tenant.id)}
                          >
                            <Trash2 className="h-4 w-4" /> Delete Tenant
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="text-xs text-slate-500">
            Showing page <span className="font-semibold text-slate-700">{page}</span> of{' '}
            <span className="font-semibold text-slate-700">{totalPages || 1}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-8 border-slate-200 text-xs font-medium"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="h-8 border-slate-200 text-xs font-medium"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
