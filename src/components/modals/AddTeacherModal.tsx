import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { X, GraduationCap, Sparkles } from 'lucide-react';

export const AddTeacherModal: React.FC = () => {
  const { isAddTeacherModalOpen, setIsAddTeacherModalOpen, addTeacher } = useCRM();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subjectsText, setSubjectsText] = useState('');
  const [baseSalary, setBaseSalary] = useState(2500);
  const [bonusPerStudent, setBonusPerStudent] = useState(12);
  const [schedule, setSchedule] = useState('Mon, Wed, Fri (14:00 - 18:00)');

  if (!isAddTeacherModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    const subjects = subjectsText ? subjectsText.split(',').map(s => s.trim()) : ['English'];
    const avatarId = Math.floor(Math.random() * 70) + 1;

    addTeacher({
      fullName,
      avatar: `https://randomuser.me/api/portraits/men/${avatarId}.jpg`,
      phone,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@lyumos.com`,
      subjects,
      baseSalary: Number(baseSalary),
      bonusPerStudent: Number(bonusPerStudent),
      joinedDate: new Date().toISOString().split('T')[0],
      schedule,
      status: 'Active'
    });

    setIsAddTeacherModalOpen(false);
    setFullName('');
    setPhone('');
    setSubjectsText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add New Teacher</h2>
              <p className="text-xs text-slate-500">Register instructor & set salary details</p>
            </div>
          </div>
          <button onClick={() => setIsAddTeacherModalOpen(false)} className="p-2 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name *</label>
            <input 
              type="text" 
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="e.g. Dr. Robert Vance"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone *</label>
              <input 
                type="text" 
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="teacher@lyumos.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Subjects Taught (comma separated)</label>
            <input 
              type="text" 
              value={subjectsText}
              onChange={e => setSubjectsText(e.target.value)}
              placeholder="e.g. IELTS Academic, TOEFL, SAT Verbal"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Base Monthly Salary ($)</label>
              <input 
                type="number" 
                value={baseSalary}
                onChange={e => setBaseSalary(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Bonus Per Student ($)</label>
              <input 
                type="number" 
                value={bonusPerStudent}
                onChange={e => setBonusPerStudent(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Teaching Schedule</label>
            <input 
              type="text" 
              value={schedule}
              onChange={e => setSchedule(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAddTeacherModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-500">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-[#007AFF] text-white font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Save Teacher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
