import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentShell } from "@/components/content-shell";
import styles from "@/components/content-shell.module.css";
import { projects } from "@/lib/projects";
import { caseNotes } from "@/lib/case-notes";
import { services } from "@/lib/services";
import { contentUpdated, pageMetadata, personId, siteUrl } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() { return projects.map(p => ({ slug: p.slug })); }
async function getProject(params: Promise<{ slug: string }>) {
  const { slug } = await params;
  const project = projects.find(p => p.slug === slug);
  if (!project) notFound();
  return project;
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getProject(params);
  return pageMetadata(caseNotes[p.slug].title, p.description, `/work/${p.slug}`);
}
export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getProject(params);
  const note = caseNotes[p.slug];
  return <ContentShell title={note.title} intro={p.description} path={`/work/${p.slug}`} section={{ title: "网站案例", href: "/work" }} schema={{ "@type": "CreativeWork", "@id": `${siteUrl}/work/${p.slug}#case`, name: note.title, url: `${siteUrl}/work/${p.slug}`, description: note.focus, author: { "@id": personId }, image: p.pages.map(image => image.src), inLanguage: "zh-CN", dateModified: contentUpdated }}>
    <section><span className={styles.meta}>{p.status} · {p.period} · 案例说明更新于 {contentUpdated}</span><h2>项目要解决什么问题？</h2><p>{note.focus}</p></section>
    <figure><Image className={styles.cover} src={p.pages[0].src} width={p.pages[0].width} height={p.pages[0].height} alt={p.pages[0].alt} sizes="(max-width:640px) 88vw, 1000px" quality={68} priority /><figcaption>{p.title} · {p.pages[0].label}。下方链接可查看完整长页。</figcaption></figure>
    <section><h2>页面与内容如何组织？</h2><ul>{note.decisions.map(d => <li key={d}>{d}</li>)}</ul></section>
    <section><h2>查看公开页面</h2><ul>{p.pages.map(page => <li key={page.src}><a href={page.src}>{page.alt}（完整图片）</a></li>)}</ul><p>这些图片用于展示项目界面。需要体验首页的交互展示，可以<Link href="/#work">返回作品集展厅</Link>。</p></section>
    <section><h2>展示范围与项目状态</h2><p>{note.boundary}</p></section>
    <section><h2>相关服务</h2><div className={styles.related}>{services.filter(s => (s.caseSlugs as readonly string[]).includes(p.slug)).map(s => <Link key={s.slug} href={`/services/${s.slug}`}>{s.title}</Link>)}</div><p>有类似需求，可以先整理<Link href="/guides/website-project-checklist">项目资料与交付清单</Link>，再<Link href="/#contact">沟通具体范围</Link>。</p></section>
  </ContentShell>;
}
