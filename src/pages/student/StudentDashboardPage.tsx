import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { useLMS } from '../../context/LMSContext';
import { StudentPageType } from '../../components/student/StudentSidebar';
import {
  Trophy,
  Award,
  Calendar,
  Clock,
  PlayCircle,
  FileCheck2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CreditCard,
} from 'lucide-react';

interface StudentDashboardPageProps {
  onNavigate: (page: StudentPageType) => void;
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({ onNavigate }) => {
  const { students, groups, attendanceRecords } = useCRM();
  const { activeStudentId, setActiveStudentId, lessons, homeworkTasks, submissions, getLeaderboard } = useLMS();

  const currentStudent = students.find(s => s.id === activeStudentId) || students[0];
  const myGroup = groups.find(g => g.id === currentStudent?.groupId);

  const myLessons = lessons.filter(l => l.groupId === currentStudent?.groupId);
  const myTasks = homeworkTasks.filter(t => t.groupId === currentStudent?.groupId);

  const mySubmissions = submissions.filter(s => s.studentId === currentStudent?.id);
  const gradedSubmissions = mySubmissions.filter(s => s.status === 'graded' && s.score !== null);

  const totalScore = gradedSubmissions.reduce((acc, curr) => acc + (curr.score || 0), 0);
  const averageScore = gradedSubmissions.length > 0 ? Math.round(totalScore / gradedSubmissions.length) : 94;

  const myAttendance = attendanceRecords.filter(r => r.studentId === currentStudent?.id);
  const attendedCount = myAttendance.filter(r => r.status === 'Present' || r.status === 'Late').length;
  const attendancePercentage = myAttendance.length > 0 ? Math.round((attendedCount / myAttendance.length) * 100) : 98;

  // Student ranking in group
  const groupLeaderboard = getLeaderboard(currentStudent?.groupId);
  const myRank = groupLeaderboard.find(item => item.studentId === currentStudent?.id)?.rank || 1;

  const submittedTaskIds = new Set(mySubmissions.map(s => s.taskId));
  const pendingTasks = myTasks.filter(t => !submittedTaskIds.has(t.id));

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Student Switcher for Demo / Multi-Student testing */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-950 dark:bg-emerald-950/30">
        <div className="flex items-center gap-3">
          <img
            src={currentStudent?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
            alt={currentStudent?.fullName}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-500/30"
          />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Faol Talaba Profili
            </h4>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {currentStudent?.fullName} • {myGroup?.name || 'Guruh'}
            </p>
          </div>
        </div>

        {/* Student selector dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Talabani o‘zgartirish:
          </span>
          <select
            value={activeStudentId}
            onChange={(e) => setActiveStudentId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {students.slice(0, 15).map(s => (
              <option key={s.id} value={s.id}>
                {s.fullName} ({s.groupName || 'Guruh'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 p-6 text-white shadow-xl sm:p-8">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>O‘quvchi Shaxsiy Kabineti</span>
            </div>

            <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
              Salom, {currentStudent?.fullName}!
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Guruh: <strong className="text-emerald-300">{myGroup?.name}</strong> • Ustoz:{' '}
              <strong className="text-emerald-300">{currentStudent?.teacherName}</strong>. Dars videolarini tomosha qiling, uyga vazifalarni topshiring va guruh reytingida yuqori o‘rinni egallang!
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('lessons')}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-700 active:scale-95"
            >
              <PlayCircle className="h-4 w-4" />
              Dars Videolari
            </button>

            <button
              type="button"
              onClick={() => onNavigate('homework')}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
            >
              <FileCheck2 className="h-4 w-4" />
              Vazifani Topshirish ({pendingTasks.length})
            </button>
          </div>
        </div>
      </section>

      {/* KPI Stats Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Average Score */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">O‘rtacha Baho</span>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{averageScore}</span>
            <span className="text-xs font-medium text-slate-500">/ 100 ball</span>
          </div>
        </div>

        {/* Group Rank */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Guruhdagi O‘rni</span>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Trophy className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">#{myRank}</span>
            <span className="text-xs font-medium text-slate-500">o‘rinda (Top)</span>
          </div>
        </div>

        {/* Attendance */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Davomat Ko‘rsatkichi</span>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{attendancePercentage}%</span>
            <span className="text-xs font-medium text-emerald-600">A‘lo darajada</span>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Kutilayotgan Vazifalar</span>
            <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <FileCheck2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{pendingTasks.length}</span>
            <span className="text-xs font-medium text-slate-500">ta topshiriq</span>
          </div>
        </div>
      </section>

      {/* Grid: Schedule & Graded Homework */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Schedule & Group Info */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Dars Jadvali & Guruh Tafsilotlari
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-bold">Dars Kunlari & Vaqti:</span>
                </div>
                <p className="mt-2 text-sm font-bold text-slate-800 dark:text-white">
                  {myGroup?.scheduleDays} • {myGroup?.scheduleTime}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Xona: {myGroup?.room || '301-auditoriya'}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Award className="h-4 w-4 text-indigo-600" />
                  <span className="text-xs font-bold">Fan & O‘qituvchi:</span>
                </div>
                <p className="mt-2 text-sm font-bold text-slate-800 dark:text-white">
                  {myGroup?.subject} ({myGroup?.level})
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Ustoz: {currentStudent?.teacherName}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <span className="text-xs text-slate-500">
                Jami {myLessons.length} ta o‘tilgan dars mavjud
              </span>
              <button
                type="button"
                onClick={() => onNavigate('lessons')}
                className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
              >
                Darslarni ko‘rish <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Pending Tasks Quick List */}
          {pendingTasks.length > 0 && (
            <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-5 dark:border-rose-950 dark:bg-rose-950/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="h-5 w-5 text-rose-600" />
                  <h3 className="text-sm font-bold text-rose-900 dark:text-rose-300">
                    Topshirilishi kerak bo‘lgan vazifalar ({pendingTasks.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('homework')}
                  className="text-xs font-bold text-rose-700 hover:underline dark:text-rose-400"
                >
                  Topshirish
                </button>
              </div>

              <div className="mt-3 space-y-2">
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm dark:bg-slate-900"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {task.title}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Maksimal: {task.maxScore} ball
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onNavigate('homework')}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                    >
                      Topshirish
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Graded Tasks & Feedback */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Baholangan Vazifalarim
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('homework')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              Barchasi
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {gradedSubmissions.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">
                Hozircha baholangan vazifalar yo‘q.
              </p>
            ) : (
              <div className="space-y-3">
                {gradedSubmissions.slice(0, 3).map((sub) => (
                  <div
                    key={sub.id}
                    className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {sub.taskTitle || 'Uyga vazifa'}
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {sub.score} / {sub.maxScore || 100} ball
                      </span>
                    </div>

                    {sub.teacherFeedback && (
                      <div className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        <p className="font-semibold text-slate-700 dark:text-slate-300">Ustoz izohi:</p>
                        <p className="mt-0.5 italic">"{sub.teacherFeedback}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
