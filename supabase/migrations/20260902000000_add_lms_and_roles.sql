-- ============================================================================
-- LYUMOS CRM & LMS EKOTIZIMI
-- Migratsiya: LMS jadvallari (Darslar, Videolar, Vazifalar, 100 ballik baholash, Rollar)
-- ============================================================================

BEGIN;

-- 1. PROFILES (Foydalanuvchi profillari va rollar)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'teacher', 'student')),
  full_name text NOT NULL,
  avatar text,
  phone text,
  email text,
  teacher_id uuid REFERENCES public.teachers(id) ON DELETE SET NULL,
  student_id uuid REFERENCES public.students(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);
CREATE INDEX IF NOT EXISTS profiles_teacher_id_idx ON public.profiles(teacher_id);
CREATE INDEX IF NOT EXISTS profiles_student_id_idx ON public.profiles(student_id);

-- 2. LESSONS (Darslar va Video darsliklar)
CREATE TABLE IF NOT EXISTS public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE,
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES public.teachers(id) ON DELETE SET NULL,
  lesson_number integer NOT NULL DEFAULT 1,
  title text NOT NULL,
  description text,
  video_url text, -- YouTube, Vimeo yoki Cloud video havolasi
  materials_url text, -- Dars taqdimoti yoki fayl havolasi
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lessons_group_id_idx ON public.lessons(group_id);
CREATE INDEX IF NOT EXISTS lessons_teacher_id_idx ON public.lessons(teacher_id);

-- 3. HOMEWORK TASKS (Uyga vazifalar — 100 ballik mezon bilan)
CREATE TABLE IF NOT EXISTS public.homework_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE,
  lesson_id uuid REFERENCES public.lessons(id) ON DELETE CASCADE,
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES public.teachers(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  max_score integer NOT NULL DEFAULT 100 CHECK (max_score > 0),
  deadline timestamptz,
  attachment_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS homework_tasks_group_id_idx ON public.homework_tasks(group_id);
CREATE INDEX IF NOT EXISTS homework_tasks_lesson_id_idx ON public.homework_tasks(lesson_id);

-- 4. HOMEWORK SUBMISSIONS (Talabalar topshirgan vazifalar va ustoz bahosi)
CREATE TABLE IF NOT EXISTS public.homework_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES public.homework_tasks(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  submission_text text,
  attachment_url text,
  score numeric(5,2) CHECK (score >= 0 AND score <= 100), -- 100 ballik tizim
  teacher_feedback text, -- Ustoz izohi
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'graded', 'late', 'resubmit')),
  submitted_at timestamptz DEFAULT now(),
  graded_at timestamptz,
  graded_by uuid REFERENCES public.teachers(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT one_submission_per_student_per_task UNIQUE (task_id, student_id)
);

CREATE INDEX IF NOT EXISTS homework_submissions_task_id_idx ON public.homework_submissions(task_id);
CREATE INDEX IF NOT EXISTS homework_submissions_student_id_idx ON public.homework_submissions(student_id);
CREATE INDEX IF NOT EXISTS homework_submissions_status_idx ON public.homework_submissions(status);

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) YANGILANISHI
-- Authenticated barcha foydalanuvchilar xavfsiz foydalanishi uchun
-- ============================================================================

DO $$
DECLARE
  table_name_item text;
BEGIN
  FOREACH table_name_item IN ARRAY ARRAY[
    'profiles',
    'lessons',
    'homework_tasks',
    'homework_submissions',
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
    IF to_regclass(format('public.%I', table_name_item)) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name_item);
      EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.%I TO authenticated', table_name_item);

      IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
          AND tablename = table_name_item 
          AND policyname = 'authenticated_all_access'
      ) THEN
        EXECUTE format(
          'CREATE POLICY authenticated_all_access ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)',
          table_name_item
        );
      END IF;
    END IF;
  END LOOP;
END
$$;

NOTIFY pgrst, 'reload schema';

COMMIT;
