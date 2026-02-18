"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getSystemTheme = (): Theme => {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("dark");
  const [isManual, setIsManual] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      setTheme(stored);
      setIsManual(true);
    } else {
      setTheme(getSystemTheme());
    }
  }, []);

  useEffect(() => {
    if (!mounted || isManual) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "light" : "dark");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mounted, isManual]);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    if (isManual) {
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted, isManual]);

  // [rerender-memo] useCallback으로 toggleTheme을 안정적인 참조로 유지
  // → 의존성이 없으므로 Provider가 리렌더링되어도 같은 함수 참조를 전달
  const toggleTheme = useCallback(() => {
    setIsManual(true);
    // [rerender-functional-setstate] 함수형 업데이트로 prev 기반 토글
    // → 현재 state를 의존성으로 캡처하지 않아도 되므로 useCallback 의존성 배열이 비어있어도 안전
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  // [rerender-memo] Context value를 useMemo로 메모이제이션
  // → theme이나 toggleTheme이 바뀔 때만 새 객체를 생성하여
  //   Context를 구독하는 모든 컴포넌트의 불필요한 리렌더링을 방지
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

const defaultContext: ThemeContextType = {
  theme: "dark",
  toggleTheme: () => {},
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  return context ?? defaultContext;
};
