import { Lesson, HomeworkTask, HomeworkSubmission, StudentLeaderboardItem } from '../types/lms';
import { Student, AttendanceRecord } from '../types/crm';
import { supabase } from '../lib/supabase';
import { INITIAL_LESSONS, INITIAL_HOMEWORK_TASKS, INITIAL_SUBMISSIONS } from '../data/initialLmsData';

const LOCAL_STORAGE_LESSONS_KEY = 'lyumos_lms_lessons';
const LOCAL_STORAGE_TASKS_KEY = 'lyumos_lms_tasks';
const LOCAL_STORAGE_SUBMISSIONS_KEY = 'lyumos_lms_submissions';

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL CACHE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function getLocalLessons(): Lesson[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LESSONS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_LESSONS;
  } catch {
    return INITIAL_LESSONS;
  }
}

function saveLocalLessons(lessons: Lesson[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_LESSONS_KEY, JSON.stringify(lessons));
  } catch (e) {
    console.error('Failed to save lessons to localStorage', e);
  }
}

function getLocalTasks(): HomeworkTask[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TASKS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_HOMEWORK_TASKS;
  } catch {
    return INITIAL_HOMEWORK_TASKS;
  }
}

function saveLocalTasks(tasks: HomeworkTask[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks to localStorage', e);
  }
}

function getLocalSubmissions(): HomeworkSubmission[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SUBMISSIONS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_SUBMISSIONS;
  } catch {
    return INITIAL_SUBMISSIONS;
  }
}

function saveLocalSubmissions(submissions: HomeworkSubmission[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_SUBMISSIONS_KEY, JSON.stringify(submissions));
  } catch (e) {
    console.error('Failed to save submissions to localStorage', e);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LESSONS SERVICE
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchAllLessons(): Promise<Lesson[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('lesson_number', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map(item => ({
          id: item.code || item.id,
          code: item.code,
          groupId: item.group_id,
          teacherId: item.teacher_id,
          lessonNumber: item.lesson_number,
          title: item.title,
          description: item.description,
          videoUrl: item.video_url,
          materialsUrl: item.materials_url,
          date: item.date,
          createdAt: item.created_at,
        }));
      }
    } catch {
      // fallback to local
    }
  }
  return getLocalLessons();
}

export async function saveLesson(lesson: Lesson): Promise<Lesson> {
  const current = getLocalLessons();
  const exists = current.findIndex(l => l.id === lesson.id);
  let updated: Lesson[];
  if (exists >= 0) {
    updated = current.map(l => (l.id === lesson.id ? lesson : l));
  } else {
    updated = [lesson, ...current];
  }
  saveLocalLessons(updated);
  return lesson;
}

export async function deleteLesson(lessonId: string): Promise<void> {
  const current = getLocalLessons();
  const updated = current.filter(l => l.id !== lessonId);
  saveLocalLessons(updated);
}

// ─────────────────────────────────────────────────────────────────────────────
// HOMEWORK TASKS SERVICE
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchAllHomeworkTasks(): Promise<HomeworkTask[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('homework_tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(item => ({
          id: item.code || item.id,
          code: item.code,
          lessonId: item.lesson_id,
          groupId: item.group_id,
          teacherId: item.teacher_id,
          title: item.title,
          description: item.description,
          maxScore: item.max_score || 100,
          deadline: item.deadline,
          attachmentUrl: item.attachment_url,
          createdAt: item.created_at,
        }));
      }
    } catch {
      // fallback
    }
  }
  return getLocalTasks();
}

export async function saveHomeworkTask(task: HomeworkTask): Promise<HomeworkTask> {
  const current = getLocalTasks();
  const exists = current.findIndex(t => t.id === task.id);
  let updated: HomeworkTask[];
  if (exists >= 0) {
    updated = current.map(t => (t.id === task.id ? task : t));
  } else {
    updated = [task, ...current];
  }
  saveLocalTasks(updated);
  return task;
}

export async function deleteHomeworkTask(taskId: string): Promise<void> {
  const current = getLocalTasks();
  const updated = current.filter(t => t.id !== taskId);
  saveLocalTasks(updated);
}

// ─────────────────────────────────────────────────────────────────────────────
// HOMEWORK SUBMISSIONS & 100-SCALE GRADING
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchAllSubmissions(): Promise<HomeworkSubmission[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('homework_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(item => ({
          id: item.id,
          taskId: item.task_id,
          studentId: item.student_id,
          submissionText: item.submission_text,
          attachmentUrl: item.attachment_url,
          score: item.score !== null ? Number(item.score) : null,
          teacherFeedback: item.teacher_feedback,
          status: item.status,
          submittedAt: item.submitted_at,
          gradedAt: item.graded_at,
        }));
      }
    } catch {
      // fallback
    }
  }
  return getLocalSubmissions();
}

export async function submitStudentHomework(submission: Omit<HomeworkSubmission, 'id' | 'status' | 'submittedAt'>): Promise<HomeworkSubmission> {
  const current = getLocalSubmissions();
  const newSubmission: HomeworkSubmission = {
    ...submission,
    id: `SUB-${Date.now()}`,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };

  const existingIndex = current.findIndex(
    s => s.taskId === submission.taskId && s.studentId === submission.studentId
  );

  let updated: HomeworkSubmission[];
  if (existingIndex >= 0) {
    updated = current.map((s, idx) => (idx === existingIndex ? newSubmission : s));
  } else {
    updated = [newSubmission, ...current];
  }

  saveLocalSubmissions(updated);
  return newSubmission;
}

export async function gradeHomeworkSubmission(
  submissionId: string,
  score: number, // 0 to 100
  teacherFeedback: string,
  teacherName = 'O‘qituvchi'
): Promise<HomeworkSubmission | null> {
  const current = getLocalSubmissions();
  let updatedItem: HomeworkSubmission | null = null;

  const validScore = Math.max(0, Math.min(100, Math.round(score)));

  const updated = current.map(item => {
    if (item.id === submissionId) {
      updatedItem = {
        ...item,
        score: validScore,
        teacherFeedback,
        status: 'graded',
        gradedAt: new Date().toISOString(),
        gradedByName: teacherName,
      };
      return updatedItem;
    }
    return item;
  });

  saveLocalSubmissions(updated);
  return updatedItem;
}

// ─────────────────────────────────────────────────────────────────────────────
// LEADERBOARD & RANKINGS GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

export function calculateLeaderboard(
  students: Student[],
  submissions: HomeworkSubmission[],
  attendanceRecords: AttendanceRecord[],
  groupId?: string | null
): StudentLeaderboardItem[] {
  const targetStudents = groupId
    ? students.filter(s => s.groupId === groupId)
    : students.filter(s => s.status === 'Active');

  const leaderboard: StudentLeaderboardItem[] = targetStudents.map(student => {
    const studentSubs = submissions.filter(s => s.studentId === student.id);
    const gradedSubs = studentSubs.filter(s => s.status === 'graded' && s.score !== null && s.score !== undefined);
    
    const totalScore = gradedSubs.reduce((acc, curr) => acc + (curr.score || 0), 0);
    const averageScore = gradedSubs.length > 0 ? Math.round(totalScore / gradedSubs.length) : 0;

    // Attendance calculation
    const studentAttendance = attendanceRecords.filter(r => r.studentId === student.id);
    const attended = studentAttendance.filter(r => r.status === 'Present' || r.status === 'Late').length;
    const attendanceRate = studentAttendance.length > 0 ? Math.round((attended / studentAttendance.length) * 100) : 95;

    // Composite ranking formula: 75% Homework Score (0-100) + 25% Attendance (0-100)
    const compositePoints = Math.round(averageScore * 0.75 + attendanceRate * 0.25);

    return {
      studentId: student.id,
      studentName: student.fullName,
      avatar: student.avatar,
      groupId: student.groupId,
      groupName: student.groupName,
      totalSubmissions: studentSubs.length,
      gradedSubmissions: gradedSubs.length,
      averageScore,
      attendanceRate,
      totalPoints: compositePoints > 0 ? compositePoints : averageScore || 70,
      rank: 0,
    };
  });

  // Sort descending by totalPoints, then averageScore
  leaderboard.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    return b.averageScore - a.averageScore;
  });

  // Assign 1-indexed ranks
  return leaderboard.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}
