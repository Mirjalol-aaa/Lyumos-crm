import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = '',
}) => {
  return (
    <label
      className={`inline-flex items-start gap-2.5 cursor-pointer select-none ${
        disabled ? 'cursor-not-allowed opacity-50' : ''
      } ${className}`}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-md border transition-all mt-0.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
          checked
            ? 'bg-amber-500 border-amber-500 text-white shadow-xs'
            : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800'
        }`}
      >
        {checked && <Check className="h-3 w-3 stroke-[3]" />}
      </button>

      {(label || description) && (
        <div className="text-left">
          {label && (
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200 block">
              {label}
            </span>
          )}
          {description && (
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
};
