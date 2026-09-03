import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { INITIAL_COURSES } from '../../data/coursesData';
import { Course } from '../../types/admin';
import { Group } from '../../types/crm';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import {
  BookOpen,
  Plus,
  Users,
  Clock,
  Calendar,
  Sparkles,
  Layers,
  ArrowRight,
  UserCheck,
  Building,
} from 'lucide-react';

export const AdminCoursesGroupsPage: React.FC = () => {
  const { groups, teachers, students, setIsAddGroupModalOpen } = useCRM();
  const [activeView, setActiveView] = useState<'groups' | 'courses'>('groups');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const groupsTableData = useMemo(() => {
    return groups.map(group => {
      const studentCount = students.filter(s => s.groupId === group.id).length;
      const fillPercentage = Math.round((studentCount / (group.maxCapacity || 16)) * 100);

      return {
        ...group,
        actualStudentsCount: studentCount,
        fillPercentage,
      };
    });
  }, [groups, students]);

  const groupColumns: Column<typeof groupsTableData[0]>[] = [
    {
      key: 'name',
      header: 'Guruh Nomi & Fan',
      sortable: true,
      render: (g) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white">{g.name}</span>
          <p className="text-[10px] text-slate-400">
            {g.subject} • {g.level}
          </p>
        </div>
      ),
    },
    {
      key: 'teacherName',
      header: 'Biriktirilgan Ustoz',
      sortable: true,
      render: (g) => (
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
            {g.teacherName?.slice(0, 2) || 'UT'}
          </div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {g.teacherName}
          </span>
        </div>
      ),
    },
    {
      key: 'scheduleTime',
      header: 'Dars Jadvali & Xona',
      render: (g) => (
        <div className="text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {g.scheduleDays}
          </span>
          <p className="text-[10px] text-slate-400">
            {g.scheduleTime} • {g.room || 'Xona 201'}
          </p>
        </div>
      ),
    },
    {
      key: 'fillPercentage',
      header: 'Sig‘im (To‘lganlik %)',
      sortable: true,
      render: (g) => (
        <div className="min-w-[120px] space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-slate-600 dark:text-slate-400">
              {g.actualStudentsCount} / {g.maxCapacity} talaba
            </span>
            <span
              className={
                g.fillPercentage >= 95
                  ? 'text-rose-600'
                  : g.fillPercentage <= 50
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }
            >
              {g.fillPercentage}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
            <div
              className={`h-full rounded-full ${
                g.fillPercentage >= 95
                  ? 'bg-rose-500'
                  : g.fillPercentage <= 50
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${g.fillPercentage}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'monthlyFee',
      header: 'Oylik To‘lov',
      sortable: true,
      align: 'right',
      render: (g) => (
        <span className="font-black text-slate-900 dark:text-white">
          ${g.monthlyFee}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Holat',
      align: 'center',
      render: (g) => (
        <Badge variant={g.status === 'Active' ? 'success' : 'neutral'} hasDot>
          {g.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-purple-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              Academic Architecture
            </span>
            <span className="text-xs text-slate-400">Jami {groups.length} ta faol guruh</span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Guruhlar & Kurslar Boshqaruvi
          </h1>
          <p className="text-xs text-slate-500">
            Kurslar katalogi, o‘quv rejalari va guruhlar sig‘imini nazorat qiling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setIsAddGroupModalOpen(true)}
          >
            Yangi Guruh Ochish
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveView('groups')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeView === 'groups'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          Guruhlar Boshqaruvi ({groups.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveView('courses')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeView === 'courses'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          Kurslar Katalogi & Sillabus ({INITIAL_COURSES.length})
        </button>
      </div>

      {/* View 1: Groups Data Table */}
      {activeView === 'groups' && (
        <DataTable
          data={groupsTableData}
          columns={groupColumns}
          searchPlaceholder="Guruh nomi, fan yoki ustoz bo‘yicha qidiruv..."
        />
      )}

      {/* View 2: Courses Catalog Grid */}
      {activeView === 'courses' && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {INITIAL_COURSES.map((course) => (
            <Card key={course.id} isHoverable className="flex flex-col justify-between">
              <div>
                <CardHeader
                  title={course.title}
                  subtitle={`${course.category} • ${course.level}`}
                  action={
                    <Badge variant="purple">
                      ${course.pricePerMonth} / oy
                    </Badge>
                  }
                />
                <CardContent className="space-y-3">
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {course.description}
                  </p>

                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      O‘quv Dasturi (Sillabus):
                    </p>
                    <ul className="mt-1.5 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                      {course.syllabus.map((item, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span className="truncate">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 p-4 dark:border-slate-800/80 text-xs">
                <span className="text-slate-400">
                  Davomiyligi: <strong>{course.durationMonths} oy</strong> ({course.lessonsCount} dars)
                </span>
                <span className="text-emerald-600 font-bold">
                  {course.activeGroupsCount} ta faol guruh
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
