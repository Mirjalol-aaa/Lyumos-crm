import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { useI18n, Language } from '../../lib/i18n';
import { ChevronRight, Home } from 'lucide-react';

const PAGE_LABELS_BY_LANG: Record<string, Record<Language, string>> = {
  dashboard: { uz: 'Boshqaruv Markazi', ru: 'Панель управления', en: 'Executive Dashboard' },
  students_hub: { uz: 'O‘quvchilar Bazasi', ru: 'База студентов', en: 'Students Directory' },
  teachers_workload: { uz: 'O‘qituvchilar & Yuklama', ru: 'Преподаватели и Нагрузка', en: 'Teachers & Workload' },
  courses_groups: { uz: 'Guruhlar & Kurslar', ru: 'Группы и Курсы', en: 'Groups & Courses' },
  attendance: { uz: 'Davomat Nazorati', ru: 'Контроль посещаемости', en: 'Attendance Tracking' },
  finance_payroll: { uz: 'Moliya & Payroll', ru: 'Финансы и Зарплаты', en: 'Finance & Payroll' },
  branches: { uz: 'Filiallar Boshqaruvi', ru: 'Управление филиалами', en: 'Branch Network' },
  credentials: { uz: 'Login & Parollar', ru: 'Логины и Пароли', en: 'Credentials Management' },
  reports: { uz: 'Tahliliy Hisobotlar', ru: 'Аналитические отчеты', en: 'Analytics & Reports' },
  audit_settings: { uz: 'Rollar & Audit Log', ru: 'Роли и Журнал действий', en: 'Roles & Audit Logs' },
  students: { uz: 'O‘quvchilar', ru: 'Студенты', en: 'Students' },
  payments: { uz: 'To‘lovlar Tarixi', ru: 'История платежей', en: 'Payments Ledger' },
  teachers: { uz: 'O‘qituvchilar', ru: 'Учителя', en: 'Teachers' },
  groups: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' },
  expenses: { uz: 'Xarajatlar', ru: 'Расходы', en: 'Expenses' },
  settings: { uz: 'Tizim Sozlamalari', ru: 'Настройки системы', en: 'System Settings' },
  schedule: { uz: 'Dars Jadvali', ru: 'Расписание занятий', en: 'Class Schedule' },
  homework: { uz: 'Uy Vazifalari', ru: 'Домашние задания', en: 'Homework & Tasks' },
  grades: { uz: 'Baholar & Reyting', ru: 'Оценки и Рейтинг', en: 'Grades & Ranking' },
  applications: { uz: 'Arizalar & Qabul', ru: 'Заявки и Прием', en: 'Applications & Leads' },
};

export const Breadcrumb: React.FC = () => {
  const { language } = useI18n();
  const { activePage, setActivePage, selectedStudentId, selectedTeacherId, selectedGroupId, students, teachers, groups } = useCRM();

  const getSubLabel = () => {
    if (selectedStudentId) {
      const s = students.find(item => item.id === selectedStudentId);
      return s ? s.fullName : selectedStudentId;
    }
    if (selectedTeacherId) {
      const t = teachers.find(item => item.id === selectedTeacherId);
      return t ? t.fullName : selectedTeacherId;
    }
    if (selectedGroupId) {
      const g = groups.find(item => item.id === selectedGroupId);
      return g ? g.name : selectedGroupId;
    }
    return null;
  };

  const subLabel = getSubLabel();
  const pageTitle = PAGE_LABELS_BY_LANG[activePage]?.[language] || PAGE_LABELS_BY_LANG[activePage]?.uz || activePage;

  return (
    <nav className="flex items-center gap-2 py-2.5 px-6 text-xs font-medium text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-900/40 border-b border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xs">
      <button 
        onClick={() => setActivePage('dashboard')} 
        className="flex items-center gap-1.5 hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-bold"
      >
        <Home className="w-3.5 h-3.5" />
        <span>LUMOS</span>
      </button>

      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

      <span className={`${!subLabel ? 'font-black text-slate-900 dark:text-white' : 'hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer'}`}
        onClick={() => subLabel && setActivePage(activePage)}
      >
        {pageTitle}
      </span>

      {subLabel && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-bold text-amber-600 dark:text-amber-400 truncate max-w-[200px]">
            {subLabel}
          </span>
        </>
      )}
    </nav>
  );
};
