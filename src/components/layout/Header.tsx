import React, { useState, useRef, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { useLMS } from '../../context/LMSContext';
import { LogoutConfirmModal } from '../modals/LogoutConfirmModal';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  X,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  collapsed,
  setCollapsed,
  onOpenNotifications,
}) => {
  const {
    searchQuery,
    setSearchQuery,
    setIsGlobalSearchOpen,
    notifications,
    setActivePage,
  } = useCRM();

  const { currentUser } = useLMS();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Global search shortcut Ctrl+K
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsGlobalSearchOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between gap-2 sm:gap-4 border-b border-[#E7E1D8] bg-[#FFFFFF] px-3 sm:px-6 transition-colors">
        {/* Left Side: Mobile Hamburger & Search input */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-md min-w-0">
          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#1F2937] hover:bg-[#F8F6F2] lg:hidden cursor-pointer"
            aria-label="Menyu ochish"
          >
            <Menu className="h-5 w-5" />
          </button>

          <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#667085] pointer-events-none" />
            <input
              type="text"
              placeholder="Qidiruv..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim().length > 1) {
                  setIsGlobalSearchOpen(true);
                }
              }}
              className="w-full rounded-xl border border-[#E7E1D8] bg-[#FFFFFF] py-2 pl-10 pr-4 text-xs text-[#1F2937] placeholder-[#98A2B3] shadow-xs focus:border-[#6F1028] focus:outline-none focus:ring-1 focus:ring-[#6F1028] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#1F2937]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </form>
        </div>

        {/* Right Side: Notification Bell & Super Admin Profile (reference image) */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-[#667085] hover:bg-[#F8F6F2] transition-colors cursor-pointer"
            title="Bildirishnomalar"
          >
            <Bell className="h-5 w-5 text-[#667085]" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-[#C0392B] ring-2 ring-white" />
            )}
          </button>

          {/* Super Admin Profile Pill & Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-[#F8F6F2] transition-all cursor-pointer"
            >
              {/* SA Avatar Circle */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6F1028] text-xs font-bold text-white shadow-xs">
                SA
              </div>

              {/* User text */}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-[#1F2937] leading-tight">
                  {currentUser?.name || 'Super Admin'}
                </span>
                <span className="text-[11px] text-[#667085] leading-tight mt-0.5">
                  {currentUser?.email || 'super@lumos.uz'}
                </span>
              </div>

              <ChevronDown className="h-4 w-4 text-[#98A2B3] ml-0.5" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-[#E7E1D8] bg-[#FFFFFF] p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-[#E7E1D8]">
                  <p className="text-xs font-bold text-[#1F2937]">
                    {currentUser?.name || 'Super Admin'}
                  </p>
                  <p className="text-[11px] text-[#667085]">
                    {currentUser?.email || 'super@lumos.uz'}
                  </p>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActivePage('settings');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#1F2937] hover:bg-[#F7E9ED] hover:text-[#6F1028] transition-colors"
                  >
                    <User className="h-3.5 w-3.5 text-[#667085]" />
                    Profil
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActivePage('settings');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#1F2937] hover:bg-[#F7E9ED] hover:text-[#6F1028] transition-colors"
                  >
                    <Settings className="h-3.5 w-3.5 text-[#667085]" />
                    Sozlamalar
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      setIsLogoutModalOpen(true);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#C0392B] hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5 text-[#C0392B]" />
                    Chiqish
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