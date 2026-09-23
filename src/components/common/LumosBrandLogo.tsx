import React, { useState } from 'react';
import lumosLogoMark from '../../assets/branding/lumos-logo-mark.png';

interface LumosBrandLogoProps {
  className?: string;
  imgClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
}

export const LumosBrandLogo: React.FC<LumosBrandLogoProps> = ({
  className = '',
  imgClassName = '',
  size = 'md',
  showBadge = false,
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-7 h-7 rounded-xl p-0.5',
    md: 'w-11 h-11 rounded-2xl p-1',
    lg: 'w-16 h-16 rounded-2xl p-1.5',
    xl: 'w-24 h-24 rounded-3xl p-2.5',
  };

  return (
    <div
      className={`relative flex items-center justify-center bg-gradient-to-tr from-amber-500/20 via-yellow-500/10 to-amber-300/20 border border-amber-400/30 shadow-md shadow-amber-500/15 shrink-0 select-none overflow-hidden ${sizeClasses[size]} ${className}`}
    >
      {!hasError ? (
        <img
          src={lumosLogoMark}
          alt="LUMOS Emblem"
          onError={() => setHasError(true)}
          className={`h-full w-full object-contain filter drop-shadow-[0_2px_8px_rgba(217,166,46,0.35)] transition-transform duration-300 ${imgClassName}`}
        />
      ) : (
        <div className="flex items-center justify-center font-black text-amber-500 font-serif tracking-wider select-none text-xs">
          L
        </div>
      )}

      {showBadge && (
        <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-900" />
        </span>
      )}
    </div>
  );
};

export default LumosBrandLogo;
