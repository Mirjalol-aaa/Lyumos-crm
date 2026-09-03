import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  delta?: string;
  isPositiveDelta?: boolean;
  icon?: React.ReactNode;
  color?: 'blue' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  delta,
  isPositiveDelta = true,
  icon,
  color = 'blue',
}) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50/70 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/50',
      glow: 'shadow-blue-500/5',
    },
    emerald: {
      bg: 'bg-emerald-50/70 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/50',
      glow: 'shadow-emerald-500/5',
    },
    amber: {
      bg: 'bg-amber-50/70 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/50',
      glow: 'shadow-amber-500/5',
    },
    rose: {
      bg: 'bg-rose-50/70 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/50',
      glow: 'shadow-rose-500/5',
    },
    indigo: {
      bg: 'bg-indigo-50/70 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-900/50',
      glow: 'shadow-indigo-500/5',
    },
    purple: {
      bg: 'bg-purple-50/70 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400 border-purple-200/50 dark:border-purple-900/50',
      glow: 'shadow-purple-500/5',
    },
  };

  const currentTheme = colorMap[color];

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:border-slate-800/90 dark:bg-slate-900/90 dark:hover:border-slate-700 ${currentTheme.glow}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
          {title}
        </span>
        {icon && (
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border p-2 ${currentTheme.bg}`}>
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {value}
        </h3>

        {delta && (
          <span
            className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-black tracking-tight ${
              isPositiveDelta
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
            }`}
          >
            {isPositiveDelta ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {delta}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
          {subtitle}
        </p>
      )}
    </div>
  );
};
