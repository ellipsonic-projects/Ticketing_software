'use client';

import { Building2, LayoutDashboard, PlusSquare, Shield } from 'lucide-react';

import { BaseSidebar } from '@/components/shared/base-sidebar';

export interface PlatformSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/platform/dashboard', icon: LayoutDashboard },
  { label: 'Create Tenants', href: '/platform/tenants', icon: Building2 },
] as const;

export function PlatformSidebar({ isOpen, onClose }: PlatformSidebarProps) {
  return (
    <BaseSidebar
      isOpen={isOpen}
      onClose={onClose}
      themeColor="violet"
      logoTitle="Elipsonics"
      logoSubtitle="Admin Console"
      logoIcon={
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-violet-600 bg-violet-50">
          <div className="h-6 w-6 rounded-full border-2 border-violet-600 bg-violet-600" />
        </div>
      }
      navItems={NAV_ITEMS}
      footerTitle="Elipsonics"
      footerSubtitle="Platform Admin"
      footerIcon={
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50">
          <Shield className="h-5 w-5 text-violet-600" />
        </div>
      }
    />
  );
}
