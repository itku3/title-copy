"use client";

import React from "react";
import { Sun, Moon, Languages, Check } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { Locale } from "@/lib/i18n";
import { useState, useRef, useEffect, useCallback, useId } from "react";

const languages: { code: Locale; label: string; native: string }[] = [
  { code: "en", label: "English", native: "EN" },
  { code: "ko", label: "한국어", native: "KO" },
  { code: "ja", label: "日本語", native: "JA" },
];

// [rerender-memo] React.memo로 래핑하여 테마/언어가 변경될 때만 리렌더링
// → props를 받지 않으므로 부모 리렌더링 시 항상 리렌더링되는 문제를 방지
export const Settings = React.memo(() => {
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    };

    // [client-passive-event-listeners] passive: true로 이벤트 리스너 등록
    document.addEventListener("mousedown", handleClickOutside, { passive: true });
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 메뉴 열릴 때 현재 선택된 항목 또는 첫 항목으로 포커스 이동
  useEffect(() => {
    if (showLangMenu) {
      const selected = menuRef.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]');
      const first = menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitemradio"]');
      (selected ?? first)?.focus();
    }
  }, [showLangMenu]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showLangMenu) return;
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') ?? []
    );
    const idx = items.indexOf(document.activeElement as HTMLButtonElement);

    if (e.key === "Escape") {
      setShowLangMenu(false);
      triggerRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(idx + 1) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(idx - 1 + items.length) % items.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focus();
    }
  }, [showLangMenu]);

  const currentLang = languages.find((l) => l.code === locale);

  return (
    <div className="fixed top-5 right-5 flex items-center gap-3 z-50">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="relative p-3 rounded-xl neo-card overflow-hidden group transition-all duration-300 hover:glow-accent-sm"
        aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative">
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-accent transition-transform duration-500 group-hover:rotate-180" aria-hidden="true" />
          ) : (
            <Moon className="w-5 h-5 text-accent transition-transform duration-300 group-hover:rotate-[-20deg]" aria-hidden="true" />
          )}
        </div>
      </button>

      {/* Language selector */}
      <div className="relative" ref={menuRef} onKeyDown={handleKeyDown}>
        <button
          ref={triggerRef}
          onClick={() => setShowLangMenu((v) => !v)}
          className="relative p-3 rounded-xl neo-card overflow-hidden group transition-all duration-300 hover:glow-accent-sm flex items-center gap-2.5"
          aria-label="언어 선택"
          aria-haspopup="true"
          aria-expanded={showLangMenu}
          aria-controls={menuId}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Languages className="relative w-5 h-5 text-accent" aria-hidden="true" />
          <span className="relative text-sm font-semibold text-foreground tracking-wide">
            {currentLang?.native}
          </span>
        </button>

        {showLangMenu && (
          <div
            id={menuId}
            role="menu"
            aria-label="언어 선택"
            className="absolute right-0 mt-3 py-2 w-44 neo-card rounded-2xl shadow-2xl animate-scale-in origin-top-right overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-2 border-b border-border/30 mb-1" aria-hidden="true">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Language
              </p>
            </div>

            {languages.map((lang) => (
              <button
                key={lang.code}
                role="menuitemradio"
                aria-checked={locale === lang.code}
                onClick={() => {
                  setLocale(lang.code);
                  setShowLangMenu(false);
                  triggerRef.current?.focus();
                }}
                className={`
                  w-full px-4 py-3 text-left text-sm transition-all duration-200
                  flex items-center justify-between gap-3
                  ${locale === lang.code
                    ? "text-accent bg-accent/10 font-medium"
                    : "text-foreground hover:bg-accent/5 hover:text-accent"
                  }
                `}
              >
                <span className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center text-xs font-bold" aria-hidden="true">
                    {lang.native}
                  </span>
                  <span>{lang.label}</span>
                </span>
                {locale === lang.code && (
                  <Check className="w-4 h-4 text-accent" aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

Settings.displayName = "Settings";
