import React from 'react';

interface LumosLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LumosLogo: React.FC<LumosLogoProps> = ({ className = '', size = 'md' }) => {
  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Golden Sunburst & Book Emblem */}
      <svg
        className={`${
          size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-13 w-13' : 'h-10 w-10 sm:h-11 sm:w-11'
        } shrink-0 drop-shadow-[0_2px_10px_rgba(217,168,63,0.35)]`}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lumosGoldSunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2C6" />
            <stop offset="35%" stopColor="#F4D27A" />
            <stop offset="100%" stopColor="#D9A83F" />
          </linearGradient>
          <filter id="goldGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Radiating Sunburst Rays */}
        <g stroke="url(#lumosGoldSunGrad)" strokeWidth="2.2" strokeLinecap="round" filter="url(#goldGlowFilter)">
          <line x1="32" y1="5" x2="32" y2="18" />
          <line x1="23" y1="8" x2="26" y2="20" />
          <line x1="41" y1="8" x2="38" y2="20" />
          <line x1="14" y1="14" x2="20" y2="24" />
          <line x1="50" y1="14" x2="44" y2="24" />
          <line x1="8" y1="23" x2="17" y2="29" />
          <line x1="56" y1="23" x2="47" y2="29" />
          <line x1="6" y1="33" x2="16" y2="35" />
          <line x1="58" y1="33" x2="48" y2="35" />
        </g>

        {/* Central Sun Halo Arc */}
        <path
          d="M21 34 C21 26, 43 26, 43 34"
          fill="none"
          stroke="url(#lumosGoldSunGrad)"
          strokeWidth="2.2"
        />

        {/* Open Book Wings at the Base */}
        <path
          d="M32 37 L15 32 C13 32, 11 34, 11 36 L11 49 C11 50.5, 13 51.5, 15 50.5 L32 46 L49 50.5 C51 51.5, 53 50.5, 53 49 L53 36 C53 34, 51 32, 49 32 Z"
          fill="url(#lumosGoldSunGrad)"
        />
        {/* Book spine line & page fold highlights */}
        <line x1="32" y1="37" x2="32" y2="52" stroke="#0B0808" strokeWidth="2.2" strokeLinecap="round" />
        <path
          d="M15 37 C21 39, 27 38.5, 32 40.5 C37 38.5, 43 39, 49 37"
          stroke="#0B0808"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Typography */}
      <div className="flex flex-col justify-center text-left">
        <span
          className="font-luxury-display font-black tracking-[0.16em] leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#FFF2C6] via-[#F4D27A] to-[#D9A83F] drop-shadow-sm"
          style={{ fontSize: size === 'sm' ? '1.15rem' : size === 'lg' ? '1.85rem' : '1.38rem' }}
        >
          LUMOS
        </span>
        <span
          className="font-sans font-bold tracking-[0.24em] text-[#D9A83F] uppercase mt-1 drop-shadow-xs"
          style={{ fontSize: size === 'sm' ? '7.5px' : size === 'lg' ? '10.5px' : '8.5px' }}
        >
          TA‘LIM MARKAZI
        </span>
      </div>
    </div>
  );
};
