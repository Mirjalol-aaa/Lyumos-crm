import React, { useEffect } from 'react';
import { CheckCircle2, Download, ArrowRight, ShieldCheck, Receipt } from 'lucide-react';
import { generatePdfReceipt, fireCelebrationConfetti } from '../../services/paymentGatewayService';
import { Button } from '../../components/ui/Button';

export const PaymentSuccessPage: React.FC = () => {
  // Parse query parameters
  const params = new URLSearchParams(window.location.hash.split('?')[1] || window.location.search);
  const txId = params.get('tx') || `TX-${Date.now()}`;
  const studentName = params.get('student') || 'Hurmatli O‘quvchi';
  const amount = Number(params.get('amount') || '350000');
  const provider = (params.get('provider') || 'payme') as 'payme' | 'click' | 'cash';
  const month = params.get('month') || 'Joriy Oy';
  const nowStr = new Date().toLocaleString();

  useEffect(() => {
    fireCelebrationConfetti();
    document.title = 'To‘lov Muvaffaqiyatli — LUMOS';
  }, []);

  const handleDownloadReceipt = () => {
    generatePdfReceipt({
      transactionId: txId,
      studentName,
      studentId: 'STU-ONLINE',
      amount,
      currency: 'UZS',
      provider,
      academicMonth: month,
      date: nowStr,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
        {/* Animated Check Emblem */}
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
          <div className="absolute inset-0 rounded-3xl border-2 border-emerald-500/30 animate-ping" />
          <CheckCircle2 className="h-10 w-10 relative z-10" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" /> Rasmiy To‘lov Tasdiqlandi
          </span>
          <h1 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            To‘lov Muvaffaqiyatli!
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {studentName} uchun to‘lov tizim tomonidan qabul qilindi.
          </p>
        </div>

        {/* Transaction Summary Card */}
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800 text-xs space-y-2.5 text-left">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Tranzaksiya:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{txId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">To‘lov tizimi:</span>
            <span className="font-bold text-amber-600 uppercase">{provider}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">To‘lov davri:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{month}</span>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between items-center font-bold text-sm">
            <span className="text-slate-700 dark:text-slate-300">To‘langan Summa:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono">
              {amount.toLocaleString()} UZS
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <Button
            variant="primary"
            size="md"
            className="w-full justify-center gap-2"
            onClick={handleDownloadReceipt}
          >
            <Download className="h-4 w-4" />
            PDF Kvitansiyani Yuklab Olish
          </Button>

          <Button
            variant="secondary"
            size="md"
            className="w-full justify-center gap-2"
            onClick={() => {
              window.location.hash = '#/student';
            }}
          >
            <span>Kabinetga Qaytish</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
