import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { X, UserPlus, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AddStudentModal: React.FC = () => {
  const { isAddStudentModalOpen, setIsAddStudentModalOpen, groups, addStudent } = useCRM();

  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [birthDate, setBirthDate] = useState('2008-05-14');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [groupId, setGroupId] = useState(groups[0]?.id || '');
  const [notes, setNotes] = useState('');

  if (!isAddStudentModalOpen) return null;

  const selectedGroup = groups.find(g => g.id === groupId) || groups[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    const avatarId = Math.floor(Math.random() * 70) + 1;
    const avatarGender = gender === 'Male' ? 'men' : 'women';
    const avatar = `https://randomuser.me/api/portraits/${avatarGender}/${avatarId}.jpg`;

    addStudent({
      fullName,
      avatar,
      birthDate,
      gender,
      phone,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      parentName: parentName || `Parent of ${fullName}`,
      parentPhone: parentPhone || phone,
      groupId: selectedGroup.id,
      groupName: selectedGroup.name,
      teacherId: selectedGroup.teacherId,
      teacherName: selectedGroup.teacherName,
      monthlyFee: selectedGroup.monthlyFee,
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
      notes
    });

    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    setIsAddStudentModalOpen(false);
    setFullName('');
    setPhone('');
    setParentName('');
    setParentPhone('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#007AFF] flex items-center justify-center shadow-xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Add New Student</h2>
              <p className="text-xs text-slate-500">Register student into a group & set parent details</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAddStudentModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs scrollbar-thin">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Student Name *</label>
              <input 
                type="text" 
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Malika Karimova"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#007AFF] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Gender *</label>
              <div className="flex gap-2">
                {(['Male', 'Female'] as const).map(g => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setGender(g)}
                    className={`flex-1 py-2 rounded-xl font-semibold border transition-all ${
                      gender === g 
                        ? 'bg-[#007AFF] text-white border-[#007AFF]' 
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number *</label>
              <input 
                type="text" 
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#007AFF] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Birth Date</label>
              <input 
                type="date" 
                value={birthDate}
                onChange={e => setBirthDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#007AFF] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Parent Name</label>
              <input 
                type="text" 
                value={parentName}
                onChange={e => setParentName(e.target.value)}
                placeholder="Parent or Guardian"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#007AFF] focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Parent Phone</label>
              <input 
                type="text" 
                value={parentPhone}
                onChange={e => setParentPhone(e.target.value)}
                placeholder="For fee SMS notifications"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#007AFF] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Select Group *</label>
            <select
              value={groupId}
              onChange={e => setGroupId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#007AFF] focus:outline-none"
            >
              {groups.map(g => (
                <option key={g.id} value={g.id}>
                  {g.name} — Teacher: {g.teacherName} (${g.monthlyFee}/mo)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Academic Notes / Goals</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Target score, discount agreement, or learning needs..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#007AFF] focus:outline-none resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddStudentModalOpen(false)}
              className="px-4 py-2.5 rounded-xl font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#007AFF] hover:bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Save Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
