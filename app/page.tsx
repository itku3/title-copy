"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Info } from "./components/Info";
import { InputLink } from "./components/InputLink";
import { Settings } from "./components/Settings";
import { AlbumBackground } from "./components/AlbumBackground";
import { Toaster, toast } from "sonner";
import { Copy, Music, User, Clock, Disc3, ArrowLeft, Trash2 } from "lucide-react";
import { copyToClipboard } from "@/lib/clipboard";
import { useLanguage } from "@/context/LanguageContext";
import { useDynamicColor } from "@/context/DynamicColorContext";

const HISTORY_STORAGE_KEY = "spotify-copy-history";
const HISTORY_MAX = 50;

interface SongData {
  title: string;
  artist: string;
  imgURL: string | null;
}

// [rendering-hoist-jsx] 컴포넌트 외부로 정적 JSX를 호이스팅
// → 렌더링마다 동일한 JSX 객체를 재생성하는 비용을 없애고,
//   React reconciler가 동일 참조임을 인식하여 불필요한 diff를 건너뜀
const DecorativeBackground = (
  <div className="fixed inset-0 pointer-events-none">
    <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-accent/8 to-transparent blur-3xl" />
    <div className="absolute bottom-[-30%] right-[-15%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tl from-accent/5 to-transparent blur-3xl" />
  </div>
);

export default function Home() {
  const [currentSong, setCurrentSong] = useState<SongData | null>(null);
  const [history, setHistory] = useState<SongData[]>([]);
  // 서버/클라이언트 hydration 불일치 방지: 마운트 후에만 localStorage를 읽음
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const { t } = useLanguage();
  const { extractAndApplyColors, resetColors } = useDynamicColor();

  // 마운트 후 localStorage에서 히스토리 로드
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
    setHistoryLoaded(true);
  }, []);

  // localStorage에 히스토리 저장 (로드 완료 후에만 실행하여 빈 배열로 덮어쓰기 방지)
  useEffect(() => {
    if (!historyLoaded) return;
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {
      toast.error(t("errorOccurred"), { description: "히스토리를 저장할 수 없습니다." });
    }
  }, [history, t, historyLoaded]);

  // [rerender-memo] useCallback으로 핸들러를 메모이제이션
  // → InputLink(React.memo)에 props로 전달될 때 참조 동일성을 보장하여
  //   부모 렌더링 시 자식 컴포넌트의 불필요한 리렌더링을 방지
  const fetchTitle = useCallback(async (url: string) => {
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
      setHistory((prev) => [...prev, songData].slice(-HISTORY_MAX));
      extractAndApplyColors(data.imgURL);
    } catch {
      toast.error(t("requestFailed"), { description: t("networkError") });
    }
  }, [t, extractAndApplyColors]);

  // [rerender-functional-setstate] 히스토리 항목 추가 시 함수형 setState 사용(fetchTitle 내부)
  // → prev 참조를 직접 받아 최신 상태 기반으로 업데이트하므로 stale closure 문제 없음
  // [rerender-memo] 복사 핸들러 메모이제이션 - t 의존성만 있어 언어 변경 시에만 재생성
  const handleCopy = useCallback(async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.success(`${label} ${t("copied")}`, {
        description: text,
      });
    }
  }, [t]);

  // [rerender-memo] 의존성이 없는 핸들러는 빈 배열로 한 번만 생성
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const handleBack = useCallback(() => {
    setCurrentSong(null);
    resetColors();
  }, [resetColors]);

  // [rerender-derived-state] 파생 데이터(역순 목록)를 useMemo로 캐싱
  // → history가 바뀔 때만 재계산하고, originalIndex를 key로 사용하여
  //   React가 항목 추가/삭제를 정확하게 추적할 수 있도록 stable key 보장
  const reversedHistory = useMemo(
    () => history.map((song, i) => ({ song, originalIndex: i })).reverse(),
    [history]
  );

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Album art blurred background */}
      <AlbumBackground imgURL={currentSong?.imgURL ?? null} />

      {/* Decorative background elements */}
      {!currentSong && DecorativeBackground}

      <Settings />

      {/* Back button */}
      {currentSong && (
        <button
          onClick={handleBack}
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
              <button
                onClick={clearHistory}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all duration-300"
                title="Clear history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {reversedHistory.map(({ song, originalIndex }) => (
                <li
                  key={originalIndex}
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
