import Link from "next/link";
import Image from "next/image";
import { ContentShell } from "@/components/content-shell";
import styles from "@/components/content-shell.module.css";
import { projects } from "@/lib/projects";
import { caseNotes } from "@/lib/case-notes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("网站设计与开发案例", "查看梁熙坤的医院官网、加拿大创意店、制造业企业官网与家具外贸站案例。每个案例提供项目需求、页面设计说明和公开界面，标明制作状态。", "/work");
export default function WorkPage() {
  return <ContentShell title="网站设计与开发案例" intro="从业务目标看设计取舍，从公开界面看具体实现。这里整理四个代表项目，并区分完整案例与仍在制作的设计稿。" path="/work" section={{ title: "案例", href: "/work" }}>
    <div className={styles.list}>{projects.map(p => <div key={p.slug}>
      <Link href={`/work/${p.slug}`}><Image className={styles.thumb} src={p.pages[0].src} alt={p.pages[0].alt} width={720} height={450} sizes="(max-width:640px) 88vw, 45vw" quality={68} /></Link>
      <span className={styles.meta}>{p.status} · {p.period}</span><h2><Link href={`/work/${p.slug}`}>{caseNotes[p.slug].title}</Link></h2><p>{p.description}</p>
    </div>)}</div>
    <section><h2>从案例到你的项目</h2><p>同一行业也有不同的资料、更新频率和咨询流程。案例用于讨论方向，实际页面与功能按你的需求确定。</p><Link href="/services">查看网站开发服务</Link></section>
  </ContentShell>;
}
