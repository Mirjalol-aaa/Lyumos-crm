export interface UserCredential {
  id: string;
  role: 'admin' | 'teacher' | 'student';
  name: string;
  login: string; // email, username, or phone
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
    details: 'Super Admin / Markaz Rahbari (Tizimga 100% to‘liq huquq)',
  },
  {
    id: 'USR-ADMIN-EMAIL',
    role: 'admin',
    name: 'Mirjalol Ahmadov',
    login: 'admin@lumos.uz',
    password: '25073',
    details: 'Super Admin (Email orqali kirish)',
  },

  // ─────────────────────────────────────────────
  // 2. TEACHERS (USTOZLAR) CREDENTIALS
  // ─────────────────────────────────────────────
  {
    id: 'TCH-01',
    role: 'teacher',
    name: 'Hadicha ustoz',
    login: 'hadicha@lumos.uz',
    password: 'teacher123',
    details: 'Matematika ustozi',
    teacherId: 'TCH-01',
  },
  {
    id: 'TCH-01-USER',
    role: 'teacher',
    name: 'Hadicha ustoz',
    login: 'hadicha',
    password: 'teacher123',
    details: 'Matematika ustozi (login nomi orqali)',
    teacherId: 'TCH-01',
  },
  {
    id: 'TCH-02',
    role: 'teacher',
    name: 'Hasanboy ustoz',
    login: 'hasanboy@lumos.uz',
    password: 'teacher123',
    details: 'Ingliz tili ustozi',
    teacherId: 'TCH-02',
  },
  {
    id: 'TCH-02-USER',
    role: 'teacher',
    name: 'Hasanboy ustoz',
    login: 'hasanboy',
    password: 'teacher123',
    details: 'Ingliz tili ustozi (login nomi orqali)',
    teacherId: 'TCH-02',
  },
  {
    id: 'TCH-02-ALIAS',
    role: 'teacher',
    name: 'Hasanboy ustoz',
    login: 'malika',
    password: 'teacher123',
    details: 'Ingliz tili ustozi (zaxira login)',
    teacherId: 'TCH-02',
  },

  // ─────────────────────────────────────────────
  // 3. STUDENTS (O‘QUVCHILAR - HADICHA USTOZ EXCEL BAZASI)
  // ─────────────────────────────────────────────
  {
    id: 'STU-01',
    role: 'student',
    name: 'Mushtariy',
    login: '701195650',
    password: 'student123',
    details: 'Matematika o‘quvchisi (Mushtariy)',
    studentId: 'STU-01',
  },
  {
    id: 'STU-01-NAME',
    role: 'student',
    name: 'Mushtariy',
    login: 'mushtariy',
    password: 'student123',
    details: 'Matematika o‘quvchisi (Mushtariy)',
    studentId: 'STU-01',
  },
  {
    id: 'STU-02',
    role: 'student',
    name: 'Shahjahon',
    login: '975163630',
    password: 'student123',
    details: 'Matematika o‘quvchisi (Shahjahon)',
    studentId: 'STU-02',
  },
  {
    id: 'STU-02-NAME',
    role: 'student',
    name: 'Shahjahon',
    login: 'shahjahon',
    password: 'student123',
    details: 'Matematika o‘quvchisi (Shahjahon)',
    studentId: 'STU-02',
  },
  {
    id: 'STU-03',
    role: 'student',
    name: 'Munisa',
    login: '887071713',
    password: 'student123',
    details: 'Matematika o‘quvchisi (Munisa)',
    studentId: 'STU-03',
  },
  {
    id: 'STU-03-NAME',
    role: 'student',
    name: 'Munisa',
    login: 'munisa',
    password: 'student123',
    details: 'Matematika o‘quvchisi (Munisa)',
    studentId: 'STU-03',
  },
  {
    id: 'STU-04',
    role: 'student',
    name: 'Azizbek',
    login: 'azizbek',
    password: 'student123',
    details: 'Matematika o‘quvchisi (Azizbek)',
    studentId: 'STU-04',
  },
  {
    id: 'STU-04-ID',
    role: 'student',
    name: 'Azizbek',
    login: '25073',
    password: 'student123',
    details: 'Matematika o‘quvchisi (Azizbek - ID 25073)',
    studentId: 'STU-04',
  },
  {
    id: 'STU-05',
    role: 'student',
    name: 'Asaloy',
    login: 'asaloy',
    password: 'student123',
    details: 'Matematika o‘quvchisi (Asaloy)',
    studentId: 'STU-05',
  },
  {
    id: 'STU-06',
    role: 'student',
    name: 'Go‘zaloy',
    login: 'gozaloy',
    password: 'student123',
    details: 'Matematika o‘quvchisi (Go‘zaloy)',
    studentId: 'STU-06',
  },
  {
    id: 'STU-07',
    role: 'student',
    name: 'Quvonchoy',
    login: 'quvonchoy',
    password: 'student123',
    details: 'Matematika o‘quvchisi (Quvonchoy)',
    studentId: 'STU-07',
  },
  {
    id: 'STU-08',
    role: 'student',
    name: 'Habibullo',
    login: 'habibullo',
    password: 'student123',
    details: 'Matematika o‘quvchisi (Habibullo)',
    studentId: 'STU-08',
  },
  {
    id: 'STU-09',
    role: 'student',
    name: 'Zarina',
    login: 'zarina',
    password: 'student123',
    details: 'Matematika o‘quvchisi (Zarina)',
    studentId: 'STU-09',
  },
  {
    id: 'STU-10',
    role: 'student',
    name: 'Shahrizoda',
    login: 'shahrizoda',
    password: 'student123',
    details: 'Matematika o‘quvchisi (Shahrizoda)',
    studentId: 'STU-10',
  },
  {
    id: 'STU-11',
    role: 'student',
    name: 'Murodbek',
    login: '337971417',
    password: 'student123',
    details: 'Matematika o‘quvchisi (Murodbek)',
    studentId: 'STU-11',
  },
  {
    id: 'STU-11-NAME',
    role: 'student',
    name: 'Murodbek',
    login: 'murodbek',
    password: 'student123',
    details: 'Matematika o‘quvchisi (Murodbek)',
    studentId: 'STU-11',
  },
];
