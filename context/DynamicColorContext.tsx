"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
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
  // [advanced-use-latest / rerender-use-ref-transient-values] 추출 요청 번호를 ref로 관리
  // → state로 관리하면 매번 리렌더링이 발생하지만, ref는 값 변경 시 리렌더링 없이
  //   최신 요청 번호를 추적할 수 있음 (race condition 방지용 카운터)
  const extractionRef = useRef<number>(0);

  // [rerender-memo] theme 변경 시에만 applyColors 함수를 재생성
  // → theme을 의존성으로 가지므로, 다크/라이트 전환 시 색상 조정 로직이 갱신됨
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

  // [rerender-dependencies] theme 또는 rawColors가 바뀔 때 색상 재적용
  // → applyColors가 theme에 의존하므로, 테마 전환 시 기존 rawColors로 색상을 재계산하여
  //   다크/라이트 모드에서 항상 올바른 밝기로 색상이 표시됨
  useEffect(() => {
    if (rawColors) {
      applyColors(rawColors);
    }
  }, [theme, rawColors, applyColors]);

  // [rerender-memo] 색상 추출 함수는 의존성 없이 한 번만 생성
  // → extractionRef를 사용하므로 ref 값 접근 시 항상 최신 값을 읽을 수 있음
  const extractAndApplyColors = useCallback(async (imageUrl: string) => {
    // 요청 시작 시 카운터를 증가시켜 현재 요청 번호를 기록
    const currentExtraction = ++extractionRef.current;
    setIsExtracting(true);

    try {
      const colors = await extractColorsFromImage(imageUrl);

      // [async-parallel 응용] 비동기 완료 후 더 최신 요청이 있으면 결과를 무시
      // → 빠르게 여러 곡을 검색했을 때 이전 응답이 나중에 도착해도 덮어쓰지 않음 (race condition 방지)
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

  // [rerender-memo] 색상 초기화 함수도 의존성 없이 stable reference 유지
  const resetColors = useCallback(() => {
    setRawColors(null);
    const root = document.documentElement;

    root.style.removeProperty("--primary");
    root.style.removeProperty("--accent");
    root.style.removeProperty("--ring");
    root.style.removeProperty("--spotify");
    root.style.removeProperty("--spotify-rgb");
  }, []);

  // [rerender-memo] Context value를 useMemo로 메모이제이션
  // → isExtracting(state)이 바뀔 때만 새 객체 생성; 함수들은 stable reference를 유지하므로
  //   Context를 구독하는 컴포넌트가 extracting 상태 변화 시에만 리렌더링됨
  const value = useMemo(
    () => ({ extractAndApplyColors, resetColors, isExtracting }),
    [extractAndApplyColors, resetColors, isExtracting]
  );

  return (
    <DynamicColorContext.Provider value={value}>
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
