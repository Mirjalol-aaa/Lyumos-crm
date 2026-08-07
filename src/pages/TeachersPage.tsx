import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  GraduationCap, Plus, Phone, Mail, DollarSign, 
  BookOpen, Users, Star, Trash2, Calendar 
} from 'lucide-react';

export const TeachersPage: React.FC = () => {
  const { teachers, deleteTeacher, setIsAddTeacherModalOpen, setSelectedTeacherId, settings } = useCRM();
  const [term, setTerm] = useState('');

  const filteredTeachers = teachers.filter(t => 
    t.fullName.toLowerCase().includes(term.toLowerCase()) ||
    t.subjects.some(sub => sub.toLowerCase().includes(term.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Teachers & Faculty Roster ({teachers.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage center instructors, subject specializations, salaries, bonuses & schedules
          </p>
        </div>

        <button
          onClick={() => setIsAddTeacherModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-[#007AFF] hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Teacher
        </button>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map(teacher => {
          const totalEstimatedSalary = teacher.baseSalary + (teacher.studentsCount * teacher.bonusPerStudent);

          return (
            <div key={teacher.id} className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img src={teacher.avatar} alt={teacher.fullName} className="w-14 h-14 rounded-full object-cover ring-2 ring-[#007AFF]/20 shrink-0" />
                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">{teacher.fullName}</h3>
                      <span className="text-xs text-slate-400 font-mono">{teacher.id}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950 px-2.5 py-1 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-amber-500" /> {teacher.rating}
                  </div>
                </div>

                {/* Subject Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {teacher.subjects.map(sub => (
                    <span key={sub} className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-50 text-[#007AFF] dark:bg-blue-950 dark:text-blue-300">
                      {sub}
                    </span>
                  ))}
                </div>

                {/* Contact & Schedule */}
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 border-t border-b border-slate-100 dark:border-slate-800 py-3">
                  <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {teacher.phone}</p>
                  <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /> {teacher.email}</p>
                  <p className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {teacher.schedule}</p>
                </div>

                {/* Salary Calculation Box */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Base Salary:</span>
                    <span className="font-semibold">{settings.currencySymbol}{teacher.baseSalary}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Bonus ({teacher.studentsCount} students):</span>
                    <span className="font-semibold">+{settings.currencySymbol}{teacher.studentsCount * teacher.bonusPerStudent}</span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-slate-900 dark:text-white">
                    <span>Estimated Monthly Salary:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{settings.currencySymbol}{totalEstimatedSalary}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setSelectedTeacherId(teacher.id)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold text-xs text-[#007AFF] text-center"
                >
                  View Details
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Remove teacher ${teacher.fullName}?`)) deleteTeacher(teacher.id);
                  }}
                  className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
