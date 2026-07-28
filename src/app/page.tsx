'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';

import { ROLE_DEFAULT_ROUTE } from '@/lib/auth';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        const route = ROLE_DEFAULT_ROUTE[user.role as keyof typeof ROLE_DEFAULT_ROUTE] || '/users';
        router.push(route);
      } else {
        router.push('/auth/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-transparent">
      <Loader2 className="text-primary h-8 w-8 animate-spin" />
    </div>
  );
}
