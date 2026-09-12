import React, { useEffect, useRef } from 'react';

interface MathematicalUniverse3DProps {
  className?: string;
  isHomeTransitioning?: boolean;
}

interface OrbitalSystem {
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
  angle: number;
  speed: number;
  tilt: number;
  color: string;
  nodes: { offset: number; size: number; glow: boolean }[];
}

interface MathFormula {
  text: string;
  baseXRatio: number;
  baseYRatio: number;
  floatSpeed: number;
  floatAmplitude: number;
  phase: number;
  opacity: number;
  fontSize: number;
  fontFamily: string;
}

interface GoldParticle {
  x: number;
  y: number;
  z: number; // 0 (far) to 1 (near)
  radius: number;
  speedX: number;
  speedY: number;
  baseOpacity: number;
  pulseSpeed: number;
  phase: number;
}

export const MathematicalUniverse3D: React.FC<MathematicalUniverse3DProps> = ({
  className = '',
  isHomeTransitioning = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 });
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      if (!canvas) return;
      width = canvas.width = (canvas.offsetWidth || window.innerWidth) * dpr;
      height = canvas.height = (canvas.offsetHeight || window.innerHeight) * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Passive mouse tracking (0 React re-renders!)
    const handleMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouseRef.current.targetX = (e.clientX - halfW) / halfW; // -1 to 1
      mouseRef.current.targetY = (e.clientY - halfH) / halfH; // -1 to 1
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // -------------------------------------------------------------------------
    // LAYER 2: MATHEMATICAL ORBITAL SYSTEMS & FORMULAS
    // -------------------------------------------------------------------------
    const orbitals: OrbitalSystem[] = [
      {
        centerX: 0.72,
        centerY: 0.42,
        radiusX: 190,
        radiusY: 105,
        angle: 0,
        speed: 0.0035,
        tilt: -0.35,
        color: 'rgba(217, 169, 58, 0.18)',
        nodes: [
          { offset: 0, size: 2.8, glow: true },
          { offset: Math.PI, size: 2.2, glow: false },
        ],
      },
      {
        centerX: 0.72,
        centerY: 0.42,
        radiusX: 280,
        radiusY: 140,
        angle: Math.PI / 3,
        speed: -0.0022,
        tilt: 0.25,
        color: 'rgba(217, 169, 58, 0.12)',
        nodes: [
          { offset: Math.PI * 0.5, size: 2.5, glow: true },
          { offset: Math.PI * 1.5, size: 1.8, glow: false },
        ],
      },
      {
        centerX: 0.22,
        centerY: 0.65,
        radiusX: 130,
        radiusY: 75,
        angle: Math.PI / 4,
        speed: 0.004,
        tilt: 0.45,
        color: 'rgba(217, 169, 58, 0.14)',
        nodes: [
          { offset: Math.PI * 0.2, size: 2.2, glow: true },
        ],
      },
      {
        centerX: 0.82,
        centerY: 0.78,
        radiusX: 150,
        radiusY: 85,
        angle: 0.8,
        speed: -0.003,
        tilt: -0.2,
        color: 'rgba(243, 210, 118, 0.12)',
        nodes: [
          { offset: Math.PI * 0.75, size: 2.4, glow: true },
        ],
      },
    ];

    // Mathematical decorative formulas (Living math cosmos)
    const mathFormulas: MathFormula[] = [
      {
        text: '∑ (1/n²)',
        baseXRatio: 0.12,
        baseYRatio: 0.32,
        floatSpeed: 0.0018,
        floatAmplitude: 8,
        phase: 0,
        opacity: 0.22,
        fontSize: 16,
        fontFamily: 'serif',
      },
      {
        text: 'x² + y² = r²',
        baseXRatio: 0.28,
        baseYRatio: 0.24,
        floatSpeed: 0.0014,
        floatAmplitude: 10,
        phase: 1.2,
        opacity: 0.24,
        fontSize: 15,
        fontFamily: 'serif',
      },
      {
        text: '∫ f(x) dx',
        baseXRatio: 0.86,
        baseYRatio: 0.22,
        floatSpeed: 0.002,
        floatAmplitude: 9,
        phase: 2.4,
        opacity: 0.28,
        fontSize: 18,
        fontFamily: 'serif',
      },
      {
        text: 'A = πr²',
        baseXRatio: 0.62,
        baseYRatio: 0.78,
        floatSpeed: 0.0016,
        floatAmplitude: 7,
        phase: 3.1,
        opacity: 0.22,
        fontSize: 15,
        fontFamily: 'serif',
      },
      {
        text: 'lim (1 + 1/n)ⁿ = e',
        baseXRatio: 0.76,
        baseYRatio: 0.88,
        floatSpeed: 0.0012,
        floatAmplitude: 11,
        phase: 4.2,
        opacity: 0.2,
        fontSize: 14,
        fontFamily: 'serif',
      },
      {
        text: '∇ × E = -∂B/∂t',
        baseXRatio: 0.08,
        baseYRatio: 0.76,
        floatSpeed: 0.0015,
        floatAmplitude: 8,
        phase: 5.0,
        opacity: 0.18,
        fontSize: 13,
        fontFamily: 'monospace',
      },
      {
        text: 'e^{iπ} + 1 = 0',
        baseXRatio: 0.44,
        baseYRatio: 0.86,
        floatSpeed: 0.0022,
        floatAmplitude: 9,
        phase: 0.8,
        opacity: 0.22,
        fontSize: 15,
        fontFamily: 'serif',
      },
    ];

    // -------------------------------------------------------------------------
    // LAYER 3: DEPTH-OF-FIELD GOLD PARTICLES (Few, High Quality)
    // -------------------------------------------------------------------------
    const particleCount = 38;
    const particles: GoldParticle[] = Array.from({ length: particleCount }, () => {
      const z = Math.random(); // 0: far/small, 1: near/larger
      return {
        x: Math.random() * (width / dpr),
        y: Math.random() * (height / dpr),
        z,
        radius: z > 0.75 ? 2.2 : z > 0.4 ? 1.4 : 0.8,
        speedX: (Math.random() - 0.5) * (0.2 + z * 0.25),
        speedY: -Math.random() * (0.25 + z * 0.35) - 0.08,
        baseOpacity: 0.12 + z * 0.48,
        pulseSpeed: 0.012 + Math.random() * 0.015,
        phase: Math.random() * Math.PI * 2,
      };
    });

    let time = 0;

    // -------------------------------------------------------------------------
    // RENDER LOOP (SILKY 60-120 FPS, 0 STATE RE-RENDERS)
    // -------------------------------------------------------------------------
    const render = () => {
      const actualW = width / dpr;
      const actualH = height / dpr;
      ctx.clearRect(0, 0, actualW, actualH);

      // Lerp mouse parallax for ultra-soft inertia
      mouseRef.current.currentX +=
        (mouseRef.current.targetX - mouseRef.current.currentX) * 0.045;
      mouseRef.current.currentY +=
        (mouseRef.current.targetY - mouseRef.current.currentY) * 0.045;

      const parallaxX = mouseRef.current.currentX * 18;
      const parallaxY = mouseRef.current.currentY * 14;

      time += 0.016;

      // -----------------------------------------------------------------------
      // LAYER 1: ATMOSPHERIC BURGUNDY & WARM GOLDEN LIGHT POOLS
      // -----------------------------------------------------------------------
      const rad1 = ctx.createRadialGradient(
        actualW * 0.75 + parallaxX * 0.3,
        actualH * 0.38 + parallaxY * 0.3,
        20,
        actualW * 0.75 + parallaxX * 0.3,
        actualH * 0.38 + parallaxY * 0.3,
        actualW * 0.55
      );
      rad1.addColorStop(0, 'rgba(88, 14, 34, 0.28)');
      rad1.addColorStop(0.45, 'rgba(40, 10, 18, 0.15)');
      rad1.addColorStop(1, 'rgba(8, 6, 7, 0)');
      ctx.fillStyle = rad1;
      ctx.fillRect(0, 0, actualW, actualH);

      const rad2 = ctx.createRadialGradient(
        actualW * 0.7 + parallaxX * 0.5,
        actualH * 0.45 + parallaxY * 0.5,
        10,
        actualW * 0.7 + parallaxX * 0.5,
        actualH * 0.45 + parallaxY * 0.5,
        280
      );
      rad2.addColorStop(0, 'rgba(217, 169, 58, 0.12)');
      rad2.addColorStop(0.5, 'rgba(217, 169, 58, 0.04)');
      rad2.addColorStop(1, 'rgba(8, 6, 7, 0)');
      ctx.fillStyle = rad2;
      ctx.fillRect(0, 0, actualW, actualH);

      // -----------------------------------------------------------------------
      // LAYER 2: LIVING MATHEMATICAL DIAGRAMS & ORBITALS
      // -----------------------------------------------------------------------
      // A. Geometric Triangle in background (very slow rotation)
      const triCenterX = actualW * 0.18 + parallaxX * 0.4;
      const triCenterY = actualH * 0.48 + parallaxY * 0.4;
      const triAngle = time * 0.08;
      const triRadius = 45;

      ctx.save();
      ctx.translate(triCenterX, triCenterY);
      ctx.rotate(triAngle);
      ctx.strokeStyle = 'rgba(217, 169, 58, 0.14)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const a = (i * Math.PI * 2) / 3 - Math.PI / 2;
        const tx = Math.cos(a) * triRadius;
        const ty = Math.sin(a) * triRadius;
        if (i === 0) ctx.moveTo(tx, ty);
        else ctx.lineTo(tx, ty);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // B. Coordinate Axis grid snippet in midground
      const axisX = actualW * 0.85 + parallaxX * 0.3;
      const axisY = actualH * 0.7 + parallaxY * 0.3;
      ctx.save();
      ctx.strokeStyle = 'rgba(217, 169, 58, 0.1)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(axisX - 80, axisY);
      ctx.lineTo(axisX + 80, axisY);
      for (let tx = -60; tx <= 60; tx += 20) {
        ctx.moveTo(axisX + tx, axisY - 3);
        ctx.lineTo(axisX + tx, axisY + 3);
      }
      ctx.moveTo(axisX, axisY - 60);
      ctx.lineTo(axisX, axisY + 60);
      for (let ty = -40; ty <= 40; ty += 20) {
        ctx.moveTo(axisX - 3, axisY + ty);
        ctx.lineTo(axisX + 3, axisY + ty);
      }
      ctx.stroke();
      ctx.restore();

      // C. Orbital Systems (Circles with moving points)
      orbitals.forEach((orb) => {
        orb.angle += orb.speed;
        const ox = actualW * orb.centerX + parallaxX * 0.6;
        const oy = actualH * orb.centerY + parallaxY * 0.6;

        ctx.save();
        ctx.translate(ox, oy);
        ctx.rotate(orb.tilt);

        ctx.beginPath();
        ctx.ellipse(0, 0, orb.radiusX, orb.radiusY, 0, 0, Math.PI * 2);
        ctx.strokeStyle = orb.color;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        orb.nodes.forEach((node) => {
          const currentA = orb.angle + node.offset;
          const nx = Math.cos(currentA) * orb.radiusX;
          const ny = Math.sin(currentA) * orb.radiusY;

          ctx.beginPath();
          ctx.arc(nx, ny, node.size, 0, Math.PI * 2);
          ctx.fillStyle = node.glow
            ? '#F3D276'
            : 'rgba(217, 169, 58, 0.8)';
          if (node.glow) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#D9A93A';
          }
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        ctx.restore();
      });

      // D. Living Mathematical Formulas
      mathFormulas.forEach((f) => {
        const floatY = Math.sin(time * f.floatSpeed * 1000 + f.phase) * f.floatAmplitude;
        const fx = actualW * f.baseXRatio + parallaxX * 0.5;
        const fy = actualH * f.baseYRatio + floatY + parallaxY * 0.5;

        ctx.save();
        ctx.font = `italic 600 ${f.fontSize}px ${
          f.fontFamily === 'serif' ? '"Playfair Display", Georgia, serif' : 'monospace'
        }`;
        ctx.fillStyle = `rgba(243, 210, 118, ${f.opacity})`;
        ctx.fillText(f.text, fx, fy);
        ctx.restore();
      });

      // -----------------------------------------------------------------------
      // LAYER 3: DEPTH-OF-FIELD GOLD PARTICLES (Few, Layered)
      // -----------------------------------------------------------------------
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.phase += p.pulseSpeed;

        if (p.y < -15) {
          p.y = actualH + 15;
          p.x = Math.random() * actualW;
        }
        if (p.x < -15) p.x = actualW + 15;
        if (p.x > actualW + 15) p.x = -15;

        const pulse = 0.75 + 0.25 * Math.sin(p.phase);
        const opacity = p.baseOpacity * pulse;

        const depthFactor = 0.3 + p.z * 0.9;
        const px = p.x + parallaxX * depthFactor;
        const py = p.y + parallaxY * depthFactor;

        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);

        if (p.z > 0.7) {
          ctx.fillStyle = `rgba(243, 210, 118, ${opacity})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#D9A93A';
        } else {
          ctx.fillStyle = `rgba(217, 169, 58, ${opacity})`;
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden z-0 transition-opacity duration-700 ${
        isHomeTransitioning ? 'opacity-90 scale-[1.01]' : 'opacity-100 scale-100'
      } ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
