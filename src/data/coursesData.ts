import { Course } from '../types/admin';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'CRS-01',
    title: 'Matematika (Hadicha ustoz)',
    category: 'Math & Science',
    level: 'Barcha sinflar & Abituriyentlar',
    durationMonths: 9,
    lessonsCount: 108,
    pricePerMonth: 250000,
    activeGroupsCount: 1,
    description: 'Matematika, mantiqiy fikrlash, DTM testlari va olimpiadalarga tayyorgarlik kursi.',
    syllabus: [
      'Sonlar nazariyasi, arifmetika va kasrlar',
      'Algebraik ifodalar, tenglamalar va tengsizliklar',
      'Funksiyalar, grafiklar va matnli masalalar',
      'Geometriya, planimetriya va stereometriya asoslari',
    ],
  },
  {
    id: 'CRS-02',
    title: 'Ingliz Tili (Malika ustoz)',
    category: 'Languages',
    level: 'Boshlang‘ich & O‘rta (General English)',
    durationMonths: 6,
    lessonsCount: 72,
    pricePerMonth: 250000,
    activeGroupsCount: 1,
    description: 'Ingliz tili grammatikasi, so‘z boyligi va erkin jonli so‘zlashuv kursi.',
    syllabus: [
      'Grammatika va jumlalar tuzish qoidalari',
      'Listening & Speaking amaliy mashg‘ulotlari',
      'Lug‘at boyligini oshirish va matnlar bilan ishlash',
      'Kundalik dialoglar va so‘zlashuv klublari',
    ],
  },
];
