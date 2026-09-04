import React from 'react';

interface LumosLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
}

export const LumosLoader: React.FC<LumosLoaderProps> = ({
  message = "Tizim yuklanmoqda…",
  size = 'fullscreen',
}) => {
  if (size === 'sm') {
    return (
      <div className="inline-flex items-center gap-2 text-amber-500 font-semibold text-xs">
        <div className="relative w-5 h-5 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
          <img src="/lumos-logo.png" alt="LUMOS" className="w-3.5 h-3.5 object-contain" />
        </div>
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-radial from-slate-900 via-slate-950 to-black text-white p-6 relative overflow-hidden font-sans select-none z-[9999]">
      {/* Ambient Gold Radial Glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-3xl pointer-events-none -translate-y-12 animate-pulse" />
      
      {/* Decorative Gold Grid lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      {/* Center Lumos Golden Emblem with Rotating Orbit Rings */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer Rotating Glowing Ring */}
        <div className="absolute w-44 h-44 rounded-full border border-amber-500/30 border-t-amber-400 border-r-amber-500/60 animate-[spin_6s_linear_infinite]" />
        
        {/* Reverse Rotating Inner Ring */}
        <div className="absolute w-36 h-36 rounded-full border border-dashed border-amber-400/40 border-b-amber-300 animate-[spin_4s_linear_infinite_reverse]" />
        
        {/* Soft Golden Pulsing Halo Backdrop */}
        <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-amber-600/30 via-yellow-500/20 to-amber-300/30 backdrop-blur-xl border border-amber-400/50 shadow-[0_0_60px_rgba(212,175,55,0.45)] flex items-center justify-center p-1.5 animate-pulse overflow-hidden">
          <img
            src="/lumos-logo.png"
            alt="LUMOS O'QUV MARKAZI"
            className="w-full h-full object-cover rounded-2xl filter drop-shadow-[0_6px_16px_rgba(212,175,55,0.7)]"
          />
        </div>
      </div>

      {/* Brand Title & Slogan */}
      <div className="text-center space-y-2 relative z-10">
        <h2 className="text-2xl sm:text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 uppercase drop-shadow">
          LUMOS
        </h2>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
          <span className="text-[11px] font-bold tracking-wider text-amber-300 uppercase">
            O‘quv Markazi
          </span>
          <span className="w-1 h-1 rounded-full bg-amber-400" />
          <span className="text-[10px] font-medium text-amber-200/80 italic">
            Bilim bilan yorqin kelajakka!
          </span>
        </div>
      </div>

      {/* Progress Shimmer & Dots */}
      <div className="mt-8 flex flex-col items-center gap-3 relative z-10">
        <div className="w-48 h-1 rounded-full bg-slate-800 overflow-hidden relative">
          <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full animate-[shimmer_1.5s_infinite]" />
        </div>
        <p className="text-xs font-medium text-slate-400 tracking-wide flex items-center gap-1.5">
          <span>{message}</span>
        </p>
      </div>
    </div>
  );
};
