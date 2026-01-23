"use client";

import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { DynamicColorProvider } from "@/context/DynamicColorContext";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <DynamicColorProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </DynamicColorProvider>
    </ThemeProvider>
  );
}
