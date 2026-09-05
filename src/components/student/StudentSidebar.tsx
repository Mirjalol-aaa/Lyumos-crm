import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { useLMS } from '../../context/LMSContext';
import { LogoutConfirmModal } from '../modals/LogoutConfirmModal';
import lumosLogo from '../../assets/lumos-logo.png';
import {
  LayoutDashboard,
  PlayCircle,
  FileCheck2,
  Trophy,
  CreditCard,
  Gift,
  ChevronRight,
  LogOut,
  X,
  Globe,
} from 'lucide-react';

export type StudentPageType =
  | 'dashboard'
  | 'lessons'
  | 'homework'
  | 'leaderboard'
  | 'rewards'
  | 'payments';

interface StudentSidebarProps {
  activePage: StudentPageType;
  setActivePage: (page: StudentPageType) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({
  activePage,
  setActivePage,
  collapsed,
  setCollapsed,
}) => {
  const { students } = useCRM();
  const { activeStudentId, homeworkTasks, submissions } = useLMS();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const currentStudent = students.find(s => s.id === activeStudentId) || students[0];

  const mySubmissions = new Set(
    submissions.filter(s => s.studentId === currentStudent?.id).map(s => s.taskId)
  );

  const pendingHomeworkCount = homeworkTasks.filter(
    t => (t.groupId === currentStudent?.groupId || !t.groupId) && !mySubmissions.has(t.id)
  ).length;

  const navItems: {
    id: StudentPageType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Mening Kabinetim',
      icon: LayoutDashboard,
    },
    {
      id: 'lessons',
      label: 'Darslar & Videolar',
      icon: PlayCircle,
    },
    {
      id: 'homework',
      label: 'Uyga Vazifalarim',
      icon: FileCheck2,
      badge: pendingHomeworkCount > 0 ? pendingHomeworkCount : undefined,
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
    },
    {
      id: 'leaderboard',
      label: 'Guruh Reytingi (Top 10)',
      icon: Trophy,
    },
    {
      id: 'rewards',
      label: 'Sovg‘alar Do‘koni',
      icon: Gift,
      badge: 'Coins',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    },
    {
      id: 'payments',
      label: 'Mening To‘lovlarim',
      icon: CreditCard,
    },
  ];

  return (
    <>
      {!collapsed && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setCollapsed(true)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-slate-200/80 bg-white/95 backdrop-blur-xl transition-all duration-300 ease-out dark:border-slate-800/80 dark:bg-slate-900/95 lg:relative lg:z-20 lg:translate-x-0 ${
          collapsed ? '-translate-x-full w-72 lg:w-20 lg:translate-x-0' : 'translate-x-0 w-72 lg:w-64'
        }`}
      >
        {/* Brand with Official Lumos Logo */}
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-slate-100 px-4 dark:border-slate-800/60">
          <button
            type="button"
            onClick={() => {
              window.location.hash = '#/landing';
            }}
            className="flex min-w-0 items-center gap-3 overflow-hidden text-left group cursor-pointer"
            title="LUMOS Asosiy saytiga o‘tish"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500/20 via-yellow-500/10 to-amber-300/20 p-1.5 border border-amber-400/30 shadow-md shadow-amber-500/10 group-hover:scale-105 transition-transform">
              <img
                src={lumosLogo}
                alt="LUMOS"
                className="h-full w-full object-contain filter drop-shadow-sm"
              />
            </div>

            <div className={`min-w-0 flex-col ${collapsed ? 'lg:hidden' : 'flex'}`}>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                  LUMOS
                </span>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  Talaba
                </span>
              </div>
              <span className="max-w-[170px] truncate text-[10px] font-medium text-slate-400">
                O‘quvchi Kabineti
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
          <p className={`mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 ${collapsed ? 'lg:hidden' : ''}`}>
            Talaba Menusi
          </p>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActivePage(item.id);
                    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                      setCollapsed(true);
                    }
                  }}
                  title={collapsed ? item.label : undefined}
                  className={`group relative flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-600 font-semibold text-white shadow-md shadow-emerald-600/20'
                      : 'font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                  } ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 transition-all duration-200 ${
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600 dark:text-slate-400'
                    }`}
                  />

                  <span className={`min-w-0 flex-1 truncate text-left ${collapsed ? 'lg:hidden' : ''}`}>
                    {item.label}
                  </span>

                  {item.badge !== undefined && (
                    <span
                      className={`min-w-[26px] rounded-full px-2 py-0.5 text-center text-[11px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor
                      } ${collapsed ? 'lg:hidden' : ''}`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {isActive && (
                    <ChevronRight className={`h-4 w-4 shrink-0 text-white/80 ${collapsed ? 'lg:hidden' : ''}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer with Student Profile & Logout Modal trigger */}
        <div className="shrink-0 border-t border-slate-100 p-3 dark:border-slate-800/60 space-y-2">
          {/* Main Website / Courses Quick Access */}
          <button
            type="button"
            onClick={() => {
              window.location.hash = '#/landing';
            }}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/70 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60 transition-all shadow-xs"
            title="LUMOS Asosiy sayti va kurslar sahifasiga o‘tish"
          >
            <Globe className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className={collapsed ? 'lg:hidden' : ''}>🌐 Asosiy Sayt & Kurslar</span>
          </button>

          <div className={`flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-slate-50/80 p-2.5 dark:border-slate-700/50 dark:bg-slate-800/50 ${collapsed ? 'lg:justify-center' : ''}`}>
            <img
              src={currentStudent?.avatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
              alt={currentStudent?.fullName}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-emerald-500/20"
            />

            <div className={`min-w-0 flex-1 ${collapsed ? 'lg:hidden' : ''}`}>
              <p className="truncate text-xs font-bold text-slate-800 dark:text-white">
                {currentStudent?.fullName || 'Talaba'}
              </p>
              <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">
                {currentStudent?.groupName || 'Guruh'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(true)}
              title="Tizimdan chiqish"
              className={`rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 transition-colors ${collapsed ? 'lg:hidden' : ''}`}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
};
