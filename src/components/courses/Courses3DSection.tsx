import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  BookOpen,
  Clock,
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  GraduationCap,
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

export const Courses3DSection: React.FC<Courses3DSectionProps> = ({
  onOpenDetails,
  onOpenRegister,
  onOpenDiagnostic,
}) => {
  const { formatMoney } = useI18n();

  // Active course state (defaulting to Matematika as in reference image)
  const [activeCourseId, setActiveCourseId] = useState<string>(() => {
    const mathCourse = INITIAL_COURSES.find(
      (c) => c.title.toLowerCase().includes('matematika') || c.category.toLowerCase().includes('matematika')
    );
    return mathCourse ? mathCourse.id : INITIAL_COURSES[0].id;
  });
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
    }, 320);
  };

  const handlePrev = () => {
    const nextIdx = (activeIndex - 1 + INITIAL_COURSES.length) % INITIAL_COURSES.length;
    handleSelectCourse(INITIAL_COURSES[nextIdx]);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % INITIAL_COURSES.length;
    handleSelectCourse(INITIAL_COURSES[nextIdx]);
  };

  // Clean course title & instructor for exact reference typography
  const cleanTitle = useMemo(() => {
    return (activeCourse.title || '').replace(/\s*\(.*?\)\s*/g, '').trim() || activeCourse.title;
  }, [activeCourse.title]);

  const instructorDisplay = useMemo(() => {
    return activeCourse.instructor ? `(${activeCourse.instructor})` : '';
  }, [activeCourse.instructor]);

  // ---------------------------------------------------------------------------
  // 3D CANVAS: MATHEMATICAL UNIVERSE (100% MATCH TO REFERENCE IMAGE)
  // ---------------------------------------------------------------------------
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Book Showroom Turntable Angle & Autonomous Spin
  const bookPhysicsRef = useRef({
    rotY: -0.44, // Exact showroom angle from reference image (~ -25 deg)
    angVy: 0.0016, // Slow autonomous rotation
    targetHoverScale: 1.0,
    hoverScale: 1.0,
    isHovered: false,
  });

  const currentThemeRef = useRef<CourseVisualTheme>(theme);
  currentThemeRef.current = theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 760;
    let height = 620;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.0);

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

    // 3D vector rotation buffer
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

      // Autonomous horizontal rotation around central vertical axis
      bookPhys.rotY += bookPhys.angVy;
      bookPhys.hoverScale += (bookPhys.targetHoverScale - bookPhys.hoverScale) * 0.1;

      ctx.clearRect(0, 0, width, height);

      // Center calibrated so book and right-side objects fit with generous breathing space
      const centerX = width * 0.44;
      const centerY = height * 0.50;
      const floatY = Math.sin(time * 1.2) * 3.5;
      const cameraBreathing = 1.0 + Math.sin(time * 0.22) * 0.025;

      // Ambient Behind-Book Glow
      const bgGlow = ctx.createRadialGradient(centerX + 30, centerY - 10, 10, centerX + 30, centerY - 10, 280);
      bgGlow.addColorStop(0, 'rgba(217, 169, 58, 0.22)');
      bgGlow.addColorStop(0.35, 'rgba(110, 22, 36, 0.18)');
      bgGlow.addColorStop(0.7, 'rgba(18, 6, 10, 0.45)');
      bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bgGlow;
      ctx.beginPath();
      ctx.arc(centerX + 30, centerY - 10, 280, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric Golden Bokeh Particles
      for (let p = 0; p < 16; p++) {
        const bx = Math.sin(time * 0.32 + p * 1.35) * (width * 0.46);
        const by = Math.cos(time * 0.26 + p * 1.15) * (height * 0.44);
        const br = (p % 3 === 0 ? 2.5 : 1.5) * (1 + Math.sin(time * 0.8 + p) * 0.3);
        const bAlpha = 0.20 + 0.18 * Math.sin(time * 1.1 + p);
        ctx.fillStyle = `rgba(244, 210, 122, ${bAlpha})`;
        ctx.beginPath();
        ctx.arc(centerX + bx, centerY + by, br, 0, Math.PI * 2);
        ctx.fill();
      }

      // Sweeping Curved Golden Light Arc (Top in Reference Image)
      ctx.save();
      ctx.beginPath();
      const arcCenterX = centerX + 40;
      const arcCenterY = centerY - 165 + floatY * 0.4;
      ctx.ellipse(arcCenterX, arcCenterY, 140, 52, -0.22, Math.PI * 0.85, Math.PI * 1.75);
      const arcGrad = ctx.createLinearGradient(arcCenterX - 100, arcCenterY, arcCenterX + 100, arcCenterY);
      arcGrad.addColorStop(0, 'rgba(217, 169, 58, 0)');
      arcGrad.addColorStop(0.5, 'rgba(255, 246, 220, 0.75)');
      arcGrad.addColorStop(1, 'rgba(217, 169, 58, 0)');
      ctx.strokeStyle = arcGrad;
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.restore();

      // -----------------------------------------------------------------------
      // 2. RENDER BACK HALF OF GRAND INSCRIBED ORBITAL RING (BEHIND BOOK)
      // -----------------------------------------------------------------------
      const ringRadius = 152;
      const ringTiltX = 0.48; // ~28 deg tilt matching reference
      const ringRotY = time * 0.05;

      ctx.save();
      ctx.translate(centerX, centerY + floatY * 0.5);
      drawGrandInscribedRing(ctx, ringRadius, ringTiltX, ringRotY, 'back');
      drawNestedTiltedRing(ctx, 100, -0.38, -time * 0.07, 'back');
      ctx.restore();

      // -----------------------------------------------------------------------
      // 3. BACKGROUND MATHEMATICAL OBJECTS (EXACT REFERENCE POSITIONS)
      // -----------------------------------------------------------------------
      ctx.save();
      ctx.translate(centerX, centerY + floatY);

      // A. Sine Wave along Coordinate Axes (Top-Left in Reference Image)
      drawCoordinateSineWave(ctx, -155, -95, time);

      // B. 3D Wireframe Icosahedron / Polyhedron (Left in Reference Image)
      drawWireframeIcosahedron(ctx, -165, 25, 26, time * 0.4);

      // C. Small Golden Sphere (Left of Book)
      drawGlossyGoldSphere(ctx, -85, -65, 7.0);

      // D. 3D Floating Double Helix / Spiral (Right in Reference Image)
      drawDoubleHelix(ctx, 155, -110, 24, time);

      // E. 3D Parametric Saddle Surface Mesh (Right in Reference Image)
      drawSaddleMesh(ctx, 220, -45, 28, time * 0.35);

      // F. Small Golden Sphere (Near Pi / Helix)
      drawGlossyGoldSphere(ctx, 135, -90, 6.0);

      // G. 3D Wireframe Pyramid / Cone (Bottom Right in Reference Image)
      drawWireframePyramid(ctx, 235, 150, 28, time * 0.3);

      // H. Floating Mathematical Formulas:
      // Pi (Top-Right in Reference Image)
      drawGlowingFormula(ctx, 105, -165, 'π', 32, '#F4D27A');
      // Integral (Bottom-Left in Reference Image)
      drawGlowingFormula(ctx, -125, 105, '∫', 34, '#F4D27A');
      // a² + b² = c² (Right in Reference Image)
      drawGlowingFormula(ctx, 195, 45, 'a² + b² = c²', 15, '#EAE4DC');
      // Sigma (Right below formula in Reference Image)
      drawGlowingFormula(ctx, 200, 105, '∑', 24, '#F4D27A');

      ctx.restore();

      // -----------------------------------------------------------------------
      // 4. MULTI-TIERED CIRCULAR BRONZE-GOLD PEDESTAL (UNDER BOOK)
      // -----------------------------------------------------------------------
      ctx.save();
      ctx.translate(centerX, centerY + floatY);

      const bw = 196;
      const bh = Math.round(bw * 1.35); // 265px
      const bThick = 34;
      const hw = bw / 2;
      const hh = bh / 2;
      const ht = bThick / 2;

      const pedY = hh + 30;

      // Floor Contact Glow & Drop Shadow
      const floorGlow = ctx.createRadialGradient(0, pedY + 18, 8, 0, pedY + 18, 205);
      floorGlow.addColorStop(0, 'rgba(217, 169, 58, 0.40)');
      floorGlow.addColorStop(0.35, 'rgba(92, 20, 32, 0.48)');
      floorGlow.addColorStop(0.7, 'rgba(8, 2, 4, 0.92)');
      floorGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = floorGlow;
      ctx.beginPath();
      ctx.ellipse(0, pedY + 18, 195, 40, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pedestal Tier 3 (Base Plinth): Radius 165, Height 12
      ctx.fillStyle = '#160806';
      ctx.beginPath();
      ctx.ellipse(0, pedY + 15, 165, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#6E3214';
      ctx.lineWidth = 1.3;
      ctx.stroke();

      // Pedestal Tier 2 (Middle Beveled Ring): Radius 135, Height 9
      const t2Grad = ctx.createLinearGradient(-135, 0, 135, 0);
      t2Grad.addColorStop(0, '#2A1009');
      t2Grad.addColorStop(0.25, '#683315');
      t2Grad.addColorStop(0.5, '#C99238');
      t2Grad.addColorStop(0.75, '#683315');
      t2Grad.addColorStop(1, '#2A1009');
      ctx.fillStyle = t2Grad;
      ctx.beginPath();
      ctx.ellipse(0, pedY + 8, 135, 25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#D9A93A';
      ctx.lineWidth = 1.3;
      ctx.stroke();

      // Pedestal Tier 1 (Top Stage Platform Disc): Radius 110
      const t1Grad = ctx.createRadialGradient(0, pedY, 4, 0, pedY, 110);
      t1Grad.addColorStop(0, '#FFF6DC');
      t1Grad.addColorStop(0.28, '#D9A93A');
      t1Grad.addColorStop(0.68, '#5E2B12');
      t1Grad.addColorStop(1, '#1A0B08');
      ctx.fillStyle = t1Grad;
      ctx.beginPath();
      ctx.ellipse(0, pedY, 110, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFEAA7';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner Concentric Gold Ring Groove
      ctx.beginPath();
      ctx.ellipse(0, pedY, 94, 17, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(217, 169, 58, 0.65)';
      ctx.lineWidth = 0.9;
      ctx.stroke();

      // Dynamic Book Contact Shadow on Top of Pedestal
      const effW = (Math.abs(hw * Math.cos(bookPhys.rotY)) + Math.abs(ht * Math.sin(bookPhys.rotY))) * 1.25;
      const bookShadow = ctx.createRadialGradient(0, pedY - 2, 4, 0, pedY - 2, effW * 1.1);
      bookShadow.addColorStop(0, 'rgba(4, 2, 3, 0.88)');
      bookShadow.addColorStop(0.6, 'rgba(4, 2, 3, 0.32)');
      bookShadow.addColorStop(1, 'rgba(4, 2, 3, 0)');
      ctx.fillStyle = bookShadow;
      ctx.beginPath();
      ctx.ellipse(0, pedY - 2, effW * 1.1, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Floating Parchment Manuscript Pages (At Pedestal Base)
      drawCurledParchment(ctx, -50, pedY - 12, 42, 28, -0.22);
      drawCurledParchment(ctx, 72, pedY - 8, 36, 24, 0.32);

      // Foreground Glossy Metallic Gold Sphere (The Orb on Pedestal Rim)
      drawGlossyGoldSphere(ctx, -78, pedY + 8, 24);

      ctx.restore();

      // -----------------------------------------------------------------------
      // 5. RENDER THE HERO 3D TEXTBOOK (100% 2-RASM ARTWORK)
      // -----------------------------------------------------------------------
      ctx.save();
      ctx.translate(centerX, centerY + floatY);
      ctx.scale(bookPhys.hoverScale * cameraBreathing, bookPhys.hoverScale * cameraBreathing);

      const ry = bookPhys.rotY;
      const rx = 0.08; // ~4.5 deg backward pitch
      const rz = 0;
      const overhang = 4.0;

      const coverFrontVerts = [
        [-hw, -hh, ht], [hw, -hh, ht], [hw, hh, ht], [-hw, hh, ht],
        [-hw, -hh, ht - 3], [hw, -hh, ht - 3], [hw, hh, ht - 3], [-hw, hh, ht - 3],
      ];
      const coverBackVerts = [
        [-hw, -hh, -ht + 3], [hw, -hh, -ht + 3], [hw, hh, -ht + 3], [-hw, hh, -ht + 3],
        [-hw, -hh, -ht], [hw, -hh, -ht], [hw, hh, -ht], [-hw, hh, -ht],
      ];
      const pageLeft = -hw + 5;
      const pageRight = hw - overhang;
      const pageTop = -hh + overhang;
      const pageBottom = hh - overhang;
      const pageVerts = [
        [pageLeft, pageTop, ht - 3], [pageRight, pageTop, ht - 3], [pageRight, pageBottom, ht - 3], [pageLeft, pageBottom, ht - 3],
        [pageLeft, pageTop, -ht + 3], [pageRight, pageTop, -ht + 3], [pageRight, pageBottom, -ht + 3], [pageLeft, pageBottom, -ht + 3],
      ];

      const projectVert = (v: number[]) => {
        rotate3D(v[0], v[1], v[2], rx, ry, rz);
        const persp = 540 / (540 + rotBuf.z);
        return { x: rotBuf.x * persp, y: rotBuf.y * persp, z: rotBuf.z };
      };

      const projCoverFront = coverFrontVerts.map(projectVert);
      const projCoverBack = coverBackVerts.map(projectVert);
      const projPages = pageVerts.map(projectVert);

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

      // Theme Palette
      const activeTheme = currentThemeRef.current;
      let coverTopColor = '#460E1C';
      let coverBotColor = '#160408';
      let spineColor = '#5A1224';
      let bookTitle = 'MATHEMATICS';

      if (activeTheme === 'english') {
        coverTopColor = '#141E32';
        coverBotColor = '#070B14';
        spineColor = '#1D2D48';
        bookTitle = 'ENGLISH';
      } else if (activeTheme === 'it') {
        coverTopColor = '#10241A';
        coverBotColor = '#05100B';
        spineColor = '#173627';
        bookTitle = 'FRONTEND IT';
      } else if (activeTheme === 'academic') {
        coverTopColor = '#30101A';
        coverBotColor = '#100308';
        spineColor = '#4A1627';
        bookTitle = 'DTM & GRANT';
      }

      // 1. Back Cover Plate
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
      }

      // 2. Curved Spine Plate (Left edge in Reference Image)
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

        // 4 Raised Gold Horizontal Ribs on Spine
        ctx.strokeStyle = 'rgba(244, 210, 122, 0.85)';
        ctx.lineWidth = 1.3;
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

        // Spine Vertical Gold Title Text
        const spineMidX = (cf0.x + projCoverBack[4].x + projCoverBack[7].x + cf3.x) / 4;
        const spineMidY = (cf0.y + projCoverBack[4].y + projCoverBack[7].y + cf3.y) / 4;
        ctx.save();
        ctx.translate(spineMidX, spineMidY);
        const spineAngle = Math.atan2(cf3.y - cf0.y, cf3.x - cf0.x);
        ctx.rotate(spineAngle - Math.PI / 2);
        ctx.font = 'bold 9px "Playfair Display", serif';
        ctx.fillStyle = 'rgba(244, 210, 122, 0.85)';
        ctx.textAlign = 'center';
        ctx.letterSpacing = '2px';
        ctx.fillText(bookTitle, 0, 3);
        ctx.restore();
      }

      // 3. Recessed Stratified Ivory Page Block (Right Edge)
      if (pagesRightNormalZ > 0) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p5.x, p5.y);
        ctx.lineTo(p6.x, p6.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();
        const pageGrad = ctx.createLinearGradient(p1.x, p1.y, p6.x, p6.y);
        pageGrad.addColorStop(0, 'rgba(252, 248, 240, 0.98)');
        pageGrad.addColorStop(0.5, 'rgba(230, 222, 206, 0.94)');
        pageGrad.addColorStop(1, 'rgba(185, 172, 150, 0.90)');
        ctx.fillStyle = pageGrad;
        ctx.fill();
        ctx.strokeStyle = 'rgba(217, 169, 58, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Individual paper stratification lines
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
        ctx.fillStyle = 'rgba(240, 234, 220, 0.95)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(217, 169, 58, 0.35)';
        ctx.stroke();
      }

      // 5. Front Cover Plate (100% 2-Rasm Artwork)
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

        // Subtle specular highlight sheen on front cover
        const specGrad = ctx.createRadialGradient(
          cf0.x * 0.4 + projCoverFront[2].x * 0.6,
          cf0.y * 0.4 + projCoverFront[2].y * 0.6,
          6,
          cf0.x * 0.4 + projCoverFront[2].x * 0.6,
          cf0.y * 0.4 + projCoverFront[2].y * 0.6,
          hw * 1.3
        );
        specGrad.addColorStop(0, 'rgba(255, 244, 212, 0.38)');
        specGrad.addColorStop(0.35, 'rgba(217, 169, 58, 0.20)');
        specGrad.addColorStop(0.7, 'rgba(110, 22, 36, 0.10)');
        specGrad.addColorStop(1, 'rgba(5, 1, 2, 0)');
        ctx.fillStyle = specGrad;
        ctx.fill();

        // Outer Gold Bevel Rim
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

        // Front Cover Typography & Emblem Artwork
        const faceMidX = (cf0.x + cf1.x + projCoverFront[2].x + cf3.x) / 4;
        const faceMidY = (cf0.y + cf1.y + projCoverFront[2].y + cf3.y) / 4;

        ctx.save();
        ctx.translate(faceMidX, faceMidY);
        const skewAngle = Math.atan2(cf1.y - cf0.y, cf1.x - cf0.x);
        ctx.rotate(skewAngle);

        ctx.textAlign = 'center';

        // 1. Embossed Gold Royal Crown Emblem (Top Center in Reference Image)
        ctx.strokeStyle = '#F4D27A';
        ctx.fillStyle = '#F4D27A';
        ctx.lineWidth = 1.0;
        const crW = 13;
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
        ctx.font = 'bold 11px "Playfair Display", serif';
        ctx.fillStyle = 'rgba(244, 210, 122, 0.95)';
        ctx.fillText('LUMOS', 0, -hh * 0.33);

        // 3. Main Golden Book Title (MATHEMATICS)
        ctx.font = '900 17px "Playfair Display", serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(bookTitle, 0, -hh * 0.19);
        ctx.fillStyle = '#F4D27A';
        ctx.fillText(bookTitle, 0.4, -hh * 0.19 + 0.4);

        if (activeTheme === 'math') {
          // 4. Mathematical Notation Row 1: π   ∫   √
          ctx.font = 'italic bold 14px "Playfair Display", serif';
          ctx.fillStyle = '#F4D27A';
          ctx.fillText('π', -hw * 0.44, -hh * 0.04);
          ctx.font = '17px serif';
          ctx.fillText('∫', 0, -hh * 0.04);
          ctx.font = 'italic 14px serif';
          ctx.fillText('√', hw * 0.44, -hh * 0.04);

          // 5. Mathematical Notation Row 2: x²   f(x)
          ctx.font = 'italic 13px serif';
          ctx.fillStyle = '#F4D27A';
          ctx.fillText('x²', -hw * 0.32, hh * 0.09);
          ctx.fillText('f(x)', hw * 0.32, hh * 0.09);

          // 6. Sacred Geometry Icosahedron Watermark Emblem (Bottom in Reference Image)
          ctx.save();
          ctx.translate(0, hh * 0.26);
          ctx.strokeStyle = 'rgba(244, 210, 122, 0.75)';
          ctx.lineWidth = 0.8;
          const rGeo = 16;
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

          // Radial diagonal facets
          for (let a = 0; a < 6; a++) {
            const ang = (a * Math.PI) / 3;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(ang) * rGeo, Math.sin(ang) * rGeo);
            ctx.stroke();
          }
          ctx.restore();
        } else {
          ctx.font = 'bold 10px sans-serif';
          ctx.fillStyle = 'rgba(244, 210, 122, 0.65)';
          ctx.fillText('ACADEMIC PROGRAM', 0, 0);
        }

        ctx.restore();
      }

      ctx.restore();

      // -----------------------------------------------------------------------
      // 6. RENDER FRONT HALF OF GRAND INSCRIBED ORBITAL RING (IN FRONT OF BOOK)
      // -----------------------------------------------------------------------
      ctx.save();
      ctx.translate(centerX, centerY + floatY * 0.5);
      drawGrandInscribedRing(ctx, ringRadius, ringTiltX, ringRotY, 'front');
      drawNestedTiltedRing(ctx, 100, -0.38, -time * 0.07, 'front');
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    // -------------------------------------------------------------------------
    // HELPER: DRAW GRAND INSCRIBED ORBITAL RING WITH 3D DEPTH
    // -------------------------------------------------------------------------
    function drawGrandInscribedRing(c: CanvasRenderingContext2D, radius: number, tiltX: number, rotY: number, half: 'back' | 'front') {
      const startAng = half === 'back' ? Math.PI : 0;
      const endAng = half === 'back' ? Math.PI * 2 : Math.PI;

      // Outer Beveled Ellipse (Wide, Metallic Luxury Gold Ribbon)
      c.beginPath();
      c.ellipse(0, 0, radius, radius * 0.32, tiltX, startAng, endAng);
      c.lineWidth = 5.0;
      c.strokeStyle = '#D9A93A';
      c.stroke();

      // Inner Concentric Edge
      c.beginPath();
      c.ellipse(0, 0, radius - 8, (radius - 8) * 0.32, tiltX, startAng, endAng);
      c.lineWidth = 1.1;
      c.strokeStyle = 'rgba(255, 244, 212, 0.75)';
      c.stroke();

      // Engraved Roman numerals / math markings along the ring
      c.lineWidth = 1.2;
      c.strokeStyle = '#FFF6DC';
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 10) {
        if (half === 'back' && (a < Math.PI || a > Math.PI * 2)) continue;
        if (half === 'front' && (a < 0 || a > Math.PI)) continue;
        const cosA = Math.cos(a + rotY);
        const sinA = Math.sin(a + rotY);
        const rx1 = cosA * (radius - 7);
        const ry1 = sinA * (radius - 7) * 0.32;
        const rx2 = cosA * (radius + 2);
        const ry2 = sinA * (radius + 2) * 0.32;
        c.beginPath();
        c.moveTo(rx1, ry1);
        c.lineTo(rx2, ry2);
        c.stroke();
      }
    }

    function drawNestedTiltedRing(c: CanvasRenderingContext2D, radius: number, tiltX: number, rotY: number, half: 'back' | 'front') {
      const startAng = half === 'back' ? Math.PI : 0;
      const endAng = half === 'back' ? Math.PI * 2 : Math.PI;
      c.beginPath();
      c.ellipse(0, 0, radius, radius * 0.44, tiltX, startAng, endAng);
      c.lineWidth = 1.3;
      c.strokeStyle = 'rgba(217, 169, 58, 0.75)';
      c.stroke();
    }

    // -------------------------------------------------------------------------
    // HELPER: GLOSSY METALLIC GOLD SPHERE (ORB)
    // -------------------------------------------------------------------------
    function drawGlossyGoldSphere(c: CanvasRenderingContext2D, sx: number, sy: number, r: number) {
      c.save();
      // Drop shadow on floor/stage
      c.beginPath();
      c.ellipse(sx, sy + r * 0.85, r * 0.9, r * 0.3, 0, 0, Math.PI * 2);
      c.fillStyle = 'rgba(0, 0, 0, 0.55)';
      c.fill();

      // 3D Sphere gradient
      const sGrad = c.createRadialGradient(sx - r * 0.35, sy - r * 0.35, r * 0.08, sx, sy, r);
      sGrad.addColorStop(0, '#FFFFFF'); // Specular highlight
      sGrad.addColorStop(0.2, '#FFF4D4');
      sGrad.addColorStop(0.5, '#F4D27A');
      sGrad.addColorStop(0.8, '#9E6F1D');
      sGrad.addColorStop(1, '#341406');
      c.fillStyle = sGrad;
      c.beginPath();
      c.arc(sx, sy, r, 0, Math.PI * 2);
      c.fill();

      // Golden rim glow
      c.strokeStyle = 'rgba(255, 246, 220, 0.4)';
      c.lineWidth = 0.8;
      c.stroke();
      c.restore();
    }

    // -------------------------------------------------------------------------
    // HELPER: CURLED PARCHMENT MANUSCRIPT PAGE
    // -------------------------------------------------------------------------
    function drawCurledParchment(c: CanvasRenderingContext2D, px: number, py: number, w: number, h: number, rot: number) {
      c.save();
      c.translate(px, py);
      c.rotate(rot);

      // Cast shadow
      c.beginPath();
      c.roundRect(-w / 2 + 2, -h / 2 + 3, w, h, 3);
      c.fillStyle = 'rgba(0, 0, 0, 0.38)';
      c.fill();

      // Page surface
      const pGrad = c.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
      pGrad.addColorStop(0, 'rgba(252, 248, 238, 0.95)');
      pGrad.addColorStop(0.6, 'rgba(235, 224, 204, 0.92)');
      pGrad.addColorStop(1, 'rgba(210, 196, 172, 0.90)');
      c.fillStyle = pGrad;
      c.beginPath();
      c.roundRect(-w / 2, -h / 2, w, h, 2.5);
      c.fill();
      c.strokeStyle = 'rgba(217, 169, 58, 0.5)';
      c.lineWidth = 0.8;
      c.stroke();

      // Curled corner
      c.beginPath();
      c.moveTo(w / 2 - 7, -h / 2);
      c.lineTo(w / 2, -h / 2 + 7);
      c.lineTo(w / 2 - 7, -h / 2 + 7);
      c.closePath();
      c.fillStyle = 'rgba(180, 165, 140, 0.85)';
      c.fill();

      // Faint handwritten equation lines
      c.strokeStyle = 'rgba(100, 75, 45, 0.4)';
      c.lineWidth = 0.6;
      for (let l = 0; l < 3; l++) {
        const ly = -h / 2 + 7 + l * 6;
        c.beginPath();
        c.moveTo(-w / 2 + 5, ly);
        c.lineTo(w / 2 - (l === 0 ? 10 : 5), ly);
        c.stroke();
      }
      c.restore();
    }

    // -------------------------------------------------------------------------
    // HELPER: 3D COORDINATE SYSTEM & SINE WAVE WITH NODES (LEFT IN REFERENCE)
    // -------------------------------------------------------------------------
    function drawCoordinateSineWave(c: CanvasRenderingContext2D, sx: number, sy: number, t: number) {
      c.save();
      c.translate(sx, sy);

      // Coordinate axes
      c.strokeStyle = 'rgba(244, 210, 122, 0.65)';
      c.lineWidth = 1.0;
      c.beginPath(); c.moveTo(0, 38); c.lineTo(0, -38); c.stroke();
      c.beginPath(); c.moveTo(-2.5, -34); c.lineTo(0, -38); c.lineTo(2.5, -34); c.stroke();
      c.beginPath(); c.moveTo(-48, 0); c.lineTo(48, 0); c.stroke();
      c.beginPath(); c.moveTo(44, -2.5); c.lineTo(48, 0); c.lineTo(44, 2.5); c.stroke();

      c.font = 'italic 8px serif';
      c.fillStyle = '#F4D27A';
      c.fillText('y', 4, -33);
      c.fillText('x', 45, 10);

      // Sine Wave Curve
      c.beginPath();
      for (let x = -44; x <= 44; x += 2) {
        const y = Math.sin(x * 0.12 + t * 0.8) * 17;
        if (x === -44) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.lineWidth = 1.6;
      c.strokeStyle = '#F4D27A';
      c.stroke();

      // Node points along the wave
      [-32, -11, 11, 32].forEach((nx) => {
        const ny = Math.sin(nx * 0.12 + t * 0.8) * 17;
        c.beginPath();
        c.arc(nx, ny, 2.0, 0, Math.PI * 2);
        c.fillStyle = '#FFF6DC';
        c.fill();
      });

      c.restore();
    }

    // -------------------------------------------------------------------------
    // HELPER: 3D WIREFRAME ICOSAHEDRON (LEFT IN REFERENCE)
    // -------------------------------------------------------------------------
    function drawWireframeIcosahedron(c: CanvasRenderingContext2D, sx: number, sy: number, size: number, rot: number) {
      c.save();
      c.translate(sx, sy);
      c.rotate(rot);

      c.strokeStyle = 'rgba(244, 210, 122, 0.75)';
      c.lineWidth = 1.1;

      c.beginPath();
      for (let a = 0; a < 6; a++) {
        const ang = (a * Math.PI) / 3;
        const x = Math.cos(ang) * size;
        const y = Math.sin(ang) * size;
        if (a === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.closePath();
      c.stroke();

      c.beginPath();
      for (let a = 0; a < 3; a++) {
        const ang = (a * Math.PI * 2) / 3;
        const x = Math.cos(ang) * size;
        const y = Math.sin(ang) * size;
        if (a === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.closePath();
      c.stroke();

      for (let a = 0; a < 6; a++) {
        const ang = (a * Math.PI) / 3;
        c.beginPath();
        c.moveTo(0, 0);
        c.lineTo(Math.cos(ang) * size, Math.sin(ang) * size);
        c.stroke();
      }

      c.restore();
    }

    // -------------------------------------------------------------------------
    // HELPER: 3D DOUBLE HELIX (RIGHT IN REFERENCE)
    // -------------------------------------------------------------------------
    function drawDoubleHelix(c: CanvasRenderingContext2D, sx: number, sy: number, size: number, t: number) {
      c.save();
      c.translate(sx, sy);
      const steps = 12;
      for (let i = 0; i <= steps; i++) {
        const ang = (i / steps) * Math.PI * 2.5 + t * 0.8;
        const y = (i / steps - 0.5) * size * 1.8;
        const x1 = Math.cos(ang) * size * 0.5;
        const x2 = Math.cos(ang + Math.PI) * size * 0.5;

        c.beginPath();
        c.moveTo(x1, y);
        c.lineTo(x2, y);
        c.strokeStyle = 'rgba(217, 169, 58, 0.45)';
        c.lineWidth = 0.8;
        c.stroke();

        c.fillStyle = '#F4D27A';
        c.beginPath(); c.arc(x1, y, 1.8, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.arc(x2, y, 1.8, 0, Math.PI * 2); c.fill();
      }
      c.restore();
    }

    // -------------------------------------------------------------------------
    // HELPER: 3D PARAMETRIC SADDLE MESH (RIGHT IN REFERENCE)
    // -------------------------------------------------------------------------
    function drawSaddleMesh(c: CanvasRenderingContext2D, sx: number, sy: number, size: number, rot: number) {
      c.save();
      c.translate(sx, sy);
      c.rotate(rot);
      const span = size * 0.6;
      const steps = 4;
      c.strokeStyle = 'rgba(244, 210, 122, 0.65)';
      c.lineWidth = 0.9;

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
      c.restore();
    }

    // -------------------------------------------------------------------------
    // HELPER: 3D WIREFRAME PYRAMID (BOTTOM RIGHT IN REFERENCE)
    // -------------------------------------------------------------------------
    function drawWireframePyramid(c: CanvasRenderingContext2D, sx: number, sy: number, size: number, rot: number) {
      c.save();
      c.translate(sx, sy);
      c.rotate(rot);
      c.strokeStyle = 'rgba(244, 210, 122, 0.7)';
      c.lineWidth = 1.1;

      const b1 = { x: -size * 0.6, y: size * 0.5 };
      const b2 = { x: size * 0.6, y: size * 0.5 };
      const b3 = { x: 0, y: size * 0.2 };
      const apex = { x: 0, y: -size * 0.7 };

      c.beginPath();
      c.moveTo(b1.x, b1.y);
      c.lineTo(b2.x, b2.y);
      c.lineTo(b3.x, b3.y);
      c.closePath();
      c.stroke();

      c.beginPath();
      c.moveTo(apex.x, apex.y); c.lineTo(b1.x, b1.y);
      c.moveTo(apex.x, apex.y); c.lineTo(b2.x, b2.y);
      c.moveTo(apex.x, apex.y); c.lineTo(b3.x, b3.y);
      c.stroke();

      c.restore();
    }

    // -------------------------------------------------------------------------
    // HELPER: GLOWING MATHEMATICAL FORMULA / GLYPH
    // -------------------------------------------------------------------------
    function drawGlowingFormula(c: CanvasRenderingContext2D, sx: number, sy: number, text: string, fontSize: number, color: string) {
      c.save();
      c.font = `bold ${fontSize}px "Playfair Display", serif`;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillStyle = 'rgba(10, 2, 4, 0.85)';
      c.fillText(text, sx + 2, sy + 2);
      c.fillStyle = color;
      c.fillText(text, sx, sy);
      c.restore();
    }

    return () => {
      window.removeEventListener('resize', updateSize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <section
      id="courses"
      className="relative min-h-screen lg:h-screen w-full flex flex-col justify-center overflow-hidden bg-[#080607] py-8 lg:py-0 px-4 sm:px-6 lg:px-8 select-none"
    >
      {/* -----------------------------------------------------------------------
          BACKGROUND ATMOSPHERE (SEAMLESS LUXURY STUDIO)
          ----------------------------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none opacity-35">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#16060B]/40 via-transparent to-transparent" />
        <div className="absolute -top-32 right-12 w-[600px] h-[600px] rounded-full bg-radial from-[#D9A93A]/10 via-[#4A0E1A]/15 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-radial from-[#380B15]/20 to-transparent blur-3xl" />
      </div>

      {/* -----------------------------------------------------------------------
          MAIN VIEWPORT GRID: LEFT UI (42-45%) + RIGHT 3D SCENE (55-58%)
          ----------------------------------------------------------------------- */}
      <div className="max-w-[1380px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
        {/* =====================================================================
            LEFT COLUMN: Active Course Information Matching Reference Hierarchy
            ===================================================================== */}
        <div
          className={`lg:col-span-5 xl:col-span-5 space-y-4 sm:space-y-4.5 transition-all duration-300 ${
            isTransitioning ? 'opacity-40 translate-y-1' : 'opacity-100 translate-y-0'
          }`}
        >
          {/* 1. Category & Audience Badges */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-4 py-1.5 rounded-full border border-[#D9A93A] bg-[#14060A]/90 text-xs font-bold text-[#F4D27A] tracking-wider uppercase shadow-[0_0_12px_rgba(217,169,58,0.25)]">
              {activeCourse.category || 'MATEMATIKA'}
            </span>
            <span className="px-4 py-1.5 rounded-full border border-white/10 bg-[#16090D]/80 text-xs font-medium text-[#D5CECA]">
              {activeCourse.level || 'Barcha sinflar & Abituriyentlar'}
            </span>
          </div>

          {/* 2. Course Main Title & Instructor (White Serif matching reference image) */}
          <div className="space-y-1">
            <h2 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-luxury-serif font-black text-[#FFFFFF] leading-[1.05] tracking-tight drop-shadow-md">
              {cleanTitle}
            </h2>
            {instructorDisplay && (
              <p className="text-2xl sm:text-3xl lg:text-[2.4rem] font-luxury-serif font-semibold text-[#FFFFFF]/95 leading-snug">
                {instructorDisplay}
              </p>
            )}
          </div>

          {/* 3. Description */}
          <p className="text-xs sm:text-sm text-[#C8C0B8] leading-relaxed max-w-md font-normal">
            {activeCourse.description ||
              'Matematika, mantiqiy fikrlash, DTM testlari va olimpiadalarga mukammal tayyorgarlik kursi.'}
          </p>

          {/* 4. Single Unified Specification Capsule Bar (Pill Shape with Dividers) */}
          <div className="rounded-full bg-[#100508]/85 backdrop-blur-md border border-[#D9A93A]/30 px-3 py-2 sm:px-4 sm:py-2.5 grid grid-cols-3 divide-x divide-[#D9A93A]/20 shadow-[0_8px_32px_rgba(0,0,0,0.65)]">
            {/* Davomiyligi */}
            <div className="flex items-center gap-2 px-1 sm:px-2">
              <div className="h-7 w-7 rounded-lg bg-[#D9A93A]/10 border border-[#D9A93A]/30 flex items-center justify-center text-[#D9A93A] shrink-0">
                <Calendar className="h-3.5 w-3.5" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-[#A9A3A0] tracking-wider block">Davomiyligi</span>
                <span className="text-xs font-bold text-white block leading-tight">
                  {activeCourse.durationMonths} oy ({activeCourse.lessonsCount} dars)
                </span>
              </div>
            </div>

            {/* Dars Grafigi */}
            <div className="flex items-center gap-2 px-2 sm:px-3">
              <div className="h-7 w-7 rounded-lg bg-[#D9A93A]/10 border border-[#D9A93A]/30 flex items-center justify-center text-[#D9A93A] shrink-0">
                <Clock className="h-3.5 w-3.5" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-[#A9A3A0] tracking-wider block">Dars grafigi</span>
                <span className="text-xs font-bold text-white block leading-tight line-clamp-1">
                  {(activeCourse.schedule || '').split('(')[0] || 'Dush - Chor - Juma'}
                </span>
              </div>
            </div>

            {/* Ustoz */}
            <div className="flex items-center gap-2 px-2 sm:px-3">
              <div className="h-7 w-7 rounded-full bg-[#D9A93A]/10 border border-[#D9A93A]/30 flex items-center justify-center text-[#D9A93A] shrink-0">
                <GraduationCap className="h-3.5 w-3.5" />
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-[#A9A3A0] tracking-wider block">Ustoz</span>
                <span className="text-xs font-bold text-white block leading-tight line-clamp-1">
                  {activeCourse.instructor || 'Hadicha ustoz'}
                </span>
              </div>
            </div>
          </div>

          {/* 5. Syllabus Topics (2 Columns with Circular Gold Checkmarks) */}
          <div className="space-y-2 pt-0.5">
            <span className="text-xs font-bold text-[#D9A93A] tracking-wider uppercase block">
              O‘QUV DASTURIDAN ASOSIY MAVZULAR:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs text-[#EAE4DC]">
              {(activeCourse.syllabus || []).slice(0, 4).map((topic, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#D9A93A] shrink-0 mt-0.5" />
                  <span className="line-clamp-1 leading-snug">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Price & Action CTAs Row (Matching Reference Button Style) */}
          <div className="pt-2 flex items-center justify-between gap-4">
            {/* Price block */}
            <div className="shrink-0">
              <span className="text-[9px] uppercase font-bold text-[#A9A3A0] tracking-wider block">Oylik to‘lov</span>
              <span className="text-3xl sm:text-4xl lg:text-[2.9rem] font-luxury-serif font-black text-[#F4D27A] leading-none block">
                {formatMoney(activeCourse.pricePerMonth).replace(" so'm", "").replace(" so‘m", "")}
              </span>
              <span className="text-xl sm:text-2xl font-luxury-serif font-black text-[#F4D27A] leading-tight block">
                so‘m
              </span>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Secondary CTA: Batafsil dastur */}
              <button
                type="button"
                onClick={() => onOpenDetails(activeCourse)}
                className="px-5 py-2.5 rounded-full border border-[#D9A93A]/45 bg-[#120508]/90 hover:bg-[#D9A93A]/15 hover:border-[#F4D27A] text-white transition-all duration-300 flex items-center gap-2.5 cursor-pointer shadow-[inset_0_1px_2px_rgba(255,255,255,0.08)]"
              >
                <BookOpen className="h-4 w-4 text-[#D9A93A]" />
                <div className="text-left leading-tight text-xs font-bold text-white">
                  <div>Batafsil</div>
                  <div>dastur</div>
                </div>
              </button>

              {/* Primary CTA: Guruhga yozilish */}
              <button
                type="button"
                onClick={() => onOpenRegister(activeCourse.title)}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#F4C664] via-[#E5B54A] to-[#D99C35] hover:brightness-110 shadow-[0_4px_22px_rgba(244,198,100,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center gap-2 cursor-pointer border border-[#FFF2C6]/40"
              >
                <div className="text-left leading-tight text-xs font-black text-[#0A0604]">
                  <div>Guruhga</div>
                  <div className="flex items-center gap-1">
                    <span>yozilish</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* 7. Diagnostic Test Link (Gold Text Matching Reference) */}
          {onOpenDiagnostic && (
            <div className="pt-1">
              <button
                type="button"
                onClick={onOpenDiagnostic}
                className="text-xs font-semibold text-[#F4D27A] hover:text-[#FFF2C6] flex items-center gap-1.5 cursor-pointer transition-colors group"
              >
                <div className="h-4 w-4 rounded-full border border-[#F4D27A] flex items-center justify-center text-[10px] text-[#F4D27A] group-hover:border-[#FFF2C6]">
                  i
                </div>
                <span>Qaysi kurs sizga mos kelishini aniqlash uchun bepul diagnostik test topshiring</span>
                <ArrowRight className="h-3 w-3 text-[#F4D27A] transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          )}
        </div>

        {/* =====================================================================
            RIGHT COLUMN: 3D Miniature Mathematical Universe (55-58%)
            ===================================================================== */}
        <div className="lg:col-span-7 xl:col-span-7 relative w-full h-[460px] sm:h-[520px] lg:h-[580px] flex items-center justify-center select-none">
          {/* 3D Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full block select-none relative z-10"
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
            title="LUMOS 3D Kurs Olami"
          />

          {/* Bottom-Right Carousel Navigation Controls (Matching Reference Image) */}
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 flex items-center gap-2.5 bg-[#120609]/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#D9A93A]/30 shadow-xl">
            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 rounded-full border border-[#D9A93A]/40 text-[#D9A93A] hover:bg-[#D9A93A]/20 hover:text-[#FFF6DC] transition-colors cursor-pointer"
              title="Oldingi kurs"
              aria-label="Oldingi kurs"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            {/* Course Dots / Pill Indicator */}
            <div className="flex items-center gap-1.5">
              {INITIAL_COURSES.map((course, idx) => {
                const isActive = course.id === activeCourse.id;
                return (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => handleSelectCourse(course)}
                    className={`transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'w-5 h-1.5 rounded-full bg-gradient-to-r from-[#D9A93A] to-[#F4D27A] shadow-[0_0_8px_#D9A93A]'
                        : 'w-1.5 h-1.5 rounded-full bg-[#D9A93A]/40 hover:bg-[#D9A93A]/80'
                    }`}
                    title={course.title}
                    aria-label={course.title}
                  />
                );
              })}
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 rounded-full border border-[#D9A93A]/40 text-[#D9A93A] hover:bg-[#D9A93A]/20 hover:text-[#FFF6DC] transition-colors cursor-pointer"
              title="Keyingi kurs"
              aria-label="Keyingi kurs"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
