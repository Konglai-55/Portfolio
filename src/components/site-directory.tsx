import Link from "next/link";
import { services } from "@/lib/services";
import { guides } from "@/lib/guides";
import styles from "./site-directory.module.css";

export function SiteDirectory() {
  return <section className={styles.section} aria-labelledby="site-directory-title">
    <div className={styles.intro}><h2 id="site-directory-title">把想法变成网站，<br />先把问题说清楚。</h2><p>我是梁熙坤，提供企业官网、外贸独立站与全栈定制开发。这里可以继续了解服务范围、公开案例和项目准备方法。</p><Link href="/about">了解我的工作方式</Link></div>
    <div className={styles.links}><nav aria-label="网站开发服务"><h3>服务范围</h3>{services.map(s => <Link key={s.slug} href={`/services/${s.slug}`}>{s.title}</Link>)}<Link href="/services">查看全部服务</Link></nav><nav aria-label="案例与建站指南"><h3>案例与建站指南</h3><Link href="/work">四个代表项目的案例说明</Link>{guides.map(g => <Link key={g.slug} href={`/guides/${g.slug}`}>{g.title}</Link>)}<Link href="/guides">查看全部指南</Link></nav></div>
  </section>;
}
