import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'gold'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'indigo';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center tracking-tight transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900';

  const sizeStyles: Record<ButtonSize, string> = {
    xs: 'px-2.5 py-1 text-[11px] font-bold gap-1.5 h-7.5 rounded-lg',
    sm: 'px-3.5 py-1.5 text-xs font-bold gap-1.5 h-8.5 rounded-xl',
    md: 'px-4.5 py-2 text-xs font-extrabold gap-2 h-10 rounded-xl',
    lg: 'px-6 py-2.5 text-sm font-black gap-2.5 h-11.5 rounded-2xl',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/20 border border-amber-400/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-amber-500',
    gold:
      'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:brightness-105 text-slate-950 font-black shadow-lg shadow-amber-500/25 border border-amber-300/60 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-amber-400',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-800 dark:bg-slate-800/90 dark:hover:bg-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-slate-400',
    outline:
      'bg-transparent hover:bg-amber-500/5 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-amber-500/40 dark:hover:border-amber-500/40 focus-visible:ring-amber-500 active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/70 text-slate-600 dark:text-slate-300 focus-visible:ring-slate-400 active:scale-[0.98]',
    danger:
      'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white shadow-md shadow-rose-500/20 border border-rose-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-rose-500',
    success:
      'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-md shadow-emerald-500/20 border border-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-emerald-500',
    indigo:
      'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-md shadow-indigo-500/20 border border-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-indigo-500',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />}
      {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span className="truncate">{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
