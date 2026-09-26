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
      'bg-[#5A0B1C] hover:bg-[#450815] text-white shadow-xs border border-[#480816] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#5A0B1C]/40',
    gold:
      'bg-gradient-to-r from-[#D9A62E] to-[#C49220] hover:brightness-105 text-white font-black shadow-md shadow-amber-500/20 border border-amber-400/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-amber-500',
    secondary:
      'bg-white hover:bg-[#FAF0F2] text-[#0F172A] border border-slate-200 shadow-xs hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-[#5A0B1C]/30',
    outline:
      'bg-transparent hover:bg-[#FAF0F2] text-[#0F172A] border border-slate-300 hover:border-[#5A0B1C]/50 focus-visible:ring-[#5A0B1C]/30 active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-[#FAF0F2] text-slate-600 hover:text-[#5A0B1C] focus-visible:ring-[#5A0B1C]/30 active:scale-[0.98]',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-xs border border-rose-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-rose-500',
    success:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs border border-emerald-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-emerald-500',
    indigo:
      'bg-[#5A0B1C] hover:bg-[#450815] text-white shadow-xs border border-[#480816] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#5A0B1C]/40',
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
