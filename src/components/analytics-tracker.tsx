"use client";

import { useEffect } from "react";
import type {
  AnalyticsEventName,
  ClientAnalyticsEvent,
  WebVitalName,
} from "@/lib/analytics/types";

const VISITOR_KEY = "lx_portfolio_visitor";
const SESSION_KEY = "lx_portfolio_session";
const scrollMilestones = [25, 50, 75, 90, 100] as const;

function createBrowserId() {
  const browserCrypto = globalThis.crypto;
  if (typeof browserCrypto?.randomUUID === "function") {
    return browserCrypto.randomUUID();
  }

  if (typeof browserCrypto?.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    browserCrypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
    return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex
      .slice(6, 8)
      .join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
  }

  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}_${Math.random()
    .toString(36)
    .slice(2)}`;
}

function safeStorageId(storage: Storage, key: string) {
  try {
    const existing = storage.getItem(key);
    if (existing) {
      return existing;
    }
    const created = createBrowserId();
    storage.setItem(key, created);
    return created;
  } catch {
    return createBrowserId();
  }
}

function pageContext() {
  return {
    page: window.location.pathname,
    title: document.title,
    referrer: document.referrer,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
    },
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

function interactionLabel(target: Element) {
  const explicit = target.closest<HTMLElement>("[data-analytics]");
  if (explicit?.dataset.analytics) {
    return explicit.dataset.analytics;
  }

  const anchor = target.closest<HTMLAnchorElement>("a[href]");
  if (anchor) {
    const href = anchor.getAttribute("href") || "";
    if (href.startsWith("tel:")) return "contact:phone";
    if (href.startsWith("mailto:")) return "contact:email";
    if (href.startsWith("#")) return `navigation:${href.slice(1) || "home"}`;
    try {
      return `external:${new URL(anchor.href).hostname}`;
    } catch {
      return "link";
    }
  }

  const button = target.closest<HTMLButtonElement>("button");
  if (button) {
    const label = button.getAttribute("aria-label") || button.textContent || "button";
    return `button:${label.replace(/\s+/g, " ").trim().slice(0, 80)}`;
  }

  return "";
}

export function AnalyticsTracker() {
  useEffect(() => {
    if (
      navigator.doNotTrack === "1" ||
      window.location.pathname.startsWith("/admin")
    ) {
      return;
    }

    const visitorId = safeStorageId(window.localStorage, VISITOR_KEY);
    const sessionId = safeStorageId(window.sessionStorage, SESSION_KEY);
    const sentScrollMilestones = new Set<number>();
    const vitalValues = new Map<WebVitalName, number>();
    let visibleSince = document.visibilityState === "visible" ? performance.now() : 0;
    let activeDuration = 0;
    let lastEngagementSent = 0;
    let closed = false;

    const send = (
      name: AnalyticsEventName,
      details: Partial<ClientAnalyticsEvent> = {},
      preferBeacon = false,
    ) => {
      const payload: ClientAnalyticsEvent = {
        name,
        sessionId,
        visitorId,
        occurredAt: new Date().toISOString(),
        ...pageContext(),
        ...details,
      };
      const body = JSON.stringify(payload);

      if (preferBeacon && navigator.sendBeacon) {
        const accepted = navigator.sendBeacon(
          "/api/analytics/collect",
          new Blob([body], { type: "application/json" }),
        );
        if (accepted) {
          return;
        }
      }

      void fetch("/api/analytics/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: preferBeacon,
        credentials: "same-origin",
      }).catch(() => undefined);
    };

    const currentActiveDuration = () =>
      activeDuration +
      (visibleSince > 0 ? Math.max(0, performance.now() - visibleSince) : 0);

    const sendEngagement = (preferBeacon = false) => {
      const duration = Math.round(currentActiveDuration());
      if (duration - lastEngagementSent < 1000) {
        return;
      }
      lastEngagementSent = duration;
      send("engagement", { value: duration }, preferBeacon);
    };

    const sendVitals = (preferBeacon = false) => {
      for (const [metric, value] of vitalValues) {
        send("web_vital", { metric, value }, preferBeacon);
      }
      vitalValues.clear();
    };

    const finalize = () => {
      if (closed) return;
      closed = true;
      sendEngagement(true);
      sendVitals(true);
    };

    send("page_view");

    const navigation = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming | undefined;
    if (navigation?.responseStart) {
      vitalValues.set("TTFB", Math.max(0, navigation.responseStart));
    }

    const observers: PerformanceObserver[] = [];
    const observe = (
      type: string,
      callback: (entry: PerformanceEntry) => void,
      options?: PerformanceObserverInit,
    ) => {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach(callback);
        });
        observer.observe(options ?? { type, buffered: true });
        observers.push(observer);
      } catch {
        // Older browsers simply skip unsupported web-vital observers.
      }
    };

    observe("largest-contentful-paint", (entry) => {
      vitalValues.set("LCP", entry.startTime);
    });

    let cumulativeLayoutShift = 0;
    observe("layout-shift", (entry) => {
      const layoutShift = entry as PerformanceEntry & {
        value?: number;
        hadRecentInput?: boolean;
      };
      if (!layoutShift.hadRecentInput) {
        cumulativeLayoutShift += layoutShift.value ?? 0;
        vitalValues.set("CLS", cumulativeLayoutShift);
      }
    });

    observe(
      "event",
      (entry) => {
        const currentInp = vitalValues.get("INP") ?? 0;
        vitalValues.set("INP", Math.max(currentInp, entry.duration));
      },
      {
        type: "event",
        buffered: true,
        durationThreshold: 40,
      } as PerformanceObserverInit,
    );

    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const depth = scrollable <= 0 ? 100 : Math.round((window.scrollY / scrollable) * 100);
      for (const milestone of scrollMilestones) {
        if (depth >= milestone && !sentScrollMilestones.has(milestone)) {
          sentScrollMilestones.add(milestone);
          send("scroll_depth", { value: milestone });
        }
      }
    };

    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const label = interactionLabel(event.target);
      if (label) {
        send("interaction", { label });
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        if (visibleSince > 0) {
          activeDuration += Math.max(0, performance.now() - visibleSince);
          visibleSince = 0;
        }
        sendEngagement(true);
        sendVitals(true);
      } else {
        visibleSince = performance.now();
      }
    };

    const heartbeat = window.setInterval(() => sendEngagement(), 30_000);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleClick, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", finalize);
    handleScroll();

    return () => {
      finalize();
      window.clearInterval(heartbeat);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", finalize);
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return null;
}
