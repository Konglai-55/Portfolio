import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { services } from "@/lib/services";
import { guides } from "@/lib/guides";
import { contentUpdated, siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/about", "/services", "/work", "/guides",
    ...services.map(s => `/services/${s.slug}`),
    ...projects.map(p => `/work/${p.slug}`),
    ...guides.map(g => `/guides/${g.slug}`)];
  const updated = new Set(["/", "/about", "/services", "/guides", ...services.map(s => `/services/${s.slug}`)]);
  return paths.flatMap(path => {
    const zh = siteUrl + (path === "/" ? "" : path);
    const en = siteUrl + `/en${path === "/" ? "" : path}`;
    return [zh, en].map(url => ({ url, lastModified: guides.find(g => path === `/guides/${g.slug}`)?.updated ?? (updated.has(path) ? "2026-11-05" : contentUpdated), alternates: { languages: { "zh-CN": zh, en } } }));
  });
}
