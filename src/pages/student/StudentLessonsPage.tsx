import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { useLMS } from '../../context/LMSContext';
import {
  PlayCircle,
  FileText,
  Calendar,
  ExternalLink,
  BookOpen,
  Video,
} from 'lucide-react';

export const StudentLessonsPage: React.FC = () => {
  const { students, groups } = useCRM();
  const { activeStudentId, lessons } = useLMS();

  const currentStudent = students.find(s => s.id === activeStudentId) || students[0];
  const myGroup = groups.find(g => g.id === currentStudent?.groupId);

  const myLessons = lessons.filter(l => l.groupId === currentStudent?.groupId);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Darslar & Video Yozuvlar
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {myGroup?.name || 'Guruh'} uchun o‘tilgan barcha darslar, video yozuvlari va dars materiallari.
        </p>
      </div>

      {myLessons.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <Video className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-white">
            Hozircha dars videolari yuklanmagan
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Ustozingiz dars o‘tgach, video yozuvi va materiallar shu yerda paydo bo‘ladi.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {myLessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 font-black text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  #{lesson.lessonNumber || index + 1}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {lesson.title}
                    </h3>
                    <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {lesson.date}
                    </span>
                  </div>

                  <p className="max-w-3xl text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {lesson.description || 'Dars tavsifi mavjud emas.'}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {lesson.videoUrl && (
                      <a
                        href={lesson.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-950/60 dark:text-red-400"
                      >
                        <PlayCircle className="h-4 w-4" />
                        Videoni ko‘rish (YouTube / Drive)
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}

                    {lesson.materialsUrl && (
                      <a
                        href={lesson.materialsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-400"
                      >
                        <FileText className="h-4 w-4" />
                        Dars Taqdimoti / Qo‘llanma
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
