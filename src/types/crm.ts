export type PageType = 
  | 'dashboard'
  | 'students'
  | 'payments'
  | 'attendance'
  | 'teachers'
  | 'groups'
  | 'reports'
  | 'expenses'
  | 'settings';

export type StudentStatus = 'Active' | 'Graduated' | 'Frozen' | 'Trial' | 'Inactive';

export type PaymentStatus = 'Paid' | 'Unpaid' | 'Discount' | 'Frozen' | 'Overdue';

export type PaymentMethod = 'Card' | 'Cash' | 'Bank Transfer' | 'Payme / Click';

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export interface Student {
  id: string;
  fullName: string;
  avatar: string;
  birthDate: string; // YYYY-MM-DD
  gender: 'Male' | 'Female';
  phone: string;
  email: string;
  parentName: string;
  parentPhone: string;
  groupId: string;
  groupName: string;
  teacherId: string;
  teacherName: string;
  monthlyFee: number;
  status: StudentStatus;
  joinedDate: string;
  address?: string;
  notes?: string;
  // Payment matrix from August to July for the academic year
  payments: Record<string, {
    status: PaymentStatus;
    amountPaid: number;
    discount: number;
    paymentDate?: string;
    method?: PaymentMethod;
    receiptNo?: string;
  }>;
}

export interface Teacher {
  id: string;
  fullName: string;
  avatar: string;
  phone: string;
  email: string;
  subjects: string[];
  baseSalary: number;
  bonusPerStudent: number;
  groupsCount: number;
  studentsCount: number;
  joinedDate: string;
  rating: number;
  schedule: string;
  status: 'Active' | 'On Leave' | 'Inactive';
}

export interface Group {
  id: string;
  name: string;
  subject: string;
  level: string;
  teacherId: string;
  teacherName: string;
  scheduleDays: string; // e.g. "Mon, Wed, Fri"
  scheduleTime: string; // e.g. "15:00 - 17:00"
  room: string;
  monthlyFee: number;
  maxCapacity: number;
  currentStudentsCount: number;
  status: 'Active' | 'Enrolling' | 'Completed';
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  groupId: string;
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  note?: string;
}

export interface Expense {
  id: string;
  title: string;
  category: 'Rent' | 'Teacher Salaries' | 'Marketing' | 'Utilities & Software' | 'Equipment' | 'Events' | 'Other';
  amount: number;
  date: string;
  paymentMethod: string;
  requestedBy: string;
  notes?: string;
  receiptUrl?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'payment' | 'student' | 'birthday' | 'system' | 'attendance';
  read: boolean;
  linkTo?: { page: PageType; id?: string };
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'exam' | 'holiday' | 'event' | 'meeting' | 'birthday';
  time: string;
  description?: string;
}

export interface CenterSettings {
  centerName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  currency: string; // e.g., "$" or "UZS"
  currencySymbol: string;
  academicYear: string;
  language: 'en' | 'uz' | 'ru';
  theme: 'light' | 'dark' | 'system';
  enableSmsNotifications: boolean;
  autoRemindUnpaid: boolean;
  discountPolicyMax: number;
}
