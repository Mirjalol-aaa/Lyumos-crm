import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
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
  Phone,
  UserCheck,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatMoney } from '../../lib/i18n';

interface AdminOverviewPageProps {
  onNavigateTab: (tabId: string) => void;
}

type MonthKey = 'July' | 'August' | 'September';

const MONTH_LABELS: Record<MonthKey, { label: string; uz: string }> = {
  July: { label: 'Iyul', uz: 'Iyul Oyi' },
  August: { label: 'Avgust', uz: 'Avgust Oyi' },
  September: { label: 'Sentabr', uz: 'Sentabr Oyi' },
};

// Monthly Financials specifically for Hadicha ustoz's Mathematics group & Center
const MONTHLY_STATS: Record<MonthKey, {
  expectedIncome: number;
  paidIncome: number;
  expenses: number;
  netProfit: number;
  paidCount: number;
  totalStudents: number;
}> = {
  July: {
    expectedIncome: 2750000,
    paidIncome: 500000,
    expenses: 250000,
    netProfit: 250000,
    paidCount: 2,
    totalStudents: 11,
  },
  August: {
    expectedIncome: 2750000,
    paidIncome: 810000,
    expenses: 400000,
    netProfit: 410000,
    paidCount: 5,
    totalStudents: 11,
  },
  September: {
    expectedIncome: 2750000,
    paidIncome: 796000,
    expenses: 380000,
    netProfit: 416000,
    paidCount: 5,
    totalStudents: 11,
  },
};

export const AdminOverviewPage: React.FC<AdminOverviewPageProps> = ({ onNavigateTab }) => {
  const { students, teachers, groups, settings } = useCRM();
  const [selectedMonth, setSelectedMonth] = useState<MonthKey>('September');
  const [activeTab, setActiveTab] = useState<'analytics' | 'math_group' | 'debtors'>('math_group');
  const [reminderSent, setReminderSent] = useState(false);

  const activeStats = MONTHLY_STATS[selectedMonth];
  const unpaidDebt = activeStats.expectedIncome - activeStats.paidIncome;
  const profitMargin = activeStats.paidIncome > 0
    ? Math.round((activeStats.netProfit / activeStats.paidIncome) * 100)
    : 0;

  // Real Excel Students for Hadicha ustoz
  const mathStudents = useMemo(() => {
    return students.filter(s => s.groupId === 'GRP-01' || s.teacherName?.includes('Hadicha') || s.groupName?.includes('Matematika'));
  }, [students]);

  // Debtors for selected month
  const monthDebtors = useMemo(() => {
    return mathStudents.filter(s => {
      const p = s.payments[selectedMonth];
      return !p || p.status === 'Unpaid' || p.amountPaid === 0;
    });
  }, [mathStudents, selectedMonth]);

  // Chart data in so'm across the 3 academic months
  const chartData = [
    {
      month: 'Iyul',
      kirim: 500000,
      chiqim: 250000,
      foyda: 250000,
    },
    {
      month: 'Avgust',
      kirim: 810000,
      chiqim: 400000,
      foyda: 410000,
    },
    {
      month: 'Sentabr',
      kirim: 796000,
      chiqim: 380000,
      foyda: 416000,
    },
  ];

  const handleSendBatchReminders = () => {
    setReminderSent(true);
    setTimeout(() => setReminderSent(false), 4000);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
              Super Admin Boshqaruvi
            </span>
            <span className="text-xs text-slate-400">Akademik Yil: {settings.academicYear}</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Hadicha Ustoz (Matematika) & Moliya Markazi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            O‘quvchilar davomati va kelgan-kelmaganiga qarab Iyul, Avgust, Sentabr oylari hisob-kitobi.
          </p>
        </div>

        {/* Month Selector Pills */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          {(['July', 'August', 'September'] as MonthKey[]).map((mKey) => (
            <button
              key={mKey}
              type="button"
              onClick={() => setSelectedMonth(mKey)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-black transition-all ${
                selectedMonth === mKey
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {MONTH_LABELS[mKey].label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Focused Key Performance Indicators for Selected Month */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={`${MONTH_LABELS[selectedMonth].label} — O‘quvchilar`}
          value={activeStats.totalStudents}
          subtitle={`${activeStats.paidCount} to‘ladi • ${activeStats.totalStudents - activeStats.paidCount} qarz`}
          delta={`${activeStats.paidCount}/${activeStats.totalStudents}`}
          color="amber"
          icon={<Users className="h-5 w-5" />}
        />

        <StatCard
          title={`${MONTH_LABELS[selectedMonth].label} — Tushum (Kirim)`}
          value={formatMoney(activeStats.paidIncome, 'UZS')}
          subtitle={`Kutilgan tushum: ${formatMoney(activeStats.expectedIncome, 'UZS')}`}
          delta={`${Math.round((activeStats.paidIncome / activeStats.expectedIncome) * 100)}%`}
          color="emerald"
          icon={<DollarSign className="h-5 w-5" />}
        />

        <StatCard
          title={`${MONTH_LABELS[selectedMonth].label} — Chiqim (Xarajat)`}
          value={formatMoney(activeStats.expenses, 'UZS')}
          subtitle="Ustoz oylik maoshi va xarajatlar"
          delta="Nazoratda"
          color="rose"
          icon={<AlertTriangle className="h-5 w-5" />}
        />

        <StatCard
          title={`${MONTH_LABELS[selectedMonth].label} — Sof Foyda`}
          value={formatMoney(activeStats.netProfit, 'UZS')}
          subtitle={`Rentabellik marjasi: ${profitMargin}%`}
          delta={`+${profitMargin}%`}
          color="indigo"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </section>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('math_group')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${
            activeTab === 'math_group'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <span>📐 Hadicha Ustoz Guruhi ({mathStudents.length} o‘quvchi)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${
            activeTab === 'analytics'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <span>📈 3 Oylik Moliya Grafigi</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('debtors')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all ${
            activeTab === 'debtors'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          <span>🚨 {MONTH_LABELS[selectedMonth].label} Qarzdorlari</span>
          {monthDebtors.length > 0 && (
            <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] text-white">
              {monthDebtors.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: Real Excel Math Group Students Table */}
      {activeTab === 'math_group' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Hadicha Ustoz — Matematika Guruhi (Excel Jadvali Asosida)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                O‘quvchilar qatnashgan darslariga (davomatiga) qarab to‘lov summalari kiritilgan.
              </p>
            </div>
            <Badge variant="amber" size="md">
              Dushanba, Chorshanba, Juma 14:00
            </Badge>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200/90 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-black uppercase text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3.5">#</th>
                  <th className="px-4 py-3.5">FISH (Ism Familiya)</th>
                  <th className="px-4 py-3.5">Telefon</th>
                  <th className="px-4 py-3.5 text-center">Iyul To‘lovi</th>
                  <th className="px-4 py-3.5 text-center">Avgust To‘lovi</th>
                  <th className="px-4 py-3.5 text-center">Sentabr To‘lovi</th>
                  <th className="px-4 py-3.5 text-right">Davomat / Holat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {mathStudents.map((s, idx) => {
                  const julyPay = s.payments['July'];
                  const augPay = s.payments['August'];
                  const sepPay = s.payments['September'];

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-400">
                        {idx + 1}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-black">
                            {s.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 dark:text-white">{s.fullName}</p>
                            <span className="text-[10px] text-slate-400">Matematika</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300 font-bold">
                        <span className="flex items-center gap-1.5">
                          <Phone className="h-3 w-3 text-slate-400" />
                          {s.phone}
                        </span>
                      </td>

                      {/* Iyul */}
                      <td className="px-4 py-3 text-center">
                        {julyPay?.status === 'Paid' ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-black text-emerald-600 font-mono">
                            {formatMoney(julyPay.amountPaid, 'UZS')}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-300 dark:text-slate-600 font-medium">—</span>
                        )}
                      </td>

                      {/* Avgust */}
                      <td className="px-4 py-3 text-center">
                        {augPay?.status === 'Paid' ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-black text-emerald-600 font-mono">
                            {formatMoney(augPay.amountPaid, 'UZS')}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-300 dark:text-slate-600 font-medium">—</span>
                        )}
                      </td>

                      {/* Sentabr */}
                      <td className="px-4 py-3 text-center">
                        {sepPay?.status === 'Paid' ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-black text-emerald-600 font-mono">
                            {formatMoney(sepPay.amountPaid, 'UZS')}
                          </span>
                        ) : (
                          <span className="text-[11px] text-rose-500/80 font-bold bg-rose-500/5 px-2 py-0.5 rounded-lg">Kutilmoqda</span>
                        )}
                      </td>

                      {/* Davomat / Izoh */}
                      <td className="px-4 py-3 text-right">
                        {s.fullName === 'Azizbek' && (
                          <Badge variant="success" size="sm">To‘liq davomat (100%)</Badge>
                        )}
                        {(s.fullName === 'Go‘zaloy' || s.fullName === 'Quvonchoy') && (
                          <Badge variant="warning" size="sm">Qisman darslarga kelgan</Badge>
                        )}
                        {s.fullName === 'Habibullo' && (
                          <Badge variant="warning" size="sm">Qisman darslarga kelgan</Badge>
                        )}
                        {s.fullName === 'Asaloy' && (
                          <Badge variant="info" size="sm">Avgustda to‘liq to‘lagan</Badge>
                        )}
                        {s.fullName === 'Shahjahon' && (
                          <Badge variant="default" size="sm">Iyul to‘langan</Badge>
                        )}
                        {s.fullName === 'Zarina' && (
                          <Badge variant="info" size="sm">Sentabrda boshlagan</Badge>
                        )}
                        {['Mushtariy', 'Munisa', 'Shahrizoda', 'Murodbek'].includes(s.fullName) && (
                          <Badge variant="neutral" size="sm">Yangi / Qarz</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Financial Analytics Chart */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader
              title="Iyul, Avgust, Sentabr Oylik Moliya Dinamikasi"
              subtitle="Haqiqiy kirim, o‘qituvchi xarajatlari va sof foyda hisoboti"
              action={<Badge variant="success" hasDot>Excel bilan solishtirilgan</Badge>}
            />
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#94A3B8"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(value: any) => [formatMoney(Number(value), 'UZS'), '']}
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
                      dataKey="kirim"
                      name="Kirim (Tushum)"
                      stroke="#10B981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#incomeGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="foyda"
                      name="Sof Foyda"
                      stroke="#F59E0B"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#profitGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 flex items-center justify-center gap-6 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-700 dark:text-slate-300">Tushum (Kirim)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="text-slate-700 dark:text-slate-300">Sof Foyda</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Comparison Breakdown */}
          <Card>
            <CardHeader
              title="3 Oylik Umumiy Ko‘rsatkich"
              subtitle="Matematika bo‘yicha jami natijalar"
            />
            <CardContent className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50 space-y-2">
                <span className="text-xs text-slate-400 font-bold uppercase">Jami Tushum (3 oy):</span>
                <p className="text-2xl font-black text-emerald-600 font-mono">
                  {formatMoney(500000 + 810000 + 796000, 'UZS')}
                </p>
                <p className="text-[11px] text-slate-500">
                  Iyul (500k) + Avgust (810k) + Sentabr (796k)
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50 space-y-2">
                <span className="text-xs text-slate-400 font-bold uppercase">Jami Sof Foyda:</span>
                <p className="text-2xl font-black text-amber-600 font-mono">
                  {formatMoney(250000 + 410000 + 416000, 'UZS')}
                </p>
                <p className="text-[11px] text-slate-500">
                  O‘qituvchi xarajatlari ayirib tashlanganidan so‘ng
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: Debtors for Selected Month */}
      {activeTab === 'debtors' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-600" />
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {MONTH_LABELS[selectedMonth].label} Oyi Qarzdorlari ({monthDebtors.length} nafar o‘quvchi)
                </h3>
                <p className="text-xs text-slate-500">
                  Kutilayotgan qarz miqdori: <strong>{formatMoney(monthDebtors.length * 250000, 'UZS')}</strong>
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="danger"
              leftIcon={<Send className="h-3.5 w-3.5" />}
              onClick={handleSendBatchReminders}
            >
              {reminderSent ? 'Eslatmalar yuborildi! ✓' : `SMS Eslatma Yuborish (${monthDebtors.length})`}
            </Button>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-black uppercase text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
                <tr>
                  <th className="px-5 py-3">O‘quvchi</th>
                  <th className="px-5 py-3">Guruh</th>
                  <th className="px-5 py-3">Telefon</th>
                  <th className="px-5 py-3 text-right">Kutilayotgan To‘lov</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {monthDebtors.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 font-black">
                          {d.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{d.fullName}</p>
                          <Badge variant="danger" size="sm">To‘lov qilinmagan</Badge>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300 font-medium">
                      {d.groupName}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-500">
                      {d.phone}
                    </td>
                    <td className="px-5 py-3.5 text-right font-black text-rose-600 dark:text-rose-400 font-mono">
                      {formatMoney(d.monthlyFee, 'UZS')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
