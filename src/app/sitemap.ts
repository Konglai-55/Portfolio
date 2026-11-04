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
  return paths.map(path => ({ url: siteUrl + (path === "/" ? "" : path), lastModified: contentUpdated }));
}
