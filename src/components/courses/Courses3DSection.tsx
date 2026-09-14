import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  Compass,
  Atom,
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
type PerformanceTier = 'ULTRA_LOW' | 'LOW' | 'MEDIUM' | 'HIGH';
type DepthLayer = 'FOREGROUND' | 'MIDGROUND' | 'BACKGROUND' | 'DEEP_BACKGROUND';

interface SatelliteObject3D {
  id: string;
  type:
    | 'ring_horizontal'
    | 'ring_nested'
    | 'ring_elliptical'
    | 'parabola'
    | 'sinewave'
    | 'knot'
    | 'helix'
    | 'axes'
    | 'octahedron'
    | 'formula'
    | 'letter'
    | 'word'
    | 'code';
  label?: string;
  depthLayer: DepthLayer;
  // 3D Orbital Coordinates
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
  orbitInclination: number; // orbital tilt in radians
  orbitEccentricity: number; // elliptical squashing
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
  // Physics & Interaction State
  isHovered: boolean;
  isGrabbed: boolean;
  spinVx: number;
  spinVy: number;
  size: number;
  baseOpacity: number;
  // Cached Screen Projections for Hit-Testing & Sorting
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

  // Determine Course Theme for 3D Laboratory
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
  // 3D CANVAS & UNIFIED MATHEMATICAL LABORATORY ENGINE
  // ---------------------------------------------------------------------------
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Book 360° Turntable Physics State
  const bookPhysicsRef = useRef({
    rotX: -0.16, // subtle downward perspective
    rotY: 0.38,  // initial showroom angle
    rotZ: -0.02,
    angVx: 0,
    angVy: 0,
    isDragging: false,
    lastPointerX: 0,
    lastPointerY: 0,
    lastTime: 0,
    samples: [] as { x: number; y: number; time: number }[],
    isHovered: false,
    hoverScale: 1.0,
  });

  // Active Grab Target ('book' | satelliteId | null)
  const activeGrabTargetRef = useRef<string | null>(null);

  // Satellites Collection Ref
  const satellitesRef = useRef<SatelliteObject3D[]>([]);

  // Mouse Parallax & Camera Drift Ref
  const cameraRef = useRef({
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
  });

  // Dynamic Performance Tier
  const tierRef = useRef<PerformanceTier>('HIGH');

  // Populate Satellites depending on Theme & Device Tier
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    tierRef.current = isMobile ? 'LOW' : isTablet ? 'MEDIUM' : 'HIGH';

    const list: SatelliteObject3D[] = [];

    // =========================================================================
    // 1. PRIMARY ORBITAL RINGS (Hero Satellites - Always Present)
    // =========================================================================
    // A. Main Grand Horizontal Orbital Ring (Directly encircling the book)
    list.push({
      id: 'prim-ring-main',
      type: 'ring_horizontal',
      depthLayer: 'FOREGROUND',
      orbitRadius: 185,
      orbitSpeed: 0.0009,
      orbitPhase: 0.4,
      orbitInclination: 0.18, // slightly tilted horizontal
      orbitEccentricity: 0.94,
      x: 0, y: 0, z: 0,
      rotX: 0.35, rotY: 0, rotZ: 0,
      rotSpeedX: 0.0003, rotSpeedY: 0.0008, rotSpeedZ: 0.0002,
      isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
      size: 190,
      baseOpacity: 0.90,
      projX: 0, projY: 0, projScale: 1, projZ: 0,
    });

    // B. Nested Double Tilted Ring (Secondary Hero Orbital)
    list.push({
      id: 'prim-ring-nested',
      type: 'ring_nested',
      depthLayer: 'MIDGROUND',
      orbitRadius: 230,
      orbitSpeed: -0.0007,
      orbitPhase: 2.3,
      orbitInclination: -0.42,
      orbitEccentricity: 0.88,
      x: 0, y: 0, z: 0,
      rotX: -0.4, rotY: 0.3, rotZ: 0.2,
      rotSpeedX: 0.0005, rotSpeedY: -0.0006, rotSpeedZ: 0.0003,
      isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
      size: 42,
      baseOpacity: 0.85,
      projX: 0, projY: 0, projScale: 1, projZ: 0,
    });

    // C. Elliptical Counter-Orbiting Loop
    list.push({
      id: 'prim-ring-elliptical',
      type: 'ring_elliptical',
      depthLayer: 'MIDGROUND',
      orbitRadius: 265,
      orbitSpeed: 0.0006,
      orbitPhase: 4.8,
      orbitInclination: 0.52,
      orbitEccentricity: 0.82,
      x: 0, y: 0, z: 0,
      rotX: 0.5, rotY: -0.2, rotZ: 0.1,
      rotSpeedX: 0.0004, rotSpeedY: 0.0007, rotSpeedZ: 0.0002,
      isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
      size: 38,
      baseOpacity: 0.80,
      projX: 0, projY: 0, projScale: 1, projZ: 0,
    });

    // =========================================================================
    // 2. MATHEMATICAL SCULPTURES (Midground & Foreground)
    // =========================================================================
    if (theme === 'math') {
      // 3D Parabola y = x²
      list.push({
        id: 'math-parabola',
        type: 'parabola',
        label: 'y = x²',
        depthLayer: 'MIDGROUND',
        orbitRadius: 210,
        orbitSpeed: 0.0008,
        orbitPhase: 1.1,
        orbitInclination: 0.35,
        orbitEccentricity: 0.90,
        x: 0, y: 0, z: 0,
        rotX: 0.2, rotY: 0.4, rotZ: 0,
        rotSpeedX: 0.0004, rotSpeedY: 0.0006, rotSpeedZ: 0.0002,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 32,
        baseOpacity: 0.80,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });

      // 3D Sine Wave Ribbon y = sin(x)
      list.push({
        id: 'math-sinewave',
        type: 'sinewave',
        label: 'y = sin(x)',
        depthLayer: 'MIDGROUND',
        orbitRadius: 245,
        orbitSpeed: -0.0007,
        orbitPhase: 3.6,
        orbitInclination: -0.32,
        orbitEccentricity: 0.86,
        x: 0, y: 0, z: 0,
        rotX: -0.3, rotY: 0.5, rotZ: 0.1,
        rotSpeedX: 0.0005, rotSpeedY: 0.0007, rotSpeedZ: 0.0003,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 34,
        baseOpacity: 0.78,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });

      // 3D Coordinate Tripod (X, Y, Z)
      list.push({
        id: 'math-axes',
        type: 'axes',
        label: 'XYZ',
        depthLayer: 'MIDGROUND',
        orbitRadius: 225,
        orbitSpeed: 0.0006,
        orbitPhase: 5.4,
        orbitInclination: 0.45,
        orbitEccentricity: 0.89,
        x: 0, y: 0, z: 0,
        rotX: 0.4, rotY: 0.3, rotZ: -0.2,
        rotSpeedX: 0.0006, rotSpeedY: 0.0005, rotSpeedZ: 0.0003,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 28,
        baseOpacity: 0.82,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });

      // 3D Trefoil Knot Sculpture
      list.push({
        id: 'math-knot',
        type: 'knot',
        depthLayer: 'MIDGROUND',
        orbitRadius: 285,
        orbitSpeed: 0.0005,
        orbitPhase: 2.8,
        orbitInclination: 0.28,
        orbitEccentricity: 0.85,
        x: 0, y: 0, z: 0,
        rotX: 0.3, rotY: 0.7, rotZ: 0.4,
        rotSpeedX: 0.0004, rotSpeedY: 0.0005, rotSpeedZ: 0.0002,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 30,
        baseOpacity: 0.75,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });

      // 3D Spiral Helix
      list.push({
        id: 'math-helix',
        type: 'helix',
        depthLayer: 'BACKGROUND',
        orbitRadius: 295,
        orbitSpeed: -0.0005,
        orbitPhase: 4.5,
        orbitInclination: -0.40,
        orbitEccentricity: 0.87,
        x: 0, y: 0, z: 0,
        rotX: -0.4, rotY: 0.4, rotZ: 0.2,
        rotSpeedX: 0.0004, rotSpeedY: 0.0006, rotSpeedZ: 0.0003,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 30,
        baseOpacity: 0.70,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });

      // Gemstone Octahedron Polyhedron
      list.push({
        id: 'math-octahedron',
        type: 'octahedron',
        depthLayer: 'MIDGROUND',
        orbitRadius: 255,
        orbitSpeed: 0.0007,
        orbitPhase: 0.6,
        orbitInclination: -0.30,
        orbitEccentricity: 0.91,
        x: 0, y: 0, z: 0,
        rotX: 0.5, rotY: 0.5, rotZ: 0.2,
        rotSpeedX: 0.0006, rotSpeedY: 0.0008, rotSpeedZ: 0.0004,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 24,
        baseOpacity: 0.80,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });

      // Subtle Formulas (Inner & Background)
      const mathFormulas = [
        { label: 'π', r: 155, speed: 0.0012, phase: 0.2, inc: 0.22, layer: 'FOREGROUND' as const },
        { label: '∫', r: 165, speed: -0.0011, phase: 2.1, inc: -0.28, layer: 'FOREGROUND' as const },
        { label: '√x', r: 160, speed: 0.0010, phase: 4.1, inc: 0.16, layer: 'FOREGROUND' as const },
        { label: '∑', r: 270, speed: 0.0006, phase: 1.5, inc: 0.38, layer: 'BACKGROUND' as const },
        { label: '∞', r: 290, speed: -0.0005, phase: 3.8, inc: -0.34, layer: 'BACKGROUND' as const },
        { label: 'f(x)', r: 310, speed: 0.0004, phase: 5.7, inc: 0.25, layer: 'BACKGROUND' as const },
      ];

      mathFormulas.forEach((f, idx) => {
        list.push({
          id: `formula-${idx}`,
          type: 'formula',
          label: f.label,
          depthLayer: f.layer,
          orbitRadius: f.r,
          orbitSpeed: f.speed,
          orbitPhase: f.phase,
          orbitInclination: f.inc,
          orbitEccentricity: 0.92,
          x: 0, y: 0, z: 0,
          rotX: 0, rotY: 0, rotZ: 0,
          rotSpeedX: 0.0006, rotSpeedY: 0.001, rotSpeedZ: 0.0004,
          isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
          size: f.layer === 'FOREGROUND' ? 17 : 13,
          baseOpacity: f.layer === 'FOREGROUND' ? 0.85 : 0.65,
          projX: 0, projY: 0, projScale: 1, projZ: 0,
        });
      });
    } else if (theme === 'english') {
      // 3D English Typography Glyphs & Sparse Inspiring Words
      const engLetters = [
        { label: 'A', r: 155, speed: 0.0013, phase: 0.3, inc: 0.2 },
        { label: 'B', r: 165, speed: -0.0011, phase: 2.2, inc: -0.26 },
        { label: 'C', r: 160, speed: 0.0012, phase: 4.0, inc: 0.22 },
        { label: 'Z', r: 275, speed: 0.0006, phase: 1.6, inc: 0.32 },
      ];
      engLetters.forEach((el, idx) => {
        list.push({
          id: `eng-letter-${idx}`,
          type: 'letter',
          label: el.label,
          depthLayer: 'FOREGROUND',
          orbitRadius: el.r,
          orbitSpeed: el.speed,
          orbitPhase: el.phase,
          orbitInclination: el.inc,
          orbitEccentricity: 0.92,
          x: 0, y: 0, z: 0,
          rotX: 0, rotY: 0, rotZ: 0,
          rotSpeedX: 0.0008, rotSpeedY: 0.0012, rotSpeedZ: 0.0004,
          isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
          size: 18,
          baseOpacity: 0.85,
          projX: 0, projY: 0, projScale: 1, projZ: 0,
        });
      });

      const engWords = [
        { label: 'LEARN', r: 220, speed: 0.0008, phase: 1.0, inc: 0.35, layer: 'MIDGROUND' as const },
        { label: 'SPEAK', r: 240, speed: -0.0007, phase: 3.3, inc: -0.38, layer: 'MIDGROUND' as const },
        { label: 'THINK', r: 250, speed: 0.0007, phase: 5.1, inc: 0.30, layer: 'MIDGROUND' as const },
        { label: 'GROW', r: 285, speed: -0.0005, phase: 2.6, inc: -0.28, layer: 'BACKGROUND' as const },
        { label: 'GLOBAL', r: 310, speed: 0.0004, phase: 4.8, inc: 0.32, layer: 'BACKGROUND' as const },
      ];
      engWords.forEach((ew, idx) => {
        list.push({
          id: `eng-word-${idx}`,
          type: 'word',
          label: ew.label,
          depthLayer: ew.layer,
          orbitRadius: ew.r,
          orbitSpeed: ew.speed,
          orbitPhase: ew.phase,
          orbitInclination: ew.inc,
          orbitEccentricity: 0.88,
          x: 0, y: 0, z: 0,
          rotX: 0, rotY: 0, rotZ: 0,
          rotSpeedX: 0.0005, rotSpeedY: 0.0009, rotSpeedZ: 0.0003,
          isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
          size: 13,
          baseOpacity: ew.layer === 'MIDGROUND' ? 0.78 : 0.60,
          projX: 0, projY: 0, projScale: 1, projZ: 0,
        });
      });

      // English Sculpture: Gemstone Octahedron
      list.push({
        id: 'eng-octahedron',
        type: 'octahedron',
        depthLayer: 'MIDGROUND',
        orbitRadius: 260,
        orbitSpeed: 0.0007,
        orbitPhase: 0.8,
        orbitInclination: -0.32,
        orbitEccentricity: 0.90,
        x: 0, y: 0, z: 0,
        rotX: 0.4, rotY: 0.6, rotZ: 0.2,
        rotSpeedX: 0.0006, rotSpeedY: 0.0008, rotSpeedZ: 0.0003,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 26,
        baseOpacity: 0.80,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });
    } else if (theme === 'it') {
      const itItems = [
        { label: '<code/>', r: 155, speed: 0.0013, phase: 0.4, inc: 0.22, layer: 'FOREGROUND' as const },
        { label: '{ ... }', r: 165, speed: -0.0011, phase: 2.3, inc: -0.28, layer: 'FOREGROUND' as const },
        { label: '01', r: 160, speed: 0.0012, phase: 4.2, inc: 0.18, layer: 'FOREGROUND' as const },
        { label: 'React', r: 220, speed: 0.0008, phase: 1.2, inc: 0.35, layer: 'MIDGROUND' as const },
        { label: 'async', r: 240, speed: -0.0007, phase: 3.4, inc: -0.38, layer: 'MIDGROUND' as const },
        { label: 'API', r: 285, speed: 0.0005, phase: 2.4, inc: 0.30, layer: 'BACKGROUND' as const },
      ];
      itItems.forEach((it, idx) => {
        list.push({
          id: `it-${idx}`,
          type: 'code',
          label: it.label,
          depthLayer: it.layer,
          orbitRadius: it.r,
          orbitSpeed: it.speed,
          orbitPhase: it.phase,
          orbitInclination: it.inc,
          orbitEccentricity: 0.90,
          x: 0, y: 0, z: 0,
          rotX: 0, rotY: 0, rotZ: 0,
          rotSpeedX: 0.0006, rotSpeedY: 0.001, rotSpeedZ: 0.0004,
          isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
          size: it.layer === 'FOREGROUND' ? 16 : 13,
          baseOpacity: it.layer === 'FOREGROUND' ? 0.85 : 0.65,
          projX: 0, projY: 0, projScale: 1, projZ: 0,
        });
      });
      // Octahedron
      list.push({
        id: 'it-octahedron',
        type: 'octahedron',
        depthLayer: 'MIDGROUND',
        orbitRadius: 260,
        orbitSpeed: 0.0007,
        orbitPhase: 0.8,
        orbitInclination: -0.32,
        orbitEccentricity: 0.90,
        x: 0, y: 0, z: 0,
        rotX: 0.4, rotY: 0.6, rotZ: 0.2,
        rotSpeedX: 0.0006, rotSpeedY: 0.0008, rotSpeedZ: 0.0003,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 26,
        baseOpacity: 0.80,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });
    } else {
      // Academic / DTM / Presidential Schools
      const acadItems = [
        { label: '189+', r: 155, speed: 0.0013, phase: 0.4, inc: 0.22, layer: 'FOREGROUND' as const },
        { label: '★', r: 165, speed: -0.0011, phase: 2.3, inc: -0.28, layer: 'FOREGROUND' as const },
        { label: 'DTM', r: 220, speed: 0.0008, phase: 1.2, inc: 0.35, layer: 'MIDGROUND' as const },
        { label: 'GRANT', r: 240, speed: -0.0007, phase: 3.4, inc: -0.38, layer: 'MIDGROUND' as const },
        { label: 'IQ', r: 285, speed: 0.0005, phase: 2.4, inc: 0.30, layer: 'BACKGROUND' as const },
      ];
      acadItems.forEach((ac, idx) => {
        list.push({
          id: `acad-${idx}`,
          type: 'formula',
          label: ac.label,
          depthLayer: ac.layer,
          orbitRadius: ac.r,
          orbitSpeed: ac.speed,
          orbitPhase: ac.phase,
          orbitInclination: ac.inc,
          orbitEccentricity: 0.90,
          x: 0, y: 0, z: 0,
          rotX: 0, rotY: 0, rotZ: 0,
          rotSpeedX: 0.0006, rotSpeedY: 0.001, rotSpeedZ: 0.0004,
          isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
          size: ac.layer === 'FOREGROUND' ? 16 : 13,
          baseOpacity: ac.layer === 'FOREGROUND' ? 0.85 : 0.65,
          projX: 0, projY: 0, projScale: 1, projZ: 0,
        });
      });
    }

    // Filter count according to mobile / low-end capability tier
    let maxAllowed = 18;
    if (isMobile) maxAllowed = 7;
    else if (isTablet) maxAllowed = 11;

    satellitesRef.current = list.slice(0, maxAllowed);
  }, [theme]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 600;
    let height = 600;
    let currentCenterX = 300;
    let currentCenterY = 300;
    let currentFloatY = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const updateSize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect && rect.width > 0) {
        width = rect.width;
        height = rect.height;
        currentCenterX = width / 2;
        currentCenterY = height / 2;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.scale(dpr, dpr);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });

    // 3D rotation buffer (Zero GC allocation)
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
      const cam = cameraRef.current;

      // Camera Mouse Parallax Smoothing
      cam.mouseX += (cam.targetMouseX - cam.mouseX) * 0.05;
      cam.mouseY += (cam.targetMouseY - cam.mouseY) * 0.05;

      // -----------------------------------------------------------------------
      // 1. BOOK PHYSICS & HORIZONTAL TURNTABLE MOMENTUM
      // -----------------------------------------------------------------------
      if (!bookPhys.isDragging) {
        bookPhys.rotY += bookPhys.angVy;
        bookPhys.rotX += bookPhys.angVx;

        // Friction damping
        bookPhys.angVy *= 0.965;
        bookPhys.angVx *= 0.965;

        // Strict vertical pitch clamping (turntable freedom, no tumbling)
        bookPhys.rotX = Math.max(-0.25, Math.min(0.25, bookPhys.rotX));

        if (Math.abs(bookPhys.angVy) < 0.0001) bookPhys.angVy = 0;
        if (Math.abs(bookPhys.angVx) < 0.0001) bookPhys.angVx = 0;

        // Subtle autonomous breathing when stationary (1-3px float)
        if (bookPhys.angVy === 0 && bookPhys.angVx === 0) {
          bookPhys.rotY += Math.cos(time * 0.35) * 0.00025;
        }
      }

      // Smooth hover scale transition
      const targetHoverScale = bookPhys.isHovered ? 1.025 : 1.0;
      bookPhys.hoverScale += (targetHoverScale - bookPhys.hoverScale) * 0.12;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Anchored vertical breathing float (1–3px)
      const floatY = Math.sin(time * 1.2) * 2.5;
      currentCenterX = centerX;
      currentCenterY = centerY;
      currentFloatY = floatY;

      // -----------------------------------------------------------------------
      // 2. ATMOSPHERIC STUDIO LIGHTING & DEEP BACKGROUND
      // -----------------------------------------------------------------------
      // Traveling Warm Gold Studio Key Light
      const lightAngle = time * 0.35;
      const lightX = Math.cos(lightAngle) * 220;
      const lightY = Math.sin(lightAngle * 0.7) * 90 - 40;
      const lightZ = Math.sin(lightAngle) * 180;

      // Subtle 3D Coordinate Grid Floor (Deep Background)
      ctx.save();
      ctx.translate(centerX, centerY + 140);
      ctx.strokeStyle = 'rgba(217, 169, 58, 0.04)';
      ctx.lineWidth = 1;
      for (let gx = -180; gx <= 180; gx += 45) {
        ctx.beginPath();
        ctx.moveTo(gx * 0.6, -20);
        ctx.lineTo(gx * 1.4, 60);
        ctx.stroke();
      }
      for (let gz = 0; gz <= 60; gz += 20) {
        const factor = gz / 60;
        const span = 110 + factor * 140;
        ctx.beginPath();
        ctx.moveTo(-span, gz);
        ctx.lineTo(span, gz);
        ctx.stroke();
      }
      ctx.restore();

      // -----------------------------------------------------------------------
      // 3. SATELLITE ORBIT EVOLUTION & 3D PROJECTION
      // -----------------------------------------------------------------------
      const satellites = satellitesRef.current;
      for (let i = 0; i < satellites.length; i++) {
        const sat = satellites[i];

        // Orbit progression (pauses only when actively dragged)
        if (!sat.isGrabbed) {
          sat.orbitPhase += sat.orbitSpeed;
          sat.rotX += sat.spinVx + sat.rotSpeedX;
          sat.rotY += sat.spinVy + sat.rotSpeedY;
          sat.rotZ += sat.rotSpeedZ;

          sat.spinVx *= 0.965;
          sat.spinVy *= 0.965;
        }

        // Elliptical inclined orbit coordinates
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

        // Perspective projection
        const perspective = 540 / (540 + sat.z + 80);
        // Parallax depth shift based on depth layer
        const layerParallax = sat.depthLayer === 'FOREGROUND' ? 12 : sat.depthLayer === 'MIDGROUND' ? 6 : 2;
        sat.projX = centerX + sat.x * perspective + cam.mouseX * layerParallax;
        sat.projY = centerY + sat.y * perspective + floatY * 0.4 + cam.mouseY * layerParallax;
        sat.projScale = perspective;
        sat.projZ = sat.z;
      }

      // -----------------------------------------------------------------------
      // 4. RENDER BACKGROUND SATELLITES (z < 0: Behind Book)
      // -----------------------------------------------------------------------
      for (let i = 0; i < satellites.length; i++) {
        const sat = satellites[i];
        if (sat.projZ < 10) {
          renderSatellite(ctx, sat, lightX, lightY);
        }
      }

      // -----------------------------------------------------------------------
      // 5. RENDER 360° HERO 3D BOOK (The Showroom Centerpiece)
      // -----------------------------------------------------------------------
      ctx.save();
      const bookParallax = 8;
      ctx.translate(centerX + cam.mouseX * bookParallax, centerY + floatY + cam.mouseY * bookParallax);
      ctx.scale(bookPhys.hoverScale, bookPhys.hoverScale);

      // Book Dimensions
      const isCompact = width < 480;
      const bw = isCompact ? 170 : 215;
      const bh = isCompact ? 230 : 285;
      const bThick = isCompact ? 34 : 44;

      const hw = bw / 2;
      const hh = bh / 2;
      const ht = bThick / 2;

      // Studio Ground Shadow
      const shadowGrad = ctx.createRadialGradient(0, hh + 45, 10, 0, hh + 45, hw * 1.6);
      shadowGrad.addColorStop(0, 'rgba(5, 3, 4, 0.85)');
      shadowGrad.addColorStop(0.55, 'rgba(5, 3, 4, 0.35)');
      shadowGrad.addColorStop(1, 'rgba(5, 3, 4, 0)');
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(0, hh + 45, hw * 1.35, 24, 0, 0, Math.PI * 2);
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

      // Palette by Theme
      let coverTop = '#340b15';
      let coverBot = '#150308';
      let spineColor = '#4a0e1e';
      let bookTitle = 'MATHEMATICS';
      let subTitle = 'LUMOS ACADEMY';

      if (theme === 'english') {
        coverTop = '#141E32';
        coverBot = '#080C16';
        spineColor = '#1F2E4A';
        bookTitle = 'ENGLISH';
        subTitle = 'IELTS & GRAMMAR';
      } else if (theme === 'it') {
        coverTop = '#12251D';
        coverBot = '#06120D';
        spineColor = '#1B382C';
        bookTitle = 'FRONTEND IT';
        subTitle = 'CODE & SYSTEMS';
      } else if (theme === 'academic') {
        coverTop = '#32101B';
        coverBot = '#120409';
        spineColor = '#4D1829';
        bookTitle = 'DTM & GRANT';
        subTitle = 'AKADEMIK BLOK';
      }

      // Normal computations for backface culling & realistic illumination
      const fv01x = proj[1].x - proj[0].x;
      const fv01y = proj[1].y - proj[0].y;
      const fv03x = proj[3].x - proj[0].x;
      const fv03y = proj[3].y - proj[0].y;
      const frontNormalZ = fv01x * fv03y - fv01y * fv03x;

      const sv04x = proj[4].x - proj[0].x;
      const sv04y = proj[4].y - proj[0].y;
      const spineNormalZ = sv04x * fv03y - sv04y * fv03x;

      const pv15x = proj[5].x - proj[1].x;
      const pv15y = proj[5].y - proj[1].y;
      const pv12x = proj[2].x - proj[1].x;
      const pv12y = proj[2].y - proj[1].y;
      const pagesNormalZ = pv15x * pv12y - pv15y * pv12x;

      const topNormalZ = fv01x * sv04y - fv01y * sv04x;

      const bv32x = proj[2].x - proj[3].x;
      const bv32y = proj[2].y - proj[3].y;
      const bv37x = proj[7].x - proj[3].x;
      const bv37y = proj[7].y - proj[3].y;
      const bottomNormalZ = bv32x * bv37y - bv32y * bv37x;

      // Specular light angle alignment
      const lightDotBook = (Math.cos(ry) * lightX + Math.sin(ry) * lightZ) / 200;
      const lightHighlight = Math.max(0, Math.min(1, 0.5 + lightDotBook * 0.5));

      // 1. Back Cover (if facing camera)
      if (frontNormalZ < 0) {
        ctx.beginPath();
        ctx.moveTo(proj[4].x, proj[4].y);
        ctx.lineTo(proj[5].x, proj[5].y);
        ctx.lineTo(proj[6].x, proj[6].y);
        ctx.lineTo(proj[7].x, proj[7].y);
        ctx.closePath();
        ctx.fillStyle = coverBot;
        ctx.fill();
        ctx.strokeStyle = '#D9A93A';
        ctx.lineWidth = 1.3;
        ctx.stroke();

        // Embossed Back Seal
        const backMidX = (proj[4].x + proj[5].x + proj[6].x + proj[7].x) / 4;
        const backMidY = (proj[4].y + proj[5].y + proj[6].y + proj[7].y) / 4;
        ctx.save();
        ctx.translate(backMidX, backMidY);
        ctx.beginPath();
        ctx.arc(0, 0, 24, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(217, 169, 58, 0.55)';
        ctx.stroke();
        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = '#F4D27A';
        ctx.textAlign = 'center';
        ctx.fillText('LUMOS', 0, 3);
        ctx.restore();
      }

      // 2. Spine (Left edge)
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
        ctx.strokeStyle = '#F4D27A';
        ctx.lineWidth = 1.3;
        ctx.stroke();

        // Spine Gold Rib Lines
        ctx.strokeStyle = 'rgba(244, 210, 122, 0.65)';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        const sTop1X = proj[0].x * 0.75 + proj[3].x * 0.25;
        const sTop1Y = proj[0].y * 0.75 + proj[3].y * 0.25;
        const sTop2X = proj[4].x * 0.75 + proj[7].x * 0.25;
        const sTop2Y = proj[4].y * 0.75 + proj[7].y * 0.25;
        ctx.moveTo(sTop1X, sTop1Y);
        ctx.lineTo(sTop2X, sTop2Y);

        const sBot1X = proj[0].x * 0.25 + proj[3].x * 0.75;
        const sBot1Y = proj[0].y * 0.25 + proj[3].y * 0.75;
        const sBot2X = proj[4].x * 0.25 + proj[7].x * 0.75;
        const sBot2Y = proj[4].y * 0.25 + proj[7].y * 0.75;
        ctx.moveTo(sBot1X, sBot1Y);
        ctx.lineTo(sBot2X, sBot2Y);
        ctx.stroke();
      }

      // 3. Right Pages Block (Layered Ivory Pages)
      if (pagesNormalZ > 0) {
        ctx.beginPath();
        ctx.moveTo(proj[1].x, proj[1].y);
        ctx.lineTo(proj[5].x, proj[5].y);
        ctx.lineTo(proj[6].x, proj[6].y);
        ctx.lineTo(proj[2].x, proj[2].y);
        ctx.closePath();
        const pageGrad = ctx.createLinearGradient(proj[1].x, proj[1].y, proj[6].x, proj[6].y);
        pageGrad.addColorStop(0, 'rgba(248, 244, 235, 0.98)');
        pageGrad.addColorStop(0.5, 'rgba(224, 215, 198, 0.94)');
        pageGrad.addColorStop(1, 'rgba(182, 170, 150, 0.90)');
        ctx.fillStyle = pageGrad;
        ctx.fill();
        ctx.strokeStyle = 'rgba(217, 169, 58, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Individual page stratification lines
        ctx.strokeStyle = 'rgba(140, 128, 108, 0.35)';
        for (let l = 1; l <= 3; l++) {
          const rat = l / 4;
          ctx.beginPath();
          ctx.moveTo(proj[1].x * (1 - rat) + proj[5].x * rat, proj[1].y * (1 - rat) + proj[5].y * rat);
          ctx.lineTo(proj[2].x * (1 - rat) + proj[6].x * rat, proj[2].y * (1 - rat) + proj[6].y * rat);
          ctx.stroke();
        }
      }

      // 4. Top Pages Block
      if (topNormalZ > 0) {
        ctx.beginPath();
        ctx.moveTo(proj[0].x, proj[0].y);
        ctx.lineTo(proj[1].x, proj[1].y);
        ctx.lineTo(proj[5].x, proj[5].y);
        ctx.lineTo(proj[4].x, proj[4].y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(235, 228, 214, 0.95)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(217, 169, 58, 0.35)';
        ctx.stroke();
      }

      // 5. Bottom Pages Block
      if (bottomNormalZ > 0) {
        ctx.beginPath();
        ctx.moveTo(proj[3].x, proj[3].y);
        ctx.lineTo(proj[2].x, proj[2].y);
        ctx.lineTo(proj[6].x, proj[6].y);
        ctx.lineTo(proj[7].x, proj[7].y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(198, 188, 172, 0.95)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(217, 169, 58, 0.35)';
        ctx.stroke();
      }

      // 6. Front Cover Face (The Grand Masterpiece)
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
        coverGrad.addColorStop(1, '#080204');
        ctx.fillStyle = coverGrad;
        ctx.fill();

        // Warm Gold Specular Highlight Gleam
        if (lightHighlight > 0.4) {
          const specGrad = ctx.createRadialGradient(proj[0].x * 0.4 + proj[2].x * 0.6, proj[0].y * 0.4 + proj[2].y * 0.6, 10, proj[0].x * 0.4 + proj[2].x * 0.6, proj[0].y * 0.4 + proj[2].y * 0.6, hw);
          specGrad.addColorStop(0, `rgba(255, 238, 185, ${0.18 * lightHighlight})`);
          specGrad.addColorStop(1, 'rgba(255, 238, 185, 0)');
          ctx.fillStyle = specGrad;
          ctx.fill();
        }

        // Gold Rim
        ctx.strokeStyle = '#F4D27A';
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
        ctx.strokeStyle = 'rgba(244, 210, 122, 0.45)';
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
        ctx.fillStyle = 'rgba(244, 210, 122, 0.9)';
        ctx.textAlign = 'center';
        ctx.fillText(subTitle, 0, -hh * 0.42);

        // Gold Divider
        ctx.strokeStyle = 'rgba(217, 169, 58, 0.6)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(-45, -hh * 0.32);
        ctx.lineTo(45, -hh * 0.32);
        ctx.stroke();

        // Main Golden Book Title
        ctx.font = '900 19px "Playfair Display", serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(bookTitle, 0, -hh * 0.08);
        ctx.fillStyle = '#F4D27A';
        ctx.fillText(bookTitle, 0.5, -hh * 0.08 + 0.5);

        // Subtle Mathematical Engravings on Cover (π, ∫, √, x², f(x))
        if (theme === 'math') {
          ctx.font = 'italic 10px serif';
          ctx.fillStyle = 'rgba(244, 210, 122, 0.45)';
          ctx.fillText('π', -hw * 0.55, -hh * 0.12);
          ctx.fillText('∫', hw * 0.55, -hh * 0.12);
          ctx.fillText('√x', -hw * 0.52, hh * 0.18);
          ctx.fillText('x²', hw * 0.52, hh * 0.18);
        }

        // Emblem Seal
        ctx.strokeStyle = '#F4D27A';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(0, hh * 0.28, 22, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(0, hh * 0.28, 18, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(217, 169, 58, 0.5)';
        ctx.stroke();

        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = '#F4D27A';
        const sealGlyph = theme === 'math' ? '∑ π' : theme === 'english' ? 'EN' : theme === 'it' ? '< / >' : '★ DTM';
        ctx.fillText(sealGlyph, 0, hh * 0.28 + 4);

        ctx.restore();

        // Draped Silk Ribbon Bookmark (Warm Gold)
        ctx.beginPath();
        const rTopX = proj[0].x * 0.45 + proj[1].x * 0.55;
        const rTopY = proj[0].y * 0.45 + proj[1].y * 0.55;
        const rBotX = proj[3].x * 0.42 + proj[2].x * 0.58;
        const rBotY = proj[3].y * 0.42 + proj[2].y * 0.58 + 26;
        ctx.moveTo(rTopX, rTopY);
        ctx.quadraticCurveTo(rTopX + 8, (rTopY + rBotY) / 2, rBotX, rBotY);
        ctx.lineTo(rBotX - 7, rBotY - 5);
        ctx.lineTo(rBotX - 14, rBotY);
        ctx.quadraticCurveTo(rTopX - 6, (rTopY + rBotY) / 2, rTopX - 14, rTopY);
        ctx.closePath();
        const ribbonGrad = ctx.createLinearGradient(rTopX, rTopY, rBotX, rBotY);
        ribbonGrad.addColorStop(0, '#D9A93A');
        ribbonGrad.addColorStop(0.5, '#F4D27A');
        ribbonGrad.addColorStop(1, '#9E741A');
        ctx.fillStyle = ribbonGrad;
        ctx.fill();
      }

      ctx.restore();

      // -----------------------------------------------------------------------
      // 6. RENDER FOREGROUND SATELLITES (z >= 0: In Front of Book)
      // -----------------------------------------------------------------------
      for (let i = 0; i < satellites.length; i++) {
        const sat = satellites[i];
        if (sat.projZ >= 10) {
          renderSatellite(ctx, sat, lightX, lightY);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    // -------------------------------------------------------------------------
    // HELPER: RENDER SATELLITE OBJECT WITH STUDIO LIGHTING
    // -------------------------------------------------------------------------
    function renderSatellite(c: CanvasRenderingContext2D, sat: SatelliteObject3D, lx: number, ly: number) {
      c.save();
      c.translate(sat.projX, sat.projY);

      const hoverScale = sat.isHovered || sat.isGrabbed ? 1.25 : 1.0;
      c.scale(sat.projScale * hoverScale, sat.projScale * hoverScale);

      // Rotate around local axis
      c.rotate(sat.rotZ);

      // Gold Halo on Hover
      if (sat.isHovered || sat.isGrabbed) {
        c.fillStyle = 'rgba(217, 169, 58, 0.28)';
        c.beginPath();
        c.arc(0, 0, sat.size * 1.5, 0, Math.PI * 2);
        c.fill();
      }

      c.strokeStyle = sat.isHovered ? '#FFFFFF' : '#F4D27A';
      c.fillStyle = sat.isHovered ? '#FFFFFF' : '#F4D27A';
      c.lineWidth = sat.isHovered ? 1.6 : 1.1;

      // 1. Text / Formula / Glyph Elements
      if (
        sat.type === 'formula' ||
        sat.type === 'letter' ||
        sat.type === 'word' ||
        sat.type === 'code'
      ) {
        c.font = `bold ${Math.round(sat.size)}px monospace`;
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(sat.label || '', 0, 0);
      }

      // 2. Grand Horizontal Brushed Gold Orbital Ring
      else if (sat.type === 'ring_horizontal') {
        c.beginPath();
        c.ellipse(0, 0, sat.size, sat.size * 0.32, sat.rotX, 0, Math.PI * 2);
        c.lineWidth = 2.2;
        c.strokeStyle = '#D9A93A';
        c.stroke();

        // Subtle Coordinate Tick Marks along the Ring
        c.lineWidth = 1.0;
        c.strokeStyle = 'rgba(244, 210, 122, 0.6)';
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
          const cosA = Math.cos(a + sat.rotY);
          const sinA = Math.sin(a + sat.rotY);
          const rx1 = cosA * (sat.size - 4);
          const ry1 = sinA * (sat.size - 4) * 0.32;
          const rx2 = cosA * (sat.size + 4);
          const ry2 = sinA * (sat.size + 4) * 0.32;
          c.beginPath();
          c.moveTo(rx1, ry1);
          c.lineTo(rx2, ry2);
          c.stroke();
        }
      }

      // 3. Nested Double Ring
      else if (sat.type === 'ring_nested') {
        c.beginPath();
        c.ellipse(0, 0, sat.size, sat.size * 0.5, sat.rotY, 0, Math.PI * 2);
        c.stroke();

        c.beginPath();
        c.ellipse(0, 0, sat.size * 0.72, sat.size * 0.36, sat.rotY + 0.3, 0, Math.PI * 2);
        c.strokeStyle = 'rgba(217, 169, 58, 0.65)';
        c.stroke();
      }

      // 4. Elliptical Loop
      else if (sat.type === 'ring_elliptical') {
        c.beginPath();
        c.ellipse(0, 0, sat.size, sat.size * 0.38, sat.rotX + sat.rotY, 0, Math.PI * 2);
        c.stroke();
      }

      // 5. Parabola Curve y = x²
      else if (sat.type === 'parabola') {
        c.beginPath();
        for (let px = -sat.size; px <= sat.size; px += 3) {
          const py = (0.045 * px * px - 14);
          if (px === -sat.size) c.moveTo(px, py);
          else c.lineTo(px, py);
        }
        c.stroke();
      }

      // 6. Sine Wave Ribbon
      else if (sat.type === 'sinewave') {
        c.beginPath();
        for (let px = -sat.size; px <= sat.size; px += 3) {
          const py = Math.sin(px * 0.16 + sat.rotY) * 11;
          if (px === -sat.size) c.moveTo(px, py);
          else c.lineTo(px, py);
        }
        c.stroke();
      }

      // 7. Coordinate Tripod (X, Y, Z)
      else if (sat.type === 'axes') {
        c.beginPath();
        c.moveTo(0, 0); c.lineTo(sat.size, 0);
        c.moveTo(0, 0); c.lineTo(0, -sat.size);
        c.moveTo(0, 0); c.lineTo(-sat.size * 0.65, sat.size * 0.65);
        c.stroke();

        // Little axis labels
        c.font = '8px monospace';
        c.fillText('x', sat.size + 4, 2);
        c.fillText('y', 2, -sat.size - 4);
        c.fillText('z', -sat.size * 0.65 - 6, sat.size * 0.65 + 6);
      }

      // 8. Trefoil Knot
      else if (sat.type === 'knot') {
        c.beginPath();
        for (let t = 0; t <= Math.PI * 2; t += 0.18) {
          const kx = (Math.sin(t) + 2 * Math.sin(2 * t)) * (sat.size * 0.32);
          const ky = (Math.cos(t) - 2 * Math.cos(2 * t)) * (sat.size * 0.32);
          if (t === 0) c.moveTo(kx, ky);
          else c.lineTo(kx, ky);
        }
        c.stroke();
      }

      // 9. Spiral Helix
      else if (sat.type === 'helix') {
        c.beginPath();
        for (let step = 0; step <= 18; step++) {
          const theta = (step / 18) * Math.PI * 4;
          const r = (step / 18) * sat.size;
          const hx = Math.cos(theta) * r;
          const hy = Math.sin(theta) * r * 0.45;
          if (step === 0) c.moveTo(hx, hy);
          else c.lineTo(hx, hy);
        }
        c.stroke();
      }

      // 10. Gemstone Octahedron
      else if (sat.type === 'octahedron') {
        const os = sat.size * 0.8;
        c.beginPath();
        c.moveTo(0, -os); c.lineTo(os * 0.85, 0); c.lineTo(0, os); c.lineTo(-os * 0.85, 0); c.closePath();
        c.stroke();
        c.beginPath();
        c.moveTo(-os * 0.85, 0); c.lineTo(os * 0.85, 0);
        c.moveTo(0, -os); c.lineTo(0, os);
        c.strokeStyle = 'rgba(217, 169, 58, 0.5)';
        c.stroke();
      }

      c.restore();
    }

    // -------------------------------------------------------------------------
    // 7. UNIFIED POINTER HIT-TESTING & MULTI-OBJECT DRAG INTERACTION
    // -------------------------------------------------------------------------
    const handlePointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      const satellites = satellitesRef.current;
      // Check Satellites first (hit radius 28px)
      let grabbedSatId: string | null = null;
      for (let i = satellites.length - 1; i >= 0; i--) {
        const sat = satellites[i];
        const dx = px - sat.projX;
        const dy = py - sat.projY;
        const hitRadius = Math.max(sat.size * sat.projScale * 1.3, 24);
        if (dx * dx + dy * dy < hitRadius * hitRadius) {
          grabbedSatId = sat.id;
          sat.isGrabbed = true;
          sat.spinVx = 0;
          sat.spinVy = 0;
          break;
        }
      }

      if (grabbedSatId) {
        activeGrabTargetRef.current = grabbedSatId;
        bookPhysicsRef.current.lastPointerX = e.clientX;
        bookPhysicsRef.current.lastPointerY = e.clientY;
        bookPhysicsRef.current.lastTime = performance.now();
        bookPhysicsRef.current.samples = [{ x: e.clientX, y: e.clientY, time: performance.now() }];
        try {
          canvas.setPointerCapture(e.pointerId);
        } catch (_) {}
        return;
      }

      // Check Book Centerpiece (hit radius 140px around center)
      const cdx = px - currentCenterX;
      const cdy = py - (currentCenterY + currentFloatY);
      if (cdx * cdx + cdy * cdy < 140 * 140) {
        activeGrabTargetRef.current = 'book';
        bookPhysicsRef.current.isDragging = true;
        bookPhysicsRef.current.angVx = 0;
        bookPhysicsRef.current.angVy = 0;
        bookPhysicsRef.current.lastPointerX = e.clientX;
        bookPhysicsRef.current.lastPointerY = e.clientY;
        bookPhysicsRef.current.lastTime = performance.now();
        bookPhysicsRef.current.samples = [{ x: e.clientX, y: e.clientY, time: performance.now() }];
        try {
          canvas.setPointerCapture(e.pointerId);
        } catch (_) {}
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      // Update Mouse Parallax
      const normX = (px - width / 2) / (width / 2);
      const normY = (py - height / 2) / (height / 2);
      cameraRef.current.targetMouseX = normX;
      cameraRef.current.targetMouseY = normY;

      const activeTarget = activeGrabTargetRef.current;
      const now = performance.now();

      // If dragging an object
      if (activeTarget) {
        const dx = e.clientX - bookPhysicsRef.current.lastPointerX;
        const dy = e.clientY - bookPhysicsRef.current.lastPointerY;

        bookPhysicsRef.current.lastPointerX = e.clientX;
        bookPhysicsRef.current.lastPointerY = e.clientY;
        bookPhysicsRef.current.lastTime = now;

        // Keep 8 samples for high-fidelity velocity
        bookPhysicsRef.current.samples.push({ x: e.clientX, y: e.clientY, time: now });
        if (bookPhysicsRef.current.samples.length > 8) {
          bookPhysicsRef.current.samples.shift();
        }

        if (activeTarget === 'book') {
          // Horizontal turntable rotation driven by pointer
          bookPhysicsRef.current.rotY += dx * 0.009;
          bookPhysicsRef.current.rotX += dy * 0.003;
          bookPhysicsRef.current.rotX = Math.max(-0.25, Math.min(0.25, bookPhysicsRef.current.rotX));
        } else {
          // Satellite local rotation
          const sat = satellitesRef.current.find((s) => s.id === activeTarget);
          if (sat) {
            sat.rotY += dx * 0.015;
            sat.rotX += dy * 0.015;
          }
        }
        return;
      }

      // Hover Hit-testing
      const satellites = satellitesRef.current;
      let hoveredSat = false;
      for (let i = 0; i < satellites.length; i++) {
        const sat = satellites[i];
        const distSq = (px - sat.projX) ** 2 + (py - sat.projY) ** 2;
        const hitRadius = Math.max(sat.size * sat.projScale * 1.3, 24);
        if (distSq < hitRadius * hitRadius) {
          sat.isHovered = true;
          hoveredSat = true;
        } else {
          sat.isHovered = false;
        }
      }

      const cdx = px - currentCenterX;
      const cdy = py - (currentCenterY + currentFloatY);
      const isOverBook = cdx * cdx + cdy * cdy < 130 * 130;
      bookPhysicsRef.current.isHovered = isOverBook;

      canvas.style.cursor = isOverBook || hoveredSat ? 'grab' : 'default';
    };

    const handlePointerUp = (e: PointerEvent) => {
      const activeTarget = activeGrabTargetRef.current;
      if (!activeTarget) return;

      const samples = bookPhysicsRef.current.samples;
      let calculatedVx = 0;
      let calculatedVy = 0;

      if (samples.length >= 2) {
        const first = samples[0];
        const last = samples[samples.length - 1];
        const dtMs = Math.max(last.time - first.time, 16);
        calculatedVx = ((last.x - first.x) / dtMs) * 16.6;
        calculatedVy = ((last.y - first.y) / dtMs) * 16.6;
      }

      if (activeTarget === 'book') {
        bookPhysicsRef.current.isDragging = false;
        bookPhysicsRef.current.angVy = calculatedVx * 0.0075;
        bookPhysicsRef.current.angVx = calculatedVy * 0.0025;
      } else {
        const sat = satellitesRef.current.find((s) => s.id === activeTarget);
        if (sat) {
          sat.isGrabbed = false;
          sat.spinVy = calculatedVx * 0.012;
          sat.spinVx = calculatedVy * 0.012;
        }
      }

      activeGrabTargetRef.current = null;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch (_) {}
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('resize', updateSize);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointercancel', handlePointerUp);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [theme]);

  return (
    <section
      id="courses"
      ref={containerRef}
      className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-[1380px] mx-auto z-10 select-none"
      style={{ touchAction: 'pan-y' }}
    >
      {/* -----------------------------------------------------------------------
          TOP HEADER: Badge & Luxury Title
          ----------------------------------------------------------------------- */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16090D] border border-[#D9A93A]/40 text-xs font-bold uppercase tracking-widest text-[#D9A93A] shadow-lg shadow-[#D9A93A]/10">
          <Sparkles className="h-3.5 w-3.5" />
          <span>LUMOS 3D Ekotizimi</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury-serif font-black text-[#F7F4EE] tracking-tight">
          Bizning <span className="text-[#D9A93A]">kurslarimiz</span>
        </h2>

        <p className="text-xs sm:text-sm text-[#A9A3A0] leading-relaxed max-w-2xl mx-auto">
          Har bir yo‘nalish uchun xalqaro standartlarga asoslangan mukammal o‘quv dasturlari va interaktiv 3D ta’lim muhiti.
        </p>
      </div>

      {/* -----------------------------------------------------------------------
          COURSE CATEGORY SELECTOR PILLS
          ----------------------------------------------------------------------- */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
        {INITIAL_COURSES.map((course) => {
          const isSelected = course.id === activeCourse.id;
          return (
            <button
              key={course.id}
              type="button"
              onClick={() => handleSelectCourse(course)}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 border ${
                isSelected
                  ? 'bg-gradient-to-r from-[#D9A93A] via-[#F4D27A] to-[#D9A93A] text-[#0A0708] border-[#FFF2C6]/50 shadow-[0_4px_20px_rgba(217,169,58,0.35)] scale-105'
                  : 'bg-[#120609]/80 text-[#BDB5B0] border-[#D9A93A]/25 hover:border-[#D9A93A]/60 hover:text-[#F7F4EE]'
              }`}
            >
              <span>{course.title}</span>
            </button>
          );
        })}
      </div>

      {/* -----------------------------------------------------------------------
          MAIN 3D LABORATORY SHOWROOM STAGE
          ----------------------------------------------------------------------- */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#18080E]/90 via-[#100407]/95 to-[#0A0204] border border-[#D9A93A]/30 p-6 sm:p-8 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Subtle Ambient Radial Lighting in Background */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-radial from-[#D9A93A]/12 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-radial from-[#4A0E1A]/20 to-transparent blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          {/* LEFT COLUMN: Active Course Information & Specifications */}
          <div
            className={`lg:col-span-6 space-y-5 transition-all duration-300 ${
              isTransitioning ? 'opacity-40 translate-y-2' : 'opacity-100 translate-y-0'
            }`}
          >
            {/* Top Meta: Category & Level */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-md bg-[#D9A93A]/15 border border-[#D9A93A]/30 text-[11px] font-bold text-[#F4D27A] uppercase tracking-wider">
                  {activeCourse.category}
                </span>
                <span className="px-3 py-1 rounded-md bg-[#2A0F17]/60 border border-[#D9A93A]/20 text-[11px] font-medium text-[#D5CECA]">
                  {activeCourse.level || 'Barcha bosqichlar'}
                </span>
              </div>

              {/* Course Navigation Arrows */}
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
                <span className="text-2xl sm:text-3xl font-luxury-serif font-black text-[#F4D27A]">
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
                  className="text-xs font-bold text-[#D9A93A] hover:text-[#F4D27A] hover:underline flex items-center gap-1.5 cursor-pointer transition-colors"
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
              <div className="w-[88%] h-[88%] rounded-full bg-radial from-[#D9A93A]/22 via-[#4A0E17]/28 to-transparent blur-3xl" />
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
