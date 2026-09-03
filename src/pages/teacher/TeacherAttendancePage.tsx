import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { useLMS } from '../../context/LMSContext';
import { AttendanceStatus } from '../../types/crm';
import {
  CalendarCheck2,
  Save,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Users,
} from 'lucide-react';

export const TeacherAttendancePage: React.FC = () => {
  const { groups, students, attendanceRecords, saveAttendance, teachers } = useCRM();
  const { activeTeacherId } = useLMS();

  const currentTeacher = teachers.find(t => t.id === activeTeacherId) || teachers[0];
  const myGroups = groups.filter(g => g.teacherId === currentTeacher?.id);

  const [selectedGroupId, setSelectedGroupId] = useState<string>(
    myGroups[0]?.id || groups[0]?.id || ''
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [localStatuses, setLocalStatuses] = useState<Record<string, AttendanceStatus>>({});
  const [isSaved, setIsSaved] = useState(false);

  const currentGroup = groups.find(g => g.id === selectedGroupId);
  const groupStudents = students.filter(s => s.groupId === selectedGroupId);

  const getStudentStatus = (studentId: string): AttendanceStatus => {
    if (localStatuses[studentId]) return localStatuses[studentId];
    const existing = attendanceRecords.find(
      r => r.studentId === studentId && r.date === selectedDate
    );
    return existing?.status || 'Present';
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setLocalStatuses(prev => ({
      ...prev,
      [studentId]: status,
    }));
    setIsSaved(false);
  };

  const handleSaveAll = () => {
    const recordsToSave = groupStudents.map(student => ({
      date: selectedDate,
      groupId: selectedGroupId,
      groupName: currentGroup?.name || 'Guruh',
      studentId: student.id,
      studentName: student.fullName,
      status: getStudentStatus(student.id),
    }));

    saveAttendance(recordsToSave);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Guruh Davomatini Olish
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Darsda qatnashgan o‘quvchilarni belgilang va saqlang. Bu o‘quvchilarning umumiy reytingiga ta’sir qiladi.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-700 active:scale-95"
        >
          <Save className="h-4 w-4" />
          {isSaved ? 'Saqlandi! ✓' : 'Davomatni Saqlash'}
        </button>
      </div>

      {/* Selectors */}
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <label className="text-[11px] font-bold text-slate-500">Guruhni tanlang:</label>
          <select
            value={selectedGroupId}
            onChange={(e) => {
              setSelectedGroupId(e.target.value);
              setLocalStatuses({});
            }}
            className="mt-1 block rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {myGroups.map(g => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.subject})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-500">Dars sanasi:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setLocalStatuses({});
            }}
            className="mt-1 block rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
          </input>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const allPresent: Record<string, AttendanceStatus> = {};
              groupStudents.forEach(s => {
                allPresent[s.id] = 'Present';
              });
              setLocalStatuses(allPresent);
            }}
            className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300"
          >
            Barchani "Keldi" qilish
          </button>
        </div>
      </div>

      {/* Students Attendance Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
              <tr>
                <th className="px-5 py-3">O‘quvchi</th>
                <th className="px-5 py-3">Holat (Status)</th>
                <th className="px-5 py-3 text-right">Tezkor Belgilash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {groupStudents.map((student) => {
                const currentStatus = getStudentStatus(student.id);

                return (
                  <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.fullName}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {student.fullName}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {student.phone}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          currentStatus === 'Present'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : currentStatus === 'Absent'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : currentStatus === 'Late'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {currentStatus === 'Present' && <CheckCircle2 className="h-3 w-3" />}
                        {currentStatus === 'Absent' && <XCircle className="h-3 w-3" />}
                        {currentStatus === 'Late' && <Clock className="h-3 w-3" />}
                        {currentStatus === 'Excused' && <HelpCircle className="h-3 w-3" />}
                        {currentStatus === 'Present' ? 'Keldi' : currentStatus === 'Absent' ? 'Kelmadi' : currentStatus === 'Late' ? 'Kechikdi' : 'Sababli'}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex rounded-xl border border-slate-200 p-1 dark:border-slate-700">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'Present')}
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                            currentStatus === 'Present'
                              ? 'bg-emerald-600 text-white'
                              : 'text-slate-600 hover:text-emerald-600 dark:text-slate-400'
                          }`}
                        >
                          Keldi
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'Absent')}
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                            currentStatus === 'Absent'
                              ? 'bg-rose-600 text-white'
                              : 'text-slate-600 hover:text-rose-600 dark:text-slate-400'
                          }`}
                        >
                          Kelmadi
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(student.id, 'Late')}
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                            currentStatus === 'Late'
                              ? 'bg-amber-600 text-white'
                              : 'text-slate-600 hover:text-amber-600 dark:text-slate-400'
                          }`}
                        >
                          Kechikdi
                        </button>
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
