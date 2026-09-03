import React, { useMemo } from 'react';

import { useCRM } from '../context/CRMContext';

import {
  Users,
  DollarSign,
  ArrowUpRight,
  TrendingUp,
  Calendar,
  Cake,
  CheckCircle2,
  AlertCircle,
  Plus,
  BookOpen,
} from 'lucide-react';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

import { ACADEMIC_MONTHS } from '../constants/academic';


export const DashboardPage: React.FC = () => {
  const {
    financials,
    students,
    expenses,

    setIsAddStudentModalOpen,
    setIsReceivePaymentModalOpen,
    setSelectedStudentId,
    setIsAddGroupModalOpen,

    setActivePage,

    calendarEvents,
    settings,
  } = useCRM();


  const currentMonth =
    financials.currentAcademicMonth;


  // ───────────────────────────────────────────────────────────────────────────
  // MONTHLY ANALYTICS
  // ───────────────────────────────────────────────────────────────────────────

  const monthlyData = useMemo(() => {
    const yearParts =
      settings.academicYear
        .split('-')
        .map(part =>
          parseInt(
            part.trim(),
            10
          )
        );

    const academicYearStart =
      yearParts[0] ||
      new Date().getFullYear();

    return ACADEMIC_MONTHS.map(
      (month, index) => {
        let revenue = 0;

        students.forEach(student => {
          const payment =
            student.payments[month];

          if (
            payment &&
            (
              payment.status === 'Paid' ||
              payment.status === 'Discount'
            )
          ) {
            revenue +=
              payment.amountPaid;
          }
        });


        const calendarMonthIndex =
          (index + 7) % 12;

        const year =
          index < 5
            ? academicYearStart
            : academicYearStart + 1;


        const monthExpenses =
          expenses
            .filter(expense => {
              const date =
                new Date(
                  expense.date
                );

              return (
                date.getMonth() ===
                  calendarMonthIndex &&
                date.getFullYear() ===
                  year
              );
            })
            .reduce(
              (
                total,
                expense
              ) =>
                total +
                expense.amount,
              0
            );


        const studentCount =
          students.filter(
            student => {
              const joined =
                new Date(
                  student.joinedDate
                );

              const cutoff =
                new Date(
                  year,
                  calendarMonthIndex +
                    1,
                  0
                );

              return joined <= cutoff;
            }
          ).length;


        return {
          month:
            month.slice(
              0,
              3
            ),

          revenue,

          expenses:
            monthExpenses,

          students:
            studentCount,
        };
      }
    );
  }, [
    students,
    expenses,
    settings.academicYear,
  ]);


  const recentStudents =
    students.slice(
      0,
      5
    );


  const upcomingBirthdays =
    useMemo(() => {
      const today =
        new Date();

      const todayMMDD =
        `${String(
          today.getMonth() + 1
        ).padStart(
          2,
          '0'
        )}-${String(
          today.getDate()
        ).padStart(
          2,
          '0'
        )}`;

      return students
        .filter(
          student =>
            student.birthDate.slice(
              5
            ) === todayMMDD
        )
        .concat(
          students.filter(
            student =>
              student.birthDate.slice(
                5
              ) !== todayMMDD
          )
        )
        .slice(
          0,
          4
        );
    }, [
      students,
    ]);


  const formatCurrency = (
    value: number
  ) => {
    return `${settings.currencySymbol}${value.toLocaleString()}`;
  };


  // ───────────────────────────────────────────────────────────────────────────
  // PAYMENT BADGE
  // ───────────────────────────────────────────────────────────────────────────

  const renderPaymentStatus = (
    status: string
  ) => {
    if (
      status === 'Paid' ||
      status === 'Discount'
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
          items-center
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


  return (
    <div
      className="
        mx-auto
        w-full
        max-w-7xl
        space-y-5
        px-3
        py-4

        sm:space-y-6
        sm:px-5
        sm:py-5

        lg:px-6
        lg:py-6

        xl:space-y-8
        xl:px-8
        xl:py-8
      "
    >
      {/* ─────────────────────────────────────────────────────────────────────
          WELCOME BANNER
      ───────────────────────────────────────────────────────────────────── */}

      <section
        className="
          relative
          overflow-hidden
          rounded-2xl
          border
          border-slate-800
          bg-gradient-to-r
          from-slate-900
          via-slate-800
          to-blue-950
          p-5
          text-white
          shadow-xl

          sm:rounded-[24px]
          sm:p-6

          lg:p-8
        "
      >
        {/* Decorative glow */}
        <div
          className="
            pointer-events-none
            absolute
            -right-20
            -top-24
            h-64 w-64
            rounded-full
            bg-blue-500/10
            blur-3xl
          "
        />

        <div
          className="
            relative z-10
            flex flex-col
            gap-5

            lg:flex-row
            lg:items-center
            lg:justify-between
            lg:gap-8
          "
        >
          <div
            className="
              max-w-2xl
              min-w-0
            "
          >
            <div
              className="
                inline-flex
                max-w-full
                items-center
                gap-2
                rounded-full
                border
                border-blue-500/30
                bg-blue-500/20
                px-3 py-1
                text-[10px]
                font-semibold
                text-blue-300

                sm:text-xs
              "
            >
              <span
                className="
                  truncate
                "
              >
                Academic Year{' '}
                {settings.academicYear}
              </span>
            </div>

            <h1
              className="
                mt-3
                text-xl
                font-extrabold
                leading-tight
                tracking-tight

                sm:text-2xl

                lg:text-3xl
              "
            >
              Welcome back to{' '}
              {settings.centerName}
            </h1>

            <p
              className="
                mt-2
                max-w-xl
                text-xs
                leading-relaxed
                text-slate-300

                sm:text-sm
              "
            >
              Manage{' '}
              {financials.totalStudents}{' '}
              students, track fee
              payments, generate
              financial reports and
              manage your education
              center from one place.
            </p>
          </div>


          {/* Actions */}

          <div
            className="
              grid w-full
              grid-cols-1
              gap-2.5

              sm:grid-cols-3

              lg:w-auto
              lg:min-w-max
            "
          >
            <button
              type="button"
              onClick={() =>
                setIsReceivePaymentModalOpen(
                  true
                )
              }
              className="
                flex
                cursor-pointer
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-emerald-500
                px-4
                py-2.5
                text-xs
                font-bold
                text-white
                shadow-lg
                shadow-emerald-500/20
                transition-all

                hover:bg-emerald-600

                active:scale-[0.98]
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


            <button
              type="button"
              onClick={() =>
                setIsAddStudentModalOpen(
                  true
                )
              }
              className="
                flex
                cursor-pointer
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#007AFF]
                px-4
                py-2.5
                text-xs
                font-bold
                text-white
                shadow-lg
                shadow-blue-500/20
                transition-all

                hover:bg-blue-600

                active:scale-[0.98]
              "
            >
              <Plus
                className="
                  h-4 w-4
                  shrink-0
                "
              />

              Add Student
            </button>


            <button
              type="button"
              onClick={() =>
                setIsAddGroupModalOpen(
                  true
                )
              }
              className="
                flex
                cursor-pointer
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-white/20
                bg-white/10
                px-4
                py-2.5
                text-xs
                font-bold
                text-white
                backdrop-blur-md
                transition-all

                hover:bg-white/20

                active:scale-[0.98]
              "
            >
              <BookOpen
                className="
                  h-4 w-4
                  shrink-0
                "
              />

              New Group
            </button>
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────────────
          KPI CARDS
      ───────────────────────────────────────────────────────────────────── */}

      <section
        className="
          grid
          grid-cols-1
          gap-3

          sm:grid-cols-2
          sm:gap-4

          xl:grid-cols-4
          xl:gap-5
        "
      >
        {/* Total Students */}

        <div
          className="
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
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-slate-400

                sm:text-xs
              "
            >
              Total Students
            </span>

            <div
              className="
                rounded-xl
                bg-blue-50
                p-2.5
                text-[#007AFF]

                dark:bg-blue-950/60
              "
            >
              <Users
                className="
                  h-5 w-5
                "
              />
            </div>
          </div>

          <div
            className="
              mt-3
              flex
              items-end
              justify-between
              gap-3
            "
          >
            <span
              className="
                text-2xl
                font-black
                tracking-tight
                text-slate-900

                dark:text-white
              "
            >
              {financials.totalStudents}
            </span>

            <span
              className="
                inline-flex
                items-center
                gap-0.5
                rounded-full
                bg-emerald-50
                px-2 py-1
                text-[10px]
                font-bold
                text-emerald-600

                dark:bg-emerald-950
                dark:text-emerald-400
              "
            >
              <ArrowUpRight
                className="
                  h-3.5 w-3.5
                "
              />

              +12%
            </span>
          </div>

          <p
            className="
              mt-2
              text-[11px]
              font-medium
              leading-relaxed
              text-slate-400

              sm:text-xs
            "
          >
            {financials.activeStudents}{' '}
            active •{' '}
            {financials.newStudentsThisMonth}{' '}
            new this month
          </p>
        </div>


        {/* Paid Income */}

        <div
          className="
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
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-slate-400

                sm:text-xs
              "
            >
              Paid Income (
              {currentMonth.slice(
                0,
                3
              )}
              )
            </span>

            <div
              className="
                rounded-xl
                bg-emerald-50
                p-2.5
                text-emerald-600

                dark:bg-emerald-950/60
              "
            >
              <DollarSign
                className="
                  h-5 w-5
                "
              />
            </div>
          </div>

          <div
            className="
              mt-3
              flex
              items-end
              justify-between
              gap-3
            "
          >
            <span
              className="
                min-w-0
                truncate
                text-2xl
                font-black
                tracking-tight
                text-slate-900

                dark:text-white
              "
            >
              {formatCurrency(
                financials.paidIncome
              )}
            </span>

            <span
              className="
                inline-flex
                shrink-0
                items-center
                gap-0.5
                rounded-full
                bg-emerald-50
                px-2 py-1
                text-[10px]
                font-bold
                text-emerald-600

                dark:bg-emerald-950
                dark:text-emerald-400
              "
            >
              <ArrowUpRight
                className="
                  h-3.5 w-3.5
                "
              />

              +18.4%
            </span>
          </div>

          <p
            className="
              mt-2
              text-[11px]
              font-medium
              leading-relaxed
              text-slate-400

              sm:text-xs
            "
          >
            Target expected:{' '}
            {formatCurrency(
              financials.monthlyExpectedIncome
            )}
          </p>
        </div>


        {/* Unpaid */}

        <div
          className="
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
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-slate-400

                sm:text-xs
              "
            >
              Unpaid Fee Due
            </span>

            <div
              className="
                rounded-xl
                bg-rose-50
                p-2.5
                text-rose-600

                dark:bg-rose-950/60
              "
            >
              <AlertCircle
                className="
                  h-5 w-5
                "
              />
            </div>
          </div>

          <div
            className="
              mt-3
              flex
              items-end
              justify-between
              gap-3
            "
          >
            <span
              className="
                min-w-0
                truncate
                text-2xl
                font-black
                tracking-tight
                text-rose-600

                dark:text-rose-400
              "
            >
              {formatCurrency(
                financials.unpaidIncome
              )}
            </span>

            <span
              className="
                shrink-0
                rounded-full
                bg-amber-50
                px-2 py-1
                text-[10px]
                font-bold
                text-amber-600

                dark:bg-amber-950
              "
            >
              {financials.unpaidCount}{' '}
              Pending
            </span>
          </div>

          <p
            className="
              mt-2
              text-[11px]
              font-medium
              text-slate-400

              sm:text-xs
            "
          >
            Automated SMS reminders
            active
          </p>
        </div>


        {/* Net Profit */}

        <div
          className="
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
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-slate-400

                sm:text-xs
              "
            >
              Net Profit
            </span>

            <div
              className="
                rounded-xl
                bg-purple-50
                p-2.5
                text-purple-600

                dark:bg-purple-950/60
              "
            >
              <TrendingUp
                className="
                  h-5 w-5
                "
              />
            </div>
          </div>

          <div
            className="
              mt-3
              flex
              items-end
              justify-between
              gap-3
            "
          >
            <span
              className="
                min-w-0
                truncate
                text-2xl
                font-black
                tracking-tight
                text-slate-900

                dark:text-white
              "
            >
              {formatCurrency(
                financials.netProfit
              )}
            </span>

            <span
              className="
                inline-flex
                shrink-0
                items-center
                gap-0.5
                rounded-full
                bg-emerald-50
                px-2 py-1
                text-[10px]
                font-bold
                text-emerald-600

                dark:bg-emerald-950
              "
            >
              <ArrowUpRight
                className="
                  h-3.5 w-3.5
                "
              />

              Healthy
            </span>
          </div>

          <p
            className="
              mt-2
              text-[11px]
              font-medium
              text-slate-400

              sm:text-xs
            "
          >
            Expenses:{' '}
            {formatCurrency(
              financials.expensesTotal
            )}
          </p>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────────────
          CHARTS
      ───────────────────────────────────────────────────────────────────── */}

      <section
        className="
          grid
          grid-cols-1
          gap-4

          xl:grid-cols-3
          xl:gap-6
        "
      >
        {/* Revenue chart */}

        <div
          className="
            min-w-0
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

            xl:col-span-2
          "
        >
          <div
            className="
              flex
              flex-col
              gap-2

              sm:flex-row
              sm:items-start
              sm:justify-between
            "
          >
            <div
              className="
                min-w-0
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
                Revenue vs Expenses
                Trend
              </h3>

              <p
                className="
                  mt-0.5
                  text-[11px]
                  text-slate-400

                  sm:text-xs
                "
              >
                Monthly comparison for{' '}
                {settings.academicYear}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setActivePage(
                  'reports'
                )
              }
              className="
                w-fit
                cursor-pointer
                text-xs
                font-bold
                text-[#007AFF]

                hover:underline
              "
            >
              Full Report →
            </button>
          </div>


          <div
            className="
              mt-4
              h-64
              w-full

              sm:h-72
            "
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={monthlyData}
                margin={{
                  top: 5,
                  right: 5,
                  left: -15,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="colorRev"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#007AFF"
                      stopOpacity={
                        0.3
                      }
                    />

                    <stop
                      offset="95%"
                      stopColor="#007AFF"
                      stopOpacity={
                        0
                      }
                    />
                  </linearGradient>

                  <linearGradient
                    id="colorExp"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#FF3B30"
                      stopOpacity={
                        0.2
                      }
                    />

                    <stop
                      offset="95%"
                      stopColor="#FF3B30"
                      stopOpacity={
                        0
                      }
                    />
                  </linearGradient>
                </defs>


                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                />

                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  width={55}
                  tickFormatter={(
                    value
                  ) =>
                    value >= 1000
                      ? `${settings.currencySymbol}${Math.round(
                          value /
                            1000
                        )}k`
                      : `${settings.currencySymbol}${value}`
                  }
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor:
                      '#0f172a',

                    borderRadius:
                      '12px',

                    color:
                      '#fff',

                    border:
                      'none',

                    fontSize:
                      '12px',
                  }}
                  formatter={(
                    value: any
                  ) => [
                    formatCurrency(
                      Number(
                        value
                      )
                    ),
                    '',
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#007AFF"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />

                <Area
                  type="monotone"
                  dataKey="expenses"
                  name="Expenses"
                  stroke="#FF3B30"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorExp)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>


        {/* Students Chart */}

        <div
          className="
            min-w-0
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
          <div>
            <h3
              className="
                text-sm
                font-bold
                text-slate-900

                dark:text-white

                sm:text-base
              "
            >
              Student Growth
            </h3>

            <p
              className="
                mt-0.5
                text-[11px]
                text-slate-400

                sm:text-xs
              "
            >
              Total active enrollments
            </p>
          </div>

          <div
            className="
              mt-4
              h-64
              w-full

              sm:h-72
            "
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={monthlyData}
                margin={{
                  top: 5,
                  right: 5,
                  left: -20,
                  bottom: 0,
                }}
              >
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                />

                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={
                    false
                  }
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor:
                      '#0f172a',

                    borderRadius:
                      '12px',

                    color:
                      '#fff',

                    border:
                      'none',

                    fontSize:
                      '12px',
                  }}
                />

                <Bar
                  dataKey="students"
                  name="Students"
                  fill="#34C759"
                  radius={[
                    6,
                    6,
                    0,
                    0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────────────
          STUDENTS + SIDE PANELS
      ───────────────────────────────────────────────────────────────────── */}

      <section
        className="
          grid
          grid-cols-1
          gap-4

          xl:grid-cols-3
          xl:gap-6
        "
      >
        {/* Recent Students */}

        <div
          className="
            min-w-0
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

            xl:col-span-2
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
              <h3
                className="
                  text-sm
                  font-bold
                  text-slate-900

                  dark:text-white

                  sm:text-base
                "
              >
                Recently Enrolled
                Students
              </h3>

              <p
                className="
                  mt-0.5
                  text-[11px]
                  text-slate-400

                  sm:text-xs
                "
              >
                Latest active
                registrations across
                groups
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setActivePage(
                  'students'
                )
              }
              className="
                shrink-0
                cursor-pointer
                text-xs
                font-bold
                text-[#007AFF]

                hover:underline
              "
            >
              View All →
            </button>
          </div>


          {/* MOBILE STUDENT CARDS */}

          <div
            className="
              mt-4
              space-y-3

              md:hidden
            "
          >
            {recentStudents.length ===
            0 ? (
              <div
                className="
                  rounded-xl
                  border
                  border-dashed
                  border-slate-200
                  px-4 py-8
                  text-center
                  text-xs
                  text-slate-400

                  dark:border-slate-800
                "
              >
                No students found.
              </div>
            ) : (
              recentStudents.map(
                student => {
                  const monthPayment =
                    student.payments[
                      currentMonth
                    ] || {
                      status:
                        'Unpaid',
                    };

                  return (
                    <div
                      key={
                        student.id
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
                            h-10 w-10
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
                              <p
                                className="
                                  truncate
                                  text-xs
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

                            {renderPaymentStatus(
                              monthPayment.status
                            )}
                          </div>

                          <div
                            className="
                              mt-3
                              grid
                              grid-cols-2
                              gap-2
                              text-[10px]
                            "
                          >
                            <div>
                              <p
                                className="
                                  text-slate-400
                                "
                              >
                                Group
                              </p>

                              <p
                                className="
                                  mt-0.5
                                  truncate
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

                            <div>
                              <p
                                className="
                                  text-slate-400
                                "
                              >
                                Teacher
                              </p>

                              <p
                                className="
                                  mt-0.5
                                  truncate
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
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedStudentId(
                                student.id
                              )
                            }
                            className="
                              mt-3
                              w-full
                              cursor-pointer
                              rounded-lg
                              bg-slate-200/70
                              px-3 py-2
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
                        </div>
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
              mt-4
              hidden
              overflow-x-auto

              md:block
            "
          >
            <table
              className="
                w-full
                min-w-[700px]
                text-left
                text-xs
              "
            >
              <thead
                className="
                  border-b
                  border-slate-100
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-400

                  dark:border-slate-800
                "
              >
                <tr>
                  <th
                    className="
                      px-2 py-3
                    "
                  >
                    Student
                  </th>

                  <th
                    className="
                      px-2 py-3
                    "
                  >
                    Group
                  </th>

                  <th
                    className="
                      px-2 py-3
                    "
                  >
                    Teacher
                  </th>

                  <th
                    className="
                      px-2 py-3
                    "
                  >
                    {currentMonth}{' '}
                    Status
                  </th>

                  <th
                    className="
                      px-2 py-3
                      text-right
                    "
                  >
                    Action
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
                {recentStudents.map(
                  student => {
                    const monthPayment =
                      student.payments[
                        currentMonth
                      ] || {
                        status:
                          'Unpaid',
                      };

                    return (
                      <tr
                        key={
                          student.id
                        }
                        className="
                          transition-colors

                          hover:bg-slate-50

                          dark:hover:bg-slate-800/40
                        "
                      >
                        <td
                          className="
                            px-2 py-3
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
                                h-8 w-8
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
                                  max-w-[170px]
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
                            px-2 py-3
                            font-medium
                            text-slate-700

                            dark:text-slate-300
                          "
                        >
                          {
                            student.groupName
                          }
                        </td>

                        <td
                          className="
                            px-2 py-3
                            text-slate-500
                          "
                        >
                          {
                            student.teacherName
                          }
                        </td>

                        <td
                          className="
                            px-2 py-3
                          "
                        >
                          {renderPaymentStatus(
                            monthPayment.status
                          )}
                        </td>

                        <td
                          className="
                            px-2 py-3
                            text-right
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
                              rounded-lg
                              bg-slate-100
                              px-3 py-1.5
                              font-bold
                              text-[#007AFF]
                              transition-colors

                              hover:bg-slate-200

                              dark:bg-slate-800
                              dark:hover:bg-slate-700
                            "
                          >
                            Profile
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>


        {/* SIDE PANELS */}

        <div
          className="
            min-w-0
            space-y-4

            sm:space-y-6
          "
        >
          {/* Birthdays */}

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
            <h3
              className="
                flex
                items-center
                gap-2
                text-sm
                font-bold
                text-slate-900

                dark:text-white

                sm:text-base
              "
            >
              <Cake
                className="
                  h-4 w-4
                  shrink-0
                  text-amber-500
                "
              />

              Birthdays Today & Soon
            </h3>


            <div
              className="
                mt-4
                space-y-2.5
              "
            >
              {upcomingBirthdays.length ===
              0 ? (
                <div
                  className="
                    rounded-xl
                    border
                    border-dashed
                    border-slate-200
                    px-3 py-6
                    text-center
                    text-xs
                    text-slate-400

                    dark:border-slate-800
                  "
                >
                  No students found.
                </div>
              ) : (
                upcomingBirthdays.map(
                  student => (
                    <div
                      key={
                        student.id
                      }
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border
                        border-amber-200/50
                        bg-amber-50/50
                        p-3

                        dark:border-amber-900/40
                        dark:bg-amber-950/20
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
                          flex-1
                        "
                      >
                        <span
                          className="
                            block
                            truncate
                            text-xs
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
                            mt-0.5
                            block
                            truncate
                            text-[10px]
                            font-medium
                            text-amber-700

                            dark:text-amber-300
                          "
                        >
                          {
                            student.groupName
                          }
                        </span>
                      </div>

                      <span
                        className="
                          shrink-0
                          rounded-lg
                          bg-amber-500
                          px-2 py-1
                          text-[9px]
                          font-bold
                          text-white
                        "
                      >
                        {
                          student.birthDate
                        }
                      </span>
                    </div>
                  )
                )
              )}
            </div>
          </div>


          {/* Calendar */}

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
            <h3
              className="
                flex
                items-center
                gap-2
                text-sm
                font-bold
                text-slate-900

                dark:text-white

                sm:text-base
              "
            >
              <Calendar
                className="
                  h-4 w-4
                  shrink-0
                  text-[#007AFF]
                "
              />

              Center Calendar
            </h3>


            <div
              className="
                mt-4
                space-y-2.5
              "
            >
              {calendarEvents.length ===
              0 ? (
                <div
                  className="
                    rounded-xl
                    border
                    border-dashed
                    border-slate-200
                    px-3 py-6
                    text-center
                    text-xs
                    text-slate-400

                    dark:border-slate-800
                  "
                >
                  No calendar events.
                </div>
              ) : (
                calendarEvents.map(
                  event => (
                    <div
                      key={
                        event.id
                      }
                      className="
                        rounded-xl
                        border
                        border-slate-200/60
                        bg-slate-50
                        p-3

                        dark:border-slate-700/60
                        dark:bg-slate-800/50
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
                        <span
                          className="
                            min-w-0
                            flex-1
                            text-xs
                            font-bold
                            leading-relaxed
                            text-slate-900

                            dark:text-white
                          "
                        >
                          {
                            event.title
                          }
                        </span>

                        <span
                          className="
                            shrink-0
                            text-[9px]
                            font-semibold
                            text-[#007AFF]
                          "
                        >
                          {
                            event.date
                          }
                        </span>
                      </div>

                      {event.description && (
                        <p
                          className="
                            mt-1.5
                            text-[10px]
                            leading-relaxed
                            text-slate-500

                            sm:text-[11px]
                          "
                        >
                          {
                            event.description
                          }
                        </p>
                      )}
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};