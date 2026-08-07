import React, { createContext, useContext, useState, useMemo } from 'react';
import { 
  Student, Teacher, Group, Expense, NotificationItem, 
  CalendarEvent, CenterSettings, PageType, PaymentStatus, PaymentMethod, AttendanceStatus, AttendanceRecord 
} from '../types/crm';
import { 
  initialSettings, INITIAL_TEACHERS, INITIAL_GROUPS, 
  generateInitialStudents, INITIAL_EXPENSES, INITIAL_NOTIFICATIONS, INITIAL_CALENDAR_EVENTS 
} from '../data/initialData';

interface CRMContextType {
  // Navigation & View State
  activePage: PageType;
  setActivePage: (page: PageType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
  
  // Center Settings
  settings: CenterSettings;
  updateSettings: (newSettings: Partial<CenterSettings>) => void;

  // Primary Entities
  students: Student[];
  teachers: Teacher[];
  groups: Group[];
  expenses: Expense[];
  notifications: NotificationItem[];
  calendarEvents: CalendarEvent[];
  attendanceRecords: AttendanceRecord[];

  // Student Actions
  addStudent: (student: Omit<Student, 'id' | 'payments'>) => void;
  updateStudent: (id: string, updated: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  recordPayment: (params: {
    studentId: string;
    month: string;
    amount: number;
    discount?: number;
    method: PaymentMethod;
    notes?: string;
  }) => void;

  // Teacher Actions
  addTeacher: (teacher: Omit<Teacher, 'id' | 'groupsCount' | 'studentsCount' | 'rating'>) => void;
  updateTeacher: (id: string, updated: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;

  // Group Actions
  addGroup: (group: Omit<Group, 'id' | 'currentStudentsCount'>) => void;
  updateGroup: (id: string, updated: Partial<Group>) => void;
  deleteGroup: (id: string) => void;

  // Expense Actions
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;

  // Attendance Actions
  saveAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;

  // Notification Actions
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Active Modals & Selected Objects
  selectedStudentId: string | null;
  setSelectedStudentId: (id: string | null) => void;
  selectedTeacherId: string | null;
  setSelectedTeacherId: (id: string | null) => void;
  selectedGroupId: string | null;
  setSelectedGroupId: (id: string | null) => void;

  isAddStudentModalOpen: boolean;
  setIsAddStudentModalOpen: (open: boolean) => void;
  isReceivePaymentModalOpen: boolean;
  setIsReceivePaymentModalOpen: (open: boolean) => void;
  paymentModalDefaultStudentId: string | null;
  setPaymentModalDefaultStudentId: (id: string | null) => void;
  isAddTeacherModalOpen: boolean;
  setIsAddTeacherModalOpen: (open: boolean) => void;
  isAddGroupModalOpen: boolean;
  setIsAddGroupModalOpen: (open: boolean) => void;
  isAddExpenseModalOpen: boolean;
  setIsAddExpenseModalOpen: (open: boolean) => void;

  // Computed Financial Metrics
  financials: {
    totalStudents: number;
    activeStudents: number;
    newStudentsThisMonth: number;
    monthlyExpectedIncome: number;
    paidIncome: number;
    unpaidIncome: number;
    expensesTotal: number;
    netProfit: number;
    overallAttendancePercentage: number;
  };
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<PageType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  const [settings, setSettings] = useState<CenterSettings>(initialSettings);
  const [students, setStudents] = useState<Student[]>(() => generateInitialStudents());
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [calendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  // Selected Profile Modals
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Form Modals
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isReceivePaymentModalOpen, setIsReceivePaymentModalOpen] = useState(false);
  const [paymentModalDefaultStudentId, setPaymentModalDefaultStudentId] = useState<string | null>(null);
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);

  // Update Settings
  const updateSettings = (newSettings: Partial<CenterSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Student Operations
  const addStudent = (newStudentData: Omit<Student, 'id' | 'payments'>) => {
    const newId = `STU-${1000 + students.length + 1}`;
    const MONTHS = ["August", "September", "October", "November", "December", "January", "February", "March", "April", "May", "June", "July"];
    
    const initialPayments: Student['payments'] = {};
    MONTHS.forEach((m) => {
      initialPayments[m] = {
        status: 'Unpaid',
        amountPaid: 0,
        discount: 0
      };
    });

    const newStudent: Student = {
      ...newStudentData,
      id: newId,
      payments: initialPayments
    };

    setStudents(prev => [newStudent, ...prev]);

    // Update group student count
    setGroups(prev => prev.map(g => g.id === newStudent.groupId ? { ...g, currentStudentsCount: g.currentStudentsCount + 1 } : g));

    // Notification
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: "New Student Enrolled",
      message: `${newStudent.fullName} joined ${newStudent.groupName}.`,
      time: "Just now",
      type: "student",
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const deleteStudent = (id: string) => {
    const targetStudent = students.find(s => s.id === id);
    if (targetStudent) {
      setGroups(prev => prev.map(g => g.id === targetStudent.groupId ? { ...g, currentStudentsCount: Math.max(0, g.currentStudentsCount - 1) } : g));
    }
    setStudents(prev => prev.filter(s => s.id !== id));
    if (selectedStudentId === id) setSelectedStudentId(null);
  };

  const recordPayment = ({
    studentId,
    month,
    amount,
    discount = 0,
    method,
    notes
  }: {
    studentId: string;
    month: string;
    amount: number;
    discount?: number;
    method: PaymentMethod;
    notes?: string;
  }) => {
    const receiptNo = `REC-2025-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split('T')[0];

    setStudents(prev => prev.map(student => {
      if (student.id !== studentId) return student;

      const currentPayment = student.payments[month] || { status: 'Unpaid', amountPaid: 0, discount: 0 };
      const status: PaymentStatus = discount > 0 ? 'Discount' : 'Paid';

      return {
        ...student,
        payments: {
          ...student.payments,
          [month]: {
            ...currentPayment,
            status,
            amountPaid: amount,
            discount,
            paymentDate: today,
            method,
            receiptNo
          }
        }
      };
    }));

    const targetStudent = students.find(s => s.id === studentId);
    if (targetStudent) {
      const newNotif: NotificationItem = {
        id: `NOTIF-${Date.now()}`,
        title: "Payment Recorded",
        message: `${settings.currencySymbol}${amount} paid for ${month} by ${targetStudent.fullName} (${method}).`,
        time: "Just now",
        type: "payment",
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  // Teacher Operations
  const addTeacher = (teacherData: Omit<Teacher, 'id' | 'groupsCount' | 'studentsCount' | 'rating'>) => {
    const newId = `TCH-${100 + teachers.length + 1}`;
    const newTeacher: Teacher = {
      ...teacherData,
      id: newId,
      groupsCount: 0,
      studentsCount: 0,
      rating: 5.0
    };
    setTeachers(prev => [newTeacher, ...prev]);
  };

  const updateTeacher = (id: string, updated: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
  };

  const deleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
    if (selectedTeacherId === id) setSelectedTeacherId(null);
  };

  // Group Operations
  const addGroup = (groupData: Omit<Group, 'id' | 'currentStudentsCount'>) => {
    const newId = `GRP-${String(groups.length + 1).padStart(2, '0')}`;
    const newGroup: Group = {
      ...groupData,
      id: newId,
      currentStudentsCount: 0
    };
    setGroups(prev => [newGroup, ...prev]);
  };

  const updateGroup = (id: string, updated: Partial<Group>) => {
    setGroups(prev => prev.map(g => g.id === id ? { ...g, ...updated } : g));
  };

  const deleteGroup = (id: string) => {
    setGroups(prev => prev.filter(g => g.id !== id));
    if (selectedGroupId === id) setSelectedGroupId(null);
  };

  // Expense Operations
  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newId = `EXP-${800 + expenses.length + 1}`;
    const newExpense: Expense = { ...expenseData, id: newId };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // Save Attendance
  const saveAttendance = (newRecords: Omit<AttendanceRecord, 'id'>[]) => {
    const formattedRecords: AttendanceRecord[] = newRecords.map((rec, idx) => ({
      ...rec,
      id: `ATT-${Date.now()}-${idx}`
    }));
    setAttendanceRecords(prev => [...formattedRecords, ...prev]);
  };

  // Notification Handling
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Financial Metrics Computation
  const financials = useMemo(() => {
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === 'Active').length;
    const newStudentsThisMonth = 14;

    let monthlyExpectedIncome = 0;
    let paidIncome = 0;
    let unpaidIncome = 0;

    const currentMonthKey = "August"; // Academic month August

    students.forEach(student => {
      monthlyExpectedIncome += student.monthlyFee;
      const paymentInfo = student.payments[currentMonthKey];
      if (paymentInfo) {
        if (paymentInfo.status === 'Paid' || paymentInfo.status === 'Discount') {
          paidIncome += paymentInfo.amountPaid;
        } else if (paymentInfo.status === 'Unpaid' || paymentInfo.status === 'Overdue') {
          unpaidIncome += student.monthlyFee;
        }
      }
    });

    const expensesTotal = expenses.reduce((acc, exp) => acc + exp.amount, 0);
    const netProfit = paidIncome - expensesTotal;
    const overallAttendancePercentage = 94.2;

    return {
      totalStudents,
      activeStudents,
      newStudentsThisMonth,
      monthlyExpectedIncome,
      paidIncome,
      unpaidIncome,
      expensesTotal,
      netProfit,
      overallAttendancePercentage
    };
  }, [students, expenses]);

  return (
    <CRMContext.Provider
      value={{
        activePage,
        setActivePage,
        searchQuery,
        setSearchQuery,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen,
        settings,
        updateSettings,
        students,
        teachers,
        groups,
        expenses,
        notifications,
        calendarEvents,
        attendanceRecords,
        addStudent,
        updateStudent,
        deleteStudent,
        recordPayment,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addGroup,
        updateGroup,
        deleteGroup,
        addExpense,
        deleteExpense,
        saveAttendance,
        markNotificationRead,
        clearAllNotifications,
        selectedStudentId,
        setSelectedStudentId,
        selectedTeacherId,
        setSelectedTeacherId,
        selectedGroupId,
        setSelectedGroupId,
        isAddStudentModalOpen,
        setIsAddStudentModalOpen,
        isReceivePaymentModalOpen,
        setIsReceivePaymentModalOpen,
        paymentModalDefaultStudentId,
        setPaymentModalDefaultStudentId,
        isAddTeacherModalOpen,
        setIsAddTeacherModalOpen,
        isAddGroupModalOpen,
        setIsAddGroupModalOpen,
        isAddExpenseModalOpen,
        setIsAddExpenseModalOpen,
        financials
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};
