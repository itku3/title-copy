"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from "react";
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

  // [rerender-memo] setLocale은 의존성이 없으므로 한 번만 생성
  // → locale 변경 핸들러를 안정적인 참조로 유지
  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  }, []);

  // [rerender-memo] 번역 함수 t를 locale에 의존하여 메모이제이션
  // → locale이 바뀔 때만 새 함수 생성; 이 함수가 Context value에 포함되므로
  //   useMemo의 의존성 배열에도 추가되어야 함
  const t = useCallback((key: TranslationKey): string => {
    return translations[locale][key];
  }, [locale]);

  // [rerender-memo] Context value를 useMemo로 메모이제이션
  // → locale, setLocale, t 중 하나라도 바뀔 때만 새 객체 생성
  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <LanguageContext.Provider value={value}>
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
