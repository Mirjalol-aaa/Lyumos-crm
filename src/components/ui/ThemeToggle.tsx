import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

interface ThemeToggleProps {
  variant?: 'cycle' | 'segmented' | 'dropdown';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'segmented',
  className = '',
}) => {
  const { settings, updateSettings } = useCRM();
  const currentTheme = settings.theme || 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme });
    setIsOpen(false);
  };

  const cycleTheme = () => {
    const next = currentTheme === 'dark' ? 'light' : currentTheme === 'light' ? 'system' : 'dark';
    updateSettings({ theme: next });
  };

  if (variant === 'cycle') {
    return (
      <button
        type="button"
        onClick={cycleTheme}
        className={`relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/90 text-slate-700 hover:bg-slate-100 hover:border-amber-400/50 dark:border-slate-800 dark:bg-slate-900/90 dark:text-amber-400 dark:hover:bg-slate-800 shadow-xs cursor-pointer transition-all duration-200 active:scale-95 ${className}`}
        title={`Tema: ${currentTheme === 'dark' ? "Qorong'i (Dark)" : currentTheme === 'light' ? "Yorug' (Light)" : "Tizim (System)"}`}
        aria-label="Mavzuni almashtirish"
      >
        {currentTheme === 'dark' && <Moon className="h-4 w-4 text-amber-400" />}
        {currentTheme === 'light' && <Sun className="h-4 w-4 text-amber-500" />}
        {currentTheme === 'system' && <Laptop className="h-4 w-4 text-blue-400" />}
      </button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative inline-block ${className}`} ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 items-center gap-2 rounded-xl border border-slate-200/80 bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:bg-slate-800 shadow-xs transition-all cursor-pointer"
          title="Mavzuni tanlash"
        >
          {currentTheme === 'dark' && <Moon className="h-4 w-4 text-amber-400" />}
          {currentTheme === 'light' && <Sun className="h-4 w-4 text-amber-500" />}
          {currentTheme === 'system' && <Laptop className="h-4 w-4 text-blue-400" />}
          <span className="capitalize">{currentTheme}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-36 rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
            {[
              { id: 'light', label: 'Yorug‘', icon: Sun, color: 'text-amber-500' },
              { id: 'dark', label: 'Qorong‘i', icon: Moon, color: 'text-indigo-400' },
              { id: 'system', label: 'Tizim', icon: Laptop, color: 'text-blue-400' },
            ].map(({ id, label, icon: Icon, color }) => (
              <button
                key={id}
                type="button"
                onClick={() => handleSelect(id as any)}
                className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  currentTheme === id
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${color}`} />
                  <span>{label}</span>
                </div>
                {currentTheme === id && <Check className="h-3.5 w-3.5 text-amber-500" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Segmented 3-pill toggle
  return (
    <div
      className={`inline-flex items-center rounded-xl border border-slate-200/90 bg-slate-100/90 p-1 dark:border-slate-800 dark:bg-slate-900/90 ${className}`}
      role="radiogroup"
      aria-label="Mavzuni tanlash"
    >
      {[
        { id: 'light', label: 'Yorug‘', icon: Sun, title: 'Yorug‘ rejim' },
        { id: 'dark', label: 'Qorong‘i', icon: Moon, title: 'Qorong‘i rejim' },
        { id: 'system', label: 'Tizim', icon: Laptop, title: 'Tizim rejimi (Avtomatik)' },
      ].map(({ id, icon: Icon, title }) => {
        const isActive = currentTheme === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => handleSelect(id as any)}
            className={`relative flex h-8 w-8 items-center justify-center rounded-lg text-xs transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-white text-amber-600 shadow-xs dark:bg-slate-800 dark:text-amber-400 font-black'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
            title={title}
            aria-checked={isActive}
            role="radio"
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
};
