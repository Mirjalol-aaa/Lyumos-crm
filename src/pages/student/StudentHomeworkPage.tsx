import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { useLMS } from '../../context/LMSContext';
import { HomeworkTask, HomeworkSubmission } from '../../types/lms';
import {
  FileCheck2,
  Clock,
  Award,
  Upload,
  CheckCircle2,
  MessageSquare,
  X,
  ExternalLink,
} from 'lucide-react';

export const StudentHomeworkPage: React.FC = () => {
  const { students } = useCRM();
  const { activeStudentId, homeworkTasks, submissions, submitHomework } = useLMS();

  const currentStudent = students.find(s => s.id === activeStudentId) || students[0];

  const [submittingTask, setSubmittingTask] = useState<HomeworkTask | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter tasks for student's group
  const myTasks = homeworkTasks.filter(
    t => t.groupId === currentStudent?.groupId || !t.groupId
  );

  const mySubmissionsMap = new Map<string, HomeworkSubmission>();
  submissions
    .filter(s => s.studentId === currentStudent?.id)
    .forEach(s => mySubmissionsMap.set(s.taskId, s));

  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingTask) return;

    setIsSubmitting(true);
    try {
      await submitHomework({
        taskId: submittingTask.id,
        studentId: currentStudent?.id || 'STU-1001',
        submissionText: submissionText.trim(),
        attachmentUrl: attachmentUrl.trim() || undefined,
      });

      setSubmittingTask(null);
      setSubmissionText('');
      setAttachmentUrl('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Uyga Vazifalar & 100 Ballik Baholar
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Berilgan vazifalarni o‘z vaqtida topshiring. Ustozingiz tekshirib 100 balldan baho va tahliliy izoh beradi.
        </p>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {myTasks.map((task) => {
          const submission = mySubmissionsMap.get(task.id);
          const isSubmitted = Boolean(submission);
          const isGraded = submission?.status === 'graded';

          return (
            <div
              key={task.id}
              className={`flex flex-col justify-between rounded-3xl border p-6 shadow-sm transition-all hover:shadow-md ${
                isGraded
                  ? 'border-emerald-200 bg-emerald-50/20 dark:border-emerald-950 dark:bg-emerald-950/10'
                  : isSubmitted
                  ? 'border-indigo-200 bg-indigo-50/20 dark:border-indigo-950 dark:bg-indigo-950/10'
                  : 'border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900'
              }`}
            >
              <div>
                {/* Header: Badges & Status */}
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Maksimal: {task.maxScore} ball
                  </span>

                  {isGraded ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <Award className="h-4 w-4" />
                      {submission?.score} / {task.maxScore} ball
                    </span>
                  ) : isSubmitted ? (
                    <span className="flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                      <Clock className="h-3.5 w-3.5" />
                      Topshirildi (Tekshirilmoqda)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                      <Clock className="h-3.5 w-3.5" />
                      Kutilmoqda
                    </span>
                  )}
                </div>

                {/* Task Title & Description */}
                <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
                  {task.title}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {task.description}
                </p>

                {task.attachmentUrl && (
                  <div className="mt-3">
                    <a
                      href={task.attachmentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline"
                    >
                      Topshiriq materialini ko‘rish
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}

                {/* If already submitted: show student's submission */}
                {isSubmitted && (
                  <div className="mt-4 rounded-2xl bg-white p-4 text-xs shadow-sm dark:bg-slate-800">
                    <p className="font-bold text-slate-700 dark:text-slate-300">
                      Siz topshirgan javob:
                    </p>
                    <p className="mt-1 text-slate-600 italic dark:text-slate-300">
                      "{submission?.submissionText || 'Fayl topshirilgan'}"
                    </p>
                  </div>
                )}

                {/* If graded: show teacher feedback */}
                {isGraded && submission?.teacherFeedback && (
                  <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-xs dark:border-emerald-900 dark:bg-emerald-950/30">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-300">
                      <MessageSquare className="h-4 w-4" />
                      <span>Ustoz Izohi & Xatolar Tahlili ({submission.gradedByName || 'Ustoz'}):</span>
                    </div>
                    <p className="mt-1 leading-relaxed text-slate-800 dark:text-slate-200">
                      {submission.teacherFeedback}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                <span className="text-[11px] text-slate-400">
                  {task.deadline ? `Muddat: ${new Date(task.deadline).toLocaleDateString()}` : 'Muddatsiz'}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setSubmittingTask(task);
                    setSubmissionText(submission?.submissionText || '');
                    setAttachmentUrl(submission?.attachmentUrl || '');
                  }}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold shadow-sm transition-all active:scale-95 ${
                    isSubmitted
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'
                      : 'bg-emerald-600 text-white shadow-emerald-600/20 hover:bg-emerald-700'
                  }`}
                >
                  <Upload className="h-3.5 w-3.5" />
                  {isSubmitted ? 'Javobni yangilash' : 'Vazifani Topshirish'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Homework Submission Modal */}
      {submittingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Uyga Vazifani Topshirish
                  </h3>
                  <p className="text-xs text-slate-400">
                    {submittingTask.title}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSubmittingTask(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitTask} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Sizning Javobingiz / Matn *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Yozma javobingiz, kod yoki matnni shu yerga kiriting..."
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Fayl / Google Drive / GitHub havolasi (ixtiyoriy)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... yoki github havolasi"
                  value={attachmentUrl}
                  onChange={(e) => setAttachmentUrl(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmittingTask(null)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Topshirilmoqda...' : 'Topshirish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
