"use client";

import { usePathname } from "next/navigation";
import { localizedPath, type Locale } from "@/lib/i18n";
import styles from "./language-switch.module.css";

export function LanguageSwitch() {
  const pathname = usePathname();
  const english = pathname === "/en" || pathname.startsWith("/en/");
  const base = english ? pathname.slice(3) || "/" : pathname;
  function remember(locale: Locale) {
    document.cookie = `portfolio-language=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  }
  return <nav className={styles.switch} aria-label="Language / 语言" data-language-switch>
    <a href={`/zh${base === "/" ? "" : base}`} hrefLang="zh-CN" lang="zh-CN" aria-current={!english ? "true" : undefined} onClick={event => { remember("zh"); event.currentTarget.href = base + location.search + location.hash; }}>中文</a>
    <span aria-hidden="true">/</span>
    <a href={localizedPath(base, "en")} hrefLang="en" lang="en" aria-current={english ? "true" : undefined} onClick={event => { remember("en"); event.currentTarget.href = localizedPath(base, "en") + location.search + location.hash; }}>EN</a>
  </nav>;
}
