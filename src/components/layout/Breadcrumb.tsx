import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { ChevronRight, Home } from 'lucide-react';

const PAGE_LABELS: Record<string, string> = {
  dashboard: 'Boshqaruv Markazi',
  students_hub: 'O‘quvchilar Bazasi',
  teachers_workload: 'O‘qituvchilar & Yuklama',
  courses_groups: 'Guruhlar & Kurslar',
  attendance: 'Davomat Nazorati',
  finance_payroll: 'Moliya & Payroll',
  branches: 'Filiallar Boshqaruvi',
  credentials: 'Login & Parollar',
  reports: 'Tahliliy Hisobotlar',
  audit_settings: 'Rollar & Audit Log',
  students: 'O‘quvchilar',
  payments: 'To‘lovlar Tarixi',
  teachers: 'O‘qituvchilar',
  groups: 'Guruhlar',
  expenses: 'Xarajatlar',
  settings: 'Tizim Sozlamalari',
};

export const Breadcrumb: React.FC = () => {
  const { activePage, setActivePage, selectedStudentId, selectedTeacherId, selectedGroupId, students, teachers, groups } = useCRM();

  const getSubLabel = () => {
    if (selectedStudentId) {
      const s = students.find(item => item.id === selectedStudentId);
      return s ? s.fullName : selectedStudentId;
    }
    if (selectedTeacherId) {
      const t = teachers.find(item => item.id === selectedTeacherId);
      return t ? t.fullName : selectedTeacherId;
    }
    if (selectedGroupId) {
      const g = groups.find(item => item.id === selectedGroupId);
      return g ? g.name : selectedGroupId;
    }
    return null;
  };

  const subLabel = getSubLabel();
  const pageTitle = PAGE_LABELS[activePage] || activePage;

  return (
    <nav className="flex items-center gap-2 py-2.5 px-6 text-xs font-medium text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-900/40 border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xs">
      <button 
        onClick={() => setActivePage('dashboard')} 
        className="flex items-center gap-1.5 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-bold"
      >
        <Home className="w-3.5 h-3.5" />
        <span>LUMOS</span>
      </button>

      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

      <span className={`${!subLabel ? 'font-black text-slate-900 dark:text-white' : 'hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer'}`}
        onClick={() => subLabel && setActivePage(activePage)}
      >
        {pageTitle}
      </span>

      {subLabel && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-bold text-amber-600 dark:text-amber-400 truncate max-w-[200px]">
            {subLabel}
          </span>
        </>
      )}
    </nav>
  );
};
