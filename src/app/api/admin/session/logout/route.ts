import { NextRequest, NextResponse } from "next/server";
import { ANALYTICS_SESSION_COOKIE } from "@/lib/analytics/auth";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(
    new URL("/admin/analytics/login", request.url),
    303,
  );
  response.cookies.set(ANALYTICS_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
