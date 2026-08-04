'use client';

import {
  Building2,
  FolderOpen,
  LayoutDashboard,
  Settings2,
  Ticket,
  UserCog,
  Users,
  ClipboardList,
} from 'lucide-react';

import { BaseSidebar } from '@/components/shared/base-sidebar';
import { useAuth } from '@/hooks/use-auth';

export interface TenantSidebarProps {
  notificationCount?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Clients', href: '/clients', icon: Users },
  { label: 'Projects', href: '/projects', icon: FolderOpen },
  { label: 'Tickets', href: '/tickets', icon: Ticket },
  { label: 'Engineers', href: '/users', icon: UserCog },
  { label: 'SLA Policies', href: '/sla', icon: Settings2 },
  { label: 'Audit Logs', href: '/audit-logs', icon: ClipboardList },
];

export function TenantSidebar({ notificationCount, isOpen, onClose }: TenantSidebarProps) {
  const { user } = useAuth();

  const tenantName = user?.tenant?.name ? user.tenant.name.split(' ')[0] : 'Elipdesk';
  const fullTenantName = user?.tenant?.name ?? 'Workspace';

  // Inject dynamic badge for notification count into NavItems if required in the future,
  // currently only using for the general nav links.

  return (
    <BaseSidebar
      isOpen={isOpen}
      onClose={onClose}
      themeColor="blue"
      logoTitle={tenantName}
      logoSubtitle="Service Desk"
      logoIcon={
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-600 bg-blue-50">
          <div className="h-6 w-6 rounded-full border-2 border-blue-600 bg-blue-600" />
        </div>
      }
      navItems={NAV_ITEMS}
      footerTitle={fullTenantName}
      footerSubtitle="Tenant Admin"
      footerIcon={
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <Building2 className="h-5 w-5 text-slate-600" />
        </div>
      }
    />
  );
}
