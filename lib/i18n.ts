export type Locale = "en" | "ko" | "ja";

export const translations = {
  en: {
    title: "Spotify Copy",
    subtitle: "Copy song info with one click",
    placeholder: "Enter Spotify URL",
    search: "Search",
    history: "History",
    copyAll: "Copy All",
    song: "Title",
    artist: "Artist",
    all: "All",
    copied: "Copied",
    allInfo: "All Info",
    errorOccurred: "Error occurred",
    requestFailed: "Request failed",
    networkError: "A network error occurred.",
    light: "Light",
    dark: "Dark",
  },
  ko: {
    title: "Spotify Copy",
    subtitle: "클릭 한 번으로 곡 정보 복사",
    placeholder: "Spotify URL을 입력하세요",
    search: "검색",
    history: "History",
    copyAll: "전체 복사",
    song: "곡명",
    artist: "아티스트",
    all: "전체",
    copied: "복사됨",
    allInfo: "전체 정보",
    errorOccurred: "오류 발생",
    requestFailed: "요청 실패",
    networkError: "네트워크 오류가 발생했습니다.",
    light: "라이트",
    dark: "다크",
  },
  ja: {
    title: "Spotify Copy",
    subtitle: "ワンクリックで曲情報をコピー",
    placeholder: "Spotify URLを入力",
    search: "検索",
    history: "履歴",
    copyAll: "全てコピー",
    song: "曲名",
    artist: "アーティスト",
    all: "全て",
    copied: "コピーしました",
    allInfo: "全情報",
    errorOccurred: "エラーが発生しました",
    requestFailed: "リクエスト失敗",
    networkError: "ネットワークエラーが発生しました。",
    light: "ライト",
    dark: "ダーク",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export const detectLocale = (): Locale => {
  if (typeof window === "undefined") return "en";

  const browserLang = navigator.language.toLowerCase();

  if (browserLang.startsWith("ko")) return "ko";
  if (browserLang.startsWith("ja")) return "ja";

  return "en";
};

export const getTranslation = (locale: Locale, key: TranslationKey): string => {
  return translations[locale][key];
};
