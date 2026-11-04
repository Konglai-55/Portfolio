import Link from "next/link";
import { ContentShell } from "@/components/content-shell";
import { pageMetadata, personId } from "@/lib/seo";

export const metadata = pageMetadata("关于梁熙坤｜设计师与全栈开发者", "梁熙坤（Liang Xikun），形构 Form × Build 的设计师与全栈开发者。了解企业官网、外贸独立站、视觉设计与开发交付的工作方式及公开案例。", "/about");
export default function AboutPage() {
  return <ContentShell title="梁熙坤，设计师与全栈开发者" intro="我把视觉设计与网站开发放在同一条交付流程里：先理解业务与内容，再完成界面、交互、开发与上线。形构 Form × Build 是这套工作方式的名字。" path="/about" section={{ title: "关于", href: "/about" }} schema={{ "@type": "ProfilePage", mainEntity: { "@id": personId } }}>
    <section><h2>我负责什么</h2><p>工作重点是 Web 开发、前端视觉设计与全栈交付。既处理公开页面的内容结构和阅读体验，也处理后台、接口、部署与后续维护所需的工程环节。</p><p>你可以从<Link href="/work">公开案例</Link>了解医院、创意店、制造业与家具品牌网站的不同设计方向。案例页面标明展示范围与项目状态。</p></section>
    <section><h2>怎样合作</h2><ol><li>需求与范围：明确受众、页面、更新方式和交付目标，列出需要双方准备的材料。</li><li>设计与开发：由我主导方向、实现与质量把控，依据项目规模安排必要协作。</li><li>验收与交接：按约定检查内容、功能、设备适配和部署，明确源码、账号、数据与维护责任。</li></ol></section>
    <section><h2>先看服务，或直接聊需求</h2><p>如果已经有计划，带上现有网站、参考页面或内容目录就可以开始沟通。不确定范围时，可以先看<Link href="/services">服务说明</Link>与<Link href="/guides/website-project-checklist">需求清单</Link>。</p><p>微信：as14246791。更多联系方式与微信二维码见<Link href="/#contact">作品集联系区</Link>。</p></section>
  </ContentShell>;
}
