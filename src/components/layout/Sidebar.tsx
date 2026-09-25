import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { useLMS } from '../../context/LMSContext';
import type { PageType } from '../../types/crm';
import { LogoutConfirmModal } from '../modals/LogoutConfirmModal';
import lumosLogoMark from '../../assets/branding/lumos-logo-mark.png';
import {
  LayoutDashboard,
  Building2,
  ShieldCheck,
  GraduationCap,
  Users,
  BookOpen,
  CreditCard,
  BarChart3,
  Settings,
  ChevronRight,
  LogOut,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface SidebarNavProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

interface MenuItem {
  id: PageType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
  badgeColor?: string;
}

export const Sidebar: React.FC<SidebarNavProps> = ({
  collapsed,
  setCollapsed,
}) => {
  const { activePage, setActivePage, students, teachers, groups, branches, admins } = useCRM();
  const { currentUser } = useLMS();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const overdueCount = students.filter((student) =>
    Object.values(student.payments).some(
      (payment: any) => payment.status === 'Overdue'
    )
  ).length;

  // STRICTLY 9 CORE SUPER ADMIN ITEMS
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'branches',
      label: 'Markazlar',
      icon: Building2,
      badge: branches?.length || 5,
      badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    },
    {
      id: 'credentials',
      label: 'Adminlar',
      icon: ShieldCheck,
      badge: admins?.length || 6,
      badgeColor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    },
    {
      id: 'teachers',
      label: 'O‘qituvchilar',
      icon: GraduationCap,
      badge: teachers?.length,
      badgeColor: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20',
    },
    {
      id: 'students',
      label: 'O‘quvchilar',
      icon: Users,
      badge: students?.length,
      badgeColor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    },
    {
      id: 'groups',
      label: 'Guruhlar',
      icon: BookOpen,
      badge: groups?.length,
      badgeColor: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20',
    },
    {
      id: 'payments',
      label: 'To‘lovlar',
      icon: CreditCard,
      badge: overdueCount > 0 ? `${overdueCount} qarz` : undefined,
      badgeColor: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20',
    },
    {
      id: 'reports',
      label: 'Hisobotlar',
      icon: BarChart3,
    },
    {
      id: 'settings',
      label: 'Sozlamalar',
      icon: Settings,
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
      {/* Mobile Backdrop */}
      {!collapsed && (
        <button
          type="button"
          aria-label="Sidebar yopish"
          onClick={() => setCollapsed(true)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Main Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r transition-all duration-300 ease-in-out lg:relative lg:z-20 lg:translate-x-0 ${
          collapsed ? '-translate-x-full w-72 lg:w-20 lg:translate-x-0' : 'translate-x-0 w-72 lg:w-64'
        } border-slate-200/80 bg-white/95 text-slate-800 dark:border-amber-500/15 dark:bg-[#0D0608]/98 dark:text-[#F8F4EA] shadow-xl dark:shadow-2xl dark:shadow-black/70`}
      >
        {/* Brand Header */}
        <div className="flex h-18 shrink-0 items-center justify-between border-b border-slate-100 px-3.5 dark:border-amber-500/15">
          <div className="flex min-w-0 items-center gap-3 overflow-hidden">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500/20 via-[#3A0712]/40 to-amber-400/20 p-1.5 border border-amber-500/30 shadow-md shadow-amber-500/10">
              <img
                src={lumosLogoMark}
                alt="Lumos Logo"
                className="h-full w-full object-contain filter drop-shadow-[0_2px_8px_rgba(217,166,46,0.35)]"
              />
            </div>

            <div className={`min-w-0 flex-col ${collapsed ? 'lg:hidden' : 'flex'}`}>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-slate-900 dark:text-[#F8F4EA] font-serif">
                  LUMOS
                </span>
                <span className="rounded-md bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-amber-700 dark:text-[#E7B83F]">
                  SUPER ADMIN
                </span>
              </div>
              <p className="truncate text-[10px] font-medium text-slate-400 dark:text-[#9D958C]">
                Education CRM/ERP
              </p>
            </div>
          </div>

          {/* Desktop Toggle Icon */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:text-[#9D958C] dark:hover:bg-amber-500/10 dark:hover:text-[#E7B83F] transition-colors"
            title={collapsed ? 'Kengaytirish' : 'Yig‘ish'}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items (Exactly 9 Items) */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3.5 space-y-1 scrollbar-thin">
          <p
            className={`px-3 pb-1 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-amber-500/50 ${
              collapsed ? 'lg:hidden' : ''
            }`}
          >
            Boshqaruv menyusi
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activePage === item.id ||
              (item.id === 'teachers' && activePage === 'teachers_workload') ||
              (item.id === 'students' && activePage === 'students_hub') ||
              (item.id === 'groups' && activePage === 'courses_groups') ||
              (item.id === 'payments' && activePage === 'finance_payroll') ||
              (item.id === 'credentials' && activePage === 'audit_settings');

            return (
              <div key={item.id} className="relative group">
                <button
                  type="button"
                  onClick={() => handleNavigation(item.id)}
                  className={`relative flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-xs transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#5A0B1C] to-[#3A0712] font-bold text-white shadow-md shadow-black/20 border border-[#D9A62E]/40'
                      : 'font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-[#D8D0C5] dark:hover:bg-amber-500/10 dark:hover:text-white dark:hover:border dark:hover:border-amber-500/20'
                  } ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}
                >
                  <Icon
                    className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                      isActive ? 'text-[#E7B83F]' : 'text-slate-400 group-hover:text-amber-500 dark:text-[#9D958C]'
                    }`}
                  />

                  <span className={`min-w-0 flex-1 truncate text-left tracking-wide ${collapsed ? 'lg:hidden' : ''}`}>
                    {item.label}
                  </span>

                  {item.badge !== undefined && (
                    <span
                      className={`min-w-[20px] rounded-md px-1.5 py-0.5 text-center text-[10px] font-bold ${
                        isActive
                          ? 'bg-black/30 text-[#FFE29A] border border-amber-500/30'
                          : item.badgeColor || 'bg-slate-100 dark:bg-amber-500/10 dark:text-amber-300'
                      } ${collapsed ? 'lg:hidden' : ''}`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {isActive && (
                    <ChevronRight className={`h-3.5 w-3.5 shrink-0 text-[#E7B83F] ${collapsed ? 'lg:hidden' : ''}`} />
                  )}
                </button>

                {/* Tooltip for Collapsed Mode on Desktop */}
                {collapsed && (
                  <div className="pointer-events-none fixed left-20 z-50 hidden ml-2.5 -translate-y-1/2 rounded-lg border border-amber-500/25 bg-[#180D12] px-2.5 py-1.5 text-xs font-semibold text-[#F8F4EA] shadow-xl backdrop-blur-md group-hover:lg:block">
                    {item.label}
                    {item.badge !== undefined && (
                      <span className="ml-1.5 rounded-sm bg-amber-500/20 px-1 py-0.2 text-[9px] text-amber-300">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer with Super Admin Profile */}
        <div className="shrink-0 border-t border-slate-100 p-3 dark:border-amber-500/15">
          <div
            className={`flex items-center gap-3 rounded-2xl border p-2 transition-all ${
              collapsed ? 'lg:justify-center' : ''
            } border-slate-200/60 bg-slate-50/80 dark:border-amber-500/20 dark:bg-[#180D12]/80`}
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#5A0B1C] to-[#3A0712] text-xs font-bold text-[#E7B83F] shadow-sm border border-amber-500/30">
              👑
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0D0608]" />
            </div>

            <div className={`min-w-0 flex-1 ${collapsed ? 'lg:hidden' : 'flex flex-col'}`}>
              <p className="truncate text-xs font-black text-slate-800 dark:text-[#F8F4EA]">
                {currentUser?.name || 'Mirjalol Ahmadov'}
              </p>
              <p className="truncate text-[10px] text-slate-500 dark:text-[#9D958C] font-medium">
                {currentUser?.email || 'admin@lumos.uz'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsLogoutModalOpen(true)}
              title="Tizimdan chiqish"
              className={`rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:text-[#9D958C] dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors cursor-pointer ${
                collapsed ? 'lg:hidden' : ''
              }`}
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