import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  BookOpen,
  Star,
  Clock,
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Award,
  Layers,
  Code,
  GraduationCap,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Course } from '../../types/admin';
import { INITIAL_COURSES } from '../../data/coursesData';
import { useI18n } from '../../lib/i18n';

interface Courses3DSectionProps {
  onOpenDetails: (course: Course) => void;
  onOpenRegister: (courseTitle: string) => void;
  onOpenDiagnostic?: () => void;
}

type CourseVisualType = 'math' | 'english' | 'it' | 'academic';

interface SatelliteObject3D {
  type: string;
  label?: string;
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
  orbitTilt: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  size: number;
  opacity: number;
}

export const Courses3DSection: React.FC<Courses3DSectionProps> = ({
  onOpenDetails,
  onOpenRegister,
  onOpenDiagnostic,
}) => {
  const { formatMoney } = useI18n();

  // Category filter state
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('all');
  const categoryFilters = [
    { key: 'all', label: 'Barchasi' },
    { key: 'til', label: 'Xorijiy tillar' },
    { key: 'it', label: 'IT & Dasturlash' },
    { key: 'aniq', label: 'Aniq fanlar & DTM' },
  ];

  // Filtered courses
  const filteredCourses = useMemo(() => {
    if (selectedCategoryKey === 'all') return INITIAL_COURSES;
    return INITIAL_COURSES.filter((c) => {
      const cat = (c.category || '').toLowerCase();
      const title = c.title.toLowerCase();
      if (selectedCategoryKey === 'til')
        return (
          cat.includes('language') ||
          cat.includes('til') ||
          title.includes('ielts') ||
          title.includes('cefr') ||
          title.includes('english') ||
          title.includes('ingliz')
        );
      if (selectedCategoryKey === 'it')
        return (
          cat.includes('programming') ||
          cat.includes('it') ||
          title.includes('dastur') ||
          title.includes('python') ||
          title.includes('frontend')
        );
      if (selectedCategoryKey === 'aniq')
        return (
          cat.includes('math') ||
          cat.includes('aniq') ||
          cat.includes('science') ||
          title.includes('matematika') ||
          title.includes('fizika') ||
          title.includes('dtm') ||
          title.includes('prezident')
        );
      return true;
    });
  }, [selectedCategoryKey]);

  // Active course index
  const [activeCourseId, setActiveCourseId] = useState<string>(INITIAL_COURSES[0].id);

  // Transition state for smooth switching
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const activeCourse = useMemo(() => {
    return (
      filteredCourses.find((c) => c.id === activeCourseId) ||
      filteredCourses[0] ||
      INITIAL_COURSES[0]
    );
  }, [filteredCourses, activeCourseId]);

  const activeIndexInFiltered = useMemo(() => {
    const idx = filteredCourses.findIndex((c) => c.id === activeCourse.id);
    return idx >= 0 ? idx : 0;
  }, [filteredCourses, activeCourse]);

  // Detect Visual Type for 3D Identity
  const visualType: CourseVisualType = useMemo(() => {
    const cat = (activeCourse.category || '').toLowerCase();
    const title = activeCourse.title.toLowerCase();
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
    }, 450);
  };

  const handlePrevCourse = () => {
    if (filteredCourses.length <= 1) return;
    const nextIdx = (activeIndexInFiltered - 1 + filteredCourses.length) % filteredCourses.length;
    handleSelectCourse(filteredCourses[nextIdx]);
  };

  const handleNextCourse = () => {
    if (filteredCourses.length <= 1) return;
    const nextIdx = (activeIndexInFiltered + 1) % filteredCourses.length;
    handleSelectCourse(filteredCourses[nextIdx]);
  };

  // ---------------------------------------------------------------------------
  // 3D CANVAS & TILT PHYSICS ENGINE (0 GC Allocations, 60 FPS)
  // ---------------------------------------------------------------------------
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Interaction tracking
  const tiltRef = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    isHovered: false,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragCurrentX: 0,
    dragCurrentY: 0,
    throwVx: 0,
    throwVy: 0,
  });

  const visualTypeRef = useRef(visualType);
  useEffect(() => {
    visualTypeRef.current = visualType;
  }, [visualType]);

  // Satellite Objects Definition
  const satellitesRef = useRef<SatelliteObject3D[]>([]);

  useEffect(() => {
    // Generate Curated Satellites based on Visual Type
    const list: SatelliteObject3D[] = [];
    const count = 7;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 135 + Math.random() * 45;
      let label = '';
      let type = 'formula';

      if (visualType === 'math') {
        const mathLabels = ['π', 'y=x²', '∫f(x)', '∑', '√x', 'a²+b²=c²', 'Δ'];
        label = mathLabels[i % mathLabels.length];
        type = i % 2 === 0 ? 'formula' : 'curve';
      } else if (visualType === 'english') {
        const engLabels = ['A', 'LEARN', 'B', 'SPEAK', 'C', 'THINK', 'GROW'];
        label = engLabels[i % engLabels.length];
        type = i % 2 === 0 ? 'letter' : 'ribbon';
      } else if (visualType === 'it') {
        const itLabels = ['<dev/>', '{ }', '01', 'git', '=>', '[]', 'UI'];
        label = itLabels[i % itLabels.length];
        type = 'code';
      } else {
        const acadLabels = ['189+', 'DTM', '★', 'A+', 'IQ', 'TOP', 'CEFR'];
        label = acadLabels[i % acadLabels.length];
        type = 'honor';
      }

      list.push({
        type,
        label,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * (radius * 0.45),
        z: Math.sin(angle) * 80,
        baseX: Math.cos(angle) * radius,
        baseY: Math.sin(angle) * (radius * 0.45),
        baseZ: Math.sin(angle) * 80,
        orbitRadius: radius,
        orbitSpeed: 0.0008 + (i % 3) * 0.0003,
        orbitPhase: angle,
        orbitTilt: (i % 2 === 0 ? 1 : -1) * 0.28,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: (Math.random() - 0.5) * 0.4,
        rotSpeedX: (Math.random() - 0.5) * 0.0012,
        rotSpeedY: 0.001 + Math.random() * 0.001,
        rotSpeedZ: (Math.random() - 0.5) * 0.0008,
        size: label.length > 2 ? 11 : 14,
        opacity: 0.24 + Math.random() * 0.16,
      });
    }

    satellitesRef.current = list;
  }, [visualType]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 540;
    let height = 540;
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

    // Reusable rotation buffer
    const rotBuf = { x: 0, y: 0, z: 0 };
    const rotatePoint = (px: number, py: number, pz: number, rx: number, ry: number, rz: number) => {
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

      // Lerp tilt physics (Smooth Apple-level inertia)
      const tilt = tiltRef.current;
      tilt.currentX += (tilt.targetX - tilt.currentX) * 0.06;
      tilt.currentY += (tilt.targetY - tilt.currentY) * 0.06;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Floating gentle hover breathing
      const floatY = Math.sin(time * 1.2) * 8;
      const floatZ = Math.cos(time * 0.9) * 12;

      // Base compound angles
      const baseRotX = -0.18 + tilt.currentY * 0.35 + Math.sin(time * 0.6) * 0.04;
      const baseRotY = 0.38 + tilt.currentX * 0.45 + Math.cos(time * 0.5) * 0.05;
      const baseRotZ = -0.08 + tilt.currentX * 0.12;

      // Moving specular highlight coordinate
      const lightPhase = time * 0.7;
      const specX = Math.sin(lightPhase) * 60;
      const specY = Math.cos(lightPhase * 0.8) * 50;

      // -----------------------------------------------------------------------
      // A. RENDER SATELLITE 3D OBJECTS (Background Layer)
      // -----------------------------------------------------------------------
      const satellites = satellitesRef.current;
      for (let i = 0; i < satellites.length; i++) {
        const sat = satellites[i];
        sat.orbitPhase += sat.orbitSpeed;
        sat.rotX += sat.rotSpeedX;
        sat.rotY += sat.rotSpeedY;
        sat.rotZ += sat.rotSpeedZ;

        const orbX = Math.cos(sat.orbitPhase) * sat.orbitRadius;
        const orbY = Math.sin(sat.orbitPhase) * (sat.orbitRadius * 0.38) + Math.sin(sat.orbitPhase * 2) * 20;
        const orbZ = Math.sin(sat.orbitPhase) * sat.orbitRadius;

        rotatePoint(orbX, orbY, orbZ, baseRotX * 0.4, baseRotY * 0.5, baseRotZ);
        const satProjX = centerX + rotBuf.x;
        const satProjY = centerY + rotBuf.y + floatY * 0.5;
        const satDepth = rotBuf.z;

        // Render behind book if depth < 0
        if (satDepth < 30) {
          const depthScale = Math.max(0.6, (400 + satDepth) / 400);
          ctx.save();
          ctx.translate(satProjX, satProjY);
          ctx.scale(depthScale, depthScale);

          ctx.font = `bold ${Math.round(sat.size)}px monospace`;
          ctx.fillStyle = `rgba(217, 168, 63, ${sat.opacity * 0.75})`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(sat.label || '', 0, 0);

          ctx.restore();
        }
      }

      // -----------------------------------------------------------------------
      // B. RENDER MAIN 3D COURSE OBJECT (3D Book or Tech Prism)
      // -----------------------------------------------------------------------
      ctx.save();
      ctx.translate(centerX, centerY + floatY);

      const curType = visualTypeRef.current;

      // BOOK DIMENSIONS
      const bw = width < 420 ? 150 : 185;
      const bh = width < 420 ? 210 : 255;
      const bThick = width < 420 ? 30 : 38;

      // Book 8 Corner Vertices in local coordinates
      const hw = bw / 2;
      const hh = bh / 2;
      const ht = bThick / 2;

      // Shaded Book Spine & Cover Colors
      let coverTop = '#4A0E17';
      let coverBottom = '#1A0408';
      let spineColor = '#6B1422';
      let accentTitle = 'MATEMATIKA';
      let subTitle = 'LUMOS ACADEMY';

      if (curType === 'english') {
        coverTop = '#141E2E';
        coverBottom = '#0A0E17';
        spineColor = '#1F2E45';
        accentTitle = 'ENGLISH';
        subTitle = 'IELTS & GRAMMAR';
      } else if (curType === 'it') {
        coverTop = '#16221E';
        coverBottom = '#0A120E';
        spineColor = '#223830';
        accentTitle = 'FRONTEND IT';
        subTitle = 'CODE & TECH';
      } else if (curType === 'academic') {
        coverTop = '#3C121D';
        coverBottom = '#140509';
        spineColor = '#5A1A2B';
        accentTitle = 'DTM & GRANT';
        subTitle = 'AKADEMIK BLOK';
      }

      // 1. Realistic Soft Drop Shadow underneath floating object
      const shadowGrad = ctx.createRadialGradient(0, hh + 45, 10, 0, hh + 45, hw * 1.5);
      shadowGrad.addColorStop(0, 'rgba(5, 3, 4, 0.75)');
      shadowGrad.addColorStop(0.5, 'rgba(5, 3, 4, 0.35)');
      shadowGrad.addColorStop(1, 'rgba(5, 3, 4, 0)');
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(0, hh + 45 - floatZ * 0.3, hw * 1.3, 24, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Book 3D Vertices Projection
      const verts = [
        // Front cover (z = ht)
        [-hw, -hh, ht], [hw, -hh, ht], [hw, hh, ht], [-hw, hh, ht],
        // Back cover (z = -ht)
        [-hw, -hh, -ht], [hw, -hh, -ht], [hw, hh, -ht], [-hw, hh, -ht],
      ];

      const projVerts = verts.map((v) => {
        rotatePoint(v[0], v[1], v[2], baseRotX, baseRotY, baseRotZ);
        return { x: rotBuf.x, y: rotBuf.y, z: rotBuf.z };
      });

      // Front Face
      const f0 = projVerts[0];
      const f1 = projVerts[1];
      const f2 = projVerts[2];
      const f3 = projVerts[3];

      // Back Face
      const b0 = projVerts[4];
      const b1 = projVerts[5];
      const b2 = projVerts[6];
      const b3 = projVerts[7];

      // A. Draw Ivory Pages Block (Right side: f1, b1, b2, f2)
      ctx.beginPath();
      ctx.moveTo(f1.x, f1.y);
      ctx.lineTo(b1.x, b1.y);
      ctx.lineTo(b2.x, b2.y);
      ctx.lineTo(f2.x, f2.y);
      ctx.closePath();
      const pageGrad = ctx.createLinearGradient(f1.x, f1.y, b2.x, b2.y);
      pageGrad.addColorStop(0, 'rgba(242, 235, 218, 0.95)');
      pageGrad.addColorStop(0.5, 'rgba(215, 204, 182, 0.90)');
      pageGrad.addColorStop(1, 'rgba(180, 168, 145, 0.85)');
      ctx.fillStyle = pageGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(217, 168, 63, 0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Individual page lines
      ctx.strokeStyle = 'rgba(160, 148, 125, 0.4)';
      ctx.beginPath();
      const midPagesX = (f1.x + b1.x) / 2;
      const midPagesY = (f1.y + b1.y) / 2;
      const midPagesX2 = (f2.x + b2.x) / 2;
      const midPagesY2 = (f2.y + b2.y) / 2;
      ctx.moveTo(midPagesX, midPagesY);
      ctx.lineTo(midPagesX2, midPagesY2);
      ctx.stroke();

      // B. Draw Top Pages Block (Top side: f0, f1, b1, b0)
      ctx.beginPath();
      ctx.moveTo(f0.x, f0.y);
      ctx.lineTo(f1.x, f1.y);
      ctx.lineTo(b1.x, b1.y);
      ctx.lineTo(b0.x, b0.y);
      ctx.closePath();
      ctx.fillStyle = 'rgba(225, 216, 195, 0.92)';
      ctx.fill();
      ctx.stroke();

      // C. Draw Bottom Pages Block (Bottom side: f3, f2, b2, b3)
      ctx.beginPath();
      ctx.moveTo(f3.x, f3.y);
      ctx.lineTo(f2.x, f2.y);
      ctx.lineTo(b2.x, b2.y);
      ctx.lineTo(b3.x, b3.y);
      ctx.closePath();
      ctx.fillStyle = 'rgba(195, 185, 165, 0.95)';
      ctx.fill();
      ctx.stroke();

      // D. Draw Spine (Left side: f0, b0, b3, f3)
      ctx.beginPath();
      ctx.moveTo(f0.x, f0.y);
      ctx.lineTo(b0.x, b0.y);
      ctx.lineTo(b3.x, b3.y);
      ctx.lineTo(f3.x, f3.y);
      ctx.closePath();
      const spineGrad = ctx.createLinearGradient(f0.x, f0.y, b3.x, b3.y);
      spineGrad.addColorStop(0, spineColor);
      spineGrad.addColorStop(1, '#0C0305');
      ctx.fillStyle = spineGrad;
      ctx.fill();
      ctx.strokeStyle = '#F3D276';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // E. Draw Front Cover Face with Bevel and Gold Typography
      ctx.beginPath();
      ctx.moveTo(f0.x, f0.y);
      ctx.lineTo(f1.x, f1.y);
      ctx.lineTo(f2.x, f2.y);
      ctx.lineTo(f3.x, f3.y);
      ctx.closePath();

      const coverGrad = ctx.createLinearGradient(f0.x, f0.y, f2.x, f2.y);
      coverGrad.addColorStop(0, coverTop);
      coverGrad.addColorStop(0.65, coverBottom);
      coverGrad.addColorStop(1, '#060203');
      ctx.fillStyle = coverGrad;
      ctx.fill();

      // Gold Perimeter Rim
      ctx.strokeStyle = '#F3D276';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // Inner Gold Embossed Frame
      const inScale = 0.88;
      const if0x = f0.x * inScale;
      const if0y = f0.y * inScale;
      const if1x = f1.x * inScale;
      const if1y = f1.y * inScale;
      const if2x = f2.x * inScale;
      const if2y = f2.y * inScale;
      const if3x = f3.x * inScale;
      const if3y = f3.y * inScale;

      ctx.beginPath();
      ctx.moveTo(if0x, if0y);
      ctx.lineTo(if1x, if1y);
      ctx.lineTo(if2x, if2y);
      ctx.lineTo(if3x, if3y);
      ctx.closePath();
      ctx.strokeStyle = 'rgba(243, 210, 118, 0.45)';
      ctx.lineWidth = 0.9;
      ctx.stroke();

      // Specular Light Sheen across Cover
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(f0.x, f0.y);
      ctx.lineTo(f1.x, f1.y);
      ctx.lineTo(f2.x, f2.y);
      ctx.lineTo(f3.x, f3.y);
      ctx.closePath();
      ctx.clip();

      const sheenGrad = ctx.createRadialGradient(specX, specY, 10, specX, specY, hw * 1.4);
      sheenGrad.addColorStop(0, 'rgba(255, 240, 195, 0.35)');
      sheenGrad.addColorStop(0.4, 'rgba(217, 168, 63, 0.12)');
      sheenGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sheenGrad;
      ctx.fillRect(-hw * 1.5, -hh * 1.5, bw * 2, bh * 2);
      ctx.restore();

      // F. Embossed Title on Cover
      ctx.save();
      const faceMidX = (f0.x + f1.x + f2.x + f3.x) / 4;
      const faceMidY = (f0.y + f1.y + f2.y + f3.y) / 4;
      ctx.translate(faceMidX, faceMidY);

      // Perspective skew matching front plane angle
      const skewAngle = Math.atan2(f1.y - f0.y, f1.x - f0.x);
      ctx.rotate(skewAngle);

      // Header Subtitle
      ctx.font = 'bold 9px -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(243, 210, 118, 0.85)';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '2.5px';
      ctx.fillText(subTitle, 0, -hh * 0.42);

      // Thin divider
      ctx.strokeStyle = 'rgba(217, 168, 63, 0.6)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-45, -hh * 0.32);
      ctx.lineTo(45, -hh * 0.32);
      ctx.stroke();

      // Main Golden Title
      ctx.font = '900 18px "Playfair Display", serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(accentTitle, 0, -hh * 0.08);

      // Gold Glow Shadow behind title
      ctx.fillStyle = '#F3D276';
      ctx.fillText(accentTitle, 0.5, -hh * 0.08 + 0.5);

      // Course Emblem / Geometric Seal in center of cover
      ctx.strokeStyle = '#F3D276';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.arc(0, hh * 0.28, 22, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, hh * 0.28, 18, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(217, 168, 63, 0.5)';
      ctx.stroke();

      // Center Icon Glyphs
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = '#F3D276';
      const sealGlyph = curType === 'math' ? '∑ π' : curType === 'english' ? 'EN' : curType === 'it' ? '< / >' : '★ DTM';
      ctx.fillText(sealGlyph, 0, hh * 0.28 + 4);

      ctx.restore();

      ctx.restore();

      // -----------------------------------------------------------------------
      // C. RENDER SATELLITE 3D OBJECTS (Foreground Layer)
      // -----------------------------------------------------------------------
      for (let i = 0; i < satellites.length; i++) {
        const sat = satellites[i];
        const orbX = Math.cos(sat.orbitPhase) * sat.orbitRadius;
        const orbY = Math.sin(sat.orbitPhase) * (sat.orbitRadius * 0.38) + Math.sin(sat.orbitPhase * 2) * 20;
        const orbZ = Math.sin(sat.orbitPhase) * sat.orbitRadius;

        rotatePoint(orbX, orbY, orbZ, baseRotX * 0.4, baseRotY * 0.5, baseRotZ);
        const satProjX = centerX + rotBuf.x;
        const satProjY = centerY + rotBuf.y + floatY * 0.5;
        const satDepth = rotBuf.z;

        // Render in front of book if depth >= 30
        if (satDepth >= 30) {
          const depthScale = Math.max(0.7, (400 + satDepth) / 400);
          ctx.save();
          ctx.translate(satProjX, satProjY);
          ctx.scale(depthScale, depthScale);

          // Subtle glowing rim halo behind satellite
          ctx.fillStyle = 'rgba(217, 168, 63, 0.15)';
          ctx.beginPath();
          ctx.arc(0, 0, sat.size * 1.4, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = `bold ${Math.round(sat.size)}px monospace`;
          ctx.fillStyle = '#F3D276';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(sat.label || '', 0, 0);

          ctx.restore();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    // Mouse & Touch Event Handlers
    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      if (tiltRef.current.isDragging) {
        const dx = e.clientX - tiltRef.current.dragCurrentX;
        const dy = e.clientY - tiltRef.current.dragCurrentY;
        tiltRef.current.dragCurrentX = e.clientX;
        tiltRef.current.dragCurrentY = e.clientY;
        tiltRef.current.targetX += dx * 0.006;
        tiltRef.current.targetY += dy * 0.006;
        e.preventDefault();
        return;
      }

      tiltRef.current.targetX = Math.max(-1, Math.min(1, normX));
      tiltRef.current.targetY = Math.max(-1, Math.min(1, normY));
    };

    const handlePointerDown = (e: PointerEvent) => {
      tiltRef.current.isDragging = true;
      tiltRef.current.dragStartX = e.clientX;
      tiltRef.current.dragStartY = e.clientY;
      tiltRef.current.dragCurrentX = e.clientX;
      tiltRef.current.dragCurrentY = e.clientY;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch (err) {}
    };

    const handlePointerUp = (e: PointerEvent) => {
      tiltRef.current.isDragging = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch (err) {}
    };

    const handlePointerEnter = () => {
      tiltRef.current.isHovered = true;
    };

    const handlePointerLeave = () => {
      tiltRef.current.isHovered = false;
      if (!tiltRef.current.isDragging) {
        tiltRef.current.targetX = 0;
        tiltRef.current.targetY = 0;
      }
    };

    canvas.addEventListener('pointermove', handlePointerMove, { passive: false });
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointercancel', handlePointerUp);
    canvas.addEventListener('pointerenter', handlePointerEnter);
    canvas.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('resize', updateSize);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointercancel', handlePointerUp);
      canvas.removeEventListener('pointerenter', handlePointerEnter);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <section
      id="courses"
      className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto relative z-10 select-text"
    >
      {/* Background Architectural Ambient Radial Light */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-radial from-[#D9A83F]/08 via-[#4A0E17]/10 to-transparent blur-3xl pointer-events-none" />

      {/* -----------------------------------------------------------------------
          1. SECTION HERO & CATEGORY BAR
          ----------------------------------------------------------------------- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 relative z-10">
        <div className="space-y-4 max-w-2xl">
          {/* Section Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16090D] border border-[#D9A93A]/35 text-xs font-bold uppercase tracking-widest text-[#D9A93A] shadow-[0_4px_16px_rgba(217,169,58,0.12)]">
            <BookOpen className="h-3.5 w-3.5" />
            <span>3D Ta’lim Galereyasi</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-luxury-serif font-black text-[#F7F4EE] leading-[1.12]">
            Kelajagingiz uchun <br />
            <span className="text-[#D9A93A] font-luxury-serif">bilimni tanlang.</span>
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#B0A7A2] font-normal leading-relaxed">
            Har bir kurs nazariya, chuqur amaliy laboratoriyalar, diagnostik testlar va shaxsiy murabbiy ko‘magi asosida tuzilgan.
          </p>
        </div>

        {/* Category Pills Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          {categoryFilters.map((cat) => {
            const isSelected = selectedCategoryKey === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategoryKey(cat.key)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#D9A93A] via-[#F3D276] to-[#D9A93A] text-[#080607] font-black shadow-[0_4px_20px_rgba(217,169,58,0.35)] scale-105'
                    : 'bg-[#14080B]/80 border border-[#D9A93A]/25 text-[#A9A3A0] hover:text-[#F7F4EE] hover:border-[#D9A93A]/60'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* -----------------------------------------------------------------------
          2. FEATURED 3D COURSE SHOWCASE (Asymmetrical Luxury Gallery Layout)
          ----------------------------------------------------------------------- */}
      <div className="relative rounded-[40px] bg-gradient-to-br from-[#16090D] via-[#0E0507] to-[#070304] border border-[#D9A93A]/30 p-6 sm:p-10 lg:p-14 shadow-[0_30px_90px_rgba(0,0,0,0.92)] mb-14 overflow-hidden">
        {/* Subtle Architectural Coordinate Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#D9A93A_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          {/* LEFT: Rich Course Information & Metadata */}
          <div
            className={`lg:col-span-7 space-y-6 transition-all duration-500 ${
              isTransitioning ? 'opacity-40 translate-y-2' : 'opacity-100 translate-y-0'
            }`}
          >
            {/* Top Navigation Row: Index & Category */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-luxury-serif font-black text-[#D9A93A]">
                  {String(activeIndexInFiltered + 1).padStart(2, '0')} / {String(filteredCourses.length).padStart(2, '0')}
                </span>
                <div className="h-4 w-[1px] bg-[#D9A93A]/30" />
                <span className="px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#D9A93A]/15 text-[#F3D276] border border-[#D9A93A]/35">
                  {activeCourse.category}
                </span>
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevCourse}
                  className="p-2 rounded-full border border-[#D9A93A]/30 hover:border-[#D9A93A] text-[#A9A3A0] hover:text-[#F7F4EE] hover:bg-[#D9A93A]/10 transition-colors cursor-pointer"
                  title="Oldingi kurs"
                  aria-label="Oldingi kurs"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextCourse}
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

            {/* Course Description */}
            <p className="text-sm sm:text-base text-[#BDB5B0] leading-relaxed font-normal">
              {activeCourse.description}
            </p>

            {/* Key Course Specifications Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 py-4 border-y border-[#D9A93A]/20">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-[#D9A93A]/10 border border-[#D9A93A]/25 flex items-center justify-center text-[#D9A93A] shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[#A9A3A0] font-semibold uppercase block">Davomiyligi</span>
                  <span className="text-xs font-bold text-[#F7F4EE]">{activeCourse.durationMonths} oy ({activeCourse.lessonsCount} dars)</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-[#D9A93A]/10 border border-[#D9A93A]/25 flex items-center justify-center text-[#D9A93A] shrink-0">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[#A9A3A0] font-semibold uppercase block">Dars Grafigi</span>
                  <span className="text-xs font-bold text-[#F7F4EE] line-clamp-1">{(activeCourse.schedule || '').split('(')[0] || 'Haftada 3 kun'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-[#D9A93A]/10 border border-[#D9A93A]/25 flex items-center justify-center text-[#D9A93A] shrink-0">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[#A9A3A0] font-semibold uppercase block">Ustoz</span>
                  <span className="text-xs font-bold text-[#F7F4EE] line-clamp-1">{activeCourse.instructor || 'Yetakchi ustoz'}</span>
                </div>
              </div>
            </div>

            {/* Syllabus Highlights Preview */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-[#D9A93A] tracking-wide uppercase flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Kursda nimalarni o‘rganasiz:</span>
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

            {/* Pricing & CTA Action Tools */}
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
                  className="px-7 py-3.5 rounded-full text-xs font-black text-[#0B0808] bg-gradient-to-r from-[#D9A93A] via-[#F4D27A] to-[#D9A93A] hover:brightness-110 shadow-[0_6px_25px_rgba(217,168,63,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center gap-2 cursor-pointer border border-[#FFF2C6]/40"
                >
                  <span>Guruhga yozilish</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Large Interactive 3D Course Visual Stage */}
          <div
            ref={containerRef}
            className="lg:col-span-5 relative w-full aspect-square max-w-[480px] mx-auto flex items-center justify-center select-none"
          >
            {/* Ambient Behind-Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[85%] h-[85%] rounded-full bg-radial from-[#D9A83F]/20 via-[#4A0E17]/25 to-transparent blur-2xl" />
            </div>

            {/* 3D Canvas */}
            <canvas
              ref={canvasRef}
              className="w-full h-full block cursor-grab active:cursor-grabbing touch-none select-none relative z-10"
              style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
              title="3D Kurs Objekti: Aylantirish uchun ushlang va siljiting"
            />

            {/* Micro Interaction Hint Badge */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#120608]/80 backdrop-blur-md border border-[#D9A93A]/25 text-[10px] font-semibold text-[#D9A93A] pointer-events-none flex items-center gap-1.5 whitespace-nowrap shadow-lg">
              <Layers className="h-3 w-3" />
              <span>3D Fazo: Kursni aylantirish uchun ushlang</span>
            </div>
          </div>
        </div>
      </div>

      {/* -----------------------------------------------------------------------
          3. INTERACTIVE 3D COURSE SELECTOR STRIP (Gallery Cards)
          ----------------------------------------------------------------------- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A9A3A0]">
            Barcha yo‘nalishlar galereyasi ({filteredCourses.length}):
          </span>
          {onOpenDiagnostic && (
            <button
              type="button"
              onClick={onOpenDiagnostic}
              className="text-xs font-bold text-[#D9A93A] hover:text-[#F3D276] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Qaysi kurs mos kelishini bilmaysizmi?</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, idx) => {
            const isCurrent = course.id === activeCourse.id;
            return (
              <div
                key={course.id}
                onClick={() => handleSelectCourse(course)}
                className={`group relative rounded-[28px] p-6 transition-all duration-400 cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-gradient-to-b from-[#220B12] via-[#140609] to-[#0A0305] border-2 border-[#D9A93A] shadow-[0_15px_40px_rgba(217,169,58,0.25)] -translate-y-1.5'
                    : 'bg-gradient-to-b from-[#14080B]/90 via-[#0E0507]/90 to-[#080607]/90 border border-[#D9A93A]/20 hover:border-[#D9A93A]/60 hover:-translate-y-1 shadow-[0_10px_30px_rgba(0,0,0,0.7)]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#D9A93A]/15 text-[#F3D276] border border-[#D9A93A]/30">
                      {course.category}
                    </span>
                    <span className="text-xs font-luxury-serif font-bold text-[#D9A93A]/70">
                      #{String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h4 className="text-lg font-luxury-serif font-black text-[#F7F4EE] group-hover:text-[#F3D276] transition-colors line-clamp-1">
                    {course.title}
                  </h4>

                  <p className="text-xs text-[#A9A3A0] line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-[#D9A93A]/15 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#A9A3A0] font-semibold block">Oylik to‘lov</span>
                    <span className="text-base font-black text-[#F3D276]">
                      {formatMoney(course.pricePerMonth)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenRegister(course.title);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      isCurrent
                        ? 'bg-gradient-to-r from-[#D9A93A] via-[#F3D276] to-[#D9A93A] text-[#080607] font-black shadow-md'
                        : 'border border-[#D9A93A]/40 text-[#D9A93A] hover:bg-[#D9A93A]/15'
                    }`}
                  >
                    <span>Yozilish</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
