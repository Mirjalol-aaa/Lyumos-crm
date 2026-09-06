import React from 'react';
import { Teacher, Student, Group } from '../../types/crm';
import { useI18n, formatMoney } from '../../lib/i18n';
import {
  X,
  GraduationCap,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Users,
  BookOpen,
  Edit2,
  Trash2,
  CheckCircle2,
  Star,
  Clock,
  UserCheck,
} from 'lucide-react';

interface TeacherProfileModalProps {
  isOpen: boolean;
  teacher: Teacher | null;
  groups: Group[];
  students: Student[];
  onClose: () => void;
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacher: Teacher) => void;
}

export const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({
  isOpen,
  teacher,
  groups,
  students,
  onClose,
  onEdit,
  onDelete,
}) => {
  const { language } = useI18n();

  if (!isOpen || !teacher) return null;

  const teacherGroups = groups.filter(g => g.teacherId === teacher.id);
  const teacherStudents = students.filter(s => s.teacherId === teacher.id);

  const baseSalary = teacher.baseSalary || 1200000;
  const bonusPerStudent = teacher.bonusPerStudent || 15000;
  const totalPayroll = baseSalary + teacherStudents.length * bonusPerStudent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Monogram */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500/20 via-yellow-500/15 to-amber-300/20 border border-amber-400/40 text-amber-500 dark:text-amber-400 font-serif font-black text-2xl shadow-sm">
              {teacher.fullName.charAt(0).toUpperCase()}
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-lg bg-amber-500 text-slate-950 text-[10px] font-black">
                ★
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {teacher.fullName}
                </h2>
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${
                  teacher.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {teacher.status === 'Active' ? 'Faol' : teacher.status}
                </span>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-0.5">
                {teacher.subjects?.join(', ') || 'Ustoz'}
              </p>
              <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-1">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span>{teacher.rating || 5.0} KPI Ball</span>
                <span className="text-slate-400 font-normal ml-1">· ID: {teacher.id}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(teacher);
              }}
              className="p-2.5 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors cursor-pointer"
              title="Tahrirlash"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onDelete(teacher);
              }}
              className="p-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
              title="O‘chirish"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto scrollbar-thin text-xs">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Guruhlar</span>
              <span className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-500" />
                {teacherGroups.length} ta
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">O‘quvchilar</span>
              <span className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-500" />
                {teacherStudents.length} nafar
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Asosiy Oylik</span>
              <span className="text-sm font-black text-slate-900 dark:text-white block font-mono">
                {formatMoney(baseSalary, 'UZS')}
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Jami Payroll</span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 block font-mono">
                {formatMoney(totalPayroll, 'UZS')}
              </span>
            </div>
          </div>

          {/* Contact and Schedule */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Telefon:
              </span>
              <a href={`tel:${teacher.phone}`} className="font-bold text-slate-900 dark:text-white hover:text-amber-500">
                {teacher.phone}
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Email:
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {teacher.email}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Dars jadvali:
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {teacher.schedule || 'Belgilanmagan'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Ish boshlagan sana:
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {teacher.joinedDate || '2024-07-01'}
              </span>
            </div>
          </div>

          {/* Teacher's Students List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-500" />
                Biriktirilgan O‘quvchilar ({teacherStudents.length} nafar)
              </h3>
            </div>

            {teacherStudents.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Ushbu o‘qituvchiga hali o‘quvchilar biriktirilmagan.</p>
            ) : (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 max-h-56 overflow-y-auto scrollbar-thin">
                {teacherStudents.map((st, idx) => (
                  <div key={st.id} className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 font-mono text-[11px] w-5 text-right">{idx + 1}.</span>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{st.fullName}</span>
                        <span className="text-[10px] text-slate-400">{st.phone}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 block">
                        {formatMoney(st.monthlyFee, 'UZS')}
                      </span>
                      <span className={`text-[10px] font-bold ${st.status === 'Active' ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {st.status === 'Active' ? 'Faol' : 'Ketgan'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            LUMOS CRM & LMS · O‘qituvchi Boshqaruvi
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-all cursor-pointer"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};
