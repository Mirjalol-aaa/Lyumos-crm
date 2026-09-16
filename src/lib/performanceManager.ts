// =============================================================================
// LUMOS PERFORMANCE MANAGER: ADAPTIVE 4-TIER DEVICE ENGINE
// =============================================================================

export type PerformanceTier = 'ULTRA_LOW' | 'LOW' | 'MEDIUM' | 'HIGH';

export interface PerformanceConfig {
  tier: PerformanceTier;
  dpr: number;
  maxEntities: number;
  enableShadows: boolean;
  enableGlow: boolean;
  enableComplexMeshes: boolean;
  dustCount: number;
  fpsTarget: number;
}

/**
 * Detects initial device performance capability based on hardware concurrency,
 * device memory, screen size, and touch capabilities.
 */
export function detectDeviceTier(): PerformanceTier {
  if (typeof window === 'undefined') return 'MEDIUM';

  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as any).deviceMemory || 4; // in GB if supported

  // Check for reduced motion preference
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'LOW';
  }

  // Mobile device classification
  if (isMobile) {
    if (cores <= 4 || memory <= 2) return 'ULTRA_LOW';
    if (cores <= 6 || memory <= 3) return 'LOW';
    if (cores <= 8 && memory <= 4) return 'MEDIUM';
    return 'HIGH';
  }

  // Tablet classification
  if (isTablet) {
    if (cores <= 4 || memory <= 3) return 'LOW';
    if (cores <= 6) return 'MEDIUM';
    return 'HIGH';
  }

  // Desktop / Laptop classification
  if (cores <= 4 || memory <= 4) return 'LOW';
  if (cores <= 6) return 'MEDIUM';
  return 'HIGH';
}

/**
 * Returns strictly clamped DPR according to active tier to prevent GPU fill-rate exhaustion
 */
export function getTierDpr(tier: PerformanceTier): number {
  if (typeof window === 'undefined') return 1.0;
  const devDpr = window.devicePixelRatio || 1;
  const isMobile = window.innerWidth < 768;

  switch (tier) {
    case 'ULTRA_LOW':
      return 1.0;
    case 'LOW':
      return 1.0;
    case 'MEDIUM':
      return Math.min(devDpr, isMobile ? 1.25 : 1.35);
    case 'HIGH':
      return Math.min(devDpr, isMobile ? 1.5 : 2.0);
  }
}

/**
 * Get comprehensive rendering config for a given tier
 */
export function getPerformanceConfig(tier: PerformanceTier): PerformanceConfig {
  switch (tier) {
    case 'ULTRA_LOW':
      return {
        tier,
        dpr: 1.0,
        maxEntities: 5,
        enableShadows: false,
        enableGlow: false,
        enableComplexMeshes: false,
        dustCount: 0,
        fpsTarget: 30,
      };
    case 'LOW':
      return {
        tier,
        dpr: 1.0,
        maxEntities: 8,
        enableShadows: false,
        enableGlow: false,
        enableComplexMeshes: false,
        dustCount: 8,
        fpsTarget: 30,
      };
    case 'MEDIUM':
      return {
        tier,
        dpr: getTierDpr('MEDIUM'),
        maxEntities: 14,
        enableShadows: true,
        enableGlow: true,
        enableComplexMeshes: true,
        dustCount: 18,
        fpsTarget: 60,
      };
    case 'HIGH':
      return {
        tier,
        dpr: getTierDpr('HIGH'),
        maxEntities: 22,
        enableShadows: true,
        enableGlow: true,
        enableComplexMeshes: true,
        dustCount: 30,
        fpsTarget: 60,
      };
  }
}

/**
 * Lightweight runtime FPS Monitor with auto-tier adaptation.
 * If average FPS falls below acceptable threshold over 45 frames,
 * the tier is automatically downgraded to prevent freezing.
 */
export class AdaptiveFPSController {
  private tier: PerformanceTier;
  private frameTimes: number[] = [];
  private lastTime: number = performance.now();
  private lowFpsCounter: number = 0;
  private highFpsCounter: number = 0;
  private listeners: ((tier: PerformanceTier) => void)[] = [];

  constructor(initialTier?: PerformanceTier) {
    this.tier = initialTier || detectDeviceTier();
  }

  public getTier(): PerformanceTier {
    return this.tier;
  }

  public subscribe(cb: (tier: PerformanceTier) => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  public recordFrame(now: number): void {
    const delta = now - this.lastTime;
    this.lastTime = now;
    if (delta <= 0 || delta > 200) return; // Skip outlier pauses (e.g. background tab)

    const instantFps = 1000 / delta;
    this.frameTimes.push(instantFps);
    if (this.frameTimes.length > 30) {
      this.frameTimes.shift();
    }

    if (this.frameTimes.length >= 20) {
      const avgFps = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;

      // Drop tier if running below 26 FPS on Medium/High or below 20 FPS on Low
      if (avgFps < 26 && this.tier !== 'ULTRA_LOW') {
        this.lowFpsCounter++;
        if (this.lowFpsCounter > 45) {
          this.demoteTier();
          this.lowFpsCounter = 0;
          this.frameTimes = [];
        }
      } else {
        this.lowFpsCounter = Math.max(0, this.lowFpsCounter - 1);
      }

      // Smoothly recover tier if rock-solid 58+ FPS for 300 frames
      if (avgFps > 58 && this.tier !== 'HIGH') {
        this.highFpsCounter++;
        if (this.highFpsCounter > 300) {
          this.promoteTier();
          this.highFpsCounter = 0;
          this.frameTimes = [];
        }
      } else {
        this.highFpsCounter = Math.max(0, this.highFpsCounter - 1);
      }
    }
  }

  private demoteTier(): void {
    if (this.tier === 'HIGH') this.setTier('MEDIUM');
    else if (this.tier === 'MEDIUM') this.setTier('LOW');
    else if (this.tier === 'LOW') this.setTier('ULTRA_LOW');
  }

  private promoteTier(): void {
    // Only promote if not on a low-spec mobile device
    const isMobile = window.innerWidth < 768;
    if (isMobile && (navigator.hardwareConcurrency || 4) <= 4) return;

    if (this.tier === 'ULTRA_LOW') this.setTier('LOW');
    else if (this.tier === 'LOW') this.setTier('MEDIUM');
    else if (this.tier === 'MEDIUM') this.setTier('HIGH');
  }

  public setTier(newTier: PerformanceTier): void {
    if (this.tier === newTier) return;
    this.tier = newTier;
    this.listeners.forEach((l) => l(newTier));
  }
}

/**
 * Disconnectable IntersectionObserver helper to pause animation loops when offscreen.
 */
export function createVisibilityObserver(
  targetElement: HTMLElement | null,
  onVisible: () => void,
  onHidden: () => void,
  threshold = 0.05
): () => void {
  if (!targetElement || typeof IntersectionObserver === 'undefined') {
    onVisible();
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry && entry.isIntersecting) {
        onVisible();
      } else {
        onHidden();
      }
    },
    { threshold }
  );

  observer.observe(targetElement);

  return () => {
    observer.disconnect();
  };
}
