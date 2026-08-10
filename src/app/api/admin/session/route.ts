import { NextRequest, NextResponse } from "next/server";
import {
  ANALYTICS_SESSION_COOKIE,
  analyticsSessionCookieOptions,
  createAnalyticsSession,
  isAnalyticsAdminConfigured,
  verifyAnalyticsPassword,
} from "@/lib/analytics/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 8;

function loginKey(request: NextRequest) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = String(formData.get("password") || "").slice(0, 256);
  const loginUrl = new URL("/admin/analytics/login", request.url);
  const attemptKey = loginKey(request);
  const now = Date.now();
  if (loginAttempts.size > 1000) {
    for (const [key, value] of loginAttempts) {
      if (value.resetAt <= now) loginAttempts.delete(key);
    }
  }
  const attempts = loginAttempts.get(attemptKey);

  if (attempts && attempts.resetAt > now && attempts.count >= MAX_LOGIN_ATTEMPTS) {
    loginUrl.searchParams.set("locked", "1");
    return NextResponse.redirect(loginUrl, 303);
  }

  if (!isAnalyticsAdminConfigured()) {
    loginUrl.searchParams.set("setup", "1");
    return NextResponse.redirect(loginUrl, 303);
  }

  if (!verifyAnalyticsPassword(password)) {
    if (!attempts || attempts.resetAt <= now) {
      loginAttempts.set(attemptKey, {
        count: 1,
        resetAt: now + LOGIN_WINDOW_MS,
      });
    } else {
      attempts.count += 1;
    }
    loginUrl.searchParams.set("error", "1");
    return NextResponse.redirect(loginUrl, 303);
  }

  loginAttempts.delete(attemptKey);

  const response = NextResponse.redirect(
    new URL("/admin/analytics", request.url),
    303,
  );
  response.cookies.set(
    ANALYTICS_SESSION_COOKIE,
    createAnalyticsSession(),
    analyticsSessionCookieOptions,
  );
  return response;
}
