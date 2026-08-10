import {
  ArrowRight,
  BadgeCheck,
  Compass,
  Network,
  UsersRound,
  Workflow,
} from "lucide-react";
import { CaseStudyDevice } from "./case-study-device";
import styles from "./about-section.module.css";

const capabilities = [
  {
    index: "01",
    title: "Web 开发",
    caption: "稳定、快速、易维护",
    detail: "以现代前端架构构建兼顾性能、搜索表现与长期维护的产品。",
    tags: ["Next.js", "性能优化", "SEO"],
  },
  {
    index: "02",
    title: "视觉设计",
    caption: "清晰、美观、有辨识度",
    detail: "从信息层级到交互动效，为产品建立统一且鲜明的视觉语言。",
    tags: ["UI / UX", "设计系统", "交互动效"],
  },
  {
    index: "03",
    title: "全栈交付",
    caption: "从需求到部署与维护",
    detail: "覆盖架构、接口、数据与上线流程，持续保障项目稳定运行。",
    tags: ["API 与数据", "部署上线", "长期维护"],
  },
] as const;

const collaborationModel = [
  {
    index: "01",
    role: "Direction",
    title: "个人主导",
    description: "由我统一负责需求、架构、品质与最终交付。",
  },
  {
    index: "02",
    role: "Specialists",
    title: "按需协作",
    description: "依据规模与技术需求，灵活匹配专业开发者。",
  },
  {
    index: "03",
    role: "Delivery",
    title: "统一交付",
    description: "明确分工与协作方案，确保效率和成果一致。",
  },
] as const;

const costPrinciples = [
  {
    index: "01",
    role: "Direct craft",
    title: "减少岗位交接",
    description: "常规项目由我直接贯通视觉、交互与开发，缩短决策链。",
  },
  {
    index: "02",
    role: "Precise team",
    title: "只配置必要能力",
    description: "大型项目先拆解再组队，让专业资源准确进入所需环节。",
  },
  {
    index: "03",
    role: "One standard",
    title: "统一质量验收",
    description: "协作不分散责任，设计、工程与最终交付由我统一把控。",
  },
] as const;

const highlights = [
  { value: "5+", label: "年独立开发经验", note: "Independent experience" },
  { value: "Design × Code", label: "设计与开发双重能力", note: "One creative direction" },
  { value: "End to end", label: "从需求到维护完整交付", note: "Full project delivery" },
] as const;

function ProcessSymbol({ type }: { type: (typeof collaborationModel)[number]["role"] }) {
  const Symbol =
    type === "Direction"
      ? Compass
      : type === "Specialists"
        ? Network
        : BadgeCheck;

  return <Symbol aria-hidden="true" strokeWidth={1.45} />;
}

function CostPrincipleSymbol({
  index,
}: {
  index: (typeof costPrinciples)[number]["index"];
}) {
  const Symbol =
    index === "01" ? Workflow : index === "02" ? UsersRound : BadgeCheck;

  return <Symbol aria-hidden="true" strokeWidth={1.35} />;
}

export function AboutSection() {
  return (
    <section id="about" className={styles.section} data-scroll-shift="0.6">
      <div
        className={styles.watermark}
        data-reveal="soft"
        aria-hidden="true"
      >
        ABOUT
      </div>

      <div className={styles.container}>
        <header className={styles.sectionHeader} data-reveal="soft">
          <p className={styles.sectionIndex}>
            <span>01</span>
            About me
          </p>
          <p className={styles.discipline}>Form × Build · One creative direction</p>
        </header>

        <div className={styles.highlights} aria-label="核心经验概览">
          {highlights.map((item, index) => (
            <article
              key={item.value}
              className={styles.highlight}
              data-reveal="soft"
              data-reveal-delay={String(index + 1)}
            >
              <strong>{item.value}</strong>
              <span>{item.label}</span>
              <small>{item.note}</small>
            </article>
          ))}
        </div>

        <div className={styles.introGrid}>
          <div className={styles.titleBlock} data-reveal="left">
            <p className={styles.chineseLabel}>了解我</p>
            <h2 data-reveal="title">
              以审美塑造形式，
              <span>以工程完成表达。</span>
            </h2>
          </div>

          <div className={styles.introContent} data-reveal="right">
            <p className={styles.lead}>
              美术出身，但拥有 5 年以上独立开发经验，长期专注于 Web
              开发、前端视觉设计及全栈网站建设。具备从需求分析、产品设计、技术架构到开发部署与后期维护的完整项目交付能力，能够独立完成兼顾用户体验、视觉表现、性能优化与业务需求的高质量网站项目。
            </p>

            <div className={styles.capabilityHeader} data-reveal="soft">
              <span>Core capabilities</span>
              <small>悬停或聚焦查看详情</small>
            </div>
            <div className={styles.capabilities}>
              {capabilities.map((item, index) => (
                <article
                  key={item.index}
                  className={styles.capability}
                  tabIndex={0}
                  data-reveal="soft"
                  data-reveal-delay={String(index + 1)}
                >
                  <span className={styles.capabilityIndex}>{item.index}</span>
                  <div className={styles.capabilityMain}>
                    <h3 data-reveal="title">{item.title}</h3>
                    <p>{item.caption}</p>
                  </div>
                  <div className={styles.capabilityDetails}>
                    <p>{item.detail}</p>
                    <div className={styles.capabilityTags}>
                      {item.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <span className={styles.capabilityArrow} aria-hidden="true">
                    ↗
                  </span>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.divider} data-reveal="soft" />

        <div className={styles.whyGrid}>
          <div className={styles.whyHeading} data-reveal="left">
            <p className={styles.chineseLabel}>为何选择我</p>
            <h2 data-reveal="title">一个负责人，按需组成一支专业团队。</h2>
            <p>
              不需要在个人开发者与高成本团队之间取舍。项目由我统一负责，专业能力随实际需求灵活扩展。
            </p>
          </div>

          <div className={styles.whyContent}>
            <header className={styles.processHeader} data-reveal="soft">
              <span>How it works</span>
              <p>一条清晰、连续的项目责任链</p>
            </header>

            <div className={styles.model}>
              {collaborationModel.map((item, index) => (
                <article
                  key={item.index}
                  className={styles.modelCard}
                  data-reveal="soft"
                  data-reveal-delay={String(index + 1)}
                >
                  <span className={styles.modelIndex}>{item.index}</span>
                  <span className={styles.modelSymbol}>
                    <ProcessSymbol type={item.role} />
                  </span>
                  <div>
                    <span className={styles.modelRole}>{item.role}</span>
                    <h3 data-reveal="title">{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className={styles.detailCopy}>
              <article className={styles.detailPanel} data-reveal="soft">
                <span>01 / 项目管理</span>
                <h3 data-reveal="title">从需求到交付，始终只有一个负责人。</h3>
                <p>
                  项目由我全程负责需求分析、技术选型、架构设计、质量把控与最终交付；同时根据项目规模和技术需求，协调熟悉的专业开发者参与特定模块，并制定清晰的分工方案。
                </p>
              </article>
              <article
                className={styles.detailPanel}
                data-reveal="soft"
                data-reveal-delay="1"
              >
                <span>02 / 效率与成本</span>
                <h3 data-reveal="title">需要什么能力，就配置什么能力。</h3>
                <p>
                  这种模式既突破个人单打独斗的效率与能力边界，也减少固定团队的人力和管理成本，在保证质量与交付稳定性的同时，提供更具性价比的定制化服务。
                </p>
              </article>
              <aside
                id="workflow-efficiency"
                className={styles.savingSummary}
                data-reveal="soft"
                data-reveal-delay="2"
              >
                <div className={styles.savingSummaryLabel}>
                  <span>Lean workflow efficiency</span>
                  <small>轻量协作带来的流程优势</small>
                </div>
                <p>
                  精简协作链路，预估降低传统流程{" "}
                  <strong
                    data-count-to="20"
                    data-count-suffix="%"
                    data-count-duration="1"
                  >
                    20%
                  </strong>{" "}
                  开支
                </p>
                <div className={styles.priceFlow}>
                  <div className={styles.pricePoint}>
                    <small>市场参考</small>
                    <del
                      data-count-to="10000"
                      data-count-prefix="¥"
                      data-count-duration="1.15"
                    >
                      ¥10,000
                    </del>
                  </div>
                  <ArrowRight
                    className={styles.priceArrow}
                    size={22}
                    strokeWidth={1.35}
                    aria-hidden="true"
                  />
                  <div
                    className={`${styles.pricePoint} ${styles.pricePointTarget}`}
                  >
                    <small>轻量协作预估</small>
                    <strong
                      data-count-from="10000"
                      data-count-to="8000"
                      data-count-prefix="¥"
                      data-count-duration="1.35"
                    >
                      ¥8,000
                    </strong>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>

        <section
          className={styles.costProof}
          aria-labelledby="cost-proof-title"
        >
          <header className={styles.costProofIntro}>
            <div className={styles.costProofHeading} data-reveal="left">
              <p className={styles.costProofIndex}>
                <span>02.1</span>
                Cost architecture
              </p>
              <h2 id="cost-proof-title" data-reveal="title">
                为什么能
                <span>压缩成本？</span>
              </h2>
            </div>

            <div className={styles.costProofCopy} data-reveal="right">
              <p className={styles.costProofLead}>
                压缩的是流程损耗，
                <span>不是设计与开发质量。</span>
              </p>
              <p>
                对于常规项目，我凭借美术训练、长期设计实践和 5
                年以上开发经验，直接完成从风格定稿、界面设计到技术落地，减少跨岗位交接。面对大型项目，我会在启动前拆解模块，调用长期合作的设计与开发资源，以点对点沟通、明确分工和统一验收完成资源重组。成本优势来自更短的决策链与更精准的人员配置，最终质量仍由我负责。
              </p>
            </div>
          </header>

          <div className={styles.costPrinciples} aria-label="成本优化方法">
            {costPrinciples.map((item, index) => (
              <article
                key={item.index}
                className={styles.costPrinciple}
                data-reveal="soft"
                data-reveal-delay={String(index + 1)}
              >
                <div className={styles.costPrincipleMeta}>
                  <span>{item.index}</span>
                  <CostPrincipleSymbol index={item.index} />
                </div>
                <small>{item.role}</small>
                <h3 data-reveal="title">{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>

          <article
            id="case-study-proof"
            className={styles.caseStudy}
            data-reveal="soft"
          >
            <header className={styles.caseStudyHeader}>
              <div>
                <span>Case / 01</span>
                <strong>低空经济 · 企业官网</strong>
              </div>
              <p>Design system · Motion · Development</p>
            </header>

            <div className={styles.caseStage} data-scroll-shift="0.32">
              <span className={styles.caseStageNumber} aria-hidden="true">
                01
              </span>
              <div className={styles.caseStageCaption} aria-hidden="true">
                <span>REAL PROJECT</span>
                <i />
                <span>74 SEC</span>
              </div>
              <CaseStudyDevice />
            </div>

            <footer className={styles.caseStudyFooter}>
              <div className={styles.caseSummary} data-reveal="left">
                <span>Project evidence</span>
                <h3 data-reveal="title">
                  从统一风格到开发上线，
                  <em>一条连续的一线流程。</em>
                </h3>
                <p>
                  这是一个低空经济公司的多页面企业官网，覆盖品牌风格定稿、全站视觉系统、动效语言、前端开发与上线交付。同等范围的市场预算通常从
                  ¥30,000
                  起；通过提前拆解任务、精准配置协作资源与统一验收，最终以
                  ¥18,000 完成交付。
                </p>
              </div>

              <div className={styles.caseEconomics} data-reveal="right">
                <div className={styles.casePrice}>
                  <small>同等范围市场预算</small>
                  <del>¥30,000+</del>
                </div>
                <ArrowRight
                  className={styles.casePriceArrow}
                  size={24}
                  strokeWidth={1.25}
                  aria-hidden="true"
                />
                <div className={`${styles.casePrice} ${styles.casePriceFinal}`}>
                  <small>实际落地价格</small>
                  <strong
                    data-count-from="30000"
                    data-count-to="18000"
                    data-count-prefix="¥"
                    data-count-duration="1.6"
                  >
                    ¥18,000
                  </strong>
                </div>
                <div className={styles.caseReduction}>
                  <small>整体预算降低</small>
                  <strong
                    data-count-to="40"
                    data-count-suffix="%"
                    data-count-duration="1.3"
                  >
                    40%
                  </strong>
                </div>
              </div>
            </footer>
          </article>
        </section>

        <blockquote className={styles.statement} data-reveal="soft">
          <span>Flexible team · Consistent delivery</span>
          <p>
            您获得的不是一个人的有限产能，也不是一支成本高昂、结构冗余的固定团队，而是一套由我统一负责、按项目需求灵活配置的专业开发能力。
          </p>
        </blockquote>
      </div>
    </section>
  );
}
