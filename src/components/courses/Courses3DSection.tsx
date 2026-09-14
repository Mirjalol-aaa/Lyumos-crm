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

type CourseTheme = 'math' | 'english' | 'it' | 'academic';

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

  // Determine Course Theme
  const theme: CourseTheme = useMemo(() => {
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
  // MINIMALIST LUXURY 3D SHOWROOM CANVAS
  // 1 Anchored Hero 3D Book (horizontal 360° rotation with momentum)
  // + 1 Large 3D Orbital Ring (elliptical orbit with real depth occlusion)
  // + 2 Dim Background Accents
  // ---------------------------------------------------------------------------
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Book 360° Physics (Y-axis turntable rotation)
  const bookStateRef = useRef({
    rotY: 0.38, // Primary horizontal angle
    rotX: -0.16, // Subtle initial tilt
    angVy: 0, // Angular velocity on Y
    angVx: 0, // Micro physical tilt velocity
    isDragging: false,
    lastPointerX: 0,
    lastPointerY: 0,
    samples: [] as { x: number; y: number; time: number }[],
    isHovered: false,
  });

  // Ring Orbital & Self-Rotation Physics
  const ringStateRef = useRef({
    orbitPhase: 0.8, // Current angle along elliptical orbit
    orbitSpeed: 0.0009, // Autonomous orbital velocity
    orbitRx: 215, // Semi-major axis (width)
    orbitRz: 140, // Semi-minor axis (depth)
    selfRotX: 0.55, // Fixed inclination
    selfRotY: 0.2, // Spin angle
    selfRotZ: -0.15,
    spinVy: 0, // Momentum velocity when manually dragged
    isDragging: false,
    lastPointerX: 0,
    lastPointerY: 0,
    samples: [] as { x: number; y: number; time: number }[],
    isHovered: false,
    // Cached screen coordinates for raycasting
    screenX: 0,
    screenY: 0,
    depthZ: 0,
  });

  // Active Grabbed Target ('book' | 'ring' | null)
  const activeTargetRef = useRef<'book' | 'ring' | null>(null);

  const themeRef = useRef(theme);
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  // Main 3D Canvas Loop
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

    // Static rotation buffer (0 allocations)
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

      const book = bookStateRef.current;
      const ring = ringStateRef.current;

      // 1. DAMPED MOMENTUM FOR BOOK (Settles at final angle without resetting!)
      if (!book.isDragging) {
        book.rotY += book.angVy;
        book.rotX += book.angVx;

        // Friction damping
        book.angVy *= 0.965;
        book.angVx *= 0.965;

        if (Math.abs(book.angVy) < 0.0001) book.angVy = 0;
        if (Math.abs(book.angVx) < 0.0001) book.angVx = 0;

        // Subtle showroom floating breath (1-2px)
        book.rotX += ((-0.16) - book.rotX) * 0.02; // Settle micro-tilt back to calm horizontal
      }

      // 2. ORBIT & MOMENTUM FOR RING
      if (!ring.isDragging) {
        ring.orbitPhase += ring.orbitSpeed + ring.spinVy * 0.2;
        ring.selfRotY += ring.spinVy + 0.0006;
        ring.spinVy *= 0.965;
        if (Math.abs(ring.spinVy) < 0.0001) ring.spinVy = 0;
      }

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Subtle showroom breathing float (1.5px vertical drift)
      const floatY = Math.sin(time * 1.4) * 2.5;

      // Calculate Ring 3D Orbital Position around the Book
      const ringOrbX = Math.cos(ring.orbitPhase) * ring.orbitRx;
      const ringOrbZ = Math.sin(ring.orbitPhase) * ring.orbitRz;
      // Slight vertical wave as it circles
      const ringOrbY = Math.sin(ring.orbitPhase * 2) * 12;

      ring.depthZ = ringOrbZ;
      ring.screenX = centerX + ringOrbX;
      ring.screenY = centerY + ringOrbY + floatY * 0.4;

      // Studio Moving Specular Light coordinates
      const lightAngle = time * 0.5;
      const lightX = Math.sin(lightAngle) * 70;
      const lightY = Math.cos(lightAngle * 0.7) * 45;

      // -----------------------------------------------------------------------
      // A. RENDER SUBTLE DEEP BACKGROUND ACCENTS (Dim, Non-competing)
      // -----------------------------------------------------------------------
      ctx.save();
      ctx.translate(centerX, centerY);

      // 1. Subtle Background Parabola Coordinate Guide (Dim Burgundy/Gold)
      ctx.strokeStyle = 'rgba(217, 168, 63, 0.12)';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      for (let px = -65; px <= 65; px += 5) {
        const py = (0.025 * px * px - 35);
        rotatePoint(px * 1.6 + 180, py * 1.6 - 130, -180, -0.2, 0.4, 0);
        if (px === -65) ctx.moveTo(rotBuf.x, rotBuf.y);
        else ctx.lineTo(rotBuf.x, rotBuf.y);
      }
      ctx.stroke();

      // 2. Subtle Coordinate Axes (Dim, in deep left corner)
      ctx.strokeStyle = 'rgba(217, 168, 63, 0.10)';
      ctx.beginPath();
      rotatePoint(-220, 110, -160, -0.2, 0.3, 0);
      ctx.moveTo(rotBuf.x, rotBuf.y);
      rotatePoint(-170, 110, -160, -0.2, 0.3, 0);
      ctx.lineTo(rotBuf.x, rotBuf.y);
      rotatePoint(-220, 110, -160, -0.2, 0.3, 0);
      rotatePoint(-220, 70, -160, -0.2, 0.3, 0);
      ctx.lineTo(rotBuf.x, rotBuf.y);
      ctx.stroke();

      ctx.restore();

      // -----------------------------------------------------------------------
      // B. DEPTH SORTING: RING BEHIND BOOK (ring.depthZ < 0)
      // -----------------------------------------------------------------------
      if (ring.depthZ < 0) {
        renderOrbitalRing(ctx, ring, floatY, lightX, lightY);
      }

      // -----------------------------------------------------------------------
      // C. RENDER THE HERO: ANCHORED REALISTIC 3D BOOK
      // -----------------------------------------------------------------------
      renderHeroBook(ctx, centerX, centerY + floatY, book, themeRef.current, lightX, lightY, width);

      // -----------------------------------------------------------------------
      // D. DEPTH SORTING: RING IN FRONT OF BOOK (ring.depthZ >= 0)
      // -----------------------------------------------------------------------
      if (ring.depthZ >= 0) {
        renderOrbitalRing(ctx, ring, floatY, lightX, lightY);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    // -------------------------------------------------------------------------
    // RENDER: HERO 3D BOOK WITH 360° ROTATION & PHYSICAL SHADING
    // -------------------------------------------------------------------------
    function renderHeroBook(
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      book: typeof bookStateRef.current,
      curTheme: CourseTheme,
      lx: number,
      ly: number,
      canvasW: number
    ) {
      c.save();
      c.translate(cx, cy);

      // Book Proportions: physically believable university textbook
      const isMobileSize = canvasW < 460;
      const bw = isMobileSize ? 165 : 205;
      const bh = isMobileSize ? 230 : 280;
      const bThick = isMobileSize ? 34 : 42;

      const hw = bw / 2;
      const hh = bh / 2;
      const ht = bThick / 2;

      // Realistic Soft Contact Drop Shadow (Calm, Grounded)
      const shadowGrad = c.createRadialGradient(0, hh + 44, 8, 0, hh + 44, hw * 1.55);
      shadowGrad.addColorStop(0, 'rgba(5, 3, 4, 0.82)');
      shadowGrad.addColorStop(0.5, 'rgba(5, 3, 4, 0.35)');
      shadowGrad.addColorStop(1, 'rgba(5, 3, 4, 0)');
      c.fillStyle = shadowGrad;
      c.beginPath();
      c.ellipse(0, hh + 44, hw * 1.35, 24, 0, 0, Math.PI * 2);
      c.fill();

      // Current Rotation Angles (Strict Horizontal Y Turntable)
      const rx = book.rotX;
      const ry = book.rotY;
      const rz = 0;

      // Vertices in local book space:
      // Front cover (z = +ht): 0: top-left, 1: top-right, 2: bottom-right, 3: bottom-left
      // Back cover  (z = -ht): 4: top-left, 5: top-right, 6: bottom-right, 7: bottom-left
      const verts = [
        [-hw, -hh, ht], [hw, -hh, ht], [hw, hh, ht], [-hw, hh, ht],
        [-hw, -hh, -ht], [hw, -hh, -ht], [hw, hh, -ht], [-hw, hh, -ht],
      ];

      const proj = verts.map((v) => {
        rotatePoint(v[0], v[1], v[2], rx, ry, rz);
        return { x: rotBuf.x, y: rotBuf.y, z: rotBuf.z };
      });

      // Shading Palette by Theme
      let coverBase = '#4A0E17';
      let coverDark = '#180408';
      let spineColor = '#6B1422';
      let bookTitle = 'MATHEMATICS';
      let subTitle = 'LUMOS ACADEMY';

      if (curTheme === 'english') {
        coverBase = '#162234';
        coverDark = '#090E17';
        spineColor = '#21334E';
        bookTitle = 'ENGLISH';
        subTitle = 'IELTS & GRAMMAR';
      } else if (curTheme === 'it') {
        coverBase = '#182822';
        coverDark = '#0A120E';
        spineColor = '#243C33';
        bookTitle = 'FRONTEND IT';
        subTitle = 'CODE & SYSTEMS';
      } else if (curTheme === 'academic') {
        coverBase = '#3E121E';
        coverDark = '#15050A';
        spineColor = '#5E1A2D';
        bookTitle = 'DTM & GRANT';
        subTitle = 'AKADEMIK BLOK';
      }

      // Calculate Face Normals for 360° Visiblity
      // Front Cover Normal
      const f01x = proj[1].x - proj[0].x;
      const f01y = proj[1].y - proj[0].y;
      const f03x = proj[3].x - proj[0].x;
      const f03y = proj[3].y - proj[0].y;
      const frontNormZ = f01x * f03y - f01y * f03x;

      // Spine Normal (Left Side: 0, 4, 7, 3)
      const s04x = proj[4].x - proj[0].x;
      const s04y = proj[4].y - proj[0].y;
      const spineNormZ = s04x * f03y - s04y * f03x;

      // Right Pages Block Normal (1, 5, 6, 2)
      const p15x = proj[5].x - proj[1].x;
      const p15y = proj[5].y - proj[1].y;
      const p12x = proj[2].x - proj[1].x;
      const p12y = proj[2].y - proj[1].y;
      const pagesNormZ = p15x * p12y - p15y * p12x;

      // Top Normal (0, 1, 5, 4)
      const topNormZ = f01x * s04y - f01y * s04x;

      // Bottom Normal (3, 2, 6, 7)
      const b32x = proj[2].x - proj[3].x;
      const b32y = proj[2].y - proj[3].y;
      const b37x = proj[7].x - proj[3].x;
      const b37y = proj[7].y - proj[3].y;
      const botNormZ = b32x * b37y - b32y * b37x;

      // 1. Back Cover Face (Rendered when rotated 180° / facing away)
      if (frontNormZ < 0) {
        c.beginPath();
        c.moveTo(proj[4].x, proj[4].y);
        c.lineTo(proj[5].x, proj[5].y);
        c.lineTo(proj[6].x, proj[6].y);
        c.lineTo(proj[7].x, proj[7].y);
        c.closePath();
        const backGrad = c.createLinearGradient(proj[4].x, proj[4].y, proj[6].x, proj[6].y);
        backGrad.addColorStop(0, coverDark);
        backGrad.addColorStop(1, '#060203');
        c.fillStyle = backGrad;
        c.fill();
        c.strokeStyle = '#D9A83F';
        c.lineWidth = 1.2;
        c.stroke();

        // Embossed Back Seal
        const backMidX = (proj[4].x + proj[5].x + proj[6].x + proj[7].x) / 4;
        const backMidY = (proj[4].y + proj[5].y + proj[6].y + proj[7].y) / 4;
        c.save();
        c.translate(backMidX, backMidY);
        c.beginPath();
        c.arc(0, 0, 24, 0, Math.PI * 2);
        c.strokeStyle = 'rgba(217, 168, 63, 0.45)';
        c.stroke();
        c.font = 'bold 9px monospace';
        c.fillStyle = '#F3D276';
        c.textAlign = 'center';
        c.fillText('LUMOS', 0, 3);
        c.restore();
      }

      // 2. Spine (Left side)
      if (spineNormZ > 0) {
        c.beginPath();
        c.moveTo(proj[0].x, proj[0].y);
        c.lineTo(proj[4].x, proj[4].y);
        c.lineTo(proj[7].x, proj[7].y);
        c.lineTo(proj[3].x, proj[3].y);
        c.closePath();
        const spineGrad = c.createLinearGradient(proj[0].x, proj[0].y, proj[7].x, proj[7].y);
        spineGrad.addColorStop(0, spineColor);
        spineGrad.addColorStop(1, '#0C0305');
        c.fillStyle = spineGrad;
        c.fill();
        c.strokeStyle = '#F3D276';
        c.lineWidth = 1.2;
        c.stroke();

        // Gold Spine Ribbing Lines
        c.strokeStyle = 'rgba(243, 210, 118, 0.6)';
        c.lineWidth = 1.0;
        c.beginPath();
        c.moveTo(proj[0].x * 0.7 + proj[3].x * 0.3, proj[0].y * 0.7 + proj[3].y * 0.3);
        c.lineTo(proj[4].x * 0.7 + proj[7].x * 0.3, proj[4].y * 0.7 + proj[7].y * 0.3);
        c.moveTo(proj[0].x * 0.3 + proj[3].x * 0.7, proj[0].y * 0.3 + proj[3].y * 0.7);
        c.lineTo(proj[4].x * 0.3 + proj[7].x * 0.7, proj[4].y * 0.3 + proj[7].y * 0.7);
        c.stroke();
      }

      // 3. Right Pages Block (Real Ivory Pages with Striations)
      if (pagesNormZ > 0) {
        c.beginPath();
        c.moveTo(proj[1].x, proj[1].y);
        c.lineTo(proj[5].x, proj[5].y);
        c.lineTo(proj[6].x, proj[6].y);
        c.lineTo(proj[2].x, proj[2].y);
        c.closePath();
        const pageGrad = c.createLinearGradient(proj[1].x, proj[1].y, proj[6].x, proj[6].y);
        pageGrad.addColorStop(0, 'rgba(244, 238, 224, 0.98)');
        pageGrad.addColorStop(0.5, 'rgba(215, 204, 185, 0.92)');
        pageGrad.addColorStop(1, 'rgba(175, 162, 140, 0.88)');
        c.fillStyle = pageGrad;
        c.fill();
        c.strokeStyle = 'rgba(217, 168, 63, 0.35)';
        c.lineWidth = 1;
        c.stroke();

        // Individual page lines
        c.strokeStyle = 'rgba(150, 138, 118, 0.35)';
        c.beginPath();
        c.moveTo((proj[1].x + proj[5].x) / 2, (proj[1].y + proj[5].y) / 2);
        c.lineTo((proj[2].x + proj[6].x) / 2, (proj[2].y + proj[6].y) / 2);
        c.stroke();
      }

      // 4. Top Pages Block
      if (topNormZ > 0) {
        c.beginPath();
        c.moveTo(proj[0].x, proj[0].y);
        c.lineTo(proj[1].x, proj[1].y);
        c.lineTo(proj[5].x, proj[5].y);
        c.lineTo(proj[4].x, proj[4].y);
        c.closePath();
        c.fillStyle = 'rgba(226, 218, 202, 0.94)';
        c.fill();
        c.strokeStyle = 'rgba(217, 168, 63, 0.3)';
        c.stroke();
      }

      // 5. Bottom Pages Block
      if (botNormZ > 0) {
        c.beginPath();
        c.moveTo(proj[3].x, proj[3].y);
        c.lineTo(proj[2].x, proj[2].y);
        c.lineTo(proj[6].x, proj[6].y);
        c.lineTo(proj[7].x, proj[7].y);
        c.closePath();
        c.fillStyle = 'rgba(196, 186, 170, 0.95)';
        c.fill();
        c.strokeStyle = 'rgba(217, 168, 63, 0.3)';
        c.stroke();
      }

      // 6. Front Cover Face (The Hero Presentation)
      if (frontNormZ > 0) {
        c.beginPath();
        c.moveTo(proj[0].x, proj[0].y);
        c.lineTo(proj[1].x, proj[1].y);
        c.lineTo(proj[2].x, proj[2].y);
        c.lineTo(proj[3].x, proj[3].y);
        c.closePath();

        const coverGrad = c.createLinearGradient(proj[0].x, proj[0].y, proj[2].x, proj[2].y);
        coverGrad.addColorStop(0, coverBase);
        coverGrad.addColorStop(0.65, coverDark);
        coverGrad.addColorStop(1, '#070204');
        c.fillStyle = coverGrad;
        c.fill();

        // Warm Gold Bevelled Rim Highlight
        c.strokeStyle = '#F3D276';
        c.lineWidth = 1.4;
        c.stroke();

        // Inner Embossed Gold Line Frame
        const inScale = 0.88;
        c.beginPath();
        c.moveTo(proj[0].x * inScale, proj[0].y * inScale);
        c.lineTo(proj[1].x * inScale, proj[1].y * inScale);
        c.lineTo(proj[2].x * inScale, proj[2].y * inScale);
        c.lineTo(proj[3].x * inScale, proj[3].y * inScale);
        c.closePath();
        c.strokeStyle = 'rgba(243, 210, 118, 0.45)';
        c.lineWidth = 0.9;
        c.stroke();

        // Studio Specular Light Sweep (Illuminates as it rotates)
        c.save();
        c.beginPath();
        c.moveTo(proj[0].x, proj[0].y);
        c.lineTo(proj[1].x, proj[1].y);
        c.lineTo(proj[2].x, proj[2].y);
        c.lineTo(proj[3].x, proj[3].y);
        c.closePath();
        c.clip();

        const sheenGrad = c.createRadialGradient(lx, ly, 10, lx, ly, hw * 1.5);
        sheenGrad.addColorStop(0, 'rgba(255, 240, 195, 0.32)');
        sheenGrad.addColorStop(0.45, 'rgba(217, 168, 63, 0.10)');
        sheenGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        c.fillStyle = sheenGrad;
        c.fillRect(-hw * 1.5, -hh * 1.5, bw * 2, bh * 2);
        c.restore();

        // Front Cover Typography (Rotated to align with perspective plane)
        const faceMidX = (proj[0].x + proj[1].x + proj[2].x + proj[3].x) / 4;
        const faceMidY = (proj[0].y + proj[1].y + proj[2].y + proj[3].y) / 4;

        c.save();
        c.translate(faceMidX, faceMidY);
        const skewAngle = Math.atan2(proj[1].y - proj[0].y, proj[1].x - proj[0].x);
        c.rotate(skewAngle);

        // Subtitle
        c.font = 'bold 9px -apple-system, sans-serif';
        c.fillStyle = 'rgba(243, 210, 118, 0.85)';
        c.textAlign = 'center';
        c.letterSpacing = '2.5px';
        c.fillText(subTitle, 0, -hh * 0.42);

        // Gold Divider Line
        c.strokeStyle = 'rgba(217, 168, 63, 0.6)';
        c.lineWidth = 0.8;
        c.beginPath();
        c.moveTo(-45, -hh * 0.32);
        c.lineTo(45, -hh * 0.32);
        c.stroke();

        // Main Golden Book Title
        c.font = '900 19px "Playfair Display", serif';
        c.fillStyle = '#FFFFFF';
        c.fillText(bookTitle, 0, -hh * 0.08);
        c.fillStyle = '#F3D276';
        c.fillText(bookTitle, 0.5, -hh * 0.08 + 0.5);

        // Center Seal Emblem
        c.strokeStyle = '#F3D276';
        c.lineWidth = 1.0;
        c.beginPath();
        c.arc(0, hh * 0.28, 22, 0, Math.PI * 2);
        c.stroke();

        c.beginPath();
        c.arc(0, hh * 0.28, 18, 0, Math.PI * 2);
        c.strokeStyle = 'rgba(217, 168, 63, 0.5)';
        c.stroke();

        c.font = 'bold 12px monospace';
        c.fillStyle = '#F3D276';
        const sealGlyph = curTheme === 'math' ? '∑ π' : curTheme === 'english' ? 'EN' : curTheme === 'it' ? '< / >' : '★ DTM';
        c.fillText(sealGlyph, 0, hh * 0.28 + 4);

        c.restore();
      }

      c.restore();
    }

    // -------------------------------------------------------------------------
    // RENDER: LARGE 3D ORBITAL RING (Horizontal Orbit with Real 3D Depth)
    // -------------------------------------------------------------------------
    function renderOrbitalRing(
      c: CanvasRenderingContext2D,
      ring: typeof ringStateRef.current,
      floatY: number,
      lx: number,
      ly: number
    ) {
      c.save();
      c.translate(ring.screenX, ring.screenY);

      // Scale based on orbital depth (Z)
      const depthScale = Math.max(0.68, Math.min(1.28, 1.0 + (ring.depthZ / 260) * 0.35));
      c.scale(depthScale, depthScale);

      // Gold Glow Highlight on Hover or Drag
      if (ring.isHovered || ring.isDragging) {
        c.fillStyle = 'rgba(217, 168, 63, 0.22)';
        c.beginPath();
        c.arc(0, 0, 52, 0, Math.PI * 2);
        c.fill();
      }

      // Render Layered Bevelled 3D Ring
      const ringRadius = 42;
      const ringTube = 7;

      // Outer Gold Rim Ellipse
      c.beginPath();
      c.ellipse(0, 0, ringRadius, ringRadius * 0.46, ring.selfRotY, 0, Math.PI * 2);
      c.strokeStyle = ring.isHovered ? '#FFFFFF' : '#F3D276';
      c.lineWidth = 2.4;
      c.stroke();

      // Inner Metallic Core Ellipse
      c.beginPath();
      c.ellipse(0, 0, ringRadius - ringTube, (ringRadius - ringTube) * 0.46, ring.selfRotY, 0, Math.PI * 2);
      c.strokeStyle = 'rgba(217, 168, 63, 0.45)';
      c.lineWidth = 1.2;
      c.stroke();

      // Subtle Mathematical Tick Notches on Ring
      for (let k = 0; k < 4; k++) {
        const angle = ring.selfRotY + (k * Math.PI) / 2;
        const nx = Math.cos(angle) * ringRadius;
        const ny = Math.sin(angle) * ringRadius * 0.46;
        c.fillStyle = '#F3D276';
        c.beginPath();
        c.arc(nx, ny, 1.8, 0, Math.PI * 2);
        c.fill();
      }

      c.restore();
    }

    // -------------------------------------------------------------------------
    // POINTER & TOUCH INTERACTIONS (360° Horizontal Drag & Real Momentum)
    // -------------------------------------------------------------------------
    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const now = performance.now();

      const book = bookStateRef.current;
      const ring = ringStateRef.current;

      // 1. DRAGGING BOOK HORIZONTALLY
      if (activeTargetRef.current === 'book') {
        const dx = px - book.lastPointerX;
        const dy = py - book.lastPointerY;

        // Strictly Horizontal Y Rotation (Turntable)
        book.rotY += dx * 0.0085;
        // Subtle micro physical tilt on X (max 2-3 degrees)
        book.rotX = Math.max(-0.24, Math.min(-0.08, book.rotX + dy * 0.0012));

        // Sample pointer velocity
        book.samples.push({ x: px, y: py, time: now });
        if (book.samples.length > 8) book.samples.shift();

        book.lastPointerX = px;
        book.lastPointerY = py;
        document.body.style.cursor = 'grabbing';
        e.preventDefault();
        return;
      }

      // 2. DRAGGING RING MANUALLY
      if (activeTargetRef.current === 'ring') {
        const dx = px - ring.lastPointerX;
        ring.selfRotY += dx * 0.015;
        ring.orbitPhase += dx * 0.004; // User manually pulls ring along orbit

        ring.samples.push({ x: px, y: py, time: now });
        if (ring.samples.length > 8) ring.samples.shift();

        ring.lastPointerX = px;
        ring.lastPointerY = py;
        document.body.style.cursor = 'grabbing';
        e.preventDefault();
        return;
      }

      // 3. HOVER DETECTION
      // Ring Hit Check
      const distToRing = Math.hypot(px - ring.screenX, py - ring.screenY);
      const isRingHit = distToRing < 54;
      ring.isHovered = isRingHit;

      // Book Hit Check
      const distToCenter = Math.hypot(px - width / 2, py - height / 2);
      const isBookHit = !isRingHit && distToCenter < Math.min(width, height) * 0.38;
      book.isHovered = isBookHit;

      if (isRingHit || isBookHit) {
        document.body.style.cursor = 'grab';
      } else {
        document.body.style.cursor = 'default';
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const now = performance.now();

      const book = bookStateRef.current;
      const ring = ringStateRef.current;

      // Check Ring Hit
      const distToRing = Math.hypot(px - ring.screenX, py - ring.screenY);
      if (distToRing < 54) {
        activeTargetRef.current = 'ring';
        ring.isDragging = true;
        ring.spinVy = 0;
        ring.lastPointerX = px;
        ring.lastPointerY = py;
        ring.samples = [{ x: px, y: py, time: now }];
        try {
          canvas.setPointerCapture(e.pointerId);
        } catch (err) {}
        document.body.style.cursor = 'grabbing';
        e.preventDefault();
        return;
      }

      // Check Book Hit
      const distToCenter = Math.hypot(px - width / 2, py - height / 2);
      if (distToCenter < Math.min(width, height) * 0.38) {
        activeTargetRef.current = 'book';
        book.isDragging = true;
        book.angVy = 0;
        book.angVx = 0;
        book.lastPointerX = px;
        book.lastPointerY = py;
        book.samples = [{ x: px, y: py, time: now }];
        try {
          canvas.setPointerCapture(e.pointerId);
        } catch (err) {}
        document.body.style.cursor = 'grabbing';
        e.preventDefault();
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      const now = performance.now();

      // Release Book
      if (activeTargetRef.current === 'book') {
        const book = bookStateRef.current;
        book.isDragging = false;
        activeTargetRef.current = null;

        // Calculate Horizontal Velocity & Momentum
        const samples = book.samples;
        if (samples.length >= 2) {
          const recent = samples.filter((p) => now - p.time <= 100);
          if (recent.length >= 2) {
            const first = recent[0];
            const last = recent[recent.length - 1];
            const dt = (last.time - first.time) / 1000;
            if (dt > 0.01) {
              const vx = (last.x - first.x) / dt;
              // Convert pointer velocity into angular momentum
              book.angVy = Math.max(-0.14, Math.min(0.14, (vx / 60) * 0.014));
            }
          }
        }

        try {
          canvas.releasePointerCapture(e.pointerId);
        } catch (err) {}
        document.body.style.cursor = book.isHovered ? 'grab' : 'default';
      }

      // Release Ring
      else if (activeTargetRef.current === 'ring') {
        const ring = ringStateRef.current;
        ring.isDragging = false;
        activeTargetRef.current = null;

        const samples = ring.samples;
        if (samples.length >= 2) {
          const recent = samples.filter((p) => now - p.time <= 100);
          if (recent.length >= 2) {
            const first = recent[0];
            const last = recent[recent.length - 1];
            const dt = (last.time - first.time) / 1000;
            if (dt > 0.01) {
              const vx = (last.x - first.x) / dt;
              ring.spinVy = Math.max(-0.16, Math.min(0.16, (vx / 60) * 0.018));
            }
          }
        }

        try {
          canvas.releasePointerCapture(e.pointerId);
        } catch (err) {}
        document.body.style.cursor = ring.isHovered ? 'grab' : 'default';
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
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-radial from-[#D9A83F]/06 via-[#4A0E17]/10 to-transparent blur-3xl pointer-events-none" />

      {/* -----------------------------------------------------------------------
          1. SECTION HEADER & DYNAMIC COURSE SELECTOR BAR
          ----------------------------------------------------------------------- */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8 relative z-10">
        <div className="space-y-4 max-w-2xl">
          {/* Section Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16090D] border border-[#D9A93A]/35 text-xs font-bold uppercase tracking-widest text-[#D9A93A] shadow-[0_4px_16px_rgba(217,169,58,0.12)]">
            <BookOpen className="h-3.5 w-3.5" />
            <span>3D Kurslar Ko‘rgazmasi</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-luxury-serif font-black text-[#F7F4EE] leading-[1.12]">
            Kelajagingiz uchun <br />
            <span className="text-[#D9A93A] font-luxury-serif">bilimni tanlang.</span>
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#B0A7A2] font-normal leading-relaxed">
            Markazdagi 3D kitobni kursor orqali 360° gorizontal aylantiring, uning orqa muhrini va umurtqasini ko‘zdan kechiring. Har bir kurs chuqur amaliy laboratoriyalar va shaxsiy murabbiyga ega.
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
          2. MINIMALIST LUXURY SHOWROOM STAGE (No 6-Card Grid!)
          ----------------------------------------------------------------------- */}
      <div className="relative rounded-[44px] bg-gradient-to-br from-[#180A10] via-[#0E0508] to-[#070305] border border-[#D9A93A]/30 p-6 sm:p-10 lg:p-14 shadow-[0_35px_100px_rgba(0,0,0,0.94)] overflow-hidden">
        {/* Subtle Faint Coordinate Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#D9A93A_1px,transparent_1px)] [background-size:36px_36px] opacity-08 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center relative z-10">
          {/* LEFT COLUMN: Course Details & Metadata */}
          <div
            className={`lg:col-span-6 space-y-6 transition-all duration-380 ${
              isTransitioning ? 'opacity-40 translate-y-2' : 'opacity-100 translate-y-0'
            }`}
          >
            {/* Top Indicator & Navigation Arrows */}
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

            {/* Syllabus Highlights Preview */}
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

          {/* RIGHT COLUMN: Luxury 3D Showroom (1 Anchored Book + 1 Large Orbital Ring) */}
          <div className="lg:col-span-6 relative w-full aspect-square max-w-[560px] mx-auto flex items-center justify-center select-none">
            {/* Ambient Behind-Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[86%] h-[86%] rounded-full bg-radial from-[#D9A83F]/18 via-[#4A0E17]/22 to-transparent blur-3xl" />
            </div>

            {/* 3D Canvas */}
            <canvas
              ref={canvasRef}
              className="w-full h-full block touch-none select-none relative z-10"
              style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
              title="3D Kurs Kitobi: Gorizontal 360° aylantirish uchun ushlang"
            />

            {/* Micro Interaction Hint Badge */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#120608]/85 backdrop-blur-md border border-[#D9A93A]/30 text-[10px] font-semibold text-[#D9A93A] pointer-events-none flex items-center gap-2 whitespace-nowrap shadow-xl">
              <RotateCw className="h-3 w-3" />
              <span>Kitob va halqani gorizontal 360° aylantirish uchun ushlang</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
