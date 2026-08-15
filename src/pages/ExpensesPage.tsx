import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Expense } from '../types/crm';

import {
  Plus,
  Trash2,
  AlertTriangle,
  Pencil,
  X,
  Save,
  ReceiptText,
} from 'lucide-react';

export const ExpensesPage: React.FC = () => {
  const {
    expenses,
    updateExpense,
    deleteExpense,
    setIsAddExpenseModalOpen,
    settings,
  } = useCRM();

  // ───────────────────────────────────────────────────────────────────────────
  // DELETE STATE
  // ───────────────────────────────────────────────────────────────────────────

  const [expenseToDelete, setExpenseToDelete] =
    useState<string | null>(null);

  // ───────────────────────────────────────────────────────────────────────────
  // EDIT STATE
  // ───────────────────────────────────────────────────────────────────────────

  const [expenseToEdit, setExpenseToEdit] =
    useState<Expense | null>(null);

  const [editForm, setEditForm] = useState({
    title: '',
    category: '',
    amount: '',
    date: '',
    paymentMethod: '',
    requestedBy: '',
    notes: '',
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TOTAL
  // ───────────────────────────────────────────────────────────────────────────

  const totalExpenseSum = expenses.reduce(
    (acc, curr) => acc + curr.amount,
    0
  );

  // ───────────────────────────────────────────────────────────────────────────
  // DELETE
  // ───────────────────────────────────────────────────────────────────────────

  const selectedExpenseToDelete = expenses.find(
    expense => expense.id === expenseToDelete
  );

  const handleConfirmDelete = () => {
    if (!selectedExpenseToDelete) return;

    deleteExpense(selectedExpenseToDelete.id);

    setExpenseToDelete(null);
  };

  // ───────────────────────────────────────────────────────────────────────────
  // OPEN EDIT
  // ───────────────────────────────────────────────────────────────────────────

  const handleOpenEdit = (expense: Expense) => {
    setExpenseToEdit(expense);

    setEditForm({
      title: expense.title ?? '',
      category: expense.category ?? '',
      amount: String(expense.amount ?? ''),
      date: expense.date ?? '',
      paymentMethod: expense.paymentMethod ?? '',
      requestedBy: expense.requestedBy ?? '',
      notes: expense.notes ?? '',
    });
  };

  // ───────────────────────────────────────────────────────────────────────────
  // CLOSE EDIT
  // ───────────────────────────────────────────────────────────────────────────

  const handleCloseEdit = () => {
    setExpenseToEdit(null);

    setEditForm({
      title: '',
      category: '',
      amount: '',
      date: '',
      paymentMethod: '',
      requestedBy: '',
      notes: '',
    });
  };

  // ───────────────────────────────────────────────────────────────────────────
  // SAVE EDIT
  // ───────────────────────────────────────────────────────────────────────────

  const handleSaveEdit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!expenseToEdit) return;

    const numericAmount = Number(editForm.amount);

    if (
      !editForm.title.trim() ||
      !editForm.category.trim() ||
      !editForm.date ||
      !editForm.paymentMethod.trim() ||
      !editForm.requestedBy.trim()
    ) {
      return;
    }

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      return;
    }

    updateExpense(
      expenseToEdit.id,
      {
        title: editForm.title.trim(),

        category:
          editForm.category.trim() as Expense['category'],

        amount: numericAmount,

        date: editForm.date,

        paymentMethod:
          editForm.paymentMethod.trim() as Expense['paymentMethod'],

        requestedBy:
          editForm.requestedBy.trim(),

        notes:
          editForm.notes.trim() || undefined,
      }
    );

    handleCloseEdit();
  };

  // ───────────────────────────────────────────────────────────────────────────
  // INPUT STYLE
  // ───────────────────────────────────────────────────────────────────────────

  const inputClass =
    'w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:focus:border-rose-500 dark:focus:bg-white/[0.06]';

  const labelClass =
    'mb-2 block text-[10px] font-black uppercase tracking-[0.14em] text-slate-400';

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 md:p-8">

      {/* ───────────────── HEADER ───────────────── */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Center Expenses & Procurement Log ({expenses.length})
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Track operational spending, teacher salary disbursements & equipment purchases
          </p>
        </div>

        <button
          onClick={() => setIsAddExpenseModalOpen(true)}
          className="flex shrink-0 cursor-pointer items-center gap-2 rounded-2xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-600/25 transition-all hover:bg-rose-700 active:scale-95"
        >
          <Plus className="h-4 w-4" />

          Add New Expense
        </button>
      </div>

      {/* ───────────────── SUMMARY ───────────────── */}

      <div className="flex items-center justify-between rounded-[24px] border border-slate-200/60 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <div>
          <span className="text-xs font-bold uppercase text-slate-400">
            Total Logged Expenditures
          </span>

          <p className="mt-1 text-3xl font-black text-rose-600 dark:text-rose-400">
            {settings.currencySymbol}
            {totalExpenseSum.toLocaleString()}
          </p>
        </div>

        <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 sm:flex">
          <ReceiptText className="h-6 w-6" />
        </div>
      </div>

      {/* ───────────────── TABLE ───────────────── */}

      <div className="overflow-hidden rounded-[24px] border border-slate-200/60 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px] text-left text-xs">

            <thead className="bg-slate-50 font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800">

              <tr>
                <th className="p-3.5">
                  Expense Item
                </th>

                <th className="p-3.5">
                  Category
                </th>

                <th className="p-3.5">
                  Amount
                </th>

                <th className="p-3.5">
                  Date
                </th>

                <th className="p-3.5">
                  Payment Method
                </th>

                <th className="p-3.5">
                  Requested By
                </th>

                <th className="p-3.5 text-right">
                  Action
                </th>
              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

              {expenses.map(expense => (

                <tr
                  key={expense.id}
                  className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >

                  {/* Expense */}

                  <td className="p-3.5">

                    <span className="block font-bold text-slate-900 dark:text-white">
                      {expense.title}
                    </span>

                    {expense.notes && (
                      <span className="mt-0.5 block max-w-[300px] truncate text-[11px] text-slate-400">
                        {expense.notes}
                      </span>
                    )}

                  </td>

                  {/* Category */}

                  <td className="p-3.5 font-medium text-slate-600 dark:text-slate-300">
                    {expense.category}
                  </td>

                  {/* Amount */}

                  <td className="p-3.5 text-sm font-bold text-rose-600">
                    {settings.currencySymbol}
                    {expense.amount.toLocaleString()}
                  </td>

                  {/* Date */}

                  <td className="p-3.5 text-slate-400">
                    {expense.date}
                  </td>

                  {/* Method */}

                  <td className="p-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                    {expense.paymentMethod}
                  </td>

                  {/* Requested */}

                  <td className="p-3.5 text-slate-500">
                    {expense.requestedBy}
                  </td>

                  {/* Actions */}

                  <td className="p-3.5">

                    <div className="flex items-center justify-end gap-1">

                      {/* EDIT */}

                      <button
                        onClick={() =>
                          handleOpenEdit(expense)
                        }
                        className="cursor-pointer rounded-xl p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30"
                        title="Edit expense"
                        aria-label="Edit expense"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      {/* DELETE */}

                      <button
                        onClick={() =>
                          setExpenseToDelete(expense.id)
                        }
                        className="cursor-pointer rounded-xl p-2 text-rose-500 transition-all hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40"
                        title="Delete expense"
                        aria-label="Delete expense"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          EDIT EXPENSE MODAL
      ═══════════════════════════════════════════════════════════════════════ */}

      {expenseToEdit && (

        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm"
          onMouseDown={handleCloseEdit}
        >

          <div
            className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-[30px] border border-white/20 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900"
            onMouseDown={event =>
              event.stopPropagation()
            }
          >

            {/* EDIT HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-white/10">

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40">
                  <Pencil className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    Edit Expense
                  </h2>

                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {expenseToEdit.id} • Update expense information
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={handleCloseEdit}
                className="cursor-pointer rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/5 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* EDIT BODY */}

            <form
              onSubmit={handleSaveEdit}
              className="flex min-h-0 flex-1 flex-col"
            >

              <div className="flex-1 overflow-y-auto p-6">

                <div className="grid gap-5 md:grid-cols-2">

                  {/* TITLE */}

                  <div className="md:col-span-2">

                    <label className={labelClass}>
                      Expense Title
                    </label>

                    <input
                      type="text"
                      value={editForm.title}
                      onChange={event =>
                        setEditForm(prev => ({
                          ...prev,
                          title: event.target.value,
                        }))
                      }
                      className={inputClass}
                      placeholder="Expense title"
                      required
                    />

                  </div>

                  {/* CATEGORY */}

                  <div>

                    <label className={labelClass}>
                      Category
                    </label>

                    <input
                      type="text"
                      value={editForm.category}
                      onChange={event =>
                        setEditForm(prev => ({
                          ...prev,
                          category: event.target.value,
                        }))
                      }
                      className={inputClass}
                      placeholder="e.g. Rent"
                      list="expense-category-options"
                      required
                    />

                    <datalist id="expense-category-options">
                      <option value="Rent" />
                      <option value="Teacher Salaries" />
                      <option value="Marketing" />
                      <option value="Utilities & Software" />
                      <option value="Equipment" />
                      <option value="Events" />
                    </datalist>

                  </div>

                  {/* AMOUNT */}

                  <div>

                    <label className={labelClass}>
                      Amount ({settings.currencySymbol})
                    </label>

                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={editForm.amount}
                      onChange={event =>
                        setEditForm(prev => ({
                          ...prev,
                          amount: event.target.value,
                        }))
                      }
                      className={inputClass}
                      placeholder="0"
                      required
                    />

                  </div>

                  {/* DATE */}

                  <div>

                    <label className={labelClass}>
                      Expense Date
                    </label>

                    <input
                      type="date"
                      value={editForm.date}
                      onChange={event =>
                        setEditForm(prev => ({
                          ...prev,
                          date: event.target.value,
                        }))
                      }
                      className={inputClass}
                      required
                    />

                  </div>

                  {/* PAYMENT METHOD */}

                  <div>

                    <label className={labelClass}>
                      Payment Method
                    </label>

                    <input
                      type="text"
                      value={editForm.paymentMethod}
                      onChange={event =>
                        setEditForm(prev => ({
                          ...prev,
                          paymentMethod:
                            event.target.value,
                        }))
                      }
                      className={inputClass}
                      placeholder="Payment method"
                      list="expense-payment-options"
                      required
                    />

                    <datalist id="expense-payment-options">
                      <option value="Cash" />
                      <option value="Card" />
                      <option value="Corporate Card" />
                      <option value="Bank Transfer" />
                      <option value="Payme / Click" />
                    </datalist>

                  </div>

                  {/* REQUESTED BY */}

                  <div className="md:col-span-2">

                    <label className={labelClass}>
                      Requested By
                    </label>

                    <input
                      type="text"
                      value={editForm.requestedBy}
                      onChange={event =>
                        setEditForm(prev => ({
                          ...prev,
                          requestedBy:
                            event.target.value,
                        }))
                      }
                      className={inputClass}
                      placeholder="Person or department"
                      required
                    />

                  </div>

                  {/* NOTES */}

                  <div className="md:col-span-2">

                    <label className={labelClass}>
                      Notes / Description
                    </label>

                    <textarea
                      rows={4}
                      value={editForm.notes}
                      onChange={event =>
                        setEditForm(prev => ({
                          ...prev,
                          notes: event.target.value,
                        }))
                      }
                      className={`${inputClass} resize-none`}
                      placeholder="Optional expense notes..."
                    />

                  </div>

                </div>

              </div>

              {/* EDIT FOOTER */}

              <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50/70 px-6 py-4 dark:border-white/10 dark:bg-white/[0.02]">

                <button
                  type="button"
                  onClick={handleCloseEdit}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.98]"
                >
                  <Save className="h-4 w-4" />

                  Save Changes
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          DELETE CONFIRMATION
      ═══════════════════════════════════════════════════════════════════════ */}

      {selectedExpenseToDelete && (

        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={() =>
            setExpenseToDelete(null)
          }
        >

          <div
            className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            onMouseDown={event =>
              event.stopPropagation()
            }
          >

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950/50">

              <AlertTriangle className="h-6 w-6 text-rose-600" />

            </div>

            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Delete this expense?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">

              You are about to permanently delete{' '}

              <span className="font-bold text-slate-800 dark:text-slate-200">
                “{selectedExpenseToDelete.title}”
              </span>

              . This action cannot be undone.

            </p>

            <div className="mt-7 flex gap-3">

              <button
                onClick={() =>
                  setExpenseToDelete(null)
                }
                className="flex-1 cursor-pointer rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                className="flex-1 cursor-pointer rounded-xl bg-rose-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-rose-600/20 transition-all hover:bg-rose-700 active:scale-[0.98]"
              >
                Delete Expense
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};