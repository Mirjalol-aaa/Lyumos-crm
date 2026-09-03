export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  managerName: string;
  studentCount: number;
  teacherCount: number;
  groupsCount: number;
  monthlyRevenue: number;
  status: 'Active' | 'Planned' | 'Renovation';
}

export interface Course {
  id: string;
  title: string;
  category: 'Languages' | 'IT & Programming' | 'Math & Science' | 'Business';
  level: string;
  durationMonths: number;
  lessonsCount: number;
  pricePerMonth: number;
  activeGroupsCount: number;
  syllabus: string[];
  description: string;
}

export interface TeacherWorkload {
  teacherId: string;
  teacherName: string;
  avatar: string;
  subjects: string[];
  activeGroupsCount: number;
  activeStudentsCount: number;
  weeklyHours: number; // e.g. 24 hours
  maxCapacityHours: number; // e.g. 30 hours
  workloadPercentage: number; // e.g. 80%
  avgGradingTurnaroundHours: number; // e.g. 4.2 hours
  studentRetentionRate: number; // e.g. 96%
  kpiScore: number; // e.g. 4.9
  baseSalary: number;
  bonusPerStudent: number;
  calculatedTotalSalary: number;
  status: 'Optimal' | 'Overloaded' | 'Available' | 'Inactive';
}

export interface RolePermission {
  id: string;
  roleName: string;
  label: string;
  description: string;
  userCount: number;
  permissions: {
    module: string;
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
  }[];
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  role: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'PAYMENT' | 'GRADE';
  targetEntity: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  costCoins: number;
  icon: string;
  category: 'Vouchers' | 'Merch' | 'Tutoring' | 'Software';
  stock: number;
  imageUrl?: string;
}
