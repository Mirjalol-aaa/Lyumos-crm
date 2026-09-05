import React, { useState, useEffect } from 'react';
import { Toast } from './components/common/Toast';

import { CRMProvider, useCRM } from './context/CRMContext';
import { LMSProvider, useLMS } from './context/LMSContext';
import { I18nProvider } from './lib/i18n';
import { DataLoader } from './components/common/DataLoader';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Breadcrumb } from './components/layout/Breadcrumb';

// Public & Payment Pages
import { LandingPage } from './pages/public/LandingPage';
import { PaymentSuccessPage } from './pages/payment/PaymentSuccessPage';
import { PaymentFailedPage } from './pages/payment/PaymentFailedPage';

// Dedicated Authentic Login Pages
import { AdminTeacherLogin } from './pages/auth/AdminTeacherLogin';
import { StudentLogin } from './pages/auth/StudentLogin';

// Teacher Components & Pages
import { TeacherSidebar, TeacherPageType } from './components/teacher/TeacherSidebar';
import { TeacherDashboardPage } from './pages/teacher/TeacherDashboardPage';
import { TeacherLessonsPage } from './pages/teacher/TeacherLessonsPage';
import { TeacherHomeworkPage } from './pages/teacher/TeacherHomeworkPage';
import { TeacherAttendancePage } from './pages/teacher/TeacherAttendancePage';

// Student Components & Pages
import { StudentSidebar, StudentPageType } from './components/student/StudentSidebar';
import { StudentDashboardPage } from './pages/student/StudentDashboardPage';
import { StudentLessonsPage } from './pages/student/StudentLessonsPage';
import { StudentHomeworkPage } from './pages/student/StudentHomeworkPage';
import { StudentLeaderboardPage } from './pages/student/StudentLeaderboardPage';
import { StudentRewardsPage } from './pages/student/StudentRewardsPage';
import { StudentPaymentsPage } from './pages/student/StudentPaymentsPage';

// Admin Modals
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { StudentProfileModal } from './components/common/StudentProfileModal';
import { AddStudentModal } from './components/modals/AddStudentModal';
import { ReceivePaymentModal } from './components/modals/ReceivePaymentModal';
import { AddTeacherModal } from './components/modals/AddTeacherModal';
import { AddGroupModal } from './components/modals/AddGroupModal';
import { AddExpenseModal } from './components/modals/AddExpenseModal';

// Super Admin Pages (SaaS Redesign)
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminTeachersWorkloadPage } from './pages/admin/AdminTeachersWorkloadPage';
import { AdminCoursesGroupsPage } from './pages/admin/AdminCoursesGroupsPage';
import { AdminStudentsHubPage } from './pages/admin/AdminStudentsHubPage';
import { AdminFinancePayrollPage } from './pages/admin/AdminFinancePayrollPage';
import { AdminBranchesPage } from './pages/admin/AdminBranchesPage';
import { AdminCredentialsPage } from './pages/admin/AdminCredentialsPage';
import { AdminAuditSettingsPage } from './pages/admin/AdminAuditSettingsPage';
import { AdminSchedulePage } from './pages/admin/AdminSchedulePage';
import { AdminHomeworkPage } from './pages/admin/AdminHomeworkPage';
import { AdminGradesPage } from './pages/admin/AdminGradesPage';
import { AdminApplicationsPage } from './pages/admin/AdminApplicationsPage';

// Other Admin Pages
import { StudentsPage } from './pages/StudentsPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { AttendancePage } from './pages/AttendancePage';
import { TeachersPage } from './pages/TeachersPage';
import { GroupsPage } from './pages/GroupsPage';
import { ReportsPage } from './pages/ReportsPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { SettingsPage } from './pages/SettingsPage';

// ─────────────────────────────────────────────────────────────────────────────
// 1. SUPER ADMIN CONTENT (SaaS Redesign)
// ─────────────────────────────────────────────────────────────────────────────

function AdminPortalContent() {
  const { activePage, setActivePage, settings } = useCRM();
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
        return <AdminTeachersWorkloadPage />;
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
      className={`min-h-screen flex font-sans antialiased selection:bg-blue-600 selection:text-white ${
        settings.theme === 'dark'
          ? 'dark bg-slate-950 text-slate-100'
          : 'bg-[#F8F9FA] text-slate-900'
      }`}
    >
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
        />

        <Breadcrumb />

        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {renderPage()}
        </main>
      </div>

      <GlobalSearchModal />
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <StudentProfileModal />
      <AddStudentModal />
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
  const { settings } = useCRM();
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
      className={`min-h-screen flex font-sans antialiased selection:bg-indigo-600 selection:text-white ${
        settings.theme === 'dark'
          ? 'dark bg-slate-950 text-slate-100'
          : 'bg-[#F8F9FC] text-slate-900'
      }`}
    >
      <TeacherSidebar
        activePage={teacherPage}
        setActivePage={setTeacherPage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {renderTeacherPage()}
        </main>
      </div>

      <StudentProfileModal />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. STUDENT CONTENT (Strict Portal for Students)
// ─────────────────────────────────────────────────────────────────────────────

function StudentPortalContent() {
  const { settings } = useCRM();
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
      className={`min-h-screen flex font-sans antialiased selection:bg-emerald-600 selection:text-white ${
        settings.theme === 'dark'
          ? 'dark bg-slate-950 text-slate-100'
          : 'bg-[#F8FAF9] text-slate-900'
      }`}
    >
      <StudentSidebar
        activePage={studentPage}
        setActivePage={setStudentPage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          {renderStudentPage()}
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
    return <PaymentSuccessPage />;
  }
  if (currentHash.includes('payment/failed')) {
    return <PaymentFailedPage />;
  }

  // 2. Explicit Navigation to Public Website / Courses
  // Allows both visitors and logged in users to browse the public website and course information freely
  const isExplicitLandingRequested =
    currentHash.includes('landing') ||
    currentHash.includes('home') ||
    currentHash.startsWith('#courses') ||
    currentHash.startsWith('#teachers') ||
    currentHash.startsWith('#stats') ||
    currentHash.startsWith('#reviews') ||
    currentHash.startsWith('#contact');

  if (isExplicitLandingRequested) {
    return <LandingPage />;
  }

  // 3. Unauthenticated Visitor Flow
  if (!currentUser) {
    if (currentHash.includes('student')) {
      return (
        <StudentLogin
          onSwitchToAdmin={() => {
            window.location.hash = '#/admin';
          }}
          onBackToHome={() => {
            window.location.hash = '#/landing';
          }}
        />
      );
    }

    if (currentHash.includes('admin') || currentHash.includes('login')) {
      return (
        <AdminTeacherLogin
          onSwitchToStudent={() => {
            window.location.hash = '#/student';
          }}
          onBackToHome={() => {
            window.location.hash = '#/landing';
          }}
        />
      );
    }

    // Default public landing page at root and #/
    return <LandingPage />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 min-h-0">
        {currentRole === 'admin' && <AdminPortalContent />}
        {currentRole === 'teacher' && <TeacherPortalContent />}
        {currentRole === 'student' && <StudentPortalContent />}
      </div>

      <Toast />
    </div>
  );
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
            <AppContentRouter />
          </DataLoader>
        </I18nProvider>
      </LMSProvider>
    </CRMProvider>
  );
}