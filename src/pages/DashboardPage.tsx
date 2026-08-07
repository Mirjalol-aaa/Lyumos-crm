import React from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  Users, DollarSign, ArrowUpRight, ArrowDownRight, UserPlus, 
  TrendingUp, Calendar, Cake, CheckCircle2, AlertCircle, Plus, BookOpen, FileText 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const DashboardPage: React.FC = () => {
  const { 
    financials, 
    students, 
    setIsAddStudentModalOpen, 
    setIsReceivePaymentModalOpen, 
    setSelectedStudentId,
    setIsAddGroupModalOpen,
    setActivePage,
    calendarEvents,
    settings 
  } = useCRM();

  // Monthly Revenue & Expense Data
  const monthlyData = [
    { month: 'Jan', revenue: 21000, expenses: 14200, students: 110 },
    { month: 'Feb', revenue: 22400, expenses: 14800, students: 118 },
    { month: 'Mar', revenue: 23800, expenses: 15100, students: 125 },
    { month: 'Apr', revenue: 24500, expenses: 15400, students: 132 },
    { month: 'May', revenue: 25200, expenses: 15900, students: 138 },
    { month: 'Jun', revenue: 26100, expenses: 16200, students: 144 },
    { month: 'Jul', revenue: 26800, expenses: 16800, students: 148 },
    { month: 'Aug', revenue: financials.paidIncome, expenses: financials.expensesTotal, students: financials.totalStudents },
  ];

  const recentStudents = students.slice(0, 5);

  // Filter students with upcoming birthdays
  const upcomingBirthdays = students.slice(0, 4);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-[28px] bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white shadow-2xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
              <span>Academic Year {settings.academicYear}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back to {settings.centerName}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 font-normal leading-relaxed">
              Manage 150+ students, track fee payments, generate financial reports, and align schedules effortlessly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsReceivePaymentModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" /> Receive Payment
            </button>
            <button
              onClick={() => setIsAddStudentModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#007AFF] hover:bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Student
            </button>
            <button
              onClick={() => setIsAddGroupModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md border border-white/20 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> New Group
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards Grid (Apple styled 20px rounded glass cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stat 1: Total Students */}
        <div className="p-5 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Students</span>
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#007AFF]">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {financials.totalStudents}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            {financials.activeStudents} active • {financials.newStudentsThisMonth} new this month
          </p>
        </div>

        {/* Stat 2: Paid Income */}
        <div className="p-5 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Paid Income (Aug)</span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {settings.currencySymbol}{financials.paidIncome.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Target expected: {settings.currencySymbol}{financials.monthlyExpectedIncome.toLocaleString()}
          </p>
        </div>

        {/* Stat 3: Unpaid Income */}
        <div className="p-5 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unpaid Fee Due</span>
            <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
              {settings.currencySymbol}{financials.unpaidIncome.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full">
              18 Pending
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Automated SMS reminders active
          </p>
        </div>

        {/* Stat 4: Net Profit */}
        <div className="p-5 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Net Profit</span>
            <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {settings.currencySymbol}{financials.netProfit.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3.5 h-3.5" /> Healthy
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Expenses: {settings.currencySymbol}{financials.expensesTotal.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Growth Chart */}
        <div className="lg:col-span-2 p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Revenue vs Expenses Trend</h3>
              <p className="text-xs text-slate-400">Monthly comparison for 2025 Academic Season</p>
            </div>
            <button 
              onClick={() => setActivePage('reports')}
              className="text-xs font-bold text-[#007AFF] hover:underline"
            >
              Full Report →
            </button>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#007AFF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#007AFF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF3B30" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#FF3B30" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={val => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', color: '#fff', border: 'none' }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#007AFF" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#FF3B30" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Enrollment Bar Chart */}
        <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Student Growth</h3>
              <p className="text-xs text-slate-400">Total active enrollments</p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', color: '#fff', border: 'none' }}
                />
                <Bar dataKey="students" name="Students" fill="#34C759" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables & Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Student Registrations */}
        <div className="lg:col-span-2 p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Recently Enrolled Students</h3>
              <p className="text-xs text-slate-400">Latest active registrations across groups</p>
            </div>
            <button onClick={() => setActivePage('students')} className="text-xs font-bold text-[#007AFF] hover:underline">
              View All 150+ →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-2">Student</th>
                  <th className="py-3 px-2">Group</th>
                  <th className="py-3 px-2">Teacher</th>
                  <th className="py-3 px-2">August Status</th>
                  <th className="py-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentStudents.map(student => {
                  const augPayment = student.payments['August'] || { status: 'Unpaid' };
                  return (
                    <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <img src={student.avatar} alt={student.fullName} className="w-8 h-8 rounded-full object-cover shrink-0" />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">{student.fullName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{student.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 font-medium text-slate-700 dark:text-slate-300">{student.groupName}</td>
                      <td className="py-3 px-2 text-slate-500">{student.teacherName}</td>
                      <td className="py-3 px-2">
                        {augPayment.status === 'Paid' || augPayment.status === 'Discount' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Paid
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Unpaid
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => setSelectedStudentId(student.id)}
                          className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold text-[#007AFF]"
                        >
                          Profile
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Birthdays & Events Panel */}
        <div className="space-y-6">
          {/* Upcoming Birthdays */}
          <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Cake className="w-4 h-4 text-amber-500" /> Birthdays Today & Soon
              </h3>
            </div>

            <div className="space-y-3">
              {upcomingBirthdays.map(st => (
                <div key={st.id} className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40">
                  <div className="flex items-center gap-3">
                    <img src={st.avatar} alt={st.fullName} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">{st.fullName}</span>
                      <span className="text-[10px] text-amber-700 dark:text-amber-300 font-medium">{st.groupName}</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-[10px] font-bold bg-amber-500 text-white rounded-lg">
                    {st.birthDate}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Events */}
          <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#007AFF]" /> Center Calendar
              </h3>
            </div>

            <div className="space-y-3">
              {calendarEvents.map(evt => (
                <div key={evt.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{evt.title}</span>
                    <span className="text-[10px] font-semibold text-[#007AFF]">{evt.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{evt.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
