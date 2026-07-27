'use client';

import Link from 'next/link';

import { useAuth } from '@/contexts/auth-context';

import { ROLE_DEFAULT_ROUTE } from '@/lib/auth';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">Multi-Tenant Ticketing System</h1>
      <p className="text-muted-foreground mt-2">Enterprise Support Platform</p>
      <div className="mt-8">
        {user ? (
          <Link
            href={ROLE_DEFAULT_ROUTE[user.role as keyof typeof ROLE_DEFAULT_ROUTE] || '/'}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-4 py-2"
          >
            Go to Dashboard
          </Link>
        ) : (
          <Link
            href="/auth/login"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-4 py-2"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
