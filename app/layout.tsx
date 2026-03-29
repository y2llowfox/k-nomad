import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/react";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "K-Nomad | 대한민국 디지털 노마드 도시 가이드",
  description:
    "한국에서 원격근무하며 살기 좋은 도시를 찾아보세요. 30개 도시의 생활비, 인터넷 속도, 코워킹, 안전 등 12개 지표를 비교합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn("font-sans", notoSansKR.variable)}>
      <body className="antialiased min-h-screen flex flex-col">
        <TooltipProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Analytics />
        </TooltipProvider>
      </body>
    </html>
  );
}
