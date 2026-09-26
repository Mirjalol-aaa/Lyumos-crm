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
      'bg-[#6F1028] hover:bg-[#4A0B1B] text-white shadow-xs border border-[#4A0B1B] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#6F1028]/40',
    gold:
      'bg-[#C89B3C] hover:bg-[#B3872F] text-white font-bold shadow-xs border border-[#B3872F] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-[#C89B3C]/40',
    secondary:
      'bg-white hover:bg-[#F7E9ED] text-[#1F2937] border border-[#E7E1D8] shadow-xs hover:border-[#6F1028]/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-[#6F1028]/30',
    outline:
      'bg-transparent hover:bg-[#F7E9ED] text-[#1F2937] border border-[#E7E1D8] hover:border-[#6F1028]/40 focus-visible:ring-[#6F1028]/30 active:scale-[0.98]',
    ghost:
      'bg-transparent hover:bg-[#F7E9ED] text-[#667085] hover:text-[#6F1028] focus-visible:ring-[#6F1028]/30 active:scale-[0.98]',
    danger:
      'bg-[#C0392B] hover:bg-[#A93226] text-white shadow-xs border border-[#A93226] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-[#C0392B]/40',
    success:
      'bg-[#16A36A] hover:bg-[#128656] text-white shadow-xs border border-[#128656] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-[#16A36A]/40',
    indigo:
      'bg-[#6F1028] hover:bg-[#4A0B1B] text-white shadow-xs border border-[#4A0B1B] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#6F1028]/40',
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
