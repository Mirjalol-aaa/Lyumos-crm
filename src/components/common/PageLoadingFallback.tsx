import React from 'react';

export const PageLoadingFallback: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] p-8 text-center animate-fadeIn">
      <div className="relative w-12 h-12 mb-3">
        {/* Outer subtle ring */}
        <div className="absolute inset-0 rounded-full border-2 border-[#E7E1D8]" />
        {/* Spinning burgundy arc */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#6F1028] border-r-[#C89B3C] animate-spin" />
      </div>
      <p className="text-xs font-semibold tracking-wider uppercase text-[#667085]">
        Yuklanmoqda...
      </p>
    </div>
  );
};
