'use client';

import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';

interface OAuthButtonProps {
  provider: 'Google' | 'Microsoft';
  icon: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function OAuthButton({ provider, icon, onClick, disabled }: OAuthButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className="flex h-11 w-full items-center justify-center gap-2 border-slate-200 transition-all hover:scale-[1.02] hover:bg-slate-50"
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      <span className="text-sm font-medium text-slate-700">{provider}</span>
    </Button>
  );
}
