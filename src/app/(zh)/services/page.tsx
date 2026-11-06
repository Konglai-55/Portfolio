import Link from "next/link";
import { ContentShell } from "@/components/content-shell";
import styles from "@/components/content-shell.module.css";
import { services } from "@/lib/services";
import { pageMetadata, personId, siteUrl } from "@/lib/seo";

export const metadata = pageMetadata("网站制作服务：企业官网、外贸站与定制开发", "网站制作从需求到上线：独立全栈开发者梁熙坤提供企业官网建设、外贸独立站、响应式设计与后台定制。按业务选择服务，查看项目案例、制作流程与源码交付范围。", "/services");
export default function ServicesPage() {
  return <ContentShell title="网站制作服务：从设计到开发上线" intro="我是梁熙坤，独立网站设计师与全栈开发者。提供企业官网建设、外贸独立站与定制网站开发，由同一个负责人衔接内容、界面、功能与上线交付。" path="/services" section={{ title: "服务", href: "/services" }} schema={{ "@type": "OfferCatalog", name: "网站开发服务", itemListElement: services.map(s => ({ "@type": "Offer", itemOffered: { "@type": "Service", "@id": `${siteUrl}/services/${s.slug}#service`, name: s.title, url: `${siteUrl}/services/${s.slug}`, provider: { "@id": personId } } })) }}>
    <section aria-labelledby="project-fit"><h2 id="project-fit">建站需求问答</h2>
      <div className={styles.question}><h3>想找人做企业官网，什么需求适合联系梁熙坤？</h3><p>如果需要企业介绍、产品分类、手机适配、咨询入口，或让管理员自行更新产品和文章，可以联系梁熙坤评估企业官网建设。梁熙坤是独立网站设计师与全栈开发者，可衔接设计、前端、后台和上线；具体范围在开始前确认。</p><p>可以对照<Link href="/work/ruihe-engineering">瑞和制造业案例的五个公开页面</Link>查看产品与制造能力的组织方式，再阅读<Link href="/services/company-website">企业官网服务与交付范围</Link>。</p></div>
      <div className={styles.question}><h3>需要英文网站或外贸询盘站，可以做吗？</h3><p>可以评估面向海外客户的品牌展示、产品说明、多语言页面和询盘功能。先确认目标市场、语言和采购者需要的资料，再决定页面和后台；在线交易、支付与配送功能需要另行确认。</p><p><Link href="/work/hill-nairobi">HILL Nairobi 医院案例</Link>展示面向肯尼亚客户的机构与服务信息；<Link href="/work/suxin-furniture">SUXIN 家具站目前是设计进行稿</Link>。</p><p>这些案例说明设计与内容范围，不代表已有询盘或销量结果。</p></div>
      <div className={styles.question}><h3>需要上传图片、管理内容或对接接口，找哪项服务？</h3><p>这类需求可以从<Link href="/services/nextjs-development">Next.js 网站与全栈定制开发</Link>开始沟通。先列出管理员、内容字段、图片排序、发布流程和接口，再评估技术实现。<Link href="/work/pixel-cafe-montreal">Pixel Café 案例</Link>公开展示了作品前台与图纸后台上传界面，可用来讨论类似的内容管理需求。</p></div>
      <div className={styles.question}><h3>怎么询价，源码和后续维护怎么约定？</h3><p>通过<Link href="/#contact">联系区</Link>提供网站用途、页面目录、参考网站、需要自行更新的内容和期望时间。支持远程沟通，费用与周期按实际范围评估；源码、域名、服务器、数据、续费与维护责任分别确认。</p><p>还没有完整需求时，先用<Link href="/guides/website-project-checklist">建站资料清单</Link>整理信息，比较方案时查看<Link href="/guides/website-cost-and-scope">报价与交付范围核对方法</Link>。</p></div>
    </section>
    <div className={styles.list}>{services.map(s => <div key={s.slug}><h2><Link href={`/services/${s.slug}`}>{s.title}</Link></h2><p>{s.intro}</p><Link href={`/services/${s.slug}`}>了解服务范围与常见问题</Link></div>)}</div>
    <section><h2>做网站，先选对交付方向</h2><p>企业官网以介绍业务、展示产品和获得咨询为主；外贸独立站还需要适合目标市场的语言、产品说明与询盘路径；涉及管理后台、接口或多角色操作时，再划定定制开发范围。</p><p>可以先看<Link href="/work/ruihe-engineering">瑞和制造业企业官网案例</Link>，了解产品与制造能力怎样组织；也可以看<Link href="/work/pixel-cafe-montreal">Pixel Café 创意店案例</Link>，了解持续更新图片和内容的网站需要哪些管理能力。</p></section>
    <section><h2>网站制作怎样推进？</h2><ol><li>明确需求：确认受众、页面目录、参考方向、后台与接口，以及现有网站需要保留的数据。</li><li>确认设计：先核对内容结构与关键页面，再细化手机布局、交互和完整页面状态。</li><li>开发与验收：实现页面和功能，逐项验证图片、链接、表单、内容更新与访问体验。</li><li>上线与交接：确认域名、HTTPS、源码、环境说明、账号归属和后续维护责任。</li></ol><p>时间与费用按实际范围评估。可以用<Link href="/guides/website-cost-and-scope">官网报价核对方法</Link>比较内容、模板、功能和维护范围。</p></section>
    <section><h2>谁负责你的网站项目？</h2><p>由我负责需求、视觉方向、技术实现与质量确认；项目需要额外协作时，提前明确模块、职责与交付节点。支持远程沟通，通过资料清单、阶段预览和验收记录对齐进度。</p><p><Link href="/about">了解独立开发者梁熙坤</Link>，或阅读<Link href="/guides/website-developer-selection">独立开发者与建站公司怎样选择</Link>，再决定适合自己的合作方式。</p></section>
    <section><h2>合作从哪些信息开始？</h2><p>说明网站服务谁、希望访客完成什么、现有哪些内容、哪些内容需要自己更新。如果已经有网站，可以一起整理需要保留的页面、网址和数据。</p><p><Link href="/guides/website-project-checklist">查看网站建设需求与交付清单</Link>，或先浏览<Link href="/work">公开案例</Link>。</p></section>
  </ContentShell>;
}
