'use client';

import { useRouter } from 'next/navigation';
import { Mail, UserCircle, Shield, Calendar, Clock, X, Building2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { useUser } from '@/hooks/use-users';

interface UserSidePanelProps {
  userId: string;
  onClose: () => void;
}

export function UserSidePanel({ userId, onClose }: UserSidePanelProps) {
  const router = useRouter();
  const { data: userWrapper, isLoading } = useUser(userId);
  const user = userWrapper?.data;

  if (isLoading || !user) {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white/70 shadow-sm backdrop-blur-xl p-6">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 animate-pulse rounded-md bg-slate-200" />
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4 text-slate-500" />
          </Button>
        </div>
        <div className="mt-8 flex flex-col items-center">
          <div className="h-20 w-20 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-4 h-6 w-32 animate-pulse rounded-md bg-slate-200" />
          <div className="mt-2 h-4 w-24 animate-pulse rounded-md bg-slate-200" />
        </div>
      </div>
    );
  }

  const roleLabel =
    user.role === 'PLATFORM_ADMIN'
      ? 'Platform Admin'
      : user.role === 'TENANT_ADMIN'
        ? 'Tenant Admin'
        : user.role === 'CLIENT'
          ? 'Client'
          : 'Engineer';

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden rounded-2xl border border-slate-200/60 bg-white/70 shadow-sm backdrop-blur-xl">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200/60 bg-white/40 px-6 py-4 backdrop-blur-md">
        <h2 className="text-[15px] font-semibold text-slate-900">User Details</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs font-semibold" 
            onClick={() => router.push(`/users/${userId}`)}
          >
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Profile Section */}
        <div className="flex flex-col items-center justify-center pb-8 border-b border-slate-100">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-3xl font-bold text-indigo-600">
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            {user.firstName} {user.lastName}
          </h3>
          <p className="mt-1 text-sm text-slate-500">{user.email}</p>
          <div className="mt-4">
            <StatusBadge status={user.status} variant="ring" />
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-8 space-y-6">
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              System Information
            </h4>
            <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-4 w-4 text-slate-400" />
                <span className="text-slate-500">Role:</span>
                <span className="font-medium text-slate-900">{roleLabel}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-slate-500">Email:</span>
                <span className="font-medium text-slate-900 truncate">{user.email}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Activity
            </h4>
            <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-slate-500">Joined:</span>
                <span className="font-medium text-slate-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-slate-500">Last Updated:</span>
                <span className="font-medium text-slate-900">
                  {new Date(user.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
