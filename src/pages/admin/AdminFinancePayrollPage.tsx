import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import { DataTable, Column } from '../../components/ui/DataTable';
import {
  TrendingUp,
  Receipt,
  Users,
  Plus,
  CreditCard,
  Calculator,
  Percent,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

export const AdminFinancePayrollPage: React.FC = () => {
  const {
    financials,
    expenses,
    teachers,
    students,
    groups,
    setIsAddExpenseModalOpen,
    setIsReceivePaymentModalOpen,
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'overview' | 'payroll' | 'expenses'>('overview');
  const currentMonth = financials.currentAcademicMonth;

  // ───────────────────────────────────────────────────────────────────────────
  // DYNAMIC TEACHER PAYROLL CALCULATION (STUDENTS-BASED 50% SHARE)
  // ───────────────────────────────────────────────────────────────────────────
  const payrollData = teachers.map((teacher) => {
    // 1. Get students directly assigned to this teacher
    const assignedStudents = students.filter((s) => s.teacherId === teacher.id);
    const studentCount = assignedStudents.length;

    // 2. Groups taught by this teacher
    const teacherGroups = groups.filter((g) => g.teacherId === teacher.id);
    const groupNames = teacherGroups.map((g) => g.name).join(', ') || teacher.subjects.join(', ');

    // 3. Gross tuition from this teacher's students (Barcha bolalarning oylik to'lovi)
    const grossTuition = assignedStudents.reduce((acc, s) => acc + (s.monthlyFee || 250000), 0);

    // 4. Paid tuition collected so far
    const paidStudents = assignedStudents.filter((s) => {
      const p = s.payments?.[currentMonth];
      return p?.status === 'Paid' || p?.status === 'Discount';
    });
    const paidCount = paidStudents.length;
    const unpaidCount = studentCount - paidCount;

    const paidTuition = assignedStudents.reduce((acc, s) => {
      const p = s.payments?.[currentMonth];
      if (p?.status === 'Paid' || p?.status === 'Discount') {
        return acc + (p?.amountPaid || s.monthlyFee || 250000);
      }
      return acc;
    }, 0);

    // 5. Teacher remuneration rate (Standard 50% share of student fees)
    const sharePercent = 50;
    const totalEarnedSalary = Math.round((grossTuition * sharePercent) / 100);
    const paidEarnedSalary = Math.round((paidTuition * sharePercent) / 100);
    const centerRetainedShare = grossTuition - totalEarnedSalary;

    return {
      id: teacher.id,
      name: teacher.fullName,
      avatar: teacher.avatar,
      subject: teacher.subjects.join(', '),
      groupNames,
      studentCount,
      paidCount,
      unpaidCount,
      grossTuition,
      paidTuition,
      sharePercent,
      totalEarnedSalary,
      paidEarnedSalary,
      centerRetainedShare,
      status: 'Hisoblangan',
    };
  });

  const totalTeacherPayroll = payrollData.reduce((acc, curr) => acc + curr.totalEarnedSalary, 0);
  const totalCenterRetainedFromStudents = payrollData.reduce((acc, curr) => acc + curr.centerRetainedShare, 0);
  const netEstimatedProfit = financials.monthlyExpectedIncome - totalTeacherPayroll - financials.expensesTotal;

  // Columns for Expenses Table
  const expenseColumns: Column<typeof expenses[0]>[] = [
    {
      key: 'title',
      header: 'Xarajat Nomi',
      sortable: true,
      render: (e) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white">{e.title}</span>
          <p className="text-[10px] text-slate-400">Kim tomonidan: {e.requestedBy || 'Admin'}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Kategoriya',
      align: 'center',
      render: (e) => <Badge variant="purple">{e.category}</Badge>,
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
      render: (e) => (
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          {e.paymentMethod}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Summa',
      sortable: true,
      align: 'right',
      render: (e) => (
        <span className="font-black text-rose-600 dark:text-rose-400">
          -{Number(e.amount).toLocaleString('uz-UZ')} so‘m
        </span>
      ),
    },
  ];

  // Columns for Payroll Table
  const payrollColumns: Column<typeof payrollData[0]>[] = [
    {
      key: 'name',
      header: 'O‘qituvchi',
      sortable: true,
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-400 font-black text-sm">
            {p.name.charAt(0)}
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white">{p.name}</span>
            <p className="text-[10px] text-slate-400">{p.groupNames}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'studentCount',
      header: 'O‘quvchilar',
      align: 'center',
      render: (p) => (
        <div>
          <span className="font-extrabold text-slate-900 dark:text-white">{p.studentCount} nafar</span>
          <p className="text-[9px] text-emerald-500 font-medium">({p.paidCount} ta to‘lagan)</p>
        </div>
      ),
    },
    {
      key: 'grossTuition',
      header: 'O‘quvchilar To‘lovi',
      align: 'right',
      render: (p) => (
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {p.grossTuition.toLocaleString('uz-UZ')} so‘m
        </span>
      ),
    },
    {
      key: 'sharePercent',
      header: 'Ustoz Ulushi',
      align: 'center',
      render: (p) => (
        <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-500/10 px-2 py-0.5 text-xs font-black text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          {p.sharePercent}%
        </span>
      ),
    },
    {
      key: 'totalEarnedSalary',
      header: 'Hisoblangan Oylik',
      sortable: true,
      align: 'right',
      render: (p) => (
        <div className="text-right">
          <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
            {p.totalEarnedSalary.toLocaleString('uz-UZ')} so‘m
          </span>
          <p className="text-[9px] text-slate-400">
            Hozirgi yig‘imdan: {p.paidEarnedSalary.toLocaleString('uz-UZ')} so‘m
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Holat',
      align: 'center',
      render: () => (
        <Badge variant="success" hasDot>
          Hisoblangan
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
            <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              Moliya & Payroll
            </span>
            <span className="text-xs text-slate-400">
              O‘quvchilar soniga qarab ustozlar oyligi va kassa hisoboti
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Moliya, Kassa & O‘qituvchilar Maoshi
          </h1>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Button
            variant="success"
            leftIcon={<CreditCard className="h-4 w-4" />}
            onClick={() => setIsReceivePaymentModalOpen(true)}
            className="rounded-xl font-bold shadow-md shadow-emerald-600/20"
          >
            To‘lov Qabul Qilish
          </Button>
          <Button
            variant="danger"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setIsAddExpenseModalOpen(true)}
            className="rounded-xl font-bold shadow-md shadow-rose-600/20"
          >
            Xarajat Kiritish
          </Button>
        </div>
      </div>

      {/* KPI Cards in Uzbek So'm */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Oylik Kutilayotgan Kirim"
          value={`${financials.monthlyExpectedIncome.toLocaleString('uz-UZ')} so‘m`}
          subtitle={`Yig‘ilgan naqd/karta: ${financials.paidIncome.toLocaleString('uz-UZ')} so‘m`}
          color="emerald"
          icon={<CreditCard className="h-4 w-4" />}
        />
        <StatCard
          title="O‘qituvchilar Maoshi (50%)"
          value={`${totalTeacherPayroll.toLocaleString('uz-UZ')} so‘m`}
          subtitle={`Hadicha ustoz va Hasanboy ustoz ulushi`}
          color="purple"
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="Markaz Xarajatlari (Chiqim)"
          value={`${financials.expensesTotal.toLocaleString('uz-UZ')} so‘m`}
          subtitle={`${expenses.length} ta operatsiya (Ijara, aloqa, xizmatlar)`}
          color="rose"
          icon={<Receipt className="h-4 w-4" />}
        />
        <StatCard
          title="Kutilayotgan Sof Foyda"
          value={`${netEstimatedProfit.toLocaleString('uz-UZ')} so‘m`}
          subtitle="Kirim minus Maoshlar minus Chiqimlar"
          color="indigo"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      {/* Logic Explanation Box */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs leading-relaxed text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-500 font-black">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <p className="font-extrabold text-sm text-slate-900 dark:text-white">
              O‘qituvchilar maoshi hisob-kitob modeli:
            </p>
            <p className="mt-0.5 text-slate-600 dark:text-slate-300">
              Har bir ustozning oylik ish haqi o‘z guruhidagi o‘quvchilarning umumiy to‘lovidan{' '}
              <b>50% ulush</b> asosida avtomatik hisoblanadi. Guruhda o‘quvchi qancha ko‘p bo‘lsa, ustozning oyligi shuncha yuqori bo‘ladi.
            </p>
          </div>
        </div>
        <Badge variant="warning" className="shrink-0 font-black">
          50% Foizli Model
        </Badge>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          Umumiy Moliya & Xulosalar
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('payroll')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'payroll'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          O‘qituvchilar Maosh Vedomosti ({teachers.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('expenses')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'expenses'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          Xarajatlar Jurnali ({expenses.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Teacher Cards Highlight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {payrollData.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-500 font-black text-base">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                        {p.name}
                      </h3>
                      <p className="text-xs text-slate-400">{p.groupNames}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    50% Ulush
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">O‘quvchilar soni:</span>
                    <span className="font-black text-slate-800 dark:text-slate-200 text-sm">
                      {p.studentCount} nafar
                    </span>
                    <p className="text-[10px] text-emerald-500 mt-0.5">{p.paidCount} ta to‘lagan</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Bollar to‘lovi (Jami):</span>
                    <span className="font-black text-slate-800 dark:text-slate-200 text-sm">
                      {p.grossTuition.toLocaleString('uz-UZ')} so‘m
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Har biri 250 000 so‘m</p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-200/50 dark:border-slate-800">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                      Ustozga hisoblangan oylik:
                    </span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      {p.totalEarnedSalary.toLocaleString('uz-UZ')} so‘m
                    </span>
                  </div>
                  <Badge variant="success" hasDot>
                    Hisoblangan
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Grid: Recent Expenses + Quick Breakdown */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                      <p className="text-[10px] text-slate-400">
                        {exp.category} • {exp.date}
                      </p>
                    </div>
                    <span className="text-xs font-black text-rose-600 dark:text-rose-400">
                      -{Number(exp.amount).toLocaleString('uz-UZ')} so‘m
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader
                title="O‘quv Markazining Daromad Taqsimoti"
                subtitle="Kirimning ustozlar va markaz o‘rtasidagi taqsimoti"
              />
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-purple-600 dark:text-purple-400">
                      Ustozlar ulushi (50%): {totalTeacherPayroll.toLocaleString('uz-UZ')} so‘m
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400">
                      Markaz ulushi (50%): {totalCenterRetainedFromStudents.toLocaleString('uz-UZ')} so‘m
                    </span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
                    <div className="h-full bg-purple-500 w-1/2" />
                    <div className="h-full bg-emerald-500 w-1/2" />
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-2">
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">Jami kutilayotgan oylik tushum:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {financials.monthlyExpectedIncome.toLocaleString('uz-UZ')} so‘m
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">- O‘qituvchilar maoshi (Hadicha & Hasanboy):</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">
                      -{totalTeacherPayroll.toLocaleString('uz-UZ')} so‘m
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400">- Markaz xarajatlari (Ijara, aloqa, soliq):</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">
                      -{financials.expensesTotal.toLocaleString('uz-UZ')} so‘m
                    </span>
                  </div>
                  <div className="flex justify-between py-2 bg-emerald-500/10 px-3 rounded-xl border border-emerald-500/20">
                    <span className="font-extrabold text-emerald-700 dark:text-emerald-300">
                      = Kutilayotgan sof foyda:
                    </span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      {netEstimatedProfit.toLocaleString('uz-UZ')} so‘m
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: PAYROLL TABLE */}
      {activeTab === 'payroll' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              O‘qituvchilar Maosh Vedomosti (Sentabr oyi uchun)
            </h3>
            <span className="text-xs text-slate-400">
              Jami maosh jamg‘armasi: <b className="text-emerald-500">{totalTeacherPayroll.toLocaleString('uz-UZ')} so‘m</b>
            </span>
          </div>
          <DataTable
            data={payrollData}
            columns={payrollColumns}
            searchPlaceholder="O‘qituvchi yoki guruh bo‘yicha..."
          />
        </div>
      )}

      {/* TAB 3: EXPENSES TABLE */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Barcha Markaz Chiqimlari Jurnali
            </h3>
            <span className="text-xs text-slate-400">
              Jami chiqimlar: <b className="text-rose-500">{financials.expensesTotal.toLocaleString('uz-UZ')} so‘m</b>
            </span>
          </div>
          <DataTable
            data={expenses}
            columns={expenseColumns}
            searchPlaceholder="Xarajat nomi yoki kategoriya bo‘yicha..."
          />
        </div>
      )}
    </div>
  );
};
