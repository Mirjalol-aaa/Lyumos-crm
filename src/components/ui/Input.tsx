import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'money' | 'phone';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, leftIcon, rightIcon, className = '', id, required, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold text-slate-700 dark:text-slate-200 tracking-tight"
          >
            {label} {required && <span className="text-rose-500 font-black">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 flex items-center justify-center text-slate-400 dark:text-slate-500">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            required={required}
            className={`h-10 w-full rounded-xl border bg-slate-50/60 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all duration-150 hover:bg-slate-100/60 focus:bg-white focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:bg-slate-900 dark:focus:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 ${
              leftIcon ? 'pl-9.5' : ''
            } ${rightIcon ? 'pr-9.5' : ''} ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15 dark:border-rose-600'
                : 'border-slate-200/90 focus:border-amber-500 focus:ring-amber-500/15 dark:border-slate-800 dark:focus:border-amber-500'
            } ${className}`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 flex items-center justify-center text-slate-400 dark:text-slate-500">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-[11px] font-semibold text-rose-500 tracking-tight">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-slate-400 dark:text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
