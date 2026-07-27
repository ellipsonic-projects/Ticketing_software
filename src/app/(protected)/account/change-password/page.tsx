import { Metadata } from 'next';

import { ChangePasswordForm } from '@/components/auth/change-password-form';

export const metadata: Metadata = {
  title: 'Change Password | Account Settings',
  description: 'Update your account password',
};

export default function ChangePasswordPage() {
  // In a real app we'd get the token from the cookie or context,
  // but the auth-api client auto-injects it from context or we pass it via a client component.
  // Actually, our API client uses the token we pass it.
  // I will refactor ChangePasswordForm to use `useAuth` token, or we rely on the HttpOnly cookie.
  // Wait, the API uses HttpOnly cookie for refresh, but Bearer token for access.
  // The ChangePasswordForm needs the access token.
  // We can wrap it in a client component that provides the token, or just fetch it in the form via context.

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Settings</h1>
        <p className="text-muted-foreground">
          Manage your account security and authentication methods.
        </p>
      </div>

      {/* Change Password Form will pull token from Context */}
      <ChangePasswordForm />
    </div>
  );
}
