'use client';

import { useState } from 'react';

import { Role } from '@prisma/client';
import { Loader2 } from 'lucide-react';

import { TenantHeader } from '@/components/tenant-admin/tenant-header';
import { TenantSidebar } from '@/components/tenant-admin/tenant-sidebar';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatRoleLabel(role: string): string {
  // Convert roles like TENANT_ADMIN to "Tenant Admin"
  return role
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// ---------------------------------------------------------------------------
// States
// ---------------------------------------------------------------------------

function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    </div>
  );
}

// Redirecting is handled inside useAuthRedirect — no static error screen needed.

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

interface TenantAdminLayoutProps {
  children: React.ReactNode;
}

export default function TenantAdminLayout({ children }: TenantAdminLayoutProps) {
  const { user, isLoading } = useAuthRedirect([Role.TENANT_ADMIN, Role.ENGINEER]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Wait for auth to resolve (redirect fires inside the hook if needed)
  if (isLoading || !user) {
    return <LoadingScreen />;
  }

  const roleLabel = user.role ? formatRoleLabel(user.role) : undefined;

  // You might want to fetch this via a hook in a real app, e.g., useTenantStats()
  const notificationCount = 0;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8FAFC]">
      <TenantSidebar
        notificationCount={notificationCount}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TenantHeader
          firstName={user.firstName ?? 'there'}
          roleLabel={roleLabel}
          notificationCount={notificationCount}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 xl:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
