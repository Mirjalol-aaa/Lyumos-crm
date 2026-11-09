import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Building2,
  ShieldCheck,
  GraduationCap,
  Users,
  ChevronRight,
  ChevronDown,
  Calendar,
  Layers,
  BookOpen,
  CreditCard,
  Eye,
  Edit2,
  Trash2,
  Check,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ActionDropdown } from '../../components/ui/ActionDropdown';
import { Branch } from '../../types/admin';

// ─── Lumos Design Tokens ─────────────────────────────────────────────────────
const C = {
  pageBg:        '#F8F6F2',
  cardBg:        '#FFFFFF',
  tableHeader:   '#F3EEE7',
  border:        '#E7E1D8',
  rowHover:      '#FCF8F5',
  primary:       '#6F1028',
  primaryDark:   '#4A0B1B',
  burgundyLight: '#F7E9ED',
  gold:          '#C89B3C',
  goldBg:        '#F7F0E2',
  goldText:      '#8A641C',
  textPrimary:   '#1F2937',
  textSecondary: '#667085',
  textMuted:     '#98A2B3',
  success:       '#16A36A',
  successBg:     '#E8F7F0',
  danger:        '#C0392B',
  dangerBg:      '#FDECEC',
};

interface AdminOverviewPageProps {
  onNavigateTab: (tabId: string) => void;
}

export const AdminOverviewPage: React.FC<AdminOverviewPageProps> = ({
  onNavigateTab,
}) => {
  const {
    branches,
    admins,
    teachers,
    groups,
    students,
    addBranch,
    updateBranch,
    deleteBranch,
    addAdmin,
    addTeacher,
    addStudent,
  } = useCRM();

  // Modals state
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  // Table row action modals
  const [viewingBranch, setViewingBranch] = useState<Branch | null>(null);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [deletingBranchId, setDeletingBranchId] = useState<string | null>(null);

  // Date Filter State
  const [dateRangeFilter, setDateRangeFilter] = useState<'month' | 'today' | 'week' | 'year'>('month');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  // Growth Chart Range Filter
  const [growthRange, setGrowthRange] = useState<'6m' | '3m' | '1y'>('6m');
  const [isGrowthDropdownOpen, setIsGrowthDropdownOpen] = useState(false);

  // Branch Form
  const [branchForm, setBranchForm] = useState({
    name: '',
    city: 'Urganch',
    address: '',
    phone: '+998',
    managerName: '',
    status: 'Active' as Branch['status'],
  });

  // Admin Form
  const [adminForm, setAdminForm] = useState({
    fullName: '',
    email: '',
    phone: '+998',
    branchId: branches[0]?.id || 'BR-01',
    role: 'branch_admin' as const,
    status: 'active' as const,
  });

  // Teacher Form
  const [teacherForm, setTeacherForm] = useState({
    fullName: '',
    email: '',
    phone: '+998',
    subjects: 'Matematika',
    experienceYears: 5,
  });

  // Student Form
  const [studentForm, setStudentForm] = useState({
    fullName: '',
    phone: '+998',
    parentName: '',
    parentPhone: '+998',
    groupName: 'Matematika 5-A',
    monthlyFee: 350000,
  });

  // Exact KPI Counts
  const totalBranchesCount = branches.length || 6;
  const totalAdminsCount = admins.length || 12;
  const totalTeachersCount = teachers.length > 20 ? teachers.length : 28;
  const totalGroupsCount = groups.length > 20 ? groups.length : 52;
  const totalStudentsCount = students.length > 100 ? students.length : 684;

  // Area Chart Data: O‘quvchilar dinamikasi
  const dynamicGrowthData = useMemo(() => {
    if (growthRange === '3m') {
      return [
        { month: 'Iyul', students: 510 },
        { month: 'Avg', students: 595 },
        { month: 'Sen', students: 684 },
      ];
    }
    if (growthRange === '1y') {
      return [
        { month: 'Okt', students: 280 },
        { month: 'Dek', students: 340 },
        { month: 'Fev', students: 410 },
        { month: 'Apr', students: 480 },
        { month: 'Iyun', students: 560 },
        { month: 'Avg', students: 620 },
        { month: 'Sen', students: 684 },
      ];
    }
    return [
      { month: 'Apr', students: 380 },
      { month: 'May', students: 430 },
      { month: 'Iyun', students: 495 },
      { month: 'Iyul', students: 550 },
      { month: 'Avg', students: 615 },
      { month: 'Sen', students: 684 },
    ];
  }, [growthRange]);

  // Donut Chart Data: Markazlar bo‘yicha o‘quvchilar (Lumos Palette)
  const donutData = useMemo(() => {
    return [
      { name: 'Toshkent', value: 36, count: 246, color: C.primary },
      { name: 'Urganch', value: 28, count: 192, color: C.gold },
      { name: 'Xiva', value: 20, count: 137, color: C.primaryDark },
      { name: 'Buxoro', value: 16, count: 109, color: '#DFBC76' },
    ];
  }, []);

  // Recent Activity Feed
  const recentActivities = [
    {
      id: 'act-1',
      title: 'Yangi o‘quvchi qo‘shildi',
      subtitle: 'Lumos Toshkent markazi',
      time: '12:45',
      icon: Users,
    },
    {
      id: 'act-2',
      title: 'Guruh yaratildi',
      subtitle: 'Matematika 5–A',
      time: '10:20',
      icon: Layers,
    },
    {
      id: 'act-3',
      title: 'Dars qo‘shildi',
      subtitle: 'Algebra, 1-dars',
      time: '08:40',
      icon: BookOpen,
    },
    {
      id: 'act-4',
      title: 'To‘lov tasdiqlandi',
      subtitle: 'Madina Sodiqova',
      time: '08:15',
      icon: CreditCard,
    },
  ];

  // Handlers for Add Forms
  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchForm.name.trim() || !branchForm.address.trim()) return;

    addBranch({
      name: branchForm.name.trim(),
      city: branchForm.city.trim(),
      address: branchForm.address.trim(),
      phone: branchForm.phone.trim(),
      managerName: branchForm.managerName.trim() || 'Admin biriktirilmagan',
      studentCount: 0,
      teacherCount: 0,
      groupsCount: 0,
      monthlyRevenue: 0,
      status: branchForm.status,
    });

    setIsAddBranchOpen(false);
    setBranchForm({
      name: '',
      city: 'Urganch',
      address: '',
      phone: '+998',
      managerName: '',
      status: 'Active',
    });
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminForm.fullName.trim() || !adminForm.email.trim()) return;

    const b = branches.find((item) => item.id === adminForm.branchId);

    addAdmin({
      fullName: adminForm.fullName.trim(),
      email: adminForm.email.trim().toLowerCase(),
      phone: adminForm.phone.trim(),
      branchId: adminForm.branchId,
      branchName: b?.name || 'Lumos Filiali',
      role: adminForm.role,
      status: adminForm.status,
      lastActive: 'Hozir faol',
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

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherForm.fullName.trim()) return;

    addTeacher({
      fullName: teacherForm.fullName.trim(),
      email: `${teacherForm.fullName.toLowerCase().replace(/\s+/g, '')}@lumos.uz`,
      phone: teacherForm.phone.trim(),
      subjects: [teacherForm.subjects],
      baseSalary: 4500000,
      bonusPerStudent: 25000,
      schedule: 'Dush, Chor, Juma',
      status: 'Active',
      avatar: '',
      joinedDate: new Date().toISOString().split('T')[0],
    });

    setIsAddTeacherOpen(false);
    setTeacherForm({
      fullName: '',
      email: '',
      phone: '+998',
      subjects: 'Matematika',
      experienceYears: 5,
    });
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.fullName.trim()) return;

    addStudent({
      fullName: studentForm.fullName.trim(),
      phone: studentForm.phone.trim(),
      parentName: studentForm.parentName.trim(),
      parentPhone: studentForm.parentPhone.trim(),
      groupName: studentForm.groupName,
      monthlyFee: studentForm.monthlyFee,
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: '',
      birthDate: '2010-01-01',
      gender: 'Male',
      email: '',
      groupId: 'GRP-01',
      teacherId: 'TCH-01',
      teacherName: 'Ustoz',
    });

    setIsAddStudentOpen(false);
    setStudentForm({
      fullName: '',
      phone: '+998',
      parentName: '',
      parentPhone: '+998',
      groupName: 'Matematika 5-A',
      monthlyFee: 350000,
    });
  };

  const handleConfirmDeleteBranch = () => {
    if (deletingBranchId) {
      deleteBranch(deletingBranchId);
      setDeletingBranchId(null);
    }
  };

  const handleSaveEditBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch || !branchForm.name.trim()) return;

    updateBranch(editingBranch.id, {
      name: branchForm.name.trim(),
      city: branchForm.city.trim(),
      managerName: branchForm.managerName.trim(),
    });

    setEditingBranch(null);
  };

  return (
    <div className="min-h-screen p-6 lg:p-8 space-y-6" style={{ background: C.pageBg }}>
      
      {/* ── 1. PAGE HEADER & DATE FILTER ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: C.textPrimary }}>
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: C.textSecondary }}>
            Lumos ta’lim tizimining umumiy tahliliy boshqaruv paneli
          </p>
        </div>

        {/* Date Picker Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
            className="flex items-center gap-3.5 rounded-xl px-4 py-2.5 transition-all cursor-pointer text-left"
            style={{
              background: C.cardBg,
              border: `1px solid ${C.border}`,
              boxShadow: '0 1px 3px rgba(111,16,40,0.03)',
            }}
          >
            <Calendar className="h-4 w-4 shrink-0" style={{ color: C.primary }} />
            <div className="flex flex-col">
              <span className="text-xs font-bold leading-tight" style={{ color: C.textPrimary }}>
                {dateRangeFilter === 'today'
                  ? 'Bugungi ko‘rsatkichlar'
                  : dateRangeFilter === 'week'
                  ? 'Haftalik ko‘rsatkichlar'
                  : dateRangeFilter === 'year'
                  ? 'Yillik (2026) ko‘rsatkichlar'
                  : 'Oylik: Sentabr 2026'}
              </span>
              <span className="text-[10px] font-medium leading-tight mt-0.5" style={{ color: C.textMuted }}>
                Tanlangan davr
              </span>
            </div>
            <ChevronDown className="h-4 w-4 ml-1 shrink-0" style={{ color: C.textMuted }} />
          </button>

          {isDateDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-52 rounded-xl p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100"
              style={{ background: C.cardBg, border: `1px solid ${C.border}` }}
            >
              {[
                { id: 'today', label: 'Bugun' },
                { id: 'week', label: 'Bu hafta' },
                { id: 'month', label: 'Shu oy (Sentabr)' },
                { id: 'year', label: 'Shu yil (2026)' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setDateRangeFilter(item.id as any);
                    setIsDateDropdownOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors cursor-pointer"
                  style={{
                    background: dateRangeFilter === item.id ? C.primary : 'transparent',
                    color: dateRangeFilter === item.id ? '#FFFFFF' : C.textPrimary,
                  }}
                >
                  <span>{item.label}</span>
                  {dateRangeFilter === item.id && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── 2. EXACT 5 KPI CARDS ROW ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {/* KPI 1: Markazlar */}
        <div
          onClick={() => onNavigateTab('branches')}
          className="rounded-2xl p-4 flex items-center gap-3.5 transition-all cursor-pointer group"
          style={{
            background: C.cardBg,
            border: `1px solid ${C.border}`,
            boxShadow: '0 1px 4px rgba(111,16,40,0.03)',
          }}
        >
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
            style={{ background: C.burgundyLight, color: C.primary }}
          >
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold leading-tight" style={{ color: C.textPrimary }}>
              {totalBranchesCount}
            </p>
            <p className="text-xs font-medium mt-0.5" style={{ color: C.textSecondary }}>
              Markazlar
            </p>
            <p className="text-[11px] font-semibold mt-0.5 flex items-center gap-0.5" style={{ color: C.success }}>
              <span>↑ 0%</span>
              <span className="font-normal ml-1" style={{ color: C.textMuted }}>O‘tgan oyga nisbatan</span>
            </p>
          </div>
        </div>

        {/* KPI 2: Adminlar */}
        <div
          onClick={() => onNavigateTab('credentials')}
          className="rounded-2xl p-4 flex items-center gap-3.5 transition-all cursor-pointer group"
          style={{
            background: C.cardBg,
            border: `1px solid ${C.border}`,
            boxShadow: '0 1px 4px rgba(111,16,40,0.03)',
          }}
        >
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
            style={{ background: C.goldBg, color: C.goldText }}
          >
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold leading-tight" style={{ color: C.textPrimary }}>
              {totalAdminsCount}
            </p>
            <p className="text-xs font-medium mt-0.5" style={{ color: C.textSecondary }}>
              Adminlar
            </p>
            <p className="text-[11px] font-semibold mt-0.5 flex items-center gap-0.5" style={{ color: C.success }}>
              <span>↑ 9%</span>
              <span className="font-normal ml-1" style={{ color: C.textMuted }}>O‘tgan oyga nisbatan</span>
            </p>
          </div>
        </div>

        {/* KPI 3: O‘qituvchilar */}
        <div
          onClick={() => onNavigateTab('teachers')}
          className="rounded-2xl p-4 flex items-center gap-3.5 transition-all cursor-pointer group"
          style={{
            background: C.cardBg,
            border: `1px solid ${C.border}`,
            boxShadow: '0 1px 4px rgba(111,16,40,0.03)',
          }}
        >
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
            style={{ background: C.burgundyLight, color: C.primary }}
          >
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold leading-tight" style={{ color: C.textPrimary }}>
              {totalTeachersCount.toLocaleString()}
            </p>
            <p className="text-xs font-medium mt-0.5" style={{ color: C.textSecondary }}>
              O‘qituvchilar
            </p>
            <p className="text-[11px] font-semibold mt-0.5 flex items-center gap-0.5" style={{ color: C.success }}>
              <span>↑ 12%</span>
              <span className="font-normal ml-1" style={{ color: C.textMuted }}>Faol ustozlar</span>
            </p>
          </div>
        </div>

        {/* KPI 4: Guruhlar */}
        <div
          onClick={() => onNavigateTab('groups')}
          className="rounded-2xl p-4 flex items-center gap-3.5 transition-all cursor-pointer group"
          style={{
            background: C.cardBg,
            border: `1px solid ${C.border}`,
            boxShadow: '0 1px 4px rgba(111,16,40,0.03)',
          }}
        >
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
            style={{ background: C.goldBg, color: C.goldText }}
          >
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold leading-tight" style={{ color: C.textPrimary }}>
              {totalGroupsCount}
            </p>
            <p className="text-xs font-medium mt-0.5" style={{ color: C.textSecondary }}>
              Guruhlar
            </p>
            <p className="text-[11px] font-semibold mt-0.5 flex items-center gap-0.5" style={{ color: C.success }}>
              <span>↑ 8%</span>
              <span className="font-normal ml-1" style={{ color: C.textMuted }}>O‘tgan oyga nisbatan</span>
            </p>
          </div>
        </div>

        {/* KPI 5: O‘quvchilar */}
        <div
          onClick={() => onNavigateTab('students')}
          className="col-span-2 lg:col-span-1 rounded-2xl p-4 flex items-center gap-3.5 transition-all cursor-pointer group"
          style={{
            background: C.cardBg,
            border: `1px solid ${C.border}`,
            boxShadow: '0 1px 4px rgba(111,16,40,0.03)',
          }}
        >
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
            style={{ background: C.successBg, color: C.success }}
          >
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold leading-tight" style={{ color: C.textPrimary }}>
              {totalStudentsCount.toLocaleString()}
            </p>
            <p className="text-xs font-medium mt-0.5" style={{ color: C.textSecondary }}>
              O‘quvchilar
            </p>
            <p className="text-[11px] font-semibold mt-0.5 flex items-center gap-0.5" style={{ color: C.success }}>
              <span>↑ 22%</span>
              <span className="font-normal ml-1" style={{ color: C.textMuted }}>Faol talabalar</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── 3. MIDDLE ROW (CHARTS & QUICK ACTIONS) ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* CHART 1: O‘quvchilar dinamikasi (AreaChart) - 5 cols */}
        <div
          className="lg:col-span-5 rounded-2xl p-5 flex flex-col justify-between"
          style={{
            background: C.cardBg,
            border: `1px solid ${C.border}`,
            boxShadow: '0 1px 4px rgba(111,16,40,0.03)',
          }}
        >
          <div className="flex items-center justify-between pb-3" style={{ borderBottom: `1px solid ${C.border}` }}>
            <div>
              <h3 className="text-sm font-bold" style={{ color: C.textPrimary }}>
                O‘quvchilar dinamikasi
              </h3>
              <p className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>
                Qabul qilingan o‘quvchilar o‘sish ko‘rsatkichi
              </p>
            </div>

            {/* Dropdown filter */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsGrowthDropdownOpen(!isGrowthDropdownOpen)}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer"
                style={{
                  background: C.cardBg,
                  border: `1px solid ${C.border}`,
                  color: C.textSecondary,
                }}
              >
                <span>{growthRange === '6m' ? 'So‘nggi 6 oy' : growthRange === '3m' ? 'So‘nggi 3 oy' : '1 yil'}</span>
                <ChevronDown className="h-3.5 w-3.5" style={{ color: C.textMuted }} />
              </button>

              {isGrowthDropdownOpen && (
                <div
                  className="absolute right-0 mt-1 w-32 rounded-xl p-1 shadow-lg z-20"
                  style={{ background: C.cardBg, border: `1px solid ${C.border}` }}
                >
                  {[
                    { id: '3m', label: 'So‘nggi 3 oy' },
                    { id: '6m', label: 'So‘nggi 6 oy' },
                    { id: '1y', label: '1 yil' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setGrowthRange(item.id as any);
                        setIsGrowthDropdownOpen(false);
                      }}
                      className="flex w-full px-2.5 py-1.5 text-xs text-left rounded-lg transition-colors cursor-pointer"
                      style={{
                        background: growthRange === item.id ? C.primary : 'transparent',
                        color: growthRange === item.id ? '#FFFFFF' : C.textPrimary,
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGradientBurgundy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.primary} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={C.primary} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke={C.textMuted}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke={C.textMuted}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  ticks={[0, 250, 500, 750]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: C.border,
                    borderRadius: '12px',
                    color: C.textPrimary,
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(111, 16, 40, 0.08)',
                  }}
                  formatter={(val: any) => [`${val} nafar`, 'O‘quvchilar']}
                />
                <Area
                  type="monotone"
                  dataKey="students"
                  stroke={C.primary}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#areaGradientBurgundy)"
                  dot={{ r: 4, fill: C.primary, stroke: '#FFFFFF', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: C.primary, stroke: '#FFFFFF', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Markazlar bo‘yicha o‘quvchilar (Donut Chart) - 4 cols */}
        <div
          className="lg:col-span-4 rounded-2xl p-5 flex flex-col justify-between"
          style={{
            background: C.cardBg,
            border: `1px solid ${C.border}`,
            boxShadow: '0 1px 4px rgba(111,16,40,0.03)',
          }}
        >
          <div className="pb-3" style={{ borderBottom: `1px solid ${C.border}` }}>
            <h3 className="text-sm font-bold" style={{ color: C.textPrimary }}>
              Markazlar bo‘yicha o‘quvchilar
            </h3>
            <p className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>
              Filiallar aro taqsimot ulushi
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            {/* Donut with Center Text */}
            <div className="relative h-56 w-48 shrink-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: C.border,
                      borderRadius: '10px',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${val}%`, 'Ulush']}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-extrabold leading-tight" style={{ color: C.textPrimary }}>
                  {totalStudentsCount}
                </span>
                <span className="text-[10px] font-medium leading-tight mt-0.5" style={{ color: C.textMuted }}>
                  Jami o‘quvchi
                </span>
              </div>
            </div>

            {/* Right Legend */}
            <div className="flex-1 space-y-2.5 pl-1">
              {donutData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium" style={{ color: C.textSecondary }}>{item.name}</span>
                  </div>
                  <span className="font-bold" style={{ color: C.textPrimary }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS: Tezkor amallar - 3 cols */}
        <div
          className="lg:col-span-3 rounded-2xl p-5 flex flex-col justify-between"
          style={{
            background: C.cardBg,
            border: `1px solid ${C.border}`,
            boxShadow: '0 1px 4px rgba(111,16,40,0.03)',
          }}
        >
          <div className="pb-3" style={{ borderBottom: `1px solid ${C.border}` }}>
            <h3 className="text-sm font-bold" style={{ color: C.textPrimary }}>
              Tezkor amallar
            </h3>
            <p className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>
              Asosiy elementlarni qo‘shish
            </p>
          </div>

          <div className="mt-3.5 space-y-2">
            {/* Button 1: Markaz qo‘shish */}
            <button
              type="button"
              onClick={() => setIsAddBranchOpen(true)}
              className="flex w-full items-center justify-between rounded-xl p-2.5 transition-all cursor-pointer group"
              style={{
                background: C.cardBg,
                border: `1px solid ${C.border}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.primary;
                e.currentTarget.style.background = C.rowHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.background = C.cardBg;
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105"
                  style={{ background: C.burgundyLight, color: C.primary }}
                >
                  <Building2 className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold" style={{ color: C.textPrimary }}>
                  Markaz qo‘shish
                </span>
              </div>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" style={{ color: C.textMuted }} />
            </button>

            {/* Button 2: Admin qo‘shish */}
            <button
              type="button"
              onClick={() => setIsAddAdminOpen(true)}
              className="flex w-full items-center justify-between rounded-xl p-2.5 transition-all cursor-pointer group"
              style={{
                background: C.cardBg,
                border: `1px solid ${C.border}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.primary;
                e.currentTarget.style.background = C.rowHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.background = C.cardBg;
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105"
                  style={{ background: C.goldBg, color: C.goldText }}
                >
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold" style={{ color: C.textPrimary }}>
                  Admin qo‘shish
                </span>
              </div>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" style={{ color: C.textMuted }} />
            </button>

            {/* Button 3: O‘qituvchi qo‘shish */}
            <button
              type="button"
              onClick={() => setIsAddTeacherOpen(true)}
              className="flex w-full items-center justify-between rounded-xl p-2.5 transition-all cursor-pointer group"
              style={{
                background: C.cardBg,
                border: `1px solid ${C.border}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.primary;
                e.currentTarget.style.background = C.rowHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.background = C.cardBg;
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105"
                  style={{ background: C.burgundyLight, color: C.primary }}
                >
                  <GraduationCap className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold" style={{ color: C.textPrimary }}>
                  O‘qituvchi qo‘shish
                </span>
              </div>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" style={{ color: C.textMuted }} />
            </button>

            {/* Button 4: O‘quvchi qo‘shish */}
            <button
              type="button"
              onClick={() => setIsAddStudentOpen(true)}
              className="flex w-full items-center justify-between rounded-xl p-2.5 transition-all cursor-pointer group"
              style={{
                background: C.cardBg,
                border: `1px solid ${C.border}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.primary;
                e.currentTarget.style.background = C.rowHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.background = C.cardBg;
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105"
                  style={{ background: C.successBg, color: C.success }}
                >
                  <Users className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold" style={{ color: C.textPrimary }}>
                  O‘quvchi qo‘shish
                </span>
              </div>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" style={{ color: C.textMuted }} />
            </button>
          </div>
        </div>
      </div>

      {/* ── 4. BOTTOM ROW: MARKAZLAR RO‘YXATI & SO‘NGGI FAOLIYAT ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* TABLE: Markazlar ro‘yxati (lg:col-span-8) */}
        <div
          className="lg:col-span-8 rounded-2xl p-5 flex flex-col justify-between"
          style={{
            background: C.cardBg,
            border: `1px solid ${C.border}`,
            boxShadow: '0 1px 4px rgba(111,16,40,0.03)',
          }}
        >
          <div>
            <div className="flex items-center justify-between pb-3" style={{ borderBottom: `1px solid ${C.border}` }}>
              <div>
                <h3 className="text-sm font-bold" style={{ color: C.textPrimary }}>
                  Markazlar ro‘yxati
                </h3>
                <p className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>
                  Faoliyat yuritayotgan filiallar umumiy statistikasi
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('branches')}
                className="text-xs font-semibold hover:underline transition-colors cursor-pointer"
                style={{ color: C.primary }}
              >
                Barchasini ko‘rish →
              </button>
            </div>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr style={{ background: C.tableHeader, borderBottom: `1px solid ${C.border}` }}>
                    <th className="py-2.5 px-3 w-10 text-xs font-semibold" style={{ color: C.textPrimary }}>№</th>
                    <th className="py-2.5 px-3 text-xs font-semibold" style={{ color: C.textPrimary }}>Markaz nomi</th>
                    <th className="py-2.5 px-3 text-xs font-semibold" style={{ color: C.textPrimary }}>Joylashuvi</th>
                    <th className="py-2.5 px-3 text-xs font-semibold" style={{ color: C.textPrimary }}>Admin</th>
                    <th className="py-2.5 px-3 text-center text-xs font-semibold" style={{ color: C.textPrimary }}>O‘quvchilar</th>
                    <th className="py-2.5 px-3 text-center text-xs font-semibold" style={{ color: C.textPrimary }}>Guruhlar</th>
                    <th className="py-2.5 px-3 text-center text-xs font-semibold" style={{ color: C.textPrimary }}>Status</th>
                    <th className="py-2.5 px-3 text-right"></th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {branches.map((b, idx) => (
                    <tr
                      key={b.id}
                      className="transition-colors cursor-pointer"
                      style={{ borderBottom: `1px solid ${C.border}` }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = C.rowHover)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td className="py-3 px-3 font-medium" style={{ color: C.textMuted }}>
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3 font-bold" style={{ color: C.textPrimary }}>
                        <div className="flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5 shrink-0" style={{ color: C.primary }} />
                          <span>{b.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold"
                          style={{ background: C.goldBg, color: C.goldText, border: '1px solid #E8D8B8' }}
                        >
                          {b.city}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium" style={{ color: C.textSecondary }}>
                        {b.managerName}
                      </td>
                      <td className="py-3 px-3 text-center font-bold" style={{ color: C.textPrimary }}>
                        {b.studentCount}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold" style={{ color: C.textSecondary }}>
                        {b.groupsCount}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                          style={{
                            background: b.status === 'Active' ? C.successBg : C.goldBg,
                            color: b.status === 'Active' ? C.success : C.goldText,
                            border: `1px solid ${b.status === 'Active' ? '#C2EBD7' : '#E8D8B8'}`,
                          }}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: b.status === 'Active' ? C.success : C.gold }}
                          />
                          {b.status === 'Active' ? 'Faol' : b.status === 'Planned' ? 'Rejada' : b.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <ActionDropdown
                          direction="vertical"
                          items={[
                            {
                              label: 'Ko‘rish',
                              icon: Eye,
                              onClick: () => setViewingBranch(b),
                            },
                            {
                              label: 'Tahrirlash',
                              icon: Edit2,
                              onClick: () => {
                                setEditingBranch(b);
                                setBranchForm({
                                  name: b.name,
                                  city: b.city,
                                  address: b.address,
                                  phone: b.phone,
                                  managerName: b.managerName,
                                  status: b.status,
                                });
                              },
                            },
                            {
                              label: 'O‘chirish',
                              icon: Trash2,
                              variant: 'danger',
                              onClick: () => setDeletingBranchId(b.id),
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Footer */}
          <div className="mt-4 pt-3 flex items-center justify-between text-xs" style={{ borderTop: `1px solid ${C.border}`, color: C.textSecondary }}>
            <span>Jami {branches.length} ta markaz</span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors cursor-pointer"
                style={{ border: `1px solid ${C.border}`, color: C.textSecondary }}
              >
                &lt;
              </button>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-lg font-bold text-xs text-white"
                style={{ background: C.primary }}
              >
                1
              </button>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors cursor-pointer"
                style={{ border: `1px solid ${C.border}`, color: C.textSecondary }}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY: So‘nggi faoliyat (lg:col-span-4) */}
        <div
          className="lg:col-span-4 rounded-2xl p-5 flex flex-col justify-between"
          style={{
            background: C.cardBg,
            border: `1px solid ${C.border}`,
            boxShadow: '0 1px 4px rgba(111,16,40,0.03)',
          }}
        >
          <div>
            <div className="flex items-center justify-between pb-3" style={{ borderBottom: `1px solid ${C.border}` }}>
              <div>
                <h3 className="text-sm font-bold" style={{ color: C.textPrimary }}>
                  So‘nggi faoliyat
                </h3>
                <p className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>
                  Tizimda bajarilgan amallar
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('reports')}
                className="text-xs font-semibold hover:underline transition-colors cursor-pointer"
                style={{ color: C.primary }}
              >
                Barchasi →
              </button>
            </div>

            <div className="mt-4 space-y-3.5">
              {recentActivities.map((act) => {
                const Icon = act.icon;
                return (
                  <div key={act.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                        style={{ background: C.burgundyLight, color: C.primary }}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-tight" style={{ color: C.textPrimary }}>
                          {act.title}
                        </p>
                        <p className="text-[11px] mt-0.5 leading-tight" style={{ color: C.textSecondary }}>
                          {act.subtitle}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium" style={{ color: C.textMuted }}>
                      {act.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="mt-5 p-3 rounded-xl flex items-center justify-between"
            style={{ background: C.goldBg, border: '1px solid #E8D8B8' }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" style={{ color: C.goldText }} />
              <span className="text-xs font-semibold" style={{ color: C.goldText }}>
                Tizim statusi
              </span>
            </div>
            <span className="text-xs font-bold" style={{ color: C.success }}>
              ● 100% Barqaror
            </span>
          </div>
        </div>
      </div>

      {/* ── MODAL 1: ADD BRANCH ───────────────────────────────────────────── */}
      <Modal
        isOpen={isAddBranchOpen}
        onClose={() => setIsAddBranchOpen(false)}
        title="Yangi Markaz Qo‘shish"
        maxWidth="md"
      >
        <form onSubmit={handleCreateBranch} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: C.textPrimary }}>
              Markaz Nomi *
            </label>
            <Input
              required
              placeholder="Masalan: Lumos Samarqand Filiali"
              value={branchForm.name}
              onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: C.textPrimary }}>
                Shahar / Joylashuv *
              </label>
              <Input
                required
                placeholder="Urganch, Toshkent, Xiva..."
                value={branchForm.city}
                onChange={(e) => setBranchForm({ ...branchForm, city: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: C.textPrimary }}>
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
            <label className="block text-xs font-semibold mb-1" style={{ color: C.textPrimary }}>
              To‘liq Manzil *
            </label>
            <Input
              required
              placeholder="Ko‘cha, bino raqami yoki mo‘ljal"
              value={branchForm.address}
              onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: C.textPrimary }}>
                Mas’ul Admin / Rahbar
              </label>
              <Input
                placeholder="F.I.O"
                value={branchForm.managerName}
                onChange={(e) => setBranchForm({ ...branchForm, managerName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: C.textPrimary }}>
                Status
              </label>
              <Select
                value={branchForm.status}
                onChange={(e) =>
                  setBranchForm({ ...branchForm, status: e.target.value as any })
                }
              >
                <option value="Active">Faol</option>
                <option value="Planned">Rejada</option>
                <option value="Renovation">Ta’mirda</option>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
            <Button variant="ghost" type="button" onClick={() => setIsAddBranchOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" type="submit">
              Markazni saqlash
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL 2: ADD ADMIN ────────────────────────────────────────────── */}
      <Modal
        isOpen={isAddAdminOpen}
        onClose={() => setIsAddAdminOpen(false)}
        title="Yangi Admin Qo‘shish"
        maxWidth="md"
      >
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: C.textPrimary }}>
              F.I.O *
            </label>
            <Input
              required
              placeholder="Ism Familiya"
              value={adminForm.fullName}
              onChange={(e) => setAdminForm({ ...adminForm, fullName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: C.textPrimary }}>
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
              <label className="block text-xs font-semibold mb-1" style={{ color: C.textPrimary }}>
                Telefon Raqami
              </label>
              <Input
                placeholder="+998 (90) 000-00-00"
                value={adminForm.phone}
                onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: C.textPrimary }}>
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
              <label className="block text-xs font-semibold mb-1" style={{ color: C.textPrimary }}>
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

          <div className="flex justify-end gap-2 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
            <Button variant="ghost" type="button" onClick={() => setIsAddAdminOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" type="submit">
              Adminni saqlash
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL 3: ADD TEACHER ──────────────────────────────────────────── */}
      <Modal
        isOpen={isAddTeacherOpen}
        onClose={() => setIsAddTeacherOpen(false)}
        title="Yangi O‘qituvchi Qo‘shish"
        maxWidth="md"
      >
        <form onSubmit={handleCreateTeacher} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: C.textPrimary }}>
              Ustoz F.I.O *
            </label>
            <Input
              required
              placeholder="Ustoz Ismi Familiyasi"
              value={teacherForm.fullName}
              onChange={(e) => setTeacherForm({ ...teacherForm, fullName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: C.textPrimary }}>
                Mutaxassislik / Fan *
              </label>
              <Input
                required
                placeholder="Matematika, Ingliz tili..."
                value={teacherForm.subjects}
                onChange={(e) => setTeacherForm({ ...teacherForm, subjects: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: C.textPrimary }}>
                Telefon
              </label>
              <Input
                placeholder="+998 (90) 000-00-00"
                value={teacherForm.phone}
                onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
            <Button variant="ghost" type="button" onClick={() => setIsAddTeacherOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" type="submit">
              Ustozni saqlash
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL 4: ADD STUDENT ──────────────────────────────────────────── */}
      <Modal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        title="Yangi O‘quvchi Qo‘shish"
        maxWidth="md"
      >
        <form onSubmit={handleCreateStudent} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: C.textPrimary }}>
              O‘quvchi F.I.O *
            </label>
            <Input
              required
              placeholder="Ism Familiya"
              value={studentForm.fullName}
              onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: C.textPrimary }}>
                O‘quvchi Telefoni
              </label>
              <Input
                placeholder="+998 (90) 000-00-00"
                value={studentForm.phone}
                onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: C.textPrimary }}>
                Guruh
              </label>
              <Input
                placeholder="Matematika 5-A"
                value={studentForm.groupName}
                onChange={(e) => setStudentForm({ ...studentForm, groupName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: C.textPrimary }}>
                Ota-ona Ismi
              </label>
              <Input
                placeholder="Ota-ona F.I.O"
                value={studentForm.parentName}
                onChange={(e) => setStudentForm({ ...studentForm, parentName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: C.textPrimary }}>
                Oylik to‘lov (so‘m)
              </label>
              <Input
                type="number"
                value={studentForm.monthlyFee}
                onChange={(e) => setStudentForm({ ...studentForm, monthlyFee: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
            <Button variant="ghost" type="button" onClick={() => setIsAddStudentOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" type="submit">
              O‘quvchini saqlash
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── VIEW BRANCH MODAL ─────────────────────────────────────────────── */}
      {viewingBranch && (
        <Modal
          isOpen={!!viewingBranch}
          onClose={() => setViewingBranch(null)}
          title={viewingBranch.name}
          maxWidth="sm"
        >
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5" style={{ borderBottom: `1px solid ${C.border}` }}>
              <span style={{ color: C.textSecondary }}>Shahar:</span>
              <span className="font-bold" style={{ color: C.textPrimary }}>{viewingBranch.city}</span>
            </div>
            <div className="flex justify-between py-1.5" style={{ borderBottom: `1px solid ${C.border}` }}>
              <span style={{ color: C.textSecondary }}>Manzil:</span>
              <span className="font-bold" style={{ color: C.textPrimary }}>{viewingBranch.address}</span>
            </div>
            <div className="flex justify-between py-1.5" style={{ borderBottom: `1px solid ${C.border}` }}>
              <span style={{ color: C.textSecondary }}>Mas’ul Admin:</span>
              <span className="font-bold" style={{ color: C.textPrimary }}>{viewingBranch.managerName}</span>
            </div>
            <div className="flex justify-between py-1.5" style={{ borderBottom: `1px solid ${C.border}` }}>
              <span style={{ color: C.textSecondary }}>O‘quvchilar soni:</span>
              <span className="font-bold" style={{ color: C.textPrimary }}>{viewingBranch.studentCount} nafar</span>
            </div>
            <div className="flex justify-between py-1.5" style={{ borderBottom: `1px solid ${C.border}` }}>
              <span style={{ color: C.textSecondary }}>Guruhlar soni:</span>
              <span className="font-bold" style={{ color: C.textPrimary }}>{viewingBranch.groupsCount} ta</span>
            </div>
            <div className="flex justify-end pt-3">
              <Button variant="primary" onClick={() => setViewingBranch(null)}>
                Yopish
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── EDIT BRANCH MODAL ─────────────────────────────────────────────── */}
      {editingBranch && (
        <Modal
          isOpen={!!editingBranch}
          onClose={() => setEditingBranch(null)}
          title="Markazni Tahrirlash"
          maxWidth="md"
        >
          <form onSubmit={handleSaveEditBranch} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: C.textPrimary }}>
                Markaz Nomi *
              </label>
              <Input
                required
                value={branchForm.name}
                onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: C.textPrimary }}>
                  Shahar
                </label>
                <Input
                  required
                  value={branchForm.city}
                  onChange={(e) => setBranchForm({ ...branchForm, city: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: C.textPrimary }}>
                  Mas’ul Admin
                </label>
                <Input
                  value={branchForm.managerName}
                  onChange={(e) => setBranchForm({ ...branchForm, managerName: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
              <Button variant="ghost" type="button" onClick={() => setEditingBranch(null)}>
                Bekor qilish
              </Button>
              <Button variant="primary" type="submit">
                Saqlash
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── CONFIRM DELETE MODAL ──────────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={!!deletingBranchId}
        onClose={() => setDeletingBranchId(null)}
        onConfirm={handleConfirmDeleteBranch}
        title="Markazni O‘chirish"
        message="Haqiqatan ham ushbu markazni ro‘yxatdan o‘chirmoqchimisiz?"
        confirmLabel="O‘chirish"
        variant="danger"
      />
    </div>
  );
};
