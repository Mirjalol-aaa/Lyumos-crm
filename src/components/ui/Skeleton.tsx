import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  count = 1,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-2xl';
      case 'card':
        return 'rounded-3xl h-36 w-full';
      case 'text':
      default:
        return 'h-4 rounded-md w-full';
    }
  };

  const elements = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`animate-pulse bg-slate-200/80 dark:bg-slate-800/80 ${getVariantStyles()} ${className}`}
    />
  ));

  return count === 1 ? elements[0] : <div className="space-y-2">{elements}</div>;
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4,
}) => {
  return (
    <div className="w-full space-y-3 p-4">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4">
          <Skeleton variant="circular" className="h-9 w-9 shrink-0" />
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} variant="text" className="h-5 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};
