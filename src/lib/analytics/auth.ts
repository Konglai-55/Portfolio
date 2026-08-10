import "server-only";

import {
  createHmac,
  createHash,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";

export const ANALYTICS_SESSION_COOKIE = "portfolio_analytics_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function encode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftDigest = createHash("sha256").update(left).digest();
  const rightDigest = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftDigest, rightDigest);
}

export function isAnalyticsAdminConfigured() {
  const password = process.env.ANALYTICS_ADMIN_PASSWORD?.trim() || "";
  const sessionSecret = process.env.ANALYTICS_SESSION_SECRET?.trim() || "";
  return password.length >= 10 && sessionSecret.length >= 32;
}

export function verifyAnalyticsPassword(password: string) {
  const expected = process.env.ANALYTICS_ADMIN_PASSWORD?.trim();
  if (!expected) {
    return false;
  }
  return safeEqual(password, expected);
}

export function createAnalyticsSession() {
  const secret = process.env.ANALYTICS_SESSION_SECRET?.trim();
  if (!secret) {
    throw new Error("ANALYTICS_SESSION_SECRET is not configured");
  }

  const payload = encode(
    JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
      nonce: randomBytes(18).toString("base64url"),
    }),
  );
  return `${payload}.${sign(payload, secret)}`;
}

export function verifyAnalyticsSessionValue(value?: string) {
  const secret = process.env.ANALYTICS_SESSION_SECRET?.trim();
  if (!secret || !value) {
    return false;
  }

  const [payload, signature] = value.split(".");
  if (!payload || !signature || !safeEqual(signature, sign(payload, secret))) {
    return false;
  }

  try {
    const decoded = JSON.parse(decode(payload)) as { exp?: number };
    return typeof decoded.exp === "number" && decoded.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export async function verifyAnalyticsSession() {
  const cookieStore = await cookies();
  return verifyAnalyticsSessionValue(
    cookieStore.get(ANALYTICS_SESSION_COOKIE)?.value,
  );
}

export const analyticsSessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE_SECONDS,
  priority: "high" as const,
};
