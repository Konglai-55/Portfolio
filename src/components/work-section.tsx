import { MoveHorizontal } from "lucide-react";
import { mediaUrl } from "@/lib/media";
import type { ProjectPreviewPage } from "./project-preview-stack";
import { WorkShowcase, type ShowcaseProject } from "./work-showcase";
import styles from "./work-section.module.css";

const hillPreviewPages = [
  {
    index: "01",
    label: "Home / About",
    src: mediaUrl("images/project-hill-page-1.png"),
    width: 1440,
    height: 5032,
    alt: "HILL Nairobi 医院官网首页与品牌介绍完整长页",
  },
  {
    index: "02",
    label: "Services",
    src: mediaUrl("images/project-hill-page-2.png"),
    width: 1440,
    height: 6678,
    alt: "HILL Nairobi 医院官网服务项目完整长页",
  },
  {
    index: "03",
    label: "FAQs",
    src: mediaUrl("images/project-hill-page-3.png"),
    width: 1440,
    height: 2555,
    alt: "HILL Nairobi 医院官网常见问题完整长页",
  },
] satisfies readonly ProjectPreviewPage[];

const pixelCafePreviewPages = [
  {
    index: "01",
    label: "Full website",
    src: mediaUrl("images/project-pixel-cafe-full.png"),
    width: 1440,
    height: 4711,
    alt: "加拿大 Pixel Café 拼豆店官网完整长页",
  },
  {
    index: "02",
    label: "CMS / Upload",
    src: mediaUrl("images/project-pixel-cafe-admin.png"),
    width: 2549,
    height: 1235,
    alt: "Pixel Café 拼豆图纸后台上传与内容管理界面",
  },
] satisfies readonly ProjectPreviewPage[];

const ruihePreviewPages = [
  {
    index: "01",
    label: "Home",
    src: mediaUrl("images/project-ruihe-home.png"),
    width: 1440,
    height: 7479,
    alt: "衡水瑞和制造业企业官网首页完整长页",
  },
  {
    index: "02",
    label: "About",
    src: mediaUrl("images/project-ruihe-about.png"),
    width: 1440,
    height: 4519,
    alt: "衡水瑞和制造业企业官网关于企业完整长页",
  },
  {
    index: "03",
    label: "Products",
    src: mediaUrl("images/project-ruihe-products.png"),
    width: 1440,
    height: 6888,
    alt: "衡水瑞和制造业企业官网产品中心完整长页",
  },
  {
    index: "04",
    label: "Manufacturing",
    src: mediaUrl("images/project-ruihe-quality.png"),
    width: 1440,
    height: 3699,
    alt: "衡水瑞和制造业企业官网制造与质量完整长页",
  },
  {
    index: "05",
    label: "Contact",
    src: mediaUrl("images/project-ruihe-contact.png"),
    width: 1440,
    height: 2661,
    alt: "衡水瑞和制造业企业官网项目联系完整长页",
  },
] satisfies readonly ProjectPreviewPage[];

const suxinPreviewPages = [
  {
    index: "01",
    label: "Homepage",
    src: mediaUrl("images/project-suxin-furniture.png"),
    width: 1440,
    height: 8086,
    alt: "SUXIN 家具品牌外贸站首页完整长页",
  },
] satisfies readonly ProjectPreviewPage[];

const projects: readonly ShowcaseProject[] = [
  {
    index: "01",
    pages: hillPreviewPages,
    title: "HILL Nairobi",
    category: "Healthcare website · Kenya",
    status: "完整案例",
    accent: "#f2a078",
    description:
      "一家位于肯尼亚的医院官网。客户希望在体现医疗机构专业、严谨感的同时，保留面向女性客户所需要的温馨与安全感。",
    result: "专业可信 × 温馨安全",
    period: "Kenya",
  },
  {
    index: "02",
    pages: pixelCafePreviewPages,
    title: "Pixel Café Montréal",
    category: "Creative commerce · Canada",
    status: "完整案例",
    accent: "#f2bd3f",
    description:
      "一家位于加拿大的拼豆创意店。客户希望拥有清晰丰富的拼豆作品展示区、优秀的移动端体验，以及便于持续更新图纸与内容的后台上传功能。",
    result: "活力文艺 × 流畅有趣",
    period: "Montréal · Canada",
  },
  {
    index: "03",
    pages: ruihePreviewPages,
    title: "Ruihe Engineering",
    category: "Industrial website · China",
    status: "完整案例",
    accent: "#c94719",
    description:
      "一家服务铁路、电力配件及接触网专业设备领域的制造业企业官网。项目将专业制造、可靠交付与真实工程能力转化为清晰的信息架构，完整承载产品体系、制造资质、合作网络与项目咨询。",
    result: "专业制造 × 可靠交付",
    period: "Hebei · China",
  },
  {
    index: "04",
    pages: suxinPreviewPages,
    title: "SUXIN Furniture",
    category: "Furniture export website · Global",
    status: "正在制作中",
    accent: "#9c6a2f",
    description:
      "一个面向海外市场的家具品牌外贸站。以深色空间影像与编辑式排版建立高端品牌气质，围绕产品系列、工艺能力、项目案例与合作咨询，构建兼顾品牌表达和海外询盘转化的完整体验。",
    result: "品牌叙事 × 海外询盘",
    period: "Global market",
  },
];

const moreWorkStats = [
  {
    overline: "Manufacturing",
    value: "20",
    label: "家制造业官网",
  },
  {
    overline: "Global commerce",
    value: "50",
    label: "家外贸独立站",
  },
  {
    overline: "Corporate",
    value: "100",
    label: "家企业官网",
  },
  {
    overline: "Bespoke needs",
    value: "MORE",
    label: "细分行业与定制需求",
  },
] as const;

export function WorkSection() {
  return (
    <section id="work" className={styles.section}>
      <div className={styles.watermark} aria-hidden="true">
        WORK
      </div>

      <div className={styles.container}>
        <header className={styles.sectionHeader} data-reveal="soft">
          <p>
            <span>01</span>
            Form · Build · Result
          </p>
          <small>Selected work / 2024—2026</small>
        </header>

        <div className={styles.headingGrid}>
          <div className={styles.heading} data-reveal="left">
            <p>我的作品 / Selected archive</p>
            <h2 data-reveal="title">
              作品不是截图，
              <span>是被解决的问题。</span>
            </h2>
          </div>

          <div className={styles.galleryIntro} data-reveal="right">
            <p>
              每个项目将完整呈现目标、设计判断、技术实现与交付成果，而不是只展示最终画面。
            </p>
            <div className={styles.scrollCue}>
              <MoveHorizontal size={18} strokeWidth={1.4} aria-hidden="true" />
              <span>
                Scroll-linked archive
                <small>上下滚动浏览精选作品</small>
              </span>
            </div>
          </div>
        </div>

      </div>

      <WorkShowcase projects={projects} />

      <div
        className={styles.moreWorks}
        aria-labelledby="more-works-title"
        data-reveal="soft"
      >
        <div className={styles.container}>
          <div className={styles.moreWorksHeader}>
            <div>
              <p>Beyond the selected four / 更多作品</p>
              <h3 id="more-works-title">
                远不止这四个，
                <span>更多经验仍在持续发生。</span>
              </h3>
            </div>
            <p>
              目前已开发 20 家制造业官网、50 家外贸独立站及 100
              家企业官网。更细分的行业、更复杂的功能与不同阶段的网站需求，也有对应的落地经验。
            </p>
          </div>
        </div>

        <div className={styles.moreWorksViewport}>
          <div className={styles.moreWorksTrack}>
            {[0, 1].map((copyIndex) => (
              <div
                key={copyIndex}
                className={styles.moreWorksGroup}
                role={copyIndex === 0 ? "list" : undefined}
                aria-hidden={copyIndex === 1 ? true : undefined}
              >
                {moreWorkStats.map((item) => (
                  <div
                    key={`${copyIndex}-${item.overline}`}
                    className={styles.moreWorksItem}
                    role={copyIndex === 0 ? "listitem" : undefined}
                  >
                    <small>{item.overline}</small>
                    <strong>
                      <b>{item.value}</b>
                      <span>{item.label}</span>
                    </strong>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className={`${styles.container} ${styles.moreWorksFooter}`}>
          <span>Different industry · Different scale · Same ownership</span>
          <p>不套模板，按行业、受众、功能与交付阶段重新组织解决方案。</p>
        </div>
      </div>

      <div className={styles.container}>
        <footer className={styles.archiveFooter} data-reveal="soft">
          <span>Form × Build · Selected archive</span>
          <p>真实项目持续更新，当前展示四个代表案例。</p>
        </footer>
      </div>
    </section>
  );
}
