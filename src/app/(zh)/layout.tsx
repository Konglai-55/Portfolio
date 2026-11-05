import type { Metadata, Viewport } from "next";
import DocumentLayout from "@/components/document-layout";

export const metadata: Metadata = {
  title: {
    default: "梁熙坤｜企业官网、外贸独立站与全栈开发",
    template: "%s｜梁熙坤个人作品集",
  },
  description:
    "梁熙坤（Liang Xikun），设计师与全栈开发者，提供企业官网、外贸独立站与 Next.js 定制开发。查看公开案例、服务范围与建站指南，从需求、视觉设计到开发部署统一交付。",
  metadataBase: new URL("https://portfolio.mjjmc.xyz"),
  alternates: { canonical: "/", languages: { "zh-CN": "/", en: "/en", "x-default": "/" } },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "梁熙坤 · 形构 Form × Build",
    title: "梁熙坤｜企业官网、外贸独立站与全栈开发",
    description:
      "从视觉方向到完整开发与上线：企业官网、外贸独立站与全栈网站建设。",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "梁熙坤｜企业官网、外贸独立站与全栈开发",
    description: "从视觉方向到完整开发与上线。",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d161c",
};

export default function ChineseLayout({ children }: { children: React.ReactNode }) { return <DocumentLayout>{children}</DocumentLayout>; }
