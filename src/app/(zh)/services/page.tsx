import Link from "next/link";
import { ContentShell } from "@/components/content-shell";
import styles from "@/components/content-shell.module.css";
import { services } from "@/lib/services";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("网站设计与开发服务", "梁熙坤提供企业官网、外贸独立站与 Next.js 定制开发服务。从信息梳理、视觉设计到开发部署，查看服务范围、项目案例和交付前需要确认的问题。", "/services");
export default function ServicesPage() {
  return <ContentShell title="网站设计与开发服务" intro="从内容、界面到可以运行的网站，由同一个负责人衔接设计、开发与交付。先把目标和范围说清，再选择适合的实现方式。" path="/services" section={{ title: "服务", href: "/services" }}>
    <div className={styles.list}>{services.map(s => <div key={s.slug}><h2><Link href={`/services/${s.slug}`}>{s.title}</Link></h2><p>{s.intro}</p><Link href={`/services/${s.slug}`}>了解服务范围与常见问题</Link></div>)}</div>
    <section><h2>合作从哪些信息开始？</h2><p>说明网站服务谁、希望访客完成什么、现有哪些内容、哪些内容需要自己更新。如果已经有网站，可以一起整理需要保留的页面、网址和数据。</p><p><Link href="/guides/website-project-checklist">查看网站建设需求与交付清单</Link>，或先浏览<Link href="/work">公开案例</Link>。</p></section>
  </ContentShell>;
}
