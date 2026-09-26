import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Branch } from '../../types/admin';
import { DataTable, Column } from '../../components/ui/DataTable';
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
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const AdminBranchesPage: React.FC = () => {
  const { branches, addBranch, updateBranch, deleteBranch } = useCRM();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [viewingBranch, setViewingBranch] = useState<Branch | null>(null);
  const [deletingBranchId, setDeletingBranchId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    city: 'Toshkent',
    address: '',
    phone: '+998',
    managerName: '',
    status: 'Active' as Branch['status'],
  });

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      city: 'Toshkent',
      address: '',
      phone: '+998',
      managerName: '',
      status: 'Active',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      city: branch.city,
      address: branch.address,
      phone: branch.phone,
      managerName: branch.managerName,
      status: branch.status,
    });
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.address.trim()) return;

    addBranch({
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
    });

    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch || !formData.name.trim()) return;

    updateBranch(editingBranch.id, {
      name: formData.name.trim(),
      city: formData.city.trim(),
      address: formData.address.trim(),
      phone: formData.phone.trim(),
      managerName: formData.managerName.trim(),
      status: formData.status,
    });

    setEditingBranch(null);
  };

  const handleConfirmDelete = () => {
    if (deletingBranchId) {
      deleteBranch(deletingBranchId);
      setDeletingBranchId(null);
    }
  };

  const columns: Column<Branch>[] = [
    {
      key: 'id',
      header: '№',
      align: 'center',
      render: (_, index) => (
        <span className="text-xs font-bold text-slate-400">
          {(index ?? 0) + 1}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Markaz Nomi',
      sortable: true,
      render: (b) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-[#F8F4EA] flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            {b.name}
          </span>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-[#9D958C] mt-0.5">
            <MapPin className="h-3 w-3 text-slate-400" />
            <span>{b.address}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'city',
      header: 'Joylashuv / Shahar',
      sortable: true,
      render: (b) => (
        <span className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-600 dark:text-[#E7B83F]">
          {b.city}
        </span>
      ),
    },
    {
      key: 'managerName',
      header: 'Mas’ul Admin / Rahbar',
      render: (b) => (
        <div>
          <span className="text-xs font-bold text-slate-800 dark:text-[#D8D0C5]">
            {b.managerName}
          </span>
          <p className="text-[10px] text-slate-400 dark:text-[#9D958C] flex items-center gap-1 mt-0.5">
            <Phone className="h-2.5 w-2.5" /> {b.phone}
          </p>
        </div>
      ),
    },
    {
      key: 'studentCount',
      header: 'O‘quvchilar',
      sortable: true,
      align: 'center',
      render: (b) => (
        <span className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-900 dark:text-[#F8F4EA]">
          <Users className="h-3 w-3 text-emerald-500" />
          {b.studentCount} ta
        </span>
      ),
    },
    {
      key: 'teacherCount',
      header: 'O‘qituvchilar',
      sortable: true,
      align: 'center',
      render: (b) => (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-[#D8D0C5]">
          <GraduationCap className="h-3 w-3 text-[#5A0B1C] dark:text-[#D9A62E]" />
          {b.teacherCount} ustoz
        </span>
      ),
    },
    {
      key: 'groupsCount',
      header: 'Guruhlar',
      sortable: true,
      align: 'center',
      render: (b) => (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-[#D8D0C5]">
          <BookOpen className="h-3 w-3 text-purple-500" />
          {b.groupsCount} guruh
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (b) => {
        const isFaol = b.status === 'Active';
        return (
          <Badge
            variant={isFaol ? 'success' : b.status === 'Planned' ? 'warning' : 'neutral'}
            hasDot
          >
            {isFaol ? 'Faol' : b.status === 'Planned' ? 'Rejada' : 'Nofaol'}
          </Badge>
        );
      },
    },
    {
      key: 'id' as any,
      header: 'Amallar',
      align: 'right',
      render: (b) => (
        <ActionDropdown
          items={[
            {
              label: 'Ko‘rish',
              icon: Eye,
              onClick: () => setViewingBranch(b),
            },
            {
              label: 'Tahrirlash',
              icon: Edit2,
              onClick: () => handleOpenEditModal(b),
            },
            {
              label: 'O‘chirish',
              icon: Trash2,
              variant: 'danger',
              onClick: () => setDeletingBranchId(b.id),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Markazlar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Lumos ta’lim markazlarini boshqarish
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5A0B1C] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#450815] transition-all cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          Yangi markaz qo‘shish
        </button>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs p-4 sm:p-5 overflow-x-auto">
        <DataTable
          data={branches}
          columns={columns}
          searchPlaceholder="Markaz nomi, shahar yoki admin bo‘yicha qidiruv..."
        />
      </div>

      {/* MODAL: ADD BRANCH */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Yangi Markaz Qo‘shish"
        maxWidth="md"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-[#D8D0C5] mb-1">
              Markaz Nomi *
            </label>
            <Input
              required
              placeholder="Masalan: Lumos Samarqand Filiali"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#D8D0C5] mb-1">
                Aloqa Telefoni
              </label>
              <Input
                placeholder="+998 (71) 200-00-00"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#D8D0C5] mb-1">
                Mas’ul Admin / Rahbar
              </label>
              <Input
                placeholder="F.I.O"
                value={formData.managerName}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#D8D0C5] mb-1">
                Filial Holati
              </label>
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as Branch['status'] })
                }
              >
                <option value="Active">Faol</option>
                <option value="Planned">Rejalashtirilgan</option>
                <option value="Renovation">Ta’mirda</option>
                <option value="Inactive">Nofaol</option>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-amber-500/20">
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" type="submit">
              Markazni saqlash
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: EDIT BRANCH */}
      <Modal
        isOpen={!!editingBranch}
        onClose={() => setEditingBranch(null)}
        title="Markaz Ma’lumotlarini Tahrirlash"
        maxWidth="md"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-[#D8D0C5] mb-1">
              Markaz Nomi *
            </label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#D8D0C5] mb-1">
                Shahar / Joylashuv *
              </label>
              <Input
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#D8D0C5] mb-1">
                Aloqa Telefoni
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-[#D8D0C5] mb-1">
              To‘liq Manzil *
            </label>
            <Input
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#D8D0C5] mb-1">
                Mas’ul Admin / Rahbar
              </label>
              <Input
                value={formData.managerName}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#D8D0C5] mb-1">
                Filial Holati
              </label>
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as Branch['status'] })
                }
              >
                <option value="Active">Faol</option>
                <option value="Planned">Rejalashtirilgan</option>
                <option value="Renovation">Ta’mirda</option>
                <option value="Inactive">Nofaol</option>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-amber-500/20">
            <Button variant="ghost" type="button" onClick={() => setEditingBranch(null)}>
              Bekor qilish
            </Button>
            <Button variant="primary" type="submit">
              O‘zgarishlarni saqlash
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: VIEW BRANCH DETAILS */}
      {viewingBranch && (
        <Modal
          isOpen={!!viewingBranch}
          onClose={() => setViewingBranch(null)}
          title={viewingBranch.name}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5">
              <span className="text-xs font-semibold text-[#D8D0C5]">Holat</span>
              <Badge variant={viewingBranch.status === 'Active' ? 'success' : 'neutral'} hasDot>
                {viewingBranch.status === 'Active' ? 'Faol' : viewingBranch.status}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-amber-500/10 bg-[#180D12]/60 text-center">
                <span className="text-[10px] text-[#9D958C] uppercase font-bold">O‘quvchilar</span>
                <p className="text-lg font-black text-[#F8F4EA] mt-1">{viewingBranch.studentCount}</p>
              </div>
              <div className="p-3 rounded-xl border border-amber-500/10 bg-[#180D12]/60 text-center">
                <span className="text-[10px] text-[#9D958C] uppercase font-bold">O‘qituvchilar</span>
                <p className="text-lg font-black text-[#F8F4EA] mt-1">{viewingBranch.teacherCount}</p>
              </div>
              <div className="p-3 rounded-xl border border-amber-500/10 bg-[#180D12]/60 text-center">
                <span className="text-[10px] text-[#9D958C] uppercase font-bold">Guruhlar</span>
                <p className="text-lg font-black text-[#F8F4EA] mt-1">{viewingBranch.groupsCount}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100/10">
                <span className="text-slate-400">Shahar:</span>
                <span className="font-bold text-[#F8F4EA]">{viewingBranch.city}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100/10">
                <span className="text-slate-400">Manzil:</span>
                <span className="font-bold text-[#F8F4EA]">{viewingBranch.address}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100/10">
                <span className="text-slate-400">Mas’ul Rahbar:</span>
                <span className="font-bold text-[#F8F4EA]">{viewingBranch.managerName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100/10">
                <span className="text-slate-400">Telefon:</span>
                <span className="font-bold text-[#F8F4EA]">{viewingBranch.phone}</span>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <Button variant="primary" onClick={() => setViewingBranch(null)}>
                Yopish
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmDialog
        isOpen={!!deletingBranchId}
        onClose={() => setDeletingBranchId(null)}
        onConfirm={handleConfirmDelete}
        title="Markazni O‘chirish"
        message="Haqiqatan ham ushbu markazni o‘chirmoqchimisiz? Ushbu amal markaz ma’lumotlarini tarmoq ro‘yxatidan chiqaradi."
        confirmLabel="O‘chirish"
        variant="danger"
      />
    </div>
  );
};
