import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { useLMS } from '../../context/LMSContext';
import type { PageType } from '../../types/crm';
import { LogoutConfirmModal } from '../modals/LogoutConfirmModal';
import lumosLogo from '../../assets/lumos-logo.png';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  Building2,
  CalendarCheck2,
  Calendar,
  Award,
  FileText,
  BookCheck,
  ShieldCheck,
  KeyRound,
  BarChart3,
  Receipt,
  Settings,
  ChevronRight,
  LogOut,
  X,
  Globe,
} from 'lucide-react';

interface SidebarNavProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

interface NavGroup {
  groupTitle: string;
  items: {
    id: PageType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
  }[];
}

export const Sidebar: React.FC<SidebarNavProps> = ({
  collapsed,
  setCollapsed,
}) => {
  const { activePage, setActivePage, students } = useCRM();
  const { currentUser } = useLMS();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const overdueCount = students.filter((student) =>
    Object.values(student.payments).some(
      (payment: any) => payment.status === 'Overdue'
    )
  ).length;

  const navGroups: NavGroup[] = [
    {
      groupTitle: 'ASOSIY',
      items: [
        {
          id: 'dashboard',
          label: 'Bosh sahifa',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      groupTitle: 'TA’LIM',
      items: [
        {
          id: 'students_hub',
          label: 'O‘quvchilar',
          icon: Users,
          badge: students.length,
          badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
        },
        {
          id: 'courses_groups',
          label: 'Guruhlar',
          icon: BookOpen,
        },
        {
          id: 'teachers_workload',
          label: 'O‘qituvchilar',
          icon: GraduationCap,
        },
        {
          id: 'schedule',
          label: 'Dars jadvali',
          icon: Calendar,
        },
        {
          id: 'attendance',
          label: 'Davomat',
          icon: CalendarCheck2,
        },
        {
          id: 'homework',
          label: 'Uy vazifalari',
          icon: BookCheck,
        },
        {
          id: 'grades',
          label: 'Baholar & Reyting',
          icon: Award,
        },
      ],
    },
    {
      groupTitle: 'MOLIYA',
      items: [
        {
          id: 'payments',
          label: 'To‘lovlar',
          icon: Receipt,
          badge: overdueCount > 0 ? `${overdueCount} qarz` : undefined,
          badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300',
        },
        {
          id: 'expenses',
          label: 'Xarajatlar',
          icon: DollarSign,
        },
        {
          id: 'finance_payroll',
          label: 'Oyliklar & Payroll',
          icon: DollarSign,
        },
      ],
    },
    {
      groupTitle: 'CRM',
      items: [
        {
          id: 'applications',
          label: 'Arizalar & Qabul',
          icon: FileText,
          badge: 'Yangi',
          badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
        },
      ],
    },
    {
      groupTitle: 'TAHLIL',
      items: [
        {
          id: 'reports',
          label: 'Hisobotlar',
          icon: BarChart3,
        },
      ],
    },
    {
      groupTitle: 'TIZIM',
      items: [
        {
          id: 'settings',
          label: 'Sozlamalar',
          icon: Settings,
        },
        {
          id: 'credentials',
          label: 'Login & Parollar',
          icon: KeyRound,
        },
        {
          id: 'audit_settings',
          label: 'Xavfsizlik & Rollar',
          icon: ShieldCheck,
        },
      ],
    },
  ];

  const handleNavigation = (page: PageType) => {
    setActivePage(page);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setCollapsed(true);
    }
  };

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
        {/* Brand Header with Official Lumos Logo */}
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
                <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
                  Super Admin
                </span>
              </div>
              <p className="truncate text-[10px] font-medium text-slate-400">
                O‘quv Markazi Boshqaruvi
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
          {navGroups.map((group) => (
            <div key={group.groupTitle} className="space-y-1">
              <p
                className={`px-3 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 ${
                  collapsed ? 'lg:hidden' : ''
                }`}
              >
                {group.groupTitle}
              </p>

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigation(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={`group relative flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-xs transition-all duration-200 ${
                      isActive
                        ? 'bg-amber-600 font-bold text-white shadow-md shadow-amber-600/25 dark:bg-amber-500 dark:text-slate-950'
                        : 'font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                    } ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-all duration-200 ${
                        isActive ? 'text-white dark:text-slate-950' : 'text-slate-500 group-hover:text-amber-600 dark:text-slate-400'
                      }`}
                    />

                    <span className={`min-w-0 flex-1 truncate text-left ${collapsed ? 'lg:hidden' : ''}`}>
                      {item.label}
                    </span>

                    {item.badge !== undefined && (
                      <span
                        className={`min-w-[20px] rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold ${
                          isActive ? 'bg-white/20 text-white dark:text-slate-950' : item.badgeColor
                        } ${collapsed ? 'lg:hidden' : ''}`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <ChevronRight className={`h-3.5 w-3.5 shrink-0 text-white/80 dark:text-slate-950/80 ${collapsed ? 'lg:hidden' : ''}`} />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer with User Profile and Logout Modal trigger */}
        <div className="shrink-0 border-t border-slate-100 p-3 dark:border-slate-800/60 space-y-2">
          {/* Main Website / Public Page Button */}
          <button
            type="button"
            onClick={() => {
              window.location.hash = '#/landing';
            }}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-amber-200/80 bg-amber-50/70 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-900/60 transition-all shadow-xs"
            title="LUMOS Asosiy saytiga o‘tish"
          >
            <Globe className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className={collapsed ? 'lg:hidden' : ''}>🌐 Asosiy Sayt & Kurslar</span>
          </button>

          <div className={`flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-slate-50/80 p-2.5 dark:border-slate-700/50 dark:bg-slate-800/50 ${collapsed ? 'lg:justify-center' : ''}`}>
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 to-yellow-500 text-xs font-bold text-white shadow-sm ring-2 ring-amber-500/20">
              👑
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>

            <div className={`min-w-0 flex-1 ${collapsed ? 'lg:hidden' : ''}`}>
              <p className="truncate text-xs font-black text-slate-800 dark:text-white">
                {currentUser?.name || 'Mirjalol Ahmadov'}
              </p>
              <p className="truncate text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Super Admin ({currentUser?.email || 'Mirjalol'})
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