export type Language = 'uz' | 'ru' | 'en';

export interface Translations {
  // Navigation & Common
  common: {
    dashboard: string;
    students: string;
    teachers: string;
    groups: string;
    attendance: string;
    payments: string;
    expenses: string;
    reports: string;
    settings: string;
    branches: string;
    credentials: string;
    audit: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    filter: string;
    all: string;
    active: string;
    inactive: string;
    status: string;
    actions: string;
    loading: string;
    confirm: string;
    success: string;
    error: string;
    logout: string;
    login: string;
    back: string;
    select: string;
    viewAll: string;
  };
  // Roles
  roles: {
    superAdmin: string;
    teacher: string;
    student: string;
  };
  // Dashboard & Stats
  dashboard: {
    title: string;
    subtitle: string;
    totalStudents: string;
    monthlyRevenue: string;
    currentDebts: string;
    netProfit: string;
    activeCourses: string;
    financialOverview: string;
    cashflowTrend: string;
    topCourses: string;
    attentionSignals: string;
    quickStats: string;
  };
  // Payments & Checkout
  payments: {
    title: string;
    receivePayment: string;
    student: string;
    amount: string;
    method: string;
    month: string;
    comment: string;
    payWithPayme: string;
    payWithClick: string;
    payCash: string;
    receipt: string;
    paymentSuccess: string;
    paymentFailed: string;
    downloadPdf: string;
    transactionId: string;
    date: string;
    payer: string;
  };
  // Landing Page
  landing: {
    badge: string;
    heroTitle: string;
    heroHighlight: string;
    heroSubtitle: string;
    registerCta: string;
    loginCta: string;
    studentsCount: string;
    successRate: string;
    expertMentors: string;
    satisfactionRate: string;
    coursesTitle: string;
    coursesSubtitle: string;
    teachersTitle: string;
    teachersSubtitle: string;
    testimonialsTitle: string;
    contactTitle: string;
    contactSubtitle: string;
    fullName: string;
    phone: string;
    selectCourse: string;
    submitApplication: string;
    applicationSuccess: string;
  };
}

export const translations: Record<Language, Translations> = {
  uz: {
    common: {
      dashboard: 'Boshqaruv Markazi',
      students: 'O‘quvchilar Bazasi',
      teachers: 'O‘qituvchilar',
      groups: 'Guruhlar & Kurslar',
      attendance: 'Davomat Nazorati',
      payments: 'To‘lovlar Tarixi',
      expenses: 'Xarajatlar',
      reports: 'Tahliliy Hisobotlar',
      settings: 'Tizim Sozlamalari',
      branches: 'Filiallar Boshqaruvi',
      credentials: 'Login & Parollar',
      audit: 'Xavfsizlik Auditi',
      save: 'Saqlash',
      cancel: 'Bekor qilish',
      delete: 'O‘chirish',
      edit: 'Tahrirlash',
      add: 'Qo‘shish',
      search: 'Qidirish...',
      filter: 'Filtr',
      all: 'Barchasi',
      active: 'Faol',
      inactive: 'Nofaol',
      status: 'Holati',
      actions: 'Amallar',
      loading: 'Yuklanmoqda...',
      confirm: 'Tasdiqlash',
      success: 'Muvaffaqiyatli',
      error: 'Xatolik yuz berdi',
      logout: 'Chiqish',
      login: 'Kirish',
      back: 'Orqaga',
      select: 'Tanlang',
      viewAll: 'Barchasini ko‘rish',
    },
    roles: {
      superAdmin: 'Super Admin',
      teacher: 'O‘qituvchi / Ustoz',
      student: 'O‘quvchi / Talaba',
    },
    dashboard: {
      title: 'Super Admin Boshqaruv Markazi',
      subtitle: 'Markazning moliyaviy oqimi, o‘quvchilar va guruhlar holati bo‘yicha umumiy xulosa.',
      totalStudents: 'Jami O‘quvchilar',
      monthlyRevenue: 'Oylik Tushum (Kirim)',
      currentDebts: 'Joriy Qarzdorlik',
      netProfit: 'Sof Foyda (Net Profit)',
      activeCourses: 'Faol Kurslar',
      financialOverview: 'Moliyaviy Tahlil',
      cashflowTrend: 'Kirim vs Chiqim Trendi (So‘nggi 6 Oy)',
      topCourses: 'Ommabop Kurslar',
      attentionSignals: 'Diqqat Talab Signallar',
      quickStats: 'Tezkor Statistika',
    },
    payments: {
      title: 'To‘lovlar Boshqaruvi',
      receivePayment: 'To‘lov Qabul Qilish',
      student: 'O‘quvchi',
      amount: 'To‘lov Summasi',
      method: 'To‘lov Usuli',
      month: 'Qaysi oy uchun',
      comment: 'Izoh',
      payWithPayme: 'Payme orqali to‘lash',
      payWithClick: 'Click orqali to‘lash',
      payCash: 'Naqd pul / Terminal',
      receipt: 'To‘lov Kvitansiyasi',
      paymentSuccess: 'To‘lov Muvaffaqiyatli Qabul Qilindi!',
      paymentFailed: 'To‘lov Muvaffaqiyatsiz Bo‘ldi',
      downloadPdf: 'PDF Kvitansiyani Yuklab Olish',
      transactionId: 'Tranzaksiya ID',
      date: 'To‘lov Sana va Vaqti',
      payer: 'To‘lovchi',
    },
    landing: {
      badge: 'LUMOS O‘quv Markazi — Bilim Bilan Yorqin Kelajakka!',
      heroTitle: 'Kelajak Kasblarini Professional Darajada O‘rganing',
      heroHighlight: 'LUMOS Ta’lim Markazida',
      heroSubtitle: 'Zamonaviy dasturlash, IELTS, SAT, aniq fanlar va biznes ko‘nikmalarini eng kuchli ustozlar bilan amaliy loyihalarda o‘zlashtiring.',
      registerCta: 'Kursga Yozilish',
      loginCta: 'Tizimga Kirish',
      studentsCount: '1,500+ Bitiruvchilar',
      successRate: '98% Sertifikat Natijasi',
      expertMentors: '25+ Tajribali Ustozlar',
      satisfactionRate: '4.9 O‘quvchilar Bahosi',
      coursesTitle: 'Eng Talabgir Ta’lim Yo‘nalishlari',
      coursesSubtitle: 'Noldan professional darajagacha amaliy mashg‘ulotlar va sertifikat beriladigan kurslar',
      teachersTitle: 'Bizning Malakali Ustozlarimiz',
      teachersSubtitle: 'Xalqaro sertifikatlarga ega amaliyotchi mutaxassislar jamoasi',
      testimonialsTitle: 'O‘quvchilarimizning Fikrlari & Natijalari',
      contactTitle: 'Hoziroq O‘z Kelajagingizga Qadam Qo‘ying',
      contactSubtitle: 'Ma’lumotlaringizni qoldiring, menejerlarimiz 15 daqiqa ichida siz bilan bog‘lanib bepul sinov darsiga yozib qo‘yishadi.',
      fullName: 'To‘liq Ismingiz',
      phone: 'Telefon Raqamingiz',
      selectCourse: 'Qiziqtirgan Yo‘nalishni Tanlang',
      submitApplication: 'Ariza Yuborish',
      applicationSuccess: 'Arizangiz qabul qilindi! Tez orada mutaxassislarimiz bog‘lanishadi.',
    },
  },
  ru: {
    common: {
      dashboard: 'Панель управления',
      students: 'База студентов',
      teachers: 'Преподаватели',
      groups: 'Группы и Курсы',
      attendance: 'Контроль посещаемости',
      payments: 'История платежей',
      expenses: 'Расходы',
      reports: 'Аналитические отчеты',
      settings: 'Настройки системы',
      branches: 'Управление филиалами',
      credentials: 'Логины и Пароли',
      audit: 'Аудит безопасности',
      save: 'Сохранить',
      cancel: 'Отмена',
      delete: 'Удалить',
      edit: 'Редактировать',
      add: 'Добавить',
      search: 'Поиск...',
      filter: 'Фильтр',
      all: 'Все',
      active: 'Активный',
      inactive: 'Неактивный',
      status: 'Статус',
      actions: 'Действия',
      loading: 'Загрузка...',
      confirm: 'Подтвердить',
      success: 'Успешно',
      error: 'Произошла ошибка',
      logout: 'Выйти',
      login: 'Войти',
      back: 'Назад',
      select: 'Выбрать',
      viewAll: 'Посмотреть все',
    },
    roles: {
      superAdmin: 'Супер Администратор',
      teacher: 'Преподаватель',
      student: 'Студент',
    },
    dashboard: {
      title: 'Центр Управления Супер Админа',
      subtitle: 'Общая сводка по финансовым потокам, студентам и академическим группам.',
      totalStudents: 'Всего студентов',
      monthlyRevenue: 'Ежемесячный доход',
      currentDebts: 'Текущая задолженность',
      netProfit: 'Чистая прибыль',
      activeCourses: 'Активные курсы',
      financialOverview: 'Финансовый анализ',
      cashflowTrend: 'Динамика доходов и расходов (за 6 мес.)',
      topCourses: 'Популярные курсы',
      attentionSignals: 'Сигналы внимания',
      quickStats: 'Быстрая статистика',
    },
    payments: {
      title: 'Управление платежами',
      receivePayment: 'Принять оплату',
      student: 'Студент',
      amount: 'Сумма оплаты',
      method: 'Способ оплаты',
      month: 'За какой месяц',
      comment: 'Комментарий',
      payWithPayme: 'Оплатить через Payme',
      payWithClick: 'Оплатить через Click',
      payCash: 'Наличные / Терминал',
      receipt: 'Квитанция об оплате',
      paymentSuccess: 'Оплата успешно принята!',
      paymentFailed: 'Оплата не удалась',
      downloadPdf: 'Скачать PDF квитанцию',
      transactionId: 'ID транзакции',
      date: 'Дата и время платежа',
      payer: 'Плательщик',
    },
    landing: {
      badge: 'Учебный Центр LUMOS — С Яркими Знаниями в Будущее!',
      heroTitle: 'Освойте востребованные профессии на профессиональном уровне',
      heroHighlight: 'в Центре LUMOS',
      heroSubtitle: 'Современное программирование, IELTS, SAT, точные науки и бизнес-навыки с ведущими преподавателями на реальных проектах.',
      registerCta: 'Записаться на курс',
      loginCta: 'Войти в портал',
      studentsCount: '1,500+ Выпускников',
      successRate: '98% Сертификация',
      expertMentors: '25+ Опытных наставников',
      satisfactionRate: '4.9 Рейтинг студентов',
      coursesTitle: 'Популярные направления обучения',
      coursesSubtitle: 'Практические курсы с выдачей сертификата от начального до профильного уровня',
      teachersTitle: 'Наши квалифицированные преподаватели',
      teachersSubtitle: 'Команда практикующих специалистов с международными сертификатами',
      testimonialsTitle: 'Отзывы и результаты студентов',
      contactTitle: 'Сделайте шаг к своему успешному будущему',
      contactSubtitle: 'Оставьте заявку, наши менеджеры свяжутся с вами в течение 15 минут для записи на пробный урок.',
      fullName: 'Ваше полное имя',
      phone: 'Номер телефона',
      selectCourse: 'Выберите интересующий курс',
      submitApplication: 'Отправить заявку',
      applicationSuccess: 'Заявка принята! Скоро наш менеджер свяжется с вами.',
    },
  },
  en: {
    common: {
      dashboard: 'Dashboard',
      students: 'Students Hub',
      teachers: 'Teachers',
      groups: 'Courses & Groups',
      attendance: 'Attendance',
      payments: 'Payments History',
      expenses: 'Expenses',
      reports: 'Analytics & Reports',
      settings: 'System Settings',
      branches: 'Branches Management',
      credentials: 'Login & Passwords',
      audit: 'Security Audit',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add New',
      search: 'Search...',
      filter: 'Filter',
      all: 'All',
      active: 'Active',
      inactive: 'Inactive',
      status: 'Status',
      actions: 'Actions',
      loading: 'Loading...',
      confirm: 'Confirm',
      success: 'Success',
      error: 'Error occurred',
      logout: 'Logout',
      login: 'Login',
      back: 'Back',
      select: 'Select',
      viewAll: 'View all',
    },
    roles: {
      superAdmin: 'Super Admin',
      teacher: 'Instructor / Teacher',
      student: 'Student / Learner',
    },
    dashboard: {
      title: 'Super Admin Dashboard',
      subtitle: 'Comprehensive financial flow, student lifecycle and class workload overview.',
      totalStudents: 'Total Students',
      monthlyRevenue: 'Monthly Revenue',
      currentDebts: 'Outstanding Balance',
      netProfit: 'Net Profit',
      activeCourses: 'Active Courses',
      financialOverview: 'Financial Analytics',
      cashflowTrend: 'Revenue vs Expenses Trend (Last 6 Months)',
      topCourses: 'Top Ranked Courses',
      attentionSignals: 'Priority Alerts',
      quickStats: 'Quick Metrics',
    },
    payments: {
      title: 'Payments Management',
      receivePayment: 'Accept Payment',
      student: 'Student',
      amount: 'Amount',
      method: 'Payment Method',
      month: 'Academic Month',
      comment: 'Memo / Notes',
      payWithPayme: 'Pay via Payme',
      payWithClick: 'Pay via Click',
      payCash: 'Cash / Terminal',
      receipt: 'Payment Receipt',
      paymentSuccess: 'Payment Successfully Processed!',
      paymentFailed: 'Payment Failed or Cancelled',
      downloadPdf: 'Download PDF Receipt',
      transactionId: 'Transaction ID',
      date: 'Payment Timestamp',
      payer: 'Payer',
    },
    landing: {
      badge: 'LUMOS Education Center — Bright Future with Knowledge!',
      heroTitle: 'Master High-Demand Careers at Professional Grade',
      heroHighlight: 'at LUMOS Center',
      heroSubtitle: 'Software engineering, IELTS, SAT, mathematics and modern business skills mentored by industry professionals.',
      registerCta: 'Apply for Course',
      loginCta: 'Portal Sign In',
      studentsCount: '1,500+ Alumni',
      successRate: '98% Certification',
      expertMentors: '25+ Elite Mentors',
      satisfactionRate: '4.9 Student Rating',
      coursesTitle: 'Featured Learning Paths',
      coursesSubtitle: 'Hands-on project-based bootcamps leading to recognized certifications',
      teachersTitle: 'Our World-Class Instructors',
      teachersSubtitle: 'Certified educators and seasoned industry practitioners',
      testimonialsTitle: 'Student Success Stories',
      contactTitle: 'Accelerate Your Educational Journey Today',
      contactSubtitle: 'Leave your details and our academic admissions team will reach out in 15 minutes for your free placement lesson.',
      fullName: 'Full Name',
      phone: 'Phone Number',
      selectCourse: 'Select Study Track',
      submitApplication: 'Submit Application',
      applicationSuccess: 'Application received! An admissions advisor will contact you shortly.',
    },
  },
};
