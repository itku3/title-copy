"use client";
import { useState } from "react";
import { Info } from "./components/Info";
import { InputLink } from "./components/InputLink";
import { Settings } from "./components/Settings";
import { Toaster, toast } from "sonner";
import { Copy, Music, User, Clock, Disc3, ArrowLeft } from "lucide-react";
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
    <main className="min-h-screen relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-accent/8 to-transparent blur-3xl" />
        <div className="absolute bottom-[-30%] right-[-15%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tl from-accent/5 to-transparent blur-3xl" />
      </div>

      <Settings />

      {/* Back button */}
      {currentSong && (
        <button
          onClick={() => setCurrentSong(null)}
          className="fixed top-6 left-6 z-50 w-10 h-10 flex items-center justify-center rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-accent hover:border-accent/30 transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      <Toaster
        richColors
        position="top-center"
        toastOptions={{
          style: {
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            color: "hsl(var(--foreground))",
            fontFamily: "'Noto Sans', sans-serif",
          },
        }}
      />

      <div className="relative z-10 w-screen min-h-screen flex flex-col items-center justify-center py-16 px-4">
        {currentSong ? (
          <div className="animate-reveal">
            <Info {...currentSong} />
          </div>
        ) : (
          <div className="text-center animate-fade-in">
            {/* Animated icon */}
            <div className="relative inline-flex items-center justify-center mb-8">
              <div className="absolute inset-0 w-24 h-24 bg-accent/20 blob animate-pulse-soft" />
              <div className="relative w-24 h-24 flex items-center justify-center neo-card rounded-3xl glow-accent">
                <Disc3 className="w-12 h-12 text-accent animate-[spin_8s_linear_infinite]" />
              </div>
            </div>

            {/* Title */}
            <h1 className="font-display font-black text-5xl md:text-6xl mb-4 tracking-tight">
              <span className="text-foreground">Spotify</span>
              <span className="text-accent glow-text ml-2">Copy</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        )}

        <InputLink onFetchTitle={fetchTitle} />

        {history.length > 0 && (
          <div className="w-full max-w-lg neo-card rounded-3xl p-6 animate-slide-up stagger-3">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border/50">
              <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-accent" />
              </div>
              <h2 className="font-display font-semibold text-xl text-foreground">
                {t("history")}
              </h2>
              <span className="ml-auto text-sm text-muted-foreground font-medium bg-muted/50 px-3 py-1 rounded-full">
                {history.length}
              </span>
            </div>

            <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {[...history].reverse().map((song, index) => (
                <li
                  key={index}
                  className="group p-4 rounded-2xl bg-background/50 border border-border/30 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <Music className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {song.title}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {song.artist}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleCopy(`${song.title} - ${song.artist}`, t("all"))
                      }
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-xl btn-accent whitespace-nowrap"
                    >
                      <Copy className="w-3.5 h-3.5 shrink-0" />
                      {t("all")}
                    </button>

                    <button
                      onClick={() => handleCopy(song.title, t("song"))}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-xl btn-secondary whitespace-nowrap"
                    >
                      <Music className="w-3.5 h-3.5 shrink-0" />
                      {t("song")}
                    </button>

                    <button
                      onClick={() => handleCopy(song.artist, t("artist"))}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-xl btn-secondary whitespace-nowrap"
                    >
                      <User className="w-3.5 h-3.5 shrink-0" />
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
