import React, { useState } from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { LumosLoader } from './LumosLoader';

export const DataLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading, isInitialized, error, refreshData } = useCRM();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isLoading && !isInitialized) {
    return <LumosLoader message="LUMOS O‘quv Markazi tizimi yuklanmoqda…" />;
  }

  if (error && !isInitialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F7] dark:bg-slate-950 gap-4 p-6 max-w-md text-center">
        <AlertCircle className="w-12 h-12 text-amber-500" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Ulanish Xabari</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">{error}</p>
        <button
          onClick={() => refreshData()}
          className="mt-2 px-5 py-2.5 rounded-2xl bg-amber-500 text-white text-sm font-bold flex items-center gap-2 shadow-md shadow-amber-500/20 hover:bg-amber-600"
        >
          <RefreshCw className="w-4 h-4" /> Qayta urinish
        </button>
      </div>
    );
  }

  // Filter out Supabase RLS database policy warnings from intrusive UI banners
  const isRlsPolicyError = error && (
    error.includes('row-level security') ||
    error.includes('violates') ||
    error.includes('policy')
  );

  return (
    <>
      {error && !isDismissed && !isRlsPolicyError && (
        <div className="fixed top-4 right-4 z-[100] max-w-sm p-3 rounded-2xl bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 shadow-xl flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <div className="flex-1">
            <p className="font-bold">Sinxronizatsiya eslatmasi</p>
            <p className="text-[11px] opacity-90">{error}</p>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 hover:bg-amber-200/50 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      {children}
    </>
  );
};
