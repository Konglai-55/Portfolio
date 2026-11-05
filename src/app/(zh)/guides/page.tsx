import Link from "next/link";
import { ContentShell } from "@/components/content-shell";
import styles from "@/components/content-shell.module.css";
import { guides } from "@/lib/guides";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("网站建设指南", "准备企业官网或外贸独立站前，先了解需求资料、页面内容、后台、报价范围和源码交接的核对方法。由设计师与全栈开发者梁熙坤整理。", "/guides");
export default function GuidesPage() {
  return <ContentShell title="网站建设指南" intro="给准备启动网站项目的负责人：把目标、内容和交付范围说清楚，让设计、开发和后续维护有共同依据。" path="/guides" section={{ title: "建站指南", href: "/guides" }}>
    <div className={styles.list}>{guides.map(g => <div key={g.slug}><h2><Link href={`/guides/${g.slug}`}>{g.title}</Link></h2><p>{g.description}</p></div>)}</div>
    <section><h2>结合项目看具体做法</h2><p>清单适合准备沟通，案例帮助判断不同业务需要什么内容。可以继续看<Link href="/work">网站设计与开发案例</Link>，或了解<Link href="/services">服务范围</Link>。</p></section>
  </ContentShell>;
}
