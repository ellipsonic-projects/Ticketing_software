'use client';

import { Building2, LayoutDashboard, Ticket } from 'lucide-react';

import { BaseSidebar } from '@/components/shared/base-sidebar';
import { useAuth } from '@/hooks/use-auth';

export interface EngineerSidebarProps {
  notificationCount?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/engineer', icon: LayoutDashboard },
  { label: 'All Tickets', href: '/engineer/tickets', icon: Ticket },
] as const;

export function EngineerSidebar({ isOpen, onClose }: EngineerSidebarProps) {
  const { user } = useAuth();

  const tenantName = user?.tenant?.name ? user.tenant.name.split(' ')[0] : 'Elipsonics';
  const fullTenantName = user?.tenant?.name ?? 'Workspace';

  return (
    <BaseSidebar
      isOpen={isOpen}
      onClose={onClose}
      themeColor="blue"
      logoTitle={tenantName}
      logoSubtitle="Engineer Portal"
      logoIcon={
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-600 bg-blue-50">
          <div className="h-6 w-6 rounded-full border-2 border-blue-600 bg-blue-600" />
        </div>
      }
      navItems={NAV_ITEMS}
      showHelpCard={true}
      footerTitle={fullTenantName}
      footerSubtitle="Engineer"
      footerIcon={
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <Building2 className="h-5 w-5 text-slate-600" />
        </div>
      }
    />
  );
}
