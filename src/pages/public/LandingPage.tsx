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
  LogIn,
  ExternalLink,
  HelpCircle,
  Search,
  Check,
  CheckCircle,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { DiagnosticTestModal } from '../../components/modals/DiagnosticTestModal';
import { CourseDetailsModal } from '../../components/modals/CourseDetailsModal';
import { useI18n } from '../../lib/i18n';
import { useCRM } from '../../context/CRMContext';
import { useLMS } from '../../context/LMSContext';
import { INITIAL_COURSES } from '../../data/coursesData';
import { INITIAL_TEACHERS } from '../../data/initialData';
import { INITIAL_BRANCHES } from '../../data/branchesData';
import { Course } from '../../types/admin';
import { fireCelebrationConfetti } from '../../services/paymentGatewayService';
import { sendTelegramMessage, formatLeadApplicationMessage } from '../../services/telegramService';
import { sendEskizSms } from '../../services/eskizSmsService';
import lumosLogo from '../../assets/lumos-logo.png';

export const LandingPage: React.FC = () => {
  const { t, language, setLanguage, formatMoney } = useI18n();
  const { settings, addStudent } = useCRM();
  const { currentUser, currentRole } = useLMS();

  // Navigation scroll detection for glass elevation
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState(false);
  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<Course | null>(null);

  // Course Filter state
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive FAQ Accordion state (inspired by aplusacademy.uz)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Quick Application Form state
  const [selectedCourseName, setSelectedCourseName] = useState('Matematika (Hadicha ustoz)');
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantBranch, setApplicantBranch] = useState(INITIAL_BRANCHES[0].name);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animated counters
  const [counterStudents, setCounterStudents] = useState(380);
  const [counterRate, setCounterRate] = useState(88);

  useEffect(() => {
    document.title =
      language === 'ru'
        ? 'LUMOS Учебный Центр — К светлому будущему со знаниями!'
        : language === 'en'
        ? 'LUMOS Academy — Toward a Brighter Future with Knowledge!'
        : 'LUMOS Ta’lim Markazi — Bilim Bilan Yorqin Kelajakka!';

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const timer = setInterval(() => {
      setCounterStudents((prev) => (prev < 520 ? prev + 7 : 520));
      setCounterRate((prev) => (prev < 98 ? prev + 1 : 98));
    }, 45);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, [language]);

  // Categories mapped to translation keys
  const categoryFilters = [
    { key: 'all', label: t.landing.catAll },
    { key: 'math', label: t.landing.catMath },
    { key: 'english', label: t.landing.catEnglish },
    { key: 'ielts', label: t.landing.catIelts },
    { key: 'it', label: t.landing.catIt },
    { key: 'school', label: t.landing.catSchool },
    { key: 'abiturient', label: t.landing.catAbiturient },
  ];

  const filteredCourses = useMemo(() => {
    return INITIAL_COURSES.filter((course) => {
      let matchCat = true;
      if (selectedCategoryKey === 'math') matchCat = course.category.toLowerCase().includes('matem') || course.title.toLowerCase().includes('matem');
      else if (selectedCategoryKey === 'english') matchCat = course.category.toLowerCase().includes('ingliz') || course.title.toLowerCase().includes('ingliz');
      else if (selectedCategoryKey === 'ielts') matchCat = course.category.toLowerCase().includes('ielts') || course.title.toLowerCase().includes('ielts');
      else if (selectedCategoryKey === 'it') matchCat = course.category.toLowerCase().includes('it') || course.title.toLowerCase().includes('frontend');
      else if (selectedCategoryKey === 'school') matchCat = course.category.toLowerCase().includes('maktab') || course.title.toLowerCase().includes('maktab');
      else if (selectedCategoryKey === 'abiturient') matchCat = course.category.toLowerCase().includes('abitur') || course.title.toLowerCase().includes('dtm');

      const matchSearch =
        !searchQuery.trim() ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.instructor && course.instructor.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCat && matchSearch;
    });
  }, [selectedCategoryKey, searchQuery]);

  const handlePhoneFormat = (val: string) => {
    let cleaned = val.replace(/\D/g, '');
    if (!cleaned.startsWith('998')) {
      cleaned = '998' + cleaned;
    }
    cleaned = cleaned.slice(0, 12);

    let formatted = '+998';
    if (cleaned.length > 3) formatted += ' (' + cleaned.substring(3, 5);
    if (cleaned.length >= 5) formatted += ') ' + cleaned.substring(5, 8);
    if (cleaned.length >= 8) formatted += '-' + cleaned.substring(8, 10);
    if (cleaned.length >= 10) formatted += '-' + cleaned.substring(10, 12);

    setApplicantPhone(formatted);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || applicantPhone.length < 18) return;

    setIsSubmitting(true);
    try {
      const isMath = selectedCourseName.toLowerCase().includes('matematika');
      addStudent({
        fullName: applicantName.trim(),
        avatar: '',
        birthDate: '2008-01-01',
        gender: 'Male',
        phone: applicantPhone.trim(),
        email: `${applicantName.toLowerCase().replace(/\s+/g, '.')}@lumos.uz`,
        parentName: applicantName.trim(),
        parentPhone: applicantPhone.trim(),
        groupId: isMath ? 'GRP-01' : 'GRP-02',
        groupName: selectedCourseName,
        teacherId: isMath ? 'TCH-01' : 'TCH-02',
        teacherName: isMath ? 'Hadicha ustoz' : 'Hasanboy ustoz',
        monthlyFee: 250000,
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0],
        notes: `Veb-saytdan ariza: ${selectedCourseName || 'Umumiy'}. Filial: ${applicantBranch}`,
      });

      // 1. Notify Management via Telegram Bot
      if (settings.telegramBotToken && settings.telegramChatId) {
        const leadText = formatLeadApplicationMessage({
          fullName: applicantName.trim(),
          phone: applicantPhone.trim(),
          subject: `${selectedCourseName} (${applicantBranch})`,
          source: 'LUMOS Asosiy Veb-sayti',
          centerName: settings.centerName,
        });
        sendTelegramMessage(
          settings.telegramBotToken,
          settings.telegramChatId,
          leadText
        ).catch((err) => console.warn('Telegram lead notification error:', err));
      }

      // 2. Send SMS confirmation to applicant if Eskiz is configured
      if (settings.eskizToken || settings.eskizEmail) {
        sendEskizSms({
          phone: applicantPhone.trim(),
          message: `${settings.centerName}: Hurmatli ${applicantName.trim()}! Sizning arizangiz qabul qilindi. 1-bepul sinov darsi vaqti bo‘yicha tez orada bog‘lanamiz. Tel: ${settings.phone}`,
          token: settings.eskizToken,
          email: settings.eskizEmail,
          password: settings.eskizPassword,
          from: settings.eskizFrom,
        }).catch((err) => console.warn('SMS lead acknowledgment error:', err));
      }

      fireCelebrationConfetti();
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setIsApplyModalOpen(false);
        setApplicantName('');
        setApplicantPhone('');
      }, 2200);
    } catch (error) {
      console.error('Ariza topshirishda xatolik:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEnrollmentForCourse = (courseTitle: string) => {
    setSelectedCourseName(courseTitle);
    setIsApplyModalOpen(true);
  };

  return (
    <div className="min-h-screen font-sans bg-[#F8FAFC] dark:bg-[#050816] text-slate-900 dark:text-slate-100 antialiased selection:bg-amber-500 selection:text-white transition-colors duration-300">
      {/* ─────────────────────────────────────────────────────────────
          1. ACTIVE SESSION TOP BAR (DISCREET GLASS BANNER)
      ───────────────────────────────────────────────────────────── */}
      {currentUser && (
        <div className="sticky top-0 z-50 bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-md border-b border-amber-500/20 px-4 py-2 text-white text-xs font-semibold shadow-md">
          <div className="mx-auto max-w-7xl flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300">{t.common.active}:</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
                {currentUser.name}
              </span>
              <span className="text-slate-400 text-[11px]">
                ({currentRole === 'admin' ? t.roles.superAdmin : currentRole === 'teacher' ? t.roles.teacher : t.roles.student})
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                window.location.hash = currentRole === 'student' ? '#/student' : '#/dashboard';
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 px-3.5 py-1 text-xs font-bold text-slate-950 shadow-sm hover:from-amber-400 hover:to-yellow-400 active:scale-95 transition-all cursor-pointer"
            >
              <span>{currentRole === 'student' ? t.landing.returnToStudentCabinet : t.landing.returnToAdminDashboard}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. STICKY GLASSMORPHISM NAVBAR (ELEVATES ON SCROLL)
      ───────────────────────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'border-b border-slate-200/80 bg-white/85 dark:border-slate-800/80 dark:bg-[#050816]/90 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/40'
            : 'border-b border-slate-200/50 bg-white/60 dark:border-white/5 dark:bg-[#050816]/60 backdrop-blur-md'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500/20 via-yellow-500/10 to-amber-300/20 p-2 border border-amber-400/40 shadow-sm shadow-amber-500/15 group-hover:scale-105 group-hover:border-amber-400 transition-all duration-200">
              <img
                src={lumosLogo}
                alt="LUMOS"
                className="h-full w-full object-contain filter drop-shadow-sm"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-serif">
                  LUMOS
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              </div>
              <span className="block text-[9px] sm:text-[10px] uppercase tracking-widest text-amber-600 dark:text-amber-400 font-black -mt-0.5">
                {language === 'ru' ? 'Учебный Центр' : language === 'en' ? 'Education Academy' : 'Ta’lim Markazi'}
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
            {[
              { label: t.landing.navCourses, href: '#courses' },
              { label: t.landing.navResults, href: '#results' },
              { label: t.landing.navTeachers, href: '#teachers' },
              { label: t.landing.navBranches, href: '#branches' },
              { label: t.landing.navWhyUs, href: '#why-us' },
              { label: t.landing.navFaq, href: '#faq' },
              { label: t.landing.navReviews, href: '#reviews' },
              { label: t.landing.navContact, href: '#contact' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3 py-1.5 rounded-xl hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Controls: Theme + Language + CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <div className="hidden sm:block">
              <ThemeToggle variant="segmented" />
            </div>
            <div className="sm:hidden">
              <ThemeToggle variant="cycle" />
            </div>

            {/* Language Switcher (UZ, RU, EN) */}
            <div className="flex items-center rounded-xl border border-slate-200/90 bg-slate-100/90 p-0.5 text-[11px] font-black dark:border-slate-800 dark:bg-slate-900/90 shadow-xs">
              {(['uz', 'ru', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`rounded-lg px-2 sm:px-2.5 py-1 uppercase transition-all cursor-pointer font-black ${
                    language === lang
                      ? 'bg-white text-amber-600 dark:bg-slate-800 dark:text-amber-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Portal Entry Button */}
            <button
              type="button"
              onClick={() => {
                if (currentUser) {
                  window.location.hash = currentRole === 'student' ? '#/student' : '#/dashboard';
                } else {
                  window.location.hash = '#/admin';
                }
              }}
              className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-3.5 sm:px-4 py-2 text-xs shadow-md shadow-amber-500/20 border border-amber-300/50 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all cursor-pointer select-none"
            >
              <span>{currentUser ? (currentRole === 'student' ? t.landing.returnToStudentCabinet : t.landing.returnToAdminDashboard) : t.landing.loginCta}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`flex lg:hidden h-10 w-10 items-center justify-center rounded-xl border transition-all cursor-pointer ${
                isMobileMenuOpen
                  ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'border-slate-200/80 bg-white/90 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:bg-slate-800'
              }`}
              aria-label="Menyu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200/80 bg-white/98 backdrop-blur-2xl dark:border-slate-800/80 dark:bg-[#050816]/98 px-4 sm:px-6 py-5 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            {/* Navigation Links */}
            <nav className="flex flex-col space-y-1 pt-1">
              {[
                { name: t.landing.navCourses, href: '#courses' },
                { name: t.landing.diagnosticHeroBtn, action: () => setIsDiagnosticModalOpen(true) },
                { name: t.landing.navResults, href: '#results' },
                { name: t.landing.navTeachers, href: '#teachers' },
                { name: t.landing.navBranches, href: '#branches' },
                { name: t.landing.navWhyUs, href: '#why-us' },
                { name: t.landing.navFaq, href: '#faq' },
                { name: t.landing.navReviews, href: '#reviews' },
                { name: t.landing.navContact, href: '#contact' },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href || '#'}
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    if (item.action) {
                      e.preventDefault();
                      item.action();
                    }
                  }}
                  className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  <span>{item.name}</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </a>
              ))}
            </nav>

            {/* Portal Logins */}
            <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800/70 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.location.hash = '#/admin';
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 py-3 text-xs font-black text-slate-950 shadow-md active:scale-98 transition-all cursor-pointer"
                >
                  <LogIn className="h-4 w-4" />
                  <span>{t.landing.adminTeacherPortal}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.location.hash = '#/student';
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 py-3 text-xs font-black text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  <GraduationCap className="h-4 w-4" />
                  <span>{t.landing.studentCabinet}</span>
                </button>
              </div>

              {/* Call shortcut */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                <span>{language === 'ru' ? 'Есть вопросы?' : language === 'en' ? 'Have questions?' : 'Savollar bormi?'}</span>
                <a
                  href="tel:+998712000025"
                  className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1.5 font-mono"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>+998 (71) 200-00-25</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ─────────────────────────────────────────────────────────────
          3. HERO SECTION (HIGH-CONVERTING & MODERN AMBIENT GLOW)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
        {/* Ambient background glow layers */}
        <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
          <div className="h-[520px] w-[800px] rounded-full bg-gradient-to-tr from-amber-500/15 via-blue-500/10 to-indigo-600/10 blur-[150px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8 space-y-7">
          {/* Pulsating Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-amber-400/40 bg-amber-500/10 px-4 py-1.5 backdrop-blur-md shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
              {t.landing.badge}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="mx-auto max-w-4xl text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-slate-900 dark:text-white">
            {t.landing.heroTitle}{' '}
            <span className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 bg-clip-text text-transparent drop-shadow-xs">
              {t.landing.heroHighlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {t.landing.heroSubtitle}
          </p>

          {/* Dual Main CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
            <a
              href="#courses"
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-8 py-3.5 text-sm shadow-xl shadow-amber-500/25 border border-amber-300/60 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all cursor-pointer select-none"
            >
              <span>{t.landing.navCourses}</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <button
              type="button"
              onClick={() => setIsDiagnosticModalOpen(true)}
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-extrabold border border-slate-200/90 dark:border-slate-700/80 px-7 py-3.5 text-sm shadow-lg shadow-black/5 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all cursor-pointer select-none group"
            >
              <Sparkles className="h-4 w-4 text-amber-500 group-hover:rotate-12 transition-transform" />
              <span>{t.landing.diagnosticHeroBtn}</span>
            </button>
          </div>

          {/* Trust points row */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{t.landing.trustSmallGroups}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{t.landing.trustFreeTrial}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>{t.landing.trustMonthlyFee}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. STATS BAR (CREDIBLE & FOCUSED)
      ───────────────────────────────────────────────────────────── */}
      <section id="stats" className="border-y border-slate-200/80 bg-white py-10 sm:py-12 dark:border-slate-800/80 dark:bg-slate-900/60 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            <div className="text-center space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-amber-500 font-mono">
                {counterStudents}+
              </span>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                {t.landing.studentsCount}
              </p>
            </div>
            <div className="text-center space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-emerald-500 font-mono">
                {counterRate}%
              </span>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                {t.landing.successRate}
              </p>
            </div>
            <div className="text-center space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-blue-500 font-mono">4</span>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                {t.landing.branchesBadge}
              </p>
            </div>
            <div className="text-center space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">4.9 ★</span>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                {t.landing.satisfactionRate}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. COURSES DISCOVERY & FILTERS
      ───────────────────────────────────────────────────────────── */}
      <section id="courses" className="py-20 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-3">
            <Badge variant="warning" size="md">
              {t.landing.coursesBadge}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {t.landing.coursesTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              {t.landing.coursesSubtitle}
            </p>
          </div>

          {/* Category Filter Pills & Search Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-thin">
              {categoryFilters.map((cat) => {
                const isSelected = selectedCategoryKey === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setSelectedCategoryKey(cat.key)}
                    className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400/50'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.landing.searchPlaceholder}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCourses.map((course) => {
              return (
                <div
                  key={course.id}
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90"
                >
                  <div className="space-y-4">
                    {/* Header tags */}
                    <div className="flex items-center justify-between">
                      <span className="rounded-xl bg-amber-500/10 px-3 py-1 text-[11px] font-black uppercase text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {course.category}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                        {course.durationMonths} {t.landing.courseDurationMonths}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400 transition-colors">
                        {course.title}
                      </h3>
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    {/* Schedule & Teacher Info */}
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3.5 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">{t.landing.teacherLabel}</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400 truncate max-w-[170px]">
                          {course.instructor || 'Yetakchi mutaxassis'}
                        </span>
                      </div>
                      {course.schedule && (
                        <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                          <span className="text-slate-500 dark:text-slate-400 font-medium">{t.landing.scheduleLabel}</span>
                          <span className="font-semibold text-[11px] text-slate-800 dark:text-slate-200">
                            {course.schedule}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Syllabus snippet */}
                    <div className="space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800 text-xs">
                      {course.syllabus.slice(0, 3).map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-snug text-[11px] truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{t.landing.monthlyFeeLabel}</span>
                      <p className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 font-mono">
                        {formatMoney(course.pricePerMonth, 'UZS')}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCourseForDetails(course)}
                        className="w-full py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer text-center"
                      >
                        {t.landing.courseDetailsBtn}
                      </button>

                      <button
                        type="button"
                        onClick={() => openEnrollmentForCourse(course.title)}
                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer text-center"
                      >
                        {t.landing.courseEnrollBtn}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. RESULTS & ACHIEVEMENTS (NATIJALAR & ISHONCH)
      ───────────────────────────────────────────────────────────── */}
      <section id="results" className="border-t border-slate-200/80 bg-white py-20 dark:border-slate-800/80 dark:bg-slate-900/40 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="success" size="md">
              {t.landing.resultsBadge}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {t.landing.resultsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              {t.landing.resultsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'DTM 189.0 Ball (Maksimal)',
                student: 'Farrux Rustamov',
                details: 'Toshkent Davlat Yuridik Universiteti (Davlat Granti)',
                badge: '100% Grant',
                tag: 'Matematika',
                year: '2024 Bitiruvchisi',
              },
              {
                title: 'IELTS Band 8.0',
                student: 'Zilola Karimova',
                details: 'Listening 8.5, Reading 8.5, Speaking 7.5, Writing 7.0',
                badge: 'C1 Professional',
                tag: 'Ingliz tili (IELTS)',
                year: 'Hasanboy ustoz shogirdi',
              },
              {
                title: 'Matematika Respublika 1-o‘rin',
                student: 'Amirbek Yo‘ldoshev',
                details: 'Al-Xorazmiy olimpiadasida oltin medal sohibi',
                badge: 'Oltin Medal',
                tag: 'Olimpiada',
                year: 'Hadicha ustoz shogirdi',
              },
              {
                title: 'Prezident Maktabiga Qabul',
                student: 'Madinabonu Sobirova',
                details: 'Critical Thinking va Mantiqiy matematika bo‘yicha 96 ball',
                badge: 'Prezident Maktabi',
                tag: 'Tayyorlov',
                year: '2024 Qabuli',
              },
            ].map((res, i) => (
              <div
                key={i}
                className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4 flex flex-col justify-between hover:-translate-y-1 transition-transform"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {res.badge}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{res.tag}</span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
                    {res.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {res.details}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-slate-900 dark:text-white block">
                      {res.student}
                    </span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                      {res.year}
                    </span>
                  </div>
                  <Award className="h-5 w-5 text-amber-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. EXPERT INSTRUCTORS (HADICHA USTOZ & HASANBOY USTOZ)
      ───────────────────────────────────────────────────────────── */}
      <section id="teachers" className="py-20 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="info" size="md">
              {t.landing.teachersBadge}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {t.landing.teachersTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              {t.landing.teachersSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* 1. Hadicha ustoz */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-600/30 via-yellow-500/20 to-amber-300/30 border border-amber-400/50 text-amber-500 dark:text-amber-400 font-serif font-black text-2xl shadow-md">
                    H
                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500 text-slate-950 text-[10px] font-black">
                      ∑
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xl font-black text-slate-900 dark:text-white truncate">
                      {t.landing.hadichaTitle}
                    </h4>
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-0.5 truncate">
                      {t.landing.hadichaRole}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 font-bold">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{t.landing.ratingText}</span>
                      <span className="text-slate-400 text-[11px] font-normal ml-1">· 11 {t.landing.studentsCount.toLowerCase()}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t.landing.hadichaBio}
                </p>

                <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3.5 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{t.landing.daysLabel}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{t.landing.hadichaDays}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{t.landing.timeLabel}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{t.landing.hadichaTime}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center gap-2 font-bold cursor-pointer rounded-xl py-2.5"
                onClick={() => openEnrollmentForCourse(t.landing.mathTitle)}
              >
                {t.landing.hadichaBtn}
              </Button>
            </div>

            {/* 2. Hasanboy ustoz */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-600/30 via-yellow-500/20 to-amber-300/30 border border-amber-400/50 text-amber-500 dark:text-amber-400 font-serif font-black text-2xl shadow-md">
                    H
                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500 text-slate-950 text-[10px] font-black">
                      EN
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xl font-black text-slate-900 dark:text-white truncate">
                      {t.landing.hasanboyTitle}
                    </h4>
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-0.5 truncate">
                      {t.landing.hasanboyRole}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 font-bold">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{t.landing.ratingText}</span>
                      <span className="text-slate-400 text-[11px] font-normal ml-1">· 13 {t.landing.studentsCount.toLowerCase()}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t.landing.hasanboyBio}
                </p>

                <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3.5 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{t.landing.daysLabel}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{t.landing.hasanboyDays}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">{t.landing.timeLabel}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{t.landing.hasanboyTime}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center gap-2 font-bold cursor-pointer rounded-xl py-2.5"
                onClick={() => openEnrollmentForCourse(t.landing.engTitle)}
              >
                {t.landing.hasanboyBtn}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. BRANCHES DIRECTORY (FILIALLAR BO‘LIMI)
      ───────────────────────────────────────────────────────────── */}
      <section id="branches" className="border-t border-slate-200/80 bg-white py-20 dark:border-slate-800/80 dark:bg-slate-900/40 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="warning" size="md">
              {t.landing.branchesBadge}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {t.landing.branchesTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              {t.landing.branchesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INITIAL_BRANCHES.map((b) => (
              <div
                key={b.id}
                className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4 flex flex-col justify-between hover:border-amber-400/50 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-lg px-2.5 py-0.5 text-[10px] font-black uppercase ${
                        b.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {b.status === 'Active' ? t.landing.branchActive : t.landing.branchPlanned}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{b.city}</span>
                  </div>

                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    {b.name}
                  </h4>

                  <div className="space-y-2 pt-1 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <span className="leading-snug">{b.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-amber-500 shrink-0" />
                      <a href={`tel:${b.phone}`} className="hover:text-amber-500 transition-colors font-mono">
                        {b.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>08:00 - 20:00</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">{t.landing.branchManager} {b.managerName}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setApplicantBranch(b.name);
                      setIsApplyModalOpen(true);
                    }}
                    className="text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
                  >
                    {t.landing.branchEnroll}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. WHY LUMOS (NEGA AYNAN LUMOS?)
      ───────────────────────────────────────────────────────────── */}
      <section id="why-us" className="py-20 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="success" size="md">
              {t.landing.whyUsBadge}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {t.landing.whyUsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              {t.landing.whyUsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {t.landing.whyFeature1Title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {t.landing.whyFeature1Desc}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {t.landing.whyFeature2Title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {t.landing.whyFeature2Desc}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {t.landing.whyFeature3Title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {t.landing.whyFeature3Desc}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {t.landing.whyFeature4Title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {t.landing.whyFeature4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. INTERACTIVE FAQ ACCORDION (A+ ACADEMY INSPIRED)
      ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="border-t border-slate-200/80 bg-white py-20 dark:border-slate-800/80 dark:bg-slate-900/50 transition-colors">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="warning" size="md">
              {t.landing.faqBadge}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {t.landing.faqTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              {t.landing.faqSubtitle}
            </p>
          </div>

          <div className="space-y-3.5">
            {t.landing.faqList.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-amber-500/60 bg-amber-500/[0.03] dark:bg-amber-500/[0.05] shadow-md shadow-amber-500/5'
                      : 'border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left transition-colors cursor-pointer select-none"
                  >
                    <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white pr-4">
                      {item.q}
                    </span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 ${
                        isOpen
                          ? 'border-amber-500 bg-amber-500 text-slate-950 rotate-180'
                          : 'border-slate-200 dark:border-slate-800 text-slate-400'
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 mt-1 pt-3 animate-in fade-in-50 duration-150">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Direct Telegram Support Box */}
          <div className="p-6 rounded-3xl border border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 shadow-md">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  {language === 'ru' ? 'Остались вопросы? Напишите нам!' : language === 'en' ? 'Still have questions? Chat with us!' : 'Boshqa savollaringiz bormi?'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {language === 'ru' ? 'Ответим в течение 5 минут в Telegram' : language === 'en' ? 'Our mentors respond in 5 minutes via Telegram' : 'Menejerlarimiz Telegram orqali 5 daqiqada javob berishadi'}
                </p>
              </div>
            </div>

            <a
              href="https://t.me/lumos_edu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-all active:scale-95 shrink-0"
            >
              <span>Telegramda Bog‘lanish</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          11. DIAGNOSTIC TEST CALL-TO-ACTION BANNER
      ───────────────────────────────────────────────────────────── */}
      <section className="py-12 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-slate-950/20 text-slate-950 text-xs font-black uppercase tracking-wider">
              {t.landing.diagnosticBadge}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              {t.landing.diagnosticBannerTitle}
            </h3>
            <p className="text-xs sm:text-sm font-medium text-slate-900/80 max-w-xl">
              {t.landing.diagnosticBannerSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsDiagnosticModalOpen(true)}
            className="px-8 py-4 rounded-2xl bg-slate-950 text-amber-400 hover:text-amber-300 font-black text-sm shadow-xl shadow-black/20 hover:scale-105 active:scale-95 transition-all cursor-pointer select-none shrink-0"
          >
            {t.landing.diagnosticBannerBtn}
          </button>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          12. TESTIMONIALS (OTA-ONALAR VA TALABALAR FIKRLARI)
      ───────────────────────────────────────────────────────────── */}
      <section id="reviews" className="border-t border-slate-200/80 bg-white py-20 dark:border-slate-800/80 dark:bg-slate-900/40 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="warning" size="md">
              {t.landing.testimonialsBadge}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {t.landing.testimonialsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              {t.landing.testimonialsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.landing.testimonialsList.map((item, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{item.text}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-black text-slate-900 dark:text-white">
                      {item.name}
                    </h5>
                    <span className="text-[10px] text-slate-400 block">{item.role}</span>
                  </div>
                  <span className="rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {item.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          13. CONTACT & ENROLLMENT (ARIZA QOLDIRISH)
      ───────────────────────────────────────────────────────────── */}
      <section id="contact" className="py-20 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            {/* Left Info */}
            <div className="space-y-6">
              <Badge variant="warning" size="md">
                {t.landing.contactBadge}
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                {t.landing.contactTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {t.landing.contactSubtitle}
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3.5 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">{t.landing.phoneLabel}</span>
                    <a href="tel:+998712000025" className="text-sm font-bold text-slate-900 dark:text-white hover:text-amber-500 transition-colors font-mono">
                      +998 (71) 200-00-25
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">{t.landing.addressLabel}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {t.landing.addressVal}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">{t.landing.workingHoursLabel}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {t.landing.workingHoursVal}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 space-y-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {t.landing.formTitle}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.landing.formSubtitle}
                </p>
              </div>

              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.landing.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder={t.landing.fullNamePlaceholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.landing.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={applicantPhone}
                    onChange={(e) => handlePhoneFormat(e.target.value)}
                    placeholder={t.landing.phonePlaceholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-mono font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.landing.selectCourse}
                    </label>
                    <select
                      value={selectedCourseName}
                      onChange={(e) => setSelectedCourseName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                    >
                      {INITIAL_COURSES.map((c) => (
                        <option key={c.id} value={c.title}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {t.landing.branchesBadge}
                    </label>
                    <select
                      value={applicantBranch}
                      onChange={(e) => setApplicantBranch(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                    >
                      {INITIAL_BRANCHES.map((b) => (
                        <option key={b.id} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {isSubmitted ? (
                  <div className="rounded-2xl bg-emerald-50 p-4 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-center border border-emerald-200 dark:border-emerald-800 animate-fadeIn">
                    🎉 {t.landing.applicationSuccess}
                  </div>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting || !applicantName.trim() || applicantPhone.length < 18}
                    className="w-full justify-center gap-2 mt-2 font-black text-sm py-3.5 shadow-lg shadow-amber-500/25 cursor-pointer rounded-2xl"
                  >
                    {isSubmitting ? (
                      <span>{t.common.loading}</span>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>{t.landing.submitApplication}</span>
                      </>
                    )}
                  </Button>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          14. PREMIUM FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-[#030610] transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Col 1: Brand & Slogan */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <img src={lumosLogo} alt="LUMOS" className="h-10 w-10 object-contain" />
                <div>
                  <span className="font-black text-base text-slate-900 dark:text-white font-serif block">
                    LUMOS
                  </span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
                    {t.landing.footerSlogan}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                {t.landing.heroSubtitle}
              </p>
              <div className="flex items-center gap-3 text-slate-400 text-xs">
                <span>Telegram: <a href="https://t.me/lumos_edu" className="hover:text-amber-500 font-bold">@lumos_edu</a></span>
                <span>•</span>
                <span>Instagram: <a href="https://instagram.com" className="hover:text-amber-500 font-bold">@lumos.uz</a></span>
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div className="space-y-3 text-xs">
              <span className="font-black uppercase tracking-wider text-slate-900 dark:text-white block">
                {language === 'ru' ? 'Навигация' : language === 'en' ? 'Navigation' : 'Navigatsiya'}
              </span>
              <ul className="space-y-2 text-slate-500 dark:text-slate-400 font-medium">
                <li><a href="#courses" className="hover:text-amber-500 transition-colors">{t.landing.navCourses}</a></li>
                <li><a href="#results" className="hover:text-amber-500 transition-colors">{t.landing.navResults}</a></li>
                <li><a href="#teachers" className="hover:text-amber-500 transition-colors">{t.landing.navTeachers}</a></li>
                <li><a href="#branches" className="hover:text-amber-500 transition-colors">{t.landing.navBranches}</a></li>
                <li><a href="#faq" className="hover:text-amber-500 transition-colors">{t.landing.navFaq}</a></li>
                <li><a href="#why-us" className="hover:text-amber-500 transition-colors">{t.landing.navWhyUs}</a></li>
              </ul>
            </div>

            {/* Col 3: Courses */}
            <div className="space-y-3 text-xs">
              <span className="font-black uppercase tracking-wider text-slate-900 dark:text-white block">
                {t.landing.coursesBadge}
              </span>
              <ul className="space-y-2 text-slate-500 dark:text-slate-400 font-medium">
                <li><a href="#courses" className="hover:text-amber-500 transition-colors">Matematika (Hadicha ustoz)</a></li>
                <li><a href="#courses" className="hover:text-amber-500 transition-colors">Ingliz tili (Hasanboy ustoz)</a></li>
                <li><a href="#courses" className="hover:text-amber-500 transition-colors">IELTS Intensive 7.5+</a></li>
                <li><a href="#courses" className="hover:text-amber-500 transition-colors">Frontend & IT Asoslari</a></li>
                <li><a href="#courses" className="hover:text-amber-500 transition-colors">Abituriyent DTM Bloki</a></li>
              </ul>
            </div>

            {/* Col 4: Contact */}
            <div className="space-y-3 text-xs">
              <span className="font-black uppercase tracking-wider text-slate-900 dark:text-white block">
                {t.landing.navContact}
              </span>
              <ul className="space-y-2 text-slate-500 dark:text-slate-400 font-medium">
                <li>Tel: <a href="tel:+998712000025" className="font-bold text-slate-900 dark:text-white hover:text-amber-500 font-mono">+998 (71) 200-00-25</a></li>
                <li>Email: <strong>admin@lumos.uz</strong></li>
                <li>{t.landing.addressVal}</li>
                <li>{t.landing.workingHoursVal}</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} {t.landing.footerRights}</p>
            <div className="flex items-center gap-4">
              <a href="#/admin" className="hover:text-amber-500 transition-colors font-bold">{t.landing.adminTeacherPortal}</a>
              <span>•</span>
              <a href="#/student" className="hover:text-amber-500 transition-colors font-bold">{t.landing.studentCabinet}</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          15. MODALS: DIAGNOSTIC TEST, COURSE DETAILS, QUICK APPLY
      ───────────────────────────────────────────────────────────── */}
      <DiagnosticTestModal
        isOpen={isDiagnosticModalOpen}
        onClose={() => setIsDiagnosticModalOpen(false)}
      />

      <CourseDetailsModal
        course={selectedCourseForDetails}
        isOpen={!!selectedCourseForDetails}
        onClose={() => setSelectedCourseForDetails(null)}
        onEnroll={(title) => openEnrollmentForCourse(title)}
      />

      {/* Quick Application Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={t.landing.formTitle}
      >
        <form onSubmit={handleApplySubmit} className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.landing.formSubtitle}
          </p>

          <Select
            label={t.landing.selectCourse}
            value={selectedCourseName}
            onChange={(e) => setSelectedCourseName(e.target.value)}
            options={INITIAL_COURSES.map((c) => ({ value: c.title, label: c.title }))}
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.landing.branchesBadge}
            </label>
            <select
              value={applicantBranch}
              onChange={(e) => setApplicantBranch(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
            >
              {INITIAL_BRANCHES.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label={t.landing.fullName}
            required
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
            placeholder={t.landing.fullNamePlaceholder}
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.landing.phone} *
            </label>
            <input
              type="tel"
              required
              value={applicantPhone}
              onChange={(e) => handlePhoneFormat(e.target.value)}
              placeholder={t.landing.phonePlaceholder}
              className="w-full px-3 py-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-mono font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
            />
          </div>

          {isSubmitted ? (
            <div className="rounded-2xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-center border border-emerald-200 dark:border-emerald-800">
              🎉 {t.landing.applicationSuccess}
            </div>
          ) : (
            <div className="pt-2 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsApplyModalOpen(false)}
              >
                {t.landing.cancelBtn}
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isSubmitting || !applicantName.trim() || applicantPhone.length < 18}
                className="gap-2 shadow-md shadow-amber-500/20 font-bold px-6"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{t.landing.submitApplication}</span>
              </Button>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};
