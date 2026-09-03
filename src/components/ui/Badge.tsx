import React from 'react';

export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'purple'
  | 'amber'
  | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  hasDot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  hasDot = false,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  const variantStyles: Record<BadgeVariant, { bg: string; dot: string }> = {
    default: {
      bg: 'bg-blue-50 text-blue-700 border border-blue-200/60 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900',
      dot: 'bg-blue-500',
    },
    success: {
      bg: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900',
      dot: 'bg-emerald-500',
    },
    warning: {
      bg: 'bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900',
      dot: 'bg-amber-500',
    },
    danger: {
      bg: 'bg-rose-50 text-rose-700 border border-rose-200/60 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900',
      dot: 'bg-rose-500',
    },
    info: {
      bg: 'bg-cyan-50 text-cyan-700 border border-cyan-200/60 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-900',
      dot: 'bg-cyan-500',
    },
    purple: {
      bg: 'bg-purple-50 text-purple-700 border border-purple-200/60 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-900',
      dot: 'bg-purple-500',
    },
    amber: {
      bg: 'bg-amber-100 text-amber-900 border border-amber-300/60 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800',
      dot: 'bg-amber-500',
    },
    neutral: {
      bg: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      dot: 'bg-slate-400',
    },
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold rounded-full select-none ${sizeStyles[size]} ${variantStyles[variant].bg} ${className}`}
    >
      {hasDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${variantStyles[variant].dot} shrink-0 animate-pulse`}
        />
      )}
      {children}
    </span>
  );
};
