import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Toast } from './components/common/Toast';
import { Menu, Sun, Moon, Globe } from 'lucide-react';

import { CRMProvider, useCRM } from './context/CRMContext';
import { LMSProvider, useLMS } from './context/LMSContext';
import { I18nProvider } from './lib/i18n';
import { DataLoader } from './components/common/DataLoader';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { PageLoadingFallback } from './components/common/PageLoadingFallback';

// ─── Public & Payment Pages (Lazy Loaded) ───────────────────────────────────
const LandingPage = lazy(() => import('./pages/public/LandingPage').then(m => ({ default: m.LandingPage })));
const PaymentSuccessPage = lazy(() => import('./pages/payment/PaymentSuccessPage').then(m => ({ default: m.PaymentSuccessPage })));
const PaymentFailedPage = lazy(() => import('./pages/payment/PaymentFailedPage').then(m => ({ default: m.PaymentFailedPage })));

// ─── Authentication Pages (Lazy Loaded) ─────────────────────────────────────
const AdminTeacherLogin = lazy(() => import('./pages/auth/AdminTeacherLogin').then(m => ({ default: m.AdminTeacherLogin })));
const StudentLogin = lazy(() => import('./pages/auth/StudentLogin').then(m => ({ default: m.StudentLogin })));

// ─── Teacher Components & Pages (Lazy Loaded) ───────────────────────────────
import { TeacherSidebar, TeacherPageType } from './components/teacher/TeacherSidebar';
const TeacherDashboardPage = lazy(() => import('./pages/teacher/TeacherDashboardPage').then(m => ({ default: m.TeacherDashboardPage })));
const TeacherLessonsPage = lazy(() => import('./pages/teacher/TeacherLessonsPage').then(m => ({ default: m.TeacherLessonsPage })));
const TeacherHomeworkPage = lazy(() => import('./pages/teacher/TeacherHomeworkPage').then(m => ({ default: m.TeacherHomeworkPage })));
const TeacherAttendancePage = lazy(() => import('./pages/teacher/TeacherAttendancePage').then(m => ({ default: m.TeacherAttendancePage })));

// ─── Student Components & Pages (Lazy Loaded) ───────────────────────────────
import { StudentSidebar, StudentPageType } from './components/student/StudentSidebar';
const StudentDashboardPage = lazy(() => import('./pages/student/StudentDashboardPage').then(m => ({ default: m.StudentDashboardPage })));
const StudentLessonsPage = lazy(() => import('./pages/student/StudentLessonsPage').then(m => ({ default: m.StudentLessonsPage })));
const StudentHomeworkPage = lazy(() => import('./pages/student/StudentHomeworkPage').then(m => ({ default: m.StudentHomeworkPage })));
const StudentLeaderboardPage = lazy(() => import('./pages/student/StudentLeaderboardPage').then(m => ({ default: m.StudentLeaderboardPage })));
const StudentRewardsPage = lazy(() => import('./pages/student/StudentRewardsPage').then(m => ({ default: m.StudentRewardsPage })));
const StudentPaymentsPage = lazy(() => import('./pages/student/StudentPaymentsPage').then(m => ({ default: m.StudentPaymentsPage })));

// ─── Super Admin Pages (Lazy Loaded) ────────────────────────────────────────
const AdminOverviewPage = lazy(() => import('./pages/admin/AdminOverviewPage').then(m => ({ default: m.AdminOverviewPage })));
const AdminCoursesGroupsPage = lazy(() => import('./pages/admin/AdminCoursesGroupsPage').then(m => ({ default: m.AdminCoursesGroupsPage })));
const AdminStudentsHubPage = lazy(() => import('./pages/admin/AdminStudentsHubPage').then(m => ({ default: m.AdminStudentsHubPage })));
const AdminFinancePayrollPage = lazy(() => import('./pages/admin/AdminFinancePayrollPage').then(m => ({ default: m.AdminFinancePayrollPage })));
const AdminBranchesPage = lazy(() => import('./pages/admin/AdminBranchesPage').then(m => ({ default: m.AdminBranchesPage })));
const AdminCredentialsPage = lazy(() => import('./pages/admin/AdminCredentialsPage').then(m => ({ default: m.AdminCredentialsPage })));
const AdminAuditSettingsPage = lazy(() => import('./pages/admin/AdminAuditSettingsPage').then(m => ({ default: m.AdminAuditSettingsPage })));
const AdminSchedulePage = lazy(() => import('./pages/admin/AdminSchedulePage').then(m => ({ default: m.AdminSchedulePage })));
const AdminHomeworkPage = lazy(() => import('./pages/admin/AdminHomeworkPage').then(m => ({ default: m.AdminHomeworkPage })));
const AdminGradesPage = lazy(() => import('./pages/admin/AdminGradesPage').then(m => ({ default: m.AdminGradesPage })));
const AdminApplicationsPage = lazy(() => import('./pages/admin/AdminApplicationsPage').then(m => ({ default: m.AdminApplicationsPage })));

// ─── Other Admin Core Pages (Lazy Loaded) ───────────────────────────────────
const StudentsPage = lazy(() => import('./pages/StudentsPage').then(m => ({ default: m.StudentsPage })));
const PaymentsPage = lazy(() => import('./pages/PaymentsPage').then(m => ({ default: m.PaymentsPage })));
const AttendancePage = lazy(() => import('./pages/AttendancePage').then(m => ({ default: m.AttendancePage })));
const TeachersPage = lazy(() => import('./pages/TeachersPage').then(m => ({ default: m.TeachersPage })));
const GroupsPage = lazy(() => import('./pages/GroupsPage').then(m => ({ default: m.GroupsPage })));
const ReportsPage = lazy(() => import('./pages/ReportsPage').then(m => ({ default: m.ReportsPage })));
const ExpensesPage = lazy(() => import('./pages/ExpensesPage').then(m => ({ default: m.ExpensesPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

// ─── Admin Modals ───────────────────────────────────────────────────────────
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { StudentProfileModal } from './components/common/StudentProfileModal';
import { PwaInstallPrompt } from './components/common/PwaInstallPrompt';
import { AddStudentModal } from './components/modals/AddStudentModal';
import { ImportStudentsModal } from './components/modals/ImportStudentsModal';
import { ReceivePaymentModal } from './components/modals/ReceivePaymentModal';
import { AddTeacherModal } from './components/modals/AddTeacherModal';
import { AddGroupModal } from './components/modals/AddGroupModal';
import { AddExpenseModal } from './components/modals/AddExpenseModal';
import { processTelegramUpdates } from './services/telegramService';

// ─────────────────────────────────────────────────────────────────────────────
// 1. SUPER ADMIN CONTENT (SaaS Redesign)
// ─────────────────────────────────────────────────────────────────────────────

function AdminPortalContent() {
  const { activePage, setActivePage } = useCRM();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth < 1024;
  });
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    document.title = "LUMOS ERP - Boshqaruv Markazi";
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <AdminOverviewPage onNavigateTab={(tabId) => setActivePage(tabId as any)} />;
      case 'schedule':
        return <AdminSchedulePage />;
      case 'homework':
        return <AdminHomeworkPage />;
      case 'grades':
        return <AdminGradesPage />;
      case 'applications':
        return <AdminApplicationsPage />;
      case 'teachers_workload':
        return <TeachersPage />;
      case 'courses_groups':
        return <AdminCoursesGroupsPage />;
      case 'students_hub':
        return <AdminStudentsHubPage />;
      case 'finance_payroll':
        return <AdminFinancePayrollPage />;
      case 'branches':
        return <AdminBranchesPage />;
      case 'credentials':
        return <AdminCredentialsPage />;
      case 'audit_settings':
        return <AdminAuditSettingsPage />;
      case 'students':
        return <StudentsPage />;
      case 'payments':
        return <PaymentsPage />;
      case 'attendance':
        return <AttendancePage />;
      case 'teachers':
        return <TeachersPage />;
      case 'groups':
        return <GroupsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'expenses':
        return <ExpensesPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <AdminOverviewPage onNavigateTab={(tabId) => setActivePage(tabId as any)} />;
    }
  };

  return (
    <div
      className="min-h-screen flex font-sans antialiased selection:bg-[#6F1028] selection:text-white bg-[#F8F6F2] text-[#1F2937]"
    >
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
        />

        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <Suspense fallback={<PageLoadingFallback />}>
            {renderPage()}
          </Suspense>
        </main>
      </div>

      <GlobalSearchModal />
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <StudentProfileModal />
      <AddStudentModal />
      <ImportStudentsModal />
      <ReceivePaymentModal />
      <AddTeacherModal />
      <AddGroupModal />
      <AddExpenseModal />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. TEACHER CONTENT (Strict LMS for Teachers)
// ─────────────────────────────────────────────────────────────────────────────

function TeacherPortalContent() {
  const { settings, updateSettings } = useCRM();
  const [teacherPage, setTeacherPage] = useState<TeacherPageType>('dashboard');
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth < 1024;
  });

  useEffect(() => {
    document.title = "LUMOS LMS - Ustoz Paneli";
  }, []);

  const renderTeacherPage = () => {
    switch (teacherPage) {
      case 'dashboard':
        return <TeacherDashboardPage onNavigate={setTeacherPage} />;
      case 'lessons':
        return <TeacherLessonsPage />;
      case 'homework':
        return <TeacherHomeworkPage />;
      case 'attendance':
        return <TeacherAttendancePage />;
      case 'students':
        return <StudentsPage />;
      default:
        return <TeacherDashboardPage onNavigate={setTeacherPage} />;
    }
  };

  return (
    <div
      className="min-h-screen flex font-sans antialiased selection:bg-[#5A0B1C] selection:text-white bg-[#F8F9FC] dark:bg-slate-950 text-slate-900 dark:text-slate-100"
    >
      <TeacherSidebar
        activePage={teacherPage}
        setActivePage={setTeacherPage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile / Tablet Header for Teacher */}
        <header className="lg:hidden flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/95 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
              title="Menyu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-slate-900 dark:text-white font-serif">LUMOS</span>
                <span className="rounded-md bg-[#FAF0F2] px-1.5 py-0.5 text-[9px] font-black uppercase text-[#5A0B1C] dark:bg-[#5A0B1C]/20 dark:text-[#D9A62E]">
                  Ustoz
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium capitalize truncate max-w-[130px] sm:max-w-none">
                {teacherPage === 'dashboard' ? 'Bosh sahifa' : teacherPage === 'lessons' ? 'Darslar & Videolar' : teacherPage === 'homework' ? 'Uyga vazifalar' : teacherPage === 'attendance' ? 'Davomat olish' : 'O‘quvchilarim'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
              title="Mavzuni o‘zgartirish"
            >
              {settings.theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.hash = '#/landing';
              }}
              className="flex h-9 items-center gap-1 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5 text-amber-500" />
              <span className="hidden xs:inline">Sayt</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <Suspense fallback={<PageLoadingFallback />}>
            {renderTeacherPage()}
          </Suspense>
        </main>
      </div>

      <StudentProfileModal />
      <AddStudentModal />
      <ImportStudentsModal />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. STUDENT CONTENT (Strict Portal for Students)
// ─────────────────────────────────────────────────────────────────────────────

function StudentPortalContent() {
  const { settings, updateSettings } = useCRM();
  const [studentPage, setStudentPage] = useState<StudentPageType>('dashboard');
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth < 1024;
  });

  useEffect(() => {
    document.title = "Offline Student Panel";
  }, []);

  const renderStudentPage = () => {
    switch (studentPage) {
      case 'dashboard':
        return <StudentDashboardPage onNavigate={setStudentPage} />;
      case 'lessons':
        return <StudentLessonsPage />;
      case 'homework':
        return <StudentHomeworkPage />;
      case 'leaderboard':
        return <StudentLeaderboardPage />;
      case 'rewards':
        return <StudentRewardsPage />;
      case 'payments':
        return <StudentPaymentsPage />;
      default:
        return <StudentDashboardPage onNavigate={setStudentPage} />;
    }
  };

  return (
    <div
      className="min-h-screen flex font-sans antialiased selection:bg-emerald-600 selection:text-white bg-[#F8FAF9] dark:bg-slate-950 text-slate-900 dark:text-slate-100"
    >
      <StudentSidebar
        activePage={studentPage}
        setActivePage={setStudentPage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile / Tablet Header for Student */}
        <header className="lg:hidden flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/95 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
              title="Menyu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-slate-900 dark:text-white font-serif">LUMOS</span>
                <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                  Talaba
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium capitalize truncate max-w-[130px] sm:max-w-none">
                {studentPage === 'dashboard' ? 'Bosh sahifa' : studentPage === 'lessons' ? 'Darslar & Videolar' : studentPage === 'homework' ? 'Uyga vazifalar' : studentPage === 'leaderboard' ? 'Reyting' : studentPage === 'rewards' ? 'Sovg‘alar' : 'To‘lovlarim'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
              title="Mavzuni o‘zgartirish"
            >
              {settings.theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.hash = '#/landing';
              }}
              className="flex h-9 items-center gap-1 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Globe className="h-3.5 w-3.5 text-amber-500" />
              <span className="hidden xs:inline">Sayt</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <Suspense fallback={<PageLoadingFallback />}>
            {renderStudentPage()}
          </Suspense>
        </main>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP CONTENT ROUTER: AUTHENTIC SPLIT LOGIN WITH STRICT PORTAL ROUTING
// ─────────────────────────────────────────────────────────────────────────────

function AppContentRouter() {
  const { currentUser, currentRole } = useLMS();
  const [currentHash, setCurrentHash] = useState(() => {
    return typeof window !== 'undefined' ? window.location.hash.toLowerCase() : '';
  });

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash.toLowerCase());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 1. Payment Callback Pages
  if (currentHash.includes('payment/success')) {
    return (
      <Suspense fallback={<PageLoadingFallback />}>
        <PaymentSuccessPage />
      </Suspense>
    );
  }
  if (currentHash.includes('payment/failed')) {
    return (
      <Suspense fallback={<PageLoadingFallback />}>
        <PaymentFailedPage />
      </Suspense>
    );
  }

  // 2. Explicit Dedicated Login Pages (ONLY when requested via #/login, #/auth, #/student)
  const isStudentLoginRequested =
    currentHash === '#/student' ||
    currentHash === '#/student-login' ||
    currentHash.startsWith('#/student-login');

  const isAdminTeacherLoginRequested =
    currentHash === '#/login' ||
    currentHash === '#/auth' ||
    currentHash === '#/signin' ||
    currentHash === '#/admin-login' ||
    (currentHash === '#/admin' && !currentUser);

  if (!currentUser) {
    if (isStudentLoginRequested) {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <StudentLogin
            onSwitchToAdmin={() => {
              window.location.hash = '#/login';
            }}
            onBackToHome={() => {
              window.location.hash = '#/';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </Suspense>
      );
    }

    if (isAdminTeacherLoginRequested) {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <AdminTeacherLogin
            onSwitchToStudent={() => {
              window.location.hash = '#/student';
            }}
            onBackToHome={() => {
              window.location.hash = '#/';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </Suspense>
      );
    }
  }

  // 3. Authenticated Internal Portal (ONLY when logged in AND hash starts with portal route)
  const isPortalRoute =
    currentHash.startsWith('#/dashboard') ||
    currentHash.startsWith('#/portal') ||
    currentHash.startsWith('#/crm') ||
    currentHash.startsWith('#/erp') ||
    currentHash.startsWith('#/teacher') ||
    currentHash.startsWith('#/student-portal') ||
    (currentHash === '#/admin' && !!currentUser);

  if (currentUser && isPortalRoute) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 min-h-0">
          {currentRole === 'admin' && <AdminPortalContent />}
          {currentRole === 'teacher' && <TeacherPortalContent />}
          {currentRole === 'student' && <StudentPortalContent />}
        </div>

        <Toast />
        <PwaInstallPrompt />
      </div>
    );
  }

  // 4. Default: Render the Public Landing Page (Bosh sahifa) via Lazy Loading
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <LandingPage />
      <PwaInstallPrompt />
    </Suspense>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TELEGRAM BOT BACKGROUND POLLER
// ─────────────────────────────────────────────────────────────────────────────

function TelegramBotPoller() {
  const { settings, students, groups } = useCRM();

  useEffect(() => {
    const token = settings.telegramBotToken;
    if (!token) return;

    let isSubscribed = true;

    const poll = async () => {
      try {
        await processTelegramUpdates({
          botToken: token,
          students,
          groups,
          centerName: settings.centerName,
          centerPhone: settings.phone,
        });
      } catch (e) {
        // silent
      }
    };

    poll();

    const interval = setInterval(() => {
      if (isSubscribed) {
        poll();
      }
    }, 10000);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
    };
  }, [settings.telegramBotToken, settings.centerName, settings.phone, students, groups]);

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP ROOT
// ─────────────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <CRMProvider>
      <LMSProvider>
        <I18nProvider>
          <DataLoader>
            <TelegramBotPoller />
            <AppContentRouter />
          </DataLoader>
        </I18nProvider>
      </LMSProvider>
    </CRMProvider>
  );
}
