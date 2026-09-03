import React, { useState } from 'react';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy';
  className?: string;
}

const sizeClasses = {
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-11 w-11 text-sm',
  xl: 'h-14 w-14 text-base font-bold',
};

const statusClasses = {
  online: 'bg-emerald-500 ring-white dark:ring-slate-900',
  offline: 'bg-slate-400 ring-white dark:ring-slate-900',
  busy: 'bg-rose-500 ring-white dark:ring-slate-900',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = '',
  size = 'md',
  status,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const getInitials = (n: string) => {
    if (!n) return '?';
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  return (
    <div className="relative inline-flex shrink-0">
      {src && !imgError ? (
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          className={`rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 ${sizeClasses[size]} ${className}`}
        />
      ) : (
        <div
          className={`flex items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 font-bold text-white shadow-xs ${sizeClasses[size]} ${className}`}
        >
          {getInitials(name)}
        </div>
      )}

      {status && (
        <span
          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ${statusClasses[status]}`}
        />
      )}
    </div>
  );
};
