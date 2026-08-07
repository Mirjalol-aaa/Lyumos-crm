import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { 
  Search, Bell, Plus, DollarSign, PanelLeft, Sun, Moon, 
  Globe, Command, Check
} from 'lucide-react';

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: (fn: (prev: boolean) => boolean) => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ collapsed, setCollapsed, onOpenNotifications }) => {
  const { 
    setIsGlobalSearchOpen, 
    notifications, 
    setIsAddStudentModalOpen, 
    setIsReceivePaymentModalOpen,
    settings,
    updateSettings,
    activePage
  } = useCRM();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const pageTitles: Record<string, string> = {
    dashboard: 'Dashboard Overview',
    students: 'Students Directory',
    payments: 'Payments & Fee Matrix',
    attendance: 'Attendance Tracker',
    teachers: 'Teachers & Faculty',
    groups: 'Study Groups',
    reports: 'Analytics & Financial Reports',
    expenses: 'Center Expenses',
    settings: 'System Preferences'
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-18 px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 transition-colors">
      {/* Left: Collapse Toggle & Active Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCollapsed(prev => !prev)}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex flex-col">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {pageTitles[activePage] || 'LYUMOS CRM'}
          </h1>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Academic Year {settings.academicYear} • {settings.centerName}
          </span>
        </div>
      </div>

      {/* Middle: Global Search Trigger */}
      <div className="flex-1 max-w-md mx-4">
        <button
          onClick={() => setIsGlobalSearchOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-slate-400 dark:text-slate-500 text-sm hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all group"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-[#007AFF] transition-colors" />
          <span className="flex-1 text-left font-normal truncate">
            Search 150+ students, teachers, groups...
          </span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-semibold text-slate-400 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-700 shadow-xs">
            <Command className="w-3 h-3" /> K
          </kbd>
        </button>
      </div>

      {/* Right: Quick Action Buttons & Controls */}
      <div className="flex items-center gap-2.5">
        {/* Quick Actions */}
        <button
          onClick={() => setIsReceivePaymentModalOpen(true)}
          className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
        >
          <DollarSign className="w-4 h-4" />
          <span>Receive Payment</span>
        </button>

        <button
          onClick={() => setIsAddStudentModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#007AFF] hover:bg-blue-600 text-white text-xs font-semibold shadow-md shadow-[#007AFF]/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Student</span>
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* Notifications Icon */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2.5 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
          )}
        </button>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="p-2.5 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
            title="Switch Language"
          >
            <Globe className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">{settings.language}</span>
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-36 py-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in zoom-in-95">
              {[
                { code: 'en', label: 'English' },
                { code: 'uz', label: "O'zbekcha" },
                { code: 'ru', label: 'Русский' }
              ].map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    updateSettings({ language: lang.code as any });
                    setLangMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-xs font-medium text-left flex items-center justify-between text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <span>{lang.label}</span>
                  {settings.language === lang.code && <Check className="w-4 h-4 text-[#007AFF]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
          className="p-2.5 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {settings.theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>
      </div>
    </header>
  );
};
