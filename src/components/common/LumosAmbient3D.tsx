import React, { useEffect, useRef } from 'react';

interface LumosAmbient3DProps {
  className?: string;
  activeSection?: string;
}

interface Particle {
  x: number;
  y: number;
  z: number; // 0 (far) to 1 (near)
  baseRadius: number;
  vx: number;
  vy: number;
  alpha: number;
  phase: number;
  pulseSpeed: number;
  spriteIndex: number; // index of pre-cached glow sprite
}

interface FloatingMathElement {
  text: string;
  xRatio: number;
  yRatio: number;
  fontSize: number;
  opacity: number;
  floatSpeed: number;
  floatAmp: number;
  phase: number;
  isMonospace?: boolean;
}

interface FloatingEnglishWord {
  text: string;
  xRatio: number;
  yRatio: number;
  fontSize: number;
  opacity: number;
  floatSpeed: number;
  floatAmp: number;
  phase: number;
  rotationSpeed: number;
  angle: number;
}

interface OrbitalSystem {
  xRatio: number;
  yRatio: number;
  rx: number;
  ry: number;
  angle: number;
  speed: number;
  tilt: number;
  color: string;
  nodeCount: number;
}

export const LumosAmbient3D: React.FC<LumosAmbient3DProps> = ({
  className = '',
  activeSection = 'hero',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Physics & Inertia tracking refs (0 React re-renders!)
  const mouseRef = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 });
  const scrollRef = useRef({ targetY: 0, currentY: 0 });
  const activeSectionRef = useRef(activeSection);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Window & Canvas dimensions
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const isMobile = window.innerWidth < 768;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Smooth Mouse Tracking with Lerp
    const handleMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseRef.current.targetX = (e.clientX - halfW) / halfW; // -1 to 1
      mouseRef.current.targetY = (e.clientY - halfH) / halfH; // -1 to 1
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Smooth Scroll Tracking with Lerp
    const handleScroll = () => {
      scrollRef.current.targetY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // -------------------------------------------------------------------------
    // 1. PRE-RENDERED GLOW SPRITES (Zero CPU shadowBlur bottleneck!)
    // -------------------------------------------------------------------------
    // Pre-rendering 3 particle glow textures once to avoid costly Gaussian blur per frame
    const createGlowSprite = (size: number, innerR: number, colorStart: string, colorMid: string) => {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = size;
      offCanvas.height = size;
      const offCtx = offCanvas.getContext('2d');
      if (!offCtx) return offCanvas;

      const center = size / 2;
      const grad = offCtx.createRadialGradient(center, center, 0, center, center, center);
      grad.addColorStop(0, colorStart);
      grad.addColorStop(0.35, colorMid);
      grad.addColorStop(1, 'rgba(217, 169, 58, 0)');

      offCtx.fillStyle = grad;
      offCtx.beginPath();
      offCtx.arc(center, center, center, 0, Math.PI * 2);
      offCtx.fill();

      return offCanvas;
    };

    // 3 Cache levels: near, mid, far
    const spriteNear = createGlowSprite(32, 4, 'rgba(255, 242, 198, 0.95)', 'rgba(243, 210, 118, 0.6)');
    const spriteMid = createGlowSprite(24, 3, 'rgba(243, 210, 118, 0.85)', 'rgba(217, 169, 58, 0.45)');
    const spriteFar = createGlowSprite(16, 2, 'rgba(217, 169, 58, 0.7)', 'rgba(180, 130, 40, 0.25)');
    const sprites = [spriteFar, spriteMid, spriteNear];

    // -------------------------------------------------------------------------
    // 2. PARTICLE POOL INITIALIZATION
    // -------------------------------------------------------------------------
    let maxParticles = isMobile ? 40 : 85;
    const particles: Particle[] = Array.from({ length: maxParticles }, () => {
      const z = Math.random();
      const spriteIndex = z > 0.7 ? 2 : z > 0.35 ? 1 : 0;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        baseRadius: z > 0.7 ? 2.4 : z > 0.35 ? 1.5 : 0.9,
        vx: (Math.random() - 0.5) * (0.15 + z * 0.15),
        vy: -Math.random() * (0.2 + z * 0.25) - 0.05,
        alpha: 0.15 + z * 0.55,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.015,
        spriteIndex,
      };
    });

    // -------------------------------------------------------------------------
    // 3. MATHEMATICAL UNIVERSE OBJECTS
    // -------------------------------------------------------------------------
    const mathElements: FloatingMathElement[] = [
      { text: '∑', xRatio: 0.08, yRatio: 0.22, fontSize: 24, opacity: 0.18, floatSpeed: 0.0012, floatAmp: 9, phase: 0 },
      { text: 'π', xRatio: 0.88, yRatio: 0.18, fontSize: 22, opacity: 0.19, floatSpeed: 0.0015, floatAmp: 7, phase: 1.2 },
      { text: 'x² + y² = r²', xRatio: 0.16, yRatio: 0.62, fontSize: 13, opacity: 0.16, floatSpeed: 0.001, floatAmp: 8, phase: 2.1 },
      { text: '∫ f(x)dx', xRatio: 0.82, yRatio: 0.54, fontSize: 15, opacity: 0.17, floatSpeed: 0.0014, floatAmp: 9, phase: 3.4 },
      { text: 'A = πr²', xRatio: 0.24, yRatio: 0.88, fontSize: 13, opacity: 0.15, floatSpeed: 0.0011, floatAmp: 7, phase: 4.1 },
      { text: '√x', xRatio: 0.91, yRatio: 0.82, fontSize: 17, opacity: 0.16, floatSpeed: 0.0013, floatAmp: 8, phase: 0.8 },
      { text: 'lim (1+1/n)ⁿ = e', xRatio: 0.06, yRatio: 0.44, fontSize: 11, opacity: 0.13, floatSpeed: 0.0009, floatAmp: 6, phase: 1.7 },
      { text: 'e^{iπ} + 1 = 0', xRatio: 0.74, yRatio: 0.32, fontSize: 13, opacity: 0.15, floatSpeed: 0.0012, floatAmp: 7, phase: 2.8 },
    ];

    // -------------------------------------------------------------------------
    // 4. SUBTLE ENGLISH EDUCATIONAL WORDS (Very faint, background elegance)
    // -------------------------------------------------------------------------
    const englishWords: FloatingEnglishWord[] = [
      { text: 'LEARN', xRatio: 0.12, yRatio: 0.14, fontSize: 11, opacity: 0.12, floatSpeed: 0.0008, floatAmp: 8, phase: 0.4, rotationSpeed: 0.0003, angle: -0.05 },
      { text: 'FOCUS', xRatio: 0.85, yRatio: 0.38, fontSize: 11, opacity: 0.11, floatSpeed: 0.0007, floatAmp: 7, phase: 1.8, rotationSpeed: -0.0002, angle: 0.04 },
      { text: 'FUTURE', xRatio: 0.14, yRatio: 0.78, fontSize: 12, opacity: 0.13, floatSpeed: 0.0009, floatAmp: 9, phase: 2.9, rotationSpeed: 0.0004, angle: 0.03 },
      { text: 'KNOWLEDGE', xRatio: 0.78, yRatio: 0.72, fontSize: 11, opacity: 0.12, floatSpeed: 0.0006, floatAmp: 6, phase: 3.7, rotationSpeed: -0.0003, angle: -0.04 },
      { text: 'PROGRESS', xRatio: 0.48, yRatio: 0.92, fontSize: 11, opacity: 0.10, floatSpeed: 0.0008, floatAmp: 7, phase: 4.5, rotationSpeed: 0.0002, angle: 0.02 },
      { text: 'GROW', xRatio: 0.38, yRatio: 0.28, fontSize: 10, opacity: 0.10, floatSpeed: 0.0007, floatAmp: 6, phase: 5.1, rotationSpeed: -0.0002, angle: -0.03 },
    ];

    // -------------------------------------------------------------------------
    // 5. ORBITAL SYSTEMS (Coordinate axes & rotating rings)
    // -------------------------------------------------------------------------
    const orbitals: OrbitalSystem[] = [
      { xRatio: 0.74, yRatio: 0.35, rx: 160, ry: 90, angle: 0, speed: 0.002, tilt: -0.32, color: 'rgba(217, 169, 58, 0.12)', nodeCount: 2 },
      { xRatio: 0.74, yRatio: 0.35, rx: 240, ry: 125, angle: Math.PI / 4, speed: -0.0014, tilt: 0.22, color: 'rgba(217, 169, 58, 0.08)', nodeCount: 1 },
      { xRatio: 0.18, yRatio: 0.65, rx: 110, ry: 65, angle: Math.PI / 3, speed: 0.0025, tilt: 0.4, color: 'rgba(217, 169, 58, 0.1)', nodeCount: 1 },
    ];

    // -------------------------------------------------------------------------
    // 6. ANIMATION & PERFORMANCE BENCHMARKING
    // -------------------------------------------------------------------------
    let time = 0;
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsAccumulator = 0;
    let isLowPerformance = false;

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      time += dt;

      // Simple FPS monitoring every 60 frames
      frameCount++;
      fpsAccumulator += 1 / (dt || 0.016);
      if (frameCount >= 60) {
        const avgFps = fpsAccumulator / frameCount;
        if (avgFps < 42 && !isLowPerformance) {
          // Gracefully scale down particle count to sustain 60 FPS
          isLowPerformance = true;
          maxParticles = Math.floor(maxParticles * 0.65);
          particles.splice(maxParticles);
        }
        frameCount = 0;
        fpsAccumulator = 0;
      }

      ctx.clearRect(0, 0, width, height);

      // Smooth Lerp for Mouse Parallax
      const mouseFactor = prefersReducedMotion ? 0 : 0.045;
      mouseRef.current.currentX +=
        (mouseRef.current.targetX - mouseRef.current.currentX) * mouseFactor;
      mouseRef.current.currentY +=
        (mouseRef.current.targetY - mouseRef.current.currentY) * mouseFactor;

      const parallaxX = mouseRef.current.currentX * 14;
      const parallaxY = mouseRef.current.currentY * 10;

      // Smooth Lerp for Scroll Parallax
      scrollRef.current.currentY +=
        (scrollRef.current.targetY - scrollRef.current.currentY) * 0.05;
      const scrollShift = (scrollRef.current.currentY * 0.08) % height;

      // Section-based visual modulation
      const section = activeSectionRef.current;
      const isHero = section === 'hero';
      const isCourses = section === 'courses';
      const isResults = section === 'results';

      // -----------------------------------------------------------------------
      // A. LIVING MATHEMATICAL ORBITAL RINGS & COORDINATE GEOMETRY
      // -----------------------------------------------------------------------
      if (!isLowPerformance) {
        orbitals.forEach((orb) => {
          orb.angle += prefersReducedMotion ? 0 : orb.speed;
          const ox = width * orb.xRatio + parallaxX * 0.4;
          const oy = height * orb.yRatio + parallaxY * 0.4;

          ctx.save();
          ctx.translate(ox, oy);
          ctx.rotate(orb.tilt);

          ctx.beginPath();
          ctx.ellipse(0, 0, orb.rx, orb.ry, 0, 0, Math.PI * 2);
          ctx.strokeStyle = orb.color;
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 7]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Orbit nodes (small crisp gold dots)
          for (let i = 0; i < orb.nodeCount; i++) {
            const currentA = orb.angle + (i * Math.PI * 2) / orb.nodeCount;
            const nx = Math.cos(currentA) * orb.rx;
            const ny = Math.sin(currentA) * orb.ry;

            ctx.beginPath();
            ctx.arc(nx, ny, 2.2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(243, 210, 118, 0.75)';
            ctx.fill();
          }
          ctx.restore();
        });

        // Slow rotating geometric triangle in midground
        const triX = width * 0.16 + parallaxX * 0.3;
        const triY = height * 0.48 + parallaxY * 0.3;
        const triA = time * 0.04;
        ctx.save();
        ctx.translate(triX, triY);
        ctx.rotate(triA);
        ctx.strokeStyle = 'rgba(217, 169, 58, 0.12)';
        ctx.lineWidth = 0.9;
        ctx.setLineDash([3, 5]);
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const a = (i * Math.PI * 2) / 3 - Math.PI / 2;
          const tx = Math.cos(a) * 38;
          const ty = Math.sin(a) * 38;
          if (i === 0) ctx.moveTo(tx, ty);
          else ctx.lineTo(tx, ty);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      // -----------------------------------------------------------------------
      // B. SUBTLE FLOATING ENGLISH WORDS (Faint background elegance)
      // -----------------------------------------------------------------------
      englishWords.forEach((w) => {
        const floatY = Math.sin(time * w.floatSpeed * 1000 + w.phase) * w.floatAmp;
        const wx = width * w.xRatio + parallaxX * 0.35;
        const wy = height * w.yRatio + floatY + parallaxY * 0.35;
        w.angle += prefersReducedMotion ? 0 : w.rotationSpeed;

        ctx.save();
        ctx.translate(wx, wy);
        ctx.rotate(w.angle);
        ctx.font = `600 ${w.fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.fillStyle = `rgba(243, 210, 118, ${w.opacity})`;
        ctx.letterSpacing = '2px';
        ctx.fillText(w.text, 0, 0);
        ctx.restore();
      });

      // -----------------------------------------------------------------------
      // C. MATHEMATICAL FORMULAS & SYMBOLS (Calm floating objects)
      // -----------------------------------------------------------------------
      mathElements.forEach((m) => {
        const floatY = Math.sin(time * m.floatSpeed * 1000 + m.phase) * m.floatAmp;
        const mx = width * m.xRatio + parallaxX * 0.5;
        const my = height * m.yRatio + floatY + parallaxY * 0.5;

        ctx.save();
        ctx.font = `italic 600 ${m.fontSize}px "Playfair Display", Georgia, serif`;
        ctx.fillStyle = `rgba(243, 210, 118, ${m.opacity})`;
        ctx.fillText(m.text, mx, my);
        ctx.restore();
      });

      // -----------------------------------------------------------------------
      // D. PRE-RENDERED GLOW PARTICLES (Blazingly fast GPU drawImage!)
      // -----------------------------------------------------------------------
      particles.forEach((p) => {
        p.x += prefersReducedMotion ? 0 : p.vx;
        p.y += prefersReducedMotion ? 0 : p.vy;
        p.phase += prefersReducedMotion ? 0 : p.pulseSpeed;

        // Wrap around viewport edges
        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        const pulse = 0.8 + 0.2 * Math.sin(p.phase);
        const depthFactor = 0.35 + p.z * 0.85;

        // Coordinates with mouse inertia and subtle scroll response
        const px = p.x + parallaxX * depthFactor;
        const py = ((p.y - scrollShift + height) % height) + parallaxY * depthFactor;

        const sprite = sprites[p.spriteIndex];
        const halfSprite = sprite.width / 2;

        ctx.globalAlpha = p.alpha * pulse;
        ctx.drawImage(sprite, px - halfSprite, py - halfSprite);
      });
      ctx.globalAlpha = 1.0;

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      {/* 
        Single Pure CSS Atmospheric Radial Gradient in background.
        Zero CPU rasterization overhead!
      */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080607] via-[#120609] to-[#080607] opacity-95" />
      <div className="absolute top-0 right-0 w-[55vw] h-[55vw] rounded-full bg-radial from-[#520E1F]/22 via-[#22070D]/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[45vw] h-[45vw] rounded-full bg-radial from-[#D9A93A]/06 via-[#22070D]/08 to-transparent blur-3xl pointer-events-none" />

      {/* Single Global High-Performance Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
    </div>
  );
};
