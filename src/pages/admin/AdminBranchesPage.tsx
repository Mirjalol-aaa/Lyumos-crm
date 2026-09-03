import React, { useState } from 'react';
import { INITIAL_BRANCHES } from '../../data/branchesData';
import { Branch } from '../../types/admin';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import {
  Building2,
  Plus,
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  Phone,
  MapPin,
  TrendingUp,
} from 'lucide-react';

export const AdminBranchesPage: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>(INITIAL_BRANCHES);

  const totalStudents = branches.reduce((acc, b) => acc + b.studentCount, 0);
  const totalRevenue = branches.reduce((acc, b) => acc + b.monthlyRevenue, 0);

  const columns: Column<Branch>[] = [
    {
      key: 'name',
      header: 'Filial Nomi & Shahar',
      sortable: true,
      render: (b) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white">{b.name}</span>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
            <MapPin className="h-3 w-3" />
            <span>{b.address}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'managerName',
      header: 'Filial Rahbari',
      render: (b) => (
        <div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {b.managerName}
          </span>
          <p className="text-[10px] text-slate-400">{b.phone}</p>
        </div>
      ),
    },
    {
      key: 'studentCount',
      header: 'O‘quvchilar Soni',
      sortable: true,
      align: 'center',
      render: (b) => (
        <span className="text-xs font-bold text-slate-900 dark:text-white">
          {b.studentCount} ta
        </span>
      ),
    },
    {
      key: 'groupsCount',
      header: 'Guruhlar & Ustozlar',
      align: 'center',
      render: (b) => (
        <div className="text-center">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {b.groupsCount} guruh
          </span>
          <p className="text-[10px] text-slate-400">{b.teacherCount} ustoz</p>
        </div>
      ),
    },
    {
      key: 'monthlyRevenue',
      header: 'Oylik Tushum',
      sortable: true,
      align: 'right',
      render: (b) => (
        <span className="font-black text-emerald-600 dark:text-emerald-400">
          ${b.monthlyRevenue.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Holat',
      align: 'center',
      render: (b) => (
        <Badge
          variant={
            b.status === 'Active'
              ? 'success'
              : b.status === 'Planned'
              ? 'warning'
              : 'neutral'
          }
          hasDot
        >
          {b.status}
        </Badge>
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
              Multi-Branch Architecture
            </span>
            <span className="text-xs text-slate-400">Jami {branches.length} ta filial</span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Filiallar Tarmoqlari & Boshqaruvi
          </h1>
          <p className="text-xs text-slate-500">
            Har bir filialning o‘quvchilar soni, daromadi, o‘qituvchilar tarkibi va filiallararo tahliliy taqqoslashi.
          </p>
        </div>

        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
          Yangi Filial Qo‘shish
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Jami Filiallar</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {branches.length} ta
              </p>
              <span className="text-[11px] text-emerald-600 font-bold">3 ta faol, 1 ta rejalashtirilgan</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Filiallar O‘quvchilari</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {totalStudents} nafar
              </p>
              <span className="text-[11px] text-slate-400">Markaz bo‘ylab umumiy o‘quvchilar</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">Umumiy Tarmoq Tushumi</span>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400">
                ${totalRevenue.toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-400">Oylik jami tushum</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Branches Table */}
      <DataTable data={branches} columns={columns} searchPlaceholder="Filial nomi yoki shahar bo‘yicha..." />
    </div>
  );
};
