import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  CreditCard, DollarSign, Search, CheckCircle2, AlertCircle, 
  Clock, Plus, ArrowUpRight 
} from 'lucide-react';

export const PaymentsPage: React.FC = () => {
  const { 
    students, 
    setIsReceivePaymentModalOpen, 
    setPaymentModalDefaultStudentId,
    setSelectedStudentId,
    settings 
  } = useCRM();

  const [term, setTerm] = useState('');
  const [activeMonthFilter, setActiveMonthFilter] = useState('August');

  const MONTHS = ["August", "September", "October", "November", "December", "January", "February", "March", "April", "May", "June", "July"];

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(term.toLowerCase()) ||
    s.id.toLowerCase().includes(term.toLowerCase()) ||
    s.groupName.toLowerCase().includes(term.toLowerCase())
  );

  const getCellBadge = (student: typeof students[0], month: string) => {
    const p = student.payments[month] || { status: 'Unpaid', amountPaid: 0 };

    switch (p.status) {
      case 'Paid':
        return (
          <button 
            onClick={() => setSelectedStudentId(student.id)}
            className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1 hover:scale-105 transition-transform"
          >
            <CheckCircle2 className="w-3 h-3" /> {settings.currencySymbol}{p.amountPaid}
          </button>
        );
      case 'Discount':
        return (
          <button 
            onClick={() => setSelectedStudentId(student.id)}
            className="px-2 py-1 rounded-lg text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1 hover:scale-105 transition-transform"
          >
            <CheckCircle2 className="w-3 h-3" /> {settings.currencySymbol}{p.amountPaid}
          </button>
        );
      case 'Overdue':
        return (
          <button 
            onClick={() => {
              setPaymentModalDefaultStudentId(student.id);
              setIsReceivePaymentModalOpen(true);
            }}
            className="px-2 py-1 rounded-lg text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-1 hover:scale-105 transition-transform"
          >
            <AlertCircle className="w-3 h-3" /> Due
          </button>
        );
      case 'Frozen':
        return (
          <span className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-500 dark:bg-slate-800">
            Frozen
          </span>
        );
      default:
        return (
          <button 
            onClick={() => {
              setPaymentModalDefaultStudentId(student.id);
              setIsReceivePaymentModalOpen(true);
            }}
            className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 flex items-center gap-1 hover:scale-105 transition-transform"
          >
            <Clock className="w-3 h-3" /> Pay
          </button>
        );
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Academic Year Payment Matrix (August — July)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time monthly fee collection tracking, discount audit & payment status for all students
          </p>
        </div>

        <button
          onClick={() => setIsReceivePaymentModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 active:scale-95 transition-all flex items-center gap-2 shrink-0"
        >
          <DollarSign className="w-4 h-4" /> Receive Payment
        </button>
      </div>

      {/* Quick Search & Month Tabs */}
      <div className="p-4 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={term}
              onChange={e => setTerm(e.target.value)}
              placeholder="Filter by student name, ID or group..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs focus:ring-2 focus:ring-[#007AFF] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span>Filter Active Month:</span>
            <select
              value={activeMonthFilter}
              onChange={e => setActiveMonthFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
            >
              {MONTHS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Payment Grid Table */}
      <div className="p-2 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs min-w-[1100px]">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/60 dark:border-slate-800">
              <tr>
                <th className="p-3.5 sticky left-0 bg-slate-50 dark:bg-slate-800 z-10 w-48 shadow-xs">Student</th>
                <th className="p-3.5">Group</th>
                <th className="p-3.5">Fee</th>
                {MONTHS.map(m => (
                  <th key={m} className={`p-3.5 text-center ${m === activeMonthFilter ? 'bg-blue-50/80 dark:bg-blue-950/60 text-[#007AFF] font-extrabold' : ''}`}>
                    {m.slice(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 sticky left-0 bg-white dark:bg-slate-900 z-10 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <img src={student.avatar} alt={student.fullName} className="w-7 h-7 rounded-full object-cover shrink-0" />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 dark:text-white block truncate max-w-[120px]">
                          {student.fullName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{student.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-medium text-slate-600 dark:text-slate-300 truncate max-w-[120px]">
                    {student.groupName}
                  </td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                    {settings.currencySymbol}{student.monthlyFee}
                  </td>
                  {MONTHS.map(month => (
                    <td key={month} className={`p-2 text-center ${month === activeMonthFilter ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''}`}>
                      <div className="flex justify-center">
                        {getCellBadge(student, month)}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
