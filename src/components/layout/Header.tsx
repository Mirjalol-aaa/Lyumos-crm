import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { useCRM } from '../../context/CRMContext';
import { useI18n, Language } from '../../lib/i18n';

import {
  Search,
  Bell,
  Plus,
  DollarSign,
  PanelLeftOpen,
  PanelLeftClose,
  Sun,
  Moon,
  Globe,
  Command,
  Check,
  Menu,
} from 'lucide-react';


interface HeaderProps {
  collapsed: boolean;

  setCollapsed:
    React.Dispatch<
      React.SetStateAction<boolean>
    >;

  onOpenNotifications:
    () => void;
}


const PAGE_TITLES_BY_LANG: Record<string, Record<Language, string>> = {
  dashboard: { uz: 'Boshqaruv Markazi', ru: 'Панель управления', en: 'Executive Dashboard' },
  schedule: { uz: 'Dars Jadvali', ru: 'Расписание занятий', en: 'Class Schedule' },
  homework: { uz: 'Uy Vazifalari', ru: 'Домашние задания', en: 'Homework & Tasks' },
  grades: { uz: 'Baholar & Reyting', ru: 'Оценки и Рейтинг', en: 'Grades & Ranking' },
  applications: { uz: 'Arizalar & Qabul', ru: 'Заявки и Прием', en: 'Applications & Leads' },
  students_hub: { uz: 'O‘quvchilar Bazasi', ru: 'База студентов', en: 'Students Directory' },
  teachers_workload: { uz: 'O‘qituvchilar & Yuklama', ru: 'Преподаватели и Нагрузка', en: 'Teachers & Workload' },
  courses_groups: { uz: 'Guruhlar & Kurslar', ru: 'Группы и Курсы', en: 'Groups & Courses' },
  attendance: { uz: 'Davomat Nazorati', ru: 'Контроль посещаемости', en: 'Attendance Tracking' },
  finance_payroll: { uz: 'Moliya & Payroll', ru: 'Финансы и Зарплаты', en: 'Finance & Payroll' },
  branches: { uz: 'Filiallar Boshqaruvi', ru: 'Управление филиалами', en: 'Branch Network' },
  credentials: { uz: 'Login & Parollar Boshqaruvi', ru: 'Логины и Пароли', en: 'Credentials Management' },
  audit_settings: { uz: 'Rollar & Audit Log', ru: 'Роли и Журнал действий', en: 'Roles & Audit Logs' },
  reports: { uz: 'Tahliliy Hisobotlar', ru: 'Аналитические отчеты', en: 'Analytics & Reports' },
  expenses: { uz: 'Xarajatlar Nazorati', ru: 'Контроль расходов', en: 'Expenses Registry' },
  payments: { uz: 'To‘lovlar Tarixi', ru: 'История платежей', en: 'Payments Ledger' },
  settings: { uz: 'Tizim Sozlamalari', ru: 'Настройки системы', en: 'System Settings' },
  students: { uz: 'O‘quvchilar', ru: 'Студенты', en: 'Students' },
  teachers: { uz: 'O‘qituvchilar', ru: 'Учителя', en: 'Teachers' },
  groups: { uz: 'Guruhlar', ru: 'Группы', en: 'Groups' },
};

export const Header:
  React.FC<HeaderProps> = ({
    collapsed,
    setCollapsed,
    onOpenNotifications,
  }) => {
    const { t, language, setLanguage } = useI18n();

    const {
      setIsGlobalSearchOpen,

      notifications,

      setIsAddStudentModalOpen,

      setIsReceivePaymentModalOpen,

      settings,

      updateSettings,

      activePage,
    } = useCRM();


    const [
      langMenuOpen,
      setLangMenuOpen,
    ] = useState(false);


    const languageMenuRef =
      useRef<HTMLDivElement | null>(
        null
      );


    const unreadCount =
      notifications.filter(
        notification =>
          !notification.read
      ).length;


    const isMac =
      typeof navigator !==
        'undefined' &&
      /Mac|iPhone|iPad|iPod/i.test(
        navigator.platform
      );


    // ================================================================
    // GLOBAL SEARCH SHORTCUT + ESC
    // ================================================================

    useEffect(() => {
      const handleKeyDown = (
        event: KeyboardEvent
      ) => {
        if (
          (
            event.ctrlKey ||
            event.metaKey
          ) &&
          event.key.toLowerCase() ===
            'k'
        ) {
          event.preventDefault();

          setIsGlobalSearchOpen(
            true
          );
        }


        if (
          event.key ===
          'Escape'
        ) {
          setLangMenuOpen(
            false
          );
        }
      };


      window.addEventListener(
        'keydown',
        handleKeyDown
      );


      return () => {
        window.removeEventListener(
          'keydown',
          handleKeyDown
        );
      };
    }, [
      setIsGlobalSearchOpen,
    ]);


    // ================================================================
    // CLOSE LANGUAGE MENU ON OUTSIDE CLICK
    // ================================================================

    useEffect(() => {
      const handleOutsideClick = (
        event: MouseEvent
      ) => {
        if (
          !languageMenuRef.current
        ) {
          return;
        }


        const target =
          event.target as Node;


        if (
          !languageMenuRef.current
            .contains(target)
        ) {
          setLangMenuOpen(
            false
          );
        }
      };


      document.addEventListener(
        'mousedown',
        handleOutsideClick
      );


      return () => {
        document.removeEventListener(
          'mousedown',
          handleOutsideClick
        );
      };
    }, []);


    // ================================================================
    // SIDEBAR
    // ================================================================

    const toggleSidebar =
      () => {
        setCollapsed(
          previous =>
            !previous
        );
      };


    // ================================================================
    // THEME
    // ================================================================

    const toggleTheme =
      () => {
        updateSettings({
          theme:
            settings.theme ===
            'dark'
              ? 'light'
              : 'dark',
        });
      };


    return (
      <header
        className="
          sticky
          top-0
          z-30

          flex
          h-[68px]
          shrink-0
          items-center

          border-b
          border-slate-200/70

          bg-white/95

          px-3

          backdrop-blur-xl

          dark:border-white/[0.06]
          dark:bg-slate-900/95

          sm:px-4
          lg:px-5
        "
      >
        {/* ============================================================
            LEFT
        ============================================================ */}

        <div
          className="
            flex
            min-w-0
            shrink-0
            items-center
            gap-2.5

            sm:gap-3
          "
        >
          {/* SIDEBAR TOGGLE */}

          <button
            type="button"
            onClick={
              toggleSidebar
            }
            className="
              group

              flex
              h-10
              w-10
              shrink-0

              cursor-pointer
              items-center
              justify-center

              rounded-xl

              border
              border-transparent

              text-slate-500

              transition-all
              duration-200

              hover:border-slate-200
              hover:bg-slate-100
              hover:text-slate-900

              active:scale-[0.96]

              dark:text-slate-400

              dark:hover:border-slate-700
              dark:hover:bg-slate-800
              dark:hover:text-white
            "
            title={
              collapsed
                ? 'Open sidebar'
                : 'Close sidebar'
            }
            aria-label={
              collapsed
                ? 'Open sidebar'
                : 'Close sidebar'
            }
          >
            {/* MOBILE:
                only ONE hamburger */}

            <Menu
              className="
                h-[19px]
                w-[19px]

                lg:hidden
              "
            />


            {/* DESKTOP:
                clear open / close icon */}

            {collapsed ? (
              <PanelLeftOpen
                className="
                  hidden
                  h-[19px]
                  w-[19px]

                  lg:block
                "
              />
            ) : (
              <PanelLeftClose
                className="
                  hidden
                  h-[19px]
                  w-[19px]

                  lg:block
                "
              />
            )}
          </button>


          {/* PAGE CONTEXT */}

          <div
            className="
              flex
              min-w-0
              flex-col
            "
          >
            <h1
              className="
                max-w-[115px]
                truncate

                text-xs
                font-bold
                tracking-tight
                text-slate-900

                dark:text-slate-100

                sm:max-w-[160px]
                sm:text-sm
                sm:font-semibold

                md:max-w-[200px]
                md:text-[15px]

                xl:max-w-[280px]
              "
            >
              {PAGE_TITLES_BY_LANG[
                activePage
              ]?.[language] ||
                PAGE_TITLES_BY_LANG[
                  activePage
                ]?.uz ||
                'LUMOS ERP'}
            </h1>


            <span
              className="
                mt-0.5

                hidden
                truncate

                text-[10px]
                font-medium
                text-slate-400

                xl:block
              "
            >
              {t.common.academicYear}{' '}
              {
                settings.academicYear
              }
            </span>
          </div>
        </div>


        {/* ============================================================
            SEARCH
        ============================================================ */}

        <div
          className="
            mx-4
            hidden
            min-w-0
            max-w-[520px]
            flex-1

            lg:block
            xl:mx-6
          "
        >
          <button
            type="button"
            onClick={() =>
              setIsGlobalSearchOpen(
                true
              )
            }
            className="
              group

              flex
              h-11
              w-full

              cursor-pointer
              items-center
              gap-3

              rounded-xl

              border
              border-slate-200/80

              bg-slate-50

              px-3.5

              text-slate-400

              transition-all
              duration-200

              hover:border-slate-300
              hover:bg-white
              hover:shadow-sm

              dark:border-slate-700/80
              dark:bg-slate-800/65
              dark:text-slate-500

              dark:hover:border-slate-600
              dark:hover:bg-slate-800
            "
          >
            <Search
              className="
                h-[17px]
                w-[17px]
                shrink-0

                transition-colors

                group-hover:text-[#007AFF]
              "
            />


            <span
              className="
                min-w-0
                flex-1
                truncate
                text-left

                text-[13px]
                font-medium
              "
            >
              {language === 'en'
                ? 'Search students, teachers, groups...'
                : language === 'ru'
                ? 'Поиск учеников, учителей, групп...'
                : 'O‘quvchilar, ustozlar, guruhlarni qidirish...'}
            </span>


            <kbd
              className="
                hidden
                shrink-0
                items-center
                gap-1

                rounded-md

                border
                border-slate-200

                bg-white

                px-2
                py-1

                text-[9px]
                font-semibold
                text-slate-400

                shadow-sm

                dark:border-slate-700
                dark:bg-slate-900

                xl:inline-flex
              "
            >
              {isMac ? (
                <>
                  <Command
                    className="
                      h-3
                      w-3
                    "
                  />

                  K
                </>
              ) : (
                <>
                  Ctrl

                  <span
                    className="
                      text-slate-300

                      dark:text-slate-600
                    "
                  >
                    +
                  </span>

                  K
                </>
              )}
            </kbd>
          </button>
        </div>


        {/* ============================================================
            RIGHT
        ============================================================ */}

        <div
          className="
            ml-auto

            flex
            shrink-0
            items-center
            gap-1

            sm:gap-1.5
          "
        >
          {/* MOBILE/TABLET SEARCH */}

          <button
            type="button"
            onClick={() =>
              setIsGlobalSearchOpen(
                true
              )
            }
            className="
              flex
              h-10
              w-10
              shrink-0

              cursor-pointer
              items-center
              justify-center

              rounded-xl

              text-slate-500

              transition-all

              hover:bg-slate-100
              hover:text-slate-900

              active:scale-[0.96]

              dark:text-slate-400
              dark:hover:bg-slate-800
              dark:hover:text-white

              lg:hidden
            "
            title="Search"
            aria-label="Search"
          >
            <Search
              className="
                h-[18px]
                w-[18px]
              "
            />
          </button>


          {/* RECEIVE PAYMENT */}

          <button
            type="button"
            onClick={() =>
              setIsReceivePaymentModalOpen(
                true
              )
            }
            className="
              hidden
              h-10

              cursor-pointer
              items-center
              justify-center
              gap-2

              rounded-xl

              bg-emerald-600

              px-4

              text-xs
              font-semibold
              text-white

              shadow-md
              shadow-emerald-600/20

              transition-all

              hover:bg-emerald-700
              hover:shadow-lg
              hover:shadow-emerald-600/20

              active:scale-[0.98]

              xl:flex
            "
          >
            <DollarSign
              className="
                h-4
                w-4
              "
            />

            {t.common.receivePayment}
          </button>


          {/* ADD STUDENT */}

          <button
            type="button"
            onClick={() =>
              setIsAddStudentModalOpen(
                true
              )
            }
            className="
              flex
              h-10
              shrink-0

              cursor-pointer
              items-center
              justify-center
              gap-2

              rounded-xl

              bg-[#007AFF]

              px-3

              text-xs
              font-semibold
              text-white

              shadow-md
              shadow-blue-500/20

              transition-all

              hover:bg-[#006EE6]
              hover:shadow-lg
              hover:shadow-blue-500/20

              active:scale-[0.98]

              md:px-4
            "
            title={t.common.addStudent}
          >
            <Plus
              className="
                h-4
                w-4
              "
            />


            <span
              className="
                hidden
                md:inline
              "
            >
              {t.common.addStudent}
            </span>
          </button>


          {/* DIVIDER */}

          <div
            className="
              mx-1
              hidden
              h-6
              w-px

              bg-slate-200

              dark:bg-slate-800

              sm:block
            "
          />


          {/* NOTIFICATIONS */}

          <button
            type="button"
            onClick={
              onOpenNotifications
            }
            className="
              relative

              flex
              h-10
              w-10
              shrink-0

              cursor-pointer
              items-center
              justify-center

              rounded-xl

              text-slate-500

              transition-all

              hover:bg-slate-100
              hover:text-slate-900

              active:scale-[0.96]

              dark:text-slate-400

              dark:hover:bg-slate-800
              dark:hover:text-white
            "
            title="Notifications"
            aria-label={`Notifications${
              unreadCount > 0
                ? `, ${unreadCount} unread`
                : ''
            }`}
          >
            <Bell
              className="
                h-[18px]
                w-[18px]
              "
            />


            {unreadCount > 0 && (
              <span
                className="
                  absolute
                  right-[8px]
                  top-[7px]

                  h-2.5
                  w-2.5

                  rounded-full

                  bg-rose-500

                  ring-2
                  ring-white

                  dark:ring-slate-900
                "
              />
            )}
          </button>


          {/* VIEW MAIN PUBLIC WEBSITE */}
          <button
            type="button"
            onClick={() => {
              window.location.hash = '#/landing';
            }}
            className="
              hidden
              sm:flex
              h-10
              cursor-pointer
              items-center
              gap-1.5
              rounded-xl
              border
              border-slate-200/80
              bg-slate-50
              px-2.5
              text-xs
              font-bold
              text-slate-600
              transition-all
              hover:border-amber-300
              hover:bg-amber-50
              hover:text-amber-700
              dark:border-slate-700/60
              dark:bg-slate-800
              dark:text-slate-300
              dark:hover:bg-slate-700
              sm:px-3
            "
            title="LUMOS Asosiy saytini ko‘rish"
          >
            <Globe
              className="
                h-4
                w-4
                text-amber-500
              "
            />
            <span className="hidden sm:inline">
              {t.common.publicSite}
            </span>
          </button>


          {/* LANGUAGE (RESPONSIVE ON ALL SCREENS) */}

          <div
            ref={
              languageMenuRef
            }
            className="
              relative
              flex
            "
          >
            <button
              type="button"
              onClick={() =>
                setLangMenuOpen(
                  previous =>
                    !previous
                )
              }
              className={`
                flex
                h-10

                cursor-pointer
                items-center
                gap-1.5

                rounded-xl

                px-2
                sm:px-2.5

                text-slate-500

                transition-all

                hover:bg-slate-100
                hover:text-slate-900

                dark:text-slate-400

                dark:hover:bg-slate-800
                dark:hover:text-white

                ${
                  langMenuOpen
                    ? `
                      bg-slate-100
                      text-slate-900

                      dark:bg-slate-800
                      dark:text-white
                    `
                    : ''
                }
              `}
              title={language === 'en' ? 'Language' : language === 'ru' ? 'Язык' : 'Til'}
              aria-expanded={
                langMenuOpen
              }
            >
              <Globe
                className="
                  h-[18px]
                  w-[18px]
                "
              />


              <span
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                "
              >
                {
                  language
                }
              </span>
            </button>


            {langMenuOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-full
                  z-50

                  mt-2
                  w-40
                  sm:w-44

                  overflow-hidden

                  rounded-xl

                  border
                  border-slate-200

                  bg-white

                  p-1.5

                  shadow-2xl
                  shadow-slate-900/10

                  dark:border-slate-700
                  dark:bg-slate-900
                "
              >
                {[
                  {
                    code: 'uz',
                    label:
                      "O'zbekcha",
                  },
                  {
                    code: 'ru',
                    label:
                      'Русский',
                  },
                  {
                    code: 'en',
                    label:
                      'English',
                  },
                ].map(
                  langItem => {
                    const isSelected =
                      language ===
                      langItem.code;


                    return (
                      <button
                        type="button"
                        key={
                          langItem.code
                        }
                        onClick={() => {
                          setLanguage(
                            langItem.code as any
                          );
                          updateSettings({
                            language:
                              langItem.code as any,
                          });


                          setLangMenuOpen(
                            false
                          );
                        }}
                        className={`
                          flex
                          w-full

                          cursor-pointer
                          items-center
                          justify-between

                          rounded-lg

                          px-3
                          py-2.5

                          text-left
                          text-xs
                          font-medium

                          transition-colors

                          ${
                            isSelected
                              ? `
                                bg-blue-50
                                text-[#007AFF]

                                dark:bg-blue-950/30
                                dark:text-blue-400
                              `
                              : `
                                text-slate-600

                                hover:bg-slate-100
                                hover:text-slate-900

                                dark:text-slate-300

                                dark:hover:bg-slate-800
                                dark:hover:text-white
                              `
                          }
                        `}
                      >
                        <span>
                          {
                            langItem.label
                          }
                        </span>


                        {isSelected && (
                          <Check
                            className="
                              h-4
                              w-4
                            "
                          />
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            )}
          </div>


          {/* THEME (RESPONSIVE ON ALL SCREENS) */}

          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900 active:scale-[0.96] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white overflow-hidden relative"
            title={
              settings.theme === 'dark'
                ? "Yorug' rejimga o'tish"
                : "Qorong'i rejimga o'tish"
            }
            aria-label={
              settings.theme === 'dark'
                ? "Yorug' rejimga o'tish"
                : "Qorong'i rejimga o'tish"
            }
          >
            <span
              className={`inline-flex items-center justify-center transition-all duration-500 ease-out transform ${
                settings.theme === 'dark'
                  ? 'rotate-0 scale-100 opacity-100'
                  : 'rotate-90 scale-0 opacity-0 absolute'
              }`}
            >
              <Sun className="h-[18px] w-[18px] text-amber-400" />
            </span>
            <span
              className={`inline-flex items-center justify-center transition-all duration-500 ease-out transform ${
                settings.theme === 'dark'
                  ? '-rotate-90 scale-0 opacity-0 absolute'
                  : 'rotate-0 scale-100 opacity-100'
              }`}
            >
              <Moon className="h-[18px] w-[18px]" />
            </span>
          </button>

        </div>
      </header>
    );
  };