import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { 
  X, Phone, Mail, UserCheck, Calendar, DollarSign, 
  BookOpen, GraduationCap, MapPin, CheckCircle2, Clock, AlertCircle, Edit3, Trash2 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const StudentProfileModal: React.FC = () => {
  const { 
    selectedStudentId, 
    setSelectedStudentId, 
    students, 
    deleteStudent, 
    setIsReceivePaymentModalOpen, 
    setPaymentModalDefaultStudentId,
    settings 
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'payments' | 'info' | 'attendance'>('payments');

  if (!selectedStudentId) return null;

  const student = students.find(s => s.id === selectedStudentId);
  if (!student) return null;

  const handleReceivePayment = () => {
    setPaymentModalDefaultStudentId(student.id);
    setIsReceivePaymentModalOpen(true);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
  };

  const MONTHS = ["August", "September", "October", "November", "December", "January", "February", "March", "April", "May", "June", "July"];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"><CheckCircle2 className="w-3 h-3" /> Paid</span>;
      case 'Discount':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"><CheckCircle2 className="w-3 h-3" /> Discount</span>;
      case 'Overdue':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"><AlertCircle className="w-3 h-3" /> Overdue</span>;
      case 'Frozen':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"><Clock className="w-3 h-3" /> Frozen</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"><Clock className="w-3 h-3" /> Unpaid</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Profile Banner */}
        <div className="relative p-6 bg-gradient-to-r from-blue-600 to-[#007AFF] text-white">
          <button 
            onClick={() => setSelectedStudentId(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img 
              src={student.avatar} 
              alt={student.fullName} 
              className="w-20 h-20 rounded-full object-cover ring-4 ring-white/30 shadow-xl shrink-0" 
            />
            
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-extrabold tracking-tight">{student.fullName}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md">
                  {student.id}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  student.status === 'Active' ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/30' : 'bg-amber-400/20 text-amber-200'
                }`}>
                  {student.status}
                </span>
              </div>

              <p className="text-sm text-blue-100 mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1">
                <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {student.groupName}</span>
                <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> {student.teacherName}</span>
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <button
                  onClick={handleReceivePayment}
                  className="px-4 py-2 rounded-xl bg-white text-[#007AFF] text-xs font-bold shadow-md hover:bg-blue-50 transition-colors flex items-center gap-1.5"
                >
                  <DollarSign className="w-4 h-4" /> Receive Payment
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${student.fullName}?`)) {
                      deleteStudent(student.id);
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-white text-xs font-semibold backdrop-blur-md transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-6">
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'payments' 
                ? 'border-[#007AFF] text-[#007AFF]' 
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" /> August - July Payment Matrix
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'info' 
                ? 'border-[#007AFF] text-[#007AFF]' 
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Parent & Personal Details
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase">Monthly Base Fee</span>
                  <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {settings.currencySymbol}{student.monthlyFee}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Academic Period</span>
                  <p className="text-sm font-bold text-[#007AFF] mt-0.5">
                    2025 - 2026 Season
                  </p>
                </div>
              </div>

              {/* Monthly Matrix Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3">Month</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Amount Paid</th>
                      <th className="p-3">Payment Date</th>
                      <th className="p-3">Receipt / Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {MONTHS.map(month => {
                      const p = student.payments[month] || { status: 'Unpaid', amountPaid: 0, discount: 0 };
                      return (
                        <tr key={month} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                          <td className="p-3 font-bold text-slate-900 dark:text-white">{month}</td>
                          <td className="p-3">{getStatusBadge(p.status)}</td>
                          <td className="p-3 font-semibold text-slate-900 dark:text-white">
                            {p.amountPaid > 0 ? `${settings.currencySymbol}${p.amountPaid}` : '-'}
                          </td>
                          <td className="p-3 text-slate-500">{p.paymentDate || '-'}</td>
                          <td className="p-3 text-slate-500">
                            {p.receiptNo ? (
                              <span className="font-mono text-[11px] text-[#007AFF] bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded">
                                {p.receiptNo} ({p.method})
                              </span>
                            ) : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#007AFF]" /> Student Contact Info
                </h4>
                <div className="space-y-2 text-slate-600 dark:text-slate-300">
                  <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {student.phone}</p>
                  <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /> {student.email}</p>
                  <p className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Birthday: {student.birthDate}</p>
                  <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {student.address || 'Address on file'}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-500" /> Parent / Guardian Info
                </h4>
                <div className="space-y-2 text-slate-600 dark:text-slate-300">
                  <p className="font-semibold text-slate-900 dark:text-white">{student.parentName}</p>
                  <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {student.parentPhone}</p>
                  <p className="text-slate-400 text-[11px] mt-2">Receives automatic SMS fee reminders & attendance updates.</p>
                </div>
              </div>

              {student.notes && (
                <div className="md:col-span-2 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200">
                  <span className="font-bold text-xs block mb-1">Academic Notes</span>
                  <p className="text-xs leading-relaxed">{student.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
