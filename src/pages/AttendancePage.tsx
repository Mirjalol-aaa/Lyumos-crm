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
} from 'lucide-react';

import {
  AttendanceStatus,
} from '../types/crm';

import confetti from 'canvas-confetti';


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
    Record<string, AttendanceStatus>
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
          group.id === selectedGroupId
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
          group.id === selectedGroupId
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
                student.id
              &&
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
      prev => ({
        ...prev,
        [studentId]: status,
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
        ] =
          'Present';
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
  // UI
  // ─────────────────────────────────────────────────────────────────────────

  return (

    <div
      className="
        p-6
        md:p-8
        space-y-6
        max-w-7xl
        mx-auto
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          justify-between
          gap-4
        "
      >

        <div>

          <h1
            className="
              text-2xl
              font-black
              text-slate-900
              dark:text-white
              tracking-tight
            "
          >
            Daily & Monthly Attendance Tracker
          </h1>


          <p
            className="
              text-xs
              text-slate-500
              mt-1
            "
          >
            Record student attendance per group and session date
          </p>

        </div>


        <button
          onClick={
            handleSave
          }
          disabled={
            !activeGroup ||
            groupStudents.length === 0
          }
          className={`
            px-5
            py-2.5
            rounded-2xl
            text-white
            font-bold
            text-xs
            shadow-lg
            active:scale-95
            transition-all
            flex
            items-center
            gap-2
            shrink-0

            ${
              justSaved

                ? `
                  bg-emerald-600
                  shadow-emerald-500/25
                `

                : `
                  bg-[#007AFF]
                  hover:bg-blue-600
                  shadow-blue-500/25
                `
            }

            ${
              !activeGroup ||
              groupStudents.length === 0

                ? `
                  opacity-50
                  cursor-not-allowed
                `

                : `
                  cursor-pointer
                `
            }
          `}
        >

          {
            justSaved

              ? (
                <>
                  <CheckCircle2
                    className="
                      w-4
                      h-4
                    "
                  />

                  Saved
                </>
              )

              : (
                <>
                  <Save
                    className="
                      w-4
                      h-4
                    "
                  />

                  Save Attendance
                </>
              )
          }

        </button>

      </div>


      {/* CONTROLS */}

      <div
        className="
          p-5
          rounded-[24px]
          bg-white
          dark:bg-slate-900
          border
          border-slate-200/60
          dark:border-slate-800
          shadow-sm
          flex
          flex-col
          md:flex-row
          items-center
          justify-between
          gap-4
        "
      >

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-4
            w-full
            md:w-auto
          "
        >

          {/* GROUP */}

          <div>

            <label
              className="
                text-[11px]
                font-bold
                text-slate-400
                block
                mb-1
                uppercase
              "
            >
              Select Group
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
                px-3.5
                py-2
                rounded-xl
                bg-slate-50
                dark:bg-slate-800
                border
                border-slate-200/80
                dark:border-slate-700
                text-xs
                font-bold
                text-slate-900
                dark:text-white
                focus:outline-none
                focus:ring-2
                focus:ring-[#007AFF]
                cursor-pointer
              "
            >

              {
                groups.map(
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
                      {' '}
                      ({group.teacherName})
                    </option>

                  )
                )
              }

            </select>

          </div>


          {/* DATE */}

          <div>

            <label
              className="
                text-[11px]
                font-bold
                text-slate-400
                block
                mb-1
                uppercase
              "
            >
              Session Date
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
                px-3.5
                py-2
                rounded-xl
                bg-slate-50
                dark:bg-slate-800
                border
                border-slate-200/80
                dark:border-slate-700
                text-xs
                font-bold
                text-slate-900
                dark:text-white
                focus:outline-none
                focus:ring-2
                focus:ring-[#007AFF]
                cursor-pointer
              "
            />

          </div>

        </div>


        {/* BULK ACTION */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <button
            onClick={
              markAllPresent
            }
            disabled={
              groupStudents.length === 0
            }
            className="
              px-3.5
              py-2
              rounded-xl
              bg-emerald-50
              dark:bg-emerald-950/50
              text-emerald-700
              dark:text-emerald-300
              border
              border-emerald-200/60
              dark:border-emerald-900
              text-xs
              font-bold
              hover:bg-emerald-100
              transition-colors
              flex
              items-center
              gap-1.5
              cursor-pointer
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >

            <CheckCheck
              className="
                w-4
                h-4
                text-emerald-600
              "
            />

            Mark All Present

          </button>

        </div>

      </div>


      {/* STATS */}

      <div
        className="
          grid
          grid-cols-2
          md:grid-cols-5
          gap-4
        "
      >

        <div
          className="
            p-4
            rounded-[20px]
            bg-white
            dark:bg-slate-900
            border
            border-slate-200/60
            dark:border-slate-800
            text-center
          "
        >

          <span
            className="
              text-xs
              text-slate-400
              font-bold
              uppercase
            "
          >
            Class Rate
          </span>

          <p
            className="
              text-2xl
              font-black
              text-emerald-600
              dark:text-emerald-400
              mt-1
            "
          >
            {attendancePercentage}%
          </p>

        </div>


        <div
          className="
            p-4
            rounded-[20px]
            bg-white
            dark:bg-slate-900
            border
            border-slate-200/60
            dark:border-slate-800
            text-center
          "
        >

          <span
            className="
              text-xs
              text-slate-400
              font-bold
              uppercase
            "
          >
            Present
          </span>

          <p
            className="
              text-2xl
              font-black
              text-slate-900
              dark:text-white
              mt-1
            "
          >
            {presentCount}
          </p>

        </div>


        <div
          className="
            p-4
            rounded-[20px]
            bg-white
            dark:bg-slate-900
            border
            border-slate-200/60
            dark:border-slate-800
            text-center
          "
        >

          <span
            className="
              text-xs
              text-slate-400
              font-bold
              uppercase
            "
          >
            Absent
          </span>

          <p
            className="
              text-2xl
              font-black
              text-rose-600
              dark:text-rose-400
              mt-1
            "
          >
            {absentCount}
          </p>

        </div>


        <div
          className="
            p-4
            rounded-[20px]
            bg-white
            dark:bg-slate-900
            border
            border-slate-200/60
            dark:border-slate-800
            text-center
          "
        >

          <span
            className="
              text-xs
              text-slate-400
              font-bold
              uppercase
            "
          >
            Late
          </span>

          <p
            className="
              text-2xl
              font-black
              text-amber-600
              dark:text-amber-400
              mt-1
            "
          >
            {lateCount}
          </p>

        </div>


        <div
          className="
            p-4
            rounded-[20px]
            bg-white
            dark:bg-slate-900
            border
            border-slate-200/60
            dark:border-slate-800
            text-center
          "
        >

          <span
            className="
              text-xs
              text-slate-400
              font-bold
              uppercase
            "
          >
            Excused
          </span>

          <p
            className="
              text-2xl
              font-black
              text-blue-600
              dark:text-blue-400
              mt-1
            "
          >
            {excusedCount}
          </p>

        </div>

      </div>


      {/* TABLE */}

      <div
        className="
          p-2
          rounded-[24px]
          bg-white
          dark:bg-slate-900
          border
          border-slate-200/60
          dark:border-slate-800
          shadow-sm
          overflow-hidden
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
              text-left
              text-xs
            "
          >

            <thead
              className="
                bg-slate-50
                dark:bg-slate-800/80
                text-slate-500
                font-bold
                uppercase
                tracking-wider
                border-b
                border-slate-200/60
                dark:border-slate-800
              "
            >

              <tr>

                <th
                  className="
                    p-3.5
                  "
                >
                  Student
                </th>

                <th
                  className="
                    p-3.5
                  "
                >
                  Phone
                </th>

                <th
                  className="
                    p-3.5
                    text-center
                  "
                >
                  Attendance Toggle
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

              {
                groupStudents.length === 0

                  ? (

                    <tr>

                      <td
                        colSpan={3}
                        className="
                          p-10
                          text-center
                          text-slate-400
                          font-semibold
                        "
                      >
                        No students found in this group.
                      </td>

                    </tr>

                  )

                  : groupStudents.map(
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
                              hover:bg-slate-50/80
                              dark:hover:bg-slate-800/40
                              transition-colors
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
                                    w-8
                                    h-8
                                    rounded-full
                                    object-cover
                                    shrink-0
                                  "
                                />


                                <div>

                                  <span
                                    className="
                                      font-bold
                                      text-slate-900
                                      dark:text-white
                                      block
                                    "
                                  >
                                    {student.fullName}
                                  </span>


                                  <span
                                    className="
                                      text-[10px]
                                      text-slate-400
                                      font-mono
                                    "
                                  >
                                    {student.id}
                                  </span>

                                </div>

                              </div>

                            </td>


                            <td
                              className="
                                p-3.5
                                text-slate-500
                                font-mono
                              "
                            >
                              {student.phone}
                            </td>


                            <td
                              className="
                                p-3.5
                              "
                            >

                              <div
                                className="
                                  flex
                                  items-center
                                  justify-center
                                  gap-2
                                  flex-wrap
                                "
                              >

                                {
                                  (
                                    [
                                      'Present',
                                      'Absent',
                                      'Late',
                                      'Excused',
                                    ] as const
                                  ).map(
                                    status => (

                                      <button
                                        key={
                                          status
                                        }
                                        onClick={
                                          () =>
                                            handleStatusChange(
                                              student.id,
                                              status
                                            )
                                        }
                                        className={`
                                          px-3
                                          py-1.5
                                          rounded-xl
                                          text-xs
                                          font-bold
                                          transition-all
                                          cursor-pointer
                                          active:scale-95

                                          ${
                                            currentStatus ===
                                            status

                                              ? status ===
                                                'Present'

                                                ? `
                                                  bg-emerald-600
                                                  text-white
                                                  shadow-sm
                                                `

                                                : status ===
                                                  'Absent'

                                                ? `
                                                  bg-rose-600
                                                  text-white
                                                  shadow-sm
                                                `

                                                : status ===
                                                  'Late'

                                                ? `
                                                  bg-amber-500
                                                  text-white
                                                  shadow-sm
                                                `

                                                : `
                                                  bg-blue-600
                                                  text-white
                                                  shadow-sm
                                                `

                                              : `
                                                bg-slate-100
                                                dark:bg-slate-800
                                                text-slate-500
                                                hover:bg-slate-200
                                                dark:hover:bg-slate-700
                                              `
                                          }
                                        `}
                                      >
                                        {status}
                                      </button>

                                    )
                                  )
                                }

                              </div>

                            </td>

                          </tr>

                        );
                      }
                    )
              }

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};