import { requireSupabase } from '../lib/supabase';
import { isUuid } from '../lib/ids';

import {
  Student,
  Teacher,
  Group,
  Expense,
  NotificationItem,
  CalendarEvent,
  CenterSettings,
  AttendanceRecord,
  PaymentStatus,
} from '../types/crm';

import {
  DbTeacher,
  DbGroup,
  DbStudent,
  DbPayment,
  DbExpense,
  DbNotification,
  DbCalendarEvent,
  DbCenterSettings,
  DbAttendance,
} from '../types/database';

import {
  buildStudents,
  studentToDbInsert,
  teacherToDbInsert,
  groupToDbInsert,
  paymentToDbInsert,
  expenseToDbInsert,
  notificationToDbInsert,
  calendarEventToDbInsert,
  settingsToDb,
  dbTeacherToFrontend,
  dbExpenseToFrontend,
  dbNotificationToFrontend,
  dbCalendarEventToFrontend,
  dbSettingsToFrontend,
  enrichGroupsWithCounts,
  enrichTeachersWithCounts,
  mapGroupsToFrontend,
  mapAttendanceToFrontend,
  attendanceToDbInsert,
} from '../lib/adapters';

import { resolveEntityUuid } from '../lib/entityResolver';
import { ACADEMIC_MONTHS } from '../constants/academic';
import { initialSettings } from '../data/initialData';


const SETTINGS_CODE = 'default';


// ─────────────────────────────────────────────────────────────────────────────
// CRM DATA TYPE
// ─────────────────────────────────────────────────────────────────────────────

export interface CrmData {
  students: Student[];
  teachers: Teacher[];
  groups: Group[];
  expenses: Expense[];
  notifications: NotificationItem[];
  calendarEvents: CalendarEvent[];
  attendanceRecords: AttendanceRecord[];
  settings: CenterSettings;
}


// ─────────────────────────────────────────────────────────────────────────────
// FETCH ALL CRM DATA
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchAllCrmData(): Promise<CrmData> {
  const client = requireSupabase();

  const [
    teachersRes,
    groupsRes,
    studentsRes,
    paymentsRes,
    expensesRes,
    notificationsRes,
    calendarRes,
    attendanceRes,
    settingsRes,
  ] = await Promise.all([
    client
      .from('teachers')
      .select('*'),

    client
      .from('groups')
      .select('*'),

    client
      .from('students')
      .select('*'),

    client
      .from('payments')
      .select('*'),

    client
      .from('expenses')
      .select('*'),

    client
      .from('notifications')
      .select('*')
      .order('time', { ascending: false }),

    client
      .from('calendar_events')
      .select('*')
      .order('date', { ascending: true }),

    client
      .from('attendance')
      .select('*')
      .order('date', { ascending: false }),

    client
      .from('center_settings')
      .select('*')
      .eq('code', SETTINGS_CODE)
      .maybeSingle(),
  ]);

  const errors = [
    teachersRes.error,
    groupsRes.error,
    studentsRes.error,
    paymentsRes.error,
    expensesRes.error,
    notificationsRes.error,
    calendarRes.error,
    attendanceRes.error,
    settingsRes.error,
  ].filter(Boolean);

  if (errors.length > 0) {
    throw new Error(
      errors
        .map(error => error!.message)
        .join('; ')
    );
  }

  const dbTeachers =
    teachersRes.data as DbTeacher[];

  const dbGroups =
    groupsRes.data as DbGroup[];

  const dbStudents =
    studentsRes.data as DbStudent[];


  let teachers =
    dbTeachers.map(
      dbTeacherToFrontend
    );


  let groups =
    mapGroupsToFrontend(
      dbGroups,
      dbTeachers
    );


  const students =
    buildStudents(
      dbStudents,
      paymentsRes.data as DbPayment[],
      dbGroups,
      dbTeachers
    );


  groups =
    enrichGroupsWithCounts(
      groups,
      students
    );


  teachers =
    enrichTeachersWithCounts(
      teachers,
      groups,
      students
    );


  const settings =
    settingsRes.data
      ? dbSettingsToFrontend(
          settingsRes.data as DbCenterSettings
        )
      : initialSettings;


  return {
    students,

    teachers,

    groups,

    expenses:
      (
        expensesRes.data as DbExpense[]
      ).map(
        dbExpenseToFrontend
      ),

    notifications:
      (
        notificationsRes.data as DbNotification[]
      ).map(
        dbNotificationToFrontend
      ),

    calendarEvents:
      (
        calendarRes.data as DbCalendarEvent[]
      ).map(
        dbCalendarEventToFrontend
      ),

    attendanceRecords:
      mapAttendanceToFrontend(
        attendanceRes.data as DbAttendance[],
        dbGroups,
        dbStudents
      ),

    settings,
  };
}


// ─────────────────────────────────────────────────────────────────────────────
// STUDENTS
// ─────────────────────────────────────────────────────────────────────────────

export async function insertStudent(
  student: Student,
  initialPayments: Student['payments']
): Promise<Student> {

  const client =
    requireSupabase();


  const groupUuid =
    await resolveEntityUuid(
      'groups',
      student.groupId
    );


  const teacherUuid =
    await resolveEntityUuid(
      'teachers',
      student.teacherId
    );


  const {
    data: inserted,
    error: studentError,
  } =
    await client
      .from('students')
      .insert(
        studentToDbInsert(
          student,
          groupUuid,
          teacherUuid
        )
      )
      .select('id')
      .single();


  if (studentError) {
    throw new Error(
      studentError.message
    );
  }


  const studentUuid =
    inserted.id;


  const paymentRows =
    ACADEMIC_MONTHS.map(
      month =>
        paymentToDbInsert(
          studentUuid,
          student.id,
          month,
          initialPayments[month]
        )
    );


  const {
    error: payError,
  } =
    await client
      .from('payments')
      .upsert(
        paymentRows,
        {
          onConflict: 'code',
        }
      );


  if (payError) {
    throw new Error(
      payError.message
    );
  }


  return student;
}


export async function updateStudentInDb(
  id: string,
  updated: Partial<Student>
): Promise<void> {

  const client =
    requireSupabase();


  const studentUuid =
    await resolveEntityUuid(
      'students',
      id
    );


  const patch:
    Record<string, unknown> = {};


  if (
    updated.fullName !== undefined
  ) {
    patch.full_name =
      updated.fullName;
  }


  if (
    updated.avatar !== undefined
  ) {
    patch.avatar =
      updated.avatar;
  }


  if (
    updated.birthDate !== undefined
  ) {
    patch.birth_date =
      updated.birthDate;
  }


  if (
    updated.gender !== undefined
  ) {
    patch.gender =
      updated.gender;
  }


  if (
    updated.phone !== undefined
  ) {
    patch.phone =
      updated.phone;
  }


  if (
    updated.email !== undefined
  ) {
    patch.email =
      updated.email;
  }


  if (
    updated.parentName !== undefined
  ) {
    patch.parent_name =
      updated.parentName;
  }


  if (
    updated.parentPhone !== undefined
  ) {
    patch.parent_phone =
      updated.parentPhone;
  }


  if (
    updated.groupId !== undefined
  ) {
    patch.group_id =
      await resolveEntityUuid(
        'groups',
        updated.groupId
      );
  }


  if (
    updated.teacherId !== undefined
  ) {
    patch.teacher_id =
      await resolveEntityUuid(
        'teachers',
        updated.teacherId
      );
  }


  if (
    updated.monthlyFee !== undefined
  ) {
    patch.monthly_fee =
      updated.monthlyFee;
  }


  if (
    updated.status !== undefined
  ) {
    patch.status =
      updated.status;
  }


  if (
    updated.joinedDate !== undefined
  ) {
    patch.joined_date =
      updated.joinedDate;
  }


  if (
    updated.address !== undefined
  ) {
    patch.address =
      updated.address ?? null;
  }


  if (
    updated.notes !== undefined
  ) {
    patch.notes =
      updated.notes ?? null;
  }


  if (
    Object.keys(patch).length === 0
  ) {
    return;
  }


  const { error } =
    await client
      .from('students')
      .update(patch)
      .eq(
        'id',
        studentUuid
      );


  if (error) {
    throw new Error(
      error.message
    );
  }
}


export async function deleteStudentFromDb(
  id: string
): Promise<void> {

  const client =
    requireSupabase();


  const studentUuid =
    await resolveEntityUuid(
      'students',
      id
    );


  await client
    .from('payments')
    .delete()
    .eq(
      'student_id',
      studentUuid
    );


  const { error } =
    await client
      .from('students')
      .delete()
      .eq(
        'id',
        studentUuid
      );


  if (error) {
    throw new Error(
      error.message
    );
  }
}


export async function updateGroupStudentCount(
  groupId: string,
  delta: number
): Promise<void> {

  const client =
    requireSupabase();


  const groupUuid =
    await resolveEntityUuid(
      'groups',
      groupId
    );


  const {
    data,
    error: fetchError,
  } =
    await client
      .from('groups')
      .select(
        'current_students_count'
      )
      .eq(
        'id',
        groupUuid
      )
      .single();


  if (fetchError) {
    throw new Error(
      fetchError.message
    );
  }


  const current =
    Number(
      data.current_students_count
    );


  const { error } =
    await client
      .from('groups')
      .update({
        current_students_count:
          Math.max(
            0,
            current + delta
          ),
      })
      .eq(
        'id',
        groupUuid
      );


  if (error) {
    throw new Error(
      error.message
    );
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// PAYMENTS
// ─────────────────────────────────────────────────────────────────────────────

export async function upsertPayment(
  studentId: string,
  month: string,
  data: Student['payments'][string],
  notes?: string
): Promise<void> {

  const client =
    requireSupabase();


  const studentUuid =
    await resolveEntityUuid(
      'students',
      studentId
    );


  const row =
    paymentToDbInsert(
      studentUuid,
      studentId,
      month,
      data,
      notes
    );


  const { error } =
    await client
      .from('payments')
      .upsert(
        row,
        {
          onConflict: 'code',
        }
      );


  if (error) {
    throw new Error(
      error.message
    );
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// TEACHERS
// ─────────────────────────────────────────────────────────────────────────────

export async function insertTeacher(
  teacher: Teacher
): Promise<void> {

  const client =
    requireSupabase();


  const { error } =
    await client
      .from('teachers')
      .insert(
        teacherToDbInsert(
          teacher
        )
      );


  if (error) {
    throw new Error(
      error.message
    );
  }
}


export async function updateTeacherInDb(
  id: string,
  updated: Partial<Teacher>
): Promise<void> {

  const client =
    requireSupabase();


  const teacherUuid =
    await resolveEntityUuid(
      'teachers',
      id
    );


  const patch:
    Record<string, unknown> = {};


  if (
    updated.fullName !== undefined
  ) {
    patch.full_name =
      updated.fullName;
  }


  if (
    updated.avatar !== undefined
  ) {
    patch.avatar =
      updated.avatar;
  }


  if (
    updated.phone !== undefined
  ) {
    patch.phone =
      updated.phone;
  }


  if (
    updated.email !== undefined
  ) {
    patch.email =
      updated.email;
  }


  if (
    updated.subjects !== undefined
  ) {
    patch.subjects =
      updated.subjects;
  }


  if (
    updated.baseSalary !== undefined
  ) {
    patch.base_salary =
      updated.baseSalary;
  }


  if (
    updated.bonusPerStudent !== undefined
  ) {
    patch.bonus_per_student =
      updated.bonusPerStudent;
  }


  if (
    updated.groupsCount !== undefined
  ) {
    patch.groups_count =
      updated.groupsCount;
  }


  if (
    updated.studentsCount !== undefined
  ) {
    patch.students_count =
      updated.studentsCount;
  }


  if (
    updated.joinedDate !== undefined
  ) {
    patch.joined_date =
      updated.joinedDate;
  }


  if (
    updated.rating !== undefined
  ) {
    patch.rating =
      updated.rating;
  }


  if (
    updated.schedule !== undefined
  ) {
    patch.schedule =
      updated.schedule;
  }


  if (
    updated.status !== undefined
  ) {
    patch.status =
      updated.status;
  }


  if (
    Object.keys(patch).length === 0
  ) {
    return;
  }


  const { error } =
    await client
      .from('teachers')
      .update(patch)
      .eq(
        'id',
        teacherUuid
      );


  if (error) {
    throw new Error(
      error.message
    );
  }
}


export async function deleteTeacherFromDb(
  id: string
): Promise<void> {

  const client =
    requireSupabase();


  const teacherUuid =
    await resolveEntityUuid(
      'teachers',
      id
    );


  const { error } =
    await client
      .from('teachers')
      .delete()
      .eq(
        'id',
        teacherUuid
      );


  if (error) {
    throw new Error(
      error.message
    );
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// GROUPS
// ─────────────────────────────────────────────────────────────────────────────

export async function insertGroup(
  group: Group
): Promise<void> {

  const client =
    requireSupabase();


  const teacherUuid =
    await resolveEntityUuid(
      'teachers',
      group.teacherId
    );


  const { error } =
    await client
      .from('groups')
      .insert(
        groupToDbInsert(
          group,
          teacherUuid
        )
      );


  if (error) {
    throw new Error(
      error.message
    );
  }
}


export async function updateGroupInDb(
  id: string,
  updated: Partial<Group>
): Promise<void> {

  const client =
    requireSupabase();


  const groupUuid =
    await resolveEntityUuid(
      'groups',
      id
    );


  const patch:
    Record<string, unknown> = {};


  if (
    updated.name !== undefined
  ) {
    patch.name =
      updated.name;
  }


  if (
    updated.subject !== undefined
  ) {
    patch.subject =
      updated.subject;
  }


  if (
    updated.level !== undefined
  ) {
    patch.level =
      updated.level;
  }


  if (
    updated.teacherId !== undefined
  ) {
    patch.teacher_id =
      await resolveEntityUuid(
        'teachers',
        updated.teacherId
      );
  }


  if (
    updated.teacherName !== undefined
  ) {
    patch.teacher_name =
      updated.teacherName;
  }


  if (
    updated.scheduleDays !== undefined
  ) {
    patch.schedule_days =
      updated.scheduleDays;
  }


  if (
    updated.scheduleTime !== undefined
  ) {
    patch.schedule_time =
      updated.scheduleTime;
  }


  if (
    updated.room !== undefined
  ) {
    patch.room =
      updated.room;
  }


  if (
    updated.monthlyFee !== undefined
  ) {
    patch.monthly_fee =
      updated.monthlyFee;
  }


  if (
    updated.maxCapacity !== undefined
  ) {
    patch.max_capacity =
      updated.maxCapacity;
  }


  if (
    updated.currentStudentsCount !== undefined
  ) {
    patch.current_students_count =
      updated.currentStudentsCount;
  }


  if (
    updated.status !== undefined
  ) {
    patch.status =
      updated.status;
  }


  if (
    Object.keys(patch).length === 0
  ) {
    return;
  }


  const { error } =
    await client
      .from('groups')
      .update(patch)
      .eq(
        'id',
        groupUuid
      );


  if (error) {
    throw new Error(
      error.message
    );
  }
}


export async function deleteGroupFromDb(
  id: string
): Promise<void> {

  const client =
    requireSupabase();


  const groupUuid =
    await resolveEntityUuid(
      'groups',
      id
    );


  const { error } =
    await client
      .from('groups')
      .delete()
      .eq(
        'id',
        groupUuid
      );


  if (error) {
    throw new Error(
      error.message
    );
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// EXPENSES
// ─────────────────────────────────────────────────────────────────────────────

export async function insertExpense(
  expense: Expense
): Promise<void> {

  const client =
    requireSupabase();


  const { error } =
    await client
      .from('expenses')
      .insert(
        expenseToDbInsert(
          expense
        )
      );


  if (error) {
    throw new Error(
      error.message
    );
  }
}


export async function updateExpenseInDb(
  id: string,
  updated: Partial<Expense>
): Promise<void> {

  const client =
    requireSupabase();


  const patch:
    Record<string, unknown> = {};


  if (
    updated.title !== undefined
  ) {
    patch.title =
      updated.title;
  }


  if (
    updated.category !== undefined
  ) {
    patch.category =
      updated.category;
  }


  if (
    updated.amount !== undefined
  ) {
    patch.amount =
      updated.amount;
  }


  if (
    updated.date !== undefined
  ) {
    patch.date =
      updated.date;
  }


  if (
    updated.paymentMethod !== undefined
  ) {
    patch.payment_method =
      updated.paymentMethod;
  }


  if (
    updated.requestedBy !== undefined
  ) {
    patch.requested_by =
      updated.requestedBy;
  }


  if (
    updated.notes !== undefined
  ) {
    patch.notes =
      updated.notes ?? null;
  }


  if (
    updated.receiptUrl !== undefined
  ) {
    patch.receipt_url =
      updated.receiptUrl ?? null;
  }


  if (
    Object.keys(patch).length === 0
  ) {
    return;
  }


  const query =
    isUuid(id)

      ? client
          .from('expenses')
          .update(patch)
          .eq(
            'id',
            id
          )

      : client
          .from('expenses')
          .update(patch)
          .eq(
            'code',
            id
          );


  const { error } =
    await query;


  if (error) {
    throw new Error(
      error.message
    );
  }
}


export async function deleteExpenseFromDb(
  id: string
): Promise<void> {

  const client =
    requireSupabase();


  if (isUuid(id)) {

    const { error } =
      await client
        .from('expenses')
        .delete()
        .eq(
          'id',
          id
        );


    if (error) {
      throw new Error(
        error.message
      );
    }


    return;
  }


  const { error } =
    await client
      .from('expenses')
      .delete()
      .eq(
        'code',
        id
      );


  if (error) {
    throw new Error(
      error.message
    );
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// ATTENDANCE
// ─────────────────────────────────────────────────────────────────────────────

export async function insertAttendanceRecords(
  records: AttendanceRecord[]
): Promise<void> {

  const client =
    requireSupabase();


  const rows =
    await Promise.all(

      records.map(
        async record => {

          const groupUuid =
            await resolveEntityUuid(
              'groups',
              record.groupId
            );


          const studentUuid =
            await resolveEntityUuid(
              'students',
              record.studentId
            );


          return attendanceToDbInsert(
            record,
            groupUuid,
            studentUuid
          );
        }
      )
    );


  const { error } =
    await client
      .from('attendance')
      .upsert(
        rows,
        {
          onConflict:
            'student_id,date',
        }
      );


  if (error) {
    throw new Error(
      error.message
    );
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

export async function insertNotification(
  notification: NotificationItem
): Promise<void> {

  const client =
    requireSupabase();


  const { error } =
    await client
      .from('notifications')
      .insert(
        notificationToDbInsert(
          notification
        )
      );


  if (error) {
    throw new Error(
      error.message
    );
  }
}


export async function markNotificationReadInDb(
  id: string
): Promise<void> {

  const client =
    requireSupabase();


  const query =
    isUuid(id)

      ? client
          .from('notifications')
          .update({
            read: true,
          })
          .eq(
            'id',
            id
          )

      : client
          .from('notifications')
          .update({
            read: true,
          })
          .eq(
            'code',
            id
          );


  const { error } =
    await query;


  if (error) {
    throw new Error(
      error.message
    );
  }
}


export async function clearAllNotificationsInDb():
Promise<void> {

  const client =
    requireSupabase();


  const { error } =
    await client
      .from('notifications')
      .delete()
      .neq(
        'id',
        '00000000-0000-0000-0000-000000000000'
      );


  if (error) {
    throw new Error(
      error.message
    );
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

export async function upsertSettings(
  settings: CenterSettings
): Promise<void> {

  const client =
    requireSupabase();


  const { error } =
    await client
      .from('center_settings')
      .upsert(
        settingsToDb(
          settings,
          SETTINGS_CODE
        ),
        {
          onConflict:
            'code',
        }
      );


  if (error) {
    throw new Error(
      error.message
    );
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// ID HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function nextStudentId(
  existing: Student[]
): string {

  const nums =
    existing
      .map(
        student =>
          parseInt(
            student.id.replace(
              'STU-',
              ''
            ),
            10
          )
      )
      .filter(
        number =>
          !Number.isNaN(
            number
          )
      );


  const max =
    nums.length > 0
      ? Math.max(...nums)
      : 1000;


  return `STU-${max + 1}`;
}


export function nextTeacherId(
  existing: Teacher[]
): string {

  const nums =
    existing
      .map(
        teacher =>
          parseInt(
            teacher.id.replace(
              'TCH-',
              ''
            ),
            10
          )
      )
      .filter(
        number =>
          !Number.isNaN(
            number
          )
      );


  const max =
    nums.length > 0
      ? Math.max(...nums)
      : 100;


  return `TCH-${max + 1}`;
}


export function nextGroupId(
  existing: Group[]
): string {

  const nums =
    existing
      .map(
        group =>
          parseInt(
            group.id.replace(
              'GRP-',
              ''
            ),
            10
          )
      )
      .filter(
        number =>
          !Number.isNaN(
            number
          )
      );


  const max =
    nums.length > 0
      ? Math.max(...nums)
      : 0;


  return `GRP-${String(
    max + 1
  ).padStart(
    2,
    '0'
  )}`;
}


export function nextExpenseId(
  existing: Expense[]
): string {

  const nums =
    existing
      .map(
        expense =>
          parseInt(
            expense.id.replace(
              'EXP-',
              ''
            ),
            10
          )
      )
      .filter(
        number =>
          !Number.isNaN(
            number
          )
      );


  const max =
    nums.length > 0
      ? Math.max(...nums)
      : 800;


  return `EXP-${max + 1}`;
}


// ─────────────────────────────────────────────────────────────────────────────
// INITIAL PAYMENT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function buildInitialPayments():
Student['payments'] {

  const payments:
    Student['payments'] = {};


  for (
    const month
    of ACADEMIC_MONTHS
  ) {

    payments[month] = {
      status:
        'Unpaid' as PaymentStatus,

      amountPaid:
        0,

      discount:
        0,
    };
  }


  return payments;
}


export function generateReceiptNo():
string {

  return `REC-${new Date().getFullYear()}-${Math.floor(
    1000 +
    Math.random() *
    9000
  )}`;
}