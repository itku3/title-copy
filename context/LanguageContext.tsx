"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Locale, detectLocale, translations, TranslationKey } from "@/lib/i18n";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("locale") as Locale | null;
    if (stored && ["en", "ko", "ja"].includes(stored)) {
      setLocaleState(stored);
    } else {
      setLocaleState(detectLocale());
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = locale;
  }, [locale, mounted]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  const t = (key: TranslationKey): string => {
    return translations[locale][key];
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

const defaultContext: LanguageContextType = {
  locale: "en",
  setLocale: () => {},
  t: (key: TranslationKey) => translations.en[key],
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  return context ?? defaultContext;
};
