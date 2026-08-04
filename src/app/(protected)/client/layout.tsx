'use client';

import { useState } from 'react';

import { Loader2 } from 'lucide-react';

import { DashboardHeader } from '@/components/client-dashboard/dashboard-header';
import { DashboardSidebar } from '@/components/client-dashboard/dashboard-sidebar';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatRoleLabel(role: string): string {
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
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

function NotLinkedScreen() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
      <div className="rounded-3xl border border-slate-200 bg-white px-12 py-14 text-center shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Client account not configured</h2>
        <p className="mt-3 text-slate-500">Your account is not linked to any client.</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

interface ClientPortalLayoutProps {
  children: React.ReactNode;
}

export default function ClientPortalLayout({ children }: ClientPortalLayoutProps) {
  // Only CLIENT role may access this layout; unauthenticated or wrong-role → /auth/login
  const { user, isLoading } = useAuthRedirect(['CLIENT']);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading || !user) {
    return <LoadingScreen />;
  }

  // Authenticated CLIENT but not yet linked to a client account
  if (!user.clientId) {
    return <NotLinkedScreen />;
  }

  const roleLabel = user.role ? formatRoleLabel(user.role) : undefined;

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[#F8FAFC]">
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardHeader
          firstName={user.firstName ?? 'there'}
          roleLabel={roleLabel}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] px-4 pb-4 pt-0 sm:px-6 sm:pb-6 sm:pt-0 lg:px-8 lg:pb-8 lg:pt-0 xl:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
