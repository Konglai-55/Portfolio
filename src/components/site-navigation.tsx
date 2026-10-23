"use client";

import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { BrandMark } from "./brand-mark";
import styles from "./site-navigation.module.css";

const navigationItems = [
  { index: "01", label: "我的作品", englishLabel: "Selected work", href: "#work" },
  { index: "02", label: "客户口碑", englishLabel: "Proof", href: "#trust" },
  { index: "03", label: "了解我", englishLabel: "About", href: "#about" },
  { index: "04", label: "联系我", englishLabel: "Contact", href: "#contact" },
] as const;

const homeItem = { index: "00", label: "首页", href: "#home" } as const;
const wechatId = "as14246791";

export function SiteNavigation() {
  const [isFloating, setIsFloating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("");
  const [copied, setCopied] = useState(false);
  const barNavRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const islandRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const collapsedSizeRef = useRef({ width: 0, height: 0 });
  const morphRef = useRef<gsap.core.Timeline | null>(null);
  const hoverTimerRef = useRef<number | undefined>(undefined);
  const scrollAtOpenRef = useRef(0);
  const isOpenRef = useRef(false);

  const current =
    navigationItems.find((item) => item.href === activeHref) ?? homeItem;

  // Scroll state and the active section.
  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const floating = window.scrollY > 80;
      setIsFloating(floating);
      // On desktop the island disappears at the top, so close it with it.
      if (!floating && window.matchMedia("(min-width: 761px)").matches) {
        setIsOpen(false);
      }
      if (
        isOpenRef.current &&
        Math.abs(window.scrollY - scrollAtOpenRef.current) > 60
      ) {
        setIsOpen(false);
      }
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    // A thin "reading line" at 42% of the viewport decides the active section.
    const sections = navigationItems
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((section): section is HTMLElement => Boolean(section))
      .sort((a, b) =>
        a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
      );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHref(`#${entry.target.id}`);
          } else if (
            entry.target === sections[0] &&
            entry.boundingClientRect.top > 0
          ) {
            setActiveHref("");
          }
        });
      },
      { rootMargin: "-42% 0px -57% 0px" },
    );
    sections.forEach((section) => observer.observe(section));

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  // Top bar: a liquid highlight glides to whichever link is hovered,
  // and rests on the active section otherwise.
  const moveIndicator = useCallback((target: HTMLElement | null) => {
    const indicator = indicatorRef.current;
    if (!indicator) return;
    if (!target) {
      gsap.to(indicator, { autoAlpha: 0, duration: 0.3, ease: "power2.out" });
      return;
    }
    const firstMove = gsap.getProperty(indicator, "autoAlpha") === 0;
    gsap.to(indicator, {
      x: target.offsetLeft,
      width: target.offsetWidth,
      autoAlpha: 1,
      duration: firstMove ? 0 : 0.55,
      ease: "expo.out",
      overwrite: "auto",
    });
  }, []);

  const restIndicator = useCallback(() => {
    const active = barNavRef.current?.querySelector<HTMLElement>(
      '[data-active="true"]',
    );
    moveIndicator(active ?? null);
  }, [moveIndicator]);

  useEffect(() => {
    restIndicator();
  }, [activeHref, restIndicator]);

  // Island morph: pill <-> panel, driven by GSAP so only the island's own
  // box animates, with content choreographed on top.
  useLayoutEffect(() => {
    isOpenRef.current = isOpen;
    const island = islandRef.current;
    const panel = panelRef.current;
    if (!island || !panel) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const labels = panel.querySelectorAll("[data-panel-label]");
    const fades = panel.querySelectorAll("[data-panel-fade]");

    morphRef.current?.kill();

    if (isOpen) {
      scrollAtOpenRef.current = window.scrollY;
      const from = {
        width: island.offsetWidth,
        height: island.offsetHeight,
      };
      collapsedSizeRef.current = from;
      gsap.set(panel, { display: "block" });
      const openWidth = Math.min(352, window.innerWidth - 24);
      gsap.set(island, { width: openWidth, height: "auto" });
      const openHeight = island.offsetHeight;
      gsap.set(island, from);

      const timeline = gsap.timeline({
        onComplete: () => {
          gsap.set(island, { height: "auto" });
        },
      });
      timeline
        .to(island, {
          width: openWidth,
          height: openHeight,
          duration: reduce ? 0 : 0.7,
          ease: "expo.out",
        })
        .fromTo(
          labels,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: reduce ? 0 : 0.7,
            ease: "expo.out",
            stagger: 0.05,
          },
          reduce ? 0 : 0.1,
        )
        .fromTo(
          fades,
          { autoAlpha: 0, y: 8 },
          {
            autoAlpha: 1,
            y: 0,
            duration: reduce ? 0 : 0.5,
            ease: "power3.out",
            stagger: 0.04,
          },
          reduce ? 0 : 0.16,
        );
      morphRef.current = timeline;
    } else if (panel.style.display === "block") {
      const to = collapsedSizeRef.current;
      const timeline = gsap.timeline({
        onComplete: () => {
          gsap.set(panel, { display: "none" });
          gsap.set(island, { clearProps: "width,height" });
        },
      });
      timeline
        .to([...fades, ...labels], {
          autoAlpha: 0,
          duration: reduce ? 0 : 0.18,
          ease: "power1.out",
        })
        .to(
          island,
          {
            width: to.width,
            height: to.height,
            duration: reduce ? 0 : 0.5,
            ease: "power3.inOut",
          },
          reduce ? 0 : 0.06,
        )
        .set(labels, { autoAlpha: 1 });
      morphRef.current = timeline;
    }
  }, [isOpen]);

  // Close on Escape or a click outside; never leave the panel open at the top.
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const handlePointer = (event: PointerEvent) => {
      if (!islandRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("pointerdown", handlePointer);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("pointerdown", handlePointer);
    };
  }, [isOpen]);

  useEffect(() => () => window.clearTimeout(hoverTimerRef.current), []);

  const openSoon = (event: ReactPointerEvent) => {
    if (event.pointerType !== "mouse") return;
    window.clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = window.setTimeout(() => setIsOpen(true), 90);
  };
  const closeSoon = (event: ReactPointerEvent) => {
    if (event.pointerType !== "mouse") return;
    window.clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = window.setTimeout(() => setIsOpen(false), 280);
  };

  const copyWechat = async () => {
    try {
      await navigator.clipboard.writeText(wechatId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      data-site-navigation
      className={styles.root}
      data-floating={isFloating}
      data-open={isOpen}
    >
      <header className={styles.bar}>
        <a href="#home" className={styles.brand} aria-label="返回首页">
          <span className={styles.brandMark} data-nav-brand-mark>
            <BrandMark className={styles.brandGlyph} />
          </span>
          <span className={styles.brandCopy} data-nav-reveal>
            <strong>Liang Xikun</strong>
            <small>Form × Build</small>
          </span>
        </a>

        <nav
          ref={barNavRef}
          className={styles.barNav}
          aria-label="主要导航"
          data-nav-reveal
          onPointerLeave={restIndicator}
        >
          <span ref={indicatorRef} className={styles.indicator} aria-hidden="true" />
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={styles.barLink}
              data-active={activeHref === item.href}
              aria-current={activeHref === item.href ? "location" : undefined}
              data-analytics={`navigation:${item.href.slice(1)}`}
              onPointerEnter={(event) => moveIndicator(event.currentTarget)}
              onFocus={(event) => moveIndicator(event.currentTarget)}
              onBlur={restIndicator}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className={styles.barCta}
          data-nav-reveal
          data-analytics="navigation:availability"
          aria-label="当前可承接项目，前往联系区域"
        >
          <span className={styles.statusDot} aria-hidden="true" />
          聊聊项目
          <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden="true" />
        </a>
      </header>

      <div
        ref={islandRef}
        className={styles.island}
        onPointerEnter={openSoon}
        onPointerLeave={closeSoon}
      >
        <div className={styles.islandBar}>
          <a
            href="#home"
            className={styles.islandMark}
            aria-label="返回首页"
            data-nav-brand-mark
            onClick={() => setIsOpen(false)}
          >
            <BrandMark className={styles.brandGlyph} />
          </a>

          <button
            type="button"
            className={styles.islandLabel}
            aria-expanded={isOpen}
            aria-controls="site-navigation-panel"
            onClick={() => setIsOpen((open) => !open)}
          >
            <span className={styles.labelMask}>
              <span key={current.index} className={styles.labelIndex}>
                {current.index}
              </span>
            </span>
            <span className={styles.labelMask}>
              <span key={current.label} className={styles.labelText}>
                {current.label}
              </span>
            </span>
          </button>

          <button
            ref={menuButtonRef}
            type="button"
            className={styles.menuButton}
            aria-expanded={isOpen}
            aria-controls="site-navigation-panel"
            aria-label={isOpen ? "收起导航" : "展开导航"}
            onClick={() => setIsOpen((open) => !open)}
          >
            <svg className={styles.ring} viewBox="0 0 40 40" aria-hidden="true">
              <circle className={styles.ringTrack} cx="20" cy="20" r="18.5" pathLength="1" />
              <circle className={styles.ringProgress} cx="20" cy="20" r="18.5" pathLength="1" />
            </svg>
            <span className={styles.burger} aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>

        <div
          ref={panelRef}
          id="site-navigation-panel"
          className={styles.panel}
          inert={!isOpen}
        >
          <div className={styles.panelHead} data-panel-fade>
            <span>Navigate</span>
            <kbd>Esc</kbd>
          </div>
          <nav aria-label="快速导航">
            <ol className={styles.panelList}>
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={styles.panelLink}
                    data-active={activeHref === item.href}
                    aria-current={activeHref === item.href ? "location" : undefined}
                    data-analytics={`navigation:panel:${item.href.slice(1)}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className={styles.panelIndex} data-panel-fade>
                      {item.index}
                    </span>
                    <span className={styles.panelLabelMask}>
                      <span className={styles.panelLabel} data-panel-label>
                        {item.label}
                      </span>
                    </span>
                    <small data-panel-fade>{item.englishLabel}</small>
                    <ArrowUpRight
                      className={styles.panelArrow}
                      size={15}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className={styles.panelFoot} data-panel-fade>
            <span className={styles.panelStatus}>
              <span className={styles.statusDot} aria-hidden="true" />
              可接新项目
            </span>
            <button
              type="button"
              className={styles.copyButton}
              data-copied={copied}
              onClick={copyWechat}
              data-analytics="navigation:copy-wechat"
            >
              {copied ? "微信号已复制" : `复制微信 ${wechatId}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
