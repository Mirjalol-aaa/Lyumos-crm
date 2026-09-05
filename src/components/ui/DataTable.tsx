import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, Filter } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  searchPlaceholder?: string;
  filterNode?: React.ReactNode;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize = 10,
  searchPlaceholder = 'Qidirish...',
  filterNode,
  onRowClick,
  emptyMessage = 'Hech qanday ma’lumot topilmadi',
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Search filter
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const query = searchQuery.toLowerCase();

    return data.filter(item => {
      return Object.values(item).some(val => {
        if (val === null || val === undefined) return false;
        if (typeof val === 'string' || typeof val === 'number') {
          return String(val).toLowerCase().includes(query);
        }
        return false;
      });
    });
  }, [data, searchQuery]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return sortOrder === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sortKey, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Control Bar: Search & Custom Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 w-full sm:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border border-slate-200/90 bg-white py-2 pl-10 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>

        {filterNode && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {filterNode}
          </div>
        )}
      </div>

      {/* Table Surface */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800/90 dark:bg-slate-900/90">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={String(col.key) + idx}
                    style={{ width: col.width }}
                    className={`px-3 sm:px-5 py-2.5 sm:py-3.5 ${
                      col.align === 'center'
                        ? 'text-center'
                        : col.align === 'right'
                        ? 'text-right'
                        : 'text-left'
                    } ${col.sortable ? 'cursor-pointer select-none hover:text-slate-700 dark:hover:text-white' : ''}`}
                    onClick={() => col.sortable && handleSort(String(col.key))}
                  >
                    <div className={`inline-flex items-center gap-1.5 ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : ''}`}>
                      <span>{col.header}</span>
                      {col.sortable && (
                        <ArrowUpDown className="h-3 w-3 text-slate-400" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 sm:px-5 py-10 sm:py-12 text-center text-xs text-slate-400 dark:text-slate-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                        <Filter className="h-5 w-5 text-slate-400" />
                      </div>
                      <p className="font-semibold text-slate-600 dark:text-slate-400">{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, rowIdx) => (
                  <tr
                    key={item.id || rowIdx}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={`group transition-colors duration-150 ${
                      onRowClick ? 'cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/40' : 'hover:bg-slate-50/40 dark:hover:bg-slate-800/20'
                    }`}
                  >
                    {columns.map((col, colIdx) => (
                      <td
                        key={String(col.key) + colIdx}
                        className={`px-3 sm:px-5 py-2.5 sm:py-3.5 text-slate-700 dark:text-slate-300 font-medium ${
                          col.align === 'center'
                            ? 'text-center'
                            : col.align === 'right'
                            ? 'text-right'
                            : 'text-left'
                        }`}
                      >
                        {col.render
                          ? col.render(item, rowIdx)
                          : String(item[col.key] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-slate-100 px-3.5 sm:px-5 py-2.5 sm:py-3 gap-2 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/40 text-xs">
            <span className="text-slate-500 text-[10px] sm:text-[11px]">
              Jami <strong>{sortedData.length}</strong> ta qator (Sahifa <strong>{currentPage}</strong> / {totalPages})
            </span>

            <div className="flex items-center gap-1 self-end sm:self-auto">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="px-2 text-xs font-black text-slate-700 dark:text-slate-300">
                {currentPage}
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
