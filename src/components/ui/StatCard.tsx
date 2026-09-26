import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  delta?: string;
  isPositiveDelta?: boolean;
  icon?: React.ReactNode;
  color?: 'burgundy' | 'gold' | 'blue' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  delta,
  isPositiveDelta = true,
  icon,
  color = 'burgundy',
}) => {
  const [displayValue, setDisplayValue] = useState<string | number>(value);

  useEffect(() => {
    // Check if value contains numbers that can animate
    const strVal = String(value);
    const numMatch = strVal.match(/[\d,.]+/);

    if (!numMatch) {
      setDisplayValue(value);
      return;
    }

    const rawNumStr = numMatch[0].replace(/,/g, '');
    const targetNum = parseFloat(rawNumStr);

    if (isNaN(targetNum) || targetNum <= 0) {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const duration = 800; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(start + (targetNum - start) * easeProgress);

      const formattedCurrent = currentVal.toLocaleString();
      const animatedStr = strVal.replace(numMatch[0], formattedCurrent);
      setDisplayValue(animatedStr);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    const frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  const colorMap = {
    burgundy: {
      bg: 'bg-[#FAF0F2] text-[#5A0B1C] border border-[#F0D5DC]',
      glow: 'shadow-[#5A0B1C]/5',
    },
    gold: {
      bg: 'bg-[#FDF8EE] text-[#C49220] border border-[#F6E5BC]',
      glow: 'shadow-amber-500/5',
    },
    blue: {
      bg: 'bg-[#FAF0F2] text-[#5A0B1C] border border-[#F0D5DC]',
      glow: 'shadow-[#5A0B1C]/5',
    },
    emerald: {
      bg: 'bg-emerald-50/70 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/50',
      glow: 'shadow-emerald-500/5',
    },
    amber: {
      bg: 'bg-[#FDF8EE] text-[#C49220] border border-[#F6E5BC]',
      glow: 'shadow-amber-500/5',
    },
    rose: {
      bg: 'bg-rose-50/70 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/50',
      glow: 'shadow-rose-500/5',
    },
    indigo: {
      bg: 'bg-[#FAF0F2] text-[#5A0B1C] border border-[#F0D5DC]',
      glow: 'shadow-[#5A0B1C]/5',
    },
    purple: {
      bg: 'bg-[#FAF0F2] text-[#5A0B1C] border border-[#F0D5DC]',
      glow: 'shadow-[#5A0B1C]/5',
    },
  };

  const currentTheme = colorMap[color];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs ring-1 ring-slate-900/[0.03] transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-slate-300 dark:border-slate-800/90 dark:bg-slate-900/90 dark:ring-white/[0.04] dark:hover:border-slate-700 ${currentTheme.glow}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
          {title}
        </span>
        {icon && (
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border p-2 ${currentTheme.bg}`}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
          {displayValue}
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
