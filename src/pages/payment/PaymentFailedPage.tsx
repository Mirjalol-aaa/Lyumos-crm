import React, { useEffect } from 'react';
import { XCircle, RefreshCw, ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const PaymentFailedPage: React.FC = () => {
  const params = new URLSearchParams(window.location.hash.split('?')[1] || window.location.search);
  const reason = params.get('reason') || 'Mablag‘ yetarli emas yoki foydalanuvchi tomonidan bekor qilindi.';

  useEffect(() => {
    document.title = 'To‘lov Amalga Oshmadi — LUMOS';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
          <XCircle className="h-10 w-10" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
            To‘lov To‘xtatildi
          </span>
          <h1 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            To‘lov Amalga Oshmadi
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Tranzaksiya yakunlanmadi. Sizdan mablag‘ yechib olinmadi.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800 text-xs text-left">
          <p className="text-slate-400 font-bold mb-1">Sabab:</p>
          <p className="text-rose-600 dark:text-rose-400 font-medium">{reason}</p>
        </div>

        <div className="space-y-2.5">
          <Button
            variant="primary"
            size="md"
            className="w-full justify-center gap-2"
            onClick={() => window.history.back()}
          >
            <RefreshCw className="h-4 w-4" />
            Qaytadan Urinish
          </Button>

          <Button
            variant="ghost"
            size="md"
            className="w-full justify-center gap-2"
            onClick={() => {
              window.location.hash = '#/student';
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kabinetga Qaytish</span>
          </Button>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Yordam uchun: +998 (71) 200-00-25</span>
        </div>
      </div>
    </div>
  );
};
