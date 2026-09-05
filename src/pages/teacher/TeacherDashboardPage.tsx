import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { useLMS } from '../../context/LMSContext';
import {
  Users,
  BookOpen,
  FileCheck2,
  Video,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  Award,
} from 'lucide-react';
import { TeacherPageType } from '../../components/teacher/TeacherSidebar';

interface TeacherDashboardPageProps {
  onNavigate: (page: TeacherPageType) => void;
  onOpenAddLesson?: () => void;
  onOpenAddHomework?: () => void;
}

export const TeacherDashboardPage: React.FC<TeacherDashboardPageProps> = ({
  onNavigate,
  onOpenAddLesson,
  onOpenAddHomework,
}) => {
  const { teachers, groups, students } = useCRM();
  const { activeTeacherId, setActiveTeacherId, lessons, homeworkTasks, submissions } = useLMS();

  const currentTeacher = teachers.find(t => t.id === activeTeacherId) || teachers[0];

  // Teacher's assigned groups and students
  const myGroups = groups.filter(g => g.teacherId === currentTeacher?.id);
  const myGroupIds = new Set(myGroups.map(g => g.id));
  const myStudents = students.filter(s => myGroupIds.has(s.groupId));

  const myLessons = lessons.filter(l => l.teacherId === currentTeacher?.id);
  const myTasks = homeworkTasks.filter(t => t.teacherId === currentTeacher?.id);

  const pendingSubmissions = submissions.filter(
    s => s.status === 'pending' && (myGroupIds.has(s.groupId || '') || !s.groupId)
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Teacher Switcher for Demo / Multi-Teacher testing */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-950 dark:bg-indigo-950/30">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              Faol Ustoz Profili
            </h4>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {currentTeacher?.fullName} ({currentTeacher?.subjects?.join(', ')})
            </p>
          </div>
        </div>

        {/* Teacher selector dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">
            Ustoz:
          </span>
          <select
            value={activeTeacherId}
            onChange={(e) => setActiveTeacherId(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {teachers.map(t => (
              <option key={t.id} value={t.id}>
                {t.fullName} ({t.subjects?.[0] || 'O‘qituvchi'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 p-5 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ustoz Boshqaruv Markazi</span>
            </div>

            <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
              Xush kelibsiz, {currentTeacher?.fullName}!
            </h1>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-300">
              Sizda hozirda <strong className="text-indigo-300">{myGroups.length} ta faol guruh</strong> va{' '}
              <strong className="text-indigo-300">{myStudents.length} nafar o‘quvchi</strong> mavjud. Darslar o‘tib, video yuklang va o‘quvchilar uyga vazifalarini 100 ballik tizimda baholang.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:flex sm:flex-wrap gap-2.5 sm:gap-3 w-full lg:w-auto">
            <button
              type="button"
              onClick={() => (onOpenAddLesson ? onOpenAddLesson() : onNavigate('lessons'))}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 sm:py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-700 active:scale-95"
            >
              <Video className="h-4 w-4" />
              <span>Dars & Video Qo‘shish</span>
            </button>

            <button
              type="button"
              onClick={() => (onOpenAddHomework ? onOpenAddHomework() : onNavigate('homework'))}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 sm:py-3 text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Vazifa Berish (100 ball)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Mening Guruhlarim</span>
            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{myGroups.length}</span>
            <span className="text-xs font-medium text-slate-500">ta guruh</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">O‘quvchilar Soni</span>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{myStudents.length}</span>
            <span className="text-xs font-medium text-slate-500">nafar talaba</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">O‘tilgan Darslar</span>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Video className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{myLessons.length}</span>
            <span className="text-xs font-medium text-slate-500">ta video/dars</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Kutilayotgan Vazifalar</span>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <FileCheck2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">{pendingSubmissions.length}</span>
            <span className="text-xs font-medium text-amber-600">tekshirish kerak</span>
          </div>
        </div>
      </section>

      {/* Groups & Pending Grading Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* My Groups List */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Mening Faol Guruhlarim
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('lessons')}
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              Barcha darslar <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {myGroups.map((group) => {
              const groupStudents = students.filter(s => s.groupId === group.id);
              const groupLessons = lessons.filter(l => l.groupId === group.id);

              return (
                <div
                  key={group.id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                        {group.subject}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{group.level}</span>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                      {group.name}
                    </h3>

                    <div className="mt-2 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>{group.scheduleDays} • {group.scheduleTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        <span>{groupStudents.length} / {group.maxCapacity} nafar talaba</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    <span className="text-xs font-medium text-slate-500">
                      {groupLessons.length} ta dars yozuvi
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate('lessons')}
                      className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 transition-colors hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300"
                    >
                      Darslarni ochish
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Homework Submissions Sidebar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Vazifalarni Tekshirish
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('homework')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              Barchasi ({submissions.length})
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {pendingSubmissions.length === 0 ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <Award className="h-6 w-6" />
                </div>
                <p className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-200">
                  Barcha vazifalar tekshirildi!
                </p>
                <p className="text-xs text-slate-400">
                  Yangi topshiriqlar tushganda shu yerda ko‘rinadi.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingSubmissions.slice(0, 4).map((sub) => (
                  <div
                    key={sub.id}
                    className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition-colors hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={sub.studentAvatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
                          alt={sub.studentName}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {sub.studentName}
                        </span>
                      </div>
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Kutilmoqda
                      </span>
                    </div>

                    <p className="line-clamp-1 text-xs text-slate-600 dark:text-slate-300">
                      {sub.taskTitle}
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400">
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => onNavigate('homework')}
                        className="rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-indigo-700"
                      >
                        Baholash (100 ball)
                      </button>
                    </div>
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
