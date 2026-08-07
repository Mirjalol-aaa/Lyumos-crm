import React, { useState, useMemo } from 'react';
import { useCRM } from '../context/CRMContext';
import { 
  Search, Filter, Plus, UserCheck, DollarSign, 
  Trash2, Eye, LayoutGrid, List, CheckCircle2, Clock, AlertCircle 
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
    settings 
  } = useCRM();

  const [term, setTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesTerm = 
        s.fullName.toLowerCase().includes(term.toLowerCase()) ||
        s.id.toLowerCase().includes(term.toLowerCase()) ||
        s.phone.includes(term) ||
        s.parentName.toLowerCase().includes(term.toLowerCase());

      const matchesGroup = selectedGroup === 'ALL' || s.groupId === selectedGroup;
      const matchesStatus = selectedStatus === 'ALL' || s.status === selectedStatus;

      return matchesTerm && matchesGroup && matchesStatus;
    });
  }, [students, term, selectedGroup, selectedStatus]);

  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">Active</span>;
      case 'Frozen':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">Frozen</span>;
      case 'Trial':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Trial</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">Graduated</span>;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Students Directory ({filteredStudents.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage student profiles, parent details, group assignments & fee records
          </p>
        </div>

        <button
          onClick={() => setIsAddStudentModalOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-[#007AFF] hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Student
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={term}
            onChange={e => { setTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search student name, ID, phone, or parent..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedGroup}
              onChange={e => { setSelectedGroup(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Groups ({groups.length})</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <select
              value={selectedStatus}
              onChange={e => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Frozen">Frozen</option>
              <option value="Trial">Trial</option>
              <option value="Graduated">Graduated</option>
            </select>
          </div>

          {/* Table / Grid Toggle */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-slate-900 text-[#007AFF] shadow-xs' : 'text-slate-400'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-[#007AFF] shadow-xs' : 'text-slate-400'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content View */}
      {viewMode === 'table' ? (
        <div className="p-2 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200/60 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Student</th>
                  <th className="p-3.5">Group & Teacher</th>
                  <th className="p-3.5">Parent Contact</th>
                  <th className="p-3.5">Fee / Mo</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">August Fee</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedStudents.map(student => {
                  const aug = student.payments['August'] || { status: 'Unpaid' };
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img src={student.avatar} alt={student.fullName} className="w-9 h-9 rounded-full object-cover shrink-0" />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">{student.fullName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{student.id} • {student.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-900 dark:text-white block">{student.groupName}</span>
                        <span className="text-slate-400 text-[11px]">{student.teacherName}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-medium text-slate-800 dark:text-slate-200 block">{student.parentName}</span>
                        <span className="text-slate-400 text-[11px]">{student.parentPhone}</span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                        {settings.currencySymbol}{student.monthlyFee}
                      </td>
                      <td className="p-3.5">{getStatusBadge(student.status)}</td>
                      <td className="p-3.5">
                        {aug.status === 'Paid' || aug.status === 'Discount' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Paid
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Unpaid
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => {
                            setPaymentModalDefaultStudentId(student.id);
                            setIsReceivePaymentModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                          title="Receive Payment"
                        >
                          <DollarSign className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedStudentId(student.id)}
                          className="p-1.5 rounded-lg text-[#007AFF] hover:bg-blue-50 dark:hover:bg-blue-950/50"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete ${student.fullName}?`)) deleteStudent(student.id);
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedStudents.map(student => (
            <div key={student.id} className="p-5 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img src={student.avatar} alt={student.fullName} className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-[#007AFF]/20" />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{student.fullName}</h3>
                    <p className="text-xs text-[#007AFF] font-medium">{student.groupName}</p>
                  </div>
                </div>
                {getStatusBadge(student.status)}
              </div>

              <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 border-t border-b border-slate-100 dark:border-slate-800 py-3">
                <div className="flex justify-between">
                  <span>Parent:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{student.parentName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{student.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Fee:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{settings.currencySymbol}{student.monthlyFee}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedStudentId(student.id)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold text-xs text-[#007AFF] text-center"
                >
                  View Profile
                </button>
                <button
                  onClick={() => {
                    setPaymentModalDefaultStudentId(student.id);
                    setIsReceivePaymentModalOpen(true);
                  }}
                  className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                >
                  Pay
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      <div className="flex items-center justify-between p-4 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs">
        <span className="text-slate-500">
          Showing <span className="font-bold text-slate-900 dark:text-white">{(currentPage - 1) * pageSize + 1}</span> - <span className="font-bold text-slate-900 dark:text-white">{Math.min(currentPage * pageSize, filteredStudents.length)}</span> of {filteredStudents.length} students
        </span>

        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
          >
            Prev
          </button>
          <span className="px-3 py-1 font-bold text-[#007AFF]">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
