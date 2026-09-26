import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  className?: string;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  maxWidth = 'lg',
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${maxWidthClasses[maxWidth]} rounded-2xl sm:rounded-3xl border border-[#E7E1D8] bg-white p-0 shadow-2xl transition-all duration-200 animate-in zoom-in-95 flex flex-col max-h-[94vh] overflow-hidden ${className}`}
      >
        {/* Header */}
        {(title || subtitle || icon) && (
          <div className="flex items-center justify-between border-b border-[#E7E1D8] p-3.5 sm:p-5 bg-[#FFFFFF]">
            <div className="flex items-center gap-2.5 sm:gap-3">
              {icon && (
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-[#F7F0E2] text-[#8A641C] border border-[#C89B3C]/30">
                  {icon}
                </div>
              )}
              <div>
                {title && (
                  <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-[#1F2937]">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-[11px] sm:text-xs text-[#667085]">{subtitle}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1.5 text-[#98A2B3] hover:bg-[#F7E9ED] hover:text-[#6F1028] transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 scrollbar-thin text-[#1F2937]">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 sm:gap-2.5 border-t border-[#E7E1D8] bg-[#F8F6F2] p-3 sm:p-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
