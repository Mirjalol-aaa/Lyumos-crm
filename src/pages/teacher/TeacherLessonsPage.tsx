import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { useLMS } from '../../context/LMSContext';
import { Lesson } from '../../types/lms';
import {
  Video,
  Plus,
  Trash2,
  ExternalLink,
  Calendar,
  BookOpen,
  X,
  FileText,
  PlayCircle,
  Clock,
} from 'lucide-react';

export const TeacherLessonsPage: React.FC = () => {
  const { groups, teachers } = useCRM();
  const { activeTeacherId, lessons, addLesson, deleteLesson } = useLMS();

  const currentTeacher = teachers.find(t => t.id === activeTeacherId) || teachers[0];
  const myGroups = groups.filter(g => g.teacherId === currentTeacher?.id);

  const [selectedGroupId, setSelectedGroupId] = useState<string>(
    myGroups[0]?.id || groups[0]?.id || ''
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [materialsUrl, setMaterialsUrl] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentGroup = groups.find(g => g.id === selectedGroupId);
  const filteredLessons = lessons.filter(l => l.groupId === selectedGroupId);

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedGroupId) return;

    setIsSubmitting(true);
    try {
      await addLesson({
        groupId: selectedGroupId,
        groupName: currentGroup?.name,
        teacherId: currentTeacher?.id || 'TCH-101',
        teacherName: currentTeacher?.fullName,
        lessonNumber: filteredLessons.length + 1,
        title: title.trim(),
        description: description.trim(),
        videoUrl: videoUrl.trim() || undefined,
        materialsUrl: materialsUrl.trim() || undefined,
        date,
      });

      setTitle('');
      setDescription('');
      setVideoUrl('');
      setMaterialsUrl('');
      setIsAddModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Darslar & Video Darsliklar
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Dars o‘tib bo‘lgach, video yozuvini va dars materiallarini yuklang. O‘quvchilar buni o‘z kabinetlarida ko‘rishadi.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-700 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Yangi Dars Qo‘shish
        </button>
      </div>

      {/* Group Tabs Selector */}
      <div className="flex overflow-x-auto border-b border-slate-200 pb-2 scrollbar-none dark:border-slate-800">
        <div className="flex gap-2">
          {myGroups.map((group) => {
            const isSelected = selectedGroupId === group.id;
            const count = lessons.filter(l => l.groupId === group.id).length;

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => setSelectedGroupId(group.id)}
                className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>{group.name}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lessons Timeline List */}
      {filteredLessons.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <Video className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-white">
            Ushbu guruh uchun hali dars yuklanmagan
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            "Yangi Dars Qo‘shish" tugmasini bosib, birinchi dars mavzusi va videosini yuklang.
          </p>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Dars Qo‘shish
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredLessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900 md:flex-row md:items-start md:justify-between"
            >
              <div className="flex items-start gap-4">
                {/* Lesson number badge */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 font-black text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                  #{lesson.lessonNumber || index + 1}
                </div>

                <div className="space-y-1.5">
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

                  {/* Materials & Video link badges */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {lesson.videoUrl && (
                      <a
                        href={lesson.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-950/60 dark:text-red-400"
                      >
                        <PlayCircle className="h-3.5 w-3.5" />
                        Videoni ko‘rish (YouTube / Drive)
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}

                    {lesson.materialsUrl && (
                      <a
                        href={lesson.materialsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-400"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Dars Materiallari / Taqdimot
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="flex shrink-0 items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800 md:border-t-0 md:pt-0">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`"${lesson.title}" darsini o‘chirishni xohlaysizmi?`)) {
                      deleteLesson(lesson.id);
                    }
                  }}
                  className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50"
                  title="Darsni o‘chirish"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Lesson Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  <Video className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Yangi Dars Qo‘shish
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLesson} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Guruh
                </label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {myGroups.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Dars Mavzusi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: IELTS Writing Task 2 Kirish"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Dars Sanasi
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Dars Yozuvi / Video Havolasi (YouTube, Drive, Vimeo)
                </label>
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Dars Materiallari / Taqdimot havolasi
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... yoki fayl havolasi"
                  value={materialsUrl}
                  onChange={(e) => setMaterialsUrl(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Dars Haqida Qisqacha Izoh
                </label>
                <textarea
                  rows={3}
                  placeholder="Ushbu darsda o‘rganilgan asosiy tushunchalar..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saqlanmoqda...' : 'Darsni Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
