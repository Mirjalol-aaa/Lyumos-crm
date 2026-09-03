import React from 'react';
import { useLMS } from '../../context/LMSContext';
import { ShieldAlert, GraduationCap, Users, Sparkles } from 'lucide-react';
import { UserRole } from '../../types/lms';

export const RolePortalSwitcher: React.FC = () => {
  const { currentRole, setCurrentRole } = useLMS();

  return (
    <div className="sticky top-0 z-40 flex items-center justify-between border-b border-indigo-200/40 bg-slate-900 px-4 py-2 text-white shadow-md">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-amber-400" />
        <span className="hidden text-xs font-black uppercase tracking-wider text-slate-300 sm:inline">
          LUMOS Tizimi:
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setCurrentRole('admin')}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
            currentRole === 'admin'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          <span>Super Admin</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentRole('teacher')}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
            currentRole === 'teacher'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <GraduationCap className="h-3.5 w-3.5" />
          <span>Ustoz Paneli</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentRole('student')}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
            currentRole === 'student'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          <span>O‘quvchi Kabineti</span>
        </button>
      </div>
    </div>
  );
};
