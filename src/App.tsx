import React, { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';

import { CRMProvider, useCRM } from './context/CRMContext';
import { DataLoader } from './components/common/DataLoader';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Breadcrumb } from './components/layout/Breadcrumb';
import { supabase } from './lib/supabase';

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

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) {
      setError('Supabase konfiguratsiyasi topilmadi.');
      return;
    }

    setLoading(true);
    setError('');

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        <h1 className="text-2xl font-bold text-slate-900">
          LYUMOS CRM
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Tizimga kirish
        </p>

        <div className="mt-6 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Parol"
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900"
          />

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? 'Kirilmoqda...' : 'Kirish'}
          </button>
        </div>
      </form>
    </div>
  );
}

function CRMContent() {
  const { activePage, settings } = useCRM();
  const [collapsed, setCollapsed] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
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
        return <DashboardPage />;
    }
  };

  return (
    <div
      className={`min-h-screen flex font-sans antialiased selection:bg-[#007AFF] selection:text-white ${
        settings.theme === 'dark'
          ? 'dark bg-slate-950 text-slate-100'
          : 'bg-[#F5F5F7] text-slate-900'
      }`}
    >
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

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

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Yuklanmoqda...
      </div>
    );
  }

  if (!session) {
    return <LoginScreen />;
  }

  return (
    <CRMProvider>
      <DataLoader>
        <CRMContent />
      </DataLoader>
    </CRMProvider>
  );
}