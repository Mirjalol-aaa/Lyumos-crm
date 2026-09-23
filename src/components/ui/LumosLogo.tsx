import React from 'react';
import lumosLogoMark from '../../assets/branding/lumos-logo-mark.png';
import lumosLogoFull from '../../assets/branding/lumos-logo.png';

interface LumosLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'horizontal' | 'mark' | 'full';
  showSubtitle?: boolean;
}

export const LumosLogo: React.FC<LumosLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'horizontal',
  showSubtitle = true,
}) => {
  // If full image lockup is requested
  if (variant === 'full') {
    const fullSizeMap = {
      sm: 'h-9',
      md: 'h-12 sm:h-14',
      lg: 'h-16 sm:h-20',
      xl: 'h-24 sm:h-28',
    };
    return (
      <div className={`relative group/logo select-none inline-flex items-center justify-center ${className}`}>
        <img
          src={lumosLogoFull}
          alt="LUMOS Bilim — kelajak"
          className={`${fullSizeMap[size]} w-auto object-contain drop-shadow-[0_4px_16px_rgba(226,172,80,0.35)] group-hover:brightness-110 transition-all duration-500`}
        />
      </div>
    );
  }

  // Size mapping for mark and typography
  const markSizeMap = {
    sm: 'h-7 w-7',
    md: 'h-10 w-10 sm:h-11 sm:w-11',
    lg: 'h-13 w-13 sm:h-14 sm:w-14',
    xl: 'h-18 w-18',
  };

  const titleSizeStyle = {
    sm: '1.2rem',
    md: '1.45rem',
    lg: '1.9rem',
    xl: '2.5rem',
  };

  const subtitleSizeStyle = {
    sm: '9.5px',
    md: '11px',
    lg: '13.5px',
    xl: '16.5px',
  };

  // If mark only is requested
  if (variant === 'mark') {
    return (
      <div className={`relative group/logo select-none inline-flex items-center justify-center ${className}`}>
        <div
          className="absolute -inset-2 rounded-full bg-radial from-[#F2BA45]/30 via-[#D99326]/15 to-transparent blur-md opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500 pointer-events-none"
          aria-hidden="true"
        />
        <img
          src={lumosLogoMark}
          alt="LUMOS Emblem"
          className={`${markSizeMap[size]} object-contain drop-shadow-[0_2px_10px_rgba(226,172,80,0.4)] group-hover/logo:drop-shadow-[0_0_18px_rgba(242,186,69,0.7)] group-hover/logo:scale-105 group-hover/logo:brightness-110 transition-all duration-500`}
        />
      </div>
    );
  }

  // Default: Horizontal Lockup (Official Golden Flame Emblem + Clean LUMOS / Bilim — kelajak)
  return (
    <div
      className={`relative group/logo cursor-pointer flex items-center gap-2.5 sm:gap-3 select-none transition-transform duration-500 ease-out hover:scale-[1.02] ${className}`}
    >
      {/* Soft Ambient Radial Halo on Hover */}
      <div
        className="absolute -left-2 -top-2 w-16 h-16 rounded-full bg-radial from-[#F2BA45]/35 via-[#D99326]/15 to-transparent blur-xl opacity-0 group-hover/logo:opacity-100 transition-opacity duration-700 pointer-events-none"
        aria-hidden="true"
      />

      {/* Official Golden Flame Emblem Mark */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          className={`${markSizeMap[size]} object-contain drop-shadow-[0_2px_10px_rgba(226,172,80,0.45)] group-hover/logo:drop-shadow-[0_0_20px_rgba(242,186,69,0.75)] group-hover/logo:scale-105 group-hover/logo:brightness-110 transition-all duration-500`}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="flameHaloInline" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F2BA45" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#D99326" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#B86C10" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="flameGrad1Inline" x1="15%" y1="90%" x2="52%" y2="8%">
              <stop offset="0%" stopColor="#C57E1E" />
              <stop offset="25%" stopColor="#E29C28" />
              <stop offset="55%" stopColor="#F5C450" />
              <stop offset="85%" stopColor="#FDE58B" />
              <stop offset="100%" stopColor="#FFF9E0" />
            </linearGradient>

            <linearGradient id="flameGrad2Inline" x1="28%" y1="88%" x2="72%" y2="22%">
              <stop offset="0%" stopColor="#B56E14" />
              <stop offset="30%" stopColor="#D99122" />
              <stop offset="65%" stopColor="#F2BF46" />
              <stop offset="90%" stopColor="#FDDF7E" />
              <stop offset="100%" stopColor="#FFF7D8" />
            </linearGradient>

            <linearGradient id="flameGrad3Inline" x1="38%" y1="90%" x2="84%" y2="38%">
              <stop offset="0%" stopColor="#A55E0C" />
              <stop offset="35%" stopColor="#CF851A" />
              <stop offset="70%" stopColor="#EBAF3A" />
              <stop offset="92%" stopColor="#FBD873" />
              <stop offset="100%" stopColor="#FFF0B2" />
            </linearGradient>

            <filter id="flameGlowInline" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#EAA62B" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* Ambient Glow */}
          <circle cx="50" cy="50" r="46" fill="url(#flameHaloInline)" />

          <g filter="url(#flameGlowInline)">
            {/* 1. Left Primary Flame Petal */}
            <path
              d="M 33 89 C 16 72 13 46 25 26 C 31 16 41 9 52 7 C 51 17 43 27 38.5 41 C 34 56 34 74 33 89 Z"
              fill="url(#flameGrad1Inline)"
            />
            {/* 2. Middle Swirling Flame Petal */}
            <path
              d="M 37 84 C 40 64 50 42 72 23 C 71 36 62 54 50 72 C 46 78 41 82 37 84 Z"
              fill="url(#flameGrad2Inline)"
            />
            {/* 3. Right Swirling Flame Petal */}
            <path
              d="M 43 87 C 52 74 66 56 84 40 C 80 56 70 72 52 83 C 48 85 45 86 43 87 Z"
              fill="url(#flameGrad3Inline)"
            />
          </g>
        </svg>
      </div>

      {/* Modern Typography Exactly Matching Reference (LUMOS + Bilim — kelajak) */}
      <div className="relative overflow-hidden flex flex-col justify-center text-left py-0.5">
        <span
          className="font-sans font-black tracking-[0.04em] leading-none text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] group-hover/logo:text-white transition-colors duration-300"
          style={{ fontSize: titleSizeStyle[size] }}
        >
          LUMOS
        </span>

        {showSubtitle && (
          <span
            className="font-sans font-semibold tracking-[0.02em] text-[#DFA94E] mt-1 drop-shadow-xs group-hover/logo:text-[#F7CF76] transition-colors duration-300"
            style={{ fontSize: subtitleSizeStyle[size] }}
          >
            Bilim — kelajak
          </span>
        )}

        {/* Light Sweep Sheen on Hover */}
        <div
          className="absolute inset-0 -translate-x-[120%] group-hover/logo:translate-x-[160%] transition-transform duration-700 ease-out pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default LumosLogo;
