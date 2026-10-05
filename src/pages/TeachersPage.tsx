import React, { useState, useMemo } from 'react';
import { useCRM } from '../context/CRMContext';
import { Teacher } from '../types/crm';
import {
  GraduationCap,
  Plus,
  Users,
  Layers,
  CalendarCheck,
  BookOpen,
  CheckCircle2,
  Search,
  RotateCcw,
  Calendar,
  ChevronDown,
  Check,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Building2,
  Clock,
  Sparkles,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  TrendingUp,
  MapPin,
  X,
  Award,
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { ActionDropdown } from '../components/ui/ActionDropdown';

// Extended Teacher Data Interface matching the reference specification
export interface ExtendedTeacher {
  id: string;
  fullName: string;
  subject: string;
  center: string;
  groupsCount: number;
  studentsCount: number;
  attendanceRate: number; // e.g. 96
  lessonsCount: number;
  experience: string; // e.g. "4 yil"
  status: 'Faol' | 'Faol emas';
  email: string;
  phone: string;
  baseSalary: number;
  avatar?: string;
  groupsList?: {
    groupName: string;
    studentsCount: number;
    attendanceRate: number;
    paymentRate: number;
    nextLesson: string;
  }[];
}

// Initial 28 realistic teachers matching all KPI numbers and prompt reference
const INITIAL_EXTENDED_TEACHERS: ExtendedTeacher[] = [
  {
    id: 'TCH-01',
    fullName: 'Diyorbek Rustamov',
    subject: 'Matematika',
    center: 'Lumos Xiva',
    groupsCount: 4,
    studentsCount: 112,
    attendanceRate: 96,
    lessonsCount: 48,
    experience: '4 yil',
    status: 'Faol',
    email: 'diyorbek@lumos.uz',
    phone: '+998 (90) 123-45-67',
    baseSalary: 4500000,
    groupsList: [
      { groupName: '5-A', studentsCount: 28, attendanceRate: 96, paymentRate: 94, nextLesson: 'Bugun 08:00' },
      { groupName: '6-A', studentsCount: 30, attendanceRate: 91, paymentRate: 89, nextLesson: 'Bugun 10:00' },
      { groupName: '7-B', studentsCount: 27, attendanceRate: 95, paymentRate: 97, nextLesson: 'Ertaga 09:00' },
      { groupName: '8-A', studentsCount: 27, attendanceRate: 94, paymentRate: 92, nextLesson: 'Ertaga 14:00' },
    ],
  },
  {
    id: 'TCH-02',
    fullName: 'Hasanboy Karimov',
    subject: 'Ingliz tili',
    center: 'Lumos Urganch',
    groupsCount: 3,
    studentsCount: 84,
    attendanceRate: 93,
    lessonsCount: 36,
    experience: '3 yil',
    status: 'Faol',
    email: 'hasanboy@lumos.uz',
    phone: '+998 (91) 234-56-78',
    baseSalary: 4200000,
    groupsList: [
      { groupName: 'IELTS-1', studentsCount: 28, attendanceRate: 93, paymentRate: 90, nextLesson: 'Bugun 10:00' },
      { groupName: 'General-B1', studentsCount: 28, attendanceRate: 94, paymentRate: 92, nextLesson: 'Bugun 14:00' },
      { groupName: 'Starter-A', studentsCount: 28, attendanceRate: 92, paymentRate: 88, nextLesson: 'Ertaga 11:00' },
    ],
  },
  {
    id: 'TCH-03',
    fullName: 'Hadicha Saidova',
    subject: 'Matematika',
    center: 'Lumos Toshkent',
    groupsCount: 5,
    studentsCount: 137,
    attendanceRate: 95,
    lessonsCount: 58,
    experience: '5 yil',
    status: 'Faol',
    email: 'hadicha@lumos.uz',
    phone: '+998 (93) 345-67-89',
    baseSalary: 5200000,
    groupsList: [
      { groupName: '6-B', studentsCount: 28, attendanceRate: 95, paymentRate: 94, nextLesson: 'Bugun 12:00' },
      { groupName: '7-A', studentsCount: 27, attendanceRate: 96, paymentRate: 95, nextLesson: 'Bugun 15:30' },
      { groupName: '8-B', studentsCount: 28, attendanceRate: 94, paymentRate: 93, nextLesson: 'Ertaga 08:30' },
      { groupName: '9-A', studentsCount: 27, attendanceRate: 95, paymentRate: 96, nextLesson: 'Ertaga 11:30' },
      { groupName: '10-A', studentsCount: 27, attendanceRate: 95, paymentRate: 91, nextLesson: 'Ertaga 16:00' },
    ],
  },
  {
    id: 'TCH-04',
    fullName: 'Mirjalol Ahmadov',
    subject: 'Matematika',
    center: 'Lumos Buxoro',
    groupsCount: 2,
    studentsCount: 54,
    attendanceRate: 90,
    lessonsCount: 22,
    experience: '3 yil',
    status: 'Faol',
    email: 'mirjalol@lumos.uz',
    phone: '+998 (94) 456-78-90',
    baseSalary: 3800000,
    groupsList: [
      { groupName: '5-B', studentsCount: 27, attendanceRate: 90, paymentRate: 88, nextLesson: 'Bugun 14:00' },
      { groupName: '6-C', studentsCount: 27, attendanceRate: 90, paymentRate: 89, nextLesson: 'Ertaga 10:00' },
    ],
  },
  {
    id: 'TCH-05',
    fullName: 'Sardor Olimov',
    subject: 'Ingliz tili',
    center: 'Lumos Urganch',
    groupsCount: 3,
    studentsCount: 76,
    attendanceRate: 88,
    lessonsCount: 34,
    experience: '2 yil',
    status: 'Faol',
    email: 'sardor@lumos.uz',
    phone: '+998 (90) 567-89-01',
    baseSalary: 3900000,
    groupsList: [
      { groupName: 'Elementary-1', studentsCount: 26, attendanceRate: 88, paymentRate: 86, nextLesson: 'Bugun 09:00' },
      { groupName: 'Beginner-2', studentsCount: 25, attendanceRate: 87, paymentRate: 85, nextLesson: 'Ertaga 14:00' },
      { groupName: 'Kids-3', studentsCount: 25, attendanceRate: 89, paymentRate: 88, nextLesson: 'Ertaga 16:30' },
    ],
  },
  {
    id: 'TCH-06',
    fullName: 'Nigora Axmedova',
    subject: 'Matematika',
    center: 'Lumos Xiva',
    groupsCount: 4,
    studentsCount: 101,
    attendanceRate: 94,
    lessonsCount: 47,
    experience: '4 yil',
    status: 'Faol',
    email: 'nigora@lumos.uz',
    phone: '+998 (99) 678-90-12',
    baseSalary: 4400000,
    groupsList: [
      { groupName: '5-C', studentsCount: 25, attendanceRate: 94, paymentRate: 93, nextLesson: 'Bugun 11:00' },
      { groupName: '6-D', studentsCount: 26, attendanceRate: 93, paymentRate: 90, nextLesson: 'Bugun 16:00' },
      { groupName: '7-C', studentsCount: 25, attendanceRate: 95, paymentRate: 94, nextLesson: 'Ertaga 09:30' },
      { groupName: '8-C', studentsCount: 25, attendanceRate: 94, paymentRate: 92, nextLesson: 'Ertaga 15:00' },
    ],
  },
  {
    id: 'TCH-07',
    fullName: 'Behzod Boymatov',
    subject: 'Ingliz tili',
    center: 'Lumos Toshkent',
    groupsCount: 2,
    studentsCount: 48,
    attendanceRate: 71,
    lessonsCount: 19,
    experience: '3 yil',
    status: 'Faol emas',
    email: 'behzod@lumos.uz',
    phone: '+998 (97) 789-01-23',
    baseSalary: 3500000,
    groupsList: [
      { groupName: 'General-A2', studentsCount: 24, attendanceRate: 72, paymentRate: 70, nextLesson: 'To‘xtatilgan' },
      { groupName: 'Pre-IELTS', studentsCount: 24, attendanceRate: 70, paymentRate: 68, nextLesson: 'To‘xtatilgan' },
    ],
  },
  {
    id: 'TCH-08',
    fullName: 'Zarina Abdullayeva',
    subject: 'Matematika',
    center: 'Lumos Buxoro',
    groupsCount: 5,
    studentsCount: 129,
    attendanceRate: 97,
    lessonsCount: 61,
    experience: '5 yil',
    status: 'Faol',
    email: 'zarina@lumos.uz',
    phone: '+998 (90) 890-12-34',
    baseSalary: 5500000,
    groupsList: [
      { groupName: 'Olimpiada-1', studentsCount: 26, attendanceRate: 98, paymentRate: 97, nextLesson: 'Bugun 08:30' },
      { groupName: 'Algebra-7', studentsCount: 26, attendanceRate: 96, paymentRate: 95, nextLesson: 'Bugun 11:30' },
      { groupName: 'Geometriya-8', studentsCount: 26, attendanceRate: 97, paymentRate: 96, nextLesson: 'Ertaga 09:00' },
      { groupName: 'Intensiv-9', studentsCount: 26, attendanceRate: 97, paymentRate: 96, nextLesson: 'Ertaga 13:00' },
      { groupName: 'Abituriyent-10', studentsCount: 25, attendanceRate: 97, paymentRate: 95, nextLesson: 'Ertaga 16:30' },
    ],
  },
  {
    id: 'TCH-09',
    fullName: 'Anvar Qodirov',
    subject: 'Fizika',
    center: 'Lumos Toshkent',
    groupsCount: 4,
    studentsCount: 92,
    attendanceRate: 91,
    lessonsCount: 42,
    experience: '5 yil',
    status: 'Faol',
    email: 'anvar@lumos.uz',
    phone: '+998 (93) 111-22-33',
    baseSalary: 4600000,
    groupsList: [
      { groupName: 'Fizika-7', studentsCount: 23, attendanceRate: 92, paymentRate: 90, nextLesson: 'Bugun 14:00' },
      { groupName: 'Fizika-8', studentsCount: 23, attendanceRate: 91, paymentRate: 89, nextLesson: 'Ertaga 10:00' },
      { groupName: 'Fizika-9', studentsCount: 23, attendanceRate: 90, paymentRate: 91, nextLesson: 'Ertaga 15:00' },
      { groupName: 'Fizika-10', studentsCount: 23, attendanceRate: 91, paymentRate: 92, nextLesson: 'Juma 11:00' },
    ],
  },
  {
    id: 'TCH-10',
    fullName: 'Malika Rahimova',
    subject: 'Ona tili',
    center: 'Lumos Urganch',
    groupsCount: 3,
    studentsCount: 70,
    attendanceRate: 94,
    lessonsCount: 32,
    experience: '4 yil',
    status: 'Faol',
    email: 'malika@lumos.uz',
    phone: '+998 (91) 444-55-66',
    baseSalary: 4100000,
    groupsList: [
      { groupName: 'OnaTili-5', studentsCount: 24, attendanceRate: 95, paymentRate: 93, nextLesson: 'Bugun 09:30' },
      { groupName: 'Adabiyot-6', studentsCount: 23, attendanceRate: 94, paymentRate: 91, nextLesson: 'Ertaga 11:00' },
      { groupName: 'Grammatika-7', studentsCount: 23, attendanceRate: 93, paymentRate: 94, nextLesson: 'Ertaga 14:30' },
    ],
  },
  {
    id: 'TCH-11',
    fullName: 'Dilshod Yusupov',
    subject: 'IT / Dasturlash',
    center: 'Lumos Toshkent',
    groupsCount: 4,
    studentsCount: 88,
    attendanceRate: 96,
    lessonsCount: 45,
    experience: '3 yil',
    status: 'Faol',
    email: 'dilshod@lumos.uz',
    phone: '+998 (90) 333-77-88',
    baseSalary: 5800000,
    groupsList: [
      { groupName: 'Frontend-1', studentsCount: 22, attendanceRate: 97, paymentRate: 96, nextLesson: 'Bugun 16:00' },
      { groupName: 'Python-Kids', studentsCount: 22, attendanceRate: 96, paymentRate: 95, nextLesson: 'Bugun 18:00' },
      { groupName: 'FullStack-2', studentsCount: 22, attendanceRate: 95, paymentRate: 94, nextLesson: 'Ertaga 16:00' },
      { groupName: 'WebDev-3', studentsCount: 22, attendanceRate: 96, paymentRate: 96, nextLesson: 'Ertaga 18:00' },
    ],
  },
  {
    id: 'TCH-12',
    fullName: 'Shahnoza Karimova',
    subject: 'Ingliz tili',
    center: 'Lumos Xiva',
    groupsCount: 3,
    studentsCount: 65,
    attendanceRate: 89,
    lessonsCount: 28,
    experience: '2 yil',
    status: 'Faol',
    email: 'shahnoza@lumos.uz',
    phone: '+998 (99) 222-33-44',
    baseSalary: 3800000,
    groupsList: [
      { groupName: 'General-B2', studentsCount: 22, attendanceRate: 90, paymentRate: 88, nextLesson: 'Bugun 10:30' },
      { groupName: 'Spoken-1', studentsCount: 22, attendanceRate: 89, paymentRate: 87, nextLesson: 'Ertaga 12:00' },
      { groupName: 'Teens-A', studentsCount: 21, attendanceRate: 88, paymentRate: 86, nextLesson: 'Ertaga 15:30' },
    ],
  },
  {
    id: 'TCH-13',
    fullName: 'Otabek Jo‘rayev',
    subject: 'Matematika',
    center: 'Lumos Urganch',
    groupsCount: 4,
    studentsCount: 98,
    attendanceRate: 93,
    lessonsCount: 40,
    experience: '4 yil',
    status: 'Faol',
    email: 'otabek@lumos.uz',
    phone: '+998 (91) 555-88-99',
    baseSalary: 4600000,
    groupsList: [
      { groupName: 'Matem-Abitur', studentsCount: 25, attendanceRate: 94, paymentRate: 93, nextLesson: 'Bugun 08:00' },
      { groupName: 'Matem-7A', studentsCount: 25, attendanceRate: 93, paymentRate: 91, nextLesson: 'Bugun 13:00' },
      { groupName: 'Matem-8B', studentsCount: 24, attendanceRate: 92, paymentRate: 90, nextLesson: 'Ertaga 08:00' },
      { groupName: 'Matem-6A', studentsCount: 24, attendanceRate: 93, paymentRate: 92, nextLesson: 'Ertaga 14:00' },
    ],
  },
  {
    id: 'TCH-14',
    fullName: 'Gulchehra Ismoilova',
    subject: 'Ona tili',
    center: 'Lumos Buxoro',
    groupsCount: 2,
    studentsCount: 42,
    attendanceRate: 90,
    lessonsCount: 20,
    experience: '3 yil',
    status: 'Faol',
    email: 'gulchehra@lumos.uz',
    phone: '+998 (94) 777-11-22',
    baseSalary: 3700000,
    groupsList: [
      { groupName: 'Grammar-Uz', studentsCount: 21, attendanceRate: 90, paymentRate: 89, nextLesson: 'Bugun 11:00' },
      { groupName: 'Insho-Tayyorlov', studentsCount: 21, attendanceRate: 90, paymentRate: 88, nextLesson: 'Ertaga 11:00' },
    ],
  },
  {
    id: 'TCH-15',
    fullName: 'Jasur Bekchanov',
    subject: 'Fizika',
    center: 'Lumos Xiva',
    groupsCount: 3,
    studentsCount: 68,
    attendanceRate: 92,
    lessonsCount: 33,
    experience: '4 yil',
    status: 'Faol',
    email: 'jasur@lumos.uz',
    phone: '+998 (99) 888-22-33',
    baseSalary: 4300000,
    groupsList: [
      { groupName: 'Fizika-Xiva1', studentsCount: 23, attendanceRate: 92, paymentRate: 90, nextLesson: 'Bugun 15:00' },
      { groupName: 'Fizika-Xiva2', studentsCount: 23, attendanceRate: 93, paymentRate: 92, nextLesson: 'Ertaga 10:00' },
      { groupName: 'Fizika-Xiva3', studentsCount: 22, attendanceRate: 91, paymentRate: 89, nextLesson: 'Ertaga 16:00' },
    ],
  },
  {
    id: 'TCH-16',
    fullName: 'Rayhona Odilova',
    subject: 'Ingliz tili',
    center: 'Lumos Buxoro',
    groupsCount: 4,
    studentsCount: 95,
    attendanceRate: 95,
    lessonsCount: 44,
    experience: '5 yil',
    status: 'Faol',
    email: 'rayhona@lumos.uz',
    phone: '+998 (90) 444-99-00',
    baseSalary: 4800000,
    groupsList: [
      { groupName: 'IELTS-Advanced', studentsCount: 24, attendanceRate: 96, paymentRate: 95, nextLesson: 'Bugun 09:00' },
      { groupName: 'Upper-Inter', studentsCount: 24, attendanceRate: 95, paymentRate: 94, nextLesson: 'Bugun 13:30' },
      { groupName: 'Speaking-Club', studentsCount: 24, attendanceRate: 95, paymentRate: 93, nextLesson: 'Ertaga 09:00' },
      { groupName: 'CEFR-B2', studentsCount: 23, attendanceRate: 94, paymentRate: 92, nextLesson: 'Ertaga 14:00' },
    ],
  },
  {
    id: 'TCH-17',
    fullName: 'Bobur Mirzayev',
    subject: 'IT / Dasturlash',
    center: 'Lumos Urganch',
    groupsCount: 3,
    studentsCount: 62,
    attendanceRate: 92,
    lessonsCount: 31,
    experience: '2 yil',
    status: 'Faol',
    email: 'bobur@lumos.uz',
    phone: '+998 (91) 999-11-22',
    baseSalary: 4500000,
    groupsList: [
      { groupName: 'React-Urganch', studentsCount: 21, attendanceRate: 93, paymentRate: 91, nextLesson: 'Bugun 15:00' },
      { groupName: 'JS-Basics', studentsCount: 21, attendanceRate: 92, paymentRate: 90, nextLesson: 'Bugun 17:00' },
      { groupName: 'HTML-CSS-Fund', studentsCount: 20, attendanceRate: 91, paymentRate: 88, nextLesson: 'Ertaga 17:00' },
    ],
  },
  {
    id: 'TCH-18',
    fullName: 'Feruza Toirova',
    subject: 'Matematika',
    center: 'Lumos Toshkent',
    groupsCount: 3,
    studentsCount: 74,
    attendanceRate: 89,
    lessonsCount: 35,
    experience: '3 yil',
    status: 'Faol',
    email: 'feruza@lumos.uz',
    phone: '+998 (93) 888-33-44',
    baseSalary: 4100000,
    groupsList: [
      { groupName: 'Matem-Tosh5', studentsCount: 25, attendanceRate: 90, paymentRate: 89, nextLesson: 'Bugun 10:00' },
      { groupName: 'Matem-Tosh6', studentsCount: 25, attendanceRate: 89, paymentRate: 88, nextLesson: 'Bugun 14:00' },
      { groupName: 'Matem-Tosh7', studentsCount: 24, attendanceRate: 88, paymentRate: 87, nextLesson: 'Ertaga 10:00' },
    ],
  },
  {
    id: 'TCH-19',
    fullName: 'Elyor Hakimov',
    subject: 'Fizika',
    center: 'Lumos Urganch',
    groupsCount: 2,
    studentsCount: 46,
    attendanceRate: 87,
    lessonsCount: 21,
    experience: '2 yil',
    status: 'Faol',
    email: 'elyor@lumos.uz',
    phone: '+998 (91) 333-22-11',
    baseSalary: 3700000,
    groupsList: [
      { groupName: 'Fizika-Urg1', studentsCount: 23, attendanceRate: 88, paymentRate: 86, nextLesson: 'Bugun 16:30' },
      { groupName: 'Fizika-Urg2', studentsCount: 23, attendanceRate: 86, paymentRate: 85, nextLesson: 'Ertaga 16:30' },
    ],
  },
  {
    id: 'TCH-20',
    fullName: 'Umida Sobirova',
    subject: 'Ingliz tili',
    center: 'Lumos Xiva',
    groupsCount: 4,
    studentsCount: 89,
    attendanceRate: 93,
    lessonsCount: 41,
    experience: '4 yil',
    status: 'Faol',
    email: 'umida@lumos.uz',
    phone: '+998 (99) 777-66-55',
    baseSalary: 4500000,
    groupsList: [
      { groupName: 'Pre-Inter-X1', studentsCount: 23, attendanceRate: 94, paymentRate: 92, nextLesson: 'Bugun 11:30' },
      { groupName: 'Inter-X2', studentsCount: 22, attendanceRate: 93, paymentRate: 91, nextLesson: 'Bugun 14:30' },
      { groupName: 'General-X3', studentsCount: 22, attendanceRate: 92, paymentRate: 90, nextLesson: 'Ertaga 11:30' },
      { groupName: 'Kids-X4', studentsCount: 22, attendanceRate: 93, paymentRate: 91, nextLesson: 'Ertaga 14:30' },
    ],
  },
  {
    id: 'TCH-21',
    fullName: 'Farrux Ergashev',
    subject: 'Matematika',
    center: 'Lumos Buxoro',
    groupsCount: 3,
    studentsCount: 69,
    attendanceRate: 91,
    lessonsCount: 30,
    experience: '3 yil',
    status: 'Faol',
    email: 'farrux@lumos.uz',
    phone: '+998 (90) 666-55-44',
    baseSalary: 4200000,
    groupsList: [
      { groupName: 'Matem-Bux1', studentsCount: 23, attendanceRate: 92, paymentRate: 90, nextLesson: 'Bugun 09:30' },
      { groupName: 'Matem-Bux2', studentsCount: 23, attendanceRate: 91, paymentRate: 89, nextLesson: 'Ertaga 11:00' },
      { groupName: 'Matem-Bux3', studentsCount: 23, attendanceRate: 90, paymentRate: 88, nextLesson: 'Juma 14:00' },
    ],
  },
  {
    id: 'TCH-22',
    fullName: 'Kamola Vohidova',
    subject: 'Ona tili',
    center: 'Lumos Toshkent',
    groupsCount: 3,
    studentsCount: 72,
    attendanceRate: 95,
    lessonsCount: 34,
    experience: '4 yil',
    status: 'Faol',
    email: 'kamola@lumos.uz',
    phone: '+998 (93) 222-77-88',
    baseSalary: 4400000,
    groupsList: [
      { groupName: 'OnaTili-Tosh1', studentsCount: 24, attendanceRate: 96, paymentRate: 94, nextLesson: 'Bugun 13:00' },
      { groupName: 'OnaTili-Tosh2', studentsCount: 24, attendanceRate: 95, paymentRate: 93, nextLesson: 'Ertaga 09:00' },
      { groupName: 'OnaTili-Tosh3', studentsCount: 24, attendanceRate: 94, paymentRate: 92, nextLesson: 'Ertaga 15:00' },
    ],
  },
  {
    id: 'TCH-23',
    fullName: 'Rustam Sharipov',
    subject: 'IT / Dasturlash',
    center: 'Lumos Xiva',
    groupsCount: 2,
    studentsCount: 50,
    attendanceRate: 94,
    lessonsCount: 24,
    experience: '3 yil',
    status: 'Faol',
    email: 'rustam@lumos.uz',
    phone: '+998 (99) 333-11-00',
    baseSalary: 4700000,
    groupsList: [
      { groupName: 'Web-Xiva1', studentsCount: 25, attendanceRate: 95, paymentRate: 93, nextLesson: 'Bugun 16:30' },
      { groupName: 'Web-Xiva2', studentsCount: 25, attendanceRate: 93, paymentRate: 92, nextLesson: 'Ertaga 16:30' },
    ],
  },
  {
    id: 'TCH-24',
    fullName: 'Munira Xoliqova',
    subject: 'Ingliz tili',
    center: 'Lumos Urganch',
    groupsCount: 3,
    studentsCount: 78,
    attendanceRate: 90,
    lessonsCount: 36,
    experience: '3 yil',
    status: 'Faol',
    email: 'munira@lumos.uz',
    phone: '+998 (91) 777-44-33',
    baseSalary: 4100000,
    groupsList: [
      { groupName: 'Kids-Urg1', studentsCount: 26, attendanceRate: 91, paymentRate: 89, nextLesson: 'Bugun 09:00' },
      { groupName: 'Kids-Urg2', studentsCount: 26, attendanceRate: 90, paymentRate: 88, nextLesson: 'Bugun 14:00' },
      { groupName: 'Kids-Urg3', studentsCount: 26, attendanceRate: 89, paymentRate: 87, nextLesson: 'Ertaga 09:00' },
    ],
  },
  {
    id: 'TCH-25',
    fullName: 'Alisher Normatov',
    subject: 'Fizika',
    center: 'Lumos Buxoro',
    groupsCount: 2,
    studentsCount: 40,
    attendanceRate: 86,
    lessonsCount: 18,
    experience: '2 yil',
    status: 'Faol',
    email: 'alisher@lumos.uz',
    phone: '+998 (90) 222-11-99',
    baseSalary: 3600000,
    groupsList: [
      { groupName: 'Fizika-Bux1', studentsCount: 20, attendanceRate: 87, paymentRate: 85, nextLesson: 'Bugun 15:30' },
      { groupName: 'Fizika-Bux2', studentsCount: 20, attendanceRate: 85, paymentRate: 84, nextLesson: 'Ertaga 15:30' },
    ],
  },
  {
    id: 'TCH-26',
    fullName: 'Nilufar Qosimova',
    subject: 'Matematika',
    center: 'Lumos Xiva',
    groupsCount: 4,
    studentsCount: 86,
    attendanceRate: 92,
    lessonsCount: 39,
    experience: '3 yil',
    status: 'Faol',
    email: 'nilufar@lumos.uz',
    phone: '+998 (99) 111-99-88',
    baseSalary: 4300000,
    groupsList: [
      { groupName: 'Matem-Xiva1', studentsCount: 22, attendanceRate: 93, paymentRate: 91, nextLesson: 'Bugun 10:00' },
      { groupName: 'Matem-Xiva2', studentsCount: 22, attendanceRate: 92, paymentRate: 90, nextLesson: 'Bugun 15:00' },
      { groupName: 'Matem-Xiva3', studentsCount: 21, attendanceRate: 91, paymentRate: 89, nextLesson: 'Ertaga 10:00' },
      { groupName: 'Matem-Xiva4', studentsCount: 21, attendanceRate: 92, paymentRate: 90, nextLesson: 'Ertaga 15:00' },
    ],
  },
  {
    id: 'TCH-27',
    fullName: 'Timur Boboyev',
    subject: 'IT / Dasturlash',
    center: 'Lumos Buxoro',
    groupsCount: 2,
    studentsCount: 44,
    attendanceRate: 88,
    lessonsCount: 22,
    experience: '2 yil',
    status: 'Faol',
    email: 'timur@lumos.uz',
    phone: '+998 (94) 555-44-33',
    baseSalary: 4600000,
    groupsList: [
      { groupName: 'Scratch-Kids', studentsCount: 22, attendanceRate: 89, paymentRate: 87, nextLesson: 'Bugun 16:00' },
      { groupName: 'Python-Bux1', studentsCount: 22, attendanceRate: 87, paymentRate: 86, nextLesson: 'Ertaga 16:00' },
    ],
  },
  {
    id: 'TCH-28',
    fullName: 'Mohira Saidova',
    subject: 'Ona tili',
    center: 'Lumos Xiva',
    groupsCount: 2,
    studentsCount: 38,
    attendanceRate: 93,
    lessonsCount: 19,
    experience: '3 yil',
    status: 'Faol',
    email: 'mohira@lumos.uz',
    phone: '+998 (99) 555-11-22',
    baseSalary: 3800000,
    groupsList: [
      { groupName: 'OnaTili-Xiva1', studentsCount: 19, attendanceRate: 94, paymentRate: 92, nextLesson: 'Bugun 11:00' },
      { groupName: 'OnaTili-Xiva2', studentsCount: 19, attendanceRate: 92, paymentRate: 91, nextLesson: 'Ertaga 11:00' },
    ],
  },
];

export const TeachersPage: React.FC = () => {
  const { addTeacher, deleteTeacher: deleteTeacherFromCRM } = useCRM();

  // State
  const [teachersList, setTeachersList] = useState<ExtendedTeacher[]>(INITIAL_EXTENDED_TEACHERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCenter, setSelectedCenter] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('So\'nggi 1 oy');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  // Sorting
  const [sortField, setSortField] = useState<keyof ExtendedTeacher>('attendanceRate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<ExtendedTeacher | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<ExtendedTeacher | null>(null);
  const [deletingTeacherId, setDeletingTeacherId] = useState<string | null>(null);

  // Form State for Add
  const [addForm, setAddForm] = useState({
    fullName: '',
    subject: 'Matematika',
    center: 'Lumos Xiva',
    experience: '3 yil',
    email: '',
    phone: '+998',
    baseSalary: 4000000,
    status: 'Faol' as 'Faol' | 'Faol emas',
  });

  // Filtered & Sorted Data
  const filteredTeachers = useMemo(() => {
    return teachersList.filter((teacher) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = teacher.fullName.toLowerCase().includes(query);
        const matchesEmail = teacher.email.toLowerCase().includes(query);
        const matchesSubject = teacher.subject.toLowerCase().includes(query);
        const matchesCenter = teacher.center.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesSubject && !matchesCenter) return false;
      }

      // Center
      if (selectedCenter !== 'all' && teacher.center !== selectedCenter) {
        return false;
      }

      // Subject
      if (selectedSubject !== 'all' && teacher.subject !== selectedSubject) {
        return false;
      }

      // Status
      if (selectedStatus !== 'all' && teacher.status !== selectedStatus) {
        return false;
      }

      // Experience
      if (selectedExperience !== 'all') {
        const years = parseInt(teacher.experience, 10) || 0;
        if (selectedExperience === '1-2' && (years < 1 || years > 2)) return false;
        if (selectedExperience === '3-4' && (years < 3 || years > 4)) return false;
        if (selectedExperience === '5+' && years < 5) return false;
      }

      return true;
    });
  }, [teachersList, searchQuery, selectedCenter, selectedSubject, selectedStatus, selectedExperience]);

  const sortedTeachers = useMemo(() => {
    return [...filteredTeachers].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      return 0;
    });
  }, [filteredTeachers, sortField, sortDirection]);

  // Paginated Teachers
  const totalPages = Math.ceil(sortedTeachers.length / pageSize) || 1;
  const paginatedTeachers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedTeachers.slice(start, start + pageSize);
  }, [sortedTeachers, currentPage, pageSize]);

  const handleSort = (field: keyof ExtendedTeacher) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCenter('all');
    setSelectedSubject('all');
    setSelectedStatus('all');
    setSelectedExperience('all');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedCenter !== 'all' ||
    selectedSubject !== 'all' ||
    selectedStatus !== 'all' ||
    selectedExperience !== 'all';

  // Add Handler
  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.fullName.trim() || !addForm.email.trim()) return;

    const newId = `TCH-${String(teachersList.length + 1).padStart(2, '0')}`;
    const newTeacher: ExtendedTeacher = {
      id: newId,
      fullName: addForm.fullName.trim(),
      subject: addForm.subject,
      center: addForm.center,
      groupsCount: 2,
      studentsCount: 45,
      attendanceRate: 94,
      lessonsCount: 16,
      experience: addForm.experience,
      status: addForm.status,
      email: addForm.email.trim().toLowerCase(),
      phone: addForm.phone.trim(),
      baseSalary: Number(addForm.baseSalary) || 4000000,
      groupsList: [
        { groupName: 'Guruh-1', studentsCount: 23, attendanceRate: 95, paymentRate: 93, nextLesson: 'Bugun 10:00' },
        { groupName: 'Guruh-2', studentsCount: 22, attendanceRate: 93, paymentRate: 91, nextLesson: 'Ertaga 14:00' },
      ],
    };

    setTeachersList((prev) => [newTeacher, ...prev]);

    // sync to CRM Context if possible
    try {
      addTeacher({
        fullName: newTeacher.fullName,
        email: newTeacher.email,
        phone: newTeacher.phone,
        subjects: [newTeacher.subject],
        baseSalary: newTeacher.baseSalary,
        bonusPerStudent: 15000,
        status: newTeacher.status === 'Faol' ? 'Active' : 'Inactive',
        avatar: '',
        joinedDate: new Date().toISOString().split('T')[0],
        schedule: 'Dushanba, Chorshanba, Juma (14:00 - 16:00)',
      });
    } catch (err) {
      // safe fallback
    }

    setIsAddModalOpen(false);
    setAddForm({
      fullName: '',
      subject: 'Matematika',
      center: 'Lumos Xiva',
      experience: '3 yil',
      email: '',
      phone: '+998',
      baseSalary: 4000000,
      status: 'Faol',
    });
  };

  // Edit Handler
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;

    setTeachersList((prev) =>
      prev.map((t) => (t.id === editingTeacher.id ? editingTeacher : t))
    );
    setEditingTeacher(null);
  };

  // Delete Handler
  const handleConfirmDelete = () => {
    if (deletingTeacherId) {
      setTeachersList((prev) => prev.filter((t) => t.id !== deletingTeacherId));
      try {
        deleteTeacherFromCRM(deletingTeacherId);
      } catch (err) {
        // safe fallback
      }
      setDeletingTeacherId(null);
    }
  };

  // Helpers for Badges
  const renderSubjectBadge = (subject: string) => {
    if (subject === 'Matematika') {
      return (
        <span className="inline-flex items-center rounded-lg bg-[#F7E9ED] border border-[#6F1028]/20 px-2.5 py-1 text-xs font-bold text-[#6F1028]">
          {subject}
        </span>
      );
    }
    if (subject === 'Ingliz tili') {
      return (
        <span className="inline-flex items-center rounded-lg bg-[#F7F0E2] border border-[#C89B3C]/30 px-2.5 py-1 text-xs font-bold text-[#8A641C]">
          {subject}
        </span>
      );
    }
    if (subject === 'Fizika') {
      return (
        <span className="inline-flex items-center rounded-lg bg-[#EEF2F6] border border-[#BAC7D5] px-2.5 py-1 text-xs font-bold text-[#2A4365]">
          {subject}
        </span>
      );
    }
    if (subject === 'IT / Dasturlash') {
      return (
        <span className="inline-flex items-center rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] px-2.5 py-1 text-xs font-bold text-[#166534]">
          {subject}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-lg bg-[#F2F4F7] border border-[#E7E1D8] px-2.5 py-1 text-xs font-bold text-[#667085]">
        {subject}
      </span>
    );
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 min-h-screen bg-[#F8F6F2]">
      {/* ========================================================================= */}
      {/* 1. PAGE HEADER                                                            */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            O‘qituvchilar
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] mt-1 font-medium">
            Markazlardagi barcha o‘qituvchilar ro‘yxati
          </p>
        </div>

        {/* Right Action Controls: Date Range Selector + Primary Burgundy Button */}
        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          {/* Date Range Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
              className="inline-flex items-center gap-2.5 rounded-xl border border-[#E7E1D8] bg-[#FFFFFF] px-3.5 py-2 text-xs font-bold text-[#1F2937] shadow-xs hover:border-[#6F1028]/30 hover:bg-[#FCF8F5] transition-all cursor-pointer"
            >
              <Calendar className="h-4 w-4 text-[#6F1028]" />
              <div className="text-left">
                <span className="block leading-tight font-extrabold text-[#1F2937]">
                  1-Sentabr, 2026 – 30-Sentabr, 2026
                </span>
                <span className="text-[10px] font-medium text-[#667085]">
                  {dateRangeFilter}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-[#667085] ml-1" />
            </button>

            {isDateDropdownOpen && (
              <div className="absolute right-0 top-full z-40 mt-1.5 w-52 rounded-xl border border-[#E7E1D8] bg-[#FFFFFF] p-1.5 shadow-xl shadow-black/5">
                {[
                  { id: 'Bugun', label: 'Bugun' },
                  { id: 'So‘nggi 7 kun', label: 'So‘nggi 7 kun' },
                  { id: 'So\'nggi 1 oy', label: 'So‘nggi 1 oy (Joriy)' },
                  { id: 'Joriy chorak', label: 'Joriy chorak' },
                  { id: 'Yillik hisobot', label: 'Butun o‘quv yili' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setDateRangeFilter(item.id);
                      setIsDateDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                      dateRangeFilter === item.id
                        ? 'bg-[#F7E9ED] text-[#6F1028] font-bold'
                        : 'text-[#1F2937] hover:bg-[#FCF8F5]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {dateRangeFilter === item.id && <Check className="h-3.5 w-3.5 text-[#6F1028]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* "+ O‘qituvchi qo‘shish" Button */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6F1028] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#4A0B1B] transition-all cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            + O‘qituvchi qo‘shish
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. EXACT 6 COMPACT KPI CARDS ROW                                          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
        {/* KPI 1: 28 Jami o‘qituvchi */}
        <div className="rounded-xl border border-[#E7E1D8] bg-[#FFFFFF] p-3.5 sm:p-4 shadow-2xs hover:border-[#6F1028]/25 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7E9ED] text-[#6F1028]">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold text-[#16A36A] flex items-center gap-0.5">
              ↑ +4%
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#1F2937] leading-tight">
            28
          </p>
          <p className="text-xs font-medium text-[#667085] mt-0.5">
            Jami o‘qituvchi
          </p>
          <p className="text-[10px] text-[#98A2B3] mt-1 truncate">
            Barcha markazlar faol
          </p>
        </div>

        {/* KPI 2: 52 Jami guruh */}
        <div className="rounded-xl border border-[#E7E1D8] bg-[#FFFFFF] p-3.5 sm:p-4 shadow-2xs hover:border-[#6F1028]/25 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7F0E2] text-[#8A641C]">
              <Layers className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold text-[#16A36A] flex items-center gap-0.5">
              ↑ +8%
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#1F2937] leading-tight">
            52
          </p>
          <p className="text-xs font-medium text-[#667085] mt-0.5">
            Jami guruh
          </p>
          <p className="text-[10px] text-[#98A2B3] mt-1 truncate">
            Faol guruhlar
          </p>
        </div>

        {/* KPI 3: 684 Jami o‘quvchi */}
        <div className="rounded-xl border border-[#E7E1D8] bg-[#FFFFFF] p-3.5 sm:p-4 shadow-2xs hover:border-[#6F1028]/25 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7E9ED] text-[#6F1028]">
              <Users className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold text-[#16A36A] flex items-center gap-0.5">
              ↑ +12%
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#1F2937] leading-tight">
            684
          </p>
          <p className="text-xs font-medium text-[#667085] mt-0.5">
            Jami o‘quvchi
          </p>
          <p className="text-[10px] text-[#98A2B3] mt-1 truncate">
            O‘tgan oydan ko‘proq
          </p>
        </div>

        {/* KPI 4: 91.8% O‘rtacha davomat */}
        <div className="rounded-xl border border-[#E7E1D8] bg-[#FFFFFF] p-3.5 sm:p-4 shadow-2xs hover:border-[#6F1028]/25 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8F7F0] text-[#16A36A]">
              <CalendarCheck className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold text-[#16A36A] flex items-center gap-0.5">
              ↑ +2.4%
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#1F2937] leading-tight">
            91.8%
          </p>
          <p className="text-xs font-medium text-[#667085] mt-0.5">
            O‘rtacha davomat
          </p>
          <p className="text-[10px] text-[#98A2B3] mt-1 truncate">
            O‘tgan oydan yuqori
          </p>
        </div>

        {/* KPI 5: 1 248 O‘tilgan dars */}
        <div className="rounded-xl border border-[#E7E1D8] bg-[#FFFFFF] p-3.5 sm:p-4 shadow-2xs hover:border-[#6F1028]/25 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7E9ED] text-[#6F1028]">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold text-[#16A36A] flex items-center gap-0.5">
              ↑ +15%
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#1F2937] leading-tight">
            1 248
          </p>
          <p className="text-xs font-medium text-[#667085] mt-0.5">
            O‘tilgan dars
          </p>
          <p className="text-[10px] text-[#98A2B3] mt-1 truncate">
            Reja bo‘yicha
          </p>
        </div>

        {/* KPI 6: 96.5% Faol o‘qituvchilar */}
        <div className="rounded-xl border border-[#E7E1D8] bg-[#FFFFFF] p-3.5 sm:p-4 shadow-2xs hover:border-[#6F1028]/25 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8F7F0] text-[#16A36A]">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold text-[#16A36A] flex items-center gap-0.5">
              ↑ +1.5%
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#1F2937] leading-tight">
            96.5%
          </p>
          <p className="text-xs font-medium text-[#667085] mt-0.5">
            Faol o‘qituvchilar
          </p>
          <p className="text-[10px] text-[#98A2B3] mt-1 truncate">
            Yuqori ko‘rsatkich
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SEARCH + COMPACT FILTER BAR CONTAINER                                  */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-[#E7E1D8] bg-[#FFFFFF] p-3.5 sm:p-4 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#667085]" />
          <input
            type="text"
            placeholder="F.I.O yoki email bo‘yicha qidiring..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-xl border border-[#E7E1D8] bg-[#F8F6F2]/40 py-2 pl-10 pr-4 text-xs text-[#1F2937] placeholder-[#98A2B3] focus:border-[#6F1028] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#6F1028] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#1F2937]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Markaz */}
          <select
            value={selectedCenter}
            onChange={(e) => {
              setSelectedCenter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-[#E7E1D8] bg-white px-3 py-2 text-xs font-semibold text-[#1F2937] shadow-2xs focus:border-[#6F1028] focus:outline-none focus:ring-1 focus:ring-[#6F1028] cursor-pointer"
          >
            <option value="all">Barcha markazlar</option>
            <option value="Lumos Urganch">Lumos Urganch</option>
            <option value="Lumos Xiva">Lumos Xiva</option>
            <option value="Lumos Toshkent">Lumos Toshkent</option>
            <option value="Lumos Buxoro">Lumos Buxoro</option>
          </select>

          {/* Fan */}
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-[#E7E1D8] bg-white px-3 py-2 text-xs font-semibold text-[#1F2937] shadow-2xs focus:border-[#6F1028] focus:outline-none focus:ring-1 focus:ring-[#6F1028] cursor-pointer"
          >
            <option value="all">Barcha fanlar</option>
            <option value="Matematika">Matematika</option>
            <option value="Ingliz tili">Ingliz tili</option>
            <option value="Fizika">Fizika</option>
            <option value="Ona tili">Ona tili</option>
            <option value="IT / Dasturlash">IT / Dasturlash</option>
          </select>

          {/* Holat */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-[#E7E1D8] bg-white px-3 py-2 text-xs font-semibold text-[#1F2937] shadow-2xs focus:border-[#6F1028] focus:outline-none focus:ring-1 focus:ring-[#6F1028] cursor-pointer"
          >
            <option value="all">Barcha holatlar</option>
            <option value="Faol">Faol</option>
            <option value="Faol emas">Faol emas</option>
          </select>

          {/* Tajriba */}
          <select
            value={selectedExperience}
            onChange={(e) => {
              setSelectedExperience(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-[#E7E1D8] bg-white px-3 py-2 text-xs font-semibold text-[#1F2937] shadow-2xs focus:border-[#6F1028] focus:outline-none focus:ring-1 focus:ring-[#6F1028] cursor-pointer"
          >
            <option value="all">Tajriba (Barchasi)</option>
            <option value="1-2">1–2 yil</option>
            <option value="3-4">3–4 yil</option>
            <option value="5+">5+ yil</option>
          </select>

          {/* Clear Filter Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E7E1D8] bg-[#F7E9ED] px-3 py-2 text-xs font-bold text-[#6F1028] hover:bg-[#F2D7DE] transition-colors cursor-pointer"
              title="Filtrni tozalash"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Tozalash
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN TEACHERS TABLE CARD ("O‘qituvchilar ro‘yxati")                    */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-[#E7E1D8] bg-[#FFFFFF] shadow-2xs overflow-hidden">
        {/* Table Card Header */}
        <div className="flex items-center justify-between border-b border-[#E7E1D8] px-4 sm:px-6 py-4 bg-[#FFFFFF]">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-extrabold text-[#1F2937] tracking-tight">
              O‘qituvchilar ro‘yxati
            </h2>
            <span className="rounded-lg bg-[#F7E9ED] border border-[#6F1028]/20 px-2 py-0.5 text-[11px] font-bold text-[#6F1028]">
              Jami {sortedTeachers.length} ta
            </span>
          </div>

          <div className="text-xs text-[#667085]">
            Tartiblash: <span className="font-bold text-[#1F2937] capitalize">{String(sortField)}</span> ({sortDirection === 'asc' ? 'O‘sish' : 'Kamayish'})
          </div>
        </div>

        {/* Table Surface */}
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E7E1D8] bg-[#F3EEE7] text-[11px] font-semibold uppercase tracking-wider text-[#1F2937]">
              <tr>
                <th className="px-3.5 py-3 text-center w-12 font-bold text-[#667085]">№</th>
                <th
                  onClick={() => handleSort('fullName')}
                  className="px-4 py-3 font-bold cursor-pointer select-none hover:text-[#6F1028]"
                >
                  <div className="inline-flex items-center gap-1.5">
                    <span>F.I.O</span>
                    <ArrowUpDown className="h-3 w-3 text-[#667085]" />
                  </div>
                </th>
                <th className="px-4 py-3 font-bold">Fan</th>
                <th className="px-4 py-3 font-bold">Markaz</th>
                <th
                  onClick={() => handleSort('groupsCount')}
                  className="px-4 py-3 text-center font-bold cursor-pointer select-none hover:text-[#6F1028]"
                >
                  <div className="inline-flex items-center justify-center gap-1.5">
                    <span>Guruhlar</span>
                    <ArrowUpDown className="h-3 w-3 text-[#667085]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('studentsCount')}
                  className="px-4 py-3 text-center font-bold cursor-pointer select-none hover:text-[#6F1028]"
                >
                  <div className="inline-flex items-center justify-center gap-1.5">
                    <span>O‘quvchilar</span>
                    <ArrowUpDown className="h-3 w-3 text-[#667085]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('attendanceRate')}
                  className="px-4 py-3 font-bold cursor-pointer select-none hover:text-[#6F1028]"
                >
                  <div className="inline-flex items-center gap-1.5">
                    <span>Davomat</span>
                    <ArrowUpDown className="h-3 w-3 text-[#667085]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('lessonsCount')}
                  className="px-4 py-3 text-center font-bold cursor-pointer select-none hover:text-[#6F1028]"
                >
                  <div className="inline-flex items-center justify-center gap-1.5">
                    <span>Darslar</span>
                    <ArrowUpDown className="h-3 w-3 text-[#667085]" />
                  </div>
                </th>
                <th className="px-4 py-3 text-center font-bold">Tajriba</th>
                <th className="px-4 py-3 text-center font-bold">Holat</th>
                <th className="px-4 py-3 text-right font-bold">Amallar</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E7E1D8] bg-[#FFFFFF]">
              {paginatedTeachers.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-xs text-[#667085]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F7F0E2] text-[#8A641C]">
                        <Search className="h-5 w-5" />
                      </div>
                      <p className="font-bold text-[#1F2937]">Hech qanday o‘qituvchi topilmadi</p>
                      <p className="text-[11px] text-[#98A2B3]">
                        Qidiruv so‘zini o‘zgartiring yoki filtrlarni tozalang.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTeachers.map((teacher, idx) => {
                  const globalIndex = (currentPage - 1) * pageSize + idx + 1;
                  const isFaol = teacher.status === 'Faol';

                  return (
                    <tr
                      key={teacher.id}
                      onClick={() => setViewingTeacher(teacher)}
                      className="group hover:bg-[#FCF8F5] transition-colors cursor-pointer"
                    >
                      {/* № */}
                      <td className="px-3.5 py-3 text-center text-xs font-semibold text-[#667085]">
                        {globalIndex}
                      </td>

                      {/* F.I.O */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6F1028] text-xs font-bold text-white shadow-xs">
                            {teacher.fullName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <span className="block font-bold text-[#1F2937] group-hover:text-[#6F1028] transition-colors">
                              {teacher.fullName}
                            </span>
                            <span className="block text-[10px] text-[#98A2B3] truncate">
                              {teacher.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Fan */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {renderSubjectBadge(teacher.subject)}
                      </td>

                      {/* Markaz */}
                      <td className="px-4 py-3 whitespace-nowrap text-xs font-semibold text-[#1F2937]">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5 text-[#C89B3C] shrink-0" />
                          {teacher.center}
                        </span>
                      </td>

                      {/* Guruhlar */}
                      <td className="px-4 py-3 text-center font-bold text-[#1F2937]">
                        {teacher.groupsCount}
                      </td>

                      {/* O‘quvchilar */}
                      <td className="px-4 py-3 text-center font-bold text-[#1F2937]">
                        {teacher.studentsCount}
                      </td>

                      {/* Davomat (percentage + thin burgundy progress bar matching reference) */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-[#E7E1D8] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#6F1028] transition-all"
                              style={{ width: `${Math.min(100, teacher.attendanceRate)}%` }}
                            />
                          </div>
                          <span className="font-bold text-[#1F2937] text-xs">
                            {teacher.attendanceRate}%
                          </span>
                        </div>
                      </td>

                      {/* Darslar */}
                      <td className="px-4 py-3 text-center font-semibold text-[#1F2937]">
                        {teacher.lessonsCount}
                      </td>

                      {/* Tajriba */}
                      <td className="px-4 py-3 text-center text-[#667085] font-medium whitespace-nowrap">
                        {teacher.experience}
                      </td>

                      {/* Holat */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                            isFaol
                              ? 'bg-[#E8F7F0] border-[#16A36A]/20 text-[#16A36A]'
                              : 'bg-[#FDECEC] border-[#C0392B]/20 text-[#C0392B]'
                          }`}
                        >
                          <span className="relative flex h-1.5 w-1.5 shrink-0">
                            {isFaol && (
                              <span className="absolute inline-flex h-full w-full rounded-full bg-[#16A36A] opacity-75 animate-ping" />
                            )}
                            <span
                              className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                                isFaol ? 'bg-[#16A36A]' : 'bg-[#C0392B]'
                              }`}
                            />
                          </span>
                          {teacher.status}
                        </span>
                      </td>

                      {/* Amallar */}
                      <td
                        className="px-4 py-3 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ActionDropdown
                          items={[
                            {
                              label: 'Ko‘rish',
                              icon: Eye,
                              onClick: () => setViewingTeacher(teacher),
                            },
                            {
                              label: 'Tahrirlash',
                              icon: Edit2,
                              onClick: () => setEditingTeacher(teacher),
                            },
                            {
                              label: 'Guruhlarini ko‘rish',
                              icon: Layers,
                              onClick: () => setViewingTeacher(teacher),
                            },
                            {
                              label: 'O‘chirish',
                              icon: Trash2,
                              variant: 'danger',
                              onClick: () => setDeletingTeacherId(teacher.id),
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-[#E7E1D8] px-4 sm:px-6 py-3 gap-2 bg-[#FFFFFF] text-xs">
          <span className="text-[#667085] text-[11px]">
            Jami <strong className="text-[#1F2937]">{sortedTeachers.length}</strong> ta o‘qituvchi (Sahifa{' '}
            <strong className="text-[#1F2937]">{currentPage}</strong> / {totalPages})
          </span>

          <div className="flex items-center gap-1 self-end sm:self-auto">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className="rounded-lg p-1.5 text-[#667085] hover:bg-[#F7E9ED] hover:text-[#6F1028] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Birinchi sahifa"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded-lg p-1.5 text-[#667085] hover:bg-[#F7E9ED] hover:text-[#6F1028] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Oldingi sahifa"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`h-7 w-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-[#6F1028] text-white shadow-xs'
                    : 'text-[#667085] hover:bg-[#F7E9ED] hover:text-[#6F1028]'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg p-1.5 text-[#667085] hover:bg-[#F7E9ED] hover:text-[#6F1028] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Keyingi sahifa"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="rounded-lg p-1.5 text-[#667085] hover:bg-[#F7E9ED] hover:text-[#6F1028] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Oxirgi sahifa"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. BOTTOM ANALYTICS CARDS (MATCHING REFERENCE IMAGE SPECIFICATIONS)        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* CARD 1: Eng faol o‘qituvchilar */}
        <div className="rounded-2xl border border-[#E7E1D8] bg-[#FFFFFF] p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E7E1D8]/60">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-[#C89B3C]" />
              <h3 className="text-sm font-extrabold text-[#1F2937]">
                Eng faol o‘qituvchilar
              </h3>
            </div>
            <span className="text-[11px] font-bold text-[#6F1028] hover:underline cursor-pointer">
              Barchasi ›
            </span>
          </div>

          <div className="space-y-3.5">
            {[
              { rank: '🥇', name: 'Diyorbek Rustamov', exp: '4 yil', rate: 96 },
              { rank: '🥈', name: 'Hadicha Saidova', exp: '5 yil', rate: 95 },
              { rank: '🥉', name: 'Hasanboy Karimov', exp: '3 yil', rate: 93 },
              { rank: '4.', name: 'Mirjalol Ahmadov', exp: '3 yil', rate: 90 },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-bold shrink-0">{item.rank}</span>
                    <span className="font-bold text-[#1F2937] truncate">{item.name}</span>
                    <span className="text-[10px] text-[#98A2B3]">({item.exp})</span>
                  </div>
                  <span className="font-black text-[#6F1028] shrink-0 text-xs">{item.rate}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#E7E1D8]/60 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#6F1028]"
                    style={{ width: `${item.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 2: Markazlar bo‘yicha o‘qituvchilar */}
        <div className="rounded-2xl border border-[#E7E1D8] bg-[#FFFFFF] p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E7E1D8]/60">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#6F1028]" />
              <h3 className="text-sm font-extrabold text-[#1F2937]">
                Markazlar bo‘yicha
              </h3>
            </div>
            <span className="text-[11px] font-bold text-[#6F1028] hover:underline cursor-pointer">
              Barchasi ›
            </span>
          </div>

          <div className="space-y-3.5">
            {[
              { center: 'Urganch', count: 8, pct: 29 },
              { center: 'Xiva', count: 7, pct: 25 },
              { center: 'Toshkent', count: 7, pct: 25 },
              { center: 'Buxoro', count: 6, pct: 21 },
            ].map((c, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1F2937]">{c.center}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#667085] font-semibold">{c.count} ta</span>
                    <span className="font-black text-[#6F1028] text-xs">({c.pct}%)</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#E7E1D8]/60 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#6F1028]"
                    style={{ width: `${c.pct * 2.8}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 3: Bugungi darslar (Useful Widget) */}
        <div className="rounded-2xl border border-[#E7E1D8] bg-[#FFFFFF] p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E7E1D8]/60">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#C89B3C]" />
              <h3 className="text-sm font-extrabold text-[#1F2937]">
                Bugungi darslar
              </h3>
            </div>
            <span className="text-[11px] font-bold text-[#6F1028] hover:underline cursor-pointer">
              Barchasi ›
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              { time: '08:00–09:30', group: '5-A guruh', subject: 'Matematika', teacher: 'Diyorbek Rustamov' },
              { time: '10:00–11:30', group: '6-B guruh', subject: 'Ingliz tili', teacher: 'Hasanboy Karimov' },
              { time: '12:00–13:30', group: '8-A guruh', subject: 'Matematika', teacher: 'Hadicha Saidova' },
              { time: '14:00–15:30', group: '7-B guruh', subject: 'Ingliz tili', teacher: 'Mirjalol Ahmadov' },
            ].map((lesson, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-xl bg-[#F8F6F2]/50 hover:bg-[#F8F6F2] transition-colors text-xs"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#1F2937]">{lesson.group}</span>
                    <span className="text-[10px] text-[#667085]">({lesson.time})</span>
                  </div>
                  <p className="text-[11px] text-[#667085] mt-0.5 truncate">{lesson.teacher}</p>
                </div>
                {lesson.subject === 'Matematika' ? (
                  <span className="text-[10px] font-bold text-[#6F1028] bg-[#F7E9ED] px-2 py-0.5 rounded-md">
                    Matem
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-[#8A641C] bg-[#F7F0E2] px-2 py-0.5 rounded-md">
                    English
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CARD 4: So‘nggi faoliyat */}
        <div className="rounded-2xl border border-[#E7E1D8] bg-[#FFFFFF] p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E7E1D8]/60">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#6F1028]" />
              <h3 className="text-sm font-extrabold text-[#1F2937]">
                So‘nggi faoliyat
              </h3>
            </div>
            <span className="text-[11px] font-bold text-[#6F1028] hover:underline cursor-pointer">
              Barchasi ›
            </span>
          </div>

          <div className="space-y-3">
            {[
              { action: 'Diyorbek davomat kiritdi', time: '2 soat oldin', sub: '5-A Matematika' },
              { action: 'Hasanboy yangi dars qo‘shdi', time: '3 soat oldin', sub: 'IELTS Unit 4' },
              { action: 'Nigora o‘quvchi ma’lumotini yangiladi', time: '5 soat oldin', sub: 'Sanjarbek Aliqulov' },
              { action: 'Sardor yangi guruhga biriktirildi', time: '6 soat oldin', sub: 'Starter-A guruhi' },
            ].map((act, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs">
                <div className="h-2 w-2 rounded-full bg-[#6F1028] mt-1.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-[#1F2937] leading-tight truncate">{act.action}</p>
                  <p className="text-[10px] text-[#98A2B3] mt-0.5">{act.sub} • {act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. MODAL: TEACHER DETAIL & GROUPS INTERACTION                             */}
      {/* ========================================================================= */}
      {viewingTeacher && (
        <Modal
          isOpen={!!viewingTeacher}
          onClose={() => setViewingTeacher(null)}
          title="O‘qituvchi Tafsilotlari"
          maxWidth="lg"
        >
          <div className="space-y-5">
            {/* Profile Header Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#F8F6F2] border border-[#E7E1D8]">
              <div className="flex items-center gap-3.5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#6F1028] text-lg font-black text-white shadow-xs">
                  {viewingTeacher.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1F2937]">
                    {viewingTeacher.fullName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {renderSubjectBadge(viewingTeacher.subject)}
                    <span className="text-xs font-semibold text-[#667085] flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-[#C89B3C]" />
                      {viewingTeacher.center}
                    </span>
                    <span className="text-xs font-semibold text-[#667085]">
                      • {viewingTeacher.experience}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${
                    viewingTeacher.status === 'Faol'
                      ? 'bg-[#E8F7F0] border-[#16A36A]/20 text-[#16A36A]'
                      : 'bg-[#FDECEC] border-[#C0392B]/20 text-[#C0392B]'
                  }`}
                >
                  {viewingTeacher.status}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const t = viewingTeacher;
                    setViewingTeacher(null);
                    setEditingTeacher(t);
                  }}
                >
                  <Edit2 className="h-3.5 w-3.5 mr-1" />
                  Tahrirlash
                </Button>
              </div>
            </div>

            {/* Quick Contact & Salary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-[#E7E1D8] bg-white">
                <span className="text-[10px] uppercase font-bold text-[#98A2B3] block">Telefon:</span>
                <span className="font-bold text-[#1F2937] flex items-center gap-1.5 mt-0.5">
                  <Phone className="h-3.5 w-3.5 text-[#667085]" />
                  {viewingTeacher.phone}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-[#E7E1D8] bg-white">
                <span className="text-[10px] uppercase font-bold text-[#98A2B3] block">Email:</span>
                <span className="font-bold text-[#1F2937] flex items-center gap-1.5 mt-0.5 truncate">
                  <Mail className="h-3.5 w-3.5 text-[#C89B3C]" />
                  {viewingTeacher.email}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-[#E7E1D8] bg-white">
                <span className="text-[10px] uppercase font-bold text-[#98A2B3] block">Boshlang‘ich maosh:</span>
                <span className="font-bold text-[#6F1028] mt-0.5 block">
                  {viewingTeacher.baseSalary.toLocaleString()} so‘m
                </span>
              </div>
            </div>

            {/* Statistics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl border border-[#E7E1D8] bg-[#FFFFFF] text-center">
                <p className="text-xl font-black text-[#1F2937]">{viewingTeacher.groupsCount}</p>
                <p className="text-[11px] font-medium text-[#667085] mt-0.5">Guruhlar</p>
              </div>
              <div className="p-3 rounded-xl border border-[#E7E1D8] bg-[#FFFFFF] text-center">
                <p className="text-xl font-black text-[#1F2937]">{viewingTeacher.studentsCount}</p>
                <p className="text-[11px] font-medium text-[#667085] mt-0.5">O‘quvchilar</p>
              </div>
              <div className="p-3 rounded-xl border border-[#E7E1D8] bg-[#FFFFFF] text-center">
                <p className="text-xl font-black text-[#16A36A]">{viewingTeacher.attendanceRate}%</p>
                <p className="text-[11px] font-medium text-[#667085] mt-0.5">O‘rtacha davomat</p>
              </div>
              <div className="p-3 rounded-xl border border-[#E7E1D8] bg-[#FFFFFF] text-center">
                <p className="text-xl font-black text-[#6F1028]">{viewingTeacher.lessonsCount}</p>
                <p className="text-[11px] font-medium text-[#667085] mt-0.5">O‘tilgan darslar</p>
              </div>
            </div>

            {/* "Guruhlari" Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F2937] mb-2.5">
                Biriktirilgan Guruhlar
              </h4>
              <div className="overflow-hidden rounded-xl border border-[#E7E1D8] bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#E7E1D8] bg-[#F3EEE7] text-[10px] font-bold uppercase text-[#1F2937]">
                    <tr>
                      <th className="px-3.5 py-2.5">Guruh</th>
                      <th className="px-3.5 py-2.5 text-center">O‘quvchilar</th>
                      <th className="px-3.5 py-2.5 text-center">Davomat</th>
                      <th className="px-3.5 py-2.5 text-center">To‘lov</th>
                      <th className="px-3.5 py-2.5 text-right">Keyingi dars</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7E1D8]">
                    {(viewingTeacher.groupsList || []).map((grp, i) => (
                      <tr key={i} className="hover:bg-[#FCF8F5]">
                        <td className="px-3.5 py-2.5 font-bold text-[#1F2937]">{grp.groupName}</td>
                        <td className="px-3.5 py-2.5 text-center font-semibold text-[#1F2937]">
                          {grp.studentsCount} ta
                        </td>
                        <td className="px-3.5 py-2.5 text-center font-bold text-[#16A36A]">
                          {grp.attendanceRate}%
                        </td>
                        <td className="px-3.5 py-2.5 text-center font-bold text-[#6F1028]">
                          {grp.paymentRate}%
                        </td>
                        <td className="px-3.5 py-2.5 text-right text-[#667085] font-medium">
                          {grp.nextLesson}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E7E1D8]">
              <Button variant="primary" onClick={() => setViewingTeacher(null)}>
                Yopish
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL: ADD TEACHER                                                     */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Yangi O‘qituvchi Qo‘shish"
        maxWidth="md"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1F2937] mb-1">
              F.I.O *
            </label>
            <Input
              required
              placeholder="Masalan: Diyorbek Rustamov"
              value={addForm.fullName}
              onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1F2937] mb-1">
                Email / Login *
              </label>
              <Input
                required
                type="email"
                placeholder="diyorbek@lumos.uz"
                value={addForm.email}
                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2937] mb-1">
                Telefon Raqami
              </label>
              <Input
                placeholder="+998 (90) 000-00-00"
                value={addForm.phone}
                onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1F2937] mb-1">
                Asosiy Fan *
              </label>
              <Select
                value={addForm.subject}
                onChange={(e) => setAddForm({ ...addForm, subject: e.target.value })}
              >
                <option value="Matematika">Matematika</option>
                <option value="Ingliz tili">Ingliz tili</option>
                <option value="Fizika">Fizika</option>
                <option value="Ona tili">Ona tili</option>
                <option value="IT / Dasturlash">IT / Dasturlash</option>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2937] mb-1">
                Markaz *
              </label>
              <Select
                value={addForm.center}
                onChange={(e) => setAddForm({ ...addForm, center: e.target.value })}
              >
                <option value="Lumos Xiva">Lumos Xiva</option>
                <option value="Lumos Urganch">Lumos Urganch</option>
                <option value="Lumos Toshkent">Lumos Toshkent</option>
                <option value="Lumos Buxoro">Lumos Buxoro</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1F2937] mb-1">
                Tajriba
              </label>
              <Input
                placeholder="Masalan: 4 yil"
                value={addForm.experience}
                onChange={(e) => setAddForm({ ...addForm, experience: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1F2937] mb-1">
                Boshlang‘ich maosh (so‘m)
              </label>
              <Input
                type="number"
                placeholder="4500000"
                value={addForm.baseSalary}
                onChange={(e) => setAddForm({ ...addForm, baseSalary: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-[#E7E1D8]">
            <Button variant="secondary" type="button" onClick={() => setIsAddModalOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" type="submit">
              O‘qituvchini saqlash
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* 8. MODAL: EDIT TEACHER                                                    */}
      {/* ========================================================================= */}
      {editingTeacher && (
        <Modal
          isOpen={!!editingTeacher}
          onClose={() => setEditingTeacher(null)}
          title="O‘qituvchi Ma’lumotlarini Tahrirlash"
          maxWidth="md"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1F2937] mb-1">
                F.I.O *
              </label>
              <Input
                required
                value={editingTeacher.fullName}
                onChange={(e) => setEditingTeacher({ ...editingTeacher, fullName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1F2937] mb-1">
                  Email *
                </label>
                <Input
                  required
                  type="email"
                  value={editingTeacher.email}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1F2937] mb-1">
                  Telefon
                </label>
                <Input
                  value={editingTeacher.phone}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1F2937] mb-1">
                  Fan
                </label>
                <Select
                  value={editingTeacher.subject}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, subject: e.target.value })}
                >
                  <option value="Matematika">Matematika</option>
                  <option value="Ingliz tili">Ingliz tili</option>
                  <option value="Fizika">Fizika</option>
                  <option value="Ona tili">Ona tili</option>
                  <option value="IT / Dasturlash">IT / Dasturlash</option>
                </Select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1F2937] mb-1">
                  Markaz
                </label>
                <Select
                  value={editingTeacher.center}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, center: e.target.value })}
                >
                  <option value="Lumos Xiva">Lumos Xiva</option>
                  <option value="Lumos Urganch">Lumos Urganch</option>
                  <option value="Lumos Toshkent">Lumos Toshkent</option>
                  <option value="Lumos Buxoro">Lumos Buxoro</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1F2937] mb-1">
                  Tajriba
                </label>
                <Input
                  value={editingTeacher.experience}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, experience: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1F2937] mb-1">
                  Holat
                </label>
                <Select
                  value={editingTeacher.status}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, status: e.target.value as any })}
                >
                  <option value="Faol">Faol</option>
                  <option value="Faol emas">Faol emas</option>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-[#E7E1D8]">
              <Button variant="secondary" type="button" onClick={() => setEditingTeacher(null)}>
                Bekor qilish
              </Button>
              <Button variant="primary" type="submit">
                O‘zgarishlarni saqlash
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* 9. MODAL: DELETE TEACHER CONFIRMATION                                     */}
      {/* ========================================================================= */}
      <ConfirmDialog
        isOpen={!!deletingTeacherId}
        onClose={() => setDeletingTeacherId(null)}
        onConfirm={handleConfirmDelete}
        title="O‘qituvchini O‘chirish"
        message="Haqiqatan ham ushbu o‘qituvchini o‘chirmoqchimisiz? Guruhlar va darslar ushbu o‘qituvchiga biriktirilgan bo‘lishi mumkin."
        confirmLabel="O‘chirish"
        variant="danger"
      />
    </div>
  );
};