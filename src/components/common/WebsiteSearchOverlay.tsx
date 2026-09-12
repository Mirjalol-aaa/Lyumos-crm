import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Users, MapPin, HelpCircle, ArrowRight, CornerDownLeft } from 'lucide-react';
import { Course } from '../../types/admin';
import { Teacher } from '../../types/crm';

interface WebsiteSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  teachers: Teacher[];
  branches: Array<{ id: string; name: string; city: string; address: string; phone: string }>;
  faqList: Array<{ q: string; a: string; category?: string }>;
  onSelectCourse: (course: Course) => void;
  onSelectTeacher: (teacherName: string) => void;
  onSelectBranch: (branchName: string) => void;
}

export const WebsiteSearchOverlay: React.FC<WebsiteSearchOverlayProps> = ({
  isOpen,
  onClose,
  courses,
  teachers,
  branches,
  faqList,
  onSelectCourse,
  onSelectTeacher,
  onSelectBranch,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedCourses = q
    ? courses.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      ).slice(0, 4)
    : courses.slice(0, 3);

  const matchedTeachers = q
    ? teachers.filter(
        (t) =>
          t.fullName.toLowerCase().includes(q) ||
          (t.subjects && t.subjects.some((s) => s.toLowerCase().includes(q)))
      ).slice(0, 3)
    : teachers.slice(0, 2);

  const matchedBranches = q
    ? branches.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.city.toLowerCase().includes(q) ||
          b.address.toLowerCase().includes(q)
      ).slice(0, 3)
    : branches.slice(0, 2);

  const matchedFaq = q
    ? faqList.filter(
        (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-[#14080B] border border-[#D9A93A]/35 shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[80vh] text-left animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#D9A93A]/15 bg-[#1C0A10]/90">
          <Search className="h-5 w-5 text-[#D9A93A] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kurslar, ustozlar, filiallar yoki savollarni qidiring..."
            className="flex-1 bg-transparent border-none text-sm sm:text-base text-[#F7F4EE] placeholder-[#A9A3A0]/60 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-[#A9A3A0] hover:text-[#F7F4EE]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#080607] border border-[#D9A93A]/25 text-[10px] font-mono text-[#D9A93A]">
            ESC
          </span>
        </div>

        <div className="overflow-y-auto p-5 space-y-6 scrollbar-thin">
          {matchedCourses.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#D9A93A] flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                Kurslar ({matchedCourses.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedCourses.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onSelectCourse(c);
                      onClose();
                    }}
                    className="p-3 rounded-2xl bg-[#1C0D11]/80 hover:bg-[#2A1118] border border-[#D9A93A]/20 hover:border-[#D9A93A]/60 transition-all text-left flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-[#F7F4EE] group-hover:text-[#F3D276] transition-colors">
                        {c.title}
                      </h4>
                      <p className="text-[10px] text-[#A9A3A0]">{c.category} • {c.level}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-[#D9A93A] opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedTeachers.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#D9A93A] flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                Ustozlar ({matchedTeachers.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedTeachers.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      onSelectTeacher(t.fullName);
                      onClose();
                    }}
                    className="p-3 rounded-2xl bg-[#1C0D11]/80 hover:bg-[#2A1118] border border-[#D9A93A]/20 hover:border-[#D9A93A]/60 transition-all text-left flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-[#F7F4EE] group-hover:text-[#F3D276] transition-colors">
                        {t.fullName}
                      </h4>
                      <p className="text-[10px] text-[#A9A3A0]">{t.subjects?.join(', ') || 'Yetakchi mentor'}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-[#D9A93A] opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedBranches.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#D9A93A] flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                Filiallar ({matchedBranches.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedBranches.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      onSelectBranch(b.name);
                      onClose();
                    }}
                    className="p-3 rounded-2xl bg-[#1C0D11]/80 hover:bg-[#2A1118] border border-[#D9A93A]/20 hover:border-[#D9A93A]/60 transition-all text-left flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-[#F7F4EE] group-hover:text-[#F3D276] transition-colors">
                        {b.name}
                      </h4>
                      <p className="text-[10px] text-[#A9A3A0]">{b.city} • {b.address}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-[#D9A93A] opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedFaq.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#D9A93A] flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5" />
                Savollar ({matchedFaq.length})
              </span>
              <div className="space-y-2">
                {matchedFaq.map((f, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-[#1C0D11]/80 border border-[#D9A93A]/20 text-left">
                    <p className="text-xs font-bold text-[#F7F4EE]">{f.q}</p>
                    <p className="text-[11px] text-[#A9A3A0] mt-1 line-clamp-2">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {q && matchedCourses.length === 0 && matchedTeachers.length === 0 && matchedBranches.length === 0 && matchedFaq.length === 0 && (
            <div className="text-center py-8 space-y-2 text-[#A9A3A0]">
              <Search className="h-8 w-8 mx-auto text-[#D9A93A]/40" />
              <p className="text-xs font-semibold">"{query}" bo‘yicha hech narsa topilmadi.</p>
              <p className="text-[11px]">Boshqa kalit so‘z bilan sinab ko‘ring.</p>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-[#D9A93A]/15 bg-[#0B0507] flex items-center justify-between text-[11px] text-[#A9A3A0]">
          <span>Lumos Digital Education Search</span>
          <span className="flex items-center gap-1">
            <CornerDownLeft className="h-3 w-3 text-[#D9A93A]" /> Tanlash uchun bosing
          </span>
        </div>
      </div>
    </div>
  );
};
