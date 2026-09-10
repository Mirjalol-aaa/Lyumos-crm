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
    importExcel: string;
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
  // Landing Page (100% Comprehensive Multi-language)
  landing: {
    // Nav
    navCourses: string;
    navTeachers: string;
    navWhyUs: string;
    navReviews: string;
    navContact: string;
    adminTeacherPortal: string;
    studentCabinet: string;
    returnToStudentCabinet: string;
    returnToAdminDashboard: string;

    // Hero
    badge: string;
    heroTitle: string;
    heroHighlight: string;
    heroSubtitle: string;
    registerCta: string;
    loginCta: string;
    studentPortalBtn: string;
    trustSmallGroups: string;
    trustMonthlyFee: string;
    trustFreeTrial: string;

    // Stats
    studentsCount: string;
    successRate: string;
    expertMentors: string;
    specializedTracks: string;
    satisfactionRate: string;

    // Courses Section
    coursesBadge: string;
    coursesTitle: string;
    coursesSubtitle: string;
    mathBadge: string;
    mathTitle: string;
    mathDesc: string;
    mathTeacherName: string;
    mathSchedule: string;
    mathSyllabus: string[];
    engBadge: string;
    engTitle: string;
    engDesc: string;
    engTeacherName: string;
    engSchedule: string;
    engSyllabus: string[];
    courseDurationMonths: string;
    teacherLabel: string;
    scheduleLabel: string;
    syllabusTitle: string;
    monthlyFeeLabel: string;
    enrollBtn: string;

    // Teachers Section
    teachersBadge: string;
    teachersTitle: string;
    teachersSubtitle: string;
    hadichaTitle: string;
    hadichaRole: string;
    hadichaBio: string;
    hadichaDays: string;
    hadichaTime: string;
    hadichaBtn: string;
    hasanboyTitle: string;
    hasanboyRole: string;
    hasanboyBio: string;
    hasanboyDays: string;
    hasanboyTime: string;
    hasanboyBtn: string;
    ratingText: string;
    daysLabel: string;
    timeLabel: string;

    // Why Choose Us
    whyUsBadge: string;
    whyUsTitle: string;
    whyUsSubtitle: string;
    whyFeature1Title: string;
    whyFeature1Desc: string;
    whyFeature2Title: string;
    whyFeature2Desc: string;
    whyFeature3Title: string;
    whyFeature3Desc: string;
    whyFeature4Title: string;
    whyFeature4Desc: string;

    // Testimonials / Reviews
    testimonialsBadge: string;
    testimonialsTitle: string;
    testimonialsSubtitle: string;
    testimonialsList: Array<{
      name: string;
      role: string;
      subject: string;
      text: string;
      score: string;
    }>;

    // Contact
    contactBadge: string;
    contactTitle: string;
    contactSubtitle: string;
    phoneLabel: string;
    addressLabel: string;
    addressVal: string;
    workingHoursLabel: string;
    workingHoursVal: string;
    formTitle: string;
    formSubtitle: string;
    fullName: string;
    fullNamePlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    selectCourse: string;
    submitApplication: string;
    applicationSuccess: string;
    cancelBtn: string;

    // Footer
    footerSlogan: string;
    footerRights: string;

    // Navigation Additions
    navResults: string;
    navBranches: string;
    navFaq: string;

    // Diagnostic
    diagnosticBadge: string;
    diagnosticHeroBtn: string;
    diagnosticBannerTitle: string;
    diagnosticBannerSubtitle: string;
    diagnosticBannerBtn: string;

    // Categories & Actions
    catAll: string;
    catMath: string;
    catEnglish: string;
    catIelts: string;
    catIt: string;
    catSchool: string;
    catAbiturient: string;
    searchPlaceholder: string;
    courseDetailsBtn: string;
    courseEnrollBtn: string;

    // Results Section
    resultsBadge: string;
    resultsTitle: string;
    resultsSubtitle: string;

    // Branches Section
    branchesBadge: string;
    branchesTitle: string;
    branchesSubtitle: string;
    branchActive: string;
    branchPlanned: string;
    branchManager: string;
    branchEnroll: string;

    // FAQ Section (A+ Academy inspired)
    faqBadge: string;
    faqTitle: string;
    faqSubtitle: string;
    faqList: Array<{
      q: string;
      a: string;
    }>;
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
      importExcel: 'Excel orqali yuklash',
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
      navCourses: 'Kurslar',
      navTeachers: 'Ustozlar',
      navWhyUs: 'Afzalliklar',
      navReviews: 'Fikrlar',
      navContact: 'Bog‘lanish',
      adminTeacherPortal: 'Admin & Ustoz Portali',
      studentCabinet: 'Talaba Shaxsiy Kabineti',
      returnToStudentCabinet: 'Talaba Kabinetiga Qaytish',
      returnToAdminDashboard: 'Boshqaruv Paneliga Qaytish',

      badge: 'LUMOS O‘quv Markazi — Matematika va Ingliz Tili',
      heroTitle: 'Matematika va Ingliz Tilida',
      heroHighlight: 'Mustahkam Bilim Va Natija!',
      heroSubtitle: 'Hadicha ustoz (Matematika) va Hasanboy ustoz (Ingliz tili) bilan individual yondashuv, zamonaviy metodika va kafolatlangan o‘zlashtirish.',
      registerCta: 'Kursga Yozilish',
      loginCta: 'Tizimga Kirish',
      studentPortalBtn: 'Talaba Portali (LMS)',
      trustSmallGroups: 'Kichik guruhlar (12-16 nafar)',
      trustMonthlyFee: 'Oylik to‘lov: 250,000 so‘m',
      trustFreeTrial: 'Birinchi dars — bepul sinov',

      studentsCount: '500+ Bitiruvchilar',
      successRate: '98% O‘zlashtirish',
      expertMentors: '2 Ta Professional Ustoz',
      specializedTracks: 'Ixtisoslashgan Yo‘nalish',
      satisfactionRate: '4.9 O‘quvchilar Bahosi',

      coursesBadge: 'Ta’lim Dasturlari',
      coursesTitle: 'Bizning Ta’lim Dasturlarimiz',
      coursesSubtitle: 'Matematika va ingliz tili bo‘yicha chuqurlashtirilgan, amaliy va natijaga yo‘naltirilgan darslar',
      mathBadge: 'Aniq Fanlar & Mantiq',
      mathTitle: 'Matematika (Hadicha ustoz)',
      mathDesc: 'Boshlang‘ich va o‘rta sinf o‘quvchilari uchun matematika, mantiqiy fikrlash, DTM va olimpiada masalalari.',
      mathTeacherName: 'Hadicha ustoz',
      mathSchedule: 'Dush, Chor, Juma (14:00 - 16:00)',
      mathSyllabus: [
        'Arifmetika va algebra asoslarini sodda uslubda tushunish',
        'Mantiqiy misollar va nostandart masalalarni mustaqil yechish',
        'DTM testlari va maktab darsliklariga to‘liq moslashuv',
        'Olimpiada masalalari va tez hisoblash texnikalari',
      ],
      engBadge: 'Xalqaro Tillar',
      engTitle: 'Ingliz Tili (Hasanboy ustoz)',
      engDesc: 'Ingliz tili grammatikasi, boy so‘z boyligi, ravon jonli so‘zlashuv hamda IELTS imtihoniga poydevor kursi.',
      engTeacherName: 'Hasanboy ustoz',
      engSchedule: 'Sesh, Pay, Shan (15:30 - 17:30)',
      engSyllabus: [
        'Grammatika va jumlalar tuzishning eng sodda va tushunarli uslubi',
        'Listening & Speaking amaliy mashg‘ulotlari va jonli dialoglar',
        '2000+ eng muhim va kerakli lug‘at boyligini o‘zlashtirish',
        'Speaking Club va muntazam jonli muloqot amaliyoti',
      ],
      courseDurationMonths: 'oylik kurs',
      teacherLabel: 'Ustoz:',
      scheduleLabel: 'Dars vaqti:',
      syllabusTitle: 'Kurs dasturi o‘z ichiga oladi:',
      monthlyFeeLabel: 'Oylik to‘lov:',
      enrollBtn: 'Kursga Yozilish',

      teachersBadge: 'Ustozlarimiz',
      teachersTitle: 'Bizning Tajribali Ustozlarimiz',
      teachersSubtitle: 'Matematika va ingliz tili bo‘yicha ko‘p yillik tajribaga ega yetuk pedagoglar',
      hadichaTitle: 'Hadicha ustoz',
      hadichaRole: 'Matematika va Mantiq Fani Ustozi',
      hadichaBio: 'Oliy toifali pedagog. Matematika, mantiq, DTM testlari va olimpiadalarga tayyorgarlik bo‘yicha ko‘p yillik tajribaga ega. Har bir o‘quvchining qobiliyatiga qarab individual dastur tuzadi.',
      hadichaDays: 'Dush, Chor, Juma',
      hadichaTime: '14:00 - 16:00 (101-xona)',
      hadichaBtn: 'Hadicha ustoz guruhiga yozilish',
      hasanboyTitle: 'Hasanboy ustoz',
      hasanboyRole: 'Ingliz Tili (General & IELTS) Ustozi',
      hasanboyBio: 'Xalqaro sertifikatlarga ega instruktor. Grammatika va jonli so‘zlashuv to‘sig‘ini yengish bo‘yicha interaktiv uslub egasi. Speaking Club va tinglab tushunish mashg‘ulotlari yetakchisi.',
      hasanboyDays: 'Sesh, Pay, Shan',
      hasanboyTime: '15:30 - 17:30 (102-xona)',
      hasanboyBtn: 'Hasanboy ustoz guruhiga yozilish',
      ratingText: 'Baho · faol o‘quvchilar',
      daysLabel: 'Dars kunlari:',
      timeLabel: 'Vaqti:',

      whyUsBadge: 'Afzalliklarimiz',
      whyUsTitle: 'Nima Uchun LUMOS Markazini Tanlashadi?',
      whyUsSubtitle: 'Farzandingiz kelajagi uchun eng qulay va professional ta’lim muhiti',
      whyFeature1Title: 'Kichik Guruhlar',
      whyFeature1Desc: 'Maksimal 12-16 kishilik ixcham guruhlar tufayli har bir o‘quvchiga ustozning to‘liq e’tibori yetadi.',
      whyFeature2Title: 'Ota-onalar Nazorati',
      whyFeature2Desc: 'Har oy davomat, o‘zlashtirish va to‘lovlar haqida shaffof elektron hisobot taqdim etiladi.',
      whyFeature3Title: 'Amaliy Metodika',
      whyFeature3Desc: 'Quruq yodlash emas, balki mantiqiy fikrlash, erkin so‘zlashuv va mustaqil misol yechishga o‘rgatiladi.',
      whyFeature4Title: 'Adolatli Narxlar',
      whyFeature4Desc: 'Oylik atigi 250,000 so‘m. Bepul sinov darsi va birinchi darsdan natijani his qilish kafolati.',

      testimonialsBadge: 'Fikrlar',
      testimonialsTitle: 'O‘quvchilarimiz va Ota-onalar Fikrlari',
      testimonialsSubtitle: 'Biz bilan birga yutuqlarga erishayotgan o‘quvchilar va ularning ota-onalari',
      testimonialsList: [
        {
          name: 'Shahzodbek Aliyev',
          role: 'O‘quvchi',
          subject: 'Matematika kursi',
          text: 'Hadicha ustoz tufayli murakkab misollarni oson yechishni o‘rgandim. Maktabda baholarim a’lo darajaga chiqdi!',
          score: 'Baho: 5.0',
        },
        {
          name: 'Nigora Karimova',
          role: 'Ona',
          subject: 'Ingliz tili kursi',
          text: 'O‘g‘lim Hasanboy ustoz darslariga juda qiziqib qatnashmoqda. Qisqa vaqt ichida erkin gapira boshladi.',
          score: 'Baho: 5.0',
        },
        {
          name: 'Jasurbek Usmonov',
          role: 'O‘quvchi',
          subject: 'IELTS tayyorgarlik',
          text: 'Speaking club va qiziqarli lug‘at o‘yinlari ingliz tilini o‘rganishni haqiqiy zavqqa aylantirdi.',
          score: 'Baho: 5.0',
        },
        {
          name: 'Dilnoza opa',
          role: 'Ona',
          subject: 'Matematika & Mantiq',
          text: 'LUMOS markazida tartib-intizom va shaxsiy kabinet orqali davomatni kuzatish tizimi ajoyib yo‘lga qo‘yilgan.',
          score: 'Baho: 5.0',
        },
      ],

      contactBadge: 'Qabul Ochiq',
      contactTitle: 'Hoziroq Ro‘yxatdan O‘ting',
      contactSubtitle: 'Ma’lumotlaringizni qoldiring, menejerimiz 15 daqiqa ichida siz bilan bog‘lanib birinchi bepul darsga yozadi.',
      phoneLabel: 'Qo‘ng‘iroq uchun:',
      addressLabel: 'Manzil:',
      addressVal: 'Toshkent sh., Chilonzor tumani, Bunyodkor shoh ko‘chasi 42',
      workingHoursLabel: 'Ish vaqti:',
      workingHoursVal: 'Dushanba - Shanba: 08:30 - 19:30',
      formTitle: 'Birinchi Bepul Sinov Darsiga Yoziling',
      formSubtitle: 'Formani to‘ldiring, joylar soni cheklangan (16 nafar).',
      fullName: 'Ism va Familiyangiz',
      fullNamePlaceholder: 'Masalan: Azizbek Rahimov',
      phone: 'Telefon Raqamingiz',
      phonePlaceholder: '+998 (90) 123-45-67',
      selectCourse: 'Qiziqtirgan Kursni Tanlang',
      submitApplication: 'Ariza Yuborish',
      applicationSuccess: 'Arizangiz qabul qilindi! Tez orada mutaxassislarimiz bog‘lanishadi.',
      cancelBtn: 'Bekor qilish',

      footerSlogan: 'Bilim bilan yorqin kelajakka!',
      footerRights: 'LUMOS ERP & Education. Barcha huquqlar himoyalangan.',

      navResults: 'Natijalar',
      navBranches: 'Filiallar',
      navFaq: 'Savol-Javob',

      diagnosticBadge: '2 daqiqalik bepul sinov',
      diagnosticHeroBtn: 'Darajangizni Aniqlang (Test)',
      diagnosticBannerTitle: 'Qaysi guruh sizga to‘g‘ri kelishini bilmaysizmi?',
      diagnosticBannerSubtitle: 'Interaktiv diagnostik testimiz orqali bilim darajangizni aniqlang va sizga eng mos keluvchi ta’lim dasturini tanlang.',
      diagnosticBannerBtn: 'Darajani Bepul Aniqlash →',

      catAll: 'Barchasi',
      catMath: 'Matematika',
      catEnglish: 'Ingliz tili',
      catIelts: 'IELTS',
      catIt: 'IT & Dasturlash',
      catSchool: 'Maktab fanlari',
      catAbiturient: 'Abituriyent',
      searchPlaceholder: 'Kurs nomi yoki ustoz...',
      courseDetailsBtn: 'Batafsil',
      courseEnrollBtn: 'Yozilish',

      resultsBadge: 'Real Natijalar',
      resultsTitle: 'O‘quvchilarimizning Erishgan Yutuqlari',
      resultsSubtitle: 'LUMOS da ta’lim shunchaki quruq dars emas — bu oliygoh granti, xalqaro sertifikat va hayotiy muvaffaqiyat garovidir.',

      branchesBadge: 'Filiallarimiz',
      branchesTitle: 'O‘zingizga Qulay Filialni Tanlang',
      branchesSubtitle: 'Shahar markazida va qulay hududlarda joylashgan, zamonaviy jihozlangan o‘quv kampuslarimiz.',
      branchActive: 'Faol Filial',
      branchPlanned: 'Tez Kunda',
      branchManager: 'Rahbar:',
      branchEnroll: 'Yozilish →',

      faqBadge: 'Ko‘p Beriladigan Savollar',
      faqTitle: 'Sizni Qiziqtirgan Savollarga Javoblar',
      faqSubtitle: 'Ta’lim jarayoni, to‘lovlar va o‘qish tartibi haqida eng ko‘p beriladigan savollar va batafsil javoblar.',
      faqList: [
        {
          q: 'Darslar qanday tartibda o‘tiladi va birinchi sinov darsi bormi?',
          a: 'Ha, albatta! Birinchi dars mutlaqo bepul sinov darsi hisoblanadi. O‘quvchi o‘z darajasiga mos guruhga kelib darsda qatnashadi, metodika va ustoz bilan yaqindan tanishadi.',
        },
        {
          q: 'Guruhlarda nechta o‘quvchi ta’lim oladi?',
          a: 'Guruhlarimiz ixcham — maksimal 10-12 nafar o‘quvchidan iborat. Bu ustozga har bir talaba bilan individual ishlash va savollariga to‘liq javob berish imkonini beradi.',
        },
        {
          q: 'Ota-onalar farzandining darsga qatnashayotganini qanday kuzatib boradi?',
          a: 'LUMOS ning avtomatlashtirilgan Telegram boti orqali farzandingiz darsga kelgan-kelmagani, darsdagi faolligi va test natijalari har kuni ota-onaning telefoniga avtomatik yuboriladi.',
        },
        {
          q: 'To‘lovlarni qanday usulda amalga oshirish mumkin?',
          a: 'To‘lovlarni Payme, Click ilovalari orqali masofadan yoki markazimizga kelib naqd pul hamda bank kartalari orqali to‘lashingiz mumkin. Har bir to‘lov uchun rasmiy elektron kvitansiya taqdim etiladi.',
        },
        {
          q: 'IELTS va DTM natijalari bo‘yicha kafolat bormi?',
          a: 'Ha! Bizning intensiv guruhlarimizda barcha darslarga muntazam qatnashgan va topshiriqlarni to‘liq bajargan o‘quvchilar uchun IELTS 7.0+ va DTM da davlat granti kafolatlanadi.',
        },
        {
          q: 'Agar o‘quvchi biror darsni qoldirsa, mavzu qanday o‘zlashtiriladi?',
          a: 'Har bir o‘quvchining shaxsiy LMS kabinetida dars materiallari, konspektlar va video yozuvlar saqlanadi. Shuningdek, ustoz tomonidan qoldirilgan mavzu bo‘yicha bepul qo‘shimcha konsultatsiya beriladi.',
        },
      ],
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
      importExcel: 'Импорт из Excel',
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
      payWithPayme: 'Оплата через Payme',
      payWithClick: 'Оплата через Click',
      payCash: 'Наличные / Терминал',
      receipt: 'Квитанция оплаты',
      paymentSuccess: 'Оплата успешно принята!',
      paymentFailed: 'Ошибка оплаты',
      downloadPdf: 'Скачать квитанцию PDF',
      transactionId: 'ID транзакции',
      date: 'Дата и время',
      payer: 'Плательщик',
    },
    landing: {
      navCourses: 'Курсы',
      navTeachers: 'Преподаватели',
      navWhyUs: 'Преимущества',
      navReviews: 'Отзывы',
      navContact: 'Контакты',
      adminTeacherPortal: 'Портал Админа и Учителя',
      studentCabinet: 'Личный кабинет студента',
      returnToStudentCabinet: 'В кабинет студента',
      returnToAdminDashboard: 'В панель управления',

      badge: 'Учебный Центр LUMOS — Математика и Английский Язык',
      heroTitle: 'Математика и Английский Язык',
      heroHighlight: 'Твердые Знания и Результат!',
      heroSubtitle: 'Обучение с опытными наставниками — Хадича (Математика) и Хасанбой (Английский). Индивидуальный подход, интерактивная методика и гарантированный результат.',
      registerCta: 'Записаться на Курс',
      loginCta: 'Вход в Систему',
      studentPortalBtn: 'Студенческий Портал (LMS)',
      trustSmallGroups: 'Мини-группы (12-16 учеников)',
      trustMonthlyFee: 'Оплата: 250,000 сум в месяц',
      trustFreeTrial: 'Первый пробный урок — бесплатно',

      studentsCount: '500+ Выпускников',
      successRate: '98% Успеваемость',
      expertMentors: '2 Опытных Наставника',
      specializedTracks: 'Профильных Направления',
      satisfactionRate: '4.9 Оценка Студентов',

      coursesBadge: 'Учебные Программы',
      coursesTitle: 'Наши Программы Обучения',
      coursesSubtitle: 'Углубленные, практические и нацеленные на реальный результат курсы по математике и английскому языку',
      mathBadge: 'Точные Науки & Логика',
      mathTitle: 'Математика (Хадича)',
      mathDesc: 'Математика для начальных и средних классов, логическое мышление, подготовка к вступительным экзаменам и олимпиадам.',
      mathTeacherName: 'Хадича',
      mathSchedule: 'Пн, Ср, Пт (14:00 - 16:00)',
      mathSyllabus: [
        'Понятное и доступное объяснение арифметики и основ алгебры',
        'Самостоятельное решение нестандартных логических задач',
        'Полное соответствие школьной программе и вступительным тестам',
        'Техники быстрого устного счета и олимпиадные задачи',
      ],
      engBadge: 'Международные Языки',
      engTitle: 'Английский Язык (Хасанбой)',
      engDesc: 'Курс практической грамматики, богатого словарного запаса, беглой разговорной речи и фундамент для сдачи IELTS.',
      engTeacherName: 'Хасанбой',
      engSchedule: 'Вт, Чт, Сб (15:30 - 17:30)',
      engSyllabus: [
        'Простая и наглядная методика освоения английской грамматики',
        'Практика аудирования и живого общения в диалогах',
        'Освоение 2000+ наиболее важных и актуальных слов',
        'Регулярный Speaking Club и преодоление языкового барьера',
      ],
      courseDurationMonths: 'месяцев курс',
      teacherLabel: 'Преподаватель:',
      scheduleLabel: 'Время уроков:',
      syllabusTitle: 'Программа курса включает:',
      monthlyFeeLabel: 'Оплата в месяц:',
      enrollBtn: 'Записаться на Курс',

      teachersBadge: 'Наши Учителя',
      teachersTitle: 'Опытные и Заботливые Наставники',
      teachersSubtitle: 'Квалифицированные педагоги с многолетним опытом преподавания математики и английского языка',
      hadichaTitle: 'Учитель Хадича',
      hadichaRole: 'Преподаватель математики и логики',
      hadichaBio: 'Педагог высшей категории. Большой опыт подготовки к экзаменам, тестированию и олимпиадам. Индивидуальный план обучения с учетом уровня каждого ребенка.',
      hadichaDays: 'Пн, Ср, Пт',
      hadichaTime: '14:00 - 16:00 (Кабинет 101)',
      hadichaBtn: 'Записаться к Хадиче',
      hasanboyTitle: 'Учитель Хасанбой',
      hasanboyRole: 'Преподаватель английского (General & IELTS)',
      hasanboyBio: 'Сертифицированный преподаватель международного уровня. Интерактивная методика снятия языкового барьера. Ведущий Speaking Club и тренингов по беглой речи.',
      hasanboyDays: 'Вт, Чт, Сб',
      hasanboyTime: '15:30 - 17:30 (Кабинет 102)',
      hasanboyBtn: 'Записаться к Хасанбою',
      ratingText: 'Рейтинг · активных учеников',
      daysLabel: 'Дни занятий:',
      timeLabel: 'Время:',

      whyUsBadge: 'Преимущества',
      whyUsTitle: 'Почему Выбирают LUMOS?',
      whyUsSubtitle: 'Комфортная, современная и профессиональная образовательная среда для вашего ребенка',
      whyFeature1Title: 'Мини-группы',
      whyFeature1Desc: 'В группах всего 12-16 учеников, что позволяет уделить максимум внимания каждому.',
      whyFeature2Title: 'Контроль для Родителей',
      whyFeature2Desc: 'Ежемесячный прозрачный электронный отчет об оценках, посещаемости и успехах ребенка.',
      whyFeature3Title: 'Практическая Методика',
      whyFeature3Desc: 'Никакой пустой зубрежки — учим думать логически, свободно говорить и уверенно решать задачи.',
      whyFeature4Title: 'Справедливая Цена',
      whyFeature4Desc: 'Всего 250,000 сум в месяц. Бесплатный пробный урок и гарантия прогресса с первого занятия.',

      testimonialsBadge: 'Отзывы',
      testimonialsTitle: 'Что Говорят Ученики и Родители',
      testimonialsSubtitle: 'Истории успехов наших учеников и слова благодарности от родителей',
      testimonialsList: [
        {
          name: 'Шахзодбек Алиев',
          role: 'Ученик',
          subject: 'Курс математики',
          text: 'Благодаря учителю Хадиче я легко научился решать трудные задачи. Мои оценки в школе выросли до отличных!',
          score: 'Оценка: 5.0',
        },
        {
          name: 'Нигора Каримова',
          role: 'Родитель',
          subject: 'Курс английского',
          text: 'Мой сын с огромным удовольствием ходит на уроки Хасанбоя. За короткий срок начал уверенно говорить по-английски.',
          score: 'Оценка: 5.0',
        },
        {
          name: 'Жасурбек Усмонов',
          role: 'Студент',
          subject: 'Подготовка к IELTS',
          text: 'Разговорный клуб и интерактивные словарные игры сделали изучение языка увлекательным и эффективным.',
          score: 'Оценка: 5.0',
        },
        {
          name: 'Дильноза Каримова',
          role: 'Родитель',
          subject: 'Математика и логика',
          text: 'В центре LUMOS отличная дисциплина, а личный кабинет позволяет легко следить за посещаемостью и успехами.',
          score: 'Оценка: 5.0',
        },
      ],

      contactBadge: 'Прием Открыт',
      contactTitle: 'Запишитесь на Пробный Урок Прямо Сейчас',
      contactSubtitle: 'Оставьте заявку, и наш куратор свяжется с вами в течение 15 минут для записи на бесплатный урок.',
      phoneLabel: 'Телефон для справок:',
      addressLabel: 'Адрес центра:',
      addressVal: 'г. Ташкент, Чиланзарский район, проспект Бунёдкор, 42',
      workingHoursLabel: 'Режим работы:',
      workingHoursVal: 'Понедельник - Суббота: 08:30 - 19:30',
      formTitle: 'Запись на Бесплатный Пробный Урок',
      formSubtitle: 'Заполните форму, количество мест в группах ограничено (до 16 человек).',
      fullName: 'Ваше имя и фамилия',
      fullNamePlaceholder: 'Например: Азизбек Рахимов',
      phone: 'Номер телефона',
      phonePlaceholder: '+998 (90) 123-45-67',
      selectCourse: 'Выберите направление',
      submitApplication: 'Отправить Заявку',
      applicationSuccess: 'Ваша заявка принята! Скоро наш менеджер свяжется с вами.',
      cancelBtn: 'Отмена',

      footerSlogan: 'К светлому будущему через знание!',
      footerRights: 'LUMOS ERP & Education. Все права защищены.',

      navResults: 'Результаты',
      navBranches: 'Филиалы',
      navFaq: 'Вопросы и ответы',

      diagnosticBadge: '2-минутный бесплатный тест',
      diagnosticHeroBtn: 'Определить уровень (Тест)',
      diagnosticBannerTitle: 'Не знаете, какая программа вам подходит?',
      diagnosticBannerSubtitle: 'Пройдите интерактивный тест за 2 минуты и получите точную рекомендацию подходящего курса.',
      diagnosticBannerBtn: 'Определить уровень бесплатно →',

      catAll: 'Все',
      catMath: 'Математика',
      catEnglish: 'Английский язык',
      catIelts: 'IELTS',
      catIt: 'IT и Программирование',
      catSchool: 'Школьные предметы',
      catAbiturient: 'Абитуриент',
      searchPlaceholder: 'Название курса или преподаватель...',
      courseDetailsBtn: 'Подробнее',
      courseEnrollBtn: 'Записаться',

      resultsBadge: 'Реальные Результаты',
      resultsTitle: 'Достижения Наших Студентов',
      resultsSubtitle: 'Обучение в LUMOS — это гарантия поступления на грант, высоких баллов на олимпиадах и международного признания.',

      branchesBadge: 'Наши Филиалы',
      branchesTitle: 'Выберите Удобный Для Вас Филиал',
      branchesSubtitle: 'Современные учебные кампусы, расположенные в центральных и удобных локациях города.',
      branchActive: 'Активный филиал',
      branchPlanned: 'Скоро открытие',
      branchManager: 'Руководитель:',
      branchEnroll: 'Записаться →',

      faqBadge: 'Часто Задаваемые Вопросы',
      faqTitle: 'Ответы на Популярные Вопросы',
      faqSubtitle: 'Все о процессе обучения, оплате, пробных уроках и формате занятий.',
      faqList: [
        {
          q: 'Как проходят занятия и есть ли бесплатный пробный урок?',
          a: 'Да! Первый урок абсолютно бесплатный. Ученик посещает группу своего уровня, знакомится с преподавателем и интерактивной методикой.',
        },
        {
          q: 'Сколько учеников в одной группе?',
          a: 'Наши группы мини-формата — строго до 10-12 человек, что гарантирует индивидуальное внимание преподавателя каждому.',
        },
        {
          q: 'Как родители контролируют посещаемость и успеваемость?',
          a: 'Через наш Telegram-бот родители ежедневно получают автоматические отчеты о присутствии, оценках за домашние задания и результатах тестов.',
        },
        {
          q: 'Как можно произвести оплату?',
          a: 'Оплата принимается через Payme, Click онлайн, а также наличными или банковской картой в филиале. За каждый платеж выдается электронный чек.',
        },
        {
          q: 'Есть ли гарантия результата по IELTS и ДТМ?',
          a: 'Да! При соблюдении посещаемости и своевременном выполнении заданий мы гарантируем IELTS 7.0+ и поступление на государственный грант.',
        },
        {
          q: 'Что делать, если ученик пропустил занятие?',
          a: 'Все материалы, презентации и видео доступны в личном кабинете LMS. Также организуются бесплатные консультации с преподавателем.',
        },
      ],
    },
  },
  en: {
    common: {
      dashboard: 'Executive Dashboard',
      students: 'Students Hub',
      teachers: 'Teachers Directory',
      groups: 'Academic Groups',
      attendance: 'Attendance Monitor',
      payments: 'Payment Ledger',
      expenses: 'Expenses Registry',
      reports: 'Analytics & Reports',
      settings: 'System Preferences',
      branches: 'Branch Network',
      credentials: 'User Credentials',
      audit: 'Audit Trails',
      save: 'Save Changes',
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
      error: 'An error occurred',
      logout: 'Sign Out',
      login: 'Sign In',
      back: 'Back',
      select: 'Select',
      viewAll: 'View All',
      schedule: 'Class Schedule',
      homework: 'Homework & Tasks',
      grades: 'Grades & Ranking',
      applications: 'Inquiries & Leads',
      payroll: 'Payroll Ledger',
      receivePayment: 'Accept Payment',
      addStudent: 'Register Student',
      importExcel: 'Import from Excel',
      addGroup: 'Create Group',
      publicSite: 'Main Website',
      academicYear: 'Academic Year',
    },
    roles: {
      superAdmin: 'Super Administrator',
      teacher: 'Instructor / Mentor',
      student: 'Student / Scholar',
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
      navCourses: 'Courses',
      navTeachers: 'Instructors',
      navWhyUs: 'Advantages',
      navReviews: 'Reviews',
      navContact: 'Contact',
      adminTeacherPortal: 'Admin & Teacher Portal',
      studentCabinet: 'Student Personal Portal',
      returnToStudentCabinet: 'Return to Student Portal',
      returnToAdminDashboard: 'Return to Admin Dashboard',

      badge: 'LUMOS Education Center — Mathematics & English Excellence',
      heroTitle: 'Master Mathematics & English Language',
      heroHighlight: 'at LUMOS Center',
      heroSubtitle: 'In-depth learning guided by master instructors — Hadicha (Mathematics) and Hasanboy (English). Guaranteed mastery with personalized mentoring.',
      registerCta: 'Apply for Course',
      loginCta: 'Portal Sign In',
      studentPortalBtn: 'Student Portal (LMS)',
      trustSmallGroups: 'Small groups (12-16 students)',
      trustMonthlyFee: 'Tuition: 250,000 UZS / month',
      trustFreeTrial: 'First lesson — 100% free trial',

      studentsCount: '500+ Graduates',
      successRate: '98% Pass Rate',
      expertMentors: '2 Master Instructors',
      specializedTracks: 'Specialized Tracks',
      satisfactionRate: '4.9 Student Rating',

      coursesBadge: 'Academic Curriculum',
      coursesTitle: 'Our Academic Programs',
      coursesSubtitle: 'Structured and intensive study courses in Mathematics and English',
      mathBadge: 'Exact Sciences & Logic',
      mathTitle: 'Mathematics (Hadicha)',
      mathDesc: 'Elementary and middle school mathematics, analytical reasoning, national test preparation and olympiad problem solving.',
      mathTeacherName: 'Hadicha ustoz',
      mathSchedule: 'Mon, Wed, Fri (14:00 - 16:00)',
      mathSyllabus: [
        'Clear, intuitive understanding of arithmetic and algebraic foundations',
        'Independent problem solving for non-standard logical challenges',
        'Comprehensive alignment with school tests and entrance exams',
        'Speed calculation methods and olympiad level math techniques',
      ],
      engBadge: 'International Languages',
      engTitle: 'English Language (Hasanboy)',
      engDesc: 'Practical English grammar, rich vocabulary, fluent conversation skills, and solid foundation for IELTS.',
      engTeacherName: 'Hasanboy ustoz',
      engSchedule: 'Tue, Thu, Sat (15:30 - 17:30)',
      engSyllabus: [
        'Simplest and most intuitive methodology for mastering English grammar',
        'Active listening and communicative speaking drills in realistic dialogues',
        'Mastery of 2,000+ high-frequency essential vocabulary words',
        'Weekly Speaking Club and immersive conversational practice',
      ],
      courseDurationMonths: 'month course',
      teacherLabel: 'Instructor:',
      scheduleLabel: 'Schedule:',
      syllabusTitle: 'Course curriculum covers:',
      monthlyFeeLabel: 'Monthly Tuition:',
      enrollBtn: 'Enroll in Course',

      teachersBadge: 'Our Faculty',
      teachersTitle: 'Dedicated Expert Educators',
      teachersSubtitle: 'Senior subject matter experts with extensive teaching track records in Math & English',
      hadichaTitle: 'Hadicha ustoz',
      hadichaRole: 'Mathematics & Logic Instructor',
      hadichaBio: 'Top-tier pedagogue with proven years of experience preparing scholars for university entrance exams, olympiads, and academic excellence. Tailors individual learning trajectories for every student.',
      hadichaDays: 'Mon, Wed, Fri',
      hadichaTime: '14:00 - 16:00 (Room 101)',
      hadichaBtn: 'Enroll in Hadicha’s Group',
      hasanboyTitle: 'Hasanboy ustoz',
      hasanboyRole: 'English (General & IELTS) Specialist',
      hasanboyBio: 'Internationally accredited language coach. Pioneer of interactive speaking methods that eliminate conversational barriers. Lead organizer of Speaking Clubs and listening mastery.',
      hasanboyDays: 'Tue, Thu, Sat',
      hasanboyTime: '15:30 - 17:30 (Room 102)',
      hasanboyBtn: 'Enroll in Hasanboy’s Group',
      ratingText: 'Rating · active students',
      daysLabel: 'Class Days:',
      timeLabel: 'Class Time:',

      whyUsBadge: 'Why Choose Us',
      whyUsTitle: 'Why Choose LUMOS Education?',
      whyUsSubtitle: 'The most inspiring and results-driven educational environment for your future',
      whyFeature1Title: 'Small Class Sizes',
      whyFeature1Desc: 'Strict cap of 12-16 students per group ensures full individualized attention for each learner.',
      whyFeature2Title: 'Parental Transparency',
      whyFeature2Desc: 'Monthly digitized progress reports detailing attendance, homework scores, and academic growth.',
      whyFeature3Title: 'Applied Methodology',
      whyFeature3Desc: 'No mindless memorization — focus on critical thinking, fluent dialogue, and independent problem-solving.',
      whyFeature4Title: 'Fair & Honest Pricing',
      whyFeature4Desc: 'Affordable tuition at 250,000 UZS/month with a free introductory trial lesson to experience real progress.',

      testimonialsBadge: 'Testimonials',
      testimonialsTitle: 'Student & Parent Testimonials',
      testimonialsSubtitle: 'Real stories and feedback from our thriving scholars and proud families',
      testimonialsList: [
        {
          name: 'Shahzodbek Aliyev',
          role: 'Student',
          subject: 'Mathematics Track',
          text: 'Thanks to Hadicha ustoz, I learned how to solve complex math problems effortlessly. My school marks jumped to straight A’s!',
          score: 'Rating: 5.0',
        },
        {
          name: 'Nigora Karimova',
          role: 'Parent',
          subject: 'English Course',
          text: 'My son attends Hasanboy ustoz’s classes with immense enthusiasm. He started speaking fluent English within weeks.',
          score: 'Rating: 5.0',
        },
        {
          name: 'Jasurbek Usmonov',
          role: 'Student',
          subject: 'IELTS Preparation',
          text: 'The weekly speaking club and interactive vocabulary activities made learning English genuinely exciting and rewarding.',
          score: 'Rating: 5.0',
        },
        {
          name: 'Dilnoza Karimova',
          role: 'Parent',
          subject: 'Math & Logic',
          text: 'The discipline at LUMOS and the ability to track homework and attendance in the personal portal are unmatched.',
          score: 'Rating: 5.0',
        },
      ],

      contactBadge: 'Admissions Open',
      contactTitle: 'Sign Up for a Free Trial Class',
      contactSubtitle: 'Leave your contact details and our educational advisor will call you within 15 minutes.',
      phoneLabel: 'Direct Hotline:',
      addressLabel: 'Campus Address:',
      addressVal: 'Tashkent city, Chilanzar district, Bunyodkor Avenue 42',
      workingHoursLabel: 'Opening Hours:',
      workingHoursVal: 'Monday - Saturday: 08:30 - 19:30',
      formTitle: 'Enroll for Your Free First Trial Class',
      formSubtitle: 'Fill out this brief application form. Seats are strictly limited to 16 students per group.',
      fullName: 'Full Name',
      fullNamePlaceholder: 'e.g. Azizbek Rakhimov',
      phone: 'Phone Number',
      phonePlaceholder: '+998 (90) 123-45-67',
      selectCourse: 'Select Study Track',
      submitApplication: 'Submit Application',
      applicationSuccess: 'Application successfully received! An academic advisor will contact you shortly.',
      cancelBtn: 'Cancel',

      footerSlogan: 'Toward a Brighter Future with Knowledge!',
      footerRights: 'LUMOS ERP & Education. All rights reserved.',

      navResults: 'Results',
      navBranches: 'Branches',
      navFaq: 'FAQ',

      diagnosticBadge: '2-minute free assessment',
      diagnosticHeroBtn: 'Test Your Level',
      diagnosticBannerTitle: 'Not sure which cohort fits you best?',
      diagnosticBannerSubtitle: 'Take our interactive 2-minute diagnostic test and discover your recommended learning path.',
      diagnosticBannerBtn: 'Check Level For Free →',

      catAll: 'All Courses',
      catMath: 'Mathematics',
      catEnglish: 'English Language',
      catIelts: 'IELTS',
      catIt: 'IT & Coding',
      catSchool: 'School Subjects',
      catAbiturient: 'University Prep',
      searchPlaceholder: 'Course name or mentor...',
      courseDetailsBtn: 'Details',
      courseEnrollBtn: 'Enroll',

      resultsBadge: 'Proven Track Record',
      resultsTitle: 'Our Student Achievements',
      resultsSubtitle: 'Real results: prestigious university grants, top olympiad gold medals, and certified IELTS 7.5+ scores.',

      branchesBadge: 'Our Campuses',
      branchesTitle: 'Choose Your Nearest Branch',
      branchesSubtitle: 'Modern, fully equipped learning centers across prime city locations.',
      branchActive: 'Active Campus',
      branchPlanned: 'Coming Soon',
      branchManager: 'Campus Lead:',
      branchEnroll: 'Enroll →',

      faqBadge: 'FAQ',
      faqTitle: 'Frequently Asked Questions',
      faqSubtitle: 'Everything you need to know about our curriculum, admissions, and tuition.',
      faqList: [
        {
          q: 'How are classes structured and is there a free trial lesson?',
          a: 'Yes! The very first class is 100% free. Students can experience our interactive methodology and meet their instructor first-hand.',
        },
        {
          q: 'How many students are in each class?',
          a: 'We strictly cap classes at 10-12 students to ensure focused mentor attention and rapid individual progress.',
        },
        {
          q: 'How can parents track student attendance and progress?',
          a: 'Our automated Telegram bot sends real-time daily reports on attendance, test scores, and homework evaluations directly to parents.',
        },
        {
          q: 'What payment methods are supported?',
          a: 'Tuition can be paid online via Payme, Click, or in-person with cash and debit cards. Official digital receipts are issued immediately.',
        },
        {
          q: 'Is there an IELTS and university admission guarantee?',
          a: 'Yes, in our intensive cohorts with 90%+ attendance and completed coursework, we contractually guarantee Band 7.0+ and grant admissions.',
        },
        {
          q: 'What happens if a student misses a lecture?',
          a: 'All lectures, summaries, and digital notes are archived in the student LMS cabinet, and extra 1-on-1 consultations are arranged.',
        },
      ],
    },
  },
};
