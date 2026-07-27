'use client';

import Link from 'next/link';

import { Clock } from 'lucide-react';

import { AuthCard } from '@/components/auth/auth-card';
import { CenteredAuthLayout } from '@/components/auth/centered-auth-layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function SessionExpiredPage() {
  return (
    <CenteredAuthLayout>
      <AuthCard title="Session Expired">
        <Alert variant="destructive" className="bg-destructive/10">
          <Clock className="h-4 w-4" />
          <AlertTitle>Timeout</AlertTitle>
          <AlertDescription>
            Your session has expired due to inactivity or a security policy. Please sign in again to
            continue.
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Button className="w-full" onClick={() => (window.location.href = '/auth/login')}>
            Return to Sign In
          </Button>
        </div>
      </AuthCard>
    </CenteredAuthLayout>
  );
}
