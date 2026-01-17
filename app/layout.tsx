import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const notoSans = Noto_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spotify Info Copy",
  description: "Extract and copy information from Spotify song URLs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={notoSans.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
