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
  // 3D CANVAS: LIVING MATHEMATICAL SPATIAL WORLD ENGINE
  // ---------------------------------------------------------------------------
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Book Showroom Turntable Angle & Autonomous Spin
  const bookPhysicsRef = useRef({
    rotY: -0.44, // Exact showroom angle from reference image (~ -25 deg)
    angVy: 0.0016, // Slow autonomous rotation
    targetHoverScale: 1.0,
    hoverScale: 1.0,
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

      // -----------------------------------------------------------------------
      // 1. VOLUMETRIC WARM KEY LIGHT & SPATIAL ATMOSPHERE
      // -----------------------------------------------------------------------
      const lightAngle = time * 0.28;
      const lightX = Math.cos(lightAngle) * 260;
      const lightY = Math.sin(lightAngle * 0.7) * 90 - 50;

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
      const ringRadius = 154;
      const ringTiltX = 0.48; // ~28 deg tilt matching reference
      const ringRotY = time * 0.05;

      ctx.save();
      ctx.translate(centerX, centerY + floatY * 0.5);
      drawGrandInscribedRing(ctx, ringRadius, ringTiltX, ringRotY, 'back');
      drawNestedTiltedRing(ctx, 102, -0.38, -time * 0.07, 'back');
      ctx.restore();

      // -----------------------------------------------------------------------
      // 3. BACKGROUND SPATIAL MATHEMATICAL UNIVERSE (INDEPENDENT CURVED TRAJECTORIES)
      // -----------------------------------------------------------------------
      ctx.save();
      ctx.translate(centerX, centerY + floatY);

      // A. Analytical XYZ Coordinate System & Intersecting Vector (Top-Left)
      // Spatial drift: slow harmonic trajectory through space
      const coordDriftX = Math.sin(time * 0.45) * 12;
      const coordDriftY = Math.cos(time * 0.38) * 8;
      drawXYZCoordinateSculpture(ctx, -160 + coordDriftX, -90 + coordDriftY, 34, time);

      // B. Volumetric Parabola Ribbon (Travelling diagonally across mid-left)
      const parabolaDriftX = Math.cos(time * 0.35) * 10;
      const parabolaDriftY = Math.sin(time * 0.42) * 7;
      drawVolumetricParabola(ctx, -145 + parabolaDriftX, -30 + parabolaDriftY, 28, time * 0.25);

      // C. Luminous Sine Wave with Coordinate Grid & Node Points (Left)
      const sineDriftX = Math.sin(time * 0.40) * 8;
      const sineDriftY = Math.cos(time * 0.32) * 10;
      drawCoordinateSineWave(ctx, -170 + sineDriftX, 35 + sineDriftY, time);

      // D. Precision 3D Wireframe Icosahedron (Left depth)
      drawWireframeIcosahedron(ctx, -140, 75, 22, time * 0.35);

      // E. Small Golden Spatial Sphere (Left)
      drawGlossyGoldSphere(ctx, -90 + Math.sin(time * 0.5) * 6, -70 + Math.cos(time * 0.4) * 6, 7.0);

      // F. Parametric Double Helix / DNA of Mathematics (Right)
      const helixDriftX = Math.cos(time * 0.38) * 10;
      const helixDriftY = Math.sin(time * 0.48) * 12;
      drawDoubleHelix(ctx, 160 + helixDriftX, -115 + helixDriftY, 25, time);

      // G. Parametric 3D Saddle Surface Mesh (Hyperbolic Paraboloid z = x² - y²) (Right)
      const saddleDriftX = Math.sin(time * 0.32) * 12;
      const saddleDriftY = Math.cos(time * 0.44) * 9;
      drawSaddleMesh(ctx, 225 + saddleDriftX, -40 + saddleDriftY, 30, time * 0.35);

      // H. 3D Wireframe Pyramid with Altitude Line (Bottom Right)
      const pyrDriftX = Math.cos(time * 0.42) * 8;
      const pyrDriftY = Math.sin(time * 0.36) * 10;
      drawWireframePyramid(ctx, 240 + pyrDriftX, 150 + pyrDriftY, 28, time * 0.3);

      // I. Small Golden Spatial Sphere (Top Right)
      drawGlossyGoldSphere(ctx, 140 + Math.sin(time * 0.45) * 7, -95 + Math.cos(time * 0.52) * 7, 6.0);

      // J. Floating Mathematical Formulas Drifting through Space:
      // Pi (Top-Right): Slow spatial wander
      const piDriftX = Math.sin(time * 0.35) * 8;
      const piDriftY = Math.cos(time * 0.42) * 6;
      drawGlowingFormula(ctx, 110 + piDriftX, -168 + piDriftY, 'π', 34, '#F4D27A');

      // Integral (Bottom-Left)
      const intDriftX = Math.cos(time * 0.38) * 8;
      const intDriftY = Math.sin(time * 0.44) * 7;
      drawGlowingFormula(ctx, -130 + intDriftX, 110 + intDriftY, '∫', 36, '#F4D27A');

      // a² + b² = c² (Right Midground)
      const pythDriftX = Math.sin(time * 0.30) * 9;
      const pythDriftY = Math.cos(time * 0.36) * 8;
      drawGlowingFormula(ctx, 200 + pythDriftX, 48 + pythDriftY, 'a² + b² = c²', 15, '#EAE4DC');

      // Sigma (Right)
      const sigDriftX = Math.cos(time * 0.40) * 7;
      const sigDriftY = Math.sin(time * 0.32) * 8;
      drawGlowingFormula(ctx, 205 + sigDriftX, 110 + sigDriftY, '∑', 25, '#F4D27A');

      // f(x) Formula (Floating Midground)
      drawGlowingFormula(ctx, 115 + Math.sin(time * 0.36) * 6, -55 + Math.cos(time * 0.4) * 5, 'f(x)', 14, '#EAE4DC');

      ctx.restore();

      // -----------------------------------------------------------------------
      // 4. MULTI-TIERED CIRCULAR BRONZE-GOLD PEDESTAL (UNDER BOOK)
      // -----------------------------------------------------------------------
      ctx.save();
      ctx.translate(centerX, centerY + floatY);

      // Book Proportions: 1.0 : 1.35 : 0.18
      const bw = 200;
      const bh = Math.round(bw * 1.35); // 270px
      const bThick = 36;
      const hw = bw / 2;
      const hh = bh / 2;
      const ht = bThick / 2;

      const pedY = hh + 30;

      // Floor Contact Glow & Drop Shadow
      const floorGlow = ctx.createRadialGradient(0, pedY + 18, 8, 0, pedY + 18, 210);
      floorGlow.addColorStop(0, 'rgba(217, 169, 58, 0.42)');
      floorGlow.addColorStop(0.35, 'rgba(92, 20, 32, 0.48)');
      floorGlow.addColorStop(0.7, 'rgba(8, 2, 4, 0.92)');
      floorGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = floorGlow;
      ctx.beginPath();
      ctx.ellipse(0, pedY + 18, 200, 42, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pedestal Tier 3 (Base Plinth): Radius 170, Height 12
      ctx.fillStyle = '#160806';
      ctx.beginPath();
      ctx.ellipse(0, pedY + 15, 170, 31, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#6E3214';
      ctx.lineWidth = 1.3;
      ctx.stroke();

      // Pedestal Tier 2 (Middle Beveled Ring): Radius 140, Height 9
      const t2Grad = ctx.createLinearGradient(-140, 0, 140, 0);
      t2Grad.addColorStop(0, '#2A1009');
      t2Grad.addColorStop(0.25, '#683315');
      t2Grad.addColorStop(0.5, '#C99238');
      t2Grad.addColorStop(0.75, '#683315');
      t2Grad.addColorStop(1, '#2A1009');
      ctx.fillStyle = t2Grad;
      ctx.beginPath();
      ctx.ellipse(0, pedY + 8, 140, 26, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#D9A93A';
      ctx.lineWidth = 1.3;
      ctx.stroke();

      // Pedestal Tier 1 (Top Stage Platform Disc): Radius 114
      const t1Grad = ctx.createRadialGradient(0, pedY, 4, 0, pedY, 114);
      t1Grad.addColorStop(0, '#FFF6DC');
      t1Grad.addColorStop(0.28, '#D9A93A');
      t1Grad.addColorStop(0.68, '#5E2B12');
      t1Grad.addColorStop(1, '#1A0B08');
      ctx.fillStyle = t1Grad;
      ctx.beginPath();
      ctx.ellipse(0, pedY, 114, 21, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFEAA7';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner Concentric Gold Ring Groove
      ctx.beginPath();
      ctx.ellipse(0, pedY, 96, 18, 0, 0, Math.PI * 2);
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

      // Floating Mathematical Study Manuscripts (Parchments with Coordinate Diagrams & Proofs)
      drawMathematicalManuscript(ctx, -52, pedY - 12, 44, 30, -0.20, 'calculus');
      drawMathematicalManuscript(ctx, 76, pedY - 8, 38, 26, 0.30, 'geometry');

      // Foreground Glossy Metallic Gold Sphere (The Orb on Pedestal Rim)
      drawGlossyGoldSphere(ctx, -82, pedY + 8, 25);

      ctx.restore();

      // -----------------------------------------------------------------------
      // 5. RENDER REDESIGNED HERO MATHEMATICS TEXTBOOK
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

      // 5. Front Cover Plate (Custom Embossed Mathematics Artwork)
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

        // Specular highlight sheen
        const specGrad = ctx.createRadialGradient(
          cf0.x * 0.4 + projCoverFront[2].x * 0.6,
          cf0.y * 0.4 + projCoverFront[2].y * 0.6,
          6,
          cf0.x * 0.4 + projCoverFront[2].x * 0.6,
          cf0.y * 0.4 + projCoverFront[2].y * 0.6,
          hw * 1.35
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

        // Front Cover Typography & Embossed Graphic
        const faceMidX = (cf0.x + cf1.x + projCoverFront[2].x + cf3.x) / 4;
        const faceMidY = (cf0.y + cf1.y + projCoverFront[2].y + cf3.y) / 4;

        ctx.save();
        ctx.translate(faceMidX, faceMidY);
        const skewAngle = Math.atan2(cf1.y - cf0.y, cf1.x - cf0.x);
        ctx.rotate(skewAngle);

        ctx.textAlign = 'center';

        // 1. Embossed Gold Royal Crown Emblem
        ctx.strokeStyle = '#F4D27A';
        ctx.fillStyle = '#F4D27A';
        ctx.lineWidth = 1.0;
        const crW = 13;
        const crY = -hh * 0.45;
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
        ctx.fillText('LUMOS', 0, -hh * 0.34);

        // 3. Main Golden Book Title (MATHEMATICS)
        ctx.font = '900 17px "Playfair Display", serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(bookTitle, 0, -hh * 0.20);
        ctx.fillStyle = '#F4D27A';
        ctx.fillText(bookTitle, 0.4, -hh * 0.20 + 0.4);

        if (activeTheme === 'math') {
          // 4. EMBOSSED GOLD COVER GRAPHIC: Parabola intersecting Coordinate Frame surrounded by Orbit
          const grY = -hh * 0.02;
          ctx.save();
          ctx.translate(0, grY);

          // Orbit circle around graphic
          ctx.beginPath();
          ctx.ellipse(0, 0, 36, 16, -0.22, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(244, 210, 122, 0.5)';
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Coordinate frame axes
          ctx.beginPath();
          ctx.moveTo(0, 18); ctx.lineTo(0, -18);
          ctx.moveTo(-28, 0); ctx.lineTo(28, 0);
          ctx.strokeStyle = 'rgba(244, 210, 122, 0.7)';
          ctx.lineWidth = 0.9;
          ctx.stroke();

          // Raised Gold Parabola
          ctx.beginPath();
          for (let px = -22; px <= 22; px += 2) {
            const py = 0.035 * px * px - 12;
            if (px === -22) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = '#FFF4D4';
          ctx.lineWidth = 1.3;
          ctx.stroke();

          // Focus node point
          ctx.beginPath();
          ctx.arc(0, -4, 1.6, 0, Math.PI * 2);
          ctx.fillStyle = '#FFF6DC';
          ctx.fill();

          ctx.restore();

          // 5. Mathematical Notation Row (Refined Editorial Spacing)
          ctx.font = 'italic bold 13px "Playfair Display", serif';
          ctx.fillStyle = '#F4D27A';
          ctx.fillText('π', -hw * 0.42, hh * 0.12);
          ctx.font = '16px serif';
          ctx.fillText('∫', 0, hh * 0.12);
          ctx.font = 'italic 13px serif';
          ctx.fillText('√', hw * 0.42, hh * 0.12);

          // 6. Sacred Geometry Icosahedron Watermark Emblem (Bottom in Reference Image)
          ctx.save();
          ctx.translate(0, hh * 0.28);
          ctx.strokeStyle = 'rgba(244, 210, 122, 0.75)';
          ctx.lineWidth = 0.8;
          const rGeo = 15;
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
      // 6. RENDER FRONT HALF OF GRAND INSCRIBED ORBITAL RING (IN FRONT OF BOOK)
      // -----------------------------------------------------------------------
      ctx.save();
      ctx.translate(centerX, centerY + floatY * 0.5);
      drawGrandInscribedRing(ctx, ringRadius, ringTiltX, ringRotY, 'front');
      drawNestedTiltedRing(ctx, 102, -0.38, -time * 0.07, 'front');
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    // -------------------------------------------------------------------------
    // HELPER: GRAND INSCRIBED ORBITAL RING WITH 3D DEPTH
    // -------------------------------------------------------------------------
    function drawGrandInscribedRing(c: CanvasRenderingContext2D, radius: number, tiltX: number, rotY: number, half: 'back' | 'front') {
      const startAng = half === 'back' ? Math.PI : 0;
      const endAng = half === 'back' ? Math.PI * 2 : Math.PI;

      c.beginPath();
      c.ellipse(0, 0, radius, radius * 0.32, tiltX, startAng, endAng);
      c.lineWidth = 5.0;
      c.strokeStyle = '#D9A93A';
      c.stroke();

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
      c.beginPath();
      c.ellipse(sx, sy + r * 0.85, r * 0.9, r * 0.3, 0, 0, Math.PI * 2);
      c.fillStyle = 'rgba(0, 0, 0, 0.55)';
      c.fill();

      const sGrad = c.createRadialGradient(sx - r * 0.35, sy - r * 0.35, r * 0.08, sx, sy, r);
      sGrad.addColorStop(0, '#FFFFFF');
      sGrad.addColorStop(0.2, '#FFF4D4');
      sGrad.addColorStop(0.5, '#F4D27A');
      sGrad.addColorStop(0.8, '#9E6F1D');
      sGrad.addColorStop(1, '#341406');
      c.fillStyle = sGrad;
      c.beginPath();
      c.arc(sx, sy, r, 0, Math.PI * 2);
      c.fill();

      c.strokeStyle = 'rgba(255, 246, 220, 0.4)';
      c.lineWidth = 0.8;
      c.stroke();
      c.restore();
    }

    // -------------------------------------------------------------------------
    // HELPER: ARCHITECTURAL XYZ COORDINATE SYSTEM WITH INTERSECTING VECTOR
    // -------------------------------------------------------------------------
    function drawXYZCoordinateSculpture(c: CanvasRenderingContext2D, sx: number, sy: number, s: number, t: number) {
      c.save();
      c.translate(sx, sy);
      c.lineWidth = 1.4;

      // X-Axis (Gold)
      c.strokeStyle = '#F4D27A';
      c.beginPath(); c.moveTo(0, 0); c.lineTo(s, 0); c.stroke();
      // Arrowhead X
      c.beginPath(); c.moveTo(s - 3, -2.5); c.lineTo(s, 0); c.lineTo(s - 3, 2.5); c.stroke();

      // Y-Axis (Champagne)
      c.strokeStyle = '#FFF2C6';
      c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -s); c.stroke();
      // Arrowhead Y
      c.beginPath(); c.moveTo(-2.5, -s + 3); c.lineTo(0, -s); c.lineTo(2.5, -s + 3); c.stroke();

      // Z-Axis (Bronze/Gold)
      c.strokeStyle = '#D9A93A';
      c.beginPath(); c.moveTo(0, 0); c.lineTo(-s * 0.6, s * 0.6); c.stroke();

      // Origin junction cube
      c.fillStyle = '#FFF6DC';
      c.fillRect(-2, -2, 4, 4);

      // Coordinate tick marks
      for (let tk = 10; tk < s; tk += 10) {
        c.beginPath(); c.moveTo(tk, -2); c.lineTo(tk, 2); c.stroke();
        c.beginPath(); c.moveTo(-2, -tk); c.lineTo(2, -tk); c.stroke();
      }

      // Intersecting Vector Arrow v = (x, y, z)
      c.save();
      c.strokeStyle = '#FFDF78';
      c.lineWidth = 1.8;
      const vEndX = s * 0.7 + Math.sin(t * 1.5) * 4;
      const vEndY = -s * 0.6 + Math.cos(t * 1.5) * 4;
      c.beginPath(); c.moveTo(0, 0); c.lineTo(vEndX, vEndY); c.stroke();
      // Vector head
      c.fillStyle = '#FFF2C6';
      c.beginPath();
      c.arc(vEndX, vEndY, 2.2, 0, Math.PI * 2);
      c.fill();
      c.restore();

      // Labels
      c.font = 'italic bold 9px serif';
      c.fillStyle = '#F4D27A';
      c.fillText('x', s + 4, 3);
      c.fillText('y', 3, -s - 3);
      c.fillText('z', -s * 0.6 - 7, s * 0.6 + 5);

      c.restore();
    }

    // -------------------------------------------------------------------------
    // HELPER: VOLUMETRIC PARABOLA RIBBON (y = ax²)
    // -------------------------------------------------------------------------
    function drawVolumetricParabola(c: CanvasRenderingContext2D, sx: number, sy: number, size: number, rot: number) {
      c.save();
      c.translate(sx, sy);
      c.rotate(rot);

      // Primary Curve
      c.beginPath();
      for (let px = -size; px <= size; px += 2) {
        const py = 0.045 * px * px - 18;
        if (px === -size) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.lineWidth = 2.0;
      c.strokeStyle = '#F4D27A';
      c.stroke();

      // Extruded 3D Depth Rail
      c.beginPath();
      for (let px = -size; px <= size; px += 2) {
        const py = 0.045 * px * px - 18 + 5;
        if (px === -size) c.moveTo(px + 3, py);
        else c.lineTo(px + 3, py);
      }
      c.lineWidth = 1.0;
      c.strokeStyle = 'rgba(217, 169, 58, 0.5)';
      c.stroke();

      // Cross-linking rungs
      c.lineWidth = 0.8;
      c.strokeStyle = 'rgba(255, 246, 220, 0.4)';
      for (let rx = -size; rx <= size; rx += size / 2) {
        const ry1 = 0.045 * rx * rx - 18;
        c.beginPath();
        c.moveTo(rx, ry1);
        c.lineTo(rx + 3, ry1 + 5);
        c.stroke();
      }

      c.restore();
    }

    // -------------------------------------------------------------------------
    // HELPER: SINE WAVE WITH COORDINATE TICKS & NODE POINTS
    // -------------------------------------------------------------------------
    function drawCoordinateSineWave(c: CanvasRenderingContext2D, sx: number, sy: number, t: number) {
      c.save();
      c.translate(sx, sy);

      // Grid line
      c.strokeStyle = 'rgba(244, 210, 122, 0.4)';
      c.lineWidth = 0.8;
      c.beginPath(); c.moveTo(-45, 0); c.lineTo(45, 0); c.stroke();
      c.beginPath(); c.moveTo(0, -26); c.lineTo(0, 26); c.stroke();

      // Wave curve
      c.beginPath();
      for (let x = -42; x <= 42; x += 2) {
        const y = Math.sin(x * 0.12 + t * 0.8) * 16;
        if (x === -42) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.lineWidth = 1.8;
      c.strokeStyle = '#F4D27A';
      c.stroke();

      // Golden Node points
      [-30, -10, 10, 30].forEach((nx) => {
        const ny = Math.sin(nx * 0.12 + t * 0.8) * 16;
        c.beginPath();
        c.arc(nx, ny, 2.2, 0, Math.PI * 2);
        c.fillStyle = '#FFF6DC';
        c.fill();
        c.strokeStyle = '#D9A93A';
        c.lineWidth = 0.8;
        c.stroke();
      });

      c.font = 'italic 8px serif';
      c.fillStyle = '#F4D27A';
      c.fillText('y=sin(x)', 15, -18);

      c.restore();
    }

    // -------------------------------------------------------------------------
    // HELPER: 3D PARAMETRIC SADDLE MESH (HYPERBOLIC PARABOLOID)
    // -------------------------------------------------------------------------
    function drawSaddleMesh(c: CanvasRenderingContext2D, sx: number, sy: number, size: number, rot: number) {
      c.save();
      c.translate(sx, sy);
      c.rotate(rot);
      const span = size * 0.65;
      const steps = 4;
      c.strokeStyle = 'rgba(244, 210, 122, 0.70)';
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
      c.restore();
    }

    // -------------------------------------------------------------------------
    // HELPER: 3D DOUBLE HELIX (MATHEMATICAL SPIRAL)
    // -------------------------------------------------------------------------
    function drawDoubleHelix(c: CanvasRenderingContext2D, sx: number, sy: number, size: number, t: number) {
      c.save();
      c.translate(sx, sy);
      const steps = 14;
      for (let i = 0; i <= steps; i++) {
        const ang = (i / steps) * Math.PI * 2.5 + t * 0.8;
        const y = (i / steps - 0.5) * size * 1.8;
        const x1 = Math.cos(ang) * size * 0.5;
        const x2 = Math.cos(ang + Math.PI) * size * 0.5;

        c.beginPath();
        c.moveTo(x1, y);
        c.lineTo(x2, y);
        c.strokeStyle = 'rgba(217, 169, 58, 0.5)';
        c.lineWidth = 0.9;
        c.stroke();

        c.fillStyle = '#F4D27A';
        c.beginPath(); c.arc(x1, y, 1.8, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.arc(x2, y, 1.8, 0, Math.PI * 2); c.fill();
      }
      c.restore();
    }

    // -------------------------------------------------------------------------
    // HELPER: 3D WIREFRAME ICOSAHEDRON
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
    // HELPER: 3D WIREFRAME PYRAMID
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

      // Altitude axis
      c.strokeStyle = 'rgba(255, 244, 212, 0.4)';
      c.beginPath(); c.moveTo(apex.x, apex.y); c.lineTo(0, size * 0.38); c.stroke();

      c.restore();
    }

    // -------------------------------------------------------------------------
    // HELPER: MATHEMATICAL STUDY MANUSCRIPT (REAL FORMULAS & GRAPHS)
    // -------------------------------------------------------------------------
    function drawMathematicalManuscript(c: CanvasRenderingContext2D, px: number, py: number, w: number, h: number, rot: number, type: 'calculus' | 'geometry') {
      c.save();
      c.translate(px, py);
      c.rotate(rot);

      // Drop shadow
      c.beginPath();
      c.roundRect(-w / 2 + 2, -h / 2 + 3, w, h, 3);
      c.fillStyle = 'rgba(0, 0, 0, 0.42)';
      c.fill();

      // Paper surface
      const pGrad = c.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
      pGrad.addColorStop(0, 'rgba(252, 248, 238, 0.96)');
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

      // Mathematical content drawn on the page
      if (type === 'calculus') {
        // Coordinate sketch with integral curve
        c.strokeStyle = 'rgba(85, 45, 20, 0.65)';
        c.lineWidth = 0.7;
        c.beginPath();
        c.moveTo(-w / 2 + 6, h / 2 - 6); c.lineTo(-w / 2 + 6, -h / 2 + 8);
        c.moveTo(-w / 2 + 6, h / 2 - 6); c.lineTo(w / 2 - 10, h / 2 - 6);
        c.stroke();

        // Integral curve on page
        c.strokeStyle = 'rgba(180, 80, 20, 0.7)';
        c.lineWidth = 0.9;
        c.beginPath();
        c.moveTo(-w / 2 + 8, h / 2 - 8);
        c.quadraticCurveTo(-w / 2 + 18, -h / 2 + 12, w / 2 - 12, -h / 2 + 10);
        c.stroke();

        // Formula line
        c.font = 'italic 7px serif';
        c.fillStyle = 'rgba(70, 35, 15, 0.75)';
        c.fillText('∫ f(x)dx', -w / 2 + 12, -h / 2 + 8);
      } else {
        // Geometric right triangle sketch
        c.strokeStyle = 'rgba(85, 45, 20, 0.65)';
        c.lineWidth = 0.8;
        c.beginPath();
        c.moveTo(-w / 2 + 8, h / 2 - 7);
        c.lineTo(w / 2 - 10, h / 2 - 7);
        c.lineTo(-w / 2 + 8, -h / 2 + 8);
        c.closePath();
        c.stroke();

        // Right angle marker
        c.strokeRect(-w / 2 + 8, h / 2 - 11, 4, 4);

        // a² + b² = c² text
        c.font = '6px serif';
        c.fillStyle = 'rgba(70, 35, 15, 0.75)';
        c.fillText('a²+b²=c²', -w / 2 + 8, h / 2 - 1);
      }

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
          BACKGROUND ATMOSPHERE (SEAMLESS LUXURY MATHEMATICS STUDIO)
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
            RIGHT COLUMN: 3D Living Mathematics Spatial Universe (55-58%)
            ===================================================================== */}
        <div className="lg:col-span-7 xl:col-span-7 relative w-full h-[460px] sm:h-[520px] lg:h-[580px] flex items-center justify-center select-none">
          {/* 3D Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-full block select-none relative z-10"
            style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
            title="LUMOS 3D Matematika Koinoti"
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
