import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Phone,
  User,
  MapPin,
  Clock,
  Award,
  BookOpen,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useCRM } from '../../context/CRMContext';
import { INITIAL_BRANCHES } from '../../data/branchesData';
import { fireCelebrationConfetti } from '../../services/paymentGatewayService';
import { sendTelegramMessage, formatLeadApplicationMessage } from '../../services/telegramService';
import { sendEskizSms } from '../../services/eskizSmsService';

interface DiagnosticTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Track = 'math' | 'english' | 'it';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
}

const QUESTIONS_BY_TRACK: Record<Track, Question[]> = {
  math: [
    {
      id: 1,
      text: 'Agar 2x + 7 = 19 bo‘lsa, x ning qiymati nechaga teng?',
      options: ['4', '6', '8', '12'],
      correctIndex: 1,
    },
    {
      id: 2,
      text: 'Har qanday uchburchakning ichki burchaklari yig‘indisi nechaga teng?',
      options: ['90°', '180°', '270°', '360°'],
      correctIndex: 1,
    },
    {
      id: 3,
      text: 'Arifmetik progressiyada a₁ = 3 va d = 4 bo‘lsa, a₅ ni hisoblang:',
      options: ['15', '19', '21', '23'],
      correctIndex: 1,
    },
  ],
  english: [
    {
      id: 1,
      text: 'Choose the grammatically correct sentence:',
      options: [
        'She don’t like coffee in the morning.',
        'She doesn’t likes coffee in the morning.',
        'She doesn’t like coffee in the morning.',
        'She not likes coffee in the morning.',
      ],
      correctIndex: 2,
    },
    {
      id: 2,
      text: 'If I had known about the lesson earlier, I ______ you.',
      options: ['would tell', 'will tell', 'would have told', 'told'],
      correctIndex: 2,
    },
    {
      id: 3,
      text: 'Which word is the closest in meaning to "meticulous"?',
      options: ['careless', 'thorough and precise', 'slow and lazy', 'loud'],
      correctIndex: 1,
    },
    ],
  it: [
    {
      id: 1,
      text: 'HTML da asosiy sahifa eng katta sarlavhasi qaysi teg bilan yoziladi?',
      options: ['<p>', '<h6>', '<h1>', '<div>'],
      correctIndex: 2,
    },
    {
      id: 2,
      text: 'CSS da elementlarni yonma-yon joylashtirish va moslashuvchan qilish uchun nima ishlatiladi?',
      options: ['display: flex', 'float: none', 'position: static', 'text-align: center'],
      correctIndex: 0,
    },
    {
      id: 3,
      text: 'JavaScript da o‘zgarmas qiymatli o‘zgaruvchi qaysi kalit so‘z bilan e’lon qilinadi?',
      options: ['var', 'let', 'const', 'function'],
      correctIndex: 2,
    },
  ],
};

export const DiagnosticTestModal: React.FC<DiagnosticTestModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { settings, addStudent } = useCRM();

  // Multi-step flow: 1: Track -> 2: Quiz -> 3: Contact Info -> 4: Result & Recommendation
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedTrack, setSelectedTrack] = useState<Track>('math');
  const [answers, setAnswers] = useState<number[]>([-1, -1, -1]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // User contact details
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(INITIAL_BRANCHES[0].name);
  const [preferredTime, setPreferredTime] = useState('14:00 - 16:00 (Tushdan keyin)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentQuestions = QUESTIONS_BY_TRACK[selectedTrack];

  const handleSelectAnswer = (optIndex: number) => {
    const updated = [...answers];
    updated[currentQuestionIndex] = optIndex;
    setAnswers(updated);
  };

  const calculateScore = () => {
    let score = 0;
    currentQuestions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const getRecommendation = () => {
    const score = calculateScore();
    if (selectedTrack === 'math') {
      if (score >= 2) {
        return {
          level: 'Yuqori (Olimpiada & DTM)',
          course: 'Matematika (Hadicha ustoz — Chuqurlashtirilgan)',
          group: 'GRP-01',
          teacher: 'Hadicha ustoz',
          advice: 'Sizda mantiqiy asoslar mustahkam! DTM va olimpiada darajasidagi murakkab masalalarga tayyorsiz.',
        };
      }
      return {
        level: 'Boshlang‘ich / Qayta mustahkamlash',
        course: 'Matematika (Hadicha ustoz — Asosiy guruh)',
        group: 'GRP-01',
        teacher: 'Hadicha ustoz',
        advice: 'Arifmetika va formulalar bilan ishlash bo‘yicha poydevor darslarimiz sizga tezda 100% natija beradi.',
      };
    } else if (selectedTrack === 'english') {
      if (score >= 2) {
        return {
          level: 'B2 Upper-Intermediate',
          course: 'IELTS Intensive 7.5+ (Hasanboy ustoz)',
          group: 'GRP-02',
          teacher: 'Hasanboy ustoz',
          advice: 'Grammatika va so‘z boyligingiz ajoyib! Sizga IELTS Band 7.5+ intensiv guruhimiz to‘liq mos keladi.',
        };
      }
      return {
        level: 'A2 / B1 Pre-Intermediate',
        course: 'Ingliz Tili General (Hasanboy ustoz)',
        group: 'GRP-02',
        teacher: 'Hasanboy ustoz',
        advice: 'Nutq va ravonlikni rivojlantirish uchun Hasanboy ustozning General English guruhida qatnashishni tavsiya qilamiz.',
      };
    } else {
      return {
        level: score >= 2 ? 'Junior Frontend' : 'Boshlang‘ich IT',
        course: 'Frontend & IT Asoslari',
        group: 'GRP-01',
        teacher: 'Mirjalol Rustamov',
        advice: 'Amaliy kompyuter darslarimiz bilan 6 oyda haqiqiy loyihalar yaratishni boshlaysiz.',
      };
    }
  };

  const handlePhoneChange = (val: string) => {
    // Format to +998 (XX) XXX-XX-XX
    let cleaned = val.replace(/\D/g, '');
    if (!cleaned.startsWith('998')) {
      cleaned = '998' + cleaned;
    }
    cleaned = cleaned.slice(0, 12);

    let formatted = '+998';
    if (cleaned.length > 3) formatted += ' (' + cleaned.substring(3, 5);
    if (cleaned.length >= 5) formatted += ') ' + cleaned.substring(5, 8);
    if (cleaned.length >= 8) formatted += '-' + cleaned.substring(8, 10);
    if (cleaned.length >= 10) formatted += '-' + cleaned.substring(10, 12);

    setPhone(formatted);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || phone.length < 18) return;

    setIsSubmitting(true);
    const rec = getRecommendation();

    try {
      // 1. Add student to CRM database
      addStudent({
        fullName: fullName.trim(),
        avatar: '',
        birthDate: '2008-01-01',
        gender: 'Male',
        phone: phone.trim(),
        email: `${fullName.toLowerCase().replace(/\s+/g, '.')}@lumos.uz`,
        parentName: fullName.trim(),
        parentPhone: phone.trim(),
        groupId: rec.group,
        groupName: rec.course,
        teacherId: rec.group === 'GRP-01' ? 'TCH-01' : 'TCH-02',
        teacherName: rec.teacher,
        monthlyFee: 250000,
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0],
        notes: `Diagnostik test: ${selectedTrack.toUpperCase()} (${calculateScore()}/3 ball). Daraja: ${rec.level}. Filial: ${selectedBranch}. Vaqt: ${preferredTime}`,
      });

      // 2. Telegram Lead Notification
      if (settings.telegramBotToken && settings.telegramChatId) {
        const leadText = formatLeadApplicationMessage({
          fullName: fullName.trim(),
          phone: phone.trim(),
          subject: `${rec.course} [Test natijasi: ${calculateScore()}/3 ball]`,
          source: `LUMOS Diagnostik Test (${selectedBranch})`,
          centerName: settings.centerName,
        });
        sendTelegramMessage(settings.telegramBotToken, settings.telegramChatId, leadText).catch(
          (err) => console.warn('Telegram lead error:', err)
        );
      }

      // 3. Eskiz SMS
      if (settings.eskizToken || settings.eskizEmail) {
        sendEskizSms({
          phone: phone.trim(),
          message: `${settings.centerName}: Hurmatli ${fullName.trim()}! Sizning diagnostik test natijangiz qabul qilindi (${rec.level}). Mutaxassis tez orada siz bilan bog'lanadi. Tel: ${settings.phone}`,
          token: settings.eskizToken,
          email: settings.eskizEmail,
          password: settings.eskizPassword,
          from: settings.eskizFrom,
        }).catch((err) => console.warn('SMS error:', err));
      }

      fireCelebrationConfetti();
      setStep(4);
    } catch (err) {
      console.error('Diagnostic submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setAnswers([-1, -1, -1]);
    setCurrentQuestionIndex(0);
    setFullName('');
    setPhone('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200/90 bg-white shadow-2xl dark:border-slate-800 dark:bg-[#080D1A] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Darajangizni Aniqlang (Diagnostik Test)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Bosqich {step} / 4 • 2 daqiqada bilim darajangizni va mos guruhni toping
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            aria-label="Yopish"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 scrollbar-thin">
          {/* STEP 1: TRACK SELECTION */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  Qaysi yo‘nalish bo‘yicha bilimingizni sinamoqchisiz?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Yo‘nalishni tanlang va 3 ta tezkor diagnostik savolga javob bering
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {[
                  {
                    id: 'math' as Track,
                    title: 'Matematika',
                    subtitle: 'DTM, Mantiq & Olimpiada',
                    icon: '∑',
                    color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/30 text-amber-500',
                  },
                  {
                    id: 'english' as Track,
                    title: 'Ingliz Tili',
                    subtitle: 'General English & IELTS',
                    icon: 'EN',
                    color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-500',
                  },
                  {
                    id: 'it' as Track,
                    title: 'IT & Dasturlash',
                    subtitle: 'Frontend & Web asoslari',
                    icon: '</>',
                    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-500',
                  },
                ].map((track) => {
                  const isSelected = selectedTrack === track.id;
                  return (
                    <div
                      key={track.id}
                      onClick={() => setSelectedTrack(track.id)}
                      className={`group relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all cursor-pointer text-center select-none ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                          : 'border-slate-200/90 dark:border-slate-800 hover:border-amber-400/50 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                      }`}
                    >
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr ${track.color} border font-mono font-black text-xl mb-3 group-hover:scale-110 transition-transform`}
                      >
                        {track.icon}
                      </div>
                      <h5 className="font-black text-sm text-slate-900 dark:text-white">
                        {track.title}
                      </h5>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        {track.subtitle}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle2 className="h-4 w-4 text-amber-500" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setAnswers([-1, -1, -1]);
                    setCurrentQuestionIndex(0);
                    setStep(2);
                  }}
                  className="gap-2 font-bold px-7 rounded-xl shadow-md shadow-amber-500/20"
                >
                  <span>Savollarga o‘tish</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: QUIZ QUESTIONS */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span>Savol {currentQuestionIndex + 1} / {currentQuestions.length}</span>
                  <span>{Math.round(((currentQuestionIndex + 1) / currentQuestions.length) * 100)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Question card */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 space-y-4">
                <div className="flex items-start gap-2.5">
                  <HelpCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug">
                    {currentQuestions[currentQuestionIndex].text}
                  </h4>
                </div>

                <div className="space-y-2.5 pt-1">
                  {currentQuestions[currentQuestionIndex].options.map((option, optIdx) => {
                    const isSelected = answers[currentQuestionIndex] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectAnswer(optIdx)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold shadow-xs'
                            : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-amber-400/50 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-mono font-black ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{option}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-amber-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (currentQuestionIndex > 0) {
                      setCurrentQuestionIndex(currentQuestionIndex - 1);
                    } else {
                      setStep(1);
                    }
                  }}
                  className="gap-1 text-xs"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Orqaga</span>
                </Button>

                {currentQuestionIndex < currentQuestions.length - 1 ? (
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={answers[currentQuestionIndex] === -1}
                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                    className="gap-2 font-bold px-5"
                  >
                    <span>Keyingi savol</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={answers[currentQuestionIndex] === -1}
                    onClick={() => setStep(3)}
                    className="gap-2 font-bold px-6 shadow-md shadow-amber-500/20"
                  >
                    <span>Natijani ko‘rish</span>
                    <Sparkles className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: CONTACT FORM */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  Test yakunlandi! Natijangizni qabul qiling:
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Mos guruhni aniqlash va bepul sinov darsiga yozilish uchun ma'lumotlaringizni kiriting
                </p>
              </div>

              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ism va Familiyangiz *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Masalan: Sardor Aliyev"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Telefon raqamingiz *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="+998 (90) 123-45-67"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-mono font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Sizga qulay filial
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <select
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                      >
                        {INITIAL_BRANCHES.map((b) => (
                          <option key={b.id} value={b.name}>
                            {b.name} ({b.city})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Qulay dars vaqti
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <select
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                      >
                        <option value="10:00 - 12:00 (Ertalabki)">10:00 - 12:00 (Ertalabki)</option>
                        <option value="14:00 - 16:00 (Tushdan keyin)">14:00 - 16:00 (Tushdan keyin)</option>
                        <option value="16:30 - 18:30 (Kechki)">16:30 - 18:30 (Kechki)</option>
                        <option value="18:30 - 20:30 (Intensiv)">18:30 - 20:30 (Intensiv)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setStep(2)}
                    className="gap-1 text-xs"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Savollarga qaytish</span>
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={isSubmitting || !fullName.trim() || phone.length < 18}
                    className="gap-2 font-bold px-7 shadow-lg shadow-amber-500/25 cursor-pointer rounded-xl"
                  >
                    {isSubmitting ? (
                      <span>Hisoblanmoqda...</span>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Natijani Chiqarish</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 4: RESULT & RECOMMENDATION */}
          {step === 4 && (
            <div className="text-center space-y-6 py-2 animate-in zoom-in-95 duration-200">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-xl shadow-amber-500/20">
                <Award className="h-8 w-8" />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  🎉 Ajoyib Natija!
                </span>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                  Sizning darajangiz: {getRecommendation().level}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Siz 3 ta savoldan {calculateScore()} tasiga to‘g‘ri javob berdingiz ({Math.round((calculateScore() / 3) * 100)}%).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-left space-y-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
                  <BookOpen className="h-4 w-4" />
                  <span>Siz uchun tavsiya etilgan ta’lim dasturi:</span>
                </div>
                <h5 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {getRecommendation().course}
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {getRecommendation().advice}
                </p>
                <div className="pt-2 border-t border-amber-500/20 flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span>Mas’ul ustoz: <strong>{getRecommendation().teacher}</strong></span>
                  <span>Filial: <strong>{selectedBranch}</strong></span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                ✓ Sizning ma’lumotlaringiz qabul qilindi. 1-bepul sinov darsi vaqti bo‘yicha ma’muriyatimiz tez orada sizga qo‘ng‘iroq qiladi!
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleReset}
                  className="w-full justify-center font-black py-3 rounded-xl shadow-md shadow-amber-500/20"
                >
                  Tushunarli, rahmat!
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
