import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  CalendarCheck2, CheckCircle2, XCircle, Clock, 
  AlertCircle, CheckCheck, Save, Users, Calendar 
} from 'lucide-react';
import { AttendanceStatus } from '../types/crm';
import confetti from 'canvas-confetti';

export const AttendancePage: React.FC = () => {
  const { groups, students, saveAttendance } = useCRM();

  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const activeGroup = groups.find(g => g.id === selectedGroupId) || groups[0];
  const groupStudents = students.filter(s => s.groupId === activeGroup?.id);

  // Local state for daily attendance tracking
  const [attendanceState, setAttendanceState] = useState<Record<string, AttendanceStatus>>(() => {
    const initial: Record<string, AttendanceStatus> = {};
    groupStudents.forEach(s => { initial[s.id] = 'Present'; });
    return initial;
  });

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceState(prev => ({ ...prev, [studentId]: status }));
  };

  const markAllPresent = () => {
    const updated: Record<string, AttendanceStatus> = {};
    groupStudents.forEach(s => { updated[s.id] = 'Present'; });
    setAttendanceState(updated);
  };

  const handleSave = () => {
    const records = groupStudents.map(s => ({
      date: selectedDate,
      groupId: activeGroup.id,
      studentId: s.id,
      studentName: s.fullName,
      status: attendanceState[s.id] || 'Present'
    }));

    saveAttendance(records);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
  };

  const presentCount = groupStudents.filter(s => (attendanceState[s.id] || 'Present') === 'Present').length;
  const absentCount = groupStudents.filter(s => attendanceState[s.id] === 'Absent').length;
  const lateCount = groupStudents.filter(s => attendanceState[s.id] === 'Late').length;
  const attendancePercentage = groupStudents.length > 0 ? ((presentCount / groupStudents.length) * 100).toFixed(1) : '100';

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Daily & Monthly Attendance Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Record student attendance per group, mark lates, absent notes & track percentage
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-2xl bg-[#007AFF] hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center gap-2 shrink-0"
        >
          <Save className="w-4 h-4" /> Save Attendance
        </button>
      </div>

      {/* Group & Date Select Controls */}
      <div className="p-5 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Select Group</label>
            <select
              value={selectedGroupId}
              onChange={e => setSelectedGroupId(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
            >
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.name} ({g.teacherName})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Session Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
            />
          </div>
        </div>

        {/* Quick Bulk Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={markAllPresent}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" /> Mark All Present
          </button>
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-center">
          <span className="text-xs text-slate-400 font-bold uppercase">Class Rate</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{attendancePercentage}%</p>
        </div>
        <div className="p-4 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-center">
          <span className="text-xs text-slate-400 font-bold uppercase">Present</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{presentCount}</p>
        </div>
        <div className="p-4 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-center">
          <span className="text-xs text-slate-400 font-bold uppercase">Absent</span>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{absentCount}</p>
        </div>
        <div className="p-4 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-center">
          <span className="text-xs text-slate-400 font-bold uppercase">Late</span>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{lateCount}</p>
        </div>
      </div>

      {/* Students Attendance Table */}
      <div className="p-2 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/60 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Student</th>
                <th className="p-3.5">Phone</th>
                <th className="p-3.5 text-center">Attendance Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {groupStudents.map(s => {
                const currentStatus = attendanceState[s.id] || 'Present';
                return (
                  <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img src={s.avatar} alt={s.fullName} className="w-8 h-8 rounded-full object-cover shrink-0" />
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{s.fullName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{s.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-500 font-mono">{s.phone}</td>
                    <td className="p-3.5">
                      <div className="flex items-center justify-center gap-2">
                        {(['Present', 'Absent', 'Late', 'Excused'] as const).map(st => (
                          <button
                            key={st}
                            onClick={() => handleStatusChange(s.id, st)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              currentStatus === st
                                ? st === 'Present' ? 'bg-emerald-600 text-white shadow-xs' :
                                  st === 'Absent' ? 'bg-rose-600 text-white shadow-xs' :
                                  st === 'Late' ? 'bg-amber-500 text-white shadow-xs' :
                                  'bg-blue-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
