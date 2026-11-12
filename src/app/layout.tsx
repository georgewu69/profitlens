import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PlaceholderToastProvider } from "@/components/ui/placeholder-toast";

export const metadata: Metadata = {
  title: {
    default: "ProfitLens · 抖音电商利润分析工具",
    template: "%s · ProfitLens",
  },
  description:
    "ProfitLens 为抖音电商卖家提供 SKU 级商品利润分析、亏损商品识别与 AI 经营建议，让每一笔生意的利润都清清楚楚。",
  keywords: ["抖音电商", "利润分析", "商品利润", "亏损商品", "电商经营", "ProfitLens"],
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="flex min-h-full flex-col bg-white font-sans text-slate-900 antialiased">
        <PlaceholderToastProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </PlaceholderToastProvider>
      </body>
    </html>
  );
}
