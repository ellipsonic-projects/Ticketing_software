import { Suspense } from 'react';

import { Loader2 } from 'lucide-react';
import { Metadata } from 'next';

import { CenteredAuthLayout } from '@/components/auth/centered-auth-layout';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export const metadata: Metadata = {
  title: 'Reset Password | Ticketing System',
  description: 'Create a new password for your account',
};

export default function ResetPasswordPage() {
  return (
    <CenteredAuthLayout>
      <Suspense fallback={<Loader2 className="text-primary h-8 w-8 animate-spin" />}>
        <ResetPasswordForm />
      </Suspense>
    </CenteredAuthLayout>
  );
}
