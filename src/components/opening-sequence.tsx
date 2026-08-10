"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { BrandMark, BrandWordmark } from "./brand-mark";
import styles from "./opening-sequence.module.css";

const greetings = [
  { text: "你好", locale: "中文 · 中国", script: "chinese" },
  { text: "Hello", locale: "English · UK", script: "latin" },
  { text: "こんにちは", locale: "日本語 · 日本", script: "japanese" },
  { text: "Bonjour", locale: "Français · France", script: "french" },
  { text: "Hola", locale: "Español · España", script: "spanish" },
  { text: "안녕하세요", locale: "한국어 · 대한민국", script: "korean" },
  { text: "Ciao", locale: "Italiano · Italia", script: "latin" },
  { text: "Hallo", locale: "Deutsch · Deutschland", script: "latin" },
  { text: "Привет", locale: "Русский · Россия", script: "cyrillic" },
  { text: "مرحبًا", locale: "العربية · العالم العربي", script: "arabic" },
] as const;

export function OpeningSequence() {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<SVGSVGElement>(null);
  const navMorphRef = useRef<HTMLDivElement>(null);
  const navMorphSurfaceRef = useRef<HTMLSpanElement>(null);
  const navMorphFillRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const chromeRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const signalRef = useRef<HTMLSpanElement>(null);
  const greetingRefs = useRef<Array<HTMLDivElement | null>>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const curtain = curtainRef.current;
    const navMorph = navMorphRef.current;
    const navMorphSurface = navMorphSurfaceRef.current;
    const navMorphFill = navMorphFillRef.current;
    const content = contentRef.current;
    const chrome = chromeRef.current;
    const logo = logoRef.current;
    const signal = signalRef.current;
    if (
      !overlay ||
      !curtain ||
      !navMorph ||
      !navMorphSurface ||
      !navMorphFill ||
      !content ||
      !chrome ||
      !logo ||
      !signal
    ) {
      return;
    }

    const root = document.documentElement;
    const previousRootOverflow = root.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    const words = greetingRefs.current.filter(
      (word): word is HTMLDivElement => Boolean(word),
    );
    const markStem = logo.querySelector<SVGElement>(
      '[data-logo-mark-part="stem"]',
    );
    const markCross = logo.querySelector<SVGElement>(
      '[data-logo-mark-part="cross"]',
    );
    const markNode = logo.querySelector<SVGElement>(
      '[data-logo-mark-part="node"]',
    );
    const openingMark = logo.querySelector<SVGSVGElement>(
      'svg[viewBox="0 0 148.71 123.47"]',
    );
    const openingWordmark = logo.querySelector<SVGSVGElement>(
      'svg[viewBox="0 0 502 144.64"]',
    );
    const wordGroups = Array.from(
      logo.querySelectorAll<SVGGElement>("[data-logo-word-part]"),
    );
    const wordStrokes = wordGroups.flatMap((group) =>
      Array.from(group.children),
    );
    const navigation =
      document.querySelector<HTMLElement>("[data-site-navigation]");
    const navigationRevealElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav-reveal]"),
    );
    const deformationTargets: HTMLElement[] = navigation
      ? [navMorphSurface, navigation]
      : [navMorphSurface];
    const elasticDeformation = { progress: 0 };
    let navigationTargetRect: DOMRect | null = null;
    const getNavigationRect = () => {
      navigationTargetRect ??=
        navigation?.getBoundingClientRect() ??
        new DOMRect(16, 16, window.innerWidth - 32, 67);
      return navigationTargetRect;
    };
    let openingMarkDestination:
      | { x: number; y: number; scale: number }
      | undefined;
    const getOpeningMarkDestination = () => {
      if (openingMarkDestination) return openingMarkDestination;

      const target =
        document.querySelector<HTMLElement>("[data-nav-brand-mark]");
      if (!target || !openingMark) {
        openingMarkDestination = { x: 0, y: 0, scale: 1 };
        return openingMarkDestination;
      }

      const sourceRect = openingMark.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      openingMarkDestination = {
        x:
          targetRect.left +
          targetRect.width / 2 -
          (sourceRect.left + sourceRect.width / 2),
        y:
          targetRect.top +
          targetRect.height / 2 -
          (sourceRect.top + sourceRect.height / 2),
        scale: targetRect.width / sourceRect.width,
      };
      return openingMarkDestination;
    };
    const fluidSpringEase = (progress: number) => {
      const dampingRatio = 0.84;
      const angularFrequency = 10;
      const dampedFrequency =
        angularFrequency * Math.sqrt(1 - dampingRatio ** 2);
      const response = (time: number) =>
        1 -
        Math.exp(-dampingRatio * angularFrequency * time) *
          (Math.cos(dampedFrequency * time) +
            (dampingRatio / Math.sqrt(1 - dampingRatio ** 2)) *
              Math.sin(dampedFrequency * time));

      return response(progress) / response(1);
    };
    const logoParts = [markStem, markCross, markNode, ...wordStrokes].filter(
      (part): part is SVGElement => Boolean(part),
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    gsap.set(curtain, { yPercent: 0, force3D: true });
    gsap.set(navMorph, {
      autoAlpha: 0,
      force3D: true,
    });
    gsap.set(navMorphFill, { autoAlpha: 1 });
    gsap.set(words, { autoAlpha: 0 });
    gsap.set(logo, { autoAlpha: 0 });
    gsap.set(logoParts, { autoAlpha: 0 });
    gsap.set(signal, {
      autoAlpha: 0,
      scaleX: 0,
      transformOrigin: "left center",
    });

    const finish = () => {
      gsap.set(navigationRevealElements, {
        clearProps: "opacity,visibility,transform",
      });
      if (navigation) {
        gsap.set(navigation, { clearProps: "transform,transformOrigin" });
      }
      root.style.overflow = previousRootOverflow;
      document.body.style.overflow = previousBodyOverflow;
      setVisible(false);
    };

    const timeline = gsap.timeline({ onComplete: finish });
    timelineRef.current = timeline;

    if (reduceMotion) {
      timeline
        .set(logo, { autoAlpha: 1 })
        .set(logoParts, { autoAlpha: 1 })
        .to([content, chrome], {
          autoAlpha: 0,
          duration: 0.16,
          delay: 0.55,
        })
        .to(
          curtain,
          {
            yPercent: -105,
            duration: 0.62,
            ease: "power3.inOut",
            force3D: true,
          },
          "<",
        );
    } else {
      gsap.set(navigationRevealElements, {
        autoAlpha: 0,
        y: 5,
      });

      const greetingWindow = 2.28;
      const greetingDuration = greetingWindow / words.length;
      words.forEach((word, index) => {
        const start = 0.12 + index * greetingDuration;
        if (index > 0) {
          timeline.set(words[index - 1], { autoAlpha: 0 }, start);
        }
        timeline.set(word, { autoAlpha: 1 }, start);
      });

      const logoStart = 0.12 + greetingWindow;
      timeline
        .set(words.at(-1) ?? [], { autoAlpha: 0 }, logoStart)
        .set(logo, { autoAlpha: 1 }, logoStart)
        .fromTo(
          markStem,
          {
            autoAlpha: 0,
            scaleY: 0,
            transformOrigin: "center top",
          },
          {
            autoAlpha: 1,
            scaleY: 1,
            duration: 0.32,
            ease: "power3.out",
          },
          logoStart,
        )
        .fromTo(
          markCross,
          {
            autoAlpha: 0,
            scale: 0.12,
            rotation: -7,
            transformOrigin: "35% 46%",
          },
          {
            autoAlpha: 1,
            scale: 1,
            rotation: 0,
            duration: 0.52,
            ease: "back.out(1.35)",
          },
          logoStart + 0.16,
        )
        .set(markNode, { autoAlpha: 1 }, logoStart + 0.46)
        .fromTo(
          signal,
          { autoAlpha: 1, scaleX: 0 },
          {
            autoAlpha: 1,
            scaleX: 1,
            duration: 0.62,
            ease: "power3.inOut",
          },
          logoStart + 0.36,
        );

      let wordStart = logoStart + 0.34;
      wordGroups.forEach((group, groupIndex) => {
        const strokes = Array.from(group.children);
        timeline.fromTo(
          strokes,
          {
            autoAlpha: 0,
            y: groupIndex % 2 === 0 ? 9 : -9,
            scaleY: 0.14,
            transformOrigin: "center bottom",
          },
          {
            autoAlpha: 1,
            y: 0,
            scaleY: 1,
            duration: 0.32,
            stagger: 0.032,
            ease: "power3.out",
          },
          wordStart,
        );
        wordStart += 0.25;
      });

      const exitStart = logoStart + 1.58;
      timeline
        .to(
          signal,
          {
            autoAlpha: 0,
            duration: 0.2,
          },
          exitStart - 0.22,
        )
        .to(
          [openingWordmark, chrome],
          {
            autoAlpha: 0,
            x: 6,
            duration: 0.16,
            ease: "power2.out",
          },
          exitStart - 0.14,
        )
        .set(
          navMorph,
          {
            autoAlpha: 1,
            top: () => getNavigationRect().top,
            left: () => getNavigationRect().left,
            right: "auto",
            bottom: "auto",
            width: () => getNavigationRect().width,
            height: () => getNavigationRect().height,
            borderRadius: () =>
              navigation
                ? window.getComputedStyle(navigation).borderTopLeftRadius
                : "16px",
            transformOrigin: "left top",
            x: () => -getNavigationRect().left,
            y: () => -getNavigationRect().top,
            scaleX: () => window.innerWidth / getNavigationRect().width,
            scaleY: () => window.innerHeight / getNavigationRect().height,
            force3D: true,
          },
          exitStart,
        )
        .set(curtain, { autoAlpha: 0 }, exitStart)
        .to(
          navMorph,
          {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            duration: 0.64,
            ease: fluidSpringEase,
            force3D: true,
          },
          exitStart,
        )
        .to(
          navMorphFill,
          {
            autoAlpha: 0,
            duration: 0.48,
            ease: "power2.inOut",
          },
          exitStart + 0.05,
        )
        .to(
          navMorph,
          {
            opacity: 0.42,
            duration: 0.38,
            ease: "power2.inOut",
          },
          exitStart + 0.15,
        )
        .to(
          navigationRevealElements,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.025,
            ease: "power2.out",
          },
          exitStart + 0.21,
        )
        .to(
          elasticDeformation,
          {
            progress: 1,
            duration: 0.26,
            ease: "none",
            onUpdate: () => {
              const progress = elasticDeformation.progress;
              const deformation =
                -0.045 *
                Math.sin(Math.PI * 2 * progress) *
                Math.exp(-2.4 * progress);
              gsap.set(deformationTargets, {
                scaleX: 1 - deformation * 0.32,
                scaleY: 1 + deformation,
                transformOrigin: "center center",
                force3D: true,
              });
            },
            onComplete: () => {
              gsap.set(deformationTargets, {
                scaleX: 1,
                scaleY: 1,
              });
            },
          },
          exitStart + 0.36,
        )
        .to(
          openingMark,
          {
            x: () => getOpeningMarkDestination().x,
            y: () => getOpeningMarkDestination().y,
            scale: () => getOpeningMarkDestination().scale,
            duration: 0.62,
            ease: fluidSpringEase,
            force3D: true,
          },
          exitStart + 0.02,
        )
        .to(
          [openingMark, content],
          {
            autoAlpha: 0,
            duration: 0.12,
          },
          exitStart + 0.52,
        )
        .to(
          navMorph,
          {
            autoAlpha: 0,
            duration: 0.15,
            ease: "power2.out",
          },
          exitStart + 0.54,
        )
        .to(overlay, { autoAlpha: 0, duration: 0.01 }, exitStart + 0.69);
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        timeline.progress(1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      timeline.kill();
      timelineRef.current = null;
      gsap.set(navigationRevealElements, {
        clearProps: "opacity,visibility,transform",
      });
      if (navigation) {
        gsap.set(navigation, { clearProps: "transform,transformOrigin" });
      }
      root.style.overflow = previousRootOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      aria-label="网站品牌开场动画"
      data-lenis-prevent
    >
      <svg
        ref={curtainRef}
        className={styles.curtain}
        viewBox="0 0 1440 1080"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="opening-blue-grey" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#61778a" />
            <stop offset="54%" stopColor="#526a7d" />
            <stop offset="100%" stopColor="#42586b" />
          </linearGradient>
        </defs>
        <path
          d="M0 0 H1440 V1010 C1110 1170 410 840 0 1060 Z"
          fill="url(#opening-blue-grey)"
        />
        <path
          d="M0 0 H1440 V1010 C1110 1170 410 840 0 1060"
          fill="none"
          stroke="rgba(244, 240, 229, 0.46)"
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div ref={navMorphRef} className={styles.navMorph} aria-hidden="true">
        <span ref={navMorphSurfaceRef} className={styles.navMorphSurface}>
          <span ref={navMorphFillRef} className={styles.navMorphFill} />
        </span>
      </div>

      <div ref={contentRef} className={styles.content}>
        <div className={styles.greetings} aria-hidden="true">
          {greetings.map((greeting, index) => (
            <div
              key={greeting.locale}
              ref={(node) => {
                greetingRefs.current[index] = node;
              }}
              className={styles.greeting}
              data-script={greeting.script}
            >
              <strong>{greeting.text}</strong>
              <small>{greeting.locale}</small>
            </div>
          ))}
        </div>

        <div ref={logoRef} className={styles.logoStage} aria-hidden="true">
          <BrandMark className={styles.logoMark} />
          <BrandWordmark className={styles.logoWordmark} />
          <span ref={signalRef} className={styles.logoSignal} />
        </div>
      </div>

      <div ref={chromeRef} className={styles.chrome}>
        <div className={styles.meta} aria-hidden="true">
          <span>LIANG XIKUN / PORTFOLIO</span>
          <span>FORM × BUILD</span>
        </div>

        <button
          className={styles.skip}
          type="button"
          onClick={() => timelineRef.current?.progress(1)}
        >
          跳过
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </div>
  );
}
