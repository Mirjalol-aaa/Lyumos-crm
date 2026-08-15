import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { X, DollarSign, Check, Percent, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PaymentMethod } from '../../types/crm';
import { ACADEMIC_MONTHS, getCurrentAcademicMonth } from '../../constants/academic';

export const ReceivePaymentModal: React.FC = () => {
  const { 
    isReceivePaymentModalOpen, 
    setIsReceivePaymentModalOpen, 
    paymentModalDefaultStudentId,
    students, 
    recordPayment,
    settings 
  } = useCRM();

  const [studentId, setStudentId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(getCurrentAcademicMonth());
  const [discountPercent, setDiscountPercent] = useState(0);
  const [method, setMethod] = useState<PaymentMethod>('Payme / Click');
  const [notes, setNotes] = useState('');

  const MONTHS = ACADEMIC_MONTHS;

  useEffect(() => {
    if (paymentModalDefaultStudentId) {
      setStudentId(paymentModalDefaultStudentId);
    } else if (students.length > 0 && !studentId) {
      setStudentId(students[0].id);
    }
  }, [paymentModalDefaultStudentId, students]);

  if (!isReceivePaymentModalOpen) return null;

  const currentStudent = students.find(s => s.id === studentId) || students[0];
  const baseFee = currentStudent ? currentStudent.monthlyFee : 150;
  const finalAmount = Math.max(0, baseFee * (1 - discountPercent / 100));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) return;

    recordPayment({
      studentId: currentStudent.id,
      month: selectedMonth,
      amount: finalAmount,
      discount: discountPercent,
      method,
      notes
    });

    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#007AFF', '#34C759', '#FF9500']
    });

    setIsReceivePaymentModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Receive Student Payment</h2>
              <p className="text-xs text-emerald-100">Process tuition fee & issue instant receipt</p>
            </div>
          </div>
          <button 
            onClick={() => setIsReceivePaymentModalOpen(false)}
            className="p-2 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Select Student *</label>
            <select
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-[#007AFF] focus:outline-none"
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.id}) — {s.groupName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Academic Month *</label>
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value as typeof selectedMonth)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#007AFF] focus:outline-none"
              >
                {MONTHS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Payment Method</label>
              <select
                value={method}
                onChange={e => setMethod(e.target.value as PaymentMethod)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#007AFF] focus:outline-none"
              >
                <option value="Payme / Click">Payme / Click</option>
                <option value="Card">Visa / MasterCard</option>
                <option value="Cash">Cash in Hand</option>
                <option value="Bank Transfer">Bank Wire Transfer</option>
              </select>
            </div>
          </div>

          {/* Discount Preset Chips */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-[#007AFF]" /> Discount Applied
              </label>
              <span className="font-bold text-[#007AFF]">{discountPercent}%</span>
            </div>
            <div className="flex gap-2">
              {[0, 10, 15, 20, 25].map(disc => (
                <button
                  type="button"
                  key={disc}
                  onClick={() => setDiscountPercent(disc)}
                  className={`flex-1 py-2 rounded-xl font-bold border text-xs transition-all ${
                    discountPercent === disc
                      ? 'bg-blue-50 dark:bg-blue-950 border-[#007AFF] text-[#007AFF]'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {disc}%
                </button>
              ))}
            </div>
          </div>

          {/* Fee Calculation Summary Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex justify-between text-slate-500">
              <span>Standard Group Fee:</span>
              <span className="font-semibold">{settings.currencySymbol}{baseFee}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount (-{discountPercent}%):</span>
                <span>-{settings.currencySymbol}{(baseFee * discountPercent / 100).toFixed(0)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">Total Payable Amount:</span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                {settings.currencySymbol}{finalAmount.toFixed(0)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsReceivePaymentModalOpen(false)}
              className="px-4 py-2.5 rounded-xl font-semibold text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Confirm & Issue Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
