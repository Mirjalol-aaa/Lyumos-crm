import React, { useState, useEffect } from 'react';
import { useLMS } from '../../context/LMSContext';
import { InteractiveParticles } from '../../components/common/InteractiveParticles';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import lumosLogo from '../../assets/lumos-logo.png';

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
    document.documentElement.classList.add('dark');
    return () => {
      const saved = localStorage.getItem('lumos_theme') || 'light';
      if (saved !== 'dark') {
        document.documentElement.classList.remove('dark');
      }
    };
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
      } else {
        setIsLoading(false);
        window.location.hash = '#/student';
      }
    }, 200);
  };

  return (
    <div className="dark min-h-screen w-full flex flex-col lg:flex-row bg-[#070C18] font-sans antialiased text-slate-100 selection:bg-amber-500 selection:text-white">
      {/* LEFT COLUMN: Student 3D / Isometric Graphic Illustration */}
      <div className="relative hidden lg:flex lg:w-1/2 min-h-screen bg-[#050811] items-center justify-center p-12 border-r border-slate-800/80 overflow-hidden">
        {/* Interactive Antigravity Particles Effect */}
        <InteractiveParticles className="opacity-60" particleCount={110} />

        <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center space-y-6">
          {/* Custom SVG / 3D Composition for Student Portal */}
          <div className="relative w-80 h-80 flex items-center justify-center">
            {/* Background floating circles & gears */}
            <div className="absolute top-4 right-6 w-20 h-20 rounded-3xl bg-purple-900/40 rotate-12 flex items-center justify-center animate-pulse border border-purple-800/50">
              <span className="text-2xl">⚙️</span>
            </div>
            <div className="absolute bottom-6 left-6 w-16 h-16 rounded-2xl bg-emerald-900/40 -rotate-12 flex items-center justify-center border border-emerald-800/50">
              <span className="text-2xl">🔒</span>
            </div>

            {/* Central Student ID Card in 3D Isometric View */}
            <div className="relative z-10 w-56 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-500 p-5 text-white shadow-2xl shadow-orange-500/30 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest bg-black/30 px-2 py-0.5 rounded-full">
                  Student ID
                </span>
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-sm" />
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
            <div className="absolute -top-2 left-2 z-20 rounded-2xl bg-emerald-950 px-4 py-2 text-xs font-black text-emerald-300 shadow-lg border border-emerald-700 flex items-center gap-1.5 -rotate-6">
              <span>🔑</span>
              <span>login: verified</span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-black text-white">
              Talabalar O‘quv Portali
            </h3>
            <p className="text-xs text-slate-400 max-w-xs font-medium">
              Uyga vazifalar, 100 ballik natijalar, guruh reytingi va dars jadvallarini kuzatib boring.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Clean Student Form */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-10 lg:p-16 max-w-lg mx-auto w-full bg-[#070C18]">
        {/* Top Navigation Bar: Brand Logo acts as Home link */}
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleBackToHome}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer text-left group select-none min-w-0"
            title="LUMOS Asosiy saytiga qaytish"
          >
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-500/20 via-yellow-500/10 to-amber-300/20 p-1.5 sm:p-2 border border-amber-400/40 shadow-md shadow-amber-500/10 group-hover:scale-105 transition-transform">
              <img
                src={lumosLogo}
                alt="LUMOS"
                className="h-full w-full object-contain filter drop-shadow-sm"
              />
            </div>
            <div className="min-w-0">
              <span className="text-lg sm:text-xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors font-serif block">
                LUMOS
              </span>
              <span className="block text-[9px] sm:text-[11px] uppercase tracking-wider text-amber-400 font-extrabold truncate max-w-[130px] xs:max-w-none">
                Talabalar Portali
              </span>
            </div>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onSwitchToAdmin}
              className="text-[11px] sm:text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 sm:gap-1.5 cursor-pointer bg-amber-950/60 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-amber-800/80 hover:border-amber-700 transition-all shadow-xs"
            >
              <span>Admin Portali</span>
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>
          </div>
        </div>

        {/* Center Form */}
        <div className="my-auto py-6 sm:py-8 space-y-5 sm:space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-[11px] font-bold text-slate-300 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span>O‘quvchi Shaxsiy Kabineti</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Talaba Kabineti
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 font-medium">
              O‘quvchi profilingizga kirish uchun login va parolni kiriting
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Student ID / Login Input */}
            <div>
              <label className="text-xs font-bold text-slate-200 block mb-1.5">
                <span className="text-rose-400 font-black">*</span> Login yoki Student ID
              </label>
              <input
                type="text"
                required
                value={studentIdInput}
                onChange={(e) => setStudentIdInput(e.target.value)}
                placeholder="Student logini (masalan: mushtariy)"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:bg-slate-900 focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/20 font-medium transition-all shadow-xs"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="text-xs font-bold text-slate-200 block mb-1.5">
                <span className="text-rose-400 font-black">*</span> Parol
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Parolingizni kiriting"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3.5 pr-11 text-sm text-white placeholder:text-slate-500 focus:bg-slate-900 focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/20 font-medium transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-rose-800 bg-rose-950/70 p-3.5 text-xs font-bold text-rose-200 shadow-sm animate-shake">
                <span className="text-sm">⚠️</span>
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Golden Amber Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 py-3.5 text-sm font-black tracking-tight transition-all duration-150 shadow-lg shadow-amber-500/25 active:scale-[0.99] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Tekshirilmoqda...</span>
                </span>
              ) : (
                <span>Kirish</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} LUMOS LMS • O‘quvchilar Portali</p>
        </div>
      </div>
    </div>
  );
};
