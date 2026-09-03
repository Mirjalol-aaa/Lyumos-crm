import React, { createContext, useContext, useState } from 'react';
import { Language, translations, Translations } from './translations';

export interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  formatMoney: (amount: number, currency?: string) => string;
  formatDate: (dateInput: string | Date | number) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lumos_language') as Language;
      if (saved && (saved === 'uz' || saved === 'ru' || saved === 'en')) {
        return saved;
      }
    }
    return 'uz';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lumos_language', lang);
    }
  };

  const t = translations[language] || translations.uz;

  const formatMoney = (amount: number, currency: string = 'USD'): string => {
    const num = Math.round(amount);
    const formatted = new Intl.NumberFormat(
      language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US'
    ).format(num);

    if (currency === 'UZS' || currency === 'so‘m' || currency === 'som') {
      return `${formatted} so‘m`;
    }
    return `$${formatted}`;
  };

  const formatDate = (dateInput: string | Date | number): string => {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return String(dateInput);

    const locale = language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US';
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, formatMoney, formatDate }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    return {
      language: 'uz',
      setLanguage: () => {},
      t: translations.uz,
      formatMoney: (amt: number) => `$${amt.toLocaleString()}`,
      formatDate: (d: any) => new Date(d).toLocaleDateString(),
    };
  }
  return context;
};

export * from './translations';
