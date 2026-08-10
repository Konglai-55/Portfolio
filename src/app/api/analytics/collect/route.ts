import { NextRequest } from "next/server";
import {
  isLikelyBot,
  normalizeAnalyticsEvent,
} from "@/lib/analytics/normalize";
import { storeAnalyticsEvent } from "@/lib/analytics/storage";
import { extractClientIp } from "@/lib/analytics/geoip";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 12_000;
const RATE_WINDOW_MS = 60_000;
const MAX_EVENTS_PER_WINDOW = 100;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string) {
  const now = Date.now();
  if (rateBuckets.size > 2000) {
    for (const [bucketKey, bucket] of rateBuckets) {
      if (bucket.resetAt <= now) {
        rateBuckets.delete(bucketKey);
      }
    }
  }
  const current = rateBuckets.get(key);
  if (!current || current.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > MAX_EVENTS_PER_WINDOW;
}

function isAllowedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }

  try {
    const requestOrigin = new URL(request.url).origin;
    if (new URL(origin).origin === requestOrigin) {
      return true;
    }
  } catch {
    return false;
  }

  const configured = (process.env.ANALYTICS_ALLOWED_ORIGINS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return configured.includes(origin);
}

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return new Response(null, { status: 403 });
  }

  const userAgent = request.headers.get("user-agent") || "";
  if (isLikelyBot(userAgent)) {
    return new Response(null, { status: 204 });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return new Response(null, { status: 413 });
  }

  const ipAddress = extractClientIp(request.headers);
  if (isRateLimited(ipAddress)) {
    return new Response(null, { status: 429 });
  }

  try {
    const rawBody = await request.text();
    if (!rawBody || rawBody.length > MAX_BODY_BYTES) {
      return new Response(null, { status: rawBody ? 413 : 400 });
    }

    const event = normalizeAnalyticsEvent(
      JSON.parse(rawBody) as unknown,
      request.headers,
      ipAddress,
    );
    if (!event) {
      return new Response(null, { status: 400 });
    }

    const stored = await storeAnalyticsEvent(event);
    return new Response(null, { status: stored ? 202 : 204 });
  } catch (error) {
    console.error("[analytics] Failed to store event", error);
    return new Response(null, { status: 204 });
  }
}
