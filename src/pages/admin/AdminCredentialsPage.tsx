import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { AdminUser } from '../../types/admin';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ActionDropdown } from '../../components/ui/ActionDropdown';
import {
  ShieldCheck,
  Plus,
  Building2,
  Phone,
  Mail,
  KeyRound,
  Copy,
  Check,
  Edit2,
  Trash2,
  RefreshCw,
  UserCheck,
  Clock,
  Sparkles,
  Lock,
  Crown,
} from 'lucide-react';

export const AdminCredentialsPage: React.FC = () => {
  const { admins, addAdmin, updateAdmin, deleteAdmin, branches } = useCRM();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [deletingAdminId, setDeletingAdminId] = useState<string | null>(null);
  const [resettingPasswordAdmin, setResettingPasswordAdmin] = useState<AdminUser | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '+998',
    branchId: branches[0]?.id || 'BR-01',
    role: 'branch_admin' as AdminUser['role'],
    status: 'active' as AdminUser['status'],
  });

  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let pwd = '';
    for (let i = 0; i < 10; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
  };

  const handleOpenAddModal = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '+998',
      branchId: branches[0]?.id || 'BR-01',
      role: 'branch_admin',
      status: 'active',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setFormData({
      fullName: admin.fullName,
      email: admin.email,
      phone: admin.phone,
      branchId: admin.branchId,
      role: admin.role,
      status: admin.status,
    });
  };

  const handleOpenPasswordReset = (admin: AdminUser) => {
    const newPass = generateSecurePassword();
    setGeneratedPassword(newPass);
    setIsCopied(false);
    setResettingPasswordAdmin(admin);
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) return;

    const b = branches.find((item) => item.id === formData.branchId);

    addAdmin({
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      branchId: formData.branchId,
      branchName: b?.name || 'Filial',
      role: formData.role,
      status: formData.status,
      lastActive: 'Hozir faol',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
    });

    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin || !formData.fullName.trim()) return;

    const b = branches.find((item) => item.id === formData.branchId);

    updateAdmin(editingAdmin.id, {
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      branchId: formData.branchId,
      branchName: b?.name || editingAdmin.branchName,
      role: formData.role,
      status: formData.status,
    });

    setEditingAdmin(null);
  };

  const handleToggleStatus = (admin: AdminUser) => {
    const newStatus = admin.status === 'active' ? 'inactive' : 'active';
    updateAdmin(admin.id, { status: newStatus });
  };

  const handleConfirmDelete = () => {
    if (deletingAdminId) {
      deleteAdmin(deletingAdminId);
      setDeletingAdminId(null);
    }
  };

  const columns: Column<AdminUser>[] = [
    {
      key: 'id',
      header: '№',
      align: 'center',
      width: '60px',
      render: (_, index) => (
        <span className="text-xs font-semibold text-[#667085]">
          {(index ?? 0) + 1}
        </span>
      ),
    },
    {
      key: 'fullName',
      header: 'F.I.O',
      sortable: true,
      render: (a) => (
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6F1028] text-xs font-bold text-white shadow-xs">
            {a.fullName.charAt(0).toUpperCase()}
            {a.role === 'super_admin' && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#F7F0E2] border border-[#C89B3C]/40 text-[#C89B3C] shadow-xs">
                <Crown className="h-2.5 w-2.5 fill-[#C89B3C]" />
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#1F2937]">
                {a.fullName}
              </span>
              {a.role === 'super_admin' ? (
                <span className="rounded-md bg-[#F7F0E2] border border-[#C89B3C]/30 px-1.5 py-0.5 text-[9px] font-black uppercase text-[#8A641C]">
                  Super Admin
                </span>
              ) : (
                <span className="rounded-md bg-[#F7E9ED] border border-[#6F1028]/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#6F1028]">
                  Filial Admini
                </span>
              )}
            </div>
            <span className="text-[11px] text-[#667085]">
              {a.role === 'super_admin' ? 'Boshqaruvchi' : 'Filial Admini'}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email / Login',
      sortable: true,
      render: (a) => (
        <span className="text-xs font-semibold text-[#1F2937] flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 text-[#C89B3C] shrink-0" />
          {a.email}
        </span>
      ),
    },
    {
      key: 'phone',
      header: 'Telefon',
      render: (a) => (
        <span className="text-xs text-[#667085] flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 text-[#667085] shrink-0" />
          {a.phone}
        </span>
      ),
    },
    {
      key: 'branchName',
      header: 'Biriktirilgan Markaz',
      sortable: true,
      render: (a) => (
        <span className="rounded-lg bg-[#F7F0E2] border border-[#E8D8B8] px-2.5 py-1 text-xs font-bold text-[#6F1028] flex items-center gap-1.5 w-fit">
          <Building2 className="h-3.5 w-3.5 text-[#C89B3C] shrink-0" />
          {a.branchName}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (a) => {
        const isFaol = a.status === 'active';
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold tracking-tight border ${
              isFaol
                ? 'bg-[#E8F7F0] border-[#16A36A]/20 text-[#16A36A]'
                : 'bg-[#F2F4F7] border-[#E7E1D8] text-[#667085]'
            }`}
          >
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              {isFaol && (
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#16A36A] opacity-75 animate-ping" />
              )}
              <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${isFaol ? 'bg-[#16A36A]' : 'bg-[#98A2B3]'}`} />
            </span>
            {isFaol ? 'Faol' : 'Nofaol'}
          </span>
        );
      },
    },
    {
      key: 'lastActive',
      header: 'Oxirgi Faollik',
      render: (a) => (
        <span className="text-xs text-[#667085] flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-[#667085] shrink-0" />
          {a.lastActive}
        </span>
      ),
    },
    {
      key: 'id' as any,
      header: 'Amallar',
      align: 'right',
      render: (a) => (
        <ActionDropdown
          items={[
            {
              label: 'Tahrirlash',
              icon: Edit2,
              onClick: () => handleOpenEditModal(a),
            },
            {
              label: 'Parolni Yangilash',
              icon: KeyRound,
              onClick: () => handleOpenPasswordReset(a),
            },
            {
              label: a.status === 'active' ? 'Deaktivatsiya qilish' : 'Faollashtirish',
              icon: a.status === 'active' ? Lock : UserCheck,
              variant: a.status === 'active' ? 'warning' : 'success',
              onClick: () => handleToggleStatus(a),
            },
            {
              label: 'O‘chirish',
              icon: Trash2,
              variant: 'danger',
              disabled: a.role === 'super_admin',
              onClick: () => setDeletingAdminId(a.id),
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            Adminlar
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1">
            Markaz administratorlarini boshqarish
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6F1028] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#4A0B1B] transition-all cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          Admin qo‘shish
        </button>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-[#E7E1D8] bg-white shadow-xs p-4 sm:p-5 overflow-x-auto">
        <DataTable
          data={admins}
          columns={columns}
          searchPlaceholder="F.I.O, email yoki markaz bo‘yicha qidiruv..."
        />
      </div>

      {/* MODAL: ADD ADMIN */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Yangi Admin Qo‘shish"
        maxWidth="md"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1F2937] mb-1">
              F.I.O *
            </label>
            <Input
              required
              placeholder="Masalan: Sardorbek Umarov"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1F2937] mb-1">
                Email / Login *
              </label>
              <Input
                required
                type="email"
                placeholder="s.umarov@lumos.uz"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2937] mb-1">
                Telefon Raqami
              </label>
              <Input
                placeholder="+998 (90) 000-00-00"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1F2937] mb-1">
                Biriktiriladigan Markaz *
              </label>
              <Select
                value={formData.branchId}
                onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2937] mb-1">
                Rol
              </label>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              >
                <option value="branch_admin">Filial Admini</option>
                <option value="manager">Menejer</option>
                <option value="super_admin">Super Admin</option>
              </Select>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-[#C89B3C]/30 bg-[#F7F0E2] text-xs text-[#8A641C] flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-[#C89B3C] shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Admin saqlangach, unga xavfsiz vaqtinchalik parol taqdim etiladi. Table ichida ochiq parollar saqlanmaydi.
            </span>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-[#E7E1D8]">
            <Button variant="secondary" type="button" onClick={() => setIsAddModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" type="submit">
              Adminni saqlash
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: EDIT ADMIN */}
      <Modal
        isOpen={!!editingAdmin}
        onClose={() => setEditingAdmin(null)}
        title="Admin Ma’lumotlarini Tahrirlash"
        maxWidth="md"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1F2937] mb-1">
              F.I.O *
            </label>
            <Input
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1F2937] mb-1">
                Email / Login *
              </label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2937] mb-1">
                Telefon Raqami
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1F2937] mb-1">
                Biriktirilgan Markaz *
              </label>
              <Select
                value={formData.branchId}
                onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2937] mb-1">
                Status
              </label>
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as AdminUser['status'] })
                }
              >
                <option value="active">Faol</option>
                <option value="inactive">Nofaol</option>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-[#E7E1D8]">
            <Button variant="secondary" type="button" onClick={() => setEditingAdmin(null)}>
              Bekor qilish
            </Button>
            <Button variant="primary" type="submit">
              O‘zgarishlarni saqlash
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: RESET PASSWORD (SECURE ONE-TIME REVEAL) */}
      {resettingPasswordAdmin && (
        <Modal
          isOpen={!!resettingPasswordAdmin}
          onClose={() => setResettingPasswordAdmin(null)}
          title="Xavfsiz Parolni Tiklash"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-[#667085] leading-relaxed">
              <strong className="text-[#1F2937]">{resettingPasswordAdmin.fullName}</strong> uchun yangi xavfsiz vaqtinchalik parol yaratildi. Xavfsizlik maqsadida ushbu parol faqat bir marta ko‘rsatiladi.
            </p>

            <div className="rounded-xl border border-[#C89B3C]/30 bg-[#F7F0E2] p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8A641C] tracking-wider">Yangi Parol:</span>
                <p className="text-lg font-mono font-black text-[#6F1028] tracking-widest mt-0.5 select-all">
                  {generatedPassword}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyPassword}
                className="flex items-center gap-1.5 rounded-lg border border-[#E7E1D8] bg-white px-3 py-2 text-xs font-bold text-[#1F2937] hover:bg-[#F7E9ED] hover:border-[#6F1028]/30 hover:text-[#6F1028] transition-all cursor-pointer shadow-xs"
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4 text-[#16A36A]" />
                    <span className="text-[#16A36A]">Nusxalandi</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Nusxa olish</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E7E1D8]">
              <Button variant="primary" onClick={() => setResettingPasswordAdmin(null)}>
                Tushunarli, yopish
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmDialog
        isOpen={!!deletingAdminId}
        onClose={() => setDeletingAdminId(null)}
        onConfirm={handleConfirmDelete}
        title="Adminni O‘chirish"
        message="Haqiqatan ham ushbu adminni o‘chirmoqchimisiz? Ushbu foydalanuvchi tizimga boshqa kira olmaydi."
        confirmLabel="O‘chirish"
        variant="danger"
      />
    </div>
  );
};
