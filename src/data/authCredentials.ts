export interface UserCredential {
  id: string;
  role: 'admin' | 'teacher' | 'student';
  name: string;
  login: string; // email or username
  password: string;
  details: string;
  teacherId?: string;
  studentId?: string;
}

export const OFFICIAL_CREDENTIALS: UserCredential[] = [
  // ─────────────────────────────────────────────
  // 1. SUPER ADMIN CREDENTIALS
  // ─────────────────────────────────────────────
  {
    id: 'USR-ADMIN',
    role: 'admin',
    name: 'Mirjalol Ahmadov',
    login: 'Mirjalol',
    password: '25073',
    details: 'Super Admin / Boshqaruvchi (Tizimga 100% to‘liq huquq)',
  },

  // ─────────────────────────────────────────────
  // 2. TEACHERS (USTOZLAR) CREDENTIALS
  // ─────────────────────────────────────────────
  {
    id: 'TCH-101',
    role: 'teacher',
    name: 'Dr. Alexander Wright',
    login: 'wright@lumos.uz',
    password: 'teacher123',
    details: 'IELTS Academic Master & Intensive ustozi',
    teacherId: 'TCH-101',
  },
  {
    id: 'TCH-102',
    role: 'teacher',
    name: 'Elena Rostova',
    login: 'rostova@lumos.uz',
    password: 'teacher123',
    details: 'Mathematics, SAT & Calculus ustozi',
    teacherId: 'TCH-102',
  },
  {
    id: 'TCH-103',
    role: 'teacher',
    name: 'Marcus Vance',
    login: 'vance@lumos.uz',
    password: 'teacher123',
    details: 'Computer Science, Python & AI ustozi',
    teacherId: 'TCH-103',
  },
  {
    id: 'TCH-104',
    role: 'teacher',
    name: 'Sarah Jenkins',
    login: 'jenkins@lumos.uz',
    password: 'teacher123',
    details: 'General English & Kids Grammar ustozi',
    teacherId: 'TCH-104',
  },
  {
    id: 'TCH-105',
    role: 'teacher',
    name: 'David Chen',
    login: 'chen@lumos.uz',
    password: 'teacher123',
    details: 'AP Physics & Mechanics ustozi',
    teacherId: 'TCH-105',
  },
  {
    id: 'TCH-106',
    role: 'teacher',
    name: 'Olivia Taylor',
    login: 'taylor@lumos.uz',
    password: 'teacher123',
    details: 'Chemistry & Biology ustozi',
    teacherId: 'TCH-106',
  },
  {
    id: 'TCH-107',
    role: 'teacher',
    name: 'Lucas Silva',
    login: 'silva@lumos.uz',
    password: 'teacher123',
    details: 'Spanish & DELE Prep ustozi',
    teacherId: 'TCH-107',
  },
  {
    id: 'TCH-108',
    role: 'teacher',
    name: 'Amara Patel',
    login: 'patel@lumos.uz',
    password: 'teacher123',
    details: 'Digital Marketing & SMM ustozi',
    teacherId: 'TCH-108',
  },
  {
    id: 'TCH-DEFAULT',
    role: 'teacher',
    name: 'Dr. Alexander Wright (Demo Ustoz)',
    login: 'teacher@lumos.uz',
    password: 'teacher123',
    details: 'Tezkor o‘qituvchi logini',
    teacherId: 'TCH-101',
  },

  // ─────────────────────────────────────────────
  // 3. STUDENTS (TALABALAR) CREDENTIALS
  // ─────────────────────────────────────────────
  {
    id: 'STU-1001',
    role: 'student',
    name: 'Ethan Smith',
    login: 'ethan@lumos.uz',
    password: 'student123',
    details: 'IELTS Master 8.0+ guruhi o‘quvchisi (1-o‘rin)',
    studentId: 'STU-1001',
  },
  {
    id: 'STU-1002',
    role: 'student',
    name: 'Sophia Johnson',
    login: 'sophia@lumos.uz',
    password: 'student123',
    details: 'Python & GenAI guruhi o‘quvchisi',
    studentId: 'STU-1002',
  },
  {
    id: 'STU-1003',
    role: 'student',
    name: 'Liam Williams',
    login: 'liam@lumos.uz',
    password: 'student123',
    details: 'Digital SAT Math guruhi o‘quvchisi',
    studentId: 'STU-1003',
  },
  {
    id: 'STU-1004',
    role: 'student',
    name: 'Jasurbek Smith',
    login: 'jasurbek@lumos.uz',
    password: 'student123',
    details: 'IELTS Master guruhi o‘quvchisi',
    studentId: 'STU-1004',
  },
  {
    id: 'STU-1005',
    role: 'student',
    name: 'Malika Karimova',
    login: 'malika@lumos.uz',
    password: 'student123',
    details: 'Digital Marketing guruhi o‘quvchisi',
    studentId: 'STU-1005',
  },
  {
    id: 'STU-DEFAULT',
    role: 'student',
    name: 'Ethan Smith (Demo Talaba)',
    login: 'student@lumos.uz',
    password: 'student123',
    details: 'Tezkor o‘quvchi logini',
    studentId: 'STU-1001',
  },
];
