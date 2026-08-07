'use client';

import {
  Building2,
  ChevronRight,
  FolderOpen,
  LayoutDashboard,
  User,
  ClipboardList,
} from 'lucide-react';

import { BaseSidebar } from '@/components/shared/base-sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useClient } from '@/hooks/use-clients';

export interface DashboardSidebarProps {
  notificationCount?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/client/dashboard', icon: LayoutDashboard },
  { label: 'My Projects', href: '/client/projects', icon: FolderOpen },
  { label: 'Profile', href: '/client/profile', icon: User },
  { label: 'Audit Logs', href: '/client/audit-logs', icon: ClipboardList },
] as const;

function ClientInfoFooter() {
  const { user } = useAuth();
  const { data: clientResponse, isLoading } = useClient(user?.clientId ?? '');
  const clientInfo = clientResponse?.client;

  if (isLoading && !clientInfo) {
    return (
      <div className="border-t border-slate-200 p-5">
        <div className="flex animate-pulse items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-3 w-32 rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!clientInfo) return null;

  return (
    <div className="border-t border-slate-200 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <Building2 className="h-5 w-5 text-slate-600" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="truncate font-medium text-slate-900">{clientInfo.name}</p>
          <p className="truncate text-xs text-slate-500">
            Member since{' '}
            {new Date(clientInfo.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
      </div>
    </div>
  );
}

export function DashboardSidebar({ notificationCount: _notificationCount, isOpen, onClose }: DashboardSidebarProps) {
  return (
    <BaseSidebar
      isOpen={isOpen}
      onClose={onClose}
      themeColor="blue"
      logoTitle="Elipdesk"
      logoSubtitle="Client Portal"
      logoIcon={
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-600">
          <div className="h-6 w-6 rounded-full border-2 border-blue-600" />
        </div>
      }
      navItems={NAV_ITEMS}
      customFooter={<ClientInfoFooter />}
    />
  );
}
