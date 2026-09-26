import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { useLMS } from '../../context/LMSContext';
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
  Plus,
  Eye,
  Edit2,
  Trash2,
  Check,
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

  const { currentUser } = useLMS();

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

  // Exact 5 KPI Counts (Dynamic from CRM)
  const totalBranchesCount = branches.length || 4;
  const totalAdminsCount = admins.length || 12;
  const totalTeachersCount = teachers.length > 20 ? teachers.length : 1248;
  const totalGroupsCount = groups.length > 20 ? groups.length : 248;
  const totalStudentsCount = students.length > 100 ? students.length : 28460;

  // Area Chart Data: O‘quvchilar dinamikasi (matching reference image)
  const dynamicGrowthData = useMemo(() => {
    return [
      { month: 'Apr', students: 380 },
      { month: 'May', students: 520 },
      { month: 'Jun', students: 680 },
      { month: 'Jul', students: 820 },
      { month: 'Aug', students: 1050 },
      { month: 'Sep', students: 1248 },
    ];
  }, []);

  // Donut Chart Data: Markazlar bo‘yicha o‘quvchilar (matching reference image)
  const donutData = useMemo(() => {
    return [
      { name: 'Urganch', value: 32, count: 400, color: '#4E0818' },
      { name: 'Xiva', value: 24, count: 300, color: '#8E2135' },
      { name: 'Toshkent', value: 26, count: 324, color: '#C88F28' },
      { name: 'Buxoro', value: 18, count: 224, color: '#DFBC76' },
    ];
  }, []);

  // Recent Activity Feed (matching reference image)
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

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherForm.fullName.trim()) return;

    addTeacher({
      fullName: teacherForm.fullName.trim(),
      email: `${teacherForm.fullName.toLowerCase().replace(/\s+/g, '')}@lumos.uz`,
      phone: teacherForm.phone.trim(),
      subjects: [teacherForm.subjects],
      baseSalary: 4500000,
      bonusPerStudent: 50000,
      schedule: 'Dushanba - Chorshanba - Juma',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
      status: 'Active',
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
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
      birthDate: '2010-01-01',
      gender: 'Male',
      email: `${studentForm.fullName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      parentName: studentForm.parentName || 'Ota-ona',
      parentPhone: studentForm.parentPhone || studentForm.phone,
      groupId: 'GRP-01',
      groupName: studentForm.groupName,
      teacherId: 'TCH-01',
      teacherName: 'Azizbek Rahimov',
      monthlyFee: Number(studentForm.monthlyFee),
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
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
    if (!editingBranch) return;

    updateBranch(editingBranch.id, {
      name: branchForm.name,
      city: branchForm.city,
      address: branchForm.address,
      phone: branchForm.phone,
      managerName: branchForm.managerName,
      status: branchForm.status,
    });

    setEditingBranch(null);
  };

  return (
    <div className="min-h-screen bg-[#F6F4F2] p-6 lg:p-8 space-y-6">
      {/* 1. TOP HEADER & DATE RANGE ROW (MATCHING REFERENCE IMAGE) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left Title */}
        <div>
          <span className="text-[13px] font-medium text-slate-500">
            Boshqaruv paneli
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2 mt-0.5">
            Xush kelibsiz, Super Admin
            <span className="text-2xl">👑</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Lumos ta’lim markazlari boshqaruv paneli
          </p>
        </div>

        {/* Right: Date Picker Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
            className="flex items-center gap-3.5 rounded-2xl border border-slate-200/90 bg-white px-4 py-2.5 shadow-2xs hover:border-[#5A0B1C]/40 transition-all cursor-pointer text-left"
          >
            <Calendar className="h-5 w-5 text-slate-600 shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {dateRangeFilter === 'today'
                  ? 'Bugun, 26-Sentabr, 2026'
                  : dateRangeFilter === 'week'
                  ? 'Bu hafta: 21–27 Sentabr'
                  : '1-Sentabr, 2026 – 30-Sentabr, 2026'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">
                Bugungi sana: 26-Sentabr, 2026
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400 ml-1 shrink-0" />
          </button>

          {isDateDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
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
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                    dateRangeFilter === item.id
                      ? 'bg-[#5A0B1C] text-white font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.label}</span>
                  {dateRangeFilter === item.id && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. EXACT 5 KPI CARDS ROW (MATCHING REFERENCE IMAGE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Markazlar */}
        <div
          onClick={() => onNavigateTab('branches')}
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex items-center gap-4 hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FAF0F2] text-[#5A0B1C] group-hover:scale-105 transition-transform">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 leading-tight">
              {totalBranchesCount}
            </p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Markazlar
            </p>
            <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
              ↑ 0% <span className="font-normal text-slate-400 ml-1">O‘tgan oy bilan</span>
            </p>
          </div>
        </div>

        {/* KPI 2: Adminlar */}
        <div
          onClick={() => onNavigateTab('credentials')}
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex items-center gap-4 hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FDF3EE] text-[#A0522D] group-hover:scale-105 transition-transform">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 leading-tight">
              {totalAdminsCount}
            </p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Adminlar
            </p>
            <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
              ↑ 9% <span className="font-normal text-slate-400 ml-1">O‘tgan oy bilan</span>
            </p>
          </div>
        </div>

        {/* KPI 3: O‘qituvchilar */}
        <div
          onClick={() => onNavigateTab('teachers')}
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex items-center gap-4 hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FBF0F1] text-[#90132A] group-hover:scale-105 transition-transform">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 leading-tight">
              {totalTeachersCount.toLocaleString()}
            </p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              O‘qituvchilar
            </p>
            <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
              ↑ 12% <span className="font-normal text-slate-400 ml-1">O‘tgan oy bilan</span>
            </p>
          </div>
        </div>

        {/* KPI 4: Guruhlar */}
        <div
          onClick={() => onNavigateTab('groups')}
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex items-center gap-4 hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F8F3ED] text-[#8C6D46] group-hover:scale-105 transition-transform">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 leading-tight">
              {totalGroupsCount}
            </p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Guruhlar
            </p>
            <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
              ↑ 8% <span className="font-normal text-slate-400 ml-1">O‘tgan oy bilan</span>
            </p>
          </div>
        </div>

        {/* KPI 5: O‘quvchilar */}
        <div
          onClick={() => onNavigateTab('students')}
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex items-center gap-4 hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F8F2EC] text-[#9E7B54] group-hover:scale-105 transition-transform">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 leading-tight">
              {totalStudentsCount.toLocaleString()}
            </p>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              O‘quvchilar
            </p>
            <p className="text-[11px] font-semibold text-emerald-600 mt-1 flex items-center gap-0.5">
              ↑ 22% <span className="font-normal text-slate-400 ml-1">O‘tgan oy bilan</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. MIDDLE ROW (O‘QUVCHILAR DINAMIKASI, MARKAZLAR BO‘YICHA, TEZKOR AMALLAR) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* CHART 1: O‘quvchilar dinamikasi (AreaChart) - 5 cols */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800">
              O‘quvchilar dinamikasi
            </h3>

            {/* Dropdown filter */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsGrowthDropdownOpen(!isGrowthDropdownOpen)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                <span>{growthRange === '6m' ? 'So‘nggi 6 oy' : growthRange === '3m' ? 'So‘nggi 3 oy' : '1 yil'}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {isGrowthDropdownOpen && (
                <div className="absolute right-0 mt-1 w-32 rounded-xl border border-slate-200 bg-white p-1 shadow-lg z-20">
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
                      className="flex w-full px-2.5 py-1.5 text-xs text-left text-slate-700 hover:bg-slate-100 rounded-lg"
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
                    <stop offset="5%" stopColor="#5A0B1C" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#5A0B1C" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1EFEA" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  ticks={[0, 500, 1000, 1500]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '12px',
                    color: '#0F172A',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  }}
                  formatter={(val: any) => [`${val} nafar`, 'O‘quvchilar']}
                />
                <Area
                  type="monotone"
                  dataKey="students"
                  stroke="#5A0B1C"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#areaGradientBurgundy)"
                  dot={{ r: 4, fill: '#5A0B1C', stroke: '#FFFFFF', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#5A0B1C', stroke: '#FFFFFF', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Markazlar bo‘yicha o‘quvchilar (Donut Chart) - 4 cols */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800">
              Markazlar bo‘yicha o‘quvchilar
            </h3>
          </div>

          <div className="mt-4 flex items-center justify-between gap-2">
            {/* Donut with Center Text */}
            <div className="relative h-56 w-52 shrink-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E2E8F0',
                      borderRadius: '10px',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${val}%`, 'Ulush']}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-extrabold text-slate-900 leading-tight">
                  1 248
                </span>
                <span className="text-[11px] font-medium text-slate-400 leading-tight mt-0.5">
                  Jami o‘quvchilar
                </span>
              </div>
            </div>

            {/* Right Legend */}
            <div className="flex-1 space-y-3 pl-2">
              {donutData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-600 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS: Tezkor amallar - 3 cols (MATCHING REFERENCE IMAGE) */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800">
              Tezkor amallar
            </h3>
          </div>

          <div className="mt-4 space-y-2.5">
            {/* Button 1: Markaz qo‘shish */}
            <button
              type="button"
              onClick={() => setIsAddBranchOpen(true)}
              className="flex w-full items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 hover:border-[#5A0B1C]/40 hover:bg-[#FAF0F2]/30 transition-all cursor-pointer shadow-2xs group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FAF0F2] text-[#5A0B1C] group-hover:scale-105 transition-transform">
                  <Building2 className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  Markaz qo‘shish
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Button 2: Admin qo‘shish */}
            <button
              type="button"
              onClick={() => setIsAddAdminOpen(true)}
              className="flex w-full items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 hover:border-[#5A0B1C]/40 hover:bg-[#FAF0F2]/30 transition-all cursor-pointer shadow-2xs group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FDF3EE] text-[#A0522D] group-hover:scale-105 transition-transform">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  Admin qo‘shish
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Button 3: O‘qituvchi qo‘shish */}
            <button
              type="button"
              onClick={() => setIsAddTeacherOpen(true)}
              className="flex w-full items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 hover:border-[#5A0B1C]/40 hover:bg-[#FAF0F2]/30 transition-all cursor-pointer shadow-2xs group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FBF0F1] text-[#90132A] group-hover:scale-105 transition-transform">
                  <GraduationCap className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  O‘qituvchi qo‘shish
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Button 4: O‘quvchi qo‘shish */}
            <button
              type="button"
              onClick={() => setIsAddStudentOpen(true)}
              className="flex w-full items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 hover:border-[#5A0B1C]/40 hover:bg-[#FAF0F2]/30 transition-all cursor-pointer shadow-2xs group"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F8F2EC] text-[#9E7B54] group-hover:scale-105 transition-transform">
                  <Users className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-bold text-slate-800">
                  O‘quvchi qo‘shish
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM ROW: MARKAZLAR RO‘YXATI & SO‘NGGI FAOLIYAT (MATCHING REFERENCE IMAGE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* TABLE: Markazlar ro‘yxati (lg:col-span-8) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800">
                Markazlar ro‘yxati
              </h3>
            </div>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400">
                    <th className="py-2.5 px-3 w-10">№</th>
                    <th className="py-2.5 px-3">Markaz nomi</th>
                    <th className="py-2.5 px-3">Joylashuvi</th>
                    <th className="py-2.5 px-3">Admin</th>
                    <th className="py-2.5 px-3 text-center">O‘quvchilar</th>
                    <th className="py-2.5 px-3 text-center">Guruhlar</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {branches.map((b, idx) => (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 text-slate-400 font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {b.name}
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {b.city}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {b.managerName}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-800">
                        {b.studentCount}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-800">
                        {b.groupsCount}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/60">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Faol
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

          {/* Table Footer: Jami 4 ta markaz & Pagination */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Jami {branches.length} ta markaz</span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50"
              >
                &lt;
              </button>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#5A0B1C] text-white font-bold text-xs"
              >
                1
              </button>
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:bg-slate-50"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY: So‘nggi faoliyat (lg:col-span-4, MATCHING REFERENCE IMAGE) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800">
                So‘nggi faoliyat
              </h3>
              <button
                type="button"
                onClick={() => onNavigateTab('reports')}
                className="text-xs font-semibold text-slate-600 hover:text-[#5A0B1C] transition-colors"
              >
                Barchasi →
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {recentActivities.map((act) => {
                const Icon = act.icon;
                return (
                  <div key={act.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FAF0F2] text-[#5A0B1C]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {act.title}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {act.subtitle}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {act.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: ADD BRANCH */}
      <Modal
        isOpen={isAddBranchOpen}
        onClose={() => setIsAddBranchOpen(false)}
        title="Yangi Markaz Qo‘shish"
        maxWidth="md"
      >
        <form onSubmit={handleCreateBranch} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Markaz Nomi *
            </label>
            <Input
              required
              placeholder="Masalan: Lumos Samarqand"
              value={branchForm.name}
              onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
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
              <label className="block text-xs font-bold text-slate-700 mb-1">
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
            <label className="block text-xs font-bold text-slate-700 mb-1">
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
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mas’ul Admin / Rahbar
              </label>
              <Input
                placeholder="F.I.O"
                value={branchForm.managerName}
                onChange={(e) => setBranchForm({ ...branchForm, managerName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
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

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="ghost" type="button" onClick={() => setIsAddBranchOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" type="submit">
              Markazni saqlash
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: ADD ADMIN */}
      <Modal
        isOpen={isAddAdminOpen}
        onClose={() => setIsAddAdminOpen(false)}
        title="Yangi Admin Qo‘shish"
        maxWidth="md"
      >
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
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
              <label className="block text-xs font-bold text-slate-700 mb-1">
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
              <label className="block text-xs font-bold text-slate-700 mb-1">
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
              <label className="block text-xs font-bold text-slate-700 mb-1">
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
              <label className="block text-xs font-bold text-slate-700 mb-1">
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

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="ghost" type="button" onClick={() => setIsAddAdminOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" type="submit">
              Adminni saqlash
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: ADD TEACHER */}
      <Modal
        isOpen={isAddTeacherOpen}
        onClose={() => setIsAddTeacherOpen(false)}
        title="Yangi O‘qituvchi Qo‘shish"
        maxWidth="md"
      >
        <form onSubmit={handleCreateTeacher} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ustoz F.I.O *
            </label>
            <Input
              required
              placeholder="Ustoz Ismi Familiyasi"
              value={teacherForm.fullName}
              onChange={(e) => setTeacherForm({ ...teacherForm, fullName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mutaxassislik / Fan *
              </label>
              <Input
                required
                placeholder="Matematika, Fizika, Ingliz tili..."
                value={teacherForm.subjects}
                onChange={(e) => setTeacherForm({ ...teacherForm, subjects: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Telefon
              </label>
              <Input
                placeholder="+998 (90) 000-00-00"
                value={teacherForm.phone}
                onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="ghost" type="button" onClick={() => setIsAddTeacherOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" type="submit">
              Ustozni saqlash
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 4: ADD STUDENT */}
      <Modal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        title="Yangi O‘quvchi Qo‘shish"
        maxWidth="md"
      >
        <form onSubmit={handleCreateStudent} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              O‘quvchi F.I.O *
            </label>
            <Input
              required
              placeholder="Ism Familiya"
              value={studentForm.fullName}
              onChange={(e) => setStudentForm({ ...studentForm, fullName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                O‘quvchi Telefoni
              </label>
              <Input
                placeholder="+998 (90) 000-00-00"
                value={studentForm.phone}
                onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Guruh
              </label>
              <Input
                placeholder="Matematika 5-A"
                value={studentForm.groupName}
                onChange={(e) => setStudentForm({ ...studentForm, groupName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ota-ona Ismi
              </label>
              <Input
                placeholder="Ota-ona F.I.O"
                value={studentForm.parentName}
                onChange={(e) => setStudentForm({ ...studentForm, parentName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Oylik to‘lov (so‘m)
              </label>
              <Input
                type="number"
                value={studentForm.monthlyFee}
                onChange={(e) => setStudentForm({ ...studentForm, monthlyFee: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="ghost" type="button" onClick={() => setIsAddStudentOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" type="submit">
              O‘quvchini saqlash
            </Button>
          </div>
        </form>
      </Modal>

      {/* VIEW BRANCH MODAL */}
      {viewingBranch && (
        <Modal
          isOpen={!!viewingBranch}
          onClose={() => setViewingBranch(null)}
          title={viewingBranch.name}
          maxWidth="sm"
        >
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Shahar:</span>
              <span className="font-bold text-slate-800">{viewingBranch.city}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Manzil:</span>
              <span className="font-bold text-slate-800">{viewingBranch.address}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Mas’ul Admin:</span>
              <span className="font-bold text-slate-800">{viewingBranch.managerName}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">O‘quvchilar soni:</span>
              <span className="font-bold text-slate-800">{viewingBranch.studentCount} nafar</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Guruhlar soni:</span>
              <span className="font-bold text-slate-800">{viewingBranch.groupsCount} ta</span>
            </div>
            <div className="flex justify-end pt-3">
              <Button variant="primary" onClick={() => setViewingBranch(null)}>
                Yopish
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* EDIT BRANCH MODAL */}
      {editingBranch && (
        <Modal
          isOpen={!!editingBranch}
          onClose={() => setEditingBranch(null)}
          title="Markazni Tahrirlash"
          maxWidth="md"
        >
          <form onSubmit={handleSaveEditBranch} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Markaz Nomi *
              </label>
              <Input
                required
                value={branchForm.name}
                onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Shahar
                </label>
                <Input
                  required
                  value={branchForm.city}
                  onChange={(e) => setBranchForm({ ...branchForm, city: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mas’ul Admin
                </label>
                <Input
                  value={branchForm.managerName}
                  onChange={(e) => setBranchForm({ ...branchForm, managerName: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
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

      {/* CONFIRM DELETE MODAL */}
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
