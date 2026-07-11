import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Henry Ye｜连续创业者 · AI 产品商业化实践者",
  description: "Henry Ye 的个人主页。关注 AI 产品商业化、创业、跨境电商与全球年轻行动者的连接。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
