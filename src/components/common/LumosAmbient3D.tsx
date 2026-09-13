import React, { useEffect, useRef } from 'react';

interface LumosAmbient3DProps {
  className?: string;
  activeSection?: string;
}

// -----------------------------------------------------------------------------
// TYPES & DATA STRUCTURES
// -----------------------------------------------------------------------------

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Particle3D {
  x: number;
  y: number;
  z: number; // 0 (near) to 850 (far)
  vx: number;
  vy: number;
  vz: number;
  alpha: number;
  phase: number;
  pulseSpeed: number;
  tier: number; // 0: dust (70%), 1: small dot (20%), 2: medium orb (8%), 3: large light (2%)
}

type MovementType = 'horizontal' | 'diagonal' | 'orbital' | 'depth_wave' | 'sinusoidal' | 'gentle_float';

interface EducationalToken3D {
  id: string;
  category: 'math' | 'english' | 'book';
  text: string;
  x: number;
  y: number;
  z: number; // 50 (near) to 800 (very far)
  vx: number;
  vy: number;
  vz: number;
  movement: MovementType;
  baseSize: number;
  baseOpacity: number;
  angleX: number;
  angleY: number;
  angleZ: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  wavePhase: number;
  waveSpeed: number;
  waveAmp: number;
  orbitCenter?: { x: number; y: number; z: number };
  orbitRadius?: { rx: number; ry: number };
  orbitSpeed?: number;
  hoverReaction?: number; // 0 to 1 smooth hover transition
}

interface VirtualLight3D {
  x: number;
  y: number;
  z: number;
  radius: number;
  intensity: number;
  color: string;
  speed: number;
  phase: number;
  orbitRx: number;
  orbitRy: number;
  centerX: number;
  centerY: number;
}

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

export const LumosAmbient3D: React.FC<LumosAmbient3DProps> = ({
  className = '',
  activeSection = 'hero',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // High performance state refs (0 React re-renders)
  const mouseRef = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    screenX: 0,
    screenY: 0,
  });
  const scrollRef = useRef({ targetY: 0, currentY: 0 });
  const activeSectionRef = useRef(activeSection);
  const startTimeRef = useRef(performance.now());

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
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Subtle Mouse Tracking with normalized values (-1 to 1)
    const handleMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseRef.current.targetX = (e.clientX - halfW) / halfW;
      mouseRef.current.targetY = (e.clientY - halfH) / halfH;
      mouseRef.current.screenX = e.clientX;
      mouseRef.current.screenY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Scroll Tracking
    const handleScroll = () => {
      scrollRef.current.targetY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // -------------------------------------------------------------------------
    // 1. PRE-RENDERED GPU GLOW SPRITES (Zero CPU shadowBlur)
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
      grad.addColorStop(1, 'rgba(217, 168, 63, 0)');

      offCtx.fillStyle = grad;
      offCtx.beginPath();
      offCtx.arc(center, center, center, 0, Math.PI * 2);
      offCtx.fill();

      return offCanvas;
    };

    // Pre-cache 4 particle tiers + 2 virtual light aura textures
    const spriteDust = createGlowSprite(14, 2, 'rgba(255, 238, 195, 0.9)', 'rgba(217, 168, 63, 0.35)');
    const spriteDot = createGlowSprite(24, 3, 'rgba(255, 245, 215, 0.95)', 'rgba(243, 210, 118, 0.5)');
    const spriteOrb = createGlowSprite(44, 6, 'rgba(243, 210, 118, 0.85)', 'rgba(217, 168, 63, 0.35)');
    const spriteLargeLight = createGlowSprite(96, 14, 'rgba(255, 235, 170, 0.8)', 'rgba(217, 168, 63, 0.25)');
    const spriteVirtualLightAura = createGlowSprite(180, 25, 'rgba(255, 235, 170, 0.45)', 'rgba(217, 168, 63, 0.15)');
    const particleSprites = [spriteDust, spriteDot, spriteOrb, spriteLargeLight];

    // -------------------------------------------------------------------------
    // 2. TRUE 3D PROJECTION PIPELINE
    // -------------------------------------------------------------------------
    const fov = 420;
    const project = (
      p: Point3D,
      camX: number,
      camY: number,
      camZ: number,
      parallaxX: number,
      parallaxY: number
    ) => {
      // Relative to camera position
      const relX = p.x - (width / 2 + camX);
      const relY = p.y - (height / 2 + camY);
      const relZ = Math.max(p.z + camZ, 10);

      // Depth scaling factor
      const scale = fov / (fov + relZ);

      // Projected screen coordinates
      const projX = width / 2 + relX * scale + parallaxX * scale;
      const projY = height / 2 + relY * scale + parallaxY * scale;

      return { x: projX, y: projY, scale, z: relZ };
    };

    // -------------------------------------------------------------------------
    // 3. VIRTUAL MOVING LIGHT SOURCES IN 3D SPACE
    // -------------------------------------------------------------------------
    const virtualLights: VirtualLight3D[] = [
      // Light 1: Warm amber light slowly orbiting Knowledge Core
      {
        x: width * 0.72,
        y: height * 0.38,
        z: 280,
        radius: 320,
        intensity: 0.9,
        color: 'rgba(255, 235, 170, 0.4)',
        speed: 0.0009,
        phase: 0,
        orbitRx: 180,
        orbitRy: 100,
        centerX: width * 0.72,
        centerY: height * 0.38,
      },
      // Light 2: Soft champagne light drifting across mid-depth left flank
      {
        x: width * 0.28,
        y: height * 0.45,
        z: 380,
        radius: 360,
        intensity: 0.75,
        color: 'rgba(243, 210, 118, 0.35)',
        speed: -0.0007,
        phase: Math.PI * 0.6,
        orbitRx: 210,
        orbitRy: 130,
        centerX: width * 0.28,
        centerY: height * 0.45,
      },
      // Light 3: Deep atmospheric ambient wine-gold light in upper cosmic background
      {
        x: width * 0.5,
        y: height * 0.15,
        z: 550,
        radius: 420,
        intensity: 0.65,
        color: 'rgba(217, 168, 63, 0.3)',
        speed: 0.0005,
        phase: Math.PI * 1.3,
        orbitRx: 260,
        orbitRy: 80,
        centerX: width * 0.5,
        centerY: height * 0.15,
      },
    ];

    // -------------------------------------------------------------------------
    // 4. PARTICLES 3D POOL
    // -------------------------------------------------------------------------
    let maxParticles = isMobile ? 35 : isTablet ? 55 : 85;
    const particles: Particle3D[] = Array.from({ length: maxParticles }, () => {
      const rand = Math.random();
      let tier = 0;
      if (rand > 0.98) tier = 3;
      else if (rand > 0.90) tier = 2;
      else if (rand > 0.70) tier = 1;
      else tier = 0;

      const z = Math.random() * 800 + 30; // 30 to 830
      return {
        x: Math.random() * (width * 1.4) - width * 0.2,
        y: Math.random() * (height * 1.4) - height * 0.2,
        z,
        vx: (Math.random() - 0.5) * (0.15 + (1 - z / 850) * 0.25),
        vy: -(0.18 + Math.random() * 0.35 + (1 - z / 850) * 0.3),
        vz: (Math.random() - 0.5) * 0.15,
        alpha: tier === 3 ? 0.35 : 0.2 + (1 - z / 850) * 0.6,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.008 + Math.random() * 0.018,
        tier,
      };
    });

    // -------------------------------------------------------------------------
    // 5. EDUCATIONAL TOKENS 3D (Mathematics & English Fields + Books)
    // Distributed in 3D space with strict sector division & negative space
    // -------------------------------------------------------------------------
    const mathSymbols = [
      'π', '∑', '√x', 'a² + b² = c²', 'x²', '∫ f(x)dx', 'dy/dx',
      '∞', 'f(x)', 'x + y = z', '△', '○', '□', 'lim x→∞'
    ];

    const englishWords = [
      'LEARN', 'VOCABULARY', 'GRAMMAR', 'SPEAK', 'FUTURE', 'KNOWLEDGE',
      'PROGRESS', 'SUCCESS', 'PRACTICE', 'ENGLISH', 'Aa', 'ABC'
    ];

    const tokens: EducationalToken3D[] = [];
    const totalTokens = mathSymbols.length + englishWords.length;

    // Grid coordinates in normalized 3D space to guarantee no initial collisions
    const cols = 6;
    const rows = 5;

    let mCount = 0;
    let eCount = 0;

    for (let i = 0; i < totalTokens; i++) {
      const isMath = i % 2 === 0 ? mCount < mathSymbols.length : eCount >= englishWords.length;
      const text = isMath ? mathSymbols[mCount++] : englishWords[eCount++];

      const c = i % cols;
      const r = Math.floor(i / cols) % rows;

      // Position in 3D world space (spacious margins)
      const worldX = (c + 0.2 + Math.random() * 0.6) * (width / cols);
      const worldY = (r + 0.15 + Math.random() * 0.7) * (height / rows);

      // Depth stratification: 30% very far, 40% mid, 30% near
      const depthRand = Math.random();
      let z = 350;
      if (depthRand < 0.30) {
        z = 580 + Math.random() * 220; // Very Far: 580 - 800
      } else if (depthRand < 0.70) {
        z = 260 + Math.random() * 260; // Mid: 260 - 520
      } else {
        z = 70 + Math.random() * 160;  // Near: 70 - 230
      }

      const movementTypes: MovementType[] = [
        'horizontal', 'diagonal', 'orbital', 'depth_wave', 'sinusoidal', 'gentle_float'
      ];
      const movement = movementTypes[i % movementTypes.length];

      // Base sizes and opacities strictly modulated by depth
      const depthRatio = 1 - z / 850; // 0 (far) to 1 (near)
      const baseSize = isMath
        ? Math.floor(11 + depthRatio * 11) // 11px to 22px
        : Math.floor(9 + depthRatio * 8);   // 9px to 17px

      const baseOpacity = isMath
        ? 0.08 + depthRatio * 0.15        // 0.08 to 0.23
        : 0.07 + depthRatio * 0.12;       // 0.07 to 0.19

      // Movement velocities
      let vx = (i % 2 === 0 ? 1 : -1) * (0.07 + Math.random() * 0.09);
      let vy = (Math.random() - 0.5) * 0.05;
      let vz = (Math.random() - 0.5) * 0.08;

      if (movement === 'diagonal') {
        vy = -(0.06 + Math.random() * 0.08);
      } else if (movement === 'depth_wave') {
        vz = 0.12;
      }

      tokens.push({
        id: `token-${i}`,
        category: isMath ? 'math' : 'english',
        text,
        x: worldX,
        y: worldY,
        z,
        vx,
        vy,
        vz,
        movement,
        baseSize,
        baseOpacity,
        angleX: 0,
        angleY: 0,
        angleZ: (Math.random() - 0.5) * 0.12,
        rotSpeedX: 0,
        rotSpeedY: 0,
        rotSpeedZ: (Math.random() - 0.5) * 0.0003,
        wavePhase: Math.random() * Math.PI * 2,
        waveSpeed: 0.0006 + Math.random() * 0.0008,
        waveAmp: 6 + Math.random() * 10,
        orbitCenter: { x: worldX, y: worldY, z },
        orbitRadius: { rx: 30 + Math.random() * 40, ry: 18 + Math.random() * 24 },
        orbitSpeed: (i % 2 === 0 ? 1 : -1) * (0.0007 + Math.random() * 0.0005),
        hoverReaction: 0,
      });
    }

    // Two 3D Books floating in the background: MATEMATIKA & INGLIZ TILI
    const backgroundBooks = [
      {
        title: 'MATEMATIKA',
        x: width * 0.12,
        y: height * 0.65,
        z: 190,
        coverColor: '#4A0E17',
        spineColor: '#6B1422',
        width: 65,
        height: 85,
        thickness: 16,
        rotX: 0.22,
        rotY: -0.35,
        rotZ: 0.08,
      },
      {
        title: 'INGLIZ TILI',
        x: width * 0.88,
        y: height * 0.28,
        z: 220,
        coverColor: '#0F1E36',
        spineColor: '#1A2E4C',
        width: 62,
        height: 82,
        thickness: 15,
        rotX: -0.18,
        rotY: 0.32,
        rotZ: -0.06,
      },
    ];

    // -------------------------------------------------------------------------
    // 6. 3D GLASS WIREFRAME GEOMETRY (Cube & Octahedron)
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

    const rotatePoint = (p: Point3D, rotX: number, rotY: number, rotZ: number): Point3D => {
      // Rot Y
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = p.x * cosY + p.z * sinY;
      const z1 = -p.x * sinY + p.z * cosY;
      // Rot X
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;
      // Rot Z
      const cosZ = Math.cos(rotZ);
      const sinZ = Math.sin(rotZ);
      const x3 = x1 * cosZ - y2 * sinZ;
      const y3 = x1 * sinZ + y2 * cosZ;
      return { x: x3, y: y3, z: z2 };
    };

    // -------------------------------------------------------------------------
    // 7. INVISIBLE SAFE ZONES: Dynamic Alpha Attenuation for Readability
    // -------------------------------------------------------------------------
    const computeSafeZoneFactor = (projX: number, projY: number): number => {
      // Safe Zone 1, 2, 3: Hero Headline, Description, CTAs (Left Column)
      const textLeft = width * 0.05;
      const textRight = width * 0.49;
      const textTop = height * 0.14;
      const textBottom = height * 0.62;

      // Safe Zone 4: Main 3D Laptop UI & Books (Right Column)
      const laptopLeft = width * 0.52;
      const laptopRight = width * 0.95;
      const laptopTop = height * 0.18;
      const laptopBottom = height * 0.78;

      const margin = 50;

      // Inside hero text area
      if (
        projX >= textLeft - margin &&
        projX <= textRight + margin &&
        projY >= textTop - margin &&
        projY <= textBottom + margin
      ) {
        const dx = Math.max(0, Math.min(projX - textLeft, textRight - projX));
        const dy = Math.max(0, Math.min(projY - textTop, textBottom - projY));
        const depth = Math.min(dx, dy);
        return Math.max(0.03, 1.0 - (depth / margin) * 0.96);
      }

      // Inside laptop area
      if (
        projX >= laptopLeft - margin &&
        projX <= laptopRight + margin &&
        projY >= laptopTop - margin &&
        projY <= laptopBottom + margin
      ) {
        const dx = Math.max(0, Math.min(projX - laptopLeft, laptopRight - projX));
        const dy = Math.max(0, Math.min(projY - laptopTop, laptopBottom - projY));
        const depth = Math.min(dx, dy);
        return Math.max(0.03, 1.0 - (depth / margin) * 0.96);
      }

      return 1.0;
    };

    // -------------------------------------------------------------------------
    // 8. DYNAMIC PROXIMITY LIGHTING CALCULATION
    // -------------------------------------------------------------------------
    const getLightBoost = (x: number, y: number, z: number): number => {
      let maxBoost = 0;
      for (let i = 0; i < virtualLights.length; i++) {
        const vl = virtualLights[i];
        const dx = x - vl.x;
        const dy = y - vl.y;
        const dz = z - vl.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        const radSq = vl.radius * vl.radius;
        if (distSq < radSq) {
          const factor = 1 - Math.sqrt(distSq) / vl.radius;
          const boost = factor * vl.intensity * 0.65;
          if (boost > maxBoost) maxBoost = boost;
        }
      }
      return maxBoost;
    };

    // -------------------------------------------------------------------------
    // 9. MAIN 60 FPS RENDER LOOP
    // -------------------------------------------------------------------------
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsAccumulator = 0;
    let isLowPerformance = false;

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const elapsed = (now - startTimeRef.current) / 1000;

      // Signature Initial Cinematic Reveal (2.5 seconds ease-out)
      const revealProgress = prefersReducedMotion
        ? 1.0
        : Math.min(1.0, Math.pow(elapsed / 2.5, 1.6));

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

      // Smooth Camera Floating Drift
      const camX = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.15) * 16;
      const camY = prefersReducedMotion ? 0 : Math.cos(elapsed * 0.12) * 12;
      const camZ = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.18) * 20;

      // Mouse Parallax with Low Sensitivity
      const mouseFactor = prefersReducedMotion ? 0 : 0.04;
      mouseRef.current.currentX +=
        (mouseRef.current.targetX - mouseRef.current.currentX) * mouseFactor;
      mouseRef.current.currentY +=
        (mouseRef.current.targetY - mouseRef.current.currentY) * mouseFactor;

      const parallaxX = mouseRef.current.currentX * 16;
      const parallaxY = mouseRef.current.currentY * 12;

      // Scroll Parallax
      scrollRef.current.currentY +=
        (scrollRef.current.targetY - scrollRef.current.currentY) * 0.05;
      const scrollShift = (scrollRef.current.currentY * 0.07) % height;

      // Update Virtual 3D Moving Lights
      virtualLights.forEach((vl) => {
        if (!prefersReducedMotion) {
          vl.phase += vl.speed;
          vl.x = vl.centerX + Math.cos(vl.phase) * vl.orbitRx;
          vl.y = vl.centerY + Math.sin(vl.phase) * vl.orbitRy;
        }

        // Draw light source aura
        const projLight = project(
          { x: vl.x, y: vl.y, z: vl.z },
          camX, camY, camZ, parallaxX, parallaxY
        );
        const lightSize = spriteVirtualLightAura.width * projLight.scale * 1.5;
        ctx.globalAlpha = vl.intensity * 0.45 * revealProgress;
        ctx.drawImage(
          spriteVirtualLightAura,
          projLight.x - lightSize / 2,
          projLight.y - lightSize / 2,
          lightSize,
          lightSize
        );
      });
      ctx.globalAlpha = 1.0;

      // -----------------------------------------------------------------------
      // A. VOLUMETRIC ATMOSPHERIC LIGHT CONES (Subtle God-Rays from Corners)
      // -----------------------------------------------------------------------
      if (!isLowPerformance) {
        // Top-right subtle volumetric cone
        ctx.save();
        const gradTR = ctx.createRadialGradient(
          width * 0.85, 0, 10,
          width * 0.7, height * 0.5, width * 0.6
        );
        gradTR.addColorStop(0, 'rgba(243, 210, 118, 0.04)');
        gradTR.addColorStop(0.5, 'rgba(217, 168, 63, 0.015)');
        gradTR.addColorStop(1, 'rgba(5, 3, 4, 0)');
        ctx.fillStyle = gradTR;
        ctx.fillRect(0, 0, width, height);

        // Top-left subtle volumetric cone
        const gradTL = ctx.createRadialGradient(
          width * 0.15, 0, 10,
          width * 0.3, height * 0.45, width * 0.5
        );
        gradTL.addColorStop(0, 'rgba(217, 168, 63, 0.035)');
        gradTL.addColorStop(0.5, 'rgba(82, 14, 31, 0.02)');
        gradTL.addColorStop(1, 'rgba(5, 3, 4, 0)');
        ctx.fillStyle = gradTL;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // -----------------------------------------------------------------------
      // B. CENTRAL "KNOWLEDGE CORE" & MULTI-RING ORBITAL SYSTEM
      // -----------------------------------------------------------------------
      const core3D: Point3D = {
        x: width * 0.72,
        y: height * 0.38,
        z: 320,
      };
      const projCore = project(core3D, camX, camY, camZ, parallaxX, parallaxY);

      if (projCore.scale > 0) {
        ctx.save();
        ctx.translate(projCore.x, projCore.y);

        const coreAlpha = 0.85 * revealProgress;

        // Ring 1: Inner Dashed Mathematical Ring (Radius 110 * scale)
        const r1 = 110 * projCore.scale;
        ctx.save();
        ctx.rotate(prefersReducedMotion ? 0.2 : elapsed * 0.04);
        ctx.beginPath();
        ctx.arc(0, 0, r1, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(243, 210, 118, ${0.18 * coreAlpha})`;
        ctx.lineWidth = 1.1;
        ctx.setLineDash([4, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Ring 2: Tilted 3D Coordinate Ellipse (Radius 190 * scale, tilted 25 deg)
        const r2x = 190 * projCore.scale;
        const r2y = 115 * projCore.scale;
        ctx.save();
        ctx.rotate(-0.4 + (prefersReducedMotion ? 0 : elapsed * 0.015));
        ctx.beginPath();
        ctx.ellipse(0, 0, r2x, r2y, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(217, 168, 63, ${0.14 * coreAlpha})`;
        ctx.lineWidth = 1.0;
        ctx.stroke();

        // Orbit node traversing Ring 2
        const nodeAngle2 = prefersReducedMotion ? 0.8 : elapsed * 0.25;
        const nx2 = Math.cos(nodeAngle2) * r2x;
        const ny2 = Math.sin(nodeAngle2) * r2y;
        ctx.beginPath();
        ctx.arc(nx2, ny2, 2.5 * projCore.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 245, 215, ${0.75 * coreAlpha})`;
        ctx.fill();
        ctx.restore();

        // Ring 3: Outer Partial Arc with Mathematical Ticks (Radius 270 * scale)
        const r3 = 270 * projCore.scale;
        ctx.save();
        ctx.rotate(0.35 + (prefersReducedMotion ? 0 : -elapsed * 0.018));
        ctx.beginPath();
        ctx.arc(0, 0, r3, -Math.PI * 0.6, Math.PI * 0.7);
        ctx.strokeStyle = `rgba(243, 210, 118, ${0.11 * coreAlpha})`;
        ctx.lineWidth = 0.9;
        ctx.setLineDash([6, 12]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Ring 4: Distant Subtle Cosmic Boundary (Radius 360 * scale)
        const r4 = 360 * projCore.scale;
        ctx.beginPath();
        ctx.arc(0, 0, r4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(217, 168, 63, ${0.06 * coreAlpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        ctx.restore();
      }

      // Left-Flank Secondary Orbital Center (Behind Hero Headline)
      const leftCore3D: Point3D = {
        x: width * 0.22,
        y: height * 0.35,
        z: 460,
      };
      const projLeftCore = project(leftCore3D, camX, camY, camZ, parallaxX, parallaxY);

      if (projLeftCore.scale > 0 && !isLowPerformance) {
        ctx.save();
        ctx.translate(projLeftCore.x, projLeftCore.y);
        ctx.rotate(0.2 + (prefersReducedMotion ? 0 : elapsed * 0.02));

        const rL = 140 * projLeftCore.scale;
        ctx.beginPath();
        ctx.ellipse(0, 0, rL, rL * 0.65, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(217, 168, 63, ${0.08 * revealProgress})`;
        ctx.lineWidth = 0.9;
        ctx.setLineDash([3, 7]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Orbit dot
        const aL = prefersReducedMotion ? 1.2 : -elapsed * 0.2;
        ctx.beginPath();
        ctx.arc(Math.cos(aL) * rL, Math.sin(aL) * (rL * 0.65), 2.0 * projLeftCore.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 235, 180, ${0.6 * revealProgress})`;
        ctx.fill();
        ctx.restore();
      }

      // -----------------------------------------------------------------------
      // C. SYNAPTIC LIGHT CONNECTIONS: Math + English Interconnection
      // Subtle gold bezier light filaments connecting complementary concepts
      // -----------------------------------------------------------------------
      if (!isLowPerformance) {
        // Path A: Math (π) -> English (ABC) -> Concept (Knowledge)
        const nodePi = project({ x: width * 0.72, y: height * 0.22, z: 280 }, camX, camY, camZ, parallaxX, parallaxY);
        const nodeABC = project({ x: width * 0.58, y: height * 0.48, z: 320 }, camX, camY, camZ, parallaxX, parallaxY);
        const nodeKnow = project({ x: width * 0.38, y: height * 0.72, z: 420 }, camX, camY, camZ, parallaxX, parallaxY);

        if (nodePi.scale > 0 && nodeABC.scale > 0 && nodeKnow.scale > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(nodePi.x, nodePi.y);
          ctx.quadraticCurveTo(
            (nodePi.x + nodeABC.x) / 2 + 25,
            (nodePi.y + nodeABC.y) / 2 - 20,
            nodeABC.x, nodeABC.y
          );
          ctx.quadraticCurveTo(
            (nodeABC.x + nodeKnow.x) / 2 - 20,
            (nodeABC.y + nodeKnow.y) / 2 + 15,
            nodeKnow.x, nodeKnow.y
          );
          ctx.strokeStyle = `rgba(243, 210, 118, ${0.05 * revealProgress})`;
          ctx.lineWidth = 1.1;
          ctx.setLineDash([4, 8]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Moving gold energy pulse along the synapse
          const pulseT = (elapsed * 0.15) % 1;
          const px = nodePi.x * (1 - pulseT) * (1 - pulseT) +
                     2 * ((nodePi.x + nodeABC.x) / 2) * (1 - pulseT) * pulseT +
                     nodeABC.x * pulseT * pulseT;
          const py = nodePi.y * (1 - pulseT) * (1 - pulseT) +
                     2 * ((nodePi.y + nodeABC.y) / 2) * (1 - pulseT) * pulseT +
                     nodeABC.y * pulseT * pulseT;

          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 245, 210, ${0.7 * revealProgress})`;
          ctx.shadowColor = 'rgba(217, 168, 63, 0.8)';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.restore();
        }
      }

      // -----------------------------------------------------------------------
      // D. 3D GLASS WIREFRAME GEOMETRY (Cube & Octahedron in Negative Space)
      // -----------------------------------------------------------------------
      if (!isLowPerformance) {
        // 1. 3D Cube in far-left negative space
        const cubeCenter3D: Point3D = {
          x: width * 0.07,
          y: height * 0.32 + Math.sin(elapsed * 0.35) * 14,
          z: 280,
        };
        const projCubeCenter = project(cubeCenter3D, camX, camY, camZ, parallaxX, parallaxY);

        if (projCubeCenter.scale > 0) {
          const rotCube = prefersReducedMotion ? 0.3 : elapsed * 0.18;
          const cubeScale = 38 * projCubeCenter.scale;
          const projectedCube = cubeVertices.map((v) => {
            const rot = rotatePoint(v, rotCube * 0.8, rotCube, rotCube * 0.5);
            return {
              x: projCubeCenter.x + rot.x * cubeScale,
              y: projCubeCenter.y + rot.y * cubeScale,
            };
          });

          ctx.save();
          const cubeLightBoost = getLightBoost(cubeCenter3D.x, cubeCenter3D.y, cubeCenter3D.z);
          ctx.strokeStyle = `rgba(243, 210, 118, ${(0.13 + cubeLightBoost) * revealProgress})`;
          ctx.lineWidth = 0.95;
          ctx.setLineDash([3, 6]);
          cubeEdges.forEach(([i, j]) => {
            ctx.beginPath();
            ctx.moveTo(projectedCube[i].x, projectedCube[i].y);
            ctx.lineTo(projectedCube[j].x, projectedCube[j].y);
            ctx.stroke();
          });
          ctx.setLineDash([]);
          ctx.restore();
        }

        // 2. 3D Octahedron in far-right negative space
        const octaCenter3D: Point3D = {
          x: width * 0.93,
          y: height * 0.64 + Math.cos(elapsed * 0.4) * 16,
          z: 240,
        };
        const projOctaCenter = project(octaCenter3D, camX, camY, camZ, parallaxX, parallaxY);

        if (projOctaCenter.scale > 0) {
          const rotOcta = prefersReducedMotion ? 0.25 : elapsed * 0.22;
          const octaScale = 36 * projOctaCenter.scale;
          const projectedOcta = octaVertices.map((v) => {
            const rot = rotatePoint(v, rotOcta * 0.6, -rotOcta * 0.85, rotOcta * 0.3);
            return {
              x: projOctaCenter.x + rot.x * octaScale,
              y: projOctaCenter.y + rot.y * octaScale,
            };
          });

          ctx.save();
          const octaLightBoost = getLightBoost(octaCenter3D.x, octaCenter3D.y, octaCenter3D.z);
          ctx.strokeStyle = `rgba(255, 235, 170, ${(0.14 + octaLightBoost) * revealProgress})`;
          ctx.lineWidth = 0.95;
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
      }

      // -----------------------------------------------------------------------
      // E. FLOATING 3D BOOKS IN ENVIRONMENT (MATEMATIKA & INGLIZ TILI)
      // -----------------------------------------------------------------------
      if (!isLowPerformance && !isMobile) {
        backgroundBooks.forEach((bk, bIdx) => {
          const bookWave = Math.sin(elapsed * 0.4 + bIdx * 2.0) * 12;
          const projBook = project(
            { x: bk.x, y: bk.y + bookWave, z: bk.z },
            camX, camY, camZ, parallaxX, parallaxY
          );

          if (projBook.scale > 0) {
            const bw = bk.width * projBook.scale;
            const bh = bk.height * projBook.scale;
            const bThick = bk.thickness * projBook.scale;

            const safeFactor = computeSafeZoneFactor(projBook.x, projBook.y);
            const lightBoost = getLightBoost(bk.x, bk.y, bk.z);
            const alpha = (0.28 + lightBoost) * safeFactor * revealProgress;

            if (alpha > 0.03) {
              ctx.save();
              ctx.translate(projBook.x, projBook.y);
              ctx.rotate(bk.rotZ + Math.sin(elapsed * 0.3 + bIdx) * 0.05);

              // Hardcover Front Face
              ctx.beginPath();
              ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 3);
              ctx.fillStyle = bk.coverColor;
              ctx.globalAlpha = alpha * 0.95;
              ctx.fill();

              // Gold Edge Border
              ctx.strokeStyle = `rgba(243, 210, 118, ${alpha * 0.85})`;
              ctx.lineWidth = 1;
              ctx.stroke();

              // Book Spine Line
              ctx.beginPath();
              ctx.moveTo(-bw / 2 + bThick * 0.5, -bh / 2);
              ctx.lineTo(-bw / 2 + bThick * 0.5, bh / 2);
              ctx.strokeStyle = `rgba(255, 235, 170, ${alpha * 0.9})`;
              ctx.lineWidth = 1.2;
              ctx.stroke();

              // Gold Title on Cover
              ctx.font = `black ${Math.max(6, Math.floor(7.5 * projBook.scale))}px -apple-system, sans-serif`;
              ctx.fillStyle = `rgba(255, 245, 215, ${alpha * 1.1})`;
              ctx.letterSpacing = '1px';
              ctx.textAlign = 'center';
              ctx.fillText(bk.title, 0, 4);

              ctx.restore();
            }
          }
        });
      }

      // -----------------------------------------------------------------------
      // F. EDUCATIONAL TOKENS (Math & English Fields) WITH 3D PROJECTION
      // -----------------------------------------------------------------------
      tokens.forEach((tok) => {
        // Autonomous movement
        if (!prefersReducedMotion) {
          if (tok.movement === 'orbital' && tok.orbitCenter && tok.orbitRadius && tok.orbitSpeed) {
            tok.wavePhase += tok.orbitSpeed;
            tok.x = tok.orbitCenter.x + Math.cos(tok.wavePhase) * tok.orbitRadius.rx;
            tok.y = tok.orbitCenter.y + Math.sin(tok.wavePhase) * tok.orbitRadius.ry;
          } else {
            tok.x += tok.vx;
            tok.y += tok.vy;
            tok.wavePhase += tok.waveSpeed;
            tok.angleZ += tok.rotSpeedZ;

            if (tok.movement === 'depth_wave') {
              tok.z += tok.vz;
              if (tok.z > 680 || tok.z < 120) tok.vz = -tok.vz;
            }
          }
        }

        // Seamless wrap-around edges with randomized re-entry
        if (tok.y < -60) {
          tok.y = height + 50;
          tok.x = Math.random() * width;
          tok.z = 100 + Math.random() * 650;
        }
        if (tok.y > height + 60) {
          tok.y = -50;
          tok.x = Math.random() * width;
          tok.z = 100 + Math.random() * 650;
        }
        if (tok.x < -80) {
          tok.x = width + 70;
          tok.y = Math.random() * height;
        }
        if (tok.x > width + 80) {
          tok.x = -70;
          tok.y = Math.random() * height;
        }

        // Project to screen via true 3D camera
        const waveOffset = Math.sin(tok.wavePhase) * tok.waveAmp;
        const proj = project(
          { x: tok.x, y: tok.y + waveOffset, z: tok.z },
          camX, camY, camZ, parallaxX, parallaxY
        );

        if (proj.scale <= 0) return;

        // Dynamic Safe Zone Attenuation
        const safeFactor = computeSafeZoneFactor(proj.x, proj.y);

        // Edge fade
        const edgeFadeX = Math.min(1, Math.min(proj.x, width - proj.x) / 75);
        const edgeFadeY = Math.min(1, Math.min(proj.y, height - proj.y) / 75);
        const edgeAlpha = Math.max(0, edgeFadeX * edgeFadeY);

        // Dynamic Proximity Illumination from moving virtual lights
        const lightBoost = getLightBoost(tok.x, tok.y, tok.z);

        // Cursor proximity micro-reaction (hover highlight)
        const dxCursor = mouseRef.current.screenX - proj.x;
        const dyCursor = mouseRef.current.screenY - proj.y;
        const cursorDist = Math.sqrt(dxCursor * dxCursor + dyCursor * dyCursor);
        const isHovered = cursorDist < 60;
        tok.hoverReaction = (tok.hoverReaction || 0) + ((isHovered ? 1 : 0) - (tok.hoverReaction || 0)) * 0.1;

        const finalAlpha =
          (tok.baseOpacity + lightBoost + (tok.hoverReaction || 0) * 0.2) *
          edgeAlpha *
          safeFactor *
          revealProgress;

        if (finalAlpha < 0.02) return;

        ctx.save();
        ctx.translate(proj.x, proj.y);
        ctx.rotate(tok.angleZ + (tok.hoverReaction || 0) * 0.08);

        // Font size strictly scales with 3D perspective scale
        const renderSize = Math.max(8, Math.floor(tok.baseSize * proj.scale));

        // Atmospheric Depth Colors:
        // Distant (z > 500): warm bronze-gold
        // Mid (z 250 - 500): classic Lumos gold
        // Near (z < 250): radiant bright champagne gold
        let colorStr = `rgba(225, 180, 75, ${finalAlpha})`;
        if (tok.z < 250) {
          colorStr = `rgba(255, 240, 190, ${finalAlpha})`;
        } else if (tok.z > 500) {
          colorStr = `rgba(185, 140, 50, ${finalAlpha})`;
        }

        if (tok.category === 'math') {
          ctx.font = `italic 600 ${renderSize}px "Playfair Display", Georgia, serif`;
          ctx.fillStyle = colorStr;
          ctx.fillText(tok.text, 0, 0);
        } else {
          ctx.font = `600 ${renderSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
          ctx.fillStyle = colorStr;
          ctx.letterSpacing = `${Math.max(1, 1.8 * proj.scale)}px`;
          ctx.fillText(tok.text, 0, 0);
        }

        ctx.restore();
      });

      // -----------------------------------------------------------------------
      // G. 3D PARTICLE SYSTEMS WITH 3D PROJECTION & DEPTH BLITTING
      // -----------------------------------------------------------------------
      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;
          p.phase += p.pulseSpeed;
        }

        // Re-entry on screen escape
        if (p.y < -40) {
          p.y = height + 30;
          p.x = Math.random() * width;
          p.z = Math.random() * 800 + 30;
        }
        if (p.x < -40) p.x = width + 30;
        if (p.x > width + 40) p.x = -30;
        if (p.z < 20) p.z = 820;
        if (p.z > 840) p.z = 30;

        const proj = project(p, camX, camY, camZ, parallaxX, parallaxY);
        if (proj.scale <= 0) return;

        const pulse = 0.8 + 0.2 * Math.sin(p.phase);
        const sprite = particleSprites[p.tier];
        const spriteSize = sprite.width * proj.scale * 1.2;

        const pY = ((proj.y - scrollShift + height) % height);

        ctx.globalAlpha = p.alpha * pulse * revealProgress;
        ctx.drawImage(
          sprite,
          proj.x - spriteSize / 2,
          pY - spriteSize / 2,
          spriteSize,
          spriteSize
        );
      });
      ctx.globalAlpha = 1.0;

      // -----------------------------------------------------------------------
      // H. CONTINUOUS FLOWING GOLD LIGHT TRAILS
      // -----------------------------------------------------------------------
      if (!isLowPerformance) {
        const ribbonY = height * 0.38 + Math.sin(elapsed * 0.3) * 22 + parallaxY * 0.2;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, ribbonY);
        for (let x = 0; x <= width; x += 45) {
          const wave =
            Math.sin(x * 0.0022 + elapsed * 0.5) * 28 +
            Math.cos(x * 0.0035 - elapsed * 0.35) * 16;
          ctx.lineTo(x, ribbonY + wave);
        }
        const grad = ctx.createLinearGradient(0, ribbonY - 25, width, ribbonY + 25);
        grad.addColorStop(0, 'rgba(217, 169, 58, 0)');
        grad.addColorStop(0.3, `rgba(217, 169, 58, ${0.045 * revealProgress})`);
        grad.addColorStop(0.7, `rgba(255, 235, 170, ${0.065 * revealProgress})`);
        grad.addColorStop(1, 'rgba(217, 169, 58, 0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([8, 14]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

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
        Deep Black & Burgundy Base Atmospheric Gradients
        #050304 -> #0D0508 -> #16070B -> #220A0F
      */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050304] via-[#0D0508] to-[#050304] opacity-98" />
      <div className="absolute top-0 right-0 w-[58vw] h-[58vw] rounded-full bg-radial from-[#220A0F]/35 via-[#16070B]/15 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[48vw] h-[48vw] rounded-full bg-radial from-[#D9A83F]/06 via-[#16070B]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Global High-Performance 60FPS 3D Universe Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
    </div>
  );
};
