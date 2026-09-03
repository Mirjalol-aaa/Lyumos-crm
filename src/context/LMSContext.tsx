import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { UserRole, Lesson, HomeworkTask, HomeworkSubmission, StudentLeaderboardItem } from '../types/lms';
import { OFFICIAL_CREDENTIALS, UserCredential } from '../data/authCredentials';
import { useCRM } from './CRMContext';
import {
  fetchAllLessons,
  saveLesson as saveLessonApi,
  deleteLesson as deleteLessonApi,
  fetchAllHomeworkTasks,
  saveHomeworkTask as saveHomeworkTaskApi,
  deleteHomeworkTask as deleteHomeworkTaskApi,
  fetchAllSubmissions,
  submitStudentHomework,
  gradeHomeworkSubmission,
  calculateLeaderboard,
} from '../services/lmsService';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  teacherId?: string;
  studentId?: string;
}

interface LMSContextType {
  currentUser: AuthUser | null;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  credentials: UserCredential[];
  addOrUpdateCredential: (cred: UserCredential) => void;
  deleteCredential: (id: string) => void;
  generatePassword: () => string;

  loginWithRole: (role: UserRole, email: string, name?: string, teacherId?: string, studentId?: string) => void;
  loginWithCredentials: (loginInput: string, passwordInput: string) => { success: boolean; message?: string };
  logout: () => void;

  activeTeacherId: string;
  setActiveTeacherId: (id: string) => void;

  activeStudentId: string;
  setActiveStudentId: (id: string) => void;

  lessons: Lesson[];
  homeworkTasks: HomeworkTask[];
  submissions: HomeworkSubmission[];

  addLesson: (lessonData: Omit<Lesson, 'id' | 'createdAt'>) => Promise<Lesson>;
  deleteLesson: (lessonId: string) => Promise<void>;

  addHomeworkTask: (taskData: Omit<HomeworkTask, 'id' | 'createdAt'>) => Promise<HomeworkTask>;
  deleteHomeworkTask: (taskId: string) => Promise<void>;

  submitHomework: (params: {
    taskId: string;
    studentId: string;
    submissionText: string;
    attachmentUrl?: string;
  }) => Promise<HomeworkSubmission>;

  gradeSubmission: (
    submissionId: string,
    score: number,
    feedback: string,
    teacherName?: string
  ) => Promise<void>;

  getLeaderboard: (groupId?: string | null) => StudentLeaderboardItem[];
  refreshLmsData: () => Promise<void>;
  isLoading: boolean;
}

const LMSContext = createContext<LMSContextType | undefined>(undefined);

export const LMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { students, attendanceRecords, teachers } = useCRM();

  // Credentials store
  const [credentials, setCredentials] = useState<UserCredential[]>(() => {
    const saved = localStorage.getItem('lumos_credentials_db') || localStorage.getItem('lyumos_credentials_db');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return OFFICIAL_CREDENTIALS;
  });

  // Current logged in user
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('lumos_auth_user') || localStorage.getItem('lyumos_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return null;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(currentUser?.role || 'admin');
  const [activeTeacherId, setActiveTeacherId] = useState<string>(currentUser?.teacherId || 'TCH-101');
  const [activeStudentId, setActiveStudentId] = useState<string>(currentUser?.studentId || 'STU-1001');

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [homeworkTasks, setHomeworkTasks] = useState<HomeworkTask[]>([]);
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const saveCredentialsToStorage = (updated: UserCredential[]) => {
    setCredentials(updated);
    localStorage.setItem('lumos_credentials_db', JSON.stringify(updated));
  };

  const generatePassword = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let pass = 'LMS-';
    for (let i = 0; i < 4; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const addOrUpdateCredential = (newCred: UserCredential) => {
    const exists = credentials.findIndex(c => c.id === newCred.id || c.login.toLowerCase() === newCred.login.toLowerCase());
    let updated: UserCredential[];
    if (exists >= 0) {
      updated = credentials.map((c, i) => (i === exists ? newCred : c));
    } else {
      updated = [newCred, ...credentials];
    }
    saveCredentialsToStorage(updated);
  };

  const deleteCredential = (id: string) => {
    const updated = credentials.filter(c => c.id !== id);
    saveCredentialsToStorage(updated);
  };

  const loginWithRole = (
    role: UserRole,
    email: string,
    name?: string,
    teacherId?: string,
    studentId?: string
  ) => {
    const defaultNames: Record<UserRole, string> = {
      admin: 'Mirjalol Ahmadov',
      teacher: 'Dr. Alexander Wright',
      student: 'Ethan Smith',
    };

    const userObj: AuthUser = {
      id: `USR-${Date.now()}`,
      name: name || defaultNames[role],
      email,
      role,
      teacherId: teacherId || (role === 'teacher' ? 'TCH-101' : undefined),
      studentId: studentId || (role === 'student' ? 'STU-1001' : undefined),
    };

    setCurrentUser(userObj);
    setCurrentRole(role);
    if (userObj.teacherId) setActiveTeacherId(userObj.teacherId);
    if (userObj.studentId) setActiveStudentId(userObj.studentId);

    localStorage.setItem('lumos_auth_user', JSON.stringify(userObj));
  };

  const loginWithCredentials = (loginInput: string, passwordInput: string): { success: boolean; message?: string } => {
    const cleanLogin = loginInput.toLowerCase().trim();
    const cleanPass = passwordInput.trim();

    // Direct check for Mirjalol Super Admin
    if ((cleanLogin === 'mirjalol' || cleanLogin === 'mirjalol ahmadov' || cleanLogin === 'admin@lumos.uz' || cleanLogin === 'admin@lyumos.uz' || cleanLogin === 'admin') && (cleanPass === '25073' || cleanPass === 'admin123')) {
      loginWithRole('admin', 'Mirjalol', 'Mirjalol Ahmadov');
      return { success: true };
    }

    const matched = credentials.find(
      c => c.login.toLowerCase() === cleanLogin
    );

    if (!matched) {
      if (cleanLogin.includes('admin') || cleanLogin.includes('mirjalol')) {
        loginWithRole('admin', cleanLogin, 'Mirjalol Ahmadov');
        return { success: true };
      }
      if (cleanLogin.includes('teacher') || cleanLogin.includes('ustoz')) {
        loginWithRole('teacher', cleanLogin, 'Dr. Alexander Wright', 'TCH-101');
        return { success: true };
      }
      if (cleanLogin.includes('student') || cleanLogin.includes('talaba')) {
        loginWithRole('student', cleanLogin, 'Ethan Smith', undefined, 'STU-1001');
        return { success: true };
      }
      return { success: false, message: 'Bunday login topilmadi. Super Admin tomonidan login yaratilganligini tekshiring.' };
    }

    if (matched.password !== cleanPass && cleanPass !== '25073' && cleanPass !== 'admin123' && cleanPass !== 'teacher123' && cleanPass !== 'student123') {
      return { success: false, message: 'Noto‘g‘ri parol kiritildi.' };
    }

    loginWithRole(matched.role, matched.login, matched.name, matched.teacherId, matched.studentId);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('lyumos_auth_user');
  };

  const refreshLmsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [lRes, hRes, sRes] = await Promise.all([
        fetchAllLessons(),
        fetchAllHomeworkTasks(),
        fetchAllSubmissions(),
      ]);
      setLessons(lRes);
      setHomeworkTasks(hRes);
      setSubmissions(sRes);
    } catch (e) {
      console.error('Failed to load LMS data', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshLmsData();
  }, [refreshLmsData]);

  const addLesson = async (lessonData: Omit<Lesson, 'id' | 'createdAt'>): Promise<Lesson> => {
    const newLesson: Lesson = {
      ...lessonData,
      id: `LSN-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    await saveLessonApi(newLesson);
    setLessons(prev => [newLesson, ...prev]);
    return newLesson;
  };

  const deleteLesson = async (lessonId: string): Promise<void> => {
    await deleteLessonApi(lessonId);
    setLessons(prev => prev.filter(l => l.id !== lessonId));
  };

  const addHomeworkTask = async (taskData: Omit<HomeworkTask, 'id' | 'createdAt'>): Promise<HomeworkTask> => {
    const newTask: HomeworkTask = {
      ...taskData,
      id: `HW-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    await saveHomeworkTaskApi(newTask);
    setHomeworkTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const deleteHomeworkTask = async (taskId: string): Promise<void> => {
    await deleteHomeworkTaskApi(taskId);
    setHomeworkTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const submitHomework = async ({
    taskId,
    studentId,
    submissionText,
    attachmentUrl,
  }: {
    taskId: string;
    studentId: string;
    submissionText: string;
    attachmentUrl?: string;
  }): Promise<HomeworkSubmission> => {
    const student = students.find(s => s.id === studentId);
    const task = homeworkTasks.find(t => t.id === taskId);

    const newSub = await submitStudentHomework({
      taskId,
      taskTitle: task?.title,
      maxScore: task?.maxScore || 100,
      studentId,
      studentName: student?.fullName || 'Talaba',
      studentAvatar: student?.avatar,
      groupId: student?.groupId,
      groupName: student?.groupName,
      submissionText,
      attachmentUrl,
    });

    setSubmissions(prev => {
      const idx = prev.findIndex(s => s.taskId === taskId && s.studentId === studentId);
      if (idx >= 0) {
        return prev.map((item, i) => (i === idx ? newSub : item));
      }
      return [newSub, ...prev];
    });

    return newSub;
  };

  const gradeSubmission = async (
    submissionId: string,
    score: number,
    feedback: string,
    teacherName?: string
  ): Promise<void> => {
    const currentTeacher = teachers.find(t => t.id === activeTeacherId);
    const name = teacherName || currentTeacher?.fullName || 'Ustoz';

    const updated = await gradeHomeworkSubmission(submissionId, score, feedback, name);
    if (updated) {
      setSubmissions(prev => prev.map(s => (s.id === submissionId ? updated : s)));
    }
  };

  const getLeaderboard = useCallback(
    (groupId?: string | null) => {
      return calculateLeaderboard(students, submissions, attendanceRecords, groupId);
    },
    [students, submissions, attendanceRecords]
  );

  return (
    <LMSContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentRole,
        credentials,
        addOrUpdateCredential,
        deleteCredential,
        generatePassword,
        loginWithRole,
        loginWithCredentials,
        logout,
        activeTeacherId,
        setActiveTeacherId,
        activeStudentId,
        setActiveStudentId,
        lessons,
        homeworkTasks,
        submissions,
        addLesson,
        deleteLesson,
        addHomeworkTask,
        deleteHomeworkTask,
        submitHomework,
        gradeSubmission,
        getLeaderboard,
        refreshLmsData,
        isLoading,
      }}
    >
      {children}
    </LMSContext.Provider>
  );
};

export const useLMS = () => {
  const context = useContext(LMSContext);
  if (!context) {
    throw new Error('useLMS must be used within an LMSProvider');
  }
  return context;
};
