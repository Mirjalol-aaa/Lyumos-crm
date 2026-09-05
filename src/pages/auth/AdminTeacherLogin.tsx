import React, { useState, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import { InteractiveParticles } from '../../components/common/InteractiveParticles';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import lumosLogo from '../../assets/lumos-logo.png';

interface AdminTeacherLoginProps {
  onSwitchToStudent: () => void;
  onBackToHome?: () => void;
}

export const AdminTeacherLogin: React.FC<AdminTeacherLoginProps> = ({ onSwitchToStudent, onBackToHome }) => {
  const { loginWithCredentials } = useLMS();
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "LUMOS ERP - O‘quv Markazi Boshqaruvi";
  }, []);

  const handleBackToHome = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      window.location.hash = '#/home';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginInput.trim() || !passwordInput.trim()) {
      setError('Iltimos, login va parolni kiriting.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = loginWithCredentials(loginInput, passwordInput, 'admin_teacher');
      if (!res.success) {
        setError(res.message || 'Login yoki parol noto‘g‘ri kiritildi.');
        setIsLoading(false);
      } else {
        setIsLoading(false);
        if (res.role === 'teacher') {
          window.location.hash = '#/teacher';
        } else {
          window.location.hash = '#/dashboard';
        }
      }
    }, 200);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8FAFC] dark:bg-[#070C18] font-sans antialiased text-slate-900 dark:text-slate-100 transition-colors">
      {/* LEFT COLUMN: Modern Education Center Reception Visual */}
      <div className="relative hidden lg:flex lg:w-1/2 min-h-screen bg-slate-950 overflow-hidden items-end p-12">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600"
          alt="LUMOS Education Center"
          className="absolute inset-0 h-full w-full object-cover opacity-60 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070C18] via-[#070C18]/60 to-transparent" />

        {/* Dynamic Antigravity Interactive Particle Physics */}
        <InteractiveParticles className="opacity-75" particleCount={90} />

        {/* Center Reception Badge */}
        <div className="relative z-10 space-y-4 max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-500/15 px-3.5 py-1.5 backdrop-blur-md border border-amber-400/30 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300">
              Matematika va Ingliz Tili Markazi
            </span>
          </div>

          <h2 className="text-3xl font-black text-white tracking-tight leading-snug">
            LUMOS Boshqaruv & Ta’lim Platformasi
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Super Admin, filiallar menejmenti va o‘qituvchilar uchun yagona avtomatlashtirilgan ERP boshqaruv tizimi.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Clean Login Form */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16 max-w-xl mx-auto w-full">
        {/* Top Branding & Navigation */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBackToHome}
            className="flex items-center gap-3 cursor-pointer text-left group"
            title="LUMOS Asosiy saytiga qaytish"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500/20 via-yellow-500/10 to-amber-300/20 p-2 border border-amber-400/40 shadow-md shadow-amber-500/10 group-hover:scale-105 transition-transform">
              <img
                src={lumosLogo}
                alt="LUMOS"
                className="h-full w-full object-contain filter drop-shadow-sm"
              />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                LUMOS
              </span>
              <span className="block text-[11px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-extrabold">
                Admin & O‘qituvchilar Portali
              </span>
            </div>
          </button>

          {/* Clean right header: Switch to student */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSwitchToStudent}
              className="text-xs font-bold text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200 flex items-center gap-1.5 cursor-pointer bg-blue-50 dark:bg-blue-950/70 px-3.5 py-2 rounded-xl border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all shadow-xs"
            >
              <span>Talaba Paneli</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Center Form */}
        <div className="my-auto py-8 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Xavfsiz Tizimga Kirish</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Tizimga kirish
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
              Boshqaruv markaziga kirish uchun login va parolingizni kiriting
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Login Field */}
            <div>
              <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1.5">
                <span className="text-rose-500 font-black">*</span> Login
              </label>
              <input
                type="text"
                required
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder="Loginni kiriting"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-amber-500 dark:focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/15 font-medium transition-all shadow-xs"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1.5">
                <span className="text-rose-500 font-black">*</span> Parol
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Parolni kiriting"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3.5 pr-11 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-amber-500 dark:focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/15 font-medium transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/70 p-3.5 text-xs font-bold text-rose-800 dark:text-rose-200 shadow-sm animate-shake">
                <span className="text-sm">⚠️</span>
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 py-3.5 text-sm font-black tracking-tight transition-all duration-150 shadow-lg shadow-amber-500/25 active:scale-[0.99] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Tekshirilmoqda...</span>
                </span>
              ) : (
                <span>Tizimga Kirish</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} LUMOS ERP Education Management System</p>
        </div>
      </div>
    </div>
  );
};
