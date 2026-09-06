import React, { useState, useEffect } from 'react';
import { Teacher } from '../../types/crm';
import { useI18n } from '../../lib/i18n';
import { X, GraduationCap, Save, Star, Phone, Mail, DollarSign, Calendar } from 'lucide-react';

const COMMON_SUBJECTS = ['Matematika', 'Ingliz tili', 'Ona tili', 'Fizika', 'Kimyo', 'Biologiya', 'Tarix', 'IT & Dasturlash'];

interface EditTeacherModalProps {
  isOpen: boolean;
  teacher: Teacher | null;
  onClose: () => void;
  onSave: (id: string, updated: Partial<Teacher>) => void;
}

export const EditTeacherModal: React.FC<EditTeacherModalProps> = ({
  isOpen,
  teacher,
  onClose,
  onSave,
}) => {
  const { language } = useI18n();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [customSubject, setCustomSubject] = useState('');
  const [baseSalary, setBaseSalary] = useState(1200000);
  const [bonusPerStudent, setBonusPerStudent] = useState(15000);
  const [schedule, setSchedule] = useState('');
  const [status, setStatus] = useState<'Active' | 'On Leave' | 'Inactive'>('Active');
  const [rating, setRating] = useState(5.0);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (teacher) {
      setFullName(teacher.fullName || '');
      setPhone(teacher.phone || '');
      setEmail(teacher.email || '');
      setSelectedSubjects(teacher.subjects || ['Matematika']);
      setBaseSalary(teacher.baseSalary || 1200000);
      setBonusPerStudent(teacher.bonusPerStudent || 15000);
      setSchedule(teacher.schedule || '');
      setStatus((teacher.status as any) || 'Active');
      setRating(teacher.rating || 5.0);
      setIsSuccess(false);
    }
  }, [teacher, isOpen]);

  if (!isOpen || !teacher) return null;

  const toggleSubject = (sub: string) => {
    setSelectedSubjects(prev =>
      prev.includes(sub) ? (prev.length > 1 ? prev.filter(s => s !== sub) : prev) : [...prev, sub]
    );
  };

  const handleAddCustomSubject = () => {
    if (customSubject.trim() && !selectedSubjects.includes(customSubject.trim())) {
      setSelectedSubjects(prev => [...prev, customSubject.trim()]);
      setCustomSubject('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    onSave(teacher.id, {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      subjects: selectedSubjects,
      baseSalary: Number(baseSalary) || 1200000,
      bonusPerStudent: Number(bonusPerStudent) || 15000,
      schedule: schedule.trim(),
      status,
      rating: Number(rating) || 5.0,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {language === 'en' ? 'Edit Teacher' : language === 'ru' ? 'Редактировать Преподавателя' : 'O‘qituvchini Tahrirlash'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {teacher.fullName} ({teacher.id})
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto scrollbar-thin text-xs">
          {/* Full Name */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              {language === 'en' ? 'Full Name *' : language === 'ru' ? 'Ф.И.О Преподавателя *' : 'O‘qituvchi F.I.SH *'}
            </label>
            <input 
              type="text" 
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {language === 'en' ? 'Phone Number *' : language === 'ru' ? 'Номер телефона *' : 'Telefon raqami *'}
              </label>
              <input 
                type="text" 
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Email
              </label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Subjects selection */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              {language === 'en' ? 'Teaching Subjects' : language === 'ru' ? 'Преподаваемые предметы' : 'Dars beradigan fani / yo‘nalishi'}
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {COMMON_SUBJECTS.map((sub) => {
                const active = selectedSubjects.includes(sub);
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => toggleSubject(sub)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                      active
                        ? 'bg-blue-600 text-white font-black shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {sub} {active && '✓'}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={customSubject}
                onChange={e => setCustomSubject(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomSubject(); } }}
                placeholder={language === 'en' ? 'Add custom subject...' : 'Boshqa fan qo‘shish...'}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
              <button
                type="button"
                onClick={handleAddCustomSubject}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Salary & Bonus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {language === 'en' ? 'Base Monthly Salary (so‘m)' : language === 'ru' ? 'Базовая ставка (сум)' : 'Asosiy oylik maosh (so‘m)'}
              </label>
              <input 
                type="number" 
                step="50000"
                value={baseSalary}
                onChange={e => setBaseSalary(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {language === 'en' ? 'Bonus Per Student (so‘m)' : language === 'ru' ? 'Бонус за ученика (сум)' : 'Har bir o‘quvchiga bonus (so‘m)'}
              </label>
              <input 
                type="number" 
                step="5000"
                value={bonusPerStudent}
                onChange={e => setBonusPerStudent(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>
          </div>

          {/* Schedule & Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {language === 'en' ? 'Teaching Schedule' : language === 'ru' ? 'График занятий' : 'Dars kunlari va vaqti'}
              </label>
              <input 
                type="text" 
                value={schedule}
                onChange={e => setSchedule(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {language === 'en' ? 'KPI Rating (1-5)' : language === 'ru' ? 'Рейтинг KPI' : 'KPI Reyting'}
              </label>
              <input 
                type="number" 
                step="0.1"
                min="1"
                max="5"
                value={rating}
                onChange={e => setRating(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-4 pt-1">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {language === 'en' ? 'Status:' : language === 'ru' ? 'Статус:' : 'Holati:'}
            </span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="edit_status" 
                checked={status === 'Active'} 
                onChange={() => setStatus('Active')}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {language === 'en' ? 'Active' : language === 'ru' ? 'Активный' : 'Faol'}
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="edit_status" 
                checked={status === 'On Leave'} 
                onChange={() => setStatus('On Leave')}
                className="text-amber-500 focus:ring-amber-500"
              />
              <span className="font-medium text-amber-600 dark:text-amber-400">
                {language === 'en' ? 'On Leave' : language === 'ru' ? 'В отпуске' : 'Ta’tilda'}
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="edit_status" 
                checked={status === 'Inactive'} 
                onChange={() => setStatus('Inactive')}
                className="text-rose-500 focus:ring-rose-500"
              />
              <span className="font-medium text-rose-500">
                {language === 'en' ? 'Inactive' : language === 'ru' ? 'Неактивен' : 'Nofaol'}
              </span>
            </label>
          </div>

          {isSuccess && (
            <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950 p-3 text-center text-xs font-black text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 animate-in fade-in">
              🎉 {language === 'en' ? 'Changes saved successfully!' : language === 'ru' ? 'Изменения успешно сохранены!' : 'O‘zgarishlar muvaffaqiyatli saqlandi!'}
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-all cursor-pointer"
            >
              {language === 'en' ? 'Cancel' : language === 'ru' ? 'Отмена' : 'Bekor qilish'}
            </button>
            <button 
              type="submit" 
              disabled={isSuccess}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> 
              <span>{language === 'en' ? 'Save Changes' : language === 'ru' ? 'Сохранить изменения' : 'Saqlash'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
