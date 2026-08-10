export const analyticsEventNames = [
  "page_view",
  "engagement",
  "scroll_depth",
  "interaction",
  "web_vital",
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];

export const webVitalNames = ["TTFB", "LCP", "INP", "CLS"] as const;

export type WebVitalName = (typeof webVitalNames)[number];

export type ClientAnalyticsEvent = {
  name: AnalyticsEventName;
  sessionId: string;
  visitorId: string;
  occurredAt: string;
  page: string;
  title?: string;
  referrer?: string;
  label?: string;
  value?: number;
  metric?: WebVitalName;
  screen?: {
    width: number;
    height: number;
  };
  viewport?: {
    width: number;
    height: number;
  };
  language?: string;
  timezone?: string;
};

export type StoredAnalyticsEvent = {
  version: 1;
  id: string;
  name: AnalyticsEventName;
  occurredAt: string;
  receivedAt: string;
  sessionId: string;
  visitorHash: string;
  ipHash: string;
  page: string;
  title: string;
  referrer: string;
  label: string;
  value: number | null;
  metric: WebVitalName | null;
  screen: {
    width: number;
    height: number;
  } | null;
  viewport: {
    width: number;
    height: number;
  } | null;
  locale: {
    language: string;
    timezone: string;
  };
  device: {
    type: "desktop" | "mobile" | "tablet";
    browser: string;
    os: string;
  };
  location: {
    country: string;
    region?: string;
    city: string;
    source?: "geoip" | "header" | "unknown";
  };
};

export type MetricSummary = {
  value: number;
  previous: number;
  change: number | null;
};

export type RankedMetric = {
  label: string;
  value: number;
  share: number;
};

export type AnalyticsReport = {
  configured: boolean;
  generatedAt: string;
  rangeDays: number;
  range: {
    from: string;
    to: string;
  };
  overview: {
    pageViews: MetricSummary;
    visitors: MetricSummary;
    sessions: MetricSummary;
    avgDuration: MetricSummary;
    bounceRate: MetricSummary;
    avgScroll: MetricSummary;
  };
  timeline: Array<{
    date: string;
    pageViews: number;
    visitors: number;
  }>;
  topPages: RankedMetric[];
  referrers: RankedMetric[];
  devices: RankedMetric[];
  browsers: RankedMetric[];
  countries: RankedMetric[];
  interactions: RankedMetric[];
  vitals: Array<{
    name: WebVitalName;
    value: number | null;
    unit: "ms" | "score";
    rating: "good" | "needs-improvement" | "poor" | "unknown";
    samples: number;
  }>;
  recentSessions: Array<{
    sessionId: string;
    visitor: string;
    startedAt: string;
    page: string;
    referrer: string;
    device: string;
    location: string;
    duration: number;
    scrollDepth: number;
    interactions: number;
  }>;
  diagnostics: {
    eventCount: number;
    currentEventCount: number;
    truncated: boolean;
    storageMessage: string;
  };
};
