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
      bg: 'bg-[#F7E9ED] text-[#6F1028] border border-[#6F1028]/20',
      dot: 'bg-[#6F1028]',
    },
    burgundy: {
      bg: 'bg-[#F7E9ED] text-[#6F1028] border border-[#6F1028]/20',
      dot: 'bg-[#6F1028]',
    },
    gold: {
      bg: 'bg-[#F7F0E2] text-[#8A641C] border border-[#C89B3C]/30',
      dot: 'bg-[#C89B3C]',
    },
    amber: {
      bg: 'bg-[#F7F0E2] text-[#8A641C] border border-[#C89B3C]/30',
      dot: 'bg-[#C89B3C]',
    },
    success: {
      bg: 'bg-[#E8F7F0] text-[#16A36A] border border-[#16A36A]/20',
      dot: 'bg-[#16A36A]',
    },
    warning: {
      bg: 'bg-[#F7F0E2] text-[#8A641C] border border-[#C89B3C]/30',
      dot: 'bg-[#C89B3C]',
    },
    danger: {
      bg: 'bg-[#FDECEC] text-[#C0392B] border border-[#C0392B]/20',
      dot: 'bg-[#C0392B]',
    },
    info: {
      bg: 'bg-[#F7E9ED] text-[#6F1028] border border-[#6F1028]/20',
      dot: 'bg-[#6F1028]',
    },
    purple: {
      bg: 'bg-[#F7E9ED] text-[#6F1028] border border-[#6F1028]/20',
      dot: 'bg-[#6F1028]',
    },
    neutral: {
      bg: 'bg-[#F2F4F7] text-[#667085] border border-[#E7E1D8]',
      dot: 'bg-[#98A2B3]',
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
