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
    schedule: string;
    homework: string;
    grades: string;
    applications: string;
    payroll: string;
    receivePayment: string;
    addStudent: string;
    addGroup: string;
    publicSite: string;
    academicYear: string;
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
      schedule: 'Dars jadvali',
      homework: 'Uy vazifalari',
      grades: 'Baholar & Reyting',
      applications: 'Arizalar & Qabul',
      payroll: 'Oyliklar & Payroll',
      receivePayment: 'To‘lov Qabul Qilish',
      addStudent: 'O‘quvchi Qo‘shish',
      addGroup: 'Guruh Qo‘shish',
      publicSite: 'Asosiy sayt',
      academicYear: 'Akademik Yil',
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
      badge: 'LUMOS O‘quv Markazi — Matematika va Ingliz Tili',
      heroTitle: 'Matematika va Ingliz Tilida',
      heroHighlight: 'Mustahkam Bilim Va Natija!',
      heroSubtitle: 'Hadicha ustoz (Matematika) va Hasanboy ustoz (Ingliz tili) bilan individual yondashuv, zamonaviy metodika va kafolatlangan o‘zlashtirish.',
      registerCta: 'Kursga Yozilish',
      loginCta: 'Tizimga Kirish',
      studentsCount: '500+ Bitiruvchilar',
      successRate: '98% O‘zlashtirish',
      expertMentors: '2 Ta Professional Ustoz',
      satisfactionRate: '4.9 O‘quvchilar Bahosi',
      coursesTitle: 'Bizning Ta’lim Dasturlarimiz',
      coursesSubtitle: 'Matematika va ingliz tili bo‘yicha chuqurlashtirilgan, amaliy va natijaga yo‘naltirilgan darslar',
      teachersTitle: 'Bizning Tajribali Ustozlarimiz',
      teachersSubtitle: 'O‘z sohasining yetuk mutaxassislari — Hadicha ustoz va Hasanboy ustoz',
      testimonialsTitle: 'O‘quvchilarimiz va Ota-onalar Fikrlari',
      contactTitle: 'Hoziroq Ro‘yxatdan O‘ting',
      contactSubtitle: 'Ma’lumotlaringizni qoldiring, menejerimiz 15 daqiqa ichida siz bilan bog‘lanib birinchi bepul darsga yozadi.',
      fullName: 'To‘liq Ismingiz',
      phone: 'Telefon Raqamingiz',
      selectCourse: 'Qiziqtirgan Kursni Tanlang',
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
      schedule: 'Расписание занятий',
      homework: 'Домашние задания',
      grades: 'Оценки и Рейтинг',
      applications: 'Заявки и Прием',
      payroll: 'Зарплаты и Payroll',
      receivePayment: 'Принять оплату',
      addStudent: 'Добавить ученика',
      addGroup: 'Добавить группу',
      publicSite: 'Основной сайт',
      academicYear: 'Учебный год',
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
      badge: 'Учебный Центр LUMOS — Математика и Английский Язык',
      heroTitle: 'Фундаментальные знания по Математике и Английскому',
      heroHighlight: 'в Центре LUMOS',
      heroSubtitle: 'Глубокое изучение с опытными преподавателями — Хадича (Математика) и Хасанбой (Английский язык). Гарантия качества и индивидуальный подход.',
      registerCta: 'Записаться на курс',
      loginCta: 'Войти в портал',
      studentsCount: '500+ Учеников',
      successRate: '98% Успеваемость',
      expertMentors: '2 Профильных Наставника',
      satisfactionRate: '4.9 Рейтинг доверия',
      coursesTitle: 'Наши Учебные Направления',
      coursesSubtitle: 'Практические и углубленные курсы по математике и английскому языку',
      teachersTitle: 'Наши Ведущие Преподаватели',
      teachersSubtitle: 'Квалифицированные педагоги центра — Хадича устаз и Хасанбой устаз',
      testimonialsTitle: 'Отзывы учеников и родителей',
      contactTitle: 'Запишитесь на первое бесплатное занятие',
      contactSubtitle: 'Оставьте заявку, наш консультант перезвонит в течение 15 минут.',
      fullName: 'Ваше полное имя',
      phone: 'Номер телефона',
      selectCourse: 'Выберите курс',
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
      schedule: 'Class Schedule',
      homework: 'Homework Tasks',
      grades: 'Grades & Ranking',
      applications: 'Applications & Leads',
      payroll: 'Salaries & Payroll',
      receivePayment: 'Receive Payment',
      addStudent: 'Add Student',
      addGroup: 'Add Group',
      publicSite: 'Main Website',
      academicYear: 'Academic Year',
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
      badge: 'LUMOS Education Center — Mathematics & English Excellence',
      heroTitle: 'Master Mathematics & English Language',
      heroHighlight: 'at LUMOS Center',
      heroSubtitle: 'In-depth learning guided by master instructors — Hadicha (Mathematics) and Hasanboy (English). Guaranteed mastery with personalized mentoring.',
      registerCta: 'Apply for Course',
      loginCta: 'Portal Sign In',
      studentsCount: '500+ Students',
      successRate: '98% Success Rate',
      expertMentors: '2 Master Instructors',
      satisfactionRate: '4.9 Student Rating',
      coursesTitle: 'Academic Study Programs',
      coursesSubtitle: 'Structured and intensive courses in Mathematics and English',
      teachersTitle: 'Our Dedicated Instructors',
      teachersSubtitle: 'Experienced subject specialists — Hadicha ustoz & Hasanboy ustoz',
      testimonialsTitle: 'Student & Parent Testimonials',
      contactTitle: 'Enroll for a Free Trial Lesson Today',
      contactSubtitle: 'Leave your contact information and our admissions advisor will contact you within 15 minutes.',
      fullName: 'Full Name',
      phone: 'Phone Number',
      selectCourse: 'Select Study Track',
      submitApplication: 'Submit Application',
      applicationSuccess: 'Application received! An admissions advisor will contact you shortly.',
    },
  },
};
