import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { useLMS } from '../../context/LMSContext';
import type { PageType } from '../../types/crm';
import { LogoutConfirmModal } from '../modals/LogoutConfirmModal';
import lumosLogoMark from '../../assets/branding/lumos-logo-mark.png';
import {
  Home,
  Building2,
  Users,
  GraduationCap,
  Layers,
  CalendarCheck,
  CreditCard,
  BarChart3,
  Settings,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

interface SidebarNavProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

interface MenuItem {
  id: PageType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const Sidebar: React.FC<SidebarNavProps> = ({
  collapsed,
  setCollapsed,
}) => {
  const { activePage, setActivePage } = useCRM();
  const { currentUser } = useLMS();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // EXACT 10 ITEMS PER USER INSTRUCTION & REFERENCE IMAGE
  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Boshqaruv paneli',
      icon: Home,
    },
    {
      id: 'branches',
      label: 'Markazlar',
      icon: Building2,
    },
    {
      id: 'credentials',
      label: 'Adminlar',
      icon: ShieldCheck,
    },
    {
      id: 'teachers',
      label: 'O‘qituvchilar',
      icon: GraduationCap,
    },
    {
      id: 'students',
      label: 'O‘quvchilar',
      icon: Users,
    },
    {
      id: 'groups',
      label: 'Guruhlar',
      icon: Layers,
    },
    {
      id: 'schedule',
      label: 'Darslar',
      icon: CalendarCheck,
    },
    {
      id: 'payments',
      label: 'To‘lovlar',
      icon: CreditCard,
    },
    {
      id: 'reports',
      label: 'Hisobot',
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

  const handleLogoClick = () => {
    window.location.hash = '#/';
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
        } border-[#3A0714] bg-[#23040C] text-[#F3D5DC] shadow-2xl overflow-hidden`}
      >
        {/* Subtle Background Watermark Feather/Leaf */}
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-72 w-72 opacity-[0.06] text-white">
          <svg viewBox="0 0 200 200" fill="currentColor">
            <path d="M40 180 C40 100, 100 40, 180 20 C180 80, 120 160, 40 180 Z" />
            <path d="M40 180 C80 140, 120 100, 180 20" stroke="currentColor" strokeWidth="4" fill="none" />
          </svg>
        </div>

        {/* Top Header: LUMOS + Hamburger */}
        <div className="flex h-20 shrink-0 items-center justify-between px-4 border-b border-white/5">
          <button
            type="button"
            onClick={handleLogoClick}
            className="flex min-w-0 items-center gap-3 overflow-hidden text-left cursor-pointer group"
            title="Asosiy sahifaga o‘tish (/)"
          >
            {/* Logo Emblem */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center p-1 group-hover:scale-105 transition-transform">
              <img
                src={lumosLogoMark}
                alt="Lumos Logo"
                className="h-full w-full object-contain filter drop-shadow-[0_2px_10px_rgba(217,166,46,0.45)]"
              />
            </div>

            {/* ONLY LUMOS Text - NO subtitle below */}
            <div className={`min-w-0 ${collapsed ? 'lg:hidden' : 'block'}`}>
              <span className="text-xl font-black tracking-wider text-[#E8B849] font-serif uppercase group-hover:text-[#F3CC70] transition-colors">
                LUMOS
              </span>
            </div>
          </button>

          {/* Desktop Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#E2C4CB] hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            title={collapsed ? 'Kengaytirish' : 'Yig‘ish'}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items (Exact 10 items) */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-none">
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
                  className={`relative flex w-full cursor-pointer items-center gap-3.5 rounded-xl px-3.5 py-3 text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#3D0A18] font-bold text-white shadow-md border border-[#5A0F24]'
                      : 'text-[#E2C4CB] hover:bg-white/5 hover:text-white'
                  } ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}
                >
                  <Icon
                    className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-[#E2C4CB] group-hover:text-white'
                    }`}
                  />

                  <span
                    className={`min-w-0 flex-1 truncate text-left tracking-wide text-[13px] ${
                      collapsed ? 'lg:hidden' : ''
                    }`}
                  >
                    {item.label}
                  </span>
                </button>

                {/* Tooltip on hover in collapsed mode */}
                {collapsed && (
                  <div className="pointer-events-none fixed left-20 z-50 hidden ml-3 -translate-y-1/2 rounded-lg border border-white/10 bg-[#1D030A] px-3 py-1.5 text-xs font-semibold text-white shadow-xl backdrop-blur-md group-hover:lg:block whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom Super Admin Profile Pill (matching reference image) */}
        <div className="shrink-0 p-3 border-t border-white/5">
          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            className={`flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-[#350815]/60 p-2.5 hover:bg-[#3D0A18] transition-all cursor-pointer text-left ${
              collapsed ? 'lg:justify-center lg:p-2' : ''
            }`}
            title="Super Admin hisobi (Chiqish)"
          >
            {/* SA Avatar Circle */}
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#520C1F] text-xs font-black text-white shadow-sm border border-white/15">
              SA
            </div>

            <div className={`min-w-0 flex-1 ${collapsed ? 'lg:hidden' : 'block'}`}>
              <p className="truncate text-xs font-bold text-white leading-tight">
                {currentUser?.name || 'Super Admin'}
              </p>
              <p className="truncate text-[11px] text-[#D8B4BC] font-normal leading-tight mt-0.5">
                {currentUser?.email || 'super@lumos.uz'}
              </p>
            </div>

            <ChevronRight className={`h-4 w-4 text-[#D8B4BC] shrink-0 ${collapsed ? 'lg:hidden' : ''}`} />
          </button>
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