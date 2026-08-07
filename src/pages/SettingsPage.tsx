import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { Settings, Building, Save, Globe, Moon, Sun, BellRing, DollarSign } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useCRM();

  const [centerName, setCenterName] = useState(settings.centerName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);
  const [currency, setCurrency] = useState(settings.currency);
  const [academicYear, setAcademicYear] = useState(settings.academicYear);
  const [enableSms, setEnableSms] = useState(settings.enableSmsNotifications);
  const [autoRemind, setAutoRemind] = useState(settings.autoRemindUnpaid);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      centerName,
      tagline,
      phone,
      email,
      address,
      currency,
      currencySymbol: currency === 'USD' ? '$' : currency === 'UZS' ? 'UZS ' : '€',
      academicYear,
      enableSmsNotifications: enableSms,
      autoRemindUnpaid: autoRemind
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            System Preferences & Center Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Customize branding, currency, academic periods, themes & automated notifications
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold animate-in fade-in">
          ✓ Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Education Center Info */}
        <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-[#007AFF]" /> Education Center Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Center Name</label>
              <input 
                type="text" 
                value={centerName}
                onChange={e => setCenterName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tagline</label>
              <input 
                type="text" 
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Contact Phone</label>
              <input 
                type="text" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Official Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Campus Address</label>
              <input 
                type="text" 
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Currency & Academic Year */}
        <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-500" /> Financial & Academic Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Primary Currency</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              >
                <option value="USD">USD ($)</option>
                <option value="UZS">UZS (So'm)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Academic Year Period</label>
              <input 
                type="text" 
                value={academicYear}
                onChange={e => setAcademicYear(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Automation & Notifications */}
        <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BellRing className="w-4 h-4 text-amber-500" /> Parent Notification Automations
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
              <span className="font-bold text-slate-800 dark:text-white">Enable Parent SMS Payment Notifications</span>
              <input 
                type="checkbox" 
                checked={enableSms} 
                onChange={e => setEnableSms(e.target.checked)} 
                className="w-5 h-5 accent-[#007AFF] rounded" 
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
              <span className="font-bold text-slate-800 dark:text-white">Auto-Send Fee Overdue Reminders on 5th of Month</span>
              <input 
                type="checkbox" 
                checked={autoRemind} 
                onChange={e => setAutoRemind(e.target.checked)} 
                className="w-5 h-5 accent-[#007AFF] rounded" 
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-2xl bg-[#007AFF] hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Preferences
        </button>
      </form>
    </div>
  );
};
