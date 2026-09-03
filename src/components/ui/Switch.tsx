import React from 'react';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = '',
  icon,
}) => {
  return (
    <label
      className={`inline-flex items-center justify-between gap-3 cursor-pointer select-none ${
        disabled ? 'cursor-not-allowed opacity-50' : ''
      } ${className}`}
    >
      {(label || description) && (
        <div className="text-left">
          {label && (
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
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

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
          checked ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center text-[10px] text-slate-600 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        >
          {icon}
        </span>
      </button>
    </label>
  );
};
