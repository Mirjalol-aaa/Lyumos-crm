import React from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  BookOpen, Plus, Users, Clock, MapPin, 
  GraduationCap, Trash2, ArrowRight 
} from 'lucide-react';

export const GroupsPage: React.FC = () => {
  const { groups, deleteGroup, setIsAddGroupModalOpen, setSelectedGroupId, settings } = useCRM();

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Study Groups ({groups.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Active course cohorts, timetables, assigned classrooms & student capacities
          </p>
        </div>

        <button
          onClick={() => setIsAddGroupModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg shadow-purple-600/25 active:scale-95 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Study Group
        </button>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(group => {
          const fillPercentage = Math.round((group.currentStudentsCount / group.maxCapacity) * 100);

          return (
            <div key={group.id} className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 bg-purple-50 dark:bg-purple-950 px-2.5 py-0.5 rounded-full">
                      {group.subject}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-1.5">{group.name}</h3>
                    <p className="text-xs text-slate-400 font-medium">{group.level}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                    {group.id}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 border-t border-b border-slate-100 dark:border-slate-800 py-3">
                  <p className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-slate-400" /> Teacher: <strong className="text-slate-900 dark:text-white">{group.teacherName}</strong></p>
                  <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /> {group.scheduleDays} ({group.scheduleTime})</p>
                  <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> {group.room}</p>
                </div>

                {/* Capacity Meter */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Students Enrolled:</span>
                    <span className="text-slate-900 dark:text-white">{group.currentStudentsCount} / {group.maxCapacity} ({fillPercentage}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full transition-all rounded-full ${fillPercentage >= 90 ? 'bg-rose-500' : 'bg-purple-600'}`}
                      style={{ width: `${fillPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Monthly Fee</span>
                  <span className="text-base font-black text-slate-900 dark:text-white">{settings.currencySymbol}{group.monthlyFee}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (confirm(`Delete group ${group.name}?`)) deleteGroup(group.id);
                    }}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
