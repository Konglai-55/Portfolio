import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentShell } from "@/components/content-shell";
import styles from "@/components/content-shell.module.css";
import { services } from "@/lib/services";
import { projects } from "@/lib/projects";
import { pageMetadata, personId, siteUrl } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() { return services.map(s => ({ slug: s.slug })); }
async function getService(params: Promise<{ slug: string }>) {
  const { slug } = await params;
  const service = services.find(s => s.slug === slug);
  if (!service) notFound();
  return service;
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const s = await getService(params);
  return pageMetadata(s.title, s.description, `/services/${s.slug}`);
}
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const s = await getService(params);
  const cases = projects.filter(p => (s.caseSlugs as readonly string[]).includes(p.slug));
  return <ContentShell title={s.title} intro={s.intro} path={`/services/${s.slug}`} section={{ title: "网站开发服务", href: "/services" }} schema={{ "@type": "Service", "@id": `${siteUrl}/services/${s.slug}#service`, url: `${siteUrl}/services/${s.slug}`, name: s.title, description: s.intro, serviceType: s.shortTitle, provider: { "@id": personId } }}>
    <section><h2>适合什么样的需求？</h2><p>{s.audience}</p></section>
    <section><h2>可以交付哪些内容？</h2><ul>{s.scope.map(item => <li key={item}>{item}</li>)}</ul><p>以上是可选择的工作范围；实际页面、功能、资料责任、时间和维护内容，需要在项目开始前确认。</p></section>
    <section><h2>设计与实现时的取舍</h2><p>{s.decisions}</p></section>
    <section><h2>相关项目</h2><div className={styles.list}>{cases.map(p => <div key={p.slug}><span className={styles.meta}>{p.status}</span><h3><Link href={`/work/${p.slug}`}>{p.title}</Link></h3><p>{p.description}</p></div>)}</div></section>
    <section><h2>常见问题</h2>{s.questions.map(item => <div className={styles.question} key={item.q}><h3>{item.q}</h3><p>{item.a}</p></div>)}</section>
    <section><h2>准备开始一个项目</h2><p><Link href="/guides/website-project-checklist">先对照建站需求清单整理资料</Link>，再<Link href="/#contact">联系梁熙坤沟通范围</Link>。需要比较报价时，可以先看<Link href="/guides/website-cost-and-scope">网站报价与交付范围的核对方法</Link>。</p></section>
  </ContentShell>;
}
