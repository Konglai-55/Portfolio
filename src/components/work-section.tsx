"use client";

import { useLocale } from "./locale-provider";
import { localize } from "@/lib/i18n";

import { MoveHorizontal } from "lucide-react";
import { projects } from "@/lib/projects";
import { WorkShowcase } from "./work-showcase";
import styles from "./work-section.module.css";

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
  const locale = useLocale();
  return localize((
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
  ), locale);
}
