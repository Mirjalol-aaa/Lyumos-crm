import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { useLMS } from '../../context/LMSContext';
import { ACADEMIC_MONTHS } from '../../constants/academic';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Receipt,
  Download,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  initiateOnlinePayment,
  generatePdfReceipt,
} from '../../services/paymentGatewayService';

export const StudentPaymentsPage: React.FC = () => {
  const { students, settings, recordPayment } = useCRM();
  const { activeStudentId } = useLMS();

  const currentStudent = students.find((s) => s.id === activeStudentId) || students[0];
  const payments = currentStudent?.payments || {};

  const [selectedMonth, setSelectedMonth] = useState<string>('August');
  const [selectedProvider, setSelectedProvider] = useState<'payme' | 'click'>('payme');
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  let totalPaid = 0;
  let totalDue = 0;

  ACADEMIC_MONTHS.forEach((month) => {
    const p = payments[month];
    if (p) {
      if (p.status === 'Paid' || p.status === 'Discount') {
        totalPaid += p.amountPaid || currentStudent?.monthlyFee || 0;
      } else if (p.status === 'Unpaid' || p.status === 'Overdue') {
        totalDue += currentStudent?.monthlyFee || 0;
      }
    }
  });

  const handleOpenPayModal = (month: string) => {
    setSelectedMonth(month);
    setIsPayModalOpen(true);
  };

  const handleOnlinePay = async () => {
    if (!currentStudent) return;
    setIsProcessing(true);

    const amount = currentStudent.monthlyFee;
    const res = await initiateOnlinePayment({
      studentId: currentStudent.id,
      studentName: currentStudent.fullName,
      amount,
      academicMonth: selectedMonth,
      provider: selectedProvider,
    });

    setIsProcessing(false);
    setIsPayModalOpen(false);

    // Record payment locally as well
    recordPayment({
      studentId: currentStudent.id,
      month: selectedMonth,
      amount,
      discount: 0,
      method: 'Payme / Click',
      notes: `${selectedProvider.toUpperCase()} onlayn to‘lovi: ${res.transactionId}`,
    });

    if (res.checkoutUrl) {
      window.location.href = res.checkoutUrl;
    } else {
      window.location.hash = `#/payment/success?tx=${res.transactionId}&student=${encodeURIComponent(
        currentStudent.fullName
      )}&amount=${amount}&provider=${selectedProvider}&month=${selectedMonth}`;
    }
  };

  const handleDownloadReceipt = (month: string, p: any) => {
    if (!currentStudent) return;
    generatePdfReceipt({
      transactionId: p?.receiptNo || `TX-${Date.now().toString().slice(-6)}`,
      studentName: currentStudent.fullName,
      studentId: currentStudent.id,
      amount: p?.amountPaid || currentStudent.monthlyFee,
      currency: 'UZS',
      provider: 'payme',
      academicMonth: month,
      date: p?.paymentDate || new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Mening To‘lovlarim & Kvitansiyalar
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Akademik yil bo‘yicha to‘lov holati, oylik to‘lov summasi va cheklar tarixi.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Oylik To‘lov
          </span>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {settings.currencySymbol}
            {currentStudent?.monthlyFee?.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400">{currentStudent?.groupName} guruhi uchun</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            To‘langan Summa
          </span>
          <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {settings.currencySymbol}
            {totalPaid.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 font-bold">Muvaffaqiyatli to‘lovlar</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Kutilayotgan Qarz
          </span>
          <p className="mt-2 text-2xl font-black text-rose-600 dark:text-rose-400">
            {settings.currencySymbol}
            {totalDue.toLocaleString()}
          </p>
          <span className="text-[11px] text-rose-500 font-bold">To‘lanmagan oylar</span>
        </div>
      </div>

      {/* Payments Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 p-5 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Oylik To‘lovlar Jadvali (Payme & Click Integratsiyasi Bilan)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 dark:bg-slate-800/60">
              <tr>
                <th className="px-5 py-3.5">Akademik Oy</th>
                <th className="px-5 py-3.5">Holat</th>
                <th className="px-5 py-3.5">Summa</th>
                <th className="px-5 py-3.5">To‘lov Sanasi</th>
                <th className="px-5 py-3.5">Kvitansiya</th>
                <th className="px-5 py-3.5 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ACADEMIC_MONTHS.map((month) => {
                const p = payments[month];
                const status = p?.status || 'Unpaid';
                const isPaid = status === 'Paid' || status === 'Discount';

                return (
                  <tr key={month} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-200">
                      {month}
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          isPaid
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : status === 'Overdue'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {isPaid && <CheckCircle2 className="h-3 w-3" />}
                        {status === 'Overdue' && <AlertCircle className="h-3 w-3" />}
                        {status}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 font-semibold text-slate-700 dark:text-slate-300">
                      {settings.currencySymbol}
                      {(p?.amountPaid || currentStudent?.monthlyFee || 0).toLocaleString()}
                    </td>

                    <td className="px-5 py-3.5 text-slate-500">{p?.paymentDate || '—'}</td>

                    <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500">
                      {p?.receiptNo ? (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          <Receipt className="h-3 w-3" />
                          {p.receiptNo}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      {isPaid ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="gap-1 text-[11px] py-1 h-7"
                          onClick={() => handleDownloadReceipt(month, p)}
                        >
                          <Download className="h-3 w-3" />
                          <span>PDF</span>
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          className="gap-1 text-[11px] py-1 h-7 shadow-xs shadow-amber-500/20"
                          onClick={() => handleOpenPayModal(month)}
                        >
                          <CreditCard className="h-3 w-3" />
                          <span>To‘lash</span>
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Online Payment Modal */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Onlayn To‘lov Qilish"
        subtitle={`${selectedMonth} oyi uchun to‘lov`}
        icon={<CreditCard className="h-5 w-5" />}
      >
        <div className="space-y-5">
          <div className="rounded-2xl bg-amber-500/10 p-4 border border-amber-400/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 block">
                To‘lov Summasi:
              </span>
              <span className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono">
                {settings.currencySymbol}
                {currentStudent?.monthlyFee?.toLocaleString()}
              </span>
            </div>
            <span className="rounded-xl bg-amber-500/20 px-3 py-1 text-xs font-black text-amber-700 dark:text-amber-300">
              {selectedMonth}
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              To‘lov Tizimini Tanlang:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedProvider('payme')}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                  selectedProvider === 'payme'
                    ? 'border-[#00CCCC] bg-[#00CCCC]/10 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <span className="text-sm font-black text-[#00CCCC]">PAYME</span>
                <span className="text-[10px] text-slate-400 mt-1">Payme Checkout</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedProvider('click')}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                  selectedProvider === 'click'
                    ? 'border-[#008AE6] bg-[#008AE6]/10 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <span className="text-sm font-black text-[#008AE6]">CLICK</span>
                <span className="text-[10px] text-slate-400 mt-1">Click Evolution</span>
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3 text-[11px] text-slate-500 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>
              Karta ma’lumotlaringiz faqat {selectedProvider.toUpperCase()} rasmiy xavfsiz sahifasida kiritiladi.
            </span>
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center gap-2 shadow-md shadow-amber-500/20"
              isLoading={isProcessing}
              onClick={handleOnlinePay}
            >
              <span>{selectedProvider.toUpperCase()} orqali to‘lash</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
