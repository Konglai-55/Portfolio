"use client";

import Image from "next/image";
import gsap from "gsap";
import {
  type MouseEvent,
  type PointerEvent,
  type Ref,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { openingRevealEvent } from "./opening-sequence";
import styles from "./hero-stage.module.css";

const slides = [
  {
    id: "designer",
    role: "设计师",
    copy: "洞察需求，构建美感，让每一个想法拥有清晰表达。",
    phrases: ["洞察需求，", "构建美感，", "让每一个想法", "拥有清晰表达。"],
    image: "/images/hero-designer-studio.png",
    alt: "阳光洒进画室，一位设计师正在窗边创作",
  },
  {
    id: "developer",
    role: "开发者",
    copy: "拆解问题，实现创意，让每一个设计真正稳定运行。",
    phrases: ["拆解问题，", "实现创意，", "让每一个设计", "真正稳定运行。"],
    image: "/images/hero-developer-night.png",
    alt: "夜晚的城市窗景前，一位开发者正在桌前工作",
  },
] as const;

type Point = {
  x: number;
  y: number;
};

type HeroCopyProps = {
  activeIndex: number;
  role: (typeof slides)[number]["role"];
  copy: (typeof slides)[number]["copy"];
  phrases: (typeof slides)[number]["phrases"];
  titleRef?: Ref<HTMLHeadingElement>;
  interactive?: boolean;
};

function HeroCopy({
  activeIndex,
  role,
  copy,
  phrases,
  titleRef,
  interactive = false,
}: HeroCopyProps) {
  function keepIdentity(event: MouseEvent<HTMLAnchorElement>) {
    if (interactive) {
      event.stopPropagation();
    }
  }

  const actions = [
    { label: "查看精选作品", href: "#work", analytics: "hero:view-work" },
    { label: "聊聊你的项目", href: "#contact", analytics: "hero:contact" },
  ] as const;

  return (
    <>
      <p className={styles.eyebrow} data-hero-eyebrow>
        <span />
        身份 · {role}
        <small className={styles.identityCount}>0{activeIndex + 1} / 02</small>
      </p>

      {/* Phrases never break internally, so Chinese lines wrap at meaning. */}
      <h1 ref={titleRef} aria-label={copy}>
        {phrases.map((phrase) => (
          <span key={phrase} className={styles.phrase} aria-hidden="true">
            {phrase}
          </span>
        ))}
      </h1>

      <p className={styles.serviceCopy} data-hero-supporting>
        从视觉方向，到完整开发与上线。
        <small>From visual direction to full-stack delivery.</small>
      </p>

      <div className={styles.actions} data-hero-supporting>
        {actions.map((action, index) =>
          interactive ? (
            <a
              key={action.href}
              className={
                index === 0 ? styles.primaryAction : styles.secondaryAction
              }
              href={action.href}
              data-hero-action
              data-analytics={action.analytics}
              onClick={keepIdentity}
            >
              <span>{action.label}</span>
              <i aria-hidden="true">↗</i>
            </a>
          ) : (
            <span
              key={action.href}
              className={
                index === 0 ? styles.primaryAction : styles.secondaryAction
              }
            >
              <span>{action.label}</span>
              <i aria-hidden="true">↗</i>
            </span>
          ),
        )}
      </div>
    </>
  );
}

function nextPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function tweenFinished(tween: gsap.core.Animation) {
  return new Promise<void>((resolve) => {
    tween.eventCallback("onComplete", resolve);
  });
}

export function HeroStage() {
  const heroRef = useRef<HTMLElement>(null);
  const baseCopyRef = useRef<HTMLDivElement>(null);
  const baseTitleRef = useRef<HTMLHeadingElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLButtonElement>(null);
  const transitionDotRef = useRef<HTMLDivElement>(null);
  const transitionCopyRef = useRef<HTMLDivElement>(null);
  const incomingCopyRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<Array<HTMLImageElement | null>>([]);
  const revealOverlayRef = useRef<SVGSVGElement>(null);
  const coverCircleRef = useRef<SVGCircleElement>(null);
  const revealCircleRef = useRef<SVGCircleElement>(null);
  const transitionLockRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitionCopyIndex, setTransitionCopyIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isCursorVisible, setIsCursorVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const activeSlide = slides[activeIndex];
  const nextSlide = slides[(activeIndex + 1) % slides.length];
  const transitionSlide = slides[transitionCopyIndex];

  // Hero entrance. On a first visit it waits for the opening sequence to
  // lift its columns, so the two read as one continuous shot.
  useLayoutEffect(() => {
    const root = document.documentElement;
    const copy = baseCopyRef.current;
    const image = imageRefs.current[0];
    const hint = hintRef.current;
    if (!copy || !image) {
      root.classList.remove("hero-intro-pending");
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.remove("hero-intro-pending");
      return;
    }

    const eyebrow = copy.querySelector("[data-hero-eyebrow]");
    const phrases = Array.from(copy.querySelectorAll(`.${styles.phrase}`));
    const supporting = Array.from(
      copy.querySelectorAll("[data-hero-supporting]"),
    );

    gsap.set(image, { scale: 1.24, transition: "none" });
    gsap.set(eyebrow, { autoAlpha: 0, x: -18 });
    gsap.set(phrases, { autoAlpha: 0, yPercent: 55, filter: "blur(12px)" });
    gsap.set([...supporting, hint], { autoAlpha: 0, y: 18 });
    root.classList.remove("hero-intro-pending");

    const timeline = gsap.timeline({
      paused: true,
      onComplete: () => {
        gsap.set(image, { clearProps: "transform,transition" });
        gsap.set([eyebrow, ...phrases, ...supporting, hint], {
          clearProps: "opacity,visibility,transform,filter",
        });
      },
    });
    timeline
      .to(image, { scale: 1, duration: 2.1, ease: "expo.out" }, 0)
      .to(
        eyebrow,
        { autoAlpha: 1, x: 0, duration: 0.9, ease: "power3.out" },
        0.35,
      )
      .to(
        phrases,
        {
          autoAlpha: 1,
          yPercent: 0,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.09,
        },
        0.42,
      )
      .to(
        [...supporting, hint],
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
        },
        0.85,
      );

    const play = () => timeline.play();
    const openingPending =
      !root.classList.contains("opening-seen") &&
      Boolean(document.querySelector("[data-opening]"));
    if (openingPending) {
      window.addEventListener(openingRevealEvent, play, { once: true });
    } else {
      timeline.delay(0.15).play();
    }

    return () => {
      window.removeEventListener(openingRevealEvent, play);
      timeline.kill();
    };
  }, []);

  function moveCursor(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "touch") return;

    if ((event.target as Element).closest("a, button")) {
      setIsCursorVisible(false);
      return;
    }

    const hero = heroRef.current;
    const cursor = cursorRef.current;
    if (!hero || !cursor) return;

    const bounds = hero.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;

    if (!transitionLockRef.current) {
      setIsCursorVisible(true);
    }
  }

  async function transitionFrom(origin?: Point) {
    if (transitionLockRef.current) return;

    const hero = heroRef.current;
    const dot = transitionDotRef.current;
    const transitionCopy = transitionCopyRef.current;
    const incomingCopy = incomingCopyRef.current;
    const revealOverlay = revealOverlayRef.current;
    const coverCircle = coverCircleRef.current;
    const revealCircle = revealCircleRef.current;
    if (
      !hero ||
      !dot ||
      !transitionCopy ||
      !incomingCopy ||
      !revealOverlay ||
      !coverCircle ||
      !revealCircle
    ) {
      return;
    }

    transitionLockRef.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActiveIndex((current) => (current + 1) % slides.length);
      transitionLockRef.current = false;
      return;
    }

    const bounds = hero.getBoundingClientRect();
    const copyBounds = transitionCopy.getBoundingClientRect();
    const width = bounds.width;
    const height = bounds.height;
    const start = {
      x: Math.min(Math.max(origin?.x ?? width / 2, 0), width),
      y: Math.min(Math.max(origin?.y ?? height / 2, 0), height),
    };
    const coverRadius =
      Math.max(
        Math.hypot(start.x, start.y),
        Math.hypot(width - start.x, start.y),
        Math.hypot(start.x, height - start.y),
        Math.hypot(width - start.x, height - start.y),
      ) * 1.03;
    const textOrigin = {
      x: bounds.left + start.x - copyBounds.left,
      y: bounds.top + start.y - copyBounds.top,
    };
    const incomingIndex = (activeIndex + 1) % slides.length;
    const incomingImage = imageRefs.current[incomingIndex];
    const baseCopy = baseCopyRef.current;

    if (!incomingImage || !baseCopy) {
      transitionLockRef.current = false;
      return;
    }

    // One continuous, soft-edged reveal from the click point (no cover
    // stage): the feathered edge reads like light spreading over the scene.
    const feather = Math.max(110, coverRadius * 0.14);
    const softMask = (x: number, y: number, r: number, invert = false) =>
      invert
        ? `radial-gradient(circle at ${x}px ${y}px, transparent ${r}px, black ${r + feather}px)`
        : `radial-gradient(circle at ${x}px ${y}px, black ${r}px, transparent ${r + feather}px)`;
    const setMask = (element: HTMLElement, mask: string) => {
      element.style.maskImage = mask;
      element.style.webkitMaskImage = mask;
    };
    const outgoingImage = imageRefs.current[activeIndex];

    transitionCopy.style.opacity = "0";
    // The stylesheet parks this layer at clip-path: circle(0); the soft mask
    // does the revealing now, so lift the clip or the new copy stays hidden.
    incomingCopy.style.clipPath = "none";
    setMask(incomingCopy, softMask(textOrigin.x, textOrigin.y, -feather));
    incomingCopy.style.opacity = "1";
    setMask(baseCopy, "none");

    setTransitionCopyIndex(incomingIndex);
    setHasInteracted(true);
    setIsTransitioning(true);
    setIsCursorVisible(false);
    gsap.set(dot, {
      x: start.x,
      y: start.y,
      xPercent: -50,
      yPercent: -50,
      scale: 1,
      autoAlpha: 1,
    });
    gsap.set(incomingImage, { autoAlpha: 1, scale: 1.08, zIndex: 2 });
    setMask(incomingImage, softMask(start.x, start.y, -feather));

    await nextPaint();

    try {
      gsap.to(dot, {
        autoAlpha: 0,
        scale: 3,
        duration: 0.6,
        ease: "power2.out",
      });
      const reveal = { r: -feather };
      const timeline = gsap.timeline();

      timeline.to(
        reveal,
        {
          r: coverRadius + feather,
          duration: 1.35,
          ease: "power3.inOut",
          onUpdate: () => {
            setMask(incomingImage, softMask(start.x, start.y, reveal.r));
            setMask(
              incomingCopy,
              softMask(textOrigin.x, textOrigin.y, reveal.r),
            );
            setMask(
              baseCopy,
              softMask(textOrigin.x, textOrigin.y, reveal.r, true),
            );
          },
        },
        0,
      );
      timeline.to(
        incomingImage,
        { scale: 1, duration: 1.7, ease: "expo.out" },
        0,
      );
      if (outgoingImage) {
        timeline.to(
          outgoingImage,
          { scale: 1.05, duration: 1.35, ease: "power2.inOut" },
          0,
        );
      }

      await tweenFinished(timeline);

      setActiveIndex(incomingIndex);
      await nextPaint();
      gsap.set(revealOverlay, { autoAlpha: 0 });
      gsap.set(incomingCopy, { autoAlpha: 0 });

      const currentBaseCopy = baseCopyRef.current;
      if (currentBaseCopy) {
        currentBaseCopy.style.maskImage = "none";
        currentBaseCopy.style.webkitMaskImage = "none";
      }
    } finally {
      gsap.killTweensOf([
        dot,
        transitionCopy,
        incomingCopy,
        incomingImage,
        baseCopyRef.current,
      ]);
      gsap.set(dot, { clearProps: "all" });
      gsap.set(revealOverlay, { clearProps: "all" });
      gsap.set(incomingImage, {
        clearProps: "opacity,visibility,transform,zIndex,clipPath",
      });
      incomingImage.style.maskImage = "";
      incomingImage.style.webkitMaskImage = "";
      const previousImage = imageRefs.current[activeIndex];
      if (previousImage && previousImage !== incomingImage) {
        gsap.set(previousImage, { clearProps: "transform" });
      }
      if (baseCopyRef.current) {
        gsap.set(baseCopyRef.current, {
          clearProps: "opacity,transform,maskImage,webkitMaskImage",
        });
      }
      transitionCopy.removeAttribute("style");
      incomingCopy.removeAttribute("style");
      coverCircle.setAttribute("r", "0");
      revealCircle.setAttribute("r", "0");
      transitionLockRef.current = false;
      setIsTransitioning(false);
    }
  }

  function handleClick(event: MouseEvent<HTMLElement>) {
    if ((event.target as Element).closest("a, button")) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    void transitionFrom({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
  }

  function handleIdentityButtonClick(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    const hero = heroRef.current;
    if (!hero) return;

    const bounds = hero.getBoundingClientRect();
    void transitionFrom({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
  }

  return (
    <section
      ref={heroRef}
      id="home"
      className={`${styles.hero} ${isTransitioning ? styles.transitioning : ""}`}
      data-identity={activeSlide.id}
      aria-busy={isTransitioning}
      data-analytics="hero:identity-toggle"
      onClick={handleClick}
      onPointerMove={moveCursor}
      onPointerEnter={(event) => {
        moveCursor(event);
        if (event.pointerType !== "touch" && !transitionLockRef.current) {
          setIsCursorVisible(true);
        }
      }}
      onPointerLeave={() => setIsCursorVisible(false)}
    >
      <div
        className={styles.images}
        data-scroll-shift="1.15"
        aria-hidden="true"
      >
        {slides.map((slide, index) => (
          <Image
            key={slide.id}
            ref={(node) => {
              imageRefs.current[index] = node;
            }}
            src={slide.image}
            alt=""
            fill
            sizes="100vw"
            preload={index === 0}
            loading={index === 0 ? undefined : "eager"}
            fetchPriority={index === 0 ? "high" : "low"}
            quality={index === 0 ? 75 : 68}
            className={`${styles.image} ${styles[slide.id]} ${index === activeIndex ? styles.imageActive : ""}`}
          />
        ))}
      </div>

      <div className={styles.scrim} aria-hidden="true" />
      <div
        className={styles.grain}
        data-scroll-shift="0.28"
        aria-hidden="true"
      />

      <div
        key={activeSlide.id}
        ref={baseCopyRef}
        className={`${styles.copyBlock} ${hasInteracted ? styles.interactedCopy : ""}`}
        style={hasInteracted ? { animation: "none" } : undefined}
      >
        <HeroCopy
          activeIndex={activeIndex}
          role={activeSlide.role}
          copy={activeSlide.copy}
          phrases={activeSlide.phrases}
          titleRef={baseTitleRef}
          interactive
        />
      </div>

      <div
        ref={transitionCopyRef}
        className={`${styles.copyBlock} ${styles.transitionCopy}`}
        aria-hidden="true"
      >
        <HeroCopy
          activeIndex={activeIndex}
          role={activeSlide.role}
          copy={activeSlide.copy}
          phrases={activeSlide.phrases}
        />
      </div>

      <div
        ref={incomingCopyRef}
        className={`${styles.copyBlock} ${styles.incomingCopy} ${styles.interactedCopy}`}
        aria-hidden="true"
      >
        <HeroCopy
          activeIndex={transitionCopyIndex}
          role={transitionSlide.role}
          copy={transitionSlide.copy}
          phrases={transitionSlide.phrases}
        />
      </div>

      <button
        type="button"
        ref={hintRef}
        className={styles.hint}
        data-hero-action
        data-analytics="hero:identity-toggle"
        aria-label={`当前为${activeSlide.role}视角，点击切换到${nextSlide.role}视角`}
        onClick={handleIdentityButtonClick}
      >
        <span className={styles.hintCircle}>
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M5 10h10M11 6l4 4-4 4" />
          </svg>
        </span>
        <span className={styles.hintText}>
          <small>Form ↔ Build</small>
          {activeSlide.role}视角 · 点击切换
        </span>
      </button>

      <p className={styles.srOnly} aria-live="polite">
        当前展示：身份 · {activeSlide.role}
      </p>

      <div
        ref={cursorRef}
        className={`${styles.cursor} ${isCursorVisible ? styles.cursorVisible : ""}`}
        aria-hidden="true"
      />
      <svg
        ref={revealOverlayRef}
        className={styles.revealOverlay}
        aria-hidden="true"
      >
        <defs>
          <mask id="hero-reveal-mask">
            <rect width="100%" height="100%" fill="black" />
            <circle ref={coverCircleRef} cx="0" cy="0" r="0" fill="white" />
            <circle ref={revealCircleRef} cx="0" cy="0" r="0" fill="black" />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="white"
          mask="url(#hero-reveal-mask)"
        />
      </svg>
      <div
        ref={transitionDotRef}
        className={styles.transitionDot}
        aria-hidden="true"
      />
    </section>
  );
}
