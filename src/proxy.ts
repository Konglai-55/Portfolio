import { NextRequest, NextResponse } from "next/server";
import { preferredLocale } from "@/lib/i18n";
import { extractClientIp, lookupIpLocation } from "@/lib/analytics/geoip";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === "/zh" || path.startsWith("/zh/")) {
    const url = request.nextUrl.clone();
    url.pathname = path.slice(3) || "/";
    const response = NextResponse.redirect(url, 307);
    response.cookies.set("portfolio-language", "zh", { path: "/", maxAge: 31536000, sameSite: "lax", secure: request.nextUrl.protocol === "https:" });
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }
  if (path === "/en" || path.startsWith("/en/")) {
    const response = NextResponse.next();
    if (request.cookies.get("portfolio-language")?.value !== "en") {
      response.cookies.set("portfolio-language", "en", { path: "/", maxAge: 31536000, sameSite: "lax", secure: request.nextUrl.protocol === "https:" });
      response.headers.set("Cache-Control", "private, no-store");
    }
    return response;
  }
  const saved = request.cookies.get("portfolio-language")?.value;
  let locale = saved === "zh" || saved === "en" ? saved : preferredLocale(request.headers.get("accept-language"));
  if (!locale) {
    const country = lookupIpLocation(extractClientIp(request.headers))?.country;
    locale = country ? /中国|香港|澳门|台湾|China|Hong Kong|Macao|Taiwan/i.test(country) ? "zh" : "en" : "zh";
  }
  const response = locale === "en" ? NextResponse.redirect(new URL(`/en${request.nextUrl.search}`, request.url), 307) : NextResponse.next();
  response.headers.set("Vary", "Accept-Language, Cookie");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

// Explicit language URLs, content links, APIs and assets are never auto-redirected.
export const config = { matcher: ["/", "/zh/:path*", "/en/:path*"] };
