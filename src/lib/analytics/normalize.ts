import "server-only";

import { createHmac, randomUUID } from "node:crypto";
import {
  analyticsEventNames,
  webVitalNames,
  type ClientAnalyticsEvent,
  type StoredAnalyticsEvent,
} from "./types";
import { lookupIpLocation } from "./geoip";

const idPattern = /^[a-zA-Z0-9_-]{8,80}$/;

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, maxLength);
}

function cleanNumber(value: unknown, minimum: number, maximum: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }
  return Math.min(maximum, Math.max(minimum, value));
}

function cleanDimensions(value: unknown) {
  if (!value || typeof value !== "object") {
    return null;
  }
  const dimensions = value as { width?: unknown; height?: unknown };
  const width = cleanNumber(dimensions.width, 1, 16_000);
  const height = cleanNumber(dimensions.height, 1, 16_000);
  return width && height
    ? { width: Math.round(width), height: Math.round(height) }
    : null;
}

function cleanPage(value: unknown) {
  const candidate = cleanText(value, 360);
  if (!candidate) {
    return "/";
  }
  try {
    const url = new URL(candidate, "https://portfolio.local");
    return url.pathname.slice(0, 180) || "/";
  } catch {
    return candidate.startsWith("/") ? candidate.slice(0, 180) : "/";
  }
}

function cleanReferrer(value: unknown) {
  const candidate = cleanText(value, 500);
  if (!candidate) {
    return "";
  }
  try {
    const url = new URL(candidate);
    return url.hostname.toLowerCase().slice(0, 120);
  } catch {
    return "";
  }
}

function hashIdentifier(value: string) {
  const secret =
    process.env.ANALYTICS_HASH_SALT?.trim() ||
    process.env.ANALYTICS_SESSION_SECRET?.trim();
  if (!secret) {
    throw new Error("ANALYTICS_HASH_SALT is not configured");
  }
  return createHmac("sha256", secret)
    .update(value)
    .digest("hex")
    .slice(0, 24);
}

function parseDevice(userAgent: string): StoredAnalyticsEvent["device"] {
  const ua = userAgent.toLowerCase();
  const type = /ipad|tablet|playbook|silk/.test(ua)
    ? "tablet"
    : /mobi|iphone|ipod|android/.test(ua)
      ? "mobile"
      : "desktop";

  let browser = "Other";
  if (/micromessenger/.test(ua)) browser = "WeChat";
  else if (/edg\//.test(ua)) browser = "Edge";
  else if (/opr\//.test(ua)) browser = "Opera";
  else if (/firefox\//.test(ua)) browser = "Firefox";
  else if (/chrome\//.test(ua)) browser = "Chrome";
  else if (/safari\//.test(ua)) browser = "Safari";

  let os = "Other";
  if (/windows/.test(ua)) os = "Windows";
  else if (/iphone|ipad|ipod/.test(ua)) os = "iOS";
  else if (/android/.test(ua)) os = "Android";
  else if (/mac os|macintosh/.test(ua)) os = "macOS";
  else if (/linux/.test(ua)) os = "Linux";

  return { type, browser, os };
}

function readLocation(
  headers: Headers,
  ipAddress: string,
): StoredAnalyticsEvent["location"] {
  const geoLocation = lookupIpLocation(ipAddress);
  if (geoLocation) {
    return geoLocation;
  }

  const country = cleanText(
    headers.get("cf-ipcountry") ||
      headers.get("x-vercel-ip-country") ||
      headers.get("x-country-code"),
    32,
  );
  const city = cleanText(
    headers.get("x-vercel-ip-city") || headers.get("x-city"),
    64,
  );
  const region = cleanText(
    headers.get("x-vercel-ip-country-region") || headers.get("x-region"),
    64,
  );
  return {
    country: country || "未知",
    region: region ? decodeURIComponentSafe(region) : "",
    city: city ? decodeURIComponentSafe(city) : "",
    source: country || region || city ? "header" : "unknown",
  };
}

function decodeURIComponentSafe(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function isLikelyBot(userAgent: string) {
  return /bot|crawler|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit/i.test(
    userAgent,
  );
}

export function normalizeAnalyticsEvent(
  payload: unknown,
  headers: Headers,
  ipAddress: string,
): StoredAnalyticsEvent | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const input = payload as Partial<ClientAnalyticsEvent>;
  if (
    !analyticsEventNames.includes(input.name as ClientAnalyticsEvent["name"]) ||
    typeof input.sessionId !== "string" ||
    typeof input.visitorId !== "string" ||
    !idPattern.test(input.sessionId) ||
    !idPattern.test(input.visitorId)
  ) {
    return null;
  }

  const occurredAt = new Date(cleanText(input.occurredAt, 40));
  const now = new Date();
  const safeOccurredAt =
    Number.isNaN(occurredAt.valueOf()) ||
    Math.abs(now.valueOf() - occurredAt.valueOf()) > 1000 * 60 * 60 * 24
      ? now
      : occurredAt;
  const metric = webVitalNames.includes(
    input.metric as (typeof webVitalNames)[number],
  )
    ? input.metric!
    : null;
  const value =
    input.name === "scroll_depth"
      ? cleanNumber(input.value, 0, 100)
      : input.name === "web_vital"
        ? cleanNumber(input.value, 0, metric === "CLS" ? 10 : 60_000)
        : cleanNumber(input.value, 0, 1000 * 60 * 60 * 8);
  if (input.name === "web_vital" && (!metric || value === null)) {
    return null;
  }
  const userAgent = headers.get("user-agent") || "";

  return {
    version: 1,
    id: randomUUID(),
    name: input.name!,
    occurredAt: safeOccurredAt.toISOString(),
    receivedAt: now.toISOString(),
    sessionId: input.sessionId,
    visitorHash: hashIdentifier(input.visitorId),
    ipHash: hashIdentifier(ipAddress || "unknown"),
    page: cleanPage(input.page),
    title: cleanText(input.title, 160),
    referrer: cleanReferrer(input.referrer),
    label: cleanText(input.label, 120),
    value,
    metric,
    screen: cleanDimensions(input.screen),
    viewport: cleanDimensions(input.viewport),
    locale: {
      language: cleanText(input.language, 32),
      timezone: cleanText(input.timezone, 64),
    },
    device: parseDevice(userAgent),
    location: readLocation(headers, ipAddress),
  };
}
