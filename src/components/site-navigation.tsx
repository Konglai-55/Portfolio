"use client";

import { useEffect, useState } from "react";
import { BrandMark } from "./brand-mark";
import styles from "./site-navigation.module.css";

const navigationItems = [
  { label: "了解我", englishLabel: "About me", href: "#about" },
  { label: "我的作品", englishLabel: "My work", href: "#work" },
  { label: "联系我", englishLabel: "Contact me", href: "#contact" },
] as const;

export function SiteNavigation() {
  const [isFloating, setIsFloating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeHref, setActiveHref] = useState("");

  useEffect(() => {
    function updateNavigation() {
      const shouldFloat = window.scrollY > 72;
      setIsFloating(shouldFloat);

      const readingLine = window.scrollY + window.innerHeight * 0.42;
      const currentSection = [...navigationItems]
        .reverse()
        .find((item) => {
          const section = document.querySelector<HTMLElement>(item.href);
          return section && section.offsetTop <= readingLine;
        });
      setActiveHref(currentSection?.href ?? "");

      if (!shouldFloat) {
        setIsExpanded(false);
      }
    }

    updateNavigation();
    window.addEventListener("scroll", updateNavigation, { passive: true });
    return () => window.removeEventListener("scroll", updateNavigation);
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

      <div className={styles.utilities} aria-hidden="true">
        <span className={styles.themeControl}>
          <span className={styles.moonIcon} aria-hidden="true" />
        </span>
        <span className={styles.languageControl}>中文</span>
      </div>

      <div className={styles.availability} data-nav-reveal>
        <span className={styles.statusDot} />
        <span className={styles.availabilityText}>
          <strong>Available for projects</strong>
          <small>Design × Engineering</small>
        </span>
      </div>
    </header>
  );
}
