'use client';

import { Loader2 } from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';
import { DashboardSidebar } from '@/components/client-dashboard/dashboard-sidebar';
import { DashboardHeader } from '@/components/client-dashboard/dashboard-header';

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
        <h2 className="text-2xl font-semibold text-slate-900">
          Client account not configured
        </h2>
        <p className="mt-3 text-slate-500">
          Your account is not linked to any client.
        </p>
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
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user?.clientId) {
    return <NotLinkedScreen />;
  }

  const roleLabel = user.role ? formatRoleLabel(user.role) : undefined;

  return (
    <div className="flex flex-1 overflow-hidden bg-[#F8FAFC]">
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardHeader
          firstName={user.firstName ?? 'there'}
          roleLabel={roleLabel}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] px-8 py-8 xl:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
