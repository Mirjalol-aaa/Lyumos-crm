import React from 'react';
import {
  X,
  Clock,
  Calendar,
  CheckCircle2,
  Award,
  Users,
  Sparkles,
  BookOpen,
  Send,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Course } from '../../types/admin';
import { useI18n } from '../../lib/i18n';

interface CourseDetailsModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (courseTitle: string) => void;
}

export const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  course,
  isOpen,
  onClose,
  onEnroll,
}) => {
  const { formatMoney } = useI18n();

  if (!isOpen || !course) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200/90 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#080D1A] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-2">
            <span className="rounded-xl bg-amber-500/10 px-3 py-1 text-[11px] font-black uppercase text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {course.category}
            </span>
            <span className="text-xs text-slate-400">• {course.level}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            aria-label="Yopish"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 scrollbar-thin space-y-6">
          {/* Title & Description */}
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {course.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Davomiyligi</span>
              <p className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-500" />
                <span>{course.durationMonths} oy</span>
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Jami Darslar</span>
              <p className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span>{course.lessonsCount} soat</span>
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Ustoz</span>
              <p className="text-xs font-black text-amber-600 dark:text-amber-400 truncate">
                {course.instructor || 'Yetakchi mutaxassis'}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Oylik To‘lov</span>
              <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {formatMoney(course.pricePerMonth, 'UZS')}
              </p>
            </div>
          </div>

          {/* Dars Jadvali */}
          {course.schedule && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 text-xs">
              <Calendar className="h-5 w-5 text-amber-500 shrink-0" />
              <div>
                <span className="text-slate-500 dark:text-slate-400 block font-medium">Mashg‘ulotlar grafigi:</span>
                <span className="font-bold text-slate-900 dark:text-white">{course.schedule}</span>
              </div>
            </div>
          )}

          {/* O‘quv Dasturi (Syllabus) */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Kurs O‘quv Rejasi (Syllabus):
            </h4>
            <div className="space-y-2">
              {course.syllabus.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Kutilayotgan Natijalar (Outcomes) */}
          {course.outcomes && course.outcomes.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Kurs yakunida nimalarga erishasiz:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {course.outcomes.map((outcome, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 font-semibold"
                  >
                    <Award className="h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-200/80 px-6 py-4 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/60">
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase">To‘lov miqdori:</span>
            <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400 font-mono">
              {formatMoney(course.pricePerMonth, 'UZS')}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Yopish
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => {
                onClose();
                onEnroll(course.title);
              }}
              className="gap-2 font-bold px-6 shadow-md shadow-amber-500/20 cursor-pointer rounded-xl"
            >
              <Send className="h-4 w-4" />
              <span>Guruhga Yozilish</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
