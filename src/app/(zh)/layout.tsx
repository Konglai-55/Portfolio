import type { Metadata, Viewport } from "next";
import DocumentLayout from "@/components/document-layout";

export const metadata: Metadata = {
  title: {
    default: "网站制作与企业官网建设｜独立开发者梁熙坤",
    template: "%s｜梁熙坤",
  },
  description:
    "独立全栈开发者梁熙坤提供网站制作、企业官网建设、外贸独立站与 Next.js 定制开发。查看制造业、医院和创意店案例，了解响应式设计、后台管理、源码交付与上线维护。",
  metadataBase: new URL("https://portfolio.mjjmc.xyz"),
  alternates: { canonical: "/", languages: { "zh-CN": "/", en: "/en", "x-default": "/" } },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "梁熙坤 · 形构 Form × Build",
    title: "网站制作与企业官网建设｜独立开发者梁熙坤",
    description:
      "从视觉方向到完整开发与上线：企业官网、外贸独立站与全栈网站建设。",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "网站制作与企业官网建设｜独立开发者梁熙坤",
    description: "从视觉方向到完整开发与上线。",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d161c",
};

export default function ChineseLayout({ children }: { children: React.ReactNode }) { return <DocumentLayout>{children}</DocumentLayout>; }
