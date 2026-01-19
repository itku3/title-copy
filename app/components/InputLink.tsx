"use client";
import React, { useState, useRef } from "react";
import { Search, Link2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface InputLinkProps {
  onFetchTitle: (url: string) => void;
}

export const InputLink: React.FC<InputLinkProps> = ({ onFetchTitle }) => {
  const [inputText, setInputText] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleSubmit = () => {
    if (!inputText.trim()) return;
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onFetchTitle(inputText);
    setInputText("");
  };

  const activeEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-lg my-10 animate-slide-up stagger-2">
      <div
        className={`
          relative flex items-center gap-2 p-2 rounded-2xl transition-all duration-400
          ${isFocused ? "neo-card glow-accent-sm" : "neo-card"}
        `}
      >
        {/* Animated border on focus */}
        <div
          className={`
            absolute inset-0 rounded-2xl transition-opacity duration-400 pointer-events-none
            ${isFocused ? "opacity-100" : "opacity-0"}
          `}
          style={{
            background: `linear-gradient(135deg, hsl(var(--accent) / 0.2) 0%, transparent 50%, hsl(var(--accent) / 0.1) 100%)`,
            padding: "1px",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        <div className="flex-1 flex items-center gap-3 px-4">
          <Link2
            className={`w-5 h-5 shrink-0 transition-all duration-300 ${
              isFocused ? "text-accent rotate-[-15deg]" : "text-muted-foreground"
            }`}
          />
          <input
            ref={inputRef}
            type="text"
            placeholder={t("placeholder")}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={activeEnter}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/60 py-3.5 text-base"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!inputText.trim()}
          className={`
            relative px-5 py-3.5 rounded-xl font-semibold flex items-center gap-2.5
            transition-all duration-300 overflow-hidden group
            ${inputText.trim()
              ? "btn-accent"
              : "bg-muted/50 text-muted-foreground cursor-not-allowed"
            }
          `}
        >
          <Search className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110" />
          <span className="hidden sm:inline">{t("search")}</span>
          <ArrowRight className={`
            w-4 h-4 shrink-0 transition-all duration-300
            ${inputText.trim() ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
            hidden sm:block
          `} />
        </button>
      </div>
    </div>
  );
};
