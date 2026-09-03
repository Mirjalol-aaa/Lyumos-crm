import React, {
  useMemo,
  useState,
} from 'react';

import { useCRM } from '../context/CRMContext';

import {
  DollarSign,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';

import {
  ACADEMIC_MONTHS,
} from '../constants/academic';


export const PaymentsPage: React.FC = () => {
  const {
    students,
    financials,

    setIsReceivePaymentModalOpen,

    setPaymentModalDefaultStudentId,
    setPaymentModalDefaultMonth,

    setSelectedStudentId,

    settings,
  } = useCRM();


  const [
    term,
    setTerm,
  ] = useState('');


  const [
    activeMonthFilter,
    setActiveMonthFilter,
  ] = useState(
    financials.currentAcademicMonth
  );


  const MONTHS =
    ACADEMIC_MONTHS;


  // ───────────────────────────────────────────────────────────────────────────
  // FILTER STUDENTS
  // ───────────────────────────────────────────────────────────────────────────

  const filteredStudents =
    useMemo(() => {
      const normalizedTerm =
        term
          .trim()
          .toLowerCase();

      return students.filter(
        student => {
          if (!normalizedTerm) {
            return true;
          }

          return (
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
            student.groupName
              .toLowerCase()
              .includes(
                normalizedTerm
              )
          );
        }
      );
    }, [
      students,
      term,
    ]);


  // ───────────────────────────────────────────────────────────────────────────
  // OPEN PAYMENT MODAL
  // ───────────────────────────────────────────────────────────────────────────

  const openPaymentModal = (
    studentId: string | null,
    month: string
  ) => {
    setPaymentModalDefaultStudentId(
      studentId
    );

    setPaymentModalDefaultMonth(
      month
    );

    setIsReceivePaymentModalOpen(
      true
    );
  };


  // ───────────────────────────────────────────────────────────────────────────
  // PAYMENT HELPERS
  // ───────────────────────────────────────────────────────────────────────────

  const getPayment = (
    student: typeof students[0],
    month: string
  ) => {
    return (
      student.payments[month] || {
        status: 'Unpaid',
        amountPaid: 0,
      }
    );
  };


  const formatMoney = (
    value: number
  ) => {
    return `${settings.currencySymbol}${Number(
      value || 0
    ).toLocaleString()}`;
  };


  const getCellBadge = (
    student: typeof students[0],
    month: string
  ) => {
    const payment =
      getPayment(
        student,
        month
      );


    switch (payment.status) {
      case 'Paid':
        return (
          <button
            type="button"
            onClick={() =>
              setSelectedStudentId(
                student.id
              )
            }
            className="
              inline-flex
              cursor-pointer
              items-center
              gap-1
              rounded-lg
              bg-emerald-100
              px-2 py-1
              text-[10px]
              font-bold
              text-emerald-800
              transition-all

              hover:scale-105

              dark:bg-emerald-950
              dark:text-emerald-300
            "
          >
            <CheckCircle2
              className="
                h-3 w-3
                shrink-0
              "
            />

            {formatMoney(
              payment.amountPaid
            )}
          </button>
        );


      case 'Discount':
        return (
          <button
            type="button"
            onClick={() =>
              setSelectedStudentId(
                student.id
              )
            }
            className="
              inline-flex
              cursor-pointer
              items-center
              gap-1
              rounded-lg
              bg-blue-100
              px-2 py-1
              text-[10px]
              font-bold
              text-blue-800
              transition-all

              hover:scale-105

              dark:bg-blue-950
              dark:text-blue-300
            "
          >
            <CheckCircle2
              className="
                h-3 w-3
                shrink-0
              "
            />

            {formatMoney(
              payment.amountPaid
            )}
          </button>
        );


      case 'Overdue':
        return (
          <button
            type="button"
            onClick={() =>
              openPaymentModal(
                student.id,
                month
              )
            }
            className="
              inline-flex
              cursor-pointer
              items-center
              gap-1
              rounded-lg
              bg-rose-100
              px-2 py-1
              text-[10px]
              font-bold
              text-rose-800
              transition-all

              hover:scale-105

              dark:bg-rose-950
              dark:text-rose-300
            "
          >
            <AlertCircle
              className="
                h-3 w-3
                shrink-0
              "
            />

            Due
          </button>
        );


      case 'Frozen':
        return (
          <span
            className="
              inline-flex
              rounded-lg
              bg-slate-100
              px-2 py-1
              text-[10px]
              font-semibold
              text-slate-500

              dark:bg-slate-800
              dark:text-slate-400
            "
          >
            Frozen
          </span>
        );


      default:
        return (
          <button
            type="button"
            onClick={() =>
              openPaymentModal(
                student.id,
                month
              )
            }
            className="
              inline-flex
              cursor-pointer
              items-center
              gap-1
              rounded-lg
              border
              border-amber-200/60
              bg-amber-50
              px-2 py-1
              text-[10px]
              font-bold
              text-amber-700
              transition-all

              hover:scale-105
              hover:bg-amber-100

              dark:border-amber-900/50
              dark:bg-amber-950/40
              dark:text-amber-300
              dark:hover:bg-amber-950/70
            "
          >
            <Clock
              className="
                h-3 w-3
                shrink-0
              "
            />

            Pay
          </button>
        );
    }
  };


  // ───────────────────────────────────────────────────────────────────────────
  // ACTIVE MONTH SUMMARY
  // ───────────────────────────────────────────────────────────────────────────

  const monthSummary =
    useMemo(() => {
      let paid = 0;
      let unpaid = 0;
      let overdue = 0;
      let collected = 0;

      students.forEach(
        student => {
          const payment =
            student.payments[
              activeMonthFilter
            ];

          if (
            payment?.status ===
              'Paid' ||
            payment?.status ===
              'Discount'
          ) {
            paid += 1;

            collected +=
              payment.amountPaid ||
              0;
          } else if (
            payment?.status ===
            'Overdue'
          ) {
            overdue += 1;
          } else if (
            payment?.status !==
            'Frozen'
          ) {
            unpaid += 1;
          }
        }
      );

      return {
        paid,
        unpaid,
        overdue,
        collected,
      };
    }, [
      students,
      activeMonthFilter,
    ]);


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
      {/* ───────────────────────────────────────────────────────────────────
          HEADER
      ─────────────────────────────────────────────────────────────────── */}

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
            Academic Year Payment Matrix
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
            August — July • Real-time
            monthly fee collection,
            discounts and payment
            status.
          </p>
        </div>


        <button
          type="button"
          onClick={() =>
            openPaymentModal(
              null,
              activeMonthFilter
            )
          }
          className="
            flex w-full
            cursor-pointer
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-emerald-600
            px-5 py-2.5
            text-xs
            font-bold
            text-white
            shadow-lg
            shadow-emerald-600/20
            transition-all

            hover:bg-emerald-700

            active:scale-[0.98]

            sm:w-auto
          "
        >
          <DollarSign
            className="
              h-4 w-4
              shrink-0
            "
          />

          Receive Payment
        </button>
      </div>


      {/* ───────────────────────────────────────────────────────────────────
          SEARCH + MONTH
      ─────────────────────────────────────────────────────────────────── */}

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

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div
            className="
              relative
              w-full
              min-w-0
              flex-1

              sm:max-w-md
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
              onChange={event =>
                setTerm(
                  event.target.value
                )
              }
              placeholder="Search name, ID or group..."
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


          <div
            className="
              flex w-full
              items-center
              justify-between
              gap-3

              sm:w-auto
              sm:justify-start
            "
          >
            <span
              className="
                text-[10px]
                font-bold
                text-slate-500

                sm:text-xs
              "
            >
              Active Month
            </span>

            <select
              value={
                activeMonthFilter
              }
              onChange={event =>
                setActiveMonthFilter(
                  event.target.value
                )
              }
              className="
                h-10
                min-w-[130px]
                cursor-pointer
                rounded-xl
                border
                border-slate-200/80
                bg-slate-100
                px-3
                text-xs
                font-bold
                text-slate-900
                outline-none

                dark:border-slate-700
                dark:bg-slate-800
                dark:text-white
              "
            >
              {MONTHS.map(
                month => (
                  <option
                    key={month}
                    value={month}
                  >
                    {month}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>


      {/* ───────────────────────────────────────────────────────────────────
          ACTIVE MONTH SUMMARY
      ─────────────────────────────────────────────────────────────────── */}

      <div
        className="
          grid
          grid-cols-2
          gap-3

          lg:grid-cols-4
        "
      >
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
          "
        >
          <p
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-wider
              text-slate-400

              sm:text-[10px]
            "
          >
            Paid
          </p>

          <p
            className="
              mt-1
              text-xl
              font-black
              text-emerald-600

              sm:text-2xl
            "
          >
            {monthSummary.paid}
          </p>

          <p
            className="
              mt-1
              text-[10px]
              text-slate-400
            "
          >
            {activeMonthFilter}
          </p>
        </div>


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
          "
        >
          <p
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-wider
              text-slate-400

              sm:text-[10px]
            "
          >
            Unpaid
          </p>

          <p
            className="
              mt-1
              text-xl
              font-black
              text-amber-600

              sm:text-2xl
            "
          >
            {monthSummary.unpaid}
          </p>

          <p
            className="
              mt-1
              text-[10px]
              text-slate-400
            "
          >
            Pending
          </p>
        </div>


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
          "
        >
          <p
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-wider
              text-slate-400

              sm:text-[10px]
            "
          >
            Overdue
          </p>

          <p
            className="
              mt-1
              text-xl
              font-black
              text-rose-600

              sm:text-2xl
            "
          >
            {monthSummary.overdue}
          </p>

          <p
            className="
              mt-1
              text-[10px]
              text-slate-400
            "
          >
            Requires attention
          </p>
        </div>


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
          "
        >
          <p
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-wider
              text-slate-400

              sm:text-[10px]
            "
          >
            Collected
          </p>

          <p
            className="
              mt-1
              truncate
              text-lg
              font-black
              text-slate-900

              dark:text-white

              sm:text-xl
            "
          >
            {formatMoney(
              monthSummary.collected
            )}
          </p>

          <p
            className="
              mt-1
              text-[10px]
              text-slate-400
            "
          >
            Total received
          </p>
        </div>
      </div>


      {/* ───────────────────────────────────────────────────────────────────
          MOBILE / TABLET PAYMENT CARDS
      ─────────────────────────────────────────────────────────────────── */}

      <div
        className="
          space-y-3

          lg:hidden
        "
      >
        {filteredStudents.map(
          student => {
            const payment =
              getPayment(
                student,
                activeMonthFilter
              );

            return (
              <div
                key={student.id}
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
                          {student.fullName}
                        </h3>

                        <p
                          className="
                            mt-0.5
                            truncate
                            text-[10px]
                            text-slate-400
                          "
                        >
                          {student.id}
                        </p>
                      </div>

                      <div
                        className="
                          shrink-0
                        "
                      >
                        {getCellBadge(
                          student,
                          activeMonthFilter
                        )}
                      </div>
                    </div>


                    <div
                      className="
                        mt-3
                        grid
                        grid-cols-2
                        gap-3
                        border-t
                        border-slate-100
                        pt-3

                        dark:border-slate-800
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
                          {student.groupName}
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
                          {formatMoney(
                            student.monthlyFee
                          )}
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
                          Month
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-[11px]
                            font-semibold
                            text-[#007AFF]
                          "
                        >
                          {activeMonthFilter}
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
                          Paid Amount
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
                          {formatMoney(
                            payment.amountPaid ||
                              0
                          )}
                        </p>
                      </div>
                    </div>


                    <div
                      className="
                        mt-3
                        grid
                        grid-cols-2
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
                          text-[10px]
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
                            student.id,
                            activeMonthFilter
                          )
                        }
                        className="
                          cursor-pointer
                          rounded-xl
                          bg-emerald-600
                          px-3 py-2.5
                          text-[10px]
                          font-bold
                          text-white
                          transition-all

                          hover:bg-emerald-700

                          active:scale-[0.98]
                        "
                      >
                        Receive Payment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        )}


        {filteredStudents.length ===
          0 && (
          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-slate-300
              bg-white
              px-4 py-12
              text-center
              text-xs
              font-medium
              text-slate-400

              dark:border-slate-700
              dark:bg-slate-900
            "
          >
            No students found.
          </div>
        )}
      </div>


      {/* ───────────────────────────────────────────────────────────────────
          DESKTOP FULL PAYMENT MATRIX
      ─────────────────────────────────────────────────────────────────── */}

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

          lg:block
        "
      >
        <div
          className="
            overflow-x-auto
            scrollbar-thin
          "
        >
          <table
            className="
              w-full
              min-w-[1100px]
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
                    sticky
                    left-0
                    z-20
                    w-48
                    bg-slate-50
                    p-3.5
                    shadow-sm

                    dark:bg-slate-800
                  "
                >
                  Student
                </th>

                <th
                  className="
                    p-3.5
                  "
                >
                  Group
                </th>

                <th
                  className="
                    p-3.5
                  "
                >
                  Fee
                </th>


                {MONTHS.map(
                  month => (
                    <th
                      key={month}
                      className={`
                        p-3.5
                        text-center

                        ${
                          month ===
                          activeMonthFilter
                            ? `
                              bg-blue-50/80
                              font-extrabold
                              text-[#007AFF]

                              dark:bg-blue-950/60
                            `
                            : ''
                        }
                      `}
                    >
                      {month.slice(
                        0,
                        3
                      )}
                    </th>
                  )
                )}
              </tr>
            </thead>


            <tbody
              className="
                divide-y
                divide-slate-100

                dark:divide-slate-800
              "
            >
              {filteredStudents.map(
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
                        sticky
                        left-0
                        z-10
                        bg-white
                        p-3.5
                        shadow-sm

                        dark:bg-slate-900
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-2.5
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
                            h-7 w-7
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
                              max-w-[130px]
                              truncate
                              font-bold
                              text-slate-900

                              dark:text-white
                            "
                          >
                            {student.fullName}
                          </span>

                          <span
                            className="
                              block
                              max-w-[130px]
                              truncate
                              text-[9px]
                              font-mono
                              text-slate-400
                            "
                          >
                            {student.id}
                          </span>
                        </div>
                      </div>
                    </td>


                    <td
                      className="
                        max-w-[130px]
                        truncate
                        p-3.5
                        font-medium
                        text-slate-600

                        dark:text-slate-300
                      "
                    >
                      {student.groupName}
                    </td>


                    <td
                      className="
                        whitespace-nowrap
                        p-3.5
                        font-bold
                        text-slate-900

                        dark:text-white
                      "
                    >
                      {formatMoney(
                        student.monthlyFee
                      )}
                    </td>


                    {MONTHS.map(
                      month => (
                        <td
                          key={month}
                          className={`
                            p-2
                            text-center

                            ${
                              month ===
                              activeMonthFilter
                                ? `
                                  bg-blue-50/30

                                  dark:bg-blue-950/20
                                `
                                : ''
                            }
                          `}
                        >
                          <div
                            className="
                              flex
                              justify-center
                            "
                          >
                            {getCellBadge(
                              student,
                              month
                            )}
                          </div>
                        </td>
                      )
                    )}
                  </tr>
                )
              )}


              {filteredStudents.length ===
                0 && (
                <tr>
                  <td
                    colSpan={
                      MONTHS.length +
                      3
                    }
                    className="
                      py-12
                      text-center
                      font-medium
                      text-slate-400
                    "
                  >
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};