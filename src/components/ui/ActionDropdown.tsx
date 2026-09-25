import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, MoreVertical } from 'lucide-react';

export interface ActionDropdownItem {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'default' | 'danger' | 'warning' | 'success';
  disabled?: boolean;
}

export interface ActionDropdownProps {
  items: ActionDropdownItem[];
  direction?: 'horizontal' | 'vertical';
  align?: 'left' | 'right';
  className?: string;
  triggerAriaLabel?: string;
}

export const ActionDropdown: React.FC<ActionDropdownProps> = ({
  items,
  direction = 'horizontal',
  align = 'right',
  className = '',
  triggerAriaLabel = 'Amallar menyusi',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const Icon = direction === 'horizontal' ? MoreHorizontal : MoreVertical;

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        aria-label={triggerAriaLabel}
        aria-expanded={isOpen}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/70 bg-white/80 text-slate-500 shadow-xs transition-all hover:border-amber-400/40 hover:bg-amber-50/50 hover:text-amber-700 dark:border-amber-500/20 dark:bg-[#1A0E14]/90 dark:text-slate-400 dark:hover:border-amber-500/40 dark:hover:bg-amber-500/10 dark:hover:text-amber-300"
      >
        <Icon className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } z-50 mt-1.5 w-44 origin-top-right rounded-xl border border-slate-200/80 bg-white/95 p-1.5 shadow-xl shadow-slate-900/10 backdrop-blur-xl dark:border-amber-500/20 dark:bg-[#1A0E14]/95 dark:shadow-black/50`}
        >
          {items.map((item, idx) => {
            const ItemIcon = item.icon;
            const isDanger = item.variant === 'danger';
            const isWarning = item.variant === 'warning';
            const isSuccess = item.variant === 'success';

            let itemColorClasses =
              'text-slate-700 hover:bg-slate-100 dark:text-[#D8D0C5] dark:hover:bg-amber-500/10 dark:hover:text-white';
            if (isDanger) {
              itemColorClasses =
                'text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-300';
            } else if (isWarning) {
              itemColorClasses =
                'text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/40 dark:hover:text-amber-300';
            } else if (isSuccess) {
              itemColorClasses =
                'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300';
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={item.disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  item.onClick();
                }}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition-all ${itemColorClasses} ${
                  item.disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'
                }`}
              >
                {ItemIcon && <ItemIcon className="h-3.5 w-3.5 shrink-0" />}
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
