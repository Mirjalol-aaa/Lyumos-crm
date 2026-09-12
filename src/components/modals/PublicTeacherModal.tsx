import React from 'react';
import { X, Star, Award, CheckCircle2, Clock, Calendar, GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';

interface PublicTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: {
    name: string;
    role: string;
    specialization: string;
    experience: string;
    rating: string;
    badge: string;
    bio: string;
    achievements: string[];
    scheduleDays: string;
    scheduleTime: string;
    symbol: string;
    gradient: string;
  } | null;
  onEnroll: (teacherName: string) => void;
}

export const PublicTeacherModal: React.FC<PublicTeacherModalProps> = ({
  isOpen,
  onClose,
  teacher,
  onEnroll,
}) => {
  if (!isOpen || !teacher) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-[32px] bg-[#14080B] border border-[#D9A93A]/40 shadow-[0_25px_80px_rgba(0,0,0,0.95)] p-6 sm:p-8 space-y-6 text-left animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-[#D9A93A]/15 pb-5">
          <div className="flex items-center gap-4">
            <div className={`flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl ${teacher.gradient} text-[#0B0808] font-luxury-serif font-black text-3xl shadow-xl shadow-[#D9A93A]/25 shrink-0`}>
              {teacher.symbol}
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#D9A93A]/15 border border-[#D9A93A]/30 text-[10px] font-black text-[#F3D276] uppercase tracking-wider">
                {teacher.badge}
              </span>
              <h3 className="text-2xl font-luxury-serif font-black text-[#F7F4EE] mt-1">
                {teacher.name}
              </h3>
              <p className="text-xs text-[#D9A93A] font-semibold mt-0.5">
                {teacher.role}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-[#A9A3A0] hover:text-[#F7F4EE] hover:bg-[#1C0D11] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-[#A9A3A0] leading-relaxed">
          {teacher.bio}
        </p>

        <div className="space-y-2">
          <span className="text-[11px] font-black text-[#F3D276] uppercase tracking-wider block">
            Yutuqlar & Pedagogik Ko‘rsatkichlar
          </span>
          <div className="space-y-1.5">
            {teacher.achievements.map((ach, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-[#F7F4EE]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#D9A93A] shrink-0" />
                <span>{ach}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#1C0D11] border border-[#D9A93A]/20 text-xs">
          <div>
            <span className="text-[10px] text-[#A9A3A0] uppercase block">Dars kunlari:</span>
            <span className="font-bold text-[#F7F4EE] flex items-center gap-1 mt-0.5">
              <Calendar className="h-3.5 w-3.5 text-[#D9A93A]" />
              {teacher.scheduleDays}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#A9A3A0] uppercase block">Dars vaqti:</span>
            <span className="font-bold text-[#F7F4EE] flex items-center gap-1 mt-0.5">
              <Clock className="h-3.5 w-3.5 text-[#D9A93A]" />
              {teacher.scheduleTime}
            </span>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              onEnroll(teacher.name);
              onClose();
            }}
            className="w-full gold-gradient-btn py-3.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg shadow-[#D9A93A]/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{teacher.name} guruhiga yozilish</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
