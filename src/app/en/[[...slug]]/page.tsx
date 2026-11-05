import { cloneElement, type ReactElement } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Home from "@/components/home-page";
import About, { metadata as aboutMetadata } from "@/app/(zh)/about/page";
import Services, { metadata as servicesMetadata } from "@/app/(zh)/services/page";
import Work, { metadata as workMetadata } from "@/app/(zh)/work/page";
import Guides, { metadata as guidesMetadata } from "@/app/(zh)/guides/page";
import Service, { generateMetadata as serviceMetadata } from "@/app/(zh)/services/[slug]/page";
import Case, { generateMetadata as caseMetadata } from "@/app/(zh)/work/[slug]/page";
import Guide, { generateMetadata as guideMetadata } from "@/app/(zh)/guides/[slug]/page";
import { services } from "@/lib/services";
import { projects } from "@/lib/projects";
import { guides } from "@/lib/guides";
import { localize } from "@/lib/i18n";

const indexes = {
  about: { page: About, metadata: aboutMetadata },
  services: { page: Services, metadata: servicesMetadata },
  work: { page: Work, metadata: workMetadata },
  guides: { page: Guides, metadata: guidesMetadata },
};
const details = {
  services: { page: Service, metadata: serviceMetadata, slugs: services.map(s => s.slug) },
  work: { page: Case, metadata: caseMetadata, slugs: projects.map(p => p.slug) },
  guides: { page: Guide, metadata: guideMetadata, slugs: guides.map(g => g.slug) },
};
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ slug: [] }, ...Object.keys(indexes).map(key => ({ slug: [key] })),
    ...Object.entries(details).flatMap(([key, value]) => value.slugs.map(slug => ({ slug: [key, slug] })))];
}
async function resolve(params: Promise<{ slug?: string[] }>) {
  const { slug = [] } = await params;
  if (slug.length === 0) return { path: "/", page: Home({ locale: "en" }), metadata: {} };
  if (slug.length === 1 && slug[0] in indexes) {
    const entry = indexes[slug[0] as keyof typeof indexes];
    return { path: `/${slug[0]}`, page: entry.page(), metadata: entry.metadata };
  }
  if (slug.length === 2 && slug[0] in details) {
    const entry = details[slug[0] as keyof typeof details];
    if ((entry.slugs as readonly string[]).includes(slug[1])) {
      const props = { params: Promise.resolve({ slug: slug[1] }) };
      return { path: `/${slug.join("/")}`, page: await entry.page(props), metadata: await entry.metadata(props) };
    }
  }
  notFound();
}
export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { path, metadata } = await resolve(params);
  const translated = localize(metadata, "en") as Metadata;
  return { ...translated, alternates: { canonical: `/en${path === "/" ? "" : path}`, languages: { "zh-CN": path, en: `/en${path === "/" ? "" : path}`, "x-default": path } },
    openGraph: { ...translated.openGraph, locale: "en_US", url: `/en${path === "/" ? "" : path}` } };
}
export default async function EnglishPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { path, page } = await resolve(params);
  if (path === "/") return page;
  return localize(cloneElement(page as ReactElement<{ locale: string }>, { locale: "en" }), "en");
}
