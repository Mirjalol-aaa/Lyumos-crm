import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { useLMS } from '../../context/LMSContext';
import {
  Building2,
  ShieldCheck,
  GraduationCap,
  Users,
  BookOpen,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ArrowRight,
  DollarSign,
  CreditCard,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Branch } from '../../types/admin';

interface AdminOverviewPageProps {
  onNavigateTab: (tabId: string) => void;
}

export const AdminOverviewPage: React.FC<AdminOverviewPageProps> = ({
  onNavigateTab,
}) => {
  const {
    students,
    teachers,
    groups,
    branches,
    admins,
    addBranch,
    addAdmin,
    financials,
    selectedBranchFilter,
  } = useCRM();

  const { currentUser } = useLMS();

  // Quick Action Modals
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);

  // New Branch Form State
  const [branchForm, setBranchForm] = useState({
    name: '',
    city: 'Toshkent',
    address: '',
    phone: '+998',
    managerName: '',
    status: 'Active' as Branch['status'],
  });

  // New Admin Form State
  const [adminForm, setAdminForm] = useState({
    fullName: '',
    email: '',
    phone: '+998',
    branchId: branches[0]?.id || 'BR-01',
    role: 'branch_admin' as const,
    status: 'active' as const,
  });

  // Filter entities if a specific branch is selected
  const activeBranch = useMemo(() => {
    if (selectedBranchFilter === 'all') return null;
    return branches.find((b) => b.id === selectedBranchFilter) || null;
  }, [branches, selectedBranchFilter]);

  // Aggregate Metrics for 5 KPI Cards
  const totalBranchesCount = branches.length;
  const activeBranchesCount = branches.filter((b) => b.status === 'Active').length;

  const totalAdminsCount = admins.length;
  const activeAdminsCount = admins.filter((a) => a.status === 'active').length;

  const totalTeachersCount = activeBranch
    ? activeBranch.teacherCount
    : teachers.length || branches.reduce((acc, b) => acc + b.teacherCount, 0);

  const totalStudentsCount = activeBranch
    ? activeBranch.studentCount
    : students.length || branches.reduce((acc, b) => acc + b.studentCount, 0);

  const totalGroupsCount = activeBranch
    ? activeBranch.groupsCount
    : groups.length || branches.reduce((acc, b) => acc + b.groupsCount, 0);

  // Monthly Dynamic Growth Data for Area Chart
  const growthData = useMemo(() => {
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr'];
    const base = Math.max(120, Math.floor(totalStudentsCount * 0.45));
    const step = Math.floor((totalStudentsCount - base) / (months.length - 1));

    return months.map((m, idx) => ({
      month: m,
      students: Math.min(totalStudentsCount, base + idx * step + (idx === months.length - 1 ? 0 : (idx % 2 === 0 ? 5 : -3))),
      attendance: 92 + (idx % 5),
    }));
  }, [totalStudentsCount]);

  // Branch Student Distribution Data for Bar Chart
  const branchChartData = useMemo(() => {
    return branches.map((b) => ({
      name: b.name.replace('Lumos ', '').replace(' Filiali', '').replace(' (Bosh Markaz)', ''),
      students: b.studentCount,
      groups: b.groupsCount,
      status: b.status,
    }));
  }, [branches]);

  // Financial Snapshot
  const totalRevenue = useMemo(() => {
    return branches.reduce((sum, b) => sum + b.monthlyRevenue, 0) || financials.paidIncome;
  }, [branches, financials]);

  // Recent Activities
  const recentActivities = useMemo(() => {
    const list = [
      {
        id: 'ACT-1',
        title: 'Yangi to‘lov qabul qilindi',
        subtitle: 'Amir Temur sh. filiali • 850 000 so‘m',
        time: '5 daqiqa oldin',
        icon: DollarSign,
        badge: 'To‘lov',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      },
      {
        id: 'ACT-2',
        title: 'Yangi o‘quvchi ro‘yxatdan o‘tdi',
        subtitle: 'Matematika 5–7 guruhiga qo‘shildi',
        time: '24 daqiqa oldin',
        icon: Users,
        badge: 'O‘quvchi',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      },
      {
        id: 'ACT-3',
        title: 'Yangi guruh ochildi',
        subtitle: 'Lumos Urganch • "IELTS Rocket" guruhi',
        time: '1 soat oldin',
        icon: BookOpen,
        badge: 'Guruh',
        color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      },
      {
        id: 'ACT-4',
        title: 'Admin tizimga kirdi',
        subtitle: 'Farrux Rustamov • Toshkent Bosh Markaz',
        time: '2 soat oldin',
        icon: ShieldCheck,
        badge: 'Tizim',
        color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      },
    ];
    return list;
  }, []);

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchForm.name || !branchForm.address) return;

    addBranch({
      name: branchForm.name,
      city: branchForm.city,
      address: branchForm.address,
      phone: branchForm.phone,
      managerName: branchForm.managerName || 'Admin belgilanmagan',
      studentCount: 0,
      teacherCount: 0,
      groupsCount: 0,
      monthlyRevenue: 0,
      status: branchForm.status,
    });

    setIsAddBranchOpen(false);
    setBranchForm({
      name: '',
      city: 'Toshkent',
      address: '',
      phone: '+998',
      managerName: '',
      status: 'Active',
    });
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminForm.fullName || !adminForm.email) return;

    const b = branches.find((item) => item.id === adminForm.branchId);

    addAdmin({
      fullName: adminForm.fullName,
      email: adminForm.email,
      phone: adminForm.phone,
      branchId: adminForm.branchId,
      branchName: b?.name || 'Filial',
      role: adminForm.role,
      status: adminForm.status,
      lastActive: 'Hozir faol',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
    });

    setIsAddAdminOpen(false);
    setAdminForm({
      fullName: '',
      email: '',
      phone: '+998',
      branchId: branches[0]?.id || 'BR-01',
      role: 'branch_admin',
      status: 'active',
    });
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 min-h-screen bg-[#080406]/30">
      {/* 1. WELCOME BANNER (DARK LUXURY BURGUNDY + GOLD) */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-r from-[#2A060E] via-[#1B050A] to-[#0D0407] p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Subtle decorative radial glow */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-[#5A0B1C]/30 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-[#E7B83F] shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Lumos Ta’lim Tarmog‘i Boshqaruvi</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#F8F4EA] font-serif">
              Xush kelibsiz, Super Admin
            </h2>
            <p className="max-w-2xl text-xs sm:text-sm text-[#D8D0C5] leading-relaxed">
              Lumos ta’lim markazlari tarmog‘ining umumiy statistikasi, barcha filiallar holati, adminlar faolligi va moliyaviy o‘sish ko‘rsatkichlari nazoratingiz ostida.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAddBranchOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-amber-400/40 bg-gradient-to-r from-[#D9A62E] to-[#E7B83F] px-4 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-[1.02] hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>+ Markaz qo‘shish</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddAdminOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-[#1A0E14]/80 px-4 py-2.5 text-xs font-bold text-[#F8F4EA] shadow-md hover:bg-amber-500/10 hover:border-amber-500/50 active:scale-[0.98] transition-all cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4 text-[#E7B83F]" />
              <span>+ Admin qo‘shish</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. EXACTLY 5 CORE KPI CARDS (Markazlar, Adminlar, O‘qituvchilar, O‘quvchilar, Guruhlar) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* KPI 1: Markazlar */}
        <div
          onClick={() => onNavigateTab('branches')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-amber-500/15 bg-[#12080D]/80 p-5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9D958C]">
              Markazlar
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#E7B83F] group-hover:scale-110 transition-transform">
              <Building2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#F8F4EA] font-serif">
              {totalBranchesCount}
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              {activeBranchesCount} faol
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#9D958C]">
            <span>Filiallar tarmog‘i</span>
            <span className="text-amber-500 group-hover:translate-x-1 transition-transform">
              Barchasi →
            </span>
          </div>
        </div>

        {/* KPI 2: Adminlar */}
        <div
          onClick={() => onNavigateTab('credentials')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-amber-500/15 bg-[#12080D]/80 p-5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9D958C]">
              Adminlar
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#E7B83F] group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#F8F4EA] font-serif">
              {totalAdminsCount}
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              {activeAdminsCount} faol
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#9D958C]">
            <span>Mas’ul menejerlar</span>
            <span className="text-amber-500 group-hover:translate-x-1 transition-transform">
              Barchasi →
            </span>
          </div>
        </div>

        {/* KPI 3: O‘qituvchilar */}
        <div
          onClick={() => onNavigateTab('teachers')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-amber-500/15 bg-[#12080D]/80 p-5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9D958C]">
              O‘qituvchilar
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#F8F4EA] font-serif">
              {totalTeachersCount}
            </span>
            <span className="text-xs font-semibold text-blue-400 flex items-center">
              Malakali ustozlar
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#9D958C]">
            <span>Pedagogik tarkib</span>
            <span className="text-amber-500 group-hover:translate-x-1 transition-transform">
              Barchasi →
            </span>
          </div>
        </div>

        {/* KPI 4: O‘quvchilar */}
        <div
          onClick={() => onNavigateTab('students')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-amber-500/15 bg-[#12080D]/80 p-5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9D958C]">
              O‘quvchilar
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#F8F4EA] font-serif">
              {totalStudentsCount}
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +14% oy
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#9D958C]">
            <span>Faol o‘quvchilar</span>
            <span className="text-amber-500 group-hover:translate-x-1 transition-transform">
              Barchasi →
            </span>
          </div>
        </div>

        {/* KPI 5: Guruhlar */}
        <div
          onClick={() => onNavigateTab('groups')}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-amber-500/15 bg-[#12080D]/80 p-5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9D958C]">
              Guruhlar
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#F8F4EA] font-serif">
              {totalGroupsCount}
            </span>
            <span className="text-xs font-semibold text-purple-400 flex items-center">
              Faol darslar
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-[#9D958C]">
            <span>Barcha yo‘nalishlar</span>
            <span className="text-amber-500 group-hover:translate-x-1 transition-transform">
              Barchasi →
            </span>
          </div>
        </div>
      </div>

      {/* 3. CHARTS SECTION (2-3 CLEAN CHARTS) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* CHART 1: Student Growth Dynamics (AreaChart) - 7 cols */}
        <div className="lg:col-span-7 rounded-2xl border border-amber-500/15 bg-[#12080D]/80 p-5 sm:p-6 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100/10 pb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#F8F4EA]">
                O‘quvchilar O‘sish Dinamikasi
              </h3>
              <p className="text-xs text-[#9D958C]">
                Lumos tarmog‘i bo‘yicha oylar kesimida o‘quvchilar sonining ortishi
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[#E7B83F]">
                <span className="h-2 w-2 rounded-full bg-[#E7B83F]" />
                O‘quvchilar
              </span>
            </div>
          </div>

          <div className="mt-6 h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E7B83F" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#5A0B1C" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(217, 166, 46, 0.1)" />
                <XAxis
                  dataKey="month"
                  stroke="#9D958C"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(217, 166, 46, 0.2)' }}
                />
                <YAxis
                  stroke="#9D958C"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(217, 166, 46, 0.2)' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A0E14',
                    borderColor: 'rgba(217, 166, 46, 0.3)',
                    borderRadius: '12px',
                    color: '#F8F4EA',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  }}
                  formatter={(value: any) => [`${value} nafar`, 'O‘quvchilar']}
                />
                <Area
                  type="monotone"
                  dataKey="students"
                  stroke="#E7B83F"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#growthGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Students Distribution Across Branches (BarChart) - 5 cols */}
        <div className="lg:col-span-5 rounded-2xl border border-amber-500/15 bg-[#12080D]/80 p-5 sm:p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-100/10 pb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#F8F4EA]">
                Markazlar Bo‘yicha Taqsimot
              </h3>
              <p className="text-xs text-[#9D958C]">
                Har bir filialdagi o‘quvchilar soni taqqoslovi
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('branches')}
              className="text-xs font-bold text-amber-500 hover:text-amber-400"
            >
              Barchasi →
            </button>
          </div>

          <div className="mt-6 h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(217, 166, 46, 0.1)" />
                <XAxis
                  dataKey="name"
                  stroke="#9D958C"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(217, 166, 46, 0.2)' }}
                />
                <YAxis
                  stroke="#9D958C"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(217, 166, 46, 0.2)' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A0E14',
                    borderColor: 'rgba(217, 166, 46, 0.3)',
                    borderRadius: '12px',
                    color: '#F8F4EA',
                    fontSize: '12px',
                  }}
                  formatter={(value: any) => [`${value} ta o‘quvchi`, 'Sig‘im']}
                />
                <Bar dataKey="students" radius={[6, 6, 0, 0]}>
                  {branchChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? '#E7B83F' : index === 1 ? '#D9A62E' : index === 2 ? '#C69324' : '#8C2B3E'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. FINANCIAL SUMMARY SNAPSHOT & RECENT ACTIVITY (2 Columns) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Financial Summary Card - 6 cols */}
        <div className="lg:col-span-6 rounded-2xl border border-amber-500/15 bg-[#12080D]/80 p-5 sm:p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-100/10 pb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#F8F4EA]">
                Moliyaviy Holat Xulosasi
              </h3>
              <p className="text-xs text-[#9D958C]">
                Tarmoq bo‘yicha oylik kutilayotgan va qabul qilingan to‘lovlar
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('payments')}
              className="text-xs font-bold text-amber-500 hover:text-amber-400"
            >
              Moliya →
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-amber-500/20 bg-[#1A0E14]/80 p-4">
              <span className="text-[11px] font-bold text-[#9D958C] uppercase">
                Oylik Umumiy Tushum
              </span>
              <p className="mt-1 text-xl font-black text-[#E7B83F] font-serif">
                {totalRevenue.toLocaleString()} so‘m
              </p>
              <div className="mt-2 flex items-center text-[10px] text-emerald-400 font-semibold">
                <TrendingUp className="h-3 w-3 mr-1" /> Reja 94% bajarildi
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-[#1A0E14]/80 p-4">
              <span className="text-[11px] font-bold text-[#9D958C] uppercase">
                Kutilayotgan / Qarz
              </span>
              <p className="mt-1 text-xl font-black text-rose-400 font-serif">
                {(financials.unpaidIncome || 8400000).toLocaleString()} so‘m
              </p>
              <div className="mt-2 flex items-center text-[10px] text-[#9D958C]">
                <span>{financials.unpaidCount || 12} nafar o‘quvchi</span>
              </div>
            </div>
          </div>

          {/* Branch Breakdown mini list */}
          <div className="mt-5 space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#9D958C]">
              Filiallar Oylik Ko‘rsatkichi:
            </p>
            {branches.slice(0, 3).map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-xl border border-amber-500/10 bg-[#180D12]/60 px-3.5 py-2.5 text-xs text-[#D8D0C5]"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-amber-500" />
                  <span className="font-semibold text-[#F8F4EA]">{b.name}</span>
                </div>
                <span className="font-bold text-[#E7B83F]">
                  {b.monthlyRevenue.toLocaleString()} so‘m
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent System Activity - 6 cols */}
        <div className="lg:col-span-6 rounded-2xl border border-amber-500/15 bg-[#12080D]/80 p-5 sm:p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-slate-100/10 pb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#F8F4EA]">
                So‘nggi Tizim Faoliyati
              </h3>
              <p className="text-xs text-[#9D958C]">
                Tarmoqda amalga oshirilgan oxirgi amallar va yangiliklar
              </p>
            </div>
            <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
              Jonli
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {recentActivities.map((act) => {
              const Icon = act.icon;
              return (
                <div
                  key={act.id}
                  className="flex items-center justify-between rounded-xl border border-amber-500/10 bg-[#1A0E14]/60 p-3 hover:border-amber-500/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${act.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#F8F4EA]">{act.title}</p>
                      <p className="text-[11px] text-[#9D958C]">{act.subtitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#9D958C] flex items-center gap-1 justify-end">
                      <Clock className="h-3 w-3" /> {act.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODAL: ADD BRANCH */}
      <Modal
        isOpen={isAddBranchOpen}
        onClose={() => setIsAddBranchOpen(false)}
        title="Yangi Markaz Qo‘shish"
        maxWidth="md"
      >
        <form onSubmit={handleCreateBranch} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-[#D8D0C5] mb-1">
              Markaz Nomi *
            </label>
            <Input
              required
              placeholder="Masalan: Lumos Navoiy Filiali"
              value={branchForm.name}
              onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#D8D0C5] mb-1">
                Shahar / Joylashuv *
              </label>
              <Input
                required
                placeholder="Toshkent, Urganch, Samarqand..."
                value={branchForm.city}
                onChange={(e) => setBranchForm({ ...branchForm, city: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#D8D0C5] mb-1">
                Aloqa Telefoni
              </label>
              <Input
                placeholder="+998 (71) 200-00-00"
                value={branchForm.phone}
                onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-[#D8D0C5] mb-1">
              To‘liq Manzil *
            </label>
            <Input
              required
              placeholder="Ko‘cha, bino raqami yoki mo‘ljal"
              value={branchForm.address}
              onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#D8D0C5] mb-1">
                Mas’ul Rahbar / Menejer
              </label>
              <Input
                placeholder="F.I.O"
                value={branchForm.managerName}
                onChange={(e) => setBranchForm({ ...branchForm, managerName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#D8D0C5] mb-1">
                Filial Holati
              </label>
              <Select
                value={branchForm.status}
                onChange={(e) =>
                  setBranchForm({ ...branchForm, status: e.target.value as Branch['status'] })
                }
              >
                <option value="Active">Faol (Ishlamoqda)</option>
                <option value="Planned">Rejalashtirilgan</option>
                <option value="Renovation">Ta’mirda</option>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-amber-500/20">
            <Button variant="ghost" type="button" onClick={() => setIsAddBranchOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" type="submit">
              Markazni saqlash
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: ADD ADMIN */}
      <Modal
        isOpen={isAddAdminOpen}
        onClose={() => setIsAddAdminOpen(false)}
        title="Yangi Mas’ul Admin Qo‘shish"
        maxWidth="md"
      >
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-[#D8D0C5] mb-1">
              F.I.O *
            </label>
            <Input
              required
              placeholder="Ism Familiya"
              value={adminForm.fullName}
              onChange={(e) => setAdminForm({ ...adminForm, fullName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#D8D0C5] mb-1">
                Email / Login *
              </label>
              <Input
                required
                type="email"
                placeholder="admin@lumos.uz"
                value={adminForm.email}
                onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#D8D0C5] mb-1">
                Telefon Raqami
              </label>
              <Input
                placeholder="+998 (90) 000-00-00"
                value={adminForm.phone}
                onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#D8D0C5] mb-1">
                Biriktiriladigan Markaz *
              </label>
              <Select
                value={adminForm.branchId}
                onChange={(e) => setAdminForm({ ...adminForm, branchId: e.target.value })}
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#D8D0C5] mb-1">
                Rol
              </label>
              <Select
                value={adminForm.role}
                onChange={(e) => setAdminForm({ ...adminForm, role: e.target.value as any })}
              >
                <option value="branch_admin">Filial Admini</option>
                <option value="manager">Menejer</option>
                <option value="super_admin">Super Admin</option>
              </Select>
            </div>
          </div>

          <p className="text-[11px] text-amber-500/80 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
            ℹ️ Admin yaratilgach, dastlabki xavfsiz parol avtomatik shakllanadi va admin emailiga yuboriladi.
          </p>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-amber-500/20">
            <Button variant="ghost" type="button" onClick={() => setIsAddAdminOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" type="submit">
              Adminni saqlash
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
