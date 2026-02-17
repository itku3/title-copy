"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

interface AlbumBackgroundProps {
  imgURL: string | null;
}

export const AlbumBackground: React.FC<AlbumBackgroundProps> = React.memo(({ imgURL }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentImg, setCurrentImg] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    let cancelled = false;
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
