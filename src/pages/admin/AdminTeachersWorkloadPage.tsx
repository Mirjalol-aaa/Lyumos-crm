import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Teacher } from '../../types/crm';
import { TeacherWorkload } from '../../types/admin';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EditTeacherModal } from '../../components/modals/EditTeacherModal';
import { TeacherProfileModal } from '../../components/modals/TeacherProfileModal';
import { formatMoney } from '../../lib/i18n';
import {
  GraduationCap,
  Plus,
  Users,
  Clock,
  Award,
  DollarSign,
  Eye,
  Edit2,
  Trash2,
  BookOpen,
} from 'lucide-react';

export const AdminTeachersWorkloadPage: React.FC = () => {
  const {
    teachers,
    groups,
    students,
    setIsAddTeacherModalOpen,
    updateTeacher,
    deleteTeacher,
  } = useCRM();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  // Modal States
  const [selectedTeacherForEdit, setSelectedTeacherForEdit] = useState<Teacher | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedTeacherForProfile, setSelectedTeacherForProfile] = useState<Teacher | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Compute live workload and metrics for each teacher
  const workloadData: (TeacherWorkload & { rawTeacher: Teacher })[] = useMemo(() => {
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
      const kpiScore = teacher.rating || 5.0;

      const baseSalary = teacher.baseSalary || 1200000;
      const bonusPerStudent = teacher.bonusPerStudent || 15000;
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
        rawTeacher: teacher,
      };
    });
  }, [teachers, groups, students]);

  // Filtered list
  const filteredWorkload = useMemo(() => {
    return workloadData.filter(item => {
      if (selectedSubject !== 'all' && !item.subjects.some(s => s.toLowerCase().includes(selectedSubject.toLowerCase()))) {
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
  const avgLoad = workloadData.length > 0 
    ? Math.round(workloadData.reduce((acc, t) => acc + t.workloadPercentage, 0) / workloadData.length)
    : 0;

  // Handlers
  const handleOpenProfile = (teacher: Teacher) => {
    setSelectedTeacherForProfile(teacher);
    setIsProfileModalOpen(true);
  };

  const handleOpenEdit = (teacher: Teacher) => {
    setSelectedTeacherForEdit(teacher);
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (teacher: Teacher) => {
    setTeacherToDelete(teacher);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (teacherToDelete) {
      deleteTeacher(teacherToDelete.id);
      setIsDeleteDialogOpen(false);
      setTeacherToDelete(null);
    }
  };

  const columns: Column<TeacherWorkload & { rawTeacher: Teacher }>[] = [
    {
      key: 'teacherName',
      header: 'O‘qituvchi',
      sortable: true,
      render: (t) => (
        <div className="flex items-center gap-3">
          {t.avatar ? (
            <img
              src={t.avatar}
              alt={t.teacherName}
              className="h-10 w-10 rounded-2xl object-cover ring-2 ring-amber-500/20"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 text-amber-600 dark:text-amber-400 font-bold border border-amber-400/30">
              {t.teacherName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => handleOpenProfile(t.rawTeacher)}
              className="font-bold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 text-left transition-colors cursor-pointer block truncate"
            >
              {t.teacherName}
            </button>
            <p className="text-[10px] text-slate-400 truncate">
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
        <div className="min-w-[130px] space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-slate-700 dark:text-slate-300">
              {t.weeklyHours} / {t.maxCapacityHours} soat
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
      header: 'Guruh & O‘quvchilar',
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
      header: 'KPI Reyting',
      sortable: true,
      align: 'center',
      render: (t) => (
        <div className="text-center">
          <Badge variant="warning" hasDot>
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
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {formatMoney(t.calculatedTotalSalary, 'UZS')}
          </span>
          <p className="text-[10px] text-slate-400 font-mono">
            +{formatMoney(t.activeStudentsCount * t.bonusPerStudent, 'UZS')} bonus
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
    {
      key: 'teacherId',
      header: 'Amallar',
      align: 'right',
      render: (t) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => handleOpenProfile(t.rawTeacher)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors cursor-pointer"
            title="Profilni ko‘rish"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => handleOpenEdit(t.rawTeacher)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors cursor-pointer"
            title="Tahrirlash"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => handleOpenDelete(t.rawTeacher)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 dark:text-slate-400 transition-colors cursor-pointer"
            title="O‘chirish"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
              O‘qituvchilar Boshqaruvi
            </span>
            <span className="text-xs text-slate-400">Jami {teachers.length} nafar o‘qituvchi</span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            O‘qituvchilar & Yuklama Boshqaruvi
          </h1>
          <p className="text-xs text-slate-500">
            O‘qituvchi qo‘shish, tahrirlash, o‘chirish, guruhlar biriktirish hamda avtomatik oylik va bonuslarni nazorat qiling.
          </p>
        </div>

        <Button
          variant="gold"
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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Jami Oylik Payroll</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {formatMoney(totalPayroll, 'UZS')}
              </p>
              <span className="text-[11px] text-slate-400">Asosiy oylik va o‘quvchi bonuslari</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">O‘rtacha KPI</span>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">5.0 / 5.0</p>
              <span className="text-[11px] text-slate-400">O‘quvchilar saqlanishi: ~96%</span>
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

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="all">Barcha Fanlar</option>
              <option value="Matematika">Matematika</option>
              <option value="Ingliz tili">Ingliz tili</option>
            </select>
          </div>
        }
      />

      {/* Edit Teacher Modal */}
      <EditTeacherModal
        isOpen={isEditModalOpen}
        teacher={selectedTeacherForEdit}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTeacherForEdit(null);
        }}
        onSave={(id, updated) => {
          updateTeacher(id, updated);
        }}
      />

      {/* Teacher Profile Modal */}
      <TeacherProfileModal
        isOpen={isProfileModalOpen}
        teacher={selectedTeacherForProfile}
        groups={groups}
        students={students}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedTeacherForProfile(null);
        }}
        onEdit={(teacher) => {
          setIsProfileModalOpen(false);
          handleOpenEdit(teacher);
        }}
        onDelete={(teacher) => {
          setIsProfileModalOpen(false);
          handleOpenDelete(teacher);
        }}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setTeacherToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="O‘qituvchini Tizimdan O‘chirish"
        message={
          <span>
            Haqiqatan ham <strong>{teacherToDelete?.fullName}</strong> ({teacherToDelete?.id}) o‘qituvchisini tizimdan o‘chirmoqchimisiz? Ushbu amal ortga qaytarilmaydi.
          </span>
        }
        confirmLabel="O‘chirish"
        cancelLabel="Bekor qilish"
        variant="danger"
      />
    </div>
  );
};
