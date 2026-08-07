import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { X, Bell, CheckCheck, Trash2, DollarSign, User, Cake, Calendar } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, clearAllNotifications, setActivePage, setSelectedStudentId } = useCRM();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <DollarSign className="w-4 h-4 text-emerald-500" />;
      case 'student':
        return <User className="w-4 h-4 text-[#007AFF]" />;
      case 'birthday':
        return <Cake className="w-4 h-4 text-amber-500" />;
      case 'attendance':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200/80 dark:border-slate-800 flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-[#007AFF] flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Notifications</h2>
                <p className="text-xs text-slate-400">Updates & activity alerts</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={clearAllNotifications}
                className="p-2 text-xs font-medium text-slate-400 hover:text-rose-500 transition-colors"
                title="Clear all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5 scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center text-slate-400">
                <CheckCheck className="w-10 h-10 mb-2 opacity-50 text-emerald-500" />
                <p className="text-sm font-semibold">All caught up!</p>
                <p className="text-xs">No pending notifications at this moment.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markNotificationRead(n.id);
                    if (n.linkTo) {
                      setActivePage(n.linkTo.page);
                      if (n.linkTo.id) setSelectedStudentId(n.linkTo.id);
                    }
                    onClose();
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    !n.read 
                      ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200/80 dark:border-blue-900/50 shadow-xs' 
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
                  }`}
                >
                  {!n.read && (
                    <span className="absolute top-4 right-4 w-2 h-2 bg-[#007AFF] rounded-full" />
                  )}
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 pr-3">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {n.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                        {n.message}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-2 block font-medium">
                        {n.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
