import type { CSSProperties } from "react";
import { CaseStudyDevice } from "./case-study-device";
import styles from "./about-section.module.css";

const stats = [
  {
    value: "5",
    suffix: "+",
    label: "年独立开发",
    note: "Independent practice since 2021",
  },
  {
    value: "170",
    suffix: "+",
    label: "个网站落地",
    note: "20 制造业 · 50 外贸 · 100 企业官网",
  },
  {
    value: "1",
    suffix: "",
    label: "位负责人",
    note: "从需求到维护，全程一个对接人",
  },
] as const;

const capabilities = [
  {
    index: "01",
    title: "Web 开发",
    english: "Engineering",
    caption: "稳定、快速、易维护",
    detail: "以现代前端架构构建兼顾性能、搜索表现与长期维护的产品。",
    tags: ["Next.js", "性能优化", "SEO"],
  },
  {
    index: "02",
    title: "视觉设计",
    english: "Design",
    caption: "清晰、美观、有辨识度",
    detail: "从信息层级到交互动效，为产品建立统一且鲜明的视觉语言。",
    tags: ["UI / UX", "设计系统", "交互动效"],
  },
  {
    index: "03",
    title: "全栈交付",
    english: "Delivery",
    caption: "从需求到部署与维护",
    detail: "覆盖架构、接口、数据与上线流程，持续保障项目稳定运行。",
    tags: ["API 与数据", "部署上线", "长期维护"],
  },
] as const;

const process = [
  {
    index: "01",
    role: "Direction",
    title: "个人主导",
    description:
      "需求分析、技术选型、架构设计、质量把控与最终交付，始终由我一个人负责。",
  },
  {
    index: "02",
    role: "Specialists",
    title: "按需协作",
    description:
      "依据项目规模与技术需求，协调熟悉的专业开发者参与特定模块，分工清晰。",
  },
  {
    index: "03",
    role: "Delivery",
    title: "统一交付",
    description:
      "协作不分散责任：设计、工程与验收标准统一，效率和成果保持一致。",
  },
] as const;

const principles = [
  {
    title: "减少岗位交接",
    description: "常规项目由我直接贯通视觉、交互与开发，缩短决策链。",
  },
  {
    title: "只配置必要能力",
    description: "大型项目先拆解再组队，让专业资源准确进入所需环节。",
  },
  {
    title: "统一质量验收",
    description: "协作不分散责任，设计、工程与最终交付由我统一把控。",
  },
] as const;

const comparisons = [
  {
    label: "常规项目",
    kind: "预估",
    before: { label: "市场参考", value: 10000, text: "¥10,000" },
    after: { label: "轻量协作", value: 8000, text: "¥8,000" },
    saving: "20%",
  },
  {
    label: "低空经济企业官网",
    kind: "真实案例",
    before: { label: "同等范围市场预算", value: 30000, text: "¥30,000+" },
    after: { label: "实际落地", value: 18000, text: "¥18,000" },
    saving: "40%",
  },
] as const;

export function AboutSection() {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.container}>
        <header className={styles.sectionHeader} data-reveal="soft">
          <p>
            <span>03</span>
            About me
          </p>
          <small>Form × Build · One creative direction</small>
        </header>

        {/* Manifesto */}
        <div className={styles.manifesto}>
          <p className={styles.kicker} data-reveal="soft">
            了解我 / About
          </p>
          <p className={styles.manifestoText} data-scrub-text>
            美术出身，五年独立开发。我用审美塑造形式，用工程完成表达——从需求、设计、开发到上线维护，一个人对最终结果负责。
          </p>
        </div>

        <dl className={styles.stats}>
          {stats.map((item, index) => (
            <div
              key={item.label}
              className={styles.stat}
              data-reveal="soft"
              data-reveal-delay={String(index + 1)}
            >
              <dt>
                <span>{item.label}</span>
                <small>{item.note}</small>
              </dt>
              <dd>
                <span
                  data-count-from="0"
                  data-count-to={item.value}
                  data-count-duration="1.2"
                >
                  {item.value}
                </span>
                <i>{item.suffix}</i>
              </dd>
            </div>
          ))}
        </dl>

        {/* Capabilities */}
        <div className={styles.blockHead} data-reveal="soft">
          <span>Core capabilities</span>
          <h2 data-reveal="title">三种能力，一条完整链路。</h2>
        </div>
        <div className={styles.capabilities}>
          {capabilities.map((item) => (
            <article
              key={item.index}
              className={styles.capability}
              tabIndex={0}
              data-reveal="card"
            >
              <header>
                <span>{item.index}</span>
                <small>{item.english}</small>
              </header>
              <div className={styles.capabilityBody}>
                <h3>{item.title}</h3>
                <p className={styles.capabilityCaption}>{item.caption}</p>
                <div className={styles.capabilityMore}>
                  <div>
                    <p>{item.detail}</p>
                    <ul>
                      {item.tags.map((tag) => (
                        <li key={tag}>{tag}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Process */}
        <div className={styles.processIntro}>
          <div data-reveal="left">
            <p className={styles.kicker}>为何选择我 / How it works</p>
            <h2 data-reveal="title">
              一个负责人，
              <span>按需组成一支专业团队。</span>
            </h2>
          </div>
          <p data-reveal="right">
            不需要在个人开发者与高成本团队之间取舍。项目由我统一负责，专业能力随实际需求灵活扩展。
          </p>
        </div>

        <div
          className={styles.process}
          data-scrub-progress
          data-scrub-start="top 80%"
          data-scrub-end="bottom 62%"
        >
          <span className={styles.processRail} aria-hidden="true">
            <i />
          </span>
          <ol className={styles.steps}>
            {process.map((step, index) => (
              <li
                key={step.index}
                className={styles.step}
                style={
                  { "--at": index / (process.length - 1) } as CSSProperties
                }
              >
                <span className={styles.stepDot} aria-hidden="true" />
                <span className={styles.stepIndex}>
                  {step.index} · {step.role}
                </span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Cost */}
        <div className={styles.cost}>
          <div className={styles.costCopy} data-reveal="left">
            <p className={styles.kicker}>
              <b>03.1</b> Cost architecture
            </p>
            <h2 data-reveal="title">
              为什么能
              <span>压缩成本？</span>
            </h2>
            <p className={styles.costLead}>
              压缩的是流程损耗，<em>不是设计与开发质量。</em>
            </p>
            <ul className={styles.principles}>
              {principles.map((item, index) => (
                <li key={item.title}>
                  <span>0{index + 1}</span>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={styles.chart}
            data-reveal="card"
            data-scrub-progress
            data-scrub-start="top 85%"
            data-scrub-end="center 50%"
            aria-label="成本对比"
          >
            <header className={styles.chartHead}>
              <span>Budget comparison</span>
              <small>传统流程 vs 轻量协作</small>
            </header>
            {comparisons.map((item) => (
              <div key={item.label} className={styles.compare}>
                <div className={styles.compareTitle}>
                  <strong>{item.label}</strong>
                  <em>{item.kind}</em>
                  <span className={styles.saving}>−{item.saving}</span>
                </div>
                {[item.before, item.after].map((bar, barIndex) => (
                  <div
                    key={bar.label}
                    className={styles.bar}
                    data-tone={barIndex === 0 ? "before" : "after"}
                    style={
                      {
                        "--value": bar.value / item.before.value,
                      } as CSSProperties
                    }
                  >
                    <span className={styles.barLabel}>{bar.label}</span>
                    <span className={styles.barTrack}>
                      <i />
                    </span>
                    <span className={styles.barValue}>{bar.text}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Case */}
        <article id="case-study-proof" className={styles.caseStudy}>
          <header className={styles.caseHead} data-reveal="soft">
            <span>Case / 01</span>
            <strong>低空经济 · 企业官网</strong>
            <small>Design system · Motion · Development</small>
          </header>
          <div className={styles.caseStage} data-reveal="card">
            <CaseStudyDevice />
          </div>
          <div className={styles.caseCopy}>
            <h3 data-reveal="title">
              从统一风格到开发上线，
              <span>一条不断档的完整流程。</span>
            </h3>
            <p data-reveal="soft">
              多页面企业官网，覆盖品牌风格定稿、全站视觉系统、动效语言、前端开发与上线交付。同等范围的市场预算通常从
              ¥30,000 起；通过提前拆解任务、精准配置协作资源与统一验收，最终以
              ¥18,000 完成交付。
            </p>
          </div>
        </article>

        <blockquote className={styles.statement}>
          <span data-reveal="soft">Flexible team · Consistent delivery</span>
          <p data-scrub-text>
            您获得的不是一个人的有限产能，也不是一支成本高昂、结构冗余的固定团队，而是一套由我统一负责、按项目需求灵活配置的专业开发能力。
          </p>
        </blockquote>
      </div>
    </section>
  );
}
