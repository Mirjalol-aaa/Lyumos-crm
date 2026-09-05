import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useCRM } from '../context/CRMContext';

import {
  CheckCheck,
  Save,
  CheckCircle2,
  Users,
  CalendarDays,
} from 'lucide-react';

import type {
  AttendanceStatus,
} from '../types/crm';

import confetti from 'canvas-confetti';


const ATTENDANCE_STATUSES: AttendanceStatus[] = [
  'Present',
  'Absent',
  'Late',
  'Excused',
];

const STATUS_UZ: Record<AttendanceStatus, { label: string; icon: string }> = {
  Present: { label: 'Keldi', icon: '🟢' },
  Absent: { label: 'Kelmagan', icon: '🔴' },
  Late: { label: 'Kechikdi', icon: '🟡' },
  Excused: { label: 'Sababli', icon: '🔵' },
};


export const AttendancePage: React.FC = () => {
  const {
    groups,
    students,
    attendanceRecords,
    saveAttendance,
  } = useCRM();


  const [
    selectedGroupId,
    setSelectedGroupId,
  ] = useState('');


  const [
    selectedDate,
    setSelectedDate,
  ] = useState(
    new Date()
      .toISOString()
      .split('T')[0]
  );


  const [
    attendanceState,
    setAttendanceState,
  ] = useState<
    Record<
      string,
      AttendanceStatus
    >
  >({});


  const [
    justSaved,
    setJustSaved,
  ] = useState(false);


  // ─────────────────────────────────────────────────────────────────────────
  // SELECT FIRST AVAILABLE GROUP
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (groups.length === 0) {
      return;
    }

    const selectedStillExists =
      groups.some(
        group =>
          group.id ===
          selectedGroupId
      );

    if (
      !selectedGroupId ||
      !selectedStillExists
    ) {
      setSelectedGroupId(
        groups[0].id
      );
    }
  }, [
    groups,
    selectedGroupId,
  ]);


  // ─────────────────────────────────────────────────────────────────────────
  // ACTIVE GROUP
  // ─────────────────────────────────────────────────────────────────────────

  const activeGroup =
    useMemo(() => {
      return groups.find(
        group =>
          group.id ===
          selectedGroupId
      );
    }, [
      groups,
      selectedGroupId,
    ]);


  // ─────────────────────────────────────────────────────────────────────────
  // GROUP STUDENTS
  // ─────────────────────────────────────────────────────────────────────────

  const groupStudents =
    useMemo(() => {
      if (!activeGroup) {
        return [];
      }

      return students.filter(
        student =>
          student.groupId ===
          activeGroup.id
      );
    }, [
      students,
      activeGroup,
    ]);


  // ─────────────────────────────────────────────────────────────────────────
  // LOAD SAVED ATTENDANCE
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!activeGroup) {
      setAttendanceState({});
      return;
    }

    const nextState:
      Record<
        string,
        AttendanceStatus
      > = {};

    groupStudents.forEach(
      student => {
        const savedRecord =
          attendanceRecords.find(
            record =>
              record.studentId ===
                student.id &&
              record.date ===
                selectedDate
          );

        nextState[
          student.id
        ] =
          savedRecord?.status ??
          'Present';
      }
    );

    setAttendanceState(
      nextState
    );

    setJustSaved(false);
  }, [
    activeGroup,
    groupStudents,
    selectedDate,
    attendanceRecords,
  ]);


  // ─────────────────────────────────────────────────────────────────────────
  // STATUS CHANGE
  // ─────────────────────────────────────────────────────────────────────────

  const handleStatusChange = (
    studentId: string,
    status: AttendanceStatus
  ) => {
    setAttendanceState(
      previous => ({
        ...previous,
        [studentId]:
          status,
      })
    );

    setJustSaved(false);
  };


  // ─────────────────────────────────────────────────────────────────────────
  // MARK ALL PRESENT
  // ─────────────────────────────────────────────────────────────────────────

  const markAllPresent = () => {
    const updated:
      Record<
        string,
        AttendanceStatus
      > = {};

    groupStudents.forEach(
      student => {
        updated[
          student.id
        ] = 'Present';
      }
    );

    setAttendanceState(
      updated
    );

    setJustSaved(false);
  };


  // ─────────────────────────────────────────────────────────────────────────
  // SAVE
  // ─────────────────────────────────────────────────────────────────────────

  const handleSave = () => {
    if (!activeGroup) {
      return;
    }

    if (
      groupStudents.length === 0
    ) {
      return;
    }

    const records =
      groupStudents.map(
        student => ({
          date:
            selectedDate,

          groupId:
            activeGroup.id,

          studentId:
            student.id,

          studentName:
            student.fullName,

          status:
            attendanceState[
              student.id
            ] ??
            'Present',
        })
      );

    saveAttendance(
      records
    );

    setJustSaved(true);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: {
        y: 0.7,
      },
    });

    window.setTimeout(
      () => {
        setJustSaved(false);
      },
      2500
    );
  };


  // ─────────────────────────────────────────────────────────────────────────
  // STATISTICS
  // ─────────────────────────────────────────────────────────────────────────

  const presentCount =
    groupStudents.filter(
      student =>
        (
          attendanceState[
            student.id
          ] ??
          'Present'
        ) ===
        'Present'
    ).length;


  const absentCount =
    groupStudents.filter(
      student =>
        attendanceState[
          student.id
        ] ===
        'Absent'
    ).length;


  const lateCount =
    groupStudents.filter(
      student =>
        attendanceState[
          student.id
        ] ===
        'Late'
    ).length;


  const excusedCount =
    groupStudents.filter(
      student =>
        attendanceState[
          student.id
        ] ===
        'Excused'
    ).length;


  const attendancePercentage =
    groupStudents.length > 0
      ? (
          (
            presentCount /
            groupStudents.length
          ) *
          100
        ).toFixed(1)
      : '0.0';


  // ─────────────────────────────────────────────────────────────────────────
  // STATUS BUTTON STYLE
  // ─────────────────────────────────────────────────────────────────────────

  const getStatusButtonClass = (
    status: AttendanceStatus,
    currentStatus: AttendanceStatus
  ) => {
    const isActive =
      currentStatus === status;

    if (!isActive) {
      return `
        border
        border-slate-200/70
        bg-slate-100
        text-slate-500

        hover:bg-slate-200
        hover:text-slate-700

        dark:border-slate-700
        dark:bg-slate-800
        dark:text-slate-400
        dark:hover:bg-slate-700
        dark:hover:text-white
      `;
    }

    switch (status) {
      case 'Present':
        return `
          border
          border-emerald-600
          bg-emerald-600
          text-white
          shadow-sm
          shadow-emerald-600/20
        `;

      case 'Absent':
        return `
          border
          border-rose-600
          bg-rose-600
          text-white
          shadow-sm
          shadow-rose-600/20
        `;

      case 'Late':
        return `
          border
          border-amber-500
          bg-amber-500
          text-white
          shadow-sm
          shadow-amber-500/20
        `;

      default:
        return `
          border
          border-blue-600
          bg-blue-600
          text-white
          shadow-sm
          shadow-blue-600/20
        `;
    }
  };


  return (
    <div
      className="
        mx-auto
        w-full
        max-w-7xl
        space-y-4
        px-3
        py-4

        sm:space-y-5
        sm:px-5
        sm:py-5

        lg:space-y-6
        lg:px-6
        lg:py-6

        xl:px-8
        xl:py-8
      "
    >
      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          gap-4

          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div
          className="
            min-w-0
          "
        >
          <h1
            className="
              text-xl
              font-black
              tracking-tight
              text-slate-900

              dark:text-white

              sm:text-2xl
            "
          >
            Davomat Nazorati & Jurnali
          </h1>

          <p
            className="
              mt-1
              text-[11px]
              leading-relaxed
              text-slate-500

              sm:text-xs
            "
          >
            Guruhlar va dars sanalari bo‘yicha o‘quvchilar davomatini yuritish hamda tasdiqlash.
          </p>
        </div>


        <button
          type="button"
          onClick={
            handleSave
          }
          disabled={
            !activeGroup ||
            groupStudents.length ===
              0
          }
          className={`
            flex w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            px-5 py-2.5
            text-xs
            font-bold
            text-white
            shadow-lg
            transition-all

            active:scale-[0.98]

            sm:w-auto

            ${
              justSaved
                ? `
                  bg-emerald-600
                  shadow-emerald-500/20
                `
                : `
                  bg-gradient-to-r from-amber-500 to-amber-600
                  shadow-amber-500/20

                  hover:from-amber-600 hover:to-amber-700
                `
            }

            ${
              !activeGroup ||
              groupStudents.length ===
                0
                ? `
                  cursor-not-allowed
                  opacity-50
                `
                : `
                  cursor-pointer
                `
            }
          `}
        >
          {justSaved ? (
            <>
              <CheckCircle2
                className="
                  h-4 w-4
                  shrink-0
                "
              />

              Saqlandi ✓
            </>
          ) : (
            <>
              <Save
                className="
                  h-4 w-4
                  shrink-0
                "
              />

              Davomatni Saqlash
            </>
          )}
        </button>
      </div>


      {/* CONTROLS */}

      <div
        className="
          rounded-2xl
          border
          border-slate-200/60
          bg-white
          p-4
          shadow-sm

          dark:border-slate-800
          dark:bg-slate-900

          sm:p-5
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4

            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div
            className="
              grid
              w-full
              grid-cols-1
              gap-3

              sm:grid-cols-2

              lg:max-w-2xl
            "
          >
            {/* GROUP */}

            <div
              className="
                min-w-0
              "
            >
              <label
                className="
                  mb-1.5
                  block
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                Guruhni Tanlang
              </label>

              <select
                value={
                  selectedGroupId
                }
                onChange={
                  event =>
                    setSelectedGroupId(
                      event.target.value
                    )
                }
                className="
                  h-10
                  w-full
                  cursor-pointer
                  rounded-xl
                  border
                  border-slate-200/80
                  bg-slate-50
                  px-3.5
                  text-xs
                  font-bold
                  text-slate-900
                  outline-none
                  transition-all

                  focus:border-[#007AFF]/40
                  focus:ring-2
                  focus:ring-[#007AFF]/10

                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-white
                "
              >
                {groups.map(
                  group => (
                    <option
                      key={
                        group.id
                      }
                      value={
                        group.id
                      }
                    >
                      {group.name}
                      {' — '}
                      {
                        group.teacherName
                      }
                    </option>
                  )
                )}
              </select>
            </div>


            {/* DATE */}

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-400
                "
              >
                Dars Sanasi
              </label>

              <input
                type="date"
                value={
                  selectedDate
                }
                onChange={
                  event =>
                    setSelectedDate(
                      event.target.value
                    )
                }
                className="
                  h-10
                  w-full
                  cursor-pointer
                  rounded-xl
                  border
                  border-slate-200/80
                  bg-slate-50
                  px-3.5
                  text-xs
                  font-bold
                  text-slate-900
                  outline-none
                  transition-all

                  focus:border-[#007AFF]/40
                  focus:ring-2
                  focus:ring-[#007AFF]/10

                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-white
                "
              />
            </div>
          </div>


          {/* MARK ALL */}

          <button
            type="button"
            onClick={
              markAllPresent
            }
            disabled={
              groupStudents.length ===
              0
            }
            className="
              flex w-full
              cursor-pointer
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-emerald-200/60
              bg-emerald-50
              px-4 py-2.5
              text-xs
              font-bold
              text-emerald-700
              transition-all

              hover:bg-emerald-100

              disabled:cursor-not-allowed
              disabled:opacity-50

              dark:border-emerald-900
              dark:bg-emerald-950/50
              dark:text-emerald-300

              lg:w-auto
            "
          >
            <CheckCheck
              className="
                h-4 w-4
                shrink-0
                text-emerald-600
              "
            />

            ✓ Barchasini Kelgan Deb Belgilash
          </button>
        </div>
      </div>


      {/* GROUP INFO */}

      {activeGroup && (
        <div
          className="
            flex
            flex-col
            gap-3
            rounded-2xl
            border
            border-blue-200/50
            bg-blue-50/50
            px-4 py-3

            dark:border-blue-900/40
            dark:bg-blue-950/20

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div
            className="
              flex
              min-w-0
              items-center
              gap-3
            "
          >
            <div
              className="
                flex h-9 w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#007AFF]
                text-white
              "
            >
              <Users
                className="
                  h-4 w-4
                "
              />
            </div>

            <div
              className="
                min-w-0
              "
            >
              <p
                className="
                  truncate
                  text-xs
                  font-bold
                  text-slate-900

                  dark:text-white
                "
              >
                {activeGroup.name}
              </p>

              <p
                className="
                  mt-0.5
                  truncate
                  text-[10px]
                  text-slate-500
                "
              >
                O‘qituvchi:{' '}
                {
                  activeGroup.teacherName
                }
              </p>
            </div>
          </div>

          <div
            className="
              flex items-center
              gap-2
              text-[10px]
              font-semibold
              text-slate-500

              sm:text-xs
            "
          >
            <CalendarDays
              className="
                h-4 w-4
                text-[#007AFF]
              "
            />

            {selectedDate}
            {' • '}
            {groupStudents.length}
            {' nafar o‘quvchi'}
          </div>
        </div>
      )}


      {/* STATS */}

      <div
        className="
          grid
          grid-cols-2
          gap-3

          sm:grid-cols-3

          lg:grid-cols-5
          lg:gap-4
        "
      >
        {/* RATE */}

        <div
          className="
            rounded-2xl
            border
            border-slate-200/60
            bg-white
            p-4
            text-center

            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          <span
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-wider
              text-slate-400

              sm:text-[10px]
            "
          >
            Davomat Ko‘rsatkichi
          </span>

          <p
            className="
              mt-1
              text-xl
              font-black
              text-emerald-600

              dark:text-emerald-400

              sm:text-2xl
            "
          >
            {attendancePercentage}%
          </p>
        </div>


        {/* PRESENT */}

        <div
          className="
            rounded-2xl
            border
            border-slate-200/60
            bg-white
            p-4
            text-center

            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          <span
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-wider
              text-slate-400

              sm:text-[10px]
            "
          >
            Kelgan
          </span>

          <p
            className="
              mt-1
              text-xl
              font-black
              text-emerald-600

              dark:text-emerald-400

              sm:text-2xl
            "
          >
            {presentCount}
          </p>
        </div>


        {/* ABSENT */}

        <div
          className="
            rounded-2xl
            border
            border-slate-200/60
            bg-white
            p-4
            text-center

            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          <span
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-wider
              text-slate-400

              sm:text-[10px]
            "
          >
            Kelmagan
          </span>

          <p
            className="
              mt-1
              text-xl
              font-black
              text-rose-600

              dark:text-rose-400

              sm:text-2xl
            "
          >
            {absentCount}
          </p>
        </div>


        {/* LATE */}

        <div
          className="
            rounded-2xl
            border
            border-slate-200/60
            bg-white
            p-4
            text-center

            dark:border-slate-800
            dark:bg-slate-900
          "
        >
          <span
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-wider
              text-slate-400

              sm:text-[10px]
            "
          >
            Kechikkan
          </span>

          <p
            className="
              mt-1
              text-xl
              font-black
              text-amber-600

              dark:text-amber-400

              sm:text-2xl
            "
          >
            {lateCount}
          </p>
        </div>


        {/* EXCUSED */}

        <div
          className="
            col-span-2
            rounded-2xl
            border
            border-slate-200/60
            bg-white
            p-4
            text-center

            dark:border-slate-800
            dark:bg-slate-900

            sm:col-span-1
          "
        >
          <span
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-wider
              text-slate-400

              sm:text-[10px]
            "
          >
            Sababli
          </span>

          <p
            className="
              mt-1
              text-xl
              font-black
              text-blue-600

              dark:text-blue-400

              sm:text-2xl
            "
          >
            {excusedCount}
          </p>
        </div>
      </div>


      {/* MOBILE STUDENT CARDS */}

      <div
        className="
          space-y-3

          md:hidden
        "
      >
        {groupStudents.length ===
        0 ? (
          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-slate-300
              bg-white
              px-4 py-12
              text-center

              dark:border-slate-700
              dark:bg-slate-900
            "
          >
            <Users
              className="
                mx-auto
                h-8 w-8
                text-slate-300
              "
            />

            <p
              className="
                mt-3
                text-xs
                font-bold
                text-slate-500
              "
            >
              Ushbu guruhda o‘quvchilar mavjud emas.
            </p>
          </div>
        ) : (
          groupStudents.map(
            student => {
              const currentStatus =
                attendanceState[
                  student.id
                ] ??
                'Present';

              return (
                <div
                  key={
                    student.id
                  }
                  className="
                    rounded-2xl
                    border
                    border-slate-200/60
                    bg-white
                    p-4
                    shadow-sm

                    dark:border-slate-800
                    dark:bg-slate-900
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <img
                      src={
                        student.avatar
                      }
                      alt={
                        student.fullName
                      }
                      className="
                        h-11 w-11
                        shrink-0
                        rounded-full
                        object-cover
                      "
                    />

                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >
                      <p
                        className="
                          truncate
                          text-sm
                          font-bold
                          text-slate-900

                          dark:text-white
                        "
                      >
                        {
                          student.fullName
                        }
                      </p>

                      <p
                        className="
                          mt-0.5
                          truncate
                          text-[10px]
                          font-mono
                          text-slate-400
                        "
                      >
                        {student.id}
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-[10px]
                          text-slate-500
                        "
                      >
                        {student.phone}
                      </p>
                    </div>


                    <span
                      className={`
                        shrink-0
                        rounded-full
                        px-2.5 py-1
                        text-[9px]
                        font-bold

                        ${
                          currentStatus ===
                          'Present'
                            ? `
                              bg-emerald-100
                              text-emerald-700

                              dark:bg-emerald-950
                              dark:text-emerald-300
                            `
                            : currentStatus ===
                              'Absent'
                            ? `
                              bg-rose-100
                              text-rose-700

                              dark:bg-rose-950
                              dark:text-rose-300
                            `
                            : currentStatus ===
                              'Late'
                            ? `
                              bg-amber-100
                              text-amber-700

                              dark:bg-amber-950
                              dark:text-amber-300
                            `
                            : `
                              bg-blue-100
                              text-blue-700

                              dark:bg-blue-950
                              dark:text-blue-300
                            `
                        }
                      `}
                    >
                      {STATUS_UZ[currentStatus]?.icon} {STATUS_UZ[currentStatus]?.label}
                    </span>
                  </div>


                  <div
                    className="
                      mt-4
                      grid
                      grid-cols-2
                      gap-2
                    "
                  >
                    {ATTENDANCE_STATUSES.map(
                      status => (
                        <button
                          type="button"
                          key={
                            status
                          }
                          onClick={() =>
                            handleStatusChange(
                              student.id,
                              status
                            )
                          }
                          className={`
                            flex
                            min-h-10
                            cursor-pointer
                            items-center
                            justify-center
                            rounded-xl
                            px-3 py-2
                            text-[10px]
                            font-bold
                            transition-all

                            active:scale-[0.97]

                            ${getStatusButtonClass(
                              status,
                              currentStatus
                            )}
                          `}
                        >
                          {STATUS_UZ[status]?.icon} {STATUS_UZ[status]?.label}
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            }
          )
        )}
      </div>


      {/* TABLET / DESKTOP TABLE */}

      <div
        className="
          hidden
          overflow-hidden
          rounded-2xl
          border
          border-slate-200/60
          bg-white
          p-2
          shadow-sm

          dark:border-slate-800
          dark:bg-slate-900

          md:block
        "
      >
        <div
          className="
            overflow-x-auto
          "
        >
          <table
            className="
              w-full
              min-w-[720px]
              text-left
              text-xs
            "
          >
            <thead
              className="
                border-b
                border-slate-200/60
                bg-slate-50
                font-bold
                uppercase
                tracking-wider
                text-slate-500

                dark:border-slate-800
                dark:bg-slate-800/80
              "
            >
              <tr>
                <th
                  className="
                    p-3.5
                  "
                >
                  O‘quvchi FISH
                </th>

                <th
                  className="
                    p-3.5
                  "
                >
                  Telefon Raqami
                </th>

                <th
                  className="
                    p-3.5
                    text-center
                  "
                >
                  Davomat Holati
                </th>
              </tr>
            </thead>


            <tbody
              className="
                divide-y
                divide-slate-100

                dark:divide-slate-800
              "
            >
              {groupStudents.length ===
              0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="
                      p-10
                      text-center
                      font-semibold
                      text-slate-400
                    "
                  >
                    Ushbu guruhda o‘quvchilar mavjud emas.
                  </td>
                </tr>
              ) : (
                groupStudents.map(
                  student => {
                    const currentStatus =
                      attendanceState[
                        student.id
                      ] ??
                      'Present';

                    return (
                      <tr
                        key={
                          student.id
                        }
                        className="
                          transition-colors

                          hover:bg-slate-50/80

                          dark:hover:bg-slate-800/40
                        "
                      >
                        <td
                          className="
                            p-3.5
                          "
                        >
                          <div
                            className="
                              flex
                              items-center
                              gap-3
                            "
                          >
                            <img
                              src={
                                student.avatar
                              }
                              alt={
                                student.fullName
                              }
                              className="
                                h-9 w-9
                                shrink-0
                                rounded-full
                                object-cover
                              "
                            />

                            <div
                              className="
                                min-w-0
                              "
                            >
                              <span
                                className="
                                  block
                                  max-w-[220px]
                                  truncate
                                  font-bold
                                  text-slate-900

                                  dark:text-white
                                "
                              >
                                {
                                  student.fullName
                                }
                              </span>

                              <span
                                className="
                                  text-[10px]
                                  font-mono
                                  text-slate-400
                                "
                              >
                                {
                                  student.id
                                }
                              </span>
                            </div>
                          </div>
                        </td>


                        <td
                          className="
                            whitespace-nowrap
                            p-3.5
                            font-mono
                            text-slate-500
                          "
                        >
                          {
                            student.phone
                          }
                        </td>


                        <td
                          className="
                            p-3.5
                          "
                        >
                          <div
                            className="
                              flex
                              flex-wrap
                              items-center
                              justify-center
                              gap-2
                            "
                          >
                            {ATTENDANCE_STATUSES.map(
                              status => (
                                <button
                                  type="button"
                                  key={
                                    status
                                  }
                                  onClick={() =>
                                    handleStatusChange(
                                      student.id,
                                      status
                                    )
                                  }
                                  className={`
                                    min-w-[78px]
                                    cursor-pointer
                                    rounded-xl
                                    px-3 py-1.5
                                    text-[10px]
                                    font-bold
                                    transition-all

                                    active:scale-95

                                    ${getStatusButtonClass(
                                      status,
                                      currentStatus
                                    )}
                                  `}
                                >
                                  {STATUS_UZ[status]?.icon} {STATUS_UZ[status]?.label}
                                </button>
                              )
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};