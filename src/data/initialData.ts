import { Student, Teacher, Group, Expense, NotificationItem, CalendarEvent, CenterSettings } from '../types/crm';

export const initialSettings: CenterSettings = {
  centerName: "LYUMOS International Education Center",
  tagline: "Empowering Next Generation Achievers",
  phone: "+1 (800) 598-6670",
  email: "admin@lyumos-edu.com",
  address: "750 Silicon Avenue, Innovation Hub, Suite 400",
  currency: "USD",
  currencySymbol: "$",
  academicYear: "2025 - 2026",
  language: "en",
  theme: "light",
  enableSmsNotifications: true,
  autoRemindUnpaid: true,
  discountPolicyMax: 25,
};

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: "TCH-101",
    fullName: "Dr. Alexander Wright",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    phone: "+1 (555) 234-8901",
    email: "a.wright@lyumos.com",
    subjects: ["IELTS Academic", "Advanced English"],
    baseSalary: 3200,
    bonusPerStudent: 15,
    groupsCount: 3,
    studentsCount: 42,
    joinedDate: "2023-01-15",
    rating: 4.9,
    schedule: "Mon, Wed, Fri (14:00 - 18:00)",
    status: "Active"
  },
  {
    id: "TCH-102",
    fullName: "Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250",
    phone: "+1 (555) 345-9012",
    email: "e.rostova@lyumos.com",
    subjects: ["Mathematics", "Calculus & SAT"],
    baseSalary: 2900,
    bonusPerStudent: 12,
    groupsCount: 2,
    studentsCount: 34,
    joinedDate: "2023-03-20",
    rating: 4.8,
    schedule: "Tue, Thu, Sat (10:00 - 16:00)",
    status: "Active"
  },
  {
    id: "TCH-103",
    fullName: "Marcus Vance",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    phone: "+1 (555) 456-0123",
    email: "m.vance@lyumos.com",
    subjects: ["Computer Science", "Python & AI"],
    baseSalary: 3500,
    bonusPerStudent: 18,
    groupsCount: 2,
    studentsCount: 28,
    joinedDate: "2022-09-01",
    rating: 5.0,
    schedule: "Mon, Wed, Fri (16:00 - 20:00)",
    status: "Active"
  },
  {
    id: "TCH-104",
    fullName: "Sarah Jenkins",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250",
    phone: "+1 (555) 567-1234",
    email: "s.jenkins@lyumos.com",
    subjects: ["General English", "Kids Grammar"],
    baseSalary: 2600,
    bonusPerStudent: 10,
    groupsCount: 2,
    studentsCount: 26,
    joinedDate: "2024-02-10",
    rating: 4.7,
    schedule: "Tue, Thu, Sat (14:00 - 18:00)",
    status: "Active"
  },
  {
    id: "TCH-105",
    fullName: "David Chen",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
    phone: "+1 (555) 678-2345",
    email: "d.chen@lyumos.com",
    subjects: ["Physics", "AP Physics C"],
    baseSalary: 3100,
    bonusPerStudent: 14,
    groupsCount: 1,
    studentsCount: 16,
    joinedDate: "2023-11-05",
    rating: 4.9,
    schedule: "Mon, Wed (16:00 - 19:00)",
    status: "Active"
  },
  {
    id: "TCH-106",
    fullName: "Olivia Taylor",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
    phone: "+1 (555) 789-3456",
    email: "o.taylor@lyumos.com",
    subjects: ["Chemistry", "Biology"],
    baseSalary: 2800,
    bonusPerStudent: 12,
    groupsCount: 1,
    studentsCount: 14,
    joinedDate: "2024-01-08",
    rating: 4.8,
    schedule: "Tue, Thu (15:00 - 18:00)",
    status: "Active"
  },
  {
    id: "TCH-107",
    fullName: "Lucas Silva",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250",
    phone: "+1 (555) 890-4567",
    email: "l.silva@lyumos.com",
    subjects: ["Spanish", "Dele Exam Prep"],
    baseSalary: 2500,
    bonusPerStudent: 10,
    groupsCount: 1,
    studentsCount: 12,
    joinedDate: "2023-08-12",
    rating: 4.6,
    schedule: "Mon, Wed (10:00 - 12:00)",
    status: "Active"
  },
  {
    id: "TCH-108",
    fullName: "Amara Patel",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=250",
    phone: "+1 (555) 901-5678",
    email: "a.patel@lyumos.com",
    subjects: ["Digital Marketing", "Business Studies"],
    baseSalary: 2700,
    bonusPerStudent: 12,
    groupsCount: 1,
    studentsCount: 15,
    joinedDate: "2024-04-01",
    rating: 4.9,
    schedule: "Sat, Sun (11:00 - 14:00)",
    status: "Active"
  }
];

export const INITIAL_GROUPS: Group[] = [
  {
    id: "GRP-01",
    name: "IELTS Master 8.0+",
    subject: "IELTS Academic",
    level: "Advanced (C1-C2)",
    teacherId: "TCH-101",
    teacherName: "Dr. Alexander Wright",
    scheduleDays: "Mon, Wed, Fri",
    scheduleTime: "14:00 - 16:00",
    room: "Lab 301",
    monthlyFee: 180,
    maxCapacity: 16,
    currentStudentsCount: 15,
    status: "Active"
  },
  {
    id: "GRP-02",
    name: "IELTS Intensive 7.0",
    subject: "IELTS Academic",
    level: "Upper-Intermediate (B2)",
    teacherId: "TCH-101",
    teacherName: "Dr. Alexander Wright",
    scheduleDays: "Mon, Wed, Fri",
    scheduleTime: "16:30 - 18:30",
    room: "Auditorium A",
    monthlyFee: 160,
    maxCapacity: 16,
    currentStudentsCount: 14,
    status: "Active"
  },
  {
    id: "GRP-03",
    name: "SAT Math 800 Target",
    subject: "Mathematics",
    level: "Advanced",
    teacherId: "TCH-102",
    teacherName: "Elena Rostova",
    scheduleDays: "Tue, Thu, Sat",
    scheduleTime: "10:00 - 12:00",
    room: "Math Hub 204",
    monthlyFee: 190,
    maxCapacity: 18,
    currentStudentsCount: 18,
    status: "Active"
  },
  {
    id: "GRP-04",
    name: "Calculus & Olympiad Math",
    subject: "Mathematics",
    level: "Expert",
    teacherId: "TCH-102",
    teacherName: "Elena Rostova",
    scheduleDays: "Tue, Thu, Sat",
    scheduleTime: "14:00 - 16:00",
    room: "Math Hub 204",
    monthlyFee: 175,
    maxCapacity: 16,
    currentStudentsCount: 16,
    status: "Active"
  },
  {
    id: "GRP-05",
    name: "Python Full-Stack & AI",
    subject: "Computer Science",
    level: "Intermediate",
    teacherId: "TCH-103",
    teacherName: "Marcus Vance",
    scheduleDays: "Mon, Wed, Fri",
    scheduleTime: "16:00 - 18:00",
    room: "Tech Lab 102",
    monthlyFee: 210,
    maxCapacity: 15,
    currentStudentsCount: 15,
    status: "Active"
  },
  {
    id: "GRP-06",
    name: "Algorithm & Data Structures",
    subject: "Computer Science",
    level: "Advanced",
    teacherId: "TCH-103",
    teacherName: "Marcus Vance",
    scheduleDays: "Mon, Wed, Fri",
    scheduleTime: "18:15 - 20:15",
    room: "Tech Lab 102",
    monthlyFee: 220,
    maxCapacity: 15,
    currentStudentsCount: 13,
    status: "Active"
  },
  {
    id: "GRP-07",
    name: "General English B1-B2",
    subject: "General English",
    level: "Intermediate",
    teacherId: "TCH-104",
    teacherName: "Sarah Jenkins",
    scheduleDays: "Tue, Thu, Sat",
    scheduleTime: "14:00 - 16:00",
    room: "Classroom 108",
    monthlyFee: 130,
    maxCapacity: 15,
    currentStudentsCount: 14,
    status: "Active"
  },
  {
    id: "GRP-08",
    name: "Kids Spoken English",
    subject: "Kids Grammar",
    level: "Beginner (A1)",
    teacherId: "TCH-104",
    teacherName: "Sarah Jenkins",
    scheduleDays: "Tue, Thu, Sat",
    scheduleTime: "16:15 - 17:45",
    room: "Kids Zone 101",
    monthlyFee: 120,
    maxCapacity: 12,
    currentStudentsCount: 12,
    status: "Active"
  },
  {
    id: "GRP-09",
    name: "AP Physics Mechanics",
    subject: "Physics",
    level: "Advanced",
    teacherId: "TCH-105",
    teacherName: "David Chen",
    scheduleDays: "Mon, Wed",
    scheduleTime: "16:00 - 19:00",
    room: "Physics Lab 201",
    monthlyFee: 185,
    maxCapacity: 16,
    currentStudentsCount: 16,
    status: "Active"
  },
  {
    id: "GRP-10",
    name: "Organic & Physical Chemistry",
    subject: "Chemistry",
    level: "Upper-Intermediate",
    teacherId: "TCH-106",
    teacherName: "Olivia Taylor",
    scheduleDays: "Tue, Thu",
    scheduleTime: "15:00 - 18:00",
    room: "Chemistry Lab 202",
    monthlyFee: 175,
    maxCapacity: 15,
    currentStudentsCount: 14,
    status: "Active"
  },
  {
    id: "GRP-11",
    name: "Spanish Conversational B2",
    subject: "Spanish",
    level: "Intermediate",
    teacherId: "TCH-107",
    teacherName: "Lucas Silva",
    scheduleDays: "Mon, Wed",
    scheduleTime: "10:00 - 12:00",
    room: "Lang Studio 105",
    monthlyFee: 140,
    maxCapacity: 14,
    currentStudentsCount: 12,
    status: "Active"
  },
  {
    id: "GRP-12",
    name: "Digital Marketing & SMM",
    subject: "Digital Marketing",
    level: "All Levels",
    teacherId: "TCH-108",
    teacherName: "Amara Patel",
    scheduleDays: "Sat, Sun",
    scheduleTime: "11:00 - 14:00",
    room: "Media Lab 305",
    monthlyFee: 195,
    maxCapacity: 16,
    currentStudentsCount: 15,
    status: "Active"
  }
];

const FIRST_NAMES = [
  "Ethan", "Sophia", "Liam", "Olivia", "Noah", "Emma", "Jackson", "Ava", "Aiden", "Isabella",
  "Lucas", "Mia", "Oliver", "Harper", "Benjamin", "Evelyn", "Elijah", "Abigail", "James", "Emily",
  "Mason", "Ella", "Logan", "Elizabeth", "Alexander", "Camila", "Caleb", "Sofia", "Henry", "Aria",
  "Sebastian", "Scarlett", "Daniel", "Victoria", "Matthew", "Madison", "Samuel", "Luna", "David", "Grace",
  "Joseph", "Chloe", "Carter", "Penelope", "Owen", "Layla", "Wyatt", "Riley", "John", "Zoey",
  "Jack", "Nora", "Luke", "Lily", "Jayden", "Eleanor", "Dylan", "Hannah", "Grayson", "Lillian",
  "Levi", "Addison", "Isaac", "Aubrey", "Gabriel", "Ellie", "Julian", "Stella", "Mateo", "Natalie",
  "Anthony", "Zoe", "Jaxon", "Leah", "Lincoln", "Hazel", "Joshua", "Violet", "Christopher", "Aurora",
  "Andrew", "Savannah", "Theodore", "Audrey", "Caleb", "Brooklyn", "Ryan", "Bella", "Asher", "Claire",
  "Nathan", "Skylar", "Thomas", "Lucy", "Leo", "Paisley", "Isaiah", "Everly", "Charles", "Anna",
  "Jasurbek", "Shakhzod", "Malika", "Aziza", "Kamron", "Rayona", "Sardor", "Nilufar", "Timur", "Laylo",
  "Diyorbek", "Madina", "Javohir", "Sevinch", "Bekzod", "Rukhshona", "Bobur", "Gulnoza", "Farrukh", "Feruza"
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
  "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
  "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
  "Karimov", "Rahimov", "Tursunov", "Abdullaev", "Umarov", "Sultanov", "Alimov", "Azimov", "Sharipov", "Ismailov"
];

const MONTHS = ["August", "September", "October", "November", "December", "January", "February", "March", "April", "May", "June", "July"];

// Generator helper for 150+ realistic students
export function generateInitialStudents(): Student[] {
  const students: Student[] = [];

  for (let i = 1; i <= 152; i++) {
    const fnIndex = (i * 7) % FIRST_NAMES.length;
    const lnIndex = (i * 11) % LAST_NAMES.length;
    const firstName = FIRST_NAMES[fnIndex];
    const lastName = LAST_NAMES[lnIndex];
    const fullName = `${firstName} ${lastName}`;
    
    const group = INITIAL_GROUPS[i % INITIAL_GROUPS.length];
    const teacher = INITIAL_TEACHERS.find(t => t.id === group.teacherId) || INITIAL_TEACHERS[0];
    
    const isMale = fnIndex % 2 === 0;
    const gender = isMale ? 'Male' : 'Female';
    const avatarGender = isMale ? 'men' : 'women';
    const avatarId = (i % 70) + 1;
    const avatar = `https://randomuser.me/api/portraits/${avatarGender}/${avatarId}.jpg`;
    
    // Birthdates spread across 2004 to 2012
    const birthYear = 2004 + (i % 9);
    const birthMonth = String((i % 12) + 1).padStart(2, '0');
    const birthDay = String((i % 28) + 1).padStart(2, '0');
    const birthDate = `${birthYear}-${birthMonth}-${birthDay}`;

    const phone = `+1 (555) ${100 + (i % 900)}-${1000 + (i * 37) % 9000}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@gmail.com`;
    const parentName = `${isMale ? 'Mr. ' : 'Mrs. '}${lastName}`;
    const parentPhone = `+1 (555) ${200 + (i % 800)}-${2000 + (i * 41) % 7000}`;

    let status: Student['status'] = 'Active';
    if (i % 17 === 0) status = 'Frozen';
    else if (i % 23 === 0) status = 'Trial';
    else if (i % 31 === 0) status = 'Graduated';

    // Generate August-July payment matrix
    const payments: Student['payments'] = {};
    MONTHS.forEach((month, mIdx) => {
      // Current month simulated as August / September (e.g. Month 0 and 1)
      let pStatus: Student['payments'][string]['status'] = 'Paid';
      let discount = 0;
      
      if (i % 15 === 0 && mIdx === 0) discount = 20; // 20% discount
      
      if (status === 'Frozen' && mIdx >= 1) {
        pStatus = 'Frozen';
      } else if (mIdx > 1) {
        // Future months in the academic year
        pStatus = 'Unpaid';
      } else if (i % 8 === 0 && mIdx === 1) {
        pStatus = 'Unpaid';
      } else if (i % 19 === 0 && mIdx === 1) {
        pStatus = 'Overdue';
      } else if (discount > 0) {
        pStatus = 'Discount';
      }

      const baseFee = group.monthlyFee;
      const amountPaid = pStatus === 'Paid' ? baseFee * (1 - discount/100) : 
                         pStatus === 'Discount' ? baseFee * (1 - discount/100) : 0;

      payments[month] = {
        status: pStatus,
        amountPaid,
        discount,
        paymentDate: pStatus === 'Paid' || pStatus === 'Discount' ? `2025-08-${String((i % 25) + 1).padStart(2, '0')}` : undefined,
        method: (i % 3 === 0) ? 'Payme / Click' : (i % 2 === 0) ? 'Card' : 'Cash',
        receiptNo: (pStatus === 'Paid' || pStatus === 'Discount') ? `REC-2025-${1000 + i * 12 + mIdx}` : undefined,
      };
    });

    students.push({
      id: `STU-${1000 + i}`,
      fullName,
      avatar,
      birthDate,
      gender,
      phone,
      email,
      parentName,
      parentPhone,
      groupId: group.id,
      groupName: group.name,
      teacherId: teacher.id,
      teacherName: teacher.fullName,
      monthlyFee: group.monthlyFee,
      status,
      joinedDate: `2024-09-01`,
      address: `${100 + i} University Boulevard, West District`,
      notes: i % 5 === 0 ? "Targeting IELTS 8.0 for Stanford University application." : undefined,
      payments
    });
  }

  return students;
}

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: "EXP-801",
    title: "Campus Building Monthly Rent",
    category: "Rent",
    amount: 4500,
    date: "2025-08-01",
    paymentMethod: "Bank Transfer",
    requestedBy: "Director Office",
    notes: "Building A & B rental lease payment."
  },
  {
    id: "EXP-802",
    title: "August Teacher Base Salaries",
    category: "Teacher Salaries",
    amount: 22800,
    date: "2025-08-05",
    paymentMethod: "Bank Transfer",
    requestedBy: "HR & Accounting",
    notes: "Disbursed for 8 full-time teachers & bonus structure."
  },
  {
    id: "EXP-803",
    title: "Google Ads & Social Media Campaign",
    category: "Marketing",
    amount: 1250,
    date: "2025-08-03",
    paymentMethod: "Card",
    requestedBy: "Marketing Dept",
    notes: "Autumn enrollment campaign target 250 leads."
  },
  {
    id: "EXP-804",
    title: "High-Speed Fiber Internet & Server Hosting",
    category: "Utilities & Software",
    amount: 420,
    date: "2025-08-02",
    paymentMethod: "Card",
    requestedBy: "IT Admin",
    notes: "1Gbps Dedicated fiber & Cloud server backup."
  },
  {
    id: "EXP-805",
    title: "10x High-Performance Dell Monitors for CS Lab",
    category: "Equipment",
    amount: 2100,
    date: "2025-08-04",
    paymentMethod: "Card",
    requestedBy: "Marcus Vance",
    notes: "Upgraded monitors for Python Lab 102."
  },
  {
    id: "EXP-806",
    title: "Coffee, Refreshments & Student Lounge Snacks",
    category: "Events",
    amount: 380,
    date: "2025-08-06",
    paymentMethod: "Cash",
    requestedBy: "Reception",
    notes: "Monthly supply for lounge espresso bar."
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "NOTIF-1",
    title: "New Student Enrolled",
    message: "Sophia Johnson joined IELTS Master 8.0+ group.",
    time: "10 mins ago",
    type: "student",
    read: false,
    linkTo: { page: "students", id: "STU-1002" }
  },
  {
    id: "NOTIF-2",
    title: "Payment Received",
    message: "$180 received via Click from Parent of Ethan Smith (REC-2025-1012).",
    time: "1 hour ago",
    type: "payment",
    read: false,
    linkTo: { page: "payments" }
  },
  {
    id: "NOTIF-3",
    title: "Upcoming Birthday 🎉",
    message: "Jackson Davis (SAT Math Group) turns 18 today!",
    time: "3 hours ago",
    type: "birthday",
    read: false,
    linkTo: { page: "students", id: "STU-1007" }
  },
  {
    id: "NOTIF-4",
    title: "Attendance Alert",
    message: "3 students marked absent in Python Full-Stack class.",
    time: "5 hours ago",
    type: "attendance",
    read: true,
    linkTo: { page: "attendance" }
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: "EVT-1",
    title: "IELTS Mock Examination",
    date: "2025-08-15",
    time: "09:00 - 12:00",
    type: "exam",
    description: "Full listening, reading, writing simulation for Groups GRP-01 & GRP-02."
  },
  {
    id: "EVT-2",
    title: "Parent-Teacher Open Conference",
    date: "2025-08-20",
    time: "14:00 - 18:00",
    type: "meeting",
    description: "Quarterly progress review with parents."
  },
  {
    id: "EVT-3",
    title: "Coding Olympiad Qualifying Round",
    date: "2025-08-25",
    time: "15:00 - 18:00",
    type: "event",
    description: "Live competitive programming event in Computer Lab 102."
  },
  {
    id: "EVT-4",
    title: "Teachers Staff Alignment Meeting",
    date: "2025-08-28",
    time: "18:00 - 19:30",
    type: "meeting",
    description: "Reviewing monthly goals, attendance rates and salary bonuses."
  }
];
