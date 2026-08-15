-- LYUMOS CRM: separate UUID primary keys from human-readable business codes.
-- Safe to run multiple times (IF NOT EXISTS / conditional constraints).

-- ─── Teachers ────────────────────────────────────────────────────────────────
alter table if exists teachers
  add column if not exists code text;

create unique index if not exists teachers_code_unique
  on teachers (code)
  where code is not null;

-- ─── Groups ──────────────────────────────────────────────────────────────────
alter table if exists groups
  add column if not exists code text;

create unique index if not exists groups_code_unique
  on groups (code)
  where code is not null;

-- ─── Students ────────────────────────────────────────────────────────────────
alter table if exists students
  add column if not exists code text;

create unique index if not exists students_code_unique
  on students (code)
  where code is not null;

-- ─── Payments ────────────────────────────────────────────────────────────────
alter table if exists payments
  add column if not exists code text;

create unique index if not exists payments_code_unique
  on payments (code)
  where code is not null;

create unique index if not exists payments_student_month_unique
  on payments (student_id, month);

-- ─── Expenses ────────────────────────────────────────────────────────────────
alter table if exists expenses
  add column if not exists code text;

create unique index if not exists expenses_code_unique
  on expenses (code)
  where code is not null;

-- ─── Notifications ───────────────────────────────────────────────────────────
alter table if exists notifications
  add column if not exists code text;

create unique index if not exists notifications_code_unique
  on notifications (code)
  where code is not null;

-- ─── Calendar events ─────────────────────────────────────────────────────────
alter table if exists calendar_events
  add column if not exists code text;

create unique index if not exists calendar_events_code_unique
  on calendar_events (code)
  where code is not null;

-- ─── Attendance ──────────────────────────────────────────────────────────────
alter table if exists attendance
  add column if not exists code text;

create unique index if not exists attendance_code_unique
  on attendance (code)
  where code is not null;
