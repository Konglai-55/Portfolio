import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentShell } from "@/components/content-shell";
import styles from "@/components/content-shell.module.css";
import { guides } from "@/lib/guides";
import { services } from "@/lib/services";
import { pageMetadata, personId, siteUrl } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() { return guides.map(g => ({ slug: g.slug })); }
async function getGuide(params: Promise<{ slug: string }>) {
  const { slug } = await params;
  const guide = guides.find(g => g.slug === slug);
  if (!guide) notFound();
  return guide;
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const g = await getGuide(params);
  return pageMetadata(g.title, g.description, `/guides/${g.slug}`);
}
export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const g = await getGuide(params);
  const service = services.find(s => s.slug === g.relatedService)!;
  return <ContentShell title={g.title} intro={g.intro} path={`/guides/${g.slug}`} section={{ title: "建站指南", href: "/guides" }} schema={{ "@type": "Article", headline: g.title, description: g.description, url: `${siteUrl}/guides/${g.slug}`, mainEntityOfPage: `${siteUrl}/guides/${g.slug}#webpage`, author: { "@id": personId }, publisher: { "@id": personId }, datePublished: g.published, dateModified: g.updated, inLanguage: "zh-CN", image: `${siteUrl}/opengraph-image` }}>
    <p className={styles.meta}>作者：<Link href="/about">梁熙坤</Link> · 发布：<time dateTime={g.published}>{g.published}</time> · 更新：<time dateTime={g.updated}>{g.updated}</time></p>
    {g.sections.map(s => <section key={s.title}><h2>{s.title}</h2>{s.paragraphs.map(p => <p key={p}>{p}</p>)}{"items" in s && <ul>{s.items.map(item => <li key={item}>{item}</li>)}</ul>}{"source" in s && <p>参考：<a href={s.source.url}>{s.source.title}</a>。</p>}</section>)}
    <section><h2>下一步</h2><p>需要把清单变成具体方案，可以查看<Link href={`/services/${service.slug}`}>{service.title}</Link>，或<Link href="/#contact">直接沟通项目</Link>。</p><div className={styles.related}>{guides.filter(other => other.slug !== g.slug).map(other => <Link key={other.slug} href={`/guides/${other.slug}`}>{other.title}</Link>)}</div></section>
  </ContentShell>;
}
