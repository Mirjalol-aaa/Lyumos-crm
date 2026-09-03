import React, {
  useState,
} from 'react';

import { useCRM } from '../context/CRMContext';

import {
  BarChart3,
  FileSpreadsheet,
  Download,
  Printer,
  TrendingUp,
  DollarSign,
  Receipt,
} from 'lucide-react';

import jsPDF from 'jspdf';

import * as XLSX from 'xlsx';


export const ReportsPage:
  React.FC = () => {
    const {
      financials,
      students,
      expenses,
      settings,
    } = useCRM();


    const [
      timeframe,
      setTimeframe,
    ] = useState<
      | 'Daily'
      | 'Weekly'
      | 'Monthly'
      | 'Yearly'
    >('Monthly');


    const formatMoney = (
      value: number
    ) => {
      return `${settings.currencySymbol}${Number(
        value || 0
      ).toLocaleString()}`;
    };


    // ─────────────────────────────────────────────────────────────────────────
    // EXPORT PDF
    // ─────────────────────────────────────────────────────────────────────────

    const handleExportPDF = () => {
      const doc =
        new jsPDF();

      doc.setFont(
        'helvetica',
        'bold'
      );

      doc.setFontSize(
        20
      );

      doc.text(
        settings.centerName,
        14,
        20
      );


      doc.setFontSize(
        12
      );

      doc.setFont(
        'helvetica',
        'normal'
      );

      doc.text(
        `Financial & Academic Report (${timeframe})`,
        14,
        28
      );

      doc.text(
        `Date: ${new Date().toLocaleDateString()}`,
        14,
        34
      );


      doc.line(
        14,
        38,
        196,
        38
      );


      doc.setFontSize(
        14
      );

      doc.setFont(
        'helvetica',
        'bold'
      );

      doc.text(
        'Executive Summary Metrics:',
        14,
        48
      );


      doc.setFontSize(
        11
      );

      doc.setFont(
        'helvetica',
        'normal'
      );

      doc.text(
        `Total Active Students: ${financials.activeStudents} / ${financials.totalStudents}`,
        14,
        58
      );

      doc.text(
        `Paid Revenue Collected: ${settings.currencySymbol}${financials.paidIncome.toLocaleString()}`,
        14,
        66
      );

      doc.text(
        `Unpaid Fee Pending: ${settings.currencySymbol}${financials.unpaidIncome.toLocaleString()}`,
        14,
        74
      );

      doc.text(
        `Total Operational Expenses: ${settings.currencySymbol}${financials.expensesTotal.toLocaleString()}`,
        14,
        82
      );

      doc.text(
        `Net Center Profit: ${settings.currencySymbol}${financials.netProfit.toLocaleString()}`,
        14,
        90
      );

      doc.text(
        `Overall Class Attendance Rate: ${financials.overallAttendancePercentage}%`,
        14,
        98
      );


      doc.save(
        `LUMOS_CRM_Report_${timeframe}_${new Date()
          .toISOString()
          .split('T')[0]}.pdf`
      );
    };


    // ─────────────────────────────────────────────────────────────────────────
    // EXPORT EXCEL
    // ─────────────────────────────────────────────────────────────────────────

    const handleExportExcel = () => {
      const reportData =
        students.map(
          student => ({
            ID:
              student.id,

            Name:
              student.fullName,

            Group:
              student.groupName,

            Teacher:
              student.teacherName,

            Phone:
              student.phone,

            ParentPhone:
              student.parentPhone,

            MonthlyFee:
              student.monthlyFee,

            Status:
              student.status,

            AugustPaid:
              student.payments[
                'August'
              ]?.amountPaid ||
              0,

            AugustStatus:
              student.payments[
                'August'
              ]?.status ||
              'Unpaid',
          })
        );


      const worksheet =
        XLSX.utils.json_to_sheet(
          reportData
        );


      const workbook =
        XLSX.utils.book_new();


      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        'Students & Payments'
      );


      XLSX.writeFile(
        workbook,
        `LUMOS_Students_Report_${new Date()
          .toISOString()
          .split('T')[0]}.xlsx`
      );
    };


    // ─────────────────────────────────────────────────────────────────────────
    // PRINT
    // ─────────────────────────────────────────────────────────────────────────

    const handlePrint = () => {
      window.print();
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

          print:max-w-none
          print:p-0
        "
      >
        {/* HEADER */}

        <div
          className="
            flex
            flex-col
            gap-4

            print:hidden

            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div
            className="
              min-w-0
            "
          >
            <div
              className="
                mb-2
                flex
                items-center
                gap-2
              "
            >
              <div
                className="
                  flex h-9 w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#007AFF]/10
                  text-[#007AFF]
                "
              >
                <BarChart3
                  className="
                    h-4 w-4
                  "
                />
              </div>

              <span
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.16em]
                  text-[#007AFF]

                  sm:text-[10px]
                "
              >
                Analytics Center
              </span>
            </div>


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
              Financial & Academic
              Analytics Reports
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
              Generate executive
              summaries, revenue
              exports, PDF statements
              and audit logs.
            </p>
          </div>


          {/* EXPORT ACTIONS */}

          <div
            className="
              grid
              w-full
              grid-cols-1
              gap-2

              sm:grid-cols-3

              lg:w-auto
            "
          >
            <button
              type="button"
              onClick={
                handleExportPDF
              }
              className="
                flex
                cursor-pointer
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-rose-600
                px-4 py-2.5
                text-xs
                font-bold
                text-white
                shadow-md
                shadow-rose-600/20
                transition-all

                hover:bg-rose-700

                active:scale-[0.98]
              "
            >
              <Download
                className="
                  h-4 w-4
                  shrink-0
                "
              />

              Export PDF
            </button>


            <button
              type="button"
              onClick={
                handleExportExcel
              }
              className="
                flex
                cursor-pointer
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-emerald-600
                px-4 py-2.5
                text-xs
                font-bold
                text-white
                shadow-md
                shadow-emerald-600/20
                transition-all

                hover:bg-emerald-700

                active:scale-[0.98]
              "
            >
              <FileSpreadsheet
                className="
                  h-4 w-4
                  shrink-0
                "
              />

              Export Excel
            </button>


            <button
              type="button"
              onClick={
                handlePrint
              }
              className="
                flex
                cursor-pointer
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-slate-800
                px-4 py-2.5
                text-xs
                font-bold
                text-white
                transition-all

                hover:bg-slate-900

                active:scale-[0.98]

                dark:bg-slate-700
                dark:hover:bg-slate-600
              "
            >
              <Printer
                className="
                  h-4 w-4
                  shrink-0
                "
              />

              Print
            </button>
          </div>
        </div>


        {/* PRINT HEADER */}

        <div
          className="
            hidden

            print:block
          "
        >
          <h1
            className="
              text-2xl
              font-bold
            "
          >
            {settings.centerName}
          </h1>

          <p
            className="
              mt-1
              text-sm
            "
          >
            Financial & Academic
            Report ({timeframe})
          </p>

          <p
            className="
              mt-1
              text-xs
            "
          >
            {new Date().toLocaleDateString()}
          </p>
        </div>


        {/* TIMEFRAME */}

        <div
          className="
            rounded-2xl
            border
            border-slate-200/60
            bg-white
            p-2
            shadow-sm

            dark:border-slate-800
            dark:bg-slate-900

            print:hidden
          "
        >
          <div
            className="
              grid
              grid-cols-2
              gap-1.5

              sm:grid-cols-4

              md:w-fit
            "
          >
            {(
              [
                'Daily',
                'Weekly',
                'Monthly',
                'Yearly',
              ] as const
            ).map(
              option => (
                <button
                  type="button"
                  key={
                    option
                  }
                  onClick={() =>
                    setTimeframe(
                      option
                    )
                  }
                  className={`
                    cursor-pointer
                    rounded-xl
                    px-3 py-2.5
                    text-[10px]
                    font-bold
                    transition-all

                    sm:px-4
                    sm:text-xs

                    ${
                      timeframe ===
                      option
                        ? `
                          bg-[#007AFF]
                          text-white
                          shadow-md
                          shadow-blue-500/20
                        `
                        : `
                          text-slate-500

                          hover:bg-slate-100

                          dark:hover:bg-slate-800
                        `
                    }
                  `}
                >
                  {option}

                  <span
                    className="
                      hidden

                      sm:inline
                    "
                  >
                    {' Report'}
                  </span>
                </button>
              )
            )}
          </div>
        </div>


        {/* SUMMARY CARDS */}

        <div
          className="
            grid
            grid-cols-1
            gap-3

            sm:grid-cols-2

            lg:grid-cols-3
            lg:gap-5
          "
        >
          {/* REVENUE */}

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

              lg:p-6
            "
          >
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
                  min-w-0
                "
              >
                <span
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-400

                    sm:text-xs
                  "
                >
                  Gross Revenue
                  Collected
                </span>

                <p
                  className="
                    mt-2
                    truncate
                    text-2xl
                    font-black
                    text-emerald-600

                    dark:text-emerald-400

                    sm:text-3xl
                  "
                >
                  {formatMoney(
                    financials.paidIncome
                  )}
                </p>
              </div>


              <div
                className="
                  flex h-10 w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-emerald-50
                  text-emerald-600

                  dark:bg-emerald-950/50
                "
              >
                <DollarSign
                  className="
                    h-5 w-5
                  "
                />
              </div>
            </div>


            <span
              className="
                mt-3
                block
                text-[10px]
                text-slate-400

                sm:text-xs
              "
            >
              +18.4% compared to
              last period
            </span>
          </div>


          {/* EXPENSES */}

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

              lg:p-6
            "
          >
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
                  min-w-0
                "
              >
                <span
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-400

                    sm:text-xs
                  "
                >
                  Center Expenses
                </span>

                <p
                  className="
                    mt-2
                    truncate
                    text-2xl
                    font-black
                    text-rose-600

                    dark:text-rose-400

                    sm:text-3xl
                  "
                >
                  {formatMoney(
                    financials.expensesTotal
                  )}
                </p>
              </div>


              <div
                className="
                  flex h-10 w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-rose-50
                  text-rose-600

                  dark:bg-rose-950/50
                "
              >
                <Receipt
                  className="
                    h-5 w-5
                  "
                />
              </div>
            </div>


            <span
              className="
                mt-3
                block
                text-[10px]
                leading-relaxed
                text-slate-400

                sm:text-xs
              "
            >
              Includes rent,
              teacher salaries and
              equipment
            </span>
          </div>


          {/* PROFIT */}

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

              sm:col-span-2
              sm:p-5

              lg:col-span-1
              lg:p-6
            "
          >
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
                  min-w-0
                "
              >
                <span
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-slate-400

                    sm:text-xs
                  "
                >
                  Net Margin Profit
                </span>

                <p
                  className="
                    mt-2
                    truncate
                    text-2xl
                    font-black
                    text-slate-900

                    dark:text-white

                    sm:text-3xl
                  "
                >
                  {formatMoney(
                    financials.netProfit
                  )}
                </p>
              </div>


              <div
                className="
                  flex h-10 w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-purple-50
                  text-purple-600

                  dark:bg-purple-950/50
                "
              >
                <TrendingUp
                  className="
                    h-5 w-5
                  "
                />
              </div>
            </div>


            <span
              className="
                mt-3
                block
                text-[10px]
                font-bold
                text-emerald-600

                sm:text-xs
              "
            >
              Profitability Rate:
              62%
            </span>
          </div>
        </div>


        {/* EXPENSE AUDIT */}

        <section
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

            lg:p-6
          "
        >
          <div
            className="
              mb-4
            "
          >
            <h3
              className="
                text-sm
                font-bold
                text-slate-900

                dark:text-white

                sm:text-base
              "
            >
              Recent Operating
              Expenses Audit
            </h3>

            <p
              className="
                mt-1
                text-[10px]
                text-slate-400

                sm:text-xs
              "
            >
              {expenses.length}{' '}
              expense records
            </p>
          </div>


          {/* MOBILE CARDS */}

          <div
            className="
              space-y-3

              md:hidden

              print:hidden
            "
          >
            {expenses.length ===
            0 ? (
              <div
                className="
                  rounded-xl
                  border
                  border-dashed
                  border-slate-300
                  px-4 py-10
                  text-center
                  text-xs
                  text-slate-400

                  dark:border-slate-700
                "
              >
                No expense records.
              </div>
            ) : (
              expenses.map(
                expense => (
                  <div
                    key={
                      expense.id
                    }
                    className="
                      rounded-xl
                      border
                      border-slate-200/70
                      bg-slate-50/70
                      p-3

                      dark:border-slate-800
                      dark:bg-slate-800/30
                    "
                  >
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
                          min-w-0
                          flex-1
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
                          {expense.title}
                        </p>

                        <p
                          className="
                            mt-1
                            text-[10px]
                            text-slate-400
                          "
                        >
                          {
                            expense.category
                          }
                        </p>
                      </div>


                      <span
                        className="
                          shrink-0
                          text-xs
                          font-black
                          text-rose-600

                          dark:text-rose-400
                        "
                      >
                        {formatMoney(
                          expense.amount
                        )}
                      </span>
                    </div>


                    <div
                      className="
                        mt-3
                        grid
                        grid-cols-2
                        gap-3
                        border-t
                        border-slate-200/70
                        pt-3

                        dark:border-slate-700
                      "
                    >
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
                          Date
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-[10px]
                            font-semibold
                            text-slate-700

                            dark:text-slate-300
                          "
                        >
                          {expense.date}
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
                          Method
                        </p>

                        <p
                          className="
                            mt-0.5
                            truncate
                            text-[10px]
                            font-semibold
                            text-slate-700

                            dark:text-slate-300
                          "
                        >
                          {
                            expense.paymentMethod
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )
            )}
          </div>


          {/* TABLET / DESKTOP / PRINT TABLE */}

          <div
            className="
              hidden
              overflow-x-auto

              md:block

              print:block
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
                  bg-slate-50
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-500

                  dark:bg-slate-800
                "
              >
                <tr>
                  <th
                    className="
                      p-3
                    "
                  >
                    Title
                  </th>

                  <th
                    className="
                      p-3
                    "
                  >
                    Category
                  </th>

                  <th
                    className="
                      p-3
                    "
                  >
                    Amount
                  </th>

                  <th
                    className="
                      p-3
                    "
                  >
                    Date
                  </th>

                  <th
                    className="
                      p-3
                    "
                  >
                    Method
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
                {expenses.map(
                  expense => (
                    <tr
                      key={
                        expense.id
                      }
                      className="
                        transition-colors

                        hover:bg-slate-50

                        dark:hover:bg-slate-800/40
                      "
                    >
                      <td
                        className="
                          p-3
                          font-bold
                          text-slate-900

                          dark:text-white
                        "
                      >
                        {expense.title}
                      </td>

                      <td
                        className="
                          p-3
                          text-slate-500
                        "
                      >
                        {
                          expense.category
                        }
                      </td>

                      <td
                        className="
                          whitespace-nowrap
                          p-3
                          font-bold
                          text-rose-600

                          dark:text-rose-400
                        "
                      >
                        {formatMoney(
                          expense.amount
                        )}
                      </td>

                      <td
                        className="
                          whitespace-nowrap
                          p-3
                          text-slate-400
                        "
                      >
                        {expense.date}
                      </td>

                      <td
                        className="
                          p-3
                          text-slate-500
                        "
                      >
                        {
                          expense.paymentMethod
                        }
                      </td>
                    </tr>
                  )
                )}


                {expenses.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="
                        p-10
                        text-center
                        font-medium
                        text-slate-400
                      "
                    >
                      No expense
                      records.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  };