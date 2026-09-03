export type UserRole = 'admin' | 'teacher' | 'student';

export interface UserProfile {
  id: string;
  role: UserRole;
  fullName: string;
  avatar?: string;
  email: string;
  phone?: string;
  teacherId?: string; // TCH-101 or UUID
  studentId?: string; // STU-1001 or UUID
}

export interface Lesson {
  id: string;
  code?: string;
  groupId: string;
  groupName?: string;
  teacherId: string;
  teacherName?: string;
  lessonNumber: number;
  title: string;
  description?: string;
  videoUrl?: string; // YouTube / Vimeo / Direct video link
  materialsUrl?: string; // PDF, Slides or cloud link
  date: string;
  createdAt?: string;
}

export interface HomeworkTask {
  id: string;
  code?: string;
  lessonId?: string;
  lessonTitle?: string;
  groupId: string;
  groupName?: string;
  teacherId: string;
  title: string;
  description: string;
  maxScore: number; // usually 100
  deadline?: string;
  attachmentUrl?: string;
  createdAt?: string;
}

export type SubmissionStatus = 'pending' | 'graded' | 'late' | 'resubmit';

export interface HomeworkSubmission {
  id: string;
  taskId: string;
  taskTitle?: string;
  maxScore?: number;
  studentId: string;
  studentName?: string;
  studentAvatar?: string;
  groupId?: string;
  groupName?: string;
  submissionText?: string;
  attachmentUrl?: string;
  score?: number | null; // 0 to 100
  teacherFeedback?: string; // Ustoz izohi
  status: SubmissionStatus;
  submittedAt: string;
  gradedAt?: string;
  gradedByName?: string;
}

export interface StudentLeaderboardItem {
  studentId: string;
  studentName: string;
  avatar?: string;
  groupId: string;
  groupName: string;
  totalSubmissions: number;
  gradedSubmissions: number;
  averageScore: number; // 0 - 100
  attendanceRate: number; // 0 - 100%
  totalPoints: number; // overall composite score
  rank: number;
}
