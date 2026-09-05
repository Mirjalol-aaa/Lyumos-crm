import React, { useState, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import { InteractiveParticles } from '../../components/common/InteractiveParticles';
import { Eye, EyeOff, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
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

  const handleFastLogin = (loginVal: string, passVal: string) => {
    setLoginInput(loginVal);
    setPasswordInput(passVal);
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const res = loginWithCredentials(loginVal, passVal, 'admin_teacher');
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginInput.trim()) {
      setError('Iltimos, loginni kiriting.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = loginWithCredentials(loginInput, passwordInput || '25073', 'admin_teacher');
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white dark:bg-slate-950 font-sans">
      {/* LEFT COLUMN: Modern Education Center Reception Visual */}
      <div className="relative hidden lg:flex lg:w-1/2 min-h-screen bg-slate-900 overflow-hidden items-end p-12">
        {/* Top left return button (Desktop) */}
        <button
          type="button"
          onClick={handleBackToHome}
          className="absolute top-8 left-8 z-30 inline-flex items-center gap-2 rounded-xl bg-slate-950/70 backdrop-blur-md px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-900 hover:border-amber-400/50 transition-all cursor-pointer border border-white/20"
          title="LUMOS Asosiy saytiga qaytish"
        >
          <ArrowLeft className="h-4 w-4 text-amber-400" />
          <span>Bosh sahifaga qaytish</span>
        </button>

        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600"
          alt="LUMOS Education Center"
          className="absolute inset-0 h-full w-full object-cover opacity-65 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

        {/* Dynamic Antigravity Interactive Particle Physics */}
        <InteractiveParticles className="opacity-70" particleCount={90} />

        {/* Center Reception Badge */}
        <div className="relative z-10 space-y-4 max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-500/20 px-3.5 py-1.5 backdrop-blur-md border border-amber-500/30">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-amber-300">
              Matematika va Ingliz Tili Markazi
            </span>
          </div>

          <h2 className="text-3xl font-black text-white tracking-tight leading-snug">
            LUMOS Boshqaruv & Ta’lim Platformasi
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Super Admin, filiallar menejmenti va o‘qituvchilar uchun yagona avtomatlashtirilgan ERP boshqaruv tizimi.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: White Clean Login Form */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16 max-w-xl mx-auto w-full">
        {/* Top Branding & Navigation */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBackToHome}
            className="flex items-center gap-3 cursor-pointer text-left group"
            title="LUMOS Asosiy saytiga qaytish"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500/20 via-yellow-500/10 to-amber-300/20 p-1.5 border border-amber-400/30 shadow-md shadow-amber-500/10 group-hover:scale-105 transition-transform">
              <img
                src={lumosLogo}
                alt="LUMOS"
                className="h-full w-full object-contain filter drop-shadow-sm"
              />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                LUMOS
              </span>
              <span className="block text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
                Admin & Teacher Portal
              </span>
            </div>
          </button>

          {/* Clean right header: NO theme toggle, NO duplicate "Bosh sahifa" button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSwitchToStudent}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1.5 cursor-pointer bg-blue-50 dark:bg-blue-950/40 px-3.5 py-2 rounded-xl border border-blue-200/60 dark:border-blue-800/60 transition-all shadow-xs"
            >
              <span>Talaba Paneli</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Center Form */}
        <div className="my-auto py-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Tizimga kirish
            </h1>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Boshqaruv markaziga kirish uchun login va parolingizni kiriting
            </p>
          </div>

          {/* Quick 1-Click Fast Login for Instant Entry */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                Tezkor kirish (1-klik):
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                To‘g‘ridan-to‘g‘ri kirish
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleFastLogin('Mirjalol', '25073')}
                disabled={isLoading}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-amber-200/90 bg-amber-50/70 hover:bg-amber-100 hover:border-amber-400 text-amber-950 dark:bg-amber-950/30 dark:border-amber-800/60 dark:text-amber-300 transition-all cursor-pointer shadow-xs active:scale-95 group text-center"
              >
                <span className="text-base group-hover:scale-110 transition-transform">👑</span>
                <span className="text-[11px] font-extrabold mt-0.5">Super Admin</span>
                <span className="text-[9px] text-amber-700/80 dark:text-amber-400/80 font-medium">Mirjalol</span>
              </button>

              <button
                type="button"
                onClick={() => handleFastLogin('hadicha', 'teacher123')}
                disabled={isLoading}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-emerald-200/90 bg-emerald-50/70 hover:bg-emerald-100 hover:border-emerald-400 text-emerald-950 dark:bg-emerald-950/30 dark:border-emerald-800/60 dark:text-emerald-300 transition-all cursor-pointer shadow-xs active:scale-95 group text-center"
              >
                <span className="text-base group-hover:scale-110 transition-transform">📐</span>
                <span className="text-[11px] font-extrabold mt-0.5">Hadicha ustoz</span>
                <span className="text-[9px] text-emerald-700/80 dark:text-emerald-400/80 font-medium">Matematika</span>
              </button>

              <button
                type="button"
                onClick={() => handleFastLogin('hasanboy', 'teacher123')}
                disabled={isLoading}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-blue-200/90 bg-blue-50/70 hover:bg-blue-100 hover:border-blue-400 text-blue-950 dark:bg-blue-950/30 dark:border-blue-800/60 dark:text-blue-300 transition-all cursor-pointer shadow-xs active:scale-95 group text-center"
              >
                <span className="text-base group-hover:scale-110 transition-transform">🇬🇧</span>
                <span className="text-[11px] font-extrabold mt-0.5">Hasanboy ustoz</span>
                <span className="text-[9px] text-blue-700/80 dark:text-blue-400/80 font-medium">Ingliz tili</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Login Field */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                <span className="text-rose-500 font-bold">*</span> Login
              </label>
              <input
                type="text"
                required
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                placeholder="Loginni kiriting"
                className="w-full rounded-xl border border-slate-200/90 bg-slate-50/60 px-3.5 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/15 dark:border-slate-800 dark:bg-slate-900 dark:focus:bg-slate-950 dark:text-white font-medium transition-all"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                <span className="text-rose-500 font-bold">*</span> Parol
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Parolni kiriting (Super Admin uchun ixtiyoriy)"
                  className="w-full rounded-xl border border-slate-200/90 bg-slate-50/60 px-3.5 py-3 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/15 dark:border-slate-800 dark:bg-slate-900 dark:focus:bg-slate-950 dark:text-white font-medium transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Cloudflare Style Verification Chip */}
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
                <span>LUMOS SHIELD</span>
                <span>• 256-bit SSL</span>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3.5 text-xs font-black tracking-tight transition-all duration-150 shadow-lg shadow-amber-500/25 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? 'Tekshirilmoqda...' : 'Tizimga Kirish'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} LUMOS ERP Education Management System</p>
        </div>
      </div>
    </div>
  );
};
