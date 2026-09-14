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

interface Sculpture3D {
  id: string;
  type:
    | 'ring_grand_horizontal'
    | 'ring_nested_tilted'
    | 'parabola_volumetric'
    | 'sinewave_tubular'
    | 'saddle_surface'
    | 'double_helix'
    | 'coord_tripod'
    | 'vector_arrow'
    | 'prism_3d'
    | 'pyramid_3d'
    | 'formula_3d'
    | 'letter_3d'
    | 'word_3d'
    | 'code_block_3d';
  label?: string;
  theme: CourseVisualTheme | 'universal';
  depthLayer: DepthLayer;
  // 3D Orbital Coordinates
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
  orbitInclination: number;
  orbitEccentricity: number;
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
  // Dynamic Transition Opacity
  transitionAlpha: number;
  // Projected Screen Coordinates
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

  // Determine Course Theme for 3D Art-Direction
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
    }, 380);
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
  // 3D CANVAS & VOLUMETRIC ART-DIRECTED LABORATORY ENGINE
  // ---------------------------------------------------------------------------
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Book 360° Showroom Turntable Physics & 3D Tilt State
  const bookPhysicsRef = useRef({
    // Base Turntable Angles
    rotX: -0.16, // subtle downward perspective
    rotY: 0.42,  // showroom angle displaying cover and spine
    rotZ: -0.02,
    // Hover 3D Tilt offsets
    tiltX: 0,
    tiltY: 0,
    // Velocities
    angVx: 0,
    angVy: 0,
    isDragging: false,
    lastPointerX: 0,
    lastPointerY: 0,
    lastTime: 0,
    samples: [] as { x: number; y: number; time: number }[],
    isHovered: false,
    hoverScale: 1.0,
    hoverLift: 0, // slight vertical float lift on hover
  });

  // Active Grab Target ('book' | sculptureId | null)
  const activeGrabTargetRef = useRef<string | null>(null);

  // Sculptures Collection Ref
  const sculpturesRef = useRef<Sculpture3D[]>([]);

  // Camera & Mouse Parallax Ref
  const cameraRef = useRef({
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
  });

  // Theme Tracker Ref
  const currentThemeRef = useRef<CourseVisualTheme>(theme);
  currentThemeRef.current = theme;

  // Build Subject-Specific 3D Sculptures dynamically when Theme or Screen Size changes
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    const list: Sculpture3D[] = [];

    // =========================================================================
    // 1. UNIVERSAL PRIMARY HERO ORBITAL RINGS (Always Present)
    // =========================================================================
    // A. Grand Horizontal Brushed Gold Orbital Ring (Encircles book with depth)
    list.push({
      id: 'prim-ring-grand',
      type: 'ring_grand_horizontal',
      theme: 'universal',
      depthLayer: 'FOREGROUND',
      orbitRadius: 195,
      orbitSpeed: 0.00085,
      orbitPhase: 0.4,
      orbitInclination: 0.16,
      orbitEccentricity: 0.94,
      x: 0, y: 0, z: 0,
      rotX: 0.35, rotY: 0, rotZ: 0,
      rotSpeedX: 0.0002, rotSpeedY: 0.0006, rotSpeedZ: 0.0002,
      isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
      size: 195,
      baseOpacity: 0.92,
      transitionAlpha: 1.0,
      projX: 0, projY: 0, projScale: 1, projZ: 0,
    });

    // B. Nested Tilted Double Ring (Secondary Hero Orbital)
    list.push({
      id: 'prim-ring-nested',
      type: 'ring_nested_tilted',
      theme: 'universal',
      depthLayer: 'MIDGROUND',
      orbitRadius: 240,
      orbitSpeed: -0.0007,
      orbitPhase: 2.5,
      orbitInclination: -0.38,
      orbitEccentricity: 0.88,
      x: 0, y: 0, z: 0,
      rotX: -0.4, rotY: 0.3, rotZ: 0.2,
      rotSpeedX: 0.0004, rotSpeedY: -0.0005, rotSpeedZ: 0.0002,
      isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
      size: 46,
      baseOpacity: 0.85,
      transitionAlpha: 1.0,
      projX: 0, projY: 0, projScale: 1, projZ: 0,
    });

    // =========================================================================
    // 2. SUBJECT-SPECIFIC SCULPTURE SUITES
    // =========================================================================
    if (theme === 'math') {
      // Volumetric Parabola Ribbon (y = x²)
      list.push({
        id: 'math-parabola',
        type: 'parabola_volumetric',
        label: 'y = x²',
        theme: 'math',
        depthLayer: 'MIDGROUND',
        orbitRadius: 220,
        orbitSpeed: 0.00075,
        orbitPhase: 1.1,
        orbitInclination: 0.32,
        orbitEccentricity: 0.90,
        x: 0, y: 0, z: 0,
        rotX: 0.25, rotY: 0.45, rotZ: 0.1,
        rotSpeedX: 0.0003, rotSpeedY: 0.0006, rotSpeedZ: 0.0002,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 38,
        baseOpacity: 0.85,
        transitionAlpha: 1.0,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });

      // Tubular Sine Wave Ribbon (y = sin(x))
      list.push({
        id: 'math-sinewave',
        type: 'sinewave_tubular',
        label: 'y = sin(x)',
        theme: 'math',
        depthLayer: 'MIDGROUND',
        orbitRadius: 250,
        orbitSpeed: -0.0007,
        orbitPhase: 3.7,
        orbitInclination: -0.34,
        orbitEccentricity: 0.86,
        x: 0, y: 0, z: 0,
        rotX: -0.3, rotY: 0.55, rotZ: 0.15,
        rotSpeedX: 0.0004, rotSpeedY: 0.0006, rotSpeedZ: 0.0003,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 40,
        baseOpacity: 0.85,
        transitionAlpha: 1.0,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });

      // Parametric 3D Saddle Surface Mesh (Hyperbolic Paraboloid)
      list.push({
        id: 'math-saddle',
        type: 'saddle_surface',
        theme: 'math',
        depthLayer: 'BACKGROUND',
        orbitRadius: 280,
        orbitSpeed: 0.0005,
        orbitPhase: 5.2,
        orbitInclination: 0.42,
        orbitEccentricity: 0.84,
        x: 0, y: 0, z: 0,
        rotX: 0.5, rotY: 0.3, rotZ: -0.2,
        rotSpeedX: 0.0005, rotSpeedY: 0.0004, rotSpeedZ: 0.0002,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 36,
        baseOpacity: 0.80,
        transitionAlpha: 1.0,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });

      // 3D Double Helix Spiral
      list.push({
        id: 'math-helix',
        type: 'double_helix',
        theme: 'math',
        depthLayer: 'MIDGROUND',
        orbitRadius: 265,
        orbitSpeed: -0.00055,
        orbitPhase: 2.1,
        orbitInclination: -0.28,
        orbitEccentricity: 0.89,
        x: 0, y: 0, z: 0,
        rotX: 0.3, rotY: 0.6, rotZ: 0.2,
        rotSpeedX: 0.0006, rotSpeedY: 0.0007, rotSpeedZ: 0.0003,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 34,
        baseOpacity: 0.80,
        transitionAlpha: 1.0,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });

      // 3D Coordinate Tripod (X, Y, Z)
      list.push({
        id: 'math-tripod',
        type: 'coord_tripod',
        label: 'XYZ',
        theme: 'math',
        depthLayer: 'FOREGROUND',
        orbitRadius: 165,
        orbitSpeed: 0.0011,
        orbitPhase: 4.4,
        orbitInclination: 0.22,
        orbitEccentricity: 0.92,
        x: 0, y: 0, z: 0,
        rotX: 0.35, rotY: 0.4, rotZ: -0.15,
        rotSpeedX: 0.0007, rotSpeedY: 0.0008, rotSpeedZ: 0.0004,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 26,
        baseOpacity: 0.88,
        transitionAlpha: 1.0,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });

      // Architectural Vector Arrow
      list.push({
        id: 'math-vector',
        type: 'vector_arrow',
        label: 'v⃗',
        theme: 'math',
        depthLayer: 'BACKGROUND',
        orbitRadius: 295,
        orbitSpeed: -0.00045,
        orbitPhase: 0.8,
        orbitInclination: -0.45,
        orbitEccentricity: 0.85,
        x: 0, y: 0, z: 0,
        rotX: 0.4, rotY: 0.2, rotZ: 0.5,
        rotSpeedX: 0.0005, rotSpeedY: 0.0004, rotSpeedZ: 0.0002,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 32,
        baseOpacity: 0.75,
        transitionAlpha: 1.0,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });

      // 3D Triangular Prism
      list.push({
        id: 'math-prism',
        type: 'prism_3d',
        theme: 'math',
        depthLayer: 'MIDGROUND',
        orbitRadius: 235,
        orbitSpeed: 0.0008,
        orbitPhase: 5.8,
        orbitInclination: 0.38,
        orbitEccentricity: 0.88,
        x: 0, y: 0, z: 0,
        rotX: 0.3, rotY: 0.5, rotZ: 0.1,
        rotSpeedX: 0.0006, rotSpeedY: 0.0007, rotSpeedZ: 0.0003,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 24,
        baseOpacity: 0.80,
        transitionAlpha: 1.0,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });

      // Floating Mathematical Formulas (π, ∑, √, ∞, f(x))
      const mathGlyphs = [
        { label: 'π', r: 155, speed: 0.0013, phase: 0.3, inc: 0.22, layer: 'FOREGROUND' as const },
        { label: '∑', r: 160, speed: -0.0011, phase: 2.2, inc: -0.26, layer: 'FOREGROUND' as const },
        { label: '√x', r: 165, speed: 0.0012, phase: 4.1, inc: 0.18, layer: 'FOREGROUND' as const },
        { label: '∞', r: 275, speed: 0.0006, phase: 1.7, inc: 0.35, layer: 'BACKGROUND' as const },
        { label: 'f(x)', r: 305, speed: -0.0005, phase: 4.8, inc: -0.32, layer: 'BACKGROUND' as const },
      ];
      mathGlyphs.forEach((mg, idx) => {
        list.push({
          id: `math-glyph-${idx}`,
          type: 'formula_3d',
          label: mg.label,
          theme: 'math',
          depthLayer: mg.layer,
          orbitRadius: mg.r,
          orbitSpeed: mg.speed,
          orbitPhase: mg.phase,
          orbitInclination: mg.inc,
          orbitEccentricity: 0.92,
          x: 0, y: 0, z: 0,
          rotX: 0, rotY: 0, rotZ: 0,
          rotSpeedX: 0.0007, rotSpeedY: 0.0011, rotSpeedZ: 0.0004,
          isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
          size: mg.layer === 'FOREGROUND' ? 17 : 13,
          baseOpacity: mg.layer === 'FOREGROUND' ? 0.88 : 0.65,
          transitionAlpha: 1.0,
          projX: 0, projY: 0, projScale: 1, projZ: 0,
        });
      });
    } else if (theme === 'english') {
      // Extruded 3D Letters (A, B, C, X, Y, Z)
      const engLetters = [
        { label: 'A', r: 165, speed: 0.0012, phase: 0.5, inc: 0.24, layer: 'FOREGROUND' as const, size: 28 },
        { label: 'B', r: 215, speed: -0.0008, phase: 2.3, inc: -0.32, layer: 'MIDGROUND' as const, size: 25 },
        { label: 'C', r: 250, speed: 0.0007, phase: 4.1, inc: 0.28, layer: 'MIDGROUND' as const, size: 24 },
        { label: 'Z', r: 285, speed: -0.0005, phase: 5.6, inc: -0.35, layer: 'BACKGROUND' as const, size: 22 },
      ];
      engLetters.forEach((el, idx) => {
        list.push({
          id: `eng-letter-${idx}`,
          type: 'letter_3d',
          label: el.label,
          theme: 'english',
          depthLayer: el.layer,
          orbitRadius: el.r,
          orbitSpeed: el.speed,
          orbitPhase: el.phase,
          orbitInclination: el.inc,
          orbitEccentricity: 0.90,
          x: 0, y: 0, z: 0,
          rotX: 0.2, rotY: 0.4, rotZ: 0.1,
          rotSpeedX: 0.0006, rotSpeedY: 0.0009, rotSpeedZ: 0.0003,
          isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
          size: el.size,
          baseOpacity: 0.88,
          transitionAlpha: 1.0,
          projX: 0, projY: 0, projScale: 1, projZ: 0,
        });
      });

      // 3D Typographic Blocks (ENGLISH, LEARN, SPEAK, THINK, GROW)
      const engWords = [
        { label: 'ENGLISH', r: 160, speed: 0.0011, phase: 3.8, inc: -0.22, layer: 'FOREGROUND' as const },
        { label: 'LEARN', r: 230, speed: 0.00075, phase: 1.2, inc: 0.35, layer: 'MIDGROUND' as const },
        { label: 'SPEAK', r: 260, speed: -0.00065, phase: 3.4, inc: -0.38, layer: 'MIDGROUND' as const },
        { label: 'THINK', r: 290, speed: 0.00055, phase: 5.0, inc: 0.30, layer: 'BACKGROUND' as const },
        { label: 'GROW', r: 310, speed: -0.00045, phase: 0.9, inc: -0.25, layer: 'BACKGROUND' as const },
      ];
      engWords.forEach((ew, idx) => {
        list.push({
          id: `eng-word-${idx}`,
          type: 'word_3d',
          label: ew.label,
          theme: 'english',
          depthLayer: ew.layer,
          orbitRadius: ew.r,
          orbitSpeed: ew.speed,
          orbitPhase: ew.phase,
          orbitInclination: ew.inc,
          orbitEccentricity: 0.88,
          x: 0, y: 0, z: 0,
          rotX: 0.1, rotY: 0.3, rotZ: 0,
          rotSpeedX: 0.0004, rotSpeedY: 0.0007, rotSpeedZ: 0.0002,
          isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
          size: ew.layer === 'FOREGROUND' ? 16 : 13,
          baseOpacity: ew.layer === 'FOREGROUND' ? 0.88 : 0.78,
          transitionAlpha: 1.0,
          projX: 0, projY: 0, projScale: 1, projZ: 0,
        });
      });
    } else if (theme === 'it') {
      const itItems = [
        { label: '<dev/>', r: 165, speed: 0.0012, phase: 0.6, inc: 0.22, layer: 'FOREGROUND' as const },
        { label: '{ state }', r: 220, speed: -0.0008, phase: 2.6, inc: -0.32, layer: 'MIDGROUND' as const },
        { label: 'React.js', r: 250, speed: 0.0007, phase: 4.4, inc: 0.28, layer: 'MIDGROUND' as const },
        { label: 'async/await', r: 285, speed: -0.0005, phase: 1.4, inc: -0.34, layer: 'BACKGROUND' as const },
        { label: 'API 200 OK', r: 310, speed: 0.00045, phase: 5.1, inc: 0.30, layer: 'BACKGROUND' as const },
      ];
      itItems.forEach((it, idx) => {
        list.push({
          id: `it-block-${idx}`,
          type: 'code_block_3d',
          label: it.label,
          theme: 'it',
          depthLayer: it.layer,
          orbitRadius: it.r,
          orbitSpeed: it.speed,
          orbitPhase: it.phase,
          orbitInclination: it.inc,
          orbitEccentricity: 0.89,
          x: 0, y: 0, z: 0,
          rotX: 0.2, rotY: 0.4, rotZ: 0.1,
          rotSpeedX: 0.0005, rotSpeedY: 0.0008, rotSpeedZ: 0.0003,
          isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
          size: it.layer === 'FOREGROUND' ? 16 : 13,
          baseOpacity: it.layer === 'FOREGROUND' ? 0.88 : 0.75,
          transitionAlpha: 1.0,
          projX: 0, projY: 0, projScale: 1, projZ: 0,
        });
      });
    } else {
      // Academic / DTM / Presidential Schools
      const acadItems = [
        { label: '189+', r: 160, speed: 0.0012, phase: 0.5, inc: 0.24, layer: 'FOREGROUND' as const },
        { label: '★ DTM', r: 220, speed: -0.0008, phase: 2.4, inc: -0.30, layer: 'MIDGROUND' as const },
        { label: 'GRANT', r: 255, speed: 0.0007, phase: 4.2, inc: 0.28, layer: 'MIDGROUND' as const },
        { label: 'Cambridge', r: 290, speed: -0.0005, phase: 1.2, inc: -0.32, layer: 'BACKGROUND' as const },
      ];
      acadItems.forEach((ac, idx) => {
        list.push({
          id: `acad-item-${idx}`,
          type: 'word_3d',
          label: ac.label,
          theme: 'academic',
          depthLayer: ac.layer,
          orbitRadius: ac.r,
          orbitSpeed: ac.speed,
          orbitPhase: ac.phase,
          orbitInclination: ac.inc,
          orbitEccentricity: 0.90,
          x: 0, y: 0, z: 0,
          rotX: 0.2, rotY: 0.4, rotZ: 0.1,
          rotSpeedX: 0.0005, rotSpeedY: 0.0008, rotSpeedZ: 0.0003,
          isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
          size: ac.layer === 'FOREGROUND' ? 16 : 13,
          baseOpacity: ac.layer === 'FOREGROUND' ? 0.88 : 0.75,
          transitionAlpha: 1.0,
          projX: 0, projY: 0, projScale: 1, projZ: 0,
        });
      });
    }

    // Adaptive object limit based on device capability
    const maxObjects = isMobile ? 7 : isTablet ? 11 : 16;
    sculpturesRef.current = list.slice(0, maxObjects);
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

    // 3D vector rotation buffer (Zero GC allocation)
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

      // Smooth Camera Mouse Parallax
      cam.mouseX += (cam.targetMouseX - cam.mouseX) * 0.05;
      cam.mouseY += (cam.targetMouseY - cam.mouseY) * 0.05;

      // -----------------------------------------------------------------------
      // 1. 3D HOVER TILT & HORIZONTAL TURNTABLE MOMENTUM
      // -----------------------------------------------------------------------
      // When not actively dragging, mouse position smoothly imparts 3D tilt (X: ±6°, Y: ±9°)
      if (!bookPhys.isDragging) {
        const targetTiltX = -cam.mouseY * 0.11; // subtle X tilt
        const targetTiltY = cam.mouseX * 0.16;  // subtle Y tilt
        bookPhys.tiltX += (targetTiltX - bookPhys.tiltX) * 0.06;
        bookPhys.tiltY += (targetTiltY - bookPhys.tiltY) * 0.06;

        bookPhys.rotY += bookPhys.angVy;
        bookPhys.rotX += bookPhys.angVx;

        // Realistic friction damping
        bookPhys.angVy *= 0.965;
        bookPhys.angVx *= 0.965;

        // Clamped pitch (turntable freedom, no tumbling)
        bookPhys.rotX = Math.max(-0.25, Math.min(0.25, bookPhys.rotX));

        if (Math.abs(bookPhys.angVy) < 0.0001) bookPhys.angVy = 0;
        if (Math.abs(bookPhys.angVx) < 0.0001) bookPhys.angVx = 0;

        // Subtle showroom breathing when stationary
        if (bookPhys.angVy === 0 && bookPhys.angVx === 0) {
          bookPhys.rotY += Math.cos(time * 0.3) * 0.0002;
        }
      } else {
        // While dragging, hover tilt smoothly zeros out
        bookPhys.tiltX *= 0.85;
        bookPhys.tiltY *= 0.85;
      }

      // Hover scale & slight vertical float lift
      const targetHoverScale = bookPhys.isHovered ? 1.025 : 1.0;
      const targetHoverLift = bookPhys.isHovered ? -6 : 0;
      bookPhys.hoverScale += (targetHoverScale - bookPhys.hoverScale) * 0.12;
      bookPhys.hoverLift += (targetHoverLift - bookPhys.hoverLift) * 0.10;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const floatY = Math.sin(time * 1.1) * 2.5 + bookPhys.hoverLift;
      currentCenterX = centerX;
      currentCenterY = centerY;
      currentFloatY = floatY;

      // -----------------------------------------------------------------------
      // 2. TRAVELING WARM GOLD KEY LIGHT SOURCE
      // -----------------------------------------------------------------------
      const lightAngle = time * 0.32;
      const lightX = Math.cos(lightAngle) * 240;
      const lightY = Math.sin(lightAngle * 0.7) * 90 - 45;
      const lightZ = Math.sin(lightAngle) * 200;

      // Subtle Atmospheric 3D Coordinate Grid Floor (Deep Background)
      ctx.save();
      ctx.translate(centerX, centerY + 140);
      ctx.strokeStyle = 'rgba(217, 169, 58, 0.04)';
      ctx.lineWidth = 1;
      for (let gx = -200; gx <= 200; gx += 50) {
        ctx.beginPath();
        ctx.moveTo(gx * 0.55, -22);
        ctx.lineTo(gx * 1.45, 65);
        ctx.stroke();
      }
      for (let gz = 0; gz <= 65; gz += 22) {
        const factor = gz / 65;
        const span = 115 + factor * 155;
        ctx.beginPath();
        ctx.moveTo(-span, gz);
        ctx.lineTo(span, gz);
        ctx.stroke();
      }
      ctx.restore();

      // -----------------------------------------------------------------------
      // 3. UPDATE SCULPTURES & DEPTH PROJECTION
      // -----------------------------------------------------------------------
      const sculptures = sculpturesRef.current;
      for (let i = 0; i < sculptures.length; i++) {
        const sc = sculptures[i];

        if (!sc.isGrabbed) {
          sc.orbitPhase += sc.orbitSpeed;
          sc.rotX += sc.spinVx + sc.rotSpeedX;
          sc.rotY += sc.spinVy + sc.rotSpeedY;
          sc.rotZ += sc.rotSpeedZ;

          sc.spinVx *= 0.965;
          sc.spinVy *= 0.965;
        }

        // Elliptical inclined orbit coordinates
        const baseOrbX = Math.cos(sc.orbitPhase) * sc.orbitRadius;
        const baseOrbY = Math.sin(sc.orbitPhase) * sc.orbitRadius * sc.orbitEccentricity;
        const baseOrbZ = 0;

        // Apply orbital inclination
        const cosInc = Math.cos(sc.orbitInclination);
        const sinInc = Math.sin(sc.orbitInclination);
        const inclinedY = baseOrbY * cosInc - baseOrbZ * sinInc;
        const inclinedZ = baseOrbY * sinInc + baseOrbZ * cosInc;

        sc.x = baseOrbX;
        sc.y = inclinedY;
        sc.z = inclinedZ;

        // 3D perspective projection
        const perspective = 540 / (540 + sc.z + 80);
        const layerParallax = sc.depthLayer === 'FOREGROUND' ? 12 : sc.depthLayer === 'MIDGROUND' ? 6 : 2;
        sc.projX = centerX + sc.x * perspective + cam.mouseX * layerParallax;
        sc.projY = centerY + sc.y * perspective + floatY * 0.4 + cam.mouseY * layerParallax;
        sc.projScale = perspective;
        sc.projZ = sc.z;
      }

      // -----------------------------------------------------------------------
      // 4. RENDER BACKGROUND SCULPTURES (z < 0: Behind Book)
      // -----------------------------------------------------------------------
      for (let i = 0; i < sculptures.length; i++) {
        const sc = sculptures[i];
        if (sc.projZ < 10) {
          renderSculpture(ctx, sc, lightX, lightY, lightZ);
        }
      }

      // -----------------------------------------------------------------------
      // 5. RENDER VOLUMETRIC 3D HERO BOOK (Anchored Showroom Masterpiece)
      // -----------------------------------------------------------------------
      ctx.save();
      const bookParallax = 8;
      ctx.translate(centerX + cam.mouseX * bookParallax, centerY + floatY + cam.mouseY * bookParallax);
      ctx.scale(bookPhys.hoverScale, bookPhys.hoverScale);

      // Book Dimensions: Realistic Textbook Proportions with Overhanging Hardcover
      const isCompact = width < 480;
      const bw = isCompact ? 175 : 220; // Cover width
      const bh = isCompact ? 235 : 290; // Cover height
      const bThick = isCompact ? 36 : 46; // Total thickness

      const overhang = 4.5; // Overhang beyond page block

      const hw = bw / 2;
      const hh = bh / 2;
      const ht = bThick / 2;

      // Realistic Ground Contact Shadow (broadens & darkens on hover)
      const shadowExpand = bookPhys.isHovered ? 1.15 : 1.0;
      const shadowGrad = ctx.createRadialGradient(0, hh + 44, 8, 0, hh + 44, hw * 1.6 * shadowExpand);
      shadowGrad.addColorStop(0, 'rgba(4, 2, 3, 0.88)');
      shadowGrad.addColorStop(0.55, 'rgba(4, 2, 3, 0.32)');
      shadowGrad.addColorStop(1, 'rgba(4, 2, 3, 0)');
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(0, hh + 44, hw * 1.35 * shadowExpand, 22 * shadowExpand, 0, 0, Math.PI * 2);
      ctx.fill();

      // Effective Rotation angles (Turntable + 3D Hover Tilt)
      const rx = bookPhys.rotX + bookPhys.tiltX;
      const ry = bookPhys.rotY + bookPhys.tiltY;
      const rz = bookPhys.rotZ;

      // Vertices of Front Cover Plate (z = +ht)
      const coverFrontVerts = [
        [-hw, -hh, ht], [hw, -hh, ht], [hw, hh, ht], [-hw, hh, ht],
        [-hw, -hh, ht - 3], [hw, -hh, ht - 3], [hw, hh, ht - 3], [-hw, hh, ht - 3],
      ];
      // Vertices of Back Cover Plate (z = -ht)
      const coverBackVerts = [
        [-hw, -hh, -ht + 3], [hw, -hh, -ht + 3], [hw, hh, -ht + 3], [-hw, hh, -ht + 3],
        [-hw, -hh, -ht], [hw, -hh, -ht], [hw, hh, -ht], [-hw, hh, -ht],
      ];
      // Vertices of Recessed Stratified Ivory Page Block
      const pageLeft = -hw + 6;
      const pageRight = hw - overhang;
      const pageTop = -hh + overhang;
      const pageBottom = hh - overhang;
      const pageVerts = [
        [pageLeft, pageTop, ht - 3], [pageRight, pageTop, ht - 3], [pageRight, pageBottom, ht - 3], [pageLeft, pageBottom, ht - 3],
        [pageLeft, pageTop, -ht + 3], [pageRight, pageTop, -ht + 3], [pageRight, pageBottom, -ht + 3], [pageLeft, pageBottom, -ht + 3],
      ];

      // Projected vertex sets
      const projCoverFront = coverFrontVerts.map((v) => {
        rotate3D(v[0], v[1], v[2], rx, ry, rz);
        return { x: rotBuf.x, y: rotBuf.y, z: rotBuf.z };
      });
      const projCoverBack = coverBackVerts.map((v) => {
        rotate3D(v[0], v[1], v[2], rx, ry, rz);
        return { x: rotBuf.x, y: rotBuf.y, z: rotBuf.z };
      });
      const projPages = pageVerts.map((v) => {
        rotate3D(v[0], v[1], v[2], rx, ry, rz);
        return { x: rotBuf.x, y: rotBuf.y, z: rotBuf.z };
      });

      // Palette by Active Theme
      const activeTheme = currentThemeRef.current;
      let coverTopColor = '#340b15';
      let coverBotColor = '#130307';
      let spineColor = '#4e0e1e';
      let bookTitle = 'MATHEMATICS';
      let subTitle = 'LUMOS ACADEMY';

      if (activeTheme === 'english') {
        coverTopColor = '#141E32';
        coverBotColor = '#070B14';
        spineColor = '#1D2D48';
        bookTitle = 'ENGLISH';
        subTitle = 'IELTS & GRAMMAR';
      } else if (activeTheme === 'it') {
        coverTopColor = '#10241A';
        coverBotColor = '#05100B';
        spineColor = '#173627';
        bookTitle = 'FRONTEND IT';
        subTitle = 'CODE & TECH';
      } else if (activeTheme === 'academic') {
        coverTopColor = '#30101A';
        coverBotColor = '#100308';
        spineColor = '#4A1627';
        bookTitle = 'DTM & GRANT';
        subTitle = 'AKADEMIK BLOK';
      }

      // Normal computations for backface culling & realistic illumination
      const cf0 = projCoverFront[0];
      const cf1 = projCoverFront[1];
      const cf3 = projCoverFront[3];
      const frontNormalZ = (cf1.x - cf0.x) * (cf3.y - cf0.y) - (cf1.y - cf0.y) * (cf3.x - cf0.x);

      const spineNormalZ = (projCoverBack[0].x - cf0.x) * (cf3.y - cf0.y) - (projCoverBack[0].y - cf0.y) * (cf3.x - cf0.x);

      const p1 = projPages[1];
      const p5 = projPages[5];
      const p2 = projPages[2];
      const p6 = projPages[6];
      const pagesRightNormalZ = (p5.x - p1.x) * (p2.y - p1.y) - (p5.y - p1.y) * (p2.x - p1.x);

      const topNormalZ = (cf1.x - cf0.x) * (projCoverBack[0].y - cf0.y) - (cf1.y - cf0.y) * (projCoverBack[0].x - cf0.x);

      // Light alignment factor for specular sheen (boosted by hover spotlight)
      const lightDot = (Math.cos(ry) * lightX + Math.sin(ry) * lightZ) / 220;
      const hoverLightBoost = bookPhys.isHovered ? 0.25 : 0;
      const specHighlight = Math.max(0, Math.min(1, 0.5 + lightDot * 0.5 + hoverLightBoost));

      // 1. Back Cover Plate (if facing camera)
      if (frontNormalZ < 0) {
        ctx.beginPath();
        ctx.moveTo(projCoverBack[4].x, projCoverBack[4].y);
        ctx.lineTo(projCoverBack[5].x, projCoverBack[5].y);
        ctx.lineTo(projCoverBack[6].x, projCoverBack[6].y);
        ctx.lineTo(projCoverBack[7].x, projCoverBack[7].y);
        ctx.closePath();
        ctx.fillStyle = coverBotColor;
        ctx.fill();
        ctx.strokeStyle = '#D9A93A';
        ctx.lineWidth = 1.3;
        ctx.stroke();

        // Embossed Back Seal
        const bmx = (projCoverBack[4].x + projCoverBack[5].x + projCoverBack[6].x + projCoverBack[7].x) / 4;
        const bmy = (projCoverBack[4].y + projCoverBack[5].y + projCoverBack[6].y + projCoverBack[7].y) / 4;
        ctx.save();
        ctx.translate(bmx, bmy);
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

      // 2. Curved Spine Plate (Left edge)
      if (spineNormalZ > 0) {
        ctx.beginPath();
        ctx.moveTo(cf0.x, cf0.y);
        ctx.lineTo(projCoverBack[4].x, projCoverBack[4].y);
        ctx.lineTo(projCoverBack[7].x, projCoverBack[7].y);
        ctx.lineTo(cf3.x, cf3.y);
        ctx.closePath();
        const spineGrad = ctx.createLinearGradient(cf0.x, cf0.y, projCoverBack[7].x, projCoverBack[7].y);
        spineGrad.addColorStop(0, spineColor);
        spineGrad.addColorStop(1, '#0B0204');
        ctx.fillStyle = spineGrad;
        ctx.fill();
        ctx.strokeStyle = '#F4D27A';
        ctx.lineWidth = 1.3;
        ctx.stroke();

        // 3D Horizontal Gold Rib Ridges on Spine
        ctx.strokeStyle = 'rgba(244, 210, 122, 0.7)';
        ctx.lineWidth = 1.2;
        for (let rib = 1; rib <= 4; rib++) {
          const rat = rib / 5;
          const r1x = cf0.x * (1 - rat) + cf3.x * rat;
          const r1y = cf0.y * (1 - rat) + cf3.y * rat;
          const r2x = projCoverBack[4].x * (1 - rat) + projCoverBack[7].x * rat;
          const r2y = projCoverBack[4].y * (1 - rat) + projCoverBack[7].y * rat;
          ctx.beginPath();
          ctx.moveTo(r1x, r1y);
          ctx.lineTo(r2x, r2y);
          ctx.stroke();
        }
      }

      // 3. Recessed Stratified Ivory Page Block (Right Side)
      if (pagesRightNormalZ > 0) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p5.x, p5.y);
        ctx.lineTo(p6.x, p6.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();
        const pageGrad = ctx.createLinearGradient(p1.x, p1.y, p6.x, p6.y);
        pageGrad.addColorStop(0, 'rgba(250, 246, 238, 0.98)');
        pageGrad.addColorStop(0.5, 'rgba(226, 218, 202, 0.94)');
        pageGrad.addColorStop(1, 'rgba(180, 168, 146, 0.90)');
        ctx.fillStyle = pageGrad;
        ctx.fill();
        ctx.strokeStyle = 'rgba(217, 169, 58, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Visible paper stratification lines with depth
        ctx.strokeStyle = 'rgba(135, 124, 104, 0.35)';
        for (let l = 1; l <= 4; l++) {
          const rat = l / 5;
          ctx.beginPath();
          ctx.moveTo(p1.x * (1 - rat) + p5.x * rat, p1.y * (1 - rat) + p5.y * rat);
          ctx.lineTo(p2.x * (1 - rat) + p6.x * rat, p2.y * (1 - rat) + p6.y * rat);
          ctx.stroke();
        }
      }

      // 4. Recessed Top Pages Block
      if (topNormalZ > 0) {
        ctx.beginPath();
        ctx.moveTo(projPages[0].x, projPages[0].y);
        ctx.lineTo(projPages[1].x, projPages[1].y);
        ctx.lineTo(projPages[5].x, projPages[5].y);
        ctx.lineTo(projPages[4].x, projPages[4].y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(238, 232, 218, 0.95)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(217, 169, 58, 0.35)';
        ctx.stroke();
      }

      // 5. Front Cover Plate (The Grand Masterpiece)
      if (frontNormalZ > 0) {
        ctx.beginPath();
        ctx.moveTo(cf0.x, cf0.y);
        ctx.lineTo(cf1.x, cf1.y);
        ctx.lineTo(projCoverFront[2].x, projCoverFront[2].y);
        ctx.lineTo(cf3.x, cf3.y);
        ctx.closePath();

        const coverGrad = ctx.createLinearGradient(cf0.x, cf0.y, projCoverFront[2].x, projCoverFront[2].y);
        coverGrad.addColorStop(0, coverTopColor);
        coverGrad.addColorStop(0.65, coverBotColor);
        coverGrad.addColorStop(1, '#070204');
        ctx.fillStyle = coverGrad;
        ctx.fill();

        // Dynamic Specular Highlight & Warm Light Spread
        if (specHighlight > 0.3) {
          const specGrad = ctx.createRadialGradient(
            cf0.x * 0.4 + projCoverFront[2].x * 0.6,
            cf0.y * 0.4 + projCoverFront[2].y * 0.6,
            10,
            cf0.x * 0.4 + projCoverFront[2].x * 0.6,
            cf0.y * 0.4 + projCoverFront[2].y * 0.6,
            hw * 1.2
          );
          specGrad.addColorStop(0, `rgba(255, 240, 195, ${0.22 * specHighlight})`);
          specGrad.addColorStop(1, 'rgba(255, 240, 195, 0)');
          ctx.fillStyle = specGrad;
          ctx.fill();
        }

        // Gold Rim & Bevel Line
        ctx.strokeStyle = '#F4D27A';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Inner Embossed Gold Line Frame
        const inScale = 0.88;
        ctx.beginPath();
        ctx.moveTo(cf0.x * inScale, cf0.y * inScale);
        ctx.lineTo(cf1.x * inScale, cf1.y * inScale);
        ctx.lineTo(projCoverFront[2].x * inScale, projCoverFront[2].y * inScale);
        ctx.lineTo(cf3.x * inScale, cf3.y * inScale);
        ctx.closePath();
        ctx.strokeStyle = 'rgba(244, 210, 122, 0.45)';
        ctx.lineWidth = 0.9;
        ctx.stroke();

        // Front Cover Typography & Emblem
        const faceMidX = (cf0.x + cf1.x + projCoverFront[2].x + cf3.x) / 4;
        const faceMidY = (cf0.y + cf1.y + projCoverFront[2].y + cf3.y) / 4;

        ctx.save();
        ctx.translate(faceMidX, faceMidY);
        const skewAngle = Math.atan2(cf1.y - cf0.y, cf1.x - cf0.x);
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

        // Subtle Embossed Symbols by Theme
        if (activeTheme === 'math') {
          ctx.font = 'italic 10px serif';
          ctx.fillStyle = 'rgba(244, 210, 122, 0.45)';
          ctx.fillText('π', -hw * 0.55, -hh * 0.12);
          ctx.fillText('∫', hw * 0.55, -hh * 0.12);
          ctx.fillText('√x', -hw * 0.52, hh * 0.18);
          ctx.fillText('x²', hw * 0.52, hh * 0.18);
        } else if (activeTheme === 'english') {
          ctx.font = 'bold 9px sans-serif';
          ctx.fillStyle = 'rgba(244, 210, 122, 0.45)';
          ctx.fillText('READ', -hw * 0.52, -hh * 0.12);
          ctx.fillText('SPEAK', hw * 0.52, -hh * 0.12);
          ctx.fillText('THINK', 0, hh * 0.18);
        } else if (activeTheme === 'it') {
          ctx.font = 'bold 9px monospace';
          ctx.fillStyle = 'rgba(244, 210, 122, 0.45)';
          ctx.fillText('<dev/>', -hw * 0.52, -hh * 0.12);
          ctx.fillText('{ state }', hw * 0.52, -hh * 0.12);
          ctx.fillText('async', 0, hh * 0.18);
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
        const sealGlyph = activeTheme === 'math' ? '∑ π' : activeTheme === 'english' ? 'EN' : activeTheme === 'it' ? '< / >' : '★ DTM';
        ctx.fillText(sealGlyph, 0, hh * 0.28 + 4);

        ctx.restore();

        // Draped Silk Ribbon Bookmark (Warm Gold)
        ctx.beginPath();
        const rTopX = cf0.x * 0.45 + cf1.x * 0.55;
        const rTopY = cf0.y * 0.45 + cf1.y * 0.55;
        const rBotX = cf3.x * 0.42 + projCoverFront[2].x * 0.58;
        const rBotY = cf3.y * 0.42 + projCoverFront[2].x * 0.58 + 26;
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
      // 6. RENDER FOREGROUND SCULPTURES (z >= 0: In Front of Book)
      // -----------------------------------------------------------------------
      for (let i = 0; i < sculptures.length; i++) {
        const sc = sculptures[i];
        if (sc.projZ >= 10) {
          renderSculpture(ctx, sc, lightX, lightY, lightZ);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    // -------------------------------------------------------------------------
    // HELPER: RENDER HIGH-END VOLUMETRIC SCULPTURE
    // -------------------------------------------------------------------------
    function renderSculpture(c: CanvasRenderingContext2D, sc: Sculpture3D, lx: number, ly: number, lz: number) {
      c.save();
      c.translate(sc.projX, sc.projY);

      const hoverScale = sc.isHovered || sc.isGrabbed ? 1.25 : 1.0;
      c.scale(sc.projScale * hoverScale, sc.projScale * hoverScale);
      c.globalAlpha = sc.baseOpacity;

      // Rotate around local orientation
      c.rotate(sc.rotZ);

      // Gold Glow Halo on Hover / Grab
      if (sc.isHovered || sc.isGrabbed) {
        c.fillStyle = 'rgba(217, 169, 58, 0.28)';
        c.beginPath();
        c.arc(0, 0, sc.size * 1.5, 0, Math.PI * 2);
        c.fill();
      }

      c.strokeStyle = sc.isHovered ? '#FFFFFF' : '#F4D27A';
      c.fillStyle = sc.isHovered ? '#FFFFFF' : '#F4D27A';
      c.lineWidth = sc.isHovered ? 1.6 : 1.2;

      // -----------------------------------------------------------------------
      // A. The Grand Horizontal Brushed Gold Orbital Ring
      // -----------------------------------------------------------------------
      if (sc.type === 'ring_grand_horizontal') {
        // Outer Beveled Ellipse
        c.beginPath();
        c.ellipse(0, 0, sc.size, sc.size * 0.32, sc.rotX, 0, Math.PI * 2);
        c.lineWidth = 2.4;
        c.strokeStyle = '#D9A93A';
        c.stroke();

        // Inner Concentric Bevel
        c.beginPath();
        c.ellipse(0, 0, sc.size - 5, (sc.size - 5) * 0.32, sc.rotX, 0, Math.PI * 2);
        c.lineWidth = 1.0;
        c.strokeStyle = 'rgba(244, 210, 122, 0.45)';
        c.stroke();

        // Coordinate Tick Marks
        c.lineWidth = 1.0;
        c.strokeStyle = 'rgba(244, 210, 122, 0.65)';
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
          const cosA = Math.cos(a + sc.rotY);
          const sinA = Math.sin(a + sc.rotY);
          const rx1 = cosA * (sc.size - 5);
          const ry1 = sinA * (sc.size - 5) * 0.32;
          const rx2 = cosA * (sc.size + 5);
          const ry2 = sinA * (sc.size + 5) * 0.32;
          c.beginPath();
          c.moveTo(rx1, ry1);
          c.lineTo(rx2, ry2);
          c.stroke();
        }
      }

      // -----------------------------------------------------------------------
      // B. Nested Tilted Double Ring
      // -----------------------------------------------------------------------
      else if (sc.type === 'ring_nested_tilted') {
        c.beginPath();
        c.ellipse(0, 0, sc.size, sc.size * 0.5, sc.rotY, 0, Math.PI * 2);
        c.stroke();

        c.beginPath();
        c.ellipse(0, 0, sc.size * 0.72, sc.size * 0.36, sc.rotY + 0.35, 0, Math.PI * 2);
        c.strokeStyle = 'rgba(217, 169, 58, 0.65)';
        c.stroke();
      }

      // -----------------------------------------------------------------------
      // C. Volumetric Parabola Ribbon (y = x² with 3D Depth)
      // -----------------------------------------------------------------------
      else if (sc.type === 'parabola_volumetric') {
        c.beginPath();
        for (let px = -sc.size; px <= sc.size; px += 3) {
          const py = 0.045 * px * px - 16;
          if (px === -sc.size) c.moveTo(px, py);
          else c.lineTo(px, py);
        }
        c.lineWidth = 2.0;
        c.strokeStyle = '#F4D27A';
        c.stroke();

        // Extruded Depth Curve
        c.beginPath();
        for (let px = -sc.size; px <= sc.size; px += 3) {
          const py = 0.045 * px * px - 16 + 5;
          if (px === -sc.size) c.moveTo(px + 3, py);
          else c.lineTo(px + 3, py);
        }
        c.lineWidth = 1.0;
        c.strokeStyle = 'rgba(217, 169, 58, 0.45)';
        c.stroke();

        // Cross-linking rungs for volumetric look
        for (let rx = -sc.size; rx <= sc.size; rx += sc.size / 2) {
          const ry1 = 0.045 * rx * rx - 16;
          c.beginPath();
          c.moveTo(rx, ry1);
          c.lineTo(rx + 3, ry1 + 5);
          c.stroke();
        }
      }

      // -----------------------------------------------------------------------
      // D. Tubular Sine Wave Ribbon (y = sin(x))
      // -----------------------------------------------------------------------
      else if (sc.type === 'sinewave_tubular') {
        c.beginPath();
        for (let px = -sc.size; px <= sc.size; px += 3) {
          const py = Math.sin(px * 0.16 + sc.rotY) * 12;
          if (px === -sc.size) c.moveTo(px, py);
          else c.lineTo(px, py);
        }
        c.lineWidth = 2.0;
        c.strokeStyle = '#F4D27A';
        c.stroke();

        // Secondary thickness line
        c.beginPath();
        for (let px = -sc.size; px <= sc.size; px += 3) {
          const py = Math.sin(px * 0.16 + sc.rotY) * 12 + 4;
          if (px === -sc.size) c.moveTo(px + 2, py);
          else c.lineTo(px + 2, py);
        }
        c.lineWidth = 1.0;
        c.strokeStyle = 'rgba(217, 169, 58, 0.45)';
        c.stroke();
      }

      // -----------------------------------------------------------------------
      // E. Parametric 3D Saddle Surface Mesh (Hyperbolic Paraboloid)
      // -----------------------------------------------------------------------
      else if (sc.type === 'saddle_surface') {
        const span = sc.size * 0.7;
        const steps = 4;
        c.strokeStyle = 'rgba(244, 210, 122, 0.65)';
        c.lineWidth = 1.0;

        for (let i = -steps; i <= steps; i++) {
          const u = (i / steps) * span;
          c.beginPath();
          for (let j = -steps; j <= steps; j++) {
            const v = (j / steps) * span;
            const z = (u * u - v * v) * 0.02;
            const px = u + z * 0.4;
            const py = v - z * 0.3;
            if (j === -steps) c.moveTo(px, py);
            else c.lineTo(px, py);
          }
          c.stroke();
        }
        for (let j = -steps; j <= steps; j++) {
          const v = (j / steps) * span;
          c.beginPath();
          for (let i = -steps; i <= steps; i++) {
            const u = (i / steps) * span;
            const z = (u * u - v * v) * 0.02;
            const px = u + z * 0.4;
            const py = v - z * 0.3;
            if (i === -steps) c.moveTo(px, py);
            else c.lineTo(px, py);
          }
          c.stroke();
        }
      }

      // -----------------------------------------------------------------------
      // F. 3D Double Helix
      // -----------------------------------------------------------------------
      else if (sc.type === 'double_helix') {
        const steps = 14;
        const hSpan = sc.size;
        for (let i = 0; i <= steps; i++) {
          const t = (i / steps) * Math.PI * 3 + sc.rotY;
          const y = (i / steps - 0.5) * hSpan * 1.5;
          const x1 = Math.cos(t) * sc.size * 0.45;
          const x2 = Math.cos(t + Math.PI) * sc.size * 0.45;

          // Helix rungs
          c.beginPath();
          c.moveTo(x1, y);
          c.lineTo(x2, y);
          c.strokeStyle = 'rgba(217, 169, 58, 0.4)';
          c.lineWidth = 0.8;
          c.stroke();

          // Helix nodes
          c.fillStyle = '#F4D27A';
          c.beginPath(); c.arc(x1, y, 1.8, 0, Math.PI * 2); c.fill();
          c.beginPath(); c.arc(x2, y, 1.8, 0, Math.PI * 2); c.fill();
        }
      }

      // -----------------------------------------------------------------------
      // G. 3D Coordinate Tripod (X, Y, Z)
      // -----------------------------------------------------------------------
      else if (sc.type === 'coord_tripod') {
        const s = sc.size;
        c.lineWidth = 1.6;

        // X Axis (Gold)
        c.strokeStyle = '#F4D27A';
        c.beginPath(); c.moveTo(0, 0); c.lineTo(s, 0); c.stroke();

        // Y Axis (Burgundy / Gold tint)
        c.strokeStyle = '#D9A93A';
        c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -s); c.stroke();

        // Z Axis (Champagne)
        c.strokeStyle = '#FFE7A3';
        c.beginPath(); c.moveTo(0, 0); c.lineTo(-s * 0.65, s * 0.65); c.stroke();

        // Small Origin Cube
        c.strokeRect(-2, -2, 4, 4);

        // Labels
        c.font = 'bold 8px monospace';
        c.fillStyle = '#F4D27A';
        c.fillText('X', s + 4, 2);
        c.fillText('Y', 2, -s - 4);
        c.fillText('Z', -s * 0.65 - 6, s * 0.65 + 6);
      }

      // -----------------------------------------------------------------------
      // H. Architectural Vector Arrow
      // -----------------------------------------------------------------------
      else if (sc.type === 'vector_arrow') {
        const s = sc.size;
        c.lineWidth = 1.8;
        c.beginPath();
        c.moveTo(-s * 0.7, s * 0.5);
        c.lineTo(s * 0.7, -s * 0.5);
        c.stroke();

        // 3D Arrowhead Pyramid
        c.beginPath();
        c.moveTo(s * 0.7, -s * 0.5);
        c.lineTo(s * 0.4, -s * 0.5 - 6);
        c.lineTo(s * 0.5 + 4, -s * 0.2);
        c.closePath();
        c.fillStyle = '#F4D27A';
        c.fill();
      }

      // -----------------------------------------------------------------------
      // I. 3D Triangular Prism
      // -----------------------------------------------------------------------
      else if (sc.type === 'prism_3d') {
        const s = sc.size;
        c.lineWidth = 1.2;
        c.strokeStyle = '#F4D27A';
        c.beginPath();
        c.moveTo(0, -s * 0.7);
        c.lineTo(s * 0.6, s * 0.5);
        c.lineTo(-s * 0.6, s * 0.5);
        c.closePath();
        c.stroke();

        // Rear offset triangle
        c.beginPath();
        c.moveTo(4, -s * 0.7 - 4);
        c.lineTo(s * 0.6 + 4, s * 0.5 - 4);
        c.lineTo(-s * 0.6 + 4, s * 0.5 - 4);
        c.closePath();
        c.strokeStyle = 'rgba(217, 169, 58, 0.45)';
        c.stroke();

        // Connecting lines
        c.beginPath();
        c.moveTo(0, -s * 0.7); c.lineTo(4, -s * 0.7 - 4);
        c.moveTo(s * 0.6, s * 0.5); c.lineTo(s * 0.6 + 4, s * 0.5 - 4);
        c.moveTo(-s * 0.6, s * 0.5); c.lineTo(-s * 0.6 + 4, s * 0.5 - 4);
        c.stroke();
      }

      // -----------------------------------------------------------------------
      // J. Floating Mathematical Formulas (π, ∑, √, ∞, f(x))
      // -----------------------------------------------------------------------
      else if (sc.type === 'formula_3d') {
        const fontSz = Math.round(sc.size * 1.2);
        c.font = `bold ${fontSz}px serif`;
        c.textAlign = 'center';
        c.textBaseline = 'middle';

        c.fillStyle = 'rgba(20, 6, 10, 0.75)';
        c.fillText(sc.label || '', 2, 2);
        c.fillStyle = '#F4D27A';
        c.fillText(sc.label || '', 0, 0);
      }

      // -----------------------------------------------------------------------
      // K. Extruded Volumetric 3D Letters (A, B, C, Z)
      // -----------------------------------------------------------------------
      else if (sc.type === 'letter_3d') {
        const fontSz = Math.round(sc.size * 1.3);
        c.font = `900 ${fontSz}px "Playfair Display", serif`;
        c.textAlign = 'center';
        c.textBaseline = 'middle';

        // Extruded 3D Shadow Layers
        c.fillStyle = 'rgba(20, 6, 10, 0.75)';
        c.fillText(sc.label || '', 3, 3);
        c.fillStyle = '#6E1624';
        c.fillText(sc.label || '', 2, 2);
        c.fillStyle = '#D9A93A';
        c.fillText(sc.label || '', 1, 1);
        // Front Face
        c.fillStyle = '#F4D27A';
        c.fillText(sc.label || '', 0, 0);
      }

      // -----------------------------------------------------------------------
      // L. 3D Typographic Word Blocks
      // -----------------------------------------------------------------------
      else if (sc.type === 'word_3d') {
        const fontSz = Math.round(sc.size);
        c.font = `bold ${fontSz}px -apple-system, sans-serif`;
        c.textAlign = 'center';
        c.textBaseline = 'middle';

        const textMetrics = c.measureText(sc.label || '');
        const tw = textMetrics.width + 12;
        const th = fontSz + 8;
        c.fillStyle = 'rgba(18, 6, 10, 0.85)';
        c.strokeStyle = 'rgba(217, 169, 58, 0.5)';
        c.lineWidth = 1;
        c.beginPath();
        c.roundRect(-tw / 2, -th / 2, tw, th, 4);
        c.fill();
        c.stroke();

        c.fillStyle = '#F4D27A';
        c.fillText(sc.label || '', 0, 0);
      }

      // -----------------------------------------------------------------------
      // M. 3D Code Block Constructs
      // -----------------------------------------------------------------------
      else if (sc.type === 'code_block_3d') {
        const fontSz = Math.round(sc.size);
        c.font = `bold ${fontSz}px monospace`;
        c.textAlign = 'center';
        c.textBaseline = 'middle';

        c.fillStyle = 'rgba(10, 20, 14, 0.85)';
        c.strokeStyle = 'rgba(217, 169, 58, 0.5)';
        c.lineWidth = 1;
        const tm = c.measureText(sc.label || '');
        const cw = tm.width + 12;
        const ch = fontSz + 8;
        c.beginPath();
        c.roundRect(-cw / 2, -ch / 2, cw, ch, 4);
        c.fill();
        c.stroke();

        c.fillStyle = '#F4D27A';
        c.fillText(sc.label || '', 0, 0);
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

      const sculptures = sculpturesRef.current;
      // Check Sculptures first (hit radius 28px)
      let grabbedScId: string | null = null;
      for (let i = sculptures.length - 1; i >= 0; i--) {
        const sc = sculptures[i];
        const dx = px - sc.projX;
        const dy = py - sc.projY;
        const hitRadius = Math.max(sc.size * sc.projScale * 1.3, 26);
        if (dx * dx + dy * dy < hitRadius * hitRadius) {
          grabbedScId = sc.id;
          sc.isGrabbed = true;
          sc.spinVx = 0;
          sc.spinVy = 0;
          break;
        }
      }

      if (grabbedScId) {
        activeGrabTargetRef.current = grabbedScId;
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

      // Update Mouse Parallax & 3D Tilt Coordinates
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
          // Sculpture local rotation
          const sc = sculpturesRef.current.find((s) => s.id === activeTarget);
          if (sc) {
            sc.rotY += dx * 0.015;
            sc.rotX += dy * 0.015;
          }
        }
        return;
      }

      // Hover Hit-testing
      const sculptures = sculpturesRef.current;
      let hoveredSc = false;
      for (let i = 0; i < sculptures.length; i++) {
        const sc = sculptures[i];
        const distSq = (px - sc.projX) ** 2 + (py - sc.projY) ** 2;
        const hitRadius = Math.max(sc.size * sc.projScale * 1.3, 26);
        if (distSq < hitRadius * hitRadius) {
          sc.isHovered = true;
          hoveredSc = true;
        } else {
          sc.isHovered = false;
        }
      }

      const cdx = px - currentCenterX;
      const cdy = py - (currentCenterY + currentFloatY);
      const isOverBook = cdx * cdx + cdy * cdy < 130 * 130;
      bookPhysicsRef.current.isHovered = isOverBook;

      canvas.style.cursor = isOverBook || hoveredSc ? 'grab' : 'default';
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
        const sc = sculpturesRef.current.find((s) => s.id === activeTarget);
        if (sc) {
          sc.isGrabbed = false;
          sc.spinVy = calculatedVx * 0.012;
          sc.spinVx = calculatedVy * 0.012;
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
  }, []);

  return (
    <section
      id="courses"
      ref={containerRef}
      className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-[1380px] mx-auto z-10 select-none"
      style={{ touchAction: 'pan-y' }}
    >
      {/* -----------------------------------------------------------------------
          TOP SECTION HERO: Luxury Visual Introduction
          ----------------------------------------------------------------------- */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16090D] border border-[#D9A93A]/40 text-xs font-bold uppercase tracking-widest text-[#D9A93A] shadow-lg shadow-[#D9A93A]/10">
          <Sparkles className="h-3.5 w-3.5" />
          <span>LUMOS ILMIY MAKTABI</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury-serif font-black text-[#F7F4EE] tracking-tight">
          KURSLAR
        </h2>

        <p className="text-base sm:text-lg lg:text-xl font-luxury-serif italic text-[#F4D27A] font-medium">
          “Kelajagingiz uchun bilimni tanlang.”
        </p>

        <p className="text-xs sm:text-sm text-[#A9A3A0] leading-relaxed max-w-2xl mx-auto pt-1">
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
          MAIN 3D EDUCATION GALLERY SHOWROOM STAGE
          ----------------------------------------------------------------------- */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#18080E]/90 via-[#100407]/95 to-[#0A0204] border border-[#D9A93A]/30 p-6 sm:p-8 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Subtle Ambient Radial Lighting in Background */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-radial from-[#D9A93A]/12 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-radial from-[#4A0E1A]/20 to-transparent blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          {/* LEFT COLUMN: Active Course Information & Specifications */}
          <div
            className={`lg:col-span-6 space-y-5 transition-all duration-300 ${
              isTransitioning ? 'opacity-30 translate-y-2' : 'opacity-100 translate-y-0'
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
