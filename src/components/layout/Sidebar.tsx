import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { PageType } from '../../types/crm';
import { 
  LayoutDashboard, Users, CreditCard, CalendarCheck2, 
  GraduationCap, BookOpen, BarChart3, Receipt, Settings, 
  Sparkles, ChevronRight
} from 'lucide-react';

interface SidebarNavProps {
  collapsed: boolean;
  setCollapsed: (col: boolean) => void;
}

export const Sidebar: React.FC<SidebarNavProps> = ({ collapsed }) => {
  const { activePage, setActivePage, notifications, students, settings } = useCRM();

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const overdueCount = students.filter(s => 
    Object.values(s.payments).some((p: any) => p.status === 'Overdue')
  ).length;

  const navItems: { id: PageType; label: string; icon: React.FC<{ className?: string }>; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users, badge: students.length, badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
    { id: 'payments', label: 'Payments', icon: CreditCard, badge: overdueCount > 0 ? overdueCount : undefined, badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300' },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck2 },
    { id: 'teachers', label: 'Teachers', icon: GraduationCap },
    { id: 'groups', label: 'Groups', icon: BookOpen },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`relative z-20 flex flex-col h-screen transition-all duration-300 ease-out border-r border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shrink-0 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-18 px-5 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#007AFF] to-[#34C759] p-[2px] shadow-lg shadow-blue-500/20 shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#007AFF]" />
            </div>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                LYUMOS <span className="text-[10px] uppercase tracking-wider font-bold bg-[#007AFF]/10 text-[#007AFF] px-1.5 py-0.5 rounded-full">CRM</span>
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 truncate max-w-[140px]">
                {settings.centerName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
        {!collapsed && (
          <p className="px-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            Main Menu
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`group relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#007AFF] text-white shadow-lg shadow-[#007AFF]/25 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-[#007AFF]'
              }`} />
              
              {!collapsed && (
                <span className="flex-1 text-left truncate tracking-tight">{item.label}</span>
              )}

              {!collapsed && item.badge !== undefined && (
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                  isActive ? 'bg-white/20 text-white' : item.badgeColor
                }`}>
                  {item.badge}
                </span>
              )}

              {isActive && !collapsed && (
                <ChevronRight className="w-4 h-4 text-white/80 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Profile / Status */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/60">
        <div className={`flex items-center gap-3 p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 ${
          collapsed ? 'justify-center' : ''
        }`}>
          <div className="relative shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" 
              alt="Admin User"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#007AFF]/30" 
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
          </div>

          {!collapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-800 dark:text-white truncate">
                Sarah Jenkins
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Super Admin
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
