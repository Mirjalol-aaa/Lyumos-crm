import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { useLMS } from '../../context/LMSContext';
import { HomeworkTask, HomeworkSubmission } from '../../types/lms';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  FileCheck2,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Award,
  Sparkles,
  ExternalLink,
  Sliders,
  ChevronRight,
  ChevronLeft,
  X,
  Send,
  Zap,
} from 'lucide-react';

export const TeacherHomeworkPage: React.FC = () => {
  const { groups, teachers } = useCRM();
  const {
    activeTeacherId,
    homeworkTasks,
    submissions,
    addHomeworkTask,
    gradeSubmission,
  } = useLMS();

  const currentTeacher = teachers.find(t => t.id === activeTeacherId) || teachers[0];
  const myGroups = groups.filter(g => g.teacherId === currentTeacher?.id);

  const [selectedGroupId, setSelectedGroupId] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'submissions' | 'tasks'>('submissions');

  // New Homework Task Modal State
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskGroupId, setNewTaskGroupId] = useState(myGroups[0]?.id || '');
  const [newTaskMaxScore, setNewTaskMaxScore] = useState(100);
  const [newTaskDeadline, setNewTaskDeadline] = useState('');

  // Fast-Grading Studio State
  const [gradingSubmission, setGradingSubmission] = useState<HomeworkSubmission | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(90);
  const [gradeFeedback, setGradeFeedback] = useState<string>('');
  const [isGrading, setIsGrading] = useState(false);

  // 1-Click Feedback Preset Templates
  const FEEDBACK_PRESETS = [
    '🎯 Ajoyib tahlil va to‘liq toza struktura! Hech qanday kamchilik yo‘q.',
    '💡 Vazifa yaxshi bajarilgan, lekin 2-qismdagi dalillarni kengaytirish kerak edi.',
    '⚡ Kod sintaksisi va mantiqiy qism juda toza, ammo unit testlar yozilmagan.',
    '⚠️ Asosiy talablar bajarilgan, lekin formatlash va xulosaga ko‘proq e’tibor bering.',
  ];

  // Submissions filtered
  const mySubmissions = submissions.filter(sub => {
    if (selectedGroupId !== 'all' && sub.groupId !== selectedGroupId) return false;
    return true;
  });

  const pendingSubmissions = mySubmissions.filter(s => s.status === 'pending');
  const gradedSubmissions = mySubmissions.filter(s => s.status === 'graded');

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    await addHomeworkTask({
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      groupId: newTaskGroupId,
      teacherId: currentTeacher?.id || 'TCH-1001',
      maxScore: newTaskMaxScore,
      deadline: newTaskDeadline || undefined,
    });

    setIsNewTaskModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
  };

  const handleOpenGradingStudio = (sub: HomeworkSubmission) => {
    setGradingSubmission(sub);
    setGradeScore(sub.score || 90);
    setGradeFeedback(sub.teacherFeedback || '');
  };

  const handleSaveGrade = async () => {
    if (!gradingSubmission) return;
    setIsGrading(true);

    try {
      await gradeSubmission(
        gradingSubmission.id,
        gradeScore,
        gradeFeedback.trim() || 'Vazifa qabul qilindi va tekshirildi.',
        currentTeacher?.fullName || 'Ustoz'
      );

      // Find next pending submission in line for rapid flow!
      const nextPending = pendingSubmissions.find(s => s.id !== gradingSubmission.id);
      if (nextPending) {
        setGradingSubmission(nextPending);
        setGradeScore(nextPending.score || 90);
        setGradeFeedback(nextPending.teacherFeedback || '');
      } else {
        setGradingSubmission(null);
      }
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-indigo-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              Fast-Grading Studio
            </span>
            <span className="text-xs text-slate-400">100 ballik baholash tizimi</span>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Uyga Vazifalar & 100 Ballik Baholash Studiyasi
          </h1>
          <p className="text-xs text-slate-500">
            O‘quvchilar yuborgan topshiriqlarni tezkor baholang, 1-bosishda tayyor izohlar qo‘ying va navbatdagi ishga avtomatik o‘ting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="indigo"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setIsNewTaskModalOpen(true)}
          >
            Yangi Vazifa Yaratish
          </Button>
        </div>
      </div>

      {/* Group Selector & Submissions Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('submissions')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'submissions'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            Tekshirilishi Kerak ({pendingSubmissions.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tasks')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === 'tasks'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            Mavjud Vazifalar ({homeworkTasks.length})
          </button>
        </div>

        {/* Group Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Guruh:</span>
          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="all">Barcha Guruhlarim</option>
            {myGroups.map(g => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TAB 1: SUBMISSIONS LIST */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          {pendingSubmissions.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-800 dark:text-white">
                Barcha topshiriqlar tekshirilgan!
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Hozirda yangi tekshirilmagan uyga vazifalar mavjud emas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {pendingSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex flex-col justify-between rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={sub.studentAvatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
                          alt={sub.studentName}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            {sub.studentName}
                          </h4>
                          <p className="text-[10px] text-slate-400">
                            {sub.groupName || 'Guruh'} • {new Date(sub.submittedAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      <Badge variant="warning" hasDot>
                        Tekshirilmoqda
                      </Badge>
                    </div>

                    <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800/60">
                      <p className="font-bold text-slate-700 dark:text-slate-300">
                        {sub.taskTitle || 'Uyga vazifa'}:
                      </p>
                      <p className="mt-1 italic text-slate-600 dark:text-slate-400">
                        "{sub.submissionText || 'Fayl biriktirilgan'}"
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400">
                      Maksimal: {sub.maxScore || 100} ball
                    </span>

                    <Button
                      size="sm"
                      variant="indigo"
                      leftIcon={<Zap className="h-3.5 w-3.5" />}
                      onClick={() => handleOpenGradingStudio(sub)}
                    >
                      Tezkor Baholash (100 ball)
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Graded Submissions History */}
          {gradedSubmissions.length > 0 && (
            <div className="mt-8 space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Yaqinda Baholangan Ishlar ({gradedSubmissions.length})
              </h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {gradedSubmissions.slice(0, 4).map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between rounded-xl bg-white p-3.5 border border-slate-100 shadow-xs dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {sub.studentName} ({sub.taskTitle})
                      </h4>
                      <p className="text-[10px] text-slate-400 italic">
                        "{sub.teacherFeedback}"
                      </p>
                    </div>

                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {sub.score} / 100 ball
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TASKS LIST */}
      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {homeworkTasks.map((task) => {
            const taskSubmissionsCount = submissions.filter(s => s.taskId === task.id).length;

            return (
              <Card key={task.id}>
                <CardHeader
                  title={task.title}
                  subtitle={`Guruh: ${task.groupName || 'Barcha'} • Max: ${task.maxScore} ball`}
                  action={<Badge variant="purple">{taskSubmissionsCount} topshiriq</Badge>}
                />
                <CardContent className="space-y-2">
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {task.description}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Muddat: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Muddatsiz'}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* FAST-GRADING STUDIO MODAL / DRAWER */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={gradingSubmission.studentAvatar || 'https://randomuser.me/api/portraits/men/1.jpg'}
                  alt={gradingSubmission.studentName}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {gradingSubmission.studentName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Vazifa: {gradingSubmission.taskTitle} • {gradingSubmission.groupName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setGradingSubmission(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Student answer view */}
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-xs dark:bg-slate-800/60">
              <p className="font-bold text-slate-700 dark:text-slate-300">
                Talaba Topsirgan Ish / Javob Matni:
              </p>
              <p className="mt-1 leading-relaxed text-slate-800 dark:text-slate-200">
                {gradingSubmission.submissionText || 'Fayl havolasi topshirilgan.'}
              </p>
            </div>

            {/* 100-Score Slider & Input */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Qo‘yiladigan Baho (0 — 100 ball):
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={gradeScore}
                    onChange={(e) => setGradeScore(Number(e.target.value))}
                    className="w-16 rounded-xl border border-indigo-300 px-2.5 py-1 text-center text-sm font-black text-indigo-600 dark:bg-slate-800 dark:text-indigo-400 focus:outline-none"
                  />
                  <span className="text-xs font-bold text-slate-400">/ 100</span>
                </div>
              </div>

              <input
                type="range"
                min={0}
                max={100}
                value={gradeScore}
                onChange={(e) => setGradeScore(Number(e.target.value))}
                className="h-2 w-full accent-indigo-600 rounded-lg cursor-pointer"
              />
            </div>

            {/* 1-Click Feedback Presets */}
            <div className="mt-4 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500">
                1-Bosishda Tayyor Izoh Shablonlari:
              </label>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {FEEDBACK_PRESETS.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setGradeFeedback(preset)}
                    className="rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-left text-[11px] text-slate-700 hover:border-indigo-400 hover:bg-indigo-50/30 transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Feedback Textarea */}
            <div className="mt-3">
              <textarea
                rows={3}
                placeholder="Ustozning shaxsiy fikri va xatolar tahlili..."
                value={gradeFeedback}
                onChange={(e) => setGradeFeedback(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Submit & Next Button */}
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <span className="text-xs text-slate-400">
                Qolgan ishlar: {pendingSubmissions.length} ta
              </span>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setGradingSubmission(null)}
                >
                  Bekor qilish
                </Button>

                <Button
                  variant="indigo"
                  isLoading={isGrading}
                  leftIcon={<Send className="h-4 w-4" />}
                  onClick={handleSaveGrade}
                >
                  Bahoni Saqlash & Keyingisiga O‘tish ⏭
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW TASK MODAL */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Yangi 100 Ballik Vazifa Berish
              </h3>
              <button
                type="button"
                onClick={() => setIsNewTaskModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Guruhni tanlang:
                </label>
                <select
                  value={newTaskGroupId}
                  onChange={(e) => setNewTaskGroupId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
                  Vazifa Sarlavhasi:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: IELTS Task 1 Graph Analysis"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Vazifa Tavsifi & Qo‘llanma:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="O‘quvchi bajarishi kerak bo‘lgan topshiriq mezonlari..."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Maksimal Ball:
                  </label>
                  <input
                    type="number"
                    value={newTaskMaxScore}
                    onChange={(e) => setNewTaskMaxScore(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Topshirish Muddati (Deadline):
                  </label>
                  <input
                    type="date"
                    value={newTaskDeadline}
                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsNewTaskModalOpen(false)}
                >
                  Bekor qilish
                </Button>
                <Button type="submit" variant="indigo">
                  Vazifani E’lon Qilish
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
