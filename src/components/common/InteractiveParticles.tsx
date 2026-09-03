import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  length: number;
  angle: number;
  color: string;
  alpha: number;
  targetAlpha: number;
}

const COLORS = [
  '#4285F4', // Google Blue
  '#EA4335', // Google Red
  '#FBBC05', // Google Yellow
  '#34A853', // Google Green
  '#6366F1', // Indigo
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F43F5E', // Rose
];

export const InteractiveParticles: React.FC<{
  className?: string;
  particleCount?: number;
}> = ({ className = '', particleCount = 130 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 160,
      isHovered: false,
    };

    const particles: Particle[] = [];

    // Initialize particles in a circular/elliptical orbital grid
    const initParticles = () => {
      particles.length = 0;
      const centerX = width / 2;
      const centerY = height / 2;

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 100 + Math.random() * (Math.min(width, height) * 0.45);
        const x = centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 100;
        const y = centerY + Math.sin(angle) * (radius * 0.75) + (Math.random() - 0.5) * 80;

        particles.push({
          x,
          y,
          originX: x,
          originY: y,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          size: Math.random() * 2 + 1.5,
          length: Math.random() * 8 + 4,
          angle: Math.random() * Math.PI * 2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          alpha: Math.random() * 0.6 + 0.3,
          targetAlpha: Math.random() * 0.6 + 0.3,
        });
      }
    };

    initParticles();

    // Mouse movement listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.isHovered = false;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    // Main 60fps render loop
    let time = 0;
    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Harmonic organic idle drift
        const idleForceX = Math.sin(time + i * 0.1) * 0.4;
        const idleForceY = Math.cos(time + i * 0.12) * 0.4;

        // Antigravity & Cursor Interaction Physics
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius && mouse.isHovered) {
          const force = (mouse.radius - distance) / mouse.radius;
          const pushAngle = Math.atan2(dy, dx);
          
          // Vortex swirl + gentle repulsion
          p.vx -= Math.cos(pushAngle + Math.PI * 0.35) * force * 2.2;
          p.vy -= Math.sin(pushAngle + Math.PI * 0.35) * force * 2.2;
          p.angle = pushAngle + Math.PI * 0.5;
          p.alpha = Math.min(1, p.alpha + 0.05);
        } else {
          // Smooth return towards origin with spring damping
          const returnDx = p.originX - p.x;
          const returnDy = p.originY - p.y;
          p.vx += returnDx * 0.015 + idleForceX;
          p.vy += returnDy * 0.015 + idleForceY;
          p.angle += 0.02;
          p.alpha += (p.targetAlpha - p.alpha) * 0.03;
        }

        // Apply friction
        p.vx *= 0.92;
        p.vy *= 0.92;

        p.x += p.vx;
        p.y += p.vy;

        // Draw dynamic oriented capsule / particle dash (Google Antigravity style)
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.roundRect(-p.length / 2, -p.size / 2, p.length, p.size, p.size / 2);
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full ${className}`}
    />
  );
};
