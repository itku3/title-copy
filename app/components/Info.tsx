"use client";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";
import { Copy, Music, User, Sparkles } from "lucide-react";
import { copyToClipboard } from "@/lib/clipboard";
import { useLanguage } from "@/context/LanguageContext";

interface InfoProps {
  title: string;
  artist: string;
  imgURL: string;
}

export const Info: React.FC<InfoProps> = ({ title, artist, imgURL }) => {
  const info = `${title} - ${artist}`;
  const { t } = useLanguage();

  const handleCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.success(`${label} ${t("copied")}`, {
        description: text,
      });
    }
  };

  if (!title || !artist || !imgURL) return null;

  return (
    <div className="relative group">
      {/* Animated background glow */}
      <div className="absolute -inset-4 bg-accent/20 rounded-[2.5rem] blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500 animate-pulse-soft" />

      <div className="relative neo-card rounded-[2rem] p-7 glow-accent hover-lift">
        {/* Album art section */}
        <div className="relative mb-7">
          {/* Decorative corner accents */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-accent/40 rounded-tl-lg" />
          <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-accent/40 rounded-tr-lg" />
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-accent/40 rounded-bl-lg" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-accent/40 rounded-br-lg" />

          <div className="relative overflow-hidden rounded-2xl">
            <Image
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              draggable={false}
              className="relative shadow-2xl transition-transform duration-700 group-hover:scale-105 select-none"
              src={imgURL}
              alt={title}
              width={320}
              height={320}
            />
          </div>
        </div>

        {/* Song info */}
        <div className="text-center mb-7">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent animate-pulse-soft" />
            <span className="text-xs uppercase tracking-widest text-accent font-medium">
              Now Playing
            </span>
          </div>
          <h2 className="font-display italic text-2xl text-foreground mb-2 truncate max-w-[300px] mx-auto">
            {title}
          </h2>
          <p className="text-muted-foreground truncate max-w-[300px] mx-auto">
            {artist}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleCopy(info, t("allInfo"))}
            className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl btn-accent text-base glow-accent-sm"
          >
            <Copy className="w-5 h-5" />
            <span>{t("copyAll")}</span>
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => handleCopy(title, t("song"))}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl btn-secondary text-sm whitespace-nowrap"
            >
              <Music className="w-4 h-4 shrink-0" />
              {t("song")}
            </button>

            <button
              onClick={() => handleCopy(artist, t("artist"))}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl btn-secondary text-sm whitespace-nowrap"
            >
              <User className="w-4 h-4 shrink-0" />
              {t("artist")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
