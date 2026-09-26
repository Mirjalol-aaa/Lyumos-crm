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
      <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 backdrop-blur-md transition-colors">
        {/* Left Side: Search input (exact match with reference image) */}
        <div className="flex-1 max-w-md">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
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
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 shadow-2xs focus:border-[#5A0B1C] focus:outline-hidden focus:ring-1 focus:ring-[#5A0B1C] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Bildirishnomalar"
          >
            <Bell className="h-5 w-5 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {/* Super Admin Profile Pill & Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-3 rounded-xl p-1.5 hover:bg-slate-100/80 transition-all cursor-pointer"
            >
              {/* SA Avatar Circle */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#520C1F] text-xs font-bold text-white shadow-xs">
                SA
              </div>

              {/* User text */}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser?.name || 'Super Admin'}
                </span>
                <span className="text-[11px] text-slate-400 leading-tight mt-0.5">
                  {currentUser?.email || 'super@lumos.uz'}
                </span>
              </div>

              <ChevronDown className="h-4 w-4 text-slate-400 ml-0.5" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">
                    {currentUser?.name || 'Super Admin'}
                  </p>
                  <p className="text-[11px] text-slate-400">
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
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <User className="h-3.5 w-3.5 text-slate-500" />
                    Profil
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActivePage('settings');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Settings className="h-3.5 w-3.5 text-slate-500" />
                    Sozlamalar
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      setIsLogoutModalOpen(true);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5 text-rose-500" />
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