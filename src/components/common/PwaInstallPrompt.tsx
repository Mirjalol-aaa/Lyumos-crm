import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share2, PlusSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode (already installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      return;
    }

    // Check if dismissed recently
    const dismissedAt = localStorage.getItem('lumos_pwa_dismissed');
    if (dismissedAt) {
      const hoursSince = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60);
      if (hoursSince < 24) {
        return;
      }
    }

    // Check iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If iOS and not standalone, show prompt after a gentle 5-second delay
    if (isIosDevice) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      setIsVisible(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setShowIosGuide(false);
    localStorage.setItem('lumos_pwa_dismissed', Date.now().toString());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex flex-col gap-3 rounded-2xl border border-blue-500/30 bg-slate-900/95 text-white p-4 shadow-2xl backdrop-blur-xl ring-1 ring-white/10">
        
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/30">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                <span>LUMOS Ilovasini O‘rnatish</span>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-black uppercase text-amber-400">
                  PWA
                </span>
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                Ilovani asosiy ekranga o‘rnating — brauzersiz, tezkor va qulay ishlaydi.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            title="Keyinroq"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* iOS Instruction accordion */}
        {showIosGuide && (
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 space-y-1.5">
            <p className="font-bold text-amber-400">Apple iOS Safari bo‘yicha qo‘llanma:</p>
            <p className="flex items-center gap-1.5">
              1. Safari pastki panelidagi <Share2 className="h-3.5 w-3.5 text-blue-400" /> (Ulashish) tugmasini bosing.
            </p>
            <p className="flex items-center gap-1.5">
              2. Menyuni pastga surib <PlusSquare className="h-3.5 w-3.5 text-emerald-400" /> "Bosh ekranga qo‘shish" (Add to Home Screen) ni tanlang.
            </p>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/80">
          <button
            type="button"
            onClick={handleDismiss}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Keyinroq
          </button>
          
          <button
            type="button"
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-xs font-bold text-white shadow-md shadow-blue-500/25 transition-all cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{isIos && !showIosGuide ? 'Qo‘llanma' : 'O‘rnatish'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
