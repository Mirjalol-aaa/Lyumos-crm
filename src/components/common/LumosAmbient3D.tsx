import React, { useEffect, useRef } from 'react';

interface LumosAmbient3DProps {
  className?: string;
  activeSection?: string;
}

// -----------------------------------------------------------------------------
// 3D MATH & DATA STRUCTURES
// -----------------------------------------------------------------------------

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface DustParticle3D {
  x: number;
  y: number;
  z: number; // 30 to 800
  vx: number;
  vy: number;
  vz: number;
  baseAlpha: number;
  phase: number;
  pulseSpeed: number;
  size: number;
}

interface VirtualLight3D {
  id: string;
  x: number;
  y: number;
  z: number;
  radius: number;
  intensity: number;
  speed: number;
  phase: number;
  orbitRx: number;
  orbitRy: number;
  orbitRz: number;
  freqX: number;
  freqY: number;
  freqZ: number;
  centerX: number;
  centerY: number;
  centerZ: number;
}

interface TravelingLightWave {
  duration: number; // 8 - 14 seconds
  p0: Point3D;
  p1: Point3D;
  p2: Point3D;
  p3: Point3D;
  currentPos: Point3D;
  radius: number;
  active: boolean;
  cycleCount: number;
}

type PhysicsState = 'AUTONOMOUS' | 'HOVER' | 'GRABBED' | 'THROWN' | 'MOMENTUM';

// Complete Archetype Roster for the Interactive 3D World
type ArchetypeType =
  | 'book_math'
  | 'book_english'
  | 'parabola'
  | 'sinewave'
  | 'grid3d'
  | 'cube'
  | 'pyramid'
  | 'torus'
  | 'spiral'
  | 'cone'
  | 'math_pi'
  | 'math_sqrt'
  | 'math_pyth'
  | 'math_inf'
  | 'eng_abc'
  | 'eng_speak'
  | 'eng_learn';

interface FlyingEntity3D {
  id: string;
  archetype: ArchetypeType;
  title?: string;
  text?: string;
  formula?: string;
  // 3D Position
  x: number;
  y: number;
  z: number;
  // Base Coordinates for Autonomous Spline Flight
  baseX: number;
  baseY: number;
  baseZ: number;
  vx: number;
  vy: number;
  vz: number;
  // 3D Harmonic Curve Trajectory Parameters (Curved Splines)
  curveAmpX: number;
  curveAmpY: number;
  curveAmpZ: number;
  curveFreqX: number;
  curveFreqY: number;
  curveFreqZ: number;
  curvePhaseX: number;
  curvePhaseY: number;
  curvePhaseZ: number;
  // 3D Rotations & Independent Angular Velocities
  rotX: number;
  rotY: number;
  rotZ: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  // Physics State Machine & Mass Properties
  physicsState: PhysicsState;
  mass: number;
  springFactor: number;
  dragFactor: number;
  throwVx: number;
  throwVy: number;
  throwVz: number;
  throwRotVx: number;
  throwRotVy: number;
  throwRotVz: number;
  // Sizing & Base Opacity
  baseSize: number;
  baseOpacity: number;
  // Lifecycle
  age: number;
  lifetime: number; // Flight duration across world (seconds)
  hoverProgress: number; // 0 to 1 smooth physical reaction
  grabProgress: number; // 0 to 1 smooth grab reaction
  // Object-to-object mutual proximity boost
  proxBoost: number;
  currentIllum: number; // Continuous distance & grab illumination
  // Book specific dimensions
  bookWidth?: number;
  bookHeight?: number;
  bookThickness?: number;
  coverColor?: string;
  spineColor?: string;
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
    screenX: -9999,
    screenY: -9999,
    isInside: false,
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

    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    // Performance optimized DPR: limit to 1.25 on mobile, 1.75 on desktop
    let dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75);
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      const currentIsMobile = window.innerWidth < 768;
      dpr = Math.min(window.devicePixelRatio || 1, currentIsMobile ? 1.25 : 1.75);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // High-performance scroll tracking with active scroll state detection
    let isScrolling = false;
    let scrollTimeout: any = null;

    const handleScroll = () => {
      scrollRef.current.targetY = window.scrollY;
      isScrolling = true;
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 140);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // -------------------------------------------------------------------------
    // 1. PRE-RENDERED GPU SPRITES (Zero CPU shadowBlur)
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

    const spriteDust = createGlowSprite(14, 2, 'rgba(255, 238, 195, 0.9)', 'rgba(217, 168, 63, 0.35)');
    const spriteMote = createGlowSprite(26, 3, 'rgba(255, 245, 215, 0.95)', 'rgba(243, 210, 118, 0.5)');
    const spriteLightAura = createGlowSprite(220, 30, 'rgba(255, 235, 170, 0.55)', 'rgba(217, 168, 63, 0.16)');
    const spriteWaveAura = createGlowSprite(380, 50, 'rgba(255, 240, 190, 0.40)', 'rgba(217, 168, 63, 0.12)');
    const spriteGrabAura = createGlowSprite(260, 35, 'rgba(255, 235, 170, 0.70)', 'rgba(243, 210, 118, 0.28)');

    // -------------------------------------------------------------------------
    // 2. 3D CAMERA & PERSPECTIVE PROJECTION
    // -------------------------------------------------------------------------
    const fov = 440;
    const project = (
      p: Point3D,
      camX: number,
      camY: number,
      camZ: number,
      parallaxX: number,
      parallaxY: number
    ) => {
      const relX = p.x - (width / 2 + camX);
      const relY = p.y - (height / 2 + camY);
      const relZ = Math.max(p.z + camZ, 12);

      const scale = fov / (fov + relZ);
      const projX = width / 2 + relX * scale + parallaxX * scale;
      const projY = height / 2 + relY * scale + parallaxY * scale;

      return { x: projX, y: projY, scale, z: relZ };
    };

    const rotate3D = (p: Point3D, rotX: number, rotY: number, rotZ: number): Point3D => {
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
    // 3. 5 LARGE INVISIBLE MOVING SOFT LIGHT SOURCES
    // -------------------------------------------------------------------------
    const virtualLights: VirtualLight3D[] = [
      {
        id: 'hero-rim',
        x: width * 0.72,
        y: height * 0.38,
        z: 280,
        radius: 380,
        intensity: 0.95,
        speed: 0.0007,
        phase: 0,
        orbitRx: 180,
        orbitRy: 100,
        orbitRz: 60,
        freqX: 1.0,
        freqY: 1.4,
        freqZ: 0.8,
        centerX: width * 0.72,
        centerY: height * 0.38,
        centerZ: 280,
      },
      {
        id: 'math-light',
        x: width * 0.20,
        y: height * 0.28,
        z: 320,
        radius: 410,
        intensity: 0.85,
        speed: -0.0006,
        phase: Math.PI * 0.4,
        orbitRx: 220,
        orbitRy: 120,
        orbitRz: 80,
        freqX: 1.2,
        freqY: 0.9,
        freqZ: 1.1,
        centerX: width * 0.22,
        centerY: height * 0.28,
        centerZ: 320,
      },
      {
        id: 'english-light',
        x: width * 0.84,
        y: height * 0.58,
        z: 290,
        radius: 390,
        intensity: 0.80,
        speed: 0.00065,
        phase: Math.PI * 1.1,
        orbitRx: 190,
        orbitRy: 130,
        orbitRz: 70,
        freqX: 0.9,
        freqY: 1.3,
        freqZ: 0.7,
        centerX: width * 0.82,
        centerY: height * 0.58,
        centerZ: 290,
      },
      {
        id: 'deep-cosmic',
        x: width * 0.50,
        y: height * 0.18,
        z: 600,
        radius: 480,
        intensity: 0.70,
        speed: 0.00045,
        phase: Math.PI * 1.7,
        orbitRx: 260,
        orbitRy: 90,
        orbitRz: 110,
        freqX: 0.8,
        freqY: 1.1,
        freqZ: 1.0,
        centerX: width * 0.50,
        centerY: height * 0.18,
        centerZ: 600,
      },
      {
        id: 'lower-arena',
        x: width * 0.35,
        y: height * 0.84,
        z: 330,
        radius: 390,
        intensity: 0.75,
        speed: -0.0005,
        phase: Math.PI * 0.25,
        orbitRx: 230,
        orbitRy: 80,
        orbitRz: 60,
        freqX: 1.1,
        freqY: 0.8,
        freqZ: 0.9,
        centerX: width * 0.35,
        centerY: height * 0.84,
        centerZ: 330,
      },
    ];

    // -------------------------------------------------------------------------
    // 4. SIGNATURE LUMOS EFFECT: TRAVELING GOLDEN LIGHT WAVE (8–14 seconds)
    // -------------------------------------------------------------------------
    const generateWaveTrajectory = (cycle: number): TravelingLightWave => {
      const mode = cycle % 3;
      let p0: Point3D, p1: Point3D, p2: Point3D, p3: Point3D;

      if (mode === 0) {
        p0 = { x: -width * 0.15, y: height * 0.30, z: 420 };
        p1 = { x: width * 0.30, y: height * 0.15, z: 320 };
        p2 = { x: width * 0.70, y: height * 0.42, z: 260 };
        p3 = { x: width * 1.15, y: height * 0.65, z: 380 };
      } else if (mode === 1) {
        p0 = { x: width * 0.10, y: -height * 0.10, z: 380 };
        p1 = { x: width * 0.35, y: height * 0.38, z: 280 };
        p2 = { x: width * 0.65, y: height * 0.35, z: 300 };
        p3 = { x: width * 1.12, y: height * 0.85, z: 410 };
      } else {
        p0 = { x: -width * 0.12, y: height * 0.80, z: 360 };
        p1 = { x: width * 0.25, y: height * 0.50, z: 290 };
        p2 = { x: width * 0.72, y: height * 0.25, z: 270 };
        p3 = { x: width * 1.15, y: height * 0.35, z: 390 };
      }

      return {
        duration: 11.5,
        p0,
        p1,
        p2,
        p3,
        currentPos: { ...p0 },
        radius: 360,
        active: true,
        cycleCount: cycle,
      };
    };

    let waveState = generateWaveTrajectory(0);

    const getBezierPoint = (p0: Point3D, p1: Point3D, p2: Point3D, p3: Point3D, t: number): Point3D => {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      const uuu = uu * u;
      const ttt = tt * t;

      return {
        x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
        y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
        z: uuu * p0.z + 3 * uu * t * p1.z + 3 * u * tt * p2.z + ttt * p3.z,
      };
    };

    const getIlluminationBoost = (x: number, y: number, z: number): { lightBoost: number; waveBoost: number } => {
      let lightBoost = 0;
      for (let i = 0; i < virtualLights.length; i++) {
        const vl = virtualLights[i];
        const dx = x - vl.x;
        const dy = y - vl.y;
        const dz = z - vl.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        const radSq = vl.radius * vl.radius;
        if (distSq < radSq) {
          const falloff = 1 - Math.sqrt(distSq) / vl.radius;
          lightBoost += falloff * vl.intensity * 0.50;
        }
      }

      let waveBoost = 0;
      if (waveState.active) {
        const wdx = x - waveState.currentPos.x;
        const wdy = y - waveState.currentPos.y;
        const wdz = z - waveState.currentPos.z;
        const wdistSq = wdx * wdx + wdy * wdy + wdz * wdz;
        const wradSq = waveState.radius * waveState.radius;
        if (wdistSq < wradSq) {
          const wfalloff = 1 - Math.sqrt(wdistSq) / waveState.radius;
          waveBoost = Math.sin(wfalloff * Math.PI) * 0.45;
        }
      }

      return {
        lightBoost: Math.min(0.65, lightBoost),
        waveBoost: Math.min(0.50, waveBoost),
      };
    };

    // -------------------------------------------------------------------------
    // 5. INTERACTIVE 3D PHYSICS & POINTER MANAGER
    // Real Drag / Rotate / Throw / Inertia / Momentum & Soft Boundary Bouncing
    // -------------------------------------------------------------------------
    const ARCHETYPES_CATALOG: ArchetypeType[] = [
      'book_math',
      'parabola',
      'cube',
      'book_english',
      'sinewave',
      'pyramid',
      'grid3d',
      'torus',
      'spiral',
      'cone',
      'math_pi',
      'eng_abc',
      'math_sqrt',
      'math_pyth',
      'math_inf',
      'eng_speak',
      'eng_learn',
    ];

    let entitySpawnCounter = 0;

    const spawnFlyingEntity = (portalIndex?: number, forcedArchetype?: ArchetypeType): FlyingEntity3D => {
      entitySpawnCounter++;
      const pIndex = portalIndex !== undefined ? portalIndex : Math.floor(Math.random() * 9);
      const archetype = forcedArchetype || ARCHETYPES_CATALOG[entitySpawnCounter % ARCHETYPES_CATALOG.length];

      let baseX = 0, baseY = 0, baseZ = 300;
      let vx = 0, vy = 0, vz = 0;

      if (pIndex === 0) {
        baseX = -width * 0.12 - Math.random() * 80;
        baseY = height * (0.05 + Math.random() * 0.25);
        baseZ = 450 + Math.random() * 200;
        vx = 0.32 + Math.random() * 0.20;
        vy = 0.16 + Math.random() * 0.14;
        vz = -(0.14 + Math.random() * 0.16);
      } else if (pIndex === 1) {
        baseX = width * (0.35 + Math.random() * 0.30);
        baseY = -height * 0.12 - Math.random() * 60;
        baseZ = 320 + Math.random() * 220;
        vx = (Math.random() - 0.5) * 0.22;
        vy = 0.32 + Math.random() * 0.22;
        vz = (Math.random() - 0.5) * 0.15;
      } else if (pIndex === 2) {
        baseX = width * 1.12 + Math.random() * 80;
        baseY = height * (0.05 + Math.random() * 0.25);
        baseZ = 380 + Math.random() * 180;
        vx = -(0.32 + Math.random() * 0.20);
        vy = 0.16 + Math.random() * 0.14;
        vz = -(0.10 + Math.random() * 0.15);
      } else if (pIndex === 3) {
        baseX = -width * 0.10 - Math.random() * 80;
        baseY = height * (0.35 + Math.random() * 0.30);
        baseZ = 240 + Math.random() * 160;
        vx = 0.36 + Math.random() * 0.22;
        vy = (Math.random() - 0.5) * 0.14;
        vz = 0.12 + Math.random() * 0.15;
      } else if (pIndex === 4) {
        baseX = width * 1.10 + Math.random() * 80;
        baseY = height * (0.35 + Math.random() * 0.30);
        baseZ = 220 + Math.random() * 180;
        vx = -(0.36 + Math.random() * 0.22);
        vy = (Math.random() - 0.5) * 0.14;
        vz = 0.14 + Math.random() * 0.16;
      } else if (pIndex === 5) {
        baseX = -width * 0.10 - Math.random() * 80;
        baseY = height * (0.75 + Math.random() * 0.25);
        baseZ = 300 + Math.random() * 180;
        vx = 0.34 + Math.random() * 0.20;
        vy = -(0.24 + Math.random() * 0.18);
        vz = -(0.12 + Math.random() * 0.14);
      } else if (pIndex === 6) {
        baseX = width * (0.35 + Math.random() * 0.30);
        baseY = height * 1.12 + Math.random() * 60;
        baseZ = 360 + Math.random() * 180;
        vx = (Math.random() - 0.5) * 0.20;
        vy = -(0.30 + Math.random() * 0.20);
        vz = (Math.random() - 0.5) * 0.14;
      } else if (pIndex === 7) {
        baseX = width * 1.10 + Math.random() * 80;
        baseY = height * (0.75 + Math.random() * 0.25);
        baseZ = 260 + Math.random() * 160;
        vx = -(0.34 + Math.random() * 0.20);
        vy = -(0.24 + Math.random() * 0.18);
        vz = 0.12 + Math.random() * 0.16;
      } else {
        baseX = width * (0.10 + Math.random() * 0.80);
        baseY = height * (0.10 + Math.random() * 0.80);
        baseZ = 740 + Math.random() * 120;
        vx = (Math.random() - 0.5) * 0.30;
        vy = (Math.random() - 0.5) * 0.20;
        vz = -(0.38 + Math.random() * 0.25);
      }

      let baseSize = 34;
      let baseOpacity = 0.28;
      let mass = 1.2;
      let springFactor = 0.24;
      let dragFactor = 0.972;

      let title: string | undefined = undefined;
      let text: string | undefined = undefined;
      let formula: string | undefined = undefined;
      let bookWidth: number | undefined = undefined;
      let bookHeight: number | undefined = undefined;
      let bookThickness: number | undefined = undefined;
      let coverColor: string | undefined = undefined;
      let spineColor: string | undefined = undefined;

      if (archetype === 'book_math') {
        title = 'MATEMATIKA';
        baseSize = 10;
        baseOpacity = 0.32;
        mass = 1.9;
        springFactor = 0.18; // heavier feel
        dragFactor = 0.976;
        bookWidth = 72;
        bookHeight = 94;
        bookThickness = 17;
        coverColor = '#4A0E17';
        spineColor = '#6B1422';
      } else if (archetype === 'book_english') {
        title = 'ENGLISH';
        baseSize = 10;
        baseOpacity = 0.32;
        mass = 1.9;
        springFactor = 0.18;
        dragFactor = 0.976;
        bookWidth = 70;
        bookHeight = 92;
        bookThickness = 16;
        coverColor = '#121A28';
        spineColor = '#1C273C';
      } else if (archetype === 'parabola') {
        formula = 'y = x²';
        baseSize = 32;
        baseOpacity = 0.30;
        mass = 1.1;
        springFactor = 0.26;
        dragFactor = 0.970;
      } else if (archetype === 'sinewave') {
        formula = 'y = sin(x)';
        baseSize = 36;
        baseOpacity = 0.28;
        mass = 1.1;
        springFactor = 0.26;
        dragFactor = 0.970;
      } else if (archetype === 'grid3d') {
        baseSize = 42;
        baseOpacity = 0.22;
        mass = 1.4;
        springFactor = 0.20;
        dragFactor = 0.973;
      } else if (archetype === 'cube') {
        baseSize = 38;
        baseOpacity = 0.26;
        mass = 1.3;
        springFactor = 0.24;
        dragFactor = 0.972;
      } else if (archetype === 'pyramid') {
        baseSize = 34;
        baseOpacity = 0.26;
        mass = 1.2;
        springFactor = 0.25;
        dragFactor = 0.971;
      } else if (archetype === 'torus') {
        baseSize = 30;
        baseOpacity = 0.24;
        mass = 1.2;
        springFactor = 0.25;
        dragFactor = 0.971;
      } else if (archetype === 'spiral') {
        baseSize = 24;
        baseOpacity = 0.22;
        mass = 1.0;
        springFactor = 0.28;
        dragFactor = 0.968;
      } else if (archetype === 'cone') {
        baseSize = 28;
        baseOpacity = 0.24;
        mass = 1.1;
        springFactor = 0.26;
        dragFactor = 0.970;
      } else if (archetype === 'math_pi') {
        text = 'π';
        baseSize = 38;
        baseOpacity = 0.18;
        mass = 0.8;
        springFactor = 0.32;
        dragFactor = 0.965;
      } else if (archetype === 'math_sqrt') {
        text = '√x';
        baseSize = 22;
        baseOpacity = 0.24;
        mass = 0.9;
        springFactor = 0.30;
        dragFactor = 0.966;
      } else if (archetype === 'math_pyth') {
        text = 'a² + b² = c²';
        baseSize = 16;
        baseOpacity = 0.22;
        mass = 0.8;
        springFactor = 0.32;
        dragFactor = 0.965;
      } else if (archetype === 'math_inf') {
        text = '∞';
        baseSize = 22;
        baseOpacity = 0.20;
        mass = 0.8;
        springFactor = 0.32;
        dragFactor = 0.965;
      } else if (archetype === 'eng_abc') {
        text = 'ABC';
        baseSize = 18;
        baseOpacity = 0.24;
        mass = 1.0;
        springFactor = 0.28;
        dragFactor = 0.968;
      } else if (archetype === 'eng_speak') {
        text = 'PRACTICE';
        baseSize = 13;
        baseOpacity = 0.20;
        mass = 0.8;
        springFactor = 0.32;
        dragFactor = 0.965;
      } else if (archetype === 'eng_learn') {
        text = 'LEARN';
        baseSize = 14;
        baseOpacity = 0.20;
        mass = 0.8;
        springFactor = 0.32;
        dragFactor = 0.965;
      }

      return {
        id: `entity-${entitySpawnCounter}-${Date.now()}`,
        archetype,
        title,
        text,
        formula,
        baseX,
        baseY,
        baseZ,
        vx,
        vy,
        vz,
        x: baseX,
        y: baseY,
        z: baseZ,
        curveAmpX: 25 + Math.random() * 35,
        curveAmpY: 20 + Math.random() * 30,
        curveAmpZ: 30 + Math.random() * 45,
        curveFreqX: 0.15 + Math.random() * 0.25,
        curveFreqY: 0.18 + Math.random() * 0.25,
        curveFreqZ: 0.12 + Math.random() * 0.20,
        curvePhaseX: Math.random() * Math.PI * 2,
        curvePhaseY: Math.random() * Math.PI * 2,
        curvePhaseZ: Math.random() * Math.PI * 2,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: (Math.random() - 0.5) * 0.4,
        rotSpeedX: (Math.random() - 0.5) * 0.0006,
        rotSpeedY: (Math.random() - 0.5) * 0.0008,
        rotSpeedZ: (Math.random() - 0.5) * 0.0004,
        physicsState: 'AUTONOMOUS',
        mass,
        springFactor,
        dragFactor,
        throwVx: 0,
        throwVy: 0,
        throwVz: 0,
        throwRotVx: 0,
        throwRotVy: 0,
        throwRotVz: 0,
        baseSize,
        baseOpacity,
        age: 0,
        lifetime: 22 + Math.random() * 16,
        hoverProgress: 0,
        grabProgress: 0,
        proxBoost: 0,
        currentIllum: 0.20,
        bookWidth,
        bookHeight,
        bookThickness,
        coverColor,
        spineColor,
      };
    };

    const targetEntityCount = isMobile ? 7 : isTablet ? 9 : 12;
    const flyingEntities: FlyingEntity3D[] = [];

    for (let i = 0; i < targetEntityCount; i++) {
      const ent = spawnFlyingEntity(i % 9);
      const advanceTime = Math.random() * 16;
      ent.age = advanceTime;
      ent.baseX += ent.vx * advanceTime * 30;
      ent.baseY += ent.vy * advanceTime * 30;
      ent.baseZ += ent.vz * advanceTime * 30;
      ent.x = ent.baseX + Math.sin(ent.age * ent.curveFreqX + ent.curvePhaseX) * ent.curveAmpX;
      ent.y = ent.baseY + Math.cos(ent.age * ent.curveFreqY + ent.curvePhaseY) * ent.curveAmpY;
      ent.z = ent.baseZ + Math.sin(ent.age * ent.curveFreqZ + ent.curvePhaseZ) * ent.curveAmpZ;
      flyingEntities.push(ent);
    }

    // Pointer Interaction State (Isolated 3D Interaction, Capture & Selection Shield)
    const pointerRef = {
      x: -9999,
      y: -9999,
      isDown: false,
      pointerId: -1,
      capturedTarget: null as Element | null,
      grabOffsetX: 0,
      grabOffsetY: 0,
      initialDownX: 0,
      initialDownY: 0,
      isDragConfirmed: false,
      grabbedEntity: null as FlyingEntity3D | null,
      hoveredEntity: null as FlyingEntity3D | null,
      history: [] as { x: number; y: number; time: number }[],
    };

    // Shared camera & parallax references for projection inside event handlers
    const activeCamRef = { camX: 0, camY: 0, camZ: 0, parallaxX: 0, parallaxY: 0 };

    const isInteractiveTarget = (target: EventTarget | null): boolean => {
      if (!target || !(target instanceof HTMLElement)) return false;
      return !!target.closest('button, a, input, textarea, select, [role="button"], nav, header');
    };

    // Helper to safely toggle text selection shield during active 3D grab
    const setSelectionShield = (active: boolean) => {
      if (active) {
        window.getSelection()?.removeAllRanges();
        document.documentElement.classList.add('lumos-grabbing-3d');
        document.body.classList.add('lumos-grabbing-3d');
      } else {
        document.documentElement.classList.remove('lumos-grabbing-3d');
        document.body.classList.remove('lumos-grabbing-3d');
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;

      pointerRef.x = clientX;
      pointerRef.y = clientY;

      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseRef.current.targetX = (clientX - halfW) / halfW;
      mouseRef.current.targetY = (clientY - halfH) / halfH;
      mouseRef.current.screenX = clientX;
      mouseRef.current.screenY = clientY;
      mouseRef.current.isInside = true;

      // Sample pointer history for throw velocity calculation (rolling 120ms buffer)
      const now = performance.now();
      pointerRef.history.push({ x: clientX, y: clientY, time: now });
      pointerRef.history = pointerRef.history.filter(pt => now - pt.time <= 120);

      // If currently holding an object:
      if (pointerRef.grabbedEntity) {
        // Confirm real drag after 5px dead-zone movement
        const moveDist = Math.hypot(clientX - pointerRef.initialDownX, clientY - pointerRef.initialDownY);
        if (moveDist > 5) {
          pointerRef.isDragConfirmed = true;
        }

        document.body.style.cursor = 'grabbing';
        // Prevent accidental mobile scroll / pull-to-refresh while carrying
        e.preventDefault();
        return;
      }

      // Check if hovering over website UI controls (buttons, navigation, links)
      if (isInteractiveTarget(e.target)) {
        pointerRef.hoveredEntity = null;
        document.body.style.cursor = 'default';
        return;
      }

      // Hit-testing against projected 3D objects with accurate bounds
      let foundHover: FlyingEntity3D | null = null;
      let minDistance = 9999;

      for (let i = flyingEntities.length - 1; i >= 0; i--) {
        const ent = flyingEntities[i];
        const proj = project(
          { x: ent.x, y: ent.y, z: ent.z },
          activeCamRef.camX,
          activeCamRef.camY,
          activeCamRef.camZ,
          activeCamRef.parallaxX,
          activeCamRef.parallaxY
        );
        if (proj.scale <= 0) continue;

        const dx = clientX - proj.x;
        const dy = clientY - proj.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const hitRadius = Math.max(
          isMobile ? 48 : 38,
          ent.baseSize * proj.scale * 1.6,
          (ent.bookWidth || 0) * proj.scale * 0.85,
          (ent.bookHeight || 0) * proj.scale * 0.85
        );

        if (dist < hitRadius && dist < minDistance) {
          minDistance = dist;
          foundHover = ent;
        }
      }

      pointerRef.hoveredEntity = foundHover;
      if (foundHover) {
        document.body.style.cursor = 'grab';
      } else {
        document.body.style.cursor = 'default';
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      // Only trigger on primary button (left click or single touch)
      if (e.button !== 0) return;
      if (isInteractiveTarget(e.target)) return;

      const clientX = e.clientX;
      const clientY = e.clientY;
      pointerRef.x = clientX;
      pointerRef.y = clientY;
      pointerRef.initialDownX = clientX;
      pointerRef.initialDownY = clientY;
      pointerRef.isDragConfirmed = false;
      pointerRef.history = [{ x: clientX, y: clientY, time: performance.now() }];

      // Hit test specifically against 3D objects
      let targetEntity: FlyingEntity3D | null = null;
      let minDistance = 9999;

      for (let i = flyingEntities.length - 1; i >= 0; i--) {
        const ent = flyingEntities[i];
        const proj = project(
          { x: ent.x, y: ent.y, z: ent.z },
          activeCamRef.camX,
          activeCamRef.camY,
          activeCamRef.camZ,
          activeCamRef.parallaxX,
          activeCamRef.parallaxY
        );
        if (proj.scale <= 0) continue;

        const dx = clientX - proj.x;
        const dy = clientY - proj.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const hitRadius = Math.max(
          isMobile ? 50 : 40,
          ent.baseSize * proj.scale * 1.6,
          (ent.bookWidth || 0) * proj.scale * 0.85,
          (ent.bookHeight || 0) * proj.scale * 0.85
        );

        if (dist < hitRadius && dist < minDistance) {
          minDistance = dist;
          targetEntity = ent;
        }
      }

      if (targetEntity) {
        pointerRef.isDown = true;
        pointerRef.pointerId = e.pointerId;
        pointerRef.grabbedEntity = targetEntity;
        targetEntity.physicsState = 'GRABBED';
        targetEntity.throwVx = 0;
        targetEntity.throwVy = 0;
        targetEntity.throwVz = 0;

        // Calculate exact grab offset between cursor and projected entity center
        const proj = project(
          { x: targetEntity.x, y: targetEntity.y, z: targetEntity.z },
          activeCamRef.camX,
          activeCamRef.camY,
          activeCamRef.camZ,
          activeCamRef.parallaxX,
          activeCamRef.parallaxY
        );
        pointerRef.grabOffsetX = clientX - proj.x;
        pointerRef.grabOffsetY = clientY - proj.y;

        // Pointer capture on the actual target element (safe across iOS Safari and Android Chrome)
        if (e.target && e.target instanceof Element) {
          try {
            e.target.setPointerCapture(e.pointerId);
            pointerRef.capturedTarget = e.target;
          } catch (err) {}
        }

        // Active selection shield: prevents any website text from selecting
        setSelectionShield(true);
        document.body.style.cursor = 'grabbing';
        e.preventDefault();
      }
    };

    const handlePointerUp = (e?: PointerEvent) => {
      if (pointerRef.grabbedEntity) {
        const ent = pointerRef.grabbedEntity;
        const history = pointerRef.history;
        const now = performance.now();
        let throwVx = 0;
        let throwVy = 0;

        // Consider pointer motion within the last 100ms before release
        const recentPoints = history.filter(p => now - p.time <= 100);

        if (recentPoints.length >= 2 && pointerRef.isDragConfirmed) {
          const first = recentPoints[0];
          const last = recentPoints[recentPoints.length - 1];
          const dt = (last.time - first.time) / 1000;
          // Only apply throw if pointer was moving right up to release (within 60ms)
          if (dt > 0.012 && (now - last.time) < 60) {
            const pxPerSecX = (last.x - first.x) / dt;
            const pxPerSecY = (last.y - first.y) / dt;
            // Velocity in pixels per 60 FPS frame
            throwVx = pxPerSecX / 60;
            throwVy = pxPerSecY / 60;
          }
        }

        // Clamp to safe max throw speed (safe maximum: 28 px/frame)
        const screenSpeed = Math.sqrt(throwVx * throwVx + throwVy * throwVy);
        const maxSpeed = 28;
        if (screenSpeed > maxSpeed) {
          throwVx = (throwVx / screenSpeed) * maxSpeed;
          throwVy = (throwVy / screenSpeed) * maxSpeed;
        }

        const relZ = Math.max(ent.z + activeCamRef.camZ, 12);
        const currentScale = fov / (fov + relZ);

        // Convert screen pixel velocity into 3D world velocity
        ent.throwVx = throwVx / currentScale;
        ent.throwVy = throwVy / currentScale;
        ent.throwVz = (Math.random() - 0.5) * 1.5;

        // Angular momentum matching throw direction
        ent.throwRotVx = -(throwVy) * 0.0035;
        ent.throwRotVy = (throwVx) * 0.0035;
        ent.throwRotVz = (throwVx) * 0.0018;

        ent.physicsState = screenSpeed > 0.5 ? 'THROWN' : 'MOMENTUM';

        // Release pointer capture
        if (pointerRef.capturedTarget && pointerRef.pointerId !== -1) {
          try {
            pointerRef.capturedTarget.releasePointerCapture(pointerRef.pointerId);
          } catch (err) {}
          pointerRef.capturedTarget = null;
        }

        // Restore normal text selection
        setSelectionShield(false);

        pointerRef.grabbedEntity = null;
        pointerRef.isDown = false;
        pointerRef.pointerId = -1;
        pointerRef.isDragConfirmed = false;
        document.body.style.cursor = pointerRef.hoveredEntity ? 'grab' : 'default';
      }
    };

    // Touch scroll protection: prevent mobile scroll ONLY while actively dragging a 3D object
    const handleTouchMove = (e: TouchEvent) => {
      if (pointerRef.grabbedEntity) {
        e.preventDefault();
      }
    };

    // Shield against native browser drag and text selection while interacting
    const handleSelectStart = (e: Event) => {
      if (pointerRef.grabbedEntity || pointerRef.isDown) {
        e.preventDefault();
        return false;
      }
    };

    const handleDragStart = (e: DragEvent) => {
      if (pointerRef.grabbedEntity || pointerRef.isDown) {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: false });
    window.addEventListener('pointerdown', handlePointerDown, { passive: false });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('pointercancel', handlePointerUp, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('blur', () => handlePointerUp());
    document.addEventListener('selectstart', handleSelectStart, { capture: true });
    document.addEventListener('dragstart', handleDragStart, { capture: true });

    // -------------------------------------------------------------------------
    // 6. ATMOSPHERIC DUST PARTICLES (Light-reactive motes)
    // -------------------------------------------------------------------------
    let dustCount = isMobile ? 20 : isTablet ? 40 : 60;
    const dustParticles: DustParticle3D[] = Array.from({ length: dustCount }, () => {
      const z = Math.random() * 750 + 40;
      return {
        x: Math.random() * (width * 1.3) - width * 0.15,
        y: Math.random() * (height * 1.3) - height * 0.15,
        z,
        vx: (Math.random() - 0.5) * 0.10,
        vy: -(0.08 + Math.random() * 0.18),
        vz: (Math.random() - 0.5) * 0.07,
        baseAlpha: 0.10 + (1 - z / 800) * 0.30,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.005 + Math.random() * 0.012,
        size: z < 250 ? 2.2 : z < 500 ? 1.5 : 0.95,
      };
    });

    // -------------------------------------------------------------------------
    // 7. INVISIBLE SAFE ZONES: Dynamic Alpha Attenuation
    // -------------------------------------------------------------------------
    const computeSafeZoneFactor = (projX: number, projY: number): number => {
      const textLeft = width * 0.05;
      const textRight = width * 0.49;
      const textTop = height * 0.14;
      const textBottom = height * 0.62;

      const laptopLeft = width * 0.52;
      const laptopRight = width * 0.95;
      const laptopTop = height * 0.18;
      const laptopBottom = height * 0.78;

      if (projY < height * 0.10) {
        return Math.max(0.02, (projY / (height * 0.10)) * 0.4);
      }

      const margin = 45;

      if (
        projX >= textLeft - margin &&
        projX <= textRight + margin &&
        projY >= textTop - margin &&
        projY <= textBottom + margin
      ) {
        const dx = Math.max(0, Math.min(projX - textLeft, textRight - projX));
        const dy = Math.max(0, Math.min(projY - textTop, textBottom - projY));
        const depth = Math.min(dx, dy);
        return Math.max(0.03, 1.0 - (depth / margin) * 0.97);
      }

      if (
        projX >= laptopLeft - margin &&
        projX <= laptopRight + margin &&
        projY >= laptopTop - margin &&
        projY <= laptopBottom + margin
      ) {
        const dx = Math.max(0, Math.min(projX - laptopLeft, laptopRight - projX));
        const dy = Math.max(0, Math.min(projY - laptopTop, laptopBottom - projY));
        const depth = Math.min(dx, dy);
        return Math.max(0.03, 1.0 - (depth / margin) * 0.97);
      }

      return 1.0;
    };

    // -------------------------------------------------------------------------
    // 8. MAIN 60 FPS RENDER LOOP
    // -------------------------------------------------------------------------
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsAccumulator = 0;
    let isLowPerformance = false;

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const elapsed = (now - startTimeRef.current) / 1000;

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
          dustCount = Math.floor(dustCount * 0.65);
          dustParticles.splice(dustCount);
        }
        frameCount = 0;
        fpsAccumulator = 0;
      }

      ctx.clearRect(0, 0, width, height);

      // Smooth Camera Floating Drift
      const camX = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.14) * 14;
      const camY = prefersReducedMotion ? 0 : Math.cos(elapsed * 0.11) * 10;
      const camZ = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.16) * 18;

      // Mouse Parallax (Disabled on mobile)
      const mouseFactor = prefersReducedMotion || isMobile ? 0 : 0.04;
      mouseRef.current.currentX +=
        (mouseRef.current.targetX - mouseRef.current.currentX) * mouseFactor;
      mouseRef.current.currentY +=
        (mouseRef.current.targetY - mouseRef.current.currentY) * mouseFactor;

      const parallaxX = isMobile ? 0 : mouseRef.current.currentX * 14;
      const parallaxY = isMobile ? 0 : mouseRef.current.currentY * 10;

      // Scroll Camera Navigation
      scrollRef.current.currentY +=
        (scrollRef.current.targetY - scrollRef.current.currentY) * 0.05;
      const scrollShift = (scrollRef.current.currentY * 0.07) % height;
      const scrollDepthShift = Math.min(120, scrollRef.current.currentY * 0.08);

      // -----------------------------------------------------------------------
      // TRAVELING GOLDEN LIGHT WAVE (8–14s)
      // -----------------------------------------------------------------------
      const waveCycleTime = (elapsed % waveState.duration) / waveState.duration;
      const currentCycleCount = Math.floor(elapsed / waveState.duration);
      if (currentCycleCount !== waveState.cycleCount) {
        waveState = generateWaveTrajectory(currentCycleCount);
      }
      waveState.currentPos = getBezierPoint(
        waveState.p0,
        waveState.p1,
        waveState.p2,
        waveState.p3,
        waveCycleTime
      );

      const projWave = project(
        waveState.currentPos,
        camX,
        camY,
        camZ + scrollDepthShift,
        parallaxX,
        parallaxY
      );
      if (projWave.scale > 0 && !isLowPerformance) {
        const waveAuraSize = spriteWaveAura.width * projWave.scale * 1.6;
        const waveFade = Math.sin(waveCycleTime * Math.PI);
        ctx.globalAlpha = 0.45 * waveFade * revealProgress;
        ctx.drawImage(
          spriteWaveAura,
          projWave.x - waveAuraSize / 2,
          projWave.y - waveAuraSize / 2,
          waveAuraSize,
          waveAuraSize
        );
        ctx.globalAlpha = 1.0;
      }

      // -----------------------------------------------------------------------
      // 5 VIRTUAL MOVING LIGHTS
      // -----------------------------------------------------------------------
      if (!isMobile || !isScrolling) {
        virtualLights.forEach((vl) => {
        if (!prefersReducedMotion) {
          vl.phase += vl.speed;
          vl.x = vl.centerX + Math.cos(vl.phase * vl.freqX) * vl.orbitRx;
          vl.y = vl.centerY + Math.sin(vl.phase * vl.freqY) * vl.orbitRy;
          vl.z = vl.centerZ + Math.sin(vl.phase * vl.freqZ) * vl.orbitRz;
        }

        const projLight = project(
          { x: vl.x, y: vl.y, z: vl.z },
          camX,
          camY,
          camZ + scrollDepthShift,
          parallaxX,
          parallaxY
        );
        if (projLight.scale > 0) {
          const auraSize = spriteLightAura.width * projLight.scale * 1.4;
          ctx.globalAlpha = vl.intensity * 0.42 * revealProgress;
          ctx.drawImage(
            spriteLightAura,
            projLight.x - auraSize / 2,
            projLight.y - auraSize / 2,
            auraSize,
            auraSize
          );
        }
      });
        ctx.globalAlpha = 1.0;
      }

      // -----------------------------------------------------------------------
      // LAYER 1: DEEP BACKGROUND (Faint coordinate grid lines)
      // -----------------------------------------------------------------------
      if (!isLowPerformance && !isMobile) {
        ctx.save();
        ctx.strokeStyle = `rgba(217, 168, 63, ${0.04 * revealProgress})`;
        ctx.lineWidth = 0.8;
        ctx.setLineDash([2, 8]);

        for (let y = height * 0.16; y <= height * 0.84; y += height * 0.22) {
          ctx.beginPath();
          ctx.moveTo(width * 0.08, y);
          ctx.lineTo(width * 0.92, y);
          ctx.stroke();
        }
        for (let x = width * 0.16; x <= width * 0.84; x += width * 0.24) {
          ctx.beginPath();
          ctx.moveTo(x, height * 0.12);
          ctx.lineTo(x, height * 0.88);
          ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.restore();
      }

      // -----------------------------------------------------------------------
      // LAYER 4: HERO DEPTH (Architectural Incomplete Rings Behind Laptop)
      // -----------------------------------------------------------------------
      const coreCenter3D: Point3D = {
        x: width * 0.72,
        y: height * 0.38,
        z: 330,
      };
      const projCore = project(
        coreCenter3D,
        camX,
        camY,
        camZ + scrollDepthShift,
        parallaxX,
        parallaxY
      );

      if (projCore.scale > 0) {
        ctx.save();
        ctx.translate(projCore.x, projCore.y);

        const { lightBoost, waveBoost } = getIlluminationBoost(
          coreCenter3D.x,
          coreCenter3D.y,
          coreCenter3D.z
        );
        const coreAlpha = (0.75 + lightBoost * 0.35 + waveBoost * 0.40) * revealProgress;

        const r1 = 180 * projCore.scale;
        ctx.save();
        ctx.rotate(prefersReducedMotion ? 0.3 : elapsed * 0.030);
        ctx.beginPath();
        ctx.arc(0, 0, r1, -Math.PI * 0.7, Math.PI * 0.55);
        ctx.strokeStyle = `rgba(243, 210, 118, ${0.16 * coreAlpha})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();
        ctx.restore();

        const r2x = 260 * projCore.scale;
        const r2y = 150 * projCore.scale;
        ctx.save();
        ctx.rotate(-0.38 + (prefersReducedMotion ? 0 : elapsed * 0.016));
        ctx.beginPath();
        ctx.ellipse(0, 0, r2x, r2y, 0, -Math.PI * 0.2, Math.PI * 0.7);
        ctx.strokeStyle = `rgba(217, 168, 63, ${0.12 * coreAlpha})`;
        ctx.lineWidth = 0.95;
        ctx.setLineDash([4, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        if (!isMobile) {
          const r3 = 340 * projCore.scale;
          ctx.save();
          ctx.rotate(0.25 + (prefersReducedMotion ? 0 : -elapsed * 0.014));
          ctx.beginPath();
          ctx.arc(0, 0, r3, -Math.PI * 0.5, Math.PI * 0.3);
          ctx.strokeStyle = `rgba(217, 168, 63, ${0.07 * coreAlpha})`;
          ctx.lineWidth = 0.85;
          ctx.stroke();
          ctx.restore();
        }

        ctx.restore();
      }

      // -----------------------------------------------------------------------
      // OBJECT-TO-OBJECT MUTUAL PROXIMITY INTERACTION (Skipped during mobile scroll for 60 FPS)
      // -----------------------------------------------------------------------
      if (!isScrolling) {

      for (let i = 0; i < flyingEntities.length; i++) {
        flyingEntities[i].proxBoost = 0;
      }
      for (let i = 0; i < flyingEntities.length; i++) {
        const a = flyingEntities[i];
        for (let j = i + 1; j < flyingEntities.length; j++) {
          const b = flyingEntities[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dz = a.z - b.z;
          const distSq = dx * dx + dy * dy + dz * dz;
          const maxDist = 210;
          if (distSq < maxDist * maxDist) {
            const dist = Math.sqrt(distSq);
            const mutualBoost = (1 - dist / maxDist) * 0.35;
            a.proxBoost = Math.max(a.proxBoost, mutualBoost);
            b.proxBoost = Math.max(b.proxBoost, mutualBoost);
          }
        }
      }

      }

      // -----------------------------------------------------------------------
      // 3D PHYSICAL MOTION & MOMENTUM INTEGRATION
      // -----------------------------------------------------------------------
      // Update shared camera refs for projection & hit-testing
      activeCamRef.camX = camX;
      activeCamRef.camY = camY;
      activeCamRef.camZ = camZ + scrollDepthShift;
      activeCamRef.parallaxX = parallaxX;
      activeCamRef.parallaxY = parallaxY;

      for (let i = flyingEntities.length - 1; i >= 0; i--) {
        const ent = flyingEntities[i];

        // 1. STATE: GRABBED (Physically attached to cursor, carry anywhere)
        if (ent.physicsState === 'GRABBED') {
          ent.grabProgress += (1.0 - ent.grabProgress) * 0.22;
          ent.hoverProgress += (1.0 - ent.hoverProgress) * 0.22;

          // Screen target taking into account the exact point where grabbed
          const targetScreenX = pointerRef.x - pointerRef.grabOffsetX;
          const targetScreenY = pointerRef.y - pointerRef.grabOffsetY;

          // Bring slightly forward in depth for tactile responsiveness
          const targetZ = Math.max(120, ent.baseZ - 60);
          ent.z += (targetZ - ent.z) * 0.15;

          const relZ = Math.max(ent.z + camZ + scrollDepthShift, 12);
          const currentScale = fov / (fov + relZ);

          // Exact 3D inverse projection:
          // projX = width / 2 + (worldX - width / 2 - camX + parallaxX) * scale
          // => worldX = width / 2 + (targetScreenX - width / 2) / scale + camX - parallaxX
          const targetWorldX = width / 2 + (targetScreenX - width / 2) / currentScale + camX - parallaxX;
          const targetWorldY = height / 2 + (targetScreenY - height / 2) / currentScale + camY - parallaxY;

          const prevX = ent.x;
          const prevY = ent.y;

          // Highly responsive follow (firmly attached, zero sluggish lag)
          ent.x += (targetWorldX - ent.x) * 0.85;
          ent.y += (targetWorldY - ent.y) * 0.85;

          const moveDeltaX = ent.x - prevX;
          const moveDeltaY = ent.y - prevY;

          // Natural 3D rotation reflecting hand carry direction & weight
          ent.rotY += moveDeltaX * 0.0035;
          ent.rotX -= moveDeltaY * 0.0035;
          ent.rotZ += moveDeltaX * 0.0018;

          // Gentle spring return towards neutral roll
          ent.rotZ *= 0.95;

          // Continuously sync autonomous spline anchor so upon release
          // it NEVER teleports or jumps back to its original origin
          const harmonicX = Math.sin(ent.age * ent.curveFreqX + ent.curvePhaseX) * ent.curveAmpX;
          const harmonicY = Math.cos(ent.age * ent.curveFreqY + ent.curvePhaseY) * ent.curveAmpY;
          const harmonicZ = Math.sin(ent.age * ent.curveFreqZ + ent.curvePhaseZ) * ent.curveAmpZ;
          ent.baseX = ent.x - harmonicX;
          ent.baseY = ent.y - harmonicY;
          ent.baseZ = ent.z - harmonicZ;
        }

        // 2. STATE: THROWN / MOMENTUM (Flying with real inertia, damping & bounce)
        else if (ent.physicsState === 'THROWN' || ent.physicsState === 'MOMENTUM') {
          ent.grabProgress += (0.0 - ent.grabProgress) * 0.10;
          ent.hoverProgress += (0.0 - ent.hoverProgress) * 0.10;

          // Apply throw velocity
          ent.x += ent.throwVx;
          ent.y += ent.throwVy;
          ent.z += ent.throwVz;

          ent.rotX += ent.throwRotVx;
          ent.rotY += ent.throwRotVy;
          ent.rotZ += ent.throwRotVz;

          // Air resistance damping (smooth gradual decay)
          ent.throwVx *= 0.985;
          ent.throwVy *= 0.985;
          ent.throwVz *= 0.985;
          ent.throwRotVx *= 0.982;
          ent.throwRotVy *= 0.982;
          ent.throwRotVz *= 0.982;

          // Soft Viewport Boundary Bouncing (Preserve 75% speed in reverse)
          const padX = 35;
          const padY = 35;
          if (ent.x < padX) {
            ent.x = padX;
            ent.throwVx = -ent.throwVx * 0.75;
            ent.throwRotVy = -ent.throwRotVy * 0.75 + (Math.random() - 0.5) * 0.02;
          } else if (ent.x > width - padX) {
            ent.x = width - padX;
            ent.throwVx = -ent.throwVx * 0.75;
            ent.throwRotVy = -ent.throwRotVy * 0.75 + (Math.random() - 0.5) * 0.02;
          }

          if (ent.y < padY) {
            ent.y = padY;
            ent.throwVy = -ent.throwVy * 0.75;
            ent.throwRotVx = -ent.throwRotVx * 0.75 + (Math.random() - 0.5) * 0.02;
          } else if (ent.y > height - padY) {
            ent.y = height - padY;
            ent.throwVy = -ent.throwVy * 0.75;
            ent.throwRotVx = -ent.throwRotVx * 0.75 + (Math.random() - 0.5) * 0.02;
          }

          // Depth bounds
          if (ent.z < 120) {
            ent.z = 120;
            ent.throwVz = Math.abs(ent.throwVz) * 0.75;
          } else if (ent.z > 720) {
            ent.z = 720;
            ent.throwVz = -Math.abs(ent.throwVz) * 0.75;
          }

          // Continuously anchor autonomous spline origin to current 3D position
          const harmonicX = Math.sin(ent.age * ent.curveFreqX + ent.curvePhaseX) * ent.curveAmpX;
          const harmonicY = Math.cos(ent.age * ent.curveFreqY + ent.curvePhaseY) * ent.curveAmpY;
          const harmonicZ = Math.sin(ent.age * ent.curveFreqZ + ent.curvePhaseZ) * ent.curveAmpZ;
          ent.baseX = ent.x - harmonicX;
          ent.baseY = ent.y - harmonicY;
          ent.baseZ = ent.z - harmonicZ;

          // Seamless transition back to AUTONOMOUS when velocity is gentle
          const currentSpeed = Math.sqrt(ent.throwVx * ent.throwVx + ent.throwVy * ent.throwVy);
          if (currentSpeed < 0.35) {
            ent.physicsState = 'AUTONOMOUS';
            const normVx = currentSpeed > 0.01 ? ent.throwVx / currentSpeed : (Math.random() - 0.5);
            const normVy = currentSpeed > 0.01 ? ent.throwVy / currentSpeed : (Math.random() - 0.5);
            ent.vx = normVx * 0.22 + (Math.random() - 0.5) * 0.12;
            ent.vy = normVy * 0.16 + (Math.random() - 0.5) * 0.10;
            ent.vz = (Math.random() - 0.5) * 0.12;
            ent.throwVx = 0;
            ent.throwVy = 0;
            ent.throwVz = 0;
          }
        }

        // 3. STATE: AUTONOMOUS / HOVER (Continuous smooth 3D curved spline flight)
        else {
          const isTargetHover = pointerRef.hoveredEntity?.id === ent.id;
          const targetH = isTargetHover ? 1.0 : 0.0;
          ent.hoverProgress += (targetH - ent.hoverProgress) * 0.12;
          ent.grabProgress += (0.0 - ent.grabProgress) * 0.12;

          if (!prefersReducedMotion) {
            ent.age += dt;
            ent.baseX += ent.vx;
            ent.baseY += ent.vy;
            ent.baseZ += ent.vz;

            ent.x = ent.baseX + Math.sin(ent.age * ent.curveFreqX + ent.curvePhaseX) * ent.curveAmpX;
            ent.y = ent.baseY + Math.cos(ent.age * ent.curveFreqY + ent.curvePhaseY) * ent.curveAmpY;
            ent.z = ent.baseZ + Math.sin(ent.age * ent.curveFreqZ + ent.curvePhaseZ) * ent.curveAmpZ;

            ent.rotX += ent.rotSpeedX;
            ent.rotY += ent.rotSpeedY;
            ent.rotZ += ent.rotSpeedZ;
          }

          // Recycle ONLY when autonomous and well outside screen bounds
          const isOutOfScreen =
            ent.x < -width * 0.25 ||
            ent.x > width * 1.25 ||
            ent.y < -height * 0.25 ||
            ent.y > height * 1.25 ||
            ent.z < 80 ||
            ent.z > 880;

          if (isOutOfScreen && ent.age > 8) {
            flyingEntities.splice(i, 1);
            flyingEntities.push(spawnFlyingEntity());
          }
        }
      }

      while (flyingEntities.length < targetEntityCount) {
        flyingEntities.push(spawnFlyingEntity());
      }

      // Depth Sorting: Furthest objects rendered first
      flyingEntities.sort((a, b) => b.z - a.z);

      // Render all entities
      flyingEntities.forEach((obj) => {
        const proj = project(
          { x: obj.x, y: obj.y, z: obj.z },
          camX,
          camY,
          camZ + scrollDepthShift,
          parallaxX,
          parallaxY
        );

        if (proj.scale <= 0) return;

        // Dynamic Safe Zone Attenuation (Retain 100% visibility when user interacts)
        const isInteracting =
          obj.physicsState === 'GRABBED' ||
          obj.physicsState === 'THROWN' ||
          obj.physicsState === 'MOMENTUM' ||
          obj.grabProgress > 0.05;

        const safeFactor = isInteracting ? 1.0 : computeSafeZoneFactor(proj.x, proj.y);

        // Edge fade (Do not fade out while user is carrying or throwing near edges)
        const edgeFadeX = isInteracting ? 1.0 : Math.min(1, Math.min(proj.x + 80, width + 80 - proj.x) / 100);
        const edgeFadeY = isInteracting ? 1.0 : Math.min(1, Math.min(proj.y + 80, height + 80 - proj.y) / 100);
        const edgeAlpha = Math.max(0, Math.min(1, edgeFadeX * edgeFadeY));

        const { lightBoost, waveBoost } = getIlluminationBoost(obj.x, obj.y, obj.z);

        // Continuous Distance-Based Proximity Lighting System
        // z ranges from ~100 (near foreground) to ~750 (deep background)
        const normZ = Math.max(0, Math.min(1, (obj.z - 110) / (720 - 110)));
        const rawProximity = 1.0 - normZ; // 1.0 near, 0.0 far
        const smoothProximity = rawProximity * rawProximity * (3 - 2 * rawProximity); // Smoothstep S-curve

        // Far distance: 10-12% light, Near foreground: 100% light
        const targetDistanceLight = 0.12 + smoothProximity * 0.88;
        
        // Continuous smooth interpolation (currentLight += (targetLight - currentLight) * factor)
        obj.currentIllum += (targetDistanceLight - obj.currentIllum) * 0.08;

        // Grab Light: subtle 15% increase when grabbed (100% -> 115%), never exploding
        const grabLightMultiplier = 1.0 + obj.grabProgress * 0.15;
        const effectiveIllum = Math.min(1.15, (obj.currentIllum + lightBoost * 0.25 + waveBoost * 0.35 + obj.proxBoost * 0.25) * grabLightMultiplier);

        const finalAlpha =
          (obj.baseOpacity * (0.4 + smoothProximity * 0.6) + effectiveIllum * 0.22 + obj.hoverProgress * 0.12) *
          edgeAlpha *
          safeFactor *
          revealProgress;

        if (finalAlpha < 0.010) return;

        ctx.save();
        ctx.translate(proj.x, proj.y);

        // Interactive Grab Scale (1.0 -> 1.04) & Hover Scale (1.0 -> 1.02)
        const interactiveScale = 1.0 + obj.hoverProgress * 0.02 + obj.grabProgress * 0.04;
        ctx.scale(interactiveScale, interactiveScale);

        // Grab Golden Aura Glow
        if (obj.grabProgress > 0.02) {
          const grabAuraSize = spriteGrabAura.width * proj.scale * 1.3;
          ctx.globalAlpha = obj.grabProgress * 0.45 * revealProgress;
          ctx.drawImage(
            spriteGrabAura,
            -grabAuraSize / 2,
            -grabAuraSize / 2,
            grabAuraSize,
            grabAuraSize
          );
          ctx.globalAlpha = 1.0;
        }

        // CONTINUOUS COLOR TRANSITION BASED ON DISTANCE & ILLUMINATION:
        // Far away: dark black / dark burgundy (low contrast, desaturated)
        // Mid-distance: warm deep burgundy -> subtle amber gold
        // Near foreground: brilliant warm champagne gold
        const interpVal = Math.max(0, Math.min(1, effectiveIllum));
        let colR: number, colG: number, colB: number;
        if (interpVal < 0.35) {
          // Far: Dark black/burgundy (38, 12, 18) to warm burgundy (88, 24, 34)
          const p = interpVal / 0.35;
          colR = Math.round(38 + (88 - 38) * p);
          colG = Math.round(12 + (24 - 12) * p);
          colB = Math.round(18 + (34 - 18) * p);
        } else if (interpVal < 0.70) {
          // Mid: Warm burgundy (88, 24, 34) to rich amber gold (195, 140, 56)
          const p = (interpVal - 0.35) / 0.35;
          colR = Math.round(88 + (195 - 88) * p);
          colG = Math.round(24 + (140 - 24) * p);
          colB = Math.round(34 + (56 - 34) * p);
        } else {
          // Near: Rich amber gold (195, 140, 56) to luminous champagne gold (255, 238, 180)
          const p = Math.min(1, (interpVal - 0.70) / 0.30);
          colR = Math.round(195 + (255 - 195) * p);
          colG = Math.round(140 + (238 - 140) * p);
          colB = Math.round(56 + (180 - 56) * p);
        }

        const strokeAlpha = Math.min(1.0, finalAlpha * (0.6 + effectiveIllum * 0.5));
        const fillAlpha = Math.min(1.0, finalAlpha * (0.4 + effectiveIllum * 0.45));
        const goldStroke = `rgba(${colR}, ${colG}, ${colB}, ${strokeAlpha})`;
        const goldFill = `rgba(${Math.round(colR * 0.9)}, ${Math.round(colG * 0.9)}, ${Math.round(colB * 0.9)}, ${fillAlpha})`;

        const rx = obj.rotX;
        const ry = obj.rotY;
        const rz = obj.rotZ;

        // =====================================================================
        // ARCHETYPE: 3D HARDCOVER BOOKS (MATEMATIKA & ENGLISH)
        // =====================================================================
        if ((obj.archetype === 'book_math' || obj.archetype === 'book_english') && obj.bookWidth && obj.bookHeight && obj.bookThickness) {
          const bw = obj.bookWidth * proj.scale;
          const bh = obj.bookHeight * proj.scale;
          const bThick = obj.bookThickness * proj.scale;

          const openAngle = (obj.hoverProgress + obj.grabProgress) * 0.08;
          ctx.rotate(rz + openAngle);

          // Shadow depth boost when grabbed
          const shadowOffset = 2 + obj.grabProgress * 3;
          ctx.beginPath();
          ctx.roundRect(-bw / 2 + shadowOffset, -bh / 2 + shadowOffset, bw, bh, 3);
          ctx.fillStyle = `rgba(5, 3, 4, ${0.45 + obj.grabProgress * 0.35})`;
          ctx.fill();

          // Stacked Book Pages Texture
          ctx.fillStyle = `rgba(235, 222, 195, ${finalAlpha * 0.85})`;
          ctx.fillRect(-bw / 2 + bw - bThick * 0.35, -bh / 2 + 2, bThick * 0.35, bh - 4);

          // Front Cover
          ctx.beginPath();
          ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 3);
          ctx.fillStyle = obj.coverColor || '#4A0E17';
          ctx.globalAlpha = finalAlpha * 0.95;
          ctx.fill();

          // Gold Double Hairline Border
          ctx.strokeStyle = `rgba(255, 235, 170, ${(finalAlpha + effectiveIllum * 0.5) * 0.9})`;
          ctx.lineWidth = 1.1 + obj.grabProgress * 0.4;
          ctx.stroke();

          // Inner gold inlay frame
          ctx.beginPath();
          ctx.roundRect(-bw / 2 + 3.5, -bh / 2 + 3.5, bw - 7, bh - 7, 2);
          ctx.strokeStyle = `rgba(217, 168, 63, ${finalAlpha * 0.65})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();

          // 3D Spine Line
          ctx.beginPath();
          ctx.moveTo(-bw / 2 + bThick * 0.45, -bh / 2);
          ctx.lineTo(-bw / 2 + bThick * 0.45, bh / 2);
          ctx.strokeStyle = `rgba(255, 245, 215, ${finalAlpha * 0.95})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Gold Cover Typography
          ctx.font = `bold ${Math.max(6, Math.floor(7.5 * proj.scale))}px -apple-system, sans-serif`;
          ctx.fillStyle = `rgba(255, 245, 215, ${finalAlpha * 1.15})`;
          ctx.letterSpacing = '1.2px';
          ctx.textAlign = 'center';
          ctx.fillText(obj.title || '', 0, 4);
        }

        // =====================================================================
        // ARCHETYPE: 3D PARABOLA (y = x²) with 3D Axes & Vector Arrows
        // =====================================================================
        else if (obj.archetype === 'parabola') {
          const s = obj.baseSize * proj.scale;

          ctx.strokeStyle = goldStroke;
          ctx.lineWidth = 1.15;
          ctx.beginPath();
          const pStart = rotate3D({ x: -40 * (s / 32), y: 22 * (s / 32), z: 0 }, rx, ry, rz);
          ctx.moveTo(pStart.x, pStart.y);

          for (let px = -36; px <= 40; px += 4) {
            const py = (0.024 * px * px - 18) * (s / 32);
            const pt = rotate3D({ x: px * (s / 32), y: py, z: 0 }, rx, ry, rz);
            ctx.lineTo(pt.x, pt.y);
          }
          ctx.stroke();

          ctx.strokeStyle = `rgba(217, 168, 63, ${finalAlpha * 0.75})`;
          ctx.lineWidth = 0.85;
          ctx.setLineDash([3, 5]);

          const pX1 = rotate3D({ x: -48 * (s / 32), y: 0, z: 0 }, rx, ry, rz);
          const pX2 = rotate3D({ x: 48 * (s / 32), y: 0, z: 0 }, rx, ry, rz);
          ctx.beginPath();
          ctx.moveTo(pX1.x, pX1.y);
          ctx.lineTo(pX2.x, pX2.y);
          ctx.stroke();

          const pY1 = rotate3D({ x: 0, y: 24 * (s / 32), z: 0 }, rx, ry, rz);
          const pY2 = rotate3D({ x: 0, y: -30 * (s / 32), z: 0 }, rx, ry, rz);
          ctx.beginPath();
          ctx.moveTo(pY1.x, pY1.y);
          ctx.lineTo(pY2.x, pY2.y);
          ctx.stroke();
          ctx.setLineDash([]);

          const pYTip1 = rotate3D({ x: -3 * (s / 32), y: -24 * (s / 32), z: 0 }, rx, ry, rz);
          const pYTip2 = rotate3D({ x: 3 * (s / 32), y: -24 * (s / 32), z: 0 }, rx, ry, rz);
          ctx.beginPath();
          ctx.moveTo(pYTip1.x, pYTip1.y);
          ctx.lineTo(pY2.x, pY2.y);
          ctx.lineTo(pYTip2.x, pYTip2.y);
          ctx.stroke();

          ctx.font = `italic 600 ${Math.max(7, Math.floor(10 * proj.scale))}px "Playfair Display", Georgia, serif`;
          ctx.fillStyle = goldFill;
          const pLabel = rotate3D({ x: 16 * (s / 32), y: -22 * (s / 32), z: 0 }, rx, ry, rz);
          ctx.fillText('y = x²', pLabel.x, pLabel.y);
        }

        // =====================================================================
        // ARCHETYPE: 3D SINUSOIDAL FUNCTION WAVE (y = sin(x))
        // =====================================================================
        else if (obj.archetype === 'sinewave') {
          const s = obj.baseSize * proj.scale;
          const waveT = elapsed * 1.8;

          ctx.strokeStyle = goldStroke;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          const pStart = rotate3D(
            { x: -55 * (s / 36), y: 16 * Math.sin(-55 * 0.08 + waveT) * (s / 36), z: 0 },
            rx, ry, rz
          );
          ctx.moveTo(pStart.x, pStart.y);

          for (let px = -50; px <= 55; px += 5) {
            const py = 16 * Math.sin(px * 0.08 + waveT) * (s / 36);
            const pt = rotate3D({ x: px * (s / 36), y: py, z: 0 }, rx, ry, rz);
            ctx.lineTo(pt.x, pt.y);
          }
          ctx.stroke();

          ctx.strokeStyle = `rgba(217, 168, 63, ${finalAlpha * 0.65})`;
          ctx.lineWidth = 0.8;
          ctx.setLineDash([2, 6]);
          const ax1 = rotate3D({ x: -62 * (s / 36), y: 0, z: 0 }, rx, ry, rz);
          const ax2 = rotate3D({ x: 62 * (s / 36), y: 0, z: 0 }, rx, ry, rz);
          ctx.beginPath();
          ctx.moveTo(ax1.x, ax1.y);
          ctx.lineTo(ax2.x, ax2.y);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.font = `italic 600 ${Math.max(7, Math.floor(9.5 * proj.scale))}px "Playfair Display", Georgia, serif`;
          ctx.fillStyle = goldFill;
          const pLabel = rotate3D({ x: -30 * (s / 36), y: -18 * (s / 36), z: 0 }, rx, ry, rz);
          ctx.fillText('y = sin(x)', pLabel.x, pLabel.y);
        }

        // =====================================================================
        // ARCHETYPE: 3D HOLOGRAPHIC PERSPECTIVE COORDINATE GRID PLANE
        // =====================================================================
        else if (obj.archetype === 'grid3d') {
          const s = obj.baseSize * proj.scale;
          const gridSize = 45 * (s / 42);
          const step = gridSize / 3;

          ctx.strokeStyle = `rgba(243, 210, 118, ${finalAlpha * 0.75})`;
          ctx.lineWidth = 0.85;
          ctx.setLineDash([3, 5]);

          for (let gz = -gridSize; gz <= gridSize; gz += step) {
            const p1 = rotate3D({ x: -gridSize, y: 0, z: gz }, rx, ry, rz);
            const p2 = rotate3D({ x: gridSize, y: 0, z: gz }, rx, ry, rz);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }

          for (let gx = -gridSize; gx <= gridSize; gx += step) {
            const p1 = rotate3D({ x: gx, y: 0, z: -gridSize }, rx, ry, rz);
            const p2 = rotate3D({ x: gx, y: 0, z: gridSize }, rx, ry, rz);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
          ctx.setLineDash([]);

          const origin = rotate3D({ x: 0, y: 0, z: 0 }, rx, ry, rz);
          const axisX = rotate3D({ x: gridSize * 1.15, y: 0, z: 0 }, rx, ry, rz);
          const axisZ = rotate3D({ x: 0, y: 0, z: gridSize * 1.15 }, rx, ry, rz);

          ctx.lineWidth = 1.1;
          ctx.strokeStyle = goldStroke;
          ctx.beginPath();
          ctx.moveTo(origin.x, origin.y);
          ctx.lineTo(axisX.x, axisX.y);
          ctx.moveTo(origin.x, origin.y);
          ctx.lineTo(axisZ.x, axisZ.y);
          ctx.stroke();
        }

        // =====================================================================
        // ARCHETYPE: 3D GLASS CUBE
        // =====================================================================
        else if (obj.archetype === 'cube') {
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

          const geomScale = obj.baseSize * proj.scale;
          const projectedCube = cubeVertices.map((v) => {
            const rot = rotate3D(v, rx, ry, rz);
            return { x: rot.x * geomScale, y: rot.y * geomScale };
          });

          ctx.fillStyle = `rgba(34, 10, 15, ${finalAlpha * 0.35})`;
          ctx.beginPath();
          ctx.moveTo(projectedCube[0].x, projectedCube[0].y);
          ctx.lineTo(projectedCube[1].x, projectedCube[1].y);
          ctx.lineTo(projectedCube[2].x, projectedCube[2].y);
          ctx.lineTo(projectedCube[3].x, projectedCube[3].y);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = goldStroke;
          ctx.lineWidth = 0.95;
          ctx.setLineDash([3, 5]);
          cubeEdges.forEach(([i, j]) => {
            ctx.beginPath();
            ctx.moveTo(projectedCube[i].x, projectedCube[i].y);
            ctx.lineTo(projectedCube[j].x, projectedCube[j].y);
            ctx.stroke();
          });
          ctx.setLineDash([]);
        }

        // =====================================================================
        // ARCHETYPE: 3D PYRAMID (Tetrahedron)
        // =====================================================================
        else if (obj.archetype === 'pyramid') {
          const pyrVertices: Point3D[] = [
            { x: 0, y: -1.4, z: 0 },
            { x: -1, y: 0.9, z: -1 },
            { x: 1, y: 0.9, z: -1 },
            { x: 1, y: 0.9, z: 1 },
            { x: -1, y: 0.9, z: 1 },
          ];
          const pyrEdges: [number, number][] = [
            [0, 1], [0, 2], [0, 3], [0, 4],
            [1, 2], [2, 3], [3, 4], [4, 1],
          ];

          const geomScale = obj.baseSize * proj.scale;
          const projectedPyr = pyrVertices.map((v) => {
            const rot = rotate3D(v, rx, ry, rz);
            return { x: rot.x * geomScale, y: rot.y * geomScale };
          });

          ctx.fillStyle = `rgba(34, 10, 15, ${finalAlpha * 0.35})`;
          ctx.beginPath();
          ctx.moveTo(projectedPyr[1].x, projectedPyr[1].y);
          ctx.lineTo(projectedPyr[2].x, projectedPyr[2].y);
          ctx.lineTo(projectedPyr[3].x, projectedPyr[3].y);
          ctx.lineTo(projectedPyr[4].x, projectedPyr[4].y);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = goldStroke;
          ctx.lineWidth = 0.95;
          ctx.setLineDash([4, 6]);
          pyrEdges.forEach(([i, j]) => {
            ctx.beginPath();
            ctx.moveTo(projectedPyr[i].x, projectedPyr[i].y);
            ctx.lineTo(projectedPyr[j].x, projectedPyr[j].y);
            ctx.stroke();
          });
          ctx.setLineDash([]);
        }

        // =====================================================================
        // ARCHETYPE: 3D TORUS
        // =====================================================================
        else if (obj.archetype === 'torus') {
          const s = obj.baseSize * proj.scale;
          ctx.strokeStyle = goldStroke;
          ctx.lineWidth = 0.9;

          const R = 18 * (s / 30);
          const r = 8 * (s / 30);

          for (let phi = 0; phi < Math.PI; phi += Math.PI / 4) {
            ctx.beginPath();
            for (let theta = 0; theta <= Math.PI * 2; theta += Math.PI / 8) {
              const x = (R + r * Math.cos(theta)) * Math.cos(phi);
              const y = r * Math.sin(theta);
              const z = (R + r * Math.cos(theta)) * Math.sin(phi);
              const pt = rotate3D({ x, y, z }, rx, ry, rz);
              if (theta === 0) ctx.moveTo(pt.x, pt.y);
              else ctx.lineTo(pt.x, pt.y);
            }
            ctx.stroke();
          }
        }

        // =====================================================================
        // ARCHETYPE: 3D SPIRAL / HELIX
        // =====================================================================
        else if (obj.archetype === 'spiral') {
          const s = obj.baseSize * proj.scale;
          ctx.strokeStyle = goldStroke;
          ctx.lineWidth = 1.0;
          ctx.beginPath();

          for (let t = 0; t <= Math.PI * 5; t += Math.PI / 10) {
            const rad = (10 + t * 1.8) * (s / 22);
            const x = rad * Math.cos(t);
            const y = rad * Math.sin(t);
            const z = (t - Math.PI * 2.5) * 5 * (s / 22);
            const pt = rotate3D({ x, y, z }, rx, ry, rz);
            if (t === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
          ctx.stroke();
        }

        // =====================================================================
        // ARCHETYPE: 3D CONE
        // =====================================================================
        else if (obj.archetype === 'cone') {
          const s = obj.baseSize * proj.scale;
          ctx.strokeStyle = goldStroke;
          ctx.lineWidth = 0.95;

          const baseR = 16 * (s / 28);
          const apexY = -22 * (s / 28);
          const baseY = 16 * (s / 28);

          const apex = rotate3D({ x: 0, y: apexY, z: 0 }, rx, ry, rz);

          ctx.beginPath();
          for (let a = 0; a <= Math.PI * 2; a += Math.PI / 8) {
            const bx = baseR * Math.cos(a);
            const bz = baseR * Math.sin(a);
            const pt = rotate3D({ x: bx, y: baseY, z: bz }, rx, ry, rz);
            if (a === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
          ctx.stroke();

          for (let a = 0; a < Math.PI * 2; a += Math.PI / 2) {
            const bx = baseR * Math.cos(a);
            const bz = baseR * Math.sin(a);
            const bpt = rotate3D({ x: bx, y: baseY, z: bz }, rx, ry, rz);
            ctx.beginPath();
            ctx.moveTo(apex.x, apex.y);
            ctx.lineTo(bpt.x, bpt.y);
            ctx.stroke();
          }
        }

        // =====================================================================
        // ARCHETYPES: MATHEMATICS & ENGLISH TOKENS
        // =====================================================================
        else {
          ctx.rotate(rz);
          const renderSize = Math.max(8, Math.floor(obj.baseSize * proj.scale));

          if (obj.archetype === 'math_pi') {
            ctx.font = `italic 600 ${renderSize}px "Playfair Display", Georgia, serif`;
            ctx.fillStyle = goldFill;
            ctx.fillText('π', 0, 0);
          } else if (obj.archetype === 'math_sqrt') {
            ctx.save();
            ctx.strokeStyle = goldStroke;
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(-renderSize * 0.6, 2);
            ctx.lineTo(-renderSize * 0.35, renderSize * 0.5);
            ctx.lineTo(-renderSize * 0.1, -renderSize * 0.6);
            ctx.lineTo(renderSize * 0.6, -renderSize * 0.6);
            ctx.stroke();
            ctx.font = `italic 600 ${Math.floor(renderSize * 0.85)}px "Playfair Display", Georgia, serif`;
            ctx.fillStyle = goldFill;
            ctx.fillText('x', 0, 0);
            ctx.restore();
          } else if (obj.archetype === 'eng_abc') {
            ctx.save();
            ctx.font = `bold ${renderSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
            ctx.letterSpacing = '2px';
            ctx.fillStyle = `rgba(34, 10, 15, ${finalAlpha * 0.7})`;
            ctx.fillText('ABC', 1.5, 1.5);
            ctx.fillStyle = goldFill;
            ctx.fillText('ABC', 0, 0);
            ctx.restore();
          } else if (obj.text) {
            ctx.font = `600 ${renderSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
            ctx.fillStyle = goldFill;
            ctx.letterSpacing = `${Math.max(1, 1.8 * proj.scale)}px`;
            ctx.fillText(obj.text, 0, 0);
          }
        }

        ctx.restore();
      });

      // -----------------------------------------------------------------------
      // ATMOSPHERIC DUST PARTICLES (Light-reactive motes)
      // -----------------------------------------------------------------------
      dustParticles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;
          p.phase += p.pulseSpeed;
        }

        if (p.y < -30) {
          p.y = height + 25;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 25;
        if (p.x > width + 30) p.x = -25;
        if (p.z < 25) p.z = 780;
        if (p.z > 800) p.z = 30;

        const proj = project(p, camX, camY, camZ + scrollDepthShift, parallaxX, parallaxY);
        if (proj.scale <= 0) return;

        const { lightBoost, waveBoost } = getIlluminationBoost(p.x, p.y, p.z);
        const pulse = 0.8 + 0.2 * Math.sin(p.phase);
        const pAlpha =
          (p.baseAlpha + lightBoost * 0.45 + waveBoost * 0.55) * pulse * revealProgress;

        const sprite = p.z < 300 ? spriteMote : spriteDust;
        const spriteSize = sprite.width * proj.scale * 1.2;
        const pY = (proj.y - scrollShift + height) % height;

        ctx.globalAlpha = pAlpha;
        ctx.drawImage(
          sprite,
          proj.x - spriteSize / 2,
          pY - spriteSize / 2,
          spriteSize,
          spriteSize
        );
      });
      ctx.globalAlpha = 1.0;

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('selectstart', handleSelectStart, { capture: true } as any);
      document.removeEventListener('dragstart', handleDragStart, { capture: true } as any);
      setSelectionShield(false);      if (animFrameIdRef.current) {
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
        Layer 1 Base Colors: Deep Black, Dark Burgundy & Subtle Warm Wine
        #050304 -> #0D0508 -> #16070B -> #220A0F
      */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050304] via-[#0D0508] to-[#050304] opacity-98" />
      <div className="absolute top-0 right-0 w-[58vw] h-[58vw] rounded-full bg-radial from-[#220A0F]/35 via-[#16070B]/15 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[48vw] h-[48vw] rounded-full bg-radial from-[#D9A83F]/06 via-[#16070B]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Global High-Performance 60FPS 3D Universe Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block select-none pointer-events-none"
        style={{ touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}
      />
    </div>
  );
};
