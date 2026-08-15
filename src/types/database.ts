/** Supabase row shapes (snake_case). `id` is always the database UUID. */
export interface DbTeacher {
  id: string;
  code: string | null;
  full_name: string;
  avatar: string;
  phone: string;
  email: string;
  subjects: string[];
  base_salary: number;
  bonus_per_student: number;
  groups_count: number;
  students_count: number;
  joined_date: string;
  rating: number;
  schedule: string;
  status: string;
}

export interface DbGroup {
  id: string;
  code: string | null;
  name: string;
  subject: string;
  level: string;
  teacher_id: string;
  teacher_name: string;
  schedule_days: string;
  schedule_time: string;
  room: string;
  monthly_fee: number;
  max_capacity: number;
  current_students_count: number;
  status: string;
}

export interface DbStudent {
  id: string;
  code: string | null;
  full_name: string;
  avatar: string;
  birth_date: string;
  gender: string;
  phone: string;
  email: string;
  parent_name: string;
  parent_phone: string;
  group_id: string;
  teacher_id: string;
  monthly_fee: number;
  status: string;
  joined_date: string;
  address: string | null;
  notes: string | null;
}

export interface DbPayment {
  id: string;
  code: string | null;
  student_id: string;
  month: string;
  status: string;
  amount_paid: number;
  discount: number;
  payment_date: string | null;
  method: string | null;
  receipt_no: string | null;
  notes: string | null;
}

export interface DbAttendance {
  id: string;
  code: string | null;
  date: string;
  group_id: string;
  student_id: string;
  student_name: string;
  status: string;
  note: string | null;
}

export interface DbExpense {
  id: string;
  code: string | null;
  title: string;
  category: string;
  amount: number;
  date: string;
  payment_method: string;
  requested_by: string;
  notes: string | null;
  receipt_url: string | null;
}

export interface DbNotification {
  id: string;
  code: string | null;
  title: string;
  message: string;
  time: string;
  type: string;
  read: boolean;
  link_to_page: string | null;
  link_to_id: string | null;
}

export interface DbCalendarEvent {
  id: string;
  code: string | null;
  title: string;
  date: string;
  type: string;
  time: string;
  description: string | null;
}

export interface DbCenterSettings {
  id: string;
  code: string | null;
  center_name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  currency_symbol: string;
  academic_year: string;
  language: string;
  theme: string;
  enable_sms_notifications: boolean;
  auto_remind_unpaid: boolean;
  discount_policy_max: number;
}

/** Row payloads for inserts — UUID `id` is optional (DB default), `code` is required. */
export type DbTeacherInsert = Omit<DbTeacher, 'id' | 'code'> & { id?: string; code: string };
export type DbGroupInsert = Omit<DbGroup, 'id' | 'code'> & { id?: string; code: string };
export type DbStudentInsert = Omit<DbStudent, 'id' | 'code'> & { id?: string; code: string };
export type DbPaymentInsert = Omit<DbPayment, 'id' | 'code'> & { id?: string; code: string };
export type DbExpenseInsert = Omit<DbExpense, 'id' | 'code'> & { id?: string; code: string };
export type DbNotificationInsert = Omit<DbNotification, 'id' | 'code'> & { id?: string; code: string };
export type DbCalendarEventInsert = Omit<DbCalendarEvent, 'id' | 'code'> & { id?: string; code: string };
export type DbAttendanceInsert = Omit<DbAttendance, 'id' | 'code'> & { id?: string; code: string };
export type DbCenterSettingsInsert =
  Omit<DbCenterSettings, 'id' | 'code'> & {
    id?: string;
    code: string;
  };