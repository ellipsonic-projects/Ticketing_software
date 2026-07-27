'use client';

import { forwardRef, useState } from 'react';

import { Eye, EyeOff, Lock } from 'lucide-react';

import { AuthInput } from './auth-input';

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  showIcon?: boolean;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, className, showIcon = true, ...props }, ref) => {
    const [show, setShow] = useState(false);

    return (
      <AuthInput
        label={label}
        error={error}
        type={show ? 'text' : 'password'}
        icon={showIcon ? <Lock className="h-[18px] w-[18px]" /> : undefined}
        ref={ref}
        className={className}
        rightElement={
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-700 focus:text-indigo-600 focus:outline-none"
            onClick={() => setShow(!show)}
            tabIndex={-1}
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? (
              <EyeOff className="h-[18px] w-[18px]" aria-hidden="true" />
            ) : (
              <Eye className="h-[18px] w-[18px]" aria-hidden="true" />
            )}
          </button>
        }
        {...props}
      />
    );
  },
);
PasswordField.displayName = 'PasswordField';
