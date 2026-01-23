"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { useTheme } from "./ThemeContext";
import {
  extractColorsFromImage,
  adjustColorForTheme,
  type ExtractedColors,
} from "@/lib/color-extractor";

interface DynamicColorContextType {
  extractAndApplyColors: (imageUrl: string) => Promise<void>;
  resetColors: () => void;
  isExtracting: boolean;
}

const DynamicColorContext = createContext<DynamicColorContextType | undefined>(
  undefined
);

export const DynamicColorProvider = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme();
  const [isExtracting, setIsExtracting] = useState(false);
  const [rawColors, setRawColors] = useState<ExtractedColors | null>(null);
  const extractionRef = useRef<number>(0);

  const applyColors = useCallback(
    (colors: ExtractedColors) => {
      const isDark = theme === "dark";
      const adjusted = adjustColorForTheme(colors.hsl, isDark);
      const root = document.documentElement;

      root.style.setProperty("--primary", `${adjusted.h} ${adjusted.s}% ${adjusted.l}%`);
      root.style.setProperty("--accent", `${adjusted.h} ${adjusted.s}% ${adjusted.l}%`);
      root.style.setProperty("--ring", `${adjusted.h} ${adjusted.s}% ${adjusted.l}%`);
      root.style.setProperty("--spotify", `${adjusted.h} ${adjusted.s}% ${adjusted.l}%`);
      root.style.setProperty(
        "--spotify-rgb",
        `${colors.rgb.r}, ${colors.rgb.g}, ${colors.rgb.b}`
      );
    },
    [theme]
  );

  useEffect(() => {
    if (rawColors) {
      applyColors(rawColors);
    }
  }, [theme, rawColors, applyColors]);

  const extractAndApplyColors = useCallback(async (imageUrl: string) => {
    const currentExtraction = ++extractionRef.current;
    setIsExtracting(true);

    try {
      const colors = await extractColorsFromImage(imageUrl);

      if (currentExtraction !== extractionRef.current) {
        return;
      }

      if (colors) {
        setRawColors(colors);
      }
    } finally {
      if (currentExtraction === extractionRef.current) {
        setIsExtracting(false);
      }
    }
  }, []);

  const resetColors = useCallback(() => {
    setRawColors(null);
    const root = document.documentElement;

    root.style.removeProperty("--primary");
    root.style.removeProperty("--accent");
    root.style.removeProperty("--ring");
    root.style.removeProperty("--spotify");
    root.style.removeProperty("--spotify-rgb");
  }, []);

  return (
    <DynamicColorContext.Provider
      value={{ extractAndApplyColors, resetColors, isExtracting }}
    >
      {children}
    </DynamicColorContext.Provider>
  );
};

const defaultContext: DynamicColorContextType = {
  extractAndApplyColors: async () => {},
  resetColors: () => {},
  isExtracting: false,
};

export const useDynamicColor = () => {
  const context = useContext(DynamicColorContext);
  return context ?? defaultContext;
};
