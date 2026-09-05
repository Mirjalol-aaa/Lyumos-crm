import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
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
  Download,
  Plus,
  CreditCard,
  Search,
  Check,
  ShieldCheck,
  ChevronRight,
  FileText,
  Eye,
  History,
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

const MONTH_LABELS: Record<MonthKey, { label: string; uz: string; fullDate: string }> = {
  July: { label: 'Iyul', uz: 'Iyul Oyi', fullDate: '1-31 Iyul 2025' },
  August: { label: 'Avgust', uz: 'Avgust Oyi', fullDate: '1-31 Avgust 2025' },
  September: { label: 'Sentabr', uz: 'Sentabr Oyi', fullDate: '1-30 Sentabr 2025' },
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
  const {
    students,
    teachers,
    groups,
    settings,
    setIsReceivePaymentModalOpen,
    setIsAddStudentModalOpen,
    setIsAddGroupModalOpen,
    setSelectedStudentId,
    setPaymentModalDefaultStudentId,
    setPaymentModalDefaultMonth,
  } = useCRM();

  const [selectedMonth, setSelectedMonth] = useState<MonthKey>('September');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid' | 'full_attendance'>('all');
  const [reminderSent, setReminderSent] = useState(false);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 11 ? 'Xayrli tong' : currentHour < 18 ? 'Xayrli kun' : 'Xayrli kech';
  const todayFormatted = new Intl.DateTimeFormat('uz-UZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  }).format(new Date());

  const activeStats = MONTHLY_STATS[selectedMonth];
  const unpaidDebt = activeStats.expectedIncome - activeStats.paidIncome;
  const profitMargin = activeStats.paidIncome > 0
    ? Math.round((activeStats.netProfit / activeStats.paidIncome) * 100)
    : 0;

  // Real Excel Students for Hadicha ustoz
  const mathStudents = useMemo(() => {
    return students.filter(s =>
      s.groupId === 'GRP-01' ||
      s.teacherName?.includes('Hadicha') ||
      s.groupName?.includes('Matematika')
    );
  }, [students]);

  // Filtered Math Students
  const filteredStudents = useMemo(() => {
    return mathStudents.filter(s => {
      const matchSearch =
        s.fullName.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
        s.phone.includes(studentSearchQuery);

      if (!matchSearch) return false;

      const p = s.payments[selectedMonth];
      const isPaid = p?.status === 'Paid' && (p.amountPaid || 0) > 0;

      if (statusFilter === 'paid') return isPaid;
      if (statusFilter === 'unpaid') return !isPaid;
      if (statusFilter === 'full_attendance') return s.fullName === 'Azizbek';

      return true;
    });
  }, [mathStudents, studentSearchQuery, statusFilter, selectedMonth]);

  // Debtors for selected month
  const monthDebtors = useMemo(() => {
    return mathStudents.filter(s => {
      const p = s.payments[selectedMonth];
      return !p || p.status === 'Unpaid' || (p.amountPaid || 0) === 0;
    });
  }, [mathStudents, selectedMonth]);

  // Chart data across the 3 academic months
  const chartData = [
    {
      month: 'Iyul',
      kirim: 500000,
      chiqim: 250000,
      foyda: 250000,
      reja: 2750000,
    },
    {
      month: 'Avgust',
      kirim: 810000,
      chiqim: 400000,
      foyda: 410000,
      reja: 2750000,
    },
    {
      month: 'Sentabr',
      kirim: 796000,
      chiqim: 380000,
      foyda: 416000,
      reja: 2750000,
    },
  ];

  const handleSendBatchReminders = () => {
    setReminderSent(true);
    setTimeout(() => setReminderSent(false), 4000);
  };

  const handleExportCSV = () => {
    const headers = ["ID", "FISH", "Telefon", "Guruh", "Iyul (UZS)", "Avgust (UZS)", "Sentabr (UZS)", "Holat"];
    const rows = mathStudents.map((s, idx) => [
      idx + 1,
      s.fullName,
      s.phone,
      s.groupName,
      s.payments['July']?.amountPaid || 0,
      s.payments['August']?.amountPaid || 0,
      s.payments['September']?.amountPaid || 0,
      s.fullName === 'Azizbek' ? '100% Davomat' : 'Faol',
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `LUMOS_Hadicha_Ustoz_Matematika_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openPaymentForStudent = (studentId: string) => {
    setPaymentModalDefaultStudentId(studentId);
    setPaymentModalDefaultMonth(selectedMonth);
    setIsReceivePaymentModalOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 font-sans">
      {/* ─────────────────────────────────────────────────────────────
          0. WELCOME GREETING BANNER & QUICK ACTION LAUNCHPAD
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-3xl border border-slate-200/80 bg-gradient-to-r from-amber-500/10 via-amber-50/40 to-white p-5 dark:border-slate-800 dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {greeting} 👋, Hurmatli Administrator!
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Bugun: <span className="font-bold text-slate-700 dark:text-slate-300 capitalize">{todayFormatted}</span> • Tizim barcha o‘quv kurslari va guruhlar bo‘yicha barqaror ishlamoqda.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddStudentModalOpen(true)}
            className="gap-1.5 shadow-xs cursor-pointer text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>+ O‘quvchi</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setPaymentModalDefaultMonth(selectedMonth);
              setIsReceivePaymentModalOpen(true);
            }}
            className="gap-1.5 cursor-pointer text-xs"
          >
            <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
            <span>+ To‘lov</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsAddGroupModalOpen(true)}
            className="gap-1.5 cursor-pointer text-xs"
          >
            <BookOpen className="h-3.5 w-3.5 text-blue-600" />
            <span>+ Guruh</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigateTab('schedule')}
            className="gap-1.5 cursor-pointer text-xs border border-slate-200 dark:border-slate-800"
          >
            <Calendar className="h-3.5 w-3.5 text-purple-600" />
            <span>Dars Jadvali</span>
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          1. EXECUTIVE HEADER & CONTROLS
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200/80 pb-5 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
              Super Admin Boshqaruv Markazi
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Jonli Tizim Faol
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Akademik Yil: {settings.academicYear}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Hadicha Ustoz (Matematika) & Moliya Markazi
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
            Real Excel jadvali bo‘yicha Iyul, Avgust va Sentabr oylari hisob-kitoblari: 11 nafar o‘quvchi to‘lovlari, kelgan-kelmagan davomati, o‘qituvchi xarajatlari va sof foyda auditi.
          </p>
        </div>

        {/* Right Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Month Selector Pills */}
          <div className="flex items-center gap-1 rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            {(['July', 'August', 'September'] as MonthKey[]).map((mKey) => (
              <button
                key={mKey}
                type="button"
                onClick={() => setSelectedMonth(mKey)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-black transition-all cursor-pointer ${
                  selectedMonth === mKey
                    ? 'bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/25 scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <span>{MONTH_LABELS[mKey].label}</span>
              </button>
            ))}
          </div>

          {/* New Payment Button */}
          <Button
            variant="primary"
            size="sm"
            className="gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
            onClick={() => {
              setPaymentModalDefaultMonth(selectedMonth);
              setIsReceivePaymentModalOpen(true);
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>To‘lov Qabul Qilish</span>
          </Button>

          {/* Add Student Button */}
          <Button
            variant="secondary"
            size="sm"
            className="gap-1.5 cursor-pointer"
            onClick={() => setIsAddStudentModalOpen(true)}
          >
            <Users className="h-3.5 w-3.5 text-amber-500" />
            <span className="hidden sm:inline">O‘quvchi Qo‘shish</span>
          </Button>

          {/* Export CSV Button */}
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-800"
            onClick={handleExportCSV}
            title="Excel formatida yuklab olish"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden md:inline">Eksport</span>
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. 6 KEY PERFORMANCE INDICATORS FOR SELECTED MONTH
      ───────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Expected Revenue */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>Kutilgan Tushum</span>
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {formatMoney(activeStats.expectedIncome, 'UZS')}
            </p>
            <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.round((activeStats.paidIncome / activeStats.expectedIncome) * 100))}%`,
                }}
              />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">
            11 o‘quvchi x 250 000 UZS
          </p>
        </div>

        {/* Actual Paid Cash */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span>Haqiqiy Tushum</span>
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {formatMoney(activeStats.paidIncome, 'UZS')}
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              <TrendingUp className="h-3 w-3" />
              {Math.round((activeStats.paidIncome / activeStats.expectedIncome) * 100)}% yig‘ildi
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">
            {activeStats.paidCount} nafar to‘ladi
          </p>
        </div>

        {/* Expenses */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
            <span>Ustoz Chiqimi</span>
            <div className="rounded-xl bg-rose-500/10 p-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-black text-rose-600 dark:text-rose-400 font-mono">
              {formatMoney(activeStats.expenses, 'UZS')}
            </p>
            <span className="inline-block text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1">
              Ustoz ish haqi (50%)
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">
            To‘liq to‘lab berilgan ✓
          </p>
        </div>

        {/* Net Profit */}
        <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-500/10 via-white to-amber-50/30 p-4.5 shadow-sm dark:border-amber-500/30 dark:bg-slate-900 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400">
            <span>Sof Foyda</span>
            <div className="rounded-xl bg-amber-500/20 p-2 text-amber-600 dark:text-amber-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {formatMoney(activeStats.netProfit, 'UZS')}
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-700 dark:text-amber-300 mt-1">
              Rentabellik: {profitMargin}%
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">
            O‘quv markaz marjasi
          </p>
        </div>

        {/* Active Students */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
            <span>O‘quvchilar Soni</span>
            <div className="rounded-xl bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {activeStats.totalStudents} nafar
            </p>
            <span className="inline-block text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              100% Faol Ishtirok
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">
            1-Guruh Matematika
          </p>
        </div>

        {/* Attendance Rate */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
            <span>Davomat Ko‘rsatkichi</span>
            <div className="rounded-xl bg-purple-500/10 p-2 text-purple-600 dark:text-purple-400">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-xl font-black text-slate-900 dark:text-white font-mono">
              96.4%
            </p>
            <span className="inline-block text-[11px] font-bold text-purple-600 dark:text-purple-400 mt-1">
              Yuqori Qatnashuv
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">
            0 sababsiz qoldirish
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. VISUAL ANALYTICS & DEBT RECOVERY SECTION
      ───────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: 3-Month Financial Growth Curve */}
        <Card className="lg:col-span-2 border-slate-200/80 dark:border-slate-800 shadow-sm">
          <CardHeader
            title="3 Oylik Tushum va Sof Foyda Dinamikasi"
            subtitle="Iyul, Avgust va Sentabr oylari bo‘yicha solishtirma tahlil (so‘mda)"
            action={
              <Badge variant="success" size="sm" hasDot>
                Excel Bilan 100% Mos
              </Badge>
            }
          />
          <CardContent className="space-y-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartKirim" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="chartFoyda" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
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
                    name="Tushum (Kirim)"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#chartKirim)"
                  />
                  <Area
                    type="monotone"
                    dataKey="foyda"
                    name="Sof Foyda"
                    stroke="#F59E0B"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#chartFoyda)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Micro 3-Month Summary Pills */}
            <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-3 dark:border-slate-800 text-center">
              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
                <span className="text-[10px] uppercase font-bold text-slate-400">Jami 3 Oylik Tushum</span>
                <p className="text-sm font-black text-emerald-600 font-mono mt-0.5">
                  {formatMoney(500000 + 810000 + 796000, 'UZS')}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
                <span className="text-[10px] uppercase font-bold text-slate-400">Jami Chiqim (Maosh)</span>
                <p className="text-sm font-black text-rose-600 font-mono mt-0.5">
                  {formatMoney(250000 + 400000 + 380000, 'UZS')}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
                <span className="text-[10px] uppercase font-bold text-slate-400">Jami Sof Foyda</span>
                <p className="text-sm font-black text-amber-600 font-mono mt-0.5">
                  {formatMoney(250000 + 410000 + 416000, 'UZS')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Payment Status Breakdown & Fast Debt Collection */}
        <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <CardHeader
            title={`${MONTH_LABELS[selectedMonth].label} Oyi To‘lov Taqsimoti`}
            subtitle="To‘langanlar va kutilayotgan qarzdorlik"
          />
          <CardContent className="space-y-4">
            {/* Visual Segments */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                <span>To‘langan ulush ({Math.round((activeStats.paidIncome / activeStats.expectedIncome) * 100)}%)</span>
                <span className="font-mono text-emerald-600">{formatMoney(activeStats.paidIncome, 'UZS')}</span>
              </div>
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="bg-emerald-500 transition-all duration-500"
                  style={{
                    width: `${Math.round((activeStats.paidIncome / activeStats.expectedIncome) * 100)}%`,
                  }}
                  title="To'langan"
                />
                <div
                  className="bg-rose-500 transition-all duration-500"
                  style={{
                    width: `${100 - Math.round((activeStats.paidIncome / activeStats.expectedIncome) * 100)}%`,
                  }}
                  title="Qarzdorlik"
                />
              </div>
            </div>

            {/* Status Breakdown Chips */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/60 p-3 dark:bg-emerald-950/30">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>To‘ladi: {activeStats.paidCount} ta</span>
                </div>
                <p className="text-sm font-black font-mono text-emerald-800 dark:text-emerald-200 mt-1">
                  {formatMoney(activeStats.paidIncome, 'UZS')}
                </p>
              </div>

              <div className="rounded-2xl border border-rose-500/20 bg-rose-50/60 p-3 dark:bg-rose-950/30">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-300">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Qarz: {monthDebtors.length} ta</span>
                </div>
                <p className="text-sm font-black font-mono text-rose-800 dark:text-rose-200 mt-1">
                  {formatMoney(unpaidDebt, 'UZS')}
                </p>
              </div>
            </div>

            {/* Quick Batch SMS Reminder Action */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-50/50 p-3.5 dark:bg-amber-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                  Avtomatlashtirilgan SMS
                </span>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">
                  {monthDebtors.length} ota-ona
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                {MONTH_LABELS[selectedMonth].label} oyi uchun to‘lov eslatmasini ota-onalarga bitta bosishda jo‘nating.
              </p>
              <Button
                size="sm"
                variant={reminderSent ? "success" : "primary"}
                className="w-full gap-2 cursor-pointer text-xs"
                onClick={handleSendBatchReminders}
              >
                {reminderSent ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Eslatmalar yuborildi! ✓</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Barcha Qarzdorlarga SMS Yuborish</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. HADICHA USTOZ STUDENTS TABLE (EXECUTIVE SAAS VIEW)
      ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        {/* Table Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={studentSearchQuery}
              onChange={(e) => setStudentSearchQuery(e.target.value)}
              placeholder="O‘quvchi ismi yoki telefon raqami bo‘yicha qidiruv..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              Barchasi ({mathStudents.length})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('paid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'paid'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              To‘laganlar ({activeStats.paidCount})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('unpaid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'unpaid'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              Qarzdorlar ({monthDebtors.length})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('full_attendance')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'full_attendance'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              100% Davomat
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-3xl border border-slate-200/90 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-black uppercase text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">O‘quvchi FISH</th>
                <th className="px-4 py-3.5">Telefon</th>
                <th className="px-4 py-3.5 text-center">Iyul To‘lovi</th>
                <th className="px-4 py-3.5 text-center">Avgust To‘lovi</th>
                <th className="px-4 py-3.5 text-center">Sentabr To‘lovi</th>
                <th className="px-4 py-3.5 text-center">Davomat / Ishtirok</th>
                <th className="px-4 py-3.5 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map((s, idx) => {
                const julyPay = s.payments['July'];
                const augPay = s.payments['August'];
                const sepPay = s.payments['September'];

                const isCurrentMonthPaid = s.payments[selectedMonth]?.status === 'Paid';

                return (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* ID */}
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-400">
                      {idx + 1}
                    </td>

                    {/* Student Info */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500/20 via-yellow-500/15 to-amber-300/20 border border-amber-400/30 text-amber-700 dark:text-amber-300 font-black shadow-xs">
                          {s.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                            {s.fullName}
                          </p>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {s.groupName} • Hadicha ustoz
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3.5 font-mono text-slate-600 dark:text-slate-300 font-bold">
                      <a
                        href={`tel:${s.phone}`}
                        className="inline-flex items-center gap-1.5 hover:text-amber-600 transition-colors"
                      >
                        <Phone className="h-3 w-3 text-slate-400" />
                        <span>{s.phone}</span>
                      </a>
                    </td>

                    {/* July Payment */}
                    <td className="px-4 py-3.5 text-center">
                      {julyPay?.status === 'Paid' ? (
                        <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-black text-emerald-600 font-mono">
                          {formatMoney(julyPay.amountPaid, 'UZS')}
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600 font-medium">—</span>
                      )}
                    </td>

                    {/* August Payment */}
                    <td className="px-4 py-3.5 text-center">
                      {augPay?.status === 'Paid' ? (
                        <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-black text-emerald-600 font-mono">
                          {formatMoney(augPay.amountPaid, 'UZS')}
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600 font-medium">—</span>
                      )}
                    </td>

                    {/* September Payment */}
                    <td className="px-4 py-3.5 text-center">
                      {sepPay?.status === 'Paid' ? (
                        <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-black text-emerald-600 font-mono">
                          {formatMoney(sepPay.amountPaid, 'UZS')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-bold bg-rose-500/10 px-2.5 py-1 rounded-xl border border-rose-500/20">
                          Kutilmoqda
                        </span>
                      )}
                    </td>

                    {/* Attendance / Note */}
                    <td className="px-4 py-3.5 text-center">
                      {s.fullName === 'Azizbek' && (
                        <Badge variant="success" size="sm" hasDot>
                          100% To‘liq Davomat
                        </Badge>
                      )}
                      {(s.fullName === 'Go‘zaloy' || s.fullName === 'Quvonchoy') && (
                        <Badge variant="warning" size="sm">
                          Qisman kelgan (150k)
                        </Badge>
                      )}
                      {s.fullName === 'Habibullo' && (
                        <Badge variant="warning" size="sm">
                          Qisman kelgan (96k)
                        </Badge>
                      )}
                      {s.fullName === 'Asaloy' && (
                        <Badge variant="info" size="sm">
                          Avgustda to‘lagan
                        </Badge>
                      )}
                      {s.fullName === 'Shahjahon' && (
                        <Badge variant="default" size="sm">
                          Iyul to‘langan (200k)
                        </Badge>
                      )}
                      {s.fullName === 'Zarina' && (
                        <Badge variant="info" size="sm">
                          Sentabrda qo‘shilgan
                        </Badge>
                      )}
                      {['Mushtariy', 'Munisa', 'Shahrizoda', 'Murodbek'].includes(s.fullName) && (
                        <Badge variant="danger" size="sm">
                          To‘lov qilinmagan
                        </Badge>
                      )}
                    </td>

                    {/* Quick Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openPaymentForStudent(s.id)}
                          title="To‘lov kiritish"
                          className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
                        >
                          <CreditCard className="h-3 w-3" />
                          <span>To‘lov</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStudentId(s.id);
                          }}
                          title="Profilni ko‘rish"
                          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. REAL-TIME ACTIVITY STREAM & ACADEMIC AUDIT LOG
      ───────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Real Payment History Logs */}
        <Card className="lg:col-span-2 border-slate-200/80 dark:border-slate-800 shadow-sm">
          <CardHeader
            title="So‘nggi To‘lovlar & Tranzaksiyalar Lentasi"
            subtitle="Hadicha ustoz o‘quvchilari tomonidan amalga oshirilgan to‘lovlar"
            action={
              <Badge variant="amber" size="sm">
                Real Vaqt
              </Badge>
            }
          />
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  student: 'Azizbek Rahimov',
                  month: 'Sentabr 2025',
                  amount: 250000,
                  method: 'Payme / Onlayn',
                  time: 'Kecha, 16:40',
                  status: 'Tasdiqlangan',
                  badge: 'success',
                },
                {
                  student: 'Shahjahon Ergashev',
                  month: 'Sentabr 2025',
                  amount: 200000,
                  method: 'Kassa / Naqd',
                  time: '2 kun oldin',
                  status: 'Tasdiqlangan',
                  badge: 'success',
                },
                {
                  student: 'Habibullo Qosimov',
                  month: 'Sentabr 2025',
                  amount: 96000,
                  method: 'Davomatga mutanosib',
                  time: '3 kun oldin',
                  status: 'Qisman to‘lov',
                  badge: 'warning',
                },
                {
                  student: 'Asaloy Karimova',
                  month: 'Avgust 2025',
                  amount: 150000,
                  method: 'Click / Karta',
                  time: '15 Avgust',
                  status: 'Tasdiqlangan',
                  badge: 'success',
                },
                {
                  student: 'Go‘zaloy Mahmudova',
                  month: 'Avgust 2025',
                  amount: 150000,
                  method: 'Kassa / Naqd',
                  time: '12 Avgust',
                  status: 'Tasdiqlangan',
                  badge: 'success',
                },
              ].map((tx, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900 dark:text-white">
                        {tx.student}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {tx.month} • {tx.method} • {tx.time}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-black font-mono text-xs text-emerald-600 dark:text-emerald-400">
                      +{formatMoney(tx.amount, 'UZS')}
                    </p>
                    <Badge variant={tx.badge as any} size="sm">
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right 1 Col: Course & Schedule Card */}
        <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <CardHeader
            title="Dars Jadvali & Xonalar"
            subtitle="Faol kurslar va auditoriyalar yuklamasi"
          />
          <CardContent className="space-y-3.5">
            {/* Math Direction */}
            <div className="rounded-2xl border border-amber-400/30 bg-amber-50/50 p-3.5 dark:bg-amber-950/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-900 dark:text-amber-200">
                  📐 Matematika & Mantiq
                </span>
                <span className="rounded-full bg-amber-500 text-white px-2 py-0.5 text-[9px] font-black">
                  11 o‘quvchi
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Ustoz: <strong>Hadicha ustoz</strong> (Oliy toifali mentor)
              </p>
              <div className="flex items-center gap-2 text-[10px] text-amber-700 dark:text-amber-400 font-bold">
                <Clock className="h-3 w-3" />
                <span>Dush, Chor, Juma 14:00 (101-xona)</span>
              </div>
            </div>

            {/* English Direction */}
            <div className="rounded-2xl border border-indigo-400/30 bg-indigo-50/50 p-3.5 dark:bg-indigo-950/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-indigo-900 dark:text-indigo-200">
                  🇬🇧 Intensive IELTS English
                </span>
                <span className="rounded-full bg-indigo-600 text-white px-2 py-0.5 text-[9px] font-black">
                  16 o‘quvchi
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Ustoz: <strong>Hasanboy ustoz</strong> (IELTS 8.5)
              </p>
              <div className="flex items-center gap-2 text-[10px] text-indigo-700 dark:text-indigo-400 font-bold">
                <Clock className="h-3 w-3" />
                <span>Sesh, Pay, Shanba 15:30 (102-xona)</span>
              </div>
            </div>

            {/* Center Status */}
            <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span className="font-bold text-slate-700 dark:text-slate-300">Auditoriya bandligi</span>
              </div>
              <span className="font-mono font-black text-emerald-600">100%</span>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
