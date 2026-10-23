"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { BrandMark } from "./brand-mark";
import styles from "./opening-sequence.module.css";

const openingSeenKey = "lx-opening-seen";
export const openingRevealEvent = "lx:opening-reveal";

const columnCount = 10;
const scrambleGlyphs = "#/<>{}[]01=+*_";

function splitIntoChars(target: HTMLElement, text: string) {
  target.textContent = "";
  return Array.from(text).map((char) => {
    const mask = document.createElement("span");
    const inner = document.createElement("span");
    mask.className = styles.charMask;
    inner.className = styles.char;
    inner.textContent = char;
    mask.append(inner);
    target.append(mask);
    return inner;
  });
}

export function OpeningSequence() {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const columnsHost = columnsRef.current;
    const grid = gridRef.current;
    const word = wordRef.current;
    const markStage = markRef.current;
    const chrome = chromeRef.current;
    const counter = counterRef.current;
    const bar = barRef.current;
    if (
      !overlay ||
      !columnsHost ||
      !grid ||
      !word ||
      !markStage ||
      !chrome ||
      !counter ||
      !bar
    ) {
      return;
    }

    const root = document.documentElement;
    // Returning visitors: the overlay is already hidden by CSS before paint.
    if (root.classList.contains("opening-seen")) return;

    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const columns = Array.from(columnsHost.children) as HTMLElement[];
    const verticalLines = Array.from(
      grid.querySelectorAll<HTMLElement>("[data-line='v']"),
    );
    const horizontalLine = grid.querySelector<HTMLElement>("[data-line='h']");
    const chromeItems = Array.from(
      chrome.querySelectorAll<HTMLElement>("[data-chrome]"),
    );
    const mark = markStage.querySelector<SVGSVGElement>("svg");
    const markStem = markStage.querySelector('[data-logo-mark-part="stem"]');
    const markCross = markStage.querySelector('[data-logo-mark-part="cross"]');
    const navigation =
      document.querySelector<HTMLElement>("[data-site-navigation]");
    const navigationRevealElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav-reveal]"),
    );
    const heroImage = document.querySelector<HTMLImageElement>("#home img");

    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      window.dispatchEvent(new Event(openingRevealEvent));
    };

    const restorePage = () => {
      if (navigation) {
        gsap.set(navigation, { clearProps: "opacity,visibility" });
      }
      gsap.set(navigationRevealElements, {
        clearProps: "opacity,visibility,transform",
      });
      root.style.overflow = previousRootOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };

    const finish = () => {
      reveal();
      restorePage();
      try {
        sessionStorage.setItem(openingSeenKey, "1");
      } catch {}
      setVisible(false);
    };

    const timeline = gsap.timeline({ onComplete: finish });
    timelineRef.current = timeline;

    if (reduceMotion) {
      gsap.set([word, grid], { autoAlpha: 0 });
      timeline
        .set(markStage, { autoAlpha: 1 }, 0)
        .call(reveal, [], 0.5)
        .to(overlay, { autoAlpha: 0, duration: 0.4 }, 0.5);
    } else {
      if (navigation) gsap.set(navigation, { autoAlpha: 0 });
      gsap.set(navigationRevealElements, { autoAlpha: 0, y: 8 });
      gsap.set(verticalLines, { scaleY: 0, transformOrigin: "50% 0%" });
      if (horizontalLine) {
        gsap.set(horizontalLine, { scaleX: 0, transformOrigin: "0% 50%" });
      }
      gsap.set(chromeItems, { autoAlpha: 0, y: 10 });
      gsap.set(markStage, { autoAlpha: 0 });
      gsap.set(bar, { scaleX: 0, transformOrigin: "0% 50%" });

      const formChars = splitIntoChars(word, "FORM");
      word.dataset.mode = "form";
      gsap.set(formChars, { yPercent: 115 });

      // Blueprint: the grid is drawn first, like a layout before the build.
      timeline
        .to(
          verticalLines,
          {
            scaleY: 1,
            duration: 1.1,
            ease: "expo.inOut",
            stagger: { each: 0.045, from: "center" },
          },
          0,
        )
        .to(
          horizontalLine,
          { scaleX: 1, duration: 1.2, ease: "expo.inOut" },
          0.1,
        )
        .to(
          chromeItems,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.06,
          },
          0.25,
        )
        .to(
          formChars,
          {
            yPercent: 0,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.06,
          },
          0.3,
        );

      // Progress counter, held near the end until the hero image is ready.
      const progress = { value: 0 };
      const renderProgress = () => {
        const value = Math.round(progress.value);
        counter.textContent = String(value).padStart(3, "0");
        bar.style.transform = `scaleX(${progress.value / 100})`;
      };
      timeline
        .to(
          progress,
          {
            value: 86,
            duration: 1.85,
            ease: "power2.inOut",
            onUpdate: renderProgress,
          },
          0.1,
        )
        .call(
          () => {
            const ready =
              !heroImage || (heroImage.complete && heroImage.naturalWidth > 0);
            if (ready) return;
            timeline.pause();
            let resumed = false;
            const resume = () => {
              if (resumed) return;
              resumed = true;
              timeline.resume();
            };
            heroImage.addEventListener("load", resume, { once: true });
            heroImage.addEventListener("error", resume, { once: true });
            window.setTimeout(resume, 2400);
          },
          [],
          1.95,
        )
        .to(
          progress,
          {
            value: 100,
            duration: 0.45,
            ease: "power2.out",
            onUpdate: renderProgress,
          },
          1.96,
        );

      // Design turns into code: FORM decodes into BUILD.
      const target = "BUILD";
      const scramble = { progress: 0 };
      let slots: HTMLElement[] = [];
      let lastFrame = -1;
      timeline.to(
        scramble,
        {
          progress: 1,
          duration: 0.78,
          ease: "none",
          onStart: () => {
            word.dataset.mode = "code";
            slots = splitIntoChars(word, target);
          },
          onUpdate: () => {
            const frame = Math.floor(scramble.progress * 26);
            if (frame === lastFrame) return;
            lastFrame = frame;
            slots.forEach((slot, index) => {
              const settleAt = 0.32 + (index / target.length) * 0.58;
              slot.textContent =
                scramble.progress >= settleAt
                  ? target[index]
                  : scrambleGlyphs[
                      Math.floor(Math.random() * scrambleGlyphs.length)
                    ];
            });
          },
          onComplete: () => {
            slots.forEach((slot, index) => {
              slot.textContent = target[index];
            });
            word.dataset.mode = "build";
          },
        },
        1.22,
      );

      // BUILD collapses into the mark. A proxy keeps this seek-safe, since
      // the character spans are only created once the decode starts.
      const collapse = { progress: 0 };
      const collapseEase = gsap.parseEase("expo.in");
      timeline
        .to(
          collapse,
          {
            progress: 1,
            duration: 0.62,
            ease: "none",
            onUpdate: () => {
              const chars = Array.from(
                word.querySelectorAll<HTMLElement>(`.${styles.char}`),
              );
              const lag = 0.07;
              const span = 1 - lag * Math.max(chars.length - 1, 0);
              chars.forEach((char, index) => {
                const local = gsap.utils.clamp(
                  0,
                  1,
                  (collapse.progress - index * lag) / span,
                );
                char.style.transform = `translateY(${-115 * collapseEase(local)}%)`;
              });
            },
          },
          2.05,
        )
        .set(markStage, { autoAlpha: 1 }, 2.42)
        .fromTo(
          markStem,
          { scaleY: 0, transformOrigin: "50% 0%" },
          { scaleY: 1, duration: 0.42, ease: "expo.out" },
          2.42,
        )
        .fromTo(
          markCross,
          { scale: 0.2, rotation: -10, transformOrigin: "40% 50%" },
          { scale: 1, rotation: 0, duration: 0.62, ease: "back.out(1.6)" },
          2.48,
        );

      // Exit: the columns lift away from the centre and the mark docks.
      const exit = 3.0;
      timeline.addLabel("exit", exit);

      let markDestination: { x: number; y: number; scale: number } | null =
        null;
      const getMarkDestination = () => {
        if (markDestination) return markDestination;
        const slot = document.querySelector<HTMLElement>(
          "[data-nav-brand-mark]",
        );
        if (!slot || !mark) {
          markDestination = { x: 0, y: -window.innerHeight, scale: 0.3 };
          return markDestination;
        }
        const from = mark.getBoundingClientRect();
        const to = slot.getBoundingClientRect();
        markDestination = {
          x: to.left + to.width / 2 - (from.left + from.width / 2),
          y: to.top + to.height / 2 - (from.top + from.height / 2),
          scale: to.width / from.width,
        };
        return markDestination;
      };

      timeline
        .set(word, { autoAlpha: 0 }, exit)
        .to(
          chromeItems,
          { autoAlpha: 0, y: -8, duration: 0.3, ease: "power2.in" },
          exit,
        )
        .to(grid, { autoAlpha: 0, duration: 0.35, ease: "power1.out" }, exit)
        .call(reveal, [], exit + 0.12)
        .to(
          columns,
          {
            yPercent: -101,
            duration: 1.05,
            ease: "expo.inOut",
            stagger: { each: 0.05, from: "center" },
          },
          exit,
        )
        .to(
          markStage,
          {
            x: () => getMarkDestination().x,
            y: () => getMarkDestination().y,
            scale: () => getMarkDestination().scale,
            duration: 1.05,
            ease: "expo.inOut",
          },
          exit + 0.08,
        )
        .to(
          navigation,
          { autoAlpha: 1, duration: 0.5, ease: "power2.out" },
          exit + 0.6,
        )
        .to(
          navigationRevealElements,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.05,
          },
          exit + 0.7,
        )
        .to(markStage, { autoAlpha: 0, duration: 0.18 }, exit + 1.1)
        .set(overlay, { autoAlpha: 0 }, exit + 1.3);
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") timeline.progress(1);
    };
    // Visitors who try to scroll want the content now: jump to the exit.
    const fastForward = () => {
      if (reduceMotion) return;
      const exitTime = timeline.labels.exit;
      if (exitTime !== undefined && timeline.time() < exitTime) {
        timeline.resume();
        timeline.seek(exitTime);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", fastForward, { passive: true });
    window.addEventListener("touchmove", fastForward, { passive: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", fastForward);
      window.removeEventListener("touchmove", fastForward);
      timeline.kill();
      timelineRef.current = null;
      restorePage();
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      data-opening
      aria-label="网站品牌开场动画"
      data-lenis-prevent
    >
      <div ref={columnsRef} className={styles.columns} aria-hidden="true">
        {Array.from({ length: columnCount }, (_, index) => (
          <span key={index} className={styles.column} />
        ))}
      </div>

      <div ref={gridRef} className={styles.grid} aria-hidden="true">
        {Array.from({ length: columnCount - 1 }, (_, index) => (
          <span
            key={index}
            data-line="v"
            className={styles.lineV}
            style={{ left: `${((index + 1) / columnCount) * 100}%` }}
          />
        ))}
        <span data-line="h" className={styles.lineH} />
      </div>

      <div className={styles.stage} aria-hidden="true">
        <span ref={wordRef} className={styles.word} />
        <div ref={markRef} className={styles.markStage}>
          <BrandMark className={styles.mark} />
        </div>
      </div>

      <div ref={chromeRef} className={styles.chrome}>
        <div className={styles.topLeft} data-chrome aria-hidden="true">
          <strong>Liang Xikun</strong>
          <span>梁熙坤 · Portfolio 2026</span>
        </div>
        <div className={styles.topRight} data-chrome aria-hidden="true">
          <strong>Form × Build</strong>
          <span>Design · Engineering</span>
        </div>
        <div className={styles.counter} data-chrome aria-hidden="true">
          <span ref={counterRef}>000</span>
          <small>%</small>
        </div>
        <div className={styles.bottomRight} data-chrome>
          <span aria-hidden="true">Tangshan · 39.63°N 118.18°E</span>
          <button
            className={styles.skip}
            type="button"
            onClick={() => timelineRef.current?.progress(1)}
          >
            跳过
            <span aria-hidden="true">↗</span>
          </button>
        </div>
        <span className={styles.bar} aria-hidden="true">
          <span ref={barRef} />
        </span>
      </div>
    </div>
  );
}
