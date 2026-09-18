import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  BookOpen,
  Clock,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Calculator,
  Compass,
  Ruler,
  Sparkles,
  Award,
  Calendar,
} from 'lucide-react';
import { Course } from '../../types/admin';
import { INITIAL_COURSES } from '../../data/coursesData';
import { useI18n } from '../../lib/i18n';
import {
  detectDeviceTier,
  getTierDpr,
  createVisibilityObserver,
  AdaptiveFPSController,
  PerformanceTier,
} from '../../lib/performanceManager';

interface Courses3DSectionProps {
  onOpenDetails: (course: Course) => void;
  onOpenRegister: (courseTitle: string) => void;
  onOpenDiagnostic?: () => void;
}

export interface MathGradeTier {
  id: string;
  gradeRange: string;
  title: string;
  subtitle: string;
  price: number;
  priceFormatted: string;
  badge?: string;
  topics: string[];
  duration: string;
  schedule: string;
  instructor: string;
  iconName: 'calculator' | 'compass' | 'ruler' | 'award';
}

export const MATH_GRADE_TIERS: MathGradeTier[] = [
  {
    id: 'tier-1-2',
    gradeRange: '1–2',
    title: '1–2 sinflar',
    subtitle: 'Boshlang‘ich matematik tushunchalar',
    price: 200000,
    priceFormatted: '200 000',
    topics: [
      'Asosiy matematik tushunchalar',
      'Hisoblash va tezkor arifmetika',
      'Mantiqiy fikrlash va boshqotirmalar',
    ],
    duration: '9 oy (108 dars)',
    schedule: 'Dush - Chor - Juma (14:00 - 16:00)',
    instructor: 'Hadicha ustoz',
    iconName: 'calculator',
  },
  {
    id: 'tier-3-4',
    gradeRange: '3–4',
    title: '3–4 sinflar',
    subtitle: 'Matematikani chuqurroq o‘rganish',
    price: 280000,
    priceFormatted: '280 000',
    topics: [
      'Matematikani chuqurroq o‘rganish',
      'Masalalar yechish va analiz',
      'Mantiqiy fikrlashni rivojlantirish',
    ],
    duration: '9 oy (108 dars)',
    schedule: 'Sesh - Pay - Shan (14:00 - 16:00)',
    instructor: 'Diyorbek ustoz',
    iconName: 'compass',
  },
  {
    id: 'tier-5-7',
    gradeRange: '5–7',
    title: '5–7 sinflar',
    subtitle: 'Algebra va Geometriya asoslari',
    price: 330000,
    priceFormatted: '330 000',
    badge: 'Eng ommabop',
    topics: [
      'Algebraik ifodalar va tenglamalar',
      'Geometriya va fazoviy shakllar',
      'Murakkab olimpiada masalalari',
    ],
    duration: '9 oy (108 dars)',
    schedule: 'Dush - Chor - Juma (16:00 - 18:00)',
    instructor: 'Hadicha ustoz',
    iconName: 'ruler',
  },
  {
    id: 'tier-8-9',
    gradeRange: '8–9',
    title: '8–9 sinflar',
    subtitle: 'Yuqori daraja va imtihon tayyorgarligi',
    price: 380000,
    priceFormatted: '380 000',
    badge: 'DTM & Litsey',
    topics: [
      'Yuqori darajadagi matematika',
      'DTM / imtihon tayyorgarligi',
      'Murakkab mavzular va test tahlili',
    ],
    duration: '9 oy (108 dars)',
    schedule: 'Sesh - Pay - Shan (16:00 - 18:00)',
    instructor: 'Mirjalol ustoz',
    iconName: 'award',
  },
];

export const Courses3DSection: React.FC<Courses3DSectionProps> = ({
  onOpenDetails,
  onOpenRegister,
  onOpenDiagnostic,
}) => {
  const { formatMoney } = useI18n();

  // Selected Grade Tier State (defaults to 5-7 sinflar)
  const [selectedGradeId, setSelectedGradeId] = useState<string>('tier-5-7');

  const activeGrade = useMemo(() => {
    return MATH_GRADE_TIERS.find((t) => t.id === selectedGradeId) || MATH_GRADE_TIERS[2];
  }, [selectedGradeId]);

  // Construct Course object to support details modal
  const activeCourseObject = useMemo<Course>(() => {
    const existing = INITIAL_COURSES.find((c) =>
      c.title.toLowerCase().includes('matematika')
    ) || INITIAL_COURSES[0];

    return {
      ...existing,
      id: `MATH-${activeGrade.gradeRange}`,
      title: `Matematika (${activeGrade.title})`,
      level: `${activeGrade.gradeRange} sinf o‘quvchilari uchun`,
      pricePerMonth: activeGrade.price,
      description: `Matematika — mantiqiy fikrlash, muammoni hal qilish va kelajakdagi katta imkoniyatlar eshigini ochadigan eng muhim fanlardan biri. (${activeGrade.subtitle})`,
      instructor: activeGrade.instructor,
      schedule: activeGrade.schedule,
      syllabus: activeGrade.topics,
      features: ['Haftada 3 kun, 2 soatdan', 'Har oy test sinovi va monitoring', 'Ota-onalarga oylik hisobot'],
      targetAudience: `${activeGrade.gradeRange} sinf o‘quvchilari`,
      outcomes: ['Mustahkam poydevor va mantiqiy fikrlash', 'Maktab va imtihonlarda 90%+ a’lo natija'],
    };
  }, [activeGrade]);

  // ---------------------------------------------------------------------------
  // 3D CANVAS: SHOWROOM MATHEMATICS WORLD ENGINE
  // ---------------------------------------------------------------------------
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Book Showroom Turntable Angle & Autonomous Spin
  const bookPhysicsRef = useRef({
    rotY: -0.44, // Showroom angle (~ -25 deg)
    angVy: 0.0016, // Slow autonomous rotation
    targetHoverScale: 1.0,
    hoverScale: 1.0,
    isDragging: false,
    dragStartX: 0,
    lastDragX: 0,
    lastDragTime: 0,
    dragVelocityX: 0,
  });

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const phys = bookPhysicsRef.current;
    phys.isDragging = true;
    phys.dragStartX = e.clientX;
    phys.lastDragX = e.clientX;
    phys.lastDragTime = performance.now();
    phys.dragVelocityX = 0;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const phys = bookPhysicsRef.current;
    if (!phys.isDragging) return;
    const now = performance.now();
    const dt = Math.max(1, now - phys.lastDragTime);
    const dx = e.clientX - phys.lastDragX;
    phys.dragVelocityX = dx / dt;
    phys.rotY += dx * 0.0075;
    phys.lastDragX = e.clientX;
    phys.lastDragTime = now;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const phys = bookPhysicsRef.current;
    if (!phys.isDragging) return;
    phys.isDragging = false;
    phys.angVy = Math.max(-0.035, Math.min(0.035, phys.dragVelocityX * 0.015));
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const fpsController = new AdaptiveFPSController();
    let currentTier: PerformanceTier = fpsController.getTier();

    let width = 640;
    let height = 520;
    let dpr = getTierDpr(currentTier);
    let isVisible = true;

    fpsController.subscribe((newTier) => {
      currentTier = newTier;
      updateSize();
    });

    const updateSize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect && rect.width > 0) {
        width = rect.width;
        height = rect.height;
        dpr = getTierDpr(currentTier);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
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

    // Pre-allocated projection buffers
    const projCoverFront = Array.from({ length: 8 }, () => ({ x: 0, y: 0, z: 0 }));
    const projCoverBack = Array.from({ length: 8 }, () => ({ x: 0, y: 0, z: 0 }));
    const projPages = Array.from({ length: 8 }, () => ({ x: 0, y: 0, z: 0 }));

    const render = (now: number) => {
      if (!isVisible) return;
      fpsController.recordFrame(now);
      const dt = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;
      time += dt;

      const bookPhys = bookPhysicsRef.current;

      // Momentum physics & autonomous rotation
      if (!bookPhys.isDragging) {
        bookPhys.rotY += bookPhys.angVy;
        if (Math.abs(bookPhys.angVy - 0.0016) > 0.0001) {
          bookPhys.angVy = bookPhys.angVy * 0.94 + 0.0016 * 0.06;
        }
      }
      bookPhys.hoverScale += (bookPhys.targetHoverScale - bookPhys.hoverScale) * 0.1;

      ctx.clearRect(0, 0, width, height);

      const isMobile = width < 768;
      const mobileScale = isMobile ? Math.min(1.0, width / 440) * 0.72 : 0.92;
      const centerX = width * 0.50;
      const centerY = height * 0.48;
      const floatY = Math.sin(time * 1.2) * (isMobile ? 2.0 : 3.0);

      // -----------------------------------------------------------------------
      // 1. VOLUMETRIC WARM KEY LIGHT & SPATIAL ATMOSPHERE
      // -----------------------------------------------------------------------
      const bgGlow = ctx.createRadialGradient(centerX + 20, centerY - 10, 10, centerX + 20, centerY - 10, 240);
      bgGlow.addColorStop(0, 'rgba(217, 166, 46, 0.22)');
      bgGlow.addColorStop(0.35, 'rgba(90, 11, 28, 0.20)');
      bgGlow.addColorStop(0.7, 'rgba(13, 6, 8, 0.5)');
      bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bgGlow;
      ctx.beginPath();
      ctx.arc(centerX + 20, centerY - 10, 240, 0, Math.PI * 2);
      ctx.fill();

      // Atmospheric Golden Bokeh Particles
      for (let p = 0; p < 14; p++) {
        const bx = Math.sin(time * 0.32 + p * 1.35) * (width * 0.42);
        const by = Math.cos(time * 0.26 + p * 1.15) * (height * 0.40);
        const br = (p % 3 === 0 ? 2.2 : 1.4) * (1 + Math.sin(time * 0.8 + p) * 0.3);
        const bAlpha = 0.18 + 0.16 * Math.sin(time * 1.1 + p);
        ctx.fillStyle = `rgba(243, 204, 112, ${bAlpha})`;
        ctx.beginPath();
        ctx.arc(centerX + bx, centerY + by, br, 0, Math.PI * 2);
        ctx.fill();
      }

      // Sweeping Curved Golden Light Arc
      ctx.save();
      ctx.beginPath();
      const arcCenterX = centerX + 30;
      const arcCenterY = centerY - 145 + floatY * 0.4;
      ctx.ellipse(arcCenterX, arcCenterY, 120, 44, -0.22, Math.PI * 0.85, Math.PI * 1.75);
      const arcGrad = ctx.createLinearGradient(arcCenterX - 80, arcCenterY, arcCenterX + 80, arcCenterY);
      arcGrad.addColorStop(0, 'rgba(217, 166, 46, 0)');
      arcGrad.addColorStop(0.5, 'rgba(255, 226, 154, 0.70)');
      arcGrad.addColorStop(1, 'rgba(217, 166, 46, 0)');
      ctx.strokeStyle = arcGrad;
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.restore();

      // -----------------------------------------------------------------------
      // 2. RENDER BACK HALF OF INSCRIBED ORBITAL RING (BEHIND BOOK)
      // -----------------------------------------------------------------------
      const ringRadius = 138;
      const ringTiltX = 0.48;
      const ringRotY = time * 0.05;

      ctx.save();
      ctx.translate(centerX, centerY + floatY * 0.5);
      drawGrandInscribedRing(ctx, ringRadius, ringTiltX, ringRotY, 'back');
      drawNestedTiltedRing(ctx, 92, -0.38, -time * 0.07, 'back');
      ctx.restore();

      // -----------------------------------------------------------------------
      // 3. BACKGROUND SPATIAL MATHEMATICAL UNIVERSE
      // -----------------------------------------------------------------------
      ctx.save();
      ctx.translate(centerX, centerY + floatY);

      // Analytical XYZ Coordinate Sculpture (Top-Left)
      const coordDriftX = Math.sin(time * 0.45) * 10;
      const coordDriftY = Math.cos(time * 0.38) * 7;
      drawXYZCoordinateSculpture(ctx, -140 + coordDriftX, -80 + coordDriftY, 28, time);

      // Volumetric Parabola Ribbon (Mid-Left)
      const parabolaDriftX = Math.cos(time * 0.35) * 8;
      const parabolaDriftY = Math.sin(time * 0.42) * 6;
      drawVolumetricParabola(ctx, -125 + parabolaDriftX, -25 + parabolaDriftY, 24, time * 0.25);

      // Luminous Sine Wave with Node Coordinates (Left)
      const sineDriftX = Math.sin(time * 0.40) * 7;
      const sineDriftY = Math.cos(time * 0.32) * 8;
      drawCoordinateSineWave(ctx, -145 + sineDriftX, 30 + sineDriftY, time);

      // Precision 3D Wireframe Icosahedron (Left depth)
      drawWireframeIcosahedron(ctx, -120, 65, 18, time * 0.35);

      // Parametric Double Helix (Right)
      const helixDriftX = Math.cos(time * 0.38) * 8;
      const helixDriftY = Math.sin(time * 0.48) * 10;
      drawDoubleHelix(ctx, 140 + helixDriftX, -95 + helixDriftY, 20, time);

      // Parametric 3D Saddle Mesh (Right)
      const saddleDriftX = Math.sin(time * 0.32) * 10;
      const saddleDriftY = Math.cos(time * 0.44) * 8;
      drawSaddleMesh(ctx, 185 + saddleDriftX, -30 + saddleDriftY, 24, time * 0.35);

      // 3D Wireframe Pyramid (Bottom Right)
      const pyrDriftX = Math.cos(time * 0.42) * 7;
      const pyrDriftY = Math.sin(time * 0.36) * 8;
      drawWireframePyramid(ctx, 195 + pyrDriftX, 125 + pyrDriftY, 22, time * 0.3);

      // Floating Mathematical Formulas Drifting through Space:
      // Pi (Top-Right)
      const piDriftX = Math.sin(time * 0.35) * 7;
      const piDriftY = Math.cos(time * 0.42) * 5;
      drawGlowingFormula(ctx, 95 + piDriftX, -145 + piDriftY, 'π', 28, '#F3CC70');

      // Integral (Bottom-Left)
      const intDriftX = Math.cos(time * 0.38) * 7;
      const intDriftY = Math.sin(time * 0.44) * 6;
      drawGlowingFormula(ctx, -110 + intDriftX, 95 + intDriftY, '∫', 30, '#F3CC70');

      // a² + b² = c² (Right Midground)
      const pythDriftX = Math.sin(time * 0.30) * 8;
      const pythDriftY = Math.cos(time * 0.36) * 7;
      drawGlowingFormula(ctx, 165 + pythDriftX, 40 + pythDriftY, 'a² + b² = c²', 13, '#F8F4EA');

      // Sigma (Right)
      const sigDriftX = Math.cos(time * 0.40) * 6;
      const sigDriftY = Math.sin(time * 0.32) * 7;
      drawGlowingFormula(ctx, 170 + sigDriftX, 90 + sigDriftY, '∑', 21, '#F3CC70');

      // f(x) Formula
      drawGlowingFormula(ctx, 100 + Math.sin(time * 0.36) * 5, -45 + Math.cos(time * 0.4) * 4, 'f(x)', 13, '#F8F4EA');

      ctx.restore();

      // -----------------------------------------------------------------------
      // 4. MULTI-TIERED CIRCULAR BRONZE-GOLD PEDESTAL (UNDER BOOK)
      // -----------------------------------------------------------------------
      ctx.save();
      ctx.translate(centerX, centerY + floatY);

      // Book Proportions: 1.0 : 1.35 : 0.18
      const bw = Math.round(180 * mobileScale);
      const bh = Math.round(bw * 1.35);
      const bThick = Math.round(32 * mobileScale);
      const hw = bw / 2;
      const hh = bh / 2;
      const ht = bThick / 2;

      const pedY = hh + 25;

      // Floor Contact Glow & Drop Shadow
      const floorGlow = ctx.createRadialGradient(0, pedY + 15, 6, 0, pedY + 15, 180);
      floorGlow.addColorStop(0, 'rgba(217, 166, 46, 0.38)');
      floorGlow.addColorStop(0.35, 'rgba(90, 11, 28, 0.40)');
      floorGlow.addColorStop(0.7, 'rgba(8, 5, 6, 0.90)');
      floorGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = floorGlow;
      ctx.beginPath();
      ctx.ellipse(0, pedY + 15, 175, 36, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pedestal Tier 3 (Base Plinth): Radius 150
      ctx.fillStyle = '#140609';
      ctx.beginPath();
      ctx.ellipse(0, pedY + 12, 150, 27, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#5A0B1C';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Pedestal Tier 2 (Middle Beveled Ring): Radius 125
      const t2Grad = ctx.createLinearGradient(-125, 0, 125, 0);
      t2Grad.addColorStop(0, '#260A10');
      t2Grad.addColorStop(0.25, '#5A1E10');
      t2Grad.addColorStop(0.5, '#D9A62E');
      t2Grad.addColorStop(0.75, '#5A1E10');
      t2Grad.addColorStop(1, '#260A10');
      ctx.fillStyle = t2Grad;
      ctx.beginPath();
      ctx.ellipse(0, pedY + 6, 125, 23, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#E7B83F';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Pedestal Tier 1 (Top Stage Platform Disc): Radius 102
      const t1Grad = ctx.createRadialGradient(0, pedY, 3, 0, pedY, 102);
      t1Grad.addColorStop(0, '#FFE29A');
      t1Grad.addColorStop(0.28, '#E7B83F');
      t1Grad.addColorStop(0.68, '#5A0B1C');
      t1Grad.addColorStop(1, '#1A060A');
      ctx.fillStyle = t1Grad;
      ctx.beginPath();
      ctx.ellipse(0, pedY, 102, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#F3CC70';
      ctx.lineWidth = 1.3;
      ctx.stroke();

      // Inner Concentric Gold Ring Groove
      ctx.beginPath();
      ctx.ellipse(0, pedY, 86, 15, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(217, 166, 46, 0.60)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Dynamic Book Contact Shadow on Top of Pedestal
      const effW = (Math.abs(hw * Math.cos(bookPhys.rotY)) + Math.abs(ht * Math.sin(bookPhys.rotY))) * 1.25;
      const bookShadow = ctx.createRadialGradient(0, pedY - 2, 3, 0, pedY - 2, effW * 1.1);
      bookShadow.addColorStop(0, 'rgba(4, 2, 3, 0.88)');
      bookShadow.addColorStop(0.6, 'rgba(4, 2, 3, 0.32)');
      bookShadow.addColorStop(1, 'rgba(4, 2, 3, 0)');
      ctx.fillStyle = bookShadow;
      ctx.beginPath();
      ctx.ellipse(0, pedY - 2, effW, 11, 0, 0, Math.PI * 2);
      ctx.fill();

      // Floating Mathematical Manuscripts (Study Sheets)
      drawMathematicalManuscript(ctx, -68, pedY - 14, 44, 32, -0.22, 1);
      drawMathematicalManuscript(ctx, 42, pedY - 10, 40, 28, 0.28, 2);

      // Polished Gold Reflective Sphere (The Orb)
      const orbX = -72;
      const orbY = pedY + 2;
      drawGlossyGoldSphere(ctx, orbX, orbY, 11 * mobileScale);

      ctx.restore();

      // -----------------------------------------------------------------------
      // 5. MATHEMATICS 3D TEXTBOOK GEOMETRY & EMBOSSED COVER
      // -----------------------------------------------------------------------
      ctx.save();
      ctx.translate(centerX, centerY + floatY);

      // Camera: pitch tilt (rx) = 0.08, horizontal yaw (ry) = rotY, roll (rz) = 0
      const rx = 0.08;
      const ry = bookPhys.rotY;
      const rz = 0;

      // Project vertices: Front Cover (-ht to -ht + 2.5)
      const fcThickness = 2.5;
      const vFC = [
        [-hw, -hh, -ht],
        [hw, -hh, -ht],
        [hw, hh, -ht],
        [-hw, hh, -ht],
        [-hw, -hh, -ht + fcThickness],
        [hw, -hh, -ht + fcThickness],
        [hw, hh, -ht + fcThickness],
        [-hw, hh, -ht + fcThickness],
      ];
      for (let i = 0; i < 8; i++) {
        const r = rotate3D(vFC[i][0], vFC[i][1], vFC[i][2], rx, ry, rz);
        projCoverFront[i].x = r.x;
        projCoverFront[i].y = r.y;
        projCoverFront[i].z = r.z;
      }

      // Back Cover (ht - 2.5 to ht)
      const vBC = [
        [-hw, -hh, ht - fcThickness],
        [hw, -hh, ht - fcThickness],
        [hw, hh, ht - fcThickness],
        [-hw, hh, ht - fcThickness],
        [-hw, -hh, ht],
        [hw, -hh, ht],
        [hw, hh, ht],
        [-hw, hh, ht],
      ];
      for (let i = 0; i < 8; i++) {
        const r = rotate3D(vBC[i][0], vBC[i][1], vBC[i][2], rx, ry, rz);
        projCoverBack[i].x = r.x;
        projCoverBack[i].y = r.y;
        projCoverBack[i].z = r.z;
      }

      // Page Block Inner (+/- spine margin)
      const pageMargin = 4.5;
      const spineIndent = 1.0;
      const vPB = [
        [-hw + spineIndent, -hh + pageMargin, -ht + fcThickness],
        [hw - pageMargin, -hh + pageMargin, -ht + fcThickness],
        [hw - pageMargin, hh - pageMargin, -ht + fcThickness],
        [-hw + spineIndent, hh - pageMargin, -ht + fcThickness],
        [-hw + spineIndent, -hh + pageMargin, ht - fcThickness],
        [hw - pageMargin, -hh + pageMargin, ht - fcThickness],
        [hw - pageMargin, hh - pageMargin, ht - fcThickness],
        [-hw + spineIndent, hh - pageMargin, ht - fcThickness],
      ];
      for (let i = 0; i < 8; i++) {
        const r = rotate3D(vPB[i][0], vPB[i][1], vPB[i][2], rx, ry, rz);
        projPages[i].x = r.x;
        projPages[i].y = r.y;
        projPages[i].z = r.z;
      }

      // Face definitions: [v0, v1, v2, v3, type, tag]
      interface BookFace {
        pts: { x: number; y: number; z: number }[];
        type: 'front_cover' | 'back_cover' | 'pages_right' | 'pages_top' | 'pages_bottom' | 'spine';
        avgZ: number;
        normZ: number;
      }

      const faces: BookFace[] = [];

      // Helper to push face
      const addFace = (pts: { x: number; y: number; z: number }[], type: BookFace['type']) => {
        const avgZ = (pts[0].z + pts[1].z + pts[2].z + pts[3].z) / 4;
        const ux = pts[1].x - pts[0].x;
        const uy = pts[1].y - pts[0].y;
        const vx = pts[2].x - pts[0].x;
        const vy = pts[2].y - pts[0].y;
        const crossZ = ux * vy - uy * vx;
        faces.push({ pts, type, avgZ, normZ: crossZ });
      };

      // Front Cover Face
      addFace([projCoverFront[0], projCoverFront[1], projCoverFront[2], projCoverFront[3]], 'front_cover');
      // Back Cover Face
      addFace([projCoverBack[1], projCoverBack[0], projCoverBack[3], projCoverBack[2]], 'back_cover');
      // Page Right Edge Face
      addFace([projPages[1], projPages[5], projPages[6], projPages[2]], 'pages_right');
      // Page Top Edge Face
      addFace([projPages[0], projPages[1], projPages[5], projPages[4]], 'pages_top');
      // Page Bottom Edge Face
      addFace([projPages[3], projPages[2], projPages[6], projPages[7]], 'pages_bottom');
      // Spine Left Face
      addFace([projCoverBack[0], projCoverFront[0], projCoverFront[3], projCoverBack[3]], 'spine');

      // Sort faces back to front (Painter's Algorithm)
      faces.sort((a, b) => a.avgZ - b.avgZ);

      // Render each face
      for (const face of faces) {
        if (face.normZ <= 0) continue; // Backface culling

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(face.pts[0].x, face.pts[0].y);
        ctx.lineTo(face.pts[1].x, face.pts[1].y);
        ctx.lineTo(face.pts[2].x, face.pts[2].y);
        ctx.lineTo(face.pts[3].x, face.pts[3].y);
        ctx.closePath();

        if (face.type === 'front_cover') {
          // Dark Burgundy Leather Texture Gradient
          const fcGrad = ctx.createLinearGradient(face.pts[0].x, face.pts[0].y, face.pts[1].x, face.pts[1].y);
          fcGrad.addColorStop(0, '#26060C');
          fcGrad.addColorStop(0.3, '#3A0712');
          fcGrad.addColorStop(0.65, '#5A0B1C');
          fcGrad.addColorStop(1, '#26060C');
          ctx.fillStyle = fcGrad;
          ctx.fill();

          // Gold Border Filigree
          ctx.strokeStyle = '#D9A62E';
          ctx.lineWidth = 1.3;
          ctx.stroke();

          // Custom Embossed Cover Artwork
          drawEmbossedMathematicsCover(ctx, face.pts, hw, hh, time);
        } else if (face.type === 'back_cover') {
          const bcGrad = ctx.createLinearGradient(face.pts[0].x, face.pts[0].y, face.pts[1].x, face.pts[1].y);
          bcGrad.addColorStop(0, '#1E0509');
          bcGrad.addColorStop(0.5, '#32060F');
          bcGrad.addColorStop(1, '#1E0509');
          ctx.fillStyle = bcGrad;
          ctx.fill();
          ctx.strokeStyle = '#B3821E';
          ctx.lineWidth = 1.0;
          ctx.stroke();
        } else if (face.type === 'spine') {
          // Curved Burgundy Spine with Raised Gold Ribs
          const spGrad = ctx.createLinearGradient(face.pts[0].x, face.pts[0].y, face.pts[1].x, face.pts[1].y);
          spGrad.addColorStop(0, '#1E0509');
          spGrad.addColorStop(0.3, '#420815');
          spGrad.addColorStop(0.7, '#5A0B1C');
          spGrad.addColorStop(1, '#26060C');
          ctx.fillStyle = spGrad;
          ctx.fill();

          // 4 Raised Gold Spine Ribs
          for (let r = 1; r <= 4; r++) {
            const t = r / 5;
            const rx1 = face.pts[0].x + (face.pts[3].x - face.pts[0].x) * t;
            const ry1 = face.pts[0].y + (face.pts[3].y - face.pts[0].y) * t;
            const rx2 = face.pts[1].x + (face.pts[2].x - face.pts[1].x) * t;
            const ry2 = face.pts[1].y + (face.pts[2].y - face.pts[1].y) * t;
            ctx.beginPath();
            ctx.moveTo(rx1, ry1);
            ctx.lineTo(rx2, ry2);
            ctx.strokeStyle = '#F3CC70';
            ctx.lineWidth = 1.6;
            ctx.stroke();
          }

          // Gold Title Along Spine
          ctx.save();
          const spCenterX = (face.pts[0].x + face.pts[1].x + face.pts[2].x + face.pts[3].x) / 4;
          const spCenterY = (face.pts[0].y + face.pts[1].y + face.pts[2].y + face.pts[3].y) / 4;
          ctx.translate(spCenterX, spCenterY);
          const angle = Math.atan2(face.pts[3].y - face.pts[0].y, face.pts[3].x - face.pts[0].x);
          ctx.rotate(angle);
          ctx.fillStyle = '#FFE29A';
          ctx.font = `bold ${Math.round(8 * mobileScale)}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.letterSpacing = '2px';
          ctx.fillText('MATHEMATICS', 0, 0);
          ctx.restore();
        } else {
          // Page Edges (Ivory stratified paper with gold foil gilding)
          const pgGrad = ctx.createLinearGradient(face.pts[0].x, face.pts[0].y, face.pts[1].x, face.pts[1].y);
          pgGrad.addColorStop(0, '#EFE8DC');
          pgGrad.addColorStop(0.35, '#F9F5EC');
          pgGrad.addColorStop(0.7, '#DED3C1');
          pgGrad.addColorStop(1, '#C7B9A3');
          ctx.fillStyle = pgGrad;
          ctx.fill();

          // Subtle stratified page lines
          ctx.strokeStyle = 'rgba(150, 130, 110, 0.25)';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }

        ctx.restore();
      }

      // Silk Gold Ribbon Bookmark
      const btmX = (projPages[2].x + projPages[3].x) / 2;
      const btmY = (projPages[2].y + projPages[3].y) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(btmX, btmY);
      const cp1X = btmX + 8 * Math.sin(time * 1.5);
      const cp1Y = btmY + 22;
      const cp2X = btmX - 10 * Math.sin(time * 1.3);
      const cp2Y = btmY + 38;
      const endX = btmX + 4 * Math.sin(time * 1.2);
      const endY = btmY + 54;
      ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
      ctx.strokeStyle = '#D9A62E';
      ctx.lineWidth = 3.2;
      ctx.stroke();
      ctx.strokeStyle = '#FFE29A';
      ctx.lineWidth = 1.0;
      ctx.stroke();
      ctx.restore();

      ctx.restore();

      // -----------------------------------------------------------------------
      // 6. RENDER FRONT HALF OF GRAND INSCRIBED ORBITAL RING (IN FRONT OF BOOK)
      // -----------------------------------------------------------------------
      ctx.save();
      ctx.translate(centerX, centerY + floatY * 0.5);
      drawGrandInscribedRing(ctx, ringRadius, ringTiltX, ringRotY, 'front');
      drawNestedTiltedRing(ctx, 92, -0.38, -time * 0.07, 'front');
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    // -------------------------------------------------------------------------
    // HELPER 3D SHAPES & ARTWORK FUNCTIONS
    // -------------------------------------------------------------------------

    function drawGrandInscribedRing(c: CanvasRenderingContext2D, radius: number, tiltX: number, rotY: number, half: 'back' | 'front') {
      const segments = 60;
      const startSeg = half === 'back' ? 0 : Math.round(segments / 2);
      const endSeg = half === 'back' ? Math.round(segments / 2) : segments;

      c.save();
      c.beginPath();
      let first = true;
      for (let s = startSeg; s <= endSeg; s++) {
        const theta = (s / segments) * Math.PI * 2 + rotY;
        const px = Math.cos(theta) * radius;
        const py = 0;
        const pz = Math.sin(theta) * radius;

        const cy = py * Math.cos(tiltX) - pz * Math.sin(tiltX);
        const cz = py * Math.sin(tiltX) + pz * Math.cos(tiltX);

        if (first) {
          c.moveTo(px, cy);
          first = false;
        } else {
          c.lineTo(px, cy);
        }
      }
      c.strokeStyle = half === 'front' ? 'rgba(231, 184, 63, 0.85)' : 'rgba(217, 166, 46, 0.45)';
      c.lineWidth = half === 'front' ? 1.8 : 1.2;
      c.stroke();
      c.restore();
    }

    function drawNestedTiltedRing(c: CanvasRenderingContext2D, radius: number, tiltX: number, rotY: number, half: 'back' | 'front') {
      const segments = 48;
      const startSeg = half === 'back' ? 0 : Math.round(segments / 2);
      const endSeg = half === 'back' ? Math.round(segments / 2) : segments;

      c.save();
      c.beginPath();
      let first = true;
      for (let s = startSeg; s <= endSeg; s++) {
        const theta = (s / segments) * Math.PI * 2 + rotY;
        const px = Math.cos(theta) * radius;
        const py = 0;
        const pz = Math.sin(theta) * radius;
        const cy = py * Math.cos(tiltX) - pz * Math.sin(tiltX);
        if (first) {
          c.moveTo(px, cy);
          first = false;
        } else {
          c.lineTo(px, cy);
        }
      }
      c.strokeStyle = half === 'front' ? 'rgba(255, 226, 154, 0.70)' : 'rgba(180, 140, 50, 0.30)';
      c.lineWidth = 1.0;
      c.stroke();
      c.restore();
    }

    function drawGlossyGoldSphere(c: CanvasRenderingContext2D, sx: number, sy: number, radius: number) {
      c.save();
      const grad = c.createRadialGradient(sx - radius * 0.35, sy - radius * 0.35, radius * 0.08, sx, sy, radius);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.2, '#FFE29A');
      grad.addColorStop(0.55, '#E7B83F');
      grad.addColorStop(0.85, '#7A2210');
      grad.addColorStop(1, '#1A060A');
      c.fillStyle = grad;
      c.beginPath();
      c.arc(sx, sy, radius, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      c.lineWidth = 0.5;
      c.stroke();
      c.restore();
    }

    function drawXYZCoordinateSculpture(c: CanvasRenderingContext2D, sx: number, sy: number, size: number, t: number) {
      c.save();
      c.translate(sx, sy);
      c.strokeStyle = '#D9A62E';
      c.lineWidth = 1.3;

      // X Axis
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(size, -size * 0.2);
      c.stroke();

      // Y Axis
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(0, -size);
      c.stroke();

      // Z Axis
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(-size * 0.7, size * 0.6);
      c.stroke();

      // Dynamic Intersecting Golden Vector Arrow
      const vecLen = size * 1.1;
      const vAngle = -0.75 + Math.sin(t * 0.8) * 0.15;
      const vx = Math.cos(vAngle) * vecLen;
      const vy = Math.sin(vAngle) * vecLen;
      c.strokeStyle = '#FFE29A';
      c.lineWidth = 1.6;
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(vx, vy);
      c.stroke();

      // Arrowhead
      c.fillStyle = '#FFE29A';
      c.beginPath();
      c.arc(vx, vy, 2.2, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }

    function drawVolumetricParabola(c: CanvasRenderingContext2D, sx: number, sy: number, size: number, phase: number) {
      c.save();
      c.translate(sx, sy);
      c.strokeStyle = 'rgba(231, 184, 63, 0.75)';
      c.lineWidth = 1.2;
      c.beginPath();
      for (let x = -size; x <= size; x += 2) {
        const y = (x * x) / (size * 1.2) - size * 0.4;
        if (x === -size) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.stroke();
      c.restore();
    }

    function drawCoordinateSineWave(c: CanvasRenderingContext2D, sx: number, sy: number, t: number) {
      c.save();
      c.translate(sx, sy);
      c.strokeStyle = 'rgba(243, 204, 112, 0.80)';
      c.lineWidth = 1.3;
      c.beginPath();
      for (let x = -28; x <= 28; x += 2) {
        const y = Math.sin((x / 14) + t * 0.8) * 10;
        if (x === -28) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.stroke();

      // Node point markers
      for (let n = -20; n <= 20; n += 20) {
        const ny = Math.sin((n / 14) + t * 0.8) * 10;
        c.fillStyle = '#FFE29A';
        c.beginPath();
        c.arc(n, ny, 2.0, 0, Math.PI * 2);
        c.fill();
      }
      c.restore();
    }

    function drawSaddleMesh(c: CanvasRenderingContext2D, sx: number, sy: number, size: number, t: number) {
      c.save();
      c.translate(sx, sy);
      c.strokeStyle = 'rgba(217, 166, 46, 0.50)';
      c.lineWidth = 0.8;
      const step = 6;
      for (let u = -size; u <= size; u += step) {
        c.beginPath();
        for (let v = -size; v <= size; v += step) {
          const z = ((u * u - v * v) / (size * 2)) * 0.4;
          const px = u * 0.6 + v * 0.3;
          const py = v * 0.5 - z;
          if (v === -size) c.moveTo(px, py);
          else c.lineTo(px, py);
        }
        c.stroke();
      }
      c.restore();
    }

    function drawDoubleHelix(c: CanvasRenderingContext2D, sx: number, sy: number, size: number, t: number) {
      c.save();
      c.translate(sx, sy);
      c.strokeStyle = 'rgba(231, 184, 63, 0.65)';
      c.lineWidth = 1.1;
      const hPoints = 14;
      for (let i = 0; i < hPoints; i++) {
        const y = (i - hPoints / 2) * 5;
        const angle = i * 0.55 + t * 0.8;
        const x1 = Math.cos(angle) * 11;
        const x2 = -x1;
        // Rung
        c.beginPath();
        c.moveTo(x1, y);
        c.lineTo(x2, y);
        c.strokeStyle = 'rgba(217, 166, 46, 0.35)';
        c.stroke();

        // Node spheres
        c.fillStyle = '#FFE29A';
        c.beginPath();
        c.arc(x1, y, 1.6, 0, Math.PI * 2);
        c.arc(x2, y, 1.6, 0, Math.PI * 2);
        c.fill();
      }
      c.restore();
    }

    function drawWireframeIcosahedron(c: CanvasRenderingContext2D, sx: number, sy: number, radius: number, rot: number) {
      c.save();
      c.translate(sx, sy);
      c.strokeStyle = 'rgba(243, 204, 112, 0.60)';
      c.lineWidth = 0.9;
      c.beginPath();
      c.arc(0, 0, radius, 0, Math.PI * 2);
      c.stroke();

      // Inner polygon
      c.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + rot;
        const x = Math.cos(a) * radius;
        const y = Math.sin(a) * radius;
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.closePath();
      c.stroke();
      c.restore();
    }

    function drawWireframePyramid(c: CanvasRenderingContext2D, sx: number, sy: number, size: number, t: number) {
      c.save();
      c.translate(sx, sy);
      c.strokeStyle = 'rgba(217, 166, 46, 0.55)';
      c.lineWidth = 0.9;
      // Apex
      const ax = 0;
      const ay = -size * 0.9;
      // Base points
      const b1 = { x: -size * 0.7, y: size * 0.4 };
      const b2 = { x: size * 0.7, y: size * 0.4 };
      const b3 = { x: 0, y: size * 0.7 };

      c.beginPath();
      c.moveTo(b1.x, b1.y);
      c.lineTo(b2.x, b2.y);
      c.lineTo(b3.x, b3.y);
      c.closePath();
      c.stroke();

      c.beginPath();
      c.moveTo(ax, ay);
      c.lineTo(b1.x, b1.y);
      c.moveTo(ax, ay);
      c.lineTo(b2.x, b2.y);
      c.moveTo(ax, ay);
      c.lineTo(b3.x, b3.y);
      c.stroke();
      c.restore();
    }

    function drawMathematicalManuscript(c: CanvasRenderingContext2D, px: number, py: number, w: number, h: number, rot: number, type: 1 | 2) {
      c.save();
      c.translate(px, py);
      c.rotate(rot);
      c.fillStyle = '#F8F4EA';
      c.fillRect(-w / 2, -h / 2, w, h);
      c.strokeStyle = '#D9A62E';
      c.lineWidth = 0.8;
      c.strokeRect(-w / 2, -h / 2, w, h);

      // Sketch markings
      c.strokeStyle = 'rgba(90, 11, 28, 0.45)';
      c.lineWidth = 0.7;
      if (type === 1) {
        // Calculus integral sketch
        c.beginPath();
        c.moveTo(-w / 2 + 5, -h / 2 + 8);
        c.lineTo(-w / 2 + 18, -h / 2 + 8);
        c.stroke();
        c.fillStyle = '#3A0712';
        c.font = '8px serif';
        c.fillText('∫ f(x)dx', -w / 2 + 5, h / 2 - 6);
      } else {
        // Right triangle diagram
        c.beginPath();
        c.moveTo(-w / 2 + 6, h / 2 - 6);
        c.lineTo(w / 2 - 8, h / 2 - 6);
        c.lineTo(-w / 2 + 6, -h / 2 + 8);
        c.closePath();
        c.stroke();
      }
      c.restore();
    }

    function drawGlowingFormula(c: CanvasRenderingContext2D, sx: number, sy: number, text: string, size: number, color: string) {
      c.save();
      c.font = `bold ${size}px serif`;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillStyle = color;
      c.shadowColor = color;
      c.shadowBlur = 10;
      c.fillText(text, sx, sy);
      c.restore();
    }

    function drawEmbossedMathematicsCover(c: CanvasRenderingContext2D, pts: { x: number; y: number; z: number }[], hw: number, hh: number, t: number) {
      c.save();
      const originX = (pts[0].x + pts[1].x + pts[2].x + pts[3].x) / 4;
      const originY = (pts[0].y + pts[1].y + pts[2].y + pts[3].y) / 4;
      c.translate(originX, originY);

      // Crown emblem
      c.fillStyle = '#FFE29A';
      c.font = '14px serif';
      c.textAlign = 'center';
      c.fillText('♔', 0, -hh * 0.65);

      // LUMOS wordmark
      c.fillStyle = '#FFE29A';
      c.font = 'bold 9px sans-serif';
      c.letterSpacing = '3px';
      c.fillText('LUMOS', 0, -hh * 0.48);

      // MATHEMATICS hero title
      c.fillStyle = '#F3CC70';
      c.font = 'bold 15px serif';
      c.letterSpacing = '1px';
      c.fillText('MATHEMATICS', 0, -hh * 0.30);

      // Raised parabolic curve with coordinate axes
      c.strokeStyle = '#D9A62E';
      c.lineWidth = 1.0;
      c.beginPath();
      c.moveTo(-hw * 0.55, 0);
      c.lineTo(hw * 0.55, 0);
      c.moveTo(0, -hh * 0.15);
      c.lineTo(0, hh * 0.25);
      c.stroke();

      // Parabola arc
      c.strokeStyle = '#FFE29A';
      c.lineWidth = 1.2;
      c.beginPath();
      for (let x = -24; x <= 24; x += 2) {
        const y = (x * x) / 28 - 6;
        if (x === -24) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.stroke();

      // Enclosing golden celestial circle
      c.strokeStyle = 'rgba(217, 166, 46, 0.70)';
      c.lineWidth = 0.8;
      c.beginPath();
      c.arc(0, 0, 32, 0, Math.PI * 2);
      c.stroke();

      // Sub formulas on book bottom
      c.fillStyle = '#FFE29A';
      c.font = 'italic 8px serif';
      c.fillText('π  •  ∫  •  √  •  x²', 0, hh * 0.45);

      c.font = '7px serif';
      c.fillText('f(x) = ax² + bx + c', 0, hh * 0.62);

      c.restore();
    }

    const startLoop = () => {
      isVisible = true;
      if (!animFrameRef.current) {
        lastTime = performance.now();
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    const stopLoop = () => {
      isVisible = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };

    const unobserve = createVisibilityObserver(canvas, startLoop, stopLoop, 0.05);

    return () => {
      stopLoop();
      unobserve();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return (
    <section
      id="courses"
      className="relative w-full overflow-hidden bg-[#050304] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 text-[#F8F4EA]"
    >
      {/* -----------------------------------------------------------------------
          SUBTLE FLOATING MATHEMATICAL BACKGROUND (z-0, slow 18-30s ambient)
          ----------------------------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        {/* Ambient Radial Vignette & Lights */}
        <div className="absolute -top-32 right-12 w-[600px] h-[600px] rounded-full bg-radial from-[#D9A62E]/10 via-[#3A0712]/15 to-transparent blur-3xl opacity-40" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-radial from-[#5A0B1C]/20 to-transparent blur-3xl opacity-35" />

        {/* Floating Formulas (Low opacity 0.12-0.22, slow drift) */}
        <div className="absolute top-[12%] left-[6%] text-3xl font-serif text-[#D9A62E]/20">
          π
        </div>
        <div className="absolute top-[35%] right-[4%] text-2xl font-serif text-[#FFE29A]/15">
          x²
        </div>
        <div className="absolute bottom-[28%] left-[8%] text-base font-serif text-[#F8F4EA]/15">
          a² + b² = c²
        </div>
        <div className="absolute top-[68%] right-[7%] text-xl font-serif text-[#D9A62E]/20">
          f(x)
        </div>
        <div className="absolute bottom-[10%] right-[16%] text-3xl font-serif text-[#F3CC70]/15">
          ∫
        </div>
        <div className="absolute top-[22%] right-[32%] text-2xl font-serif text-[#D9A62E]/15">
          ∑
        </div>
      </div>

      {/* -----------------------------------------------------------------------
          MAIN CONTAINER
          ----------------------------------------------------------------------- */}
      <div className="max-w-[1380px] mx-auto relative z-10">
        {/* =====================================================================
            1. HERO SECTION (Dual Column: Left ~48% / Right ~52%)
            ===================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16 sm:mb-20 lg:mb-24">
          {/* LEFT COLUMN: Editorial Typography & CTAs (~48%) */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6 text-left">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3A0712]/50 border border-[#D9A62E]/30 text-xs font-semibold text-[#F3CC70] backdrop-blur-md shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#E7B83F]" />
              <span>✦ Kelajak bilim bilan boshlanadi</span>
            </div>

            {/* Large Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-serif font-black tracking-tight leading-[1.15] text-[#F8F4EA]">
              Matematika kurslari <br />
              <span className="bg-gradient-to-r from-[#FFE29A] via-[#F3CC70] to-[#D9A62E] bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(217,166,46,0.3)]">
                bilan o‘zingizni kashf eting
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#D8D0C5] leading-relaxed max-w-[560px] font-sans font-normal">
              Matematika — mantiqiy fikrlash, muammoni hal qilish va kelajakdagi katta imkoniyatlar eshigini ochadigan eng muhim fanlardan biri.
            </p>

            {/* 3 Features with Gold Icons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {[
                'Tajribali ustozlar',
                'Zamonaviy metodika',
                'Real natijalar',
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-medium text-[#F8F4EA]">
                  <span className="h-4 w-4 rounded-full border border-[#D9A62E] flex items-center justify-center text-[10px] text-[#F3CC70] shrink-0 bg-[#3A0712]/40">
                    ✓
                  </span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* 2 Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* PRIMARY: Kurslarni ko‘rish */}
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('course-selector');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="h-11 sm:h-12 px-7 rounded-full font-bold text-xs sm:text-sm text-[#050304] bg-gradient-to-r from-[#D9A62E] via-[#E7B83F] to-[#D9A62E] hover:brightness-110 shadow-[0_4px_20px_rgba(217,166,46,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 cursor-pointer border border-[#FFE29A]/40 select-none"
              >
                <span>Kurslarni ko‘rish</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* SECONDARY: Batafsil ma’lumot */}
              <button
                type="button"
                onClick={() => onOpenDetails(activeCourseObject)}
                className="h-11 sm:h-12 px-7 rounded-full font-semibold text-xs sm:text-sm text-[#F8F4EA] border border-[#D9A62E]/40 hover:bg-[#D9A62E]/10 hover:border-[#F3CC70] hover:text-[#FFE29A] transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md select-none"
              >
                <span>Batafsil ma’lumot</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Showroom 3D Mathematics Book World (~52%) */}
          <div className="lg:col-span-6 xl:col-span-6 relative w-full h-[420px] sm:h-[460px] lg:h-[500px] xl:h-[520px] flex items-center justify-center select-none">
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="w-full h-full block select-none relative z-10 cursor-grab active:cursor-grabbing"
              style={{ userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'pan-y' }}
              title="LUMOS 3D Matematika Koinoti (Burish uchun bosing va suring)"
            />
          </div>
        </div>

        {/* =====================================================================
            2. COURSE PRICE SELECTOR & INTERACTIVE GRADE SELECTOR
            ===================================================================== */}
        <div id="course-selector" className="pt-8 sm:pt-12 scroll-mt-24">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3A0712]/50 border border-[#D9A62E]/30 text-[11px] font-bold uppercase tracking-widest text-[#F3CC70]">
              <Award className="h-3.5 w-3.5 text-[#E7B83F]" />
              <span>O‘quv dasturlari va narxlar</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-serif font-black text-[#F8F4EA] tracking-tight">
              Sinfinizni tanlang
            </h2>
            <p className="text-xs sm:text-sm text-[#9D958C] leading-relaxed max-w-lg mx-auto">
              Har bir yosh toifasi va sinf uchun chuqurlashtirilgan, natijaga kafolatlangan professional metodika
            </p>

            {/* Interactive Tab Selectors: [ 1–2 ] [ 3–4 ] [ 5–7 ] [ 8–9 ] */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-4">
              {MATH_GRADE_TIERS.map((tier) => {
                const isSelected = selectedGradeId === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedGradeId(tier.id)}
                    className={`px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#D9A62E] via-[#E7B83F] to-[#D9A62E] text-[#050304] shadow-[0_0_20px_rgba(231,184,63,0.45)] scale-105 border border-[#FFE29A]'
                        : 'bg-[#3A0712]/50 text-[#D8D0C5] border border-[#D9A62E]/25 hover:border-[#E7B83F]/60 hover:text-[#F8F4EA]'
                    }`}
                  >
                    {tier.gradeRange} sinflar
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {MATH_GRADE_TIERS.map((tier) => {
              const isSelected = selectedGradeId === tier.id;
              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedGradeId(tier.id)}
                  className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer select-none ${
                    isSelected
                      ? 'bg-[rgba(58,7,18,0.85)] border-2 border-[#E7B83F] shadow-[0_0_30px_rgba(231,184,63,0.32)] scale-[1.02] z-10'
                      : 'bg-[rgba(40,8,15,0.65)] border border-[rgba(220,170,50,0.25)] opacity-85 hover:opacity-100 hover:-translate-y-1.5 hover:border-[#E7B83F]/50'
                  } backdrop-blur-xl`}
                >
                  {/* Badge top-right */}
                  {tier.badge && (
                    <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#D9A62E] to-[#E7B83F] text-[#050304] shadow-sm">
                      {tier.badge}
                    </span>
                  )}

                  <div>
                    {/* Top Icon & Range */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-11 w-11 rounded-2xl bg-[#D9A62E]/10 border border-[#D9A62E]/30 flex items-center justify-center text-[#F3CC70]">
                        {tier.iconName === 'calculator' && <Calculator className="h-5 w-5" />}
                        {tier.iconName === 'compass' && <Compass className="h-5 w-5" />}
                        {tier.iconName === 'ruler' && <Ruler className="h-5 w-5" />}
                        {tier.iconName === 'award' && <Award className="h-5 w-5" />}
                      </div>

                      <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                        isSelected
                          ? 'border-[#E7B83F] text-[#FFE29A] bg-[#5A0B1C]/50'
                          : 'border-white/10 text-[#9D958C] bg-white/5'
                      }`}>
                        {tier.gradeRange} sinf
                      </span>
                    </div>

                    {/* Title & Short Description */}
                    <h3 className="text-xl sm:text-2xl font-serif font-black text-[#F8F4EA] mb-1">
                      {tier.title}
                    </h3>
                    <p className="text-xs text-[#9D958C] mb-5 leading-relaxed">
                      {tier.subtitle}
                    </p>

                    {/* Topics with Gold Checkmarks */}
                    <div className="space-y-2.5 mb-6">
                      {tier.topics.map((top, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#D8D0C5]">
                          <CheckCircle2 className="h-4 w-4 text-[#E7B83F] shrink-0 mt-0.5" />
                          <span className="leading-snug">{top}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom: Price & Button */}
                  <div className="pt-4 border-t border-[#D9A62E]/15">
                    <div className="mb-4">
                      <span className="text-[10px] uppercase font-bold text-[#9D958C] tracking-wider block">
                        Oylik to‘lov
                      </span>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-2xl sm:text-3xl font-serif font-black text-[#F3CC70]">
                          {tier.priceFormatted}
                        </span>
                        <span className="text-xs font-semibold text-[#D8D0C5]">
                          so‘m / oy
                        </span>
                      </div>
                    </div>

                    {/* Action button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenRegister(`Matematika (${tier.title})`);
                      }}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#D9A62E] via-[#E7B83F] to-[#D9A62E] text-[#050304] shadow-[0_4px_16px_rgba(217,166,46,0.35)] hover:brightness-110'
                          : 'bg-white/5 text-[#F8F4EA] border border-[#D9A62E]/30 hover:bg-[#D9A62E]/15 hover:border-[#E7B83F]'
                      }`}
                    >
                      <span>Ro‘yxatdan o‘tish</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Active Grade Summary Capsule Bar */}
          <div className="mt-8 rounded-2xl bg-[rgba(58,7,18,0.7)] border border-[#D9A62E]/30 backdrop-blur-xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#D8D0C5]">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#D9A62E]/10 border border-[#D9A62E]/30 flex items-center justify-center text-[#F3CC70]">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#9D958C] block">Davomiyligi</span>
                  <span className="font-bold text-[#F8F4EA]">{activeGrade.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#D9A62E]/10 border border-[#D9A62E]/30 flex items-center justify-center text-[#F3CC70]">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#9D958C] block">Dars grafigi</span>
                  <span className="font-bold text-[#F8F4EA]">{activeGrade.schedule}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#D9A62E]/10 border border-[#D9A62E]/30 flex items-center justify-center text-[#F3CC70]">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#9D958C] block">Ustoz</span>
                  <span className="font-bold text-[#F8F4EA]">{activeGrade.instructor}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={() => onOpenDetails(activeCourseObject)}
                className="px-5 py-2.5 rounded-full border border-[#D9A62E]/40 bg-[#120508]/80 hover:bg-[#D9A62E]/15 hover:border-[#F3CC70] text-xs font-bold text-white transition-all flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="h-3.5 w-3.5 text-[#E7B83F]" />
                <span>Batafsil dastur</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenRegister(`Matematika (${activeGrade.title})`)}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D9A62E] via-[#E7B83F] to-[#D9A62E] text-xs font-black text-[#050304] hover:brightness-110 shadow-[0_4px_18px_rgba(217,166,46,0.35)] transition-all flex items-center gap-1.5 cursor-pointer border border-[#FFE29A]/40"
              >
                <span>Guruhga yozilish</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Diagnostic Test Prompt Link */}
          {onOpenDiagnostic && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={onOpenDiagnostic}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#F3CC70] hover:text-[#FFE29A] transition-colors group cursor-pointer"
              >
                <span className="h-5 w-5 rounded-full border border-[#E7B83F] flex items-center justify-center text-xs font-serif text-[#F3CC70] group-hover:border-[#FFE29A]">
                  i
                </span>
                <span>Qaysi kurs sizga mos kelishini aniqlash uchun bepul diagnostik test topshiring</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 text-[#E7B83F]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
