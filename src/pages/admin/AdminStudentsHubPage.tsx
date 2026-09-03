import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Student } from '../../types/crm';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Users,
  Plus,
  Filter,
  CreditCard,
  CalendarCheck2,
  Phone,
  Mail,
  X,
  Send,
  Sparkles,
  Download,
  Trash2,
} from 'lucide-react';

export const AdminStudentsHubPage: React.FC = () => {
  const {
    students,
    groups,
    financials,
    setIsAddStudentModalOpen,
    setSelectedStudentId,
    deleteStudent,
  } = useCRM();

  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [debtFilter, setDebtFilter] = useState<'all' | 'debtors' | 'paid'>('all');
  const [activeStudentDrawer, setActiveStudentDrawer] = useState<Student | null>(null);

  const currentMonth = financials.currentAcademicMonth;

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      if (selectedGroup !== 'all' && student.groupId !== selectedGroup) return false;
      if (selectedStatus !== 'all' && student.status !== selectedStatus) return false;

      const p = student.payments[currentMonth];
      const isPaid = p && (p.status === 'Paid' || p.status === 'Discount');

      if (debtFilter === 'debtors' && isPaid) return false;
      if (debtFilter === 'paid' && !isPaid) return false;

      return true;
    });
  }, [students, selectedGroup, selectedStatus, debtFilter, currentMonth]);

  const columns: Column<Student>[] = [
    {
      key: 'fullName',
      header: 'O‘quvchi',
      sortable: true,
      render: (s) => (
        <div className="flex items-center gap-3">
          <img
            src={s.avatar}
            alt={s.fullName}
            className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-500/20"
          />
          <div>
            <span className="font-bold text-slate-900 dark:text-white">
              {s.fullName}
            </span>
            <p className="text-[10px] text-slate-400">
              {s.phone} • {s.gender === 'Male' ? 'Erkak' : 'Ayol'}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'groupName',
      header: 'Guruh & Ustoz',
      sortable: true,
      render: (s) => (
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {s.groupName}
          </span>
          <p className="text-[10px] text-slate-400">
            Ustoz: {s.teacherName}
          </p>
        </div>
      ),
    },
    {
      key: 'monthlyFee',
      header: 'To‘lov Holati',
      align: 'center',
      render: (s) => {
        const p = s.payments[currentMonth];
        const isPaid = p && (p.status === 'Paid' || p.status === 'Discount');
        const isOverdue = p && p.status === 'Overdue';

        return (
          <div className="text-center">
            <Badge
              variant={isPaid ? 'success' : isOverdue ? 'danger' : 'warning'}
              hasDot
            >
              {isPaid ? 'To‘langan' : isOverdue ? 'Qarzdor' : 'Kutilmoqda'}
            </Badge>
            <p className="mt-0.5 text-[10px] font-bold text-slate-500">
              ${s.monthlyFee} / oy
            </p>
          </div>
        );
      },
    },
    {
      key: 'joinedDate',
      header: 'Qo‘shilgan Sana',
      sortable: true,
      render: (s) => (
        <span className="text-xs text-slate-500">
          {s.joinedDate}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (s) => (
        <Badge
          variant={
            s.status === 'Active'
              ? 'success'
              : s.status === 'Trial'
              ? 'info'
              : 'neutral'
          }
        >
          {s.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Amallar',
      align: 'right',
      render: (s) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            size="xs"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setActiveStudentDrawer(s);
            }}
          >
            360° Profil
          </Button>
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
            <span className="rounded-lg bg-blue-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Student Information System
            </span>
            <span className="text-xs text-slate-400">Jami {students.length} nafar o‘quvchi</span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            O‘quvchilar Markaziy Boshqaruvi
          </h1>
          <p className="text-xs text-slate-500">
            Barcha o‘quvchilar bazasi, ularning to‘lov holati, akademik o‘zlashtirishi va guruhlar bo‘yicha ko‘p qirrali filtrlar.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setIsAddStudentModalOpen(true)}
        >
          Yangi O‘quvchi Qo‘shish
        </Button>
      </div>

      {/* Advanced Filter Toolbar & Data Table */}
      <DataTable
        data={filteredStudents}
        columns={columns}
        searchPlaceholder="Ism, telefon yoki ota-onasi bo‘yicha qidiruv..."
        filterNode={
          <div className="flex flex-wrap items-center gap-2">
            {/* Group selector */}
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="all">Barcha Guruhlar</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>

            {/* Status selector */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="all">Barcha Statuslar</option>
              <option value="Active">Active (Faol)</option>
              <option value="Trial">Trial (Sinov darsi)</option>
              <option value="Frozen">Frozen (Muzlatilgan)</option>
              <option value="Graduated">Graduated (Bitirgan)</option>
            </select>

            {/* Debt status */}
            <select
              value={debtFilter}
              onChange={(e) => setDebtFilter(e.target.value as any)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="all">To‘lov Holati: Barchasi</option>
              <option value="debtors">Faqat Qarzdorlar</option>
              <option value="paid">Faqat To‘laganlar</option>
            </select>
          </div>
        }
        onRowClick={(student) => setActiveStudentDrawer(student)}
      />

      {/* 360-Degree Student Drawer / Modal */}
      {activeStudentDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/40 backdrop-blur-xs">
          <div className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl dark:bg-slate-900 scrollbar-thin">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                O‘quvchi 360° Profili
              </span>
              <button
                type="button"
                onClick={() => setActiveStudentDrawer(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="mt-5 flex items-center gap-4">
              <img
                src={activeStudentDrawer.avatar}
                alt={activeStudentDrawer.fullName}
                className="h-16 w-16 rounded-full object-cover ring-4 ring-blue-500/20"
              />
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {activeStudentDrawer.fullName}
                </h3>
                <Badge variant={activeStudentDrawer.status === 'Active' ? 'success' : 'info'} size="sm">
                  {activeStudentDrawer.status}
                </Badge>
              </div>
            </div>

            {/* Details Grid */}
            <div className="mt-6 space-y-4 text-xs">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Telefon:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{activeStudentDrawer.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Guruh:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{activeStudentDrawer.groupName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ustoz:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{activeStudentDrawer.teacherName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ota-onasi:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{activeStudentDrawer.parentName || 'Mavjud emas'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Oylik to‘lov:</span>
                  <span className="font-black text-emerald-600">${activeStudentDrawer.monthlyFee}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setSelectedStudentId(activeStudentDrawer.id);
                    setActiveStudentDrawer(null);
                  }}
                >
                  To‘liq Profili
                </Button>

                <Button
                  variant="danger"
                  onClick={() => {
                    if (window.confirm(`${activeStudentDrawer.fullName} o‘quvchisini o‘chirishni tasdiqlaysizmi?`)) {
                      deleteStudent(activeStudentDrawer.id);
                      setActiveStudentDrawer(null);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
