import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  ChevronDown,
  Sun,
  Moon,
  ArrowRight,
  Menu,
  X,
  Check,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { LumosLogo } from '../ui/LumosLogo';
import { useI18n, Language } from '../../lib/i18n';
import { useCRM } from '../../context/CRMContext';

interface PublicHeaderProps {
  activeSection: string;
  onHomeClick: (e: React.MouseEvent) => void;
  onOpenRegister: (course?: string) => void;
  onOpenDiagnostic?: () => void;
  isScrolled: boolean;
  scrollProgress: number;
}

// 12 Ultra-subtle floating educational glyphs in the header background
const FLOATING_GLYPHS = [
  { symbol: 'π', left: '7%', top: '24%', delay: '0s', duration: '14s', size: '13px', rotate: '-8deg' },
  { symbol: 'x²', left: '19%', top: '65%', delay: '2s', duration: '16s', size: '12px', rotate: '10deg' },
  { symbol: 'ABC', left: '32%', top: '22%', delay: '4s', duration: '18s', size: '11px', rotate: '-6deg' },
  { symbol: '∑', left: '46%', top: '70%', delay: '1s', duration: '15s', size: '14px', rotate: '8deg' },
  { symbol: 'Aa', left: '59%', top: '26%', delay: '3s', duration: '17s', size: '12px', rotate: '-12deg' },
  { symbol: '+', left: '71%', top: '68%', delay: '5s', duration: '13s', size: '15px', rotate: '14deg' },
  { symbol: '√x', left: '83%', top: '28%', delay: '2.5s', duration: '19s', size: '12px', rotate: '-5deg' },
  { symbol: '=', left: '93%', top: '62%', delay: '4.5s', duration: '14s', size: '14px', rotate: '6deg' },
  { symbol: '∫', left: '13%', top: '50%', delay: '3.5s', duration: '16s', size: '15px', rotate: '-10deg' },
  { symbol: '123', left: '39%', top: '32%', delay: '1.5s', duration: '17s', size: '11px', rotate: '5deg' },
  { symbol: '∞', left: '53%', top: '58%', delay: '5s', duration: '20s', size: '13px', rotate: '-4deg' },
  { symbol: 'Δ', left: '77%', top: '18%', delay: '2s', duration: '15s', size: '12px', rotate: '12deg' },
];

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  activeSection,
  onHomeClick,
  onOpenRegister,
  onOpenDiagnostic,
  isScrolled,
  scrollProgress,
}) => {
  const { language, setLanguage } = useI18n();
  const { settings, updateSettings } = useCRM();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  // 1. Subtle 3D mouse parallax on the header (Perspective 1200px)
  useEffect(() => {
    // Disable tilt on small screens or reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || window.innerWidth < 1024) return;

    let frameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const normX = (e.clientX - cx) / cx;
        const normY = (e.clientY - cy) / cy;

        // Extremely subtle non-dizzying response: max ±1.3 deg Y, ±1.0 deg X
        setTilt({
          rotateY: normX * 1.3,
          rotateX: -normY * 1.0,
        });
      });
    };

    const handleMouseLeave = () => {
      setTilt({ rotateX: 0, rotateY: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(frameId);
    };
  }, []);

  // 2. Language dropdown click outside and ESC dismiss
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLangDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 3. Toggle Dark / Light Theme with localStorage persistence
  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  // Navigation menu items
  const navMenuItems = [
    { id: 'hero', label: 'BOSH SAHIFA', href: '#hero', onClick: onHomeClick },
    { id: 'courses', label: 'KURSLAR', href: '#courses' },
    { id: 'benefits', label: 'AFZALLIKLAR', href: '#benefits' },
    { id: 'results', label: 'NATIJALAR', href: '#results' },
    { id: 'teachers', label: 'USTOZLAR', href: '#teachers' },
    { id: 'about', label: 'BIZ HAQIMIZDA', href: '#about' },
  ];

  // Mobile menu items (includes Aloqa for seamless contact jump)
  const mobileNavItems = [
    { id: 'hero', label: 'Bosh sahifa', href: '#hero', onClick: onHomeClick },
    { id: 'courses', label: 'Kurslar', href: '#courses' },
    { id: 'benefits', label: 'Afzalliklar', href: '#benefits' },
    { id: 'results', label: 'Natijalar', href: '#results' },
    { id: 'teachers', label: 'Ustozlar', href: '#teachers' },
    { id: 'about', label: 'Biz haqimizda', href: '#about' },
    { id: 'contact', label: 'Aloqa', href: '#contact' },
  ];

  const currentLangLabel =
    language === 'uz' ? 'O‘zbekcha' : language === 'ru' ? 'Русский' : 'English';

  return (
    <header
      ref={headerRef}
      style={{
        perspective: '1200px',
      }}
      className="fixed top-0 left-0 right-0 z-50 select-none transition-all duration-300"
    >
      {/* 3D Tilted Inner Container */}
      <div
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s, border-color 0.3s, padding 0.3s',
          transformStyle: 'preserve-3d',
        }}
        className={`relative w-full ${
          isScrolled
            ? 'bg-[linear-gradient(180deg,rgba(5,5,5,0.96)_0%,rgba(20,7,9,0.94)_100%)] backdrop-blur-2xl border-b border-[#D9A928]/30 shadow-[0_12px_40px_rgba(0,0,0,0.85)] py-2.5'
            : 'bg-[linear-gradient(180deg,rgba(5,5,5,0.88)_0%,rgba(20,7,9,0.82)_100%)] backdrop-blur-md border-b border-[#D9A928]/15 py-3.5 sm:py-4'
        }`}
      >
        {/* Atmospheric Ambient Lighting Inside Header */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] max-w-full h-[60px] bg-[radial-gradient(ellipse_at_top,rgba(217,169,40,0.12),transparent_70%)] pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[400px] max-w-full h-[60px] bg-[radial-gradient(ellipse_at_top,rgba(82,14,31,0.22),transparent_70%)] pointer-events-none" />

        {/* 10-12 Subtle Floating Educational Particles Behind Nav */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          {FLOATING_GLYPHS.map((glyph, i) => (
            <span
              key={i}
              className="absolute text-[#F4C84A] font-serif select-none transition-opacity"
              style={{
                left: glyph.left,
                top: glyph.top,
                fontSize: glyph.size,
                transform: `rotate(${glyph.rotate})`,
                opacity: isScrolled ? 0.06 : 0.1,
                animation: `headerGlyphDrift ${glyph.duration} ease-in-out infinite alternate ${glyph.delay}`,
              }}
            >
              {glyph.symbol}
            </span>
          ))}
        </div>

        {/* Content Container */}
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative z-10">
          
          {/* ============================================================
              LEFT: LUMOS LOGO (With Subtle Golden Aura)
              ============================================================ */}
          <a
            href="#hero"
            onClick={onHomeClick}
            className="flex items-center gap-2 group focus:outline-none select-none transition-transform duration-300 hover:scale-[1.02] shrink-0"
            aria-label="Lumos Bosh sahifaga qaytish"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#D9A928]/20 blur-md group-hover:bg-[#F4C84A]/35 transition-all duration-300" />
              <LumosLogo size="md" className="relative z-10 drop-shadow-[0_0_12px_rgba(217,169,40,0.4)]" />
            </div>
          </a>

          {/* ============================================================
              CENTER: DESKTOP NAVIGATION (6 Items + Smooth Center Underline)
              ============================================================ */}
          <nav
            className="hidden xl:flex items-center gap-7 2xl:gap-8 text-[12px] font-medium tracking-[0.14em] uppercase text-[#D5D0C7]"
            aria-label="Asosiy menyu"
          >
            {navMenuItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={item.onClick}
                  className={`relative py-2 px-1 transition-all duration-250 group cursor-pointer ${
                    isActive
                      ? 'text-[#F4C84A] font-semibold drop-shadow-[0_0_10px_rgba(244,200,74,0.45)]'
                      : 'hover:text-[#F4C84A]'
                  }`}
                >
                  <span>{item.label}</span>
                  {/* Animated Center-Expanding Gold Underline */}
                  <span
                    className={`absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#B88A24] via-[#F4C84A] to-[#B88A24] rounded-full shadow-[0_0_8px_rgba(244,200,74,0.6)] origin-center transition-all duration-300 ease-out ${
                      isActive
                        ? 'scale-x-100 opacity-100'
                        : 'scale-x-0 opacity-0 group-hover:scale-x-75 group-hover:opacity-60'
                    }`}
                  />
                </a>
              );
            })}
          </nav>

          {/* ============================================================
              RIGHT: THEME TOGGLE, LANGUAGE, LOGIN, REGISTRATION CTA
              ============================================================ */}
          <div className="hidden sm:flex items-center gap-2.5 lg:gap-3">
            
            {/* 1. Theme Toggle: Single Compact ☀ / ☾ Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-full border border-[#D9A928]/40 bg-white/[0.03] text-[#F4C84A] hover:border-[#F4C84A] hover:bg-[#F4C84A]/10 hover:shadow-[0_0_12px_rgba(244,200,74,0.3)] transition-all duration-300 flex items-center justify-center cursor-pointer group"
              aria-label={settings.theme === 'dark' ? "Yorug' rejimga o'tish" : "Qorong'i rejimga o'tish"}
              title={settings.theme === 'dark' ? "Yorug' rejimga o'tish" : "Qorong'i rejimga o'tish"}
            >
              {settings.theme === 'dark' ? (
                <Sun className="h-3.5 w-3.5 stroke-[2.2] text-[#F4C84A] transition-transform duration-500 group-hover:rotate-90" />
              ) : (
                <Moon className="h-3.5 w-3.5 stroke-[2.2] text-[#D9A928] transition-transform duration-500 group-hover:-rotate-45" />
              )}
            </button>

            {/* 2. Language Selector Dropdown: 🌐 O'zbekcha ▼ */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D9A928]/35 bg-white/[0.03] text-xs font-semibold text-[#E2DFD8] hover:border-[#D9A928] hover:text-[#F4C84A] transition-all cursor-pointer"
                aria-expanded={isLangDropdownOpen}
                aria-label="Tilni tanlash"
              >
                <Globe className="h-3.5 w-3.5 text-[#F4C84A]" />
                <span>{currentLangLabel}</span>
                <ChevronDown
                  className={`h-3 w-3 text-[#A9A3A0] transition-transform duration-200 ${
                    isLangDropdownOpen ? 'rotate-180 text-[#F4C84A]' : ''
                  }`}
                />
              </button>

              {/* Dropdown Panel with Dark Glass & Gold Border */}
              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-[#0B0607]/95 border border-[#D9A928]/40 p-1.5 shadow-[0_16px_36px_rgba(0,0,0,0.85)] z-50 text-xs backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                  {[
                    { code: 'uz', label: 'O‘zbekcha' },
                    { code: 'ru', label: 'Русский' },
                    { code: 'en', label: 'English' },
                  ].map((lng) => (
                    <button
                      key={lng.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lng.code as Language);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                        language === lng.code
                          ? 'bg-gradient-to-r from-[#D9A928] via-[#F4C84A] to-[#D9A928] text-[#080607] font-bold shadow-sm'
                          : 'text-[#E2DFD8] hover:bg-white/5 hover:text-[#F4C84A]'
                      }`}
                    >
                      <span>{lng.label}</span>
                      {language === lng.code && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Glass Login Button: Kirish */}
            <a
              href="#/login"
              className="px-4 py-1.5 rounded-full border border-[#D9A928]/45 bg-white/[0.025] backdrop-blur-md text-xs font-semibold text-[#E2DFD8] hover:text-[#F4C84A] hover:border-[#F4C84A] hover:bg-[#D9A928]/10 hover:shadow-[0_0_12px_rgba(218,169,40,0.25)] transition-all duration-300"
            >
              Kirish
            </a>

            {/* 4. Primary CTA: Ro'yxatdan o'tish → (Strongest Visual Element) */}
            <button
              type="button"
              onClick={() => onOpenRegister()}
              className="px-4.5 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs font-bold text-[#080607] bg-gradient-to-r from-[#B88A24] via-[#F4C84A] to-[#D9A928] hover:brightness-110 shadow-[0_4px_18px_rgba(218,169,40,0.35)] hover:shadow-[0_6px_24px_rgba(244,200,74,0.55)] hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 group cursor-pointer transition-all duration-300"
            >
              <span>Ro‘yxatdan o‘tish</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          {/* ============================================================
              MOBILE CONTROLS: Theme Toggle + Hamburger Menu
              ============================================================ */}
          <div className="flex items-center gap-2 xl:hidden">
            {/* Mobile Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-[#D9A928]/35 bg-white/[0.03] text-[#F4C84A] hover:border-[#F4C84A] transition-all"
              aria-label="Rejimni almashtirish"
            >
              {settings.theme === 'dark' ? (
                <Sun className="h-4 w-4 text-[#F4C84A]" />
              ) : (
                <Moon className="h-4 w-4 text-[#D9A928]" />
              )}
            </button>

            {/* Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl border border-[#D9A928]/35 bg-white/[0.03] text-[#F7F4EE] hover:border-[#D9A928] transition-all cursor-pointer"
              aria-label="Menyuni ochish"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5 text-[#F4C84A]" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Scroll Progress Line Indicator */}
        <div
          className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-[#B88A24] via-[#F4C84A] to-[#D9A928] shadow-[0_0_8px_rgba(244,200,74,0.5)] transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />

        {/* ============================================================
            MOBILE NAVIGATION DRAWER
            ============================================================ */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-[#0B0607]/98 backdrop-blur-2xl border-b border-[#D9A928]/30 px-6 py-6 space-y-5 shadow-[0_25px_60px_rgba(0,0,0,0.9)] animate-in slide-in-from-top-3 duration-250">
            {/* Nav Items */}
            <div className="flex flex-col gap-2">
              {mobileNavItems.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    if (link.onClick) link.onClick(e);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-sm font-semibold py-2 border-b border-white/5 flex items-center justify-between transition-colors ${
                    activeSection === link.id
                      ? 'text-[#F4C84A] font-bold drop-shadow-[0_0_8px_rgba(244,200,74,0.4)]'
                      : 'text-[#A9A3A0] hover:text-[#E2DFD8]'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="h-4 w-4 text-[#D9A928]/60" />
                </a>
              ))}
            </div>

            {/* Language Chips */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-[#A9A3A0] mr-1">Til:</span>
              {[
                { code: 'uz', label: 'O‘zbekcha' },
                { code: 'ru', label: 'Русский' },
                { code: 'en', label: 'English' },
              ].map((lng) => (
                <button
                  key={lng.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lng.code as Language);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    language === lng.code
                      ? 'bg-[#D9A928] text-[#080607] font-bold shadow-sm'
                      : 'border border-[#D9A928]/30 text-[#E2DFD8] bg-white/[0.03]'
                  }`}
                >
                  {lng.label}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-3">
              {onOpenDiagnostic && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenDiagnostic();
                  }}
                  className="w-full py-2.5 rounded-full border border-[#D9A928]/40 text-[#F4C84A] text-xs font-bold flex items-center justify-center gap-2 bg-[#080607]/60 hover:bg-[#D9A928]/10 transition-all cursor-pointer"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Darajani aniqlash</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenRegister();
                }}
                className="w-full py-2.5 rounded-full text-xs font-bold text-[#080607] bg-gradient-to-r from-[#B88A24] via-[#F4C84A] to-[#D9A928] hover:brightness-110 shadow-md shadow-[#D9A928]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Ro‘yxatdan o‘tish</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <a
                href="#/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2 text-center text-xs font-bold text-[#A9A3A0] hover:text-[#F4C84A] transition-colors"
              >
                Kirish (Login)
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Global CSS Keyframe for slow floating particles */}
      <style>{`
        @keyframes headerGlyphDrift {
          0% {
            transform: translateY(0px) rotate(-6deg);
            opacity: 0.06;
          }
          50% {
            transform: translateY(-4px) rotate(4deg);
            opacity: 0.13;
          }
          100% {
            transform: translateY(2px) rotate(-2deg);
            opacity: 0.08;
          }
        }
      `}</style>
    </header>
  );
};
