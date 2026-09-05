import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Filter,
  CalendarCheck,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

type ViewMode = 'week' | 'day' | 'month';

interface ScheduleItem {
  id: string;
  groupName: string;
  subject: string;
  teacherName: string;
  days: string[];
  time: string;
  room: string;
  studentsCount: number;
  color: string;
}

const WEEK_DAYS = [
  { id: 'dush', label: 'Dushanba', short: 'Dush' },
  { id: 'sesh', label: 'Seshanba', short: 'Sesh' },
  { id: 'chor', label: 'Chorshanba', short: 'Chor' },
  { id: 'pay', label: 'Payshanba', short: 'Pay' },
  { id: 'juma', label: 'Juma', short: 'Juma' },
  { id: 'shan', label: 'Shanba', short: 'Shan' },
  { id: 'yak', label: 'Yakshanba', short: 'Yak' },
];

export const AdminSchedulePage: React.FC = () => {
  const { groups, teachers, setActivePage, setSelectedGroupId } = useCRM();
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedDay, setSelectedDay] = useState('dush');
  const [teacherFilter, setTeacherFilter] = useState('all');

  // Concrete schedule for Lumos groups
  const scheduleItems: ScheduleItem[] = useMemo(() => {
    return [
      {
        id: 'SCH-01',
        groupName: 'Matematika (Hadicha ustoz)',
        subject: 'Matematika',
        teacherName: 'Hadicha ustoz',
        days: ['dush', 'chor', 'juma'],
        time: '14:00 - 16:00',
        room: '101-xona',
        studentsCount: 11,
        color: 'border-amber-400 bg-amber-500/10 text-amber-900 dark:text-amber-200',
      },
      {
        id: 'SCH-02',
        groupName: 'Ingliz tili (Hasanboy ustoz)',
        subject: 'Ingliz tili',
        teacherName: 'Hasanboy ustoz',
        days: ['sesh', 'pay', 'shan'],
        time: '15:30 - 17:30',
        room: '102-xona',
        studentsCount: 8,
        color: 'border-blue-400 bg-blue-500/10 text-blue-900 dark:text-blue-200',
      },
    ];
  }, []);

  const filteredItems = useMemo(() => {
    if (teacherFilter === 'all') return scheduleItems;
    return scheduleItems.filter((item) =>
      item.teacherName.toLowerCase().includes(teacherFilter.toLowerCase())
    );
  }, [scheduleItems, teacherFilter]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 mb-2">
            <CalendarCheck className="h-3.5 w-3.5 text-amber-500" />
            <span>Akademik Dars Jadvali</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Dars Jadvali & Mashg‘ulotlar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Matematika va Ingliz tili guruhlarining haftalik va kunlik dars soatlari nazorati
          </p>
        </div>

        {/* View mode switcher */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 text-xs font-bold dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode('week')}
              className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Haftalik
            </button>
            <button
              type="button"
              onClick={() => setViewMode('day')}
              className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                viewMode === 'day'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Kunlik
            </button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActivePage('attendance')}
            className="gap-1.5 font-bold cursor-pointer"
          >
            <CalendarCheck className="h-4 w-4 text-emerald-500" />
            <span>Davomatga o‘tish</span>
          </Button>
        </div>
      </div>

      {/* Filter by Teacher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/70 shadow-xs">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            O‘qituvchi bo‘yicha:
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setTeacherFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                teacherFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              Barchasi
            </button>
            <button
              type="button"
              onClick={() => setTeacherFilter('Hadicha')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                teacherFilter === 'Hadicha'
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              Hadicha ustoz
            </button>
            <button
              type="button"
              onClick={() => setTeacherFilter('Hasanboy')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                teacherFilter === 'Hasanboy'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              Hasanboy ustoz
            </button>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Darslar davomiyligi: <strong>120 daqiqa (2 soat)</strong>
        </span>
      </div>

      {/* WEEK VIEW */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {WEEK_DAYS.slice(0, 6).map((day) => {
            const dayItems = filteredItems.filter((item) => item.days.includes(day.id));

            return (
              <div
                key={day.id}
                className="rounded-2xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-col overflow-hidden shadow-xs"
              >
                {/* Day Header */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    {day.label}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {dayItems.length} ta dars
                  </span>
                </div>

                {/* Day Lessons */}
                <div className="p-3 flex-1 space-y-3 min-h-[180px]">
                  {dayItems.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center p-4">
                      <p className="text-[11px] text-slate-400 italic">
                        Ushbu kunda dars rejalashtirilmagan
                      </p>
                    </div>
                  ) : (
                    dayItems.map((lesson) => (
                      <div
                        key={lesson.id}
                        className={`p-3.5 rounded-xl border ${lesson.color} space-y-2 transition-all hover:shadow-sm cursor-pointer`}
                        onClick={() => {
                          setSelectedGroupId('GRP-01');
                          setActivePage('courses_groups');
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black tracking-tight">
                            {lesson.subject}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/70 dark:bg-slate-800/80 border border-current">
                            {lesson.room}
                          </span>
                        </div>

                        <div className="text-[11px] font-bold flex items-center gap-1 text-slate-700 dark:text-slate-200">
                          <Clock className="h-3 w-3 text-amber-500 shrink-0" />
                          <span>{lesson.time}</span>
                        </div>

                        <div className="text-[11px] flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/5 text-slate-600 dark:text-slate-300">
                          <span>{lesson.teacherName}</span>
                          <span className="font-bold">{lesson.studentsCount} o‘quvchi</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DAY VIEW */}
      {viewMode === 'day' && (
        <div className="space-y-4">
          {/* Day selection pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {WEEK_DAYS.slice(0, 6).map((day) => (
              <button
                key={day.id}
                type="button"
                onClick={() => setSelectedDay(day.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedDay === day.id
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>

          {/* Lessons on selected day */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems
              .filter((item) => item.days.includes(selectedDay))
              .map((lesson) => (
                <div
                  key={lesson.id}
                  className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 dark:text-white">
                          {lesson.groupName}
                        </h3>
                        <p className="text-xs text-slate-500">{lesson.teacherName}</p>
                      </div>
                    </div>
                    <Badge variant="warning">{lesson.room}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Vaqti</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{lesson.time}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">O‘quvchilar</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{lesson.studentsCount} nafar</span>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-center font-bold"
                    onClick={() => setActivePage('attendance')}
                  >
                    Davomat qilish
                  </Button>
                </div>
              ))}

            {filteredItems.filter((item) => item.days.includes(selectedDay)).length === 0 && (
              <div className="col-span-2 py-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-500">
                  Ushbu kunda rejalashtirilgan darslar mavjud emas
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
