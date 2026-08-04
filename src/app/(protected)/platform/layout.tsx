'use client';

import { useState } from 'react';

import { Role } from '@prisma/client';
import { Loader2 } from 'lucide-react';

import { PlatformHeader } from '@/components/platform-admin/platform-header';
import { PlatformSidebar } from '@/components/platform-admin/platform-sidebar';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';

// ---------------------------------------------------------------------------
// Loading state
// ---------------------------------------------------------------------------

function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export default function PlatformAdminLayout({ children }: { readonly children: React.ReactNode }) {
  const { user, isLoading } = useAuthRedirect([Role.PLATFORM_ADMIN]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading || !user) return <LoadingScreen />;

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[#F8FAFC] font-sans text-slate-900">
      <PlatformSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <PlatformHeader
          firstName={user.firstName ?? 'Admin'}
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
