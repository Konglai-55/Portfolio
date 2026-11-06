import type { Metadata } from "next";

export const siteUrl = "https://portfolio.mjjmc.xyz";
export const personId = `${siteUrl}/#person`;
export const websiteId = `${siteUrl}/#website`;
export const contentUpdated = "2026-11-04";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path, languages: { "zh-CN": path, en: `/en${path === "/" ? "" : path}`, "x-default": path } },
    openGraph: {
      type: "website", locale: "zh_CN", siteName: "梁熙坤 · 形构 Form × Build",
      title: `${title}｜梁熙坤`, description, url: path,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "梁熙坤 · 设计与全栈开发" }],
    },
    twitter: { card: "summary_large_image", title: `${title}｜梁熙坤`, description, images: ["/opengraph-image"] },
  };
}

export const identityGraph = [
  {
    "@type": "Person", "@id": personId, name: "梁熙坤", alternateName: "Liang Xikun",
    jobTitle: "独立全栈开发者与网站设计师", url: siteUrl,
    description: "独立网站设计师与全栈开发者，提供企业官网、外贸独立站和 Next.js 定制开发。",
    mainEntityOfPage: `${siteUrl}/about#webpage`,
    contactPoint: { "@type": "ContactPoint", contactType: "项目咨询", email: "351738705@qq.com", url: `${siteUrl}/#contact` },
    knowsAbout: ["网站制作", "企业官网建设", "企业官网设计", "外贸独立站", "Next.js 开发", "Web 视觉设计", "网站部署与维护"],
    brand: { "@type": "Brand", name: "形构 Form × Build" },
  },
  { "@type": "WebSite", "@id": websiteId, url: siteUrl, name: "梁熙坤 · 形构 Form × Build", inLanguage: "zh-CN", publisher: { "@id": personId } },
];
