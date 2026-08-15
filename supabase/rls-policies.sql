-- LYUMOS CRM — Supabase schema reference
-- Tables already exist in your project. DO NOT run DROP statements.
-- Use this file as documentation / RLS setup only.

-- ─── Row Level Security (run once if not already enabled) ───────────────────
-- Allows anon access for CRM without auth (add auth + restrictive policies later)

alter table if exists teachers enable row level security;
alter table if exists groups enable row level security;
alter table if exists students enable row level security;
alter table if exists payments enable row level security;
alter table if exists attendance enable row level security;
alter table if exists expenses enable row level security;
alter table if exists notifications enable row level security;
alter table if exists calendar_events enable row level security;
alter table if exists center_settings enable row level security;

-- Permissive policies for anon role (replace with auth-based policies when ready)
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'students' and policyname = 'anon_all_students') then
    create policy anon_all_students on students for all to anon using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'teachers' and policyname = 'anon_all_teachers') then
    create policy anon_all_teachers on teachers for all to anon using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'groups' and policyname = 'anon_all_groups') then
    create policy anon_all_groups on groups for all to anon using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'payments' and policyname = 'anon_all_payments') then
    create policy anon_all_payments on payments for all to anon using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'attendance' and policyname = 'anon_all_attendance') then
    create policy anon_all_attendance on attendance for all to anon using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'expenses' and policyname = 'anon_all_expenses') then
    create policy anon_all_expenses on expenses for all to anon using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'notifications' and policyname = 'anon_all_notifications') then
    create policy anon_all_notifications on notifications for all to anon using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'calendar_events' and policyname = 'anon_all_calendar_events') then
    create policy anon_all_calendar_events on calendar_events for all to anon using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'center_settings' and policyname = 'anon_all_center_settings') then
    create policy anon_all_center_settings on center_settings for all to anon using (true) with check (true);
  end if;
end $$;

-- ─── Expected column layout (reference only) ────────────────────────────────
-- Primary keys (`id`) are UUID on all entity tables.
-- Human-readable business identifiers live in `code`:
--   teachers.code  → TCH-101
--   groups.code    → GRP-01
--   students.code  → STU-1001
--   payments.code  → PAY-STU-1001-August
--   expenses.code  → EXP-801
-- Foreign keys reference UUID `id` columns (e.g. groups.teacher_id → teachers.id).
--
-- students: id (uuid), code, full_name, avatar, birth_date, gender, phone, email,
--   parent_name, parent_phone, group_id (uuid), teacher_id (uuid), monthly_fee,
--   status, joined_date, address, notes
-- payments: id (uuid), code, student_id (uuid), month, status, amount_paid,
--   discount, payment_date, method, receipt_no, notes
-- Unique: code, (student_id, month)
