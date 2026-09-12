import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  Users,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  Send,
  Star,
  Globe,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Layers,
  HeartHandshake,
  MessageCircle,
  Compass,
  Menu,
  X,
  Search,
  Check,
  Package,
  ClipboardCheck,
  Sun,
  Moon,
  ExternalLink,
  HelpCircle,
  Mail,
  CheckCircle,
} from 'lucide-react';
import { LumosLogo } from '../../components/ui/LumosLogo';
import { Hero3DScene } from '../../components/hero/Hero3DScene';
import { Ambient3D } from '../../components/common/Ambient3D';
import { WebsiteSearchOverlay } from '../../components/common/WebsiteSearchOverlay';
import { PublicTeacherModal } from '../../components/modals/PublicTeacherModal';
import { MultiStepRegisterModal } from '../../components/modals/MultiStepRegisterModal';
import { DiagnosticTestModal } from '../../components/modals/DiagnosticTestModal';
import { CourseDetailsModal } from '../../components/modals/CourseDetailsModal';
import { useI18n } from '../../lib/i18n';
import { useCRM } from '../../context/CRMContext';
import { useLMS } from '../../context/LMSContext';
import { INITIAL_COURSES } from '../../data/coursesData';
import { INITIAL_TEACHERS } from '../../data/initialData';
import { INITIAL_BRANCHES } from '../../data/branchesData';
import { Course } from '../../types/admin';
import aboutAcademyImg from '../../assets/lumos_about_academy.jpg';

export const LandingPage: React.FC = () => {
  const { t, language, setLanguage, formatMoney } = useI18n();
  const { settings, updateSettings } = useCRM();

  // Scroll detection for compact floating navbar
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // UI States & Modals
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState(false);
  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<Course | null>(null);

  // Registration Flow Modal States
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerCourse, setRegisterCourse] = useState<string>('');
  const [registerBranch, setRegisterBranch] = useState<string>('');

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

  // Selected branch in branches section
  const [selectedBranchId, setSelectedBranchId] = useState<string>(INITIAL_BRANCHES[0]?.id || '');

  // Newsletter subscription
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Course category filtering
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('all');
  const categoryFilters = [
    { key: 'all', label: 'Barchasi' },
    { key: 'til', label: 'Til kurslari' },
    { key: 'it', label: 'IT & Dasturlash' },
    { key: 'aniq', label: 'Aniq fanlar & DTM' },
  ];

  const filteredCourses = useMemo(() => {
    if (selectedCategoryKey === 'all') return INITIAL_COURSES;
    if (selectedCategoryKey === 'til') {
      return INITIAL_COURSES.filter((c) =>
        c.category.toLowerCase().includes('til') ||
        c.title.toLowerCase().includes('english') ||
        c.title.toLowerCase().includes('ielts') ||
        c.title.toLowerCase().includes('rus')
      );
    }
    if (selectedCategoryKey === 'it') {
      return INITIAL_COURSES.filter((c) =>
        c.category.toLowerCase().includes('it') ||
        c.title.toLowerCase().includes('frontend') ||
        c.title.toLowerCase().includes('dasturlash') ||
        c.title.toLowerCase().includes('savodxonlik')
      );
    }
    if (selectedCategoryKey === 'aniq') {
      return INITIAL_COURSES.filter((c) =>
        c.category.toLowerCase().includes('aniq') ||
        c.category.toLowerCase().includes('maktab') ||
        c.title.toLowerCase().includes('matematika') ||
        c.title.toLowerCase().includes('fizika') ||
        c.title.toLowerCase().includes('prezident')
      );
    }
    return INITIAL_COURSES;
  }, [selectedCategoryKey]);

  // Teachers data with rich presentation
  const teacherProfiles = [
    {
      name: 'Hadicha ustoz',
      role: 'Matematika, Mantiq & DTM Bo‘yicha Bosh Murabbiy',
      specialization: 'Oliy Matematika, Mental Arifmetika, DTM Testlari',
      experience: '8 yillik pedagogik staj',
      rating: '5.0 ★ (480+ o‘quvchi)',
      badge: 'Oliy Toifali Mutaxassis',
      bio: 'O‘quvchilarni olimpiadalar va nufuzli davlat oliygohlariga tayyorlash bo‘yicha 8 yillik boy tajribaga ega. Murakkab tenglamalar va geometriyani eng oson mantiqiy usullar bilan tushuntiradi. Shogirdlarining 95% dan ortig‘i grant asosida talaba bo‘lgan.',
      achievements: [
        'DTM imtihonlarida 189.0 maksimal natija ko‘rsatgan 40+ shogird',
        'Al-Xorazmiy olimpiadasi g‘oliblari ustozi',
        'Prezident maktabiga kirish imtihonlari bo‘yicha maxsus mualliflik dasturi',
      ],
      scheduleDays: 'Dush - Chor - Juma',
      scheduleTime: '14:00 - 16:00',
      symbol: '∑',
      gradient: 'bg-gradient-to-tr from-[#D9A93A] to-[#F3D276]',
    },
    {
      name: 'Hasanboy ustoz',
      role: 'IELTS Band 8.5 & General English Bosh Murabbiyi',
      specialization: 'IELTS Intensive, Academic Writing, Speaking Club',
      experience: '7 yillik xalqaro tajriba',
      rating: '4.9 ★ (620+ o‘quvchi)',
      badge: 'IELTS Band 8.5 Expert',
      bio: 'Xalqaro sertifikat egasi, speaking to‘siqlarini yengish va akademik yozish (Writing) bo‘yicha maxsus tezkor metodika asoschisi. O‘quvchilari xalqaro universitetlar va xorijiy grantlar sohibiga aylangan.',
      achievements: [
        'IELTS umumiy balli 7.5 va 8.0 bo‘lgan 150+ bitiruvchi',
        'Xalqaro nufuzli grant dasturlari g‘oliblari murabbiyi',
        'Britaniya kengashi (British Council) tomonidan akkreditatsiyalangan metodist',
      ],
      scheduleDays: 'Sesh - Pay - Shan',
      scheduleTime: '15:30 - 17:30',
      symbol: 'EN',
      gradient: 'bg-gradient-to-tr from-[#3B82F6] to-[#60A5FA]',
    },
  ];

  // FAQ list with category and live search
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [faqCategory, setFaqCategory] = useState<string>('all');
  const [faqSearch, setFaqSearch] = useState<string>('');

  const rawFaqList = [
    {
      category: 'general',
      q: 'Birinchi sinov darsi haqiqatan ham bepulmi?',
      a: 'Ha, 100% bepul! Kursga yozilishdan oldin istalgan fan bo‘yicha sinov darsimizda qatnashib, ustozning o‘qitish uslubi, dars formati va markazimiz muhiti bilan hech qanday to‘lovsiz tanishishingiz mumkin.',
    },
    {
      category: 'lessons',
      q: 'Farzandimning davomati va o‘zlashtirishini qanday kuzatib boraman?',
      a: 'LUMOS tizimida maxsus avtomatlashtirilgan Telegram bot va shaxsiy ota-onalar kabineti ishlaydi. Har bir dars yakunlangach, ota-onaga farzandining darsga kelganligi, uyga vazifa bahosi va ustozning fikri bir zumda yuboriladi.',
    },
    {
      category: 'payments',
      q: 'O‘quv to‘lovlari qancha va qanday to‘lov usullari mavjud?',
      a: 'Kurslarimiz oylik to‘lovi yo‘nalishga qarab 250 000 so‘mdan 380 000 so‘mgacha. To‘lovlarni Payme, Click ilovalari, Uzcard/Humo bank kartalari yoki markazimiz filiallarida naqd shaklda amalga oshirishingiz mumkin.',
    },
    {
      category: 'courses',
      q: 'Natijaga qanday kafolat beriladi?',
      a: 'Biz o‘quvchini qabul qilishda dastlabki diagnostik test olamiz, har 2 haftada oraliq nazorat sinovlarini o‘tkazamiz va mavzuni tushunmagan o‘quvchilarga bepul qo‘shimcha konsultatsiya ajratamiz. Bitiruvchilarimizning 95% i o‘z maqsadiga erishadi.',
    },
    {
      category: 'courses',
      q: 'Kursni muvaffaqiyatli tamomlagach qanday hujjat beriladi?',
      a: 'Kursni to‘liq tugatib, yakuniy imtihonni muvaffaqiyatli topshirgan o‘quvchilarga haqiqiyligini onlayn tekshirish imkonini beruvchi QR-kodli rasmiy ikki tilli LUMOS Academy sertifikati topshiriladi.',
    },
    {
      category: 'branches',
      q: 'Filiallar qaysi manzillarda joylashgan va qachon ishlaydi?',
      a: 'Filiallarimiz Toshkent shahrining Yunusobod, Chilonzor, Mirzo Ulug‘bek va Yashnobod tumanlarida markaziy metro bekatlariga yaqin joylashgan. Dushanbadan shanbagacha soat 08:00 dan 20:00 gacha faoliyat ko‘rsatamiz.',
    },
  ];

  const filteredFaq = useMemo(() => {
    return rawFaqList.filter((item) => {
      const matchCat = faqCategory === 'all' || item.category === faqCategory;
      const matchSearch =
        faqSearch.trim() === '' ||
        item.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
        item.a.toLowerCase().includes(faqSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [faqCategory, faqSearch]);

  const handleOpenRegisterWithCourse = (courseTitle: string) => {
    setRegisterCourse(courseTitle);
    setIsRegisterModalOpen(true);
  };

  const handleOpenRegisterWithBranch = (branchName: string) => {
    setRegisterBranch(branchName);
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

  return (
    <div className="min-h-screen bg-[#080607] text-[#F7F4EE] antialiased selection:bg-[#D9A93A] selection:text-[#080607] relative overflow-x-hidden font-sans">
      {/* -------------------------------------------------------------------------
          0. AMBIENT 3D BACKGROUND SYSTEM
          ------------------------------------------------------------------------- */}
      <Ambient3D />

      {/* -------------------------------------------------------------------------
          1. HEADER / FLOATING GLASS NAVBAR (Single Theme Toggle + Spotlight Search)
          ------------------------------------------------------------------------- */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#080607]/88 backdrop-blur-xl border-b border-[#D9A93A]/20 shadow-[0_12px_40px_rgba(0,0,0,0.85)] py-3'
            : 'bg-transparent py-4 border-b border-transparent'
        }`}
      >
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo on Left */}
          <a href="#" className="flex items-center group focus:outline-none select-none">
            <LumosLogo size="md" />
          </a>

          {/* Centered Navigation Links */}
          <nav className="hidden xl:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-[#A9A3A0]">
            {[
              { id: 'home', label: 'Bosh sahifa', href: '#' },
              { id: 'courses', label: 'Kurslar', href: '#courses' },
              { id: 'why-us', label: 'Afzalliklar', href: '#why-us' },
              { id: 'results', label: 'Natijalar', href: '#results' },
              { id: 'teachers', label: 'Ustozlar', href: '#teachers' },
              { id: 'about', label: 'Biz haqimizda', href: '#about' },
              { id: 'branches', label: 'Filiallar', href: '#branches' },
              { id: 'faq', label: 'FAQ', href: '#faq' },
            ].map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="hover:text-[#F3D276] transition-colors relative py-1"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Action Tools on Right */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Spotlight Search Icon */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D9A93A]/30 bg-[#16090D]/80 hover:border-[#D9A93A] text-xs font-semibold text-[#A9A3A0] hover:text-[#F7F4EE] transition-all cursor-pointer"
              title="Qidirish (Ctrl+K)"
            >
              <Search className="h-3.5 w-3.5 text-[#D9A93A]" />
              <span className="text-[11px]">Qidirish</span>
              <span className="hidden md:inline text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#080607] border border-[#D9A93A]/20 text-[#D9A93A]">
                ⌘K
              </span>
            </button>

            {/* SINGLE Theme Toggle Button (Dark <-> Light) */}
            <button
              type="button"
              onClick={() => {
                const next = settings.theme === 'dark' ? 'light' : 'dark';
                updateSettings({ theme: next });
              }}
              className="flex items-center justify-center h-8 w-8 rounded-full border border-[#D9A93A]/35 bg-[#16090D] text-[#D9A93A] hover:border-[#D9A93A] hover:bg-[#2A0D14] transition-all cursor-pointer"
              title={settings.theme === 'dark' ? 'Yorug‘ rejimga o‘tish' : 'Qorong‘i rejimga o‘tish'}
            >
              {settings.theme === 'dark' ? (
                <Sun className="h-3.5 w-3.5" />
              ) : (
                <Moon className="h-3.5 w-3.5" />
              )}
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D9A93A]/30 bg-[#16090D] text-xs font-semibold text-[#F7F4EE] hover:border-[#D9A93A] transition-all cursor-pointer"
              >
                <Globe className="h-3.5 w-3.5 text-[#D9A93A]" />
                <span>{language === 'uz' ? 'O‘zbekcha' : language === 'ru' ? 'Русский' : 'English'}</span>
                <ChevronDown className="h-3 w-3 text-[#A9A3A0]" />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 rounded-2xl bg-[#16090D] border border-[#D9A93A]/35 p-1.5 shadow-2xl z-50 text-xs">
                  {['uz', 'ru', 'en'].map((lng) => (
                    <button
                      key={lng}
                      type="button"
                      onClick={() => {
                        setLanguage(lng as any);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl transition-colors ${
                        language === lng
                          ? 'bg-[#D9A93A] text-[#080607] font-bold'
                          : 'text-[#F7F4EE] hover:bg-white/5'
                      }`}
                    >
                      {lng === 'uz' ? 'O‘zbekcha' : lng === 'ru' ? 'Русский' : 'English'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Glass Login Button */}
            <a
              href="#/login"
              className="px-4 py-1.5 rounded-full border border-[#D9A93A]/35 bg-[#16090D]/80 text-xs font-bold text-[#F7F4EE] hover:text-[#F3D276] hover:border-[#D9A93A] transition-all"
            >
              Kirish
            </a>

            {/* Premium Gold Registration CTA */}
            <button
              type="button"
              onClick={() => {
                setRegisterCourse('');
                setRegisterBranch('');
                setIsRegisterModalOpen(true);
              }}
              className="gold-gradient-btn px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#D9A93A]/20 cursor-pointer"
            >
              <span>Ro‘yxatdan o‘tish</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-xl bg-[#16090D] border border-[#D9A93A]/30 text-[#D9A93A]"
              title="Qidirish"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-[#16090D] border border-[#D9A93A]/30 text-[#F7F4EE]"
              aria-label="Menyu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-[#14080B] border-b border-[#D9A93A]/25 px-5 py-6 space-y-4 animate-in slide-in-from-top-4 duration-300 shadow-2xl">
            <div className="flex flex-col space-y-3">
              {[
                { id: 'home', label: 'Bosh sahifa', href: '#' },
                { id: 'courses', label: 'Kurslar', href: '#courses' },
                { id: 'why-us', label: 'Afzalliklar', href: '#why-us' },
                { id: 'results', label: 'Natijalar', href: '#results' },
                { id: 'teachers', label: 'Ustozlar', href: '#teachers' },
                { id: 'about', label: 'Biz haqimizda', href: '#about' },
                { id: 'branches', label: 'Filiallar', href: '#branches' },
                { id: 'faq', label: 'FAQ', href: '#faq' },
              ].map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-semibold text-[#A9A3A0] hover:text-[#F3D276] py-1 border-b border-white/5 flex items-center justify-between"
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
                  setRegisterBranch('');
                  setIsRegisterModalOpen(true);
                }}
                className="w-full gold-gradient-btn py-3 rounded-full text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>Ro‘yxatdan o‘tish</span>
                <ArrowRight className="h-4 w-4" />
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
          2. HERO SECTION (Cinematic Pro 3D Multi-Layer Experience)
          ------------------------------------------------------------------------- */}
      <section
        id="home"
        className="relative pt-32 sm:pt-36 lg:pt-40 pb-28 lg:pb-36 px-4 sm:px-6 lg:px-8 max-w-[1380px] mx-auto min-h-[92vh] flex flex-col justify-center overflow-visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center relative z-10">
          {/* Left Side: Badge, Headline, Subtitle, CTAs & 4 Advantages */}
          <div className="lg:col-span-6 space-y-6 text-left z-10">
            {/* Top Badge: ⭐ Bilim — eng katta kuch! */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16090D]/90 backdrop-blur-md border border-[#D9A93A]/40 shadow-lg shadow-[#D9A93A]/10 hover:border-[#D9A93A]/70 transition-all duration-300">
              <Star className="h-3.5 w-3.5 fill-[#D9A93A] text-[#D9A93A]" />
              <span className="text-xs font-bold text-[#F3D276] tracking-wide">
                Bilim — eng katta kuch!
              </span>
            </div>

            {/* Main Headline (Playfair Editorial Serif) */}
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

            {/* 4 Feature Icons Underneath Buttons */}
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

          {/* Right Side: Pro 3D Educational Scene */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end mt-4 lg:mt-0 z-10">
            <Hero3DScene />
          </div>
        </div>

        {/* ---------------------------------------------------------------------
            3. TRUST / PROVEN SOCIAL PROOF CAPSULE (5000+ Students, 95% Result)
            --------------------------------------------------------------------- */}
        <div className="mt-16 lg:mt-24 relative z-30">
          <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-[#14080B]/95 via-[#220B12]/95 to-[#14080B]/95 backdrop-blur-2xl border border-[#D9A93A]/40 shadow-[0_20px_60px_rgba(0,0,0,0.85)] px-6 sm:px-10 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            {/* Stat 1 */}
            <div className="flex items-center justify-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D9A93A]/20 border border-[#D9A93A]/45 text-[#D9A93A] shrink-0">
                <Users className="h-5 w-5" />
              </div>
              <div className="text-left">
                <span className="text-2xl sm:text-3xl font-luxury-serif font-black text-[#FFFFFF] block leading-none">
                  5000+
                </span>
                <span className="text-xs text-[#A9A3A0] font-semibold mt-1 block">
                  O‘quvchilar
                </span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center justify-center gap-3.5 md:border-l border-[#D9A93A]/20 md:pl-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D9A93A]/20 border border-[#D9A93A]/45 text-[#D9A93A] shrink-0">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="text-left">
                <span className="text-2xl sm:text-3xl font-luxury-serif font-black text-[#FFFFFF] block leading-none">
                  95%
                </span>
                <span className="text-xs text-[#A9A3A0] font-semibold mt-1 block">
                  Natija ko‘rsatkichi
                </span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center justify-center gap-3.5 md:border-l border-[#D9A93A]/20 md:pl-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D9A93A]/20 border border-[#D9A93A]/45 text-[#D9A93A] shrink-0">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="text-left">
                <span className="text-2xl sm:text-3xl font-luxury-serif font-black text-[#FFFFFF] block leading-none">
                  50+
                </span>
                <span className="text-xs text-[#A9A3A0] font-semibold mt-1 block">
                  Professional ustoz
                </span>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center justify-center gap-3.5 md:border-l border-[#D9A93A]/20 md:pl-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D9A93A]/20 border border-[#D9A93A]/45 text-[#D9A93A] shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div className="text-left">
                <span className="text-2xl sm:text-3xl font-luxury-serif font-black text-[#FFFFFF] block leading-none">
                  10+
                </span>
                <span className="text-xs text-[#A9A3A0] font-semibold mt-1 block">
                  Yillik tajriba
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          4. COURSES SECTION (Premium 3D Interactive Cards + Filters)
          ------------------------------------------------------------------------- */}
      <section
        id="courses"
        className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1380px] mx-auto relative z-20"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16090D] border border-[#D9A93A]/35 text-xs font-bold text-[#F3D276]">
              <BookOpen className="h-3.5 w-3.5 text-[#D9A93A]" />
              <span>O‘QUV DASTURLARI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury-serif font-black text-[#F7F4EE] tracking-tight">
              Mashhur yo‘nalishlar
            </h2>
            <p className="text-xs sm:text-sm text-[#A9A3A0] font-normal max-w-lg">
              O‘zingizga mos kursni tanlang va eng kuchli mentorlar rahbarligida o‘qishni boshlang.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categoryFilters.map((cat) => {
              const isSelected = selectedCategoryKey === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedCategoryKey(cat.key)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'gold-gradient-btn shadow-md shadow-[#D9A93A]/30 text-[#080607]'
                      : 'bg-[#14080B] border border-[#D9A93A]/25 text-[#A9A3A0] hover:border-[#D9A93A] hover:text-[#F7F4EE]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Courses Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="rounded-3xl p-6 bg-gradient-to-b from-[#16090D]/90 to-[#0F0608]/90 border border-[#D9A93A]/25 hover:border-[#D9A93A]/60 shadow-xl hover:shadow-2xl hover:shadow-[#D9A93A]/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group text-left"
            >
              <div className="space-y-4">
                {/* Category & Level */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#D9A93A]/15 border border-[#D9A93A]/30 text-[11px] font-black text-[#F3D276] uppercase tracking-wider">
                    {course.category}
                  </span>
                  <span className="text-xs font-semibold text-[#A9A3A0]">
                    {course.level}
                  </span>
                </div>

                {/* Course Title */}
                <div>
                  <h3 className="text-xl font-luxury-serif font-black text-[#F7F4EE] group-hover:text-[#F3D276] transition-colors leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-[#A9A3A0] line-clamp-3 mt-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Duration & Mentor */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5 text-xs">
                  <div className="flex items-center gap-1.5 text-[#A9A3A0]">
                    <Clock className="h-3.5 w-3.5 text-[#D9A93A]" />
                    <span>{course.durationMonths} oy</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#A9A3A0]">
                    <Users className="h-3.5 w-3.5 text-[#D9A93A]" />
                    <span className="truncate">{course.instructor || 'Yetakchi ustoz'}</span>
                  </div>
                </div>

                {/* Schedule */}
                {course.schedule && (
                  <div className="p-2.5 rounded-2xl bg-[#080607]/80 border border-[#D9A93A]/20 text-[11px] text-[#A9A3A0] flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-[#D9A93A] shrink-0" />
                    <span className="truncate">{course.schedule}</span>
                  </div>
                )}
              </div>

              {/* Price and Action Buttons */}
              <div className="pt-6 mt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#A9A3A0] uppercase font-bold block">Oylik to‘lov</span>
                  <span className="text-lg font-black text-[#F3D276] font-mono">
                    {formatMoney(course.pricePerMonth, 'UZS')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCourseForDetails(course)}
                    className="px-3.5 py-2 rounded-full text-xs font-bold text-[#F7F4EE] hover:text-[#F3D276] hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Batafsil →
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenRegisterWithCourse(course.title)}
                    className="gold-gradient-btn px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider cursor-pointer shadow-md shadow-[#D9A93A]/20"
                  >
                    Yozilish
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          5. WHY LUMOS SECTION (AFZALLIKLARIMIZ)
          ------------------------------------------------------------------------- */}
      <section id="why-us" className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1380px] mx-auto relative z-20">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16090D] border border-[#D9A93A]/35 text-xs font-bold text-[#F3D276]">
            <ShieldCheck className="h-4 w-4 text-[#D9A93A]" />
            <span>AFZALLIKLARIMIZ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury-serif font-black text-[#F7F4EE]">
            Nega aynan Lumos?
          </h2>
          <p className="text-sm sm:text-base text-[#D4C8BE] max-w-2xl mx-auto">
            Biz shunchaki dars o‘tmaymiz — har bir o‘quvchining ichki salohiyatini kashf etib, nufuzli oliygohlar va xalqaro marralar tomon yetaklaymiz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Kuchli ustozlar',
              desc: 'Tajribali va natijaga yo‘naltirilgan yetakchi mentorlar. Har bir o‘qituvchimiz xalqaro toifadagi sertifikatlarga ega.',
              icon: Users,
            },
            {
              title: 'Zamonaviy metodika',
              desc: 'O‘quvchilar uchun qulay, interaktiv va samarali ta’lim tizimi. Zerikarli qoidalar o‘rniga amaliy yondashuv.',
              icon: Sparkles,
            },
            {
              title: 'Real natijalar',
              desc: 'O‘quvchilarimizning natijalari bizning asosiy mezonimizdir. DTM maksimal ballari va IELTS 7.5+ ko‘rsatkichlari.',
              icon: TrendingUp,
            },
            {
              title: 'Individual yondashuv',
              desc: 'Har bir o‘quvchining darajasi va maqsadiga mos yondashuv. Savollarni erkin berish va har bir mavzuni 100% mustahkamlash.',
              icon: HeartHandshake,
            },
            {
              title: 'Shaffof monitoring',
              desc: 'Har bir darsdan so‘ng ota-onalarga avtomatik Telegram xabarnomasi: davomat, darsdagi faollik va o‘zlashtirish nazorati.',
              icon: MessageCircle,
            },
            {
              title: 'Kichik guruhlar (10-12 kishi)',
              desc: 'Guruhlarda o‘quvchilar soni qat’iy chegaralangan, bu esa ustozning to‘liq e’tiborini va erkin savol-javobni kafolatlaydi.',
              icon: ShieldCheck,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl p-7 bg-[#16090D]/80 hover:bg-[#220B12]/90 border border-[#D9A93A]/25 hover:border-[#D9A93A]/60 shadow-lg hover:shadow-2xl transition-all duration-300 space-y-4 group text-left"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D9A93A]/15 border border-[#D9A93A]/35 text-[#D9A93A] group-hover:scale-110 group-hover:bg-[#D9A93A] group-hover:text-[#080607] transition-all">
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-luxury-serif font-black text-[#F7F4EE] group-hover:text-[#F3D276] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#A9A3A0] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          6. RESULTS / ACHIEVEMENTS SECTION (Interactive Student Success Stories)
          ------------------------------------------------------------------------- */}
      <section id="results" className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1380px] mx-auto relative z-20">
        <div className="p-8 sm:p-12 rounded-[36px] bg-gradient-to-b from-[#1C0A10] to-[#080607] border border-[#D9A93A]/35 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D9A93A]/10 blur-[120px] pointer-events-none rounded-full" />

          <div className="text-center space-y-3 mb-12 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#080607] border border-[#D9A93A]/30 text-xs font-bold text-[#F3D276]">
              <Award className="h-4 w-4 text-[#D9A93A]" />
              <span>ISBOTLANGAN NATIJALAR</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury-serif font-black text-[#F7F4EE]">
              Bizning Faxrli Natijalarimiz
            </h2>
            <p className="text-sm sm:text-base text-[#D4C8BE] max-w-2xl mx-auto">
              Lumos bitiruvchilarining yutuqlari — bizning haqiqiy yuzimiz va mashaqqatli mehnatimiz mevasidir.
            </p>
          </div>

          {/* 4 Featured Achievements Cards with Before / After */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
            {[
              {
                badge: 'DTM 189.0 BALL',
                student: 'Bekzod Rahmonov',
                achievement: 'Toshkent Davlat Yuridik Universiteti',
                detail: '100% Davlat Granti',
                beforeAfter: 'Boshlang‘ich: 72 ball → Yakuniy: 189.0 ball',
                teacher: 'Hadicha ustoz shogirdi',
                color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/40',
              },
              {
                badge: 'IELTS BAND 8.0',
                student: 'Madina Karimova',
                achievement: 'Listening 8.5, Reading 8.5',
                detail: 'Xalqaro Grant Sohibasi',
                beforeAfter: 'Boshlang‘ich: 4.5 Band → Yakuniy: 8.0 Band',
                teacher: 'Hasanboy ustoz shogirdi',
                color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/40',
              },
              {
                badge: 'RESPUBLIKA 1-O‘RINI',
                student: 'Jasur Shokirov',
                achievement: 'Al-Xorazmiy Olimpiadasi',
                detail: 'Oltin Medal Sohibi',
                beforeAfter: 'Tuman bosqichi → Respublika Absolyut G‘olibi',
                teacher: 'Hadicha ustoz shogirdi',
                color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40',
              },
              {
                badge: 'PREZIDENT MAKTABI',
                student: 'Fotima Zokirova',
                achievement: '96 Ball bilan Qabul',
                detail: 'Eng Yuqori Ko‘rsatkich',
                beforeAfter: 'Diagnostika: 48 ball → Imtihon: 96 ball',
                teacher: 'Lumos Murabbiylar Guruhi',
                color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/40',
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl bg-[#080607]/85 border ${card.color} space-y-3 relative group hover:-translate-y-1.5 transition-transform text-left`}
              >
                <div className="inline-block px-3 py-1 rounded-full bg-[#D9A93A]/20 text-[10px] font-black text-[#F3D276] tracking-wider uppercase">
                  {card.badge}
                </div>
                <div>
                  <h4 className="text-base font-black text-[#F7F4EE]">{card.student}</h4>
                  <p className="text-xs text-[#D9A93A] font-semibold mt-0.5">{card.achievement}</p>
                  <p className="text-[11px] text-[#A9A3A0] mt-1">{card.detail}</p>
                </div>
                <div className="p-2 rounded-xl bg-white/5 text-[10px] text-[#F3D276] font-mono">
                  {card.beforeAfter}
                </div>
                <div className="pt-2 border-t border-white/5 text-[10px] font-semibold text-[#A9A3A0]">
                  {card.teacher}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          7. TEACHERS SECTION (Profile Cards + Modal Trigger)
          ------------------------------------------------------------------------- */}
      <section id="teachers" className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1380px] mx-auto relative z-20">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16090D] border border-[#D9A93A]/35 text-xs font-bold text-[#F3D276]">
            <Users className="h-4 w-4 text-[#D9A93A]" />
            <span>YETAKCHI PEDAGOGLAR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury-serif font-black text-[#F7F4EE]">
            Bizning ustozlar
          </h2>
          <p className="text-sm sm:text-base text-[#D4C8BE] max-w-2xl mx-auto">
            O‘z fanini chuqur sevadigan, yuksak natijalar yaratgan va har bir o‘quvchini yuksak marralarga yetaklaydigan tajribali pedagoglar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {teacherProfiles.map((tp, idx) => (
            <div
              key={idx}
              className="rounded-3xl p-8 bg-[#16090D]/85 hover:bg-[#220B12]/95 border border-[#D9A93A]/30 hover:border-[#D9A93A]/70 shadow-2xl space-y-6 group text-left transition-all duration-300"
            >
              <div className="flex items-center gap-5">
                <div className={`flex h-20 w-20 items-center justify-center rounded-2xl ${tp.gradient} text-[#080607] font-luxury-serif font-black text-3xl shadow-xl shadow-[#D9A93A]/20 group-hover:scale-105 transition-transform`}>
                  {tp.symbol}
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D9A93A]/15 border border-[#D9A93A]/30 text-[10px] font-black text-[#F3D276] uppercase">
                    {tp.badge}
                  </span>
                  <h3 className="text-2xl font-luxury-serif font-black text-[#F7F4EE] mt-1">
                    {tp.name}
                  </h3>
                  <p className="text-xs text-[#D9A93A] font-semibold">
                    {tp.role}
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#A9A3A0] leading-relaxed line-clamp-3">
                {tp.bio}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#D9A93A]/15 text-xs">
                <div>
                  <span className="text-[10px] text-[#A9A3A0] uppercase block">Dars kunlari:</span>
                  <span className="font-bold text-[#F7F4EE]">{tp.scheduleDays}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#A9A3A0] uppercase block">Dars vaqti:</span>
                  <span className="font-bold text-[#F7F4EE]">{tp.scheduleTime}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTeacherForModal(tp)}
                  className="px-4 py-3 rounded-full border border-[#D9A93A]/35 text-xs font-bold text-[#F7F4EE] hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Batafsil ma’lumot
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenRegisterWithCourse(tp.name)}
                  className="flex-1 gold-gradient-btn py-3 rounded-full text-xs font-black uppercase tracking-wider cursor-pointer shadow-md shadow-[#D9A93A]/20 flex items-center justify-center gap-2"
                >
                  <span>Guruhga yozilish</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          8. ABOUT LUMOS SECTION (Story, Mission & 3D Golden Timeline)
          ------------------------------------------------------------------------- */}
      <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1380px] mx-auto relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Academy Visual & Experience Badge */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#D9A93A]/40 shadow-2xl bg-[#14080B]">
              <img
                src={aboutAcademyImg}
                alt="Lumos Ta’lim Zali"
                className="w-full h-[380px] sm:h-[460px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080607] via-transparent to-black/40" />
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute -bottom-5 right-6 p-4 rounded-2xl bg-[#16090D]/95 backdrop-blur-xl border border-[#D9A93A]/50 shadow-2xl flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D9A93A] text-[#080607] font-black text-lg">
                ★
              </div>
              <div>
                <span className="text-sm font-black text-[#F7F4EE] block">10 Yillik Tajriba</span>
                <span className="text-[11px] text-[#A9A3A0]">Ilmiy va pedagogik yondashuv</span>
              </div>
            </div>
          </div>

          {/* Right Column: Mission, Vision & 3D Timeline */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16090D] border border-[#D9A93A]/35 text-xs font-bold text-[#F3D276]">
              <Compass className="h-4 w-4 text-[#D9A93A]" />
              <span>BIZNING MISSIYA</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury-serif font-black text-[#F7F4EE] leading-tight">
              Lumos — Maqsad sari ishonchli ta’lim makoni
            </h2>

            <p className="text-sm sm:text-base text-[#D4C8BE] leading-relaxed">
              LUMOS ta’lim markazi yoshlarni faqatgina imtihonlarga tayyorlash bilan cheklanmaydi. Biz har bir o‘quvchida mustaqil fikrlash, muammolarga yechim topish va o‘z kuchiga ishonch hissini shakllantiramiz.
            </p>

            {/* 3D Golden Timeline */}
            <div className="space-y-4 pt-2 border-t border-white/5">
              <span className="text-xs font-black uppercase text-[#D9A93A] tracking-wider block">
                Rivojlanish Bosqichlari (Timeline)
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-[#16090D] border border-[#D9A93A]/20">
                  <span className="text-[#F3D276] font-mono font-bold block">2014-yil</span>
                  <p className="text-[11px] text-[#A9A3A0] mt-0.5">Lumos akademiyasi tashkil topishi va birinchi 50 nafar o‘quvchi</p>
                </div>
                <div className="p-3 rounded-2xl bg-[#16090D] border border-[#D9A93A]/20">
                  <span className="text-[#F3D276] font-mono font-bold block">2018-yil</span>
                  <p className="text-[11px] text-[#A9A3A0] mt-0.5">Xalqaro IELTS metodikasi va bosh murabbiylar jamoasi shakllanishi</p>
                </div>
                <div className="p-3 rounded-2xl bg-[#16090D] border border-[#D9A93A]/20">
                  <span className="text-[#F3D276] font-mono font-bold block">2022-yil</span>
                  <p className="text-[11px] text-[#A9A3A0] mt-0.5">DTM va Prezident maktabiga tayyorlovda 95% grant ko‘rsatkichi</p>
                </div>
                <div className="p-3 rounded-2xl bg-[#16090D] border border-[#D9A93A]/20">
                  <span className="text-[#F3D276] font-mono font-bold block">2026-yil</span>
                  <p className="text-[11px] text-[#A9A3A0] mt-0.5">AI-quvvatlangan yangi avlod raqamli ta’lim platformasi</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setRegisterCourse('');
                  setRegisterBranch('');
                  setIsRegisterModalOpen(true);
                }}
                className="gold-gradient-btn px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#D9A93A]/20 cursor-pointer"
              >
                <span>Markaz bilan tanishish →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          9. BRANCHES SECTION (Interactive Selector & Map Link)
          ------------------------------------------------------------------------- */}
      <section id="branches" className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1380px] mx-auto relative z-20">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16090D] border border-[#D9A93A]/35 text-xs font-bold text-[#F3D276]">
            <MapPin className="h-4 w-4 text-[#D9A93A]" />
            <span>KAMPUSLAR VA FILIALLAR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury-serif font-black text-[#F7F4EE]">
            Filiallarimiz
          </h2>
          <p className="text-sm sm:text-base text-[#D4C8BE] max-w-2xl mx-auto">
            O‘zingizga eng yaqin bo‘lgan qulay filialni tanlang va birinchi bepul sinov darsimizda ishtirok eting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INITIAL_BRANCHES.map((b) => {
            const isSelected = selectedBranchId === b.id;
            return (
              <div
                key={b.id}
                onClick={() => setSelectedBranchId(b.id)}
                className={`rounded-3xl p-6 flex flex-col justify-between group text-left cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'bg-[#220B12] border-2 border-[#D9A93A] shadow-xl shadow-[#D9A93A]/20 scale-[1.02]'
                    : 'bg-[#16090D]/85 border border-[#D9A93A]/25 hover:border-[#D9A93A]/50 shadow-md'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#D9A93A]/15 border border-[#D9A93A]/30 text-[10px] font-black text-[#F3D276] uppercase">
                      {b.city}
                    </span>
                    <span className="text-[10px] font-bold text-[#10B981] flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                      Faol
                    </span>
                  </div>

                  <h3 className="text-lg font-luxury-serif font-black text-[#F7F4EE] group-hover:text-[#F3D276] transition-colors leading-snug">
                    {b.name}
                  </h3>

                  <p className="text-xs text-[#A9A3A0] flex items-start gap-2 pt-1">
                    <MapPin className="h-4 w-4 text-[#D9A93A] shrink-0 mt-0.5" />
                    <span>{b.address}</span>
                  </p>

                  <p className="text-xs text-[#A9A3A0] flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-[#D9A93A] shrink-0" />
                    <span className="font-mono">{b.phone}</span>
                  </p>

                  <p className="text-[11px] text-[#A9A3A0] flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-[#D9A93A] shrink-0" />
                    <span>Dush - Shan: 08:00 - 20:00</span>
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-white/5 flex items-center justify-between">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(b.address + ' ' + b.city)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-bold text-[#F3D276] hover:underline flex items-center gap-1"
                  >
                    <span>Xaritada ko‘rish</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenRegisterWithBranch(b.name);
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-[#080607] border border-[#D9A93A]/35 text-[11px] font-bold text-[#F7F4EE] hover:border-[#D9A93A] hover:text-[#F3D276] transition-colors cursor-pointer"
                  >
                    Tanlash
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          10. FAQ ACCORDION SECTION (Category Filter + Live Search)
          ------------------------------------------------------------------------- */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-20">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16090D] border border-[#D9A93A]/35 text-xs font-bold text-[#F3D276]">
            <HelpCircle className="h-4 w-4 text-[#D9A93A]" />
            <span>SAVOLLAR VA JAVOBLAR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury-serif font-black text-[#F7F4EE]">
            Ko‘p beriladigan savollar
          </h2>
          <p className="text-sm sm:text-base text-[#D4C8BE]">
            Ota-onalar va o‘quvchilarimiz tomonidan eng ko‘p beriladigan muhim savollarga aniq javoblar.
          </p>
        </div>

        {/* FAQ Search Box */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#D9A93A]" />
          <input
            type="text"
            value={faqSearch}
            onChange={(e) => setFaqSearch(e.target.value)}
            placeholder="Savolingiz bo‘yicha qidiring..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#16090D] border border-[#D9A93A]/30 text-xs text-[#F7F4EE] placeholder-[#A9A3A0]/60 focus:border-[#D9A93A] outline-none"
          />
        </div>

        {/* FAQ Category Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {[
            { id: 'all', label: 'Barchasi' },
            { id: 'general', label: 'Umumiy' },
            { id: 'courses', label: 'Kurslar' },
            { id: 'payments', label: 'To‘lovlar' },
            { id: 'lessons', label: 'Dars jarayoni' },
            { id: 'branches', label: 'Filiallar' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFaqCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer select-none whitespace-nowrap ${
                faqCategory === cat.id
                  ? 'bg-[#D9A93A] text-[#080607]'
                  : 'bg-[#16090D] border border-[#D9A93A]/25 text-[#A9A3A0] hover:text-[#F7F4EE]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion Questions */}
        <div className="space-y-4 text-left">
          {filteredFaq.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#16090D]/90 border border-[#D9A93A]/25 overflow-hidden transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-[#F7F4EE]">
                    {item.q}
                  </span>
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full bg-[#080607] border border-[#D9A93A]/30 text-[#D9A93A] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#D9A93A] text-[#080607]' : ''
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#A9A3A0] leading-relaxed border-t border-white/5 animate-in fade-in duration-200">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaq.length === 0 && (
            <div className="text-center py-8 text-xs text-[#A9A3A0]">
              Mos keluvchi savollar topilmadi.
            </div>
          )}
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          11. FINAL POWERFUL CALL-TO-ACTION SECTION (Golden Glow)
          ------------------------------------------------------------------------- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1380px] mx-auto relative z-20">
        <div className="relative rounded-[36px] p-10 sm:p-16 text-center bg-gradient-to-b from-[#1C0A10] via-[#1C0A10] to-[#080607] border-2 border-[#D9A93A]/40 shadow-[0_20px_80px_rgba(0,0,0,0.9)] overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#D9A93A]/15 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#080607] border border-[#D9A93A]/40 text-xs font-bold text-[#F3D276]">
              <Sparkles className="h-3.5 w-3.5 text-[#D9A93A]" />
              <span>YANGI O‘QUV MAVSUMIGA QABUL DAVOM ETMOQDA</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury-serif font-black text-[#F7F4EE] leading-tight">
              Kelajagingiz uchun birinchi qadamni bugun tashlang.
            </h2>

            <p className="text-sm sm:text-base text-[#D4C8BE] max-w-2xl mx-auto leading-relaxed">
              Lumos bilan bilim, rivojlanish va natija sari harakat qiling. Hoziroq ro‘yxatdan o‘ting va birinchi bepul sinov darsimizga taklifnoma oling!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="#courses"
                className="w-full sm:w-auto gold-gradient-btn px-9 py-4 rounded-full text-sm font-black shadow-xl shadow-[#D9A93A]/30 flex items-center justify-center gap-2"
              >
                <span>Kurslarni ko‘rish</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={() => {
                  setRegisterCourse('');
                  setRegisterBranch('');
                  setIsRegisterModalOpen(true);
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-full text-sm font-bold text-[#F7F4EE] hover:text-[#F3D276] bg-[#080607] border border-[#D9A93A]/40 hover:border-[#D9A93A] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Ro‘yxatdan o‘tish</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------
          12. LUXURY FOOTER (Newsletter + Comprehensive Directory)
          ------------------------------------------------------------------------- */}
      <footer className="bg-[#050304] border-t border-[#D9A93A]/20 pt-16 pb-12 px-4 sm:px-6 lg:px-8 relative z-20 text-xs text-[#A9A3A0]">
        <div className="max-w-[1380px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5 text-left">
          {/* Col 1: Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <LumosLogo size="lg" />
            <p className="text-xs text-[#A9A3A0] leading-relaxed max-w-sm pt-2">
              Lumos — zamonaviy metodika, tajribali ustozlar va yuqori natijadorlikni birlashtirgan yetakchi raqamli ta’lim platformasi.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2 space-y-2 max-w-sm">
              <span className="text-[11px] font-bold uppercase text-[#D9A93A] tracking-wider block">
                Oylik ilmiy yangiliklarga obuna bo‘ling
              </span>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Email manzilingiz..."
                  className="flex-1 px-4 py-2 rounded-full bg-[#16090D] border border-[#D9A93A]/30 text-xs text-[#F7F4EE] placeholder-[#A9A3A0]/50 focus:border-[#D9A93A] outline-none"
                />
                <button
                  type="submit"
                  className="gold-gradient-btn px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider shrink-0"
                >
                  Obuna
                </button>
              </form>
              {newsletterSuccess && (
                <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Rahmat! Siz muvaffaqiyatli obuna bo‘ldingiz.
                </p>
              )}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://t.me/lumos_edu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#16090D] border border-[#D9A93A]/35 text-[#D9A93A] hover:bg-[#D9A93A] hover:text-[#080607] transition-colors"
                title="Telegram"
              >
                <Send className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com/lumos_edu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#16090D] border border-[#D9A93A]/35 text-[#D9A93A] hover:bg-[#D9A93A] hover:text-[#080607] transition-colors"
                title="Instagram"
              >
                <Star className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigatsiya */}
          <div className="space-y-3">
            <h5 className="font-luxury-serif font-bold text-sm text-[#F7F4EE] uppercase tracking-wider">
              Navigatsiya
            </h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#F3D276] transition-colors">Bosh sahifa</a></li>
              <li><a href="#courses" className="hover:text-[#F3D276] transition-colors">Kurslarimiz</a></li>
              <li><a href="#why-us" className="hover:text-[#F3D276] transition-colors">Nega Lumos?</a></li>
              <li><a href="#results" className="hover:text-[#F3D276] transition-colors">Natijalar</a></li>
              <li><a href="#teachers" className="hover:text-[#F3D276] transition-colors">O‘qituvchilar</a></li>
              <li><a href="#about" className="hover:text-[#F3D276] transition-colors">Biz haqimizda</a></li>
            </ul>
          </div>

          {/* Col 3: Kurslar */}
          <div className="space-y-3">
            <h5 className="font-luxury-serif font-bold text-sm text-[#F7F4EE] uppercase tracking-wider">
              Kurslar
            </h5>
            <ul className="space-y-2">
              <li><a href="#courses" className="hover:text-[#F3D276] transition-colors">Matematika & DTM</a></li>
              <li><a href="#courses" className="hover:text-[#F3D276] transition-colors">IELTS Intensive 8.0+</a></li>
              <li><a href="#courses" className="hover:text-[#F3D276] transition-colors">General English</a></li>
              <li><a href="#courses" className="hover:text-[#F3D276] transition-colors">Frontend & IT Asoslari</a></li>
              <li><a href="#courses" className="hover:text-[#F3D276] transition-colors">Prezident Maktabiga Tayyorlov</a></li>
            </ul>
          </div>

          {/* Col 4: Bog‘lanish */}
          <div className="space-y-3">
            <h5 className="font-luxury-serif font-bold text-sm text-[#F7F4EE] uppercase tracking-wider">
              Bog‘lanish
            </h5>
            <p className="text-xs text-[#A9A3A0]">
              Toshkent sh., Amir Temur shox ko‘chasi, 108
            </p>
            <p className="text-xs font-mono font-bold text-[#F3D276]">
              +998 (71) 200-00-25
            </p>
            <p className="text-xs text-[#A9A3A0]">
              Dush - Shan: 08:00 - 20:00
            </p>
          </div>
        </div>

        <div className="max-w-[1380px] mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#A9A3A0]">
          <p>© {new Date().getFullYear()} LUMOS Ta’lim Markazi. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-4">
            <a href="#/login" className="hover:text-[#D9A93A] transition-colors font-semibold">Tizimga Kirish</a>
            <span>•</span>
            <a href="#/admin" className="hover:text-[#D9A93A] transition-colors font-semibold">Boshqaruv Paneli</a>
          </div>
        </div>
      </footer>

      {/* -------------------------------------------------------------------------
          13. MODALS INTEGRATION (Search Overlay, Multi-Step Register, Diagnostic, etc.)
          ------------------------------------------------------------------------- */}
      <WebsiteSearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        courses={INITIAL_COURSES}
        teachers={INITIAL_TEACHERS}
        branches={INITIAL_BRANCHES}
        faqList={rawFaqList}
        onSelectCourse={(c) => setSelectedCourseForDetails(c)}
        onSelectTeacher={(name) => {
          const matched = teacherProfiles.find((tp) => tp.name.includes(name) || name.includes(tp.name));
          if (matched) setSelectedTeacherForModal(matched);
        }}
        onSelectBranch={(name) => {
          const el = document.getElementById('branches');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

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
        branches={INITIAL_BRANCHES}
        initialCourseTitle={registerCourse}
        initialBranchName={registerBranch}
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
