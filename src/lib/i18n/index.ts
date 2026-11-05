import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import english from "./en.json";

export type Locale = "zh" | "en";
const dictionary: Record<string, string> = english;
const compactDictionary = Object.fromEntries(Object.entries(dictionary).map(([key, value]) => [key.replace(/\s/g, ""), value]));
export const publicPaths = ["/", "/about", "/services", "/work", "/guides"];

export function localizedPath(path: string, locale: Locale): string {
  if (locale === "zh" || path === "/en" || path.startsWith("/en/")) return path;
  if (/^\/(?:$|[?#]|about(?:[/?#]|$)|services(?:[/?#]|$)|work(?:[/?#]|$)|guides(?:[/?#]|$))/.test(path)) {
    return `/en${path === "/" ? "" : path.startsWith("/#") || path.startsWith("/?") ? path.slice(1) : path}`;
  }
  return path;
}

export function translate(text: string, locale: Locale): string {
  if (locale === "zh") return text;
  const normalized = text.replace(/\s+/g, " ").trim();
  if (dictionary[normalized] || compactDictionary[normalized.replace(/\s/g, "")]) {
    const result = dictionary[normalized] || compactDictionary[normalized.replace(/\s/g, "")];
    return `${/^\s/.test(text) ? " " : ""}${result}${/\s$/.test(text) ? " " : ""}`;
  }
  // Accessible names containing a project name or a changing slide label.
  return text
    .replace(/当前为(.+)视角，点击切换到(.+)视角/, (_, a, b) => `Current perspective: ${translate(a, locale)}; switch to ${translate(b, locale)}`)
    .replace(/拨打电话 /g, "Call ").replace(/复制(.+)号 /g, (_, name) => `Copy ${translate(name, locale)} account `)
    .replace(/ 项目画面预览/g, " project preview").replace(/ 项目画面 /g, " project view ")
    .replace(/切换到 (.+) 页面/g, "Switch to $1 page")
    .replace(/放大查看 (.+) 完整页面/g, "Enlarge $1 full page")
    .replace(/放大查看 (.+) 全部页面/g, "View all $1 pages")
    .replace(/放大查看 (.+) 原始凭证/g, (_, name) => `Enlarge ${translate(name, locale)} original record`)
    .replace(/(.+)原始凭证/g, (_, name) => `${translate(name, locale)} original record`)
    .replace(/复制微信 /g, "Copy WeChat ").replace(/，/g, ", ").replace(/。/g, ". ");
}

/** Translate authored content before React renders it, including server HTML.
 * Shared components retain their event handlers, refs, styles and original data. */
export function localize<T>(value: T, locale: Locale, key = ""): T {
  if (locale === "zh") return value;
  if (typeof value === "string") {
    let text = translate(value, locale);
    if (key === "children" && text !== value && /\p{Script=Han}/u.test(value)) text = ` ${text.trim()} `;
    if (["href", "path", "url", "item", "canonical", "mainEntityOfPage"].includes(key) || key === "@id" && !/#(?:person|website)$/.test(text)) {
      const origin = "https://portfolio.mjjmc.xyz";
      text = text.startsWith(origin) ? origin + localizedPath(text.slice(origin.length) || "/", locale) : localizedPath(text, locale);
    }
    if (key === "inLanguage") text = "en";
    return text as T;
  }
  if (Array.isArray(value)) {
    if (key === "children") return Children.map(value as ReactNode[], item => localize(item, locale, key)) as T;
    return value.map(item => localize(item, locale, key)) as T;
  }
  if (isValidElement(value)) {
    const element = value as ReactElement<Record<string, unknown>>;
    const props = Object.fromEntries(Object.entries(element.props).map(([name, prop]) => [name,
      ["ref", "style", "dangerouslySetInnerHTML"].includes(name) ? prop : localize(prop, locale, name)]));
    return cloneElement(element, props) as T;
  }
  if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype && !("current" in value)) {
    return Object.fromEntries(Object.entries(value).map(([name, prop]) => [name, localize(prop, locale, name)])) as T;
  }
  return value;
}

export function preferredLocale(header: string | null): Locale | null {
  const languages = (header || "").split(",").map((part, order) => {
    const [tag, ...parameters] = part.trim().toLowerCase().split(";");
    const quality = parameters.find(p => p.trim().startsWith("q="));
    return { tag, quality: quality ? Number(quality.trim().slice(2)) : 1, order };
  }).filter(l => l.quality > 0 && l.quality <= 1).sort((a, b) => b.quality - a.quality || a.order - b.order);
  for (const { tag } of languages) {
    if (/^zh(?:-|$)/.test(tag)) return "zh";
    if (/^en(?:-|$)/.test(tag)) return "en";
  }
  return null;
}
