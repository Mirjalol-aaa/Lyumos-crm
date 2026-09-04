import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isHoverable?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  isHoverable = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white shadow-xs ring-1 ring-slate-900/[0.03] dark:border-slate-800/90 dark:bg-slate-900/90 dark:ring-white/[0.04] ${
        isHoverable
          ? 'transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, className = '' }) => {
  return (
    <div
      className={`flex items-start justify-between gap-4 border-b border-slate-100 p-5 dark:border-slate-800/80 ${className}`}
    >
      <div>
        <h3 className="text-sm font-black tracking-tight text-slate-900 dark:text-white">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-0.5 text-xs font-normal text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div
      className={`flex items-center justify-between border-t border-slate-100 bg-slate-50/50 p-4 rounded-b-2xl dark:border-slate-800/80 dark:bg-slate-900/40 ${className}`}
    >
      {children}
    </div>
  );
};
