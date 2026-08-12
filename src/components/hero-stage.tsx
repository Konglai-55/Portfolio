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
import { BrandMark } from "./brand-mark";
import { mediaUrl } from "@/lib/media";
import styles from "./hero-stage.module.css";

const slides = [
  {
    id: "designer",
    role: "设计师",
    image: mediaUrl("images/hero-designer.png"),
    alt: "阳光洒进画室，一位设计师正在窗边创作",
  },
  {
    id: "developer",
    role: "开发者",
    image: mediaUrl("images/hero-developer.png"),
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
  titleRef?: Ref<HTMLHeadingElement>;
  interactive?: boolean;
};

function HeroCopy({
  activeIndex,
  role,
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
      <p className={styles.eyebrow}>
        <span />
        独立设计师 × 全栈开发者
        <small className={styles.identityCount}>
          {role} · 0{activeIndex + 1} / 02
        </small>
      </p>

      <h1 ref={titleRef}>
        <span>设计表达，</span>
        <span>由工程完整落地。</span>
      </h1>

      <p className={styles.serviceCopy}>
        从品牌视觉、UI / UX 到前端与全栈开发，我独立负责从需求、设计、开发到部署上线的完整过程。
      </p>

      <div className={styles.actions}>
        {actions.map((action, index) =>
          interactive ? (
            <a
              key={action.href}
              className={index === 0 ? styles.primaryAction : styles.secondaryAction}
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
              className={index === 0 ? styles.primaryAction : styles.secondaryAction}
            >
              <span>{action.label}</span>
              <i aria-hidden="true">↗</i>
            </span>
          ),
        )}
      </div>

      <dl className={styles.proofPoints}>
        <div>
          <dt>5+ Years</dt>
          <dd>独立开发经验</dd>
        </div>
        <div>
          <dt>Design × Code</dt>
          <dd>设计与开发</dd>
        </div>
        <div>
          <dt>End-to-end</dt>
          <dd>完整项目交付</dd>
        </div>
      </dl>
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

  useLayoutEffect(() => {
    const title = baseTitleRef.current;
    if (!title) return;

    const tween = gsap.fromTo(
      title,
      {
        clipPath: "inset(100% 0% 0% 0%)",
        y: "1.25rem",
      },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        y: 0,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      },
    );

    return () => {
      tween.kill();
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
    const dotSize = 18;
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

    coverCircle.setAttribute("cx", String(start.x));
    coverCircle.setAttribute("cy", String(start.y));
    coverCircle.setAttribute("r", String(dotSize / 2));
    revealCircle.setAttribute("cx", String(start.x));
    revealCircle.setAttribute("cy", String(start.y));
    revealCircle.setAttribute("r", "0");
    transitionCopy.style.clipPath = `circle(${dotSize / 2}px at ${textOrigin.x}px ${textOrigin.y}px)`;
    transitionCopy.style.maskImage = "none";
    transitionCopy.style.webkitMaskImage = "none";
    transitionCopy.style.opacity = "1";
    incomingCopy.style.clipPath = `circle(0px at ${textOrigin.x}px ${textOrigin.y}px)`;
    incomingCopy.style.opacity = "1";
    baseCopy.style.maskImage = "none";
    baseCopy.style.webkitMaskImage = "none";

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
    gsap.set(revealOverlay, { autoAlpha: 1 });
    gsap.set(incomingImage, {
      autoAlpha: 1,
      scale: 1,
      zIndex: 2,
      clipPath: `circle(0px at ${start.x}px ${start.y}px)`,
    });

    await nextPaint();

    try {
      gsap.set(dot, { autoAlpha: 0 });
      const radii = {
        cover: dotSize / 2,
        reveal: 0,
      };
      const timeline = gsap.timeline();

      timeline.to(
        radii,
        {
          cover: coverRadius,
          duration: 0.78,
          ease: "power3.out",
          onUpdate: () => {
            coverCircle.setAttribute("r", String(radii.cover));
            transitionCopy.style.clipPath = `circle(${radii.cover}px at ${textOrigin.x}px ${textOrigin.y}px)`;
          },
        },
        0,
      );

      timeline.to(
        radii,
        {
          reveal: coverRadius,
          duration: 0.96,
          ease: "power2.out",
          onUpdate: () => {
            const radius = radii.reveal;
            const oldTextMask = `radial-gradient(circle at ${textOrigin.x}px ${textOrigin.y}px, transparent 0, transparent ${radius}px, black ${radius + 1}px)`;

            revealCircle.setAttribute("r", String(radius));
            baseCopy.style.maskImage = oldTextMask;
            baseCopy.style.webkitMaskImage = oldTextMask;
            transitionCopy.style.maskImage = oldTextMask;
            transitionCopy.style.webkitMaskImage = oldTextMask;
            incomingCopy.style.clipPath = `circle(${radius}px at ${textOrigin.x}px ${textOrigin.y}px)`;
            incomingImage.style.clipPath = `circle(${radius}px at ${start.x}px ${start.y}px)`;
          },
        },
        0.055,
      );

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
      <div className={styles.images} data-scroll-shift="1.15" aria-hidden="true">
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
            className={`${styles.image} ${styles[slide.id]} ${index === activeIndex ? styles.imageActive : ""}`}
          />
        ))}
      </div>

      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.grain} data-scroll-shift="0.28" aria-hidden="true" />
      <div className={styles.heroMeta} aria-hidden="true">
        <span className={styles.heroBrand}>
          <BrandMark className={styles.heroBrandMark} />
          <span>
            <strong>形构 / Form × Build</strong>
            <small>Design expression · Engineered delivery</small>
          </span>
        </span>
        <span>Tangshan · China · 2026</span>
      </div>

      <div
        key={activeSlide.id}
        ref={baseCopyRef}
        className={`${styles.copyBlock} ${hasInteracted ? styles.interactedCopy : ""}`}
        style={hasInteracted ? { animation: "none" } : undefined}
      >
        <HeroCopy
          activeIndex={activeIndex}
          role={activeSlide.role}
          titleRef={baseTitleRef}
          interactive
        />
      </div>

      <div
        ref={transitionCopyRef}
        className={`${styles.copyBlock} ${styles.transitionCopy}`}
        aria-hidden="true"
      >
        <HeroCopy activeIndex={activeIndex} role={activeSlide.role} />
      </div>

      <div
        ref={incomingCopyRef}
        className={`${styles.copyBlock} ${styles.incomingCopy} ${styles.interactedCopy}`}
        aria-hidden="true"
      >
        <HeroCopy
          activeIndex={transitionCopyIndex}
          role={transitionSlide.role}
        />
      </div>

      <button
        type="button"
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
      <div ref={transitionDotRef} className={styles.transitionDot} aria-hidden="true" />
    </section>
  );
}
