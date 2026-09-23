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
  // If full vertical lockup is requested
  if (variant === 'full') {
    const fullSizeMap = {
      sm: 'h-14',
      md: 'h-20',
      lg: 'h-28',
      xl: 'h-36',
    };
    return (
      <div className={`relative group/logo select-none inline-flex items-center justify-center ${className}`}>
        <img
          src={lumosLogoFull}
          alt="LUMOS O‘QUV MARKAZI"
          className={`${fullSizeMap[size]} w-auto object-contain drop-shadow-[0_4px_16px_rgba(217,166,46,0.35)] group-hover:brightness-110 transition-all duration-500`}
        />
      </div>
    );
  }

  // Size mapping for mark and typography
  const markSizeMap = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10 sm:h-11 sm:w-11',
    lg: 'h-13 w-13 sm:h-14 sm:w-14',
    xl: 'h-18 w-18',
  };

  const titleSizeStyle = {
    sm: '1.12rem',
    md: '1.38rem',
    lg: '1.85rem',
    xl: '2.4rem',
  };

  const subtitleSizeStyle = {
    sm: '7.5px',
    md: '8.5px',
    lg: '10.5px',
    xl: '12.5px',
  };

  // If mark only is requested
  if (variant === 'mark') {
    return (
      <div className={`relative group/logo select-none inline-flex items-center justify-center ${className}`}>
        <div
          className="absolute -inset-2 rounded-full bg-radial from-[#F4D27A]/30 via-[#D9A83F]/15 to-transparent blur-md opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500 pointer-events-none"
          aria-hidden="true"
        />
        <img
          src={lumosLogoMark}
          alt="LUMOS Emblem"
          className={`${markSizeMap[size]} object-contain drop-shadow-[0_2px_10px_rgba(217,166,46,0.35)] group-hover/logo:drop-shadow-[0_0_18px_rgba(244,210,122,0.65)] group-hover/logo:scale-105 group-hover/logo:brightness-110 transition-all duration-500`}
        />
      </div>
    );
  }

  // Default: Horizontal Lockup (Mark + Luxury Serif Typography)
  return (
    <div
      className={`relative group/logo cursor-pointer flex items-center gap-2.5 sm:gap-3 select-none transition-transform duration-500 ease-out hover:scale-[1.02] ${className}`}
    >
      {/* Soft Radial Golden Light Bloom Behind Emblem on Hover */}
      <div
        className="absolute -left-2 -top-2 w-16 h-16 rounded-full bg-radial from-[#F4D27A]/35 via-[#D9A83F]/15 to-transparent blur-xl opacity-0 group-hover/logo:opacity-100 transition-opacity duration-700 pointer-events-none"
        aria-hidden="true"
      />

      {/* Official 3D Golden Emblem Mark */}
      <div className="relative shrink-0 flex items-center justify-center">
        <img
          src={lumosLogoMark}
          alt="LUMOS Emblem"
          className={`${markSizeMap[size]} object-contain drop-shadow-[0_2px_10px_rgba(217,166,46,0.35)] group-hover/logo:drop-shadow-[0_0_18px_rgba(244,210,122,0.65)] group-hover/logo:scale-105 group-hover/logo:brightness-110 transition-all duration-500`}
        />
      </div>

      {/* Luxury Typography with Sheen Effect */}
      <div className="relative overflow-hidden flex flex-col justify-center text-left py-0.5">
        <span
          className="font-luxury-display font-black tracking-[0.16em] leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#FFF2C6] via-[#F4D27A] to-[#D9A83F] drop-shadow-sm group-hover/logo:brightness-110 transition-[filter] duration-500"
          style={{ fontSize: titleSizeStyle[size] }}
        >
          LUMOS
        </span>

        {showSubtitle && (
          <span
            className="font-sans font-extrabold tracking-[0.22em] text-[#D9A83F] uppercase mt-1 drop-shadow-xs group-hover/logo:text-[#FFE7A3] transition-colors duration-500"
            style={{ fontSize: subtitleSizeStyle[size] }}
          >
            O‘QUV MARKAZI
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
