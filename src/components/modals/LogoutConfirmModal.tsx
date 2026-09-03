import React from 'react';
import { LogOut, X, AlertTriangle } from 'lucide-react';
import { useLMS } from '../../context/LMSContext';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, logout } = useLMS();

  if (!isOpen) return null;

  const handleConfirm = () => {
    onClose();
    logout();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 shadow-sm">
            <LogOut className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Tizimdan chiqish
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Hurmatli <span className="font-bold text-slate-800 dark:text-slate-200">{currentUser?.name || 'Foydalanuvchi'}</span>, haqiqatan ham tizimdan chiqmoqchimisiz?
            </p>
          </div>
        </div>

        {/* Session alert box */}
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-3.5 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
          <span>Barcha saqlanmagan o‘zgarishlar yakunlanadi va login oynasiga yo‘naltirilasiz.</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-600/25 transition-all active:scale-[0.98] flex items-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Ha, chiqish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
