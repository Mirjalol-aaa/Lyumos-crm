import React, { useEffect, useRef, useState } from 'react';
import {
  GraduationCap,
  TrendingUp,
  Award,
  Sparkles,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Star,
  Cpu,
  Binary,
  Compass,
  Layers,
} from 'lucide-react';

export const Hero3DScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Parallax mouse position state (normalized -1 to 1)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseCurrentRef = useRef({ x: 0, y: 0 });

  // Floating ambient time counter
  const timeRef = useRef(0);

  // 1. Mouse & Touch Parallax Tracking
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouseTargetRef.current = {
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y)),
      };
    };

    const handleMouseLeave = () => {
      mouseTargetRef.current = { x: 0, y: 0 };
    };

    // Global listener so movement feels silky smooth even around borders
    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    let animationFrameId: number;
    const updatePhysics = () => {
      // Damped spring lerp (0.055 factor for luxurious Apple-like inertia)
      mouseCurrentRef.current.x +=
        (mouseTargetRef.current.x - mouseCurrentRef.current.x) * 0.055;
      mouseCurrentRef.current.y +=
        (mouseTargetRef.current.y - mouseCurrentRef.current.y) * 0.055;

      timeRef.current += 0.016;

      setMousePos({
        x: mouseCurrentRef.current.x,
        y: mouseCurrentRef.current.y,
      });

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (container) container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 2. Interactive Golden Dust & Embers Particles Engine (Canvas)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth || 560);
    let height = (canvas.height = canvas.offsetHeight || 560);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 560;
      height = canvas.height = canvas.offsetHeight || 560;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool with differing depths and velocities
    const particleCount = 55;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.6,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.5 - 0.15,
      opacity: Math.random() * 0.7 + 0.2,
      pulseSpeed: Math.random() * 0.03 + 0.015,
      angle: Math.random() * Math.PI * 2,
    }));

    let animId: number;
    const renderParticles = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.angle += p.pulseSpeed;

        // Wrap around borders
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentOpacity =
          p.opacity * (0.6 + 0.4 * Math.sin(p.angle));

        // Draw soft glowing gold ember
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244, 210, 122, ${currentOpacity})`;
        ctx.shadowBlur = 9;
        ctx.shadowColor = '#D9A83F';
        ctx.fill();
      });

      animId = requestAnimationFrame(renderParticles);
    };

    animId = requestAnimationFrame(renderParticles);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Compute 3D rotations based on mouse parallax (counter-motion) & continuous wave
  const rotX = -mousePos.y * 14 + Math.sin(timeRef.current * 0.7) * 1.6;
  const rotY = mousePos.x * 18 + Math.cos(timeRef.current * 0.6) * 1.8;
  const floatY = Math.sin(timeRef.current * 0.9) * 9;
  const ringRotation = (timeRef.current * 4) % 360;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[580px] aspect-square flex items-center justify-center select-none"
      style={{
        perspective: '1400px',
      }}
    >
      {/* 1. Volumetric Golden & Deep Burgundy Ambient Glow in Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[88%] h-[88%] rounded-full bg-gradient-to-tr from-[#D9A83F]/22 via-[#831843]/20 to-transparent blur-[90px] animate-pulse duration-[8000ms]" />
        <div className="absolute w-[65%] h-[65%] rounded-full bg-gradient-to-b from-[#D9A83F]/15 via-[#2A0B12]/40 to-transparent blur-[70px]" />
      </div>

      {/* 2. Interactive Golden Canvas Dust Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* 3. Outer Glassmorphic 3D Stage Capsule */}
      <div
        className="relative w-full h-full rounded-[42px] border border-[#D9A83F]/35 bg-gradient-to-br from-[#1B0A0E]/85 via-[#13070A]/90 to-[#090405]/95 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.92),0_0_60px_rgba(217,168,63,0.18)] overflow-hidden flex items-center justify-center"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotX * 0.45}deg) rotateY(${rotY * 0.45}deg)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Subtle Top Metallic Highlight on the Glass Frame */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFE7A3]/70 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D9A83F]/25 to-transparent" />

        {/* -------------------------------------------------------------
            STAGE INNER 3D STACK (Preserve 3D Container)
            ------------------------------------------------------------- */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
            transform: `translateY(${floatY}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          }}
        >
          {/* =========================================================
              LAYER A: DEEP BACKGROUND (Z: -80px)
              Monumental Lumos Signature Gold Ring (Astronomical Sundial & Compass)
              ========================================================= */}
          <div
            className="absolute flex items-center justify-center pointer-events-none opacity-85"
            style={{
              transform: 'translateZ(-80px) scale(1.18)',
            }}
          >
            <svg
              className="w-[380px] h-[380px] sm:w-[440px] sm:h-[440px] drop-shadow-[0_0_40px_rgba(217,168,63,0.45)]"
              style={{
                transform: `rotate(${ringRotation}deg)`,
              }}
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="lumosRingGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF2C6" />
                  <stop offset="30%" stopColor="#F4D27A" />
                  <stop offset="70%" stopColor="#D9A83F" />
                  <stop offset="100%" stopColor="#8A5A12" />
                </linearGradient>
                <linearGradient id="lumosCoreGold" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D9A83F" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#FFE7A3" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#D9A83F" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Outer Circular Ring with Bevel Effect */}
              <circle
                cx="200"
                cy="200"
                r="180"
                stroke="url(#lumosRingGold)"
                strokeWidth="3.5"
                opacity="0.9"
              />
              <circle
                cx="200"
                cy="200"
                r="160"
                stroke="url(#lumosRingGold)"
                strokeWidth="1.5"
                strokeDasharray="4 8"
                opacity="0.6"
              />

              {/* 24 Radiating Sunburst Graduation Spikes */}
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i * 360) / 24;
                const isCardinal = i % 6 === 0;
                const isMajor = i % 2 === 0;
                return (
                  <line
                    key={i}
                    x1="200"
                    y1={isCardinal ? '16' : isMajor ? '24' : '34'}
                    x2="200"
                    y2="52"
                    stroke="url(#lumosRingGold)"
                    strokeWidth={isCardinal ? '4' : isMajor ? '2.5' : '1.5'}
                    strokeLinecap="round"
                    transform={`rotate(${angle} 200 200)`}
                  />
                );
              })}

              {/* Inner Concentric Structural Circles */}
              <circle
                cx="200"
                cy="200"
                r="124"
                stroke="url(#lumosRingGold)"
                strokeWidth="2"
                opacity="0.5"
              />
              <circle
                cx="200"
                cy="200"
                r="85"
                stroke="url(#lumosRingGold)"
                strokeWidth="1.5"
                strokeDasharray="6 6"
                opacity="0.35"
              />

              {/* Center Subtle Lumos Solar Star Emblem */}
              <circle
                cx="200"
                cy="200"
                r="45"
                fill="url(#lumosCoreGold)"
                opacity="0.25"
              />
            </svg>
          </div>

          {/* =========================================================
              LAYER B: 5-8 FLOATING 3D GEOMETRIC & EDUCATIONAL ELEMENTS
              (Z: -20px to +60px) - Pure Vector / CSS 3D (No Emojis)
              ========================================================= */}

          {/* 1. 3D Open Book / Codex (Top Left, Z: +35px) */}
          <div
            className="absolute top-12 left-6 pointer-events-none transition-transform duration-200"
            style={{
              transform: `translateZ(35px) rotateX(${15 + mousePos.y * 10}deg) rotateY(${-20 + mousePos.x * 12}deg) rotateZ(-10deg)`,
            }}
          >
            <div className="relative w-14 h-10 rounded-sm bg-gradient-to-r from-[#5B131E] via-[#851C2C] to-[#400B14] p-1 border border-[#FFE7A3]/50 shadow-[0_10px_25px_rgba(0,0,0,0.8),0_0_15px_rgba(217,168,63,0.3)] flex items-center justify-center">
              {/* Spine Line */}
              <div className="absolute inset-y-0 left-1/2 w-[1.5px] bg-[#FFE7A3]/80 -translate-x-1/2" />
              {/* Paper Leaves */}
              <div className="w-full h-full flex gap-1 px-1 py-0.5">
                <div className="flex-1 bg-[#F5EDE2] rounded-[1px] border-r border-amber-900/30 flex flex-col justify-around py-0.5 px-0.5">
                  <div className="h-[1px] w-full bg-slate-400/50" />
                  <div className="h-[1px] w-3/4 bg-slate-400/50" />
                  <div className="h-[1px] w-5/6 bg-slate-400/50" />
                </div>
                <div className="flex-1 bg-[#FAF5ED] rounded-[1px] border-l border-amber-900/30 flex flex-col justify-around py-0.5 px-0.5">
                  <div className="h-[1px] w-full bg-slate-400/50" />
                  <div className="h-[1px] w-4/5 bg-slate-400/50" />
                  <div className="h-[1px] w-2/3 bg-slate-400/50" />
                </div>
              </div>
            </div>
          </div>

          {/* 2. AI Neural Network Sphere (Top Center-Right, Z: +45px) */}
          <div
            className="absolute top-8 right-24 pointer-events-none"
            style={{
              transform: `translateZ(45px) rotateX(${mousePos.y * 15}deg) rotateY(${timeRef.current * 25}deg)`,
            }}
          >
            <div className="relative w-12 h-12 flex items-center justify-center">
              {/* Orbit Rings */}
              <div className="absolute inset-0 rounded-full border border-[#D9A83F]/60 animate-spin duration-[15000ms]" />
              <div className="absolute inset-1.5 rounded-full border border-[#FFE7A3]/40 animate-ping duration-[6000ms]" />
              {/* Core Luminous Node */}
              <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#D9A83F] to-[#FFE7A3] shadow-[0_0_20px_#D9A83F] flex items-center justify-center">
                <Cpu className="h-2.5 w-2.5 text-[#0B0808]" />
              </div>
              {/* Satellite Node Dots */}
              <div className="absolute top-0 left-1 w-1.5 h-1.5 rounded-full bg-[#FFE7A3] shadow-[0_0_8px_#FFE7A3]" />
              <div className="absolute bottom-1 right-0 w-2 h-2 rounded-full bg-[#D9A83F] shadow-[0_0_8px_#D9A83F]" />
              <div className="absolute top-2 right-1 w-1 h-1 rounded-full bg-white shadow-[0_0_6px_#FFFFFF]" />
            </div>
          </div>

          {/* 3. Mathematical Formula Glass Token (Upper Right, Z: +55px) */}
          <div
            className="absolute top-20 right-6 pointer-events-none"
            style={{
              transform: `translateZ(55px) rotateX(${-mousePos.y * 12}deg) rotateY(${-mousePos.x * 15}deg)`,
            }}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#241216]/90 to-[#100709]/90 border border-[#D9A83F]/50 backdrop-blur-md shadow-[0_10px_20px_rgba(0,0,0,0.8),0_0_15px_rgba(217,168,63,0.25)] flex items-center justify-center text-[#F4D27A] font-serif font-black text-sm">
              <span>∑</span>
            </div>
          </div>

          {/* 4. 3D Faceted Gold Polyhedron / Cube (Left Center, Z: +30px) */}
          <div
            className="absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none"
            style={{
              transform: `translateZ(30px) rotateX(${timeRef.current * 20}deg) rotateY(${timeRef.current * 35}deg)`,
            }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#8A5A12] via-[#F4D27A] to-[#FFE7A3] p-[1.5px] shadow-[0_0_22px_rgba(217,168,63,0.55)] rotate-45">
              <div className="w-full h-full rounded-lg bg-gradient-to-br from-[#2A0E14] via-[#1A070A] to-[#0A0405] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-sm bg-[#D9A83F] opacity-75" />
              </div>
            </div>
          </div>

          {/* 5. Floating Tech Slate / Tablet (Lower Left, Z: +40px) */}
          <div
            className="absolute bottom-20 left-6 pointer-events-none"
            style={{
              transform: `translateZ(40px) rotateX(${25 - mousePos.y * 10}deg) rotateY(${20 + mousePos.x * 12}deg)`,
            }}
          >
            <div className="w-12 h-14 rounded-lg bg-gradient-to-b from-[#1E1114] to-[#0D0709] border border-[#D9A83F]/40 p-1 shadow-[0_12px_24px_rgba(0,0,0,0.85)] flex flex-col justify-between">
              <div className="flex justify-between items-center px-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                <Binary className="h-2 w-2 text-[#D9A83F]" />
              </div>
              <div className="space-y-0.5 px-0.5">
                <div className="h-1 w-full bg-[#D9A83F]/30 rounded-xs" />
                <div className="h-1 w-2/3 bg-[#FFE7A3]/30 rounded-xs" />
              </div>
              <div className="h-1 w-full bg-gradient-to-r from-[#D9A83F] to-emerald-400 rounded-full" />
            </div>
          </div>

          {/* 6. 3D Graduation Cap Silhouette (Floating Node, Upper Mid, Z: +20px) */}
          <div
            className="absolute top-28 left-20 pointer-events-none opacity-80"
            style={{
              transform: `translateZ(20px) rotateZ(${Math.sin(timeRef.current) * 8}deg)`,
            }}
          >
            <div className="w-7 h-7 rounded-full bg-[#D9A83F]/15 border border-[#D9A83F]/40 flex items-center justify-center">
              <GraduationCap className="h-3.5 w-3.5 text-[#F4D27A]" />
            </div>
          </div>

          {/* 7. Radiant Gold Energy Orb (Bottom Right, Z: +50px) */}
          <div
            className="absolute bottom-16 right-8 pointer-events-none"
            style={{
              transform: `translateZ(50px) scale(${1 + Math.sin(timeRef.current * 2) * 0.08})`,
            }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D9A83F] via-[#FFE7A3] to-white p-[1px] shadow-[0_0_28px_rgba(217,168,63,0.7)] flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#1C0D10]/80 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-[#FFE7A3]" />
              </div>
            </div>
          </div>

          {/* 8. Mathematical Formula Node "π" (Bottom Center, Z: +30px) */}
          <div
            className="absolute bottom-6 left-28 pointer-events-none opacity-75"
            style={{
              transform: 'translateZ(30px)',
            }}
          >
            <div className="px-2 py-0.5 rounded-full bg-[#1C0F12]/80 border border-[#D9A83F]/35 text-[11px] font-serif font-black text-[#D9A83F] shadow-md">
              π ≈ 3.14159
            </div>
          </div>

          {/* =========================================================
              LAYER C: CENTERPIECE (Z: +55px to +85px)
              3D Laptop with Live Lumos LMS + Hardcover Books + Velvet Cap
              ========================================================= */}
          <div
            className="relative flex items-center justify-center scale-[0.88] sm:scale-100"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'translateZ(55px) translateY(-5px)',
            }}
          >
            {/* ---------------- 3D LAPTOP (Isometric Presentation) ---------------- */}
            <div
              className="relative w-[340px] sm:w-[390px] transition-transform duration-100"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'rotateX(8deg) rotateY(-10deg) rotateZ(1.5deg)',
              }}
            >
              {/* Laptop Screen (Lid tilted backwards) */}
              <div
                className="relative rounded-2xl bg-[#0E0608] border-[3px] border-[#382025] p-3 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(217,168,63,0.25)] overflow-hidden"
                style={{
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'bottom center',
                  transform: 'rotateX(-12deg)',
                  boxShadow:
                    '0 25px 60px -10px rgba(0,0,0,0.95), 0 0 45px rgba(217,168,63,0.22), inset 0 0 20px rgba(0,0,0,0.8)',
                }}
              >
                {/* Screen Bezel Gloss Highlight */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FFE7A3]/60 to-transparent" />
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-emerald-500/90 animate-ping" />
                </div>

                {/* --- LIVE LUMOS DASHBOARD SCREEN UI --- */}
                <div className="mt-2 rounded-xl bg-gradient-to-b from-[#190C10] via-[#12070A] to-[#0A0406] border border-[#D9A83F]/35 p-3.5 space-y-2.5 text-left text-white overflow-hidden relative">
                  {/* Glass Screen Reflection Sheen shifting with mouse */}
                  <div
                    className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent pointer-events-none"
                    style={{
                      transform: `rotate(35deg) translateY(${mousePos.x * 35}px)`,
                    }}
                  />

                  {/* UI Top Navigation Bar */}
                  <div className="flex items-center justify-between border-b border-[#D9A83F]/20 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#D9A83F] to-[#F4D27A] flex items-center justify-center text-[#0B0808] font-black text-[10px] shadow-sm">
                        L
                      </div>
                      <span className="text-[11px] font-luxury-display font-black tracking-wider text-[#F8F5EF]">
                        LUMOS LMS
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#241317] border border-emerald-500/30">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                        Jonli dars
                      </span>
                    </div>
                  </div>

                  {/* UI Metrics Grid inside Screen */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 rounded-lg bg-[#220E13]/85 border border-[#D9A83F]/25 text-center shadow-inner">
                      <span className="text-[8px] text-[#C7BCB1] uppercase block font-bold">O‘zlashtirish</span>
                      <span className="text-sm font-black text-[#F4D27A] font-mono">95%</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#220E13]/85 border border-[#D9A83F]/25 text-center shadow-inner">
                      <span className="text-[8px] text-[#C7BCB1] uppercase block font-bold">IELTS Guruhi</span>
                      <span className="text-sm font-black text-blue-400 font-mono">Band 8.0</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#220E13]/85 border border-[#D9A83F]/25 text-center shadow-inner">
                      <span className="text-[8px] text-[#C7BCB1] uppercase block font-bold">DTM Natijasi</span>
                      <span className="text-sm font-black text-emerald-400 font-mono">189.0</span>
                    </div>
                  </div>

                  {/* Simulated Progress Chart Bar in Screen */}
                  <div className="p-2.5 rounded-lg bg-[#0F0507]/90 border border-white/5 space-y-1.5">
                    <div className="flex justify-between text-[9px] font-bold">
                      <span className="text-[#C7BCB1]">Haftalik nazorat imtihoni</span>
                      <span className="text-[#F4D27A]">1-o‘rin (A’lo)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden flex">
                      <div className="h-full bg-gradient-to-r from-[#D9A83F] via-[#F4D27A] to-emerald-400 w-[95%] rounded-full shadow-[0_0_12px_#D9A83F]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Laptop Keyboard Base (Lying flat with 3D perspective) */}
              <div
                className="relative h-6 sm:h-7 rounded-b-2xl bg-gradient-to-b from-[#2C171C] via-[#1E0F13] to-[#11070A] border-t-2 border-[#FFE7A3]/30 border-x border-b border-[#3D2128] shadow-[0_18px_35px_rgba(0,0,0,0.92)] flex items-center justify-center"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'rotateX(55deg) translateZ(-6px)',
                  boxShadow: '0 22px 45px rgba(0,0,0,0.9), inset 0 1px 2px rgba(255,255,255,0.2)',
                }}
              >
                {/* Front Opening Notch */}
                <div className="w-16 h-1.5 rounded-b-md bg-[#0D0507] border-x border-b border-[#D9A83F]/35" />
              </div>
            </div>

            {/* ---------------- 3D TEXTBOOK STACK & GRADUATION CAP ---------------- */}
            {/* Positioned on the lower right in front of the laptop */}
            <div
              className="absolute -bottom-8 -right-6 sm:-right-10 pointer-events-none"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'translateZ(65px) rotateX(15deg) rotateY(-22deg)',
              }}
            >
              {/* Stack of 3 Hardcover Luxury Books */}
              <div className="relative space-y-[-10px]">
                {/* Book 1 (Bottom): Deep Burgundy & Gold Foil */}
                <div className="w-44 h-8 rounded-lg bg-gradient-to-r from-[#4A0E17] via-[#6B1422] to-[#3B0B12] border-t border-l border-[#FFE7A3]/60 border-r border-b border-[#1E0509] shadow-xl flex items-center justify-between px-3">
                  <span className="text-[8px] font-luxury-display font-black tracking-widest text-[#F4D27A]">
                    LUMOS EXCELLENCE
                  </span>
                  <div className="h-4 w-3 rounded-sm bg-[#EADCCB] border-l border-amber-900/40" />
                </div>

                {/* Book 2 (Middle): Dark Leather Obsidian */}
                <div className="w-40 h-7 rounded-lg bg-gradient-to-r from-[#171010] via-[#2A1D1C] to-[#140C0B] border-t border-l border-[#D9A83F]/50 border-r border-b border-black shadow-lg flex items-center justify-between px-3">
                  <span className="text-[7.5px] font-luxury-display font-bold tracking-wider text-[#EADCCB]">
                    MATEMATIKA & DTM
                  </span>
                  <div className="h-3.5 w-3 rounded-sm bg-[#F4D27A] border-l border-amber-900" />
                </div>

                {/* Book 3 (Top): Royal Midnight */}
                <div className="w-36 h-6 rounded-lg bg-gradient-to-r from-[#0F1E36] via-[#1A2E4C] to-[#0A1424] border-t border-l border-[#60A5FA]/60 shadow-md flex items-center justify-between px-2.5">
                  <span className="text-[7px] font-luxury-display font-bold tracking-wider text-blue-200">
                    IELTS 8.0 MASTER
                  </span>
                  <div className="h-3 w-2.5 rounded-sm bg-[#EADCCB]" />
                </div>
              </div>

              {/* 3D Academic Graduation Cap (Mortarboard) resting at angle on books */}
              <div
                className="absolute -top-12 left-2"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'rotateX(25deg) rotateY(-18deg) rotateZ(12deg)',
                }}
              >
                {/* Velvet Diamond Cap Top */}
                <div className="w-24 h-24 rounded-md bg-gradient-to-br from-[#221316] via-[#0E0608] to-black border border-[#D9A83F]/65 shadow-[0_14px_30px_rgba(0,0,0,0.95)] rotate-45 flex items-center justify-center relative">
                  {/* Gold Button at Apex */}
                  <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#D9A83F] to-[#FFE7A3] border border-white/60 shadow-md flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8A5A12]" />
                  </div>

                  {/* Golden Silk Braided Tassel Hanging Down */}
                  <div className="absolute top-1/2 left-1/2 w-12 h-[2px] bg-gradient-to-r from-[#FFE7A3] via-[#D9A83F] to-[#F4D27A] origin-left rotate-[65deg] shadow-sm">
                    {/* Tassel fringe */}
                    <div className="absolute right-0 -top-1.5 w-3.5 h-5 rounded-xs bg-gradient-to-b from-[#F4D27A] to-[#8A5A12] border border-[#FFE7A3]/50 shadow-sm" />
                  </div>
                </div>

                {/* Skull Cap Base */}
                <div className="w-12 h-6 rounded-full bg-gradient-to-b from-[#0A0406] to-black border border-white/10 mx-auto -mt-6 opacity-90 shadow-md" />
              </div>
            </div>
          </div>

          {/* =========================================================
              LAYER D: FOREGROUND FLOATING GLASS CARDS (Z: +105px to +130px)
              3D Holographic Micro-Interactions with Specular Lighting
              ========================================================= */}

          {/* Floating Glass Card 1 (Top-Right): "Bilim bilan chegaralar yo‘q!" */}
          <div
            className="absolute top-6 -right-2 sm:-right-6 p-4 rounded-2xl bg-[#1C0A0E]/85 backdrop-blur-xl border border-[#D9A83F]/50 shadow-[0_15px_35px_rgba(0,0,0,0.85),0_0_25px_rgba(217,168,63,0.2)] max-w-[225px] flex items-center gap-3 transition-transform duration-100 select-none group"
            style={{
              transform: `translateZ(110px) rotateX(${mousePos.y * 6}deg) rotateY(${-mousePos.x * 6}deg)`,
            }}
          >
            {/* Shifting Glass Glare */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/[0.09] via-transparent to-transparent pointer-events-none" />

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#D9A83F] to-[#F4D27A] text-[#0B0808] font-black shrink-0 shadow-lg shadow-[#D9A83F]/30 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-5 w-5 stroke-[2.5]" />
            </div>
            <p className="text-xs font-bold text-[#F8F5EF] leading-snug">
              Bilim bilan chegaralar yo‘q!
            </p>
          </div>

          {/* Floating Glass Card 2 (Bottom-Left): "Orzularingizga yetish uchun biz bilan!" */}
          <div
            className="absolute -bottom-4 -left-2 sm:-left-6 p-4 rounded-2xl bg-[#1C0A0E]/85 backdrop-blur-xl border border-[#D9A83F]/50 shadow-[0_15px_35px_rgba(0,0,0,0.85),0_0_25px_rgba(217,168,63,0.2)] max-w-[235px] flex items-center gap-3 transition-transform duration-100 select-none group"
            style={{
              transform: `translateZ(125px) rotateX(${-mousePos.y * 6}deg) rotateY(${mousePos.x * 6}deg)`,
            }}
          >
            {/* Shifting Glass Glare */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/[0.09] via-transparent to-transparent pointer-events-none" />

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#D9A83F] to-[#F4D27A] text-[#0B0808] font-black shrink-0 shadow-lg shadow-[#D9A83F]/30 group-hover:scale-110 transition-transform">
              <GraduationCap className="h-5 w-5 stroke-[2.5]" />
            </div>
            <p className="text-xs font-bold text-[#F8F5EF] leading-snug">
              Orzularingizga yetish uchun biz bilan!
            </p>
          </div>

          {/* Floating Glass Card 3 (Bottom-Center/Pill): "Real natija. Kuchli kelajak." */}
          <div
            className="absolute bottom-5 right-5 sm:right-7 flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#120609]/90 backdrop-blur-md border border-[#D9A83F]/50 shadow-[0_10px_25px_rgba(0,0,0,0.9),0_0_15px_rgba(217,168,63,0.15)] group transition-transform"
            style={{
              transform: 'translateZ(95px)',
            }}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D9A83F]/20 text-[#D9A83F] shrink-0 group-hover:scale-110 transition-transform">
              <Award className="h-3.5 w-3.5" />
            </div>
            <span className="text-[11px] font-bold text-[#F4D27A] tracking-wide whitespace-nowrap">
              Real natija. Kuchli kelajak.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
