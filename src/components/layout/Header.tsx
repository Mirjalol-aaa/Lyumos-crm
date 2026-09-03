import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { useCRM } from '../../context/CRMContext';

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


const pageTitles: Record<string, string> = {
  dashboard: 'Boshqaruv Markazi',
  students_hub: 'O‘quvchilar Bazasi',
  teachers_workload: 'O‘qituvchilar & Yuklama',
  courses_groups: 'Guruhlar & Kurslar',
  attendance: 'Davomat Nazorati',
  finance_payroll: 'Moliya & Payroll',
  branches: 'Filiallar Boshqaruvi',
  credentials: 'Login & Parollar Boshqaruvi',
  reports: 'Tahliliy Hisobotlar',
  audit_settings: 'Rollar & Xavfsizlik Auditi',
  students: 'O‘quvchilar',
  payments: 'To‘lovlar Tarixi',
  teachers: 'O‘qituvchilar',
  groups: 'Guruhlar',
  expenses: 'Xarajatlar',
  settings: 'Tizim Sozlamalari',
};


export const Header:
  React.FC<HeaderProps> = ({
    collapsed,
    setCollapsed,
    onOpenNotifications,
  }) => {
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
              hidden
              min-w-0
              flex-col

              sm:flex
            "
          >
            <h1
              className="
                max-w-[150px]
                truncate

                text-sm
                font-semibold
                tracking-[-0.015em]
                text-slate-900

                dark:text-slate-100

                md:max-w-[190px]
                md:text-[15px]

                xl:max-w-[260px]
              "
            >
              {pageTitles[
                activePage
              ] || 'LUMOS ERP'}
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
              Academic Year{' '}
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
              Search students,
              teachers, groups...
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

            Receive Payment
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
            title="Add Student"
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
              Add Student
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


          {/* LANGUAGE */}

          <div
            ref={
              languageMenuRef
            }
            className="
              relative
              hidden

              md:block
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

                px-2.5

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
              title="Language"
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
                  settings.language
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
                  w-44

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
                    code: 'en',
                    label:
                      'English',
                  },
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
                ].map(
                  language => {
                    const isSelected =
                      settings.language ===
                      language.code;


                    return (
                      <button
                        type="button"
                        key={
                          language.code
                        }
                        onClick={() => {
                          updateSettings({
                            language:
                              language.code as any,
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
                            language.label
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


          {/* THEME */}

          <button
            type="button"
            onClick={
              toggleTheme
            }
            className="
              hidden
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

              sm:flex
            "
            title={
              settings.theme ===
              'dark'
                ? 'Use light mode'
                : 'Use dark mode'
            }
            aria-label={
              settings.theme ===
              'dark'
                ? 'Use light mode'
                : 'Use dark mode'
            }
          >
            {settings.theme ===
            'dark' ? (
              <Sun
                className="
                  h-[18px]
                  w-[18px]
                  text-amber-400
                "
              />
            ) : (
              <Moon
                className="
                  h-[18px]
                  w-[18px]
                "
              />
            )}
          </button>
        </div>
      </header>
    );
  };