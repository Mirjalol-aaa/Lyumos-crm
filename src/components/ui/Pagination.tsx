import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 py-3 ${className}`}
    >
      {totalItems !== undefined && itemsPerPage !== undefined && (
        <p className="text-[11px]">
          Jami <span className="font-bold text-slate-800 dark:text-slate-200">{totalItems}</span> ta
          yozuvdan{' '}
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {(currentPage - 1) * itemsPerPage + 1}
          </span>
          -
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {Math.min(currentPage * itemsPerPage, totalItems)}
          </span>{' '}
          ko‘rsatilmoqda
        </p>
      )}

      <div className="flex items-center gap-1.5 ml-auto">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
          // Show first, last, and around current
          if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) {
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`flex h-8 min-w-[32px] items-center justify-center rounded-xl px-2 text-xs font-bold transition-all ${
                  p === currentPage
                    ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {p}
              </button>
            );
          }
          if (p === 2 && currentPage > 3) {
            return <span key={p} className="px-1 text-slate-400">...</span>;
          }
          if (p === totalPages - 1 && currentPage < totalPages - 2) {
            return <span key={p} className="px-1 text-slate-400">...</span>;
          }
          return null;
        })}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
