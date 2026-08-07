import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { X, Receipt, Plus } from 'lucide-react';
import { Expense } from '../../types/crm';

export const AddExpenseModal: React.FC = () => {
  const { isAddExpenseModalOpen, setIsAddExpenseModalOpen, addExpense, settings } = useCRM();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Expense['category']>('Utilities & Software');
  const [amount, setAmount] = useState(250);
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [requestedBy, setRequestedBy] = useState('Administration');
  const [notes, setNotes] = useState('');

  if (!isAddExpenseModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    addExpense({
      title,
      category,
      amount: Number(amount),
      date: new Date().toISOString().split('T')[0],
      paymentMethod,
      requestedBy,
      notes
    });

    setIsAddExpenseModalOpen(false);
    setTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Record New Expense</h2>
              <p className="text-xs text-slate-500">Log operational & campus expenditures</p>
            </div>
          </div>
          <button onClick={() => setIsAddExpenseModalOpen(false)} className="p-2 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Expense Title *</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. New Projector Bulb for Lab 3"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Rent">Rent</option>
                <option value="Teacher Salaries">Teacher Salaries</option>
                <option value="Marketing">Marketing</option>
                <option value="Utilities & Software">Utilities & Software</option>
                <option value="Equipment">Equipment</option>
                <option value="Events">Events</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Amount ({settings.currencySymbol})</label>
              <input 
                type="number" 
                required
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-rose-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="Card">Corporate Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Petty Cash</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Requested By</label>
              <input 
                type="text" 
                value={requestedBy}
                onChange={e => setRequestedBy(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Notes / Description</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Vendor details, invoice numbers..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAddExpenseModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-500">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/20">
              <Plus className="w-4 h-4" /> Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
