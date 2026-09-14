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
  z: number;
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
  duration: number;
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

// -----------------------------------------------------------------------------
// 41 DIVERSE MASTER ARCHETYPES (Mathematical, Geometric, Sculptural & Educational)
// -----------------------------------------------------------------------------
type ArchetypeType =
  // 1. RINGS & LOOPS
  | 'ring_thin'
  | 'ring_nested'
  | 'ring_broken'
  | 'ring_elliptical'
  | 'ring_twisted'
  | 'ring_double_helix'
  | 'torus'
  // 2. ABSTRACT 3D MATHEMATICAL SCULPTURES
  | 'sculpture_knot'
  | 'sculpture_saddle'
  | 'sculpture_wave'
  | 'sculpture_interlocking'
  | 'sculpture_nested_shell'
  // 3. CUBES & FRAMES
  | 'cube_beveled'
  | 'cube_nested'
  | 'cube_wire'
  // 4. POLYHEDRA & SOLIDS
  | 'sphere'
  | 'octahedron'
  | 'dodecahedron'
  | 'pyramid'
  | 'pyramid_truncated'
  | 'prism_hex'
  | 'prism_tri'
  | 'cylinder'
  | 'cone'
  // 5. MATHEMATICAL CURVES & 3D GRAPHS
  | 'parabola'
  | 'sinewave'
  | 'cosinewave'
  | 'coord_axes'
  | 'vector_field'
  | 'spiral_helix'
  | 'grid3d'
  // 6. BOOKS
  | 'book_math'
  | 'book_english'
  // 7. FORMULA ACCENTS
  | 'math_pi'
  | 'math_sum'
  | 'math_sqrt'
  | 'math_inf'
  | 'math_pyth'
  | 'math_integral'
  // 8. ENGLISH 3D TYPOGRAPHY
  | 'eng_words'
  | 'eng_letters';

type PerformanceTier = 'ULTRA_LOW' | 'LOW' | 'MEDIUM' | 'HIGH';
type DepthLayer = 'FOREGROUND' | 'MIDGROUND' | 'BACKGROUND' | 'DEEP_BACKGROUND';

interface FlyingEntity3D {
  id: string;
  archetype: ArchetypeType;
  depthLayer: DepthLayer;
  title?: string;
  text?: string;
  formula?: string;
  subText?: string;
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
  // 3D Harmonic Curve Trajectory Parameters
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
  // Physics State Machine
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
  age: number;
  lifetime: number;
  hoverProgress: number;
  grabProgress: number;
  proxBoost: number;
  currentIllum: number;
  // Book specific dimensions
  bookWidth?: number;
  bookHeight?: number;
  bookThickness?: number;
  coverColor?: string;
  spineColor?: string;
  // Pre-allocated projection cache for zero-allocation hit testing & rendering
  projX: number;
  projY: number;
  projScale: number;
  projZ: number;
}

// Pre-computed 64-step Color Lookup Table (Zero string allocations per frame)
interface ColorLUTEntry {
  stroke: string;
  fill: string;
  bookCoverMath: string;
  bookCoverEng: string;
  highlight: string;
  glow: string;
}

const COLOR_LUT: ColorLUTEntry[] = Array.from({ length: 64 }, (_, i) => {
  const p = i / 63; // 0.0 (dark) to 1.0 (bright)
  let r: number, g: number, b: number;
  if (p < 0.35) {
    const t = p / 0.35;
    r = Math.round(38 + (92 - 38) * t);
    g = Math.round(12 + (26 - 12) * t);
    b = Math.round(18 + (36 - 18) * t);
  } else if (p < 0.70) {
    const t = (p - 0.35) / 0.35;
    r = Math.round(92 + (205 - 92) * t);
    g = Math.round(26 + (148 - 26) * t);
    b = Math.round(36 + (60 - 36) * t);
  } else {
    const t = (p - 0.70) / 0.30;
    r = Math.round(205 + (255 - 205) * t);
    g = Math.round(148 + (242 - 148) * t);
    b = Math.round(60 + (185 - 60) * t);
  }

  const strokeAlpha = Math.min(1.0, 0.42 + p * 0.56).toFixed(2);
  const fillAlpha = Math.min(1.0, 0.18 + p * 0.46).toFixed(2);

  const mathR = Math.round(24 + (78 - 24) * p);
  const mathG = Math.round(6 + (16 - 6) * p);
  const mathB = Math.round(9 + (25 - 9) * p);

  const engR = Math.round(8 + (32 - 8) * p);
  const engG = Math.round(12 + (44 - 12) * p);
  const engB = Math.round(18 + (66 - 18) * p);

  return {
    stroke: `rgba(${r}, ${g}, ${b}, ${strokeAlpha})`,
    fill: `rgba(${Math.round(r * 0.9)}, ${Math.round(g * 0.9)}, ${Math.round(b * 0.9)}, ${fillAlpha})`,
    bookCoverMath: `rgba(${mathR}, ${mathG}, ${mathB}, 0.95)`,
    bookCoverEng: `rgba(${engR}, ${engG}, ${engB}, 0.95)`,
    highlight: `rgba(255, 240, 195, ${Math.min(1.0, 0.52 + p * 0.48).toFixed(2)})`,
    glow: `rgba(217, 168, 63, ${Math.min(1.0, 0.20 + p * 0.40).toFixed(2)})`,
  };
});

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

    // -------------------------------------------------------------------------
    // UNIVERSAL 4-LEVEL DEVICE PERFORMANCE SYSTEM
    // -------------------------------------------------------------------------
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
    const memory = typeof navigator !== 'undefined' && 'deviceMemory' in navigator ? (navigator as any).deviceMemory || 4 : 4;

    const detectInitialTier = (): PerformanceTier => {
      if (isMobile) {
        if (cores <= 4 || memory <= 2) return 'ULTRA_LOW';
        if (cores <= 6 || memory <= 4) return 'LOW';
        return 'MEDIUM';
      }
      if (isTablet) {
        if (cores <= 4) return 'LOW';
        return 'MEDIUM';
      }
      if (cores <= 4) return 'MEDIUM';
      return 'HIGH';
    };

    let currentTier: PerformanceTier = detectInitialTier();

    // Adaptive DPR per tier
    const getDprForTier = (tier: PerformanceTier): number => {
      const devDpr = window.devicePixelRatio || 1;
      switch (tier) {
        case 'ULTRA_LOW':
          return 1.0;
        case 'LOW':
          return Math.min(devDpr, 1.15);
        case 'MEDIUM':
          return Math.min(devDpr, 1.35);
        case 'HIGH':
          return Math.min(devDpr, 1.6);
      }
    };

    let dpr = getDprForTier(currentTier);
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = getDprForTier(currentTier);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Passive scroll tracking (zero layout thrashing, zero re-renders)
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
    const spriteLightAura = createGlowSprite(200, 25, 'rgba(255, 235, 170, 0.50)', 'rgba(217, 168, 63, 0.15)');
    const spriteWaveAura = createGlowSprite(300, 35, 'rgba(255, 240, 190, 0.35)', 'rgba(217, 168, 63, 0.10)');
    const spriteGrabAura = createGlowSprite(220, 28, 'rgba(255, 235, 170, 0.65)', 'rgba(243, 210, 118, 0.25)');

    // -------------------------------------------------------------------------
    // 2. 3D CAMERA & PERSPECTIVE PROJECTION (Zero heap allocations)
    // -------------------------------------------------------------------------
    const fov = 450;

    const projectPoint = (
      px: number,
      py: number,
      pz: number,
      camX: number,
      camY: number,
      camZ: number,
      parallaxX: number,
      parallaxY: number,
      out: { projX: number; projY: number; projScale: number; projZ: number }
    ) => {
      const relX = px - (width / 2 + camX);
      const relY = py - (height / 2 + camY);
      const relZ = Math.max(pz + camZ, 12);

      const scale = fov / (fov + relZ);
      out.projX = width / 2 + relX * scale + parallaxX * scale;
      out.projY = height / 2 + relY * scale + parallaxY * scale;
      out.projScale = scale;
      out.projZ = relZ;
    };

    // Reusable point buffer for 3D rotation (0 garbage collection)
    const rotBuf = { x: 0, y: 0, z: 0 };
    const rotate3D = (px: number, py: number, pz: number, rx: number, ry: number, rz: number) => {
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x1 = px * cosY + pz * sinY;
      const z1 = -px * sinY + pz * cosY;

      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const y2 = py * cosX - z1 * sinX;
      const z2 = py * sinX + z1 * cosX;

      const cosZ = Math.cos(rz);
      const sinZ = Math.sin(rz);
      rotBuf.x = x1 * cosZ - y2 * sinZ;
      rotBuf.y = x1 * sinZ + y2 * cosZ;
      rotBuf.z = z2;
      return rotBuf;
    };

    // -------------------------------------------------------------------------
    // 3. VIRTUAL MOVING LIGHT SOURCES
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
        id: 'ambient-left',
        x: width * 0.22,
        y: height * 0.45,
        z: 360,
        radius: 340,
        intensity: 0.70,
        speed: 0.0005,
        phase: Math.PI * 0.6,
        orbitRx: 140,
        orbitRy: 120,
        orbitRz: 80,
        freqX: 0.8,
        freqY: 1.1,
        freqZ: 0.9,
        centerX: width * 0.22,
        centerY: height * 0.45,
        centerZ: 360,
      },
      {
        id: 'ambient-top',
        x: width * 0.50,
        y: height * 0.18,
        z: 420,
        radius: 300,
        intensity: 0.60,
        speed: 0.0006,
        phase: Math.PI * 1.2,
        orbitRx: 160,
        orbitRy: 70,
        orbitRz: 70,
        freqX: 1.2,
        freqY: 0.7,
        freqZ: 1.0,
        centerX: width * 0.50,
        centerY: height * 0.18,
        centerZ: 420,
      },
    ];

    // -------------------------------------------------------------------------
    // 4. TRAVELING LIGHT WAVE
    // -------------------------------------------------------------------------
    const generateWaveTrajectory = (cycle: number): TravelingLightWave => {
      const isEven = cycle % 2 === 0;
      return {
        duration: 9 + (cycle % 4) * 1.5,
        p0: {
          x: isEven ? -width * 0.1 : width * 1.1,
          y: height * 0.15,
          z: 600,
        },
        p1: {
          x: width * 0.35,
          y: height * 0.55,
          z: 320,
        },
        p2: {
          x: width * 0.68,
          y: height * 0.35,
          z: 220,
        },
        p3: {
          x: isEven ? width * 1.15 : -width * 0.15,
          y: height * 0.85,
          z: 480,
        },
        currentPos: { x: 0, y: 0, z: 0 },
        radius: 320,
        active: true,
        cycleCount: cycle,
      };
    };

    let waveState = generateWaveTrajectory(0);

    const updateBezierPoint = (
      p0: Point3D,
      p1: Point3D,
      p2: Point3D,
      p3: Point3D,
      t: number,
      out: Point3D
    ) => {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      const uuu = uu * u;
      const ttt = tt * t;

      out.x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
      out.y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;
      out.z = uuu * p0.z + 3 * uu * t * p1.z + 3 * u * tt * p2.z + ttt * p3.z;
    };

    const getIlluminationBoost = (x: number, y: number, z: number, lightsToUse: number) => {
      let lightBoost = 0;
      for (let i = 0; i < lightsToUse; i++) {
        const vl = virtualLights[i];
        const dx = x - vl.x;
        const dy = y - vl.y;
        const dz = z - vl.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        const radSq = vl.radius * vl.radius;
        if (distSq < radSq) {
          lightBoost += (1 - Math.sqrt(distSq) / vl.radius) * vl.intensity;
        }
      }

      let waveBoost = 0;
      if (waveState.active && currentTier !== 'ULTRA_LOW' && currentTier !== 'LOW') {
        const dx = x - waveState.currentPos.x;
        const dy = y - waveState.currentPos.y;
        const dz = z - waveState.currentPos.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        const radSq = waveState.radius * waveState.radius;
        if (distSq < radSq) {
          waveBoost = (1 - Math.sqrt(distSq) / waveState.radius) * 0.65;
        }
      }

      return { lightBoost, waveBoost };
    };

    // -------------------------------------------------------------------------
    // 5. 41-ARCHETYPE NON-REPEATING MASTER SEQUENCE
    // -------------------------------------------------------------------------
    // Strict non-repeating cycle interleaved across Categories:
    // Math -> Geometric -> Sculpture -> Ring -> Book -> Formula -> English -> Frame
    const masterShapeSequence: ArchetypeType[] = [
      'book_math',             // 1. Math Book
      'ring_thin',             // 2. Elegant Ring
      'parabola',              // 3. Parabola y = x²
      'sculpture_knot',        // 4. Trefoil 3D Knot
      'octahedron',            // 5. Gemstone Octahedron
      'book_english',          // 6. English Book
      'ring_nested',           // 7. Double Orbital Rings
      'sculpture_saddle',      // 8. Hyperbolic Saddle Surface
      'math_pi',               // 9. Pi Symbol
      'cube_nested',           // 10. Nested Cube in Cube
      'sinewave',              // 11. Sine Wave y = sin(x)
      'ring_broken',           // 12. Broken Arc Ring
      'dodecahedron',          // 13. 12-sided Polyhedron
      'eng_words',             // 14. Typography: LEARN / THINK
      'torus',                 // 15. Classic Torus
      'sculpture_wave',        // 16. 3D Wave Sculpture
      'coord_axes',            // 17. 3D Coordinate Tripod
      'sphere',                // 18. Wireframe Sphere with Equator
      'math_inf',              // 19. Infinity Symbol ∞
      'prism_hex',             // 20. Hexagonal Prism
      'ring_twisted',          // 21. Mobius Twisted Ring
      'cosinewave',            // 22. Cosine Wave y = cos(x)
      'cube_beveled',          // 23. Beveled Solid Cube
      'eng_letters',           // 24. Letter Glyph: A / B / C
      'sculpture_interlocking',// 25. Two Interlocking Rings
      'pyramid',               // 26. Tetrahedron Pyramid
      'math_sqrt',             // 27. Radical Formula √x
      'ring_double_helix',     // 28. Double Helix Loop
      'vector_field',          // 29. 3D Vector Arrows
      'cylinder',              // 30. Meridian Cylinder
      'sculpture_nested_shell',// 31. Octahedron inside Cube Shell
      'ring_elliptical',       // 32. Tilted Elliptical Ring
      'cone',                  // 33. Radial Cone
      'math_sum',              // 34. Summation Symbol ∑
      'spiral_helix',          // 35. Archimedean Helix Spiral
      'cube_wire',             // 36. Golden Cage Frame Cube
      'math_pyth',             // 37. Pythagorean Theorem a²+b²=c²
      'prism_tri',             // 38. Triangular Prism
      'math_integral',         // 39. Calculus Integral Symbol ∫
      'pyramid_truncated',     // 40. Truncated Obelisk
      'grid3d',                // 41. 3D Perspective Grid
    ];

    const getEntityCountForTier = (tier: PerformanceTier): number => {
      switch (tier) {
        case 'ULTRA_LOW':
          return 5;
        case 'LOW':
          return 7;
        case 'MEDIUM':
          return 11;
        case 'HIGH':
          return 16;
      }
    };

    let targetEntityCount = getEntityCountForTier(currentTier);

    // English word and letter pools
    const ENGLISH_WORDS = ['LEARN', 'THINK', 'GROW', 'ENGLISH'];
    const ENGLISH_LETTERS = ['A', 'B', 'C', 'X', 'Y', 'Z'];

    // Layer assignments: 1 Foreground, 6 Midground, 5 Background, 4 Deep Background
    const getDepthLayer = (index: number): DepthLayer => {
      if (index === 0) return 'FOREGROUND';
      if (index % 4 === 1 || index % 4 === 2) return 'MIDGROUND';
      if (index % 4 === 3) return 'BACKGROUND';
      return 'DEEP_BACKGROUND';
    };

    const resetFlyingEntity = (ent: FlyingEntity3D, index: number) => {
      const archetype = masterShapeSequence[index % masterShapeSequence.length];
      ent.archetype = archetype;
      ent.depthLayer = getDepthLayer(index);

      // Trajectory distribution across 8 distinct spatial corridors
      const pIndex = index % 8;
      if (pIndex === 0) {
        // Left -> Right diagonal drift
        ent.baseX = -width * 0.12 - Math.random() * 80;
        ent.baseY = height * (0.08 + Math.random() * 0.28);
        ent.baseZ = ent.depthLayer === 'FOREGROUND' ? 160 : ent.depthLayer === 'MIDGROUND' ? 290 : 480;
        ent.vx = 0.32 + Math.random() * 0.18;
        ent.vy = 0.14 + Math.random() * 0.12;
        ent.vz = -(0.10 + Math.random() * 0.12);
      } else if (pIndex === 1) {
        // Top -> Bottom vertical drift
        ent.baseX = width * (0.25 + Math.random() * 0.45);
        ent.baseY = -height * 0.12 - Math.random() * 60;
        ent.baseZ = ent.depthLayer === 'FOREGROUND' ? 180 : ent.depthLayer === 'MIDGROUND' ? 320 : 520;
        ent.vx = (Math.random() - 0.5) * 0.18;
        ent.vy = 0.30 + Math.random() * 0.20;
        ent.vz = (Math.random() - 0.5) * 0.14;
      } else if (pIndex === 2) {
        // Right -> Left diagonal downward drift
        ent.baseX = width * 1.12 + Math.random() * 80;
        ent.baseY = height * (0.08 + Math.random() * 0.28);
        ent.baseZ = ent.depthLayer === 'FOREGROUND' ? 170 : ent.depthLayer === 'MIDGROUND' ? 310 : 500;
        ent.vx = -(0.32 + Math.random() * 0.18);
        ent.vy = 0.14 + Math.random() * 0.12;
        ent.vz = -(0.08 + Math.random() * 0.12);
      } else if (pIndex === 3) {
        // Left -> Right horizontal glide
        ent.baseX = -width * 0.10 - Math.random() * 80;
        ent.baseY = height * (0.35 + Math.random() * 0.30);
        ent.baseZ = ent.depthLayer === 'MIDGROUND' ? 260 : 440;
        ent.vx = 0.35 + Math.random() * 0.18;
        ent.vy = (Math.random() - 0.5) * 0.12;
        ent.vz = 0.10 + Math.random() * 0.14;
      } else if (pIndex === 4) {
        // Right -> Left horizontal glide
        ent.baseX = width * 1.10 + Math.random() * 80;
        ent.baseY = height * (0.35 + Math.random() * 0.30);
        ent.baseZ = ent.depthLayer === 'MIDGROUND' ? 250 : 450;
        ent.vx = -(0.35 + Math.random() * 0.18);
        ent.vy = (Math.random() - 0.5) * 0.12;
        ent.vz = 0.10 + Math.random() * 0.14;
      } else if (pIndex === 5) {
        // Left -> Right upward diagonal drift
        ent.baseX = -width * 0.10 - Math.random() * 80;
        ent.baseY = height * (0.70 + Math.random() * 0.25);
        ent.baseZ = ent.depthLayer === 'MIDGROUND' ? 300 : 540;
        ent.vx = 0.32 + Math.random() * 0.18;
        ent.vy = -(0.22 + Math.random() * 0.16);
        ent.vz = -(0.10 + Math.random() * 0.12);
      } else if (pIndex === 6) {
        // Bottom -> Top vertical drift
        ent.baseX = width * (0.30 + Math.random() * 0.40);
        ent.baseY = height * 1.12 + Math.random() * 60;
        ent.baseZ = ent.depthLayer === 'MIDGROUND' ? 340 : 580;
        ent.vx = (Math.random() - 0.5) * 0.18;
        ent.vy = -(0.28 + Math.random() * 0.18);
        ent.vz = (Math.random() - 0.5) * 0.12;
      } else {
        // Right -> Left upward diagonal drift
        ent.baseX = width * 1.10 + Math.random() * 80;
        ent.baseY = height * (0.70 + Math.random() * 0.25);
        ent.baseZ = ent.depthLayer === 'MIDGROUND' ? 280 : 510;
        ent.vx = -(0.32 + Math.random() * 0.18);
        ent.vy = -(0.22 + Math.random() * 0.16);
        ent.vz = 0.10 + Math.random() * 0.14;
      }

      ent.x = ent.baseX;
      ent.y = ent.baseY;
      ent.z = ent.baseZ;

      // 3D Harmonic Spline parameters
      ent.curveAmpX = 22 + Math.random() * 26;
      ent.curveAmpY = 18 + Math.random() * 24;
      ent.curveAmpZ = 20 + Math.random() * 30;
      ent.curveFreqX = 0.14 + Math.random() * 0.18;
      ent.curveFreqY = 0.16 + Math.random() * 0.18;
      ent.curveFreqZ = 0.12 + Math.random() * 0.16;
      ent.curvePhaseX = Math.random() * Math.PI * 2;
      ent.curvePhaseY = Math.random() * Math.PI * 2;
      ent.curvePhaseZ = Math.random() * Math.PI * 2;

      // Compound 3D Rotation with varied axes
      ent.rotX = Math.random() * Math.PI * 2;
      ent.rotY = Math.random() * Math.PI * 2;
      ent.rotZ = (Math.random() - 0.5) * 0.5;

      const rotProfile = index % 5;
      if (rotProfile === 0) {
        // Slow upright spin
        ent.rotSpeedX = 0.0001;
        ent.rotSpeedY = 0.0009 + Math.random() * 0.0005;
        ent.rotSpeedZ = 0.0002;
      } else if (rotProfile === 1) {
        // Multi-axis compound tumble
        ent.rotSpeedX = (Math.random() - 0.5) * 0.0007;
        ent.rotSpeedY = (Math.random() - 0.5) * 0.0009;
        ent.rotSpeedZ = (Math.random() - 0.5) * 0.0005;
      } else if (rotProfile === 2) {
        // Slow elegant tilt
        ent.rotSpeedX = 0.0004;
        ent.rotSpeedY = 0.0002;
        ent.rotSpeedZ = (Math.random() - 0.5) * 0.0003;
      } else if (rotProfile === 3) {
        // Stationary with subtle breathing wobble
        ent.rotSpeedX = 0.0001;
        ent.rotSpeedY = 0.0001;
        ent.rotSpeedZ = 0.0001;
      } else {
        // Moderate helical roll
        ent.rotSpeedX = 0.0005;
        ent.rotSpeedY = 0.0007;
        ent.rotSpeedZ = 0.0004;
      }

      ent.physicsState = 'AUTONOMOUS';
      ent.mass = 1.2;
      ent.springFactor = 0.24;
      ent.dragFactor = 0.972;
      ent.throwVx = 0;
      ent.throwVy = 0;
      ent.throwVz = 0;
      ent.throwRotVx = 0;
      ent.throwRotVy = 0;
      ent.throwRotVz = 0;

      // Base sizes and opacities calibrated by depth layer
      if (ent.depthLayer === 'FOREGROUND') {
        ent.baseSize = 40;
        ent.baseOpacity = 0.36;
      } else if (ent.depthLayer === 'MIDGROUND') {
        ent.baseSize = 32;
        ent.baseOpacity = 0.28;
      } else if (ent.depthLayer === 'BACKGROUND') {
        ent.baseSize = 24;
        ent.baseOpacity = 0.18;
      } else {
        ent.baseSize = 18;
        ent.baseOpacity = 0.12;
      }

      ent.age = 0;
      ent.lifetime = 24 + Math.random() * 16;
      ent.hoverProgress = 0;
      ent.grabProgress = 0;
      ent.proxBoost = 0;
      ent.currentIllum = 0.20;

      ent.title = undefined;
      ent.text = undefined;
      ent.formula = undefined;
      ent.subText = undefined;
      ent.bookWidth = undefined;
      ent.bookHeight = undefined;
      ent.bookThickness = undefined;
      ent.coverColor = undefined;
      ent.spineColor = undefined;

      // Archetype-specific customization
      if (archetype === 'book_math') {
        ent.title = 'MATEMATIKA';
        ent.baseSize = 12;
        ent.baseOpacity = 0.34;
        ent.mass = 2.0;
        ent.bookWidth = 68;
        ent.bookHeight = 90;
        ent.bookThickness = 16;
        ent.coverColor = '#4A0E17';
        ent.spineColor = '#6B1422';
      } else if (archetype === 'book_english') {
        ent.title = 'ENGLISH';
        ent.baseSize = 12;
        ent.baseOpacity = 0.34;
        ent.mass = 2.0;
        ent.bookWidth = 66;
        ent.bookHeight = 88;
        ent.bookThickness = 15;
        ent.coverColor = '#121A28';
        ent.spineColor = '#1C273C';
      } else if (archetype === 'parabola') {
        ent.formula = 'y = x²';
        ent.baseSize = 32;
      } else if (archetype === 'sinewave') {
        ent.formula = 'y = sin(x)';
        ent.baseSize = 34;
      } else if (archetype === 'cosinewave') {
        ent.formula = 'y = cos(x)';
        ent.baseSize = 34;
      } else if (archetype === 'coord_axes') {
        ent.baseSize = 30;
      } else if (archetype === 'math_pi') {
        ent.text = 'π';
        ent.baseSize = 38;
      } else if (archetype === 'math_sum') {
        ent.text = '∑';
        ent.baseSize = 34;
      } else if (archetype === 'math_sqrt') {
        ent.text = '√x';
        ent.baseSize = 24;
      } else if (archetype === 'math_inf') {
        ent.text = '∞';
        ent.baseSize = 24;
      } else if (archetype === 'math_pyth') {
        ent.text = 'a² + b² = c²';
        ent.baseSize = 16;
      } else if (archetype === 'math_integral') {
        ent.text = '∫';
        ent.baseSize = 36;
      } else if (archetype === 'eng_words') {
        ent.text = ENGLISH_WORDS[index % ENGLISH_WORDS.length];
        ent.baseSize = 16;
      } else if (archetype === 'eng_letters') {
        ent.text = ENGLISH_LETTERS[index % ENGLISH_LETTERS.length];
        ent.baseSize = 26;
      }
    };

    const createEmptyFlyingEntity = (id: string): FlyingEntity3D => ({
      id,
      archetype: 'ring_thin',
      depthLayer: 'MIDGROUND',
      x: 0,
      y: 0,
      z: 300,
      baseX: 0,
      baseY: 0,
      baseZ: 300,
      vx: 0,
      vy: 0,
      vz: 0,
      curveAmpX: 30,
      curveAmpY: 25,
      curveAmpZ: 30,
      curveFreqX: 0.2,
      curveFreqY: 0.2,
      curveFreqZ: 0.2,
      curvePhaseX: 0,
      curvePhaseY: 0,
      curvePhaseZ: 0,
      rotX: 0,
      rotY: 0,
      rotZ: 0,
      rotSpeedX: 0,
      rotSpeedY: 0,
      rotSpeedZ: 0,
      physicsState: 'AUTONOMOUS',
      mass: 1.2,
      springFactor: 0.24,
      dragFactor: 0.972,
      throwVx: 0,
      throwVy: 0,
      throwVz: 0,
      throwRotVx: 0,
      throwRotVy: 0,
      throwRotVz: 0,
      baseSize: 32,
      baseOpacity: 0.28,
      age: 0,
      lifetime: 25,
      hoverProgress: 0,
      grabProgress: 0,
      proxBoost: 0,
      currentIllum: 0.20,
      projX: 0,
      projY: 0,
      projScale: 0,
      projZ: 300,
    });

    // Maximum pool size allocated upfront (Zero array re-allocations at runtime)
    const MAX_ENTITIES = 16;
    const flyingEntities: FlyingEntity3D[] = [];
    for (let i = 0; i < MAX_ENTITIES; i++) {
      const ent = createEmptyFlyingEntity(`entity-${i}`);
      resetFlyingEntity(ent, i);
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

    // -------------------------------------------------------------------------
    // 6. POINTER INTERACTION: TOUCH LOCK & DEAD-ZONE PROTECTION
    // -------------------------------------------------------------------------
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

    const isInteractiveTarget = (target: EventTarget | null): boolean => {
      if (!target || !(target instanceof HTMLElement)) return false;
      return !!target.closest('button, a, input, textarea, select, [role="button"], nav, header');
    };

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

      const now = performance.now();
      pointerRef.history.push({ x: clientX, y: clientY, time: now });
      if (pointerRef.history.length > 8) {
        pointerRef.history.shift();
      }

      // If holding an object:
      if (pointerRef.grabbedEntity) {
        const moveDist = Math.hypot(clientX - pointerRef.initialDownX, clientY - pointerRef.initialDownY);
        if (moveDist > (isMobile ? 5 : 3)) {
          pointerRef.isDragConfirmed = true;
        }

        document.body.style.cursor = 'grabbing';
        e.preventDefault();
        return;
      }

      if (isInteractiveTarget(e.target)) {
        pointerRef.hoveredEntity = null;
        document.body.style.cursor = 'default';
        return;
      }

      // Fast hit testing directly against cached projected coordinates
      let foundHover: FlyingEntity3D | null = null;
      let minDistance = 9999;

      const activeCount = Math.min(flyingEntities.length, targetEntityCount);
      for (let i = activeCount - 1; i >= 0; i--) {
        const ent = flyingEntities[i];
        if (ent.projScale <= 0) continue;

        const dx = clientX - ent.projX;
        const dy = clientY - ent.projY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const hitRadius = Math.max(
          isMobile ? 50 : 38,
          ent.baseSize * ent.projScale * 1.6,
          (ent.bookWidth || 0) * ent.projScale * 0.85,
          (ent.bookHeight || 0) * ent.projScale * 0.85
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

      let targetEntity: FlyingEntity3D | null = null;
      let minDistance = 9999;

      const activeCount = Math.min(flyingEntities.length, targetEntityCount);
      for (let i = activeCount - 1; i >= 0; i--) {
        const ent = flyingEntities[i];
        if (ent.projScale <= 0) continue;

        const dx = clientX - ent.projX;
        const dy = clientY - ent.projY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const hitRadius = Math.max(
          isMobile ? 52 : 40,
          ent.baseSize * ent.projScale * 1.6,
          (ent.bookWidth || 0) * ent.projScale * 0.85,
          (ent.bookHeight || 0) * ent.projScale * 0.85
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

        pointerRef.grabOffsetX = clientX - targetEntity.projX;
        pointerRef.grabOffsetY = clientY - targetEntity.projY;

        // Pointer Capture on original target
        if (e.target && e.target instanceof Element) {
          try {
            e.target.setPointerCapture(e.pointerId);
            pointerRef.capturedTarget = e.target;
          } catch (err) {}
        }

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

        const recentPoints = history.filter(p => now - p.time <= 100);

        if (recentPoints.length >= 2 && pointerRef.isDragConfirmed) {
          const first = recentPoints[0];
          const last = recentPoints[recentPoints.length - 1];
          const dt = (last.time - first.time) / 1000;
          if (dt > 0.012 && (now - last.time) < 60) {
            const pxPerSecX = (last.x - first.x) / dt;
            const pxPerSecY = (last.y - first.y) / dt;
            throwVx = pxPerSecX / 60;
            throwVy = pxPerSecY / 60;
          }
        }

        const screenSpeed = Math.sqrt(throwVx * throwVx + throwVy * throwVy);
        const maxSpeed = 28;
        if (screenSpeed > maxSpeed) {
          throwVx = (throwVx / screenSpeed) * maxSpeed;
          throwVy = (throwVy / screenSpeed) * maxSpeed;
        }

        const currentScale = ent.projScale > 0 ? ent.projScale : 0.5;

        ent.throwVx = throwVx / currentScale;
        ent.throwVy = throwVy / currentScale;
        ent.throwVz = (Math.random() - 0.5) * 1.5;

        ent.throwRotVx = -(throwVy) * 0.0035;
        ent.throwRotVy = (throwVx) * 0.0035;
        ent.throwRotVz = (throwVx) * 0.0018;

        ent.physicsState = screenSpeed > 0.5 ? 'THROWN' : 'MOMENTUM';

        if (pointerRef.capturedTarget && pointerRef.pointerId !== -1) {
          try {
            pointerRef.capturedTarget.releasePointerCapture(pointerRef.pointerId);
          } catch (err) {}
          pointerRef.capturedTarget = null;
        }

        setSelectionShield(false);

        pointerRef.grabbedEntity = null;
        pointerRef.isDown = false;
        pointerRef.pointerId = -1;
        pointerRef.isDragConfirmed = false;
        document.body.style.cursor = pointerRef.hoveredEntity ? 'grab' : 'default';
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (pointerRef.grabbedEntity) {
        e.preventDefault();
      }
    };

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
    // 7. ATMOSPHERIC DUST PARTICLES
    // -------------------------------------------------------------------------
    const getDustCountForTier = (tier: PerformanceTier) => {
      switch (tier) {
        case 'ULTRA_LOW':
          return 0;
        case 'LOW':
          return 10;
        case 'MEDIUM':
          return 20;
        case 'HIGH':
          return 35;
      }
    };

    let dustCount = getDustCountForTier(currentTier);
    const dustParticles: DustParticle3D[] = Array.from({ length: 40 }, () => {
      const z = Math.random() * 700 + 50;
      return {
        x: Math.random() * (width * 1.2) - width * 0.1,
        y: Math.random() * (height * 1.2) - height * 0.1,
        z,
        vx: (Math.random() - 0.5) * 0.08,
        vy: -(0.06 + Math.random() * 0.14),
        vz: (Math.random() - 0.5) * 0.06,
        baseAlpha: 0.10 + (1 - z / 800) * 0.25,
        phase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.005 + Math.random() * 0.010,
        size: z < 250 ? 2.0 : z < 500 ? 1.4 : 0.9,
      };
    });

    // -------------------------------------------------------------------------
    // 8. DYNAMIC SAFE ZONE ATTENUATION
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

      const margin = 40;

      if (
        projX >= textLeft - margin &&
        projX <= textRight + margin &&
        projY >= textTop - margin &&
        projY <= textBottom + margin
      ) {
        const dx = Math.max(0, Math.min(projX - textLeft, textRight - projX));
        const dy = Math.max(0, Math.min(projY - textTop, textBottom - projY));
        const depth = Math.min(dx, dy);
        return Math.max(0.04, 1.0 - (depth / margin) * 0.96);
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
        return Math.max(0.04, 1.0 - (depth / margin) * 0.96);
      }

      return 1.0;
    };

    const sharedProj = { projX: 0, projY: 0, projScale: 0, projZ: 0 };

    // -------------------------------------------------------------------------
    // 9. ADAPTIVE 60 FPS RENDER LOOP
    // -------------------------------------------------------------------------
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsAccumulator = 0;
    let highFpsCount = 0;

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;
      const elapsed = (now - startTimeRef.current) / 1000;

      const revealProgress = prefersReducedMotion
        ? 1.0
        : Math.min(1.0, Math.pow(elapsed / 2.0, 1.5));

      // Realtime Performance Monitoring & Dynamic Tier Adaptation
      frameCount++;
      fpsAccumulator += 1 / (dt || 0.016);
      if (frameCount >= 45) {
        const avgFps = fpsAccumulator / frameCount;
        if (avgFps < 36) {
          // Degrade tier on lag spikes
          if (currentTier === 'HIGH') currentTier = 'MEDIUM';
          else if (currentTier === 'MEDIUM') currentTier = 'LOW';
          else if (currentTier === 'LOW') currentTier = 'ULTRA_LOW';

          targetEntityCount = getEntityCountForTier(currentTier);
          dustCount = getDustCountForTier(currentTier);
          highFpsCount = 0;
        } else if (avgFps > 56) {
          highFpsCount++;
          if (highFpsCount > 4) { // Sustained high FPS (~3 seconds)
            if (currentTier === 'ULTRA_LOW') currentTier = 'LOW';
            else if (currentTier === 'LOW' && !isMobile) currentTier = 'MEDIUM';
            else if (currentTier === 'MEDIUM' && !isMobile && !isTablet) currentTier = 'HIGH';

            targetEntityCount = getEntityCountForTier(currentTier);
            dustCount = getDustCountForTier(currentTier);
            highFpsCount = 0;
          }
        }
        frameCount = 0;
        fpsAccumulator = 0;
      }

      ctx.clearRect(0, 0, width, height);

      // Smooth Camera Floating Drift
      const camX = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.14) * 12;
      const camY = prefersReducedMotion ? 0 : Math.cos(elapsed * 0.11) * 8;
      const camZ = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.16) * 14;

      // Mouse Parallax (Disabled on mobile)
      const mouseFactor = prefersReducedMotion || isMobile ? 0 : 0.04;
      mouseRef.current.currentX +=
        (mouseRef.current.targetX - mouseRef.current.currentX) * mouseFactor;
      mouseRef.current.currentY +=
        (mouseRef.current.targetY - mouseRef.current.currentY) * mouseFactor;

      const parallaxX = isMobile ? 0 : mouseRef.current.currentX * 12;
      const parallaxY = isMobile ? 0 : mouseRef.current.currentY * 8;

      // Scroll Camera Depth Shift
      scrollRef.current.currentY +=
        (scrollRef.current.targetY - scrollRef.current.currentY) * 0.08;
      const scrollDepthShift = Math.min(90, scrollRef.current.currentY * 0.06);

      // -----------------------------------------------------------------------
      // TRAVELING GOLDEN LIGHT WAVE (Medium & High Tiers)
      // -----------------------------------------------------------------------
      if (currentTier === 'MEDIUM' || currentTier === 'HIGH') {
        const waveCycleTime = (elapsed % waveState.duration) / waveState.duration;
        const currentCycleCount = Math.floor(elapsed / waveState.duration);
        if (currentCycleCount !== waveState.cycleCount) {
          waveState = generateWaveTrajectory(currentCycleCount);
        }
        updateBezierPoint(
          waveState.p0,
          waveState.p1,
          waveState.p2,
          waveState.p3,
          waveCycleTime,
          waveState.currentPos
        );

        projectPoint(
          waveState.currentPos.x,
          waveState.currentPos.y,
          waveState.currentPos.z,
          camX,
          camY,
          camZ + scrollDepthShift,
          parallaxX,
          parallaxY,
          sharedProj
        );

        if (sharedProj.projScale > 0) {
          const waveAuraSize = spriteWaveAura.width * sharedProj.projScale * 1.5;
          const waveFade = Math.sin(waveCycleTime * Math.PI);
          ctx.globalAlpha = 0.40 * waveFade * revealProgress;
          ctx.drawImage(
            spriteWaveAura,
            sharedProj.projX - waveAuraSize / 2,
            sharedProj.projY - waveAuraSize / 2,
            waveAuraSize,
            waveAuraSize
          );
          ctx.globalAlpha = 1.0;
        }
      }

      // -----------------------------------------------------------------------
      // VIRTUAL MOVING LIGHTS (Tier dependent: 1, 2, or 3)
      // -----------------------------------------------------------------------
      const lightsToRender = currentTier === 'ULTRA_LOW' || currentTier === 'LOW' ? 1 : currentTier === 'MEDIUM' ? 2 : 3;
      for (let i = 0; i < lightsToRender; i++) {
        const vl = virtualLights[i];
        if (!prefersReducedMotion) {
          vl.phase += vl.speed;
          vl.x = vl.centerX + Math.cos(vl.phase * vl.freqX) * vl.orbitRx;
          vl.y = vl.centerY + Math.sin(vl.phase * vl.freqY) * vl.orbitRy;
          vl.z = vl.centerZ + Math.sin(vl.phase * vl.freqZ) * vl.orbitRz;
        }

        projectPoint(
          vl.x,
          vl.y,
          vl.z,
          camX,
          camY,
          camZ + scrollDepthShift,
          parallaxX,
          parallaxY,
          sharedProj
        );

        if (sharedProj.projScale > 0) {
          const auraSize = spriteLightAura.width * sharedProj.projScale * 1.3;
          ctx.globalAlpha = vl.intensity * 0.38 * revealProgress;
          ctx.drawImage(
            spriteLightAura,
            sharedProj.projX - auraSize / 2,
            sharedProj.projY - auraSize / 2,
            auraSize,
            auraSize
          );
        }
      }
      ctx.globalAlpha = 1.0;

      // -----------------------------------------------------------------------
      // 3D PHYSICAL MOTION & MOMENTUM INTEGRATION (Never Paused / Always Alive)
      // -----------------------------------------------------------------------
      const activeCount = Math.min(flyingEntities.length, targetEntityCount);
      for (let i = 0; i < activeCount; i++) {
        const ent = flyingEntities[i];

        // 1. STATE: GRABBED (Firmly attached to cursor/finger, carry anywhere)
        if (ent.physicsState === 'GRABBED') {
          ent.grabProgress += (1.0 - ent.grabProgress) * 0.22;
          ent.hoverProgress += (1.0 - ent.hoverProgress) * 0.22;

          const targetScreenX = pointerRef.x - pointerRef.grabOffsetX;
          const targetScreenY = pointerRef.y - pointerRef.grabOffsetY;

          const targetZ = Math.max(120, ent.baseZ - 50);
          ent.z += (targetZ - ent.z) * 0.15;

          const relZ = Math.max(ent.z + camZ + scrollDepthShift, 12);
          const currentScale = fov / (fov + relZ);

          const targetWorldX = width / 2 + (targetScreenX - width / 2) / currentScale + camX - parallaxX;
          const targetWorldY = height / 2 + (targetScreenY - height / 2) / currentScale + camY - parallaxY;

          const prevX = ent.x;
          const prevY = ent.y;

          const followSpeed = pointerRef.isDragConfirmed ? 0.85 : 0.65;
          ent.x += (targetWorldX - ent.x) * followSpeed;
          ent.y += (targetWorldY - ent.y) * followSpeed;

          const moveDeltaX = ent.x - prevX;
          const moveDeltaY = ent.y - prevY;

          // Natural 3D rotation reflecting hand carry
          ent.rotY += moveDeltaX * 0.0032;
          ent.rotX -= moveDeltaY * 0.0032;
          ent.rotZ += moveDeltaX * 0.0016;
          ent.rotZ *= 0.95;

          // Continuous spline anchor update (0px jump upon release)
          const harmonicX = Math.sin(ent.age * ent.curveFreqX + ent.curvePhaseX) * ent.curveAmpX;
          const harmonicY = Math.cos(ent.age * ent.curveFreqY + ent.curvePhaseY) * ent.curveAmpY;
          const harmonicZ = Math.sin(ent.age * ent.curveFreqZ + ent.curvePhaseZ) * ent.curveAmpZ;
          ent.baseX = ent.x - harmonicX;
          ent.baseY = ent.y - harmonicY;
          ent.baseZ = ent.z - harmonicZ;
        }

        // 2. STATE: THROWN / MOMENTUM (Flying with physical momentum & bounce)
        else if (ent.physicsState === 'THROWN' || ent.physicsState === 'MOMENTUM') {
          ent.grabProgress += (0.0 - ent.grabProgress) * 0.10;
          ent.hoverProgress += (0.0 - ent.hoverProgress) * 0.10;

          ent.x += ent.throwVx;
          ent.y += ent.throwVy;
          ent.z += ent.throwVz;

          ent.rotX += ent.throwRotVx;
          ent.rotY += ent.throwRotVy;
          ent.rotZ += ent.throwRotVz;

          ent.throwVx *= 0.985;
          ent.throwVy *= 0.985;
          ent.throwVz *= 0.985;
          ent.throwRotVx *= 0.982;
          ent.throwRotVy *= 0.982;
          ent.throwRotVz *= 0.982;

          // Soft Screen Boundary Bouncing
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

          const harmonicX = Math.sin(ent.age * ent.curveFreqX + ent.curvePhaseX) * ent.curveAmpX;
          const harmonicY = Math.cos(ent.age * ent.curveFreqY + ent.curvePhaseY) * ent.curveAmpY;
          const harmonicZ = Math.sin(ent.age * ent.curveFreqZ + ent.curvePhaseZ) * ent.curveAmpZ;
          ent.baseX = ent.x - harmonicX;
          ent.baseY = ent.y - harmonicY;
          ent.baseZ = ent.z - harmonicZ;

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

        // 3. STATE: AUTONOMOUS (Continuous smooth 3D curved spline flight)
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

          // In-place recycling (Zero GC allocations)
          const isOutOfScreen =
            ent.x < -width * 0.25 ||
            ent.x > width * 1.25 ||
            ent.y < -height * 0.25 ||
            ent.y > height * 1.25 ||
            ent.z < 80 ||
            ent.z > 880;

          if (isOutOfScreen && ent.age > 8) {
            resetFlyingEntity(ent, i);
          }
        }

        // Project entity and cache coordinates for hit testing & rendering
        projectPoint(
          ent.x,
          ent.y,
          ent.z,
          camX,
          camY,
          camZ + scrollDepthShift,
          parallaxX,
          parallaxY,
          ent
        );
      }

      // Depth sorting from furthest to nearest
      flyingEntities.slice(0, activeCount).sort((a, b) => b.z - a.z);

      // Render all active entities
      for (let i = 0; i < activeCount; i++) {
        const obj = flyingEntities[i];
        if (obj.projScale <= 0) continue;

        const isInteracting =
          obj.physicsState === 'GRABBED' ||
          obj.physicsState === 'THROWN' ||
          obj.physicsState === 'MOMENTUM' ||
          obj.grabProgress > 0.05;

        const safeFactor = isInteracting ? 1.0 : computeSafeZoneFactor(obj.projX, obj.projY);

        const edgeFadeX = isInteracting ? 1.0 : Math.min(1, Math.min(obj.projX + 80, width + 80 - obj.projX) / 100);
        const edgeFadeY = isInteracting ? 1.0 : Math.min(1, Math.min(obj.projY + 80, height + 80 - obj.projY) / 100);
        const edgeAlpha = Math.max(0, Math.min(1, edgeFadeX * edgeFadeY));

        const { lightBoost, waveBoost } = getIlluminationBoost(obj.x, obj.y, obj.z, lightsToRender);

        // Continuous distance proximity
        const normZ = Math.max(0, Math.min(1, (obj.z - 110) / (720 - 110)));
        const rawProximity = 1.0 - normZ;
        const smoothProximity = rawProximity * rawProximity * (3 - 2 * rawProximity);

        const targetDistanceLight = 0.12 + smoothProximity * 0.88;
        obj.currentIllum += (targetDistanceLight - obj.currentIllum) * 0.08;

        const grabLightMultiplier = 1.0 + obj.grabProgress * 0.15;
        const effectiveIllum = Math.min(
          1.15,
          (obj.currentIllum + lightBoost * 0.25 + waveBoost * 0.35 + obj.proxBoost * 0.25) * grabLightMultiplier
        );

        const finalAlpha =
          (obj.baseOpacity * (0.4 + smoothProximity * 0.6) + effectiveIllum * 0.22 + obj.hoverProgress * 0.12) *
          edgeAlpha *
          safeFactor *
          revealProgress;

        if (finalAlpha < 0.010) continue;

        ctx.save();
        ctx.translate(obj.projX, obj.projY);

        const interactiveScale = 1.0 + obj.hoverProgress * 0.02 + obj.grabProgress * 0.04;
        ctx.scale(interactiveScale, interactiveScale);

        // Grab Golden Rim Aura
        if (obj.grabProgress > 0.02) {
          const grabAuraSize = spriteGrabAura.width * obj.projScale * 1.3;
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

        // Instant 0-allocation Color LUT access
        const lutIdx = Math.min(63, Math.max(0, Math.floor(Math.min(1.0, effectiveIllum) * 63)));
        const colors = COLOR_LUT[lutIdx];

        const rx = obj.rotX;
        const ry = obj.rotY;
        const rz = obj.rotZ;

        // ---------------------------------------------------------------------
        // 1. HARDCOVER BOOKS (MATEMATIKA & ENGLISH)
        // ---------------------------------------------------------------------
        if ((obj.archetype === 'book_math' || obj.archetype === 'book_english') && obj.bookWidth && obj.bookHeight && obj.bookThickness) {
          const bw = obj.bookWidth * obj.projScale;
          const bh = obj.bookHeight * obj.projScale;
          const bThick = obj.bookThickness * obj.projScale;

          const openAngle = (obj.hoverProgress + obj.grabProgress) * 0.08;
          ctx.rotate(rz + openAngle);

          if (currentTier !== 'ULTRA_LOW' || obj.grabProgress > 0.1) {
            const shadowOffset = 2 + obj.grabProgress * 3;
            ctx.beginPath();
            ctx.roundRect(-bw / 2 + shadowOffset, -bh / 2 + shadowOffset, bw, bh, 3);
            ctx.fillStyle = `rgba(5, 3, 4, ${0.40 + obj.grabProgress * 0.30})`;
            ctx.fill();
          }

          // Pages
          ctx.fillStyle = `rgba(235, 222, 195, ${finalAlpha * 0.85})`;
          ctx.fillRect(-bw / 2 + bw - bThick * 0.35, -bh / 2 + 2, bThick * 0.35, bh - 4);

          // Cover
          ctx.beginPath();
          ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 3);
          ctx.fillStyle = obj.archetype === 'book_math' ? colors.bookCoverMath : colors.bookCoverEng;
          ctx.globalAlpha = finalAlpha * 0.95;
          ctx.fill();

          // Border & Spine
          ctx.strokeStyle = colors.highlight;
          ctx.lineWidth = 1.0 + obj.grabProgress * 0.3;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(-bw / 2 + bThick * 0.45, -bh / 2);
          ctx.lineTo(-bw / 2 + bThick * 0.45, bh / 2);
          ctx.strokeStyle = colors.highlight;
          ctx.lineWidth = 1.1;
          ctx.stroke();

          // Title
          ctx.font = `bold ${Math.max(6, Math.floor(7.5 * obj.projScale))}px -apple-system, sans-serif`;
          ctx.fillStyle = colors.highlight;
          ctx.letterSpacing = '1.2px';
          ctx.textAlign = 'center';
          ctx.fillText(obj.title || '', 0, 4);
        }

        // ---------------------------------------------------------------------
        // 2. RINGS & LOOPS (Thin, Nested, Broken, Elliptical, Twisted, Helix, Torus)
        // ---------------------------------------------------------------------
        else if (obj.archetype === 'ring_thin') {
          const R = obj.baseSize * obj.projScale * 0.55;
          ctx.strokeStyle = colors.stroke;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.ellipse(0, 0, R, R * Math.abs(Math.cos(rx)), rz, 0, Math.PI * 2);
          ctx.stroke();

          if (currentTier !== 'ULTRA_LOW') {
            ctx.strokeStyle = colors.highlight;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.ellipse(0, 0, R * 0.92, R * 0.92 * Math.abs(Math.cos(rx)), rz, 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        else if (obj.archetype === 'ring_nested') {
          const r1 = obj.baseSize * obj.projScale * 0.55;
          const r2 = r1 * 0.72;
          ctx.lineWidth = 1.1;

          // Outer ring
          ctx.strokeStyle = colors.stroke;
          ctx.beginPath();
          ctx.ellipse(0, 0, r1, r1 * Math.abs(Math.cos(rx)), rz, 0, Math.PI * 2);
          ctx.stroke();

          // Inner ring at tilted angle
          ctx.strokeStyle = colors.highlight;
          ctx.beginPath();
          ctx.ellipse(0, 0, r2, r2 * Math.abs(Math.sin(ry)), rz + 0.8, 0, Math.PI * 2);
          ctx.stroke();
        }

        else if (obj.archetype === 'ring_broken') {
          const R = obj.baseSize * obj.projScale * 0.52;
          ctx.strokeStyle = colors.stroke;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.ellipse(0, 0, R, R * Math.abs(Math.cos(rx)), rz, 0.25 * Math.PI, 1.85 * Math.PI);
          ctx.stroke();

          // Glowing tip nodes
          ctx.fillStyle = colors.highlight;
          rotate3D(Math.cos(0.25 * Math.PI) * R, Math.sin(0.25 * Math.PI) * R, 0, rx, ry, rz);
          ctx.beginPath();
          ctx.arc(rotBuf.x, rotBuf.y, 1.6, 0, Math.PI * 2);
          ctx.fill();

          rotate3D(Math.cos(1.85 * Math.PI) * R, Math.sin(1.85 * Math.PI) * R, 0, rx, ry, rz);
          ctx.beginPath();
          ctx.arc(rotBuf.x, rotBuf.y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }

        else if (obj.archetype === 'ring_elliptical') {
          const a = obj.baseSize * obj.projScale * 0.60;
          const b = a * 0.55;
          ctx.strokeStyle = colors.stroke;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.ellipse(0, 0, a, b * Math.abs(Math.cos(rx)), rz + 0.4, 0, Math.PI * 2);
          ctx.stroke();
        }

        else if (obj.archetype === 'ring_twisted') {
          // 3D Mobius / Torsion Ribbon
          const R = obj.baseSize * obj.projScale * 0.50;
          const w = R * 0.22;
          ctx.strokeStyle = colors.stroke;
          ctx.lineWidth = 1.0;
          ctx.beginPath();

          const segs = currentTier === 'ULTRA_LOW' || currentTier === 'LOW' ? 12 : 20;
          for (let step = 0; step <= segs; step++) {
            const u = (step / segs) * Math.PI * 2;
            const px = Math.cos(u) * (R + w * Math.cos(u / 2));
            const py = Math.sin(u) * (R + w * Math.cos(u / 2));
            const pz = w * Math.sin(u / 2);
            rotate3D(px, py, pz, rx, ry, rz);
            if (step === 0) ctx.moveTo(rotBuf.x, rotBuf.y);
            else ctx.lineTo(rotBuf.x, rotBuf.y);
          }
          ctx.stroke();
        }

        else if (obj.archetype === 'ring_double_helix') {
          const R = obj.baseSize * obj.projScale * 0.48;
          const rH = R * 0.24;
          ctx.lineWidth = 1.0;

          const segs = currentTier === 'ULTRA_LOW' || currentTier === 'LOW' ? 14 : 22;
          // Strand 1
          ctx.strokeStyle = colors.stroke;
          ctx.beginPath();
          for (let step = 0; step <= segs; step++) {
            const u = (step / segs) * Math.PI * 2;
            const px = Math.cos(u) * R + Math.cos(u * 4) * rH;
            const py = Math.sin(u) * R + Math.sin(u * 4) * rH;
            const pz = Math.cos(u * 4) * rH;
            rotate3D(px, py, pz, rx, ry, rz);
            if (step === 0) ctx.moveTo(rotBuf.x, rotBuf.y);
            else ctx.lineTo(rotBuf.x, rotBuf.y);
          }
          ctx.stroke();

          // Strand 2
          ctx.strokeStyle = colors.highlight;
          ctx.beginPath();
          for (let step = 0; step <= segs; step++) {
            const u = (step / segs) * Math.PI * 2;
            const px = Math.cos(u) * R - Math.cos(u * 4) * rH;
            const py = Math.sin(u) * R - Math.sin(u * 4) * rH;
            const pz = -Math.cos(u * 4) * rH;
            rotate3D(px, py, pz, rx, ry, rz);
            if (step === 0) ctx.moveTo(rotBuf.x, rotBuf.y);
            else ctx.lineTo(rotBuf.x, rotBuf.y);
          }
          ctx.stroke();
        }

        else if (obj.archetype === 'torus') {
          const R = obj.baseSize * obj.projScale * 0.50;
          const r = R * 0.35;
          ctx.strokeStyle = colors.stroke;
          ctx.lineWidth = 1.1;

          const segments = currentTier === 'ULTRA_LOW' || currentTier === 'LOW' ? 10 : 16;
          for (let j = 0; j < segments; j += 2) {
            const u = (j / segments) * Math.PI * 2;
            const cx = Math.cos(u) * R;
            const cy = Math.sin(u) * R;
            ctx.beginPath();
            for (let k = 0; k <= 8; k++) {
              const v = (k / 8) * Math.PI * 2;
              const px = cx + Math.cos(u) * Math.cos(v) * r;
              const py = cy + Math.sin(u) * Math.cos(v) * r;
              const pz = Math.sin(v) * r;
              rotate3D(px, py, pz, rx, ry, rz);
              if (k === 0) ctx.moveTo(rotBuf.x, rotBuf.y);
              else ctx.lineTo(rotBuf.x, rotBuf.y);
            }
            ctx.stroke();
          }
        }

        // ---------------------------------------------------------------------
        // 3. ABSTRACT 3D MATHEMATICAL SCULPTURES (Knot, Saddle, Wave, Interlocking, Nested Shell)
        // ---------------------------------------------------------------------
        else if (obj.archetype === 'sculpture_knot') {
          // 3D Trefoil Knot
          const s = obj.baseSize * obj.projScale * 0.38;
          ctx.strokeStyle = colors.stroke;
          ctx.lineWidth = 1.2;
          ctx.beginPath();

          const segs = currentTier === 'ULTRA_LOW' || currentTier === 'LOW' ? 24 : 40;
          for (let step = 0; step <= segs; step++) {
            const t = (step / segs) * Math.PI * 2;
            const px = (Math.sin(t) + 2 * Math.sin(2 * t)) * s;
            const py = (Math.cos(t) - 2 * Math.cos(2 * t)) * s;
            const pz = -Math.sin(3 * t) * s * 1.2;
            rotate3D(px, py, pz, rx, ry, rz);
            if (step === 0) ctx.moveTo(rotBuf.x, rotBuf.y);
            else ctx.lineTo(rotBuf.x, rotBuf.y);
          }
          ctx.stroke();
        }

        else if (obj.archetype === 'sculpture_saddle') {
          // Hyperbolic Paraboloid Saddle z = (x² - y²)/scale
          const s = obj.baseSize * obj.projScale * 0.46;
          ctx.strokeStyle = colors.stroke;
          ctx.lineWidth = 0.9;

          const steps = currentTier === 'ULTRA_LOW' || currentTier === 'LOW' ? 4 : 6;
          for (let u = -steps; u <= steps; u += 2) {
            const px = (u / steps) * s;
            ctx.beginPath();
            for (let v = -steps; v <= steps; v++) {
              const py = (v / steps) * s;
              const pz = (px * px - py * py) / (s * 0.9);
              rotate3D(px, py, pz, rx, ry, rz);
              if (v === -steps) ctx.moveTo(rotBuf.x, rotBuf.y);
              else ctx.lineTo(rotBuf.x, rotBuf.y);
            }
            ctx.stroke();
          }
        }

        else if (obj.archetype === 'sculpture_wave') {
          // 3D Multi-rib Harmonic Wave Sculpture
          const s = obj.baseSize * obj.projScale * 0.50;
          ctx.strokeStyle = colors.stroke;
          ctx.lineWidth = 1.0;

          const ribs = currentTier === 'ULTRA_LOW' || currentTier === 'LOW' ? 3 : 5;
          for (let r = -ribs; r <= ribs; r += 2) {
            const py = (r / ribs) * s * 0.7;
            ctx.beginPath();
            for (let xStep = -6; xStep <= 6; xStep++) {
              const px = (xStep / 6) * s;
              const pz = Math.sin(px * 0.12 + r * 0.5) * 14 * (s / 32);
              rotate3D(px, py, pz, rx, ry, rz);
              if (xStep === -6) ctx.moveTo(rotBuf.x, rotBuf.y);
              else ctx.lineTo(rotBuf.x, rotBuf.y);
            }
            ctx.stroke();
          }
        }

        else if (obj.archetype === 'sculpture_interlocking') {
          // Two interlocking 3D rings linked through each other
          const R = obj.baseSize * obj.projScale * 0.42;
          ctx.lineWidth = 1.1;

          // Ring 1 (tilted on X/Y)
          ctx.strokeStyle = colors.stroke;
          ctx.beginPath();
          for (let step = 0; step <= 16; step++) {
            const u = (step / 16) * Math.PI * 2;
            const px = Math.cos(u) * R - R * 0.35;
            const py = Math.sin(u) * R;
            const pz = 0;
            rotate3D(px, py, pz, rx, ry, rz);
            if (step === 0) ctx.moveTo(rotBuf.x, rotBuf.y);
            else ctx.lineTo(rotBuf.x, rotBuf.y);
          }
          ctx.stroke();

          // Ring 2 (linked orthogonally on Y/Z)
          ctx.strokeStyle = colors.highlight;
          ctx.beginPath();
          for (let step = 0; step <= 16; step++) {
            const u = (step / 16) * Math.PI * 2;
            const px = 0;
            const py = Math.sin(u) * R;
            const pz = Math.cos(u) * R - R * 0.35;
            rotate3D(px, py, pz, rx, ry, rz);
            if (step === 0) ctx.moveTo(rotBuf.x, rotBuf.y);
            else ctx.lineTo(rotBuf.x, rotBuf.y);
          }
          ctx.stroke();
        }

        else if (obj.archetype === 'sculpture_nested_shell') {
          // Octahedron shell enclosed inside a cube frame
          const s = obj.baseSize * obj.projScale * 0.44;
          const vertsCube = [
            [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
            [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s],
          ];
          const edgesCube = [
            [0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],
            [0,4],[1,5],[2,6],[3,7]
          ];
          ctx.strokeStyle = colors.fill;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          for (let e = 0; e < edgesCube.length; e++) {
            const [v1, v2] = edgesCube[e];
            rotate3D(vertsCube[v1][0], vertsCube[v1][1], vertsCube[v1][2], rx, ry, rz);
            ctx.moveTo(rotBuf.x, rotBuf.y);
            rotate3D(vertsCube[v2][0], vertsCube[v2][1], vertsCube[v2][2], rx, ry, rz);
            ctx.lineTo(rotBuf.x, rotBuf.y);
          }
          ctx.stroke();

          // Inner Golden Octahedron
          const so = s * 0.75;
          const vertsOct = [
            [0, -so, 0], [0, so, 0],
            [-so, 0, 0], [so, 0, 0], [0, 0, -so], [0, 0, so]
          ];
          const edgesOct = [
            [0,2],[0,3],[0,4],[0,5],
            [1,2],[1,3],[1,4],[1,5],
            [2,4],[4,3],[3,5],[5,2]
          ];
          ctx.strokeStyle = colors.highlight;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          for (let e = 0; e < edgesOct.length; e++) {
            const [v1, v2] = edgesOct[e];
            rotate3D(vertsOct[v1][0], vertsOct[v1][1], vertsOct[v1][2], rx, ry, rz);
            ctx.moveTo(rotBuf.x, rotBuf.y);
            rotate3D(vertsOct[v2][0], vertsOct[v2][1], vertsOct[v2][2], rx, ry, rz);
            ctx.lineTo(rotBuf.x, rotBuf.y);
          }
          ctx.stroke();
        }

        // ---------------------------------------------------------------------
        // 4. CUBE & FRAME SYSTEM (Beveled, Nested, Golden Cage Wire)
        // ---------------------------------------------------------------------
        else if (obj.archetype === 'cube_beveled' || obj.archetype === 'cube_nested' || obj.archetype === 'cube_wire') {
          const s = obj.baseSize * obj.projScale * 0.45;
          const verts = [
            [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
            [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s],
          ];
          const edges = [
            [0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],
            [0,4],[1,5],[2,6],[3,7]
          ];

          ctx.strokeStyle = colors.stroke;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          for (let e = 0; e < edges.length; e++) {
            const [v1, v2] = edges[e];
            rotate3D(verts[v1][0], verts[v1][1], verts[v1][2], rx, ry, rz);
            ctx.moveTo(rotBuf.x, rotBuf.y);
            rotate3D(verts[v2][0], verts[v2][1], verts[v2][2], rx, ry, rz);
            ctx.lineTo(rotBuf.x, rotBuf.y);
          }
          ctx.stroke();

          // If nested: inner diamond cube rotated 45 deg
          if (obj.archetype === 'cube_nested' && currentTier !== 'ULTRA_LOW') {
            const si = s * 0.52;
            const innerVerts = [
              [-si, -si, -si], [si, -si, -si], [si, si, -si], [-si, si, -si],
              [-si, -si, si], [si, -si, si], [si, si, si], [-si, si, si],
            ];
            ctx.strokeStyle = colors.highlight;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            for (let e = 0; e < edges.length; e++) {
              const [v1, v2] = edges[e];
              rotate3D(innerVerts[v1][0], innerVerts[v1][1], innerVerts[v1][2], rx + 0.4, ry + 0.4, rz);
              ctx.moveTo(rotBuf.x, rotBuf.y);
              rotate3D(innerVerts[v2][0], innerVerts[v2][1], innerVerts[v2][2], rx + 0.4, ry + 0.4, rz);
              ctx.lineTo(rotBuf.x, rotBuf.y);
            }
            ctx.stroke();
          }

          // If cage wire: glowing vertex corner nodes
          if (obj.archetype === 'cube_wire') {
            ctx.fillStyle = colors.highlight;
            for (let v = 0; v < verts.length; v++) {
              rotate3D(verts[v][0], verts[v][1], verts[v][2], rx, ry, rz);
              ctx.beginPath();
              ctx.arc(rotBuf.x, rotBuf.y, 1.8, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // ---------------------------------------------------------------------
        // 5. GEOMETRIC POLYHEDRA & SOLIDS (Sphere, Octahedron, Dodecahedron, Pyramids, Prisms, Cylinder, Cone)
        // ---------------------------------------------------------------------
        else if (obj.archetype === 'sphere') {
          const r = obj.baseSize * obj.projScale * 0.45;
          ctx.strokeStyle = colors.stroke;
          ctx.lineWidth = 1.0;

          // Main silhouette
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.stroke();

          // Horizontal equator ellipse
          ctx.beginPath();
          rotate3D(0, 0, 0, rx, ry, rz);
          ctx.ellipse(0, 0, r, r * Math.abs(Math.cos(rx)), rz, 0, Math.PI * 2);
          ctx.strokeStyle = colors.fill;
          ctx.stroke();

          // Vertical meridian ellipse
          if (currentTier !== 'ULTRA_LOW') {
            ctx.beginPath();
            ctx.ellipse(0, 0, r * Math.abs(Math.cos(ry)), r, rz, 0, Math.PI * 2);
            ctx.stroke();
          }
        }

        else if (obj.archetype === 'octahedron') {
          const s = obj.baseSize * obj.projScale * 0.50;
          const verts = [
            [0, -s * 1.2, 0], [0, s * 1.2, 0],
            [-s, 0, -s], [s, 0, -s], [s, 0, s], [-s, 0, s]
          ];
          const edges = [
            [0,2],[0,3],[0,4],[0,5],
            [1,2],[1,3],[1,4],[1,5],
            [2,3],[3,4],[4,5],[5,2]
          ];

          ctx.strokeStyle = colors.stroke;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          for (let e = 0; e < edges.length; e++) {
            const [v1, v2] = edges[e];
            rotate3D(verts[v1][0], verts[v1][1], verts[v1][2], rx, ry, rz);
            ctx.moveTo(rotBuf.x, rotBuf.y);
            rotate3D(verts[v2][0], verts[v2][1], verts[v2][2], rx, ry, rz);
            ctx.lineTo(rotBuf.x, rotBuf.y);
          }
          ctx.stroke();
        }

        else if (obj.archetype === 'dodecahedron') {
          // 12-sided faceted geometric polyhedron
          const s = obj.baseSize * obj.projScale * 0.42;
          const phi = (1 + Math.sqrt(5)) / 2;
          const a = s / phi;
          const b = s * phi;
          const verts = [
            [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
            [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s],
            [0, -a, -b], [0, a, -b], [0, -a, b], [0, a, b],
            [-a, -b, 0], [a, -b, 0], [-a, b, 0], [a, b, 0],
            [-b, 0, -a], [b, 0, -a], [-b, 0, a], [b, 0, a]
          ];
          const edges = [
            [0,8],[8,1],[1,17],[17,2],[2,9],[9,0],
            [4,10],[10,5],[5,19],[19,6],[6,11],[11,4],
            [12,13],[14,15],[16,18],[17,19]
          ];

          ctx.strokeStyle = colors.stroke;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          for (let e = 0; e < edges.length; e++) {
            const [v1, v2] = edges[e];
            rotate3D(verts[v1][0], verts[v1][1], verts[v1][2], rx, ry, rz);
            ctx.moveTo(rotBuf.x, rotBuf.y);
            rotate3D(verts[v2][0], verts[v2][1], verts[v2][2], rx, ry, rz);
            ctx.lineTo(rotBuf.x, rotBuf.y);
          }
          ctx.stroke();
        }

        else if (obj.archetype === 'pyramid') {
          const s = obj.baseSize * obj.projScale * 0.55;
          const verts = [
            [0, -s * 1.1, 0],
            [-s, s * 0.8, -s * 0.7],
            [s, s * 0.8, -s * 0.7],
            [0, s * 0.8, s * 0.9],
          ];
          const edges = [
            [0,1],[0,2],[0,3],[1,2],[2,3],[3,1]
          ];

          ctx.strokeStyle = colors.stroke;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          for (let e = 0; e < edges.length; e++) {
            const [v1, v2] = edges[e];
            rotate3D(verts[v1][0], verts[v1][1], verts[v1][2], rx, ry, rz);
            ctx.moveTo(rotBuf.x, rotBuf.y);
            rotate3D(verts[v2][0], verts[v2][1], verts[v2][2], rx, ry, rz);
            ctx.lineTo(rotBuf.x, rotBuf.y);
          }
          ctx.stroke();
        }

        else if (obj.archetype === 'pyramid_truncated') {
          // Truncated Pyramid Obelisk
          const sBottom = obj.baseSize * obj.projScale * 0.50;
          const sTop = sBottom * 0.45;
          const h = sBottom * 1.0;
          const verts = [
            [-sTop, -h, -sTop], [sTop, -h, -sTop], [sTop, -h, sTop], [-sTop, -h, sTop],
            [-sBottom, h, -sBottom], [sBottom, h, -sBottom], [sBottom, h, sBottom], [-sBottom, h, sBottom],
          ];
          const edges = [
            [0,1],[1,2],[2,3],[3,0],
            [4,5],[5,6],[6,7],[7,4],
            [0,4],[1,5],[2,6],[3,7]
          ];

          ctx.strokeStyle = colors.stroke;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          for (let e = 0; e < edges.length; e++) {
            const [v1, v2] = edges[e];
            rotate3D(verts[v1][0], verts[v1][1], verts[v1][2], rx, ry, rz);
            ctx.moveTo(rotBuf.x, rotBuf.y);
            rotate3D(verts[v2][0], verts[v2][1], verts[v2][2], rx, ry, rz);
            ctx.lineTo(rotBuf.x, rotBuf.y);
          }
          ctx.stroke();
        }

        else if (obj.archetype === 'prism_hex') {
          const r = obj.baseSize * obj.projScale * 0.45;
          const h = r * 1.1;
          const topVerts: Point3D[] = [];
          const botVerts: Point3D[] = [];
          for (let k = 0; k < 6; k++) {
            const angle = (k / 6) * Math.PI * 2;
            topVerts.push({ x: Math.cos(angle) * r, y: -h, z: Math.sin(angle) * r });
            botVerts.push({ x: Math.cos(angle) * r, y: h, z: Math.sin(angle) * r });
          }

          ctx.strokeStyle = colors.stroke;
          ctx.lineWidth = 1.1;

          // Top hexagon
          ctx.beginPath();
          for (let k = 0; k < 6; k++) {
            rotate3D(topVerts[k].x, topVerts[k].y, topVerts[k].z, rx, ry, rz);
            if (k === 0) ctx.moveTo(rotBuf.x, rotBuf.y);
            else ctx.lineTo(rotBuf.x, rotBuf.y);
          }
          ctx.closePath();
          ctx.stroke();

          // Bottom hexagon
          ctx.beginPath();
          for (let k = 0; k < 6; k++) {
            rotate3D(botVerts[k].x, botVerts[k].y, botVerts[k].z, rx, ry, rz);
            if (k === 0) ctx.moveTo(rotBuf.x, rotBuf.y);
            else ctx.lineTo(rotBuf.x, rotBuf.y);
          }
          ctx.closePath();
          ctx.stroke();

          // Pillars
          ctx.beginPath();
          for (let k = 0; k < 6; k++) {
            rotate3D(topVerts[k].x, topVerts[k].y, topVerts[k].z, rx, ry, rz);
            ctx.moveTo(rotBuf.x, rotBuf.y);
            rotate3D(botVerts[k].x, botVerts[k].y, botVerts[k].z, rx, ry, rz);
            ctx.lineTo(rotBuf.x, rotBuf.y);
          }
          ctx.stroke();
        }

        else if (obj.archetype === 'prism_tri') {
          const s = obj.baseSize * obj.projScale * 0.48;
          const h = s * 0.9;
          const verts = [
            [-s, -h, -s * 0.6], [s, -h, -s * 0.6], [0, -h, s],
            [-s, h, -s * 0.6], [s, h, -s * 0.6], [0, h, s],
          ];
          const edges = [
            [0,1],[1,2],[2,0],
            [3,4],[4,5],[5,3],
            [0,3],[1,4],[2,5]
          ];

          ctx.strokeStyle = colors.stroke;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          for (let e = 0; e < edges.length; e++) {
            const [v1, v2] = edges[e];
            rotate3D(verts[v1][0], verts[v1][1], verts[v1][2], rx, ry, rz);
            ctx.moveTo(rotBuf.x, rotBuf.y);
            rotate3D(verts[v2][0], verts[v2][1], verts[v2][2], rx, ry, rz);
            ctx.lineTo(rotBuf.x, rotBuf.y);
          }
          ctx.stroke();
        }

        else if (obj.archetype === 'cylinder') {
          const r = obj.baseSize * obj.projScale * 0.35;
          const h = r * 1.4;
          ctx.strokeStyle = colors.stroke;
          ctx.lineWidth = 1.1;

          // Top ellipse
          ctx.beginPath();
          rotate3D(0, -h, 0, rx, ry, rz);
          ctx.ellipse(rotBuf.x, rotBuf.y, r, r * Math.abs(Math.cos(rx)), rz, 0, Math.PI * 2);
          ctx.stroke();

          // Bottom ellipse
          ctx.beginPath();
          rotate3D(0, h, 0, rx, ry, rz);
          ctx.ellipse(rotBuf.x, rotBuf.y, r, r * Math.abs(Math.cos(rx)), rz, 0, Math.PI * 2);
          ctx.stroke();

          // Vertical side edges
          ctx.beginPath();
          rotate3D(-r, -h, 0, rx, ry, rz);
          ctx.moveTo(rotBuf.x, rotBuf.y);
          rotate3D(-r, h, 0, rx, ry, rz);
          ctx.lineTo(rotBuf.x, rotBuf.y);

          rotate3D(r, -h, 0, rx, ry, rz);
          ctx.moveTo(rotBuf.x, rotBuf.y);
          rotate3D(r, h, 0, rx, ry, rz);
          ctx.lineTo(rotBuf.x, rotBuf.y);
          ctx.stroke();
        }

        else if (obj.archetype === 'cone') {
          const r = obj.baseSize * obj.projScale * 0.40;
          const h = r * 1.5;
          ctx.strokeStyle = colors.stroke;
          ctx.lineWidth = 1.1;

          // Base ellipse
          ctx.beginPath();
          rotate3D(0, h * 0.5, 0, rx, ry, rz);
          ctx.ellipse(rotBuf.x, rotBuf.y, r, r * Math.abs(Math.cos(rx)), rz, 0, Math.PI * 2);
          ctx.stroke();

          // Apex to base sides
          rotate3D(0, -h * 0.8, 0, rx, ry, rz);
          const apexX = rotBuf.x;
          const apexY = rotBuf.y;

          ctx.beginPath();
          rotate3D(-r, h * 0.5, 0, rx, ry, rz);
          ctx.moveTo(apexX, apexY);
          ctx.lineTo(rotBuf.x, rotBuf.y);

          rotate3D(r, h * 0.5, 0, rx, ry, rz);
          ctx.moveTo(apexX, apexY);
          ctx.lineTo(rotBuf.x, rotBuf.y);
          ctx.stroke();
        }

        // ---------------------------------------------------------------------
        // 6. MATHEMATICAL CURVES & 3D GRAPHS (Parabola, Sine/Cosine, Axes, Vectors, Spiral, Grid)
        // ---------------------------------------------------------------------
        else if (obj.archetype === 'parabola') {
          const s = obj.baseSize * obj.projScale;
          ctx.strokeStyle = colors.stroke;
          ctx.lineWidth = 1.15;
          ctx.beginPath();

          const step = currentTier === 'ULTRA_LOW' || currentTier === 'LOW' ? 8 : 4;
          for (let px = -36; px <= 40; px += step) {
            const py = (0.024 * px * px - 18) * (s / 32);
            rotate3D(px * (s / 32), py, 0, rx, ry, rz);
            if (px === -36) ctx.moveTo(rotBuf.x, rotBuf.y);
            else ctx.lineTo(rotBuf.x, rotBuf.y);
          }
          ctx.stroke();

          if (currentTier !== 'ULTRA_LOW') {
            ctx.strokeStyle = colors.fill;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            rotate3D(-44 * (s / 32), 0, 0, rx, ry, rz);
            ctx.moveTo(rotBuf.x, rotBuf.y);
            rotate3D(44 * (s / 32), 0, 0, rx, ry, rz);
            ctx.lineTo(rotBuf.x, rotBuf.y);
            rotate3D(0, 22 * (s / 32), 0, rx, ry, rz);
            ctx.moveTo(rotBuf.x, rotBuf.y);
            rotate3D(0, -28 * (s / 32), 0, rx, ry, rz);
            ctx.lineTo(rotBuf.x, rotBuf.y);
            ctx.stroke();
          }

          ctx.font = `bold ${Math.max(7, Math.floor(9 * obj.projScale))}px monospace`;
          ctx.fillStyle = colors.highlight;
          ctx.fillText('y = x²', 0, s * 0.7);
        }

        else if (obj.archetype === 'sinewave' || obj.archetype === 'cosinewave') {
          const s = obj.baseSize * obj.projScale;
          const isCos = obj.archetype === 'cosinewave';
          ctx.strokeStyle = colors.stroke;
          ctx.lineWidth = 1.15;
          ctx.beginPath();

          const step = currentTier === 'ULTRA_LOW' || currentTier === 'LOW' ? 8 : 4;
          for (let px = -44; px <= 44; px += step) {
            const py = (isCos ? Math.cos(px * 0.10) : Math.sin(px * 0.10)) * 16 * (s / 34);
            rotate3D(px * (s / 34), py, 0, rx, ry, rz);
            if (px === -44) ctx.moveTo(rotBuf.x, rotBuf.y);
            else ctx.lineTo(rotBuf.x, rotBuf.y);
          }
          ctx.stroke();

          ctx.font = `bold ${Math.max(7, Math.floor(9 * obj.projScale))}px monospace`;
          ctx.fillStyle = colors.highlight;
          ctx.fillText(isCos ? 'y = cos(x)' : 'y = sin(x)', 0, s * 0.7);
        }

        else if (obj.archetype === 'coord_axes') {
          // 3D Coordinate Tripod X, Y, Z with Arrows
          const s = obj.baseSize * obj.projScale * 0.8;
          ctx.lineWidth = 1.2;

          // X axis (Warm gold)
          ctx.strokeStyle = colors.highlight;
          ctx.beginPath();
          rotate3D(0, 0, 0, rx, ry, rz);
          ctx.moveTo(rotBuf.x, rotBuf.y);
          rotate3D(s, 0, 0, rx, ry, rz);
          ctx.lineTo(rotBuf.x, rotBuf.y);
          ctx.stroke();

          // Y axis (Stroke)
          ctx.strokeStyle = colors.stroke;
          ctx.beginPath();
          rotate3D(0, 0, 0, rx, ry, rz);
          ctx.moveTo(rotBuf.x, rotBuf.y);
          rotate3D(0, -s, 0, rx, ry, rz);
          ctx.lineTo(rotBuf.x, rotBuf.y);
          ctx.stroke();

          // Z axis (Fill)
          ctx.strokeStyle = colors.fill;
          ctx.beginPath();
          rotate3D(0, 0, 0, rx, ry, rz);
          ctx.moveTo(rotBuf.x, rotBuf.y);
          rotate3D(0, 0, s, rx, ry, rz);
          ctx.lineTo(rotBuf.x, rotBuf.y);
          ctx.stroke();

          // Labels
          ctx.font = `bold ${Math.max(6, Math.floor(7 * obj.projScale))}px monospace`;
          ctx.fillStyle = colors.highlight;
          rotate3D(s * 1.15, 0, 0, rx, ry, rz);
          ctx.fillText('X', rotBuf.x, rotBuf.y);
          rotate3D(0, -s * 1.15, 0, rx, ry, rz);
          ctx.fillText('Y', rotBuf.x, rotBuf.y);
        }

        else if (obj.archetype === 'vector_field') {
          // Clustered 3D Vector Arrows indicating velocity gradient
          const s = obj.baseSize * obj.projScale * 0.50;
          ctx.strokeStyle = colors.stroke;
          ctx.lineWidth = 1.1;

          const arrows = [
            [-s * 0.6, -s * 0.4, -s * 0.2],
            [0, 0, 0],
            [s * 0.6, s * 0.4, s * 0.2]
          ];
          for (let a = 0; a < arrows.length; a++) {
            const [ax, ay, az] = arrows[a];
            rotate3D(ax, ay, az, rx, ry, rz);
            const x0 = rotBuf.x;
            const y0 = rotBuf.y;
            rotate3D(ax + s * 0.45, ay - s * 0.35, az + s * 0.25, rx, ry, rz);
            const x1 = rotBuf.x;
            const y1 = rotBuf.y;

            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();

            // Arrowhead tip
            ctx.fillStyle = colors.highlight;
            ctx.beginPath();
            ctx.arc(x1, y1, 1.6, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        else if (obj.archetype === 'spiral_helix') {
          const s = obj.baseSize * obj.projScale;
          ctx.strokeStyle = colors.stroke;
          ctx.lineWidth = 1.1;
          ctx.beginPath();

          const turns = currentTier === 'ULTRA_LOW' ? 12 : 22;
          for (let step = 0; step <= turns; step++) {
            const theta = (step / turns) * Math.PI * 4;
            const r = (step / turns) * 20 * (s / 24);
            const px = Math.cos(theta) * r;
            const py = Math.sin(theta) * r;
            const pz = ((step / turns) - 0.5) * 24 * (s / 24);
            rotate3D(px, py, pz, rx, ry, rz);
            if (step === 0) ctx.moveTo(rotBuf.x, rotBuf.y);
            else ctx.lineTo(rotBuf.x, rotBuf.y);
          }
          ctx.stroke();
        }

        else if (obj.archetype === 'grid3d') {
          const s = obj.baseSize * obj.projScale * 0.55;
          ctx.strokeStyle = colors.fill;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          for (let l = -s; l <= s; l += s / 2) {
            rotate3D(-s, l, 0, rx, ry, rz);
            ctx.moveTo(rotBuf.x, rotBuf.y);
            rotate3D(s, l, 0, rx, ry, rz);
            ctx.lineTo(rotBuf.x, rotBuf.y);

            rotate3D(l, -s, 0, rx, ry, rz);
            ctx.moveTo(rotBuf.x, rotBuf.y);
            rotate3D(l, s, 0, rx, ry, rz);
            ctx.lineTo(rotBuf.x, rotBuf.y);
          }
          ctx.stroke();
        }

        // ---------------------------------------------------------------------
        // 7. MATHEMATICAL & EDUCATIONAL SYMBOLS (π, ∑, √x, ∞, a²+b²=c², ∫, LEARN, THINK, A, B, C)
        // ---------------------------------------------------------------------
        else if (obj.text || obj.formula) {
          const s = obj.baseSize * obj.projScale;
          const displayTxt = obj.text || obj.formula || '';
          const isSingle = displayTxt.length <= 2;
          ctx.font = `bold ${Math.max(10, Math.floor(s * (isSingle ? 1.4 : 1.0)))}px -apple-system, sans-serif`;
          ctx.fillStyle = colors.stroke;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          rotate3D(0, 0, 0, rx, ry, rz);
          ctx.fillText(displayTxt, rotBuf.x, rotBuf.y);

          // Subtle glowing accent underlay for single symbols
          if (isSingle && currentTier !== 'ULTRA_LOW') {
            ctx.fillStyle = colors.highlight;
            ctx.fillText(displayTxt, rotBuf.x + 0.5, rotBuf.y + 0.5);
          }
        }

        ctx.restore();
      }

      // -----------------------------------------------------------------------
      // ATMOSPHERIC DUST PARTICLES (Tier Optimized)
      // -----------------------------------------------------------------------
      if (dustCount > 0) {
        ctx.fillStyle = `rgba(255, 238, 195, ${0.45 * revealProgress})`;
        for (let i = 0; i < dustCount; i++) {
          const d = dustParticles[i];
          d.x += d.vx;
          d.y += d.vy;
          d.phase += d.pulseSpeed;

          if (d.y < -height * 0.1) d.y = height * 1.1;
          if (d.x < -width * 0.1) d.x = width * 1.1;
          if (d.x > width * 1.1) d.x = -width * 0.1;

          const alpha = d.baseAlpha * (0.65 + Math.sin(d.phase) * 0.35);
          ctx.globalAlpha = alpha * revealProgress;
          ctx.drawImage(
            spriteDust,
            d.x - d.size / 2,
            d.y - d.size / 2,
            d.size * 2,
            d.size * 2
          );
        }
        ctx.globalAlpha = 1.0;
      }

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
      setSelectionShield(false);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden z-0 select-none ${className}`}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      aria-hidden="true"
    >
      {/* 
        Layer 1 Base Colors: Deep Black, Dark Burgundy & Subtle Warm Wine
        #050304 -> #0D0508 -> #16070B -> #220A0F
      */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050304] via-[#0D0508] to-[#050304] opacity-98" />
      <div className="absolute top-0 right-0 w-[58vw] h-[58vw] rounded-full bg-radial from-[#220A0F]/35 via-[#16070B]/15 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[48vw] h-[48vw] rounded-full bg-radial from-[#D9A83F]/06 via-[#16070B]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Global Zero-Lag High-Performance 60FPS 3D Universe Canvas */}
      <canvas
        ref={canvasRef}
        className="lumos-3d-canvas absolute inset-0 w-full h-full block select-none pointer-events-none"
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      />
    </div>
  );
};
