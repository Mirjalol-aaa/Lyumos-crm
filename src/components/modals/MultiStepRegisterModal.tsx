import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  User,
  Phone,
  BookOpen,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { Course } from '../../types/admin';
import { useCRM } from '../../context/CRMContext';
import { useI18n } from '../../lib/i18n';
import { fireCelebrationConfetti } from '../../services/paymentGatewayService';
import { sendTelegramMessage, formatLeadApplicationMessage } from '../../services/telegramService';
import { sendEskizSms } from '../../services/eskizSmsService';

interface MultiStepRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  initialCourseTitle?: string;
}

export const MultiStepRegisterModal: React.FC<MultiStepRegisterModalProps> = ({
  isOpen,
  onClose,
  courses,
  initialCourseTitle,
}) => {
  const { addStudent, settings } = useCRM();
  const { formatMoney } = useI18n();

  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 (');
  const [selectedCourse, setSelectedCourse] = useState<string>(initialCourseTitle || (courses[0]?.title || 'Matematika'));
  const [selectedSchedule, setSelectedSchedule] = useState('Ertalabki (09:00 - 11:00)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('+998')) {
      val = '+998 (';
    }
    const numbers = val.replace(/\D/g, '');
    let formatted = '+998';
    if (numbers.length > 3) formatted += ' (' + numbers.substring(3, 5);
    if (numbers.length >= 6) formatted += ') ' + numbers.substring(5, 8);
    if (numbers.length >= 9) formatted += '-' + numbers.substring(8, 10);
    if (numbers.length >= 11) formatted += '-' + numbers.substring(10, 12);
    setPhone(formatted.substring(0, 19));
  };

  const isStep1Valid = name.trim().length >= 3 && phone.length >= 18;

  const handleSubmitFinal = async () => {
    setIsSubmitting(true);
    try {
      addStudent({
        fullName: name.trim(),
        avatar: '',
        birthDate: '2008-01-01',
        gender: 'Male',
        phone: phone.trim(),
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@lumos.uz`,
        parentName: name.trim(),
        parentPhone: phone.trim(),
        groupId: 'GRP-01',
        groupName: `${selectedCourse} (Sinov)`,
        teacherId: 'TCH-01',
        teacherName: 'Katta Murabbiy',
        monthlyFee: 320000,
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0],
        notes: `Veb-sayt arizasi. Kurs: ${selectedCourse}. Vaqt: ${selectedSchedule}. Manzil: ${settings.address || 'Lumos Markaziy Kampus'}.`,
      });

      fireCelebrationConfetti();

      if (settings.telegramBotToken && settings.telegramChatId) {
        const telegramMsg = formatLeadApplicationMessage({
          fullName: name.trim(),
          phone: phone.trim(),
          subject: `${selectedCourse} (${selectedSchedule})`,
          source: 'LUMOS Onlayn Ro‘yxatdan O‘tish',
          centerName: settings.centerName,
        });
        sendTelegramMessage(settings.telegramBotToken, settings.telegramChatId, telegramMsg).catch(
          (err) => console.warn('Telegram send lead error:', err)
        );
      }

      if (settings.eskizToken || settings.eskizEmail) {
        sendEskizSms({
          phone: phone.trim(),
          message: `${settings.centerName || 'LUMOS'}: Hurmatli ${name.trim()}, sizning arizangiz qabul qilindi! Tez orada mutaxassisimiz bog'lanadi. Tel: ${settings.phone || '+998 71 200-00-25'}`,
          token: settings.eskizToken,
          email: settings.eskizEmail,
          password: settings.eskizPassword,
          from: settings.eskizFrom,
        }).catch((err) => console.warn('SMS send lead error:', err));
      }

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-[32px] bg-[#14080B] border border-[#D9A93A]/40 shadow-[0_25px_80px_rgba(0,0,0,0.95)] p-6 sm:p-8 space-y-6 text-left animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#D9A93A]/15 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D9A93A]/20 text-[#D9A93A]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-luxury-serif font-black text-[#F7F4EE]">
                LUMOS Akademiyasiga Ro‘yxatdan O‘tish
              </h3>
              <p className="text-[11px] text-[#A9A3A0]">
                {isSuccess
                  ? 'Ariza muvaffaqiyatli qabul qilindi'
                  : `Bosqich ${currentStep} / 4 — ${
                      currentStep === 1
                        ? 'Shaxsiy ma’lumotlar'
                        : currentStep === 2
                        ? 'Kursni tanlash'
                        : currentStep === 3
                        ? 'Qulay dars vaqti'
                        : 'Tasdiqlash va yuborish'
                    }`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#A9A3A0] hover:bg-white/10 hover:text-[#F7F4EE] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!isSuccess && (
          <div className="w-full bg-[#200F14] h-1.5 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-gradient-to-r from-[#D9A93A] via-[#F3D276] to-[#D9A93A] transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        )}

        {isSuccess ? (
          <div className="text-center py-6 space-y-4 animate-in fade-in">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 shadow-lg">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <div className="space-y-1">
              <h4 className="text-2xl font-luxury-serif font-black text-[#F7F4EE]">
                Arizangiz muvaffaqiyatli qabul qilindi!
              </h4>
              <p className="text-xs text-[#A9A3A0] max-w-sm mx-auto leading-relaxed">
                Hurmatli <span className="text-[#F3D276] font-bold">{name}</span>, administratorimiz tez orada siz bilan bog‘lanib, bepul sinov darsi vaqtini tasdiqlaydi.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1C0D11] border border-[#D9A93A]/25 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#A9A3A0]">Kurs:</span>
                <span className="font-bold text-[#F7F4EE]">{selectedCourse}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A9A3A0]">Dars vaqti:</span>
                <span className="font-bold text-[#F7F4EE]">{selectedSchedule}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A9A3A0]">Markaz manzili:</span>
                <span className="font-bold text-[#D9A93A]">{settings.address || 'Lumos Markaziy Kampus'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-full text-xs font-bold text-[#080607] bg-gradient-to-r from-[#D9A93A] via-[#F3D276] to-[#D9A93A] hover:brightness-110 shadow-lg shadow-[#D9A93A]/25 transition-all cursor-pointer"
            >
              Tushundim, rahmat!
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-xs font-bold text-[#A9A3A0] mb-1.5 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-[#D9A93A]" />
                    Ism va Familiyangiz *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masalan: Jasur Olimov"
                    className="w-full px-4 py-3 rounded-2xl bg-[#080607] border border-[#D9A93A]/30 text-xs text-[#F7F4EE] placeholder-[#A9A3A0]/50 focus:border-[#D9A93A] outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A9A3A0] mb-1.5 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-[#D9A93A]" />
                    Telefon raqamingiz *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="+998 (90) 123-45-67"
                    className="w-full px-4 py-3 rounded-2xl bg-[#080607] border border-[#D9A93A]/30 text-xs text-[#F7F4EE] font-mono placeholder-[#A9A3A0]/50 focus:border-[#D9A93A] outline-none transition-colors"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-[#1C0D11] border border-[#D9A93A]/20 flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#D9A93A] shrink-0" />
                  <p className="text-[11px] text-[#A9A3A0] leading-snug">
                    Sizning ma’lumotlaringiz xavfsiz va faqat o‘quv jarayonini tashkil etish uchun ishlatiladi.
                  </p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-3 animate-in fade-in max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                <span className="text-xs font-bold text-[#A9A3A0] block">
                  Qaysi yo‘nalish bo‘yicha o‘qishni xohlaysiz?
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {courses.map((c) => {
                    const isSelected = selectedCourse === c.title;
                    return (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCourse(c.title)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#2A1118] border-[#D9A93A] shadow-md shadow-[#D9A93A]/15'
                            : 'bg-[#1C0D11]/80 border-[#D9A93A]/20 hover:border-[#D9A93A]/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs font-black ${isSelected ? 'bg-[#D9A93A] text-[#080607]' : 'bg-[#080607] text-[#D9A93A]'}`}>
                            <BookOpen className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#F7F4EE]">{c.title}</h4>
                            <span className="text-[10px] text-[#A9A3A0]">{c.category} • {c.level}</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#F3D276] font-mono">
                          {formatMoney(c.pricePerMonth, 'UZS')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-3 animate-in fade-in">
                <span className="text-xs font-bold text-[#A9A3A0] block">
                  Darslarga qatnashish uchun qulay vaqt oralig‘ini belgilang:
                </span>
                {[
                  { label: 'Ertalabki guruh (09:00 - 11:00)', desc: 'Kunni samarali boshlash uchun ayni muddao' },
                  { label: 'Tushdan keyingi guruh (14:00 - 16:00)', desc: 'Maktab va darslardan keyin qulay vaqt' },
                  { label: 'Kechki intensiv (18:00 - 20:00)', desc: 'Talabalar va ishlovchilar uchun maxsus vaqt' },
                  { label: 'Weekend guruhi (Shanba - Yakshanba)', desc: 'Faqat dam olish kunlarida qizg‘in darslar' },
                ].map((item, idx) => {
                  const isSelected = selectedSchedule === item.label;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedSchedule(item.label)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#2A1118] border-[#D9A93A] shadow-md shadow-[#D9A93A]/15'
                          : 'bg-[#1C0D11]/80 border-[#D9A93A]/20 hover:border-[#D9A93A]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className={`h-4 w-4 ${isSelected ? 'text-[#F3D276]' : 'text-[#A9A3A0]'}`} />
                        <div>
                          <h4 className="text-xs font-bold text-[#F7F4EE]">{item.label}</h4>
                          <span className="text-[10px] text-[#A9A3A0]">{item.desc}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="p-4 rounded-2xl bg-[#1C0D11] border border-[#D9A93A]/35 space-y-3 text-xs">
                  <span className="text-[11px] font-black uppercase text-[#F3D276] block border-b border-white/5 pb-2">
                    Arizangiz Xulosasi
                  </span>
                  <div className="flex justify-between">
                    <span className="text-[#A9A3A0]">O‘quvchi:</span>
                    <span className="font-bold text-[#F7F4EE]">{name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A9A3A0]">Telefon:</span>
                    <span className="font-bold text-[#F7F4EE] font-mono">{phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A9A3A0]">Tanlangan kurs:</span>
                    <span className="font-bold text-[#F3D276]">{selectedCourse}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A9A3A0]">Dars vaqti:</span>
                    <span className="font-bold text-[#F7F4EE]">{selectedSchedule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A9A3A0]">Markaz manzili:</span>
                    <span className="font-bold text-[#D9A93A]">{settings.address || 'Lumos Markaziy Kampus'}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-[#D9A93A]/10 border border-[#D9A93A]/25 flex items-center gap-2.5 text-xs text-[#F3D276]">
                  <Award className="h-4 w-4 shrink-0" />
                  <span>Birinchi dars 100% BEPUL sinov darsi hisoblanadi.</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-[#D9A93A]/15">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                  className="px-4 py-2.5 rounded-full border border-[#D9A93A]/30 text-xs font-bold text-[#A9A3A0] hover:text-[#F7F4EE] hover:border-[#D9A93A] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Orqaga</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  disabled={currentStep === 1 && !isStep1Valid}
                  onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
                  className="px-6 py-2.5 rounded-full text-xs font-bold text-[#080607] bg-gradient-to-r from-[#D9A93A] via-[#F3D276] to-[#D9A93A] hover:brightness-110 shadow-md shadow-[#D9A93A]/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Davom etish</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmitFinal}
                  className="px-7 py-2.5 rounded-full text-xs font-bold text-[#080607] bg-gradient-to-r from-[#D9A93A] via-[#F3D276] to-[#D9A93A] hover:brightness-110 shadow-lg shadow-[#D9A93A]/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-3.5 w-3.5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                      <span>Yuborilmoqda...</span>
                    </>
                  ) : (
                    <>
                      <span>Arizani yuborish</span>
                      <Sparkles className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
