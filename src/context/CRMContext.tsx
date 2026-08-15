import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from 'react';

import {
  Student,
  Teacher,
  Group,
  Expense,
  NotificationItem,
  CalendarEvent,
  CenterSettings,
  PageType,
  PaymentStatus,
  PaymentMethod,
  AttendanceRecord,
} from '../types/crm';

import { isSupabaseConfigured } from '../lib/supabase';
import { migrateSeedDataIfNeeded } from '../services/migrationService';

import {
  fetchAllCrmData,

  insertStudent,
  updateStudentInDb,
  deleteStudentFromDb,
  updateGroupStudentCount,

  upsertPayment,

  insertTeacher,
  updateTeacherInDb,
  deleteTeacherFromDb,

  insertGroup,
  updateGroupInDb,
  deleteGroupFromDb,

  insertExpense,
  updateExpenseInDb,
  deleteExpenseFromDb,

  insertAttendanceRecords,

  insertNotification,
  markNotificationReadInDb,
  clearAllNotificationsInDb,

  upsertSettings,

  nextStudentId,
  nextTeacherId,
  nextGroupId,
  nextExpenseId,

  buildInitialPayments,
  generateReceiptNo,
} from '../services/crmService';

import {
  enrichGroupsWithCounts,
  enrichTeachersWithCounts,
} from '../lib/adapters';

import {
  getCurrentAcademicMonth,
  isCurrentCalendarMonth,
} from '../constants/academic';


// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT TYPE
// ─────────────────────────────────────────────────────────────────────────────

interface CRMContextType {
  activePage: PageType;
  setActivePage: (page: PageType) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;


  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  refreshData: () => Promise<void>;


  settings: CenterSettings;

  updateSettings: (
    newSettings: Partial<CenterSettings>
  ) => void;


  students: Student[];
  teachers: Teacher[];
  groups: Group[];

  expenses: Expense[];

  notifications: NotificationItem[];
  calendarEvents: CalendarEvent[];
  attendanceRecords: AttendanceRecord[];


  // STUDENTS
  addStudent: (
    student: Omit<Student, 'id' | 'payments'>
  ) => void;

  updateStudent: (
    id: string,
    updated: Partial<Student>
  ) => void;

  deleteStudent: (
    id: string
  ) => void;


  // PAYMENTS
  recordPayment: (params: {
    studentId: string;
    month: string;
    amount: number;
    discount?: number;
    method: PaymentMethod;
    notes?: string;
  }) => void;


  // TEACHERS
  addTeacher: (
    teacher: Omit<
      Teacher,
      'id' | 'groupsCount' | 'studentsCount' | 'rating'
    >
  ) => void;

  updateTeacher: (
    id: string,
    updated: Partial<Teacher>
  ) => void;

  deleteTeacher: (
    id: string
  ) => void;


  // GROUPS
  addGroup: (
    group: Omit<
      Group,
      'id' | 'currentStudentsCount'
    >
  ) => void;

  updateGroup: (
    id: string,
    updated: Partial<Group>
  ) => void;

  deleteGroup: (
    id: string
  ) => void;


  // EXPENSES
  addExpense: (
    expense: Omit<Expense, 'id'>
  ) => void;

  updateExpense: (
    id: string,
    updated: Partial<Expense>
  ) => void;

  deleteExpense: (
    id: string
  ) => void;


  // ATTENDANCE
  saveAttendance: (
    records: Omit<AttendanceRecord, 'id'>[]
  ) => void;


  // NOTIFICATIONS
  markNotificationRead: (
    id: string
  ) => void;

  clearAllNotifications: () => void;


  // SELECTED ITEMS
  selectedStudentId: string | null;

  setSelectedStudentId: (
    id: string | null
  ) => void;


  selectedTeacherId: string | null;

  setSelectedTeacherId: (
    id: string | null
  ) => void;


  selectedGroupId: string | null;

  setSelectedGroupId: (
    id: string | null
  ) => void;


  // MODALS
  isAddStudentModalOpen: boolean;

  setIsAddStudentModalOpen: (
    open: boolean
  ) => void;


  isReceivePaymentModalOpen: boolean;

  setIsReceivePaymentModalOpen: (
    open: boolean
  ) => void;


  paymentModalDefaultStudentId:
    string | null;

  setPaymentModalDefaultStudentId: (
    id: string | null
  ) => void;


  isAddTeacherModalOpen: boolean;

  setIsAddTeacherModalOpen: (
    open: boolean
  ) => void;


  isAddGroupModalOpen: boolean;

  setIsAddGroupModalOpen: (
    open: boolean
  ) => void;


  isAddExpenseModalOpen: boolean;

  setIsAddExpenseModalOpen: (
    open: boolean
  ) => void;


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

    currentAcademicMonth: string;

    unpaidCount: number;
  };
}


// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

const CRMContext =
  createContext<CRMContextType | undefined>(
    undefined
  );


// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

export const CRMProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {


  // ───────────────────────────────────────────────────────────────────────────
  // UI STATE
  // ───────────────────────────────────────────────────────────────────────────

  const [
    activePage,
    setActivePage,
  ] = useState<PageType>('dashboard');


  const [
    searchQuery,
    setSearchQuery,
  ] = useState('');


  const [
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
  ] = useState(false);


  // ───────────────────────────────────────────────────────────────────────────
  // SYSTEM STATE
  // ───────────────────────────────────────────────────────────────────────────

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);


  const [
    isInitialized,
    setIsInitialized,
  ] = useState(false);


  const [
    error,
    setError,
  ] = useState<string | null>(null);


  // ───────────────────────────────────────────────────────────────────────────
  // SETTINGS
  // ───────────────────────────────────────────────────────────────────────────

  const [
    settings,
    setSettings,
  ] = useState<CenterSettings>({
    centerName:
      'LYUMOS International Education Center',

    tagline:
      'Empowering Next Generation Achievers',

    phone: '',
    email: '',
    address: '',

    currency: 'USD',
    currencySymbol: '$',

    academicYear:
      '2025 - 2026',

    language: 'en',
    theme: 'light',

    enableSmsNotifications: true,
    autoRemindUnpaid: true,

    discountPolicyMax: 25,
  });


  // ───────────────────────────────────────────────────────────────────────────
  // MAIN DATA
  // ───────────────────────────────────────────────────────────────────────────

  const [
    students,
    setStudents,
  ] = useState<Student[]>([]);


  const [
    teachers,
    setTeachers,
  ] = useState<Teacher[]>([]);


  const [
    groups,
    setGroups,
  ] = useState<Group[]>([]);


  const [
    expenses,
    setExpenses,
  ] = useState<Expense[]>([]);


  const [
    notifications,
    setNotifications,
  ] = useState<NotificationItem[]>([]);


  const [
    calendarEvents,
    setCalendarEvents,
  ] = useState<CalendarEvent[]>([]);


  const [
    attendanceRecords,
    setAttendanceRecords,
  ] = useState<AttendanceRecord[]>([]);


  // ───────────────────────────────────────────────────────────────────────────
  // SELECTED ITEMS
  // ───────────────────────────────────────────────────────────────────────────

  const [
    selectedStudentId,
    setSelectedStudentId,
  ] = useState<string | null>(null);


  const [
    selectedTeacherId,
    setSelectedTeacherId,
  ] = useState<string | null>(null);


  const [
    selectedGroupId,
    setSelectedGroupId,
  ] = useState<string | null>(null);


  // ───────────────────────────────────────────────────────────────────────────
  // MODALS
  // ───────────────────────────────────────────────────────────────────────────

  const [
    isAddStudentModalOpen,
    setIsAddStudentModalOpen,
  ] = useState(false);


  const [
    isReceivePaymentModalOpen,
    setIsReceivePaymentModalOpen,
  ] = useState(false);


  const [
    paymentModalDefaultStudentId,
    setPaymentModalDefaultStudentId,
  ] = useState<string | null>(null);


  const [
    isAddTeacherModalOpen,
    setIsAddTeacherModalOpen,
  ] = useState(false);


  const [
    isAddGroupModalOpen,
    setIsAddGroupModalOpen,
  ] = useState(false);


  const [
    isAddExpenseModalOpen,
    setIsAddExpenseModalOpen,
  ] = useState(false);


  // ───────────────────────────────────────────────────────────────────────────
  // APPLY CRM DATA
  // ───────────────────────────────────────────────────────────────────────────

  const applyCrmData = useCallback(
    (
      data: Awaited<
        ReturnType<typeof fetchAllCrmData>
      >
    ) => {
      setStudents(data.students);
      setTeachers(data.teachers);
      setGroups(data.groups);

      setExpenses(data.expenses);

      setNotifications(
        data.notifications
      );

      setCalendarEvents(
        data.calendarEvents
      );

      setAttendanceRecords(
        data.attendanceRecords
      );

      setSettings(
        data.settings
      );
    },
    []
  );


  // ───────────────────────────────────────────────────────────────────────────
  // REFRESH DATA
  // ───────────────────────────────────────────────────────────────────────────

  const refreshData =
    useCallback(async () => {

      if (!isSupabaseConfigured) {
        setError(
          'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local'
        );

        setIsLoading(false);

        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await migrateSeedDataIfNeeded();

        const data =
          await fetchAllCrmData();

        applyCrmData(data);

        setIsInitialized(true);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load CRM data'
        );
      } finally {
        setIsLoading(false);
      }

    }, [applyCrmData]);


  // ───────────────────────────────────────────────────────────────────────────
  // INITIAL LOAD
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    refreshData();
  }, [refreshData]);


  // ───────────────────────────────────────────────────────────────────────────
  // ERROR HANDLER
  // ───────────────────────────────────────────────────────────────────────────

  const handleAsyncError = (
    err: unknown,
    rollback?: () => void
  ) => {
    rollback?.();

    setError(
      err instanceof Error
        ? err.message
        : 'Operation failed'
    );
  };


  // ───────────────────────────────────────────────────────────────────────────
  // SETTINGS
  // ───────────────────────────────────────────────────────────────────────────

  const updateSettings = (
    newSettings:
      Partial<CenterSettings>
  ) => {

    const merged = {
      ...settings,
      ...newSettings,
    };

    setSettings(merged);

    upsertSettings(merged)
      .catch(err =>
        handleAsyncError(
          err,
          () =>
            setSettings(settings)
        )
      );
  };


  // ───────────────────────────────────────────────────────────────────────────
  // STUDENT CREATE
  // ───────────────────────────────────────────────────────────────────────────

  const addStudent = (
    newStudentData:
      Omit<
        Student,
        'id' | 'payments'
      >
  ) => {

    const newId =
      nextStudentId(students);


    const initialPayments =
      buildInitialPayments();


    const newStudent:
      Student = {

      ...newStudentData,

      id: newId,

      payments:
        initialPayments,
    };


    setStudents(prev => [
      newStudent,
      ...prev,
    ]);


    setGroups(prev =>
      enrichGroupsWithCounts(

        prev.map(group =>
          group.id ===
          newStudent.groupId

            ? {
                ...group,

                currentStudentsCount:
                  group.currentStudentsCount + 1,
              }

            : group
        ),

        [
          newStudent,
          ...students,
        ]
      )
    );


    const newNotif:
      NotificationItem = {

      id:
        `NOTIF-${Date.now()}`,

      title:
        'New Student Enrolled',

      message:
        `${newStudent.fullName} joined ${newStudent.groupName}.`,

      time:
        'Just now',

      type:
        'student',

      read:
        false,
    };


    setNotifications(
      prev => [
        newNotif,
        ...prev,
      ]
    );


    insertStudent(
      newStudent,
      initialPayments
    )

      .then(() =>
        updateGroupStudentCount(
          newStudent.groupId,
          1
        )
      )

      .then(() =>
        insertNotification(
          newNotif
        )
      )

      .catch(err =>
        handleAsyncError(
          err,
          () => refreshData()
        )
      );
  };


  // ───────────────────────────────────────────────────────────────────────────
  // STUDENT UPDATE
  // ───────────────────────────────────────────────────────────────────────────

  const updateStudent = (
    id: string,
    updated:
      Partial<Student>
  ) => {

    const prevStudents =
      students;


    setStudents(prev =>
      prev.map(student =>
        student.id === id

          ? {
              ...student,
              ...updated,
            }

          : student
      )
    );


    updateStudentInDb(
      id,
      updated
    )
      .catch(err =>
        handleAsyncError(
          err,
          () =>
            setStudents(
              prevStudents
            )
        )
      );
  };


  // ───────────────────────────────────────────────────────────────────────────
  // STUDENT DELETE
  // ───────────────────────────────────────────────────────────────────────────

  const deleteStudent = (
    id: string
  ) => {

    const targetStudent =
      students.find(
        student =>
          student.id === id
      );


    const prevStudents =
      students;


    const prevGroups =
      groups;


    if (targetStudent) {

      setGroups(prev =>
        enrichGroupsWithCounts(

          prev.map(group =>
            group.id ===
            targetStudent.groupId

              ? {
                  ...group,

                  currentStudentsCount:
                    Math.max(
                      0,
                      group.currentStudentsCount - 1
                    ),
                }

              : group
          ),

          students.filter(
            student =>
              student.id !== id
          )
        )
      );
    }


    setStudents(prev =>
      prev.filter(
        student =>
          student.id !== id
      )
    );


    if (
      selectedStudentId === id
    ) {
      setSelectedStudentId(null);
    }


    deleteStudentFromDb(id)

      .then(() =>
        targetStudent &&
        updateGroupStudentCount(
          targetStudent.groupId,
          -1
        )
      )

      .catch(err =>
        handleAsyncError(
          err,
          () => {
            setStudents(
              prevStudents
            );

            setGroups(
              prevGroups
            );
          }
        )
      );
  };


  // ───────────────────────────────────────────────────────────────────────────
  // PAYMENT
  // ───────────────────────────────────────────────────────────────────────────

  const recordPayment = ({
    studentId,
    month,
    amount,
    discount = 0,
    method,
    notes,
  }: {
    studentId: string;
    month: string;
    amount: number;
    discount?: number;
    method: PaymentMethod;
    notes?: string;
  }) => {

    const receiptNo =
      generateReceiptNo();


    const today =
      new Date()
        .toISOString()
        .split('T')[0];


    const status:
      PaymentStatus =
        discount > 0
          ? 'Discount'
          : 'Paid';


    const prevStudents =
      students;


    setStudents(prev =>
      prev.map(student => {

        if (
          student.id !==
          studentId
        ) {
          return student;
        }


        const currentPayment =
          student.payments[
            month
          ] || {

            status:
              'Unpaid' as PaymentStatus,

            amountPaid:
              0,

            discount:
              0,
          };


        return {
          ...student,

          payments: {
            ...student.payments,

            [month]: {
              ...currentPayment,

              status,

              amountPaid:
                amount,

              discount,

              paymentDate:
                today,

              method,

              receiptNo,
            },
          },
        };
      })
    );


    const targetStudent =
      students.find(
        student =>
          student.id ===
          studentId
      );


    const paymentData = {
      status,
      amountPaid: amount,
      discount,
      paymentDate: today,
      method,
      receiptNo,
    };


    if (targetStudent) {

      const newNotif:
        NotificationItem = {

        id:
          `NOTIF-${Date.now()}`,

        title:
          'Payment Recorded',

        message:
          `${settings.currencySymbol}${amount} paid for ${month} by ${targetStudent.fullName} (${method}).`,

        time:
          'Just now',

        type:
          'payment',

        read:
          false,
      };


      setNotifications(
        prev => [
          newNotif,
          ...prev,
        ]
      );


      insertNotification(
        newNotif
      )
        .catch(err =>
          handleAsyncError(
            err
          )
        );
    }


    upsertPayment(
      studentId,
      month,
      paymentData,
      notes
    )
      .catch(err =>
        handleAsyncError(
          err,
          () =>
            setStudents(
              prevStudents
            )
        )
      );
  };


  // ───────────────────────────────────────────────────────────────────────────
  // TEACHER CREATE
  // ───────────────────────────────────────────────────────────────────────────

  const addTeacher = (
    teacherData:
      Omit<
        Teacher,
        'id'
        | 'groupsCount'
        | 'studentsCount'
        | 'rating'
      >
  ) => {

    const newTeacher:
      Teacher = {

      ...teacherData,

      id:
        nextTeacherId(
          teachers
        ),

      groupsCount:
        0,

      studentsCount:
        0,

      rating:
        5.0,
    };


    setTeachers(prev => [
      newTeacher,
      ...prev,
    ]);


    insertTeacher(
      newTeacher
    )
      .catch(err =>
        handleAsyncError(
          err,
          () => refreshData()
        )
      );
  };


  // ───────────────────────────────────────────────────────────────────────────
  // TEACHER UPDATE
  // ───────────────────────────────────────────────────────────────────────────

  const updateTeacher = (
    id: string,
    updated:
      Partial<Teacher>
  ) => {

    const prevTeachers =
      teachers;


    setTeachers(prev =>
      prev.map(teacher =>
        teacher.id === id

          ? {
              ...teacher,
              ...updated,
            }

          : teacher
      )
    );


    updateTeacherInDb(
      id,
      updated
    )
      .catch(err =>
        handleAsyncError(
          err,
          () =>
            setTeachers(
              prevTeachers
            )
        )
      );
  };


  // ───────────────────────────────────────────────────────────────────────────
  // TEACHER DELETE
  // ───────────────────────────────────────────────────────────────────────────

  const deleteTeacher = (
    id: string
  ) => {

    const prevTeachers =
      teachers;


    setTeachers(prev =>
      prev.filter(
        teacher =>
          teacher.id !== id
      )
    );


    if (
      selectedTeacherId === id
    ) {
      setSelectedTeacherId(null);
    }


    deleteTeacherFromDb(id)
      .catch(err =>
        handleAsyncError(
          err,
          () =>
            setTeachers(
              prevTeachers
            )
        )
      );
  };


  // ───────────────────────────────────────────────────────────────────────────
  // GROUP CREATE
  // ───────────────────────────────────────────────────────────────────────────

  const addGroup = (
    groupData:
      Omit<
        Group,
        'id'
        | 'currentStudentsCount'
      >
  ) => {

    const newGroup:
      Group = {

      ...groupData,

      id:
        nextGroupId(
          groups
        ),

      currentStudentsCount:
        0,
    };


    setGroups(prev => [
      newGroup,
      ...prev,
    ]);


    insertGroup(
      newGroup
    )
      .catch(err =>
        handleAsyncError(
          err,
          () => refreshData()
        )
      );
  };


  // ───────────────────────────────────────────────────────────────────────────
  // GROUP UPDATE
  // ───────────────────────────────────────────────────────────────────────────

  const updateGroup = (
    id: string,
    updated:
      Partial<Group>
  ) => {

    const prevGroups =
      groups;


    setGroups(prev =>
      prev.map(group =>
        group.id === id

          ? {
              ...group,
              ...updated,
            }

          : group
      )
    );


    updateGroupInDb(
      id,
      updated
    )
      .catch(err =>
        handleAsyncError(
          err,
          () =>
            setGroups(
              prevGroups
            )
        )
      );
  };


  // ───────────────────────────────────────────────────────────────────────────
  // GROUP DELETE
  // ───────────────────────────────────────────────────────────────────────────

  const deleteGroup = (
    id: string
  ) => {

    const prevGroups =
      groups;


    setGroups(prev =>
      prev.filter(
        group =>
          group.id !== id
      )
    );


    if (
      selectedGroupId === id
    ) {
      setSelectedGroupId(null);
    }


    deleteGroupFromDb(id)
      .catch(err =>
        handleAsyncError(
          err,
          () =>
            setGroups(
              prevGroups
            )
        )
      );
  };


  // ───────────────────────────────────────────────────────────────────────────
  // EXPENSE CREATE
  // ───────────────────────────────────────────────────────────────────────────

  const addExpense = (
    expenseData:
      Omit<
        Expense,
        'id'
      >
  ) => {

    const newExpense:
      Expense = {

      ...expenseData,

      id:
        nextExpenseId(
          expenses
        ),
    };


    setExpenses(prev => [
      newExpense,
      ...prev,
    ]);


    insertExpense(
      newExpense
    )
      .catch(err =>
        handleAsyncError(
          err,
          () => refreshData()
        )
      );
  };


  // ───────────────────────────────────────────────────────────────────────────
  // EXPENSE UPDATE
  // ───────────────────────────────────────────────────────────────────────────

  const updateExpense = (
    id: string,
    updated:
      Partial<Expense>
  ) => {

    const prevExpenses =
      expenses;


    setExpenses(prev =>
      prev.map(expense =>
        expense.id === id

          ? {
              ...expense,
              ...updated,
            }

          : expense
      )
    );


    updateExpenseInDb(
      id,
      updated
    )
      .catch(err =>
        handleAsyncError(
          err,
          () =>
            setExpenses(
              prevExpenses
            )
        )
      );
  };


  // ───────────────────────────────────────────────────────────────────────────
  // EXPENSE DELETE
  // ───────────────────────────────────────────────────────────────────────────

  const deleteExpense = (
    id: string
  ) => {

    const prevExpenses =
      expenses;


    setExpenses(prev =>
      prev.filter(
        expense =>
          expense.id !== id
      )
    );


    deleteExpenseFromDb(id)
      .catch(err =>
        handleAsyncError(
          err,
          () =>
            setExpenses(
              prevExpenses
            )
        )
      );
  };


  // ───────────────────────────────────────────────────────────────────────────
  // ATTENDANCE
  // ───────────────────────────────────────────────────────────────────────────

  const saveAttendance = (
    newRecords: Omit<AttendanceRecord, 'id'>[]
  ) => {

    const prevAttendanceRecords =
      attendanceRecords;


    const timestamp =
      Date.now();


    const existingByKey =
      new Map(
        attendanceRecords.map(record => [
          `${record.studentId}__${record.date}`,
          record,
        ])
      );


    const formattedRecords:
      AttendanceRecord[] =
        newRecords.map(
          (record, index) => {

            const key =
              `${record.studentId}__${record.date}`;


            const existingRecord =
              existingByKey.get(key);


            return {
              ...record,

              id:
                existingRecord?.id ??
                `ATT-${timestamp}-${index}`,
            };
          }
        );


    setAttendanceRecords(prev => {

      const updatedKeys =
        new Set(
          formattedRecords.map(
            record =>
              `${record.studentId}__${record.date}`
          )
        );


      const untouchedRecords =
        prev.filter(
          record =>
            !updatedKeys.has(
              `${record.studentId}__${record.date}`
            )
        );


      return [
        ...formattedRecords,
        ...untouchedRecords,
      ];
    });


    insertAttendanceRecords(
      formattedRecords
    )
      .catch(err =>
        handleAsyncError(
          err,
          () =>
            setAttendanceRecords(
              prevAttendanceRecords
            )
        )
      );
  };


  // ───────────────────────────────────────────────────────────────────────────
  // NOTIFICATION READ
  // ───────────────────────────────────────────────────────────────────────────

  const markNotificationRead = (
    id: string
  ) => {

    setNotifications(prev =>
      prev.map(
        notification =>
          notification.id === id

            ? {
                ...notification,
                read: true,
              }

            : notification
      )
    );


    markNotificationReadInDb(
      id
    )
      .catch(err =>
        handleAsyncError(
          err
        )
      );
  };


  // ───────────────────────────────────────────────────────────────────────────
  // CLEAR NOTIFICATIONS
  // ───────────────────────────────────────────────────────────────────────────

  const clearAllNotifications = () => {

    const prev =
      notifications;


    setNotifications([]);


    clearAllNotificationsInDb()
      .catch(err =>
        handleAsyncError(
          err,
          () =>
            setNotifications(
              prev
            )
        )
      );
  };


  // ───────────────────────────────────────────────────────────────────────────
  // FINANCIAL CALCULATIONS
  // ───────────────────────────────────────────────────────────────────────────

  const financials =
    useMemo(() => {

      const totalStudents =
        students.length;


      const activeStudents =
        students.filter(
          student =>
            student.status ===
            'Active'
        ).length;


      const newStudentsThisMonth =
        students.filter(
          student =>
            isCurrentCalendarMonth(
              student.joinedDate
            )
        ).length;


      const currentAcademicMonth =
        getCurrentAcademicMonth();


      let monthlyExpectedIncome =
        0;


      let paidIncome =
        0;


      let unpaidIncome =
        0;


      let unpaidCount =
        0;


      students.forEach(
        student => {

          if (
            student.status !==
              'Active'
            &&
            student.status !==
              'Trial'
          ) {
            return;
          }


          monthlyExpectedIncome +=
            student.monthlyFee;


          const paymentInfo =
            student.payments[
              currentAcademicMonth
            ];


          if (paymentInfo) {

            if (
              paymentInfo.status ===
                'Paid'
              ||
              paymentInfo.status ===
                'Discount'
            ) {

              paidIncome +=
                paymentInfo.amountPaid;

            } else if (
              paymentInfo.status ===
                'Unpaid'
              ||
              paymentInfo.status ===
                'Overdue'
            ) {

              unpaidIncome +=
                student.monthlyFee;


              unpaidCount +=
                1;
            }
          }
        }
      );


      const expensesTotal =
        expenses.reduce(
          (
            accumulator,
            expense
          ) =>
            accumulator +
            expense.amount,
          0
        );


      const netProfit =
        paidIncome -
        expensesTotal;


      let overallAttendancePercentage =
        0;


      if (
        attendanceRecords.length >
        0
      ) {

        const present =
          attendanceRecords.filter(
            record =>
              record.status ===
                'Present'
              ||
              record.status ===
                'Late'
          ).length;


        overallAttendancePercentage =
          Math.round(
            (
              present /
              attendanceRecords.length
            ) *
            1000
          ) / 10;
      }


      return {
        totalStudents,

        activeStudents,

        newStudentsThisMonth,

        monthlyExpectedIncome,

        paidIncome,

        unpaidIncome,

        expensesTotal,

        netProfit,

        overallAttendancePercentage,

        currentAcademicMonth,

        unpaidCount,
      };

    }, [
      students,
      expenses,
      attendanceRecords,
    ]);


  // ───────────────────────────────────────────────────────────────────────────
  // PROVIDER VALUE
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <CRMContext.Provider
      value={{
        activePage,
        setActivePage,

        searchQuery,
        setSearchQuery,

        isGlobalSearchOpen,
        setIsGlobalSearchOpen,

        isLoading,
        isInitialized,
        error,
        refreshData,

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
        updateExpense,
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

        financials,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};


// ─────────────────────────────────────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────────────────────────────────────

export const useCRM = () => {

  const context =
    useContext(
      CRMContext
    );


  if (!context) {
    throw new Error(
      'useCRM must be used within a CRMProvider'
    );
  }


  return context;
};