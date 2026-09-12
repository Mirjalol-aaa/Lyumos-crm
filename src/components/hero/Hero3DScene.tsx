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

    // Global listener so movement feels natural even around borders
    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    let animationFrameId: number;
    const updatePhysics = () => {
      // Damped spring lerp (0.06 factor for silky Apple-like inertia)
      mouseCurrentRef.current.x +=
        (mouseTargetRef.current.x - mouseCurrentRef.current.x) * 0.06;
      mouseCurrentRef.current.y +=
        (mouseTargetRef.current.y - mouseCurrentRef.current.y) * 0.06;

      timeRef.current += 0.018;

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

  // 2. Interactive Golden Dust Particles Engine (Canvas)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth || 500);
    let height = (canvas.height = canvas.offsetHeight || 500);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 500;
      height = canvas.height = canvas.offsetHeight || 500;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.4 + 0.8,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: -Math.random() * 0.45 - 0.15,
      opacity: Math.random() * 0.7 + 0.2,
      pulseSpeed: Math.random() * 0.03 + 0.01,
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

        // Draw soft glowing gold dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244, 210, 122, ${currentOpacity})`;
        ctx.shadowBlur = 8;
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

  // Compute 3D rotations based on mouse parallax & time wave
  const rotX = -mousePos.y * 12 + Math.sin(timeRef.current * 0.8) * 1.5;
  const rotY = mousePos.x * 16 + Math.cos(timeRef.current * 0.7) * 1.8;
  const floatY = Math.sin(timeRef.current) * 8;

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[580px] aspect-square flex items-center justify-center select-none"
      style={{
        perspective: '1400px',
      }}
    >
      {/* 1. Volumetric Golden Ambient Glow in Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[85%] h-[85%] rounded-full bg-gradient-to-tr from-[#D9A83F]/22 via-[#831843]/18 to-transparent blur-[85px] animate-pulse duration-[8000ms]" />
        <div className="absolute w-[60%] h-[60%] rounded-full bg-[#D9A83F]/15 blur-[65px]" />
      </div>

      {/* 2. Interactive Golden Canvas Dust Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* 3. Outer Glassmorphic 3D Stage Capsule */}
      <div
        className="relative w-full h-full rounded-[42px] border border-[#D9A83F]/35 bg-gradient-to-br from-[#1C0D10]/85 via-[#14080A]/90 to-[#0A0506]/95 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(217,168,63,0.15)] overflow-hidden flex items-center justify-center"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotX * 0.45}deg) rotateY(${rotY * 0.45}deg)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        {/* Subtle Top Metallic Highlight on the Glass Frame */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFE7A3]/60 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D9A83F]/20 to-transparent" />

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
              LAYER A: DEEP BACKGROUND (Z: -70px)
              Monumental Golden Architectural Sundial Ring / Compass
              ========================================================= */}
          <div
            className="absolute flex items-center justify-center pointer-events-none opacity-85"
            style={{
              transform: 'translateZ(-75px) scale(1.15)',
            }}
          >
            <svg
              className="w-[370px] h-[370px] sm:w-[430px] sm:h-[430px] drop-shadow-[0_0_35px_rgba(217,168,63,0.4)] animate-spin duration-[140000ms]"
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="ringGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFF2C6" />
                  <stop offset="35%" stopColor="#F4D27A" />
                  <stop offset="70%" stopColor="#D9A83F" />
                  <stop offset="100%" stopColor="#8A5A12" />
                </linearGradient>
              </defs>

              {/* Outer Circular Ring */}
              <circle
                cx="200"
                cy="200"
                r="175"
                stroke="url(#ringGold)"
                strokeWidth="4"
                opacity="0.9"
              />
              <circle
                cx="200"
                cy="200"
                r="150"
                stroke="url(#ringGold)"
                strokeWidth="1.5"
                strokeDasharray="6 8"
                opacity="0.65"
              />

              {/* Radiating Sunburst Triangles / Spikes */}
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i * 360) / 24;
                const isMajor = i % 2 === 0;
                return (
                  <line
                    key={i}
                    x1="200"
                    y1={isMajor ? '20' : '36'}
                    x2="200"
                    y2="50"
                    stroke="url(#ringGold)"
                    strokeWidth={isMajor ? '3.5' : '2'}
                    strokeLinecap="round"
                    transform={`rotate(${angle} 200 200)`}
                  />
                );
              })}

              {/* Inner Concentric Rings */}
              <circle
                cx="200"
                cy="200"
                r="115"
                stroke="url(#ringGold)"
                strokeWidth="2"
                opacity="0.4"
              />
              <circle
                cx="200"
                cy="200"
                r="70"
                stroke="url(#ringGold)"
                strokeWidth="1"
                opacity="0.3"
              />
            </svg>
          </div>

          {/* =========================================================
              LAYER B: FLOATING GEOMETRIC ELEMENTS (Z: -20px to +30px)
              3D Golden Crystals, Torus & Orbital Nodes
              ========================================================= */}
          {/* Top Left Floating Diamond */}
          <div
            className="absolute top-14 left-10 pointer-events-none"
            style={{
              transform: `translateZ(25px) rotateX(${timeRef.current * 20}deg) rotateY(${timeRef.current * 35}deg)`,
            }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#D9A83F] via-[#FFE7A3] to-[#8A5A12] border border-[#FFE7A3] shadow-[0_0_20px_rgba(217,168,63,0.7)] rotate-45 opacity-80" />
          </div>

          {/* Bottom Right Floating Gold Torus Sphere */}
          <div
            className="absolute bottom-16 right-10 pointer-events-none"
            style={{
              transform: `translateZ(35px) rotateX(${timeRef.current * 25}deg) rotateY(${-timeRef.current * 30}deg)`,
            }}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#8A5A12] via-[#F4D27A] to-[#FFE7A3] p-[2px] shadow-[0_0_25px_rgba(217,168,63,0.6)]">
              <div className="w-full h-full rounded-full bg-[#1C0D10]/80 border border-[#D9A83F]/50" />
            </div>
          </div>

          {/* =========================================================
              LAYER C: CENTERPIECE (Z: +50px to +75px)
              3D Laptop with Live Lumos LMS Dashboard + Hardcover Books + Cap
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
                className="relative rounded-2xl bg-[#0F080A] border-[3px] border-[#38261F] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(217,168,63,0.25)] overflow-hidden"
                style={{
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'bottom center',
                  transform: 'rotateX(-12deg)',
                  boxShadow:
                    '0 25px 60px -10px rgba(0,0,0,0.95), 0 0 45px rgba(217,168,63,0.2), inset 0 0 20px rgba(0,0,0,0.8)',
                }}
              >
                {/* Screen Bezel Gloss Highlight */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FFE7A3]/50 to-transparent" />
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-emerald-500/80 animate-ping" />
                </div>

                {/* --- LIVE LUMOS DASHBOARD SCREEN UI --- */}
                <div className="mt-2 rounded-xl bg-gradient-to-b from-[#180F12] to-[#0D0709] border border-[#D9A83F]/30 p-3.5 space-y-2.5 text-left text-white overflow-hidden relative">
                  {/* Glass Screen Reflection Sheen */}
                  <div
                    className="absolute -inset-full bg-gradient-to-tr from-transparent via-white/[0.07] to-transparent pointer-events-none"
                    style={{
                      transform: `rotate(35deg) translateY(${mousePos.x * 30}px)`,
                    }}
                  />

                  {/* UI Top Navigation Bar */}
                  <div className="flex items-center justify-between border-b border-[#D9A83F]/20 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#D9A83F] to-[#F4D27A] flex items-center justify-center text-[#0B0808] font-black text-[10px]">
                        L
                      </div>
                      <span className="text-[11px] font-luxury-display font-black tracking-wider text-[#F8F5EF]">
                        LUMOS LMS
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                        Jonli dars
                      </span>
                    </div>
                  </div>

                  {/* UI Metrics Grid inside Screen */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 rounded-lg bg-[#241317]/80 border border-[#D9A83F]/25 text-center">
                      <span className="text-[8px] text-[#C7BCB1] uppercase block font-bold">O‘zlashtirish</span>
                      <span className="text-sm font-black text-[#F4D27A] font-mono">95%</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#241317]/80 border border-[#D9A83F]/25 text-center">
                      <span className="text-[8px] text-[#C7BCB1] uppercase block font-bold">IELTS Guruhi</span>
                      <span className="text-sm font-black text-blue-400 font-mono">Band 8.0</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#241317]/80 border border-[#D9A83F]/25 text-center">
                      <span className="text-[8px] text-[#C7BCB1] uppercase block font-bold">DTM Natijasi</span>
                      <span className="text-sm font-black text-emerald-400 font-mono">189.0</span>
                    </div>
                  </div>

                  {/* Simulated Progress Chart Bar in Screen */}
                  <div className="p-2.5 rounded-lg bg-[#14080A]/90 border border-white/5 space-y-1.5">
                    <div className="flex justify-between text-[9px] font-bold">
                      <span className="text-[#C7BCB1]">Haftalik nazorat imtihoni</span>
                      <span className="text-[#F4D27A]">1-o‘rin (A’lo)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden flex">
                      <div className="h-full bg-gradient-to-r from-[#D9A83F] via-[#F4D27A] to-emerald-400 w-[95%] rounded-full shadow-[0_0_10px_#D9A83F]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Laptop Keyboard Base (Lying flat with 3D perspective) */}
              <div
                className="relative h-6 sm:h-7 rounded-b-2xl bg-gradient-to-b from-[#2B1B17] via-[#1E110F] to-[#12090A] border-t-2 border-[#FFE7A3]/30 border-x border-b border-[#3A241C] shadow-[0_15px_30px_rgba(0,0,0,0.9)] flex items-center justify-center"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'rotateX(55deg) translateZ(-6px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.85), inset 0 1px 2px rgba(255,255,255,0.2)',
                }}
              >
                {/* Front Opening Notch */}
                <div className="w-16 h-1.5 rounded-b-md bg-[#0D0607] border-x border-b border-[#D9A83F]/30" />
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
                <div className="w-24 h-24 rounded-md bg-gradient-to-br from-[#1F1718] via-[#0E0708] to-black border border-[#D9A83F]/60 shadow-[0_12px_28px_rgba(0,0,0,0.95)] rotate-45 flex items-center justify-center relative">
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
                <div className="w-12 h-6 rounded-full bg-gradient-to-b from-[#0A0506] to-black border border-white/10 mx-auto -mt-6 opacity-90 shadow-md" />
              </div>
            </div>
          </div>

          {/* =========================================================
              LAYER D: FOREGROUND FLOATING GLASS CARDS (Z: +95px to +130px)
              3D Holographic Micro-Interactions with Specular Lighting
              ========================================================= */}
          {/* Floating Glass Card 1 (Top-Right): "Bilim bilan chegaralar yo‘q!" */}
          <div
            className="absolute top-6 -right-2 sm:-right-6 p-4 rounded-2xl bg-[#1C0F12]/80 backdrop-blur-xl border border-[#D9A83F]/45 shadow-[0_15px_35px_rgba(0,0,0,0.8),0_0_25px_rgba(217,168,63,0.18)] max-w-[225px] flex items-center gap-3 transition-transform duration-100 select-none group"
            style={{
              transform: `translateZ(105px) rotateX(${mousePos.y * 6}deg) rotateY(${-mousePos.x * 6}deg)`,
            }}
          >
            {/* Shifting Glass Glare */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/[0.08] via-transparent to-transparent pointer-events-none" />

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#D9A83F] to-[#F4D27A] text-[#0B0808] font-black shrink-0 shadow-lg shadow-[#D9A83F]/30 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-5 w-5 stroke-[2.5]" />
            </div>
            <p className="text-xs font-bold text-[#F8F5EF] leading-snug">
              Bilim bilan chegaralar yo‘q!
            </p>
          </div>

          {/* Floating Glass Card 2 (Bottom-Left): "Orzularingizga yetish uchun biz bilan!" */}
          <div
            className="absolute -bottom-4 -left-2 sm:-left-6 p-4 rounded-2xl bg-[#1C0F12]/85 backdrop-blur-xl border border-[#D9A83F]/45 shadow-[0_15px_35px_rgba(0,0,0,0.8),0_0_25px_rgba(217,168,63,0.18)] max-w-[235px] flex items-center gap-3 transition-transform duration-100 select-none group"
            style={{
              transform: `translateZ(120px) rotateX(${-mousePos.y * 6}deg) rotateY(${mousePos.x * 6}deg)`,
            }}
          >
            {/* Shifting Glass Glare */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/[0.08] via-transparent to-transparent pointer-events-none" />

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#D9A83F] to-[#F4D27A] text-[#0B0808] font-black shrink-0 shadow-lg shadow-[#D9A83F]/30 group-hover:scale-110 transition-transform">
              <GraduationCap className="h-5 w-5 stroke-[2.5]" />
            </div>
            <p className="text-xs font-bold text-[#F8F5EF] leading-snug">
              Orzularingizga yetish uchun biz bilan!
            </p>
          </div>

          {/* Floating Glass Card 3 (Bottom Badge): "⭐ 95% Natijadorlik" */}
          <div
            className="absolute bottom-6 right-6 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B0808]/90 backdrop-blur-md border border-[#D9A83F]/50 shadow-xl"
            style={{
              transform: 'translateZ(90px)',
            }}
          >
            <ShieldCheck className="h-4 w-4 text-[#D9A83F]" />
            <span className="text-[11px] font-black text-[#F4D27A] tracking-wide">
              95% Natijadorlik & Kafolat
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
