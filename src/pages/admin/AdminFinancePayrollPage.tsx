import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import { DataTable, Column } from '../../components/ui/DataTable';
import {
  DollarSign,
  TrendingUp,
  Receipt,
  Users,
  Send,
  Plus,
  CheckCircle2,
  Calendar,
  CreditCard,
  Download,
} from 'lucide-react';

export const AdminFinancePayrollPage: React.FC = () => {
  const {
    financials,
    expenses,
    teachers,
    students,
    settings,
    setIsAddExpenseModalOpen,
    setIsReceivePaymentModalOpen,
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'payroll'>('overview');
  const [broadcastDone, setBroadcastDone] = useState(false);

  // Teacher Payroll calculation
  const payrollData = teachers.map(teacher => {
    const studentCount = students.filter(s => s.teacherId === teacher.id).length;
    const base = teacher.baseSalary || 2800;
    const bonus = (teacher.bonusPerStudent || 12) * studentCount;
    const total = base + bonus;

    return {
      id: teacher.id,
      name: teacher.fullName,
      avatar: teacher.avatar,
      studentCount,
      base,
      bonus,
      total,
      status: 'Hisoblangan',
    };
  });

  const totalTeacherPayroll = payrollData.reduce((acc, curr) => acc + curr.total, 0);

  const expenseColumns: Column<typeof expenses[0]>[] = [
    {
      key: 'title',
      header: 'Xarajat Nomi',
      sortable: true,
      render: (e) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white">{e.title}</span>
          <p className="text-[10px] text-slate-400">
            Kim tomonidan: {e.requestedBy || 'Admin'}
          </p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Kategoriya',
      align: 'center',
      render: (e) => (
        <Badge variant="purple">
          {e.category}
        </Badge>
      ),
    },
    {
      key: 'date',
      header: 'Sana',
      sortable: true,
      render: (e) => <span className="text-xs text-slate-500">{e.date}</span>,
    },
    {
      key: 'paymentMethod',
      header: 'To‘lov Usuli',
      render: (e) => <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{e.paymentMethod}</span>,
    },
    {
      key: 'amount',
      header: 'Summa',
      sortable: true,
      align: 'right',
      render: (e) => (
        <span className="font-black text-rose-600 dark:text-rose-400">
          -${e.amount.toLocaleString()}
        </span>
      ),
    },
  ];

  const payrollColumns: Column<typeof payrollData[0]>[] = [
    {
      key: 'name',
      header: 'O‘qituvchi',
      sortable: true,
      render: (p) => (
        <div className="flex items-center gap-3">
          <img src={p.avatar} alt={p.name} className="h-9 w-9 rounded-full object-cover" />
          <div>
            <span className="font-bold text-slate-900 dark:text-white">{p.name}</span>
            <p className="text-[10px] text-slate-400">{p.studentCount} ta o‘quvchi</p>
          </div>
        </div>
      ),
    },
    {
      key: 'base',
      header: 'Asosiy Oylik (Base)',
      align: 'right',
      render: (p) => <span className="font-semibold text-slate-700 dark:text-slate-300">${p.base.toLocaleString()}</span>,
    },
    {
      key: 'bonus',
      header: 'KPI & Talaba Bonusi',
      align: 'right',
      render: (p) => <span className="font-semibold text-indigo-600 dark:text-indigo-400">+${p.bonus.toLocaleString()}</span>,
    },
    {
      key: 'total',
      header: 'Jami To‘lanadigan Summa',
      sortable: true,
      align: 'right',
      render: (p) => (
        <span className="font-black text-emerald-600 dark:text-emerald-400">
          ${p.total.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Holat',
      align: 'center',
      render: () => <Badge variant="success" hasDot>Hisoblangan</Badge>,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              Financial Management
            </span>
            <span className="text-xs text-slate-400">Avtomatlashgan Moliya & Payroll</span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Moliya, Xarajatlar & O‘qituvchilar Maoshi
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="success"
            leftIcon={<CreditCard className="h-4 w-4" />}
            onClick={() => setIsReceivePaymentModalOpen(true)}
          >
            To‘lov Qabul Qilish
          </Button>
          <Button
            variant="danger"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setIsAddExpenseModalOpen(true)}
          >
            Xarajat Qo‘shish
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Oylik Tushum (Kirim)"
          value={`$${financials.paidIncome.toLocaleString()}`}
          subtitle={`Kutilayotgan: $${financials.monthlyExpectedIncome.toLocaleString()}`}
          color="emerald"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          title="Xarajatlar (Chiqim)"
          value={`$${financials.expensesTotal.toLocaleString()}`}
          subtitle={`${expenses.length} ta operatsiya`}
          color="rose"
          icon={<Receipt className="h-4 w-4" />}
        />
        <StatCard
          title="Sof Foyda (Net Profit)"
          value={`$${financials.netProfit.toLocaleString()}`}
          subtitle="Kirim minus chiqim"
          color="indigo"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          title="Jami O‘qituvchilar Maoshi"
          value={`$${totalTeacherPayroll.toLocaleString()}`}
          subtitle="Base + har bir talaba bonusi"
          color="purple"
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          Umumiy Hisobot
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('expenses')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'expenses'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          Xarajatlar Jurnali ({expenses.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('payroll')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'payroll'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          O‘qituvchilar Maosh Vedomosti ({teachers.length})
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Expenses summary */}
          <Card>
            <CardHeader
              title="So‘nggi Xarajatlar"
              subtitle="Eng so‘nggi kiritilgan chiqimlar ro‘yxati"
              action={
                <Button size="xs" variant="outline" onClick={() => setActiveTab('expenses')}>
                  Barchasini ko‘rish
                </Button>
              }
            />
            <CardContent className="space-y-3">
              {expenses.slice(0, 4).map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/40"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{exp.title}</h4>
                    <p className="text-[10px] text-slate-400">{exp.category} • {exp.date}</p>
                  </div>
                  <span className="text-xs font-black text-rose-600">-${exp.amount.toLocaleString()}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Teacher payroll preview */}
          <Card>
            <CardHeader
              title="O‘qituvchilar Payroll Taqsimoti"
              subtitle="Joriy oy uchun hisoblangan oyliklar"
              action={
                <Button size="xs" variant="outline" onClick={() => setActiveTab('payroll')}>
                  Vedomostni ochish
                </Button>
              }
            />
            <CardContent className="space-y-3">
              {payrollData.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/40"
                >
                  <div className="flex items-center gap-3">
                    <img src={p.avatar} alt={p.name} className="h-8 w-8 rounded-full object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{p.name}</h4>
                      <p className="text-[10px] text-slate-400">{p.studentCount} ta o‘quvchi</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-600">${p.total.toLocaleString()}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'expenses' && (
        <DataTable data={expenses} columns={expenseColumns} searchPlaceholder="Xarajat nomi yoki kategoriya..." />
      )}

      {activeTab === 'payroll' && (
        <DataTable data={payrollData} columns={payrollColumns} searchPlaceholder="O‘qituvchi ismi bo‘yicha..." />
      )}
    </div>
  );
};
