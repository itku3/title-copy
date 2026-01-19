import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://title-copy.vercel.app"),
  title: {
    default: "Spotify Info Copy - Extract & Copy Song Information",
    template: "%s | Spotify Info Copy",
  },
  description:
    "Easily extract and copy song title, artist name, and album info from Spotify track URLs. Free online tool with dark mode and multi-language support.",
  keywords: [
    "Spotify",
    "song info",
    "copy song title",
    "extract artist",
    "music tool",
    "Spotify URL",
    "track info",
    "copy to clipboard",
  ],
  authors: [{ name: "Spotify Info Copy" }],
  creator: "Spotify Info Copy",
  publisher: "Spotify Info Copy",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ko_KR", "ja_JP"],
    siteName: "Spotify Info Copy",
    title: "Spotify Info Copy - Extract & Copy Song Information",
    description:
      "Easily extract and copy song title, artist name, and album info from Spotify track URLs.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spotify Info Copy - Extract & Copy Song Information",
    description:
      "Easily extract and copy song title, artist name, and album info from Spotify track URLs.",
  },
  verification: {},
  category: "Music Tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
