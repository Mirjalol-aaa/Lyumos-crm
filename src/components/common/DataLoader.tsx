import React from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const DataLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading, isInitialized, error, refreshData } = useCRM();

  if (isLoading && !isInitialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F7] dark:bg-slate-950 gap-4">
        <Loader2 className="w-10 h-10 text-[#007AFF] animate-spin" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          Loading LYUMOS CRM from Supabase…
        </p>
      </div>
    );
  }

  if (error && !isInitialized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F7] dark:bg-slate-950 gap-4 p-6 max-w-md text-center">
        <AlertCircle className="w-12 h-12 text-rose-500" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Connection Error</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">{error}</p>
        <p className="text-xs text-slate-500">
          Ensure <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">VITE_SUPABASE_URL</code> and{' '}
          <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> are set in{' '}
          <code className="font-mono bg-slate-200 dark:bg-slate-800 px-1 rounded">.env.local</code>
        </p>
        <button
          onClick={() => refreshData()}
          className="mt-2 px-5 py-2.5 rounded-2xl bg-[#007AFF] text-white text-sm font-bold flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="fixed top-4 right-4 z-[100] max-w-sm p-3 rounded-2xl bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 shadow-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Sync error</p>
            <p>{error}</p>
          </div>
          <button onClick={() => refreshData()} className="ml-auto text-rose-600 font-bold shrink-0">Retry</button>
        </div>
      )}
      {children}
    </>
  );
};
