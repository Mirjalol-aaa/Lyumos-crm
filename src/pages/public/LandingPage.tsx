import React, { useState, useEffect } from 'react';
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
  Sun,
  Moon,
  ChevronRight,
  GraduationCap,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Layers,
  HeartHandshake,
  MessageCircle,
  Compass,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useI18n } from '../../lib/i18n';
import { useCRM } from '../../context/CRMContext';
import { useLMS } from '../../context/LMSContext';
import { INITIAL_COURSES } from '../../data/coursesData';
import { INITIAL_TEACHERS } from '../../data/initialData';
import { fireCelebrationConfetti } from '../../services/paymentGatewayService';
import lumosLogo from '../../assets/lumos-logo.png';

export const LandingPage: React.FC = () => {
  const { t, language, setLanguage, formatMoney } = useI18n();
  const { settings, updateSettings, addStudent } = useCRM();
  const { currentUser, currentRole } = useLMS();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedCourseName, setSelectedCourseName] = useState('Matematika (Hadicha ustoz)');
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Animated counters state
  const [counterStudents, setCounterStudents] = useState(380);
  const [counterRate, setCounterRate] = useState(88);

  useEffect(() => {
    document.title = 'LUMOS O‘quv Markazi — Bilim Bilan Yorqin Kelajakka!';
    const timer = setInterval(() => {
      setCounterStudents((prev) => (prev < 520 ? prev + 7 : 520));
      setCounterRate((prev) => (prev < 98 ? prev + 1 : 98));
    }, 45);
    return () => clearInterval(timer);
  }, []);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantPhone.trim()) return;

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
        groupName: isMath ? 'Matematika (Hadicha ustoz)' : 'Ingliz tili (Hasanboy ustoz)',
        teacherId: isMath ? 'TCH-01' : 'TCH-02',
        teacherName: isMath ? 'Hadicha ustoz' : 'Hasanboy ustoz',
        monthlyFee: 250000,
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.warn('Student auto-register error:', err);
    }

    fireCelebrationConfetti();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsApplyModalOpen(false);
      setApplicantName('');
      setApplicantPhone('');
    }, 2200);
  };

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  const isDark = settings.theme === 'dark';

  const testimonials = [
    {
      name: 'Azizbek',
      subject: 'Matematika kursi o‘quvchisi',
      score: '100% Natija',
      text: 'Hadicha ustozning tushuntirish uslubi juda sodda va tushunarli. Maktabda tushunmagan murakkab algebra va geometriya masalalarini LUMOSda oson yechishni o‘rgandim. 3 oylik to‘liq davomat va tinimsiz amaliyot o‘z mevasini berdi!',
      badge: 'Hadicha ustoz guruhi',
    },
    {
      name: 'Shahjahon',
      subject: 'Matematika kursi o‘quvchisi',
      score: 'Abituriyent / DTM',
      text: 'Matematikadan tayyorgarlikni noldan boshlagan edim. Hadicha ustoz har bir o‘quvchiga alohida yondashadilar, tushunmagan misollarni qayta-qayta erinmasdan tushuntirib beradilar. O‘z kuchimga ishonchim ortdi.',
      badge: 'Hadicha ustoz guruhi',
    },
    {
      name: 'Jasurbek',
      subject: 'Ingliz tili kursi o‘quvchisi',
      score: 'IELTS 7.5 Target',
      text: 'Hasanboy ustoz bilan ingliz tili darslari juda qiziqarli va jonli o‘tadi. Grammatika qoidalarini yodlash emas, balki jonli Speaking Club va muloqot orqali erkin gapirishga erishdik. Har bir dars yangi motivatsiya beradi.',
      badge: 'Hasanboy ustoz guruhi',
    },
    {
      name: 'Malika opa (Ota-ona)',
      subject: 'O‘quvchi onasi',
      score: 'Ota-onalar ishonchi',
      text: 'Farzandimning darslarga qiziqishi ancha ortdi. Eng muhimi, markaz ma’muriyati har oy davomat va o‘zlashtirish hisobotini berib boradi. Sharoitlar va ustozlarning pedagogik mahorati a’lo darajada.',
      badge: 'Ota-onalar tavsiyasi',
    },
  ];

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-200 antialiased selection:bg-amber-500 selection:text-white ${
        isDark ? 'dark bg-[#080D1A] text-slate-100' : 'bg-[#F8F9FA] text-slate-900'
      }`}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. ACTIVE SESSION TOP BAR (DISCREET & MODERN GLASS BANNER)
      ───────────────────────────────────────────────────────────── */}
      {currentUser && (
        <div className="sticky top-0 z-50 bg-slate-900/90 dark:bg-slate-950/95 backdrop-blur-md border-b border-amber-500/20 px-4 py-2 text-white text-xs font-semibold shadow-md">
          <div className="mx-auto max-w-7xl flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300">
                Faol tizim foydalanuvchisi:
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
                {currentUser.name}
              </span>
              <span className="text-slate-400 text-[11px]">
                ({currentRole === 'admin' ? 'Super Admin' : currentRole === 'teacher' ? 'O‘qituvchi' : 'O‘quvchi'})
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                window.location.hash = currentRole === 'student' ? '#/student' : '#/dashboard';
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 px-3.5 py-1 text-xs font-bold text-slate-950 shadow-sm hover:from-amber-400 hover:to-yellow-400 active:scale-95 transition-all cursor-pointer"
            >
              <span>{currentRole === 'student' ? 'Talaba Kabinetiga O‘tish' : 'Boshqaruv Markaziga Qaytish'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. NAVIGATION HEADER (CRISP & BALANCED)
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#080D1A]/90 transition-colors">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500/20 via-yellow-500/10 to-amber-300/20 p-2 border border-amber-400/40 shadow-sm shadow-amber-500/15 group-hover:scale-105 transition-transform duration-200">
              <img
                src={lumosLogo}
                alt="LUMOS O‘QUV MARKAZI"
                className="h-full w-full object-contain filter drop-shadow-sm"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white font-serif">
                  LUMOS
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              </div>
              <span className="block text-[10px] uppercase tracking-widest text-amber-600 dark:text-amber-400 font-extrabold">
                O‘quv Markazi
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-600 dark:text-slate-300">
            <a
              href="#courses"
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50"
            >
              Kurslar
            </a>
            <a
              href="#teachers"
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50"
            >
              Ustozlar
            </a>
            <a
              href="#why-us"
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50"
            >
              Afzalliklar
            </a>
            <a
              href="#reviews"
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50"
            >
              Fikrlar
            </a>
            <a
              href="#contact"
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50"
            >
              Bog‘lanish
            </a>
          </nav>

          {/* Right Controls: Theme + Language + Portal CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-amber-400/50 dark:border-slate-800 dark:bg-slate-900/90 dark:text-amber-400 dark:hover:bg-slate-800 transition-all shadow-xs cursor-pointer group"
              title={isDark ? "Yorug' rejimga o'tish (Light Mode)" : "Qorong'i rejimga o'tish (Dark Mode)"}
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5 text-[11px] font-black dark:border-slate-800 dark:bg-slate-900/90">
              {(['uz', 'ru', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`rounded-lg px-2.5 py-1 uppercase transition-all cursor-pointer ${
                    language === lang
                      ? 'bg-amber-500 text-white shadow-xs font-black'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Portal Entry Button */}
            <Button
              variant="primary"
              size="sm"
              className="hidden sm:inline-flex items-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer font-bold px-4 py-2 text-xs"
              onClick={() => {
                if (currentUser) {
                  window.location.hash = currentRole === 'student' ? '#/student' : '#/dashboard';
                } else {
                  window.location.hash = '#/admin';
                }
              }}
            >
              <span>
                {currentUser
                  ? currentRole === 'student'
                    ? 'Talaba Kabineti'
                    : 'Boshqaruv Markazi'
                  : t.landing.loginCta}
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          3. HERO SECTION (HIGH-CONVERTING & CLEAN)
      ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
        {/* Glow ambient background circles */}
        <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
          <div className="h-[480px] w-[700px] rounded-full bg-gradient-to-tr from-amber-500/15 via-yellow-500/10 to-amber-600/10 blur-[140px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8 space-y-7">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-amber-400/40 bg-amber-500/10 px-4 py-1.5 backdrop-blur-md shadow-xs">
            <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
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

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
            <Button
              variant="primary"
              size="lg"
              className="gap-2.5 shadow-xl shadow-amber-500/25 text-sm font-black px-8 py-3.5 cursor-pointer rounded-2xl"
              onClick={() => {
                setSelectedCourseName('Matematika (Hadicha ustoz)');
                setIsApplyModalOpen(true);
              }}
            >
              <span>{t.landing.registerCta}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            {currentUser ? (
              <Button
                variant="secondary"
                size="lg"
                className="gap-2.5 text-sm font-bold px-7 py-3.5 border-slate-300 dark:border-slate-700 cursor-pointer rounded-2xl"
                onClick={() => {
                  window.location.hash = currentRole === 'student' ? '#/student' : '#/dashboard';
                }}
              >
                <span>{currentRole === 'student' ? 'Talaba Kabinetiga Qaytish' : 'Boshqaruv Paneliga Qaytish'}</span>
                <ChevronRight className="h-4 w-4 text-amber-500" />
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="lg"
                className="gap-2.5 text-sm font-bold px-7 py-3.5 border-slate-300 dark:border-slate-700 cursor-pointer rounded-2xl"
                onClick={() => {
                  window.location.hash = '#/student';
                }}
              >
                <span>Talaba Portali (LMS)</span>
                <GraduationCap className="h-4 w-4 text-emerald-500" />
              </Button>
            )}
          </div>

          {/* Trust points row */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Kichik guruhlar (12-16 nafar)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Oylik to‘lov: 250,000 so‘m</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Birinchi dars — bepul sinov</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. STATS BAR (CREDIBLE & FOCUSED)
      ───────────────────────────────────────────────────────────── */}
      <section id="stats" className="border-y border-slate-200/80 bg-white py-12 dark:border-slate-800/80 dark:bg-slate-900/60 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
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
              <span className="text-3xl sm:text-4xl font-black text-blue-500 font-mono">2 Ta</span>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                Ixtisoslashgan Yo‘nalish
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
          5. FEATURED COURSES (STRICTLY MATHEMATICS & ENGLISH)
      ───────────────────────────────────────────────────────────── */}
      <section id="courses" className="py-20 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="warning" size="md">
              Ta’lim Dasturlari
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {t.landing.coursesTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              {t.landing.coursesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            {INITIAL_COURSES.map((course) => {
              const isMath = course.title.toLowerCase().includes('matematika');
              return (
                <div
                  key={course.id}
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90"
                >
                  <div className="space-y-5">
                    {/* Header tags */}
                    <div className="flex items-center justify-between">
                      <span className="rounded-xl bg-amber-500/10 px-3 py-1 text-[11px] font-black uppercase text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {isMath ? 'Aniq Fanlar & Mantiq' : 'Xalqaro Tillar'}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                        {course.durationMonths} oylik kurs
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400 transition-colors">
                        {course.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    {/* Schedule & Teacher Info */}
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Ustoz:</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          {isMath ? 'Hadicha ustoz' : 'Hasanboy ustoz'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Dars vaqti:</span>
                        <span className="font-semibold">
                          {isMath ? 'Dush, Chor, Juma (14:00 - 16:00)' : 'Sesh, Pay, Shan (15:30 - 17:30)'}
                        </span>
                      </div>
                    </div>

                    {/* Syllabus points */}
                    <div className="space-y-2.5 border-t border-slate-100 pt-4 dark:border-slate-800 text-xs">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Kurs dasturi o‘z ichiga oladi:
                      </span>
                      {course.syllabus.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Oylik to‘lov:</span>
                      <p className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono">
                        {formatMoney(course.pricePerMonth, 'UZS')}
                      </p>
                    </div>

                    <Button
                      variant="primary"
                      size="md"
                      className="px-6 py-2.5 font-bold shadow-md shadow-amber-500/20 cursor-pointer rounded-xl"
                      onClick={() => {
                        setSelectedCourseName(course.title);
                        setIsApplyModalOpen(true);
                      }}
                    >
                      Kursga Yozilish
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. EXPERT INSTRUCTORS (HADICHA & HASANBOY - NO PHOTOS)
      ───────────────────────────────────────────────────────────── */}
      <section id="teachers" className="border-t border-slate-200/80 bg-white py-20 dark:border-slate-800/80 dark:bg-slate-900/40 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="info" size="md">
              Ustozlarimiz
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {t.landing.teachersTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Matematika va ingliz tili bo‘yicha ko‘p yillik tajribaga ega yetuk pedagoglar
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* 1. Hadicha ustoz */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  {/* Golden Monogram Avatar */}
                  <div className="relative flex h-18 w-18 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-600/30 via-yellow-500/20 to-amber-300/30 border border-amber-400/50 text-amber-500 dark:text-amber-400 font-serif font-black text-3xl shadow-md">
                    H
                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500 text-slate-950 text-[10px] font-black">
                      ∑
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white">
                      Hadicha ustoz
                    </h4>
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-0.5">
                      Matematika va Mantiq Fani Ustozi
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 font-bold">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>5.0 Baho</span>
                      <span className="text-slate-400 text-[11px] font-normal ml-1">· 11+ faol o‘quvchilar</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Oliy toifali pedagog. Matematika, mantiq, DTM testlari va olimpiadalarga tayyorgarlik bo‘yicha ko‘p yillik tajribaga ega. Har bir o‘quvchining qobiliyatiga qarab individual dastur tuzadi.
                </p>

                <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3.5 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Dars kunlari:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Dush, Chor, Juma</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Vaqti:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">14:00 - 16:00 (101-xona)</span>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center gap-2 font-bold cursor-pointer rounded-xl"
                onClick={() => {
                  setSelectedCourseName('Matematika (Hadicha ustoz)');
                  setIsApplyModalOpen(true);
                }}
              >
                Hadicha ustoz guruhiga yozilish
              </Button>
            </div>

            {/* 2. Hasanboy ustoz */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  {/* Golden Monogram Avatar */}
                  <div className="relative flex h-18 w-18 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-600/30 via-yellow-500/20 to-amber-300/30 border border-amber-400/50 text-amber-500 dark:text-amber-400 font-serif font-black text-3xl shadow-md">
                    H
                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500 text-slate-950 text-[10px] font-black">
                      EN
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white">
                      Hasanboy ustoz
                    </h4>
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-0.5">
                      Ingliz Tili (General English & IELTS) Ustozi
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 font-bold">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>5.0 Baho</span>
                      <span className="text-slate-400 text-[11px] font-normal ml-1">· 8+ faol o‘quvchilar</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Xalqaro sertifikatlarga ega instruktor. Grammatika va jonli so‘zlashuv to‘sig‘ini yengish bo‘yicha interaktiv uslub egasi. Speaking Club va tinglab tushunish mashg‘ulotlari yetakchisi.
                </p>

                <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-3.5 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Dars kunlari:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Sesh, Pay, Shan</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Vaqti:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">15:30 - 17:30 (102-xona)</span>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center gap-2 font-bold cursor-pointer rounded-xl"
                onClick={() => {
                  setSelectedCourseName('Ingliz Tili (Hasanboy ustoz)');
                  setIsApplyModalOpen(true);
                }}
              >
                Hasanboy ustoz guruhiga yozilish
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. WHY CHOOSE US (NEGA AYNAN LUMOS?)
      ───────────────────────────────────────────────────────────── */}
      <section id="why-us" className="py-20 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="success" size="md">
              Afzalliklarimiz
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Nima Uchun LUMOS Markazini Tanlashadi?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Farzandingiz kelajagi uchun eng qulay va professional ta’lim muhiti
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Kichik Guruhlar
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Maksimal 12-16 kishilik ixcham guruhlar tufayli har bir o‘quvchiga ustozning to‘liq e’tibori yetadi.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Ota-onalar Nazorati
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Har oy davomat, o‘zlashtirish va to‘lovlar haqida shaffof elektron hisobot taqdim etiladi.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Amaliy Metodika
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Quruq yodlash emas, balki mantiqiy fikrlash, erkin so‘zlashuv va mustaqil misol yechishga o‘rgatiladi.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Adolatli Narxlar
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Oylik atigi 250,000 so‘m. Bepul sinov darsi va birinchi darsdan natijani his qilish kafolati.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. TESTIMONIALS (AUTHENTIC STUDENT & PARENT REVIEWS)
      ───────────────────────────────────────────────────────────── */}
      <section id="reviews" className="border-t border-slate-200/80 bg-white py-20 dark:border-slate-800/80 dark:bg-slate-900/60 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="warning" size="md">
              Fikrlar
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {t.landing.testimonialsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Biz bilan birga yutuqlarga erishayotgan o‘quvchilar va ularning ota-onalari
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((item, idx) => (
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
                    <span className="text-[10px] text-slate-400 block">{item.subject}</span>
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
          9. CONTACT & ENROLLMENT (ARIZA QOLDIRISH)
      ───────────────────────────────────────────────────────────── */}
      <section id="contact" className="py-20 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            {/* Left Info */}
            <div className="space-y-6">
              <Badge variant="warning" size="md">
                Qabul Ochiq
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
                    <span className="text-[10px] text-slate-400 block font-medium">Qo‘ng‘iroq uchun:</span>
                    <a href="tel:+998712000025" className="text-sm font-bold text-slate-900 dark:text-white hover:text-amber-500 transition-colors">
                      +998 (71) 200-00-25
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Manzil:</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Toshkent sh., Chilonzor tumani, Bunyodkor shoh ko‘chasi 42
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Ish vaqti:</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Dushanba - Shanba: 08:30 - 19:30
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-6 space-y-1">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Birinchi Bepul Sinov Darsiga Yoziling
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Formani to‘ldiring, joylar soni cheklangan (16 nafar).
                </p>
              </div>

              <form onSubmit={handleApplySubmit} className="space-y-4">
                <Input
                  label={t.landing.fullName}
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="Masalan: Azizbek Rahimov"
                />

                <Input
                  label={t.landing.phone}
                  required
                  type="tel"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  placeholder="+998 (90) 123-45-67"
                />

                <Select
                  label={t.landing.selectCourse}
                  value={selectedCourseName}
                  onChange={(e) => setSelectedCourseName(e.target.value)}
                  options={INITIAL_COURSES.map((c) => ({ value: c.title, label: c.title }))}
                />

                {isSubmitted ? (
                  <div className="rounded-2xl bg-emerald-50 p-4 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-center border border-emerald-200 dark:border-emerald-800 animate-fadeIn">
                    🎉 {t.landing.applicationSuccess}
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full justify-center gap-2 mt-2 font-black text-sm py-3.5 shadow-lg shadow-amber-500/25 cursor-pointer rounded-2xl"
                  >
                    <Send className="h-4 w-4" />
                    <span>{t.landing.submitApplication}</span>
                  </Button>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={lumosLogo} alt="LUMOS" className="h-9 w-9 object-contain" />
            <div>
              <span className="font-black text-sm text-slate-900 dark:text-white font-serif block">
                LUMOS O‘quv Markazi
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
                Bilim bilan yorqin kelajakka!
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center sm:text-right">
            © {new Date().getFullYear()} LUMOS ERP & Education. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          11. QUICK APPLICATION MODAL
      ───────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Kursga Yozilish (Bepul Sinov Darsi)"
      >
        <form onSubmit={handleApplySubmit} className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tanlangan yo‘nalish bo‘yicha ustozimiz bilan sinov darsiga qatnashish uchun ma’lumotlaringizni qoldiring:
          </p>

          <Select
            label="Tanlangan Kurs"
            value={selectedCourseName}
            onChange={(e) => setSelectedCourseName(e.target.value)}
            options={INITIAL_COURSES.map((c) => ({ value: c.title, label: c.title }))}
          />

          <Input
            label="Ism va Familiyangiz"
            required
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
            placeholder="Masalan: Sardor Aliyev"
          />

          <Input
            label="Telefon raqamingiz"
            required
            type="tel"
            value={applicantPhone}
            onChange={(e) => setApplicantPhone(e.target.value)}
            placeholder="+998 (90) 123-45-67"
          />

          {isSubmitted ? (
            <div className="rounded-2xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-center border border-emerald-200 dark:border-emerald-800">
              🎉 Arizangiz qabul qilindi! Tez orada mutaxassislarimiz bog‘lanishadi.
            </div>
          ) : (
            <div className="pt-2 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsApplyModalOpen(false)}
              >
                Bekor qilish
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="gap-2 shadow-md shadow-amber-500/20 font-bold px-5"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Yuborish</span>
              </Button>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};
