import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Teacher } from '../../types/crm';
import { TeacherWorkload } from '../../types/admin';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import {
  GraduationCap,
  Plus,
  Users,
  Clock,
  Award,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';

export const AdminTeachersWorkloadPage: React.FC = () => {
  const { teachers, groups, students, setIsAddTeacherModalOpen } = useCRM();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Compute live workload and metrics for each teacher
  const workloadData: TeacherWorkload[] = useMemo(() => {
    return teachers.map((teacher, index) => {
      const assignedGroups = groups.filter(g => g.teacherId === teacher.id);
      const studentCount = students.filter(s => s.teacherId === teacher.id).length;

      // Calculate weekly hours: 3 classes/week * 2h = 6h per group
      const weeklyHours = assignedGroups.length * 6;
      const maxCapacityHours = 24; // standard 4 full groups
      const workloadPercentage = Math.min(100, Math.round((weeklyHours / maxCapacityHours) * 100));

      let status: TeacherWorkload['status'] = 'Optimal';
      if (workloadPercentage >= 95) status = 'Overloaded';
      else if (workloadPercentage <= 50) status = 'Available';

      const avgGradingTurnaroundHours = 3.5 + (index % 4) * 0.8;
      const studentRetentionRate = 94 + (index % 5);
      const kpiScore = teacher.rating || 4.8;

      const baseSalary = teacher.baseSalary || 2800;
      const bonusPerStudent = teacher.bonusPerStudent || 12;
      const calculatedTotalSalary = baseSalary + studentCount * bonusPerStudent;

      return {
        teacherId: teacher.id,
        teacherName: teacher.fullName,
        avatar: teacher.avatar,
        subjects: teacher.subjects || [],
        activeGroupsCount: assignedGroups.length,
        activeStudentsCount: studentCount,
        weeklyHours,
        maxCapacityHours,
        workloadPercentage,
        avgGradingTurnaroundHours,
        studentRetentionRate,
        kpiScore,
        baseSalary,
        bonusPerStudent,
        calculatedTotalSalary,
        status,
      };
    });
  }, [teachers, groups, students]);

  // Filtered
  const filteredWorkload = useMemo(() => {
    return workloadData.filter(item => {
      if (selectedSubject !== 'all' && !item.subjects.some(s => s.includes(selectedSubject))) {
        return false;
      }
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [workloadData, selectedSubject, statusFilter]);

  // Summary Metrics
  const totalPayroll = workloadData.reduce((acc, t) => acc + t.calculatedTotalSalary, 0);
  const avgLoad = Math.round(
    workloadData.reduce((acc, t) => acc + t.workloadPercentage, 0) / workloadData.length
  );

  const columns: Column<TeacherWorkload>[] = [
    {
      key: 'teacherName',
      header: 'O‘qituvchi',
      sortable: true,
      render: (t) => (
        <div className="flex items-center gap-3">
          <img
            src={t.avatar}
            alt={t.teacherName}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-500/20"
          />
          <div>
            <span className="font-bold text-slate-900 dark:text-white">
              {t.teacherName}
            </span>
            <p className="text-[10px] text-slate-400">
              {t.subjects.join(', ')}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'workloadPercentage',
      header: 'Haftalik Bandlik (Yuklama)',
      sortable: true,
      render: (t) => (
        <div className="min-w-[140px] space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-slate-700 dark:text-slate-300">
              {t.weeklyHours} / {t.maxCapacityHours} soat/hafta
            </span>
            <span
              className={
                t.workloadPercentage >= 90
                  ? 'text-rose-600'
                  : t.workloadPercentage <= 50
                  ? 'text-blue-600'
                  : 'text-emerald-600'
              }
            >
              {t.workloadPercentage}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                t.workloadPercentage >= 90
                  ? 'bg-rose-500'
                  : t.workloadPercentage <= 50
                  ? 'bg-blue-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${t.workloadPercentage}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'activeGroupsCount',
      header: 'Guruhlar & O‘quvchilar',
      align: 'center',
      render: (t) => (
        <div className="text-center">
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {t.activeGroupsCount} ta guruh
          </span>
          <p className="text-[10px] text-slate-400">
            {t.activeStudentsCount} nafar o‘quvchi
          </p>
        </div>
      ),
    },
    {
      key: 'kpiScore',
      header: 'Samaradorlik (KPI)',
      sortable: true,
      align: 'center',
      render: (t) => (
        <div className="text-center">
          <Badge variant="purple" hasDot>
            ★ {t.kpiScore}
          </Badge>
          <p className="mt-0.5 text-[9px] text-slate-400">
            Saqlab qolish: {t.studentRetentionRate}%
          </p>
        </div>
      ),
    },
    {
      key: 'calculatedTotalSalary',
      header: 'Hisoblangan Oylik (Base + Bonus)',
      sortable: true,
      align: 'right',
      render: (t) => (
        <div className="text-right">
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
            ${t.calculatedTotalSalary.toLocaleString()}
          </span>
          <p className="text-[10px] text-slate-400">
            Base: ${t.baseSalary} + ${t.activeStudentsCount * t.bonusPerStudent}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Holat',
      align: 'center',
      render: (t) => {
        if (t.status === 'Overloaded') {
          return (
            <Badge variant="danger" hasDot>
              Ortiqcha Yuklangan
            </Badge>
          );
        }
        if (t.status === 'Available') {
          return (
            <Badge variant="info" hasDot>
              Guruh Olishga Tayyor
            </Badge>
          );
        }
        return (
          <Badge variant="success" hasDot>
            Optimal
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-indigo-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              Capacity Planning
            </span>
            <span className="text-xs text-slate-400">Jami {teachers.length} nafar o‘qituvchi</span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            O‘qituvchilar Yuklamasi & KPI Boshqaruvi
          </h1>
          <p className="text-xs text-slate-500">
            Ko‘p o‘qituvchili tizimda kimga yangi guruh berish mumkinligini, kim ortiqcha yuklanganini va avtomatik oylik/bonuslarni ko‘ring.
          </p>
        </div>

        <Button
          variant="indigo"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setIsAddTeacherModalOpen(true)}
        >
          Yangi O‘qituvchi Qo‘shish
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">O‘rtacha Bandlik</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{avgLoad}%</p>
              <span className="text-[11px] text-emerald-600 font-bold">Resurslar to‘g‘ri taqsimlangan</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Oylik Payroll (Maosh)</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                ${totalPayroll.toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-400">Asosiy oylik va o‘quvchi bonuslari</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">O‘rtacha KPI</span>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400">4.85 / 5.0</p>
              <span className="text-[11px] text-slate-400">Vazifa tekshirish: ~3.8 soat</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teachers Workload Table */}
      <DataTable
        data={filteredWorkload}
        columns={columns}
        searchPlaceholder="O‘qituvchi ismi yoki fan bo‘yicha qidiruv..."
        filterNode={
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="all">Barcha Holatlar</option>
              <option value="Available">Guruh Olishga Tayyor</option>
              <option value="Optimal">Optimal</option>
              <option value="Overloaded">Ortiqcha Yuklangan</option>
            </select>
          </div>
        }
      />
    </div>
  );
};
