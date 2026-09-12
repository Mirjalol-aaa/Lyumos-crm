import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Star,
  ArrowRight,
  BookOpen,
  Award,
  Users,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  Send,
  Globe,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Menu,
  X,
  Check,
  Package,
  ClipboardCheck,
  ExternalLink,
  Mail,
  Sparkles,
} from 'lucide-react';
import { LumosLogo } from '../../components/ui/LumosLogo';
import { Hero3DScene } from '../../components/hero/Hero3DScene';
import { MathematicalUniverse3D } from '../../components/hero/MathematicalUniverse3D';
import { PublicTeacherModal } from '../../components/modals/PublicTeacherModal';
import { MultiStepRegisterModal } from '../../components/modals/MultiStepRegisterModal';
import { DiagnosticTestModal } from '../../components/modals/DiagnosticTestModal';
import { CourseDetailsModal } from '../../components/modals/CourseDetailsModal';
import { useI18n } from '../../lib/i18n';
import { useCRM } from '../../context/CRMContext';
import { INITIAL_COURSES } from '../../data/coursesData';
import { Course } from '../../types/admin';
import aboutAcademyImg from '../../assets/lumos_about_academy.jpg';

export const LandingPage: React.FC = () => {
  const { t, language, setLanguage, formatMoney } = useI18n();
  const { settings } = useCRM();

  // Scroll detection & Reading Progress Indicator
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Active navigation section
  const [activeSection, setActiveSection] = useState<string>('hero');

  // "Bosh sahifa" transition effect state
  const [isHomeTransitioning, setIsHomeTransitioning] = useState(false);

  // UI States & Modals
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState(false);
  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<Course | null>(null);

  // Registration Flow Modal States
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerCourse, setRegisterCourse] = useState<string>('');

  // Public Teacher Modal State
  const [selectedTeacherForModal, setSelectedTeacherForModal] = useState<{
    name: string;
    role: string;
    specialization: string;
    experience: string;
    rating: string;
    badge: string;
    bio: string;
    achievements: string[];
    scheduleDays: string;
    scheduleTime: string;
    symbol: string;
    gradient: string;
  } | null>(null);

  // Course category filtering
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('all');
  const categoryFilters = [
    { key: 'all', label: 'Barchasi' },
    { key: 'til', label: 'Xorijiy tillar' },
    { key: 'it', label: 'IT & Dasturlash' },
    { key: 'aniq', label: 'Aniq fanlar & DTM' },
  ];

  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // 1. Scroll & Progress Tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 30);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (scrollY / totalHeight) * 100)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Active Section Detection (IntersectionObserver) for 6 core sections
  useEffect(() => {
    const sectionIds = ['hero', 'courses', 'benefits', 'results', 'teachers', 'about'];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { rootMargin: '-25% 0px -60% 0px', threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  // 3. Close language dropdown on outside click or ESC
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLangDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 4. "Bosh sahifa" click transition handler
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveSection('hero');
    setIsHomeTransitioning(true);
    setTimeout(() => setIsHomeTransitioning(false), 650);
  };

  // Nav menu items (Strictly 6 core items, no FAQ, no Filiallar)
  const navMenuItems = [
    { id: 'hero', label: 'Bosh sahifa', href: '#hero', onClick: handleHomeClick },
    { id: 'courses', label: 'Kurslar', href: '#courses' },
    { id: 'benefits', label: 'Afzalliklar', href: '#benefits' },
    { id: 'results', label: 'Natijalar', href: '#results' },
    { id: 'teachers', label: 'Ustozlar', href: '#teachers' },
    { id: 'about', label: 'Biz haqimizda', href: '#about' },
  ];

  // Filtered courses
  const filteredCourses = useMemo(() => {
    if (selectedCategoryKey === 'all') return INITIAL_COURSES;
    return INITIAL_COURSES.filter((c) => {
      const cat = (c.category || '').toLowerCase();
      const title = c.title.toLowerCase();
      if (selectedCategoryKey === 'til') return cat.includes('language') || cat.includes('til') || title.includes('ielts') || title.includes('cefr') || title.includes('english') || title.includes('ingliz');
      if (selectedCategoryKey === 'it') return cat.includes('programming') || cat.includes('it') || title.includes('dastur') || title.includes('python') || title.includes('frontend');
      if (selectedCategoryKey === 'aniq') return cat.includes('math') || cat.includes('aniq') || cat.includes('science') || title.includes('matematika') || title.includes('fizika') || title.includes('dtm');
      return true;
    });
  }, [selectedCategoryKey]);

  // Teacher Profiles
  const teacherProfiles = [
    {
      name: 'Sherzodbek Rahimov',
      role: 'Katta Ustoz & Metodist',
      specialization: 'IELTS & Akademik Ingliz tili',
      experience: '9+ yil',
      rating: '4.98',
      badge: 'IELTS Band 8.5',
      bio: 'Buyuk Britaniyada tahsil olgan. 1200 dan ortiq o‘quvchisi 7.0+ va 8.0+ natijalarni qayd etgan.',
      achievements: ['Cambridge CELTA sertifikati', '1200+ IELTS bitiruvchilari', 'Top 10 eng yaxshi metodist'],
      scheduleDays: 'Dush - Chor - Juma',
      scheduleTime: '15:00 - 17:00 / 18:30 - 20:30',
      symbol: 'SR',
      gradient: 'from-[#4A1520] via-[#851C2C] to-[#2B0910]',
    },
    {
      name: 'Malika Karimova',
      role: 'Bosh Dasturlash Ustozi',
      specialization: 'Full Stack & Python Dasturlash',
      experience: '6+ yil',
      rating: '4.95',
      badge: 'Senior Full Stack',
      bio: 'Xalqaro IT kompaniyalarda ishlagan dasturchi. Real loyihalar va amaliy keyslar asosida o‘qitadi.',
      achievements: ['Ex-EPAM dasturchisi', '650+ IT bitiruvchilari', '15+ xalqaro startap loyihalar'],
      scheduleDays: 'Sesh - Pay - Shan',
      scheduleTime: '14:00 - 16:00 / 18:00 - 20:00',
      symbol: 'MK',
      gradient: 'from-[#1B2836] via-[#2A3E54] to-[#121C26]',
    },
    {
      name: 'Akmal Rustamov',
      role: 'DTM & Matematika Koordinatori',
      specialization: 'Oliy Matematika & Mantiq',
      experience: '11+ yil',
      rating: '4.99',
      badge: '100% Grant Natija',
      bio: 'O‘zbekiston Respublikasi fan olimpiadalari g‘olibi. 189 ballik DTM rekordchilarini yetishtirgan.',
      achievements: ['189 ball DTM rekordchisi tayyorlagan', '98% OTMga grant qabul', 'Mualliflik qo‘llanmalari'],
      scheduleDays: 'Dush - Chor - Juma',
      scheduleTime: '09:00 - 11:00 / 14:00 - 16:00',
      symbol: 'AR',
      gradient: 'from-[#2D2411] via-[#5C4517] to-[#1A1509]',
    },
    {
      name: 'Zilola Alimova',
      role: 'Rus tili & Grammatika Mutaxassisi',
      specialization: 'So‘zlashuv & Akademik Rus tili',
      experience: '7+ yil',
      rating: '4.92',
      badge: 'TORFL C2 Ekspert',
      bio: 'Moskva Davlat Universitetida amaliyot o‘tagan. 1 oylik ekspress so‘zlashuv metodikasi muallifi.',
      achievements: ['TORFL C2 oliy daraja', '800+ faol talabalar', 'Zamonaviy audio-vizual metod'],
      scheduleDays: 'Sesh - Pay - Shan',
      scheduleTime: '10:00 - 12:00 / 16:00 - 18:00',
      symbol: 'ZA',
      gradient: 'from-[#381B2E] via-[#5A2649] to-[#1F0E1A]',
    },
  ];

  const handleOpenRegisterWithCourse = (courseTitle: string) => {
    setRegisterCourse(courseTitle);
    setIsRegisterModalOpen(true);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.includes('@')) {
      setNewsletterSuccess(true);
      setTimeout(() => setNewsletterSuccess(false), 5000);
      setNewsletterEmail('');
    }
  };

  // Center location and contact info
  const centerAddress = settings.address || 'Urganch shahri, Al-Xorazmiy shoh ko‘chasi, 42';
  const centerPhone = settings.phone || '+998 (71) 200-00-25';
  const centerWorkingHours = '08:00 - 20:00 (Dushanba - Shanba)';

  return (
    <div className="min-h-screen bg-[#080607] text-[#F7F4EE] antialiased selection:bg-[#D9A93A] selection:text-[#080607] relative overflow-x-hidden font-sans">
      {/* -------------------------------------------------------------------------
          1. HEADER / MINIMAL FLOATING GLASS NAVBAR (6 Items + Smooth Slide Indicator)
          ------------------------------------------------------------------------- */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#080607]/92 backdrop-blur-xl border-b border-[#D9A93A]/20 shadow-[0_12px_40px_rgba(0,0,0,0.85)] py-2.5'
            : 'bg-gradient-to-b from-[#080607]/85 to-transparent py-4 border-b border-transparent'
        }`}
      >
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo on Left */}
          <a
            href="#hero"
            onClick={handleHomeClick}
            className="flex items-center gap-2 group focus:outline-none select-none"
          >
            <LumosLogo size="md" />
          </a>

          {/* Centered Navigation Links with Sliding Active Indicator */}
          <nav className="hidden xl:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-[#A9A3A0]">
            {navMenuItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={item.onClick}
                  className={`relative py-2 px-1 transition-all duration-300 ${
                    isActive
                      ? 'text-[#F3D276] font-bold drop-shadow-[0_0_8px_rgba(243,210,118,0.4)]'
                      : 'hover:text-[#F7F4EE]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#D9A93A] via-[#F3D276] to-[#D9A93A] rounded-full shadow-[0_0_10px_#D9A93A] transition-all duration-300 animate-in fade-in" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Action Tools on Right: Language, Kirish, Ro‘yxatdan o‘tish */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Selector Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D9A93A]/30 bg-[#16090D] text-xs font-semibold text-[#F7F4EE] hover:border-[#D9A93A] transition-all cursor-pointer"
                aria-expanded={isLangDropdownOpen}
              >
                <Globe className="h-3.5 w-3.5 text-[#D9A93A]" />
                <span>{language === 'uz' ? 'O‘zbekcha' : language === 'ru' ? 'Русский' : 'English'}</span>
                <ChevronDown className="h-3 w-3 text-[#A9A3A0]" />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-2xl bg-[#16090D] border border-[#D9A93A]/40 p-1.5 shadow-2xl z-50 text-xs backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                  {[
                    { code: 'uz', label: 'O‘zbekcha' },
                    { code: 'ru', label: 'Русский' },
                    { code: 'en', label: 'English' },
                  ].map((lng) => (
                    <button
                      key={lng.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lng.code as any);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                        language === lng.code
                          ? 'bg-[#D9A93A] text-[#080607] font-bold shadow-sm'
                          : 'text-[#F7F4EE] hover:bg-white/5'
                      }`}
                    >
                      <span>{lng.label}</span>
                      {language === lng.code && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Compact Glass Login Button */}
            <a
              href="#/login"
              className="px-4 py-1.5 rounded-full border border-[#D9A93A]/35 bg-[#16090D]/80 text-xs font-bold text-[#F7F4EE] hover:text-[#F3D276] hover:border-[#D9A93A] hover:bg-[#200A11] transition-all"
            >
              Kirish
            </a>

            {/* Medium-size, Compact Gold Registration CTA */}
            <button
              type="button"
              onClick={() => {
                setRegisterCourse('');
                setIsRegisterModalOpen(true);
              }}
              className="px-4 py-1.5 rounded-full text-xs font-bold text-[#080607] bg-gradient-to-r from-[#D9A93A] via-[#F3D276] to-[#D9A93A] hover:brightness-110 shadow-sm shadow-[#D9A93A]/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Ro‘yxatdan o‘tish</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl border border-[#D9A93A]/30 text-[#F7F4EE] hover:border-[#D9A93A]"
              aria-label="Menyu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Page Top Scroll Progress Indicator */}
        <div
          className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-[#D9A93A] via-[#F3D276] to-[#D9A93A] transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-[#120609]/98 backdrop-blur-2xl border-b border-[#D9A93A]/30 px-6 py-5 space-y-4 shadow-2xl animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-2.5">
              {navMenuItems.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    if (link.onClick) link.onClick(e);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-sm font-semibold py-1.5 border-b border-white/5 flex items-center justify-between ${
                    activeSection === link.id ? 'text-[#F3D276] font-bold' : 'text-[#A9A3A0]'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="h-4 w-4 text-[#D9A93A]/60" />
                </a>
              ))}
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsDiagnosticModalOpen(true);
                }}
                className="w-full py-2.5 rounded-full border border-[#D9A93A]/40 text-[#D9A93A] text-xs font-bold flex items-center justify-center gap-2 bg-[#080607]"
              >
                <BookOpen className="h-4 w-4" />
                <span>Darajani aniqlash</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setRegisterCourse('');
                  setIsRegisterModalOpen(true);
                }}
                className="w-full py-2.5 rounded-full text-xs font-bold text-[#080607] bg-gradient-to-r from-[#D9A93A] via-[#F3D276] to-[#D9A93A] flex items-center justify-center gap-1.5"
              >
                <span>Ro‘yxatdan o‘tish</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <a
                href="#/login"
                className="w-full py-2 text-center text-xs font-bold text-[#A9A3A0] hover:text-[#F7F4EE]"
              >
                Kirish (Login)
              </a>
            </div>
          </div>
        )}
      </header>

      {/* -------------------------------------------------------------------------
          2. HERO SECTION (Living 3D Mathematical Universe + Cinematic 3D Scene)
          ------------------------------------------------------------------------- */}
      <section
        id="hero"
        className="relative pt-32 sm:pt-36 lg:pt-40 pb-24 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-[1380px] mx-auto min-h-[92vh] flex flex-col justify-center overflow-visible"
      >
        {/* Living Mathematical 3D Universe Canvas Background */}
        <MathematicalUniverse3D isHomeTransitioning={isHomeTransitioning} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center relative z-10">
          {/* Left Side: Badge, Headline, Subtitle, CTAs & 4 Benefits */}
          <div
            className={`lg:col-span-6 space-y-6 text-left z-10 transition-all duration-500 ${
              isHomeTransitioning ? 'opacity-90 -translate-y-1' : 'opacity-100 translate-y-0'
            }`}
          >
            {/* Top Badge: ⭐ Bilim — eng katta kuch! */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16090D]/90 backdrop-blur-md border border-[#D9A93A]/40 shadow-lg shadow-[#D9A93A]/10 hover:border-[#D9A93A]/70 transition-all duration-300">
              <Star className="h-3.5 w-3.5 fill-[#D9A93A] text-[#D9A93A]" />
              <span className="text-xs font-bold text-[#F3D276] tracking-wide">
                Bilim — eng katta kuch!
              </span>
            </div>

            {/* Main Headline (Playfair Editorial Luxury Serif) */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-[4.3rem] font-luxury-serif font-black leading-[1.08] tracking-tight">
                <span className="text-[#FFFFFF] block drop-shadow-md">
                  Kelajagingizni
                </span>
                <span className="text-[#D9A93A] block mt-1 drop-shadow-lg font-luxury-serif">
                  bugundan boshlang!
                </span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#D4C8BE] max-w-xl font-normal leading-relaxed">
              Lumos — zamonaviy ta’lim, kuchli ustozlar va real natijalar uchun yaratilgan innovatsion ta’lim markazi.
            </p>

            {/* 2 CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
              {/* Primary: Kurslarni ko‘rish */}
              <a
                href="#courses"
                className="w-full sm:w-auto group relative px-8 py-3.5 rounded-full text-sm font-black text-[#080607] bg-gradient-to-r from-[#D9A93A] via-[#F3D276] to-[#D9A93A] bg-[length:200%_auto] hover:bg-right transition-all duration-500 shadow-[0_10px_30px_rgba(217,169,58,0.35)] hover:shadow-[0_15px_40px_rgba(217,169,58,0.5)] hover:-translate-y-1 cursor-pointer flex items-center justify-center gap-2 border border-[#F7F4EE]/40 active:translate-y-0"
              >
                <span>Kurslarni ko‘rish</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Secondary: Darajani aniqlash */}
              <button
                type="button"
                onClick={() => setIsDiagnosticModalOpen(true)}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full text-sm font-bold text-[#F7F4EE] hover:text-[#F3D276] bg-[#16090D]/80 hover:bg-[#2A0D14] backdrop-blur-xl border border-[#D9A93A]/40 hover:border-[#D9A93A] shadow-[0_8px_25px_rgba(0,0,0,0.7)] hover:shadow-[0_0_25px_rgba(217,169,58,0.25)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer active:translate-y-0"
              >
                <BookOpen className="h-4 w-4 text-[#D9A93A]" />
                <span>Darajani aniqlash</span>
              </button>
            </div>

            {/* 4 Feature Benefits Underneath Buttons */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-[#F7F4EE]">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-[#D9A93A] shrink-0" />
                <span>Sifatli ta’lim</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-[#D9A93A] shrink-0" />
                <span>Kuchli ustozlar</span>
              </div>
              <div className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-[#D9A93A] shrink-0" />
                <span>Zamonaviy metodika</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#D9A93A] shrink-0" />
                <span>Real natijalar</span>
              </div>
            </div>
          </div>

          {/* Right Side: Pro 3D Educational Scene (Zero-lag GPU CSS variables) */}
          <div className="lg:col-span-6 flex items-center justify-center relative z-10">
            <Hero3DScene />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          3. KURSLAR / COURSES SECTION (#courses)
          ------------------------------------------------------------------------- */}
      <section id="courses" className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1380px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16090D] border border-[#D9A93A]/30 text-[11px] font-bold uppercase tracking-widest text-[#D9A93A]">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Ta’lim Yo‘nalishlari</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury-serif font-black text-[#F7F4EE]">
              Kelajak kasblari va <span className="text-[#D9A93A]">akademik fanlar</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#A9A3A0]">
              Har bir kurs amaliy mashg‘ulotlar, diagnostik testlar va shaxsiy murabbiy ko‘magi bilan ta’minlangan.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categoryFilters.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategoryKey(cat.key)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategoryKey === cat.key
                    ? 'bg-[#D9A93A] text-[#080607] shadow-lg shadow-[#D9A93A]/20'
                    : 'bg-[#14080B] border border-[#D9A93A]/30 text-[#A9A3A0] hover:text-[#F7F4EE] hover:border-[#D9A93A]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Courses 3D Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group relative rounded-[32px] bg-gradient-to-b from-[#14080B] via-[#0E0507] to-[#080607] border border-[#D9A93A]/20 hover:border-[#D9A93A]/60 p-7 shadow-[0_20px_50px_rgba(0,0,0,0.85)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#D9A93A]/15 text-[#F3D276] border border-[#D9A93A]/30">
                    {course.category}
                  </span>
                  <div className="flex items-center gap-1 text-[#F3D276] text-xs font-bold">
                    <Star className="h-3.5 w-3.5 fill-[#D9A93A] text-[#D9A93A]" />
                    <span>4.95</span>
                  </div>
                </div>

                <h3 className="text-xl font-luxury-serif font-black text-[#F7F4EE] group-hover:text-[#F3D276] transition-colors line-clamp-1">
                  {course.title}
                </h3>

                <p className="text-xs text-[#A9A3A0] line-clamp-2 leading-relaxed">
                  {course.description}
                </p>

                <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#D9A93A]/15 text-xs text-[#F7F4EE]">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-[#D9A93A]" />
                    <span>{course.durationMonths} oy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-[#D9A93A]" />
                    <span>Haftada 3 kun</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex items-center justify-between mt-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#A9A3A0] block">Oylik to‘lov</span>
                  <span className="text-lg font-black text-[#F3D276]">
                    {formatMoney(course.pricePerMonth)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCourseForDetails(course)}
                    className="p-2.5 rounded-full border border-[#D9A93A]/30 hover:border-[#D9A93A] text-[#A9A3A0] hover:text-[#F7F4EE] transition-colors"
                    title="Batafsil"
                  >
                    <BookOpen className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenRegisterWithCourse(course.title)}
                    className="px-4 py-2.5 rounded-full text-xs font-bold text-[#080607] bg-gradient-to-r from-[#D9A93A] via-[#F3D276] to-[#D9A93A] hover:brightness-110 shadow-md shadow-[#D9A93A]/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Yozilish</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          4. AFZALLIKLAR / BENEFITS SECTION (#benefits)
          ------------------------------------------------------------------------- */}
      <section id="benefits" className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1380px] mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16090D] border border-[#D9A93A]/30 text-[11px] font-bold uppercase tracking-widest text-[#D9A93A]">
            <Award className="h-3.5 w-3.5" />
            <span>Nega aynan LUMOS?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury-serif font-black text-[#F7F4EE]">
            Bizning asosiy <span className="text-[#D9A93A]">afzalliklarimiz</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#A9A3A0] leading-relaxed">
            Har bir talabaning individual salohiyatini kashf etish va xalqaro marralarni zabt etish uchun yaratilgan mukammal ekotizim.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              num: '01',
              title: 'Sifatli ta’lim',
              desc: 'Xalqaro Cambridge, CEFR va milliy DTM standartlariga to‘liq javob beruvchi sinovdan o‘tgan o‘quv dasturlari.',
              icon: Package,
            },
            {
              num: '02',
              title: 'Kuchli ustozlar',
              desc: 'IELTS 8.5+, xalqaro ilmiy darajaga ega va ko‘p yillik amaliy tajribaga ega yetakchi pedagoglar jamoasi.',
              icon: GraduationCap,
            },
            {
              num: '03',
              title: 'Zamonaviy metodika',
              desc: 'Raqamli LMS tizimi, 24/7 o‘quv platformasi, avtomatlashtirilgan Telegram bot va sun’iy intellekt tahlillari.',
              icon: ClipboardCheck,
            },
            {
              num: '04',
              title: 'Real natijalar',
              desc: 'Bitiruvchilarimizning 95% dan ortig‘i xalqaro sertifikatlar va nufuzli OTMlarning grant o‘rinlarini qo‘lga kiritgan.',
              icon: TrendingUp,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative p-8 rounded-[32px] bg-gradient-to-b from-[#14080B] to-[#0A0406] border border-[#D9A93A]/20 hover:border-[#D9A93A]/60 transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.8)] hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-luxury-serif font-black text-[#D9A93A]/40 group-hover:text-[#D9A93A] transition-colors">
                      {item.num}
                    </span>
                    <div className="h-10 w-10 rounded-2xl bg-[#D9A93A]/10 border border-[#D9A93A]/30 flex items-center justify-center text-[#D9A93A] group-hover:scale-110 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="w-8 h-[2px] bg-[#D9A93A]/30 group-hover:w-16 group-hover:bg-[#D9A93A] transition-all duration-300" />
                  <h3 className="text-xl font-bold text-[#F7F4EE] group-hover:text-[#F3D276] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#A9A3A0] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          5. NATIJALAR / RESULTS SECTION (#results)
          ------------------------------------------------------------------------- */}
      <section id="results" className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1380px] mx-auto relative z-10">
        <div className="p-8 sm:p-12 rounded-[40px] bg-gradient-to-br from-[#18080C] via-[#100608] to-[#080607] border border-[#D9A93A]/30 shadow-[0_30px_90px_rgba(0,0,0,0.9)] relative overflow-hidden">
          {/* Subtle Background Mathematical Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#D9A93A_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#080607] border border-[#D9A93A]/30 text-[11px] font-bold uppercase tracking-widest text-[#D9A93A]">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Shon-Sharaf Kengashi</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury-serif font-black text-[#F7F4EE]">
              Raqamlarda ifodalangan <span className="text-[#D9A93A]">haqiqiy natijalar</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#A9A3A0]">
              Quruq va’dalar emas, balki qabul qilingan grantlar, xalqaro sertifikatlar va tasdiqlangan yutuqlar.
            </p>
          </div>

          {/* 4 Big Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center relative z-10 mb-14">
            <div className="p-6 rounded-2xl bg-[#080607]/80 border border-[#D9A93A]/20">
              <span className="text-3xl sm:text-5xl font-luxury-serif font-black text-[#D9A93A] block">189</span>
              <span className="text-xs font-bold text-[#F7F4EE] mt-1 block">DTM Maksimal Ball</span>
              <span className="text-[11px] text-[#A9A3A0]">Davlat granti sohibi</span>
            </div>
            <div className="p-6 rounded-2xl bg-[#080607]/80 border border-[#D9A93A]/20">
              <span className="text-3xl sm:text-5xl font-luxury-serif font-black text-[#D9A93A] block">8.0</span>
              <span className="text-xs font-bold text-[#F7F4EE] mt-1 block">IELTS Band Natija</span>
              <span className="text-[11px] text-[#A9A3A0]">Cambridge imtihoni</span>
            </div>
            <div className="p-6 rounded-2xl bg-[#080607]/80 border border-[#D9A93A]/20">
              <span className="text-3xl sm:text-5xl font-luxury-serif font-black text-[#D9A93A] block">C1</span>
              <span className="text-xs font-bold text-[#F7F4EE] mt-1 block">CEFR Xalqaro Daraja</span>
              <span className="text-[11px] text-[#A9A3A0]">Til bilish sertifikati</span>
            </div>
            <div className="p-6 rounded-2xl bg-[#080607]/80 border border-[#D9A93A]/20">
              <span className="text-3xl sm:text-5xl font-luxury-serif font-black text-[#D9A93A] block">95%</span>
              <span className="text-xs font-bold text-[#F7F4EE] mt-1 block">O‘zlashtirish & Kirish</span>
              <span className="text-[11px] text-[#A9A3A0]">Nufuzli OTMlarga</span>
            </div>
          </div>

          {/* Before/After Verified Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {[
              {
                student: 'Jasur Bekmurodov',
                faculty: 'Jahon Iqtisodiyoti va Diplomatiya Universiteti (Grant)',
                before: 'IELTS 5.5',
                after: 'IELTS 8.0',
                time: '6 oy o‘qish davri',
                quote: 'Lumosdagi mock imtihonlar va ustozlarning individual yondashuvi natijani 8.0 ga olib chiqdi.',
              },
              {
                student: 'Dildora Ahmedova',
                faculty: 'Toshkent Davlat Yuridik Universiteti (Grant)',
                before: 'DTM 58 ball',
                after: 'DTM 189 ball',
                time: '8 oy o‘qish davri',
                quote: 'Aniq fanlar va mantiqiy testlar bo‘yicha mualliflik metodikasi imtihonda 100% ishonch berdi.',
              },
              {
                student: 'Temur Soliyev',
                faculty: 'EPAM Junior Python Developer',
                before: 'Noldan boshlagan',
                after: 'Full Stack Dev',
                time: '7 oy o‘qish davri',
                quote: 'Amaliy keyslar va xalqaro startap loyihalarida ishtirok etib, kurs yakunidayoq ishga kirdim.',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-[#0C0507]/90 border border-[#D9A93A]/25 space-y-4 hover:border-[#D9A93A]/60 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#D9A93A] font-bold">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Tasdiqlangan</span>
                  </div>
                  <span className="text-[11px] text-[#A9A3A0]">{card.time}</span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold text-[#F7F4EE]">{card.student}</h4>
                  <p className="text-xs text-[#F3D276] leading-tight">{card.faculty}</p>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#080607] border border-[#D9A93A]/20 text-xs">
                  <div>
                    <span className="text-[10px] text-[#A9A3A0] block">Boshlang‘ich:</span>
                    <span className="font-semibold text-rose-300">{card.before}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#D9A93A]" />
                  <div className="text-right">
                    <span className="text-[10px] text-[#A9A3A0] block">Erishilgan:</span>
                    <span className="font-black text-emerald-400">{card.after}</span>
                  </div>
                </div>

                <p className="text-xs text-[#A9A3A0] italic leading-relaxed">
                  "{card.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          6. USTOZLAR / TEACHERS SECTION (#teachers)
          ------------------------------------------------------------------------- */}
      <section id="teachers" className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1380px] mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16090D] border border-[#D9A93A]/30 text-[11px] font-bold uppercase tracking-widest text-[#D9A93A]">
            <Users className="h-3.5 w-3.5" />
            <span>Bizning Murabbiylar</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury-serif font-black text-[#F7F4EE]">
            Oliy toifali <span className="text-[#D9A93A]">ustoz va mutaxassislar</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#A9A3A0]">
            Har bir murabbiy o‘z sohasining haqiqiy professionali bo‘lib, o‘quvchilarni eng yuqori marralarga yetaklaydi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teacherProfiles.map((teacher, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedTeacherForModal(teacher)}
              className="group cursor-pointer rounded-[32px] bg-gradient-to-b from-[#14080B] to-[#0A0406] border border-[#D9A93A]/20 hover:border-[#D9A93A]/70 p-6 shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4 text-center">
                {/* Avatar / Monogram */}
                <div className="mx-auto w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-[#D9A93A] via-[#FFE7A3] to-[#8A5A12] shadow-lg shadow-[#D9A93A]/20 group-hover:scale-105 transition-transform">
                  <div className={`w-full h-full rounded-full bg-gradient-to-br ${teacher.gradient} flex items-center justify-center text-xl font-luxury-serif font-black text-[#F7F4EE]`}>
                    {teacher.symbol}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#D9A93A]/15 text-[#F3D276] border border-[#D9A93A]/30">
                    {teacher.badge}
                  </span>
                  <h3 className="text-lg font-bold text-[#F7F4EE] group-hover:text-[#F3D276] transition-colors">
                    {teacher.name}
                  </h3>
                  <p className="text-xs text-[#D9A93A]">{teacher.specialization}</p>
                </div>

                <p className="text-xs text-[#A9A3A0] line-clamp-2 leading-relaxed">
                  {teacher.bio}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#D9A93A]/15 flex items-center justify-between text-xs">
                <span className="text-[#A9A3A0]">Tajriba: {teacher.experience}</span>
                <span className="text-[#D9A93A] font-bold flex items-center gap-1">
                  Batafsil <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          7. BIZ HAQIMIZDA / ABOUT US SECTION (#about)
          ------------------------------------------------------------------------- */}
      <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1380px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Academy Philosophy & Story */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16090D] border border-[#D9A93A]/30 text-[11px] font-bold uppercase tracking-widest text-[#D9A93A]">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Biz Haqimizda</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury-serif font-black text-[#F7F4EE] leading-tight">
              LUMOS — bilimni nurga, <span className="text-[#D9A93A]">orzu-maqsadlarni haqiqatga</span> aylantiramiz
            </h2>

            <p className="text-sm text-[#D4C8BE] leading-relaxed">
              Lumos Ta’lim Markazi 2014-yilda professional ustozlar va ta’lim innovatorlari tomonidan tashkil etilgan. Bizning vazifamiz — shunchaki imtihonga tayyorlash emas, balki talabalarda mustaqil tahlil, mantiqiy fikrlash va yuqori akademik intizomni shakllantirishdir.
            </p>

            {/* Golden 3D Timeline */}
            <div className="space-y-4 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F3D276] block">
                Rivojlanish Xronologiyasi:
              </span>
              <div className="space-y-3 relative pl-6 border-l-2 border-[#D9A93A]/30">
                {[
                  { year: '2014', title: 'Akademiya tashkil etilishi', desc: 'Dastlabki 120 nafar iqtidorli talabalar bilan boshlangan yo‘l.' },
                  { year: '2018', title: 'Markaziy Kampus Kengayishi', desc: 'Zamonaviy texnologiyalar va kengaytirilgan auditoriyalar bazasi yaratildi.' },
                  { year: '2022', title: 'Raqamli LMS & CRM Ekotizimi', desc: 'Ota-onalar va talabalar uchun avtomatlashtirilgan yagona monitoring tizimi joriy etildi.' },
                  { year: '2026', title: 'Xalqaro AI & Cambridge Standartlari', desc: 'Sun’iy intellekt asosidagi diagnostik testlar va xalqaro akkreditatsiyalangan metodika.' },
                ].map((item, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full bg-[#080607] border-2 border-[#D9A93A] group-hover:bg-[#D9A93A] transition-colors" />
                    <span className="text-xs font-mono font-bold text-[#D9A93A] block">{item.year}</span>
                    <h4 className="text-sm font-bold text-[#F7F4EE]">{item.title}</h4>
                    <p className="text-xs text-[#A9A3A0] leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Academy Campus Imagery */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-[36px] overflow-hidden border border-[#D9A93A]/35 shadow-[0_25px_70px_rgba(0,0,0,0.9)] group">
              <img
                src={aboutAcademyImg}
                alt="Lumos Academy Campus"
                className="w-full h-[460px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080607] via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-[#14080B]/90 backdrop-blur-xl border border-[#D9A93A]/30">
                <h4 className="text-base font-bold text-[#F7F4EE]">Zamonaviy va qulay muhit</h4>
                <p className="text-xs text-[#A9A3A0] mt-1">
                  Har bir xonamiz interaktiv smart-doskalar, konditsionerlar va zamonaviy kutubxona bilan jihozlangan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          8. BIZNI TOPING & REGISTRATION CTA AREA (Single Real Campus Showcase)
          ------------------------------------------------------------------------- */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-[1380px] mx-auto relative z-10">
        <div className="p-8 sm:p-14 rounded-[42px] bg-gradient-to-br from-[#200A11] via-[#14060A] to-[#0A0406] border border-[#D9A93A]/40 shadow-[0_25px_80px_rgba(0,0,0,0.9)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left CTA Info */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#D9A93A]/15 text-[#F3D276] border border-[#D9A93A]/30 inline-block">
              Kafolatlangan Ta’lim & Qulay Joylashuv
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury-serif font-black text-[#F7F4EE]">
              Orzuingizdagi natijaga erishish vaqt keldi!
            </h2>
            <p className="text-xs sm:text-sm text-[#A9A3A0] leading-relaxed max-w-xl">
              Hoziroq ro‘yxatdan o‘ting va birinchi bepul sinov darsimizda qatnashib, o‘z bilimingizni professional darajaga ko‘taring.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDiagnosticModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-[#D9A93A]/40 text-[#F7F4EE] hover:text-[#F3D276] text-xs font-bold transition-all cursor-pointer"
              >
                Darajani aniqlash
              </button>

              <button
                type="button"
                onClick={() => {
                  setRegisterCourse('');
                  setIsRegisterModalOpen(true);
                }}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full text-xs font-bold text-[#080607] bg-gradient-to-r from-[#D9A93A] via-[#F3D276] to-[#D9A93A] hover:brightness-110 shadow-lg shadow-[#D9A93A]/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Bepul darsga yozilish</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right Single Branch Details: "Bizni toping" */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0E0507]/90 border border-[#D9A93A]/30 space-y-4 text-left shadow-xl">
            <div className="flex items-center justify-between border-b border-[#D9A93A]/20 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#D9A93A]" />
                <span className="text-sm font-bold text-[#F7F4EE]">Bizni toping</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Markaziy Kampus
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-[#A9A3A0] block">Manzil:</span>
                <span className="text-[#F7F4EE] font-semibold block">{centerAddress}</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-[#A9A3A0] block">Telefon:</span>
                <span className="text-[#D9A93A] font-bold block">{centerPhone}</span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-[#A9A3A0] block">Ish vaqti:</span>
                <span className="text-[#A9A3A0] block">{centerWorkingHours}</span>
              </div>
            </div>

            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-2xl border border-[#D9A93A]/40 hover:border-[#D9A93A] bg-[#16090D] text-xs font-bold text-[#F7F4EE] hover:text-[#F3D276] flex items-center justify-center gap-2 transition-all block text-center"
            >
              <span>Xaritada ko‘rish</span>
              <ExternalLink className="h-3.5 w-3.5 text-[#D9A93A]" />
            </a>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          9. LUXURY FOOTER (Statement: "Bilim bilan chegaralar yo‘q")
          ------------------------------------------------------------------------- */}
      <footer className="border-t border-[#D9A93A]/20 bg-[#080607] py-16 px-4 sm:px-6 lg:px-8 text-[#A9A3A0] text-xs relative z-10">
        <div className="max-w-[1380px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1: Brand & Big Statement */}
          <div className="lg:col-span-5 space-y-4">
            <a href="#hero" onClick={handleHomeClick} className="inline-block">
              <LumosLogo size="md" />
            </a>
            <h3 className="text-xl font-luxury-serif font-black text-[#F3D276]">
              "Bilim bilan chegaralar yo‘q."
            </h3>
            <p className="text-xs text-[#A9A3A0] leading-relaxed max-w-sm">
              Lumos — zamonaviy ta’lim, kuchli ustozlar va real natijalar uchun yaratilgan innovatsion ta’lim markazi.
            </p>
            <div className="text-[11px] text-[#A9A3A0]/60">
              Litsenziya: № AA-2024-8971 | O‘zbekiston Respublikasi
            </div>
          </div>

          {/* Col 2: Navigation Links (6 core links, no FAQ, no Filiallar) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F7F4EE]">Menyu</h4>
            <div className="flex flex-col gap-2">
              <a href="#hero" onClick={handleHomeClick} className="hover:text-[#F3D276] transition-colors">Bosh sahifa</a>
              <a href="#courses" className="hover:text-[#F3D276] transition-colors">Kurslar</a>
              <a href="#benefits" className="hover:text-[#F3D276] transition-colors">Afzalliklar</a>
              <a href="#results" className="hover:text-[#F3D276] transition-colors">Natijalar</a>
              <a href="#teachers" className="hover:text-[#F3D276] transition-colors">Ustozlar</a>
              <a href="#about" className="hover:text-[#F3D276] transition-colors">Biz haqimizda</a>
            </div>
          </div>

          {/* Col 3: Contact & Location (Single branch) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F7F4EE]">Bog‘lanish</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#D9A93A] shrink-0 mt-0.5" />
                <span>{centerAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#D9A93A] shrink-0" />
                <span>{centerPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#D9A93A] shrink-0" />
                <span>{settings.email || 'admin@lumos.uz'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#D9A93A] shrink-0" />
                <span>{centerWorkingHours}</span>
              </div>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="pt-2 space-y-2">
              <div className="flex items-center rounded-full bg-[#14080B] border border-[#D9A93A]/30 p-1">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Email manzilingiz"
                  required
                  className="w-full bg-transparent px-3 text-xs text-[#F7F4EE] placeholder-[#A9A3A0]/60 outline-none"
                />
                <button
                  type="submit"
                  className="p-2 rounded-full bg-[#D9A93A] text-[#080607] hover:bg-[#F3D276] transition-colors cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
              {newsletterSuccess && (
                <p className="text-[11px] text-emerald-400 font-bold animate-in fade-in">
                  Obuna bo‘lganingiz uchun tashakkur!
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="max-w-[1380px] mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} LUMOS Ta’lim Markazi. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-4">
            <a href="#/login" className="hover:text-[#D9A93A] transition-colors font-semibold">Tizimga kirish</a>
            <span>•</span>
            <a href="#/admin" className="hover:text-[#D9A93A] transition-colors font-semibold">Boshqaruv Paneli</a>
          </div>
        </div>
      </footer>

      {/* -------------------------------------------------------------------------
          10. MODALS INTEGRATION (Multi-Step Register, Diagnostic, Teacher, Course)
          ------------------------------------------------------------------------- */}
      <PublicTeacherModal
        isOpen={!!selectedTeacherForModal}
        onClose={() => setSelectedTeacherForModal(null)}
        teacher={selectedTeacherForModal}
        onEnroll={(teacherName) => handleOpenRegisterWithCourse(teacherName)}
      />

      <MultiStepRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        courses={INITIAL_COURSES}
        initialCourseTitle={registerCourse}
      />

      <DiagnosticTestModal
        isOpen={isDiagnosticModalOpen}
        onClose={() => setIsDiagnosticModalOpen(false)}
      />

      <CourseDetailsModal
        course={selectedCourseForDetails}
        isOpen={!!selectedCourseForDetails}
        onClose={() => setSelectedCourseForDetails(null)}
        onEnroll={(title) => handleOpenRegisterWithCourse(title)}
      />
    </div>
  );
};
