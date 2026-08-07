import React, { useState } from 'react';
import { CRMProvider, useCRM } from './context/CRMContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Breadcrumb } from './components/layout/Breadcrumb';

// Modals
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { StudentProfileModal } from './components/common/StudentProfileModal';
import { AddStudentModal } from './components/modals/AddStudentModal';
import { ReceivePaymentModal } from './components/modals/ReceivePaymentModal';
import { AddTeacherModal } from './components/modals/AddTeacherModal';
import { AddGroupModal } from './components/modals/AddGroupModal';
import { AddExpenseModal } from './components/modals/AddExpenseModal';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { StudentsPage } from './pages/StudentsPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { AttendancePage } from './pages/AttendancePage';
import { TeachersPage } from './pages/TeachersPage';
import { GroupsPage } from './pages/GroupsPage';
import { ReportsPage } from './pages/ReportsPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { SettingsPage } from './pages/SettingsPage';

function CRMContent() {
  const { activePage, settings } = useCRM();
  const [collapsed, setCollapsed] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <DashboardPage />;
      case 'students': return <StudentsPage />;
      case 'payments': return <PaymentsPage />;
      case 'attendance': return <AttendancePage />;
      case 'teachers': return <TeachersPage />;
      case 'groups': return <GroupsPage />;
      case 'reports': return <ReportsPage />;
      case 'expenses': return <ExpensesPage />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className={`min-h-screen flex font-sans antialiased selection:bg-[#007AFF] selection:text-white ${
      settings.theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-[#F5F5F7] text-slate-900'
    }`}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Workspace */}
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

      {/* Global Modals & Drawers */}
      <GlobalSearchModal />
      <NotificationDrawer isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
      <StudentProfileModal />
      <AddStudentModal />
      <ReceivePaymentModal />
      <AddTeacherModal />
      <AddGroupModal />
      <AddExpenseModal />
    </div>
  );
}

export default function App() {
  return (
    <CRMProvider>
      <CRMContent />
    </CRMProvider>
  );
}
