'use client';

import { useState } from 'react';

import { Role } from '@prisma/client';
import { Loader2 } from 'lucide-react';

import { EngineerHeader } from '@/components/engineer/engineer-header';
import { EngineerSidebar } from '@/components/engineer/engineer-sidebar';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';

export default function EngineerLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthRedirect([Role.ENGINEER]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-slate-50 font-sans text-slate-900">
      <EngineerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <EngineerHeader
          firstName={user.firstName}
          avatarUrl={undefined}
          roleLabel="Engineer"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto px-4 pt-0 pb-4 sm:px-6 sm:pt-0 sm:pb-6 lg:px-8 lg:pt-0 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
