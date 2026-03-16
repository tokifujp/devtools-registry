import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "DevTools Registry - 開発環境・ツールの記録帳",
  description: "開発環境・CLIツール・ライブラリのインストール方法や使い方を記録・管理するWebアプリケーション。OS別のインストール情報、よく使うコマンド、Tipsを一元管理。",
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: "DevTools Registry",
    description: "開発環境・ツールの記録帳",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevTools Registry",
    description: "開発環境・ツールの記録帳",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}