"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

interface AlbumBackgroundProps {
  imgURL: string | null;
}

// [rerender-memo] React.memo로 래핑하여 imgURL이 바뀔 때만 리렌더링
// → 부모(page.tsx)가 다른 state 변경으로 리렌더링되어도 배경 컴포넌트는 재실행되지 않음
export const AlbumBackground: React.FC<AlbumBackgroundProps> = React.memo(({ imgURL }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentImg, setCurrentImg] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    // [Effect Cleanup] cancelled 플래그로 언마운트 후 비동기 콜백의 setState 호출을 방지
    // → 이미지 로드 완료 전에 컴포넌트가 언마운트되면 "Can't perform state update on unmounted component" 경고 방지
    let cancelled = false;
    // clearTimeout을 위해 timeoutId를 클로저 외부에 선언
    let timeoutId: ReturnType<typeof setTimeout>;

    if (imgURL) {
      setIsLoaded(false);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (cancelled) return;
        setCurrentImg(imgURL);
        timeoutId = setTimeout(() => {
          if (!cancelled) setIsLoaded(true);
        }, 50);
      };
      img.src = imgURL;
    } else {
      setIsLoaded(false);
      timeoutId = setTimeout(() => {
        if (!cancelled) setCurrentImg(null);
      }, 500);
    }

    return () => {
      // cleanup: cancelled 플래그 설정 + 대기 중인 타이머 취소
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [imgURL]);

  if (!currentImg) return null;

  return (
    <div className="album-bg">
      {/* Blurred album image */}
      <img
        src={currentImg}
        alt=""
        className="album-bg-image"
        style={{ opacity: isLoaded ? 1 : 0 }}
      />

      {/* Adaptive overlay for readability */}
      <div
        className="album-bg-overlay"
        style={{
          background:
            theme === "light"
              ? "rgba(255, 255, 255, 0.65)"
              : "rgba(0, 0, 0, 0.55)",
        }}
      />
    </div>
  );
});

AlbumBackground.displayName = "AlbumBackground";
