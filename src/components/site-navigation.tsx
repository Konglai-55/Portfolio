"use client";

import { useEffect, useState } from "react";
import { BrandMark } from "./brand-mark";
import styles from "./site-navigation.module.css";

const navigationItems = [
  { label: "我的作品", englishLabel: "My work", href: "#work" },
  { label: "客户口碑", englishLabel: "Proof", href: "#trust" },
  { label: "了解我", englishLabel: "About me", href: "#about" },
  { label: "联系我", englishLabel: "Contact me", href: "#contact" },
] as const;

export function SiteNavigation() {
  const [isFloating, setIsFloating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeHref, setActiveHref] = useState("");

  useEffect(() => {
    let frame = 0;
    function updateFloating() {
      frame = 0;
      const shouldFloat = window.scrollY > 72;
      setIsFloating(shouldFloat);
      if (!shouldFloat) {
        setIsExpanded(false);
      }
    }
    function scheduleUpdate() {
      if (!frame) frame = requestAnimationFrame(updateFloating);
    }

    // A thin "reading line" at 42% of the viewport decides the active section,
    // without reading layout on every scroll frame.
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

    updateFloating();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <header
      data-site-navigation
      className={`${styles.shell} ${isFloating ? styles.floating : styles.topBar} ${isExpanded ? styles.expanded : ""}`}
      onPointerEnter={(event) => {
        if (isFloating && event.pointerType === "mouse") {
          setIsExpanded(true);
        }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") {
          setIsExpanded(false);
        }
      }}
      onFocusCapture={() => {
        if (isFloating) setIsExpanded(true);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsExpanded(false);
        }
      }}
    >
      <a href="#home" className={styles.brand} aria-label="返回首页">
        <span className={styles.brandMark} data-nav-brand-mark>
          <BrandMark className={styles.brandGlyph} />
        </span>
        <span className={styles.brandCopy} data-nav-reveal>
          <strong>Liang Xikun</strong>
          <small>Form × Build</small>
        </span>
      </a>

      <button
        type="button"
        className={styles.menuButton}
        data-nav-reveal
        aria-expanded={isExpanded}
        aria-controls="site-navigation-links"
        onClick={() => setIsExpanded((current) => !current)}
      >
        <span>{isExpanded ? "收起" : "菜单"}</span>
        <span className={styles.menuIcon} aria-hidden="true" />
      </button>

      <nav
        id="site-navigation-links"
        className={styles.links}
        aria-label="主要导航"
        data-nav-reveal
      >
        {navigationItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            data-analytics={`navigation:${item.href.slice(1)}`}
            className={`${styles.link} ${activeHref === item.href ? styles.active : ""}`}
            aria-current={activeHref === item.href ? "location" : undefined}
            onClick={() => setIsExpanded(false)}
          >
            <small className={styles.linkCaption}>{item.englishLabel}</small>
            <span className={styles.linkLabel}>{item.label}</span>
          </a>
        ))}
      </nav>

      <a
        href="#contact"
        className={styles.availability}
        data-nav-reveal
        data-analytics="navigation:availability"
        aria-label="当前可承接精选项目，前往联系区域"
      >
        <span className={styles.statusDot} />
        <span className={styles.availabilityText}>
          <strong>Available for selected projects</strong>
          <small>Design × Engineering</small>
        </span>
      </a>
    </header>
  );
}
