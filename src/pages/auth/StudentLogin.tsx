import React, { useState, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import { InteractiveParticles } from '../../components/common/InteractiveParticles';
import { Eye, EyeOff, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft, Home, Sun, Moon } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

interface StudentLoginProps {
  onSwitchToAdmin: () => void;
  onBackToHome?: () => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({ onSwitchToAdmin, onBackToHome }) => {
  const { loginWithCredentials } = useLMS();
  const { settings, updateSettings } = useCRM();
  const [studentIdInput, setStudentIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "LUMOS LMS - O‘quvchilar Portali";
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!studentIdInput.trim() || !passwordInput.trim()) {
      setError('Iltimos, login va parolni kiriting.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = loginWithCredentials(studentIdInput, passwordInput, 'student');
      if (!res.success) {
        setError(res.message || 'Login yoki parol noto‘g‘ri kiritildi.');
        setIsLoading(false);
      }
    }, 250);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white dark:bg-slate-950 font-sans">
      {/* LEFT COLUMN: Student 3D / Isometric Graphic Illustration */}
      <div className="relative hidden lg:flex lg:w-1/2 min-h-screen bg-[#F7F7F4] dark:bg-slate-900 items-center justify-center p-12 border-r border-slate-200/60 dark:border-slate-800 overflow-hidden">
        {/* Top left return button */}
        <button
          type="button"
          onClick={() => {
            if (onBackToHome) onBackToHome();
            else window.location.hash = '#/';
          }}
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
              Uyga vazifalar, 100 ballik natijalar, guruh reytingi va dars videolarini kuzatib boring.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Clean Student Form matching Image 2 */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16 max-w-lg mx-auto w-full">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              if (onBackToHome) onBackToHome();
              else window.location.hash = '#/';
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
            title="LUMOS Asosiy saytiga qaytish"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-amber-500" />
            <span>Asosiy saytga qaytish</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
                updateSettings({ theme: nextTheme });
              }}
              className="flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:border-amber-400 dark:border-slate-800 dark:bg-slate-900 dark:text-amber-400 dark:hover:bg-slate-800 transition-all shadow-xs cursor-pointer"
              title={settings.theme === 'dark' ? "Yorug' rejim (Light Mode)" : "Qorong'i rejim (Dark Mode)"}
            >
              {settings.theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" />
              )}
            </button>

            <button
              type="button"
              onClick={onSwitchToAdmin}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Admin Portali</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Center Form */}
        <div className="my-auto py-8 space-y-6">
          <h1 className="text-4xl font-black tracking-tight text-slate-800 dark:text-white">
            Kirish
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Student ID / Login Input */}
            <div className="relative">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                Kirish (Student ID yoki Email):
              </label>
              <input
                type="text"
                required
                value={studentIdInput}
                onChange={(e) => setStudentIdInput(e.target.value)}
                placeholder="masalan: 25073 yoki ethan@lumos.uz"
                className="w-full rounded-xl border border-slate-200/90 bg-slate-50/60 px-4 py-3.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/15 dark:border-slate-800 dark:bg-slate-900 dark:focus:bg-slate-950 dark:text-white font-medium transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                Parol:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200/90 bg-slate-50/60 px-4 py-3.5 pr-11 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/15 dark:border-slate-800 dark:bg-slate-900 dark:focus:bg-slate-950 dark:text-white font-medium transition-all"
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
