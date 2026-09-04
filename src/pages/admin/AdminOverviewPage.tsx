import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { INITIAL_BRANCHES } from '../../data/branchesData';
import { INITIAL_COURSES } from '../../data/coursesData';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Building2,
  BookOpen,
  GraduationCap,
  ArrowRight,
  Clock,
  Sparkles,
  Send,
  Calendar,
  Layers,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AdminOverviewPageProps {
  onNavigateTab: (tabId: string) => void;
}

export const AdminOverviewPage: React.FC<AdminOverviewPageProps> = ({ onNavigateTab }) => {
  const { students, teachers, groups, financials, settings } = useCRM();
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'analytics' | 'signals' | 'branches'>('analytics');
  const [reminderSent, setReminderSent] = useState(false);

  // Financial calculations
  const totalRevenue = financials.paidIncome;
  const netProfit = financials.netProfit;
  const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  // Debtors list
  const currentMonth = financials.currentAcademicMonth;
  const debtors = useMemo(() => {
    return students.filter(student => {
      const p = student.payments[currentMonth];
      return student.status === 'Active' && (!p || p.status === 'Unpaid' || p.status === 'Overdue');
    });
  }, [students, currentMonth]);

  const totalDebtAmount = debtors.reduce((acc, curr) => acc + curr.monthlyFee, 0);

  // Chart Data
  const chartData = useMemo(() => {
    return [
      { month: 'Mar', income: 14200, expense: 6200 },
      { month: 'Apr', income: 15800, expense: 6500 },
      { month: 'May', income: 16900, expense: 7100 },
      { month: 'Jun', income: 18200, expense: 7800 },
      { month: 'Jul', income: 19500, expense: 8100 },
      { month: 'Aug', income: totalRevenue || 21400, expense: financials.expensesTotal || 8500 },
    ];
  }, [totalRevenue, financials.expensesTotal]);

  const handleSendBatchReminders = () => {
    setReminderSent(true);
    setTimeout(() => setReminderSent(false), 4000);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Top Header: Clean & Modern */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-blue-50 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Executive Workspace
            </span>
            <span className="text-xs text-slate-400">Akademik Yil: {settings.academicYear}</span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Super Admin Boshqaruv Markazi
          </h1>
          <p className="text-xs text-slate-500">
            Markazning moliyaviy oqimi, o‘quvchilar va guruhlar holati bo‘yicha umumlashtirilgan xulosa.
          </p>
        </div>

        {/* Branch Filter Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-3 py-2 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <Building2 className="h-4 w-4 text-slate-400" />
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none dark:text-white"
            >
              <option value="all">Barcha Filiallar (Umumiy Markaz)</option>
              {INITIAL_BRANCHES.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4 Focused Key Performance Indicators */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Jami O‘quvchilar"
          value={financials.totalStudents}
          subtitle={`${financials.activeStudents} faol • ${financials.newStudentsThisMonth} yangi o‘quvchi`}
          delta="+14%"
          color="amber"
          icon={<Users className="h-5 w-5" />}
        />

        <StatCard
          title="Oylik Tushum (Kirim)"
          value={`$${totalRevenue.toLocaleString()}`}
          subtitle={`Kutilayotgan: $${financials.monthlyExpectedIncome.toLocaleString()}`}
          delta="+18%"
          color="emerald"
          icon={<DollarSign className="h-5 w-5" />}
        />

        <StatCard
          title="Joriy Qarzdorlik"
          value={`$${totalDebtAmount.toLocaleString()}`}
          subtitle={`${debtors.length} nafar o‘quvchi to‘lov qilmagan`}
          delta={`${debtors.length} kishi`}
          isPositiveDelta={false}
          color="rose"
          icon={<AlertTriangle className="h-5 w-5" />}
        />

        <StatCard
          title="Sof Foyda (Net Profit)"
          value={`$${netProfit.toLocaleString()}`}
          subtitle={`Rentabellik marjasi: ${profitMargin}%`}
          delta={`+${profitMargin}%`}
          color="indigo"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </section>

      {/* De-cluttered Modular Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'analytics'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          📈 Moliyaviy Tahlil & Kurslar
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('signals')}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'signals'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <span>🚨 Diqqat Talab Signallar</span>
          {debtors.length > 0 && (
            <span className="rounded-full bg-rose-500 px-1.5 py-0.2 text-[10px] text-white">
              {debtors.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('branches')}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === 'branches'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          🏢 Filiallar Statistikasi
        </button>
      </div>

      {/* TAB 1: Analytics & Courses */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Revenue chart */}
          <Card className="lg:col-span-2">
            <CardHeader
              title="Kirim vs Chiqim Trendi (So‘nggi 6 Oy)"
              subtitle="Oylik tushum va operatsion xarajatlar dinamikasi"
              action={<Badge variant="success" hasDot>Jonli ma’lumot</Badge>}
            />
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="incomeGrad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="expenseGrad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="income"
                      name="Tushum ($)"
                      stroke="#10B981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#incomeGrad2)"
                    />
                    <Area
                      type="monotone"
                      dataKey="expense"
                      name="Xarajat ($)"
                      stroke="#F43F5E"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#expenseGrad2)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 flex items-center justify-center gap-6 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-700 dark:text-slate-300">Tushum (Kirim)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500" />
                  <span className="text-slate-700 dark:text-slate-300">Xarajatlar (Chiqim)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Courses */}
          <Card>
            <CardHeader
              title="Ommabop Kurslar"
              subtitle="Eng ko‘p daromad keltiruvchi yo‘nalishlar"
              action={
                <button
                  type="button"
                  onClick={() => onNavigateTab('courses_groups')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Barchasi
                </button>
              }
            />
            <CardContent className="space-y-3">
              {INITIAL_COURSES.slice(0, 4).map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition-colors hover:border-blue-200 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {course.title}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {course.category} • {course.durationMonths} oy
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      ${course.pricePerMonth}
                    </span>
                    <p className="text-[10px] text-emerald-600 font-bold">
                      {course.activeGroupsCount} ta guruh
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: Actionable Signals & Debtors */}
      {activeTab === 'signals' && (
        <div className="space-y-6">
          {/* Header & SMS action */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl bg-amber-500/10 p-4 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Qarzdorlik Eslatmalari ({debtors.length} nafar o‘quvchi)
                </h3>
                <p className="text-xs text-slate-500">
                  Jami qarzdorlik: <strong>${totalDebtAmount.toLocaleString()}</strong>. Ota-onalarga SMS va Telegram orqali avtomatik to‘lov havolasi yuboring.
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="danger"
              leftIcon={<Send className="h-3.5 w-3.5" />}
              onClick={handleSendBatchReminders}
            >
              {reminderSent ? 'Eslatmalar yuborildi! ✓' : `Barchaga 1-bosishda SMS eslatma (${debtors.length})`}
            </Button>
          </div>

          {/* Debtors List Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
                <tr>
                  <th className="px-5 py-3">O‘quvchi</th>
                  <th className="px-5 py-3">Guruh</th>
                  <th className="px-5 py-3">Telefon</th>
                  <th className="px-5 py-3">Ota-onasi</th>
                  <th className="px-5 py-3 text-right">Qarz Summasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {debtors.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img src={d.avatar} alt={d.fullName} className="h-8 w-8 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{d.fullName}</p>
                          <Badge variant="danger" size="sm">To‘lov qilinmagan</Badge>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300 font-medium">
                      {d.groupName}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 font-mono">
                      {d.phone}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {d.parentName || '—'} ({d.parentPhone || d.phone})
                    </td>
                    <td className="px-5 py-3.5 text-right font-black text-rose-600 dark:text-rose-400">
                      ${d.monthlyFee}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Branches Quick Overview */}
      {activeTab === 'branches' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INITIAL_BRANCHES.map((branch) => (
            <Card key={branch.id} className="flex flex-col justify-between">
              <div>
                <CardHeader
                  title={branch.name}
                  subtitle={branch.city}
                  action={
                    <Badge variant={branch.status === 'Active' ? 'success' : 'warning'} hasDot>
                      {branch.status}
                    </Badge>
                  }
                />
                <CardContent className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>O‘quvchilar:</span>
                    <strong className="text-slate-900 dark:text-white">{branch.studentCount} ta</strong>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Guruhlar:</span>
                    <strong className="text-slate-900 dark:text-white">{branch.groupsCount} ta</strong>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>O‘qituvchilar:</span>
                    <strong className="text-slate-900 dark:text-white">{branch.teacherCount} nafar</strong>
                  </div>
                </CardContent>
              </div>

              <div className="border-t border-slate-100 p-4 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Oylik tushum:</span>
                <span className="font-black text-emerald-600">${branch.monthlyRevenue.toLocaleString()}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
