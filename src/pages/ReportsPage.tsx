import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  BarChart3, FileSpreadsheet, Download, Printer, 
  TrendingUp, DollarSign, Users, Receipt, CheckCircle2 
} from 'lucide-react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export const ReportsPage: React.FC = () => {
  const { financials, students, expenses, settings } = useCRM();
  const [timeframe, setTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Yearly'>('Monthly');

  // Export PDF Handler
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(`${settings.centerName}`, 14, 20);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Financial & Academic Report (${timeframe})`, 14, 28);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 34);

    doc.line(14, 38, 196, 38);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Executive Summary Metrics:", 14, 48);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Active Students: ${financials.activeStudents} / ${financials.totalStudents}`, 14, 58);
    doc.text(`Paid Revenue Collected: $${financials.paidIncome.toLocaleString()}`, 14, 66);
    doc.text(`Unpaid Fee Pending: $${financials.unpaidIncome.toLocaleString()}`, 14, 74);
    doc.text(`Total Operational Expenses: $${financials.expensesTotal.toLocaleString()}`, 14, 82);
    doc.text(`Net Center Profit: $${financials.netProfit.toLocaleString()}`, 14, 90);
    doc.text(`Overall Class Attendance Rate: ${financials.overallAttendancePercentage}%`, 14, 98);

    doc.save(`LYUMOS_CRM_Report_${timeframe}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Export Excel Handler
  const handleExportExcel = () => {
    const reportData = students.map(s => ({
      ID: s.id,
      Name: s.fullName,
      Group: s.groupName,
      Teacher: s.teacherName,
      Phone: s.phone,
      ParentPhone: s.parentPhone,
      MonthlyFee: s.monthlyFee,
      Status: s.status,
      AugustPaid: s.payments['August']?.amountPaid || 0,
      AugustStatus: s.payments['August']?.status || 'Unpaid'
    }));

    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students & Payments");

    XLSX.writeFile(workbook, `LYUMOS_Students_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto print:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Financial & Academic Analytics Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate executive summaries, revenue exports, PDF statements & audit logs
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportPDF}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Excel
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* Timeframe selector */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-[20px] border border-slate-200/60 dark:border-slate-800 w-fit print:hidden">
        {(['Daily', 'Weekly', 'Monthly', 'Yearly'] as const).map(tf => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              timeframe === tf
                ? 'bg-[#007AFF] text-white shadow-md shadow-blue-500/20'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tf} Report
          </button>
        ))}
      </div>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Gross Revenue Collected</span>
          <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {settings.currencySymbol}{financials.paidIncome.toLocaleString()}
          </p>
          <span className="text-xs text-slate-400 block">+18.4% compared to last period</span>
        </div>

        <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Center Expenses</span>
          <p className="text-3xl font-black text-rose-600 dark:text-rose-400">
            {settings.currencySymbol}{financials.expensesTotal.toLocaleString()}
          </p>
          <span className="text-xs text-slate-400 block">Includes rent, teacher salaries & equipment</span>
        </div>

        <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">Net Margin Profit</span>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {settings.currencySymbol}{financials.netProfit.toLocaleString()}
          </p>
          <span className="text-xs text-emerald-600 font-bold block">Profitability Rate: 62%</span>
        </div>
      </div>

      {/* Detailed Expenses Breakdown Table */}
      <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Operating Expenses Audit</h3>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Date</th>
              <th className="p-3">Method</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {expenses.map(exp => (
              <tr key={exp.id}>
                <td className="p-3 font-bold text-slate-900 dark:text-white">{exp.title}</td>
                <td className="p-3 text-slate-500">{exp.category}</td>
                <td className="p-3 font-bold text-rose-600">{settings.currencySymbol}{exp.amount}</td>
                <td className="p-3 text-slate-400">{exp.date}</td>
                <td className="p-3 text-slate-500">{exp.paymentMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
