import "server-only";

import { isIP } from "node:net";
import { GeoLite2 } from "@maxminddatabase/geolite2";
import type { StoredAnalyticsEvent } from "./types";

type AnalyticsLocation = StoredAnalyticsEvent["location"];
type CityReader = GeoLite2["reader"];

let cityReader: CityReader | null | undefined;

function normalizeIp(value: string) {
  let candidate = value.trim().replace(/^for=/i, "").replace(/^"|"$/g, "");

  if (candidate.startsWith("[")) {
    const closingBracket = candidate.indexOf("]");
    if (closingBracket > 0) {
      candidate = candidate.slice(1, closingBracket);
    }
  } else if (/^\d{1,3}(?:\.\d{1,3}){3}:\d+$/.test(candidate)) {
    candidate = candidate.slice(0, candidate.lastIndexOf(":"));
  }

  const mappedIpv4 = candidate.match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i);
  if (mappedIpv4 && isIP(mappedIpv4[1]) === 4) {
    candidate = mappedIpv4[1];
  }

  return isIP(candidate) ? candidate : null;
}

function isPublicIpv4(ipAddress: string) {
  const octets = ipAddress.split(".").map(Number);
  const [first, second] = octets;

  return !(
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 100 && second >= 64 && second <= 127) ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 0 && octets[2] === 0) ||
    (first === 192 && second === 0 && octets[2] === 2) ||
    (first === 192 && second === 168) ||
    (first === 198 && (second === 18 || second === 19)) ||
    (first === 198 && second === 51 && octets[2] === 100) ||
    (first === 203 && second === 0 && octets[2] === 113) ||
    first >= 224
  );
}

export function isPublicIp(ipAddress: string) {
  const version = isIP(ipAddress);
  if (version === 4) {
    return isPublicIpv4(ipAddress);
  }
  if (version !== 6) {
    return false;
  }

  const normalized = ipAddress.toLowerCase();
  return !(
    normalized === "::" ||
    normalized === "::1" ||
    /^f[cd]/.test(normalized) ||
    /^fe[89ab]/.test(normalized) ||
    /^ff/.test(normalized) ||
    normalized.startsWith("2001:db8:")
  );
}

export function extractClientIp(headers: Headers) {
  const candidates = [
    headers.get("cf-connecting-ip"),
    headers.get("x-real-ip"),
    ...(headers.get("x-forwarded-for")?.split(",") ?? []),
  ]
    .filter((value): value is string => Boolean(value))
    .map(normalizeIp)
    .filter((value): value is string => Boolean(value));

  return candidates.find(isPublicIp) || candidates[0] || "unknown";
}

function getCityReader() {
  if (cityReader !== undefined) {
    return cityReader;
  }

  try {
    cityReader = new GeoLite2("City").reader;
  } catch (error) {
    cityReader = null;
    console.error("[analytics] Failed to open the local GeoLite2 database", error);
  }

  return cityReader;
}

function localizedName(record?: { names: { en: string; "zh-CN"?: string } }) {
  return record?.names["zh-CN"] || record?.names.en || "";
}

export function lookupIpLocation(ipAddress: string): AnalyticsLocation | null {
  const normalizedIp = normalizeIp(ipAddress);
  if (!normalizedIp || !isPublicIp(normalizedIp)) {
    return null;
  }

  try {
    const response = getCityReader()?.city(normalizedIp);
    if (!response) {
      return null;
    }

    const country =
      localizedName(response.country) || response.country?.isoCode || "未知";
    const subdivision = response.subdivisions?.[0];

    return {
      country,
      region: localizedName(subdivision) || subdivision?.isoCode || "",
      city: localizedName(response.city),
      source: "geoip",
    };
  } catch {
    return null;
  }
}
