"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { Expand, Images, X } from "lucide-react";
import gsap from "gsap";
import styles from "./work-section.module.css";

export type ProjectPreviewPage = {
  index: string;
  label: string;
  src: string;
  width: number;
  height: number;
  alt: string;
};

type ActivePreview = {
  page: ProjectPreviewPage;
  origin: DOMRect;
  source: HTMLButtonElement;
};

function ProjectLightbox({
  active,
  projectTitle,
  pages,
  onClosed,
}: {
  active: ActivePreview;
  projectTitle: string;
  pages: readonly ProjectPreviewPage[];
  onClosed: () => void;
}) {
  const backdropRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const imageStageRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const firstPageRenderRef = useRef(true);
  const [currentPage, setCurrentPage] =
    useState<ProjectPreviewPage>(active.page);

  useEffect(() => {
    const root = document.documentElement;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus({ preventScroll: true });

    return () => {
      root.style.overflow = previousRootOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  useLayoutEffect(() => {
    const backdrop = backdropRef.current;
    const dialog = dialogRef.current;
    if (!backdrop || !dialog) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dialogRect = dialog.getBoundingClientRect();
    const originCenterX = active.origin.left + active.origin.width / 2;
    const originCenterY = active.origin.top + active.origin.height / 2;
    const dialogCenterX = dialogRect.left + dialogRect.width / 2;
    const dialogCenterY = dialogRect.top + dialogRect.height / 2;
    const startScale = Math.max(
      0.12,
      Math.min(
        active.origin.width / dialogRect.width,
        active.origin.height / dialogRect.height,
      ),
    );

    if (reduceMotion) {
      gsap.set(backdrop, { opacity: 1 });
      gsap.set(dialog, { x: 0, y: 0, scale: 1, opacity: 1 });
      return;
    }

    const timeline = gsap.timeline();
    timeline
      .fromTo(
        backdrop,
        { opacity: 0 },
        { opacity: 1, duration: 0.45, ease: "power2.out" },
        0,
      )
      .fromTo(
        dialog,
        {
          x: originCenterX - dialogCenterX,
          y: originCenterY - dialogCenterY,
          scale: startScale,
          opacity: 0.75,
          borderRadius: "0.7rem",
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          borderRadius: "1.35rem",
          duration: 0.78,
          ease: "power4.inOut",
        },
        0,
      );

    return () => {
      timeline.kill();
    };
  }, [active]);

  const close = useCallback(() => {
    if (closingRef.current) {
      return;
    }
    closingRef.current = true;

    const backdrop = backdropRef.current;
    const dialog = dialogRef.current;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const finish = () => {
      active.source.focus({ preventScroll: true });
      onClosed();
    };

    if (!backdrop || !dialog || reduceMotion) {
      finish();
      return;
    }

    const dialogRect = dialog.getBoundingClientRect();
    const originCenterX = active.origin.left + active.origin.width / 2;
    const originCenterY = active.origin.top + active.origin.height / 2;
    const dialogCenterX = dialogRect.left + dialogRect.width / 2;
    const dialogCenterY = dialogRect.top + dialogRect.height / 2;
    const endScale = Math.max(
      0.12,
      Math.min(
        active.origin.width / dialogRect.width,
        active.origin.height / dialogRect.height,
      ),
    );

    gsap
      .timeline({ onComplete: finish })
      .to(
        dialog,
        {
          x: originCenterX - dialogCenterX,
          y: originCenterY - dialogCenterY,
          scale: endScale,
          opacity: 0,
          borderRadius: "0.7rem",
          duration: 0.58,
          ease: "power3.inOut",
        },
        0,
      )
      .to(
        backdrop,
        { opacity: 0, duration: 0.42, ease: "power2.inOut" },
        0.1,
      );
  }, [active, onClosed]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [close]);

  useLayoutEffect(() => {
    const imageStage = imageStageRef.current;
    scrollerRef.current?.scrollTo({ top: 0, behavior: "auto" });

    if (!imageStage) {
      return;
    }
    if (firstPageRenderRef.current) {
      firstPageRenderRef.current = false;
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      gsap.set(imageStage, { opacity: 1, y: 0 });
      return;
    }

    const tween = gsap.fromTo(
      imageStage,
      { opacity: 0.28, y: 22 },
      {
        opacity: 1,
        y: 0,
        duration: 0.62,
        ease: "power3.out",
        overwrite: "auto",
      },
    );
    return () => {
      tween.kill();
    };
  }, [currentPage]);

  const handlePreviewWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    if (
      !scroller ||
      scroller.contains(event.target as Node) ||
      Math.abs(event.deltaY) <= Math.abs(event.deltaX)
    ) {
      return;
    }

    event.preventDefault();
    scroller.scrollTop += event.deltaY;
  };

  return createPortal(
    <div
      className={styles.previewOverlay}
      role="dialog"
      aria-modal="true"
      aria-label={`${projectTitle} 项目画面 ${currentPage.index}`}
      data-lenis-prevent
    >
      <button
        ref={backdropRef}
        className={styles.previewBackdrop}
        type="button"
        aria-label="关闭完整页面预览"
        onClick={close}
      />

      <div ref={dialogRef} className={styles.previewDialog}>
        <header className={styles.previewDialogHeader}>
          <div>
            <span>{projectTitle} / Project view</span>
            <strong>
              {currentPage.index} · {currentPage.label}
            </strong>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="关闭预览"
            onClick={close}
          >
            <X size={18} strokeWidth={1.45} aria-hidden="true" />
          </button>
        </header>

        <div
          className={styles.previewDialogBody}
          onWheel={handlePreviewWheel}
        >
          <div className={styles.previewMain}>
            <div className={styles.previewNotice}>
              <span>Preview note</span>
              <p>图片展示，仅供参考；实际网站配合动效，体验更佳。</p>
            </div>

            <div
              ref={scrollerRef}
              className={styles.previewScroller}
              data-lenis-prevent
            >
              <div
                key={currentPage.index}
                ref={imageStageRef}
                className={styles.previewImageStage}
                data-preview-orientation={
                  currentPage.width >= currentPage.height
                    ? "landscape"
                    : "portrait"
                }
              >
                <Image
                  className={styles.previewFullImage}
                  src={currentPage.src}
                  alt={currentPage.alt}
                  width={currentPage.width}
                  height={currentPage.height}
                  sizes="(max-width: 700px) 96vw, (max-width: 1200px) 82vw, 72rem"
                  quality={88}
                />
              </div>
            </div>
          </div>

          <aside className={styles.previewPageRail} aria-label="切换完整页面">
            <span>Views / {String(pages.length).padStart(2, "0")}</span>
            <div className={styles.previewPageList}>
              {pages.map((page) => {
                const isActive = currentPage.index === page.index;
                return (
                  <button
                    key={page.index}
                    className={`${styles.previewPageButton} ${
                      isActive ? styles.previewPageButtonActive : ""
                    }`}
                    type="button"
                    aria-label={`切换到 ${page.label} 页面`}
                    aria-pressed={isActive}
                    onClick={() => {
                      if (!isActive) {
                        setCurrentPage(page);
                      }
                    }}
                  >
                    <span className={styles.previewPageThumb}>
                      <Image
                        src={page.src}
                        alt=""
                        fill
                        sizes="7rem"
                        quality={58}
                      />
                    </span>
                    <small>{page.index}</small>
                    <strong>{page.label}</strong>
                  </button>
                );
              })}
            </div>
            <p>
              Scroll
              <span aria-hidden="true">↓</span>
            </p>
          </aside>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function ProjectPreviewStack({
  projectTitle,
  pages,
  triggerLabel = "完整页面",
}: {
  projectTitle: string;
  pages: readonly ProjectPreviewPage[];
  triggerLabel?: string;
}) {
  const stackRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [active, setActive] = useState<ActivePreview | null>(null);
  const [stackOpen, setStackOpen] = useState(false);

  useLayoutEffect(() => {
    const stack = stackRef.current;
    const card = stack?.closest<HTMLElement>("article");
    if (!stack || !card) {
      return;
    }

    const cards = Array.from(
      stack.querySelectorAll<HTMLButtonElement>("[data-preview-page]"),
    );
    const rotations =
      cards.length === 2 ? [-4.2, 3.2] : [-5.5, -0.8, 4.8];
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const supportsHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    gsap.set(stack, { visibility: "hidden", pointerEvents: "none" });
    gsap.set(cards, {
      "--preview-offset": reduceMotion ? "0%" : "82%",
      "--preview-scale": reduceMotion ? 1 : 0.9,
      "--preview-angle": "0deg",
      opacity: 0,
    });

    const timeline = gsap.timeline({
      paused: true,
      onStart: () => {
        gsap.set(stack, { visibility: "visible", pointerEvents: "auto" });
        setStackOpen(true);
      },
      onReverseComplete: () => {
        gsap.set(stack, { visibility: "hidden", pointerEvents: "none" });
        setStackOpen(false);
      },
    });

    timeline.to(cards, {
      "--preview-offset": "0%",
      "--preview-scale": 1,
      "--preview-angle": (index: number) => `${rotations[index]}deg`,
      opacity: 1,
      duration: reduceMotion ? 0.01 : 0.82,
      stagger: reduceMotion ? 0 : 0.1,
      ease: "power4.out",
      overwrite: "auto",
    });
    timelineRef.current = timeline;

    const reveal = () => timeline.play();
    const hide = () => timeline.reverse();
    const handleFocusIn = (event: FocusEvent) => {
      if (
        event.target instanceof HTMLElement &&
        event.target.closest("[data-preview-trigger]")
      ) {
        return;
      }
      reveal();
    };
    const handleFocusOut = (event: FocusEvent) => {
      if (
        event.relatedTarget instanceof Node &&
        card.contains(event.relatedTarget)
      ) {
        return;
      }
      hide();
    };

    if (supportsHover) {
      card.addEventListener("pointerenter", reveal);
      card.addEventListener("pointerleave", hide);
    }
    card.addEventListener("focusin", handleFocusIn);
    card.addEventListener("focusout", handleFocusOut);

    return () => {
      if (supportsHover) {
        card.removeEventListener("pointerenter", reveal);
        card.removeEventListener("pointerleave", hide);
      }
      card.removeEventListener("focusin", handleFocusIn);
      card.removeEventListener("focusout", handleFocusOut);
      timeline.kill();
      timelineRef.current = null;
    };
  }, []);

  const toggleStack = () => {
    const timeline = timelineRef.current;
    if (!timeline) {
      return;
    }
    if (stackOpen) {
      timeline.reverse();
    } else {
      timeline.play();
    }
  };

  return (
    <>
      <button
        className={styles.previewTrigger}
        type="button"
        data-preview-trigger
        data-analytics={`project-preview:${projectTitle}`}
        aria-expanded={stackOpen}
        aria-label={
          stackOpen
            ? `收起${projectTitle}项目画面`
            : `展开${projectTitle}项目画面`
        }
        onClick={toggleStack}
      >
        <Images size={15} strokeWidth={1.45} aria-hidden="true" />
        <span>
          {triggerLabel} · {String(pages.length).padStart(2, "0")}
        </span>
      </button>

      <div
        ref={stackRef}
        className={styles.projectPreviewStack}
        aria-label={`${projectTitle} 项目画面预览`}
        data-preview-count={pages.length}
      >
        {pages.map((page) => (
          <button
            key={page.index}
            className={styles.projectPreviewCard}
            type="button"
            data-preview-page={page.index}
            data-analytics={`project-detail:${projectTitle}:${page.label}`}
            data-preview-orientation={
              page.width >= page.height ? "landscape" : "portrait"
            }
            aria-label={`放大查看 ${page.label} 完整页面`}
            style={
              {
                "--preview-aspect": `${page.width} / ${page.height}`,
              } as CSSProperties
            }
            onClick={(event) => {
              setActive({
                page,
                origin: event.currentTarget.getBoundingClientRect(),
                source: event.currentTarget,
              });
            }}
          >
            <Image
              src={page.src}
              alt={page.alt}
              fill
              sizes="(max-width: 700px) 34vw, 12rem"
              quality={68}
            />
            <span>
              <i>{page.index}</i>
              {page.label}
              <Expand size={13} strokeWidth={1.4} aria-hidden="true" />
            </span>
          </button>
        ))}
      </div>

      {active ? (
        <ProjectLightbox
          active={active}
          projectTitle={projectTitle}
          pages={pages}
          onClosed={() => setActive(null)}
        />
      ) : null}
    </>
  );
}
