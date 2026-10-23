"use client";

import Image from "next/image";
import {
  Fragment,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ProjectLightbox,
  type ActivePreview,
  type ProjectPreviewPage,
} from "./project-preview-stack";
import styles from "./work-showcase.module.css";
import workStyles from "./work-section.module.css";

gsap.registerPlugin(ScrollTrigger);

export type ShowcaseProject = {
  index: string;
  title: string;
  category: string;
  status: string;
  accent: string;
  description: string;
  result: string;
  period: string;
  pages: readonly ProjectPreviewPage[];
};

// Keep in sync with the pinned layout media query in work-showcase.module.css.
const pinnedQuery =
  "(min-width: 901px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)";
const stackedMotionQuery =
  "(prefers-reduced-motion: no-preference) and ((max-width: 900px) or (max-height: 619px))";

const holdDuration = 1;
const swapDuration = 0.55;

function ShowcaseTitle({ title }: { title: string }) {
  return (
    <h3 className={styles.title} aria-label={title}>
      {title.split(" ").map((word, wordIndex) => (
        <Fragment key={`${word}-${wordIndex}`}>
          {wordIndex > 0 ? " " : null}
          <span className={styles.titleWord} aria-hidden="true">
            {Array.from(word).map((char, charIndex) => (
              <span
                key={charIndex}
                className={styles.titleChar}
                data-title-char
              >
                {char}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </h3>
  );
}

export function WorkShowcase({
  projects,
}: {
  projects: readonly ShowcaseProject[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorBubbleRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<{
    project: ShowcaseProject;
    active: ActivePreview;
  } | null>(null);
  const countLabel = String(projects.length).padStart(2, "0");

  function openPreview(project: ShowcaseProject, button: HTMLButtonElement) {
    const device = button
      .closest("article")
      ?.querySelector<HTMLElement>("[data-device]");
    setPreview({
      project,
      active: {
        page: project.pages[0],
        origin: (device ?? button).getBoundingClientRect(),
        source: button,
      },
    });
  }

  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const counter = counterRef.current;
    if (!root || !stage || !counter) return;

    const media = gsap.matchMedia();
    const articles = gsap.utils.toArray<HTMLElement>(
      "[data-showcase-item]",
      root,
    );
    const parts = articles.map((article) => ({
      device: article.querySelector<HTMLElement>("[data-device]")!,
      screen: article.querySelector<HTMLElement>("[data-screen]")!,
      image: article.querySelector<HTMLElement>("[data-screen-image]")!,
      thumb: article.querySelector<HTMLElement>("[data-thumb]")!,
      chars: Array.from(
        article.querySelectorAll<HTMLElement>("[data-title-char]"),
      ),
      info: Array.from(article.querySelectorAll<HTMLElement>("[data-info]")),
      index: article.querySelector<HTMLElement>("[data-big-index]")!,
      glow: article.querySelector<HTMLElement>("[data-glow]")!,
    }));
    const screenTravel = (part: (typeof parts)[number]) => () =>
      -Math.max(0, part.image.offsetHeight - part.screen.clientHeight);
    const thumbTravel = (part: (typeof parts)[number]) => () =>
      (part.thumb.parentElement?.clientHeight ?? 0) - part.thumb.offsetHeight;

    // Desktop: a pinned showroom. Scrolling literally scrolls each client
    // site inside the window, then the next project wipes in.
    media.add(pinnedQuery, () => {
      const segments = gsap.utils.toArray<HTMLElement>("[data-segment]", root);
      const tilts = gsap.utils.toArray<HTMLElement>("[data-device-tilt]", root);
      const floats = gsap.utils.toArray<HTMLElement>(
        "[data-device-float]",
        root,
      );

      parts.forEach((part, index) => {
        if (index === 0) return;
        gsap.set(part.device, { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(part.chars, { yPercent: 115 });
        gsap.set(part.info, { autoAlpha: 0, y: 24 });
        gsap.set(part.index, { yPercent: 100 });
        gsap.set(part.glow, { autoAlpha: 0 });
      });
      gsap.set(parts[0].device, { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(segments, { scaleX: 0, transformOrigin: "0% 50%" });

      const starts: number[] = [];
      const timeline = gsap.timeline({ defaults: { ease: "none" } });
      parts.forEach((part, index) => {
        const start = index * (holdDuration + swapDuration);
        starts.push(start);
        timeline
          .to(
            part.image,
            { y: screenTravel(part), duration: holdDuration, ease: "power1.inOut" },
            start,
          )
          .to(
            part.thumb,
            { y: thumbTravel(part), duration: holdDuration, ease: "power1.inOut" },
            start,
          )
          .to(segments[index], { scaleX: 1, duration: holdDuration }, start);

        const next = parts[index + 1];
        if (!next) return;
        const swap = start + holdDuration;
        timeline
          .to(
            next.device,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: swapDuration,
              ease: "power3.inOut",
            },
            swap,
          )
          .to(
            part.device,
            {
              scale: 0.9,
              yPercent: -5,
              duration: swapDuration,
              ease: "power3.inOut",
            },
            swap,
          )
          .to(
            part.chars,
            {
              yPercent: -115,
              duration: swapDuration * 0.5,
              ease: "power2.in",
              stagger: 0.012,
            },
            swap,
          )
          .to(
            next.chars,
            {
              yPercent: 0,
              duration: swapDuration * 0.6,
              ease: "power3.out",
              stagger: 0.014,
            },
            swap + swapDuration * 0.35,
          )
          .to(
            part.info,
            {
              autoAlpha: 0,
              y: -18,
              duration: swapDuration * 0.4,
              ease: "power2.in",
              stagger: 0.02,
            },
            swap,
          )
          .to(
            next.info,
            {
              autoAlpha: 1,
              y: 0,
              duration: swapDuration * 0.5,
              ease: "power3.out",
              stagger: 0.03,
            },
            swap + swapDuration * 0.45,
          )
          .to(
            part.index,
            { yPercent: -100, duration: swapDuration, ease: "power3.inOut" },
            swap,
          )
          .to(
            next.index,
            { yPercent: 0, duration: swapDuration, ease: "power3.inOut" },
            swap,
          )
          .to(part.glow, { autoAlpha: 0, duration: swapDuration }, swap)
          .to(next.glow, { autoAlpha: 1, duration: swapDuration }, swap);
      });
      timeline.to({}, { duration: 0.25 });

      let current = -1;
      ScrollTrigger.create({
        animation: timeline,
        trigger: stage,
        start: "top top",
        end: () => `+=${window.innerHeight * projects.length * 1.15}`,
        pin: true,
        scrub: 0.9,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: () => {
          const time = timeline.time();
          let active = 0;
          starts.forEach((start, index) => {
            if (time >= start - swapDuration * 0.5) active = index;
          });
          if (active !== current) {
            current = active;
            counter.textContent = projects[active].index;
          }
        },
      });

      // The window tilts up into place as the showroom arrives.
      gsap.fromTo(
        tilts,
        { rotationX: 24, yPercent: 14, scale: 0.88 },
        {
          rotationX: 0,
          yPercent: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: stage,
            start: "top bottom",
            end: "top top",
            scrub: 0.8,
          },
        },
      );

      // Subtle pointer parallax gives the window physical weight.
      const supportsHover = window.matchMedia(
        "(hover: hover) and (pointer: fine)",
      ).matches;
      if (!supportsHover) return;
      const rotateX = gsap.quickTo(floats, "rotationX", {
        duration: 0.9,
        ease: "power3.out",
      });
      const rotateY = gsap.quickTo(floats, "rotationY", {
        duration: 0.9,
        ease: "power3.out",
      });
      const handlePointerMove = (event: PointerEvent) => {
        const bounds = stage.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        rotateY(x * 7);
        rotateX(y * -5);
      };
      const handlePointerLeave = () => {
        rotateX(0);
        rotateY(0);
      };
      stage.addEventListener("pointermove", handlePointerMove);
      stage.addEventListener("pointerleave", handlePointerLeave);
      return () => {
        stage.removeEventListener("pointermove", handlePointerMove);
        stage.removeEventListener("pointerleave", handlePointerLeave);
      };
    });

    // Phones and tablets: a vertical list, each site scrolling in its window.
    media.add(stackedMotionQuery, () => {
      parts.forEach((part) => {
        gsap.to(part.image, {
          y: screenTravel(part),
          ease: "none",
          scrollTrigger: {
            trigger: part.device,
            start: "top 85%",
            end: "bottom 15%",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      });
    });

    return () => media.revert();
  }, [projects]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const cursor = cursorRef.current;
    const bubble = cursorBubbleRef.current;
    if (!root || !cursor || !bubble) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    gsap.set(cursor, { xPercent: -50, yPercent: -50, force3D: true });
    gsap.set(bubble, { autoAlpha: 0, scale: 0.2, force3D: true });
    const setX = gsap.quickSetter(cursor, "x", "px");
    const setY = gsap.quickSetter(cursor, "y", "px");
    let visible = false;

    const show = () => {
      if (visible) return;
      visible = true;
      bubble.dataset.active = "true";
      gsap.to(bubble, {
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
      bubble.dataset.active = "false";
      gsap.to(bubble, {
        autoAlpha: 0,
        scale: 0.35,
        duration: 0.2,
        ease: "power2.in",
        overwrite: "auto",
      });
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const overDevice =
        event.target instanceof Element &&
        event.target.closest("[data-work-cursor]");
      if (!overDevice) {
        hide();
        return;
      }
      setX(event.clientX);
      setY(event.clientY);
      show();
    };

    root.addEventListener("pointermove", handlePointerMove, { passive: true });
    root.addEventListener("pointerleave", hide);
    return () => {
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerleave", hide);
      gsap.killTweensOf(bubble);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.showcase}>
      <div ref={stageRef} className={styles.stage}>
        <div className={styles.backdrop} aria-hidden="true" />

        <header className={styles.topline}>
          <span>Selected work · 精选案例</span>
          <span className={styles.segments} aria-hidden="true">
            {projects.map((project) => (
              <span key={project.index}>
                <i data-segment />
              </span>
            ))}
          </span>
          <span className={styles.count} aria-hidden="true">
            <span ref={counterRef}>{projects[0]?.index}</span> / {countLabel}
          </span>
        </header>

        <div className={styles.items} role="list" aria-label="精选作品">
          {projects.map((project) => {
            const screen = project.pages[0];
            return (
              <article
                key={project.index}
                className={styles.item}
                role="listitem"
                data-showcase-item
                style={{ "--accent": project.accent } as CSSProperties}
                aria-label={`${project.title}，${project.category}`}
              >
                <div className={styles.bigIndex} aria-hidden="true">
                  <span data-big-index>{project.index}</span>
                </div>

                <div className={styles.info}>
                  <p className={styles.meta} data-info>
                    <span>
                      {project.index} / {countLabel}
                    </span>
                    <span>{project.category}</span>
                    {project.status !== "完整案例" ? (
                      <em>{project.status}</em>
                    ) : null}
                  </p>
                  <ShowcaseTitle title={project.title} />
                  <p className={styles.description} data-info>
                    {project.description}
                  </p>
                  <div className={styles.result} data-info>
                    <small>Delivery proof</small>
                    <strong>{project.result}</strong>
                    <span>{project.period}</span>
                  </div>
                  <button
                    type="button"
                    className={styles.open}
                    data-info
                    data-analytics={`project-preview:${project.title}`}
                    onClick={(event) =>
                      openPreview(project, event.currentTarget)
                    }
                  >
                    查看全部页面
                    <span>{String(project.pages.length).padStart(2, "0")}</span>
                    <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
                  </button>
                </div>

                <div className={styles.deviceArea} data-device-tilt>
                  <span className={styles.glow} data-glow aria-hidden="true" />
                  <div className={styles.deviceFloat} data-device-float>
                    <div className={styles.device} data-device data-work-cursor>
                      <div className={styles.chromeBar} aria-hidden="true">
                        <span className={styles.dots}>
                          <i />
                          <i />
                          <i />
                        </span>
                        <span className={styles.address}>
                          {project.title} — {screen.label}
                        </span>
                        <span className={styles.live}>Full page</span>
                      </div>
                      <div className={styles.screen} data-screen>
                        <Image
                          className={styles.screenImage}
                          data-screen-image
                          src={screen.src}
                          alt={screen.alt}
                          width={screen.width}
                          height={screen.height}
                          sizes="(max-width: 900px) 92vw, 60vw"
                          quality={75}
                        />
                        <span className={styles.scrollbar} aria-hidden="true">
                          <i data-thumb />
                        </span>
                      </div>
                      <button
                        type="button"
                        className={styles.deviceButton}
                        data-analytics={`project-detail:${project.title}`}
                        aria-label={`放大查看 ${project.title} 全部页面`}
                        onClick={(event) =>
                          openPreview(project, event.currentTarget)
                        }
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className={styles.scrollHint} aria-hidden="true">
          <span />
          向下滚动 · 浏览完整网站
        </div>
      </div>

      <div ref={cursorRef} className={workStyles.workCursor} aria-hidden="true">
        <div
          ref={cursorBubbleRef}
          className={workStyles.workCursorBubble}
          data-active="false"
        >
          <svg
            className={workStyles.workCursorWave}
            viewBox="0 0 120 200"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className={workStyles.workCursorWaveBack}
              d="M-12 34 C 5 17, 22 49, 40 32 S 76 17, 96 33 S 124 42, 136 28 V200 H-12 Z"
            />
            <path
              className={workStyles.workCursorWaveFront}
              d="M-12 44 C 8 25, 26 58, 48 40 S 85 26, 104 43 S 127 48, 136 37 V200 H-12 Z"
            />
          </svg>
          <span>预览</span>
        </div>
      </div>

      {preview ? (
        <ProjectLightbox
          active={preview.active}
          projectTitle={preview.project.title}
          pages={preview.project.pages}
          onClosed={() => setPreview(null)}
        />
      ) : null}
    </div>
  );
}
