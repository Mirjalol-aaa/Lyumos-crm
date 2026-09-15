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
  // Physics, Anchors, Mass & Grab-and-Carry State
  anchorX: number;
  anchorY: number;
  anchorZ: number;
  vx: number;
  vy: number;
  currentOrbX: number;
  currentOrbY: number;
  mass?: number;
  damping?: number;
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

  // Book 360° Showroom Turntable Physics & Pure Y-Axis Rotation State
  const bookPhysicsRef = useRef({
    // Base Turntable Angles: Pure Y-axis showroom orientation around central vertical axis
    rotX: 0,     // Strictly 0 for pure horizontal rotation (no tumbling or wobbling)
    rotY: 0.38,  // Initial showroom angle
    rotZ: 0,     // Strictly 0
    // Hover 3D Micro-Tilt offsets (strictly clamped)
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
    // 1. UNIVERSAL PRIMARY HERO ORBITAL RINGS (Thin, Elegant, Jewelry-like)
    // =========================================================================
    // A. Grand Horizontal Brushed Gold Orbital Ring (Delicately frames the book)
    list.push({
      id: 'prim-ring-grand',
      type: 'ring_grand_horizontal',
      theme: 'universal',
      depthLayer: 'FOREGROUND',
      orbitRadius: 118,
      orbitSpeed: 0.00075,
      orbitPhase: 0.4,
      orbitInclination: 0.14,
      orbitEccentricity: 0.94,
      x: 0, y: 0, z: 0, anchorX: 0, anchorY: 0, anchorZ: 0, vx: 0, vy: 0, currentOrbX: 0, currentOrbY: 0,
      mass: 1.1, damping: 0.965,
      rotX: 0.28, rotY: 0, rotZ: 0,
      rotSpeedX: 0.0002, rotSpeedY: 0.0005, rotSpeedZ: 0.0002,
      isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
      size: 118,
      baseOpacity: 0.90,
      transitionAlpha: 1.0,
      projX: 0, projY: 0, projScale: 1, projZ: 0,
    });

    // B. Nested Tilted Double Ring (Secondary Orbital Frame)
    list.push({
      id: 'prim-ring-nested',
      type: 'ring_nested_tilted',
      theme: 'universal',
      depthLayer: 'MIDGROUND',
      orbitRadius: 80,
      orbitSpeed: -0.00065,
      orbitPhase: 2.5,
      orbitInclination: -0.32,
      orbitEccentricity: 0.88,
      x: 0, y: 0, z: 0, anchorX: 0, anchorY: 0, anchorZ: 0, vx: 0, vy: 0, currentOrbX: 0, currentOrbY: 0,
      mass: 0.95, damping: 0.962,
      rotX: -0.35, rotY: 0.3, rotZ: 0.15,
      rotSpeedX: 0.0003, rotSpeedY: -0.0004, rotSpeedZ: 0.0002,
      isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
      size: 26,
      baseOpacity: 0.82,
      transitionAlpha: 1.0,
      projX: 0, projY: 0, projScale: 1, projZ: 0,
    });

    // =========================================================================
    // 2. SUBJECT-SPECIFIC SCULPTURE SUITES
    // =========================================================================
    if (theme === 'math') {
      // -----------------------------------------------------------------------
      // 2-RASM 100% VISUAL MATCH: Floating Mathematical Objects & 3D Symbols
      // -----------------------------------------------------------------------
      // 1. 3D Floating Gold π (2-Rasm: Right of Book)
      list.push({
        id: 'math-pi',
        type: 'formula_3d',
        label: 'π',
        theme: 'math',
        depthLayer: 'FOREGROUND',
        orbitRadius: 106,
        orbitSpeed: 0.0009,
        orbitPhase: 0.35,
        orbitInclination: 0.16,
        orbitEccentricity: 0.92,
        x: 0, y: 0, z: 0, anchorX: 0, anchorY: 0, anchorZ: 0, vx: 0, vy: 0, currentOrbX: 0, currentOrbY: 0,
        mass: 0.60, damping: 0.950,
        rotX: 0.1, rotY: 0.2, rotZ: 0,
        rotSpeedX: 0.0004, rotSpeedY: 0.0006, rotSpeedZ: 0.0002,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 16,
        baseOpacity: 0.95,
        transitionAlpha: 1.0,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });

      // 2. 3D Floating Gold ∫ Integral Symbol (2-Rasm: Left of Book)
      list.push({
        id: 'math-integral',
        type: 'formula_3d',
        label: '∫',
        theme: 'math',
        depthLayer: 'FOREGROUND',
        orbitRadius: 104,
        orbitSpeed: -0.00085,
        orbitPhase: 3.3,
        orbitInclination: -0.18,
        orbitEccentricity: 0.88,
        x: 0, y: 0, z: 0, anchorX: 0, anchorY: 0, anchorZ: 0, vx: 0, vy: 0, currentOrbX: 0, currentOrbY: 0,
        mass: 0.60, damping: 0.950,
        rotX: 0.1, rotY: -0.2, rotZ: 0,
        rotSpeedX: 0.0003, rotSpeedY: -0.0005, rotSpeedZ: 0.0002,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 18,
        baseOpacity: 0.92,
        transitionAlpha: 1.0,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });

      // 3. 3D Floating Gold x² (2-Rasm: Bottom Right of Book)
      list.push({
        id: 'math-x2',
        type: 'formula_3d',
        label: 'x²',
        theme: 'math',
        depthLayer: 'FOREGROUND',
        orbitRadius: 112,
        orbitSpeed: 0.00075,
        orbitPhase: 5.6,
        orbitInclination: 0.22,
        orbitEccentricity: 0.90,
        x: 0, y: 0, z: 0, anchorX: 0, anchorY: 0, anchorZ: 0, vx: 0, vy: 0, currentOrbX: 0, currentOrbY: 0,
        mass: 0.60, damping: 0.950,
        rotX: 0.15, rotY: 0.3, rotZ: 0,
        rotSpeedX: 0.0004, rotSpeedY: 0.0005, rotSpeedZ: 0.0002,
        size: 14,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        baseOpacity: 0.90,
        transitionAlpha: 1.0,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });

      // 4. 3D Wireframe Icosahedron / Sacred Geometry Polyhedron (2-Rasm: Top Right)
      list.push({
        id: 'math-polyhedron',
        type: 'pyramid_3d',
        theme: 'math',
        depthLayer: 'MIDGROUND',
        orbitRadius: 126,
        orbitSpeed: 0.00065,
        orbitPhase: 1.6,
        orbitInclination: 0.28,
        orbitEccentricity: 0.88,
        x: 0, y: 0, z: 0, anchorX: 0, anchorY: 0, anchorZ: 0, vx: 0, vy: 0, currentOrbX: 0, currentOrbY: 0,
        mass: 0.85, damping: 0.958,
        rotX: 0.3, rotY: 0.5, rotZ: 0.2,
        rotSpeedX: 0.0005, rotSpeedY: 0.0006, rotSpeedZ: 0.0003,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 17,
        baseOpacity: 0.85,
        transitionAlpha: 1.0,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });

      // 5. 3D Wireframe Pyramid / Prism (2-Rasm: Right)
      list.push({
        id: 'math-pyramid',
        type: 'prism_3d',
        theme: 'math',
        depthLayer: 'MIDGROUND',
        orbitRadius: 122,
        orbitSpeed: -0.0006,
        orbitPhase: 4.8,
        orbitInclination: -0.25,
        orbitEccentricity: 0.86,
        x: 0, y: 0, z: 0, anchorX: 0, anchorY: 0, anchorZ: 0, vx: 0, vy: 0, currentOrbX: 0, currentOrbY: 0,
        mass: 0.85, damping: 0.958,
        rotX: 0.25, rotY: 0.4, rotZ: 0.1,
        rotSpeedX: 0.0004, rotSpeedY: 0.0005, rotSpeedZ: 0.0002,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 16,
        baseOpacity: 0.85,
        transitionAlpha: 1.0,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });

      // 6. 3D Volumetric Wave / Saddle Mesh (2-Rasm: Left)
      list.push({
        id: 'math-saddle',
        type: 'saddle_surface',
        theme: 'math',
        depthLayer: 'MIDGROUND',
        orbitRadius: 118,
        orbitSpeed: 0.00055,
        orbitPhase: 2.7,
        orbitInclination: 0.24,
        orbitEccentricity: 0.85,
        x: 0, y: 0, z: 0, anchorX: 0, anchorY: 0, anchorZ: 0, vx: 0, vy: 0, currentOrbX: 0, currentOrbY: 0,
        mass: 0.85, damping: 0.958,
        rotX: 0.35, rotY: 0.3, rotZ: -0.15,
        rotSpeedX: 0.0004, rotSpeedY: 0.0004, rotSpeedZ: 0.0002,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 15,
        baseOpacity: 0.80,
        transitionAlpha: 1.0,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });

      // 7. 3D Coordinate Curve & Vector Arrow (2-Rasm: Left)
      list.push({
        id: 'math-vector',
        type: 'vector_arrow',
        label: 'v⃗',
        theme: 'math',
        depthLayer: 'BACKGROUND',
        orbitRadius: 128,
        orbitSpeed: -0.0005,
        orbitPhase: 0.9,
        orbitInclination: -0.32,
        orbitEccentricity: 0.85,
        x: 0, y: 0, z: 0, anchorX: 0, anchorY: 0, anchorZ: 0, vx: 0, vy: 0, currentOrbX: 0, currentOrbY: 0,
        mass: 0.80, damping: 0.955,
        rotX: 0.3, rotY: 0.2, rotZ: 0.3,
        rotSpeedX: 0.0003, rotSpeedY: 0.0003, rotSpeedZ: 0.0002,
        isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
        size: 14,
        baseOpacity: 0.75,
        transitionAlpha: 1.0,
        projX: 0, projY: 0, projScale: 1, projZ: 0,
      });

      // Floating Mathematical Formulas (√, f(x), ∑, a²+b²=c²)
      const mathGlyphs = [
        { label: '√x', r: 96, speed: -0.0008, phase: 4.2, inc: -0.16, layer: 'FOREGROUND' as const, size: 12 },
        { label: 'f(x)', r: 122, speed: 0.00065, phase: 1.1, inc: 0.22, layer: 'MIDGROUND' as const, size: 12 },
        { label: '∑', r: 130, speed: -0.00055, phase: 5.2, inc: -0.20, layer: 'MIDGROUND' as const, size: 12 },
        { label: 'a²+b²=c²', r: 138, speed: 0.00045, phase: 2.3, inc: 0.22, layer: 'BACKGROUND' as const, size: 11 },
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
          x: 0, y: 0, z: 0, anchorX: 0, anchorY: 0, anchorZ: 0, vx: 0, vy: 0, currentOrbX: 0, currentOrbY: 0,
          mass: 0.55, damping: 0.948,
          rotX: 0, rotY: 0, rotZ: 0,
          rotSpeedX: 0.0007, rotSpeedY: 0.0011, rotSpeedZ: 0.0004,
          isHovered: false, isGrabbed: false, spinVx: 0, spinVy: 0,
          size: mg.size,
          baseOpacity: mg.layer === 'FOREGROUND' ? 0.90 : mg.layer === 'MIDGROUND' ? 0.80 : 0.65,
          transitionAlpha: 1.0,
          projX: 0, projY: 0, projScale: 1, projZ: 0,
        });
      });
    } else if (theme === 'english') {
      // Extruded 3D Letters (A, B, C, X, Y, Z)
      const engLetters = [
        { label: 'A', r: 96, speed: 0.0011, phase: 0.5, inc: 0.18, layer: 'FOREGROUND' as const, size: 16 },
        { label: 'B', r: 112, speed: -0.00075, phase: 2.3, inc: -0.24, layer: 'MIDGROUND' as const, size: 15 },
        { label: 'C', r: 125, speed: 0.00065, phase: 4.1, inc: 0.22, layer: 'MIDGROUND' as const, size: 14 },
        { label: 'X', r: 132, speed: 0.00055, phase: 1.5, inc: 0.25, layer: 'MIDGROUND' as const, size: 14 },
        { label: 'Y', r: 138, speed: -0.00045, phase: 3.2, inc: -0.20, layer: 'BACKGROUND' as const, size: 13 },
        { label: 'Z', r: 144, speed: -0.0004, phase: 5.6, inc: -0.26, layer: 'BACKGROUND' as const, size: 13 },
        { label: '“ ”', r: 104, speed: 0.0009, phase: 4.7, inc: 0.16, layer: 'FOREGROUND' as const, size: 15 },
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
          x: 0, y: 0, z: 0, anchorX: 0, anchorY: 0, anchorZ: 0, vx: 0, vy: 0, currentOrbX: 0, currentOrbY: 0,
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
        { label: 'ENGLISH', r: 102, speed: 0.0010, phase: 3.8, inc: -0.18, layer: 'FOREGROUND' as const },
        { label: 'LEARN', r: 118, speed: 0.0007, phase: 1.2, inc: 0.25, layer: 'MIDGROUND' as const },
        { label: 'SPEAK', r: 128, speed: -0.0006, phase: 3.4, inc: -0.28, layer: 'MIDGROUND' as const },
        { label: 'THINK', r: 136, speed: 0.0005, phase: 5.0, inc: 0.22, layer: 'BACKGROUND' as const },
        { label: 'GROW', r: 144, speed: -0.0004, phase: 0.9, inc: -0.20, layer: 'BACKGROUND' as const },
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
          x: 0, y: 0, z: 0, anchorX: 0, anchorY: 0, anchorZ: 0, vx: 0, vy: 0, currentOrbX: 0, currentOrbY: 0,
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
        { label: '<dev/>', r: 102, speed: 0.0011, phase: 0.6, inc: 0.18, layer: 'FOREGROUND' as const },
        { label: '{ state }', r: 118, speed: -0.00075, phase: 2.6, inc: -0.24, layer: 'MIDGROUND' as const },
        { label: 'React.js', r: 128, speed: 0.00065, phase: 4.4, inc: 0.22, layer: 'MIDGROUND' as const },
        { label: 'async/await', r: 136, speed: -0.0005, phase: 1.4, inc: -0.25, layer: 'BACKGROUND' as const },
        { label: 'API 200 OK', r: 144, speed: 0.0004, phase: 5.1, inc: 0.22, layer: 'BACKGROUND' as const },
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
          x: 0, y: 0, z: 0, anchorX: 0, anchorY: 0, anchorZ: 0, vx: 0, vy: 0, currentOrbX: 0, currentOrbY: 0,
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
        { label: '189+', r: 100, speed: 0.0011, phase: 0.5, inc: 0.18, layer: 'FOREGROUND' as const },
        { label: '★ DTM', r: 116, speed: -0.00075, phase: 2.4, inc: -0.22, layer: 'MIDGROUND' as const },
        { label: 'GRANT', r: 128, speed: 0.00065, phase: 4.2, inc: 0.22, layer: 'MIDGROUND' as const },
        { label: 'Cambridge', r: 138, speed: -0.00045, phase: 1.2, inc: -0.25, layer: 'BACKGROUND' as const },
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
          x: 0, y: 0, z: 0, anchorX: 0, anchorY: 0, anchorZ: 0, vx: 0, vy: 0, currentOrbX: 0, currentOrbY: 0,
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
      // 1. 3D HOVER TILT, CONTINUOUS 360° AUTONOMOUS ROTATION & INERTIA BLEND
      // -----------------------------------------------------------------------
      // Continuous, slow, elegant showroom rotation speed (~0.10 rad/s = 0.0016 rad/frame)
      const baseAutoSpin = 0.0016;

      if (!bookPhys.isDragging) {
        const targetTiltX = -cam.mouseY * 0.11; // subtle X tilt
        const targetTiltY = cam.mouseX * 0.16;  // subtle Y tilt
        bookPhys.tiltX += (targetTiltX - bookPhys.tiltX) * 0.06;
        bookPhys.tiltY += (targetTiltY - bookPhys.tiltY) * 0.06;

        // Inertia decay with heavy book mass (mass = 2.4 => friction = 0.975)
        if (Math.abs(bookPhys.angVy) > baseAutoSpin * 1.4) {
          bookPhys.angVy *= 0.975;
        } else {
          // Seamlessly blend back into continuous slow showroom rotation in current direction
          const targetDir = bookPhys.angVy < -0.0001 ? -1 : 1;
          const targetSpin = targetDir * baseAutoSpin;
          bookPhys.angVy += (targetSpin - bookPhys.angVy) * 0.035;
        }

        bookPhys.rotY += bookPhys.angVy;

        // Pure horizontal stability: rotX and rotZ strictly 0
        bookPhys.rotX = 0;
        bookPhys.rotZ = 0;
        bookPhys.angVx = 0;
      } else {
        // While dragging, hover tilt smoothly zeros out and user has 100% control
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
      // Cinematic Camera Push-In / Pull-Back Breathing (Cycle ~36s)
      const cameraBreathing = 1.0 + Math.sin(time * 0.17) * 0.035;
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

      // Subtle Atmospheric 3D Coordinate Grid Floor & Golden Bokeh Particles (2-Rasm)
      ctx.save();
      ctx.translate(centerX, centerY + 125);
      ctx.strokeStyle = 'rgba(217, 169, 58, 0.04)';
      ctx.lineWidth = 1;
      for (let gx = -160; gx <= 160; gx += 40) {
        ctx.beginPath();
        ctx.moveTo(gx * 0.55, -18);
        ctx.lineTo(gx * 1.35, 55);
        ctx.stroke();
      }
      for (let gz = 0; gz <= 55; gz += 18) {
        const factor = gz / 55;
        const span = 95 + factor * 125;
        ctx.beginPath();
        ctx.moveTo(-span, gz);
        ctx.lineTo(span, gz);
        ctx.stroke();
      }
      ctx.restore();

      // Atmospheric Golden Bokeh Particles (2-Rasm)
      for (let p = 0; p < 10; p++) {
        const bx = Math.sin(time * 0.35 + p * 1.4) * (width * 0.36);
        const by = Math.cos(time * 0.28 + p * 1.1) * (height * 0.34);
        const br = (p % 3 === 0 ? 2.2 : 1.4) * (1 + Math.sin(time + p) * 0.25);
        const bAlpha = 0.20 + 0.18 * Math.sin(time * 1.2 + p);
        ctx.fillStyle = `rgba(244, 210, 122, ${bAlpha})`;
        ctx.beginPath();
        ctx.arc(centerX + bx, centerY + by, br, 0, Math.PI * 2);
        ctx.fill();
      }

      // -----------------------------------------------------------------------
      // 3. UPDATE SCULPTURES & DEPTH PROJECTION (PHYSICAL GRAB, DRAG & THROW)
      // -----------------------------------------------------------------------
      const sculptures = sculpturesRef.current;
      for (let i = 0; i < sculptures.length; i++) {
        const sc = sculptures[i];

        // Autonomous rotation when not grabbed
        if (!sc.isGrabbed) {
          sc.orbitPhase += sc.orbitSpeed;
          sc.rotX += sc.spinVx + sc.rotSpeedX;
          sc.rotY += sc.spinVy + sc.rotSpeedY;
          sc.rotZ += sc.rotSpeedZ;

          sc.spinVx *= 0.965;
          sc.spinVy *= 0.965;
        }

        // Elliptical inclined orbit offsets around anchor
        const baseOrbX = Math.cos(sc.orbitPhase) * sc.orbitRadius;
        const baseOrbY = Math.sin(sc.orbitPhase) * sc.orbitRadius * sc.orbitEccentricity;
        const cosInc = Math.cos(sc.orbitInclination);
        const sinInc = Math.sin(sc.orbitInclination);
        const inclinedY = baseOrbY * cosInc;
        const inclinedZ = baseOrbY * sinInc;

        sc.currentOrbX = baseOrbX;
        sc.currentOrbY = inclinedY;

        if (sc.isGrabbed) {
          // Object position (x, y) is directly locked to user drag
          sc.z = sc.anchorZ + inclinedZ;
        } else {
          // Throw momentum & damping physics
          const speed = Math.hypot(sc.vx, sc.vy);
          if (speed > 0.03) {
            sc.x += sc.vx;
            sc.y += sc.vy;
            const damp = sc.damping || 0.962;
            sc.vx *= damp; // mass-scaled momentum damping
            sc.vy *= damp;
            // Continuously sync anchor so object settles naturally at new location
            sc.anchorX = sc.x - baseOrbX;
            sc.anchorY = sc.y - inclinedY;

            // Soft boundaries: bounce gently if near canvas bounds
            const boundX = width * 0.46;
            const boundY = height * 0.46;
            if (sc.x < -boundX) { sc.x = -boundX; sc.vx = Math.abs(sc.vx) * 0.55; }
            if (sc.x > boundX) { sc.x = boundX; sc.vx = -Math.abs(sc.vx) * 0.55; }
            if (sc.y < -boundY) { sc.y = -boundY; sc.vy = Math.abs(sc.vy) * 0.55; }
            if (sc.y > boundY) { sc.y = boundY; sc.vy = -Math.abs(sc.vy) * 0.55; }
          } else {
            sc.vx = 0;
            sc.vy = 0;
            // Autonomous orbit around its persistent anchor
            sc.x = sc.anchorX + baseOrbX;
            sc.y = sc.anchorY + inclinedY;
          }
          sc.z = sc.anchorZ + inclinedZ;
        }

        // 3D perspective projection
        const perspective = (540 / (540 + sc.z + 80)) * cameraBreathing;
        const layerParallax = sc.depthLayer === 'FOREGROUND' ? 12 : sc.depthLayer === 'MIDGROUND' ? 6 : 2;
        sc.projX = centerX + sc.x * perspective + cam.mouseX * layerParallax;
        sc.projY = centerY + sc.y * perspective + floatY * 0.4 + cam.mouseY * layerParallax;
        sc.projScale = perspective;
        sc.projZ = sc.z;
      }

      // -----------------------------------------------------------------------
      // 4. RENDER BACKGROUND SCULPTURES (z < 0: Behind Book) & RING BACK HALF
      // -----------------------------------------------------------------------
      for (let i = 0; i < sculptures.length; i++) {
        const sc = sculptures[i];
        if (sc.type === 'ring_grand_horizontal') {
          renderSculpture(ctx, sc, lightX, lightY, lightZ, 'back');
        } else if (sc.projZ < 10) {
          renderSculpture(ctx, sc, lightX, lightY, lightZ, 'all');
        }
      }

      // -----------------------------------------------------------------------
      // 5. RENDER VOLUMETRIC 3D HERO BOOK (Anchored Showroom Masterpiece)
      // -----------------------------------------------------------------------
      ctx.save();
      const bookParallax = 8;
      ctx.translate(centerX + cam.mouseX * bookParallax, centerY + floatY + cam.mouseY * bookParallax);
      ctx.scale(bookPhys.hoverScale * cameraBreathing, bookPhys.hoverScale * cameraBreathing);

      // Book Dimensions: Exact Golden Ratio (width : height : depth ≈ 1.00 : 1.35 : 0.18)
      const isCompact = width < 480;
      const bw = isCompact ? 140 : 175; // Cover width (100% Hero Scale)
      const bh = Math.round(bw * 1.35); // Cover height (~236px)
      const bThick = Math.round(bw * 0.18); // Thickness (~32px)

      const overhang = 4.0; // Hardcover overhanging lip beyond page block

      const hw = bw / 2;
      const hh = bh / 2;
      const ht = bThick / 2;

      // Pure Horizontal Showroom Turntable Rotation (Y-axis only around exact central vertical axis)
      const ry = bookPhys.rotY;
      // Clamped micro-tilt from mouse hover (strictly limited to ±3 degrees = ±0.05 rad)
      const rx = Math.max(-0.05, Math.min(0.05, bookPhys.tiltX));
      const rz = 0; // Strictly 0: absolute horizontal stability

      // -----------------------------------------------------------------------
      // 2-RASM MULTI-TIERED LUXURY CIRCULAR BRONZE-GOLD PEDESTAL (PODIUM)
      // -----------------------------------------------------------------------
      const pedY = hh + 26;
      const effW = (Math.abs(hw * Math.cos(ry)) + Math.abs(ht * Math.sin(ry))) * 1.25;

      // Floor Contact Radial Glow & Ambient Shadow
      const floorGlow = ctx.createRadialGradient(0, pedY + 16, 6, 0, pedY + 16, 175);
      floorGlow.addColorStop(0, 'rgba(217, 169, 58, 0.32)');
      floorGlow.addColorStop(0.35, 'rgba(84, 18, 28, 0.40)');
      floorGlow.addColorStop(0.7, 'rgba(8, 2, 4, 0.85)');
      floorGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = floorGlow;
      ctx.beginPath();
      ctx.ellipse(0, pedY + 16, 165, 34, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pedestal Tier 3 (Base Plinth): Radius 125, Height 8
      ctx.fillStyle = '#180A08';
      ctx.beginPath();
      ctx.ellipse(0, pedY + 12, 125, 24, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#5E2B12';
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // Pedestal Tier 2 (Middle Beveled Ring): Radius 104, Height 7 with Metallic Bronze Shimmer
      const t2Grad = ctx.createLinearGradient(-104, 0, 104, 0);
      t2Grad.addColorStop(0, '#2A1009');
      t2Grad.addColorStop(0.2, '#5A2A12');
      t2Grad.addColorStop(0.5, '#B88232');
      t2Grad.addColorStop(0.8, '#5A2A12');
      t2Grad.addColorStop(1, '#2A1009');
      ctx.fillStyle = t2Grad;
      ctx.beginPath();
      ctx.ellipse(0, pedY + 6, 104, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#D9A93A';
      ctx.lineWidth = 1.1;
      ctx.stroke();

      // Pedestal Tier 1 (Top Stage Disc): Radius 85 with Radiant Golden Surface Reflection
      const t1Grad = ctx.createRadialGradient(0, pedY, 4, 0, pedY, 85);
      t1Grad.addColorStop(0, '#FFF2C6');
      t1Grad.addColorStop(0.25, '#D9A93A');
      t1Grad.addColorStop(0.65, '#5A2A12');
      t1Grad.addColorStop(1, '#1A0B08');
      ctx.fillStyle = t1Grad;
      ctx.beginPath();
      ctx.ellipse(0, pedY, 85, 17, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFEAA7';
      ctx.lineWidth = 1.3;
      ctx.stroke();

      // Inner Concentric Gold Groove
      ctx.beginPath();
      ctx.ellipse(0, pedY, 74, 14, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(217, 169, 58, 0.55)';
      ctx.lineWidth = 0.7;
      ctx.stroke();

      // Dynamic Book Contact Shadow on Top of Pedestal
      const shadowExpand = bookPhys.isHovered ? 1.08 : 1.0;
      const bookShadow = ctx.createRadialGradient(0, pedY - 2, 3, 0, pedY - 2, effW * shadowExpand);
      bookShadow.addColorStop(0, 'rgba(4, 2, 3, 0.82)');
      bookShadow.addColorStop(0.6, 'rgba(4, 2, 3, 0.25)');
      bookShadow.addColorStop(1, 'rgba(4, 2, 3, 0)');
      ctx.fillStyle = bookShadow;
      ctx.beginPath();
      ctx.ellipse(0, pedY - 2, effW * shadowExpand, 10 * shadowExpand, 0, 0, Math.PI * 2);
      ctx.fill();

      // Vertices of Front Cover Plate (z = +ht, centered around origin)
      const coverFrontVerts = [
        [-hw, -hh, ht], [hw, -hh, ht], [hw, hh, ht], [-hw, hh, ht],
        [-hw, -hh, ht - 3], [hw, -hh, ht - 3], [hw, hh, ht - 3], [-hw, hh, ht - 3],
      ];
      // Vertices of Back Cover Plate (z = -ht, centered around origin)
      const coverBackVerts = [
        [-hw, -hh, -ht + 3], [hw, -hh, -ht + 3], [hw, hh, -ht + 3], [-hw, hh, -ht + 3],
        [-hw, -hh, -ht], [hw, -hh, -ht], [hw, hh, -ht], [-hw, hh, -ht],
      ];
      // Vertices of Recessed Stratified Ivory Page Block (inset by overhang)
      const pageLeft = -hw + 5;
      const pageRight = hw - overhang;
      const pageTop = -hh + overhang;
      const pageBottom = hh - overhang;
      const pageVerts = [
        [pageLeft, pageTop, ht - 3], [pageRight, pageTop, ht - 3], [pageRight, pageBottom, ht - 3], [pageLeft, pageBottom, ht - 3],
        [pageLeft, pageTop, -ht + 3], [pageRight, pageTop, -ht + 3], [pageRight, pageBottom, -ht + 3], [pageLeft, pageBottom, -ht + 3],
      ];

      // Projected vertex sets with true 3D perspective foreshortening
      const projectVert = (v: number[]) => {
        rotate3D(v[0], v[1], v[2], rx, ry, rz);
        const persp = 520 / (520 + rotBuf.z);
        return { x: rotBuf.x * persp, y: rotBuf.y * persp, z: rotBuf.z };
      };
      const projCoverFront = coverFrontVerts.map(projectVert);
      const projCoverBack = coverBackVerts.map(projectVert);
      const projPages = pageVerts.map(projectVert);

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

        // Physical Multi-Tier Warm Light Spread (dark -> burgundy -> warm gold -> champagne)
        const lightSpotX = cf0.x * 0.35 + projCoverFront[2].x * 0.65;
        const lightSpotY = cf0.y * 0.35 + projCoverFront[2].y * 0.65;
        const specGrad = ctx.createRadialGradient(
          lightSpotX,
          lightSpotY,
          6,
          lightSpotX,
          lightSpotY,
          hw * 1.35
        );
        specGrad.addColorStop(0, `rgba(255, 244, 212, ${0.30 * specHighlight})`);
        specGrad.addColorStop(0.35, `rgba(217, 169, 58, ${0.18 * specHighlight})`);
        specGrad.addColorStop(0.7, `rgba(110, 22, 36, ${0.10 * specHighlight})`);
        specGrad.addColorStop(1, 'rgba(5, 1, 2, 0)');
        ctx.fillStyle = specGrad;
        ctx.fill();

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

        // ---------------------------------------------------------------------
        // 2-RASM EXACT FRONT COVER EMBOSSED GOLD ARTWORK
        // ---------------------------------------------------------------------
        ctx.textAlign = 'center';

        // 1. Embossed Gold Royal Crown Emblem (2-Rasm Top Center)
        ctx.strokeStyle = '#F4D27A';
        ctx.fillStyle = '#F4D27A';
        ctx.lineWidth = 1.0;
        const crW = 12;
        const crY = -hh * 0.44;
        ctx.beginPath();
        ctx.moveTo(-crW, crY + 5);
        ctx.lineTo(-crW * 0.65, crY - 2);
        ctx.lineTo(-crW * 0.25, crY + 2);
        ctx.lineTo(0, crY - 4);
        ctx.lineTo(crW * 0.25, crY + 2);
        ctx.lineTo(crW * 0.65, crY - 2);
        ctx.lineTo(crW, crY + 5);
        ctx.closePath();
        ctx.stroke();
        [-crW * 0.65, 0, crW * 0.65].forEach((px) => {
          ctx.beginPath();
          ctx.arc(px, crY - (px === 0 ? 5.5 : 3.5), 1.1, 0, Math.PI * 2);
          ctx.fill();
        });

        // 2. LUMOS Wordmark (below crown)
        ctx.font = 'bold 10px "Playfair Display", serif';
        ctx.fillStyle = 'rgba(244, 210, 122, 0.95)';
        ctx.fillText('LUMOS', 0, -hh * 0.33);

        // 3. Main Golden Book Title (MATHEMATICS)
        ctx.font = '900 16px "Playfair Display", serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(bookTitle, 0, -hh * 0.19);
        ctx.fillStyle = '#F4D27A';
        ctx.fillText(bookTitle, 0.4, -hh * 0.19 + 0.4);

        if (activeTheme === 'math') {
          // 4. Mathematical Notation Row 1: π   ∫   √
          ctx.font = 'italic bold 13px "Playfair Display", serif';
          ctx.fillStyle = '#F4D27A';
          ctx.fillText('π', -hw * 0.44, -hh * 0.04);
          ctx.font = '16px serif';
          ctx.fillText('∫', 0, -hh * 0.04);
          ctx.font = 'italic 13px serif';
          ctx.fillText('√', hw * 0.44, -hh * 0.04);

          // 5. Mathematical Notation Row 2: x²   f(x)
          ctx.font = 'italic 12px serif';
          ctx.fillStyle = '#F4D27A';
          ctx.fillText('x²', -hw * 0.32, hh * 0.09);
          ctx.fillText('f(x)', hw * 0.32, hh * 0.09);

          // 6. Sacred Geometry Icosahedron / Polyhedral Watermark Emblem (2-Rasm Bottom)
          ctx.save();
          ctx.translate(0, hh * 0.26);
          ctx.strokeStyle = 'rgba(244, 210, 122, 0.72)';
          ctx.lineWidth = 0.8;
          const rGeo = 15;
          // Outer hexagon
          ctx.beginPath();
          for (let a = 0; a < 6; a++) {
            const ang = (a * Math.PI) / 3;
            const hx = Math.cos(ang) * rGeo;
            const hy = Math.sin(ang) * rGeo;
            if (a === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.stroke();

          // Interlocking sacred triangle
          ctx.beginPath();
          for (let a = 0; a < 3; a++) {
            const ang = (a * Math.PI * 2) / 3 - Math.PI / 6;
            const tx = Math.cos(ang) * rGeo * 0.88;
            const ty = Math.sin(ang) * rGeo * 0.88;
            if (a === 0) ctx.moveTo(tx, ty);
            else ctx.lineTo(tx, ty);
          }
          ctx.closePath();
          ctx.stroke();

          // Radial diagonal facets to vertices
          for (let a = 0; a < 6; a++) {
            const ang = (a * Math.PI) / 3;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(ang) * rGeo, Math.sin(ang) * rGeo);
            ctx.stroke();
          }
          ctx.restore();
        } else if (activeTheme === 'english') {
          ctx.font = 'bold 9px sans-serif';
          ctx.fillStyle = 'rgba(244, 210, 122, 0.55)';
          ctx.fillText('READ', -hw * 0.44, -hh * 0.02);
          ctx.fillText('SPEAK', hw * 0.44, -hh * 0.02);
          ctx.fillText('THINK', 0, hh * 0.12);

          // English Academy Seal
          ctx.strokeStyle = '#F4D27A';
          ctx.lineWidth = 1.0;
          ctx.beginPath(); ctx.arc(0, hh * 0.26, 17, 0, Math.PI * 2); ctx.stroke();
          ctx.font = 'bold 11px monospace';
          ctx.fillStyle = '#F4D27A';
          ctx.fillText('EN', 0, hh * 0.26 + 3.5);
        } else {
          ctx.strokeStyle = '#F4D27A';
          ctx.lineWidth = 1.0;
          ctx.beginPath(); ctx.arc(0, hh * 0.26, 17, 0, Math.PI * 2); ctx.stroke();
          ctx.font = 'bold 10px monospace';
          ctx.fillStyle = '#F4D27A';
          ctx.fillText('★ DTM', 0, hh * 0.26 + 3.5);
        }

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
      // 6. RENDER FOREGROUND SCULPTURES (z >= 0: In Front of Book) & RING FRONT HALF
      // -----------------------------------------------------------------------
      for (let i = 0; i < sculptures.length; i++) {
        const sc = sculptures[i];
        if (sc.type === 'ring_grand_horizontal') {
          renderSculpture(ctx, sc, lightX, lightY, lightZ, 'front');
        } else if (sc.projZ >= 10) {
          renderSculpture(ctx, sc, lightX, lightY, lightZ, 'all');
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    // -------------------------------------------------------------------------
    // HELPER: RENDER HIGH-END VOLUMETRIC SCULPTURE
    // -------------------------------------------------------------------------
    function renderSculpture(c: CanvasRenderingContext2D, sc: Sculpture3D, lx: number, ly: number, lz: number, ringHalf: 'back' | 'front' | 'all' = 'all') {
      c.save();
      c.translate(sc.projX, sc.projY);

      const hoverScale = sc.isHovered || sc.isGrabbed ? 1.25 : 1.0;
      c.scale(sc.projScale * hoverScale, sc.projScale * hoverScale);
      c.globalAlpha = sc.baseOpacity;

      // Physical Light Proximity Factor (3D Distance to Traveling Light Source)
      const dxL = sc.x - lx;
      const dyL = sc.y - ly;
      const dzL = sc.z - lz;
      const distToLight = Math.sqrt(dxL * dxL + dyL * dyL + dzL * dzL);
      const lightProximity = Math.max(0, Math.min(1, 1 - distToLight / 420));

      // Dynamic surface tone modulated by traveling light proximity:
      // When far: deep wine/gold
      // When near: radiant warm gold & champagne highlight
      const surfaceTone = sc.isHovered
        ? '#FFFFFF'
        : lightProximity > 0.65
        ? '#FFF4D4'
        : lightProximity > 0.3
        ? '#F4D27A'
        : '#C89632';

      // Rotate around local orientation
      c.rotate(sc.rotZ);

      // Warm Light Halo as Traveling Golden Light Passes or on Hover/Grab
      if (lightProximity > 0.25 || sc.isHovered || sc.isGrabbed) {
        const haloIntensity = sc.isHovered || sc.isGrabbed ? 0.35 : lightProximity * 0.24;
        const gradHalo = c.createRadialGradient(0, 0, 4, 0, 0, sc.size * 1.5);
        gradHalo.addColorStop(0, `rgba(255, 244, 212, ${haloIntensity})`);
        gradHalo.addColorStop(0.4, `rgba(217, 169, 58, ${haloIntensity * 0.65})`);
        gradHalo.addColorStop(0.8, `rgba(110, 22, 36, ${haloIntensity * 0.3})`);
        gradHalo.addColorStop(1, 'rgba(5, 1, 2, 0)');
        c.fillStyle = gradHalo;
        c.beginPath();
        c.arc(0, 0, sc.size * 1.5, 0, Math.PI * 2);
        c.fill();
      }

      c.strokeStyle = surfaceTone;
      c.fillStyle = surfaceTone;
      c.lineWidth = sc.isHovered ? 1.6 : 1.2;

      // -----------------------------------------------------------------------
      // A. The Grand Horizontal Brushed Gold Orbital Ring (With True 3D Depth Half-Arcs)
      // -----------------------------------------------------------------------
      if (sc.type === 'ring_grand_horizontal') {
        const startAng = ringHalf === 'back' ? Math.PI : 0;
        const endAng = ringHalf === 'back' ? Math.PI * 2 : ringHalf === 'front' ? Math.PI : Math.PI * 2;

        // Outer Beveled Ellipse (Thin, delicate luxury gold wire)
        c.beginPath();
        c.ellipse(0, 0, sc.size, sc.size * 0.32, sc.rotX, startAng, endAng);
        c.lineWidth = 1.3;
        c.strokeStyle = '#D9A93A';
        c.stroke();

        // Inner Concentric Bevel
        c.beginPath();
        c.ellipse(0, 0, sc.size - 4, (sc.size - 4) * 0.32, sc.rotX, startAng, endAng);
        c.lineWidth = 0.7;
        c.strokeStyle = 'rgba(244, 210, 122, 0.45)';
        c.stroke();

        // Coordinate Tick Marks on this depth half
        c.lineWidth = 0.7;
        c.strokeStyle = 'rgba(244, 210, 122, 0.65)';
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
          if (ringHalf === 'back' && (a < Math.PI || a > Math.PI * 2)) continue;
          if (ringHalf === 'front' && (a < 0 || a > Math.PI)) continue;
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
      // I2. 3D Faceted Octahedron / Polyhedral Pyramid
      // -----------------------------------------------------------------------
      else if (sc.type === 'pyramid_3d') {
        const s = sc.size;
        c.lineWidth = 1.2;
        // Upper pyramid apex & base
        c.beginPath();
        c.moveTo(0, -s);
        c.lineTo(s * 0.65, 0);
        c.lineTo(0, s * 0.32);
        c.lineTo(-s * 0.65, 0);
        c.closePath();
        c.stroke();

        // Lower pyramid apex
        c.beginPath();
        c.moveTo(0, s);
        c.lineTo(s * 0.65, 0);
        c.lineTo(0, s * 0.32);
        c.lineTo(-s * 0.65, 0);
        c.closePath();
        c.strokeStyle = 'rgba(217, 169, 58, 0.55)';
        c.stroke();

        // Facet axis lines
        c.beginPath();
        c.moveTo(0, -s); c.lineTo(0, s);
        c.moveTo(-s * 0.65, 0); c.lineTo(s * 0.65, 0);
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
    // 7. UNIFIED POINTER HIT-TESTING, DRAG-AND-CARRY & THROW PHYSICS
    // -------------------------------------------------------------------------
    const handlePointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      const sculptures = sculpturesRef.current;
      // Check Sculptures first (hit radius comfortably scaled for touch & mouse)
      let grabbedScId: string | null = null;
      for (let i = sculptures.length - 1; i >= 0; i--) {
        const sc = sculptures[i];
        const dx = px - sc.projX;
        const dy = py - sc.projY;
        const hitRadius = Math.max(sc.size * sc.projScale * 1.5, 34);
        if (dx * dx + dy * dy < hitRadius * hitRadius) {
          grabbedScId = sc.id;
          sc.isGrabbed = true;
          sc.vx = 0;
          sc.vy = 0;
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

      // Check Book Centerpiece (hit radius 150px around center)
      const cdx = px - currentCenterX;
      const cdy = py - (currentCenterY + currentFloatY);
      if (cdx * cdx + cdy * cdy < 150 * 150) {
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

      // If dragging an object across the screen
      if (activeTarget) {
        const dx = e.clientX - bookPhysicsRef.current.lastPointerX;
        const dy = e.clientY - bookPhysicsRef.current.lastPointerY;

        bookPhysicsRef.current.lastPointerX = e.clientX;
        bookPhysicsRef.current.lastPointerY = e.clientY;
        bookPhysicsRef.current.lastTime = now;

        // Keep last 8 samples for exact velocity and momentum calculation
        bookPhysicsRef.current.samples.push({ x: e.clientX, y: e.clientY, time: now });
        if (bookPhysicsRef.current.samples.length > 8) {
          bookPhysicsRef.current.samples.shift();
        }

        if (activeTarget === 'book') {
          // Horizontal turntable rotation driven by pointer
          bookPhysicsRef.current.rotY += dx * 0.009;
          // Vertical movement produces only very slight micro-tilt (strictly clamped to ±0.04 rad)
          bookPhysicsRef.current.tiltX += dy * 0.0006;
          bookPhysicsRef.current.tiltX = Math.max(-0.04, Math.min(0.04, bookPhysicsRef.current.tiltX));
        } else {
          // Sculpture Grab-and-Carry: Move with cursor in 3D world space
          const sc = sculpturesRef.current.find((s) => s.id === activeTarget);
          if (sc) {
            const scale = sc.projScale || 1.0;
            const worldDx = dx / scale;
            const worldDy = dy / scale;
            sc.x += worldDx;
            sc.y += worldDy;
            // Update anchor so object persists at new location without snapping back
            sc.anchorX = sc.x - sc.currentOrbX;
            sc.anchorY = sc.y - sc.currentOrbY;

            // Fluid 3D rotation during drag
            sc.rotY += dx * 0.014;
            sc.rotX += dy * 0.014;
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
        const hitRadius = Math.max(sc.size * sc.projScale * 1.5, 34);
        if (distSq < hitRadius * hitRadius) {
          sc.isHovered = true;
          hoveredSc = true;
        } else {
          sc.isHovered = false;
        }
      }

      const cdx = px - currentCenterX;
      const cdy = py - (currentCenterY + currentFloatY);
      const isOverBook = cdx * cdx + cdy * cdy < 140 * 140;
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
        // Heavy book mass (2.4) -> deliberate response with high rotational inertia on Y-axis
        bookPhysicsRef.current.angVy = calculatedVx * 0.0055;
        bookPhysicsRef.current.angVx = 0; // Zero vertical angular velocity
      } else {
        const sc = sculpturesRef.current.find((s) => s.id === activeTarget);
        if (sc) {
          sc.isGrabbed = false;
          const scale = sc.projScale || 1.0;
          const invMass = 1.0 / (sc.mass || 1.0);
          // Mass-scaled throw velocity response
          sc.vx = (calculatedVx / scale) * 0.92 * invMass;
          sc.vy = (calculatedVy / scale) * 0.92 * invMass;
          sc.spinVy = calculatedVx * 0.014 * invMass;
          sc.spinVx = calculatedVy * 0.014 * invMass;
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
      className="relative py-2 sm:py-3 lg:py-4 px-3 sm:px-5 lg:px-6 max-w-[1360px] mx-auto min-h-screen lg:h-screen lg:max-h-[960px] flex flex-col justify-center z-10 select-none"
      style={{ touchAction: 'pan-y' }}
    >
      {/* -----------------------------------------------------------------------
          TOP SECTION HERO: Luxury Visual Introduction (Compact for 100vh Single Screen)
          ----------------------------------------------------------------------- */}
      <div className="text-center max-w-3xl mx-auto space-y-1 mb-2 sm:mb-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16090D] border border-[#D9A93A]/40 text-[11px] font-bold uppercase tracking-widest text-[#D9A93A] shadow-md shadow-[#D9A93A]/10">
          <Sparkles className="h-3 w-3" />
          <span>LUMOS ILMIY MAKTABI</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-luxury-serif font-black text-[#F7F4EE] tracking-tight">
          KURSLAR
        </h2>

        <p className="text-xs sm:text-sm font-luxury-serif italic text-[#F4D27A] font-medium">
          “Kelajagingiz uchun bilimni tanlang.”
        </p>

        <p className="text-[11px] sm:text-xs text-[#A9A3A0] leading-normal max-w-2xl mx-auto">
          Har bir yo‘nalish uchun xalqaro standartlarga asoslangan mukammal o‘quv dasturlari va interaktiv 3D ta’lim muhiti.
        </p>
      </div>

      {/* -----------------------------------------------------------------------
          COURSE CATEGORY SELECTOR PILLS (Compact for 100vh Fit)
          ----------------------------------------------------------------------- */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap mb-2 sm:mb-3">
        {INITIAL_COURSES.map((course) => {
          const isSelected = course.id === activeCourse.id;
          return (
            <button
              key={course.id}
              type="button"
              onClick={() => handleSelectCourse(course)}
              className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-gradient-to-r from-[#D9A93A] via-[#F4D27A] to-[#D9A93A] text-[#0A0708] border-[#FFF2C6]/50 shadow-[0_3px_14px_rgba(217,169,58,0.35)] scale-102'
                  : 'bg-[#120609]/80 text-[#BDB5B0] border-[#D9A93A]/25 hover:border-[#D9A93A]/60 hover:text-[#F7F4EE]'
              }`}
            >
              <span>{course.title}</span>
            </button>
          );
        })}
      </div>

      {/* -----------------------------------------------------------------------
          MAIN 3D EDUCATION GALLERY SHOWROOM STAGE (Streamlined for 100vh)
          ----------------------------------------------------------------------- */}
      <div className="relative rounded-2xl lg:rounded-3xl bg-gradient-to-b from-[#18080E]/95 via-[#100407]/95 to-[#0A0204] border border-[#D9A93A]/30 p-4 sm:p-5 lg:p-6 shadow-[0_15px_50px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Subtle Ambient Radial Lighting in Background */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-radial from-[#D9A93A]/12 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-radial from-[#4A0E1A]/20 to-transparent blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-center relative z-10">
          {/* LEFT COLUMN: Active Course Information & Specifications */}
          <div
            className={`lg:col-span-6 space-y-2.5 sm:space-y-3 transition-all duration-300 ${
              isTransitioning ? 'opacity-30 translate-y-1' : 'opacity-100 translate-y-0'
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
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-luxury-serif font-black text-[#F7F4EE] tracking-tight">
              {activeCourse.title}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-[13px] text-[#BDB5B0] leading-snug font-normal line-clamp-2">
              {activeCourse.description}
            </p>

            {/* Key Specifications Grid (Compact Row for 100vh) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2.5 border-y border-[#D9A93A]/20">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-[#D9A93A]/10 border border-[#D9A93A]/25 flex items-center justify-center text-[#D9A93A] shrink-0">
                  <Clock className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="text-[9px] text-[#A9A3A0] font-semibold uppercase block">Davomiyligi</span>
                  <span className="text-xs font-bold text-[#F7F4EE]">
                    {activeCourse.durationMonths} oy ({activeCourse.lessonsCount} dars)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-[#D9A93A]/10 border border-[#D9A93A]/25 flex items-center justify-center text-[#D9A93A] shrink-0">
                  <Calendar className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="text-[9px] text-[#A9A3A0] font-semibold uppercase block">Dars Grafigi</span>
                  <span className="text-xs font-bold text-[#F7F4EE] line-clamp-1">
                    {(activeCourse.schedule || '').split('(')[0] || 'Haftada 3 kun'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-[#D9A93A]/10 border border-[#D9A93A]/25 flex items-center justify-center text-[#D9A93A] shrink-0">
                  <GraduationCap className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="text-[9px] text-[#A9A3A0] font-semibold uppercase block">Ustoz</span>
                  <span className="text-xs font-bold text-[#F7F4EE] line-clamp-1">
                    {activeCourse.instructor || 'Yetakchi ustoz'}
                  </span>
                </div>
              </div>
            </div>

            {/* Syllabus Preview (2 Columns of Topics from 2-Rasm) */}
            <div className="space-y-1.5 pt-0.5">
              <span className="text-[11px] font-bold text-[#D9A93A] tracking-wide uppercase flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" />
                <span>O‘quv dasturidan asosiy mavzular:</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-[#E8E1D9]">
                {(activeCourse.syllabus || []).slice(0, 6).map((topic, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-[#D9A93A] shrink-0 mt-0.5" />
                    <span className="line-clamp-1 leading-tight">{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing & CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#A9A3A0] block">Oylik to‘lov</span>
                <span className="text-xl sm:text-2xl font-luxury-serif font-black text-[#F4D27A]">
                  {formatMoney(activeCourse.pricePerMonth)}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Secondary CTA: Full Syllabus */}
                <button
                  type="button"
                  onClick={() => onOpenDetails(activeCourse)}
                  className="px-4 sm:px-5 py-2.5 rounded-full border border-[#D9A93A]/40 bg-[#16090D]/80 hover:bg-[#D9A93A]/15 hover:border-[#F4D27A] text-xs font-bold text-[#F7F4EE] hover:text-[#FFE7A3] transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-[inset_0_1px_2px_rgba(255,255,255,0.06)]"
                >
                  <BookOpen className="h-3.5 w-3.5 text-[#D9A93A]" />
                  <span>Batafsil dastur</span>
                </button>

                {/* Primary CTA: Register */}
                <button
                  type="button"
                  onClick={() => onOpenRegister(activeCourse.title)}
                  className="px-5 sm:px-6 py-2.5 rounded-full text-xs font-black text-[#0B0808] bg-gradient-to-r from-[#D9A93A] via-[#F4D27A] to-[#D9A93A] hover:brightness-110 shadow-[0_4px_18px_rgba(217,169,58,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center gap-1.5 cursor-pointer border border-[#FFF2C6]/40"
                >
                  <span>Guruhga yozilish</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Diagnostic Test Link */}
            {onOpenDiagnostic && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={onOpenDiagnostic}
                  className="text-[11px] font-bold text-[#D9A93A] hover:text-[#F4D27A] hover:underline flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>Qaysi kurs sizga mos kelishini aniqlash uchun bepul diagnostik test topshiring</span>
                  <ArrowRight className="h-2.5 w-2.5" />
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Grand Interactive 3D World Stage (Sized for 100vh Fit) */}
          <div className="lg:col-span-6 relative w-full aspect-square max-h-[350px] sm:max-h-[380px] lg:max-h-[410px] mx-auto flex items-center justify-center select-none">
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
