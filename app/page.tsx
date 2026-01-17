"use client";
import { useState } from "react";
import { Info } from "./components/Info";
import { InputLink } from "./components/InputLink";
import { Settings } from "./components/Settings";
import { Toaster, toast } from "sonner";
import { Copy, Music, User, Clock } from "lucide-react";
import { copyToClipboard } from "@/lib/clipboard";
import { useLanguage } from "@/context/LanguageContext";

interface SongData {
  title: string;
  artist: string;
  imgURL: string;
}

export default function Home() {
  const [currentSong, setCurrentSong] = useState<SongData | null>(null);
  const [history, setHistory] = useState<SongData[]>([]);
  const { t } = useLanguage();

  const fetchTitle = async (url: string) => {
    try {
      const response = await fetch(
        `/api/fetch?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();

      if (!response.ok) {
        toast.error(t("errorOccurred"), { description: data.error });
        return;
      }

      const songData: SongData = {
        title: data.title,
        artist: data.artist,
        imgURL: data.imgURL,
      };

      setCurrentSong(songData);
      setHistory((prev) => [...prev, songData]);
    } catch {
      toast.error(t("requestFailed"), { description: t("networkError") });
    }
  };

  const handleCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.success(`${label} ${t("copied")}`, {
        description: text,
      });
    }
  };

  return (
    <main className="min-h-screen relative">
      <Settings />
      <Toaster
        richColors
        position="top-center"
        toastOptions={{
          style: {
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            color: "hsl(var(--foreground))",
          },
        }}
      />

      <div className="w-screen min-h-screen flex flex-col items-center justify-center py-10 px-4">
        {currentSong ? (
          <div className="animate-scale-in">
            <Info {...currentSong} />
          </div>
        ) : (
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-spotify/10 mb-6 glow-spotify animate-pulse-glow">
              <Music className="w-10 h-10 text-spotify" />
            </div>
            <h1 className="font-extrabold text-4xl text-spotify mb-3 glow-text tracking-tight">
              {t("title")}
            </h1>
            <p className="text-muted-foreground text-lg">{t("subtitle")}</p>
          </div>
        )}

        <InputLink onFetchTitle={fetchTitle} />

        {history.length > 0 && (
          <div className="w-full max-w-md glass rounded-2xl p-5 animate-slide-up">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <Clock className="w-4 h-4 text-spotify" />
              <h2 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider">
                {t("history")}
              </h2>
              <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {history.length}
              </span>
            </div>

            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {[...history].reverse().map((song, index) => (
                <li
                  key={index}
                  className="group p-3 rounded-xl bg-card border border-border hover:border-spotify/20 transition-all duration-200"
                >
                  <p className="text-sm font-medium text-foreground/90 truncate mb-2">
                    {song.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mb-3">
                    {song.artist}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleCopy(`${song.title} - ${song.artist}`, t("all"))
                      }
                      className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-lg bg-spotify/20 hover:bg-spotify/30 text-spotify whitespace-nowrap transition-all duration-200 hover:glow-spotify-sm"
                    >
                      <Copy className="w-3 h-3 shrink-0" />
                      {t("all")}
                    </button>

                    <button
                      onClick={() => handleCopy(song.title, t("song"))}
                      className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-lg border border-border bg-card hover:bg-muted hover:border-spotify/30 text-foreground whitespace-nowrap transition-all duration-200"
                    >
                      <Music className="w-3 h-3 shrink-0" />
                      {t("song")}
                    </button>

                    <button
                      onClick={() => handleCopy(song.artist, t("artist"))}
                      className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-lg border border-border bg-card hover:bg-muted hover:border-spotify/30 text-foreground whitespace-nowrap transition-all duration-200"
                    >
                      <User className="w-3 h-3 shrink-0" />
                      {t("artist")}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
