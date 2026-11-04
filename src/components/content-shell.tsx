import Link from "next/link";
import type { ReactNode } from "react";
import { StructuredData } from "./structured-data";
import { identityGraph, personId, siteUrl, websiteId } from "@/lib/seo";
import styles from "./content-shell.module.css";

export function ContentShell({ title, intro, path, section, children, schema }: {
  title: string; intro: string; path: string; section: { title: string; href: string };
  children: ReactNode; schema?: Record<string, unknown>;
}) {
  const breadcrumbs = [{ title: "首页", href: "/" }, ...(section.href === path ? [] : [section]), { title, href: path }];
  return <div className={styles.page}>
    <a href="#content" className={styles.skip}>跳至正文</a>
    <header className={styles.header}>
      <Link className={styles.brand} href="/">梁熙坤<span>形构 · Form × Build</span></Link>
      <nav aria-label="主导航"><Link href="/services">服务</Link><Link href="/work">案例</Link><Link href="/guides">建站指南</Link><Link href="/about">关于</Link><Link href="/#contact">联系</Link></nav>
    </header>
    <main id="content" className={styles.main}>
      <StructuredData data={{ "@context": "https://schema.org", "@graph": [...identityGraph,
        { "@type": "WebPage", "@id": `${siteUrl}${path}#webpage`, url: `${siteUrl}${path}`, name: title, description: intro, inLanguage: "zh-CN", isPartOf: { "@id": websiteId }, about: { "@id": personId } },
        { "@type": "BreadcrumbList", itemListElement: breadcrumbs.map((b, index) => ({ "@type": "ListItem", position: index + 1, name: b.title, item: siteUrl + b.href })) },
        ...(schema ? [schema] : []),
      ] }} />
      <nav className={styles.breadcrumb} aria-label="当前位置">{breadcrumbs.map((b, i) => <span key={b.href}>{i > 0 && " / "}{i === breadcrumbs.length - 1 ? <span aria-current="page">{b.title}</span> : <Link href={b.href}>{b.title}</Link>}</span>)}</nav>
      <article>
        <div className={styles.heading}><h1>{title}</h1><p>{intro}</p></div>
        <div className={styles.body}>{children}</div>
      </article>
    </main>
    <footer className={styles.footer}><p>梁熙坤 · 设计师与全栈开发者</p><p>以设计建立表达，以工程保证落地。</p><Link href="/#contact">沟通项目需求</Link><span>© 2026 形构 Form × Build</span></footer>
  </div>;
}
