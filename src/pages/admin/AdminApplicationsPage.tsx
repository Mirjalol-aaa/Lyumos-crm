import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  FileText,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  UserPlus,
  Search,
  Filter,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

interface LeadApplication {
  id: string;
  fullName: string;
  phone: string;
  course: string;
  createdAt: string;
  status: 'Yangi' | 'Bog‘lanildi' | 'Sinov darsida' | 'Qabul qilindi';
  notes?: string;
}

const INITIAL_APPLICATIONS: LeadApplication[] = [
  {
    id: 'APP-101',
    fullName: 'Shavkat Mirzayev',
    phone: '+998 (90) 111-22-33',
    course: 'Matematika (Hadicha ustoz)',
    createdAt: '2025-09-04',
    status: 'Yangi',
    notes: 'Sayt orqali bepul sinov darsiga yozilgan',
  },
  {
    id: 'APP-102',
    fullName: 'Nodira Salimova',
    phone: '+998 (97) 444-55-66',
    course: 'Ingliz Tili (Hasanboy ustoz)',
    createdAt: '2025-09-03',
    status: 'Bog‘lanildi',
    notes: 'IELTS ga tayyorgarlik ko‘rmoqchi',
  },
  {
    id: 'APP-103',
    fullName: 'Bekzod Karimov',
    phone: '+998 (99) 777-88-99',
    course: 'Matematika (Hadicha ustoz)',
    createdAt: '2025-09-01',
    status: 'Sinov darsida',
    notes: 'DTM testlariga tayyorgarlik uchun',
  },
];

export const AdminApplicationsPage: React.FC = () => {
  const { addStudent, setIsAddStudentModalOpen } = useCRM();
  const [applications, setApplications] = useState<LeadApplication[]>(INITIAL_APPLICATIONS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      if (statusFilter !== 'all' && app.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          app.fullName.toLowerCase().includes(q) ||
          app.phone.includes(q) ||
          app.course.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [applications, statusFilter, searchQuery]);

  const handleUpdateStatus = (id: string, newStatus: LeadApplication['status']) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
  };

  const handleDelete = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>CRM & Qabul Bo‘limi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Arizalar & Sinov Darslari
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Saytdan tushgan arizalar, bepul darsga yozilganlar va potensial o‘quvchilar bazasi
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          className="gap-2 font-bold shadow-md shadow-amber-500/20 cursor-pointer"
          onClick={() => setIsAddStudentModalOpen(true)}
        >
          <UserPlus className="h-4 w-4" />
          <span>To‘g‘ridan-to‘g‘ri O‘quvchi Qo‘shish</span>
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-slate-400 font-bold uppercase block">Jami Arizalar</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
            {applications.length} ta
          </span>
        </div>
        <div className="p-5 rounded-2xl border border-amber-400/30 bg-amber-500/5 dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase block">Yangi kelgan</span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block">
            {applications.filter((a) => a.status === 'Yangi').length} ta
          </span>
        </div>
        <div className="p-5 rounded-2xl border border-blue-400/30 bg-blue-500/5 dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase block">Sinov darsida</span>
          <span className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 block">
            {applications.filter((a) => a.status === 'Sinov darsida').length} ta
          </span>
        </div>
        <div className="p-5 rounded-2xl border border-emerald-400/30 bg-emerald-500/5 dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase block">Qabul qilingan</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
            {applications.filter((a) => a.status === 'Qabul qilindi').length} ta
          </span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ism yoki telefon bo‘yicha qidirish..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-bold">
          {(['all', 'Yangi', 'Bog‘lanildi', 'Sinov darsida', 'Qabul qilindi'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {st === 'all' ? 'Barchasi' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-black uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Ariza Beruvchi</th>
                <th className="px-5 py-3.5">Telefon</th>
                <th className="px-5 py-3.5">Qiziqqan Kursi</th>
                <th className="px-5 py-3.5">Sana</th>
                <th className="px-5 py-3.5">Holat</th>
                <th className="px-5 py-3.5 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center text-xs">
                        {app.fullName.charAt(0)}
                      </div>
                      <div>
                        <span>{app.fullName}</span>
                        {app.notes && (
                          <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                            {app.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono font-medium">
                    <a href={`tel:${app.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{app.phone}</span>
                    </a>
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-700 dark:text-slate-300">
                    {app.course}
                  </td>
                  <td className="px-5 py-4 text-slate-400 font-mono text-[11px]">
                    {app.createdAt}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        app.status === 'Yangi'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : app.status === 'Sinov darsida'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                          : app.status === 'Qabul qilindi'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {app.status === 'Yangi' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(app.id, 'Bog‘lanildi')}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 text-[11px] font-bold cursor-pointer"
                        >
                          Bog‘lanildi
                        </button>
                      )}
                      {app.status !== 'Qabul qilindi' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(app.id, 'Qabul qilindi')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 text-[11px] font-bold cursor-pointer"
                        >
                          Qabul qilish
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(app.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                        title="O‘chirish"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Hozircha hech qanday arizalar topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
