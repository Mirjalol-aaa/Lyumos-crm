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

interface ArtDirectedObject3D {
  id: string;
  layer: 2 | 3 | 5; // Layer 2: Distant World, Layer 3: Main Environment, Layer 5: Atmosphere
  type: 'math' | 'english' | 'book' | 'geometry';
  title?: string;
  text?: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  baseSize: number;
  baseOpacity: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  wavePhase: number;
  waveSpeed: number;
  waveAmp: number;
  zPhase: number;
  zSpeed: number;
  zAmp: number;
  hoverProgress: number; // 0 to 1 smooth physical reaction
  mobileVisible?: boolean;
  // Book specific dimensions
  bookWidth?: number;
  bookHeight?: number;
  bookThickness?: number;
  coverColor?: string;
  spineColor?: string;
  // Geometry specific
  geomType?: 'cube' | 'octahedron' | 'ring' | 'prism';
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

    // Smooth Mouse Tracking (Screen coordinates for physical hover, normalized for parallax)
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
    // Continuous 3D multi-frequency Lissajous paths across the environment
    // -------------------------------------------------------------------------
    const virtualLights: VirtualLight3D[] = [
      // Light 1: Hero Rim Light (Sweeps organically around the rear of laptop visual)
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
      // Light 2: Mathematics Light (Drifts across upper-left, lighting π & Math book)
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
      // Light 3: English Light (Drifts across mid-right, lighting English book & ABC)
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
      // Light 4: Deep Cosmic Light (Drifts in deep background Z = 600)
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
      // Light 5: Lower Arena Light (Sweeps across bottom space)
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
    // A soft golden wavefront sweeping through the 3D space, illuminating objects
    // -------------------------------------------------------------------------
    const generateWaveTrajectory = (cycle: number): TravelingLightWave => {
      // Alternate trajectories across cycles:
      // Cycle 0: Left flank -> curves behind headline -> behind laptop -> right flank
      // Cycle 1: Top left diagonal -> sweeping center -> bottom right
      // Cycle 2: Bottom left -> upward curve behind hero -> top right
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
        duration: 11.5, // 11.5 seconds per wave
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

    // Calculate light and wave proximity boost
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

      // Proximity to traveling light wave
      let waveBoost = 0;
      if (waveState.active) {
        const wdx = x - waveState.currentPos.x;
        const wdy = y - waveState.currentPos.y;
        const wdz = z - waveState.currentPos.z;
        const wdistSq = wdx * wdx + wdy * wdy + wdz * wdz;
        const wradSq = waveState.radius * waveState.radius;
        if (wdistSq < wradSq) {
          const wfalloff = 1 - Math.sqrt(wdistSq) / waveState.radius;
          waveBoost = Math.sin(wfalloff * Math.PI) * 0.45; // Smooth bell-curve boost
        }
      }

      return {
        lightBoost: Math.min(0.65, lightBoost),
        waveBoost: Math.min(0.50, waveBoost),
      };
    };

    // -------------------------------------------------------------------------
    // 5. ART-DIRECTED 3D OBJECTS (Sparse, physical, controlled roster)
    // -------------------------------------------------------------------------
    const artObjects: ArtDirectedObject3D[] = [
      // === LAYER 2: DISTANT WORLD (Very faint, large, slow drift) ===
      {
        id: 'dist-pi',
        layer: 2,
        type: 'math',
        text: 'π',
        x: width * 0.15,
        y: height * 0.18,
        z: 640,
        vx: 0.025,
        vy: 0.012,
        vz: 0.015,
        baseSize: 42,
        baseOpacity: 0.06,
        rotX: 0,
        rotY: 0,
        rotZ: -0.05,
        rotSpeedX: 0,
        rotSpeedY: 0,
        rotSpeedZ: 0.00008,
        wavePhase: 0.5,
        waveSpeed: 0.00035,
        waveAmp: 7,
        zPhase: 0.2,
        zSpeed: 0.0003,
        zAmp: 35,
        hoverProgress: 0,
        mobileVisible: true,
      },
      {
        id: 'dist-sum',
        layer: 2,
        type: 'math',
        text: '∑',
        x: width * 0.88,
        y: height * 0.14,
        z: 620,
        vx: -0.02,
        vy: 0.01,
        vz: -0.012,
        baseSize: 38,
        baseOpacity: 0.05,
        rotX: 0,
        rotY: 0,
        rotZ: 0.04,
        rotSpeedX: 0,
        rotSpeedY: 0,
        rotSpeedZ: -0.00008,
        wavePhase: 1.8,
        waveSpeed: 0.0004,
        waveAmp: 6,
        zPhase: 1.4,
        zSpeed: 0.00035,
        zAmp: 30,
        hoverProgress: 0,
        mobileVisible: false,
      },
      {
        id: 'dist-learn',
        layer: 2,
        type: 'english',
        text: 'LEARN',
        x: width * 0.16,
        y: height * 0.86,
        z: 590,
        vx: 0.022,
        vy: -0.014,
        vz: 0.018,
        baseSize: 30,
        baseOpacity: 0.05,
        rotX: 0,
        rotY: 0,
        rotZ: 0.02,
        rotSpeedX: 0,
        rotSpeedY: 0,
        rotSpeedZ: 0.00007,
        wavePhase: 2.7,
        waveSpeed: 0.00035,
        waveAmp: 6,
        zPhase: 2.5,
        zSpeed: 0.0003,
        zAmp: 32,
        hoverProgress: 0,
        mobileVisible: false,
      },
      {
        id: 'dist-fx',
        layer: 2,
        type: 'math',
        text: 'f(x)',
        x: width * 0.84,
        y: height * 0.84,
        z: 650,
        vx: -0.025,
        vy: -0.01,
        vz: -0.015,
        baseSize: 32,
        baseOpacity: 0.055,
        rotX: 0,
        rotY: 0,
        rotZ: -0.03,
        rotSpeedX: 0,
        rotSpeedY: 0,
        rotSpeedZ: -0.00008,
        wavePhase: 3.9,
        waveSpeed: 0.0004,
        waveAmp: 6,
        zPhase: 3.1,
        zSpeed: 0.0003,
        zAmp: 35,
        hoverProgress: 0,
        mobileVisible: true,
      },

      // === LAYER 3: MAIN ENVIRONMENT (Intentionally placed with large negative space) ===
      // 1. 3D Hardcover Book: MATHEMATICS (Floating lower-left flank)
      {
        id: 'book-math',
        layer: 3,
        type: 'book',
        title: 'MATHEMATIKA',
        x: width * 0.12,
        y: height * 0.64,
        z: 210,
        vx: 0.018,
        vy: -0.012,
        vz: 0.016,
        baseSize: 10,
        baseOpacity: 0.30,
        bookWidth: 72,
        bookHeight: 94,
        bookThickness: 17,
        coverColor: '#4A0E17',
        spineColor: '#6B1422',
        rotX: 0.22,
        rotY: -0.30,
        rotZ: 0.08,
        rotSpeedX: 0.00008,
        rotSpeedY: 0.00010,
        rotSpeedZ: 0.00008,
        wavePhase: 1.0,
        waveSpeed: 0.0005,
        waveAmp: 10,
        zPhase: 0.8,
        zSpeed: 0.0004,
        zAmp: 28,
        hoverProgress: 0,
        mobileVisible: true,
      },
      // 2. 3D Hardcover Book: ENGLISH (Floating upper-right flank)
      {
        id: 'book-english',
        layer: 3,
        type: 'book',
        title: 'ENGLISH',
        x: width * 0.88,
        y: height * 0.26,
        z: 230,
        vx: -0.018,
        vy: 0.014,
        vz: -0.014,
        baseSize: 10,
        baseOpacity: 0.30,
        bookWidth: 70,
        bookHeight: 92,
        bookThickness: 16,
        coverColor: '#121A28',
        spineColor: '#1C273C',
        rotX: -0.18,
        rotY: 0.30,
        rotZ: -0.06,
        rotSpeedX: -0.00008,
        rotSpeedY: 0.00009,
        rotSpeedZ: -0.00007,
        wavePhase: 2.2,
        waveSpeed: 0.0005,
        waveAmp: 9,
        zPhase: 2.1,
        zSpeed: 0.0004,
        zAmp: 26,
        hoverProgress: 0,
        mobileVisible: false,
      },
      // 3. 3D Glass Cube (Mid-left negative space)
      {
        id: 'geom-cube',
        layer: 3,
        type: 'geometry',
        geomType: 'cube',
        x: width * 0.08,
        y: height * 0.36,
        z: 260,
        vx: 0.016,
        vy: 0.01,
        vz: 0.018,
        baseSize: 42,
        baseOpacity: 0.17,
        rotX: 0.35,
        rotY: 0.45,
        rotZ: 0.20,
        rotSpeedX: 0.00018,
        rotSpeedY: 0.00025,
        rotSpeedZ: 0.00010,
        wavePhase: 0.7,
        waveSpeed: 0.00045,
        waveAmp: 8,
        zPhase: 1.1,
        zSpeed: 0.00035,
        zAmp: 32,
        hoverProgress: 0,
        mobileVisible: false,
      },
      // 4. 3D Octahedron / Transparent Prism (Mid-right negative space)
      {
        id: 'geom-octa',
        layer: 3,
        type: 'geometry',
        geomType: 'octahedron',
        x: width * 0.92,
        y: height * 0.66,
        z: 250,
        vx: -0.015,
        vy: -0.011,
        vz: -0.016,
        baseSize: 40,
        baseOpacity: 0.17,
        rotX: 0.40,
        rotY: -0.48,
        rotZ: 0.22,
        rotSpeedX: 0.00016,
        rotSpeedY: -0.00022,
        rotSpeedZ: 0.00009,
        wavePhase: 2.9,
        waveSpeed: 0.0005,
        waveAmp: 8,
        zPhase: 3.4,
        zSpeed: 0.00035,
        zAmp: 30,
        hoverProgress: 0,
        mobileVisible: false,
      },
      // 5. Mathematical Form: √x (Vector metallic square root, upper-left space)
      {
        id: 'math-sqrt',
        layer: 3,
        type: 'math',
        text: '√x',
        x: width * 0.28,
        y: height * 0.16,
        z: 290,
        vx: -0.018,
        vy: 0.009,
        vz: 0.012,
        baseSize: 19,
        baseOpacity: 0.17,
        rotX: 0,
        rotY: 0,
        rotZ: 0.04,
        rotSpeedX: 0,
        rotSpeedY: 0,
        rotSpeedZ: 0.00008,
        wavePhase: 3.1,
        waveSpeed: 0.0004,
        waveAmp: 7,
        zPhase: 0.9,
        zSpeed: 0.0003,
        zAmp: 24,
        hoverProgress: 0,
        mobileVisible: true,
      },
      // 6. Mathematical Form: a² + b² = c² (Central-top space)
      {
        id: 'math-pyth',
        layer: 3,
        type: 'math',
        text: 'a² + b² = c²',
        x: width * 0.52,
        y: height * 0.12,
        z: 320,
        vx: 0.014,
        vy: 0.007,
        vz: -0.014,
        baseSize: 15,
        baseOpacity: 0.16,
        rotX: 0,
        rotY: 0,
        rotZ: -0.02,
        rotSpeedX: 0,
        rotSpeedY: 0,
        rotSpeedZ: -0.00007,
        wavePhase: 4.2,
        waveSpeed: 0.00035,
        waveAmp: 6,
        zPhase: 2.7,
        zSpeed: 0.0003,
        zAmp: 25,
        hoverProgress: 0,
        mobileVisible: false,
      },
      // 7. Mathematical Form: x² (Floating gold typography, right upper space)
      {
        id: 'math-x2',
        layer: 3,
        type: 'math',
        text: 'x²',
        x: width * 0.68,
        y: height * 0.16,
        z: 280,
        vx: -0.016,
        vy: -0.008,
        vz: 0.015,
        baseSize: 20,
        baseOpacity: 0.17,
        rotX: 0,
        rotY: 0,
        rotZ: 0.05,
        rotSpeedX: 0,
        rotSpeedY: 0,
        rotSpeedZ: 0.00008,
        wavePhase: 1.4,
        waveSpeed: 0.00045,
        waveAmp: 7,
        zPhase: 4.1,
        zSpeed: 0.00035,
        zAmp: 28,
        hoverProgress: 0,
        mobileVisible: true,
      },
      // 8. Mathematical Form: ∞ (Infinity, lower central space)
      {
        id: 'math-inf',
        layer: 3,
        type: 'math',
        text: '∞',
        x: width * 0.58,
        y: height * 0.88,
        z: 270,
        vx: 0.02,
        vy: -0.008,
        vz: -0.012,
        baseSize: 21,
        baseOpacity: 0.16,
        rotX: 0,
        rotY: 0,
        rotZ: 0.03,
        rotSpeedX: 0,
        rotSpeedY: 0,
        rotSpeedZ: -0.00008,
        wavePhase: 5.0,
        waveSpeed: 0.0004,
        waveAmp: 7,
        zPhase: 1.6,
        zSpeed: 0.0003,
        zAmp: 26,
        hoverProgress: 0,
        mobileVisible: false,
      },
      // 9. English 3D Block: ABC (Physical block, mid-left)
      {
        id: 'eng-abc',
        layer: 3,
        type: 'english',
        text: 'ABC',
        x: width * 0.14,
        y: height * 0.46,
        z: 250,
        vx: 0.016,
        vy: -0.010,
        vz: 0.014,
        baseSize: 16,
        baseOpacity: 0.18,
        rotX: 0.12,
        rotY: -0.16,
        rotZ: -0.04,
        rotSpeedX: 0.00008,
        rotSpeedY: 0.00008,
        rotSpeedZ: 0.00007,
        wavePhase: 2.1,
        waveSpeed: 0.0005,
        waveAmp: 7,
        zPhase: 0.5,
        zSpeed: 0.0004,
        zAmp: 28,
        hoverProgress: 0,
        mobileVisible: true,
      },
      // 10. English Token: Aa (Upper-left space)
      {
        id: 'eng-aa',
        layer: 3,
        type: 'english',
        text: 'Aa',
        x: width * 0.34,
        y: height * 0.22,
        z: 310,
        vx: -0.014,
        vy: 0.008,
        vz: -0.012,
        baseSize: 17,
        baseOpacity: 0.16,
        rotX: 0,
        rotY: 0,
        rotZ: 0.04,
        rotSpeedX: 0,
        rotSpeedY: 0,
        rotSpeedZ: -0.00008,
        wavePhase: 3.6,
        waveSpeed: 0.00035,
        waveAmp: 6,
        zPhase: 2.2,
        zSpeed: 0.0003,
        zAmp: 24,
        hoverProgress: 0,
        mobileVisible: false,
      },
      // 11. English Block: Speak (Right flank)
      {
        id: 'eng-speak',
        layer: 3,
        type: 'english',
        text: 'SPEAK',
        x: width * 0.76,
        y: height * 0.74,
        z: 270,
        vx: -0.016,
        vy: -0.009,
        vz: 0.014,
        baseSize: 13,
        baseOpacity: 0.16,
        rotX: 0.05,
        rotY: 0.12,
        rotZ: 0.02,
        rotSpeedX: 0.00008,
        rotSpeedY: -0.00008,
        rotSpeedZ: 0.00007,
        wavePhase: 0.8,
        waveSpeed: 0.0004,
        waveAmp: 6,
        zPhase: 3.7,
        zSpeed: 0.00035,
        zAmp: 26,
        hoverProgress: 0,
        mobileVisible: false,
      },

      // === LAYER 5: FOREGROUND (Only 1 rare close subtle token) ===
      {
        id: 'near-tri',
        layer: 5,
        type: 'geometry',
        geomType: 'ring',
        x: width * 0.94,
        y: height * 0.86,
        z: 110,
        vx: -0.02,
        vy: -0.012,
        vz: 0.01,
        baseSize: 22,
        baseOpacity: 0.20,
        rotX: 0.25,
        rotY: 0.35,
        rotZ: 0.1,
        rotSpeedX: 0.00015,
        rotSpeedY: 0.0002,
        rotSpeedZ: 0.0001,
        wavePhase: 1.2,
        waveSpeed: 0.0005,
        waveAmp: 8,
        zPhase: 1.9,
        zSpeed: 0.0004,
        zAmp: 20,
        hoverProgress: 0,
        mobileVisible: false,
      },
    ];

    // Filter for mobile if necessary
    const activeObjects = isMobile ? artObjects.filter((o) => o.mobileVisible) : artObjects;

    // -------------------------------------------------------------------------
    // 6. ATMOSPHERIC DUST PARTICLES (Light-reactive motes)
    // -------------------------------------------------------------------------
    let dustCount = isMobile ? 22 : isTablet ? 45 : 65;
    const dustParticles: DustParticle3D[] = Array.from({ length: dustCount }, () => {
      const z = Math.random() * 750 + 40;
      return {
        x: Math.random() * (width * 1.3) - width * 0.15,
        y: Math.random() * (height * 1.3) - height * 0.15,
        z,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -(0.10 + Math.random() * 0.20),
        vz: (Math.random() - 0.5) * 0.08,
        baseAlpha: 0.10 + (1 - z / 800) * 0.30,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.005 + Math.random() * 0.012,
        size: z < 250 ? 2.2 : z < 500 ? 1.5 : 0.95,
      };
    });

    // -------------------------------------------------------------------------
    // 7. INVISIBLE SAFE ZONES: Dynamic Alpha Attenuation
    // Guarantees zero obstruction over headline, text, CTAs, and laptop
    // -------------------------------------------------------------------------
    const computeSafeZoneFactor = (projX: number, projY: number): number => {
      // Safe Zone 1, 2, 3: Hero Headline, Description, CTAs (Left Column)
      const textLeft = width * 0.05;
      const textRight = width * 0.49;
      const textTop = height * 0.14;
      const textBottom = height * 0.62;

      // Safe Zone 4: Main 3D Laptop UI (Right Column)
      const laptopLeft = width * 0.52;
      const laptopRight = width * 0.95;
      const laptopTop = height * 0.18;
      const laptopBottom = height * 0.78;

      // Header Safe Zone (Pristine navigation area)
      if (projY < height * 0.10) {
        return Math.max(0.02, (projY / (height * 0.10)) * 0.4);
      }

      const margin = 45;

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
        return Math.max(0.03, 1.0 - (depth / margin) * 0.97);
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

      // Signature "Knowledge Awakening" Initial Reveal (2.5s)
      const revealProgress = prefersReducedMotion
        ? 1.0
        : Math.min(1.0, Math.pow(elapsed / 2.5, 1.6));

      const revealMath = Math.min(1.0, Math.max(0, (elapsed - 0.4) / 1.0));
      const revealGeom = Math.min(1.0, Math.max(0, (elapsed - 0.8) / 1.0));
      const revealEnglish = Math.min(1.0, Math.max(0, (elapsed - 1.1) / 1.0));
      const revealBooks = Math.min(1.0, Math.max(0, (elapsed - 1.4) / 1.0));
      const revealCore = Math.min(1.0, Math.max(0, (elapsed - 1.7) / 0.9));

      // FPS Monitoring & Dynamic Frame Budgeting
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

      // Smooth Camera Floating Drift (Autonomous perpetual motion)
      const camX = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.14) * 14;
      const camY = prefersReducedMotion ? 0 : Math.cos(elapsed * 0.11) * 10;
      const camZ = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.16) * 18;

      // Mouse Parallax with Subtle Sensitivity (5–12% max)
      // Completely disabled on touch/mobile
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
      // UPDATE & RENDER TRAVELING GOLDEN LIGHT WAVE (8–14s)
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

      // Draw soft traveling wavefront aura
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
        // Bell envelope for entry & exit fade
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
      // UPDATE & RENDER 5 VIRTUAL MOVING LIGHTS
      // -----------------------------------------------------------------------
      virtualLights.forEach((vl) => {
        if (!prefersReducedMotion) {
          vl.phase += vl.speed;
          vl.x = vl.centerX + Math.cos(vl.phase * vl.freqX) * vl.orbitRx;
          vl.y = vl.centerY + Math.sin(vl.phase * vl.freqY) * vl.orbitRy;
          vl.z = vl.centerZ + Math.sin(vl.phase * vl.freqZ) * vl.orbitRz;
        }

        // Draw soft ambient light aura
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
      // LAYER 1: DEEP BACKGROUND (Faint coordinate lines & dark burgundy haze)
      // -----------------------------------------------------------------------
      if (!isLowPerformance && !isMobile) {
        ctx.save();
        ctx.strokeStyle = `rgba(217, 168, 63, ${0.04 * revealProgress})`;
        ctx.lineWidth = 0.8;
        ctx.setLineDash([2, 8]);

        // Faint horizontal coordinate lines
        for (let y = height * 0.16; y <= height * 0.84; y += height * 0.22) {
          ctx.beginPath();
          ctx.moveTo(width * 0.08, y);
          ctx.lineTo(width * 0.92, y);
          ctx.stroke();
        }
        // Faint vertical coordinate lines
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
      // 3 thin curved rings at different depths, center void preserves laptop contrast
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
        const coreAlpha = (0.75 + lightBoost * 0.35 + waveBoost * 0.40) * revealCore;

        // Incomplete Arc 1: Thin architectural circle (subtends 210°, passes behind laptop)
        const r1 = 180 * projCore.scale;
        ctx.save();
        ctx.rotate(prefersReducedMotion ? 0.3 : elapsed * 0.030);
        ctx.beginPath();
        ctx.arc(0, 0, r1, -Math.PI * 0.7, Math.PI * 0.55);
        ctx.strokeStyle = `rgba(243, 210, 118, ${0.16 * coreAlpha})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();
        ctx.restore();

        // Incomplete Arc 2: Tilted 3D Mathematical Curve (tilted 25°, subtends 160°)
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
      // 3 ORGANIC GOLDEN LIGHT RIBBONS
      // Flowing streams of warm light crossing the scene
      // -----------------------------------------------------------------------
      if (!isLowPerformance && !isMobile) {
        // Ribbon 1: Curves behind laptop and fades into darkness
        const ribbon1Y = height * 0.36 + Math.sin(elapsed * 0.28) * 20 + parallaxY * 0.2;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, ribbon1Y);
        for (let x = 0; x <= width; x += 40) {
          const wave =
            Math.sin(x * 0.0022 + elapsed * 0.45) * 24 +
            Math.cos(x * 0.0035 - elapsed * 0.32) * 14;
          ctx.lineTo(x, ribbon1Y + wave);
        }
        const grad1 = ctx.createLinearGradient(0, ribbon1Y - 20, width, ribbon1Y + 20);
        grad1.addColorStop(0, 'rgba(217, 168, 63, 0)');
        grad1.addColorStop(0.3, `rgba(217, 168, 63, ${0.045 * revealProgress})`);
        grad1.addColorStop(0.7, `rgba(255, 235, 170, ${0.065 * revealProgress})`);
        grad1.addColorStop(1, 'rgba(217, 168, 63, 0)');
        ctx.strokeStyle = grad1;
        ctx.lineWidth = 1.1;
        ctx.setLineDash([8, 14]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Ribbon 2: Asymmetric lower curve crossing behind bottom space
        const ribbon2Y = height * 0.76 + Math.cos(elapsed * 0.22) * 18 + parallaxY * 0.15;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(width * 0.05, ribbon2Y);
        for (let x = width * 0.05; x <= width * 0.95; x += 45) {
          const wave =
            Math.cos(x * 0.0028 - elapsed * 0.4) * 20 +
            Math.sin(x * 0.0042 + elapsed * 0.25) * 12;
          ctx.lineTo(x, ribbon2Y + wave);
        }
        const grad2 = ctx.createLinearGradient(0, ribbon2Y - 15, width, ribbon2Y + 15);
        grad2.addColorStop(0, 'rgba(217, 168, 63, 0)');
        grad2.addColorStop(0.5, `rgba(243, 210, 118, ${0.04 * revealProgress})`);
        grad2.addColorStop(1, 'rgba(217, 168, 63, 0)');
        ctx.strokeStyle = grad2;
        ctx.lineWidth = 0.95;
        ctx.setLineDash([6, 12]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      // -----------------------------------------------------------------------
      // ART-DIRECTED OBJECTS RENDERING (Layers 2, 3, 5)
      // Depth sorting: Render furthest objects first
      // -----------------------------------------------------------------------
      activeObjects.forEach((obj) => {
        // Continuous autonomous 3D movement (even if cursor is static)
        if (!prefersReducedMotion) {
          obj.x += obj.vx;
          obj.y += obj.vy;
          obj.z += obj.vz;
          obj.wavePhase += obj.waveSpeed;
          obj.zPhase += obj.zSpeed;
          obj.rotX += obj.rotSpeedX;
          obj.rotY += obj.rotSpeedY;
          obj.rotZ += obj.rotSpeedZ;
        }

        // Dynamic 3D depth oscillation & non-repeating wrap-around
        const dynamicZ = obj.z + Math.sin(obj.zPhase) * obj.zAmp;

        if (obj.y < -70) {
          obj.y = height + 60;
          obj.x = Math.random() * width;
        }
        if (obj.y > height + 70) {
          obj.y = -60;
          obj.x = Math.random() * width;
        }
        if (obj.x < -90) {
          obj.x = width + 80;
          obj.y = Math.random() * height;
        }
        if (obj.x > width + 90) {
          obj.x = -80;
          obj.y = Math.random() * height;
        }

        const waveOffset = Math.sin(obj.wavePhase) * obj.waveAmp;
        const proj = project(
          { x: obj.x, y: obj.y + waveOffset, z: dynamicZ },
          camX,
          camY,
          camZ + scrollDepthShift,
          parallaxX,
          parallaxY
        );

        if (proj.scale <= 0) return;

        // Dynamic Safe Zone Attenuation
        const safeFactor = computeSafeZoneFactor(proj.x, proj.y);

        // Edge fade
        const edgeFadeX = Math.min(1, Math.min(proj.x, width - proj.x) / 70);
        const edgeFadeY = Math.min(1, Math.min(proj.y, height - proj.y) / 70);
        const edgeAlpha = Math.max(0, edgeFadeX * edgeFadeY);

        // Proximity Illumination from 5 moving virtual lights + Traveling Light Wave
        const { lightBoost, waveBoost } = getIlluminationBoost(obj.x, obj.y, dynamicZ);

        // Interactive 3D Physical Hover Reaction (400–700ms smooth spring)
        let isHovered = false;
        if (mouseRef.current.isInside && !isMobile) {
          const dxCursor = mouseRef.current.screenX - proj.x;
          const dyCursor = mouseRef.current.screenY - proj.y;
          const cursorDist = Math.sqrt(dxCursor * dxCursor + dyCursor * dyCursor);
          isHovered = cursorDist < 65;
        }
        const targetHover = isHovered ? 1.0 : 0.0;
        obj.hoverProgress += (targetHover - obj.hoverProgress) * 0.08;

        // Layer-based sequential reveal factor
        let staggerFactor = revealProgress;
        if (obj.type === 'math') staggerFactor = revealMath;
        else if (obj.type === 'english') staggerFactor = revealEnglish;
        else if (obj.type === 'book') staggerFactor = revealBooks;
        else if (obj.type === 'geometry') staggerFactor = revealGeom;

        const totalIllum = lightBoost * 0.35 + waveBoost * 0.45;
        const finalAlpha =
          (obj.baseOpacity + totalIllum + obj.hoverProgress * 0.18) *
          edgeAlpha *
          safeFactor *
          staggerFactor;

        if (finalAlpha < 0.015) return;

        ctx.save();
        ctx.translate(proj.x, proj.y);

        // --- RENDER TYPE: 3D HARDCOVER BOOK (MATHEMATIKA or ENGLISH) ---
        if (obj.type === 'book' && obj.bookWidth && obj.bookHeight && obj.bookThickness) {
          const bw = obj.bookWidth * proj.scale;
          const bh = obj.bookHeight * proj.scale;
          const bThick = obj.bookThickness * proj.scale;

          // 3D Hover physical reaction: Cover opens 5 degrees!
          const openAngle = obj.hoverProgress * 0.08;
          ctx.rotate(obj.rotZ + openAngle);

          // Subtle back cover / drop shadow
          ctx.beginPath();
          ctx.roundRect(-bw / 2 + 2, -bh / 2 + 2, bw, bh, 3);
          ctx.fillStyle = 'rgba(5, 3, 4, 0.5)';
          ctx.fill();

          // Stacked Book Pages Texture (White/Ivory layered page edge)
          ctx.fillStyle = `rgba(235, 222, 195, ${finalAlpha * 0.85})`;
          ctx.fillRect(-bw / 2 + bw - bThick * 0.35, -bh / 2 + 2, bThick * 0.35, bh - 4);

          // Front Cover
          ctx.beginPath();
          ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 3);
          ctx.fillStyle = obj.coverColor || '#4A0E17';
          ctx.globalAlpha = finalAlpha * 0.95;
          ctx.fill();

          // Gold Double Hairline Border with light highlight
          ctx.strokeStyle = `rgba(255, 235, 170, ${(finalAlpha + totalIllum * 0.5) * 0.9})`;
          ctx.lineWidth = 1.1;
          ctx.stroke();

          // Inner gold inlay frame
          ctx.beginPath();
          ctx.roundRect(-bw / 2 + 3.5, -bh / 2 + 3.5, bw - 7, bh - 7, 2);
          ctx.strokeStyle = `rgba(217, 168, 63, ${finalAlpha * 0.65})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();

          // 3D Spine Line with leather ribbed highlights
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

        // --- RENDER TYPE: 3D GLASS GEOMETRY (Cube, Octahedron, Ring) ---
        else if (obj.type === 'geometry') {
          // Hover physical reaction: Rotates 15 degrees to reveal another shaded facet
          const hoverRot = obj.hoverProgress * 0.25;
          const currentRotX = obj.rotX + hoverRot;
          const currentRotY = obj.rotY + hoverRot;

          if (obj.geomType === 'cube') {
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
              const rot = rotate3D(v, currentRotX, currentRotY, obj.rotZ);
              return { x: rot.x * geomScale, y: rot.y * geomScale };
            });

            ctx.strokeStyle = `rgba(243, 210, 118, ${(finalAlpha + totalIllum * 0.4) * 0.9})`;
            ctx.lineWidth = 0.95;
            ctx.setLineDash([3, 5]);
            cubeEdges.forEach(([i, j]) => {
              ctx.beginPath();
              ctx.moveTo(projectedCube[i].x, projectedCube[i].y);
              ctx.lineTo(projectedCube[j].x, projectedCube[j].y);
              ctx.stroke();
            });
            ctx.setLineDash([]);
          } else if (obj.geomType === 'octahedron') {
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

            const geomScale = obj.baseSize * proj.scale;
            const projectedOcta = octaVertices.map((v) => {
              const rot = rotate3D(v, currentRotX, currentRotY, obj.rotZ);
              return { x: rot.x * geomScale, y: rot.y * geomScale };
            });

            ctx.strokeStyle = `rgba(255, 235, 170, ${(finalAlpha + totalIllum * 0.4) * 0.9})`;
            ctx.lineWidth = 0.95;
            ctx.setLineDash([4, 6]);
            octaEdges.forEach(([i, j]) => {
              ctx.beginPath();
              ctx.moveTo(projectedOcta[i].x, projectedOcta[i].y);
              ctx.lineTo(projectedOcta[j].x, projectedOcta[j].y);
              ctx.stroke();
            });
            ctx.setLineDash([]);
          } else if (obj.geomType === 'ring') {
            const ringR = obj.baseSize * proj.scale;
            ctx.rotate(obj.rotZ + hoverRot);
            ctx.beginPath();
            ctx.ellipse(0, 0, ringR, ringR * 0.38, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(243, 210, 118, ${finalAlpha * 0.85})`;
            ctx.lineWidth = 1.0;
            ctx.stroke();
          }
        }

        // --- RENDER TYPE: MATHEMATICS & ENGLISH SYMBOLS ---
        else {
          // Hover physical reaction: Rotates slightly in 3D
          const hoverTilt = obj.hoverProgress * 0.08;
          ctx.rotate(obj.rotZ + hoverTilt);

          const renderSize = Math.max(8, Math.floor(obj.baseSize * proj.scale));

          // Physical light warmth modulation
          let colorStr = `rgba(225, 180, 75, ${finalAlpha})`;
          if (dynamicZ < 250) {
            colorStr = `rgba(255, 240, 190, ${finalAlpha})`;
          } else if (dynamicZ > 500) {
            colorStr = `rgba(185, 140, 50, ${finalAlpha})`;
          }

          // Special 3D glass facet styling for π
          if (obj.text === 'π' && obj.layer === 2) {
            ctx.font = `italic 600 ${renderSize}px "Playfair Display", Georgia, serif`;
            ctx.fillStyle = colorStr;
            ctx.fillText('π', 0, 0);
          } else if (obj.text === '√x') {
            // Precise vector metallic square root
            ctx.save();
            ctx.strokeStyle = colorStr;
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(-renderSize * 0.6, 2);
            ctx.lineTo(-renderSize * 0.35, renderSize * 0.5);
            ctx.lineTo(-renderSize * 0.1, -renderSize * 0.6);
            ctx.lineTo(renderSize * 0.6, -renderSize * 0.6);
            ctx.stroke();
            ctx.font = `italic 600 ${Math.floor(renderSize * 0.85)}px "Playfair Display", Georgia, serif`;
            ctx.fillStyle = colorStr;
            ctx.fillText('x', 0, 0);
            ctx.restore();
          } else if (obj.text === 'ABC') {
            // 3D Letter block with subtle isometric bevel
            ctx.save();
            ctx.font = `bold ${renderSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
            ctx.letterSpacing = '2px';
            // Subtle 3D shadow facet
            ctx.fillStyle = `rgba(34, 10, 15, ${finalAlpha * 0.7})`;
            ctx.fillText('ABC', 1.5, 1.5);
            ctx.fillStyle = colorStr;
            ctx.fillText('ABC', 0, 0);
            ctx.restore();
          } else if (obj.type === 'math') {
            ctx.font = `italic 600 ${renderSize}px "Playfair Display", Georgia, serif`;
            ctx.fillStyle = colorStr;
            ctx.fillText(obj.text || '', 0, 0);
          } else {
            ctx.font = `600 ${renderSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
            ctx.fillStyle = colorStr;
            ctx.letterSpacing = `${Math.max(1, 1.8 * proj.scale)}px`;
            ctx.fillText(obj.text || '', 0, 0);
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

        // Wrap around
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

        // Dust motes illuminate when light or wave passes near them
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
