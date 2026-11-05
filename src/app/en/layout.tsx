import type { Metadata, Viewport } from "next";
import DocumentLayout from "@/components/document-layout";
export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio.mjjmc.xyz"),
  title: { default: "Liang Xikun | Website design and full-stack development", template: "%s | Liang Xikun" },
  description: "Company websites, international websites and custom Next.js development by Liang Xikun. Explore services, case studies and practical website project guides.",
  alternates: { canonical: "/en", languages: { "zh-CN": "/", en: "/en", "x-default": "/" } },
  openGraph: { type: "website", locale: "en_US", siteName: "Liang Xikun · Form × Build", title: "Liang Xikun | Website design and full-stack development", description: "From visual direction to development and launch.", url: "/en" },
  twitter: { card: "summary_large_image", title: "Liang Xikun | Website design and full-stack development", description: "From visual direction to development and launch." },
};
export const viewport: Viewport = { themeColor: "#0d161c" };
export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <DocumentLayout locale="en">{children}</DocumentLayout>;
}
