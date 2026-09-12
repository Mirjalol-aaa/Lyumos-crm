import React, { useEffect, useState } from 'react';

export const CursorFollower: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia('(hover: hover)').matches) {
      return;
    }

    let animationFrame: number;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.closest('button') ||
          target.closest('a') ||
          target.closest('.gold-card') ||
          target.getAttribute('role') === 'button')
      ) {
        setIsPointer(true);
      } else {
        setIsPointer(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const loop = () => {
      currentX += (targetX - currentX) * 0.16;
      currentY += (targetY - currentY) * 0.16;
      setPos({ x: currentX, y: currentY });
      animationFrame = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    animationFrame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="hidden lg:block pointer-events-none">
      <div
        className="pointer-events-none fixed z-[9999] rounded-full transition-all duration-100 ease-out -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: isPointer ? '52px' : '32px',
          height: isPointer ? '52px' : '32px',
          background: isPointer
            ? 'radial-gradient(circle, rgba(217, 169, 58, 0.28) 0%, rgba(243, 210, 118, 0.12) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(217, 169, 58, 0.18) 0%, rgba(217, 169, 58, 0.05) 60%, transparent 80%)',
          border: isPointer ? '1px solid rgba(243, 210, 118, 0.45)' : '1px solid rgba(217, 169, 58, 0.25)',
          boxShadow: isPointer ? '0 0 20px rgba(217, 169, 58, 0.3)' : 'none',
        }}
      />
      <div
        className="pointer-events-none fixed z-[9999] h-1.5 w-1.5 rounded-full bg-[#F3D276] shadow-[0_0_8px_#D9A93A] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: isPointer ? 'translate(-50%, -50%) scale(1.5)' : 'translate(-50%, -50%) scale(1)',
        }}
      />
    </div>
  );
};
