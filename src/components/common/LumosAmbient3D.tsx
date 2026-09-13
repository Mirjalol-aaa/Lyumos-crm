import React, { useEffect, useRef } from 'react';

interface LumosAmbient3DProps {
  className?: string;
  activeSection?: string;
}

interface Particle {
  x: number;
  y: number;
  z: number; // 0 (far) to 1 (near)
  vx: number;
  vy: number;
  alpha: number;
  phase: number;
  pulseSpeed: number;
  tier: number; // 0: dust (70%), 1: spark (20%), 2: glow mote (8%), 3: warm orb (2%)
}

interface FloatingMathFormula {
  text: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  baseSize: number;
  opacity: number;
  wavePhase: number;
  waveSpeed: number;
  waveAmp: number;
}

interface FloatingEnglishWord {
  text: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  fontSize: number;
  opacity: number;
  angle: number;
  rotSpeed: number;
  wavePhase: number;
  waveSpeed: number;
  waveAmp: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export const LumosAmbient3D: React.FC<LumosAmbient3DProps> = ({
  className = '',
  activeSection = 'hero',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Physics & Inertia tracking refs (0 React re-renders)
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

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    // 4 Sprites: Tier 0 (dust), Tier 1 (spark), Tier 2 (glow mote), Tier 3 (warm orb)
    const spriteDust = createGlowSprite(14, 2, 'rgba(255, 235, 185, 0.9)', 'rgba(217, 169, 58, 0.35)');
    const spriteSpark = createGlowSprite(24, 3, 'rgba(255, 245, 210, 0.95)', 'rgba(243, 210, 118, 0.5)');
    const spriteMote = createGlowSprite(38, 5, 'rgba(243, 210, 118, 0.85)', 'rgba(217, 169, 58, 0.35)');
    const spriteOrb = createGlowSprite(72, 8, 'rgba(255, 230, 160, 0.75)', 'rgba(217, 169, 58, 0.2)');
    const sprites = [spriteDust, spriteSpark, spriteMote, spriteOrb];

    // -------------------------------------------------------------------------
    // 2. MULTI-TIER PARTICLE SYSTEM (70% dust, 20% spark, 8% mote, 2% warm orb)
    // -------------------------------------------------------------------------
    let maxParticles = isMobile ? 45 : 95;
    const particles: Particle[] = Array.from({ length: maxParticles }, () => {
      const rand = Math.random();
      let tier = 0;
      if (rand > 0.98) tier = 3;
      else if (rand > 0.90) tier = 2;
      else if (rand > 0.70) tier = 1;
      else tier = 0;

      const z = Math.random();
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        vx: (Math.random() - 0.5) * (0.12 + z * 0.18),
        vy: -(0.15 + Math.random() * 0.3 + z * 0.25),
        alpha: tier === 3 ? 0.35 : 0.2 + z * 0.6,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.008 + Math.random() * 0.018,
        tier,
      };
    });

    // -------------------------------------------------------------------------
    // 3. CONTINUOUS AUTONOMOUS MATHEMATICAL FORMULAS (Matematika)
    // -------------------------------------------------------------------------
    const mathFormulasList = [
      'π',
      '∑',
      '√x',
      'a² + b² = c²',
      'x²',
      '∫ f(x)dx',
      'dy/dx',
      '∞',
      'f(x)',
      'lim x→∞',
      'A = πr²',
      'x³',
    ];

    const mathFormulas: FloatingMathFormula[] = mathFormulasList.map((formula, i) => {
      const z = 0.25 + Math.random() * 0.65;
      return {
        text: formula,
        x: (width * (0.05 + (i * 0.85) / mathFormulasList.length + Math.random() * 0.06)) % width,
        y: (height * (0.1 + (i * 0.78) / mathFormulasList.length + Math.random() * 0.12)) % height,
        z,
        vx: (Math.random() > 0.5 ? 1 : -1) * (0.08 + Math.random() * 0.12),
        vy: -(0.06 + Math.random() * 0.12),
        baseSize: Math.floor(13 + z * 10),
        opacity: 0.12 + z * 0.12,
        wavePhase: Math.random() * Math.PI * 2,
        waveSpeed: 0.0008 + Math.random() * 0.0008,
        waveAmp: 8 + Math.random() * 12,
      };
    });

    // -------------------------------------------------------------------------
    // 4. CONTINUOUS AUTONOMOUS ENGLISH VOCABULARY (Ingliz Tili)
    // -------------------------------------------------------------------------
    const englishWordList = [
      'LEARN',
      'VOCABULARY',
      'GRAMMAR',
      'SPEAK',
      'FUTURE',
      'KNOWLEDGE',
      'EDUCATION',
      'PROGRESS',
      'SUCCESS',
      'PRACTICE',
      'ENGLISH',
      'Aa',
      'ABC',
    ];

    const englishWords: FloatingEnglishWord[] = englishWordList.map((word, i) => {
      const z = 0.2 + Math.random() * 0.6;
      return {
        text: word,
        x: (width * (0.08 + (i * 0.82) / englishWordList.length + Math.random() * 0.05)) % width,
        y: (height * (0.08 + (i * 0.8) / englishWordList.length + Math.random() * 0.08)) % height,
        z,
        vx: (Math.random() > 0.5 ? 1 : -1) * (0.06 + Math.random() * 0.1),
        vy: -(0.05 + Math.random() * 0.1),
        fontSize: Math.floor(10 + z * 6),
        opacity: 0.1 + z * 0.09,
        angle: (Math.random() - 0.5) * 0.12,
        rotSpeed: (Math.random() - 0.5) * 0.0003,
        wavePhase: Math.random() * Math.PI * 2,
        waveSpeed: 0.0006 + Math.random() * 0.0008,
        waveAmp: 6 + Math.random() * 10,
      };
    });

    // -------------------------------------------------------------------------
    // 5. 3D WIREFRAME GEOMETRY (Cube & Octahedron in 3D projection)
    // -------------------------------------------------------------------------
    // Cube vertices
    const cubeVertices: Point3D[] = [
      { x: -1, y: -1, z: -1 },
      { x: 1, y: -1, z: -1 },
      { x: 1, y: 1, z: -1 },
      { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 },
      { x: 1, y: -1, z: 1 },
      { x: 1, y: 1, z: 1 },
      { x: -1, y: 1, z: 1 },
    ];
    const cubeEdges: [number, number][] = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    // Octahedron vertices
    const octaVertices: Point3D[] = [
      { x: 0, y: -1.3, z: 0 },
      { x: 0, y: 1.3, z: 0 },
      { x: -1, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 0, z: -1 },
      { x: 0, y: 0, z: 1 },
    ];
    const octaEdges: [number, number][] = [
      [0, 2], [0, 3], [0, 4], [0, 5],
      [1, 2], [1, 3], [1, 4], [1, 5],
      [2, 4], [4, 3], [3, 5], [5, 2],
    ];

    const project3D = (
      p: Point3D,
      rotX: number,
      rotY: number,
      rotZ: number,
      scale: number,
      centerX: number,
      centerY: number
    ) => {
      // Rotation Y
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = p.x * cosY + p.z * sinY;
      const z1 = -p.x * sinY + p.z * cosY;

      // Rotation X
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;

      // Rotation Z
      const cosZ = Math.cos(rotZ);
      const sinZ = Math.sin(rotZ);
      const x3 = x1 * cosZ - y2 * sinZ;
      const y3 = x1 * sinZ + y2 * cosZ;

      // Perspective projection
      const fov = 350;
      const distance = 400 + z2 * scale;
      const proj = fov / Math.max(distance, 100);

      return {
        x: centerX + x3 * scale * proj,
        y: centerY + y3 * scale * proj,
      };
    };

    // -------------------------------------------------------------------------
    // 6. MAIN 60 FPS RENDER LOOP
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

      // FPS Monitoring
      frameCount++;
      fpsAccumulator += 1 / (dt || 0.016);
      if (frameCount >= 60) {
        const avgFps = fpsAccumulator / frameCount;
        if (avgFps < 42 && !isLowPerformance) {
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

      const parallaxX = mouseRef.current.currentX * 16;
      const parallaxY = mouseRef.current.currentY * 12;

      // Smooth Lerp for Scroll Parallax
      scrollRef.current.currentY +=
        (scrollRef.current.targetY - scrollRef.current.currentY) * 0.05;
      const scrollShift = (scrollRef.current.currentY * 0.08) % height;

      // -----------------------------------------------------------------------
      // A. FLOWING GOLD LIGHT TRAILS / RIBBONS (Subtle, breathing wave curves)
      // -----------------------------------------------------------------------
      if (!isLowPerformance) {
        const ribbonY = height * 0.38 + Math.sin(time * 0.35) * 25 + parallaxY * 0.2;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, ribbonY);
        for (let x = 0; x <= width; x += 40) {
          const wave =
            Math.sin(x * 0.0025 + time * 0.6) * 35 +
            Math.cos(x * 0.004 - time * 0.4) * 20;
          ctx.lineTo(x, ribbonY + wave);
        }
        const grad = ctx.createLinearGradient(0, ribbonY - 30, width, ribbonY + 30);
        grad.addColorStop(0, 'rgba(217, 169, 58, 0)');
        grad.addColorStop(0.3, 'rgba(217, 169, 58, 0.045)');
        grad.addColorStop(0.7, 'rgba(243, 210, 118, 0.06)');
        grad.addColorStop(1, 'rgba(217, 169, 58, 0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([8, 14]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      // -----------------------------------------------------------------------
      // B. 3D ROTATING WIREFRAME GEOMETRY (Cube & Octahedron)
      // -----------------------------------------------------------------------
      if (!isLowPerformance) {
        // 1. 3D Cube in mid-left zone
        const cubeCenter = {
          x: width * 0.14 + parallaxX * 0.4,
          y: height * 0.35 + Math.sin(time * 0.4) * 15 + parallaxY * 0.4,
        };
        const rotCube = prefersReducedMotion ? 0.4 : time * 0.18;
        const projectedCube = cubeVertices.map((v) =>
          project3D(v, rotCube * 0.8, rotCube, rotCube * 0.5, 42, cubeCenter.x, cubeCenter.y)
        );

        ctx.save();
        ctx.strokeStyle = 'rgba(217, 169, 58, 0.14)';
        ctx.lineWidth = 0.9;
        ctx.setLineDash([3, 5]);
        cubeEdges.forEach(([i, j]) => {
          ctx.beginPath();
          ctx.moveTo(projectedCube[i].x, projectedCube[i].y);
          ctx.lineTo(projectedCube[j].x, projectedCube[j].y);
          ctx.stroke();
        });
        ctx.setLineDash([]);
        ctx.restore();

        // 2. 3D Octahedron in mid-right zone
        const octaCenter = {
          x: width * 0.86 + parallaxX * 0.45,
          y: height * 0.62 + Math.cos(time * 0.45) * 16 + parallaxY * 0.45,
        };
        const rotOcta = prefersReducedMotion ? 0.3 : time * 0.22;
        const projectedOcta = octaVertices.map((v) =>
          project3D(v, rotOcta * 0.6, -rotOcta * 0.9, rotOcta * 0.3, 38, octaCenter.x, octaCenter.y)
        );

        ctx.save();
        ctx.strokeStyle = 'rgba(243, 210, 118, 0.13)';
        ctx.lineWidth = 0.9;
        ctx.setLineDash([4, 6]);
        octaEdges.forEach(([i, j]) => {
          ctx.beginPath();
          ctx.moveTo(projectedOcta[i].x, projectedOcta[i].y);
          ctx.lineTo(projectedOcta[j].x, projectedOcta[j].y);
          ctx.stroke();
        });
        ctx.setLineDash([]);
        ctx.restore();
      }

      // -----------------------------------------------------------------------
      // C. CONTINUOUS AUTONOMOUS MATHEMATICAL FORMULAS (Matematika)
      // -----------------------------------------------------------------------
      mathFormulas.forEach((m) => {
        if (!prefersReducedMotion) {
          m.x += m.vx;
          m.y += m.vy;
          m.wavePhase += m.waveSpeed;
        }

        // Seamless wrap-around edges
        if (m.y < -50) m.y = height + 40;
        if (m.y > height + 50) m.y = -40;
        if (m.x < -80) m.x = width + 70;
        if (m.x > width + 80) m.x = -70;

        const edgeFadeX = Math.min(1, Math.min(m.x, width - m.x) / 90);
        const edgeFadeY = Math.min(1, Math.min(m.y, height - m.y) / 90);
        const edgeAlpha = Math.max(0, edgeFadeX * edgeFadeY);

        const floatWave = Math.sin(m.wavePhase) * m.waveAmp;
        const depthFactor = 0.35 + m.z * 0.65;
        const mx = m.x + parallaxX * depthFactor;
        const my = m.y + floatWave + parallaxY * depthFactor;

        ctx.save();
        ctx.font = `italic 600 ${m.baseSize}px "Playfair Display", Georgia, serif`;
        ctx.fillStyle = `rgba(243, 210, 118, ${m.opacity * edgeAlpha})`;
        ctx.fillText(m.text, mx, my);
        ctx.restore();
      });

      // -----------------------------------------------------------------------
      // D. CONTINUOUS AUTONOMOUS ENGLISH VOCABULARY (Ingliz Tili)
      // -----------------------------------------------------------------------
      englishWords.forEach((w) => {
        if (!prefersReducedMotion) {
          w.x += w.vx;
          w.y += w.vy;
          w.angle += w.rotSpeed;
          w.wavePhase += w.waveSpeed;
        }

        // Seamless wrap-around edges
        if (w.y < -50) w.y = height + 40;
        if (w.y > height + 50) w.y = -40;
        if (w.x < -100) w.x = width + 90;
        if (w.x > width + 100) w.x = -90;

        const edgeFadeX = Math.min(1, Math.min(w.x, width - w.x) / 90);
        const edgeFadeY = Math.min(1, Math.min(w.y, height - w.y) / 90);
        const edgeAlpha = Math.max(0, edgeFadeX * edgeFadeY);

        const floatWave = Math.sin(w.wavePhase) * w.waveAmp;
        const depthFactor = 0.35 + w.z * 0.65;
        const wx = w.x + parallaxX * depthFactor;
        const wy = w.y + floatWave + parallaxY * depthFactor;

        ctx.save();
        ctx.translate(wx, wy);
        ctx.rotate(w.angle);
        ctx.font = `600 ${w.fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.fillStyle = `rgba(243, 210, 118, ${w.opacity * edgeAlpha})`;
        ctx.letterSpacing = '1.8px';
        ctx.fillText(w.text, 0, 0);
        ctx.restore();
      });

      // -----------------------------------------------------------------------
      // E. MULTI-TIER PRE-RENDERED GLOW PARTICLES (GPU Blitting)
      // -----------------------------------------------------------------------
      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          p.phase += p.pulseSpeed;
        }

        // Wrap around viewport edges
        if (p.y < -30) {
          p.y = height + 25;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 25;
        if (p.x > width + 30) p.x = -25;

        const pulse = 0.8 + 0.2 * Math.sin(p.phase);
        const depthFactor = 0.35 + p.z * 0.85;

        const px = p.x + parallaxX * depthFactor;
        const py = ((p.y - scrollShift + height) % height) + parallaxY * depthFactor;

        const sprite = sprites[p.tier];
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
      {/* Pure CSS Atmospheric Radial Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080607] via-[#120609] to-[#080607] opacity-95" />
      <div className="absolute top-0 right-0 w-[55vw] h-[55vw] rounded-full bg-radial from-[#520E1F]/22 via-[#22070D]/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[45vw] h-[45vw] rounded-full bg-radial from-[#D9A93A]/06 via-[#22070D]/08 to-transparent blur-3xl pointer-events-none" />

      {/* Global High-Performance 60FPS Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
    </div>
  );
};
