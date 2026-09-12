import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  ChevronDown,
  ArrowRight,
  Menu,
  X,
  Check,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { LumosLogo } from '../ui/LumosLogo';
import { useI18n, Language } from '../../lib/i18n';

interface PublicHeaderProps {
  activeSection: string;
  onHomeClick: (e: React.MouseEvent) => void;
  onOpenRegister: (course?: string) => void;
  onOpenDiagnostic?: () => void;
  isScrolled: boolean;
  scrollProgress: number;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  activeSection,
  onHomeClick,
  onOpenRegister,
  onOpenDiagnostic,
  isScrolled,
  scrollProgress,
}) => {
  const { language, setLanguage } = useI18n();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Close language dropdown on outside click or ESC
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

  // Navigation menu items (Exactly matching Image 2)
  const navMenuItems = [
    { id: 'hero', label: 'BOSH SAHIFA', href: '#hero', onClick: onHomeClick },
    { id: 'courses', label: 'KURSLAR', href: '#courses' },
    { id: 'benefits', label: 'AFZALLIKLAR', href: '#benefits' },
    { id: 'results', label: 'NATIJALAR', href: '#results' },
    { id: 'teachers', label: 'USTOZLAR', href: '#teachers' },
    { id: 'about', label: 'BIZ HAQIMIZDA', href: '#about' },
  ];

  // Mobile menu items
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#080506]/94 backdrop-blur-xl border-b border-[#D9A928]/25 shadow-[0_10px_35px_rgba(0,0,0,0.85)] py-3'
          : 'bg-gradient-to-b from-[#080506]/90 via-[#0D0608]/75 to-transparent py-4 sm:py-5 border-b border-transparent'
      }`}
    >
      {/* Content Container - Generous width to prevent any text wrapping */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between">
        
        {/* ============================================================
            LEFT: LUMOS LOGO (Preserved Sunburst Emblem & Typography)
            ============================================================ */}
        <a
          href="#hero"
          onClick={onHomeClick}
          className="flex items-center gap-2.5 group focus:outline-none select-none shrink-0"
          aria-label="LUMOS Bosh sahifa"
        >
          <LumosLogo size="md" className="drop-shadow-[0_2px_12px_rgba(217,169,40,0.35)]" />
        </a>

        {/* ============================================================
            CENTER: DESKTOP NAVIGATION (Exactly as Image 2)
            ============================================================ */}
        <nav
          className="hidden xl:flex items-center gap-6 2xl:gap-9 text-[12.5px] 2xl:text-[13px] font-bold tracking-[0.14em] uppercase"
          aria-label="Asosiy menyu"
        >
          {navMenuItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={item.onClick}
                className={`relative py-1.5 px-0.5 whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? 'text-[#FFFFFF] font-extrabold'
                    : 'text-[#E2DFD8]/85 hover:text-[#F4C84A]'
                }`}
              >
                <span>{item.label}</span>
                {/* Active Indicator: Crisp 2.5px solid gold line directly under active text */}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#D9A928] via-[#F4C84A] to-[#D9A928] rounded-full shadow-[0_0_8px_rgba(244,200,74,0.5)] animate-in fade-in duration-200" />
                )}
              </a>
            );
          })}
        </nav>

        {/* ============================================================
            RIGHT: Exactly 3 Items (Language, Kirish, Ro'yxatdan o'tish)
            ============================================================ */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          
          {/* 1. Language Dropdown: 🌐 O'zbekcha ⌵ */}
          <div className="relative" ref={langDropdownRef}>
            <button
              type="button"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#D9A928]/40 bg-[#16080B]/85 hover:border-[#F4C84A] text-xs font-medium text-[#F7F4EE] whitespace-nowrap transition-all cursor-pointer shadow-sm"
              aria-expanded={isLangDropdownOpen}
              aria-label="Tilni tanlash"
            >
              <Globe className="h-3.5 w-3.5 text-[#F4C84A] shrink-0" />
              <span>{currentLangLabel}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-[#A9A3A0] transition-transform duration-200 ${
                  isLangDropdownOpen ? 'rotate-180 text-[#F4C84A]' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-[#120609]/98 border border-[#D9A928]/45 p-1.5 shadow-[0_16px_36px_rgba(0,0,0,0.9)] z-50 text-xs backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
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

          {/* 2. Login Pill Button: Kirish */}
          <a
            href="#/login"
            className="px-5 py-2 rounded-full border border-[#D9A928]/40 bg-[#16080B]/85 hover:border-[#F4C84A] hover:bg-[#D9A928]/10 text-xs font-semibold text-[#F7F4EE] hover:text-[#F4C84A] whitespace-nowrap transition-all shadow-sm"
          >
            Kirish
          </a>

          {/* 3. Primary Registration CTA: Ro'yxatdan o'tish → (Single Line Pill) */}
          <button
            type="button"
            onClick={() => onOpenRegister()}
            className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-xs font-bold text-[#080607] bg-gradient-to-r from-[#D9A928] via-[#F4C84A] to-[#D9A928] hover:brightness-110 shadow-[0_3px_16px_rgba(217,169,40,0.35)] hover:shadow-[0_4px_22px_rgba(244,200,74,0.5)] active:translate-y-0.5 flex items-center gap-2 whitespace-nowrap shrink-0 group cursor-pointer transition-all duration-200"
          >
            <span className="whitespace-nowrap">Ro‘yxatdan o‘tish</span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

        {/* ============================================================
            MOBILE CONTROLS: Hamburger Trigger
            ============================================================ */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-xl border border-[#D9A928]/40 bg-[#16080B]/85 text-[#F7F4EE] hover:border-[#D9A928] transition-all cursor-pointer"
            aria-label="Menyuni ochish"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5 text-[#F4C84A]" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Dynamic Page Scroll Progress Indicator */}
      <div
        className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-[#D9A928] via-[#F4C84A] to-[#D9A928] transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ============================================================
          MOBILE NAVIGATION DRAWER
          ============================================================ */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0A0406]/98 backdrop-blur-2xl border-b border-[#D9A928]/30 px-6 py-6 space-y-5 shadow-[0_25px_60px_rgba(0,0,0,0.95)] animate-in slide-in-from-top-2 duration-200">
          {/* Nav Items */}
          <div className="flex flex-col gap-1.5">
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
                    ? 'text-[#F4C84A] font-bold'
                    : 'text-[#A9A3A0] hover:text-[#F7F4EE]'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="h-4 w-4 text-[#D9A928]/60" />
              </a>
            ))}
          </div>

          {/* Language Selection Chips */}
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
              className="w-full py-2.5 rounded-full text-xs font-bold text-[#080607] bg-gradient-to-r from-[#D9A928] via-[#F4C84A] to-[#D9A928] hover:brightness-110 shadow-md shadow-[#D9A928]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
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
    </header>
  );
};
