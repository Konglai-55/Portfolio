import Link from "next/link";
import { ContentShell } from "@/components/content-shell";
import { pageMetadata, personId } from "@/lib/seo";

export const metadata = pageMetadata("独立开发者与网站设计师", "梁熙坤（Liang Xikun），独立全栈开发者与网站设计师，拥有五年以上独立开发经验。提供网站制作、企业官网、外贸独立站和 Next.js 定制开发，查看公开案例、合作流程与联系渠道。", "/about");
export default function AboutPage() {
  return <ContentShell title="梁熙坤，独立全栈开发者与网站设计师" intro="有美术背景，五年以上独立开发经验。我把视觉设计与网站制作放在同一条交付流程里：先理解业务与内容，再完成界面、交互、开发与上线。形构 Form × Build 是这套工作方式的名字。" path="/about" section={{ title: "关于", href: "/about" }} schema={{ "@type": "ProfilePage", mainEntity: { "@id": personId } }}>
    <section><h2>我负责什么</h2><p>工作重点是 Web 开发、前端视觉设计与全栈交付。既处理公开页面的内容结构和阅读体验，也处理后台、接口、部署与后续维护所需的工程环节。</p><p>你可以从<Link href="/work">公开案例</Link>了解医院、创意店、制造业与家具品牌网站的不同设计方向。案例页面标明展示范围与项目状态。</p></section>
    <section><h2>怎样合作</h2><ol><li>需求与范围：明确受众、页面、更新方式和交付目标，列出需要双方准备的材料。</li><li>设计与开发：由我主导方向、实现与质量把控，依据项目规模安排必要协作。</li><li>验收与交接：按约定检查内容、功能、设备适配和部署，明确源码、账号、数据与维护责任。</li></ol></section>
    <section><h2>独立开发者适合哪些网站项目？</h2><p>适合希望直接与设计和开发负责人沟通的企业官网、外贸展示站，以及需要定制前端、内容管理和接口的网站。已有设计稿、已有后台或旧站改版，也可以先单独确认需要接手的部分。</p><p>公开的<Link href="/work/ruihe-engineering">制造业官网案例</Link>与<Link href="/work/pixel-cafe-montreal">创意店网站案例</Link>展示了不同的内容与功能需求。规模较大、角色较多或需要多人持续值守的项目，应先评估协作和维护安排。</p><p>如果还在比较合作方，可以先看<Link href="/guides/website-developer-selection">找网站开发者时需要核对的五件事</Link>。</p></section>
    <section><h2>先看服务，或直接聊需求</h2><p>如果已经有计划，带上现有网站、参考页面或内容目录就可以开始沟通。不确定范围时，可以先看<Link href="/services">服务说明</Link>与<Link href="/guides/website-project-checklist">需求清单</Link>。</p><p>微信：as14246791。更多联系方式与微信二维码见<Link href="/#contact">作品集联系区</Link>。</p></section>
  </ContentShell>;
}
