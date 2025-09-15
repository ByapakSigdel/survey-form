"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type AppLanguage = 'en' | 'np';
interface LanguageContextValue {
  lang: AppLanguage;
  setLang: (l: AppLanguage) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<AppLanguage>('en');
  const setLang = (l: AppLanguage) => {
    setLangState(l);
    try { localStorage.setItem('survey_lang', l); } catch {}
  };
  useEffect(() => {
    try {
      const stored = localStorage.getItem('survey_lang') as AppLanguage | null;
      if (stored === 'en' || stored === 'np') setLangState(stored);
    } catch {}
  }, []);
  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
