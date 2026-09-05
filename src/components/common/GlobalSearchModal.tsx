import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Search, X, User, GraduationCap, BookOpen, CreditCard, ArrowRight } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isGlobalSearchOpen, 
    setIsGlobalSearchOpen, 
    students, 
    teachers, 
    groups, 
    setSelectedStudentId,
    setSelectedTeacherId,
    setSelectedGroupId,
    setActivePage 
  } = useCRM();

  const [term, setTerm] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen(true);
      }
      if (e.key === 'Escape' && isGlobalSearchOpen) {
        setIsGlobalSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGlobalSearchOpen, setIsGlobalSearchOpen]);

  if (!isGlobalSearchOpen) return null;

  const matchedStudents = term.trim() ? students.filter(s => 
    s.fullName.toLowerCase().includes(term.toLowerCase()) || 
    s.id.toLowerCase().includes(term.toLowerCase()) ||
    s.phone.includes(term) ||
    s.groupName.toLowerCase().includes(term.toLowerCase())
  ).slice(0, 5) : students.slice(0, 3);

  const matchedTeachers = term.trim() ? teachers.filter(t => 
    t.fullName.toLowerCase().includes(term.toLowerCase()) || 
    t.subjects.some(sub => sub.toLowerCase().includes(term.toLowerCase()))
  ).slice(0, 3) : teachers.slice(0, 2);

  const matchedGroups = term.trim() ? groups.filter(g => 
    g.name.toLowerCase().includes(term.toLowerCase()) || 
    g.subject.toLowerCase().includes(term.toLowerCase())
  ).slice(0, 3) : groups.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-amber-500 shrink-0" />
          <input
            type="text"
            value={term}
            onChange={e => setTerm(e.target.value)}
            placeholder="O‘quvchi ismi, guruh, ustoz yoki telefon raqamini qidiring..."
            className="flex-1 bg-transparent text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {term && (
            <button onClick={() => setTerm('')} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={() => setIsGlobalSearchOpen(false)}
            className="px-2.5 py-1 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
          {/* Students */}
          {matchedStudents.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-500" /> O‘quvchilar ({matchedStudents.length})
                </span>
              </div>
              <div className="space-y-1">
                {matchedStudents.map(student => (
                  <button
                    key={student.id}
                    onClick={() => {
                      setSelectedStudentId(student.id);
                      setIsGlobalSearchOpen(false);
                      setActivePage('students_hub');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center text-xs">
                        {student.fullName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {student.fullName}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {student.phone} • {student.groupName}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-amber-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Teachers */}
          {matchedTeachers.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-500" /> O‘qituvchilar ({matchedTeachers.length})
                </span>
              </div>
              <div className="space-y-1">
                {matchedTeachers.map(teacher => (
                  <button
                    key={teacher.id}
                    onClick={() => {
                      setSelectedTeacherId(teacher.id);
                      setIsGlobalSearchOpen(false);
                      setActivePage('teachers_workload');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-xs">
                        {teacher.fullName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {teacher.fullName}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {teacher.subjects.join(', ')} • {teacher.studentsCount} nafar o‘quvchi
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-blue-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Groups */}
          {matchedGroups.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-500" /> Guruhlar ({matchedGroups.length})
                </span>
              </div>
              <div className="space-y-1">
                {matchedGroups.map(group => (
                  <button
                    key={group.id}
                    onClick={() => {
                      setSelectedGroupId(group.id);
                      setIsGlobalSearchOpen(false);
                      setActivePage('courses_groups');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-xs">
                        {group.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {group.name}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {group.teacherName} • {group.scheduleTime} • {group.room}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-emerald-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {matchedStudents.length === 0 && matchedTeachers.length === 0 && matchedGroups.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                "{term}" bo‘yicha hech qanday ma’lumot topilmadi
              </p>
              <p className="text-xs text-slate-400">
                Boshqa ism, guruh nomi yoki telefon raqami bilan qidirib ko‘ring
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center justify-between px-5">
          <span>Search across 150+ student records and center groups</span>
          <span className="font-semibold text-amber-500">LUMOS AI Search</span>
        </div>
      </div>
    </div>
  );
};
