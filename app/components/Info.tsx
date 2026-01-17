"use client";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";
import { Copy, Music, User } from "lucide-react";
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
    <div className="glass rounded-3xl p-6 glow-spotify animate-float">
      <div className="relative mb-6 group">
        <div className="absolute -inset-1 bg-spotify/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
        <Image
          onContextMenu={(e) => e.preventDefault()}
          className="relative shadow-2xl rounded-2xl"
          src={imgURL}
          alt={title}
          width={300}
          height={300}
        />
      </div>

      <div className="text-center mb-6">
        <h2 className="font-bold text-xl text-foreground mb-1 truncate max-w-[280px]">
          {title}
        </h2>
        <p className="text-muted-foreground truncate max-w-[280px]">{artist}</p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => handleCopy(info, t("allInfo"))}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-spotify hover:bg-spotify-dark text-black font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] glow-spotify-sm"
        >
          <Copy className="w-4 h-4" />
          {t("copyAll")}
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => handleCopy(title, t("song"))}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground/90 font-medium text-sm whitespace-nowrap transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Music className="w-4 h-4 shrink-0" />
            {t("song")}
          </button>

          <button
            onClick={() => handleCopy(artist, t("artist"))}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground/90 font-medium text-sm whitespace-nowrap transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <User className="w-4 h-4 shrink-0" />
            {t("artist")}
          </button>
        </div>
      </div>
    </div>
  );
};
