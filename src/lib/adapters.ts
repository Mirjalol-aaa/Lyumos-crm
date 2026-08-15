import {
  Student, Teacher, Group, Expense, NotificationItem,
  CalendarEvent, CenterSettings, AttendanceRecord,
  PaymentStatus, PaymentMethod, PageType,
} from '../types/crm';
import {
  DbStudent, DbTeacher, DbGroup, DbPayment, DbExpense,
  DbNotification, DbCalendarEvent, DbCenterSettings, DbAttendance,
  DbTeacherInsert, DbGroupInsert, DbStudentInsert, DbPaymentInsert,
  DbExpenseInsert, DbNotificationInsert, DbCalendarEventInsert, DbAttendanceInsert,
  DbCenterSettingsInsert,
} from '../types/database';
import { ACADEMIC_MONTHS } from '../constants/academic';
import { paymentCode } from './ids';

function businessId(code: string | null | undefined, uuid: string): string {
  return code ?? uuid;
}

function emptyPayments(): Student['payments'] {
  const payments: Student['payments'] = {};
  for (const month of ACADEMIC_MONTHS) {
    payments[month] = { status: 'Unpaid', amountPaid: 0, discount: 0 };
  }
  return payments;
}

export function dbPaymentToFrontend(p: DbPayment): { month: string; data: Student['payments'][string] } {
  return {
    month: p.month,
    data: {
      status: p.status as PaymentStatus,
      amountPaid: Number(p.amount_paid),
      discount: Number(p.discount),
      paymentDate: p.payment_date ?? undefined,
      method: (p.method as PaymentMethod) ?? undefined,
      receiptNo: p.receipt_no ?? undefined,
    },
  };
}

export function buildStudents(
  dbStudents: DbStudent[],
  dbPayments: DbPayment[],
  dbGroups: DbGroup[],
  dbTeachers: DbTeacher[],
): Student[] {
  const frontendGroups = dbGroups.map(dbGroupToFrontend);
  const frontendTeachers = dbTeachers.map(dbTeacherToFrontend);

  const groupByUuid = new Map<string, Group>();
  dbGroups.forEach((g, i) => groupByUuid.set(g.id, frontendGroups[i]));

  const teacherByUuid = new Map<string, Teacher>();
  dbTeachers.forEach((t, i) => teacherByUuid.set(t.id, frontendTeachers[i]));

  const paymentsByStudentUuid = new Map<string, DbPayment[]>();
  for (const p of dbPayments) {
    const list = paymentsByStudentUuid.get(p.student_id) ?? [];
    list.push(p);
    paymentsByStudentUuid.set(p.student_id, list);
  }

  return dbStudents.map(s => {
    const payments = emptyPayments();
    for (const p of paymentsByStudentUuid.get(s.id) ?? []) {
      const { month, data } = dbPaymentToFrontend(p);
      payments[month] = data;
    }

    const group = groupByUuid.get(s.group_id);
    const teacher = teacherByUuid.get(s.teacher_id);

    return {
      id: businessId(s.code, s.id),
      fullName: s.full_name,
      avatar: s.avatar,
      birthDate: s.birth_date,
      gender: s.gender as Student['gender'],
      phone: s.phone,
      email: s.email,
      parentName: s.parent_name,
      parentPhone: s.parent_phone,
      groupId: group?.id ?? s.group_id,
      groupName: group?.name ?? 'Unknown Group',
      teacherId: teacher?.id ?? s.teacher_id,
      teacherName: teacher?.fullName ?? group?.teacherName ?? 'Unknown Teacher',
      monthlyFee: Number(s.monthly_fee),
      status: s.status as Student['status'],
      joinedDate: s.joined_date,
      address: s.address ?? undefined,
      notes: s.notes ?? undefined,
      payments,
    };
  });
}

export function studentToDbInsert(
  s: Omit<Student, 'payments'> & Partial<Pick<Student, 'groupName' | 'teacherName'>>,
  groupUuid: string,
  teacherUuid: string,
): DbStudentInsert {
  return {
    code: s.id,
    full_name: s.fullName,
    avatar: s.avatar,
    birth_date: s.birthDate,
    gender: s.gender,
    phone: s.phone,
    email: s.email,
    parent_name: s.parentName,
    parent_phone: s.parentPhone,
    group_id: groupUuid,
    teacher_id: teacherUuid,
    monthly_fee: s.monthlyFee,
    status: s.status,
    joined_date: s.joinedDate,
    address: s.address ?? null,
    notes: s.notes ?? null,
  };
}

export function paymentToDbInsert(
  studentUuid: string,
  studentCode: string,
  month: string,
  data: Student['payments'][string],
  notes?: string,
): DbPaymentInsert {
  return {
    code: paymentCode(studentCode, month),
    student_id: studentUuid,
    month,
    status: data.status,
    amount_paid: data.amountPaid,
    discount: data.discount,
    payment_date: data.paymentDate ?? null,
    method: data.method ?? null,
    receipt_no: data.receiptNo ?? null,
    notes: notes ?? null,
  };
}

export function dbTeacherToFrontend(t: DbTeacher): Teacher {
  return {
    id: businessId(t.code, t.id),
    fullName: t.full_name,
    avatar: t.avatar,
    phone: t.phone,
    email: t.email,
    subjects: t.subjects ?? [],
    baseSalary: Number(t.base_salary),
    bonusPerStudent: Number(t.bonus_per_student),
    groupsCount: Number(t.groups_count),
    studentsCount: Number(t.students_count),
    joinedDate: t.joined_date,
    rating: Number(t.rating),
    schedule: t.schedule,
    status: t.status as Teacher['status'],
  };
}

export function teacherToDbInsert(t: Teacher): DbTeacherInsert {
  return {
    code: t.id,
    full_name: t.fullName,
    avatar: t.avatar,
    phone: t.phone,
    email: t.email,
    subjects: t.subjects,
    base_salary: t.baseSalary,
    bonus_per_student: t.bonusPerStudent,
    groups_count: t.groupsCount,
    students_count: t.studentsCount,
    joined_date: t.joinedDate,
    rating: t.rating,
    schedule: t.schedule,
    status: t.status,
  };
}

export function dbGroupToFrontend(g: DbGroup): Group {
  return {
    id: businessId(g.code, g.id),
    name: g.name,
    subject: g.subject,
    level: g.level,
    teacherId: g.teacher_id,
    teacherName: g.teacher_name,
    scheduleDays: g.schedule_days,
    scheduleTime: g.schedule_time,
    room: g.room,
    monthlyFee: Number(g.monthly_fee),
    maxCapacity: Number(g.max_capacity),
    currentStudentsCount: Number(g.current_students_count),
    status: g.status as Group['status'],
  };
}

/** Frontend group with teacher business code resolved to UUID for FK writes. */
export function groupToDbInsert(g: Group, teacherUuid: string): DbGroupInsert {
  return {
    code: g.id,
    name: g.name,
    subject: g.subject,
    level: g.level,
    teacher_id: teacherUuid,
    teacher_name: g.teacherName,
    schedule_days: g.scheduleDays,
    schedule_time: g.scheduleTime,
    room: g.room,
    monthly_fee: g.monthlyFee,
    max_capacity: g.maxCapacity,
    current_students_count: g.currentStudentsCount,
    status: g.status,
  };
}

/** Resolve teacher business code on a frontend group after DB read. */
export function resolveGroupTeacherId(
  g: DbGroup,
  teacherByUuid: Map<string, Teacher>,
): Group {
  const base = dbGroupToFrontend(g);
  const teacher = teacherByUuid.get(g.teacher_id);
  return teacher ? { ...base, teacherId: teacher.id } : base;
}

export function dbExpenseToFrontend(e: DbExpense): Expense {
  return {
    id: businessId(e.code, e.id),
    title: e.title,
    category: e.category as Expense['category'],
    amount: Number(e.amount),
    date: e.date,
    paymentMethod: e.payment_method,
    requestedBy: e.requested_by,
    notes: e.notes ?? undefined,
    receiptUrl: e.receipt_url ?? undefined,
  };
}

export function expenseToDbInsert(e: Expense): DbExpenseInsert {
  return {
    code: e.id,
    title: e.title,
    category: e.category,
    amount: e.amount,
    date: e.date,
    payment_method: e.paymentMethod,
    requested_by: e.requestedBy,
    notes: e.notes ?? null,
    receipt_url: e.receiptUrl ?? null,
  };
}

export function dbNotificationToFrontend(n: DbNotification): NotificationItem {
  return {
    id: businessId(n.code, n.id),
    title: n.title,
    message: n.message,
    time: n.time,
    type: n.type as NotificationItem['type'],
    read: n.read,
    linkTo: n.link_to_page
      ? { page: n.link_to_page as PageType, id: n.link_to_id ?? undefined }
      : undefined,
  };
}

export function notificationToDbInsert(n: NotificationItem): DbNotificationInsert {
  return {
    code: n.id,
    title: n.title,
    message: n.message,
    time: n.time,
    type: n.type,
    read: n.read,
    link_to_page: n.linkTo?.page ?? null,
    link_to_id: n.linkTo?.id ?? null,
  };
}

export function dbCalendarEventToFrontend(e: DbCalendarEvent): CalendarEvent {
  return {
    id: businessId(e.code, e.id),
    title: e.title,
    date: e.date,
    type: e.type as CalendarEvent['type'],
    time: e.time,
    description: e.description ?? undefined,
  };
}

export function calendarEventToDbInsert(e: CalendarEvent): DbCalendarEventInsert {
  return {
    code: e.id,
    title: e.title,
    date: e.date,
    type: e.type,
    time: e.time,
    description: e.description ?? null,
  };
}

export function dbSettingsToFrontend(s: DbCenterSettings): CenterSettings {
  return {
    centerName: s.center_name,
    tagline: s.tagline,
    phone: s.phone,
    email: s.email,
    address: s.address,
    currency: s.currency,
    currencySymbol: s.currency_symbol,
    academicYear: s.academic_year,
    language: s.language as CenterSettings['language'],
    theme: s.theme as CenterSettings['theme'],
    enableSmsNotifications: s.enable_sms_notifications,
    autoRemindUnpaid: s.auto_remind_unpaid,
    discountPolicyMax: Number(s.discount_policy_max),
  };
}

export function settingsToDb(
  s: CenterSettings,
  code = 'default',
): DbCenterSettingsInsert {
  return {
    code,
    center_name: s.centerName,
    tagline: s.tagline,
    phone: s.phone,
    email: s.email,
    address: s.address,
    currency: s.currency,
    currency_symbol: s.currencySymbol,
    academic_year: s.academicYear,
    language: s.language,
    theme: s.theme,
    enable_sms_notifications: s.enableSmsNotifications,
    auto_remind_unpaid: s.autoRemindUnpaid,
    discount_policy_max: s.discountPolicyMax,
  };
}

export function dbAttendanceToFrontend(a: DbAttendance): AttendanceRecord {
  return {
    id: businessId(a.code, a.id),
    date: a.date,
    groupId: a.group_id,
    studentId: a.student_id,
    studentName: a.student_name,
    status: a.status as AttendanceRecord['status'],
    note: a.note ?? undefined,
  };
}

export function attendanceToDbInsert(
  a: AttendanceRecord,
  groupUuid: string,
  studentUuid: string,
): DbAttendanceInsert {
  return {
    code: a.id,
    date: a.date,
    group_id: groupUuid,
    student_id: studentUuid,
    student_name: a.studentName,
    status: a.status,
    note: a.note ?? null,
  };
}

/** Recompute denormalized counts from live student/group data. */
export function enrichGroupsWithCounts(groups: Group[], students: Student[]): Group[] {
  const countByGroup = new Map<string, number>();
  for (const s of students) {
    if (s.status === 'Active' || s.status === 'Trial') {
      countByGroup.set(s.groupId, (countByGroup.get(s.groupId) ?? 0) + 1);
    }
  }
  return groups.map(g => ({
    ...g,
    currentStudentsCount: countByGroup.get(g.id) ?? g.currentStudentsCount,
  }));
}

export function enrichTeachersWithCounts(
  teachers: Teacher[],
  groups: Group[],
  students: Student[],
): Teacher[] {
  const groupsByTeacher = new Map<string, number>();
  const studentsByTeacher = new Map<string, number>();

  for (const g of groups) {
    groupsByTeacher.set(g.teacherId, (groupsByTeacher.get(g.teacherId) ?? 0) + 1);
  }
  for (const s of students) {
    if (s.status === 'Active' || s.status === 'Trial') {
      studentsByTeacher.set(s.teacherId, (studentsByTeacher.get(s.teacherId) ?? 0) + 1);
    }
  }

  return teachers.map(t => ({
    ...t,
    groupsCount: groupsByTeacher.get(t.id) ?? t.groupsCount,
    studentsCount: studentsByTeacher.get(t.id) ?? t.studentsCount,
  }));
}

/** Map raw DB groups to frontend groups with teacher business codes. */
export function mapGroupsToFrontend(
  dbGroups: DbGroup[],
  dbTeachers: DbTeacher[],
): Group[] {
  const frontendTeachers = dbTeachers.map(dbTeacherToFrontend);
  const teacherByUuid = new Map<string, Teacher>();
  dbTeachers.forEach((t, i) => teacherByUuid.set(t.id, frontendTeachers[i]));

  return dbGroups.map(g => resolveGroupTeacherId(g, teacherByUuid));
}

/** Map raw DB attendance rows to frontend records with business IDs. */
export function mapAttendanceToFrontend(
  dbRecords: DbAttendance[],
  dbGroups: DbGroup[],
  dbStudents: DbStudent[],
): AttendanceRecord[] {
  const groupCodeByUuid = new Map(dbGroups.map(g => [g.id, businessId(g.code, g.id)]));
  const studentCodeByUuid = new Map(dbStudents.map(s => [s.id, businessId(s.code, s.id)]));

  return dbRecords.map(a => ({
    id: businessId(a.code, a.id),
    date: a.date,
    groupId: groupCodeByUuid.get(a.group_id) ?? a.group_id,
    studentId: studentCodeByUuid.get(a.student_id) ?? a.student_id,
    studentName: a.student_name,
    status: a.status as AttendanceRecord['status'],
    note: a.note ?? undefined,
  }));
}
