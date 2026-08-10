import "server-only";

import { readAnalyticsEvents } from "./storage";
import type {
  AnalyticsReport,
  MetricSummary,
  RankedMetric,
  StoredAnalyticsEvent,
  WebVitalName,
} from "./types";

const REPORT_TIMEZONE = "Asia/Shanghai";
const DAY_MS = 86_400_000;

type SessionAggregate = {
  sessionId: string;
  visitor: string;
  startedAt: number;
  endedAt: number;
  pageViews: number;
  firstPage: string;
  referrer: string;
  device: string;
  location: string;
  duration: number;
  scrollDepth: number;
  interactions: number;
};

type PeriodAggregate = {
  pageViews: number;
  visitors: number;
  sessions: number;
  avgDuration: number;
  bounceRate: number;
  avgScroll: number;
  sessionRows: SessionAggregate[];
};

function dayKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: REPORT_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function startOfTodayInShanghai(now: Date) {
  return new Date(`${dayKey(now)}T00:00:00+08:00`);
}

function percentChange(current: number, previous: number) {
  if (previous === 0) {
    return current === 0 ? 0 : null;
  }
  return ((current - previous) / previous) * 100;
}

function metric(current: number, previous: number): MetricSummary {
  return {
    value: current,
    previous,
    change: percentChange(current, previous),
  };
}

function round(value: number, precision = 0) {
  const multiplier = 10 ** precision;
  return Math.round(value * multiplier) / multiplier;
}

function deviceLabel(event: StoredAnalyticsEvent) {
  const type = {
    desktop: "桌面端",
    mobile: "手机",
    tablet: "平板",
  }[event.device.type];
  return `${type} · ${event.device.browser}`;
}

function locationLabel(event: StoredAnalyticsEvent) {
  const parts = [
    event.location.country,
    event.location.region,
    event.location.city,
  ].filter((value): value is string => Boolean(value && value !== "未知"));
  return [...new Set(parts)].join(" · ") || "未知";
}

function aggregateSessions(events: StoredAnalyticsEvent[]) {
  const sessions = new Map<string, SessionAggregate>();

  for (const event of events) {
    const occurredAt = new Date(event.occurredAt).valueOf();
    if (!Number.isFinite(occurredAt)) continue;

    const current = sessions.get(event.sessionId) ?? {
      sessionId: event.sessionId,
      visitor: event.visitorHash,
      startedAt: occurredAt,
      endedAt: occurredAt,
      pageViews: 0,
      firstPage: event.page,
      referrer: event.referrer || "直接访问",
      device: deviceLabel(event),
      location: locationLabel(event),
      duration: 0,
      scrollDepth: 0,
      interactions: 0,
    };

    if (occurredAt < current.startedAt) {
      current.startedAt = occurredAt;
      current.firstPage = event.page;
    }
    current.endedAt = Math.max(current.endedAt, occurredAt);

    if (event.name === "page_view") {
      current.pageViews += 1;
      if (current.referrer === "直接访问" && event.referrer) {
        current.referrer = event.referrer;
      }
    } else if (event.name === "engagement" && event.value !== null) {
      current.duration = Math.max(current.duration, event.value);
    } else if (event.name === "scroll_depth" && event.value !== null) {
      current.scrollDepth = Math.max(current.scrollDepth, event.value);
    } else if (event.name === "interaction") {
      current.interactions += 1;
    }

    sessions.set(event.sessionId, current);
  }

  for (const session of sessions.values()) {
    if (session.duration === 0) {
      session.duration = Math.min(
        30 * 60 * 1000,
        Math.max(0, session.endedAt - session.startedAt),
      );
    }
  }

  return [...sessions.values()];
}

function aggregatePeriod(events: StoredAnalyticsEvent[]): PeriodAggregate {
  const pageViewEvents = events.filter((event) => event.name === "page_view");
  const sessionRows = aggregateSessions(events);
  const visitors = new Set(pageViewEvents.map((event) => event.visitorHash)).size;
  const avgDuration = sessionRows.length
    ? sessionRows.reduce((sum, session) => sum + session.duration, 0) /
      sessionRows.length
    : 0;
  const avgScroll = sessionRows.length
    ? sessionRows.reduce((sum, session) => sum + session.scrollDepth, 0) /
      sessionRows.length
    : 0;
  const bounced = sessionRows.filter(
    (session) =>
      session.pageViews <= 1 &&
      session.duration < 10_000 &&
      session.scrollDepth < 50,
  ).length;

  return {
    pageViews: pageViewEvents.length,
    visitors,
    sessions: sessionRows.length,
    avgDuration: round(avgDuration / 1000),
    bounceRate: round(sessionRows.length ? (bounced / sessionRows.length) * 100 : 0, 1),
    avgScroll: round(avgScroll, 1),
    sessionRows,
  };
}

function ranked(values: string[], fallback = "未知", limit = 6): RankedMetric[] {
  const counts = new Map<string, number>();
  for (const rawValue of values) {
    const value = rawValue || fallback;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  const total = values.length || 1;
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([label, value]) => ({
      label,
      value,
      share: round((value / total) * 100, 1),
    }));
}

function percentile(values: number[], percentileValue: number) {
  if (!values.length) return null;
  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.min(
    sorted.length - 1,
    Math.ceil(sorted.length * percentileValue) - 1,
  );
  return sorted[index];
}

function vitalRating(name: WebVitalName, value: number | null) {
  if (value === null) return "unknown" as const;
  const thresholds: Record<WebVitalName, [number, number]> = {
    TTFB: [800, 1800],
    LCP: [2500, 4000],
    INP: [200, 500],
    CLS: [0.1, 0.25],
  };
  const [good, poor] = thresholds[name];
  if (value <= good) return "good" as const;
  if (value <= poor) return "needs-improvement" as const;
  return "poor" as const;
}

function buildVitals(events: StoredAnalyticsEvent[]): AnalyticsReport["vitals"] {
  const names: WebVitalName[] = ["LCP", "INP", "CLS", "TTFB"];
  return names.map((name) => {
    const values = events
      .filter(
        (event) =>
          event.name === "web_vital" &&
          event.metric === name &&
          event.value !== null,
      )
      .map((event) => event.value as number);
    const rawValue = percentile(values, 0.75);
    const value = rawValue === null ? null : round(rawValue, name === "CLS" ? 3 : 0);
    return {
      name,
      value,
      unit: name === "CLS" ? ("score" as const) : ("ms" as const),
      rating: vitalRating(name, value),
      samples: values.length,
    };
  });
}

function emptyReport(rangeDays: number, from: Date, to: Date): AnalyticsReport {
  const emptyMetric = metric(0, 0);
  return {
    configured: false,
    generatedAt: new Date().toISOString(),
    rangeDays,
    range: { from: from.toISOString(), to: to.toISOString() },
    overview: {
      pageViews: emptyMetric,
      visitors: emptyMetric,
      sessions: emptyMetric,
      avgDuration: emptyMetric,
      bounceRate: emptyMetric,
      avgScroll: emptyMetric,
    },
    timeline: [],
    topPages: [],
    referrers: [],
    devices: [],
    browsers: [],
    countries: [],
    interactions: [],
    vitals: buildVitals([]),
    recentSessions: [],
    diagnostics: {
      eventCount: 0,
      currentEventCount: 0,
      truncated: false,
      storageMessage: "等待配置雨云对象存储凭据",
    },
  };
}

export async function getAnalyticsReport(requestedRange = 30) {
  const rangeDays = [7, 30, 90].includes(requestedRange) ? requestedRange : 30;
  const now = new Date();
  const todayStart = startOfTodayInShanghai(now);
  const currentFrom = new Date(todayStart.valueOf() - (rangeDays - 1) * DAY_MS);
  const previousFrom = new Date(currentFrom.valueOf() - rangeDays * DAY_MS);
  const previousTo = new Date(currentFrom.valueOf() - 1);
  const readResult = await readAnalyticsEvents(previousFrom, now);

  if (!readResult.configured) {
    return emptyReport(rangeDays, currentFrom, now);
  }

  const currentEvents = readResult.events.filter((event) => {
    const time = new Date(event.occurredAt).valueOf();
    return time >= currentFrom.valueOf() && time <= now.valueOf();
  });
  const previousEvents = readResult.events.filter((event) => {
    const time = new Date(event.occurredAt).valueOf();
    return time >= previousFrom.valueOf() && time <= previousTo.valueOf();
  });
  const current = aggregatePeriod(currentEvents);
  const previous = aggregatePeriod(previousEvents);
  const pageViews = currentEvents.filter((event) => event.name === "page_view");

  const timeline = Array.from({ length: rangeDays }, (_, index) => {
    const date = new Date(currentFrom.valueOf() + index * DAY_MS);
    const key = dayKey(date);
    const dayPageViews = pageViews.filter(
      (event) => dayKey(new Date(event.occurredAt)) === key,
    );
    return {
      date: key,
      pageViews: dayPageViews.length,
      visitors: new Set(dayPageViews.map((event) => event.visitorHash)).size,
    };
  });

  const recentSessions = current.sessionRows
    .sort((left, right) => right.startedAt - left.startedAt)
    .slice(0, 14)
    .map((session) => ({
      sessionId: session.sessionId,
      visitor: session.visitor.slice(0, 8).toUpperCase(),
      startedAt: new Date(session.startedAt).toISOString(),
      page: session.firstPage,
      referrer: session.referrer,
      device: session.device,
      location: session.location,
      duration: round(session.duration / 1000),
      scrollDepth: round(session.scrollDepth),
      interactions: session.interactions,
    }));

  return {
    configured: true,
    generatedAt: now.toISOString(),
    rangeDays,
    range: { from: currentFrom.toISOString(), to: now.toISOString() },
    overview: {
      pageViews: metric(current.pageViews, previous.pageViews),
      visitors: metric(current.visitors, previous.visitors),
      sessions: metric(current.sessions, previous.sessions),
      avgDuration: metric(current.avgDuration, previous.avgDuration),
      bounceRate: metric(current.bounceRate, previous.bounceRate),
      avgScroll: metric(current.avgScroll, previous.avgScroll),
    },
    timeline,
    topPages: ranked(pageViews.map((event) => event.page), "/"),
    referrers: ranked(
      current.sessionRows.map((session) => session.referrer),
      "直接访问",
    ),
    devices: ranked(
      pageViews.map((event) =>
        ({ desktop: "桌面端", mobile: "手机", tablet: "平板" })[
          event.device.type
        ],
      ),
    ),
    browsers: ranked(pageViews.map((event) => event.device.browser)),
    countries: ranked(pageViews.map((event) => locationLabel(event))),
    interactions: ranked(
      currentEvents
        .filter((event) => event.name === "interaction")
        .map((event) => event.label),
      "未命名交互",
      8,
    ),
    vitals: buildVitals(currentEvents),
    recentSessions,
    diagnostics: {
      eventCount: readResult.events.length,
      currentEventCount: currentEvents.length,
      truncated: readResult.truncated,
      storageMessage: readResult.message,
    },
  } satisfies AnalyticsReport;
}
