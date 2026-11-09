import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Branch } from '../../types/admin';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ActionDropdown } from '../../components/ui/ActionDropdown';
import {
  Building2,
  Plus,
  Users,
  GraduationCap,
  BookOpen,
  MapPin,
  Phone,
  Eye,
  Edit2,
  Trash2,
  Search,
  TrendingUp,
  CheckCircle2,
  Clock,
  Wrench,
  XCircle,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// ─── Lumos Design Tokens ─────────────────────────────────────────────────────
const C = {
  pageBg:       '#F8F6F2',
  cardBg:       '#FFFFFF',
  tableHeader:  '#F3EEE7',
  border:       '#E7E1D8',
  rowHover:     '#FCF8F5',
  primary:      '#6F1028',
  primaryDark:  '#4A0B1B',
  goldBg:       '#F7F0E2',
  goldText:     '#8A641C',
  gold:         '#C89B3C',
  textPrimary:  '#1F2937',
  textSecondary:'#667085',
  textMuted:    '#98A2B3',
  success:      '#16A36A',
  successBg:    '#E8F7F0',
  danger:       '#C0392B',
  dangerBg:     '#FDECEC',
  burgunudyLight: '#F7E9ED',
};

// ─── Extended mock data for richer display ────────────────────────────────────
const EXTENDED_BRANCHES: Branch[] = [
  {
    id: 'BR-01',
    name: 'Lumos Toshkent Markaziy',
    city: 'Toshkent',
    address: 'Chilonzor tumani, Bunyodkor shoh ko\'chasi 14',
    phone: '+998 71 200 01 01',
    managerName: 'Sardor Toshmatov',
    studentCount: 312,
    teacherCount: 14,
    groupsCount: 22,
    monthlyRevenue: 62400000,
    status: 'Active',
    createdAt: '2022-03-01',
  },
  {
    id: 'BR-02',
    name: 'Lumos Xiva Filiali',
    city: 'Xiva',
    address: 'Ichan qal\'a yo\'li 7, Xiva shahar',
    phone: '+998 62 225 14 88',
    managerName: 'Gulnora Mirzayeva',
    studentCount: 187,
    teacherCount: 8,
    groupsCount: 13,
    monthlyRevenue: 37400000,
    status: 'Active',
    createdAt: '2023-01-15',
  },
  {
    id: 'BR-03',
    name: 'Lumos Urganch Filiali',
    city: 'Urganch',
    address: 'Al-Xorazmiy ko\'chasi 22, Urganch',
    phone: '+998 62 222 88 10',
    managerName: 'Jasur Xolmatov',
    studentCount: 204,
    teacherCount: 9,
    groupsCount: 15,
    monthlyRevenue: 40800000,
    status: 'Active',
    createdAt: '2023-06-10',
  },
  {
    id: 'BR-04',
    name: 'Lumos Buxoro Filiali',
    city: 'Buxoro',
    address: 'Mustaqillik ko\'chasi 45, Buxoro',
    phone: '+998 65 221 50 70',
    managerName: 'Dilnoza Rahimova',
    studentCount: 156,
    teacherCount: 7,
    groupsCount: 11,
    monthlyRevenue: 31200000,
    status: 'Active',
    createdAt: '2023-09-01',
  },
  {
    id: 'BR-05',
    name: 'Lumos Samarqand Filiali',
    city: 'Samarqand',
    address: 'Registon ko\'chasi 3, Samarqand',
    phone: '+998 66 234 12 34',
    managerName: 'Timur Qodirov',
    studentCount: 0,
    teacherCount: 0,
    groupsCount: 0,
    monthlyRevenue: 0,
    status: 'Planned',
    createdAt: '2024-08-01',
  },
  {
    id: 'BR-06',
    name: 'Lumos Namangan Filiali',
    city: 'Namangan',
    address: 'Namangan ko\'chasi 18, Namangan',
    phone: '+998 69 231 66 00',
    managerName: 'Komil Usmonov',
    studentCount: 0,
    teacherCount: 0,
    groupsCount: 0,
    monthlyRevenue: 0,
    status: 'Renovation',
    createdAt: '2024-05-20',
  },
];

const ROWS_PER_PAGE = 6;

function formatRevenue(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M so'm`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K so'm`;
  return `${amount} so'm`;
}

function getStatusConfig(status: Branch['status']) {
  switch (status) {
    case 'Active':
      return { label: 'Faol', color: C.success, bg: C.successBg, Icon: CheckCircle2 };
    case 'Planned':
      return { label: 'Rejalashtirilgan', color: C.gold, bg: C.goldBg, Icon: Clock };
    case 'Renovation':
      return { label: "Ta'mirda", color: '#B45309', bg: '#FEF3C7', Icon: Wrench };
    case 'Inactive':
      return { label: 'Nofaol', color: C.danger, bg: C.dangerBg, Icon: XCircle };
    default:
      return { label: status, color: C.textMuted, bg: '#F3F4F6', Icon: XCircle };
  }
}

// ─── KPI Card ────────────────────────────────────────────────────────────────
interface KpiCardProps {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  value: string | number;
  label: string;
  sub?: string;
  subPositive?: boolean;
}
const KpiCard: React.FC<KpiCardProps> = ({ icon: Icon, iconBg, iconColor, value, label, sub, subPositive }) => (
  <div
    className="rounded-2xl p-4 flex items-center gap-4"
    style={{ background: C.cardBg, border: `1px solid ${C.border}`, boxShadow: '0 1px 4px 0 rgba(111,16,40,0.04)' }}
  >
    <div className="rounded-xl flex items-center justify-center shrink-0 w-11 h-11" style={{ background: iconBg }}>
      <Icon className="w-5 h-5" style={{ color: iconColor }} />
    </div>
    <div>
      <p className="text-xl font-extrabold leading-tight" style={{ color: C.textPrimary }}>{value}</p>
      <p className="text-xs mt-0.5" style={{ color: C.textSecondary }}>{label}</p>
      {sub && (
        <p className="text-[11px] mt-0.5 font-medium" style={{ color: subPositive ? C.success : C.textMuted }}>
          {sub}
        </p>
      )}
    </div>
  </div>
);

// ─── Avatar initials ──────────────────────────────────────────────────────────
const BranchAvatar: React.FC<{ name: string }> = ({ name }) => {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return (
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
      style={{ background: `${C.primary}15`, color: C.primary }}
    >
      {initials}
    </div>
  );
};

// ─── Main Page Component ───────────────────────────────────────────────────────
export const AdminBranchesPage: React.FC = () => {
  const { addBranch, updateBranch, deleteBranch } = useCRM();

  // Use extended local data for rich display
  const [branches, setBranches] = useState<Branch[]>(EXTENDED_BRANCHES);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [viewingBranch, setViewingBranch] = useState<Branch | null>(null);
  const [deletingBranchId, setDeletingBranchId] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Form
  const [formData, setFormData] = useState({
    name: '',
    city: 'Toshkent',
    address: '',
    phone: '+998',
    managerName: '',
    status: 'Active' as Branch['status'],
  });

  // ─── Derived data ──────────────────────────────────────────────────────────
  const cities = useMemo(() => ['all', ...Array.from(new Set(branches.map(b => b.city)))], [branches]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return branches.filter(b => {
      const matchQ = !q || b.name.toLowerCase().includes(q) || b.city.toLowerCase().includes(q) || b.managerName.toLowerCase().includes(q) || b.address.toLowerCase().includes(q);
      const matchStatus = filterStatus === 'all' || b.status === filterStatus;
      const matchCity = filterCity === 'all' || b.city === filterCity;
      return matchQ && matchStatus && matchCity;
    });
  }, [branches, searchQuery, filterStatus, filterCity]);

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  // KPI aggregations
  const totalStudents = branches.reduce((s, b) => s + b.studentCount, 0);
  const totalTeachers = branches.reduce((s, b) => s + b.teacherCount, 0);
  const totalGroups = branches.reduce((s, b) => s + b.groupsCount, 0);
  const totalRevenue = branches.reduce((s, b) => s + b.monthlyRevenue, 0);
  const activeBranches = branches.filter(b => b.status === 'Active').length;

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const resetForm = () =>
    setFormData({ name: '', city: 'Toshkent', address: '', phone: '+998', managerName: '', status: 'Active' });

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (b: Branch) => {
    setEditingBranch(b);
    setFormData({ name: b.name, city: b.city, address: b.address, phone: b.phone, managerName: b.managerName, status: b.status });
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) return;
    const newBranch: Branch = {
      id: `BR-${Date.now()}`,
      name: formData.name.trim(),
      city: formData.city.trim(),
      address: formData.address.trim(),
      phone: formData.phone.trim(),
      managerName: formData.managerName.trim() || 'Admin biriktirilmagan',
      studentCount: 0,
      teacherCount: 0,
      groupsCount: 0,
      monthlyRevenue: 0,
      status: formData.status,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setBranches(prev => [...prev, newBranch]);
    addBranch(newBranch);
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch || !formData.name.trim()) return;
    const updated = {
      name: formData.name.trim(),
      city: formData.city.trim(),
      address: formData.address.trim(),
      phone: formData.phone.trim(),
      managerName: formData.managerName.trim(),
      status: formData.status,
    };
    setBranches(prev => prev.map(b => b.id === editingBranch.id ? { ...b, ...updated } : b));
    updateBranch(editingBranch.id, updated);
    setEditingBranch(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingBranchId) return;
    setBranches(prev => prev.filter(b => b.id !== deletingBranchId));
    deleteBranch(deletingBranchId);
    setDeletingBranchId(null);
  };

  // ─── Form fields (shared by add/edit modal) ────────────────────────────────
  const renderFormFields = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: C.textPrimary }}>Markaz Nomi *</label>
        <Input required placeholder="Masalan: Lumos Samarqand Filiali" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: C.textPrimary }}>Shahar *</label>
          <Input required placeholder="Toshkent, Urganch..." value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: C.textPrimary }}>Telefon</label>
          <Input placeholder="+998 71 200 00 00" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: C.textPrimary }}>To'liq Manzil *</label>
        <Input required placeholder="Ko'cha, bino raqami yoki mo'ljal" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: C.textPrimary }}>Mas'ul Rahbar</label>
          <Input placeholder="F.I.O" value={formData.managerName} onChange={e => setFormData({ ...formData, managerName: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: C.textPrimary }}>Holat</label>
          <Select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as Branch['status'] })}>
            <option value="Active">Faol</option>
            <option value="Planned">Rejalashtirilgan</option>
            <option value="Renovation">Ta'mirda</option>
            <option value="Inactive">Nofaol</option>
          </Select>
        </div>
      </div>
    </div>
  );

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen p-6 lg:p-8 space-y-6" style={{ background: C.pageBg }}>

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: C.textPrimary }}>
            Markazlar
          </h1>
          <p className="text-sm mt-0.5" style={{ color: C.textSecondary }}>
            Lumos ta'lim markazlarini boshqarish
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-colors shrink-0 cursor-pointer"
          style={{ background: C.primary }}
          onMouseEnter={e => (e.currentTarget.style.background = C.primaryDark)}
          onMouseLeave={e => (e.currentTarget.style.background = C.primary)}
        >
          <Plus className="w-4 h-4" />
          Markaz qo'shish
        </button>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <KpiCard
          icon={Building2}
          iconBg={`${C.primary}15`}
          iconColor={C.primary}
          value={branches.length}
          label="Jami markazlar"
          sub={`${activeBranches} ta faol`}
          subPositive
        />
        <KpiCard
          icon={Users}
          iconBg={C.successBg}
          iconColor={C.success}
          value={totalStudents}
          label="Jami o'quvchilar"
          sub="Barcha filliallar"
        />
        <KpiCard
          icon={GraduationCap}
          iconBg={C.goldBg}
          iconColor={C.goldText}
          value={totalTeachers}
          label="Jami o'qituvchilar"
          sub="Faol o'qituvchilar"
        />
        <KpiCard
          icon={BookOpen}
          iconBg={`${C.primary}10`}
          iconColor={C.primary}
          value={totalGroups}
          label="Jami guruhlar"
          sub="Barcha markazlarda"
        />
        <KpiCard
          icon={DollarSign}
          iconBg={C.goldBg}
          iconColor={C.goldText}
          value={formatRevenue(totalRevenue)}
          label="Oylik tushumlar"
          sub="Barcha markazlar"
          subPositive
        />
      </div>

      {/* ── Table Card ────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: C.cardBg, border: `1px solid ${C.border}`, boxShadow: '0 2px 8px 0 rgba(111,16,40,0.04)' }}
      >
        {/* Table header / filters */}
        <div className="px-5 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: C.textMuted }} />
            <input
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl outline-none transition-all"
              style={{ background: C.cardBg, border: `1px solid ${C.border}`, color: C.textPrimary }}
              placeholder="Markaz yoki shahar..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              onFocus={e => (e.target.style.borderColor = C.primary)}
              onBlur={e => (e.target.style.borderColor = C.border)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="text-sm px-3 py-2 rounded-xl outline-none cursor-pointer"
              style={{ background: C.cardBg, border: `1px solid ${C.border}`, color: C.textSecondary }}
              value={filterCity}
              onChange={e => { setFilterCity(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">Barcha shaharlar</option>
              {cities.filter(c => c !== 'all').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              className="text-sm px-3 py-2 rounded-xl outline-none cursor-pointer"
              style={{ background: C.cardBg, border: `1px solid ${C.border}`, color: C.textSecondary }}
              value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">Barcha holatlar</option>
              <option value="Active">Faol</option>
              <option value="Planned">Rejalashtirilgan</option>
              <option value="Renovation">Ta'mirda</option>
              <option value="Inactive">Nofaol</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: C.tableHeader, borderBottom: `1px solid ${C.border}` }}>
                {['№', 'Markaz', 'Shahar', 'Mas\'ul Rahbar', 'O\'quvchilar', 'O\'qituvchilar', 'Guruhlar', 'Oylik daromad', 'Holat', 'Amallar'].map((h, i) => (
                  <th
                    key={i}
                    className={`px-4 py-3 text-xs font-semibold whitespace-nowrap ${i === 0 || i >= 4 ? 'text-center' : 'text-left'}`}
                    style={{ color: C.textPrimary }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-sm" style={{ color: C.textMuted }}>
                    Natija topilmadi
                  </td>
                </tr>
              ) : (
                paginated.map((b, idx) => {
                  const globalIdx = (currentPage - 1) * ROWS_PER_PAGE + idx + 1;
                  const sc = getStatusConfig(b.status);
                  return (
                    <tr
                      key={b.id}
                      className="transition-colors cursor-pointer"
                      style={{ borderBottom: `1px solid ${C.border}` }}
                      onMouseEnter={e => (e.currentTarget.style.background = C.rowHover)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* № */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="text-xs font-bold" style={{ color: C.textMuted }}>{globalIdx}</span>
                      </td>

                      {/* Markaz */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <BranchAvatar name={b.name} />
                          <div>
                            <p className="font-semibold text-sm leading-tight" style={{ color: C.textPrimary }}>{b.name}</p>
                            <p className="text-[11px] mt-0.5 flex items-center gap-1" style={{ color: C.textSecondary }}>
                              <MapPin className="w-3 h-3" style={{ color: C.textMuted }} />
                              {b.address}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Shahar */}
                      <td className="px-4 py-3.5">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold"
                          style={{ background: C.goldBg, color: C.goldText, border: `1px solid #E8D8B8` }}
                        >
                          {b.city}
                        </span>
                      </td>

                      {/* Mas'ul Rahbar */}
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-medium" style={{ color: C.textPrimary }}>{b.managerName}</p>
                        <p className="text-[11px] mt-0.5 flex items-center gap-1" style={{ color: C.textSecondary }}>
                          <Phone className="w-3 h-3" style={{ color: C.textMuted }} />
                          {b.phone}
                        </p>
                      </td>

                      {/* O'quvchilar */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: C.textPrimary }}>
                          <Users className="w-3.5 h-3.5" style={{ color: C.success }} />
                          {b.studentCount}
                        </span>
                      </td>

                      {/* O'qituvchilar */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: C.textPrimary }}>
                          <GraduationCap className="w-3.5 h-3.5" style={{ color: C.gold }} />
                          {b.teacherCount}
                        </span>
                      </td>

                      {/* Guruhlar */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: C.textPrimary }}>
                          <BookOpen className="w-3.5 h-3.5" style={{ color: C.primary }} />
                          {b.groupsCount}
                        </span>
                      </td>

                      {/* Daromad */}
                      <td className="px-4 py-3.5 text-center">
                        <span className="text-sm font-semibold" style={{ color: b.monthlyRevenue > 0 ? C.success : C.textMuted }}>
                          {b.monthlyRevenue > 0 ? formatRevenue(b.monthlyRevenue) : '—'}
                        </span>
                      </td>

                      {/* Holat */}
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                          style={{ background: sc.bg, color: sc.color }}
                        >
                          <sc.Icon className="w-3 h-3" />
                          {sc.label}
                        </span>
                      </td>

                      {/* Amallar */}
                      <td className="px-4 py-3.5 text-right">
                        <ActionDropdown
                          items={[
                            { label: "Ko'rish", icon: Eye, onClick: () => setViewingBranch(b) },
                            { label: 'Tahrirlash', icon: Edit2, onClick: () => handleOpenEdit(b) },
                            { label: "O'chirish", icon: Trash2, variant: 'danger', onClick: () => setDeletingBranchId(b.id) },
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ borderTop: `1px solid ${C.border}` }}
          >
            <span className="text-xs" style={{ color: C.textSecondary }}>
              {filtered.length} ta markazdan {(currentPage - 1) * ROWS_PER_PAGE + 1}–{Math.min(currentPage * ROWS_PER_PAGE, filtered.length)} ko'rsatilmoqda
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-40 transition-colors cursor-pointer"
                style={{ border: `1px solid ${C.border}`, color: C.textSecondary }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className="w-7 h-7 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  style={{
                    background: p === currentPage ? C.primary : 'transparent',
                    color: p === currentPage ? '#fff' : C.textSecondary,
                    border: `1px solid ${p === currentPage ? C.primary : C.border}`,
                  }}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-40 transition-colors cursor-pointer"
                style={{ border: `1px solid ${C.border}`, color: C.textSecondary }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom Analytics ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active branches list */}
        <div
          className="lg:col-span-2 rounded-2xl p-5"
          style={{ background: C.cardBg, border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(111,16,40,0.04)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: C.textPrimary }}>Faol Markazlar Reytingi</h3>
              <p className="text-xs mt-0.5" style={{ color: C.textSecondary }}>O'quvchilar soni bo'yicha</p>
            </div>
            <TrendingUp className="w-4 h-4" style={{ color: C.gold }} />
          </div>
          <div className="space-y-3">
            {[...branches]
              .filter(b => b.status === 'Active')
              .sort((a, b) => b.studentCount - a.studentCount)
              .map((b, i) => {
                const maxStudents = Math.max(...branches.filter(x => x.status === 'Active').map(x => x.studentCount), 1);
                const pct = Math.round((b.studentCount / maxStudents) * 100);
                return (
                  <div key={b.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold w-4 text-center" style={{ color: i < 3 ? C.gold : C.textMuted }}>
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium" style={{ color: C.textPrimary }}>{b.name}</span>
                      </div>
                      <span className="text-xs font-bold" style={{ color: C.textPrimary }}>{b.studentCount} ta</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: `${C.border}` }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: i === 0 ? C.gold : i === 1 ? C.primary : `${C.primary}80` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Status distribution */}
        <div
          className="rounded-2xl p-5"
          style={{ background: C.cardBg, border: `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(111,16,40,0.04)' }}
        >
          <div className="mb-4">
            <h3 className="text-sm font-semibold" style={{ color: C.textPrimary }}>Holat taqsimoti</h3>
            <p className="text-xs mt-0.5" style={{ color: C.textSecondary }}>Markazlar statusi</p>
          </div>
          <div className="space-y-3">
            {(['Active', 'Planned', 'Renovation', 'Inactive'] as Branch['status'][]).map(status => {
              const cnt = branches.filter(b => b.status === status).length;
              if (cnt === 0) return null;
              const sc = getStatusConfig(status);
              const pct = Math.round((cnt / branches.length) * 100);
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: C.textPrimary }}>
                      <sc.Icon className="w-3.5 h-3.5" style={{ color: sc.color }} />
                      {sc.label}
                    </span>
                    <span className="text-xs font-bold" style={{ color: C.textPrimary }}>{cnt} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: C.border }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: sc.color }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
            <p className="text-xs font-semibold mb-3" style={{ color: C.textSecondary }}>Umumiy ko'rsatkichlar</p>
            {[
              { label: "Jami o'quvchi", value: totalStudents, icon: Users },
              { label: "Jami o'qituvchi", value: totalTeachers, icon: GraduationCap },
              { label: 'Jami guruh', value: totalGroups, icon: BookOpen },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between py-1.5">
                <span className="flex items-center gap-1.5 text-xs" style={{ color: C.textSecondary }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: C.gold }} />
                  {label}
                </span>
                <span className="text-xs font-bold" style={{ color: C.textPrimary }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MODAL: ADD ─────────────────────────────────────────────────────── */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Yangi Markaz Qo'shish" maxWidth="md">
        <form onSubmit={handleSaveAdd} className="space-y-5">
          {renderFormFields()}
          <div className="flex justify-end gap-2 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>Bekor qilish</Button>
            <Button variant="primary" type="submit">Saqlash</Button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL: EDIT ────────────────────────────────────────────────────── */}
      <Modal isOpen={!!editingBranch} onClose={() => setEditingBranch(null)} title="Markaz Ma'lumotlarini Tahrirlash" maxWidth="md">
        <form onSubmit={handleSaveEdit} className="space-y-5">
          {renderFormFields()}
          <div className="flex justify-end gap-2 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
            <Button variant="ghost" type="button" onClick={() => setEditingBranch(null)}>Bekor qilish</Button>
            <Button variant="primary" type="submit">O'zgarishlarni saqlash</Button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL: VIEW ────────────────────────────────────────────────────── */}
      {viewingBranch && (
        <Modal isOpen={!!viewingBranch} onClose={() => setViewingBranch(null)} title={viewingBranch.name} maxWidth="md">
          <div className="space-y-4">
            {/* Status banner */}
            {(() => {
              const sc = getStatusConfig(viewingBranch.status);
              return (
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: sc.bg, border: `1px solid ${sc.color}30` }}>
                  <span className="text-xs font-semibold" style={{ color: C.textSecondary }}>Markaz holati</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: sc.color }}>
                    <sc.Icon className="w-3.5 h-3.5" />
                    {sc.label}
                  </span>
                </div>
              );
            })()}

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "O'quvchilar", value: viewingBranch.studentCount, icon: Users, color: C.success },
                { label: "O'qituvchilar", value: viewingBranch.teacherCount, icon: GraduationCap, color: C.gold },
                { label: 'Guruhlar', value: viewingBranch.groupsCount, icon: BookOpen, color: C.primary },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="p-3 rounded-xl text-center" style={{ background: C.pageBg, border: `1px solid ${C.border}` }}>
                  <Icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
                  <p className="text-xl font-bold" style={{ color: C.textPrimary }}>{value}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Revenue */}
            {viewingBranch.monthlyRevenue > 0 && (
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: C.goldBg, border: `1px solid #E8D8B8` }}>
                <span className="text-xs font-semibold flex items-center gap-2" style={{ color: C.goldText }}>
                  <DollarSign className="w-4 h-4" />
                  Oylik daromad
                </span>
                <span className="text-sm font-bold" style={{ color: C.goldText }}>{formatRevenue(viewingBranch.monthlyRevenue)}</span>
              </div>
            )}

            {/* Details */}
            <div className="space-y-1.5 text-sm">
              {[
                { label: 'Shahar', value: viewingBranch.city },
                { label: 'Manzil', value: viewingBranch.address },
                { label: "Mas'ul Rahbar", value: viewingBranch.managerName },
                { label: 'Telefon', value: viewingBranch.phone },
                ...(viewingBranch.createdAt ? [{ label: 'Ochilgan sana', value: viewingBranch.createdAt }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2" style={{ borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ color: C.textSecondary }}>{label}</span>
                  <span className="font-semibold" style={{ color: C.textPrimary }}>{value}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setViewingBranch(null)}>Yopish</Button>
              <Button variant="primary" onClick={() => { setViewingBranch(null); handleOpenEdit(viewingBranch); }}>
                Tahrirlash
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── CONFIRM DELETE ─────────────────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={!!deletingBranchId}
        onClose={() => setDeletingBranchId(null)}
        onConfirm={handleConfirmDelete}
        title="Markazni O'chirish"
        message="Haqiqatan ham ushbu markazni o'chirmoqchimisiz? Bu amal qaytarib bo'lmaydi."
        confirmLabel="O'chirish"
        variant="danger"
      />
    </div>
  );
};
