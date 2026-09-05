import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Plus,
  Users,
  Sparkles,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

interface Assignment {
  id: string;
  title: string;
  groupName: string;
  teacherName: string;
  dueDate: string;
  submissionsCount: number;
  totalStudents: number;
  description: string;
  status: 'Faol' | 'Tugatilgan';
}

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'HW-01',
    title: 'Algebra: Kvadrat tenglamalar va Viyet teoremasi',
    groupName: 'Matematika (Hadicha ustoz)',
    teacherName: 'Hadicha ustoz',
    dueDate: '2025-09-08',
    submissionsCount: 9,
    totalStudents: 11,
    description: '10 ta matnli masala va Viyet teoremasiga oid 5 ta murakkab misollar yechimi.',
    status: 'Faol',
  },
  {
    id: 'HW-02',
    title: 'IELTS Writing Task 1: Bar Chart Essay & 30 ta yangi so‘z',
    groupName: 'Ingliz tili (Hasanboy ustoz)',
    teacherName: 'Hasanboy ustoz',
    dueDate: '2025-09-09',
    submissionsCount: 7,
    totalStudents: 8,
    description: 'Bar chart tahlili bo‘yicha 150 so‘zdan iborat insho yozish va yangi lug‘atni yodlash.',
    status: 'Faol',
  },
  {
    id: 'HW-03',
    title: 'Geometriya: Uchburchaklar tengligi va Pifagor teoremasi',
    groupName: 'Matematika (Hadicha ustoz)',
    teacherName: 'Hadicha ustoz',
    dueDate: '2025-09-01',
    submissionsCount: 11,
    totalStudents: 11,
    description: 'Chizmalar bilan ishlash va fazoviy shakllar yuzasini hisoblash.',
    status: 'Tugatilgan',
  },
];

export const AdminHomeworkPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'Faol' | 'Tugatilgan'>('all');

  const filtered = assignments.filter((a) =>
    activeFilter === 'all' ? true : a.status === activeFilter
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 mb-2">
            <BookOpen className="h-3.5 w-3.5 text-amber-500" />
            <span>Ta’lim Nazorati</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Uy Vazifalari & Topshiriqlar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Ustozlar tomonidan yuklangan vazifalar va o‘quvchilarning topshirish ko‘rsatkichlari
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-xs font-bold">
          {(['all', 'Faol', 'Tugatilgan'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeFilter === f
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {f === 'all' ? 'Barchasi' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((hw) => {
          const percent = Math.round((hw.submissionsCount / hw.totalStudents) * 100);

          return (
            <div
              key={hw.id}
              className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-xl bg-amber-500/10 px-2.5 py-1 text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">
                    {hw.groupName.includes('Matematika') ? 'Matematika' : 'Ingliz tili'}
                  </span>
                  <Badge variant={hw.status === 'Faol' ? 'success' : 'neutral'}>
                    {hw.status}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                    {hw.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {hw.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-semibold">{hw.teacherName}</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="h-3 w-3" />
                    Muddat: {hw.dueDate}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400">Topshirildi:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-mono">
                    {hw.submissionsCount} / {hw.totalStudents} ({percent}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
