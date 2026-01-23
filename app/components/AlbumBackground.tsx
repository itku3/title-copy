"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

interface AlbumBackgroundProps {
  imgURL: string | null;
}

export const AlbumBackground: React.FC<AlbumBackgroundProps> = ({ imgURL }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentImg, setCurrentImg] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (imgURL) {
      setIsLoaded(false);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        setCurrentImg(imgURL);
        setTimeout(() => setIsLoaded(true), 50);
      };
      img.src = imgURL;
    } else {
      setIsLoaded(false);
      setTimeout(() => setCurrentImg(null), 500);
    }
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
};
