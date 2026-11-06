import type { Metadata, Viewport } from "next";
import DocumentLayout from "@/components/document-layout";
export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio.mjjmc.xyz"),
  title: { default: "Custom Website Development & Web Design | Liang Xikun", template: "%s | Liang Xikun" },
  description: "Freelance web developer Liang Xikun builds custom business websites and Next.js applications. Explore case studies, project scope and source-code handover.",
  alternates: { canonical: "/en", languages: { "zh-CN": "/", en: "/en", "x-default": "/" } },
  openGraph: { type: "website", locale: "en_US", siteName: "Liang Xikun · Form × Build", title: "Custom Website Development & Web Design | Liang Xikun", description: "Custom business websites and Next.js development, from the brief and web design to launch and handover.", url: "/en" },
  twitter: { card: "summary_large_image", title: "Custom Website Development & Web Design | Liang Xikun", description: "Custom business websites and Next.js development, from the brief and web design to launch and handover." },
};
export const viewport: Viewport = { themeColor: "#0d161c" };
export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <DocumentLayout locale="en">{children}</DocumentLayout>;
}
