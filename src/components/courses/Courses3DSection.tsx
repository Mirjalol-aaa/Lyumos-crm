import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  BookOpen,
  Clock,
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Award,
  Layers,
  GraduationCap,
  RotateCw,
} from 'lucide-react';
import { Course } from '../../types/admin';
import { INITIAL_COURSES } from '../../data/coursesData';
import { useI18n } from '../../lib/i18n';

interface Courses3DSectionProps {
  onOpenDetails: (course: Course) => void;
  onOpenRegister: (courseTitle: string) => void;
  onOpenDiagnostic?: () => void;
}

type CourseVisualTheme = 'math' | 'english' | 'it' | 'academic';

interface SatelliteObject3D {
  id: string;
  type: 'ring' | 'parabola' | 'sinewave' | 'knot' | 'helix' | 'axes' | 'formula' | 'letter' | 'word' | 'code' | 'star';
  label?: string;
  // 3D Orbital Coordinates
  orbitLayer: 'inner' | 'middle' | 'outer';
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
  orbitInclination: number; // orbital tilt in radians
  orbitEccentricity: number; // 1 = circle, 0.7 = ellipse
  // Local Coordinates
  x: number;
  y: number;
  z: number;
  // Local Rotations
  rotX: number;
  rotY: number;
  rotZ: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  // Physics & Grab State
  isHovered: boolean;
  isGrabbed: boolean;
  spinVx: number;
  spinVy: number;
  size: number;
  baseOpacity: number;
  // Cached Screen Coordinates for Hit-Testing
  projX: number;
  projY: number;
  projScale: number;
  projZ: number;
}

export const Courses3DSection: React.FC<Courses3DSectionProps> = ({
  onOpenDetails,
  onOpenRegister,
  onOpenDiagnostic,
}) => {
  const { formatMoney } = useI18n();

  // Active course state
  const [activeCourseId, setActiveCourseId] = useState<string>(INITIAL_COURSES[0].id);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const activeCourse = useMemo(() => {
    return (
      INITIAL_COURSES.find((c) => c.id === activeCourseId) ||
      INITIAL_COURSES[0]
    );
  }, [activeCourseId]);

  const activeIndex = useMemo(() => {
    return INITIAL_COURSES.findIndex((c) => c.id === activeCourse.id);
  }, [activeCourse]);

  // Determine Course Theme for 3D Scent and Objects
  const theme: CourseVisualTheme = useMemo(() => {
    const title = activeCourse.title.toLowerCase();
    const cat = (activeCourse.category || '').toLowerCase();
    if (cat.includes('it') || title.includes('frontend') || title.includes('dastur')) return 'it';
    if (title.includes('ielts') || cat.includes('til') || title.includes('ingliz')) return 'english';
    if (title.includes('prezident') || title.includes('abituriyent') || title.includes('dtm')) return 'academic';
    return 'math';
  }, [activeCourse]);

  const handleSelectCourse = (course: Course) => {
    if (course.id === activeCourse.id) return;
    setIsTransitioning(true);
    setActiveCourseId(course.id);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 400);
  };

  const handlePrev = () => {
    const nextIdx = (activeIndex - 1 + INITIAL_COURSES.length) % INITIAL_COURSES.length;
    handleSelectCourse(INITIAL_COURSES[nextIdx]);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % INITIAL_COURSES.length;
    handleSelectCourse(INITIAL_COURSES[nextIdx]);
  };

  // ---------------------------------------------------------------------------
  // 3D CANVAS & UNIFIED PHYSICS ENGINE (Anchored 360° Book + Orbiting Ecosystem)
  // ---------------------------------------------------------------------------
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Book 360° Physics State
  const bookPhysicsRef = useRef({
    // Angles in radians (full 360° freedom)
    rotX: -0.22,
    rotY: 0.42,
    rotZ: -0.06,
    // Velocities
    angVx: 0,
    angVy: 0,
    // Pointer sampling for realistic momentum
    isDragging: false,
    lastPointerX: 0,
    lastPointerY: 0,
    lastTime: 0,
    samples: [] as { x: number; y: number; time: number }[],
    // Hover State
    isHovered: false,
  });

  // Active Dragged Target ('book' | satelliteId | null)
  const activeGrabTargetRef = useRef<string | null>(null);

  // Satellites State Ref
  const satellitesRef = useRef<SatelliteObject3D[]>([]);

  // Build Ecosystem Satellites based on Theme
  useEffect(() => {
    const list: SatelliteObject3D[] = [];

    if (theme === 'math') {
      // 1. Inner Orbit: Formulas & Rings (Fast, Close)
      list.push({
        id: 'math-pi',
        type: 'formula',
        label: 'π',
        orbitLayer: 'inner',
        orbitRadius: 145,
        orbitSpeed: 0.0014,
        orbitPhase: 0.2,
        orbitInclination: 0.25,
        orbitEccentricity: 0.95,
        x: 0, y: 0, z: 0,
        rotX: 0, rotY: 0, rotZ: 0,
        rotSpeedX: 0.001, rotSpeedY: 0.0015, rotSpeedZ: 0.0005,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 16, baseOpacity: 0.85,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });
      list.push({
        id: 'math-sqrt',
        type: 'formula',
        label: '√x',
        orbitLayer: 'inner',
        orbitRadius: 155,
        orbitSpeed: -0.0012,
        orbitPhase: 2.1,
        orbitInclination: -0.35,
        orbitEccentricity: 0.92,
        x: 0, y: 0, z: 0,
        rotX: 0, rotY: 0, rotZ: 0,
        rotSpeedX: -0.001, rotSpeedY: 0.001, rotSpeedZ: 0.0008,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 13, baseOpacity: 0.80,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });
      list.push({
        id: 'math-sum',
        type: 'formula',
        label: '∑',
        orbitLayer: 'inner',
        orbitRadius: 150,
        orbitSpeed: 0.0013,
        orbitPhase: 4.2,
        orbitInclination: 0.15,
        orbitEccentricity: 0.96,
        x: 0, y: 0, z: 0,
        rotX: 0, rotY: 0, rotZ: 0,
        rotSpeedX: 0.0008, rotSpeedY: -0.0012, rotSpeedZ: 0.0006,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 15, baseOpacity: 0.85,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });

      // 2. Middle Orbit: Parabola, Sine Wave, Coordinate Tripod, Ring
      list.push({
        id: 'math-parabola',
        type: 'parabola',
        label: 'y = x²',
        orbitLayer: 'middle',
        orbitRadius: 215,
        orbitSpeed: 0.0009,
        orbitPhase: 1.2,
        orbitInclination: 0.40,
        orbitEccentricity: 0.88,
        x: 0, y: 0, z: 0,
        rotX: 0.3, rotY: 0.4, rotZ: 0,
        rotSpeedX: 0.0006, rotSpeedY: 0.0009, rotSpeedZ: 0.0003,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 26, baseOpacity: 0.75,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });
      list.push({
        id: 'math-sinewave',
        type: 'sinewave',
        label: 'y = sin(x)',
        orbitLayer: 'middle',
        orbitRadius: 225,
        orbitSpeed: -0.0008,
        orbitPhase: 3.5,
        orbitInclination: -0.28,
        orbitEccentricity: 0.90,
        x: 0, y: 0, z: 0,
        rotX: -0.2, rotY: 0.6, rotZ: 0.1,
        rotSpeedX: -0.0005, rotSpeedY: 0.0007, rotSpeedZ: 0.0004,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 28, baseOpacity: 0.75,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });
      list.push({
        id: 'math-axes',
        type: 'axes',
        label: 'XYZ',
        orbitLayer: 'middle',
        orbitRadius: 205,
        orbitSpeed: 0.0007,
        orbitPhase: 5.4,
        orbitInclination: 0.55,
        orbitEccentricity: 0.85,
        x: 0, y: 0, z: 0,
        rotX: 0.4, rotY: 0.2, rotZ: -0.3,
        rotSpeedX: 0.0007, rotSpeedY: 0.0005, rotSpeedZ: 0.0004,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 22, baseOpacity: 0.80,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });
      list.push({
        id: 'math-ring',
        type: 'ring',
        orbitLayer: 'middle',
        orbitRadius: 235,
        orbitSpeed: 0.0010,
        orbitPhase: 0.8,
        orbitInclination: -0.45,
        orbitEccentricity: 0.92,
        x: 0, y: 0, z: 0,
        rotX: 0.6, rotY: 0.3, rotZ: 0,
        rotSpeedX: 0.0009, rotSpeedY: 0.0008, rotSpeedZ: 0.0005,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 25, baseOpacity: 0.70,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });

      // 3. Outer Orbit: Trefoil Knot, Helix Spiral (Slow, Architectural)
      list.push({
        id: 'math-knot',
        type: 'knot',
        orbitLayer: 'outer',
        orbitRadius: 280,
        orbitSpeed: 0.0005,
        orbitPhase: 2.8,
        orbitInclination: 0.32,
        orbitEccentricity: 0.84,
        x: 0, y: 0, z: 0,
        rotX: 0.2, rotY: 0.8, rotZ: 0.4,
        rotSpeedX: 0.0004, rotSpeedY: 0.0006, rotSpeedZ: 0.0002,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 24, baseOpacity: 0.65,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });
      list.push({
        id: 'math-helix',
        type: 'helix',
        orbitLayer: 'outer',
        orbitRadius: 290,
        orbitSpeed: -0.0006,
        orbitPhase: 4.8,
        orbitInclination: -0.38,
        orbitEccentricity: 0.86,
        x: 0, y: 0, z: 0,
        rotX: -0.4, rotY: 0.5, rotZ: 0.2,
        rotSpeedX: 0.0005, rotSpeedY: 0.0007, rotSpeedZ: 0.0003,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 26, baseOpacity: 0.65,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });
    } else if (theme === 'english') {
      // English Ecosystem: 3D Typography Letters & Words
      const engItems = [
        { label: 'A', layer: 'inner' as const, r: 145, speed: 0.0015, phase: 0.3, inc: 0.2 },
        { label: 'B', layer: 'inner' as const, r: 155, speed: -0.0013, phase: 2.2, inc: -0.3 },
        { label: 'C', layer: 'inner' as const, r: 150, speed: 0.0014, phase: 4.1, inc: 0.25 },
        { label: 'LEARN', layer: 'middle' as const, r: 215, speed: 0.0009, phase: 1.0, inc: 0.35 },
        { label: 'SPEAK', layer: 'middle' as const, r: 230, speed: -0.0008, phase: 3.2, inc: -0.4 },
        { label: 'THINK', layer: 'middle' as const, r: 220, speed: 0.0008, phase: 5.2, inc: 0.3 },
        { label: 'GROW', layer: 'outer' as const, r: 285, speed: 0.0005, phase: 2.5, inc: 0.28 },
        { label: 'ENGLISH', layer: 'outer' as const, r: 295, speed: -0.0005, phase: 4.9, inc: -0.32 },
      ];

      engItems.forEach((it, idx) => {
        list.push({
          id: `eng-${idx}`,
          type: it.label.length <= 2 ? 'letter' : 'word',
          label: it.label,
          orbitLayer: it.layer,
          orbitRadius: it.r,
          orbitSpeed: it.speed,
          orbitPhase: it.phase,
          orbitInclination: it.inc,
          orbitEccentricity: 0.9,
          x: 0, y: 0, z: 0,
          rotX: 0, rotY: 0, rotZ: 0,
          rotSpeedX: 0.0008, rotSpeedY: 0.001, rotSpeedZ: 0.0004,
          isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
          size: it.label.length <= 2 ? 16 : 12,
          baseOpacity: it.label.length <= 2 ? 0.85 : 0.70,
          projX: 0, projY: 0, projScale: 1, projZ: 0,
        });
      });
    } else if (theme === 'it') {
      // IT Ecosystem: Code constructs, brackets, binary
      const itItems = [
        { label: '<dev/>', layer: 'inner' as const, r: 145, speed: 0.0014, phase: 0.5, inc: 0.25 },
        { label: '{ }', layer: 'inner' as const, r: 155, speed: -0.0012, phase: 2.6, inc: -0.3 },
        { label: '01', layer: 'inner' as const, r: 150, speed: 0.0013, phase: 4.5, inc: 0.2 },
        { label: 'git', layer: 'middle' as const, r: 215, speed: 0.0009, phase: 1.4, inc: 0.35 },
        { label: '=>', layer: 'middle' as const, r: 225, speed: -0.0008, phase: 3.6, inc: -0.4 },
        { label: 'React', layer: 'outer' as const, r: 285, speed: 0.0005, phase: 2.1, inc: 0.3 },
        { label: 'Code', layer: 'outer' as const, r: 295, speed: -0.0005, phase: 5.0, inc: -0.32 },
      ];

      itItems.forEach((it, idx) => {
        list.push({
          id: `it-${idx}`,
          type: 'code',
          label: it.label,
          orbitLayer: it.layer,
          orbitRadius: it.r,
          orbitSpeed: it.speed,
          orbitPhase: it.phase,
          orbitInclination: it.inc,
          orbitEccentricity: 0.9,
          x: 0, y: 0, z: 0,
          rotX: 0, rotY: 0, rotZ: 0,
          rotSpeedX: 0.0008, rotSpeedY: 0.001, rotSpeedZ: 0.0004,
          isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
          size: 13,
          baseOpacity: 0.75,
          projX: 0, projY: 0, projScale: 1, projZ: 0,
        });
      });
    } else {
      // Academic / Honors Ecosystem
      const acadItems = [
        { label: '189+', layer: 'inner' as const, r: 145, speed: 0.0014, phase: 0.4, inc: 0.25 },
        { label: '★', layer: 'inner' as const, r: 155, speed: -0.0013, phase: 2.4, inc: -0.3 },
        { label: 'DTM', layer: 'middle' as const, r: 215, speed: 0.0009, phase: 1.2, inc: 0.38 },
        { label: 'GRANT', layer: 'middle' as const, r: 225, speed: -0.0008, phase: 3.5, inc: -0.35 },
        { label: 'IQ', layer: 'outer' as const, r: 285, speed: 0.0006, phase: 2.0, inc: 0.3 },
        { label: 'TOP', layer: 'outer' as const, r: 295, speed: -0.0005, phase: 4.8, inc: -0.28 },
      ];

      acadItems.forEach((it, idx) => {
        list.push({
          id: `acad-${idx}`,
          type: 'star',
          label: it.label,
          orbitLayer: it.layer,
          orbitRadius: it.r,
          orbitSpeed: it.speed,
          orbitPhase: it.phase,
          orbitInclination: it.inc,
          orbitEccentricity: 0.9,
          x: 0, y: 0, z: 0,
          rotX: 0, rotY: 0, rotZ: 0,
          rotSpeedX: 0.0008, rotSpeedY: 0.001, rotSpeedZ: 0.0004,
          isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
          size: 14,
          baseOpacity: 0.80,
          projX: 0, projY: 0, projScale: 1, projZ: 0,
        });
      });
    }

    satellitesRef.current = list;
  }, [theme]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 600;
    let height = 600;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const updateSize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect && rect.width > 0) {
        width = rect.width;
        height = rect.height;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.scale(dpr, dpr);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });

    // Rotation projection buffer
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

    let lastTime = performance.now();
    let time = 0;

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;
      time += dt;

      const bookPhys = bookPhysicsRef.current;

      // 1. Damped Momentum Deceleration for Book
      if (!bookPhys.isDragging) {
        bookPhys.rotY += bookPhys.angVy;
        bookPhys.rotX += bookPhys.angVx;

        // Friction damping
        bookPhys.angVy *= 0.962;
        bookPhys.angVx *= 0.962;

        if (Math.abs(bookPhys.angVy) < 0.0001) bookPhys.angVy = 0;
        if (Math.abs(bookPhys.angVx) < 0.0001) bookPhys.angVx = 0;

        // Subtle autonomous breathing when stationary
        if (bookPhys.angVy === 0 && bookPhys.angVx === 0) {
          bookPhys.rotY += Math.cos(time * 0.4) * 0.0003;
          bookPhys.rotX += Math.sin(time * 0.5) * 0.0002;
        }
      }

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Natural vertical float
      const floatY = Math.sin(time * 1.3) * 6;

      // -----------------------------------------------------------------------
      // A. UPDATE ORBITS & INDIVIDUAL SATELLITE ROTATIONS
      // -----------------------------------------------------------------------
      const satellites = satellitesRef.current;
      for (let i = 0; i < satellites.length; i++) {
        const sat = satellites[i];

        // Orbit progression (paused only while user holds that specific satellite)
        if (!sat.isGrabbed) {
          sat.orbitPhase += sat.orbitSpeed;
          sat.rotX += sat.spinVx + sat.rotSpeedX;
          sat.rotY += sat.spinVy + sat.rotSpeedY;
          sat.rotZ += sat.rotSpeedZ;

          sat.spinVx *= 0.96;
          sat.spinVy *= 0.96;
        }

        // Calculate 3D position in inclined elliptical orbit plane
        const baseOrbX = Math.cos(sat.orbitPhase) * sat.orbitRadius;
        const baseOrbY = Math.sin(sat.orbitPhase) * sat.orbitRadius * sat.orbitEccentricity;
        const baseOrbZ = 0;

        // Apply orbital inclination
        const cosInc = Math.cos(sat.orbitInclination);
        const sinInc = Math.sin(sat.orbitInclination);
        const inclinedY = baseOrbY * cosInc - baseOrbZ * sinInc;
        const inclinedZ = baseOrbY * sinInc + baseOrbZ * cosInc;

        sat.x = baseOrbX;
        sat.y = inclinedY;
        sat.z = inclinedZ;

        // Projected coordinates
        const perspective = 520 / (520 + sat.z + 100);
        sat.projX = centerX + sat.x * perspective;
        sat.projY = centerY + sat.y * perspective + floatY * 0.4;
        sat.projScale = perspective;
        sat.projZ = sat.z;
      }

      // -----------------------------------------------------------------------
      // B. RENDER BACKGROUND SATELLITES (z < 0: Behind Book)
      // -----------------------------------------------------------------------
      for (let i = 0; i < satellites.length; i++) {
        const sat = satellites[i];
        if (sat.projZ < 10) {
          renderSatellite(ctx, sat);
        }
      }

      // -----------------------------------------------------------------------
      // C. RENDER 360° HERO 3D BOOK (Centerpiece)
      // -----------------------------------------------------------------------
      ctx.save();
      ctx.translate(centerX, centerY + floatY);

      // Scale based on screen size
      const isCompact = width < 460;
      const bw = isCompact ? 160 : 205;
      const bh = isCompact ? 220 : 275;
      const bThick = isCompact ? 32 : 42;

      const hw = bw / 2;
      const hh = bh / 2;
      const ht = bThick / 2;

      // Soft Depth Shadow
      const shadowGrad = ctx.createRadialGradient(0, hh + 48, 10, 0, hh + 48, hw * 1.6);
      shadowGrad.addColorStop(0, 'rgba(5, 3, 4, 0.78)');
      shadowGrad.addColorStop(0.5, 'rgba(5, 3, 4, 0.35)');
      shadowGrad.addColorStop(1, 'rgba(5, 3, 4, 0)');
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(0, hh + 48, hw * 1.35, 26, 0, 0, Math.PI * 2);
      ctx.fill();

      // Current Rotation Angles
      const rx = bookPhys.rotX;
      const ry = bookPhys.rotY;
      const rz = bookPhys.rotZ;

      // Vertices in local space:
      // Front cover: z = +ht (0: top-left, 1: top-right, 2: bottom-right, 3: bottom-left)
      // Back cover:  z = -ht (4: top-left, 5: top-right, 6: bottom-right, 7: bottom-left)
      const verts = [
        [-hw, -hh, ht], [hw, -hh, ht], [hw, hh, ht], [-hw, hh, ht],
        [-hw, -hh, -ht], [hw, -hh, -ht], [hw, hh, -ht], [-hw, hh, -ht],
      ];

      const proj = verts.map((v) => {
        rotate3D(v[0], v[1], v[2], rx, ry, rz);
        return { x: rotBuf.x, y: rotBuf.y, z: rotBuf.z };
      });

      // Shading Colors by Theme
      let coverTop = '#4A0E17';
      let coverBot = '#1A0408';
      let spineColor = '#6B1422';
      let bookTitle = 'MATEMATIKA';
      let subTitle = 'LUMOS ACADEMY';

      if (theme === 'english') {
        coverTop = '#141E2E';
        coverBot = '#0A0E17';
        spineColor = '#1F2E45';
        bookTitle = 'ENGLISH';
        subTitle = 'IELTS & GRAMMAR';
      } else if (theme === 'it') {
        coverTop = '#16241F';
        coverBot = '#0A120E';
        spineColor = '#223830';
        bookTitle = 'FRONTEND IT';
        subTitle = 'CODE & TECH';
      } else if (theme === 'academic') {
        coverTop = '#3C121D';
        coverBot = '#140509';
        spineColor = '#5A1A2B';
        bookTitle = 'DTM & GRANT';
        subTitle = 'AKADEMIK BLOK';
      }

      // Calculate Face Normal Z to determine front/back visibility (Backface Culling / Shading)
      // Normal of Front Cover (0 -> 1 x 0 -> 3)
      const fv01x = proj[1].x - proj[0].x;
      const fv01y = proj[1].y - proj[0].y;
      const fv03x = proj[3].x - proj[0].x;
      const fv03y = proj[3].y - proj[0].y;
      const frontNormalZ = fv01x * fv03y - fv01y * fv03x;

      // Normal of Spine (0 -> 4 x 0 -> 3)
      const sv04x = proj[4].x - proj[0].x;
      const sv04y = proj[4].y - proj[0].y;
      const spineNormalZ = sv04x * fv03y - sv04y * fv03x;

      // Normal of Pages Right (1 -> 5 x 1 -> 2)
      const pv15x = proj[5].x - proj[1].x;
      const pv15y = proj[5].y - proj[1].y;
      const pv12x = proj[2].x - proj[1].x;
      const pv12y = proj[2].y - proj[1].y;
      const pagesNormalZ = pv15x * pv12y - pv15y * pv12x;

      // Normal of Top (0 -> 1 x 0 -> 4)
      const topNormalZ = fv01x * sv04y - fv01y * sv04x;

      // Normal of Bottom (3 -> 2 x 3 -> 7)
      const bv32x = proj[2].x - proj[3].x;
      const bv32y = proj[2].y - proj[3].y;
      const bv37x = proj[7].x - proj[3].x;
      const bv37y = proj[7].y - proj[3].y;
      const bottomNormalZ = bv32x * bv37y - bv32y * bv37x;

      // 1. Draw Back Cover if facing camera (frontNormalZ < 0)
      if (frontNormalZ < 0) {
        ctx.beginPath();
        ctx.moveTo(proj[4].x, proj[4].y);
        ctx.lineTo(proj[5].x, proj[5].y);
        ctx.lineTo(proj[6].x, proj[6].y);
        ctx.lineTo(proj[7].x, proj[7].y);
        ctx.closePath();
        ctx.fillStyle = coverBot;
        ctx.fill();
        ctx.strokeStyle = '#D9A83F';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Embossed Back Seal
        const backMidX = (proj[4].x + proj[5].x + proj[6].x + proj[7].x) / 4;
        const backMidY = (proj[4].y + proj[5].y + proj[6].y + proj[7].y) / 4;
        ctx.save();
        ctx.translate(backMidX, backMidY);
        ctx.beginPath();
        ctx.arc(0, 0, 24, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(217, 168, 63, 0.5)';
        ctx.stroke();
        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = '#F3D276';
        ctx.textAlign = 'center';
        ctx.fillText('LUMOS', 0, 3);
        ctx.restore();
      }

      // 2. Draw Spine if visible
      if (spineNormalZ > 0) {
        ctx.beginPath();
        ctx.moveTo(proj[0].x, proj[0].y);
        ctx.lineTo(proj[4].x, proj[4].y);
        ctx.lineTo(proj[7].x, proj[7].y);
        ctx.lineTo(proj[3].x, proj[3].y);
        ctx.closePath();
        const spineGrad = ctx.createLinearGradient(proj[0].x, proj[0].y, proj[7].x, proj[7].y);
        spineGrad.addColorStop(0, spineColor);
        spineGrad.addColorStop(1, '#0C0305');
        ctx.fillStyle = spineGrad;
        ctx.fill();
        ctx.strokeStyle = '#F3D276';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Spine Gold Rib Lines
        ctx.strokeStyle = 'rgba(243, 210, 118, 0.6)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        const sTop1X = proj[0].x * 0.7 + proj[3].x * 0.3;
        const sTop1Y = proj[0].y * 0.7 + proj[3].y * 0.3;
        const sTop2X = proj[4].x * 0.7 + proj[7].x * 0.3;
        const sTop2Y = proj[4].y * 0.7 + proj[7].y * 0.3;
        ctx.moveTo(sTop1X, sTop1Y);
        ctx.lineTo(sTop2X, sTop2Y);

        const sBot1X = proj[0].x * 0.3 + proj[3].x * 0.7;
        const sBot1Y = proj[0].y * 0.3 + proj[3].y * 0.7;
        const sBot2X = proj[4].x * 0.3 + proj[7].x * 0.7;
        const sBot2Y = proj[4].y * 0.3 + proj[7].y * 0.7;
        ctx.moveTo(sBot1X, sBot1Y);
        ctx.lineTo(sBot2X, sBot2Y);
        ctx.stroke();
      }

      // 3. Draw Right Pages Block if visible
      if (pagesNormalZ > 0) {
        ctx.beginPath();
        ctx.moveTo(proj[1].x, proj[1].y);
        ctx.lineTo(proj[5].x, proj[5].y);
        ctx.lineTo(proj[6].x, proj[6].y);
        ctx.lineTo(proj[2].x, proj[2].y);
        ctx.closePath();
        const pageGrad = ctx.createLinearGradient(proj[1].x, proj[1].y, proj[6].x, proj[6].y);
        pageGrad.addColorStop(0, 'rgba(244, 238, 224, 0.98)');
        pageGrad.addColorStop(0.5, 'rgba(215, 204, 185, 0.92)');
        pageGrad.addColorStop(1, 'rgba(175, 162, 140, 0.88)');
        ctx.fillStyle = pageGrad;
        ctx.fill();
        ctx.strokeStyle = 'rgba(217, 168, 63, 0.35)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Individual page striation line
        ctx.strokeStyle = 'rgba(150, 138, 118, 0.35)';
        ctx.beginPath();
        ctx.moveTo((proj[1].x + proj[5].x) / 2, (proj[1].y + proj[5].y) / 2);
        ctx.lineTo((proj[2].x + proj[6].x) / 2, (proj[2].y + proj[6].y) / 2);
        ctx.stroke();
      }

      // 4. Draw Top Pages Block if visible
      if (topNormalZ > 0) {
        ctx.beginPath();
        ctx.moveTo(proj[0].x, proj[0].y);
        ctx.lineTo(proj[1].x, proj[1].y);
        ctx.lineTo(proj[5].x, proj[5].y);
        ctx.lineTo(proj[4].x, proj[4].y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(225, 218, 202, 0.94)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(217, 168, 63, 0.3)';
        ctx.stroke();
      }

      // 5. Draw Bottom Pages Block if visible
      if (bottomNormalZ > 0) {
        ctx.beginPath();
        ctx.moveTo(proj[3].x, proj[3].y);
        ctx.lineTo(proj[2].x, proj[2].y);
        ctx.lineTo(proj[6].x, proj[6].y);
        ctx.lineTo(proj[7].x, proj[7].y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(195, 185, 168, 0.95)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(217, 168, 63, 0.3)';
        ctx.stroke();
      }

      // 6. Draw Front Cover Face if visible
      if (frontNormalZ > 0) {
        ctx.beginPath();
        ctx.moveTo(proj[0].x, proj[0].y);
        ctx.lineTo(proj[1].x, proj[1].y);
        ctx.lineTo(proj[2].x, proj[2].y);
        ctx.lineTo(proj[3].x, proj[3].y);
        ctx.closePath();

        const coverGrad = ctx.createLinearGradient(proj[0].x, proj[0].y, proj[2].x, proj[2].y);
        coverGrad.addColorStop(0, coverTop);
        coverGrad.addColorStop(0.65, coverBot);
        coverGrad.addColorStop(1, '#060203');
        ctx.fillStyle = coverGrad;
        ctx.fill();

        // Gold Rim
        ctx.strokeStyle = '#F3D276';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Inner Embossed Gold Line Frame
        const inScale = 0.88;
        ctx.beginPath();
        ctx.moveTo(proj[0].x * inScale, proj[0].y * inScale);
        ctx.lineTo(proj[1].x * inScale, proj[1].y * inScale);
        ctx.lineTo(proj[2].x * inScale, proj[2].y * inScale);
        ctx.lineTo(proj[3].x * inScale, proj[3].y * inScale);
        ctx.closePath();
        ctx.strokeStyle = 'rgba(243, 210, 118, 0.45)';
        ctx.lineWidth = 0.9;
        ctx.stroke();

        // Front Cover Typography & Emblem
        const faceMidX = (proj[0].x + proj[1].x + proj[2].x + proj[3].x) / 4;
        const faceMidY = (proj[0].y + proj[1].y + proj[2].y + proj[3].y) / 4;

        ctx.save();
        ctx.translate(faceMidX, faceMidY);
        const skewAngle = Math.atan2(proj[1].y - proj[0].y, proj[1].x - proj[0].x);
        ctx.rotate(skewAngle);

        // Subtitle
        ctx.font = 'bold 9px -apple-system, sans-serif';
        ctx.fillStyle = 'rgba(243, 210, 118, 0.85)';
        ctx.textAlign = 'center';
        ctx.letterSpacing = '2.5px';
        ctx.fillText(subTitle, 0, -hh * 0.42);

        // Gold Divider
        ctx.strokeStyle = 'rgba(217, 168, 63, 0.6)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(-45, -hh * 0.32);
        ctx.lineTo(45, -hh * 0.32);
        ctx.stroke();

        // Main Golden Book Title
        ctx.font = '900 19px "Playfair Display", serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(bookTitle, 0, -hh * 0.08);
        ctx.fillStyle = '#F3D276';
        ctx.fillText(bookTitle, 0.5, -hh * 0.08 + 0.5);

        // Emblem Seal
        ctx.strokeStyle = '#F3D276';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(0, hh * 0.28, 22, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, hh * 0.28, 18, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(217, 168, 63, 0.5)';
        ctx.stroke();

        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = '#F3D276';
        const sealGlyph = theme === 'math' ? '∑ π' : theme === 'english' ? 'EN' : theme === 'it' ? '< / >' : '★ DTM';
        ctx.fillText(sealGlyph, 0, hh * 0.28 + 4);

        ctx.restore();
      }

      ctx.restore();

      // -----------------------------------------------------------------------
      // D. RENDER FOREGROUND SATELLITES (z >= 0: In Front of Book)
      // -----------------------------------------------------------------------
      for (let i = 0; i < satellites.length; i++) {
        const sat = satellites[i];
        if (sat.projZ >= 10) {
          renderSatellite(ctx, sat);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    // -------------------------------------------------------------------------
    // HELPER: RENDER INDIVIDUAL SATELLITE OBJECT
    // -------------------------------------------------------------------------
    function renderSatellite(c: CanvasRenderingContext2D, sat: SatelliteObject3D) {
      c.save();
      c.translate(sat.projX, sat.projY);

      const hoverScale = sat.isHovered || sat.isGrabbed ? 1.25 : 1.0;
      c.scale(sat.projScale * hoverScale, sat.projScale * hoverScale);

      // Rotate around local axis
      c.rotate(sat.rotZ);

      // Gold Halo on Hover
      if (sat.isHovered || sat.isGrabbed) {
        c.fillStyle = 'rgba(217, 168, 63, 0.25)';
        c.beginPath();
        c.arc(0, 0, sat.size * 1.5, 0, Math.PI * 2);
        c.fill();
      }

      c.strokeStyle = sat.isHovered ? '#FFFFFF' : '#F3D276';
      c.fillStyle = sat.isHovered ? '#FFFFFF' : '#F3D276';
      c.lineWidth = sat.isHovered ? 1.5 : 1.1;

      if (sat.type === 'formula' || sat.type === 'letter' || sat.type === 'word' || sat.type === 'code' || sat.type === 'star') {
        c.font = `bold ${Math.round(sat.size)}px monospace`;
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(sat.label || '', 0, 0);
      } else if (sat.type === 'ring') {
        c.beginPath();
        c.ellipse(0, 0, sat.size, sat.size * Math.abs(Math.cos(sat.rotX)), sat.rotY, 0, Math.PI * 2);
        c.stroke();
      } else if (sat.type === 'parabola') {
        c.beginPath();
        for (let px = -sat.size; px <= sat.size; px += 4) {
          const py = (0.04 * px * px - 12);
          if (px === -sat.size) c.moveTo(px, py);
          else c.lineTo(px, py);
        }
        c.stroke();
      } else if (sat.type === 'sinewave') {
        c.beginPath();
        for (let px = -sat.size; px <= sat.size; px += 4) {
          const py = Math.sin(px * 0.18 + sat.rotY) * 10;
          if (px === -sat.size) c.moveTo(px, py);
          else c.lineTo(px, py);
        }
        c.stroke();
      } else if (sat.type === 'axes') {
        c.beginPath();
        c.moveTo(0, 0); c.lineTo(sat.size, 0);
        c.moveTo(0, 0); c.lineTo(0, -sat.size);
        c.moveTo(0, 0); c.lineTo(-sat.size * 0.6, sat.size * 0.6);
        c.stroke();
      } else if (sat.type === 'knot') {
        c.beginPath();
        for (let t = 0; t <= Math.PI * 2; t += 0.2) {
          const kx = (Math.sin(t) + 2 * Math.sin(2 * t)) * (sat.size * 0.35);
          const ky = (Math.cos(t) - 2 * Math.cos(2 * t)) * (sat.size * 0.35);
          if (t === 0) c.moveTo(kx, ky);
          else c.lineTo(kx, ky);
        }
        c.stroke();
      } else if (sat.type === 'helix') {
        c.beginPath();
        for (let step = 0; step <= 16; step++) {
          const theta = (step / 16) * Math.PI * 4;
          const r = (step / 16) * sat.size;
          const hx = Math.cos(theta) * r;
          const hy = Math.sin(theta) * r * 0.4;
          if (step === 0) c.moveTo(hx, hy);
          else c.lineTo(hx, hy);
        }
        c.stroke();
      }

      c.restore();
    }

    // -------------------------------------------------------------------------
    // POINTER HIT-TESTING & 360° VELOCITY DRAG INTERACTION
    // -------------------------------------------------------------------------
    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const pointerX = e.clientX - rect.left;
      const pointerY = e.clientY - rect.top;
      const now = performance.now();

      const bookPhys = bookPhysicsRef.current;

      // 1. If currently dragging
      if (activeGrabTargetRef.current === 'book') {
        const dx = pointerX - bookPhys.lastPointerX;
        const dy = pointerY - bookPhys.lastPointerY;

        // Instant 360° rotation from drag delta
        bookPhys.rotY += dx * 0.009;
        bookPhys.rotX += dy * 0.009;

        // Track velocity samples
        bookPhys.samples.push({ x: pointerX, y: pointerY, time: now });
        if (bookPhys.samples.length > 8) bookPhys.samples.shift();

        bookPhys.lastPointerX = pointerX;
        bookPhys.lastPointerY = pointerY;
        document.body.style.cursor = 'grabbing';
        e.preventDefault();
        return;
      }

      // If dragging an individual satellite
      if (activeGrabTargetRef.current && activeGrabTargetRef.current !== 'book') {
        const sat = satellitesRef.current.find((s) => s.id === activeGrabTargetRef.current);
        if (sat) {
          const dx = pointerX - bookPhys.lastPointerX;
          const dy = pointerY - bookPhys.lastPointerY;
          sat.rotY += dx * 0.02;
          sat.rotX += dy * 0.02;
          sat.spinVy = dx * 0.015;
          sat.spinVx = dy * 0.015;
          bookPhys.lastPointerX = pointerX;
          bookPhys.lastPointerY = pointerY;
          document.body.style.cursor = 'grabbing';
          e.preventDefault();
          return;
        }
      }

      // 2. Hover Hit-Testing
      // Check Satellites first
      let hitSat: SatelliteObject3D | null = null;
      for (let i = satellitesRef.current.length - 1; i >= 0; i--) {
        const sat = satellitesRef.current[i];
        const dist = Math.hypot(pointerX - sat.projX, pointerY - sat.projY);
        if (dist < sat.size * 1.6 + 10) {
          hitSat = sat;
          break;
        }
      }

      satellitesRef.current.forEach((s) => (s.isHovered = s.id === hitSat?.id));

      // Check Book hit
      const bookDist = Math.hypot(pointerX - width / 2, pointerY - height / 2);
      bookPhys.isHovered = !hitSat && bookDist < Math.min(width, height) * 0.35;

      if (hitSat || bookPhys.isHovered) {
        document.body.style.cursor = 'grab';
      } else {
        document.body.style.cursor = 'default';
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const rect = canvas.getBoundingClientRect();
      const pointerX = e.clientX - rect.left;
      const pointerY = e.clientY - rect.top;
      const now = performance.now();

      const bookPhys = bookPhysicsRef.current;

      // Check Satellites Hit
      let hitSat: SatelliteObject3D | null = null;
      for (let i = satellitesRef.current.length - 1; i >= 0; i--) {
        const sat = satellitesRef.current[i];
        const dist = Math.hypot(pointerX - sat.projX, pointerY - sat.projY);
        if (dist < sat.size * 1.6 + 10) {
          hitSat = sat;
          break;
        }
      }

      if (hitSat) {
        activeGrabTargetRef.current = hitSat.id;
        hitSat.isGrabbed = true;
        bookPhys.lastPointerX = pointerX;
        bookPhys.lastPointerY = pointerY;
        try {
          canvas.setPointerCapture(e.pointerId);
        } catch (err) {}
        document.body.style.cursor = 'grabbing';
        e.preventDefault();
        return;
      }

      // Check Book Hit
      const bookDist = Math.hypot(pointerX - width / 2, pointerY - height / 2);
      if (bookDist < Math.min(width, height) * 0.36) {
        activeGrabTargetRef.current = 'book';
        bookPhys.isDragging = true;
        bookPhys.angVx = 0;
        bookPhys.angVy = 0;
        bookPhys.lastPointerX = pointerX;
        bookPhys.lastPointerY = pointerY;
        bookPhys.samples = [{ x: pointerX, y: pointerY, time: now }];
        try {
          canvas.setPointerCapture(e.pointerId);
        } catch (err) {}
        document.body.style.cursor = 'grabbing';
        e.preventDefault();
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      const bookPhys = bookPhysicsRef.current;
      const now = performance.now();

      if (activeGrabTargetRef.current === 'book') {
        bookPhys.isDragging = false;
        activeGrabTargetRef.current = null;

        // Calculate Release Angular Momentum
        const samples = bookPhys.samples;
        if (samples.length >= 2) {
          const recent = samples.filter((p) => now - p.time <= 90);
          if (recent.length >= 2) {
            const first = recent[0];
            const last = recent[recent.length - 1];
            const dt = (last.time - first.time) / 1000;
            if (dt > 0.01) {
              const vx = (last.x - first.x) / dt;
              const vy = (last.y - first.y) / dt;
              // Angular velocity with clamping
              bookPhys.angVy = Math.max(-0.12, Math.min(0.12, (vx / 60) * 0.012));
              bookPhys.angVx = Math.max(-0.12, Math.min(0.12, (vy / 60) * 0.012));
            }
          }
        }

        try {
          canvas.releasePointerCapture(e.pointerId);
        } catch (err) {}
        document.body.style.cursor = bookPhys.isHovered ? 'grab' : 'default';
      } else if (activeGrabTargetRef.current) {
        const sat = satellitesRef.current.find((s) => s.id === activeGrabTargetRef.current);
        if (sat) {
          sat.isGrabbed = false;
        }
        activeGrabTargetRef.current = null;
        try {
          canvas.releasePointerCapture(e.pointerId);
        } catch (err) {}
        document.body.style.cursor = 'default';
      }
    };

    canvas.addEventListener('pointermove', handlePointerMove, { passive: false });
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('resize', updateSize);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointercancel', handlePointerUp);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <section
      id="courses"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto relative z-10 select-text"
    >
      {/* Subtle Background Architectural Glow */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-radial from-[#D9A83F]/08 via-[#4A0E17]/12 to-transparent blur-3xl pointer-events-none" />

      {/* -----------------------------------------------------------------------
          1. SECTION HEADER & DYNAMIC COURSE SELECTOR
          ----------------------------------------------------------------------- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8 relative z-10">
        <div className="space-y-4 max-w-2xl">
          {/* Section Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16090D] border border-[#D9A93A]/35 text-xs font-bold uppercase tracking-widest text-[#D9A93A] shadow-[0_4px_16px_rgba(217,169,58,0.12)]">
            <BookOpen className="h-3.5 w-3.5" />
            <span>3D Ta’lim Dunyosi</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-luxury-serif font-black text-[#F7F4EE] leading-[1.12]">
            Kelajagingiz uchun <br />
            <span className="text-[#D9A93A] font-luxury-serif">bilimni tanlang.</span>
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#B0A7A2] font-normal leading-relaxed">
            Kitobni aylantirib ko‘ring va atrofidagi interaktiv matematik/lingvistik tuzilmalarni kashf eting. Har bir kurs chuqur amaliy laboratoriya va individual murabbiyga ega.
          </p>
        </div>

        {/* Dynamic Course Pill Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {INITIAL_COURSES.map((course) => {
            const isSelected = course.id === activeCourse.id;
            return (
              <button
                key={course.id}
                type="button"
                onClick={() => handleSelectCourse(course)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#D9A93A] via-[#F3D276] to-[#D9A93A] text-[#080607] font-black shadow-[0_4px_18px_rgba(217,169,58,0.35)] scale-105'
                    : 'bg-[#14080B]/90 border border-[#D9A93A]/25 text-[#A9A3A0] hover:text-[#F7F4EE] hover:border-[#D9A93A]/60'
                }`}
              >
                <span>{course.category}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* -----------------------------------------------------------------------
          2. UNIFIED SPECTACULAR 3D COURSES WORLD (No 6-card grid!)
          ----------------------------------------------------------------------- */}
      <div className="relative rounded-[44px] bg-gradient-to-br from-[#180A10] via-[#0E0508] to-[#070305] border border-[#D9A93A]/30 p-6 sm:p-10 lg:p-14 shadow-[0_35px_100px_rgba(0,0,0,0.94)] overflow-hidden">
        {/* Subtle Architectural Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#D9A93A_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center relative z-10">
          {/* LEFT COLUMN: Active Course Information & Metadata */}
          <div
            className={`lg:col-span-6 space-y-6 transition-all duration-400 ${
              isTransitioning ? 'opacity-40 translate-y-2' : 'opacity-100 translate-y-0'
            }`}
          >
            {/* Top Indicator & Prev/Next Arrows */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-luxury-serif font-black text-[#D9A93A]">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(INITIAL_COURSES.length).padStart(2, '0')}
                </span>
                <div className="h-4 w-[1px] bg-[#D9A93A]/30" />
                <span className="px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#D9A93A]/15 text-[#F3D276] border border-[#D9A93A]/35">
                  {activeCourse.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2 rounded-full border border-[#D9A93A]/30 hover:border-[#D9A93A] text-[#A9A3A0] hover:text-[#F7F4EE] hover:bg-[#D9A93A]/10 transition-colors cursor-pointer"
                  title="Oldingi kurs"
                  aria-label="Oldingi kurs"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2 rounded-full border border-[#D9A93A]/30 hover:border-[#D9A93A] text-[#A9A3A0] hover:text-[#F7F4EE] hover:bg-[#D9A93A]/10 transition-colors cursor-pointer"
                  title="Keyingi kurs"
                  aria-label="Keyingi kurs"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Course Title */}
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-luxury-serif font-black text-[#F7F4EE] tracking-tight">
              {activeCourse.title}
            </h3>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#BDB5B0] leading-relaxed font-normal">
              {activeCourse.description}
            </p>

            {/* Key Specifications Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 py-4 border-y border-[#D9A93A]/20">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-[#D9A93A]/10 border border-[#D9A93A]/25 flex items-center justify-center text-[#D9A93A] shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[#A9A3A0] font-semibold uppercase block">Davomiyligi</span>
                  <span className="text-xs font-bold text-[#F7F4EE]">
                    {activeCourse.durationMonths} oy ({activeCourse.lessonsCount} dars)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-[#D9A93A]/10 border border-[#D9A93A]/25 flex items-center justify-center text-[#D9A93A] shrink-0">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[#A9A3A0] font-semibold uppercase block">Dars Grafigi</span>
                  <span className="text-xs font-bold text-[#F7F4EE] line-clamp-1">
                    {(activeCourse.schedule || '').split('(')[0] || 'Haftada 3 kun'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-[#D9A93A]/10 border border-[#D9A93A]/25 flex items-center justify-center text-[#D9A93A] shrink-0">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[#A9A3A0] font-semibold uppercase block">Ustoz</span>
                  <span className="text-xs font-bold text-[#F7F4EE] line-clamp-1">
                    {activeCourse.instructor || 'Yetakchi ustoz'}
                  </span>
                </div>
              </div>
            </div>

            {/* Syllabus Preview */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-[#D9A93A] tracking-wide uppercase flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>O‘quv dasturidan asosiy mavzular:</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#E8E1D9]">
                {(activeCourse.syllabus || []).slice(0, 4).map((topic, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#D9A93A] shrink-0 mt-0.5" />
                    <span className="line-clamp-1 leading-snug">{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing & CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div>
                <span className="text-[11px] uppercase font-bold text-[#A9A3A0] block">Oylik to‘lov</span>
                <span className="text-2xl sm:text-3xl font-luxury-serif font-black text-[#F3D276]">
                  {formatMoney(activeCourse.pricePerMonth)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Secondary CTA: Full Syllabus */}
                <button
                  type="button"
                  onClick={() => onOpenDetails(activeCourse)}
                  className="px-6 py-3.5 rounded-full border border-[#D9A93A]/40 bg-[#16090D]/80 hover:bg-[#D9A93A]/15 hover:border-[#F4D27A] text-xs font-bold text-[#F7F4EE] hover:text-[#FFE7A3] transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-[inset_0_1px_2px_rgba(255,255,255,0.06)]"
                >
                  <BookOpen className="h-4 w-4 text-[#D9A93A]" />
                  <span>Batafsil dastur</span>
                </button>

                {/* Primary CTA: Register */}
                <button
                  type="button"
                  onClick={() => onOpenRegister(activeCourse.title)}
                  className="px-7 py-3.5 rounded-full text-xs font-black text-[#0B0808] bg-gradient-to-r from-[#D9A93A] via-[#F4D27A] to-[#D9A93A] hover:brightness-110 shadow-[0_6px_25px_rgba(217,169,58,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center gap-2 cursor-pointer border border-[#FFF2C6]/40"
                >
                  <span>Guruhga yozilish</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Diagnostic Test Link */}
            {onOpenDiagnostic && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenDiagnostic}
                  className="text-xs font-bold text-[#D9A93A] hover:text-[#F3D276] hover:underline flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>Qaysi kurs sizga mos kelishini aniqlash uchun bepul diagnostik test topshiring</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Grand Interactive 3D World Stage */}
          <div className="lg:col-span-6 relative w-full aspect-square max-w-[560px] mx-auto flex items-center justify-center select-none">
            {/* Ambient Behind-Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[88%] h-[88%] rounded-full bg-radial from-[#D9A83F]/22 via-[#4A0E17]/28 to-transparent blur-3xl" />
            </div>

            {/* 3D Canvas */}
            <canvas
              ref={canvasRef}
              className="w-full h-full block touch-none select-none relative z-10"
              style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
              title="3D Kurs Objekti: Aylantirish uchun ushlang va siljiting"
            />

            {/* Interaction Guide Hint Badge */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full bg-[#120608]/85 backdrop-blur-md border border-[#D9A93A]/30 text-[10px] font-semibold text-[#D9A93A] pointer-events-none flex items-center gap-2 whitespace-nowrap shadow-xl">
              <RotateCw className="h-3 w-3 animate-spin-slow" />
              <span>Kitob va orbital ob’ektlarni 360° aylantirish uchun ushlang</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
