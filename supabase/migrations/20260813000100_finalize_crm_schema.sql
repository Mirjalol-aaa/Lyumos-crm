-- ============================================================================
-- LYUMOS CRM
-- Finalize CRM schema after Supabase persistence migration
--
-- Safe / additive / idempotent:
--   - no DROP TABLE
--   - no DELETE
--   - no primary-key replacement
--   - keeps legacy columns for compatibility
--   - safe to run more than once
-- ============================================================================

BEGIN;


-- ============================================================================
-- 1. TEACHERS
-- ============================================================================

ALTER TABLE IF EXISTS public.teachers
  ADD COLUMN IF NOT EXISTS code text;

ALTER TABLE IF EXISTS public.teachers
  ADD COLUMN IF NOT EXISTS full_name text;


-- Backfill full_name from legacy first_name + last_name when possible.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'teachers'
      AND column_name = 'first_name'
  )
  AND EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'teachers'
      AND column_name = 'last_name'
  )
  THEN
    UPDATE public.teachers
    SET full_name =
      NULLIF(
        BTRIM(
          CONCAT_WS(
            ' ',
            first_name,
            last_name
          )
        ),
        ''
      )
    WHERE full_name IS NULL;
  END IF;
END
$$;


-- Legacy fields must not block inserts that use full_name.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'teachers'
      AND column_name = 'first_name'
  )
  THEN
    ALTER TABLE public.teachers
      ALTER COLUMN first_name DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'teachers'
      AND column_name = 'last_name'
  )
  THEN
    ALTER TABLE public.teachers
      ALTER COLUMN last_name DROP NOT NULL;
  END IF;
END
$$;


-- Enforce full_name only when all existing rows are ready.
DO $$
BEGIN
  IF to_regclass('public.teachers') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1
       FROM public.teachers
       WHERE full_name IS NULL
     )
  THEN
    ALTER TABLE public.teachers
      ALTER COLUMN full_name SET NOT NULL;
  END IF;
END
$$;


-- Full unique index required by Supabase ON CONFLICT(code).
CREATE UNIQUE INDEX IF NOT EXISTS
  teachers_code_on_conflict_unique
ON public.teachers (code);



-- ============================================================================
-- 2. GROUPS
-- ============================================================================

ALTER TABLE IF EXISTS public.groups
  ADD COLUMN IF NOT EXISTS code text;

ALTER TABLE IF EXISTS public.groups
  ADD COLUMN IF NOT EXISTS teacher_id uuid;

ALTER TABLE IF EXISTS public.groups
  ADD COLUMN IF NOT EXISTS teacher_name text;

ALTER TABLE IF EXISTS public.groups
  ADD COLUMN IF NOT EXISTS schedule_days text;

ALTER TABLE IF EXISTS public.groups
  ADD COLUMN IF NOT EXISTS schedule_time text;

ALTER TABLE IF EXISTS public.groups
  ADD COLUMN IF NOT EXISTS max_capacity integer;

ALTER TABLE IF EXISTS public.groups
  ADD COLUMN IF NOT EXISTS current_students_count integer DEFAULT 0;

ALTER TABLE IF EXISTS public.groups
  ADD COLUMN IF NOT EXISTS status text;


CREATE UNIQUE INDEX IF NOT EXISTS
  groups_code_on_conflict_unique
ON public.groups (code);



-- ============================================================================
-- 3. STUDENTS
-- ============================================================================

ALTER TABLE IF EXISTS public.students
  ADD COLUMN IF NOT EXISTS code text;

ALTER TABLE IF EXISTS public.students
  ADD COLUMN IF NOT EXISTS full_name text;

ALTER TABLE IF EXISTS public.students
  ADD COLUMN IF NOT EXISTS avatar text;

ALTER TABLE IF EXISTS public.students
  ADD COLUMN IF NOT EXISTS joined_date date;

ALTER TABLE IF EXISTS public.students
  ADD COLUMN IF NOT EXISTS monthly_fee numeric;


-- Backfill full_name from legacy names.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'students'
      AND column_name = 'first_name'
  )
  AND EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'students'
      AND column_name = 'last_name'
  )
  THEN
    UPDATE public.students
    SET full_name =
      NULLIF(
        BTRIM(
          CONCAT_WS(
            ' ',
            first_name,
            last_name
          )
        ),
        ''
      )
    WHERE full_name IS NULL;
  END IF;
END
$$;


-- Legacy first/last names must not block modern inserts.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'students'
      AND column_name = 'first_name'
  )
  THEN
    ALTER TABLE public.students
      ALTER COLUMN first_name DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'students'
      AND column_name = 'last_name'
  )
  THEN
    ALTER TABLE public.students
      ALTER COLUMN last_name DROP NOT NULL;
  END IF;
END
$$;


DO $$
BEGIN
  IF to_regclass('public.students') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1
       FROM public.students
       WHERE full_name IS NULL
     )
  THEN
    ALTER TABLE public.students
      ALTER COLUMN full_name SET NOT NULL;
  END IF;
END
$$;


CREATE UNIQUE INDEX IF NOT EXISTS
  students_code_on_conflict_unique
ON public.students (code);



-- ============================================================================
-- 4. PAYMENTS
-- ============================================================================

ALTER TABLE IF EXISTS public.payments
  ADD COLUMN IF NOT EXISTS code text;

ALTER TABLE IF EXISTS public.payments
  ADD COLUMN IF NOT EXISTS notes text;


CREATE UNIQUE INDEX IF NOT EXISTS
  payments_code_on_conflict_unique
ON public.payments (code);


CREATE UNIQUE INDEX IF NOT EXISTS
  payments_student_month_unique
ON public.payments (
  student_id,
  month
);



-- ============================================================================
-- 5. EXPENSES
-- ============================================================================

ALTER TABLE IF EXISTS public.expenses
  ADD COLUMN IF NOT EXISTS code text;

ALTER TABLE IF EXISTS public.expenses
  ADD COLUMN IF NOT EXISTS date date;

ALTER TABLE IF EXISTS public.expenses
  ADD COLUMN IF NOT EXISTS receipt_url text;


-- Backfill new date from legacy expense_date.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'expenses'
      AND column_name = 'expense_date'
  )
  THEN
    UPDATE public.expenses
    SET date = expense_date
    WHERE date IS NULL
      AND expense_date IS NOT NULL;
  END IF;
END
$$;


CREATE UNIQUE INDEX IF NOT EXISTS
  expenses_code_on_conflict_unique
ON public.expenses (code);



-- ============================================================================
-- 6. ATTENDANCE
-- ============================================================================

ALTER TABLE IF EXISTS public.attendance
  ADD COLUMN IF NOT EXISTS code text;

ALTER TABLE IF EXISTS public.attendance
  ADD COLUMN IF NOT EXISTS date date;

ALTER TABLE IF EXISTS public.attendance
  ADD COLUMN IF NOT EXISTS student_name text;

ALTER TABLE IF EXISTS public.attendance
  ADD COLUMN IF NOT EXISTS note text;


-- Backfill new date from legacy attendance_date.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'attendance'
      AND column_name = 'attendance_date'
  )
  THEN
    UPDATE public.attendance
    SET date = attendance_date
    WHERE date IS NULL
      AND attendance_date IS NOT NULL;

    -- Important:
    -- current frontend writes to "date", not legacy "attendance_date".
    ALTER TABLE public.attendance
      ALTER COLUMN attendance_date DROP NOT NULL;
  END IF;
END
$$;


CREATE UNIQUE INDEX IF NOT EXISTS
  attendance_code_on_conflict_unique
ON public.attendance (code);


-- One attendance record per student per date.
CREATE UNIQUE INDEX IF NOT EXISTS
  attendance_student_date_unique
ON public.attendance (
  student_id,
  date
);



-- ============================================================================
-- 7. NOTIFICATIONS
-- ============================================================================

ALTER TABLE IF EXISTS public.notifications
  ADD COLUMN IF NOT EXISTS code text;

ALTER TABLE IF EXISTS public.notifications
  ADD COLUMN IF NOT EXISTS time text;

ALTER TABLE IF EXISTS public.notifications
  ADD COLUMN IF NOT EXISTS read boolean;

ALTER TABLE IF EXISTS public.notifications
  ADD COLUMN IF NOT EXISTS link_to_page text;

ALTER TABLE IF EXISTS public.notifications
  ADD COLUMN IF NOT EXISTS link_to_id text;


-- Only backfill from legacy is_read when "read" has not yet been populated.
-- Existing modern read/unread states are preserved.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'notifications'
      AND column_name = 'is_read'
  )
  THEN
    UPDATE public.notifications
    SET read = is_read
    WHERE read IS NULL;
  END IF;
END
$$;


ALTER TABLE IF EXISTS public.notifications
  ALTER COLUMN read SET DEFAULT false;


CREATE UNIQUE INDEX IF NOT EXISTS
  notifications_code_on_conflict_unique
ON public.notifications (code);



-- ============================================================================
-- 8. CALENDAR EVENTS
-- ============================================================================

ALTER TABLE IF EXISTS public.calendar_events
  ADD COLUMN IF NOT EXISTS code text;

ALTER TABLE IF EXISTS public.calendar_events
  ADD COLUMN IF NOT EXISTS date date;

ALTER TABLE IF EXISTS public.calendar_events
  ADD COLUMN IF NOT EXISTS type text;

ALTER TABLE IF EXISTS public.calendar_events
  ADD COLUMN IF NOT EXISTS time text;


-- Backfill modern date/type from legacy columns when present.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'calendar_events'
      AND column_name = 'event_date'
  )
  THEN
    UPDATE public.calendar_events
    SET date = event_date
    WHERE date IS NULL
      AND event_date IS NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'calendar_events'
      AND column_name = 'event_type'
  )
  THEN
    UPDATE public.calendar_events
    SET type = event_type
    WHERE type IS NULL
      AND event_type IS NOT NULL;
  END IF;
END
$$;


CREATE UNIQUE INDEX IF NOT EXISTS
  calendar_events_code_on_conflict_unique
ON public.calendar_events (code);



-- ============================================================================
-- 9. CENTER SETTINGS
-- ============================================================================

ALTER TABLE IF EXISTS public.center_settings
  ADD COLUMN IF NOT EXISTS code text;

ALTER TABLE IF EXISTS public.center_settings
  ADD COLUMN IF NOT EXISTS currency_symbol text;

ALTER TABLE IF EXISTS public.center_settings
  ADD COLUMN IF NOT EXISTS seed_migration_version integer;


ALTER TABLE IF EXISTS public.center_settings
  ALTER COLUMN seed_migration_version SET DEFAULT 0;


UPDATE public.center_settings
SET seed_migration_version = 0
WHERE seed_migration_version IS NULL;


ALTER TABLE IF EXISTS public.center_settings
  ALTER COLUMN seed_migration_version SET NOT NULL;


CREATE UNIQUE INDEX IF NOT EXISTS
  center_settings_code_on_conflict_unique
ON public.center_settings (code);



-- ============================================================================
-- 10. FOREIGN KEYS
-- Keep UUID technical relationships.
-- Add only when the named constraint does not already exist.
-- ============================================================================

DO $$
BEGIN

  IF to_regclass('public.groups') IS NOT NULL
     AND to_regclass('public.teachers') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1
       FROM pg_constraint
       WHERE conname = 'groups_teacher_id_fkey'
         AND conrelid = 'public.groups'::regclass
     )
  THEN
    ALTER TABLE public.groups
      ADD CONSTRAINT groups_teacher_id_fkey
      FOREIGN KEY (teacher_id)
      REFERENCES public.teachers(id);
  END IF;


  IF to_regclass('public.students') IS NOT NULL
     AND to_regclass('public.groups') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1
       FROM pg_constraint
       WHERE conname = 'students_group_id_fkey'
         AND conrelid = 'public.students'::regclass
     )
  THEN
    ALTER TABLE public.students
      ADD CONSTRAINT students_group_id_fkey
      FOREIGN KEY (group_id)
      REFERENCES public.groups(id);
  END IF;


  IF to_regclass('public.students') IS NOT NULL
     AND to_regclass('public.teachers') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1
       FROM pg_constraint
       WHERE conname = 'students_teacher_id_fkey'
         AND conrelid = 'public.students'::regclass
     )
  THEN
    ALTER TABLE public.students
      ADD CONSTRAINT students_teacher_id_fkey
      FOREIGN KEY (teacher_id)
      REFERENCES public.teachers(id);
  END IF;


  IF to_regclass('public.payments') IS NOT NULL
     AND to_regclass('public.students') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1
       FROM pg_constraint
       WHERE conname = 'payments_student_id_fkey'
         AND conrelid = 'public.payments'::regclass
     )
  THEN
    ALTER TABLE public.payments
      ADD CONSTRAINT payments_student_id_fkey
      FOREIGN KEY (student_id)
      REFERENCES public.students(id);
  END IF;


  IF to_regclass('public.attendance') IS NOT NULL
     AND to_regclass('public.students') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1
       FROM pg_constraint
       WHERE conname = 'attendance_student_id_fkey'
         AND conrelid = 'public.attendance'::regclass
     )
  THEN
    ALTER TABLE public.attendance
      ADD CONSTRAINT attendance_student_id_fkey
      FOREIGN KEY (student_id)
      REFERENCES public.students(id);
  END IF;


  IF to_regclass('public.attendance') IS NOT NULL
     AND to_regclass('public.groups') IS NOT NULL
     AND NOT EXISTS (
       SELECT 1
       FROM pg_constraint
       WHERE conname = 'attendance_group_id_fkey'
         AND conrelid = 'public.attendance'::regclass
     )
  THEN
    ALTER TABLE public.attendance
      ADD CONSTRAINT attendance_group_id_fkey
      FOREIGN KEY (group_id)
      REFERENCES public.groups(id);
  END IF;

END
$$;



-- ============================================================================
-- 11. RLS + AUTHENTICATED ACCESS
--
-- Current LYUMOS single-admin model.
-- Existing policies are NOT removed.
-- ============================================================================

DO $$
DECLARE
  table_name_item text;

  admin_user_id uuid :=
    '2579a451-f91c-4a0f-ab0b-33eccb8d9006'::uuid;

BEGIN

  FOREACH table_name_item IN ARRAY ARRAY[
    'teachers',
    'groups',
    'students',
    'payments',
    'expenses',
    'attendance',
    'notifications',
    'calendar_events',
    'center_settings'
  ]
  LOOP

    IF to_regclass(
      format(
        'public.%I',
        table_name_item
      )
    ) IS NOT NULL
    THEN

      EXECUTE format(
        'ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',
        table_name_item
      );


      EXECUTE format(
        'GRANT SELECT, INSERT, UPDATE, DELETE
         ON TABLE public.%I
         TO authenticated',
        table_name_item
      );


      IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = table_name_item
          AND policyname = 'lyumos_admin_all'
      )
      THEN

        EXECUTE format(
          'CREATE POLICY lyumos_admin_all
           ON public.%I
           FOR ALL
           TO authenticated
           USING (
             (SELECT auth.uid()) = %L::uuid
           )
           WITH CHECK (
             (SELECT auth.uid()) = %L::uuid
           )',
          table_name_item,
          admin_user_id::text,
          admin_user_id::text
        );

      END IF;

    END IF;

  END LOOP;

END
$$;



-- ============================================================================
-- 12. POSTGREST SCHEMA CACHE
-- ============================================================================

NOTIFY pgrst, 'reload schema';


COMMIT;