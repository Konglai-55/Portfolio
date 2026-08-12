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
    title: "作品 03",
    category: "Product experience",
    status: "内容待补充",
    visual: "product",
    mark: "03",
    accent: "#467b8f",
    surface: "#d6e1e3",
    surfaceAlt: "#f6f7f4",
    ink: "#1c3440",
  },
  {
    index: "04",
    title: "作品 04",
    category: "Creative development",
    status: "内容待补充",
    visual: "night",
    mark: "DEPTH",
    accent: "#bd8060",
    surface: "#151b22",
    surfaceAlt: "#262f39",
    ink: "#edf1f2",
  },
  {
    index: "05",
    title: "作品 05",
    category: "Commerce system",
    status: "预留案例位",
    visual: "commerce",
    mark: "05",
    accent: "#b66e53",
    surface: "#e7ded9",
    surfaceAlt: "#fbf7f3",
    ink: "#382b28",
  },
  {
    index: "06",
    title: "作品 06",
    category: "Service platform",
    status: "预留案例位",
    visual: "service",
    mark: "FLOW",
    accent: "#50768b",
    surface: "#cfdde2",
    surfaceAlt: "#eff4f5",
    ink: "#263b46",
  },
  {
    index: "07",
    title: "作品 07",
    category: "Management product",
    status: "预留案例位",
    visual: "system",
    mark: "SYS",
    accent: "#7b7194",
    surface: "#dcd9e2",
    surfaceAlt: "#f5f3f6",
    ink: "#302c3d",
  },
  {
    index: "08",
    title: "作品 08",
    category: "Brand archive",
    status: "预留案例位",
    visual: "archive",
    mark: "08",
    accent: "#907451",
    surface: "#ddd6c8",
    surfaceAlt: "#f4efe6",
    ink: "#302b24",
  },
] as const;

type Project = (typeof projects)[number];

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
          <small>{project.index} / 08</small>
        </div>

        {"image" in project ? (
          <div className={styles.projectCoverFrame}>
            <Image
              className={styles.projectCover}
              src={project.image}
              alt={project.alt}
              fill
              sizes="(max-width: 700px) 100vw, (max-width: 900px) 48vw, 32rem"
            />
          </div>
        ) : (
          <div className={styles.composition} aria-hidden="true">
            <span className={styles.shapeOne} />
            <span className={styles.shapeTwo} />
            <span className={styles.shapeThree} />
            <strong>{project.mark}</strong>
            <div className={styles.interface}>
              <span />
              <span />
              <span />
              <i />
            </div>
          </div>
        )}

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

      <div
        className={`${styles.cardCaption} ${
          "description" in project ? styles.cardCaptionDetailed : ""
        }`}
      >
        <div>
          <span className={styles.cardIndex}>{project.index}</span>
          <div>
            {"description" in project ? (
              <p className={styles.projectDescription}>
                {project.description}
              </p>
            ) : (
              <>
                <h3>{project.title}</h3>
                <p>{project.category}</p>
              </>
            )}
          </div>
        </div>

        {"result" in project ? (
          <div className={styles.valueStrip}>
            <span>Delivery proof</span>
            <strong>{project.result}</strong>
            <small>{project.period}</small>
          </div>
        ) : (
          <span className={styles.cardStatus}>{project.status}</span>
        )}

        {"pricing" in project ? (
          <div className={styles.projectPricing}>
            <span className={styles.marketPrice}>
              <small>市场价</small>
              <del>{project.pricing.market}</del>
            </span>
            <span className={styles.priceArrow} aria-hidden="true">
              →
            </span>
            <span className={styles.deliveryPrice}>
              <small>落地价</small>
              <strong>{project.pricing.delivery}</strong>
            </span>
          </div>
        ) : null}
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
  const secondRowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const rows = [firstRowRef.current, secondRowRef.current].filter(
      (row): row is HTMLDivElement => Boolean(row),
    );
    if (!section || rows.length !== 2) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const compact = window.matchMedia("(max-width: 700px)").matches;

    if (reduceMotion || compact) {
      gsap.set(rows, { x: 0 });
      return;
    }

    const context = gsap.context(() => {
      rows.forEach((row, index) => {
        const direction = index === 0 ? 1 : -1;

        gsap.fromTo(
          row,
          {
            x: () => direction * Math.min(window.innerWidth * 0.085, 150),
          },
          {
            x: () => direction * Math.min(window.innerWidth * -0.085, 150),
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
      });
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
                <small>上下滚动浏览双向作品墙</small>
              </span>
            </div>
          </div>
        </div>

        <div className={styles.archiveHeader} data-reveal="soft">
          <span>Archive capacity</span>
          <strong>01—08</strong>
          <p>两排 · 最多八个完整案例</p>
        </div>
      </div>

      <div
        ref={galleryRef}
        className={styles.gallery}
        aria-label="作品展示，共八个案例位"
      >
        <div ref={firstRowRef} className={styles.projectRow} role="list">
          {projects.slice(0, 4).map((project) => (
            <div key={project.index} role="listitem">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        <div
          ref={secondRowRef}
          className={`${styles.projectRow} ${styles.projectRowReverse}`}
          role="list"
        >
          {projects.slice(4, 8).map((project) => (
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

      <div className={styles.container}>
        <footer className={styles.archiveFooter} data-reveal="soft">
          <span>Form × Build · Selected archive</span>
          <p>案例内容将根据真实项目资料逐步补充。</p>
        </footer>
      </div>
    </section>
  );
}
