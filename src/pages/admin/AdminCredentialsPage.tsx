import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { useLMS } from '../../context/LMSContext';
import { UserCredential } from '../../data/authCredentials';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { DataTable, Column } from '../../components/ui/DataTable';
import {
  KeyRound,
  Plus,
  Copy,
  Check,
  Send,
  Trash2,
  RefreshCw,
  ShieldCheck,
  GraduationCap,
  Users,
  X,
  Sparkles,
} from 'lucide-react';

export const AdminCredentialsPage: React.FC = () => {
  const { teachers, students } = useCRM();
  const {
    credentials,
    addOrUpdateCredential,
    deleteCredential,
    generatePassword,
  } = useLMS();

  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'teacher' | 'student'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sentNoticeId, setSentNoticeId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetRole, setTargetRole] = useState<'teacher' | 'student'>('student');
  const [selectedPersonId, setSelectedPersonId] = useState('');
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const handleOpenModal = () => {
    const defaultPerson = targetRole === 'teacher' ? teachers[0] : students[0];
    setSelectedPersonId(defaultPerson?.id || '');
    setLoginInput(defaultPerson?.email || '');
    setPasswordInput(generatePassword());
    setIsModalOpen(true);
  };

  const handleRoleChange = (role: 'teacher' | 'student') => {
    setTargetRole(role);
    const defaultPerson = role === 'teacher' ? teachers[0] : students[0];
    setSelectedPersonId(defaultPerson?.id || '');
    setLoginInput(defaultPerson?.email || '');
    setPasswordInput(generatePassword());
  };

  const handlePersonChange = (id: string) => {
    setSelectedPersonId(id);
    if (targetRole === 'teacher') {
      const t = teachers.find(item => item.id === id);
      if (t) setLoginInput(t.email);
    } else {
      const s = students.find(item => item.id === id);
      if (s) setLoginInput(s.email || `${s.fullName.toLowerCase().replace(/\s+/g, '')}@lumos.uz`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput || !passwordInput) return;

    let personName = 'Foydalanuvchi';
    let details = 'Biriktirilgan hisob';
    let teacherId: string | undefined;
    let studentId: string | undefined;

    if (targetRole === 'teacher') {
      const t = teachers.find(item => item.id === selectedPersonId);
      personName = t?.fullName || 'O‘qituvchi';
      details = `${t?.subjects.join(', ')} ustozi`;
      teacherId = selectedPersonId;
    } else {
      const s = students.find(item => item.id === selectedPersonId);
      personName = s?.fullName || 'Talaba';
      details = `${s?.groupName} guruhi o‘quvchisi`;
      studentId = selectedPersonId;
    }

    const newCred: UserCredential = {
      id: `CRED-${Date.now()}`,
      role: targetRole,
      name: personName,
      login: loginInput.trim().toLowerCase(),
      password: passwordInput.trim(),
      details,
      teacherId,
      studentId,
    };

    addOrUpdateCredential(newCred);
    setIsModalOpen(false);
  };

  const handleCopy = (cred: UserCredential) => {
    const text = `Hurmatli ${cred.name}!\nSizning Lumos ta’lim tizimiga kirish ma’lumotlaringiz:\n🌐 Havola: https://lumos.uz\n👤 Login: ${cred.login}\n🔑 Parol: ${cred.password}`;
    navigator.clipboard.writeText(text);
    setCopiedId(cred.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleSendTelegramSMS = (cred: UserCredential) => {
    setSentNoticeId(cred.id);
    setTimeout(() => setSentNoticeId(null), 3500);
  };

  const filteredData = credentials.filter(c => {
    if (roleFilter !== 'all' && c.role !== roleFilter) return false;
    return true;
  });

  const columns: Column<UserCredential>[] = [
    {
      key: 'name',
      header: 'Foydalanuvchi',
      sortable: true,
      render: (c) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
            {c.role === 'admin' ? '👑' : c.role === 'teacher' ? '👨‍🏫' : '👨‍🎓'}
          </div>
          <div className="min-w-0">
            <span className="font-bold text-slate-900 dark:text-white truncate block">
              {c.name}
            </span>
            <p className="text-[10px] text-slate-400 truncate">
              {c.details}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Tizim Roli',
      align: 'center',
      render: (c) => {
        const variant = c.role === 'admin' ? 'default' : c.role === 'teacher' ? 'purple' : 'success';
        const label = c.role === 'admin' ? 'Super Admin' : c.role === 'teacher' ? 'Ustoz' : 'Talaba';
        return <Badge variant={variant as any}>{label}</Badge>;
      },
    },
    {
      key: 'login',
      header: 'Login (Email / Username)',
      sortable: true,
      render: (c) => (
        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
          {c.login}
        </span>
      ),
    },
    {
      key: 'password',
      header: 'Maxfiy Parol',
      render: (c) => (
        <span className="inline-block rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-black text-slate-800 dark:bg-slate-800 dark:text-slate-200">
          {c.password}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Amallar',
      align: 'right',
      render: (c) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            size="xs"
            variant="outline"
            leftIcon={copiedId === c.id ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
            onClick={() => handleCopy(c)}
            title="Login va parolni nusxalash"
          >
            {copiedId === c.id ? 'Nusxalandi! ✓' : 'Nusxalash'}
          </Button>

          <Button
            size="xs"
            variant="primary"
            leftIcon={<Send className="h-3 w-3" />}
            onClick={() => handleSendTelegramSMS(c)}
            title="Telegram / SMS orqali yuborish"
          >
            {sentNoticeId === c.id ? 'Yuborildi! ✓' : 'SMS / Bot'}
          </Button>

          {c.role !== 'admin' && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`${c.name} ning kirish ruxsatini o‘chirishni tasdiqlaysizmi?`)) {
                  deleteCredential(c.id);
                }
              }}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition-colors"
              title="Hisobni o‘chirish"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Top Banner Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-blue-50 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Access Control & Credentials
            </span>
            <span className="text-xs text-slate-400">Super Admin Xavfsizlik Paneli</span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Login & Parollar Boshqaruvi
          </h1>
          <p className="text-xs text-slate-500">
            Faqat Super Admin yangi o‘qituvchi yoki talabaga login/parol yaratadi, nusxalaydi va SMS orqali taqdim etadi.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={handleOpenModal}
        >
          Yangi Login & Parol Yaratish
        </Button>
      </div>

      {/* Info Card */}
      <div className="rounded-2xl border border-blue-200/80 bg-blue-50/60 p-4 text-xs dark:border-blue-900/60 dark:bg-blue-950/30 flex items-start gap-3.5 shadow-xs">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
          <KeyRound className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-blue-900 dark:text-blue-300">
            Markaziy Xavfsizlik Qoidasi:
          </h4>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            Har bir talaba yoki ustoz faqat siz yaratib bergan login/parol orqali o‘z portaliga kirishi mumkin. Tashqi ro‘yxatdan o‘tish yopiq, barcha hisoblar Super Admin orqali nazorat qilinadi.
          </p>
        </div>
      </div>

      {/* Table with Role Filters */}
      <DataTable
        data={filteredData}
        columns={columns}
        searchPlaceholder="Ism, login yoki guruh bo‘yicha qidiruv..."
        filterNode={
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setRoleFilter('all')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                roleFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              Barchasi ({credentials.length})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('teacher')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                roleFilter === 'teacher'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              Ustozlar
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('student')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                roleFilter === 'student'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              Talabalar
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('admin')}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                roleFilter === 'admin'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              Admin
            </button>
          </div>
        }
      />

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Yangi Login & Parol Biriktirish
                  </h3>
                  <p className="text-xs text-slate-400">
                    O‘qituvchi yoki talaba uchun tizimga kirish kalitlarini yarating
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4 text-xs">
              {/* Role Select */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Kimga hisob yaratmoqchisiz:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('teacher')}
                    className={`rounded-xl p-3 text-center font-bold border transition-all ${
                      targetRole === 'teacher'
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    👨‍🏫 O‘qituvchiga (Ustoz)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('student')}
                    className={`rounded-xl p-3 text-center font-bold border transition-all ${
                      targetRole === 'student'
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    👨‍🎓 O‘quvchiga (Talaba)
                  </button>
                </div>
              </div>

              {/* Person Select */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {targetRole === 'teacher' ? 'O‘qituvchini tanlang:' : 'Talabani tanlang:'}
                </label>
                <select
                  value={selectedPersonId}
                  onChange={(e) => handlePersonChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  {targetRole === 'teacher'
                    ? teachers.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.fullName} ({t.subjects.join(', ')})
                        </option>
                      ))
                    : students.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.fullName} ({s.groupName})
                        </option>
                      ))}
                </select>
              </div>

              {/* Login Input */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Login (Email yoki Foydalanuvchi nomi) *
                </label>
                <input
                  type="text"
                  required
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="masalan: alexander.wright@lumos.uz"
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-mono text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Password Input + Generator */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Maxfiy Parol *
                  </label>
                  <button
                    type="button"
                    onClick={() => setPasswordInput(generatePassword())}
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Tasodifiy Parol Yaratish
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Parolni kiriting..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 font-mono text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Bekor qilish
                </Button>
                <Button type="submit" variant="primary">
                  Login & Parolni Saqlash
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
