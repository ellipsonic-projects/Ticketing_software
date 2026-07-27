import { Metadata } from 'next';

import { CenteredAuthLayout } from '@/components/auth/centered-auth-layout';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export const metadata: Metadata = {
  title: 'Forgot Password | Ticketing System',
  description: 'Recover your account password',
};

export default function ForgotPasswordPage() {
  return (
    <CenteredAuthLayout>
      <ForgotPasswordForm />
    </CenteredAuthLayout>
  );
}
