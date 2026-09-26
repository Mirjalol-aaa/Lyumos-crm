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
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7E1D8] bg-white text-[#667085] shadow-xs transition-all hover:border-[#6F1028]/30 hover:bg-[#F7E9ED] hover:text-[#6F1028] cursor-pointer"
      >
        <Icon className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } z-50 mt-1.5 w-48 origin-top-right rounded-xl border border-[#E7E1D8] bg-white p-1.5 shadow-xl shadow-black/5 backdrop-blur-xl`}
        >
          {items.map((item, idx) => {
            const ItemIcon = item.icon;
            const isDanger = item.variant === 'danger';
            const isWarning = item.variant === 'warning';
            const isSuccess = item.variant === 'success';

            let itemColorClasses =
              'text-[#1F2937] hover:bg-[#F7E9ED] hover:text-[#6F1028]';
            if (isDanger) {
              itemColorClasses =
                'text-[#C0392B] hover:bg-[#FDECEC] hover:text-[#C0392B]';
            } else if (isWarning) {
              itemColorClasses =
                'text-[#8A641C] hover:bg-[#F7F0E2] hover:text-[#8A641C]';
            } else if (isSuccess) {
              itemColorClasses =
                'text-[#16A36A] hover:bg-[#E8F7F0] hover:text-[#16A36A]';
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
