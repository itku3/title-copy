"use client";

import { Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { Locale } from "@/lib/i18n";
import { useState, useRef, useEffect } from "react";

const languages: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "EN" },
  { code: "ko", label: "한국어", flag: "KO" },
  { code: "ja", label: "日本語", flag: "JA" },
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
    <div className="fixed top-4 right-4 flex items-center gap-2 z-50">
      <button
        onClick={toggleTheme}
        className="relative p-2.5 rounded-xl glass overflow-hidden group transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Toggle theme"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-spotify/20 to-spotify/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {theme === "dark" ? (
          <Sun className="relative w-5 h-5 text-spotify group-hover:rotate-90 transition-transform duration-500" />
        ) : (
          <Moon className="relative w-5 h-5 text-spotify group-hover:-rotate-12 transition-transform duration-300" />
        )}
      </button>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowLangMenu(!showLangMenu)}
          className="relative p-2.5 rounded-xl glass overflow-hidden group transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
          aria-label="Change language"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-spotify/20 to-spotify/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Globe className="relative w-5 h-5 text-spotify" />
          <span className="relative text-sm font-semibold text-foreground">
            {currentLang?.flag}
          </span>
        </button>

        {showLangMenu && (
          <div className="absolute right-0 mt-2 py-2 w-36 glass rounded-xl shadow-xl animate-scale-in origin-top-right overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLocale(lang.code);
                  setShowLangMenu(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-200 flex items-center justify-between
                  ${
                    locale === lang.code
                      ? "text-spotify bg-spotify/15 font-semibold"
                      : "text-foreground hover:bg-spotify/10 hover:text-spotify"
                  }`}
              >
                <span>{lang.label}</span>
                <span className="text-xs opacity-70">{lang.flag}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
