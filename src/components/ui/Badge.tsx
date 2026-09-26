import React from 'react';

export type BadgeVariant =
  | 'default'
  | 'burgundy'
  | 'gold'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'purple'
  | 'amber'
  | 'neutral';

export interface BadgeProps {
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
    sm: 'px-2 py-0.5 text-[10px] font-bold rounded-md gap-1',
    md: 'px-2.5 py-1 text-[11px] font-extrabold rounded-lg gap-1.5',
  };

  const variantStyles: Record<BadgeVariant, { bg: string; dot: string }> = {
    default: {
      bg: 'bg-[#FAF0F2] text-[#5A0B1C] border border-[#F0D5DC]',
      dot: 'bg-[#5A0B1C]',
    },
    burgundy: {
      bg: 'bg-[#FAF0F2] text-[#5A0B1C] border border-[#F0D5DC]',
      dot: 'bg-[#5A0B1C]',
    },
    gold: {
      bg: 'bg-[#FDF8EE] text-[#C49220] border border-[#F6E5BC]',
      dot: 'bg-[#D9A62E]',
    },
    amber: {
      bg: 'bg-[#FDF8EE] text-[#C49220] border border-[#F6E5BC]',
      dot: 'bg-[#D9A62E]',
    },
    success: {
      bg: 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-400/25',
      dot: 'bg-emerald-500',
    },
    warning: {
      bg: 'bg-amber-500/10 text-amber-800 border border-amber-500/25 dark:bg-amber-500/20 dark:text-amber-200 dark:border-amber-400/30',
      dot: 'bg-amber-500',
    },
    danger: {
      bg: 'bg-rose-500/10 text-rose-700 border border-rose-500/20 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-400/25',
      dot: 'bg-rose-500',
    },
    info: {
      bg: 'bg-[#FAF0F2] text-[#5A0B1C] border border-[#F0D5DC]',
      dot: 'bg-[#5A0B1C]',
    },
    purple: {
      bg: 'bg-[#FAF0F2] text-[#5A0B1C] border border-[#F0D5DC]',
      dot: 'bg-[#5A0B1C]',
    },
    neutral: {
      bg: 'bg-slate-500/10 text-slate-700 border border-slate-500/20 dark:bg-slate-500/15 dark:text-slate-300 dark:border-slate-400/25',
      dot: 'bg-slate-400',
    },
  };

  const current = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={`inline-flex items-center tracking-tight transition-colors ${sizeStyles[size]} ${current.bg} ${className}`}
    >
      {hasDot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${current.dot}`} />
          <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${current.dot}`} />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
};
