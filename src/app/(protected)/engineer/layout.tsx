'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Loader2 } from 'lucide-react';

import { EngineerHeader } from '@/components/engineer/engineer-header';
import { EngineerSidebar } from '@/components/engineer/engineer-sidebar';
import { useAuth } from '@/hooks/use-auth';

export default function EngineerLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (
      !isLoading &&
      user &&
      user.role !== 'ENGINEER' &&
      user.role !== 'TENANT_ADMIN' &&
      user.role !== 'PLATFORM_ADMIN'
    ) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-900">
      <EngineerSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <EngineerHeader firstName={user.firstName} avatarUrl={undefined} roleLabel="Engineer" />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
