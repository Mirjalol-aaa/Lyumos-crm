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
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useI18n } from '../../lib/i18n';
import { useCRM } from '../../context/CRMContext';
import { INITIAL_COURSES } from '../../data/coursesData';
import { INITIAL_TEACHERS } from '../../data/initialData';
import { fireCelebrationConfetti } from '../../services/paymentGatewayService';

export const LandingPage: React.FC = () => {
  const { t, language, setLanguage, formatMoney } = useI18n();
  const { settings, updateSettings, addStudent } = useCRM();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedCourseName, setSelectedCourseName] = useState('IELTS Academic Master 8.0+');
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Animated counters state
  const [counterStudents, setCounterStudents] = useState(1200);
  const [counterRate, setCounterRate] = useState(85);

  useEffect(() => {
    document.title = 'LUMOS O‘quv Markazi — Bilim Bilan Yorqin Kelajakka!';
    const timer = setInterval(() => {
      setCounterStudents((prev) => (prev < 1520 ? prev + 16 : 1520));
      setCounterRate((prev) => (prev < 98 ? prev + 1 : 98));
    }, 40);
    return () => clearInterval(timer);
  }, []);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantPhone) return;

    // Register as trial student in CRM
    try {
      addStudent({
        fullName: applicantName,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        birthDate: '2005-01-01',
        gender: 'Male',
        phone: applicantPhone,
        email: `${applicantName.toLowerCase().replace(/\s+/g, '.')}@lumos.uz`,
        parentName: applicantName,
        parentPhone: applicantPhone,
        groupId: 'GRP-101',
        groupName: selectedCourseName,
        teacherId: 'TCH-01',
        teacherName: 'Dr. Alexander Wright',
        monthlyFee: 180,
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0],
      });
    } catch (e) {
      // ignore
    }

    fireCelebrationConfetti();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsApplyModalOpen(false);
      setApplicantName('');
      setApplicantPhone('');
    }, 2500);
  };

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  const testimonials = [
    {
      name: 'Azizbek Rahimov',
      score: 'IELTS 8.0',
      text: 'LUMOS markazida 4 oy tayyorlanib, birinchi urinishda 8.0 ball oldim. Dr. Alexander Wrightning metodikasi O‘zbekistonda eng zo‘ri!',
      role: 'Alumni 2025',
    },
    {
      name: 'Madina Alimova',
      score: 'Python & AI Engineer',
      text: 'Noldan boshlab IT kursida o‘qidim. Hozirda xalqaro kompaniyada junior injener bo‘lib ishlayapman. Amaliy loyihalar juda katta tajriba berdi.',
      role: 'Full-Stack Bitiruvchisi',
    },
    {
      name: 'Jasur Shokirov',
      score: 'SAT 1490',
      text: 'Matematika va SAT darslari mantiqiy fikrlashni tubdan o‘zgartirdi. Amerika universitetlariga grant yutishimda markaz jamoasi katta hissa qo‘shdi.',
      role: 'Grant Egasi',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 antialiased selection:bg-amber-500 selection:text-white dark:bg-[#080D1A] dark:text-slate-100 font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. NAVIGATION BAR
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#080D1A]/80 transition-colors">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500/20 via-yellow-500/10 to-amber-300/20 p-1.5 border border-amber-400/30 shadow-md shadow-amber-500/10">
              <img
                src="/lumos-logo.png"
                alt="LUMOS"
                className="h-full w-full object-contain filter drop-shadow-sm"
              />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                LUMOS
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">
                O‘quv Markazi
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600 dark:text-slate-300">
            <a href="#courses" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Kurslar
            </a>
            <a href="#teachers" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Ustozlar
            </a>
            <a href="#stats" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Natijalar
            </a>
            <a href="#reviews" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Sharhlar
            </a>
            <a href="#contact" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              Aloqa
            </a>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              {settings.theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600" />
              )}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 text-[11px] font-bold dark:border-slate-800 dark:bg-slate-900">
              {(['uz', 'ru', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`rounded-lg px-2 py-1 uppercase transition-all ${
                    language === lang
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
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
              className="hidden sm:inline-flex items-center gap-1.5 shadow-md shadow-amber-500/20"
              onClick={() => {
                window.location.hash = '#/admin';
              }}
            >
              <span>{t.landing.loginCta}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION
      ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
        <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
          <div className="h-[450px] w-[650px] rounded-full bg-gradient-to-tr from-amber-500/15 via-yellow-500/10 to-orange-500/10 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8 space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-4 py-1.5 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
              {t.landing.badge}
            </span>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight sm:text-6xl sm:leading-tight">
            {t.landing.heroTitle}{' '}
            <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
              {t.landing.heroHighlight}
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            {t.landing.heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="gap-2 shadow-xl shadow-amber-500/25 text-sm font-bold px-7 py-3.5"
              onClick={() => setIsApplyModalOpen(true)}
            >
              <span>{t.landing.registerCta}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="gap-2 text-sm font-bold px-7 py-3.5 border-slate-300 dark:border-slate-700"
              onClick={() => {
                window.location.hash = '#/student';
              }}
            >
              <span>Talaba Portali (LMS)</span>
              <GraduationCap className="h-4 w-4 text-emerald-500" />
            </Button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. STATS & SOCIAL PROOF
      ───────────────────────────────────────────────────────────── */}
      <section id="stats" className="border-y border-slate-200/80 bg-white py-12 dark:border-slate-800/80 dark:bg-slate-900/60">
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
              <span className="text-3xl sm:text-4xl font-black text-blue-500 font-mono">25+</span>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                {t.landing.expertMentors}
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
          4. FEATURED COURSES
      ───────────────────────────────────────────────────────────── */}
      <section id="courses" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="warning" size="md">
              Ta’lim Dasturlari
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              {t.landing.coursesTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              {t.landing.coursesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {INITIAL_COURSES.map((course) => (
              <div
                key={course.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-xl bg-amber-500/10 px-3 py-1 text-[11px] font-black uppercase text-amber-600 dark:text-amber-400">
                      {course.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                      {course.durationMonths} oy
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Haftasiga 3 kun amaliy mashg‘ulot</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>Xalqaro darajadagi portfolio loyihalari</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Oylik to‘lov:</span>
                    <p className="text-lg font-black text-amber-600 dark:text-amber-400 font-mono">
                      {formatMoney(course.pricePerMonth, 'USD')}
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSelectedCourseName(course.title);
                      setIsApplyModalOpen(true);
                    }}
                  >
                    Yozilish
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. EXPERT INSTRUCTORS
      ───────────────────────────────────────────────────────────── */}
      <section id="teachers" className="border-t border-slate-200/80 bg-white py-20 dark:border-slate-800/80 dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="info" size="md">
              Mentorlar
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              {t.landing.teachersTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              {t.landing.teachersSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {INITIAL_TEACHERS.slice(0, 4).map((teacher) => (
              <div
                key={teacher.id}
                className="rounded-3xl border border-slate-200/90 bg-white p-5 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4"
              >
                <img
                  src={teacher.avatar}
                  alt={teacher.fullName}
                  className="mx-auto h-24 w-24 rounded-2xl object-cover ring-4 ring-amber-500/10"
                />
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {teacher.fullName}
                  </h4>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                    {teacher.subjects?.join(', ')}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-1 text-xs text-amber-500 font-bold">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span>{teacher.rating || '4.9'} Baho</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. TESTIMONIALS
      ───────────────────────────────────────────────────────────── */}
      <section id="reviews" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="success" size="md">
              Fikrlar
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              {t.landing.testimonialsTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{item.text}"
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.name}
                    </h5>
                    <span className="text-[10px] text-slate-400">{item.role}</span>
                  </div>
                  <span className="rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                    {item.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. CONTACT & LOCATION
      ───────────────────────────────────────────────────────────── */}
      <section id="contact" className="border-t border-slate-200/80 bg-white py-20 dark:border-slate-800/80 dark:bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            {/* Left Info */}
            <div className="space-y-6">
              <Badge variant="warning" size="md">
                Qabul Ochiq
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                {t.landing.contactTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {t.landing.contactSubtitle}
              </p>

              <div className="space-y-4 pt-2 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block">Aloqa markazi:</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      +998 (71) 200-00-25
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block">Manzil:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      Toshkent sh., Chilonzor tumani, Bunyodkor shox ko‘chasi 42
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Quick Application Box */}
            <div className="rounded-3xl border border-slate-200/90 bg-[#F8F9FA] p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                Bepul Sinov Darsiga Yozilish
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Shaklni to‘ldiring va chegirmali o‘rinni band qiling
              </p>

              <form onSubmit={handleApplySubmit} className="space-y-4">
                <Input
                  label="Ism va Familiyangiz"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="masalan: Anvar Qodirov"
                />

                <Input
                  label="Telefon raqamingiz"
                  required
                  type="tel"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  placeholder="+998 (90) 123-45-67"
                />

                <Select
                  label="Qiziqtirgan kurs"
                  value={selectedCourseName}
                  onChange={(e) => setSelectedCourseName(e.target.value)}
                  options={INITIAL_COURSES.map((c) => ({ value: c.title, label: c.title }))}
                />

                {isSubmitted ? (
                  <div className="rounded-2xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-center">
                    {t.landing.applicationSuccess}
                  </div>
                ) : (
                  <Button variant="primary" size="md" className="w-full justify-center gap-2 mt-2">
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
          8. FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/lumos-logo.png" alt="LUMOS" className="h-8 w-8 object-contain" />
            <span className="font-black text-sm text-slate-900 dark:text-white">
              LUMOS O‘quv Markazi
            </span>
          </div>

          <p className="text-xs text-slate-400 text-center">
            © {new Date().getFullYear()} LUMOS Education Center. Barcha huquqlar himoyalangan.
          </p>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
            <button
              type="button"
              onClick={() => {
                window.location.hash = '#/admin';
              }}
              className="hover:text-amber-600"
            >
              Super Admin
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                window.location.hash = '#/student';
              }}
              className="hover:text-amber-600"
            >
              Talaba Kirish
            </button>
          </div>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          9. APPLICATION MODAL
      ───────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Kursga Yozilish"
        subtitle={selectedCourseName}
        icon={<GraduationCap className="h-5 w-5" />}
      >
        <form onSubmit={handleApplySubmit} className="space-y-4">
          <Input
            label="Ism va Familiyangiz"
            required
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
            placeholder="masalan: Jasur Alimov"
          />

          <Input
            label="Telefon raqamingiz"
            required
            type="tel"
            value={applicantPhone}
            onChange={(e) => setApplicantPhone(e.target.value)}
            placeholder="+998 (90) 000-00-00"
          />

          <Select
            label="Tanlangan yo‘nalish"
            value={selectedCourseName}
            onChange={(e) => setSelectedCourseName(e.target.value)}
            options={INITIAL_COURSES.map((c) => ({ value: c.title, label: c.title }))}
          />

          {isSubmitted ? (
            <div className="rounded-2xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700 text-center">
              {t.landing.applicationSuccess}
            </div>
          ) : (
            <div className="pt-2">
              <Button variant="primary" size="md" className="w-full justify-center gap-2">
                <Send className="h-4 w-4" />
                <span>Yuborish</span>
              </Button>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};
