import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { useLMS } from '../../context/LMSContext';
import { ACADEMIC_MONTHS } from '../../constants/academic';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Receipt,
  Sparkles,
} from 'lucide-react';

export const StudentPaymentsPage: React.FC = () => {
  const { students, settings } = useCRM();
  const { activeStudentId } = useLMS();

  const currentStudent = students.find(s => s.id === activeStudentId) || students[0];

  const payments = currentStudent?.payments || {};

  let totalPaid = 0;
  let totalDue = 0;

  ACADEMIC_MONTHS.forEach(month => {
    const p = payments[month];
    if (p) {
      if (p.status === 'Paid' || p.status === 'Discount') {
        totalPaid += p.amountPaid || currentStudent?.monthlyFee || 0;
      } else if (p.status === 'Unpaid' || p.status === 'Overdue') {
        totalDue += currentStudent?.monthlyFee || 0;
      }
    }
  });

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
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Oylik To‘lov</span>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {settings.currencySymbol}{currentStudent?.monthlyFee?.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400">{currentStudent?.groupName} guruhi uchun</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">To‘langan Summa</span>
          <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {settings.currencySymbol}{totalPaid.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600">Tasdiqlangan</span>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Joriy Qarzdorlik</span>
          <p className={`mt-2 text-2xl font-black ${totalDue > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
            {settings.currencySymbol}{totalDue.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400">{totalDue > 0 ? 'To‘lov talab etiladi' : 'Qarzdorlik yo‘q'}</span>
        </div>
      </div>

      {/* 12 Months Payment Matrix */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 p-4 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Akademik Yil Oylik To‘lov Tarixi ({settings.academicYear})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
              <tr>
                <th className="px-5 py-3">Oy</th>
                <th className="px-5 py-3">Holat</th>
                <th className="px-5 py-3">To‘langan Summa</th>
                <th className="px-5 py-3">To‘lov Sanasi</th>
                <th className="px-5 py-3">Chek / Kvitansiya №</th>
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
                      {isPaid ? `${settings.currencySymbol}${(p?.amountPaid || currentStudent?.monthlyFee).toLocaleString()}` : '—'}
                    </td>

                    <td className="px-5 py-3.5 text-slate-500">
                      {p?.paymentDate || '—'}
                    </td>

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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
