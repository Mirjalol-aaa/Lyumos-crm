import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { ChevronRight, Home } from 'lucide-react';

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

  return (
    <nav className="flex items-center gap-2 py-3 px-6 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/40 dark:border-slate-800/40">
      <button 
        onClick={() => setActivePage('dashboard')} 
        className="flex items-center gap-1.5 hover:text-[#007AFF] transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>LYUMOS</span>
      </button>

      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

      <span className={`capitalize ${!subLabel ? 'font-semibold text-slate-900 dark:text-white' : 'hover:text-[#007AFF] cursor-pointer'}`}
        onClick={() => subLabel && setActivePage(activePage)}
      >
        {activePage}
      </span>

      {subLabel && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-semibold text-[#007AFF] truncate max-w-[200px]">
            {subLabel}
          </span>
        </>
      )}
    </nav>
  );
};
