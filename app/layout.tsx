import type { Metadata } from "next";
import { Inter, Noto_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const NotoSans = Noto_Sans({subsets:["latin"]})

export const metadata: Metadata = {
  title: "Spotify info Copy",
  description: "Put in Spotify songs url",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={NotoSans.className}>{children}</body>
    </html>
  );
}
