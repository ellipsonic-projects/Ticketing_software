import { ReactNode } from 'react';

import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: ReactNode;
}

export function AuthButton({ isLoading, children, className, ...props }: AuthButtonProps) {
  return (
    <Button
      className={`group relative h-[56px] w-full overflow-hidden rounded-[12px] bg-blue-600 text-[15px] font-semibold text-white shadow-md transition-all duration-200 hover:bg-blue-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 ${className || ''}`}
      disabled={props.disabled || isLoading}
      {...props}
    >
      {/* Inner highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-transparent to-white/10" />

      <span className="relative flex items-center justify-center gap-2">
        {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
        {children}
      </span>
    </Button>
  );
}
