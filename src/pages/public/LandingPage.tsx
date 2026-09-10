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
import heroStudentImg from '../../assets/lumos_hero_student.jpg';
import aboutAcademyImg from '../../assets/lumos_about_academy.jpg';

export const LandingPage: React.FC = () => {
  const { t, language, setLanguage, formatMoney } = useI18n();
  const { settings, addStudent } = useCRM();
  const { currentUser, currentRole } = useLMS();

  // Scroll detection for sticky elevated glass navbar
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Modals state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isDiagnosticModalOpen, setIsDiagnosticModalOpen] = useState(false);
  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<Course | null>(null);

  // Course Filter state
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Interactive FAQ Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Quick Application Form state
  const [selectedCourseName, setSelectedCourseName] = useState('Matematika (Hadicha ustoz)');
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantBranch, setApplicantBranch] = useState(INITIAL_BRANCHES[0].name);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animated counters
  const [counterStudents, setCounterStudents] = useState(420);
  const [counterRate, setCounterRate] = useState(88);

  useEffect(() => {
    document.title =
      language === 'ru'
        ? 'LUMOS Учебный Центр — К светлому будущему со знаниями!'
        : language === 'en'
        ? 'LUMOS Academy — Toward a Brighter Future with Knowledge!'
        : 'LUMOS Ta’lim Markazi — Bilim Bilan Yorqin Kelajakka!';

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);

      const sections = ['home', 'courses', 'why-us', 'results', 'teachers', 'about', 'branches', 'faq'];
      const scrollPos = window.scrollY + 120;
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(s);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const timer = setInterval(() => {
      setCounterStudents((prev) => (prev < 520 ? prev + 5 : 520));
      setCounterRate((prev) => (prev < 95 ? prev + 1 : 95));
    }, 40);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, [language]);

  // Category filter items
  const categoryFilters = [
    { key: 'all', label: language === 'ru' ? 'Все курсы' : language === 'en' ? 'All Courses' : 'Barchasi' },
    { key: 'math', label: language === 'ru' ? 'Математика' : language === 'en' ? 'Mathematics' : 'Matematika' },
    { key: 'english', label: language === 'ru' ? 'Английский' : language === 'en' ? 'English' : 'Ingliz tili' },
    { key: 'ielts', label: 'IELTS' },
    { key: 'it', label: language === 'ru' ? 'IT и Программирование' : language === 'en' ? 'IT & Coding' : 'IT' },
    { key: 'school', label: language === 'ru' ? 'Школьные предметы' : language === 'en' ? 'School Subjects' : 'Maktab fanlari' },
    { key: 'abiturient', label: language === 'ru' ? 'Абитуриент' : language === 'en' ? 'University Prep' : 'Abituriyent' },
    { key: 'kids', label: language === 'ru' ? 'Для детей' : language === 'en' ? 'For Kids' : 'Bolalar uchun' },
  ];

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return INITIAL_COURSES.filter((course) => {
      let matchesCategory = true;
      if (selectedCategoryKey === 'math') matchesCategory = course.category.toLowerCase().includes('matematika');
      else if (selectedCategoryKey === 'english') matchesCategory = course.category.toLowerCase().includes('ingliz') || course.category.toLowerCase().includes('english');
      else if (selectedCategoryKey === 'ielts') matchesCategory = course.category.toLowerCase().includes('ielts');
      else if (selectedCategoryKey === 'it') matchesCategory = course.category.toLowerCase().includes('it') || course.category.toLowerCase().includes('dasturlash');
      else if (selectedCategoryKey === 'school') matchesCategory = course.category.toLowerCase().includes('maktab') || course.category.toLowerCase().includes('prezident');
      else if (selectedCategoryKey === 'abiturient') matchesCategory = course.category.toLowerCase().includes('abituriyent') || course.level.toLowerCase().includes('abituriyent');
      else if (selectedCategoryKey === 'kids') matchesCategory = course.title.toLowerCase().includes('maktab') || course.level.toLowerCase().includes('4-5');

      let matchesSearch = true;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        matchesSearch =
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          (course.instructor && course.instructor.toLowerCase().includes(query)) ||
          course.category.toLowerCase().includes(query);
      }

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategoryKey, searchQuery]);

  // Phone input mask
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (!val.startsWith('998')) {
      val = '998' + val;
    }
    val = val.slice(0, 12);

    let formatted = '+998';
    if (val.length > 3) formatted += ' (' + val.substring(3, 5);
    if (val.length >= 5) formatted += ') ' + val.substring(5, 8);
    if (val.length >= 8) formatted += '-' + val.substring(8, 10);
    if (val.length >= 10) formatted += '-' + val.substring(10, 12);

    setApplicantPhone(formatted);
  };

  // Lead submission
  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || applicantPhone.length < 18) return;

    setIsSubmitting(true);

    try {
      addStudent({
        fullName: applicantName.trim(),
        avatar: '',
        birthDate: '2008-01-01',
        gender: 'Male',
        phone: applicantPhone.trim(),
        email: `${applicantName.toLowerCase().replace(/\s+/g, '.')}@lumos.uz`,
        parentName: applicantName.trim(),
        parentPhone: applicantPhone.trim(),
        groupId: selectedCourseName.includes('Matematika') ? 'GRP-01' : 'GRP-02',
        groupName: selectedCourseName,
        teacherId: selectedCourseName.includes('Matematika') ? 'TCH-01' : 'TCH-02',
        teacherName: selectedCourseName.includes('Matematika') ? 'Hadicha ustoz' : 'Hasanboy ustoz',
        monthlyFee: 250000,
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0],
        notes: `LUMOS Luxury Sayt arizasi. Tanlangan filial: ${applicantBranch}`,
      });

      if (settings.telegramBotToken && settings.telegramChatId) {
        const leadMsg = formatLeadApplicationMessage({
          fullName: applicantName.trim(),
          phone: applicantPhone.trim(),
          subject: selectedCourseName,
          source: `LUMOS Sayt (${applicantBranch})`,
          centerName: settings.centerName,
        });
        sendTelegramMessage(settings.telegramBotToken, settings.telegramChatId, leadMsg).catch((err) =>
          console.warn('Telegram lead error:', err)
        );
      }

      if (settings.eskizToken || settings.eskizEmail) {
        sendEskizSms({
          phone: applicantPhone.trim(),
          message: `${settings.centerName}: Hurmatli ${applicantName.trim()}! Sizning arizangiz muvaffaqiyatli qabul qilindi. Tez orada mutaxassis siz bilan bog'lanadi. Tel: ${settings.phone}`,
          token: settings.eskizToken,
          email: settings.eskizEmail,
          password: settings.eskizPassword,
          from: settings.eskizFrom,
        }).catch((err) => console.warn('SMS error:', err));
      }

      fireCelebrationConfetti();
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setIsApplyModalOpen(false);
        setApplicantName('');
        setApplicantPhone('');
      }, 3500);
    } catch (err) {
      console.error('Lead application error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEnrollModal = (courseName: string) => {
    setSelectedCourseName(courseName);
    setIsApplyModalOpen(true);
  };

  // 6 A+ Academy inspired FAQ questions
  const faqList = [
    {
      q: language === 'ru' 
        ? 'Как проходят занятия и сколько учеников в каждой группе?' 
        : language === 'en' 
        ? 'How are classes organized and how many students are in each group?' 
        : 'Darslar qanday tartibda va necha kishilik guruhlarda o‘tiladi?',
      a: language === 'ru'
        ? 'Занятия проводятся 3 раза в неделю по 2 академических часа. В группах обучается максимум 10–12 учеников. Это позволяет наставнику уделять персональное внимание каждому ребенку и подробно разбирать все вопросы.'
        : language === 'en'
        ? 'Lessons are held 3 times a week, 2 hours each. Groups are strictly capped at 10–12 students to guarantee individual attention, personalized tracking, and rapid mastery.'
        : 'Darslar haftada 3 kun, 2 soatdan tashkil etiladi. Har bir guruhda qat’iy ravishda maksimum 10-12 nafar o‘quvchi o‘qiydi. Bu ustozga har bir o‘quvchi bilan individual shug‘ullanish va barcha mavzularni to‘liq mustahkamlash imkonini beradi.',
    },
    {
      q: language === 'ru'
        ? 'Первый пробный урок действительно бесплатный?'
        : language === 'en'
        ? 'Is the first trial lesson truly free?'
        : 'Birinchi sinov darsi rostdan ham bepulmi?',
      a: language === 'ru'
        ? 'Да, абсолютно бесплатно! Перед началом обучения вы можете посетить любой урок, ознакомиться с преподавателем, методикой преподавания и атмосферой нашего центра без каких-либо обязательств.'
        : language === 'en'
        ? 'Yes, 100% free! Before enrolling, you and your child can attend any class, experience our teaching methodology, and meet the instructor with zero obligations.'
        : 'Ha, 100% bepul! Kursga yozilishdan oldin istalgan fan bo‘yicha sinov darsimizda qatnashib, ustozning o‘qitish uslubi, dars formati va markazimiz muhiti bilan hech qanday to‘lovsiz tanishishingiz mumkin.',
    },
    {
      q: language === 'ru'
        ? 'Как родители могут отслеживать посещаемость и успеваемость?'
        : language === 'en'
        ? 'How do parents monitor attendance and academic progress?'
        : 'Farzandimning davomati va o‘zlashtirishini qanday kuzatib boraman?',
      a: language === 'ru'
        ? 'LUMOS использует автоматизированную систему оповещения в Telegram. После каждого урока родители получают отчет о посещаемости, оценку за домашнее задание и комментарии преподавателя.'
        : language === 'en'
        ? 'LUMOS features an automated Telegram reporting bot. After every class, parents receive instant notifications on attendance, test scores, homework completion, and instructor feedback.'
        : 'LUMOS tizimida maxsus avtomatlashtirilgan Telegram bot ishlaydi. Har bir dars yakunlangach, ota-onaga farzandining darsga kelganligi, uyga vazifa bahosi va ustozning fikri bir zumda yuboriladi.',
    },
    {
      q: language === 'ru'
        ? 'Сколько стоит обучение и какие способы оплаты доступны?'
        : language === 'en'
        ? 'What is the tuition fee and what payment methods are accepted?'
        : 'O‘quv to‘lovlari qancha va qanday to‘lov usullari mavjud?',
      a: language === 'ru'
        ? 'Стоимость курсов варьируется от 250 000 до 380 000 сум в месяц в зависимости от направления. Оплату можно производить через Payme, Click, банковские карты или наличными в кассе любого филиала.'
        : language === 'en'
        ? 'Monthly tuition ranges from 250,000 to 380,000 UZS depending on the track. We accept Payme, Click, bank cards, or cash at any of our branches.'
        : 'Kurslarimiz oylik to‘lovi yo‘nalishga qarab 250 000 so‘mdan 380 000 so‘mgacha. To‘lovlarni Payme, Click ilovalari, Uzcard/Humo bank kartalari yoki markazimiz filiallarida naqd shaklda amalga oshirishingiz mumkin.',
    },
    {
      q: language === 'ru'
        ? 'Какая гарантия предоставляется на достижение результата?'
        : language === 'en'
        ? 'What guarantee is provided for student outcomes?'
        : 'Natijaga qanday kafolat beriladi?',
      a: language === 'ru'
        ? 'Мы проводим первоначальную диагностику, регулярные контрольные тесты каждые 2 недели и предоставляем дополнительные бесплатные консультации для отстающих тем. 95% наших выпускников поступают в целевые вузы или сдают IELTS на 7.0+.'
        : language === 'en'
        ? 'We conduct rigorous diagnostic entry tests, bi-weekly mock exams, and provide complimentary extra mentoring hours for any topics that need strengthening. 95% of our students achieve target university admission or IELTS 7.0+.'
        : 'Biz o‘quvchini qabul qilishda dastlabki diagnostik test olamiz, har 2 haftada oraliq nazorat sinovlarini o‘tkazamiz va mavzuni tushunmagan o‘quvchilarga bepul qo‘shimcha konsultatsiya ajratamiz. Bitiruvchilarimizning 95% i o‘z maqsadiga erishadi.',
    },
    {
      q: language === 'ru'
        ? 'Какой документ выдается после окончания курса?'
        : language === 'en'
        ? 'What credential or certificate is awarded upon graduation?'
        : 'Kursni muvaffaqiyatli tamomlagach qanday hujjat beriladi?',
      a: language === 'ru'
        ? 'По окончании полного курса и успешной сдачи финального экзамена выдается официальный двуязычный сертификат LUMOS Academy с индивидуальным QR-кодом для проверки подлинности.'
        : language === 'en'
        ? 'Upon completing the curriculum and passing the final exam, students receive an official bilingual LUMOS Academy Certificate of Excellence with a verifiable online QR code.'
        : 'Kursni to‘liq tugatib, yakuniy imtihonni muvaffaqiyatli topshirgan o‘quvchilarga haqiqiyligini onlayn tekshirish imkonini beruvchi QR-kodli rasmiy ikki tilli LUMOS Academy sertifikati topshiriladi.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0808] text-[#F8F5EF] antialiased selection:bg-[#D9A83F] selection:text-[#0B0808] relative overflow-x-hidden">
      {/* Background ambient lighting glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#D9A83F]/12 via-[#17100F]/30 to-transparent blur-[140px] rounded-full" />
        <div className="absolute top-[35%] right-[-15%] w-[600px] h-[600px] bg-[#D9A83F]/8 blur-[160px] rounded-full" />
        <div className="absolute top-[65%] left-[-15%] w-[600px] h-[600px] bg-[#D9A83F]/7 blur-[160px] rounded-full" />
      </div>

      {/* =========================================================================
          1. HEADER / NAVBAR (Sticky, Luxury Glassmorphism & Gold Accent)
          ========================================================================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0B0808]/90 backdrop-blur-xl border-b border-[#D9A83F]/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-3'
            : 'bg-transparent py-5 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group focus:outline-none select-none">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[#17100F] border border-[#D9A83F]/40 shadow-lg shadow-[#D9A83F]/15 group-hover:border-[#D9A83F] transition-all">
              <img src={lumosLogo} alt="LUMOS Logo" className="h-7 w-7 object-contain drop-shadow" />
              <div className="absolute -inset-0.5 rounded-2xl bg-[#D9A83F]/20 blur-xs opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-luxury-display font-black tracking-wider text-[#F8F5EF] flex items-center gap-1.5">
                LUMOS
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#D9A83F] shadow-[0_0_8px_#D9A83F]" />
              </span>
              <span className="text-[10px] tracking-[0.2em] font-semibold text-[#B8AEA2] uppercase">
                Academy & Center
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {[
              { id: 'home', label: language === 'ru' ? 'Главная' : language === 'en' ? 'Home' : 'Bosh sahifa', href: '#' },
              { id: 'courses', label: language === 'ru' ? 'Курсы' : language === 'en' ? 'Courses' : 'Kurslar', href: '#courses' },
              { id: 'why-us', label: language === 'ru' ? 'Почему мы' : language === 'en' ? 'Why Lumos' : 'Nega Lumos?', href: '#why-us' },
              { id: 'results', label: language === 'ru' ? 'Результаты' : language === 'en' ? 'Results' : 'Natijalar', href: '#results' },
              { id: 'teachers', label: language === 'ru' ? 'Преподаватели' : language === 'en' ? 'Teachers' : 'O‘qituvchilar', href: '#teachers' },
              { id: 'about', label: language === 'ru' ? 'О нас' : language === 'en' ? 'About Us' : 'Biz haqimizda', href: '#about' },
              { id: 'branches', label: language === 'ru' ? 'Филиалы' : language === 'en' ? 'Branches' : 'Filiallar', href: '#branches' },
            ].map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`text-sm font-semibold transition-all relative py-1 ${
                    isActive
                      ? 'text-[#F4D27A] font-bold'
                      : 'text-[#B8AEA2] hover:text-[#F8F5EF]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D9A83F] to-transparent rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="hidden sm:flex items-center gap-3.5">
            {/* Search Toggle */}
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                const el = document.getElementById('courses');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-2 rounded-xl text-[#B8AEA2] hover:text-[#D9A83F] hover:bg-[#17100F] border border-transparent hover:border-[#D9A83F]/30 transition-all cursor-pointer"
              title="Qidiruv"
              aria-label="Qidiruv"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle variant="cycle" className="h-9 w-9 !bg-[#17100F] !border-[#D9A83F]/30 !text-[#D9A83F] hover:!border-[#D9A83F]" />

            {/* Language Selector */}
            <div className="flex items-center p-1 rounded-xl bg-[#17100F] border border-[#D9A83F]/25 text-xs font-bold">
              {(['uz', 'ru', 'en'] as const).map((lng) => (
                <button
                  key={lng}
                  type="button"
                  onClick={() => setLanguage(lng)}
                  className={`px-2 py-1 rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                    language === lng
                      ? 'bg-[#D9A83F] text-[#0B0808] font-black shadow-xs'
                      : 'text-[#B8AEA2] hover:text-[#F8F5EF]'
                  }`}
                >
                  {lng}
                </button>
              ))}
            </div>

            {/* Portal / Login Button */}
            <a
              href="#/login"
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#F8F5EF] hover:text-[#D9A83F] bg-[#17100F]/80 border border-[#D9A83F]/30 hover:border-[#D9A83F]/60 transition-all flex items-center gap-1.5"
            >
              <LogIn className="h-3.5 w-3.5 text-[#D9A83F]" />
              <span>{language === 'ru' ? 'Вход' : language === 'en' ? 'Log In' : 'Kirish'}</span>
            </a>

            {/* Registration CTA Button */}
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(true)}
              className="gold-gradient-btn px-5 py-2 rounded-xl text-xs uppercase tracking-wider font-extrabold cursor-pointer shadow-md shadow-[#D9A83F]/20 flex items-center gap-1.5"
            >
              <span>{language === 'ru' ? 'Записаться' : language === 'en' ? 'Register' : 'Ro‘yxatdan o‘tish'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Quick Theme for Mobile */}
            <ThemeToggle variant="cycle" className="h-8 w-8 !bg-[#17100F] !border-[#D9A83F]/30 !text-[#D9A83F]" />

            {/* Quick Lang for Mobile */}
            <button
              type="button"
              onClick={() => setLanguage(language === 'uz' ? 'ru' : language === 'ru' ? 'en' : 'uz')}
              className="px-2.5 py-1 rounded-lg bg-[#17100F] border border-[#D9A83F]/30 text-xs font-mono font-bold text-[#D9A83F] uppercase"
            >
              {language}
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-[#17100F] border border-[#D9A83F]/30 text-[#F8F5EF] hover:text-[#D9A83F] transition-colors"
              aria-label="Menyu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#17100F] border-b border-[#D9A83F]/25 px-5 py-6 space-y-4 animate-in slide-in-from-top-4 duration-300 shadow-2xl">
            <div className="flex flex-col space-y-3">
              {[
                { id: 'home', label: 'Bosh sahifa', href: '#' },
                { id: 'courses', label: 'Kurslar', href: '#courses' },
                { id: 'why-us', label: 'Nega Lumos?', href: '#why-us' },
                { id: 'results', label: 'Natijalar', href: '#results' },
                { id: 'teachers', label: 'O‘qituvchilar', href: '#teachers' },
                { id: 'about', label: 'Biz haqimizda', href: '#about' },
                { id: 'branches', label: 'Filiallar', href: '#branches' },
                { id: 'faq', label: 'FAQ', href: '#faq' },
              ].map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-semibold text-[#B8AEA2] hover:text-[#D9A83F] py-1 border-b border-white/5 flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="h-4 w-4 text-[#D9A83F]/60" />
                </a>
              ))}
            </div>

            <div className="pt-3 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsDiagnosticModalOpen(true);
                }}
                className="w-full py-2.5 rounded-xl border border-[#D9A83F]/40 text-[#D9A83F] text-xs font-bold flex items-center justify-center gap-2 bg-[#0B0808]/60"
              >
                <Sparkles className="h-4 w-4" />
                <span>Darajani Aniqlash (Test)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsApplyModalOpen(true);
                }}
                className="w-full gold-gradient-btn py-3 rounded-xl text-xs uppercase tracking-wider font-extrabold flex items-center justify-center gap-2"
              >
                <span>Ro‘yxatdan o‘tish</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <a
                href="#/login"
                className="w-full py-2.5 rounded-xl text-center text-xs font-bold text-[#B8AEA2] hover:text-[#F8F5EF]"
              >
                Kabinetga kirish (Login)
              </a>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          2. HERO SECTION (Cinematic, Large Typography, Student Visual, 3 Glass Cards)
          ========================================================================= */}
      <section
        id="home"
        className="relative pt-32 sm:pt-40 pb-20 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-center min-h-[92vh]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            {/* Top Small Luxury Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#17100F] border border-[#D9A83F]/40 shadow-lg shadow-[#D9A83F]/10">
              <Sparkles className="h-4 w-4 text-[#D9A83F]" />
              <span className="text-xs font-bold tracking-wide text-[#F4D27A]">
                Bilim — eng katta kuch!
              </span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
            </div>

            {/* Main Heading: "KELAJAGINGIZNI BUGUNDAN BOSHLANG!" */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-luxury-display font-black leading-[1.08] tracking-tight uppercase">
                <span className="text-[#F8F5EF] block drop-shadow-sm">
                  Kelajagingizni
                </span>
                <span className="gold-gradient-text block mt-1 drop-shadow-md">
                  Bugundan Boshlang!
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#B8AEA2] max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Lumos — zamonaviy ta’lim, kuchli ustozlar va real natijalar uchun yaratilgan ta’lim markazi.
              Har bir o‘quvchining qobiliyatini kashf etib, nufuzli oliygohlar va xalqaro marralar sari yetaklaymiz.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#courses"
                className="w-full sm:w-auto gold-gradient-btn px-8 py-4 rounded-2xl text-sm uppercase tracking-wider font-black flex items-center justify-center gap-2.5 shadow-xl shadow-[#D9A83F]/25 cursor-pointer"
              >
                <span>Kurslarni ko‘rish</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={() => setIsDiagnosticModalOpen(true)}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl text-sm font-bold text-[#F8F5EF] hover:text-[#D9A83F] bg-[#17100F]/90 border border-[#D9A83F]/35 hover:border-[#D9A83F] transition-all flex items-center justify-center gap-2.5 shadow-lg cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-[#D9A83F]" />
                <span>Darajani aniqlash</span>
              </button>
            </div>

            {/* 4 Small Benefits */}
            <div className="pt-6 border-t border-[#D9A83F]/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              {[
                { title: 'Sifatli ta’lim', desc: 'Xalqaro standart' },
                { title: 'Kuchli ustozlar', desc: 'Oliy toifa mutaxassislar' },
                { title: 'Zamonaviy metodika', desc: 'Interaktiv darslar' },
                { title: 'Real natijalar', desc: '95% talabalikka qabul' },
              ].map((b, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D9A83F]/20 text-[#D9A83F] shrink-0 mt-0.5">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#F8F5EF] leading-snug">{b.title}</h5>
                    <p className="text-[10px] text-[#B8AEA2]">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Large Premium Education Visual with 3 Floating Glass Cards */}
          <div className="lg:col-span-5 relative flex justify-center mt-6 lg:mt-0">
            <div className="relative w-full max-w-md lg:max-w-none">
              {/* Outer Golden Halo Glow */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#D9A83F]/30 via-[#F4D27A]/10 to-transparent blur-2xl opacity-70" />

              {/* Main Image Frame */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#D9A83F]/40 shadow-[0_20px_60px_rgba(0,0,0,0.9)] bg-[#17100F]">
                <img
                  src={heroStudentImg}
                  alt="LUMOS O‘quvchisi"
                  className="w-full h-[420px] sm:h-[480px] lg:h-[520px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0808] via-transparent to-black/30" />

                {/* Internal Brand Stamp */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B0808]/75 backdrop-blur-md border border-[#D9A83F]/30">
                  <span className="text-[11px] font-luxury-display font-black tracking-widest text-[#F4D27A] uppercase">
                    LUMOS ACADEMIC EXCELLENCE
                  </span>
                </div>
              </div>

              {/* Floating Glass Card 1: Top Right */}
              <div className="absolute -top-5 -right-4 sm:-right-6 p-3.5 rounded-2xl bg-[#17100F]/85 backdrop-blur-xl border border-[#D9A83F]/40 shadow-2xl max-w-[210px] hidden sm:flex items-center gap-3 animate-bounce duration-[6000ms]">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D9A83F]/20 text-[#D9A83F] shrink-0">
                  <Star className="h-5 w-5 fill-[#D9A83F]" />
                </div>
                <p className="text-xs font-bold text-[#F8F5EF] leading-tight">
                  Orzularingizga yetish uchun biz bilan!
                </p>
              </div>

              {/* Floating Glass Card 2: Bottom Left */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 p-3.5 rounded-2xl bg-[#17100F]/85 backdrop-blur-xl border border-[#D9A83F]/40 shadow-2xl max-w-[220px] flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D9A83F]/20 text-[#D9A83F] shrink-0">
                  <GraduationCap className="h-5 w-5 text-[#D9A83F]" />
                </div>
                <p className="text-xs font-bold text-[#F8F5EF] leading-tight">
                  Bilim bilan chegaralar yo‘q!
                </p>
              </div>

              {/* Floating Glass Card 3: Center Bottom Badge */}
              <div className="absolute bottom-4 right-4 px-4 py-2 rounded-xl bg-[#0B0808]/85 backdrop-blur-md border border-[#D9A83F]/50 shadow-lg flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#D9A83F]" />
                <span className="text-xs font-black text-[#F4D27A]">
                  95% Natijadorlik & Kafolat
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. HERO FLOATING STATISTICS BAR (4 Statistics, 2x2 on mobile)
            ========================================================================= */}
        <div className="mt-14 lg:mt-20 relative z-20">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#17100F]/95 backdrop-blur-xl border border-[#D9A83F]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1 border-r border-[#D9A83F]/15 last:border-none">
              <div className="flex items-center justify-center gap-1.5 text-2xl sm:text-4xl font-luxury-display font-black text-[#F8F5EF]">
                <span className="gold-gradient-text">500+</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#B8AEA2] uppercase tracking-wider">
                O‘quvchi
              </p>
            </div>

            <div className="space-y-1 md:border-r border-[#D9A83F]/15 last:border-none">
              <div className="flex items-center justify-center gap-1.5 text-2xl sm:text-4xl font-luxury-display font-black text-[#F8F5EF]">
                <span className="gold-gradient-text">20+</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#B8AEA2] uppercase tracking-wider">
                O‘qituvchi
              </p>
            </div>

            <div className="space-y-1 border-r border-[#D9A83F]/15 last:border-none">
              <div className="flex items-center justify-center gap-1.5 text-2xl sm:text-4xl font-luxury-display font-black text-[#F8F5EF]">
                <span className="gold-gradient-text">10+</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#B8AEA2] uppercase tracking-wider">
                Yo‘nalish
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-2xl sm:text-4xl font-luxury-display font-black text-[#F8F5EF]">
                <span className="gold-gradient-text">95%</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#B8AEA2] uppercase tracking-wider">
                Natija
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. COURSES SECTION ("Mashhur yo‘nalishlar")
          ========================================================================= */}
      <section id="courses" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#17100F] border border-[#D9A83F]/30 text-xs font-bold text-[#D9A83F]">
            <BookOpen className="h-3.5 w-3.5" />
            <span>AKADEMIK DASTURLAR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-luxury-display font-black text-[#F8F5EF] uppercase">
            Mashhur Yo‘nalishlar
          </h2>
          <p className="text-sm sm:text-base text-[#B8AEA2] max-w-2xl mx-auto">
            O‘zingizga mos kursni tanlang va kelajagingizni qurishni boshlang. Har bir dastur natijadorlikka qat’iy yo‘naltirilgan.
          </p>
        </div>

        {/* Category Filters Pills + Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 scrollbar-none">
            {categoryFilters.map((cat) => {
              const isSelected = selectedCategoryKey === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedCategoryKey(cat.key)}
                  className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'gold-gradient-btn shadow-md shadow-[#D9A83F]/25'
                      : 'bg-[#17100F] border border-[#D9A83F]/20 text-[#B8AEA2] hover:text-[#F8F5EF] hover:border-[#D9A83F]/50'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="w-full md:w-64 relative shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#B8AEA2]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kursni qidirish..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[#17100F] border border-[#D9A83F]/25 text-xs text-[#F8F5EF] placeholder-[#B8AEA2]/60 focus:border-[#D9A83F] outline-none transition-all"
            />
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="gold-card rounded-3xl p-6 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Badge & Level */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-[#D9A83F]/15 border border-[#D9A83F]/30 text-[11px] font-black text-[#F4D27A] uppercase">
                    {course.category}
                  </span>
                  <span className="text-xs font-semibold text-[#B8AEA2]">
                    {course.level}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-xl font-black text-[#F8F5EF] group-hover:text-[#F4D27A] transition-colors leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-[#B8AEA2] line-clamp-3 mt-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#D9A83F]/15 text-xs">
                  <div className="flex items-center gap-2 text-[#B8AEA2]">
                    <Clock className="h-3.5 w-3.5 text-[#D9A83F]" />
                    <span>{course.durationMonths} oy davomiyligi</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#B8AEA2]">
                    <Users className="h-3.5 w-3.5 text-[#D9A83F]" />
                    <span className="truncate">{course.instructor || 'Yetakchi ustoz'}</span>
                  </div>
                </div>

                {/* Schedule if available */}
                {course.schedule && (
                  <div className="p-2.5 rounded-xl bg-[#0B0808]/70 border border-[#D9A83F]/15 text-[11px] text-[#B8AEA2] flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-[#D9A83F] shrink-0" />
                    <span className="truncate">{course.schedule}</span>
                  </div>
                )}
              </div>

              {/* Price and CTAs */}
              <div className="pt-6 mt-4 border-t border-[#D9A83F]/15 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#B8AEA2] uppercase font-bold block">Oylik to‘lov</span>
                  <span className="text-lg font-black text-[#F4D27A] font-mono">
                    {formatMoney(course.pricePerMonth, 'UZS')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCourseForDetails(course)}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-[#F8F5EF] hover:text-[#D9A83F] hover:bg-[#0B0808] transition-colors cursor-pointer"
                  >
                    Batafsil →
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEnrollModal(course.title)}
                    className="gold-gradient-btn px-3.5 py-2 rounded-xl text-xs uppercase font-extrabold cursor-pointer shadow-sm shadow-[#D9A83F]/20"
                  >
                    Yozilish
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          5. WHY LUMOS SECTION ("Nega aynan Lumos?")
          ========================================================================= */}
      <section id="why-us" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#17100F] border border-[#D9A83F]/30 text-xs font-bold text-[#D9A83F]">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>AFZALLIKLARIMIZ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-luxury-display font-black text-[#F8F5EF] uppercase">
            Nega Aynan Lumos?
          </h2>
          <p className="text-sm sm:text-base text-[#B8AEA2] max-w-2xl mx-auto">
            Biz shunchaki o‘qitmaymiz — har bir o‘quvchining ichki salohiyatini ochib, oliy ta’lim va xalqaro marralar tomon yetaklaymiz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Kuchli ustozlar',
              desc: 'Tajribali va natijaga yo‘naltirilgan yetakchi mentorlar. Har bir o‘qituvchimiz o‘z sohasining xalqaro sertifikatlariga ega.',
              icon: Users,
            },
            {
              title: 'Zamonaviy metodika',
              desc: 'O‘quvchilar uchun qulay, interaktiv va samarali ta’lim tizimi. Zerikarli nazariya o‘rniga amaliy yondashuv.',
              icon: Sparkles,
            },
            {
              title: 'Real natijalar',
              desc: 'O‘quvchilarimizning natijalari bizning asosiy mezonimizdir. DTM maksimal ballari va IELTS 7.5+ ko‘rsatkichlari.',
              icon: TrendingUp,
            },
            {
              title: 'Individual yondashuv',
              desc: 'Har bir o‘quvchining darajasi va maqsadiga mos yondashuv. Savollarni erkin berish va tushunmagan mavzularni qayta tahlil qilish.',
              icon: HeartHandshake,
            },
            {
              title: 'Shaffof monitoring',
              desc: 'Har bir darsdan so‘ng ota-onalarga avtomatik Telegram xabarnomasi: davomat, darsdagi faollik va o‘zlashtirish nazorati.',
              icon: MessageCircle,
            },
            {
              title: 'Kichik guruhlar (10-12 kishi)',
              desc: 'Guruhlarda talabalar soni qat’iy chegaralangan, bu esa ustozning to‘liq e’tiborini kafolatlaydi.',
              icon: ShieldCheck,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="gold-card rounded-3xl p-7 space-y-4 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D9A83F]/15 border border-[#D9A83F]/35 text-[#D9A83F] group-hover:scale-110 group-hover:bg-[#D9A83F] group-hover:text-[#0B0808] transition-all">
                  <Icon className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-luxury-display font-black text-[#F8F5EF] group-hover:text-[#F4D27A] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#B8AEA2] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          6. RESULTS / ACHIEVEMENTS SECTION ("Natijalar")
          ========================================================================= */}
      <section id="results" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#17100F] to-[#0B0808] border border-[#D9A83F]/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D9A83F]/10 blur-3xl pointer-events-none rounded-full" />

          <div className="text-center space-y-3 mb-12 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B0808] border border-[#D9A83F]/30 text-xs font-bold text-[#D9A83F]">
              <Award className="h-3.5 w-3.5" />
              <span>ISBOTLANGAN NATIJALAR</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-luxury-display font-black text-[#F8F5EF] uppercase">
              Bizning Faxrli Natijalarimiz
            </h2>
            <p className="text-sm sm:text-base text-[#B8AEA2] max-w-2xl mx-auto">
              Lumos bitiruvchilarining yutuqlari — bizning haqiqiy yuzimiz va mashaqqatli mehnatimiz mevasidir.
            </p>
          </div>

          {/* 4 Featured Achievements Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
            {[
              {
                badge: 'DTM 189.0 BALL',
                student: 'Bekzod Rahmonov',
                achievement: 'Toshkent Davlat Yuridik Universiteti',
                detail: '100% Davlat Granti',
                teacher: 'Hadicha ustoz o‘quvchisi',
                color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/40',
              },
              {
                badge: 'IELTS BAND 8.0',
                student: 'Madina Karimova',
                achievement: 'Listening 8.5, Reading 8.5',
                detail: 'Xalqaro Grant Sohibasi',
                teacher: 'Hasanboy ustoz o‘quvchisi',
                color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/40',
              },
              {
                badge: 'RESPUBLIKA 1-O‘RINI',
                student: 'Jasur Shokirov',
                achievement: 'Al-Xorazmiy Olimpiadasi',
                detail: 'Oltin Medal Sohibi',
                teacher: 'Hadicha ustoz o‘quvchisi',
                color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40',
              },
              {
                badge: 'PREZIDENT MAKTABI',
                student: 'Fotima Zokirova',
                achievement: '96 Ball bilan Qabul',
                detail: 'Eng Yuqori Ko‘rsatkich',
                teacher: 'Lumos Akademik Guruhi',
                color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/40',
              },
            ].map((card, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl bg-[#0B0808]/85 border ${card.color} space-y-3 relative group hover:-translate-y-1.5 transition-transform`}
              >
                <div className="inline-block px-2.5 py-1 rounded-lg bg-[#D9A83F]/20 text-[10px] font-black text-[#F4D27A] tracking-wider uppercase">
                  {card.badge}
                </div>
                <div>
                  <h4 className="text-base font-black text-[#F8F5EF]">{card.student}</h4>
                  <p className="text-xs text-[#D9A83F] font-semibold mt-0.5">{card.achievement}</p>
                  <p className="text-[11px] text-[#B8AEA2] mt-1">{card.detail}</p>
                </div>
                <div className="pt-2 border-t border-white/5 text-[10px] font-semibold text-[#B8AEA2]">
                  {card.teacher}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. TEACHERS SECTION ("Bizning ustozlar")
          ========================================================================= */}
      <section id="teachers" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#17100F] border border-[#D9A83F]/30 text-xs font-bold text-[#D9A83F]">
            <Users className="h-3.5 w-3.5" />
            <span>YETAKCHI MUTAXASSISLAR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-luxury-display font-black text-[#F8F5EF] uppercase">
            Bizning Ustozlar
          </h2>
          <p className="text-sm sm:text-base text-[#B8AEA2] max-w-2xl mx-auto">
            O‘z fanini chuqur sevadigan, yuksak natijalar yaratgan va har bir o‘quvchini yuksak marralarga yetaklaydigan tajribali pedagoglar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Hadicha Ustoz Card */}
          <div className="gold-card rounded-3xl p-8 space-y-6 group">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#D9A83F] to-[#F4D27A] text-[#0B0808] font-luxury-display font-black text-3xl shadow-xl shadow-[#D9A83F]/20 group-hover:scale-105 transition-transform">
                ∑
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#D9A83F]/15 border border-[#D9A83F]/30 text-[10px] font-black text-[#F4D27A] uppercase">
                  Oliy Toifali Mutaxassis
                </span>
                <h3 className="text-2xl font-luxury-display font-black text-[#F8F5EF] mt-1">
                  Hadicha ustoz
                </h3>
                <p className="text-xs text-[#D9A83F] font-semibold">
                  Matematika, Mantiq & DTM Bo‘yicha Bosh Murabbiy
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#B8AEA2] leading-relaxed">
              O‘quvchilarni olimpiadalar va nufuzli oliygohlarga tayyorlash bo‘yicha 8 yillik tajribaga ega.
              Murakkab tenglamalar va geometriyani eng oson mantiqiy formulalar bilan tushuntiradi.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#D9A83F]/15 text-xs">
              <div>
                <span className="text-[10px] text-[#B8AEA2] uppercase block">Dars kunlari:</span>
                <span className="font-bold text-[#F8F5EF]">Dush - Chor - Juma</span>
              </div>
              <div>
                <span className="text-[10px] text-[#B8AEA2] uppercase block">Dars vaqti:</span>
                <span className="font-bold text-[#F8F5EF]">14:00 - 16:00</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenEnrollModal('Matematika (Hadicha ustoz)')}
              className="w-full gold-gradient-btn py-3 rounded-xl text-xs uppercase tracking-wider font-extrabold cursor-pointer shadow-md shadow-[#D9A83F]/20 flex items-center justify-center gap-2"
            >
              <span>Hadicha ustoz guruhiga yozilish</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Hasanboy Ustoz Card */}
          <div className="gold-card rounded-3xl p-8 space-y-6 group">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#3B82F6] to-[#60A5FA] text-white font-luxury-display font-black text-3xl shadow-xl shadow-blue-500/20 group-hover:scale-105 transition-transform">
                EN
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-[10px] font-black text-blue-400 uppercase">
                  IELTS Band 8.0 Expert
                </span>
                <h3 className="text-2xl font-luxury-display font-black text-[#F8F5EF] mt-1">
                  Hasanboy ustoz
                </h3>
                <p className="text-xs text-blue-400 font-semibold">
                  IELTS & General English Bo‘yicha Yetakchi Mutaxassis
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#B8AEA2] leading-relaxed">
              Xalqaro sertifikat egasi, speaking to‘siqlarini yengish va akademik yozish (Writing) bo‘yicha mualliflik metodikasi asoschisi.
              Shogirdlarining 90% dan ortig‘i 7.0+ ball to‘plagan.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#D9A83F]/15 text-xs">
              <div>
                <span className="text-[10px] text-[#B8AEA2] uppercase block">Dars kunlari:</span>
                <span className="font-bold text-[#F8F5EF]">Sesh - Pay - Shan</span>
              </div>
              <div>
                <span className="text-[10px] text-[#B8AEA2] uppercase block">Dars vaqti:</span>
                <span className="font-bold text-[#F8F5EF]">15:30 - 17:30</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenEnrollModal('Ingliz Tili (Hasanboy ustoz)')}
              className="w-full gold-gradient-btn py-3 rounded-xl text-xs uppercase tracking-wider font-extrabold cursor-pointer shadow-md shadow-[#D9A83F]/20 flex items-center justify-center gap-2"
            >
              <span>Hasanboy ustoz guruhiga yozilish</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. ABOUT LUMOS ("Lumos haqida" — 2-Column Layout)
          ========================================================================= */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Luxury Image Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#D9A83F]/40 shadow-2xl bg-[#17100F]">
              <img
                src={aboutAcademyImg}
                alt="Lumos Ta’lim Zali"
                className="w-full h-[380px] sm:h-[460px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0808] via-transparent to-black/30" />
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute -bottom-5 right-6 p-4 rounded-2xl bg-[#17100F]/90 backdrop-blur-xl border border-[#D9A83F]/50 shadow-2xl flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D9A83F] text-[#0B0808] font-black text-lg">
                ★
              </div>
              <div>
                <span className="text-sm font-black text-[#F8F5EF] block">10 Yillik Tajriba</span>
                <span className="text-[11px] text-[#B8AEA2]">Ilmiy va pedagogik yondashuv</span>
              </div>
            </div>
          </div>

          {/* Right: Story, Mission & Values */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#17100F] border border-[#D9A83F]/30 text-xs font-bold text-[#D9A83F]">
              <Compass className="h-3.5 w-3.5" />
              <span>BIZNING MISSIYA</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-luxury-display font-black text-[#F8F5EF] uppercase leading-tight">
              Lumos — Maqsad Sari Ishonchli Ta’lim Makoni
            </h2>

            <p className="text-sm sm:text-base text-[#B8AEA2] leading-relaxed">
              LUMOS ta’lim markazi yoshlarni faqatgina imtihonlarga tayyorlash bilan cheklanmaydi.
              Biz har bir o‘quvchida mustaqil fikrlash, muammolarga yechim topish va o‘z kuchiga ishonch hissini shakllantiramiz.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#D9A83F]/20 text-[#D9A83F] shrink-0 mt-0.5">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F8F5EF]">Halollik va Ochiqlik</h4>
                  <p className="text-xs text-[#B8AEA2]">Har bir o‘quvchi natijasi va ota-onalar hisoboti 100% shaffof olib boriladi.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#D9A83F]/20 text-[#D9A83F] shrink-0 mt-0.5">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F8F5EF]">Zamonaviy Ilmiy Standartlar</h4>
                  <p className="text-xs text-[#B8AEA2]">Eng so‘nggi darsliklar, interaktiv texnologiyalar va amaliy keyslar.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#D9A83F]/20 text-[#D9A83F] shrink-0 mt-0.5">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F8F5EF]">Kafolatlangan Natijaviylik</h4>
                  <p className="text-xs text-[#B8AEA2]">Har bir talaba darslarni o‘z vaqtida bajarsa, belgilangan marraga kafolat bilan erishadi.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(true)}
                className="gold-gradient-btn px-7 py-3.5 rounded-2xl text-xs uppercase tracking-wider font-extrabold flex items-center gap-2 shadow-lg shadow-[#D9A83F]/20 cursor-pointer"
              >
                <span>Markaz bilan tanishish →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. BRANCHES SECTION ("Filiallarimiz")
          ========================================================================= */}
      <section id="branches" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#17100F] border border-[#D9A83F]/30 text-xs font-bold text-[#D9A83F]">
            <MapPin className="h-3.5 w-3.5" />
            <span>KAMPUSLAR VA FILIALLAR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-luxury-display font-black text-[#F8F5EF] uppercase">
            Filiallarimiz
          </h2>
          <p className="text-sm sm:text-base text-[#B8AEA2] max-w-2xl mx-auto">
            O‘zingizga eng yaqin bo‘lgan qulay filialni tanlang va birinchi bepul sinov darsimizda ishtirok eting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INITIAL_BRANCHES.map((b) => (
            <div key={b.id} className="gold-card rounded-3xl p-6 flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#D9A83F]/15 border border-[#D9A83F]/30 text-[10px] font-black text-[#F4D27A] uppercase">
                    {b.city}
                  </span>
                  <span className="text-[10px] font-bold text-[#10B981] flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                    Faol
                  </span>
                </div>

                <h3 className="text-lg font-luxury-display font-black text-[#F8F5EF] group-hover:text-[#F4D27A] transition-colors leading-snug">
                  {b.name}
                </h3>

                <p className="text-xs text-[#B8AEA2] flex items-start gap-2 pt-1">
                  <MapPin className="h-4 w-4 text-[#D9A83F] shrink-0 mt-0.5" />
                  <span>{b.address}</span>
                </p>

                <p className="text-xs text-[#B8AEA2] flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[#D9A83F] shrink-0" />
                  <span className="font-mono">{b.phone}</span>
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-[#D9A83F]/15 flex items-center justify-between">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(b.address + ' ' + b.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#F4D27A] hover:underline flex items-center gap-1"
                >
                  <span>Xaritada ko‘rish</span>
                  <ExternalLink className="h-3 w-3" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setApplicantBranch(b.name);
                    setIsApplyModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#0B0808] border border-[#D9A83F]/30 text-[11px] font-bold text-[#F8F5EF] hover:border-[#D9A83F] transition-colors"
                >
                  Tanlash
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          10. FAQ ACCORDION SECTION ("Ko‘p beriladigan savollar")
          ========================================================================= */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#17100F] border border-[#D9A83F]/30 text-xs font-bold text-[#D9A83F]">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>SAVOLLAR VA JAVOBLAR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-luxury-display font-black text-[#F8F5EF] uppercase">
            Ko‘p Beriladigan Savollar
          </h2>
          <p className="text-sm sm:text-base text-[#B8AEA2]">
            Ota-onalar va o‘quvchilarimiz tomonidan eng ko‘p beriladigan muhim savollarga aniq javoblar.
          </p>
        </div>

        <div className="space-y-4">
          {faqList.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="gold-card rounded-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-base font-bold text-[#F8F5EF]">
                    {item.q}
                  </span>
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-[#0B0808] border border-[#D9A83F]/30 text-[#D9A83F] shrink-0 transition-transform ${isOpen ? 'rotate-180 bg-[#D9A83F] text-[#0B0808]' : ''}`}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#B8AEA2] leading-relaxed border-t border-[#D9A83F]/15 animate-in fade-in duration-200">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          11. FINAL POWERFUL CTA SECTION (Dark background with Gold glow)
          ========================================================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="relative rounded-3xl p-10 sm:p-16 text-center bg-gradient-to-b from-[#17100F] via-[#17100F] to-[#0B0808] border-2 border-[#D9A83F]/40 shadow-[0_20px_80px_rgba(0,0,0,0.9)] overflow-hidden">
          {/* Ambient center gold bulb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#D9A83F]/15 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B0808] border border-[#D9A83F]/40 text-xs font-bold text-[#F4D27A]">
              <Sparkles className="h-3.5 w-3.5 text-[#D9A83F]" />
              <span>YANGI O‘QUV MAVSUMIGA QABUL DAVOM ETMOQDA</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-luxury-display font-black text-[#F8F5EF] uppercase leading-tight">
              Kelajagingiz uchun birinchi qadamni bugun tashlang.
            </h2>

            <p className="text-sm sm:text-base text-[#B8AEA2] max-w-2xl mx-auto leading-relaxed">
              Lumos bilan bilim, rivojlanish va natija sari harakat qiling. Hoziroq ro‘yxatdan o‘ting va birinchi bepul sinov darsimizga taklifnoma oling!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="#courses"
                className="w-full sm:w-auto gold-gradient-btn px-9 py-4 rounded-2xl text-sm uppercase tracking-wider font-black shadow-xl shadow-[#D9A83F]/30 flex items-center justify-center gap-2"
              >
                <span>Kurslarni ko‘rish</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <button
                type="button"
                onClick={() => setIsApplyModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold text-[#F8F5EF] hover:text-[#D9A83F] bg-[#0B0808] border border-[#D9A83F]/40 hover:border-[#D9A83F] transition-all flex items-center justify-center gap-2"
              >
                <span>Ro‘yxatdan o‘tish</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          12. LUXURY FOOTER
          ========================================================================= */}
      <footer className="bg-[#080505] border-t border-[#D9A83F]/20 pt-16 pb-12 px-4 sm:px-6 lg:px-8 relative z-10 text-xs text-[#B8AEA2]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#D9A83F]/15">
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img src={lumosLogo} alt="LUMOS Logo" className="h-8 w-8 object-contain" />
              <span className="text-2xl font-luxury-display font-black text-[#F8F5EF] tracking-wider">
                LUMOS
              </span>
            </div>
            <p className="text-xs text-[#B8AEA2] leading-relaxed max-w-sm">
              Lumos — zamonaviy metodika, tajribali ustozlar va yuqori natijadorlikni birlashtirgan yetakchi ta’lim markazi.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://t.me/lumos_edu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#17100F] border border-[#D9A83F]/30 text-[#D9A83F] hover:bg-[#D9A83F] hover:text-[#0B0808] transition-colors"
                title="Telegram"
              >
                <Send className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://instagram.com/lumos_edu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#17100F] border border-[#D9A83F]/30 text-[#D9A83F] hover:bg-[#D9A83F] hover:text-[#0B0808] transition-colors"
                title="Instagram"
              >
                <Star className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Col 2: Tezkor Havolalar */}
          <div className="space-y-3">
            <h5 className="font-luxury-display font-bold text-sm text-[#F8F5EF] uppercase tracking-wider">
              Navigatsiya
            </h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-[#F4D27A] transition-colors">Bosh sahifa</a></li>
              <li><a href="#courses" className="hover:text-[#F4D27A] transition-colors">Kurslarimiz</a></li>
              <li><a href="#why-us" className="hover:text-[#F4D27A] transition-colors">Nega Lumos?</a></li>
              <li><a href="#results" className="hover:text-[#F4D27A] transition-colors">Natijalar</a></li>
              <li><a href="#teachers" className="hover:text-[#F4D27A] transition-colors">O‘qituvchilar</a></li>
              <li><a href="#about" className="hover:text-[#F4D27A] transition-colors">Lumos haqida</a></li>
            </ul>
          </div>

          {/* Col 3: Ommabop Kurslar */}
          <div className="space-y-3">
            <h5 className="font-luxury-display font-bold text-sm text-[#F8F5EF] uppercase tracking-wider">
              Kurslar
            </h5>
            <ul className="space-y-2">
              <li><a href="#courses" className="hover:text-[#F4D27A] transition-colors">Matematika & DTM</a></li>
              <li><a href="#courses" className="hover:text-[#F4D27A] transition-colors">IELTS Intensive 7.5+</a></li>
              <li><a href="#courses" className="hover:text-[#F4D27A] transition-colors">General English</a></li>
              <li><a href="#courses" className="hover:text-[#F4D27A] transition-colors">Frontend & IT Asoslari</a></li>
              <li><a href="#courses" className="hover:text-[#F4D27A] transition-colors">Prezident Maktabiga Tayyorlov</a></li>
            </ul>
          </div>

          {/* Col 4: Aloqa va Manzil */}
          <div className="space-y-3">
            <h5 className="font-luxury-display font-bold text-sm text-[#F8F5EF] uppercase tracking-wider">
              Bog‘lanish
            </h5>
            <p className="text-xs text-[#B8AEA2]">
              Toshkent sh., Amir Temur shox ko‘chasi, 108
            </p>
            <p className="text-xs font-mono font-bold text-[#F4D27A]">
              +998 (71) 200-00-25
            </p>
            <p className="text-xs text-[#B8AEA2]">
              Dush - Shan: 08:00 - 20:00
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#B8AEA2]">
          <p>© {new Date().getFullYear()} LUMOS Ta’lim Markazi. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-4">
            <a href="#/login" className="hover:text-[#D9A83F] transition-colors font-semibold">Tizimga Kirish</a>
            <span>•</span>
            <a href="#/admin" className="hover:text-[#D9A83F] transition-colors font-semibold">Boshqaruv Paneli</a>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          MODALS INTEGRATION (Diagnostic Quiz, Course Syllabus, Quick Application)
          ========================================================================= */}
      <DiagnosticTestModal
        isOpen={isDiagnosticModalOpen}
        onClose={() => setIsDiagnosticModalOpen(false)}
      />

      <CourseDetailsModal
        course={selectedCourseForDetails}
        isOpen={!!selectedCourseForDetails}
        onClose={() => setSelectedCourseForDetails(null)}
        onEnroll={(title) => handleOpenEnrollModal(title)}
      />

      {/* Quick Application Modal */}
      {isApplyModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md rounded-3xl bg-[#17100F] border border-[#D9A83F]/40 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#D9A83F]/15 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D9A83F]/20 text-[#D9A83F]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-luxury-display font-black text-[#F8F5EF]">
                  Guruhga Yozilish
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="p-1.5 rounded-lg text-[#B8AEA2] hover:text-[#F8F5EF] hover:bg-[#0B0808] transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold text-[#F8F5EF]">Arizangiz qabul qilindi!</h4>
                <p className="text-xs text-[#B8AEA2]">
                  15 daqiqa ichida administratorimiz siz bilan bog‘lanadi va birinchi sinov darsi vaqtini tasdiqlaydi.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplicationSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#B8AEA2] mb-1.5">
                    Ism va Familiyangiz *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="Masalan: Jasur Olimov"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0808] border border-[#D9A83F]/30 text-xs text-[#F8F5EF] placeholder-[#B8AEA2]/50 focus:border-[#D9A83F] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#B8AEA2] mb-1.5">
                    Telefon raqamingiz *
                  </label>
                  <input
                    type="tel"
                    required
                    value={applicantPhone}
                    onChange={handlePhoneChange}
                    placeholder="+998 (90) 123-45-67"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0808] border border-[#D9A83F]/30 text-xs text-[#F8F5EF] font-mono placeholder-[#B8AEA2]/50 focus:border-[#D9A83F] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#B8AEA2] mb-1.5">
                    Tanlangan Kurs
                  </label>
                  <select
                    value={selectedCourseName}
                    onChange={(e) => setSelectedCourseName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0808] border border-[#D9A83F]/30 text-xs text-[#F8F5EF] focus:border-[#D9A83F] outline-none cursor-pointer"
                  >
                    {INITIAL_COURSES.map((c) => (
                      <option key={c.id} value={c.title}>
                        {c.title} ({formatMoney(c.pricePerMonth, 'UZS')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#B8AEA2] mb-1.5">
                    Qulay Filial
                  </label>
                  <select
                    value={applicantBranch}
                    onChange={(e) => setApplicantBranch(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0B0808] border border-[#D9A83F]/30 text-xs text-[#F8F5EF] focus:border-[#D9A83F] outline-none cursor-pointer"
                  >
                    {INITIAL_BRANCHES.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name} ({b.address})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !applicantName.trim() || applicantPhone.length < 18}
                    className="w-full gold-gradient-btn py-3 rounded-xl text-xs uppercase tracking-wider font-extrabold shadow-lg shadow-[#D9A83F]/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isSubmitting ? 'Yuborilmoqda...' : 'Bepul Sinov Darsiga Yozilish'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
