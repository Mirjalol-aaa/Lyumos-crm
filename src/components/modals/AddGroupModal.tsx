import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { X, BookOpen, Sparkles } from 'lucide-react';

export const AddGroupModal: React.FC = () => {
  const { isAddGroupModalOpen, setIsAddGroupModalOpen, teachers, addGroup } = useCRM();

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('IELTS Academic');
  const [level, setLevel] = useState('Intermediate');
  const [teacherId, setTeacherId] = useState(teachers[0]?.id || '');
  const [scheduleDays, setScheduleDays] = useState('Mon, Wed, Fri');
  const [scheduleTime, setScheduleTime] = useState('15:00 - 17:00');
  const [room, setRoom] = useState('Room 201');
  const [monthlyFee, setMonthlyFee] = useState(160);
  const [maxCapacity, setMaxCapacity] = useState(16);

  if (!isAddGroupModalOpen) return null;

  const selectedTeacher = teachers.find(t => t.id === teacherId) || teachers[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addGroup({
      name,
      subject,
      level,
      teacherId: selectedTeacher.id,
      teacherName: selectedTeacher.fullName,
      scheduleDays,
      scheduleTime,
      room,
      monthlyFee: Number(monthlyFee),
      maxCapacity: Number(maxCapacity),
      status: 'Active'
    });

    setIsAddGroupModalOpen(false);
    setName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create Study Group</h2>
              <p className="text-xs text-slate-500">Configure new course cohort & assign room</p>
            </div>
          </div>
          <button onClick={() => setIsAddGroupModalOpen(false)} className="p-2 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Group Title *</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. IELTS Masterclass 8.0+"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Subject</label>
              <input 
                type="text" 
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Level / Band</label>
              <input 
                type="text" 
                value={level}
                onChange={e => setLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Assigned Teacher *</label>
            <select
              value={teacherId}
              onChange={e => setTeacherId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.fullName} ({t.subjects.join(', ')})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Schedule Days</label>
              <input 
                type="text" 
                value={scheduleDays}
                onChange={e => setScheduleDays(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Time Slot</label>
              <input 
                type="text" 
                value={scheduleTime}
                onChange={e => setScheduleTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Classroom</label>
              <input 
                type="text" 
                value={room}
                onChange={e => setRoom(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Monthly Fee ($)</label>
              <input 
                type="number" 
                value={monthlyFee}
                onChange={e => setMonthlyFee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Max Capacity</label>
              <input 
                type="number" 
                value={maxCapacity}
                onChange={e => setMaxCapacity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={() => setIsAddGroupModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-500">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
