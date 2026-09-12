import React, { useEffect, useRef } from 'react';

interface Ambient3DProps {
  className?: string;
  showOrbs?: boolean;
}

export const Ambient3D: React.FC<Ambient3DProps> = ({
  className = '',
  showOrbs = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const count = 35;
    const embers = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: -Math.random() * 0.35 - 0.1,
      opacity: Math.random() * 0.5 + 0.15,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      angle: Math.random() * Math.PI * 2,
    }));

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      embers.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.angle += p.pulseSpeed;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentOpacity = p.opacity * (0.6 + 0.4 * Math.sin(p.angle));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(243, 210, 118, ${currentOpacity})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#D9A93A';
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}>
      {showOrbs && (
        <>
          <div className="absolute -top-[10%] left-1/4 w-[800px] h-[600px] bg-gradient-to-b from-[#731224]/18 via-[#2A0D14]/25 to-transparent blur-[160px] rounded-full" />
          <div className="absolute top-[30%] -right-[10%] w-[700px] h-[700px] bg-[#D9A93A]/10 blur-[170px] rounded-full" />
          <div className="absolute top-[65%] -left-[12%] w-[650px] h-[650px] bg-[#3B0B14]/15 blur-[150px] rounded-full" />
          <div className="absolute -bottom-[10%] right-1/4 w-[750px] h-[450px] bg-gradient-to-t from-[#D9A93A]/08 via-transparent to-transparent blur-[140px] rounded-full" />
        </>
      )}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
