import React, { useState, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import { InteractiveParticles } from '../../components/common/InteractiveParticles';
import { Sparkles, Eye, EyeOff, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface AdminTeacherLoginProps {
  onSwitchToStudent: () => void;
}

export const AdminTeacherLogin: React.FC<AdminTeacherLoginProps> = ({ onSwitchToStudent }) => {
  const { loginWithCredentials } = useLMS();
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "LUMOS ERP - O‘quv Markazi Boshqaruvi";
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginInput.trim() || !passwordInput.trim()) {
      setError('Iltimos, login va parolni kiriting.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = loginWithCredentials(loginInput, passwordInput);
      if (!res.success) {
        setError(res.message || 'Login yoki parol noto‘g‘ri kiritildi.');
        setIsLoading(false);
      }
    }, 250);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white dark:bg-slate-950 font-sans">
      {/* LEFT COLUMN: Modern Education Center Reception Visual */}
      <div className="relative hidden lg:flex lg:w-1/2 min-h-screen bg-slate-900 overflow-hidden items-end p-12">
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
              Zamonaviy Kasblar Markazi
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
        {/* Top Branding */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500/20 via-yellow-500/10 to-amber-300/20 p-1.5 border border-amber-400/30 shadow-md shadow-amber-500/10">
              <img
                src="/lumos-logo.png"
                alt="LUMOS"
                className="h-full w-full object-contain filter drop-shadow-sm"
              />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                LUMOS
              </span>
              <span className="block text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
                Admin & Teacher Portal
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onSwitchToStudent}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Talaba Paneli</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
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
                className="w-full rounded-xl border border-slate-200/90 bg-white px-3.5 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white font-medium"
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
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Parolni kiriting"
                  className="w-full rounded-xl border border-slate-200/90 bg-white px-3.5 py-3 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white font-medium"
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
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Success!
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                <ShieldCheck className="h-3.5 w-3.5 text-orange-500" />
                <span>CLOUDFLARE</span>
                <span>• Privacy • Help</span>
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
              className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-3.5 text-xs font-bold transition-all shadow-md active:scale-[0.99] disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {isLoading ? 'Tekshirilmoqda...' : 'Kirish'}
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
