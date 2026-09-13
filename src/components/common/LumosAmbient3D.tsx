import React, { useEffect, useRef } from 'react';

interface LumosAmbient3DProps {
  className?: string;
  activeSection?: string;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  alpha: number;
  phase: number;
  pulseSpeed: number;
  tier: number; // 0: dust (70%), 1: small dot (20%), 2: medium orb (8%), 3: large light (2%)
}

type MovementPattern = 'horizontal' | 'diagonal_up' | 'diagonal_down' | 'orbital' | 'depth_wave' | 'sinusoidal';

interface FloatingObject {
  type: 'math' | 'english';
  text: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  pattern: MovementPattern;
  baseSize: number;
  baseOpacity: number;
  angle: number;
  rotSpeed: number;
  wavePhase: number;
  waveSpeed: number;
  waveAmp: number;
  orbitCenter?: { xRatio: number; yRatio: number };
  orbitRadius?: { rx: number; ry: number };
  orbitSpeed?: number;
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
      mouseRef.current.targetX = (e.clientX - halfW) / halfW;
      mouseRef.current.targetY = (e.clientY - halfH) / halfH;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Smooth Scroll Tracking with Lerp
    const handleScroll = () => {
      scrollRef.current.targetY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // -------------------------------------------------------------------------
    // 1. PRE-RENDERED GPU SPRITES (Zero CPU shadowBlur bottleneck!)
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

    // 4 Sprites: Tier 0 (dust), Tier 1 (small dot), Tier 2 (medium orb), Tier 3 (large light)
    const spriteDust = createGlowSprite(14, 2, 'rgba(255, 238, 195, 0.9)', 'rgba(217, 169, 58, 0.35)');
    const spriteDot = createGlowSprite(24, 3, 'rgba(255, 245, 215, 0.95)', 'rgba(243, 210, 118, 0.5)');
    const spriteOrb = createGlowSprite(40, 6, 'rgba(243, 210, 118, 0.85)', 'rgba(217, 169, 58, 0.35)');
    const spriteLarge = createGlowSprite(80, 12, 'rgba(255, 235, 170, 0.75)', 'rgba(217, 169, 58, 0.22)');
    const sprites = [spriteDust, spriteDot, spriteOrb, spriteLarge];

    // -------------------------------------------------------------------------
    // 2. MULTI-TIER PARTICLE SYSTEM (70% dust, 20% dots, 8% orbs, 2% large lights)
    // -------------------------------------------------------------------------
    let maxParticles = isMobile ? 40 : 85;
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
        vx: (Math.random() - 0.5) * (0.1 + z * 0.16),
        vy: -(0.12 + Math.random() * 0.28 + z * 0.22),
        alpha: tier === 3 ? 0.32 : 0.18 + z * 0.58,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.008 + Math.random() * 0.016,
        tier,
      };
    });

    // -------------------------------------------------------------------------
    // 3. SPATIALLY DISTRIBUTED FLOATING ELEMENTS (Mathematics & English)
    // Grid-partitioned to guarantee zero initial clustering & maximum breathing room
    // -------------------------------------------------------------------------
    const mathList = [
      'π', '∑', '√x', 'a² + b² = c²', 'x²', '∫ f(x)dx', 'dy/dx',
      '∞', 'f(x)', 'x + y = z', '△', '○', '□', 'lim x→∞'
    ];

    const englishList = [
      'LEARN', 'VOCABULARY', 'GRAMMAR', 'SPEAK', 'FUTURE', 'KNOWLEDGE',
      'PROGRESS', 'SUCCESS', 'PRACTICE', 'ENGLISH', 'Aa', 'ABC'
    ];

    const totalElements = mathList.length + englishList.length; // 26 elements
    const cols = 6;
    const rows = 5;

    const patterns: MovementPattern[] = [
      'horizontal', 'diagonal_up', 'diagonal_down',
      'orbital', 'depth_wave', 'sinusoidal'
    ];

    const floatingObjects: FloatingObject[] = [];

    // Interleave math and english across distinct spatial sectors
    let mIdx = 0;
    let eIdx = 0;

    for (let i = 0; i < totalElements; i++) {
      const isMath = i % 2 === 0 ? (mIdx < mathList.length) : (eIdx >= englishList.length);
      const text = isMath ? mathList[mIdx++] : englishList[eIdx++];

      // Assign to distinct grid sector with generous jitter
      const c = i % cols;
      const r = Math.floor(i / cols) % rows;

      const sectorX = (c + 0.2 + Math.random() * 0.6) / cols;
      const sectorY = (r + 0.15 + Math.random() * 0.7) / rows;

      // Depth distribution: 30% far, 45% mid, 25% near
      const depthRand = Math.random();
      let z = 0.5;
      if (depthRand < 0.30) {
        z = 0.15 + Math.random() * 0.20; // FAR
      } else if (depthRand < 0.75) {
        z = 0.38 + Math.random() * 0.30; // MID
      } else {
        z = 0.72 + Math.random() * 0.24; // NEAR
      }

      const pattern = patterns[i % patterns.length];

      // Base sizes and opacities strictly scaled by depth
      const baseSize = isMath
        ? Math.floor(11 + z * 9) // 12px to 20px
        : Math.floor(9 + z * 6);  // 10px to 15px

      const baseOpacity = isMath
        ? 0.08 + z * 0.14        // 0.09 to 0.22
        : 0.07 + z * 0.11;       // 0.08 to 0.18

      // Movement velocities
      let vx = 0;
      let vy = 0;

      if (pattern === 'horizontal') {
        vx = (i % 2 === 0 ? 1 : -1) * (0.08 + Math.random() * 0.10);
        vy = (Math.random() - 0.5) * 0.04;
      } else if (pattern === 'diagonal_up') {
        vx = (i % 2 === 0 ? 1 : -1) * (0.07 + Math.random() * 0.08);
        vy = -(0.06 + Math.random() * 0.08);
      } else if (pattern === 'diagonal_down') {
        vx = (i % 2 === 0 ? 1 : -1) * (0.07 + Math.random() * 0.08);
        vy = 0.05 + Math.random() * 0.07;
      } else if (pattern === 'orbital') {
        vx = 0;
        vy = 0;
      } else if (pattern === 'depth_wave') {
        vx = (i % 2 === 0 ? 1 : -1) * (0.05 + Math.random() * 0.06);
        vy = -(0.04 + Math.random() * 0.05);
      } else { // sinusoidal
        vx = (i % 2 === 0 ? 1 : -1) * (0.08 + Math.random() * 0.09);
        vy = -(0.05 + Math.random() * 0.06);
      }

      floatingObjects.push({
        type: isMath ? 'math' : 'english',
        text,
        x: sectorX * width,
        y: sectorY * height,
        z,
        vx,
        vy,
        pattern,
        baseSize,
        baseOpacity,
        angle: (Math.random() - 0.5) * 0.14,
        rotSpeed: (Math.random() - 0.5) * 0.0003,
        wavePhase: Math.random() * Math.PI * 2,
        waveSpeed: 0.0007 + Math.random() * 0.0008,
        waveAmp: 7 + Math.random() * 11,
        orbitCenter: { xRatio: sectorX, yRatio: sectorY },
        orbitRadius: { rx: 25 + Math.random() * 35, ry: 15 + Math.random() * 20 },
        orbitSpeed: (i % 2 === 0 ? 1 : -1) * (0.0008 + Math.random() * 0.0006),
      });
    }

    // -------------------------------------------------------------------------
    // 4. 3D WIREFRAME GEOMETRY (Spacious outer placement)
    // -------------------------------------------------------------------------
    const cubeVertices: Point3D[] = [
      { x: -1, y: -1, z: -1 }, { x: 1, y: -1, z: -1 },
      { x: 1, y: 1, z: -1 }, { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 }, { x: 1, y: -1, z: 1 },
      { x: 1, y: 1, z: 1 }, { x: -1, y: 1, z: 1 },
    ];
    const cubeEdges: [number, number][] = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];

    const octaVertices: Point3D[] = [
      { x: 0, y: -1.3, z: 0 }, { x: 0, y: 1.3, z: 0 },
      { x: -1, y: 0, z: 0 }, { x: 1, y: 0, z: 0 },
      { x: 0, y: 0, z: -1 }, { x: 0, y: 0, z: 1 },
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
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = p.x * cosY + p.z * sinY;
      const z1 = -p.x * sinY + p.z * cosY;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;

      const cosZ = Math.cos(rotZ);
      const sinZ = Math.sin(rotZ);
      const x3 = x1 * cosZ - y2 * sinZ;
      const y3 = x1 * sinZ + y2 * cosZ;

      const fov = 350;
      const distance = 400 + z2 * scale;
      const proj = fov / Math.max(distance, 100);

      return {
        x: centerX + x3 * scale * proj,
        y: centerY + y3 * scale * proj,
      };
    };

    // -------------------------------------------------------------------------
    // 5. INVISIBLE SAFE ZONES: Dynamic Alpha Attenuation for Readability
    // -------------------------------------------------------------------------
    // Calculates opacity reduction factor when an element drifts over primary content
    const computeSafeZoneFactor = (objX: number, objY: number, viewW: number, viewH: number): number => {
      // Safe Zone 1, 2, 3: Hero Headline, Description, CTAs (Left Column)
      const textLeft = viewW * 0.05;
      const textRight = viewW * 0.49;
      const textTop = viewH * 0.14;
      const textBottom = viewH * 0.62;

      // Safe Zone 4: Main 3D Laptop UI & Books (Right Column)
      const laptopLeft = viewW * 0.52;
      const laptopRight = viewW * 0.95;
      const laptopTop = viewH * 0.18;
      const laptopBottom = viewH * 0.78;

      const margin = 50; // smooth fade margin

      // Inside hero text area
      if (
        objX >= textLeft - margin &&
        objX <= textRight + margin &&
        objY >= textTop - margin &&
        objY <= textBottom + margin
      ) {
        const dx = Math.max(0, Math.min(objX - textLeft, textRight - objX));
        const dy = Math.max(0, Math.min(objY - textTop, textBottom - objY));
        const depth = Math.min(dx, dy);
        return Math.max(0.04, 1.0 - (depth / margin) * 0.95);
      }

      // Inside laptop area
      if (
        objX >= laptopLeft - margin &&
        objX <= laptopRight + margin &&
        objY >= laptopTop - margin &&
        objY <= laptopBottom + margin
      ) {
        const dx = Math.max(0, Math.min(objX - laptopLeft, laptopRight - objX));
        const dy = Math.max(0, Math.min(objY - laptopTop, laptopBottom - objY));
        const depth = Math.min(dx, dy);
        return Math.max(0.04, 1.0 - (depth / margin) * 0.95);
      }

      return 1.0;
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

      // Smooth Lerp for Subtle Depth Parallax (Never overtakes autonomous motion)
      const mouseFactor = prefersReducedMotion ? 0 : 0.04;
      mouseRef.current.currentX +=
        (mouseRef.current.targetX - mouseRef.current.currentX) * mouseFactor;
      mouseRef.current.currentY +=
        (mouseRef.current.targetY - mouseRef.current.currentY) * mouseFactor;

      const parallaxX = mouseRef.current.currentX * 14;
      const parallaxY = mouseRef.current.currentY * 10;

      // Smooth Lerp for Scroll Parallax
      scrollRef.current.currentY +=
        (scrollRef.current.targetY - scrollRef.current.currentY) * 0.05;
      const scrollShift = (scrollRef.current.currentY * 0.07) % height;

      // -----------------------------------------------------------------------
      // A. FLOWING GOLD LIGHT TRAILS / RIBBONS (Subtle, breathing wave curves)
      // -----------------------------------------------------------------------
      if (!isLowPerformance) {
        const ribbonY = height * 0.38 + Math.sin(time * 0.3) * 20 + parallaxY * 0.2;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, ribbonY);
        for (let x = 0; x <= width; x += 45) {
          const wave =
            Math.sin(x * 0.0022 + time * 0.5) * 30 +
            Math.cos(x * 0.0035 - time * 0.35) * 18;
          ctx.lineTo(x, ribbonY + wave);
        }
        const grad = ctx.createLinearGradient(0, ribbonY - 25, width, ribbonY + 25);
        grad.addColorStop(0, 'rgba(217, 169, 58, 0)');
        grad.addColorStop(0.3, 'rgba(217, 169, 58, 0.04)');
        grad.addColorStop(0.7, 'rgba(243, 210, 118, 0.055)');
        grad.addColorStop(1, 'rgba(217, 169, 58, 0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.1;
        ctx.setLineDash([8, 14]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      // -----------------------------------------------------------------------
      // B. 3D ROTATING WIREFRAME GEOMETRY (Positioned in spacious negative margins)
      // -----------------------------------------------------------------------
      if (!isLowPerformance) {
        // 1. 3D Cube in far-left negative space
        const cubeCenter = {
          x: width * 0.06 + parallaxX * 0.35,
          y: height * 0.32 + Math.sin(time * 0.35) * 12 + parallaxY * 0.35,
        };
        const rotCube = prefersReducedMotion ? 0.3 : time * 0.16;
        const projectedCube = cubeVertices.map((v) =>
          project3D(v, rotCube * 0.8, rotCube, rotCube * 0.5, 36, cubeCenter.x, cubeCenter.y)
        );

        ctx.save();
        ctx.strokeStyle = 'rgba(217, 169, 58, 0.12)';
        ctx.lineWidth = 0.85;
        ctx.setLineDash([3, 5]);
        cubeEdges.forEach(([i, j]) => {
          ctx.beginPath();
          ctx.moveTo(projectedCube[i].x, projectedCube[i].y);
          ctx.lineTo(projectedCube[j].x, projectedCube[j].y);
          ctx.stroke();
        });
        ctx.setLineDash([]);
        ctx.restore();

        // 2. 3D Octahedron in far-right negative space
        const octaCenter = {
          x: width * 0.94 + parallaxX * 0.4,
          y: height * 0.65 + Math.cos(time * 0.4) * 14 + parallaxY * 0.4,
        };
        const rotOcta = prefersReducedMotion ? 0.25 : time * 0.18;
        const projectedOcta = octaVertices.map((v) =>
          project3D(v, rotOcta * 0.6, -rotOcta * 0.85, rotOcta * 0.3, 34, octaCenter.x, octaCenter.y)
        );

        ctx.save();
        ctx.strokeStyle = 'rgba(243, 210, 118, 0.12)';
        ctx.lineWidth = 0.85;
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
      // C. SPATIALLY DISTRIBUTED FLOATING ELEMENTS (Math & English)
      // Autonomous continuous movement across diverse patterns + Safe Zone protection
      // -----------------------------------------------------------------------
      floatingObjects.forEach((obj) => {
        if (!prefersReducedMotion) {
          if (obj.pattern === 'orbital' && obj.orbitCenter && obj.orbitRadius && obj.orbitSpeed) {
            obj.wavePhase += obj.orbitSpeed;
            obj.x = width * obj.orbitCenter.xRatio + Math.cos(obj.wavePhase) * obj.orbitRadius.rx;
            obj.y = height * obj.orbitCenter.yRatio + Math.sin(obj.wavePhase) * obj.orbitRadius.ry;
          } else {
            obj.x += obj.vx;
            obj.y += obj.vy;
            obj.wavePhase += obj.waveSpeed;
            obj.angle += obj.rotSpeed;

            if (obj.pattern === 'depth_wave') {
              obj.z = 0.25 + 0.35 * (1 + Math.sin(obj.wavePhase * 0.7));
            }
          }
        }

        // Seamless wrap-around edges
        if (obj.y < -50) obj.y = height + 40;
        if (obj.y > height + 50) obj.y = -40;
        if (obj.x < -80) obj.x = width + 70;
        if (obj.x > width + 80) obj.x = -70;

        // Dynamic Safe Zone Attenuation (keeps hero headline & laptop 100% readable!)
        const safeFactor = computeSafeZoneFactor(obj.x, obj.y, width, height);

        // Smooth boundary fade
        const edgeFadeX = Math.min(1, Math.min(obj.x, width - obj.x) / 80);
        const edgeFadeY = Math.min(1, Math.min(obj.y, height - obj.y) / 80);
        const edgeAlpha = Math.max(0, edgeFadeX * edgeFadeY);

        const finalAlpha = obj.baseOpacity * edgeAlpha * safeFactor;

        // Skip rendering if practically invisible
        if (finalAlpha < 0.02) return;

        const floatWave = Math.sin(obj.wavePhase) * obj.waveAmp;
        const depthFactor = 0.35 + obj.z * 0.65;
        const finalX = obj.x + parallaxX * depthFactor;
        const finalY = obj.y + floatWave + parallaxY * depthFactor;

        ctx.save();
        ctx.translate(finalX, finalY);
        ctx.rotate(obj.angle);

        // True Depth Color & Glow:
        // Distant (z < 0.35): bronze-gold
        // Mid (0.35 - 0.70): classic Lumos gold
        // Near (z > 0.70): radiant bright gold
        let colorStr = `rgba(225, 180, 75, ${finalAlpha})`;
        if (obj.z > 0.70) {
          colorStr = `rgba(255, 238, 180, ${finalAlpha})`;
        } else if (obj.z < 0.35) {
          colorStr = `rgba(195, 150, 60, ${finalAlpha})`;
        }

        if (obj.type === 'math') {
          ctx.font = `italic 600 ${obj.baseSize}px "Playfair Display", Georgia, serif`;
          ctx.fillStyle = colorStr;
          ctx.fillText(obj.text, 0, 0);
        } else {
          ctx.font = `600 ${obj.baseSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
          ctx.fillStyle = colorStr;
          ctx.letterSpacing = '1.8px';
          ctx.fillText(obj.text, 0, 0);
        }
        ctx.restore();
      });

      // -----------------------------------------------------------------------
      // D. MULTI-TIER PRE-RENDERED GLOW PARTICLES (GPU Blitting)
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
      {/* 
        Two Large Rare Ambient Light Anchors in Deep Background
        Pure CSS Radial Gradients with GPU blur (zero per-frame CPU computation)
      */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080607] via-[#120609] to-[#080607] opacity-95" />
      <div className="absolute top-0 right-0 w-[55vw] h-[55vw] rounded-full bg-radial from-[#520E1F]/20 via-[#22070D]/08 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[45vw] h-[45vw] rounded-full bg-radial from-[#D9A93A]/05 via-[#22070D]/07 to-transparent blur-3xl pointer-events-none" />

      {/* Global High-Performance 60FPS Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
    </div>
  );
};
