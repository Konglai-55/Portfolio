"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, type CSSProperties } from "react";
import { ArrowUpRight, MoveHorizontal } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mediaUrl } from "@/lib/media";
import {
  ProjectPreviewStack,
  type ProjectPreviewPage,
} from "./project-preview-stack";
import styles from "./work-section.module.css";

gsap.registerPlugin(ScrollTrigger);

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
    src: "/images/project-ruihe-home.png",
    width: 1440,
    height: 7479,
    alt: "衡水瑞和制造业企业官网首页完整长页",
  },
  {
    index: "02",
    label: "About",
    src: "/images/project-ruihe-about.png",
    width: 1440,
    height: 4519,
    alt: "衡水瑞和制造业企业官网关于企业完整长页",
  },
  {
    index: "03",
    label: "Products",
    src: "/images/project-ruihe-products.png",
    width: 1440,
    height: 6888,
    alt: "衡水瑞和制造业企业官网产品中心完整长页",
  },
  {
    index: "04",
    label: "Manufacturing",
    src: "/images/project-ruihe-quality.png",
    width: 1440,
    height: 3699,
    alt: "衡水瑞和制造业企业官网制造与质量完整长页",
  },
  {
    index: "05",
    label: "Contact",
    src: "/images/project-ruihe-contact.png",
    width: 1440,
    height: 2661,
    alt: "衡水瑞和制造业企业官网项目联系完整长页",
  },
] satisfies readonly ProjectPreviewPage[];

const suxinPreviewPages = [
  {
    index: "01",
    label: "Homepage",
    src: "/images/project-suxin-furniture.png",
    width: 1440,
    height: 8086,
    alt: "SUXIN 家具品牌外贸站首页完整长页",
  },
] satisfies readonly ProjectPreviewPage[];

const projects = [
  {
    index: "01",
    title: "HILL Nairobi",
    category: "Healthcare website · Kenya",
    status: "完整案例",
    visual: "cover",
    mark: "01",
    accent: "#f2a078",
    surface: "#dce7ec",
    surfaceAlt: "#fffaf6",
    ink: "#174a72",
    image: mediaUrl("images/project-hill-nairobi.png"),
    alt: "肯尼亚 HILL Nairobi 女性专科医院官网首页",
    description:
      "一家位于肯尼亚的医院官网。客户希望在体现医疗机构专业、严谨感的同时，保留面向女性客户所需要的温馨与安全感。",
    result: "专业可信 × 温馨安全",
    period: "Kenya",
    pricing: {
      market: "¥15,000+",
      delivery: "¥8,000",
    },
  },
  {
    index: "02",
    title: "Pixel Café Montréal",
    category: "Creative commerce · Canada",
    status: "完整案例",
    visual: "cover",
    mark: "02",
    accent: "#f2bd3f",
    surface: "#f2eadc",
    surfaceAlt: "#fff8ec",
    ink: "#3a3029",
    image: mediaUrl("images/project-pixel-cafe-home.png"),
    alt: "加拿大 Pixel Café 拼豆创意店官网首页",
    description:
      "一家位于加拿大的拼豆创意店。客户希望拥有清晰丰富的拼豆作品展示区、优秀的移动端体验，以及便于持续更新图纸与内容的后台上传功能。",
    result: "活力文艺 × 流畅有趣",
    period: "Montréal · Canada",
    pricing: {
      market: "¥10,000+",
      delivery: "¥5,000",
    },
  },
  {
    index: "03",
    title: "Ruihe Engineering",
    category: "Industrial website · China",
    status: "完整案例",
    visual: "cover",
    mark: "03",
    accent: "#c94719",
    surface: "#d9e1e3",
    surfaceAlt: "#f5f1e8",
    ink: "#0b2940",
    image: "/images/project-ruihe-home.png",
    alt: "衡水瑞和制造业企业官网首页",
    coverCrop: true,
    description:
      "一家服务铁路、电力配件及接触网专业设备领域的制造业企业官网。项目将专业制造、可靠交付与真实工程能力转化为清晰的信息架构，完整承载产品体系、制造资质、合作网络与项目咨询。",
    result: "专业制造 × 可靠交付",
    period: "Hebei · China",
    pricing: {
      delivery: "¥5,000",
    },
  },
  {
    index: "04",
    title: "SUXIN Furniture",
    category: "Furniture export website · Global",
    status: "正在制作中",
    visual: "cover",
    mark: "04",
    accent: "#9c6a2f",
    surface: "#d9d4ca",
    surfaceAlt: "#eee8dd",
    ink: "#201b18",
    image: "/images/project-suxin-furniture.png",
    alt: "SUXIN 高端家具品牌外贸站首页",
    coverCrop: true,
    description:
      "一个面向海外市场的家具品牌外贸站。以深色空间影像与编辑式排版建立高端品牌气质，围绕产品系列、工艺能力、项目案例与合作咨询，构建兼顾品牌表达和海外询盘转化的完整体验。",
    result: "品牌叙事 × 海外询盘",
    period: "Global market",
    pricing: {
      delivery: "正在制作中",
    },
  },
] as const;

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

type Project = (typeof projects)[number];
const projectCountLabel = String(projects.length).padStart(2, "0");

function ProjectCard({ project }: { project: Project }) {
  const palette = {
    "--project-accent": project.accent,
    "--project-surface": project.surface,
    "--project-surface-alt": project.surfaceAlt,
    "--project-ink": project.ink,
  } as CSSProperties;

  return (
    <article
      className={styles.projectCard}
      style={palette}
      data-visual={project.visual}
      aria-label={`${project.title}，${project.category}，${project.status}`}
    >
      <div className={styles.projectVisual}>
        <div className={styles.canvasHeader}>
          <span>Liangxikun / Selected archive</span>
          <small>
            {project.index} / {projectCountLabel}
          </small>
        </div>

        <div className={styles.projectCoverFrame}>
          <Image
            className={`${styles.projectCover} ${
              "coverCrop" in project && project.coverCrop
                ? styles.projectCoverCrop
                : ""
            }`}
            src={project.image}
            alt={project.alt}
            fill
            sizes="(max-width: 700px) 100vw, (max-width: 900px) 48vw, 32rem"
          />
        </div>

        <div className={styles.canvasFooter}>
          <span>{project.category}</span>
          <ArrowUpRight size={15} strokeWidth={1.45} aria-hidden="true" />
        </div>
      </div>

      {project.index === "01" ? (
        <ProjectPreviewStack
          projectTitle="HILL Nairobi"
          pages={hillPreviewPages}
          triggerLabel="完整页面"
        />
      ) : null}

      {project.index === "02" ? (
        <ProjectPreviewStack
          projectTitle="Pixel Café Montréal"
          pages={pixelCafePreviewPages}
          triggerLabel="项目画面"
        />
      ) : null}

      {project.index === "03" ? (
        <ProjectPreviewStack
          projectTitle="Ruihe Engineering"
          pages={ruihePreviewPages}
          triggerLabel="项目页面"
        />
      ) : null}

      {project.index === "04" ? (
        <ProjectPreviewStack
          projectTitle="SUXIN Furniture"
          pages={suxinPreviewPages}
          triggerLabel="完整页面"
        />
      ) : null}

      <div className={`${styles.cardCaption} ${styles.cardCaptionDetailed}`}>
        <div>
          <span className={styles.cardIndex}>{project.index}</span>
          <div>
            <p className={styles.projectDescription}>{project.description}</p>
          </div>
        </div>

        <div className={styles.valueStrip}>
          <span>Delivery proof</span>
          <strong>{project.result}</strong>
          <small>{project.period}</small>
        </div>

        <div className={styles.projectPricing}>
          {"market" in project.pricing ? (
            <>
              <span className={styles.marketPrice}>
                <small>市场价</small>
                <del>{project.pricing.market}</del>
              </span>
              <span className={styles.priceArrow} aria-hidden="true">
                →
              </span>
            </>
          ) : null}
          <span className={styles.deliveryPrice}>
            <small>落地价</small>
            <strong>{project.pricing.delivery}</strong>
          </span>
        </div>
      </div>
    </article>
  );
}

export function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorBubbleRef = useRef<HTMLDivElement>(null);
  const firstRowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const row = firstRowRef.current;
    if (!section || !row) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const compact = window.matchMedia("(max-width: 700px)").matches;

    if (reduceMotion || compact) {
      gsap.set(row, { x: 0 });
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        row,
        {
          x: () => Math.min(window.innerWidth * 0.085, 150),
        },
        {
          x: () => Math.min(window.innerWidth * -0.085, 150),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        },
      );
    }, section);

    return () => {
      context.revert();
    };
  }, []);

  useLayoutEffect(() => {
    const gallery = galleryRef.current;
    const cursor = cursorRef.current;
    const cursorBubble = cursorBubbleRef.current;
    if (!gallery || !cursor || !cursorBubble) return;

    const supportsHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    if (!supportsHover) return;

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      force3D: true,
    });
    gsap.set(cursorBubble, {
      autoAlpha: 0,
      scale: 0.2,
      force3D: true,
    });

    const setX = gsap.quickSetter(cursor, "x", "px");
    const setY = gsap.quickSetter(cursor, "y", "px");
    let visible = false;

    const show = () => {
      if (visible) return;
      visible = true;
      cursorBubble.dataset.active = "true";
      gsap.to(cursorBubble, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.45)",
        overwrite: "auto",
      });
    };

    const hide = () => {
      if (!visible) return;
      visible = false;
      cursorBubble.dataset.active = "false";
      gsap.to(cursorBubble, {
        autoAlpha: 0,
        scale: 0.35,
        duration: 0.2,
        ease: "power2.in",
        overwrite: "auto",
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("article")
          : null;
      if (!target || !gallery.contains(target)) {
        hide();
        return;
      }

      setX(event.clientX);
      setY(event.clientY);
      show();
    };

    gallery.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    gallery.addEventListener("pointerleave", hide);

    return () => {
      gallery.removeEventListener("pointermove", handlePointerMove);
      gallery.removeEventListener("pointerleave", hide);
      gsap.killTweensOf(cursor);
      gsap.killTweensOf(cursorBubble);
    };
  }, []);

  return (
    <section id="work" ref={sectionRef} className={styles.section}>
      <div className={styles.watermark} aria-hidden="true">
        WORK
      </div>

      <div className={styles.container}>
        <header className={styles.sectionHeader} data-reveal="soft">
          <p>
            <span>02</span>
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

        <div className={styles.archiveHeader} data-reveal="soft">
          <span>Archive capacity</span>
          <strong>01—04</strong>
          <p>四个真实案例 · 持续更新</p>
        </div>
      </div>

      <div
        ref={galleryRef}
        className={styles.gallery}
        aria-label="作品展示，共四个案例"
      >
        <div ref={firstRowRef} className={styles.projectRow} role="list">
          {projects.map((project) => (
            <div key={project.index} role="listitem">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>

      <div
        ref={cursorRef}
        className={styles.workCursor}
        aria-hidden="true"
      >
        <div
          ref={cursorBubbleRef}
          className={styles.workCursorBubble}
          data-active="false"
        >
          <svg
            className={styles.workCursorWave}
            viewBox="0 0 120 200"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className={styles.workCursorWaveBack}
              d="M-12 34 C 5 17, 22 49, 40 32 S 76 17, 96 33 S 124 42, 136 28 V200 H-12 Z"
            />
            <path
              className={styles.workCursorWaveFront}
              d="M-12 44 C 8 25, 26 58, 48 40 S 85 26, 104 43 S 127 48, 136 37 V200 H-12 Z"
            />
          </svg>
          <span>预览</span>
        </div>
      </div>

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
