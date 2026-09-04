import { Student, Teacher, Group, Expense, NotificationItem, CalendarEvent, CenterSettings } from '../types/crm';

export const initialSettings: CenterSettings = {
  centerName: "LUMOS O‘quv Markazi",
  tagline: "Bilim bilan yorqin kelajakka!",
  phone: "+998 (71) 200-00-25",
  email: "admin@lumos.uz",
  address: "Toshkent sh., Chilonzor tumani, Bunyodkor shoh ko‘chasi 42",
  currency: "UZS",
  currencySymbol: "so‘m",
  academicYear: "2025 - 2026",
  language: "uz",
  theme: "light",
  enableSmsNotifications: true,
  autoRemindUnpaid: true,
  discountPolicyMax: 20,
};

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: "TCH-01",
    fullName: "Hadicha ustoz",
    avatar: "", // No photo as requested
    phone: "+998 (90) 123-45-67",
    email: "hadicha@lumos.uz",
    subjects: ["Matematika"],
    baseSalary: 1200000,
    bonusPerStudent: 15000,
    groupsCount: 1,
    studentsCount: 11,
    joinedDate: "2024-06-01",
    rating: 5.0,
    schedule: "Dushanba, Chorshanba, Juma (14:00 - 16:00)",
    status: "Active"
  },
  {
    id: "TCH-02",
    fullName: "Malika ustoz",
    avatar: "", // No photo as requested
    phone: "+998 (90) 987-65-43",
    email: "ingliz@lumos.uz",
    subjects: ["Ingliz tili"],
    baseSalary: 1200000,
    bonusPerStudent: 15000,
    groupsCount: 1,
    studentsCount: 8,
    joinedDate: "2024-07-01",
    rating: 4.9,
    schedule: "Seshanba, Payshanba, Shanba (15:30 - 17:30)",
    status: "Active"
  }
];

export const INITIAL_GROUPS: Group[] = [
  {
    id: "GRP-01",
    name: "Matematika (Hadicha ustoz)",
    subject: "Matematika",
    level: "Barcha sinflar",
    teacherId: "TCH-01",
    teacherName: "Hadicha ustoz",
    room: "101-xona",
    scheduleDays: "Dush, Chor, Juma",
    scheduleTime: "14:00 - 16:00",
    status: "Active",
    monthlyFee: 250000,
    maxCapacity: 16,
    currentStudentsCount: 11
  },
  {
    id: "GRP-02",
    name: "Ingliz tili (Malika ustoz)",
    subject: "Ingliz tili",
    level: "General English",
    teacherId: "TCH-02",
    teacherName: "Malika ustoz",
    room: "102-xona",
    scheduleDays: "Sesh, Pay, Shan",
    scheduleTime: "15:30 - 17:30",
    status: "Active",
    monthlyFee: 250000,
    maxCapacity: 16,
    currentStudentsCount: 8
  }
];

// Helper to create empty payments template
const createPayments = (customPayments: Record<string, { status: 'Paid' | 'Unpaid' | 'Discount' | 'Frozen' | 'Overdue'; amountPaid: number; discount: number; paymentDate?: string; receiptNo?: string; }>) => {
  const months = ['August', 'September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May', 'June', 'July'];
  const res: any = {};
  months.forEach(m => {
    if (customPayments[m]) {
      res[m] = {
        ...customPayments[m],
        method: 'Payme / Click',
      };
    } else {
      res[m] = {
        status: 'Unpaid',
        amountPaid: 0,
        discount: 0,
      };
    }
  });
  return res;
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: "STU-01",
    fullName: "Mushtariy",
    avatar: "",
    birthDate: "2008-04-12",
    gender: "Female",
    phone: "+998 70 119 56 50",
    email: "mushtariy@lumos.uz",
    parentName: "Ota-onasi",
    parentPhone: "+998 70 119 56 50",
    groupId: "GRP-01",
    groupName: "Matematika (Hadicha ustoz)",
    teacherId: "TCH-01",
    teacherName: "Hadicha ustoz",
    monthlyFee: 250000,
    status: "Active",
    joinedDate: "2024-06-15",
    payments: createPayments({})
  },
  {
    id: "STU-02",
    fullName: "Shahjahon",
    avatar: "",
    birthDate: "2007-08-20",
    gender: "Male",
    phone: "+998 97 516 36 30",
    email: "shahjahon@lumos.uz",
    parentName: "Ota-onasi",
    parentPhone: "+998 97 516 36 30",
    groupId: "GRP-01",
    groupName: "Matematika (Hadicha ustoz)",
    teacherId: "TCH-01",
    teacherName: "Hadicha ustoz",
    monthlyFee: 250000,
    status: "Active",
    joinedDate: "2024-06-15",
    payments: createPayments({
      July: { status: "Paid", amountPaid: 250000, discount: 0, paymentDate: "2024-07-05", receiptNo: "LUM-701" }
    })
  },
  {
    id: "STU-03",
    fullName: "Munisa",
    avatar: "",
    birthDate: "2009-02-14",
    gender: "Female",
    phone: "+998 88 707 17 13",
    email: "munisa@lumos.uz",
    parentName: "Ota-onasi",
    parentPhone: "+998 88 707 17 13",
    groupId: "GRP-01",
    groupName: "Matematika (Hadicha ustoz)",
    teacherId: "TCH-01",
    teacherName: "Hadicha ustoz",
    monthlyFee: 250000,
    status: "Active",
    joinedDate: "2024-06-20",
    payments: createPayments({})
  },
  {
    id: "STU-04",
    fullName: "Azizbek",
    avatar: "",
    birthDate: "2007-11-05",
    gender: "Male",
    phone: "+998 99 600 00 00",
    email: "azizbek@lumos.uz",
    parentName: "Ota-onasi",
    parentPhone: "+998 99 600 00 00",
    groupId: "GRP-01",
    groupName: "Matematika (Hadicha ustoz)",
    teacherId: "TCH-01",
    teacherName: "Hadicha ustoz",
    monthlyFee: 250000,
    status: "Active",
    joinedDate: "2024-06-10",
    payments: createPayments({
      July: { status: "Paid", amountPaid: 250000, discount: 0, paymentDate: "2024-07-04", receiptNo: "LUM-702" },
      August: { status: "Paid", amountPaid: 250000, discount: 0, paymentDate: "2024-08-05", receiptNo: "LUM-801" },
      September: { status: "Paid", amountPaid: 250000, discount: 0, paymentDate: "2024-09-05", receiptNo: "LUM-901" },
    })
  },
  {
    id: "STU-05",
    fullName: "Asaloy",
    avatar: "",
    birthDate: "2008-09-18",
    gender: "Female",
    phone: "+998 91 900 00 00",
    email: "asaloy@lumos.uz",
    parentName: "Ota-onasi",
    parentPhone: "+998 91 900 00 00",
    groupId: "GRP-01",
    groupName: "Matematika (Hadicha ustoz)",
    teacherId: "TCH-01",
    teacherName: "Hadicha ustoz",
    monthlyFee: 250000,
    status: "Active",
    joinedDate: "2024-07-25",
    payments: createPayments({
      August: { status: "Paid", amountPaid: 280000, discount: 0, paymentDate: "2024-08-08", receiptNo: "LUM-802" },
    })
  },
  {
    id: "STU-06",
    fullName: "Go‘zaloy",
    avatar: "",
    birthDate: "2008-05-22",
    gender: "Female",
    phone: "+998 95 500 00 00",
    email: "gozaloy@lumos.uz",
    parentName: "Ota-onasi",
    parentPhone: "+998 95 500 00 00",
    groupId: "GRP-01",
    groupName: "Matematika (Hadicha ustoz)",
    teacherId: "TCH-01",
    teacherName: "Hadicha ustoz",
    monthlyFee: 250000,
    status: "Active",
    joinedDate: "2024-07-30",
    payments: createPayments({
      August: { status: "Paid", amountPaid: 94000, discount: 0, paymentDate: "2024-08-12", receiptNo: "LUM-803" },
      September: { status: "Paid", amountPaid: 119000, discount: 0, paymentDate: "2024-09-10", receiptNo: "LUM-902" },
    })
  },
  {
    id: "STU-07",
    fullName: "Quvonchoy",
    avatar: "",
    birthDate: "2009-03-10",
    gender: "Female",
    phone: "+998 90 123 45 67",
    email: "quvonchoy@lumos.uz",
    parentName: "Ota-onasi",
    parentPhone: "+998 90 123 45 67",
    groupId: "GRP-01",
    groupName: "Matematika (Hadicha ustoz)",
    teacherId: "TCH-01",
    teacherName: "Hadicha ustoz",
    monthlyFee: 250000,
    status: "Active",
    joinedDate: "2024-07-30",
    payments: createPayments({
      August: { status: "Paid", amountPaid: 94000, discount: 0, paymentDate: "2024-08-12", receiptNo: "LUM-804" },
      September: { status: "Paid", amountPaid: 119000, discount: 0, paymentDate: "2024-09-10", receiptNo: "LUM-903" },
    })
  },
  {
    id: "STU-08",
    fullName: "Habibullo",
    avatar: "",
    birthDate: "2007-12-01",
    gender: "Male",
    phone: "+998 99 400 00 00",
    email: "habibullo@lumos.uz",
    parentName: "Ota-onasi",
    parentPhone: "+998 99 400 00 00",
    groupId: "GRP-01",
    groupName: "Matematika (Hadicha ustoz)",
    teacherId: "TCH-01",
    teacherName: "Hadicha ustoz",
    monthlyFee: 250000,
    status: "Active",
    joinedDate: "2024-07-28",
    payments: createPayments({
      August: { status: "Paid", amountPaid: 92000, discount: 0, paymentDate: "2024-08-15", receiptNo: "LUM-805" },
      September: { status: "Paid", amountPaid: 108000, discount: 0, paymentDate: "2024-09-12", receiptNo: "LUM-904" },
    })
  },
  {
    id: "STU-09",
    fullName: "Zarina",
    avatar: "",
    birthDate: "2008-01-15",
    gender: "Female",
    phone: "+998 93 111 22 33",
    email: "zarina@lumos.uz",
    parentName: "Ota-onasi",
    parentPhone: "+998 93 111 22 33",
    groupId: "GRP-01",
    groupName: "Matematika (Hadicha ustoz)",
    teacherId: "TCH-01",
    teacherName: "Hadicha ustoz",
    monthlyFee: 250000,
    status: "Active",
    joinedDate: "2024-08-25",
    payments: createPayments({
      September: { status: "Paid", amountPaid: 200000, discount: 0, paymentDate: "2024-09-08", receiptNo: "LUM-905" },
    })
  },
  {
    id: "STU-10",
    fullName: "Shahrizoda",
    avatar: "",
    birthDate: "2009-06-30",
    gender: "Female",
    phone: "+998 99 300 00 00",
    email: "shahrizoda@lumos.uz",
    parentName: "Ota-onasi",
    parentPhone: "+998 99 300 00 00",
    groupId: "GRP-01",
    groupName: "Matematika (Hadicha ustoz)",
    teacherId: "TCH-01",
    teacherName: "Hadicha ustoz",
    monthlyFee: 250000,
    status: "Active",
    joinedDate: "2024-08-20",
    payments: createPayments({})
  },
  {
    id: "STU-11",
    fullName: "Murodbek",
    avatar: "",
    birthDate: "2007-05-14",
    gender: "Male",
    phone: "+998 33 797 14 17",
    email: "murodbek@lumos.uz",
    parentName: "Ota-onasi",
    parentPhone: "+998 33 797 14 17",
    groupId: "GRP-01",
    groupName: "Matematika (Hadicha ustoz)",
    teacherId: "TCH-01",
    teacherName: "Hadicha ustoz",
    monthlyFee: 250000,
    status: "Active",
    joinedDate: "2024-08-20",
    payments: createPayments({})
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: "EXP-01",
    title: "Hadicha ustoz maoshi (Avgust)",
    category: "Teacher Salaries",
    amount: 400000,
    date: "2024-08-10",
    paymentMethod: "Bank Transfer",
    requestedBy: "Super Admin",
    notes: "Avgust oyi matematikadan tushgan to‘lovlar ulushi"
  },
  {
    id: "EXP-02",
    title: "Hadicha ustoz maoshi (Sentabr)",
    category: "Teacher Salaries",
    amount: 380000,
    date: "2024-09-10",
    paymentMethod: "Bank Transfer",
    requestedBy: "Super Admin",
    notes: "Sentabr oyi matematikadan tushgan to‘lovlar ulushi"
  },
  {
    id: "EXP-03",
    title: "O‘quv xonasi ijarasi",
    category: "Rent",
    amount: 150000,
    date: "2024-09-01",
    paymentMethod: "Bank Transfer",
    requestedBy: "Super Admin",
    notes: "Oylik ijara xarajati"
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "NOTIF-01",
    title: "Yangi dars jadvali",
    message: "Hadicha ustozning matematika darsi soat 14:00 da boshlanadi.",
    time: "10 daqiqa oldin",
    read: false,
    type: "attendance"
  },
  {
    id: "NOTIF-02",
    title: "To‘lov qabul qilindi",
    message: "Azizbek sentabr oyi uchun 250,000 so‘m to‘lov qildi.",
    time: "1 soat oldin",
    read: true,
    type: "payment"
  }
];

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: "EVT-01",
    title: "Matematika (Hadicha ustoz)",
    date: new Date().toISOString().split('T')[0],
    time: "14:00 - 16:00",
    type: "event",
    description: "Matematika darsi"
  },
  {
    id: "EVT-02",
    title: "Ingliz tili (Malika ustoz)",
    date: new Date().toISOString().split('T')[0],
    time: "15:30 - 17:30",
    type: "event",
    description: "Ingliz tili darsi"
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = INITIAL_EVENTS;

export const generateInitialStudents = (): Student[] => INITIAL_STUDENTS;
