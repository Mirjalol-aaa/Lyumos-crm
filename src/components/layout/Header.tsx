import React, { useState, useRef, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { useLMS } from '../../context/LMSContext';
import { LogoutConfirmModal } from '../modals/LogoutConfirmModal';
import {
  Search,
  Bell,
  Building2,
  ChevronDown,
  Menu,
  Sun,
  Moon,
  LogOut,
  Settings,
  Shield,
  Check,
} from 'lucide-react';

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenNotifications: () => void;
}

const PAGE_NAMES: Record<string, string> = {
  dashboard: 'Dashboard',
  branches: 'Markazlar Tarmog‘i',
  credentials: 'Adminlar Boshqaruvi',
  teachers: 'O‘qituvchilar',
  students: 'O‘quvchilar Bazasi',
  groups: 'Guruhlar',
  payments: 'To‘lovlar & Moliya',
  reports: 'Tahliliy Hisobotlar',
  settings: 'Tizim Sozlamalari',
  teachers_workload: 'O‘qituvchilar & Yuklama',
  courses_groups: 'Guruhlar & Kurslar',
  students_hub: 'O‘quvchilar Markazi',
  finance_payroll: 'Moliya & To‘lovlar',
  audit_settings: 'Rollar & Audit',
  schedule: 'Dars Jadvali',
  homework: 'Uy Vazifalari',
  grades: 'Baholar',
  applications: 'Arizalar',
  expenses: 'Xarajatlar',
};

export const Header: React.FC<HeaderProps> = ({
  collapsed,
  setCollapsed,
  onOpenNotifications,
}) => {
  const {
    activePage,
    setActivePage,
    setIsGlobalSearchOpen,
    notifications,
    branches,
    selectedBranchFilter,
    setSelectedBranchFilter,
    settings,
    updateSettings,
  } = useCRM();

  const { currentUser } = useLMS();

  // Dropdown states
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const branchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsGlobalSearchOpen]);

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (branchRef.current && !branchRef.current.contains(event.target as Node)) {
        setIsBranchDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: newTheme });
  };

  const selectedBranchName =
    selectedBranchFilter === 'all'
      ? 'Barcha Markazlar (Tarmoq)'
      : branches.find((b) => b.id === selectedBranchFilter)?.name || 'Barcha Markazlar';

  const pageTitle = PAGE_NAMES[activePage] || 'Boshqaruv Paneli';

  return (
    <>
      <header className="sticky top-0 z-30 flex h-18 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-xl transition-colors dark:border-amber-500/15 dark:bg-[#0D0608]/90 sm:px-6">
        {/* Left Side: Mobile Menu Button & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-[#9D958C] dark:hover:bg-amber-500/10 dark:hover:text-[#E7B83F] lg:hidden"
            aria-label="Menyu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 dark:text-[#9D958C]">
              <span>Lumos Super Admin</span>
              <span className="text-slate-300 dark:text-amber-500/40">/</span>
              <span className="text-amber-600 dark:text-[#E7B83F] font-bold">{pageTitle}</span>
            </div>
            <h1 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-[#F8F4EA] sm:text-base">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Right Side: Branch Filter, Search, Notifications, Theme, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Branch Filter Switcher */}
          <div className="relative" ref={branchRef}>
            <button
              type="button"
              onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
              className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/70 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-amber-500/30 hover:bg-amber-50/40 dark:border-amber-500/20 dark:bg-[#180D12]/80 dark:text-[#D8D0C5] dark:hover:border-amber-500/40 dark:hover:bg-amber-500/10 transition-all cursor-pointer"
              title="Markazni tanlash"
            >
              <Building2 className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <span className="max-w-[130px] truncate sm:max-w-[180px]">{selectedBranchName}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 dark:text-amber-500/60" />
            </button>

            {isBranchDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-slate-200/80 bg-white/95 p-1.5 shadow-2xl backdrop-blur-xl dark:border-amber-500/25 dark:bg-[#1A0E14]/98 dark:shadow-black/70 z-50">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-amber-500/15">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-amber-500/60">
                    Markazni Filtrlash
                  </p>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBranchFilter('all');
                      setIsBranchDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      selectedBranchFilter === 'all'
                        ? 'bg-amber-500/15 text-amber-600 dark:text-[#E7B83F] font-bold'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-[#D8D0C5] dark:hover:bg-amber-500/10'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-amber-500" />
                      Barcha Markazlar (Tarmoq)
                    </span>
                    {selectedBranchFilter === 'all' && <Check className="h-4 w-4 text-[#E7B83F]" />}
                  </button>

                  {branches.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setSelectedBranchFilter(b.id);
                        setIsBranchDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                        selectedBranchFilter === b.id
                          ? 'bg-amber-500/15 text-amber-600 dark:text-[#E7B83F] font-bold'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-[#D8D0C5] dark:hover:bg-amber-500/10'
                      }`}
                    >
                      <div className="flex flex-col text-left">
                        <span className="truncate">{b.name}</span>
                        <span className="text-[10px] text-slate-400 dark:text-[#9D958C] font-normal">
                          {b.city} • {b.studentCount} o‘quvchi
                        </span>
                      </div>
                      {selectedBranchFilter === b.id && <Check className="h-4 w-4 text-[#E7B83F] shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Compact Search Trigger */}
          <button
            type="button"
            onClick={() => setIsGlobalSearchOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/70 px-2.5 py-1.5 text-xs text-slate-500 shadow-2xs hover:border-amber-500/30 hover:bg-slate-100 dark:border-amber-500/20 dark:bg-[#180D12]/80 dark:text-[#9D958C] dark:hover:border-amber-500/40 dark:hover:bg-amber-500/10 transition-all cursor-pointer"
            title="Qidirish (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5 text-amber-500" />
            <span className="hidden md:inline text-xs font-medium">Qidiruv...</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-slate-200 px-1 py-0.5 text-[9px] font-mono font-bold text-slate-400 dark:border-amber-500/30 dark:bg-black/30 dark:text-amber-400/80">
              Ctrl K
            </kbd>
          </button>

          {/* Notifications Trigger */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/70 text-slate-600 hover:border-amber-500/30 hover:bg-slate-100 dark:border-amber-500/20 dark:bg-[#180D12]/80 dark:text-[#D8D0C5] dark:hover:border-amber-500/40 dark:hover:bg-amber-500/10 transition-all cursor-pointer"
            title="Bildirishnomalar"
          >
            <Bell className="h-4 w-4 text-slate-600 dark:text-[#D8D0C5]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white ring-2 ring-white dark:ring-[#0D0608]">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Discreet Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50/70 text-slate-500 hover:border-amber-500/30 hover:bg-slate-100 dark:border-amber-500/20 dark:bg-[#180D12]/80 dark:text-[#D8D0C5] dark:hover:border-amber-500/40 dark:hover:bg-amber-500/10 transition-all cursor-pointer"
            title={settings.theme === 'dark' ? 'Yorug‘ rejim' : 'Qorong‘i rejim'}
          >
            {settings.theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
          </button>

          {/* Super Admin Profile Pill & Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/70 p-1 pr-2 hover:border-amber-500/30 dark:border-amber-500/20 dark:bg-[#180D12]/80 dark:hover:border-amber-500/40 transition-all cursor-pointer"
            >
              <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-[#5A0B1C] to-[#3A0712] text-[11px] font-bold text-[#E7B83F] border border-amber-500/30">
                👑
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-black text-slate-800 dark:text-[#F8F4EA] leading-tight">
                  {currentUser?.name || 'Mirjalol Ahmadov'}
                </span>
                <span className="text-[9px] font-semibold text-amber-600 dark:text-[#E7B83F] leading-tight">
                  Super Admin
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 dark:text-amber-500/60" />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-slate-200/80 bg-white/95 p-1.5 shadow-2xl backdrop-blur-xl dark:border-amber-500/25 dark:bg-[#1A0E14]/98 dark:shadow-black/70 z-50">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-amber-500/15">
                  <p className="text-xs font-bold text-slate-900 dark:text-[#F8F4EA]">
                    {currentUser?.name || 'Mirjalol Ahmadov'}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-[#9D958C]">
                    {currentUser?.email || 'admin@lumos.uz'}
                  </p>
                  <div className="mt-1 inline-flex items-center gap-1 rounded bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-600 dark:text-[#E7B83F]">
                    <Shield className="h-2.5 w-2.5" /> Super Admin
                  </div>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActivePage('settings');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-[#D8D0C5] dark:hover:bg-amber-500/10 dark:hover:text-white transition-colors"
                  >
                    <Settings className="h-3.5 w-3.5 text-slate-400 dark:text-[#9D958C]" />
                    Sozlamalar
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      setIsLogoutModalOpen(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5 text-rose-500" />
                    Tizimdan chiqish
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
};