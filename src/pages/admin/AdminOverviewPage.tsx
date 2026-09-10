import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  Users,
  Wallet,
  Building2,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  GraduationCap,
  ArrowRight,
  Clock,
  Sparkles,
  Send,
  Calendar,
  Layers,
  BarChart3,
  CheckCircle2,
  Phone,
  UserCheck,
  Download,
  Plus,
  CreditCard,
  Search,
  Check,
  ShieldCheck,
  ChevronRight,
  FileText,
  Eye,
  History,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatMoney, useI18n, Language } from '../../lib/i18n';

interface AdminOverviewPageProps {
  onNavigateTab: (tabId: string) => void;
}

type MonthKey = 'July' | 'August' | 'September';
type TeacherScope = 'all' | 'hadicha' | 'hasanboy';

const MONTH_LABELS_BY_LANG: Record<MonthKey, Record<Language, { label: string; full: string }>> = {
  July: {
    uz: { label: 'Iyul', full: 'Iyul Oyi' },
    ru: { label: 'Июль', full: 'Месяц Июль' },
    en: { label: 'July', full: 'Month of July' },
  },
  August: {
    uz: { label: 'Avgust', full: 'Avgust Oyi' },
    ru: { label: 'Август', full: 'Месяц Август' },
    en: { label: 'August', full: 'Month of August' },
  },
  September: {
    uz: { label: 'Sentabr', full: 'Sentabr Oyi' },
    ru: { label: 'Сентябрь', full: 'Месяц Сентябрь' },
    en: { label: 'September', full: 'Month of September' },
  },
};

const getTodayFormatted = (lang: Language): string => {
  const d = new Date();
  const day = d.getDate();
  const year = d.getFullYear();

  if (lang === 'ru') {
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    return `${days[d.getDay()]}, ${day}-${months[d.getMonth()]}, ${year}-й год`;
  }
  if (lang === 'en') {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${day}, ${year}`;
  }
  const monthsUz = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
  const daysUz = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
  return `${year}-yil, ${day}-${monthsUz[d.getMonth()]}, ${daysUz[d.getDay()]}`;
};

const getGreeting = (lang: Language, hour: number): string => {
  if (lang === 'ru') {
    return hour < 11 ? 'Доброе утро' : hour < 18 ? 'Добрый день' : 'Добрый вечер';
  }
  if (lang === 'en') {
    return hour < 11 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  }
  return hour < 11 ? 'Xayrli tong' : hour < 18 ? 'Xayrli kun' : 'Xayrli kech';
};

const OVERVIEW_TEXTS = {
  uz: {
    adminGreeting: 'Hurmatli Administrator!',
    today: 'Bugun',
    systemNormal: 'Tizim barcha o‘quv kurslari va guruhlar bo‘yicha barqaror ishlamoqda.',
    addStudent: '+ O‘quvchi',
    receivePayment: '+ To‘lov',
    addGroup: '+ Guruh',
    schedule: 'Dars Jadvali',
    superAdminBadge: 'Super Admin Boshqaruv Markazi',
    liveSystem: 'Jonli Tizim Faol',
    academicYear: 'Akademik Yil',
    mainTitle: 'Hadicha Ustoz (Matematika) & Moliya Markazi',
    mainDesc: 'Real Excel jadvali bo‘yicha Iyul, Avgust va Sentabr oylari hisob-kitoblari: 11 nafar o‘quvchi to‘lovlari, kelgan-kelmagan davomati, o‘qituvchi xarajatlari va sof foyda auditi.',
    receivePaymentBtn: 'To‘lov Qabul Qilish',
    addStudentBtn: 'O‘quvchi Qo‘shish',
    exportBtn: 'Eksport',
    expectedRevenue: 'Kutilgan Tushum',
    expectedSub: '11 o‘quvchi x 250 000 UZS',
    actualRevenue: 'Haqiqiy Tushum',
    collected: 'yig‘ildi',
    paidCountSub: 'nafar to‘ladi',
    teacherExpenses: 'Ustoz Chiqimi',
    teacherSalaryShare: 'Ustoz ish haqi (50%)',
    fullyPaid: 'To‘liq to‘lab berilgan ✓',
    netProfit: 'Sof Foyda',
    profitMargin: 'Rentabellik',
    centerMargin: 'O‘quv markaz marjasi',
    totalStudents: 'O‘quvchilar Soni',
    studentsCountUnit: 'nafar',
    activeParticipation: '100% Faol Ishtirok',
    group1Math: '1-Guruh Matematika',
    attendanceRate: 'Davomat Ko‘rsatkichi',
    highAttendance: 'Yuqori Qatnashuv',
    noExcuses: '0 sababsiz qoldirish',
    growthTitle: '3 Oylik Tushum va Sof Foyda Dinamikasi',
    growthSubtitle: 'Iyul, Avgust va Sentabr oylari bo‘yicha solishtirma tahlil (so‘mda)',
    excelMatch: 'Excel Bilan 100% Mos',
    chartIncome: 'Tushum (Kirim)',
    chartProfit: 'Sof Foyda',
    total3MonthsIncome: 'Jami 3 Oylik Tushum',
    total3MonthsExpenses: 'Jami Chiqim (Maosh)',
    total3MonthsProfit: 'Jami Sof Foyda',
    paymentBreakdownTitle: 'Oyi To‘lov Taqsimoti',
    paymentBreakdownSubtitle: 'To‘langanlar va kutilayotgan qarzdorlik',
    paidShare: 'To‘langan ulush',
    paidLabel: 'To‘ladi',
    debtLabel: 'Qarz',
    smsTitle: 'Avtomatlashtirilgan SMS',
    smsSubtitle: 'ota-ona',
    smsDesc: 'oyi uchun to‘lov eslatmasini ota-onalarga bitta bosishda jo‘nating.',
    smsSent: 'Eslatmalar yuborildi! ✓',
    sendSmsBtn: 'Barcha Qarzdorlarga SMS Yuborish',
    searchPlaceholder: 'O‘quvchi ismi yoki telefon raqami bo‘yicha qidiruv...',
    filterAll: 'Barchasi',
    filterPaid: 'To‘laganlar',
    filterUnpaid: 'Qarzdorlar',
    filterAttendance: '100% Davomat',
    thNumber: '#',
    thStudent: 'O‘quvchi FISH',
    thPhone: 'Telefon',
    thJuly: 'Iyul To‘lovi',
    thAugust: 'Avgust To‘lovi',
    thSeptember: 'Sentabr To‘lovi',
    thAttendance: 'Davomat / Ishtirok',
    thActions: 'Amallar',
    tablePending: 'Kutilmoqda',
    tablePayBtn: 'To‘lov',
    recentTxTitle: 'So‘nggi To‘lovlar & Tranzaksiyalar Lentasi',
    recentTxSubtitle: 'Hadicha ustoz o‘quvchilari tomonidan amalga oshirilgan to‘lovlar',
    realTimeBadge: 'Real Vaqt',
    scheduleCardTitle: 'Dars Jadvali & Xonalar',
    scheduleCardSubtitle: 'Faol kurslar va auditoriyalar yuklamasi',
    roomOccupancy: 'Auditoriya bandligi',
  },
  ru: {
    adminGreeting: 'Уважаемый Администратор!',
    today: 'Сегодня',
    systemNormal: 'Система стабильно работает по всем учебным курсам и группам.',
    addStudent: '+ Ученик',
    receivePayment: '+ Оплата',
    addGroup: '+ Группа',
    schedule: 'Расписание',
    superAdminBadge: 'Центр управления Super Admin',
    liveSystem: 'Система активна',
    academicYear: 'Учебный год',
    mainTitle: 'Учитель Хадича (Математика) и Финансовый центр',
    mainDesc: 'Расчеты за Июль, Август и Сентябрь по данным Excel: оплата 11 студентов, посещаемость, расходы преподавателя и аудит чистой прибыли.',
    receivePaymentBtn: 'Принять оплату',
    addStudentBtn: 'Добавить ученика',
    exportBtn: 'Экспорт',
    expectedRevenue: 'Ожидаемый доход',
    expectedSub: '11 учеников x 250 000 UZS',
    actualRevenue: 'Фактический доход',
    collected: 'собрано',
    paidCountSub: 'оплатили',
    teacherExpenses: 'Расход на учителя',
    teacherSalaryShare: 'Зарплата учителя (50%)',
    fullyPaid: 'Полностью выплачено ✓',
    netProfit: 'Чистая прибыль',
    profitMargin: 'Рентабельность',
    centerMargin: 'Маржа учебного центра',
    totalStudents: 'Число учеников',
    studentsCountUnit: 'чел.',
    activeParticipation: '100% Активное участие',
    group1Math: '1-я группа Математика',
    attendanceRate: 'Посещаемость',
    highAttendance: 'Высокая посещаемость',
    noExcuses: '0 пропусков без причины',
    growthTitle: 'Динамика доходов и чистой прибыли за 3 месяца',
    growthSubtitle: 'Сравнительный анализ за Июль, Август и Сентябрь (в сумах)',
    excelMatch: '100% совпадение с Excel',
    chartIncome: 'Поступления (Доход)',
    chartProfit: 'Чистая прибыль',
    total3MonthsIncome: 'Всего доход за 3 месяца',
    total3MonthsExpenses: 'Всего расход (Зарплаты)',
    total3MonthsProfit: 'Всего чистая прибыль',
    paymentBreakdownTitle: 'Распределение оплат за',
    paymentBreakdownSubtitle: 'Оплаченные суммы и ожидаемая задолженность',
    paidShare: 'Оплаченная доля',
    paidLabel: 'Оплатили',
    debtLabel: 'Долг',
    smsTitle: 'Автоматические SMS',
    smsSubtitle: 'родителей',
    smsDesc: 'Отправьте напоминание об оплате родителям в один клик.',
    smsSent: 'Напоминания отправлены! ✓',
    sendSmsBtn: 'Отправить SMS всем должникам',
    searchPlaceholder: 'Поиск по имени ученика или номеру телефона...',
    filterAll: 'Все',
    filterPaid: 'Оплатившие',
    filterUnpaid: 'Должники',
    filterAttendance: '100% Посещаемость',
    thNumber: '#',
    thStudent: 'ФИО ученика',
    thPhone: 'Телефон',
    thJuly: 'Оплата за Июль',
    thAugust: 'Оплата за Август',
    thSeptember: 'Оплата за Сентябрь',
    thAttendance: 'Посещаемость / Статус',
    thActions: 'Действия',
    tablePending: 'Ожидается',
    tablePayBtn: 'Оплата',
    recentTxTitle: 'Лента последних платежей и транзакций',
    recentTxSubtitle: 'Платежи учеников преподавателя Хадичи',
    realTimeBadge: 'В реальном времени',
    scheduleCardTitle: 'Расписание занятий и аудитории',
    scheduleCardSubtitle: 'Активные курсы и загрузка аудиторий',
    roomOccupancy: 'Загрузка аудиторий',
  },
  en: {
    adminGreeting: 'Dear Administrator!',
    today: 'Today',
    systemNormal: 'The system is running smoothly across all courses and groups.',
    addStudent: '+ Student',
    receivePayment: '+ Payment',
    addGroup: '+ Group',
    schedule: 'Class Schedule',
    superAdminBadge: 'Super Admin Control Center',
    liveSystem: 'Live System Active',
    academicYear: 'Academic Year',
    mainTitle: 'Teacher Hadicha (Mathematics) & Financial Center',
    mainDesc: 'Actual Excel data analysis for July, August, and September: 11 student tuition fees, attendance verification, teacher expense, and net profit audit.',
    receivePaymentBtn: 'Receive Payment',
    addStudentBtn: 'Add Student',
    exportBtn: 'Export CSV',
    expectedRevenue: 'Expected Revenue',
    expectedSub: '11 students x 250,000 UZS',
    actualRevenue: 'Actual Revenue',
    collected: 'collected',
    paidCountSub: 'students paid',
    teacherExpenses: 'Teacher Expenses',
    teacherSalaryShare: 'Teacher share (50%)',
    fullyPaid: 'Fully paid ✓',
    netProfit: 'Net Profit',
    profitMargin: 'Margin',
    centerMargin: 'Education center margin',
    totalStudents: 'Total Students',
    studentsCountUnit: 'students',
    activeParticipation: '100% Active Enrollment',
    group1Math: 'Group 1 Mathematics',
    attendanceRate: 'Attendance Rate',
    highAttendance: 'High Attendance',
    noExcuses: '0 unexcused absences',
    growthTitle: '3-Month Revenue & Net Profit Trend',
    growthSubtitle: 'Comparative financial analysis for July, August, and September (in UZS)',
    excelMatch: '100% Matches Excel',
    chartIncome: 'Revenue (Income)',
    chartProfit: 'Net Profit',
    total3MonthsIncome: 'Total 3-Month Revenue',
    total3MonthsExpenses: 'Total Expenses (Salaries)',
    total3MonthsProfit: 'Total Net Profit',
    paymentBreakdownTitle: 'Payment Breakdown for',
    paymentBreakdownSubtitle: 'Collected tuition vs outstanding debt',
    paidShare: 'Paid share',
    paidLabel: 'Paid',
    debtLabel: 'Debt',
    smsTitle: 'Automated SMS Reminder',
    smsSubtitle: 'parents',
    smsDesc: 'Send immediate payment reminders to parent numbers with a single click.',
    smsSent: 'Reminders Sent! ✓',
    sendSmsBtn: 'Send SMS to All Debtors',
    searchPlaceholder: 'Search by student name or phone number...',
    filterAll: 'All',
    filterPaid: 'Paid',
    filterUnpaid: 'Debtors',
    filterAttendance: '100% Attendance',
    thNumber: '#',
    thStudent: 'Student Full Name',
    thPhone: 'Phone',
    thJuly: 'July Payment',
    thAugust: 'August Payment',
    thSeptember: 'September Payment',
    thAttendance: 'Attendance / Status',
    thActions: 'Actions',
    tablePending: 'Pending',
    tablePayBtn: 'Payment',
    recentTxTitle: 'Recent Payment & Transaction Activity',
    recentTxSubtitle: 'Real-time payment logs recorded for Hadicha ustoz students',
    realTimeBadge: 'Live Stream',
    scheduleCardTitle: 'Class Schedule & Rooms',
    scheduleCardSubtitle: 'Active group batches and classroom occupancy',
    roomOccupancy: 'Classroom Occupancy',
  },
};

// Monthly Financials specifically for Hadicha ustoz's Mathematics group & Center
const MONTHLY_STATS: Record<MonthKey, {
  expectedIncome: number;
  paidIncome: number;
  expenses: number;
  netProfit: number;
  paidCount: number;
  totalStudents: number;
}> = {
  July: {
    expectedIncome: 2750000,
    paidIncome: 500000,
    expenses: 250000,
    netProfit: 250000,
    paidCount: 2,
    totalStudents: 11,
  },
  August: {
    expectedIncome: 2750000,
    paidIncome: 810000,
    expenses: 400000,
    netProfit: 410000,
    paidCount: 5,
    totalStudents: 11,
  },
  September: {
    expectedIncome: 2750000,
    paidIncome: 796000,
    expenses: 380000,
    netProfit: 416000,
    paidCount: 5,
    totalStudents: 11,
  },
};

export const AdminOverviewPage: React.FC<AdminOverviewPageProps> = ({ onNavigateTab }) => {
  const { language } = useI18n();
  const txt = OVERVIEW_TEXTS[language] || OVERVIEW_TEXTS.uz;

  const {
    students,
    teachers,
    groups,
    settings,
    setIsReceivePaymentModalOpen,
    setIsAddStudentModalOpen,
    setIsAddGroupModalOpen,
    setSelectedStudentId,
    setPaymentModalDefaultStudentId,
    setPaymentModalDefaultMonth,
  } = useCRM();

  const [teacherScope, setTeacherScope] = useState<TeacherScope>('all');
  const [selectedMonth, setSelectedMonth] = useState<MonthKey>('September');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid' | 'full_attendance'>('all');
  const [reminderSent, setReminderSent] = useState(false);

  const currentHour = new Date().getHours();
  const greeting = getGreeting(language, currentHour);
  const todayFormatted = getTodayFormatted(language);

  // Filter students based on teacher scope
  const currentScopeStudents = useMemo(() => {
    if (teacherScope === 'hadicha') {
      return students.filter(s =>
        s.groupId === 'GRP-01' ||
        s.teacherName?.includes('Hadicha') ||
        s.groupName?.includes('Matematika')
      );
    }
    if (teacherScope === 'hasanboy') {
      return students.filter(s =>
        s.groupId === 'GRP-02' ||
        s.teacherName?.includes('Hasanboy') ||
        s.groupName?.includes('Ingliz')
      );
    }
    return students;
  }, [students, teacherScope]);

  // Dynamically compute monthly stats and teacher 50% payroll based on students' tuition fees
  const scopeMonthlyStats = useMemo(() => {
    const months: MonthKey[] = ['July', 'August', 'September'];
    const res: Record<MonthKey, {
      expectedIncome: number;
      paidIncome: number;
      expenses: number;
      netProfit: number;
      paidCount: number;
      totalStudents: number;
    }> = {} as any;

    months.forEach((m) => {
      const totalStudents = currentScopeStudents.length;
      const expectedIncome = currentScopeStudents.reduce((acc, s) => acc + (s.monthlyFee || 250000), 0);
      const paidIncome = currentScopeStudents.reduce((acc, s) => {
        const p = s.payments[m];
        return acc + (p?.status === 'Paid' ? (p.amountPaid || s.monthlyFee || 250000) : 0);
      }, 0);
      const paidCount = currentScopeStudents.filter(s => s.payments[m]?.status === 'Paid').length;
      
      // Standard 50% teacher payroll share based on student tuition fees, 50% center margin
      const expenses = Math.round(expectedIncome * 0.5);
      const netProfit = expectedIncome - expenses;

      res[m] = {
        expectedIncome,
        paidIncome,
        expenses,
        netProfit,
        paidCount,
        totalStudents,
      };
    });

    return res;
  }, [currentScopeStudents]);

  const activeStats = scopeMonthlyStats[selectedMonth];
  const unpaidDebt = Math.max(0, activeStats.expectedIncome - activeStats.paidIncome);
  const profitMargin = 50;

  // Filtered Students for the Table
  const filteredStudents = useMemo(() => {
    return currentScopeStudents.filter(s => {
      const matchSearch =
        s.fullName.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
        s.phone.includes(studentSearchQuery);

      if (!matchSearch) return false;

      const p = s.payments[selectedMonth];
      const isPaid = p?.status === 'Paid' && (p.amountPaid || 0) > 0;

      if (statusFilter === 'paid') return isPaid;
      if (statusFilter === 'unpaid') return !isPaid;
      if (statusFilter === 'full_attendance') return s.fullName === 'Azizbek' || s.fullName === 'Mirjalol';

      return true;
    });
  }, [currentScopeStudents, studentSearchQuery, statusFilter, selectedMonth]);

  // Debtors for selected month
  const monthDebtors = useMemo(() => {
    return currentScopeStudents.filter(s => {
      const p = s.payments[selectedMonth];
      return !p || p.status === 'Unpaid' || (p.amountPaid || 0) === 0;
    });
  }, [currentScopeStudents, selectedMonth]);

  // Chart data across the 3 academic months
  const chartData = useMemo(() => {
    return (['July', 'August', 'September'] as MonthKey[]).map((mKey) => {
      const st = scopeMonthlyStats[mKey];
      return {
        month: MONTH_LABELS_BY_LANG[mKey][language].label,
        kirim: st.paidIncome,
        chiqim: Math.round(st.paidIncome * 0.5),
        foyda: st.paidIncome - Math.round(st.paidIncome * 0.5),
        reja: st.expectedIncome,
      };
    });
  }, [scopeMonthlyStats, language]);

  // Dynamic scope titles and descriptors
  const scopeInfo = useMemo(() => {
    if (teacherScope === 'hadicha') {
      return {
        title: language === 'en'
          ? 'Teacher Hadicha (Mathematics) & Financial Center'
          : language === 'ru'
          ? 'Преподаватель Хадича (Математика) и Финансы'
          : 'Hadicha Ustoz (Matematika) & Moliya Markazi',
        desc: language === 'en'
          ? 'Real Excel data: 11 students, tuition collections, 50% teacher remuneration, and center profit.'
          : language === 'ru'
          ? 'Данные Excel: 11 учеников, оплаты, 50% доля преподавателя и чистая прибыль.'
          : 'Real Excel jadvali bo‘yicha: 11 nafar o‘quvchi to‘lovlari, 50% ustoz ulushi va markaz sof foydasi.',
        badge: '📐 Matematika (1-Guruh)',
      };
    }
    if (teacherScope === 'hasanboy') {
      return {
        title: language === 'en'
          ? 'Teacher Hasanboy (English) & Financial Center'
          : language === 'ru'
          ? 'Преподаватель Хасанбой (Английский) и Финансы'
          : 'Hasanboy Ustoz (Ingliz tili) & Moliya Markazi',
        desc: language === 'en'
          ? 'Google Sheets data: 13 students, tuition collections, 50% teacher remuneration, and center profit.'
          : language === 'ru'
          ? 'Данные Google Sheets: 13 учеников, оплаты, 50% доля преподавателя и чистая прибыль.'
          : 'Google Sheets bazasi bo‘yicha: 13 nafar o‘quvchi to‘lovlari, 50% ustoz ulushi va markaz sof foydasi.',
        badge: '🇬🇧 Ingliz tili (2-Guruh)',
      };
    }
    return {
      title: language === 'en'
        ? 'LUMOS Academy • Executive & Financial Center'
        : language === 'ru'
        ? 'LUMOS Academy • Главный Центр Управления и Финансов'
        : 'LUMOS Academy • Boshqaruv & Moliya Markazi',
      desc: language === 'en'
        ? 'Combined Academy overview: 24 students across Mathematics and English, 50% teacher payroll balance, and net center profit.'
        : language === 'ru'
        ? 'Общий обзор академии: 24 ученика по Математике и Английскому, баланс 50% зарплат учителей и чистая прибыль.'
        : 'Umumiy markaz nazorati: Matematika va Ingliz tili bo‘yicha 24 nafar o‘quvchi, ustozlar 50% ish haqi balansi va markaz sof foydasi.',
      badge: '👑 Barcha Markaz',
    };
  }, [teacherScope, language]);

  const handleSendBatchReminders = () => {
    setReminderSent(true);
    setTimeout(() => setReminderSent(false), 4000);
  };

  const handleExportCSV = () => {
    const headers = ["ID", "FISH", "Telefon", "Guruh", "Ustoz", "Iyul (UZS)", "Avgust (UZS)", "Sentabr (UZS)", "Holat"];
    const rows = currentScopeStudents.map((s, idx) => [
      idx + 1,
      s.fullName,
      s.phone,
      s.groupName,
      s.teacherName || (s.groupId === 'GRP-01' ? 'Hadicha ustoz' : 'Hasanboy ustoz'),
      s.payments['July']?.amountPaid || 0,
      s.payments['August']?.amountPaid || 0,
      s.payments['September']?.amountPaid || 0,
      s.fullName === 'Azizbek' || s.fullName === 'Mirjalol' ? '100% Davomat' : 'Faol',
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `LUMOS_${teacherScope}_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openPaymentForStudent = (studentId: string) => {
    setPaymentModalDefaultStudentId(studentId);
    setPaymentModalDefaultMonth(selectedMonth);
    setIsReceivePaymentModalOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 font-sans">
      {/* ─────────────────────────────────────────────────────────────
          0. WELCOME GREETING BANNER & QUICK ACTION LAUNCHPAD
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-3xl border border-slate-200/80 bg-gradient-to-r from-amber-500/10 via-amber-50/40 to-white p-5 dark:border-slate-800 dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {greeting} 👋, {txt.adminGreeting}
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {txt.today}: <span className="font-bold text-slate-700 dark:text-slate-300 capitalize">{todayFormatted}</span> • {txt.systemNormal}
          </p>
        </div>

        {/* Quick Action Buttons - Harmonized and resilient to overflow */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddStudentModalOpen(true)}
            className="gap-1.5 shadow-xs cursor-pointer text-xs whitespace-nowrap shrink-0 font-bold"
          >
            <Plus className="h-3.5 w-3.5 shrink-0" />
            <span>{txt.addStudent}</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setPaymentModalDefaultMonth(selectedMonth);
              setIsReceivePaymentModalOpen(true);
            }}
            className="gap-1.5 cursor-pointer text-xs whitespace-nowrap shrink-0 font-bold"
          >
            <CreditCard className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>{txt.receivePayment}</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsAddGroupModalOpen(true)}
            className="gap-1.5 cursor-pointer text-xs whitespace-nowrap shrink-0 font-bold"
          >
            <BookOpen className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            <span>{txt.addGroup}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigateTab('schedule')}
            className="gap-1.5 cursor-pointer text-xs border border-slate-200 dark:border-slate-800 whitespace-nowrap shrink-0 font-bold"
          >
            <Calendar className="h-3.5 w-3.5 text-purple-600 shrink-0" />
            <span>{txt.schedule}</span>
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          1. EXECUTIVE HEADER & CONTROLS
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between border-b border-slate-200/80 pb-5 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
              {scopeInfo.badge}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {txt.liveSystem}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {txt.academicYear}: {settings.academicYear}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {scopeInfo.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
            {scopeInfo.desc}
          </p>
        </div>

        {/* Controls Toolbar: Scope Switcher, Month Pills & Excel Export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Teacher / Center Scope Switcher */}
          <div className="flex items-center gap-1 rounded-2xl border border-slate-200/90 bg-white p-1 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setTeacherScope('all')}
              className={`rounded-xl px-2.5 py-1.5 text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                teacherScope === 'all'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
              title="Barcha Markaz (24 o‘quvchi)"
            >
              👑 Barchasi (24)
            </button>
            <button
              type="button"
              onClick={() => setTeacherScope('hadicha')}
              className={`rounded-xl px-2.5 py-1.5 text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                teacherScope === 'hadicha'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
              title="Hadicha ustoz • Matematika (11 o‘quvchi)"
            >
              📐 Hadicha (11)
            </button>
            <button
              type="button"
              onClick={() => setTeacherScope('hasanboy')}
              className={`rounded-xl px-2.5 py-1.5 text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                teacherScope === 'hasanboy'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
              title="Hasanboy ustoz • Ingliz tili (13 o‘quvchi)"
            >
              🇬🇧 Hasanboy (13)
            </button>
          </div>

          {/* Month Selector Pills */}
          <div className="flex items-center gap-1 rounded-2xl border border-slate-200/90 bg-white p-1 shadow-xs dark:border-slate-800 dark:bg-slate-900 shrink-0">
            {(['July', 'August', 'September'] as MonthKey[]).map((mKey) => (
              <button
                key={mKey}
                type="button"
                onClick={() => setSelectedMonth(mKey)}
                className={`rounded-xl px-2.5 sm:px-3 py-1.5 text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  selectedMonth === mKey
                    ? 'bg-amber-500 text-white shadow-xs scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <span>{MONTH_LABELS_BY_LANG[mKey][language].label}</span>
              </button>
            ))}
          </div>

          {/* Export CSV Button */}
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-800 whitespace-nowrap shrink-0 text-xs font-bold"
            onClick={handleExportCSV}
            title="Excel formatida yuklab olish"
          >
            <Download className="h-3.5 w-3.5 text-slate-500 shrink-0" />
            <span className="hidden sm:inline">{txt.exportBtn}</span>
          </Button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. 6 KEY PERFORMANCE INDICATORS FOR SELECTED MONTH
      ───────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {/* 1. Expected Revenue */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
          <div className="flex items-center justify-between gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 min-w-0">
            <span className="truncate" title={txt.expectedRevenue}>{txt.expectedRevenue}</span>
            <div className="rounded-xl bg-amber-500/10 p-1.5 text-amber-600 dark:text-amber-400 shrink-0">
              <Calendar className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <p className="text-sm sm:text-base xl:text-[15px] 2xl:text-lg font-black text-slate-900 dark:text-white font-mono tracking-tight truncate" title={formatMoney(activeStats.expectedIncome, 'UZS')}>
              {formatMoney(activeStats.expectedIncome, 'UZS')}
            </p>
            <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${activeStats.expectedIncome > 0 ? Math.min(100, Math.round((activeStats.paidIncome / activeStats.expectedIncome) * 100)) : 0}%`,
                }}
              />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-medium truncate">
            {activeStats.totalStudents} o‘quvchi x 250,000 UZS
          </p>
        </div>

        {/* 2. Actual Paid Cash */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
          <div className="flex items-center justify-between gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 min-w-0">
            <span className="truncate" title={txt.actualRevenue}>{txt.actualRevenue}</span>
            <div className="rounded-xl bg-emerald-500/10 p-1.5 text-emerald-600 dark:text-emerald-400 shrink-0">
              <CreditCard className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <p className="text-sm sm:text-base xl:text-[15px] 2xl:text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight truncate" title={formatMoney(activeStats.paidIncome, 'UZS')}>
              {formatMoney(activeStats.paidIncome, 'UZS')}
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 truncate">
              <TrendingUp className="h-3 w-3 shrink-0" />
              {activeStats.expectedIncome > 0 ? Math.round((activeStats.paidIncome / activeStats.expectedIncome) * 100) : 0}% {txt.collected}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium truncate">
            {activeStats.paidCount} {txt.paidCountSub}
          </p>
        </div>

        {/* 3. Teacher Expenses (50% share) */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
          <div className="flex items-center justify-between gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 min-w-0">
            <span className="truncate" title={txt.teacherExpenses}>{txt.teacherExpenses}</span>
            <div className="rounded-xl bg-rose-500/10 p-1.5 text-rose-600 dark:text-rose-400 shrink-0">
              <GraduationCap className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <p className="text-sm sm:text-base xl:text-[15px] 2xl:text-lg font-black text-rose-600 dark:text-rose-400 font-mono tracking-tight truncate" title={formatMoney(activeStats.expenses, 'UZS')}>
              {formatMoney(activeStats.expenses, 'UZS')}
            </p>
            <span className="inline-block text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-1 truncate">
              50% ustoz ulushi
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium truncate">
            {txt.fullyPaid}
          </p>
        </div>

        {/* 4. Net Profit */}
        <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-500/10 via-amber-50/40 to-white dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 p-3.5 sm:p-4 shadow-sm dark:border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 min-w-0">
            <span className="truncate" title={txt.netProfit}>{txt.netProfit}</span>
            <div className="rounded-xl bg-amber-500/20 p-1.5 text-amber-600 dark:text-amber-400 shrink-0">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <p className="text-sm sm:text-base xl:text-[15px] 2xl:text-lg font-black text-amber-600 dark:text-amber-400 font-mono tracking-tight truncate" title={formatMoney(activeStats.netProfit, 'UZS')}>
              {formatMoney(activeStats.netProfit, 'UZS')}
            </p>
            <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-700 dark:text-amber-300 mt-1 truncate">
              {txt.profitMargin}: 50%
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium truncate">
            {txt.centerMargin}
          </p>
        </div>

        {/* 5. Active Students */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
          <div className="flex items-center justify-between gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 min-w-0">
            <span className="truncate" title={txt.totalStudents}>{txt.totalStudents}</span>
            <div className="rounded-xl bg-blue-500/10 p-1.5 text-blue-600 dark:text-blue-400 shrink-0">
              <Users className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <p className="text-sm sm:text-base xl:text-[15px] 2xl:text-lg font-black text-slate-900 dark:text-white font-mono tracking-tight truncate">
              {activeStats.totalStudents} {txt.studentsCountUnit}
            </p>
            <span className="inline-block text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 truncate">
              {txt.activeParticipation}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium truncate">
            {teacherScope === 'all' ? '2 ta guruh faol' : teacherScope === 'hadicha' ? '1-Guruh Matematika' : '2-Guruh Ingliz tili'}
          </p>
        </div>

        {/* 6. Attendance Rate */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-2">
          <div className="flex items-center justify-between gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 min-w-0">
            <span className="truncate max-w-[110px]" title={txt.attendanceRate}>{txt.attendanceRate}</span>
            <div className="rounded-xl bg-purple-500/10 p-1.5 text-purple-600 dark:text-purple-400 shrink-0">
              <UserCheck className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <p className="text-sm sm:text-base xl:text-[15px] 2xl:text-lg font-black text-slate-900 dark:text-white font-mono tracking-tight truncate">
              96.4%
            </p>
            <span className="inline-block text-[11px] font-bold text-purple-600 dark:text-purple-400 mt-1 truncate">
              {txt.highAttendance}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium truncate">
            {txt.noExcuses}
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. VISUAL ANALYTICS & DEBT RECOVERY SECTION
      ───────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: 3-Month Financial Growth Curve */}
        <Card className="lg:col-span-2 border-slate-200/80 dark:border-slate-800 shadow-sm">
          <CardHeader
            title={txt.growthTitle}
            subtitle={txt.growthSubtitle}
            action={
              <Badge variant="success" size="sm" hasDot>
                {txt.excelMatch}
              </Badge>
            }
          />
          <CardContent className="space-y-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartKirim" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="chartFoyda" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: any) => [formatMoney(Number(value), 'UZS'), '']}
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="kirim"
                    name={txt.chartIncome}
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#chartKirim)"
                  />
                  <Area
                    type="monotone"
                    dataKey="foyda"
                    name={txt.chartProfit}
                    stroke="#F59E0B"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#chartFoyda)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Micro 3-Month Summary Pills */}
            <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-3 dark:border-slate-800 text-center">
              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
                <span className="text-[10px] uppercase font-bold text-slate-400">{txt.total3MonthsIncome}</span>
                <p className="text-sm font-black text-emerald-600 font-mono mt-0.5">
                  {formatMoney(chartData.reduce((acc, c) => acc + c.kirim, 0), 'UZS')}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
                <span className="text-[10px] uppercase font-bold text-slate-400">{txt.total3MonthsExpenses}</span>
                <p className="text-sm font-black text-rose-600 font-mono mt-0.5">
                  {formatMoney(chartData.reduce((acc, c) => acc + c.chiqim, 0), 'UZS')}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
                <span className="text-[10px] uppercase font-bold text-slate-400">{txt.total3MonthsProfit}</span>
                <p className="text-sm font-black text-amber-600 font-mono mt-0.5">
                  {formatMoney(chartData.reduce((acc, c) => acc + c.foyda, 0), 'UZS')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: Payment Status Breakdown & Fast Debt Collection */}
        <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <CardHeader
            title={`${MONTH_LABELS_BY_LANG[selectedMonth][language].label} ${txt.paymentBreakdownTitle}`}
            subtitle={txt.paymentBreakdownSubtitle}
          />
          <CardContent className="space-y-4">
            {/* Visual Segments */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                <span>{txt.paidShare} ({Math.round((activeStats.paidIncome / activeStats.expectedIncome) * 100)}%)</span>
                <span className="font-mono text-emerald-600">{formatMoney(activeStats.paidIncome, 'UZS')}</span>
              </div>
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="bg-emerald-500 transition-all duration-500"
                  style={{
                    width: `${Math.round((activeStats.paidIncome / activeStats.expectedIncome) * 100)}%`,
                  }}
                  title={txt.paidLabel}
                />
                <div
                  className="bg-rose-500 transition-all duration-500"
                  style={{
                    width: `${100 - Math.round((activeStats.paidIncome / activeStats.expectedIncome) * 100)}%`,
                  }}
                  title={txt.debtLabel}
                />
              </div>
            </div>

            {/* Status Breakdown Chips */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/60 p-3 dark:bg-emerald-950/30">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{txt.paidLabel}: {activeStats.paidCount}</span>
                </div>
                <p className="text-sm font-black font-mono text-emerald-800 dark:text-emerald-200 mt-1">
                  {formatMoney(activeStats.paidIncome, 'UZS')}
                </p>
              </div>

              <div className="rounded-2xl border border-rose-500/20 bg-rose-50/60 p-3 dark:bg-rose-950/30">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-300">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{txt.debtLabel}: {monthDebtors.length}</span>
                </div>
                <p className="text-sm font-black font-mono text-rose-800 dark:text-rose-200 mt-1">
                  {formatMoney(unpaidDebt, 'UZS')}
                </p>
              </div>
            </div>

            {/* Quick Batch SMS Reminder Action */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-50/50 p-3.5 dark:bg-amber-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                  {txt.smsTitle}
                </span>
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">
                  {monthDebtors.length} {txt.smsSubtitle}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                {MONTH_LABELS_BY_LANG[selectedMonth][language].label} {txt.smsDesc}
              </p>
              <Button
                size="sm"
                variant={reminderSent ? "success" : "primary"}
                className="w-full gap-2 cursor-pointer text-xs"
                onClick={handleSendBatchReminders}
              >
                {reminderSent ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>{txt.smsSent}</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>{txt.sendSmsBtn}</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. HADICHA USTOZ STUDENTS TABLE (EXECUTIVE SAAS VIEW)
      ───────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        {/* Table Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={studentSearchQuery}
              onChange={(e) => setStudentSearchQuery(e.target.value)}
              placeholder={txt.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {txt.filterAll} ({currentScopeStudents.length})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('paid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                statusFilter === 'paid'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {txt.filterPaid} ({activeStats.paidCount})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('unpaid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                statusFilter === 'unpaid'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {txt.filterUnpaid} ({monthDebtors.length})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter('full_attendance')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                statusFilter === 'full_attendance'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {txt.filterAttendance}
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-3xl border border-slate-200/90 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-black uppercase text-slate-400 dark:border-slate-800 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3.5">{txt.thNumber}</th>
                <th className="px-4 py-3.5">{txt.thStudent}</th>
                <th className="px-4 py-3.5">{txt.thPhone}</th>
                <th className="px-4 py-3.5 text-center">{txt.thJuly}</th>
                <th className="px-4 py-3.5 text-center">{txt.thAugust}</th>
                <th className="px-4 py-3.5 text-center">{txt.thSeptember}</th>
                <th className="px-4 py-3.5 text-center">{txt.thAttendance}</th>
                <th className="px-4 py-3.5 text-right">{txt.thActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map((s, idx) => {
                const julyPay = s.payments['July'];
                const augPay = s.payments['August'];
                const sepPay = s.payments['September'];

                const isCurrentMonthPaid = s.payments[selectedMonth]?.status === 'Paid';

                return (
                  <tr
                    key={s.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* ID */}
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-400">
                      {idx + 1}
                    </td>

                    {/* Student Info */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500/20 via-yellow-500/15 to-amber-300/20 border border-amber-400/30 text-amber-700 dark:text-amber-300 font-black shadow-xs">
                          {s.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                            {s.fullName}
                          </p>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {s.groupName} • {s.teacherName || (s.groupId === 'GRP-01' ? 'Hadicha ustoz' : 'Hasanboy ustoz')}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3.5 font-mono text-slate-600 dark:text-slate-300 font-bold">
                      <a
                        href={`tel:${s.phone}`}
                        className="inline-flex items-center gap-1.5 hover:text-amber-600 transition-colors"
                      >
                        <Phone className="h-3 w-3 text-slate-400" />
                        <span>{s.phone}</span>
                      </a>
                    </td>

                    {/* July Payment */}
                    <td className="px-4 py-3.5 text-center">
                      {julyPay?.status === 'Paid' ? (
                        <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-black text-emerald-600 font-mono">
                          {formatMoney(julyPay.amountPaid, 'UZS')}
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600 font-medium">—</span>
                      )}
                    </td>

                    {/* August Payment */}
                    <td className="px-4 py-3.5 text-center">
                      {augPay?.status === 'Paid' ? (
                        <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-black text-emerald-600 font-mono">
                          {formatMoney(augPay.amountPaid, 'UZS')}
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600 font-medium">—</span>
                      )}
                    </td>

                    {/* September Payment */}
                    <td className="px-4 py-3.5 text-center">
                      {sepPay?.status === 'Paid' ? (
                        <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-black text-emerald-600 font-mono">
                          {formatMoney(sepPay.amountPaid, 'UZS')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-bold bg-rose-500/10 px-2.5 py-1 rounded-xl border border-rose-500/20">
                          {txt.tablePending}
                        </span>
                      )}
                    </td>

                    {/* Attendance / Note */}
                    <td className="px-4 py-3.5 text-center">
                      {s.fullName === 'Azizbek' && (
                        <Badge variant="success" size="sm" hasDot>
                          100% To‘liq Davomat
                        </Badge>
                      )}
                      {(s.fullName === 'Go‘zaloy' || s.fullName === 'Quvonchoy') && (
                        <Badge variant="warning" size="sm">
                          Qisman kelgan (150k)
                        </Badge>
                      )}
                      {s.fullName === 'Habibullo' && (
                        <Badge variant="warning" size="sm">
                          Qisman kelgan (96k)
                        </Badge>
                      )}
                      {s.fullName === 'Asaloy' && (
                        <Badge variant="info" size="sm">
                          Avgustda to‘lagan
                        </Badge>
                      )}
                      {s.fullName === 'Shahjahon' && (
                        <Badge variant="default" size="sm">
                          Iyul to‘langan (200k)
                        </Badge>
                      )}
                      {s.fullName === 'Zarina' && (
                        <Badge variant="info" size="sm">
                          Sentabrda qo‘shilgan
                        </Badge>
                      )}
                      {['Mushtariy', 'Munisa', 'Shahrizoda', 'Murodbek'].includes(s.fullName) && (
                        <Badge variant="danger" size="sm">
                          To‘lov qilinmagan
                        </Badge>
                      )}
                    </td>

                    {/* Quick Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openPaymentForStudent(s.id)}
                          title={txt.tablePayBtn}
                          className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
                        >
                          <CreditCard className="h-3 w-3" />
                          <span>{txt.tablePayBtn}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStudentId(s.id);
                          }}
                          title="Profilni ko‘rish"
                          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. REAL-TIME ACTIVITY STREAM & ACADEMIC AUDIT LOG
      ───────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Real Payment History Logs */}
        <Card className="lg:col-span-2 border-slate-200/80 dark:border-slate-800 shadow-sm">
          <CardHeader
            title={txt.recentTxTitle}
            subtitle={txt.recentTxSubtitle}
            action={
              <Badge variant="amber" size="sm">
                {txt.realTimeBadge}
              </Badge>
            }
          />
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  student: 'Azizbek Rahimov',
                  month: 'Sentabr 2025',
                  amount: 250000,
                  method: 'Payme / Onlayn',
                  time: 'Kecha, 16:40',
                  status: 'Tasdiqlangan',
                  badge: 'success',
                },
                {
                  student: 'Shahjahon Ergashev',
                  month: 'Sentabr 2025',
                  amount: 200000,
                  method: 'Kassa / Naqd',
                  time: '2 kun oldin',
                  status: 'Tasdiqlangan',
                  badge: 'success',
                },
                {
                  student: 'Habibullo Qosimov',
                  month: 'Sentabr 2025',
                  amount: 96000,
                  method: 'Davomatga mutanosib',
                  time: '3 kun oldin',
                  status: 'Qisman to‘lov',
                  badge: 'warning',
                },
                {
                  student: 'Asaloy Karimova',
                  month: 'Avgust 2025',
                  amount: 150000,
                  method: 'Click / Karta',
                  time: '15 Avgust',
                  status: 'Tasdiqlangan',
                  badge: 'success',
                },
                {
                  student: 'Go‘zaloy Mahmudova',
                  month: 'Avgust 2025',
                  amount: 150000,
                  method: 'Kassa / Naqd',
                  time: '12 Avgust',
                  status: 'Tasdiqlangan',
                  badge: 'success',
                },
              ].map((tx, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-900 dark:text-white">
                        {tx.student}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {tx.month} • {tx.method} • {tx.time}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-black font-mono text-xs text-emerald-600 dark:text-emerald-400">
                      +{formatMoney(tx.amount, 'UZS')}
                    </p>
                    <Badge variant={tx.badge as any} size="sm">
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right 1 Col: Course & Schedule Card */}
        <Card className="border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <CardHeader
            title={txt.scheduleCardTitle}
            subtitle={txt.scheduleCardSubtitle}
          />
          <CardContent className="space-y-3.5">
            {/* Math Direction */}
            <div className="rounded-2xl border border-amber-400/30 bg-amber-50/50 p-3.5 dark:bg-amber-950/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-900 dark:text-amber-200">
                  📐 {language === 'en' ? 'Mathematics & Logic' : language === 'ru' ? 'Математика и Логика' : 'Matematika & Mantiq'}
                </span>
                <span className="rounded-full bg-amber-500 text-white px-2 py-0.5 text-[9px] font-black">
                  11 {txt.studentsCountUnit}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                {language === 'en' ? 'Teacher: ' : language === 'ru' ? 'Преподаватель: ' : 'Ustoz: '}
                <strong>Hadicha ustoz</strong>
              </p>
              <div className="flex items-center gap-2 text-[10px] text-amber-700 dark:text-amber-400 font-bold">
                <Clock className="h-3 w-3" />
                <span>{language === 'en' ? 'Mon, Wed, Fri 14:00 (Room 101)' : language === 'ru' ? 'Пн, Ср, Пт 14:00 (Кабинет 101)' : 'Dush, Chor, Juma 14:00 (101-xona)'}</span>
              </div>
            </div>

            {/* English Direction */}
            <div className="rounded-2xl border border-indigo-400/30 bg-indigo-50/50 p-3.5 dark:bg-indigo-950/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-indigo-900 dark:text-indigo-200">
                  🇬🇧 Intensive IELTS English
                </span>
                <span className="rounded-full bg-indigo-600 text-white px-2 py-0.5 text-[9px] font-black">
                  16 {txt.studentsCountUnit}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                {language === 'en' ? 'Teacher: ' : language === 'ru' ? 'Преподаватель: ' : 'Ustoz: '}
                <strong>Hasanboy ustoz</strong> (IELTS 8.5)
              </p>
              <div className="flex items-center gap-2 text-[10px] text-indigo-700 dark:text-indigo-400 font-bold">
                <Clock className="h-3 w-3" />
                <span>{language === 'en' ? 'Tue, Thu, Sat 15:30 (Room 102)' : language === 'ru' ? 'Вт, Чт, Сб 15:30 (Кабинет 102)' : 'Sesh, Pay, Shanba 15:30 (102-xona)'}</span>
              </div>
            </div>

            {/* Center Status */}
            <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span className="font-bold text-slate-700 dark:text-slate-300">{txt.roomOccupancy}</span>
              </div>
              <span className="font-mono font-black text-emerald-600">100%</span>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
