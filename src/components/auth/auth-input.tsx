import { forwardRef, ReactNode } from 'react';

import { AlertCircle } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  error?: string;
  rightElement?: ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, icon, error, rightElement, className, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-2.5">
        <Label htmlFor={id} className="text-[14px] font-semibold text-slate-700">
          {label}
        </Label>
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute top-1/2 left-5 flex -translate-y-1/2 items-center justify-center text-slate-400">
              {icon}
            </div>
          )}
          <Input
            id={id}
            ref={ref}
            className={`h-[58px] rounded-[14px] border-0 bg-slate-50/50 text-[15px] transition-all duration-300 ${icon ? 'pl-[52px]' : 'pl-5'} ${rightElement ? 'pr-14' : 'pr-5'} shadow-[inset_0_2px_4px_rgba(0,0,0,0.04),0_1px_0_rgba(255,255,255,1),0_0_0_1px_rgba(148,163,184,0.15)] ${
              error
                ? 'focus-visible:shadow-[inset_0_2px_4px_rgba(0,0,0,0.04),0_0_0_2px_rgba(239,68,68,1)]'
                : 'hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.04),0_1px_0_rgba(255,255,255,1),0_0_0_1px_rgba(99,102,241,0.4)] focus-visible:bg-white focus-visible:shadow-[inset_0_2px_4px_rgba(0,0,0,0.02),0_0_0_2px_rgba(99,102,241,1),0_0_15px_rgba(99,102,241,0.25)]'
            } text-slate-800 placeholder:text-slate-400/80 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''} `}
            {...props}
          />
          {rightElement && (
            <div className="absolute top-1/2 right-5 flex -translate-y-1/2 items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="animate-in fade-in slide-in-from-top-1 mt-1.5 ml-1 flex items-center gap-1.5 text-[13px] text-red-600 duration-200">
            <AlertCircle className="h-3.5 w-3.5" />
            {error}
          </p>
        )}
      </div>
    );
  },
);
AuthInput.displayName = 'AuthInput';
