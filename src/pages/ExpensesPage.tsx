import React from 'react';
import { useCRM } from '../context/CRMContext';
import { Receipt, Plus, Trash2, DollarSign } from 'lucide-react';

export const ExpensesPage: React.FC = () => {
  const { expenses, deleteExpense, setIsAddExpenseModalOpen, settings } = useCRM();

  const totalExpenseSum = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Center Expenses & Procurement Log ({expenses.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track operational spending, teacher salary disbursements & equipment purchases
          </p>
        </div>

        <button
          onClick={() => setIsAddExpenseModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/25 active:scale-95 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Expense
        </button>
      </div>

      {/* Summary Box */}
      <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase">Total Logged Expenditures</span>
          <p className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {settings.currencySymbol}{totalExpenseSum.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Expense List Table */}
      <div className="p-2 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-3.5">Expense Item</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Amount</th>
              <th className="p-3.5">Date</th>
              <th className="p-3.5">Payment Method</th>
              <th className="p-3.5">Requested By</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {expenses.map(exp => (
              <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-3.5">
                  <span className="font-bold text-slate-900 dark:text-white block">{exp.title}</span>
                  {exp.notes && <span className="text-[11px] text-slate-400">{exp.notes}</span>}
                </td>
                <td className="p-3.5 text-slate-600 dark:text-slate-300 font-medium">{exp.category}</td>
                <td className="p-3.5 font-bold text-rose-600 text-sm">{settings.currencySymbol}{exp.amount}</td>
                <td className="p-3.5 text-slate-400">{exp.date}</td>
                <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono text-[11px]">{exp.paymentMethod}</td>
                <td className="p-3.5 text-slate-500">{exp.requestedBy}</td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => deleteExpense(exp.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
