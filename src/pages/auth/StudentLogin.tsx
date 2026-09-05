import React, { useState, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import { InteractiveParticles } from '../../components/common/InteractiveParticles';
import { Eye, EyeOff, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

interface StudentLoginProps {
  onSwitchToAdmin: () => void;
  onBackToHome?: () => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({ onSwitchToAdmin, onBackToHome }) => {
  const { loginWithCredentials } = useLMS();
  const [studentIdInput, setStudentIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "LUMOS LMS - O‘quvchilar Portali";
  }, []);

  const handleBackToHome = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      window.location.hash = '#/home';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFastLogin = (loginVal: string, passVal: string) => {
    setStudentIdInput(loginVal);
    setPasswordInput(passVal);
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const res = loginWithCredentials(loginVal, passVal, 'student');
      if (!res.success) {
        setError(res.message || 'Login yoki parol noto‘g‘ri kiritildi.');
        setIsLoading(false);
      } else {
        setIsLoading(false);
        window.location.hash = '#/student';
      }
    }, 200);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!studentIdInput.trim()) {
      setError('Iltimos, login yoki student ID kiriting.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = loginWithCredentials(studentIdInput, passwordInput || 'student123', 'student');
      if (!res.success) {
        setError(res.message || 'Login yoki parol noto‘g‘ri kiritildi.');
        setIsLoading(false);
      } else {
        setIsLoading(false);
        window.location.hash = '#/student';
      }
    }, 200);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white dark:bg-slate-950 font-sans">
      {/* LEFT COLUMN: Student 3D / Isometric Graphic Illustration */}
      <div className="relative hidden lg:flex lg:w-1/2 min-h-screen bg-[#F7F7F4] dark:bg-slate-900 items-center justify-center p-12 border-r border-slate-200/60 dark:border-slate-800 overflow-hidden">
        {/* Top left return button (Desktop) */}
        <button
          type="button"
          onClick={handleBackToHome}
          className="absolute top-8 left-8 z-30 inline-flex items-center gap-2 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-white dark:hover:bg-slate-800 hover:border-amber-300 transition-all cursor-pointer border border-slate-200/80 dark:border-slate-700/80"
          title="LUMOS Asosiy saytiga qaytish"
        >
          <ArrowLeft className="h-4 w-4 text-amber-500" />
          <span>Bosh sahifaga qaytish</span>
        </button>

        {/* Interactive Antigravity Particles Effect */}
        <InteractiveParticles className="opacity-60" particleCount={110} />

        <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center space-y-6">
          {/* Custom SVG / 3D Composition for Student Portal */}
          <div className="relative w-80 h-80 flex items-center justify-center">
            {/* Background floating circles & gears */}
            <div className="absolute top-4 right-6 w-20 h-20 rounded-3xl bg-purple-200/60 dark:bg-purple-900/30 rotate-12 flex items-center justify-center animate-pulse">
              <span className="text-2xl">⚙️</span>
            </div>
            <div className="absolute bottom-6 left-6 w-16 h-16 rounded-2xl bg-emerald-200/60 dark:bg-emerald-900/30 -rotate-12 flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>

            {/* Central Student ID Card in 3D Isometric View */}
            <div className="relative z-10 w-56 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 p-5 text-white shadow-2xl shadow-orange-500/30 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest bg-black/20 px-2 py-0.5 rounded-full">
                  Student ID
                </span>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>

              {/* Avatar placeholder */}
              <div className="flex flex-col items-center space-y-2 my-2">
                <div className="w-14 h-14 rounded-full bg-white/20 p-1 flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-lg">
                    👨‍🎓
                  </div>
                </div>
                <div className="w-24 h-2.5 rounded-full bg-white/40" />
                <div className="w-16 h-2 rounded-full bg-white/20" />
              </div>

              <div className="mt-4 pt-3 border-t border-white/20 flex justify-between items-center text-[10px] font-bold">
                <span>LUMOS O‘QUV MARKAZI</span>
                <span>LEVEL 7</span>
              </div>
            </div>

            {/* Floating Password Pill */}
            <div className="absolute -top-2 left-2 z-20 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 px-4 py-2 text-xs font-black text-emerald-800 dark:text-emerald-300 shadow-lg border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5 -rotate-6">
              <span>🔑</span>
              <span>login: verified</span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-800 dark:text-white">
              Talabalar O‘quv Portali
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              Uyga vazifalar, 100 ballik natijalar, guruh reytingi va dars jadvallarini kuzatib boring.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Clean Student Form */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16 max-w-lg mx-auto w-full">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBackToHome}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
            title="LUMOS Asosiy saytiga qaytish"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-amber-500" />
            <span>Asosiy saytga qaytish</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSwitchToAdmin}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer bg-amber-50 dark:bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-200/60 dark:border-amber-800/60"
            >
              <span>Admin Portali</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Center Form */}
        <div className="my-auto py-8 space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">
              Talaba Kabineti
            </h1>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              O‘quvchi profilingizga kirish uchun login va parolni kiriting
            </p>
          </div>

          {/* Fast Login Chips */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
              Tezkor kirish (Namuna talabalar):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFastLogin('mushtariy', 'student123')}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 p-2 rounded-xl border border-amber-200/80 bg-amber-50/70 hover:bg-amber-100 text-amber-950 dark:bg-amber-950/30 dark:border-amber-800/60 dark:text-amber-300 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <span>👩‍🎓</span>
                <span>Mushtariy (Matematika)</span>
              </button>

              <button
                type="button"
                onClick={() => handleFastLogin('javohir', 'student123')}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 p-2 rounded-xl border border-blue-200/80 bg-blue-50/70 hover:bg-blue-100 text-blue-950 dark:bg-blue-950/30 dark:border-blue-800/60 dark:text-blue-300 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                <span>👨‍🎓</span>
                <span>Javohir (Ingliz tili)</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Student ID / Login Input */}
            <div className="relative">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                <span className="text-rose-500 font-bold">*</span> Login yoki Student ID:
              </label>
              <input
                type="text"
                required
                value={studentIdInput}
                onChange={(e) => setStudentIdInput(e.target.value)}
                placeholder="masalan: mushtariy yoki javohir"
                className="w-full rounded-xl border border-slate-200/90 bg-slate-50/60 px-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/15 dark:border-slate-800 dark:bg-slate-900 dark:focus:bg-slate-950 dark:text-white font-medium transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                <span className="text-rose-500 font-bold">*</span> Parol:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Parolni kiriting"
                  className="w-full rounded-xl border border-slate-200/90 bg-slate-50/60 px-4 py-3 pr-11 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/15 dark:border-slate-800 dark:bg-slate-900 dark:focus:bg-slate-950 dark:text-white font-medium transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Verification Badge */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 text-xs dark:border-slate-800 dark:bg-slate-900/60">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Xavfsizlik Tasdiqlandi
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
                <span>LUMOS LMS</span>
                <span>• Talaba Himoyasi</span>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
                {error}
              </div>
            )}

            {/* Golden Amber Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3.5 text-xs font-black tracking-tight transition-all duration-150 shadow-lg shadow-amber-500/25 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? 'Kirilmoqda...' : 'Kirish'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} Offline Student Panel • LUMOS LMS</p>
        </div>
      </div>
    </div>
  );
};
