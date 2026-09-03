import React, {
  useMemo,
  useState,
} from 'react';

import { useCRM } from '../context/CRMContext';

import {
  Search,
  Filter,
  Plus,
  DollarSign,
  Trash2,
  Eye,
  LayoutGrid,
  List,
  CheckCircle2,
} from 'lucide-react';


export const StudentsPage: React.FC = () => {
  const {
    students,
    groups,

    deleteStudent,

    setSelectedStudentId,

    setIsAddStudentModalOpen,

    setIsReceivePaymentModalOpen,

    setPaymentModalDefaultStudentId,
    setPaymentModalDefaultMonth,

    financials,
    settings,
  } = useCRM();


  const [
    term,
    setTerm,
  ] = useState('');

  const [
    selectedGroup,
    setSelectedGroup,
  ] = useState('ALL');

  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState('ALL');

  const [
    viewMode,
    setViewMode,
  ] = useState<
    'table' | 'grid'
  >('table');

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);


  const pageSize = 12;

  const currentMonth =
    financials.currentAcademicMonth;


  // ───────────────────────────────────────────────────────────────────────────
  // FILTERING
  // ───────────────────────────────────────────────────────────────────────────

  const filteredStudents =
    useMemo(() => {
      const normalizedTerm =
        term
          .trim()
          .toLowerCase();

      return students.filter(
        student => {
          const matchesTerm =
            !normalizedTerm ||
            student.fullName
              .toLowerCase()
              .includes(
                normalizedTerm
              ) ||
            student.id
              .toLowerCase()
              .includes(
                normalizedTerm
              ) ||
            student.phone
              .toLowerCase()
              .includes(
                normalizedTerm
              ) ||
            student.parentName
              .toLowerCase()
              .includes(
                normalizedTerm
              );

          const matchesGroup =
            selectedGroup ===
              'ALL' ||
            student.groupId ===
              selectedGroup;

          const matchesStatus =
            selectedStatus ===
              'ALL' ||
            student.status ===
              selectedStatus;

          return (
            matchesTerm &&
            matchesGroup &&
            matchesStatus
          );
        }
      );
    }, [
      students,
      term,
      selectedGroup,
      selectedStatus,
    ]);


  const totalPages =
    Math.ceil(
      filteredStudents.length /
        pageSize
    ) || 1;


  const paginatedStudents =
    filteredStudents.slice(
      (currentPage - 1) *
        pageSize,

      currentPage *
        pageSize
    );


  const startItem =
    filteredStudents.length === 0
      ? 0
      : (currentPage - 1) *
          pageSize +
        1;


  const endItem =
    Math.min(
      currentPage * pageSize,
      filteredStudents.length
    );


  // ───────────────────────────────────────────────────────────────────────────
  // HELPERS
  // ───────────────────────────────────────────────────────────────────────────

  const getStatusBadge = (
    status: string
  ) => {
    switch (status) {
      case 'Active':
        return (
          <span
            className="
              inline-flex
              rounded-full
              bg-emerald-100
              px-2.5 py-1
              text-[10px]
              font-bold
              text-emerald-800

              dark:bg-emerald-950
              dark:text-emerald-300
            "
          >
            Active
          </span>
        );

      case 'Frozen':
        return (
          <span
            className="
              inline-flex
              rounded-full
              bg-slate-100
              px-2.5 py-1
              text-[10px]
              font-bold
              text-slate-700

              dark:bg-slate-800
              dark:text-slate-300
            "
          >
            Frozen
          </span>
        );

      case 'Trial':
        return (
          <span
            className="
              inline-flex
              rounded-full
              bg-amber-100
              px-2.5 py-1
              text-[10px]
              font-bold
              text-amber-800

              dark:bg-amber-950
              dark:text-amber-300
            "
          >
            Trial
          </span>
        );

      default:
        return (
          <span
            className="
              inline-flex
              rounded-full
              bg-blue-100
              px-2.5 py-1
              text-[10px]
              font-bold
              text-blue-800

              dark:bg-blue-950
              dark:text-blue-300
            "
          >
            Graduated
          </span>
        );
    }
  };


  const getPaymentBadge = (
    student: typeof students[0]
  ) => {
    const payment =
      student.payments[
        currentMonth
      ] || {
        status: 'Unpaid',
      };

    if (
      payment.status ===
        'Paid' ||
      payment.status ===
        'Discount'
    ) {
      return (
        <span
          className="
            inline-flex
            items-center
            gap-1
            rounded-full
            bg-emerald-100
            px-2 py-1
            text-[10px]
            font-bold
            text-emerald-800

            dark:bg-emerald-950
            dark:text-emerald-300
          "
        >
          <CheckCircle2
            className="
              h-3 w-3
            "
          />

          Paid
        </span>
      );
    }

    return (
      <span
        className="
          inline-flex
          rounded-full
          bg-amber-100
          px-2 py-1
          text-[10px]
          font-bold
          text-amber-800

          dark:bg-amber-950
          dark:text-amber-300
        "
      >
        Unpaid
      </span>
    );
  };


  const openPaymentModal = (
    studentId: string
  ) => {
    setPaymentModalDefaultStudentId(
      studentId
    );

    setPaymentModalDefaultMonth(
      currentMonth
    );

    setIsReceivePaymentModalOpen(
      true
    );
  };


  const handleDelete = (
    studentId: string,
    studentName: string
  ) => {
    const confirmed =
      window.confirm(
        `Delete ${studentName}?`
      );

    if (!confirmed) {
      return;
    }

    deleteStudent(
      studentId
    );
  };


  // ───────────────────────────────────────────────────────────────────────────
  // RENDER
  // ───────────────────────────────────────────────────────────────────────────

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
      {/* PAGE HEADER */}

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
            Students Directory
            <span
              className="
                ml-2
                text-base
                font-bold
                text-slate-400

                sm:text-lg
              "
            >
              ({filteredStudents.length})
            </span>
          </h1>

          <p
            className="
              mt-1
              max-w-2xl
              text-[11px]
              leading-relaxed
              text-slate-500

              sm:text-xs
            "
          >
            Manage student
            profiles, parent
            details, group
            assignments and fee
            records.
          </p>
        </div>


        <button
          type="button"
          onClick={() =>
            setIsAddStudentModalOpen(
              true
            )
          }
          className="
            flex w-full
            cursor-pointer
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[#007AFF]
            px-5 py-2.5
            text-xs
            font-bold
            text-white
            shadow-lg
            shadow-blue-500/20
            transition-all

            hover:bg-blue-600
            active:scale-[0.98]

            sm:w-auto
          "
        >
          <Plus
            className="
              h-4 w-4
            "
          />

          Add New Student
        </button>
      </div>


      {/* FILTER PANEL */}

      <div
        className="
          rounded-2xl
          border
          border-slate-200/60
          bg-white
          p-3
          shadow-sm

          dark:border-slate-800
          dark:bg-slate-900

          sm:p-4
        "
      >
        <div
          className="
            flex
            flex-col
            gap-3

            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          {/* SEARCH */}

          <div
            className="
              relative
              w-full
              min-w-0
              flex-1
            "
          >
            <Search
              className="
                absolute
                left-3.5
                top-1/2
                h-4 w-4
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              value={term}
              onChange={event => {
                setTerm(
                  event.target.value
                );

                setCurrentPage(
                  1
                );
              }}
              placeholder="Search name, ID, phone or parent..."
              className="
                h-10
                w-full
                rounded-xl
                border
                border-slate-200/80
                bg-slate-50
                pl-10 pr-4
                text-xs
                text-slate-900
                outline-none
                transition-all

                placeholder:text-slate-400

                focus:border-[#007AFF]/40
                focus:ring-2
                focus:ring-[#007AFF]/10

                dark:border-slate-700
                dark:bg-slate-800
                dark:text-white
              "
            />
          </div>


          {/* FILTERS */}

          <div
            className="
              grid
              w-full
              grid-cols-1
              gap-2

              sm:grid-cols-2

              lg:flex
              lg:w-auto
              lg:items-center
            "
          >
            {/* GROUP */}

            <div
              className="
                flex
                min-w-0
                items-center
                gap-2
                rounded-xl
                border
                border-slate-200/80
                bg-slate-50
                px-3

                dark:border-slate-700
                dark:bg-slate-800
              "
            >
              <Filter
                className="
                  h-3.5 w-3.5
                  shrink-0
                  text-slate-400
                "
              />

              <select
                value={
                  selectedGroup
                }
                onChange={event => {
                  setSelectedGroup(
                    event.target.value
                  );

                  setCurrentPage(
                    1
                  );
                }}
                className="
                  h-10
                  min-w-0
                  flex-1
                  cursor-pointer
                  bg-transparent
                  text-xs
                  font-semibold
                  text-slate-700
                  outline-none

                  dark:text-slate-300

                  lg:w-[155px]
                "
              >
                <option value="ALL">
                  All Groups (
                  {groups.length})
                </option>

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
                      {
                        group.name
                      }
                    </option>
                  )
                )}
              </select>
            </div>


            {/* STATUS */}

            <div
              className="
                flex
                min-w-0
                items-center
                rounded-xl
                border
                border-slate-200/80
                bg-slate-50
                px-3

                dark:border-slate-700
                dark:bg-slate-800
              "
            >
              <select
                value={
                  selectedStatus
                }
                onChange={event => {
                  setSelectedStatus(
                    event.target.value
                  );

                  setCurrentPage(
                    1
                  );
                }}
                className="
                  h-10
                  min-w-0
                  flex-1
                  cursor-pointer
                  bg-transparent
                  text-xs
                  font-semibold
                  text-slate-700
                  outline-none

                  dark:text-slate-300

                  lg:w-[130px]
                "
              >
                <option value="ALL">
                  All Statuses
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Frozen">
                  Frozen
                </option>

                <option value="Trial">
                  Trial
                </option>

                <option value="Graduated">
                  Graduated
                </option>
              </select>
            </div>


            {/* VIEW MODE */}

            <div
              className="
                col-span-1
                flex
                h-10
                items-center
                rounded-xl
                bg-slate-100
                p-1

                dark:bg-slate-800

                sm:col-span-2
                sm:w-fit

                lg:col-span-1
              "
            >
              <button
                type="button"
                onClick={() =>
                  setViewMode(
                    'table'
                  )
                }
                title="Table View"
                className={`
                  flex h-8
                  flex-1
                  cursor-pointer
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  px-3
                  text-[10px]
                  font-bold
                  transition-all

                  sm:flex-none

                  ${
                    viewMode ===
                    'table'
                      ? `
                        bg-white
                        text-[#007AFF]
                        shadow-sm

                        dark:bg-slate-900
                      `
                      : `
                        text-slate-400
                        hover:text-slate-700

                        dark:hover:text-slate-200
                      `
                  }
                `}
              >
                <List
                  className="
                    h-4 w-4
                  "
                />

                <span
                  className="
                    sm:hidden
                  "
                >
                  List
                </span>
              </button>


              <button
                type="button"
                onClick={() =>
                  setViewMode(
                    'grid'
                  )
                }
                title="Grid View"
                className={`
                  flex h-8
                  flex-1
                  cursor-pointer
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  px-3
                  text-[10px]
                  font-bold
                  transition-all

                  sm:flex-none

                  ${
                    viewMode ===
                    'grid'
                      ? `
                        bg-white
                        text-[#007AFF]
                        shadow-sm

                        dark:bg-slate-900
                      `
                      : `
                        text-slate-400
                        hover:text-slate-700

                        dark:hover:text-slate-200
                      `
                  }
                `}
              >
                <LayoutGrid
                  className="
                    h-4 w-4
                  "
                />

                <span
                  className="
                    sm:hidden
                  "
                >
                  Grid
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* EMPTY STATE */}

      {paginatedStudents.length ===
      0 ? (
        <div
          className="
            flex min-h-[260px]
            flex-col
            items-center
            justify-center
            rounded-2xl
            border
            border-dashed
            border-slate-300
            bg-white
            px-4
            text-center

            dark:border-slate-700
            dark:bg-slate-900
          "
        >
          <Search
            className="
              h-8 w-8
              text-slate-300
            "
          />

          <p
            className="
              mt-3
              text-sm
              font-bold
              text-slate-700

              dark:text-slate-200
            "
          >
            No students found
          </p>

          <p
            className="
              mt-1
              text-xs
              text-slate-400
            "
          >
            Try changing your
            search or filters.
          </p>
        </div>
      ) : viewMode ===
        'table' ? (
        <>
          {/* MOBILE TABLE VIEW = CARDS */}

          <div
            className="
              space-y-3

              md:hidden
            "
          >
            {paginatedStudents.map(
              student => (
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
                      items-start
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
                        h-12 w-12
                        shrink-0
                        rounded-full
                        object-cover
                        ring-2
                        ring-[#007AFF]/10
                      "
                    />

                    <div
                      className="
                        min-w-0
                        flex-1
                      "
                    >
                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-2
                        "
                      >
                        <div
                          className="
                            min-w-0
                          "
                        >
                          <h3
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
                          </h3>

                          <p
                            className="
                              mt-0.5
                              text-[10px]
                              font-mono
                              text-slate-400
                            "
                          >
                            {
                              student.id
                            }
                          </p>
                        </div>

                        {getStatusBadge(
                          student.status
                        )}
                      </div>


                      <div
                        className="
                          mt-3
                          grid
                          grid-cols-2
                          gap-x-3
                          gap-y-3
                        "
                      >
                        <div
                          className="
                            min-w-0
                          "
                        >
                          <p
                            className="
                              text-[9px]
                              font-semibold
                              uppercase
                              tracking-wider
                              text-slate-400
                            "
                          >
                            Group
                          </p>

                          <p
                            className="
                              mt-0.5
                              truncate
                              text-[11px]
                              font-semibold
                              text-slate-700

                              dark:text-slate-300
                            "
                          >
                            {
                              student.groupName
                            }
                          </p>
                        </div>


                        <div
                          className="
                            min-w-0
                          "
                        >
                          <p
                            className="
                              text-[9px]
                              font-semibold
                              uppercase
                              tracking-wider
                              text-slate-400
                            "
                          >
                            Teacher
                          </p>

                          <p
                            className="
                              mt-0.5
                              truncate
                              text-[11px]
                              font-semibold
                              text-slate-700

                              dark:text-slate-300
                            "
                          >
                            {
                              student.teacherName
                            }
                          </p>
                        </div>


                        <div
                          className="
                            min-w-0
                          "
                        >
                          <p
                            className="
                              text-[9px]
                              font-semibold
                              uppercase
                              tracking-wider
                              text-slate-400
                            "
                          >
                            Parent
                          </p>

                          <p
                            className="
                              mt-0.5
                              truncate
                              text-[11px]
                              font-semibold
                              text-slate-700

                              dark:text-slate-300
                            "
                          >
                            {
                              student.parentName
                            }
                          </p>
                        </div>


                        <div>
                          <p
                            className="
                              text-[9px]
                              font-semibold
                              uppercase
                              tracking-wider
                              text-slate-400
                            "
                          >
                            Monthly Fee
                          </p>

                          <p
                            className="
                              mt-0.5
                              text-[11px]
                              font-bold
                              text-slate-900

                              dark:text-white
                            "
                          >
                            {
                              settings.currencySymbol
                            }
                            {
                              student.monthlyFee
                            }
                          </p>
                        </div>
                      </div>


                      <div
                        className="
                          mt-3
                          flex
                          items-center
                          justify-between
                          gap-2
                          border-t
                          border-slate-100
                          pt-3

                          dark:border-slate-800
                        "
                      >
                        <div>
                          <p
                            className="
                              mb-1
                              text-[9px]
                              text-slate-400
                            "
                          >
                            {currentMonth}{' '}
                            fee
                          </p>

                          {getPaymentBadge(
                            student
                          )}
                        </div>


                        <div
                          className="
                            flex
                            items-center
                            gap-1
                          "
                        >
                          <button
                            type="button"
                            onClick={() =>
                              openPaymentModal(
                                student.id
                              )
                            }
                            className="
                              flex h-9 w-9
                              cursor-pointer
                              items-center
                              justify-center
                              rounded-xl
                              text-emerald-600
                              transition-colors

                              hover:bg-emerald-50

                              dark:hover:bg-emerald-950/50
                            "
                            title="Receive Payment"
                          >
                            <DollarSign
                              className="
                                h-4 w-4
                              "
                            />
                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              setSelectedStudentId(
                                student.id
                              )
                            }
                            className="
                              flex h-9 w-9
                              cursor-pointer
                              items-center
                              justify-center
                              rounded-xl
                              text-[#007AFF]
                              transition-colors

                              hover:bg-blue-50

                              dark:hover:bg-blue-950/50
                            "
                            title="View Profile"
                          >
                            <Eye
                              className="
                                h-4 w-4
                              "
                            />
                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                student.id,
                                student.fullName
                              )
                            }
                            className="
                              flex h-9 w-9
                              cursor-pointer
                              items-center
                              justify-center
                              rounded-xl
                              text-rose-500
                              transition-colors

                              hover:bg-rose-50

                              dark:hover:bg-rose-950/50
                            "
                            title="Delete"
                          >
                            <Trash2
                              className="
                                h-4 w-4
                              "
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                  min-w-[1000px]
                  text-left
                  text-xs
                "
              >
                <thead
                  className="
                    border-b
                    border-slate-200/60
                    bg-slate-50
                    text-[10px]
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
                      Student
                    </th>

                    <th
                      className="
                        p-3.5
                      "
                    >
                      Group & Teacher
                    </th>

                    <th
                      className="
                        p-3.5
                      "
                    >
                      Parent Contact
                    </th>

                    <th
                      className="
                        p-3.5
                      "
                    >
                      Fee / Mo
                    </th>

                    <th
                      className="
                        p-3.5
                      "
                    >
                      Status
                    </th>

                    <th
                      className="
                        p-3.5
                      "
                    >
                      {currentMonth}{' '}
                      Fee
                    </th>

                    <th
                      className="
                        p-3.5
                        text-right
                      "
                    >
                      Actions
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
                  {paginatedStudents.map(
                    student => (
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
                                  max-w-[180px]
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
                                  block
                                  max-w-[200px]
                                  truncate
                                  text-[10px]
                                  font-mono
                                  text-slate-400
                                "
                              >
                                {
                                  student.id
                                }
                                {' • '}
                                {
                                  student.phone
                                }
                              </span>
                            </div>
                          </div>
                        </td>


                        <td
                          className="
                            p-3.5
                          "
                        >
                          <span
                            className="
                              block
                              font-semibold
                              text-slate-900

                              dark:text-white
                            "
                          >
                            {
                              student.groupName
                            }
                          </span>

                          <span
                            className="
                              text-[11px]
                              text-slate-400
                            "
                          >
                            {
                              student.teacherName
                            }
                          </span>
                        </td>


                        <td
                          className="
                            p-3.5
                          "
                        >
                          <span
                            className="
                              block
                              font-medium
                              text-slate-800

                              dark:text-slate-200
                            "
                          >
                            {
                              student.parentName
                            }
                          </span>

                          <span
                            className="
                              text-[11px]
                              text-slate-400
                            "
                          >
                            {
                              student.parentPhone
                            }
                          </span>
                        </td>


                        <td
                          className="
                            p-3.5
                            font-bold
                            text-slate-900

                            dark:text-white
                          "
                        >
                          {
                            settings.currencySymbol
                          }
                          {
                            student.monthlyFee
                          }
                        </td>


                        <td
                          className="
                            p-3.5
                          "
                        >
                          {getStatusBadge(
                            student.status
                          )}
                        </td>


                        <td
                          className="
                            p-3.5
                          "
                        >
                          {getPaymentBadge(
                            student
                          )}
                        </td>


                        <td
                          className="
                            p-3.5
                            text-right
                          "
                        >
                          <div
                            className="
                              flex
                              items-center
                              justify-end
                              gap-1
                            "
                          >
                            <button
                              type="button"
                              onClick={() =>
                                openPaymentModal(
                                  student.id
                                )
                              }
                              className="
                                flex h-8 w-8
                                cursor-pointer
                                items-center
                                justify-center
                                rounded-lg
                                text-emerald-600
                                transition-colors

                                hover:bg-emerald-50

                                dark:hover:bg-emerald-950/50
                              "
                              title="Receive Payment"
                            >
                              <DollarSign
                                className="
                                  h-4 w-4
                                "
                              />
                            </button>


                            <button
                              type="button"
                              onClick={() =>
                                setSelectedStudentId(
                                  student.id
                                )
                              }
                              className="
                                flex h-8 w-8
                                cursor-pointer
                                items-center
                                justify-center
                                rounded-lg
                                text-[#007AFF]
                                transition-colors

                                hover:bg-blue-50

                                dark:hover:bg-blue-950/50
                              "
                              title="View Profile"
                            >
                              <Eye
                                className="
                                  h-4 w-4
                                "
                              />
                            </button>


                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  student.id,
                                  student.fullName
                                )
                              }
                              className="
                                flex h-8 w-8
                                cursor-pointer
                                items-center
                                justify-center
                                rounded-lg
                                text-rose-500
                                transition-colors

                                hover:bg-rose-50

                                dark:hover:bg-rose-950/50
                              "
                              title="Delete"
                            >
                              <Trash2
                                className="
                                  h-4 w-4
                                "
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* GRID VIEW */

        <div
          className="
            grid
            grid-cols-1
            gap-3

            sm:grid-cols-2
            sm:gap-4

            xl:grid-cols-3
            xl:gap-5
          "
        >
          {paginatedStudents.map(
            student => (
              <div
                key={student.id}
                className="
                  flex
                  min-w-0
                  flex-col
                  justify-between
                  rounded-2xl
                  border
                  border-slate-200/60
                  bg-white
                  p-4
                  shadow-sm
                  transition-all

                  hover:-translate-y-0.5
                  hover:shadow-md

                  dark:border-slate-800
                  dark:bg-slate-900

                  sm:p-5
                "
              >
                <div>
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-3
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
                      <img
                        src={
                          student.avatar
                        }
                        alt={
                          student.fullName
                        }
                        className="
                          h-12 w-12
                          shrink-0
                          rounded-full
                          object-cover
                          ring-2
                          ring-[#007AFF]/20
                        "
                      />

                      <div
                        className="
                          min-w-0
                        "
                      >
                        <h3
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
                        </h3>

                        <p
                          className="
                            mt-0.5
                            truncate
                            text-xs
                            font-medium
                            text-[#007AFF]
                          "
                        >
                          {
                            student.groupName
                          }
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-[9px]
                            font-mono
                            text-slate-400
                          "
                        >
                          {
                            student.id
                          }
                        </p>
                      </div>
                    </div>

                    <div
                      className="
                        shrink-0
                      "
                    >
                      {getStatusBadge(
                        student.status
                      )}
                    </div>
                  </div>


                  <div
                    className="
                      my-4
                      space-y-2
                      border-y
                      border-slate-100
                      py-3
                      text-xs

                      dark:border-slate-800
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >
                      <span
                        className="
                          text-slate-500

                          dark:text-slate-400
                        "
                      >
                        Parent
                      </span>

                      <span
                        className="
                          min-w-0
                          truncate
                          text-right
                          font-semibold
                          text-slate-800

                          dark:text-slate-200
                        "
                      >
                        {
                          student.parentName
                        }
                      </span>
                    </div>


                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >
                      <span
                        className="
                          text-slate-500

                          dark:text-slate-400
                        "
                      >
                        Phone
                      </span>

                      <span
                        className="
                          font-mono
                          text-slate-700

                          dark:text-slate-300
                        "
                      >
                        {
                          student.phone
                        }
                      </span>
                    </div>


                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >
                      <span
                        className="
                          text-slate-500

                          dark:text-slate-400
                        "
                      >
                        Monthly Fee
                      </span>

                      <span
                        className="
                          font-bold
                          text-slate-900

                          dark:text-white
                        "
                      >
                        {
                          settings.currencySymbol
                        }
                        {
                          student.monthlyFee
                        }
                      </span>
                    </div>


                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >
                      <span
                        className="
                          text-slate-500

                          dark:text-slate-400
                        "
                      >
                        {currentMonth}{' '}
                        Fee
                      </span>

                      {getPaymentBadge(
                        student
                      )}
                    </div>
                  </div>
                </div>


                <div
                  className="
                    grid
                    grid-cols-[1fr_auto]
                    gap-2
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedStudentId(
                        student.id
                      )
                    }
                    className="
                      cursor-pointer
                      rounded-xl
                      bg-slate-100
                      px-3 py-2.5
                      text-xs
                      font-bold
                      text-[#007AFF]
                      transition-colors

                      hover:bg-slate-200

                      dark:bg-slate-800
                      dark:hover:bg-slate-700
                    "
                  >
                    View Profile
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      openPaymentModal(
                        student.id
                      )
                    }
                    className="
                      cursor-pointer
                      rounded-xl
                      bg-emerald-600
                      px-4 py-2.5
                      text-xs
                      font-bold
                      text-white
                      transition-all

                      hover:bg-emerald-700

                      active:scale-95
                    "
                  >
                    Pay
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}


      {/* PAGINATION */}

      <div
        className="
          flex
          flex-col
          gap-3
          rounded-2xl
          border
          border-slate-200/60
          bg-white
          p-3
          text-xs

          dark:border-slate-800
          dark:bg-slate-900

          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:p-4
        "
      >
        <span
          className="
            text-center
            text-[11px]
            text-slate-500

            sm:text-left
            sm:text-xs
          "
        >
          Showing{' '}
          <span
            className="
              font-bold
              text-slate-900

              dark:text-white
            "
          >
            {startItem}
          </span>

          {' - '}

          <span
            className="
              font-bold
              text-slate-900

              dark:text-white
            "
          >
            {endItem}
          </span>

          {' of '}

          <span
            className="
              font-bold
              text-slate-900

              dark:text-white
            "
          >
            {
              filteredStudents.length
            }
          </span>

          {' students'}
        </span>


        <div
          className="
            grid
            grid-cols-[1fr_auto_1fr]
            items-center
            gap-2

            sm:flex
          "
        >
          <button
            type="button"
            disabled={
              currentPage === 1
            }
            onClick={() =>
              setCurrentPage(
                previous =>
                  Math.max(
                    1,
                    previous - 1
                  )
              )
            }
            className="
              cursor-pointer
              rounded-xl
              border
              border-slate-200
              px-3 py-2
              font-semibold
              text-slate-700
              transition-colors

              hover:bg-slate-50

              disabled:cursor-not-allowed
              disabled:opacity-40

              dark:border-slate-700
              dark:text-slate-300
              dark:hover:bg-slate-800
            "
          >
            Prev
          </button>


          <span
            className="
              min-w-[70px]
              px-2
              text-center
              font-bold
              text-[#007AFF]
            "
          >
            {currentPage}
            {' / '}
            {totalPages}
          </span>


          <button
            type="button"
            disabled={
              currentPage ===
              totalPages
            }
            onClick={() =>
              setCurrentPage(
                previous =>
                  Math.min(
                    totalPages,
                    previous + 1
                  )
              )
            }
            className="
              cursor-pointer
              rounded-xl
              border
              border-slate-200
              px-3 py-2
              font-semibold
              text-slate-700
              transition-colors

              hover:bg-slate-50

              disabled:cursor-not-allowed
              disabled:opacity-40

              dark:border-slate-700
              dark:text-slate-300
              dark:hover:bg-slate-800
            "
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};  