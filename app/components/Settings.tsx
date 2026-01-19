"use client";

import { Sun, Moon, Languages, Check } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { Locale } from "@/lib/i18n";
import { useState, useRef, useEffect } from "react";

const languages: { code: Locale; label: string; native: string }[] = [
  { code: "en", label: "English", native: "EN" },
  { code: "ko", label: "한국어", native: "KO" },
  { code: "ja", label: "日本語", native: "JA" },
];

export const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale } = useLanguage();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = languages.find((l) => l.code === locale);

  return (
    <div className="fixed top-5 right-5 flex items-center gap-3 z-50">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="relative p-3 rounded-xl neo-card overflow-hidden group transition-all duration-300 hover:glow-accent-sm"
        aria-label="Toggle theme"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative">
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-accent transition-transform duration-500 group-hover:rotate-180" />
          ) : (
            <Moon className="w-5 h-5 text-accent transition-transform duration-300 group-hover:rotate-[-20deg]" />
          )}
        </div>
      </button>

      {/* Language selector */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowLangMenu(!showLangMenu)}
          className="relative p-3 rounded-xl neo-card overflow-hidden group transition-all duration-300 hover:glow-accent-sm flex items-center gap-2.5"
          aria-label="Change language"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Languages className="relative w-5 h-5 text-accent" />
          <span className="relative text-sm font-semibold text-foreground tracking-wide">
            {currentLang?.native}
          </span>
        </button>

        {showLangMenu && (
          <div className="absolute right-0 mt-3 py-2 w-44 neo-card rounded-2xl shadow-2xl animate-scale-in origin-top-right overflow-hidden">
            {/* Header */}
            <div className="px-4 py-2 border-b border-border/30 mb-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Language
              </p>
            </div>

            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLocale(lang.code);
                  setShowLangMenu(false);
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
                  <span className="w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center text-xs font-bold">
                    {lang.native}
                  </span>
                  <span>{lang.label}</span>
                </span>
                {locale === lang.code && (
                  <Check className="w-4 h-4 text-accent" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
