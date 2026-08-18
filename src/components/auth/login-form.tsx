'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowRight, Mail, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';
import { ROLE_DEFAULT_ROUTE } from '@/lib/auth/constants';

import { AuthButton } from './auth-button';
import { AuthCard } from './auth-card';
import { AuthInput } from './auth-input';
import { OAuthButton } from './oauth-button';
import { PasswordField } from './password-field';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Feature flag placeholder
const features = {
  oauth: false,
};

export function LoginForm() {
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError('');

    try {
      const user = await login({ email: data.email, password: data.password });
      const redirectTo =
        searchParams.get('redirect') ||
        ROLE_DEFAULT_ROUTE[user.role as keyof typeof ROLE_DEFAULT_ROUTE] ||
        '/dashboard';
      window.location.assign(redirectTo);
    } catch (err: unknown) {
      setError(
        (err instanceof Error ? err.message : 'An error occurred') ||
          'An error occurred during login',
      );
    }
  };

  return (
    <AuthCard
      title="Welcome Back"
      description="Sign in to manage your support operations and collaborate with your team."
      footer={
        <div className="login-footer w-full space-y-5 pt-4">
          {/* Trust indicators — pulsing badges */}
          <div className="flex items-center justify-center gap-6 text-sm">
            {/* SOC 2 badge with pulse */}
            <div className="relative flex items-center gap-2">
              <div className="relative">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span
                  className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30"
                  style={{ animationDuration: '2.4s' }}
                />
              </div>
              <span className="text-[13px] font-semibold text-slate-600">SOC 2 Certified</span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            {/* Uptime badge with pulse */}
            <div className="relative flex items-center gap-2">
              <div className="relative">
                <Shield className="h-4 w-4 text-blue-600" />
                <span
                  className="absolute inset-0 animate-ping rounded-full bg-blue-400/30"
                  style={{ animationDuration: '3s', animationDelay: '0.8s' }}
                />
              </div>
              <span className="text-[13px] font-semibold text-slate-600">99.99% Uptime</span>
            </div>
          </div>

          {/* Footer links */}
          <div className="flex w-full flex-col items-center gap-4">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <div className="flex items-center justify-center gap-4 text-[14px] text-slate-500">
              <Link
                href="/privacy"
                className="font-medium transition-colors duration-200 hover:text-slate-800"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="font-medium transition-colors duration-200 hover:text-slate-800"
              >
                Terms
              </Link>
              <Link
                href="/help"
                className="font-medium transition-colors duration-200 hover:text-slate-800"
              >
                Help
              </Link>
            </div>
            <p className="text-[12px] text-slate-400">© 2026 Elipdesk. All rights reserved.</p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="login-form space-y-5">
        {error && (
          <Alert
            variant="destructive"
            className="animate-in fade-in slide-in-from-top-1 border-red-200 bg-red-50 text-red-800 duration-300"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2 font-medium">{error}</AlertDescription>
          </Alert>
        )}

        <AuthInput
          id="email"
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          icon={<Mail className="h-[18px] w-[18px]" />}
          error={errors.email?.message}
          disabled={isSubmitting}
          {...register('email')}
        />

        <PasswordField
          id="password"
          label="Password"
          placeholder="Enter your password"
          error={errors.password?.message}
          disabled={isSubmitting}
          {...register('password')}
        />

        {/* Forgot Password link */}
        <div className="flex items-center justify-end pt-1">
          <Link
            href="/auth/forgot-password"
            className="text-[14px] font-semibold text-indigo-600 decoration-2 underline-offset-2 transition-all duration-200 hover:text-indigo-700 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <AuthButton type="submit" id="sign-in-btn" className="mt-7" isLoading={isSubmitting}>
          Sign In
          {!isSubmitting && (
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
          )}
        </AuthButton>
      </form>

      {features.oauth && (
        <div className="mt-8 space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 font-medium text-slate-500">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <OAuthButton
              provider="Google"
              disabled={isSubmitting}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              }
            />
            <OAuthButton
              provider="Microsoft"
              disabled={isSubmitting}
              icon={
                <svg width="18" height="18" viewBox="0 0 21 21">
                  <path fill="#f25022" d="M1 1h9v9H1z" />
                  <path fill="#00a4ef" d="M1 11h9v9H1z" />
                  <path fill="#7fba00" d="M11 1h9v9h-9z" />
                  <path fill="#ffb900" d="M11 11h9v9h-9z" />
                </svg>
              }
            />
          </div>
        </div>
      )}
    </AuthCard>
  );
}
