import { ReactNode } from 'react';

import { Zap } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <Card
      className="login-card relative w-full max-w-[540px] overflow-hidden rounded-[28px] border-0 p-10"
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        boxShadow: [
          // Top/Left bright edge, Bottom dark edge
          'inset 1px 1px 2px rgba(255,255,255,1)',
          'inset -1px -1px 3px rgba(0,0,0,0.03)',
          '0 0 0 1px rgba(255,255,255,0.8)',
          // 3D Shadows
          '0 4px 6px -1px rgba(0,0,0,0.04)',
          '0 12px 24px -4px rgba(99,102,241,0.08)',
          '0 32px 64px -12px rgba(99,102,241,0.12)',
          '0 80px 120px -24px rgba(139,92,246,0.10)',
        ].join(', '),
      }}
    >
      <CardHeader
        className="relative z-10 space-y-5 px-0 pt-0 pb-8 text-center"
        style={{ transform: 'translateZ(10px)' }}
      >
        {/* Logo — stronger, more distinctive identity */}
        <div className="mb-3 flex items-center justify-center gap-3">
          <div className="relative">
            {/* Outer ring for presence */}
            <div className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 shadow-[0_8px_24px_-4px_rgba(99,102,241,0.55)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_32px_-4px_rgba(99,102,241,0.65)]">
              <Zap className="h-6 w-6 text-white" strokeWidth={2.5} fill="currentColor" />
            </div>
            {/* Pulse ring */}
            <div className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-blue-500/20 blur-md" />
          </div>
          <span
            className="text-[26px] font-extrabold tracking-tight"
            style={{
              fontFamily: 'var(--font-manrope), Manrope, system-ui, sans-serif',
              background: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 50%, #1d4ed8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Elipdesk
          </span>
        </div>

        <div className="space-y-3">
          <CardTitle
            className="leading-tight font-extrabold tracking-tight text-slate-900"
            style={{
              fontSize: '2.6rem',
              fontFamily: 'var(--font-manrope), Manrope, system-ui, sans-serif',
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="mx-auto max-w-md px-2 text-[16px] leading-[26px] text-slate-500">
              {description}
            </CardDescription>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10 px-0 pb-0" style={{ transform: 'translateZ(10px)' }}>
        {children}
      </CardContent>

      {footer && (
        <CardFooter
          className="relative z-10 mt-8 flex flex-col space-y-4 border-t border-slate-100/60 px-0 pt-8 pb-0"
          style={{ transform: 'translateZ(10px)' }}
        >
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}
