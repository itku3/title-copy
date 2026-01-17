"use client";
import Image from "next/image";
import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "sonner";
import { Copy, Music, User } from "lucide-react";

interface InfoProps {
  title: string;
  artist: string;
  imgURL: string;
}

export const Info: React.FC<InfoProps> = ({ title, artist, imgURL }) => {
  const info = `${title} - ${artist}`;

  const handleCopy = (text: string, label: string) => {
    toast.success(`${label} 복사됨`, {
      description: text,
    });
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
        <h2 className="font-bold text-xl text-white mb-1 truncate max-w-[280px]">
          {title}
        </h2>
        <p className="text-muted-foreground truncate max-w-[280px]">{artist}</p>
      </div>

      <div className="flex flex-col gap-3">
        <CopyToClipboard
          text={info}
          onCopy={() => handleCopy(info, "전체 정보")}
        >
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-spotify hover:bg-spotify-dark text-black font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] glow-spotify-sm">
            <Copy className="w-4 h-4" />
            전체 복사
          </button>
        </CopyToClipboard>

        <div className="flex gap-3">
          <CopyToClipboard
            text={title}
            onCopy={() => handleCopy(title, "노래")}
          >
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
              <Music className="w-4 h-4" />
              노래
            </button>
          </CopyToClipboard>

          <CopyToClipboard
            text={artist}
            onCopy={() => handleCopy(artist, "아티스트")}
          >
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
              <User className="w-4 h-4" />
              아티스트
            </button>
          </CopyToClipboard>
        </div>
      </div>
    </div>
  );
};
