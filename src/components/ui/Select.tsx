import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, children, className = '', id, required, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-bold text-[#1F2937] tracking-tight"
          >
            {label} {required && <span className="text-[#C0392B] font-black">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            required={required}
            className={`h-10 w-full appearance-none rounded-xl border bg-white px-3.5 py-2 pr-9.5 text-xs text-[#1F2937] shadow-2xs transition-all duration-150 hover:bg-[#FCF8F5] focus:bg-white focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 ${
              error
                ? 'border-[#C0392B] focus:border-[#C0392B] focus:ring-[#C0392B]/20'
                : 'border-[#E7E1D8] focus:border-[#6F1028] focus:ring-[#6F1028]'
            } ${className}`}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="pointer-events-none absolute right-3 flex items-center justify-center text-[#667085]">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>

        {error ? (
          <p className="text-[11px] font-semibold text-[#C0392B] tracking-tight">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-[#667085]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
