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

// Complete Archetype Roster for the 3D Floating Education World
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
  // 3D Coordinates & Flight Velocity
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  // 3D Rotations & Angular Velocities
  rotX: number;
  rotY: number;
  rotZ: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  // Sizing & Base Opacity
  baseSize: number;
  baseOpacity: number;
  // Lifecycle
  age: number;
  lifetime: number; // Flight duration (seconds)
  hoverProgress: number; // 0 to 1 smooth physical reaction
  // Object-to-object mutual proximity boost
  proxBoost: number;
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

    // Smooth Mouse Tracking
    const handleMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseRef.current.targetX = (e.clientX - halfW) / halfW;
      mouseRef.current.targetY = (e.clientY - halfH) / halfH;
      mouseRef.current.screenX = e.clientX;
      mouseRef.current.screenY = e.clientY;
      mouseRef.current.isInside = true;
    };
    const handleMouseLeave = () => {
      mouseRef.current.isInside = false;
      mouseRef.current.screenX = -9999;
      mouseRef.current.screenY = -9999;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Scroll Tracking
    const handleScroll = () => {
      scrollRef.current.targetY = window.scrollY;
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
    // 5. CONTINUOUS 3D TRAFFIC & FLIGHT ENGINE
    // Objects continuously fly across the 3D space, enter, traverse, and exit
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

    // Helper to spawn a new entity from one of diverse 3D entry portals
    const spawnFlyingEntity = (portalIndex?: number, forcedArchetype?: ArchetypeType): FlyingEntity3D => {
      entitySpawnCounter++;
      const pIndex = portalIndex !== undefined ? portalIndex : Math.floor(Math.random() * 6);
      const archetype = forcedArchetype || ARCHETYPES_CATALOG[entitySpawnCounter % ARCHETYPES_CATALOG.length];

      let x = 0, y = 0, z = 300;
      let vx = 0, vy = 0, vz = 0;

      // Portal 0: Top-Left -> Diagonal Down-Right & Forward towards camera
      if (pIndex === 0) {
        x = -width * 0.08 - Math.random() * 80;
        y = height * (0.08 + Math.random() * 0.35);
        z = 450 + Math.random() * 200;
        vx = 0.35 + Math.random() * 0.25;
        vy = 0.15 + Math.random() * 0.15;
        vz = -(0.15 + Math.random() * 0.18); // Flies forward!
      }
      // Portal 1: Bottom-Right -> Diagonal Up-Left & Receding into depth
      else if (pIndex === 1) {
        x = width * 1.08 + Math.random() * 80;
        y = height * (0.60 + Math.random() * 0.30);
        z = 180 + Math.random() * 150;
        vx = -(0.32 + Math.random() * 0.22);
        vy = -(0.14 + Math.random() * 0.16);
        vz = 0.16 + Math.random() * 0.20; // Recedes into depth!
      }
      // Portal 2: Deep Background -> Forward toward Camera & Sideways Drift
      else if (pIndex === 2) {
        x = width * (0.15 + Math.random() * 0.70);
        y = height * (0.15 + Math.random() * 0.70);
        z = 700 + Math.random() * 120;
        vx = (Math.random() - 0.5) * 0.35;
        vy = (Math.random() - 0.5) * 0.25;
        vz = -(0.35 + Math.random() * 0.25); // Fast forward flight!
      }
      // Portal 3: Top -> Downward flight with gentle horizontal curve
      else if (pIndex === 3) {
        x = width * (0.35 + Math.random() * 0.55);
        y = -height * 0.10 - Math.random() * 60;
        z = 260 + Math.random() * 220;
        vx = -(0.18 + Math.random() * 0.20);
        vy = 0.30 + Math.random() * 0.25;
        vz = (Math.random() - 0.5) * 0.15;
      }
      // Portal 4: Bottom-Left -> Up-Right sweeping across behind laptop
      else if (pIndex === 4) {
        x = width * (0.05 + Math.random() * 0.25);
        y = height * 1.10 + Math.random() * 60;
        z = 320 + Math.random() * 160;
        vx = 0.32 + Math.random() * 0.24;
        vy = -(0.25 + Math.random() * 0.20);
        vz = -(0.10 + Math.random() * 0.15);
      }
      // Portal 5: Right -> Westward flight into deep background
      else {
        x = width * 1.10 + Math.random() * 80;
        y = height * (0.25 + Math.random() * 0.50);
        z = 240 + Math.random() * 180;
        vx = -(0.38 + Math.random() * 0.24);
        vy = (Math.random() - 0.5) * 0.16;
        vz = 0.18 + Math.random() * 0.22;
      }

      // Base sizes and configurations
      let baseSize = 34;
      let baseOpacity = 0.28;
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
        bookWidth = 72;
        bookHeight = 94;
        bookThickness = 17;
        coverColor = '#4A0E17';
        spineColor = '#6B1422';
      } else if (archetype === 'book_english') {
        title = 'ENGLISH';
        baseSize = 10;
        baseOpacity = 0.32;
        bookWidth = 70;
        bookHeight = 92;
        bookThickness = 16;
        coverColor = '#121A28';
        spineColor = '#1C273C';
      } else if (archetype === 'parabola') {
        formula = 'y = x²';
        baseSize = 32;
        baseOpacity = 0.30;
      } else if (archetype === 'sinewave') {
        formula = 'y = sin(x)';
        baseSize = 36;
        baseOpacity = 0.28;
      } else if (archetype === 'grid3d') {
        baseSize = 42;
        baseOpacity = 0.22;
      } else if (archetype === 'cube') {
        baseSize = 38;
        baseOpacity = 0.26;
      } else if (archetype === 'pyramid') {
        baseSize = 34;
        baseOpacity = 0.26;
      } else if (archetype === 'torus') {
        baseSize = 30;
        baseOpacity = 0.24;
      } else if (archetype === 'spiral') {
        baseSize = 24;
        baseOpacity = 0.22;
      } else if (archetype === 'cone') {
        baseSize = 28;
        baseOpacity = 0.24;
      } else if (archetype === 'math_pi') {
        text = 'π';
        baseSize = 38;
        baseOpacity = 0.18;
      } else if (archetype === 'math_sqrt') {
        text = '√x';
        baseSize = 22;
        baseOpacity = 0.24;
      } else if (archetype === 'math_pyth') {
        text = 'a² + b² = c²';
        baseSize = 16;
        baseOpacity = 0.22;
      } else if (archetype === 'math_inf') {
        text = '∞';
        baseSize = 22;
        baseOpacity = 0.20;
      } else if (archetype === 'eng_abc') {
        text = 'ABC';
        baseSize = 18;
        baseOpacity = 0.24;
      } else if (archetype === 'eng_speak') {
        text = 'PRACTICE';
        baseSize = 13;
        baseOpacity = 0.20;
      } else if (archetype === 'eng_learn') {
        text = 'LEARN';
        baseSize = 14;
        baseOpacity = 0.20;
      }

      return {
        id: `entity-${entitySpawnCounter}-${Date.now()}`,
        archetype,
        title,
        text,
        formula,
        x,
        y,
        z,
        vx,
        vy,
        vz,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: (Math.random() - 0.5) * 0.4,
        rotSpeedX: (Math.random() - 0.5) * 0.0006,
        rotSpeedY: (Math.random() - 0.5) * 0.0008,
        rotSpeedZ: (Math.random() - 0.5) * 0.0004,
        baseSize,
        baseOpacity,
        age: 0,
        lifetime: 22 + Math.random() * 16, // 22 to 38 seconds flight
        hoverProgress: 0,
        proxBoost: 0,
        bookWidth,
        bookHeight,
        bookThickness,
        coverColor,
        spineColor,
      };
    };

    // Initialize 11–13 active flying entities distributed across spatial locations
    const targetEntityCount = isMobile ? 6 : isTablet ? 9 : 12;
    const flyingEntities: FlyingEntity3D[] = [];

    // Pre-seed diverse entities so the space is alive on initial render
    for (let i = 0; i < targetEntityCount; i++) {
      const ent = spawnFlyingEntity(i % 6);
      // Advance positions randomly along flight path so they are mid-flight
      const advanceTime = Math.random() * 16;
      ent.x += ent.vx * advanceTime * 30;
      ent.y += ent.vy * advanceTime * 30;
      ent.z += ent.vz * advanceTime * 30;
      ent.age = advanceTime;
      flyingEntities.push(ent);
    }

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

        // Incomplete Arc 1: Thin architectural circle
        const r1 = 180 * projCore.scale;
        ctx.save();
        ctx.rotate(prefersReducedMotion ? 0.3 : elapsed * 0.030);
        ctx.beginPath();
        ctx.arc(0, 0, r1, -Math.PI * 0.7, Math.PI * 0.55);
        ctx.strokeStyle = `rgba(243, 210, 118, ${0.16 * coreAlpha})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();
        ctx.restore();

        // Incomplete Arc 2: Tilted 3D Mathematical Curve
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

        // Incomplete Arc 3: Distant Subtle Cosmic Rim
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
      // OBJECT-TO-OBJECT MUTUAL PROXIMITY INTERACTION
      // Evaluate pairwise distances between flying entities
      // -----------------------------------------------------------------------
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

      // -----------------------------------------------------------------------
      // UPDATE, SORT & RENDER 3D FLYING ENTITIES (Continuous Traffic)
      // -----------------------------------------------------------------------
      // Update flight vectors, rotations, and lifecycles
      for (let i = flyingEntities.length - 1; i >= 0; i--) {
        const ent = flyingEntities[i];

        if (!prefersReducedMotion) {
          ent.x += ent.vx;
          ent.y += ent.vy;
          ent.z += ent.vz;
          ent.rotX += ent.rotSpeedX;
          ent.rotY += ent.rotSpeedY;
          ent.rotZ += ent.rotSpeedZ;
          ent.age += dt;
        }

        // Check if entity has exited screen boundaries or depth limits
        const isOutOfScreen =
          ent.x < -width * 0.25 ||
          ent.x > width * 1.25 ||
          ent.y < -height * 0.25 ||
          ent.y > height * 1.25 ||
          ent.z < 90 ||
          ent.z > 860;

        if (isOutOfScreen && ent.age > 8) {
          // Replace with newly spawned entity from an opposing portal
          flyingEntities.splice(i, 1);
          flyingEntities.push(spawnFlyingEntity());
        }
      }

      // Maintain active pool count
      while (flyingEntities.length < targetEntityCount) {
        flyingEntities.push(spawnFlyingEntity());
      }

      // Depth Sorting (Painter's Algorithm): Furthest objects rendered first
      flyingEntities.sort((a, b) => b.z - a.z);

      // Render all active flying entities
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

        // Dynamic Safe Zone Attenuation
        const safeFactor = computeSafeZoneFactor(proj.x, proj.y);

        // Edge fade for smooth entry/exit
        const edgeFadeX = Math.min(1, Math.min(proj.x + 80, width + 80 - proj.x) / 100);
        const edgeFadeY = Math.min(1, Math.min(proj.y + 80, height + 80 - proj.y) / 100);
        const edgeAlpha = Math.max(0, Math.min(1, edgeFadeX * edgeFadeY));

        // Proximity Illumination from 5 moving virtual lights + Traveling Light Wave
        const { lightBoost, waveBoost } = getIlluminationBoost(obj.x, obj.y, obj.z);

        // Interactive 3D Physical Hover Reaction (400–700ms smooth spring)
        let isHovered = false;
        if (mouseRef.current.isInside && !isMobile) {
          const dxCursor = mouseRef.current.screenX - proj.x;
          const dyCursor = mouseRef.current.screenY - proj.y;
          const cursorDist = Math.sqrt(dxCursor * dxCursor + dyCursor * dyCursor);
          isHovered = cursorDist < 75;
        }
        const targetHover = isHovered ? 1.0 : 0.0;
        obj.hoverProgress += (targetHover - obj.hoverProgress) * 0.08;

        const totalIllum = lightBoost * 0.35 + waveBoost * 0.45 + obj.proxBoost * 0.40;
        const finalAlpha =
          (obj.baseOpacity + totalIllum + obj.hoverProgress * 0.18) *
          edgeAlpha *
          safeFactor *
          revealProgress;

        if (finalAlpha < 0.012) return;

        ctx.save();
        ctx.translate(proj.x, proj.y);

        // Dynamic warm gold coloration
        let goldStroke = `rgba(243, 210, 118, ${(finalAlpha + totalIllum * 0.4) * 0.95})`;
        let goldFill = `rgba(217, 168, 63, ${finalAlpha * 0.85})`;
        if (obj.z < 260) {
          goldStroke = `rgba(255, 235, 170, ${(finalAlpha + totalIllum * 0.5) * 1.0})`;
          goldFill = `rgba(255, 245, 215, ${finalAlpha * 0.95})`;
        } else if (obj.z > 500) {
          goldStroke = `rgba(195, 150, 55, ${finalAlpha * 0.75})`;
          goldFill = `rgba(185, 140, 50, ${finalAlpha * 0.65})`;
        }

        const hoverRot = obj.hoverProgress * 0.20;
        const rx = obj.rotX + hoverRot;
        const ry = obj.rotY + hoverRot;
        const rz = obj.rotZ;

        // =====================================================================
        // ARCHETYPE: 3D HARDCOVER BOOKS (MATEMATIKA & ENGLISH)
        // =====================================================================
        if ((obj.archetype === 'book_math' || obj.archetype === 'book_english') && obj.bookWidth && obj.bookHeight && obj.bookThickness) {
          const bw = obj.bookWidth * proj.scale;
          const bh = obj.bookHeight * proj.scale;
          const bThick = obj.bookThickness * proj.scale;

          const openAngle = obj.hoverProgress * 0.08;
          ctx.rotate(rz + openAngle);

          // Back cover drop shadow
          ctx.beginPath();
          ctx.roundRect(-bw / 2 + 2, -bh / 2 + 2, bw, bh, 3);
          ctx.fillStyle = 'rgba(5, 3, 4, 0.5)';
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
          ctx.strokeStyle = `rgba(255, 235, 170, ${(finalAlpha + totalIllum * 0.5) * 0.9})`;
          ctx.lineWidth = 1.1;
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

          // Coordinate Axes: X-axis & Y-axis with dashed intervals
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

          // Vector Arrowhead
          const pYTip1 = rotate3D({ x: -3 * (s / 32), y: -24 * (s / 32), z: 0 }, rx, ry, rz);
          const pYTip2 = rotate3D({ x: 3 * (s / 32), y: -24 * (s / 32), z: 0 }, rx, ry, rz);
          ctx.beginPath();
          ctx.moveTo(pYTip1.x, pYTip1.y);
          ctx.lineTo(pY2.x, pY2.y);
          ctx.lineTo(pYTip2.x, pYTip2.y);
          ctx.stroke();

          // Formula text: y = x²
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

          // Baseline axis
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

          // Apex point
          const apex = rotate3D({ x: 0, y: apexY, z: 0 }, rx, ry, rz);

          // Base circular loop
          ctx.beginPath();
          for (let a = 0; a <= Math.PI * 2; a += Math.PI / 8) {
            const bx = baseR * Math.cos(a);
            const bz = baseR * Math.sin(a);
            const pt = rotate3D({ x: bx, y: baseY, z: bz }, rx, ry, rz);
            if (a === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
          ctx.stroke();

          // Generator lines from apex to 4 base points
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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
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
        Layer 1 Base Colors: Deep Black, Dark Burgundy & Subtle Warm Wine
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
