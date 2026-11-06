import assert from "node:assert/strict";

const base = process.env.CHECK_BASE_URL || "http://127.0.0.1:4514";
const origin = "https://portfolio.mjjmc.xyz";
const chinese = ["/", "/about", "/services", "/work", "/guides",
  "/services/company-website", "/services/international-website", "/services/nextjs-development",
  "/work/hill-nairobi", "/work/pixel-cafe-montreal", "/work/ruihe-engineering", "/work/suxin-furniture",
  "/guides/website-project-checklist", "/guides/website-cost-and-scope", "/guides/website-developer-selection"];
const expected = [...chinese, ...chinese.map(p => `/en${p === "/" ? "" : p}`)];
async function get(path, userAgent) {
  return fetch(new URL(path, base), { headers: { "accept-language": "zh-CN", ...(userAgent ? { "user-agent": userAgent } : {}) }, signal: AbortSignal.timeout(90000) });
}
const xml = await get("/sitemap.xml");
assert.equal(xml.status, 200);
const locations = [...(await xml.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
assert.deepEqual(locations.toSorted(), expected.map(p => origin + (p === "/" ? "" : p)).toSorted());
const robots = await get("/robots.txt");
assert.equal(robots.status, 200);
const rules = await robots.text();
for (const rule of ["Disallow: /admin/", "Disallow: /api/", "Sitemap: " + origin + "/sitemap.xml"]) assert.ok(rules.includes(rule));
const graph = new Map();
const titles = new Set();
const descriptions = new Set();
const searchIntents = {
  "/": { title: "网站制作", heading: "网站制作" },
  "/services": { title: "网站制作", heading: "网站制作" },
  "/services/company-website": { title: "企业官网建设", heading: "企业官网建设" },
  "/services/nextjs-development": { title: "全栈开发者", heading: "全栈开发者" },
  "/about": { title: "独立开发者", heading: "独立全栈开发者" },
  "/guides/website-developer-selection": { title: "独立开发者", heading: "独立开发者" },
  "/en": { title: "custom website development", heading: "website design" },
  "/en/services": { title: "custom website development", heading: "custom website development" },
  "/en/services/company-website": { title: "business website design", heading: "business website design" },
  "/en/services/nextjs-development": { title: "next.js developer", heading: "next.js developer" },
  "/en/about": { title: "freelance web developer", heading: "freelance web developer" },
  "/en/guides/website-developer-selection": { title: "freelance web developer", heading: "freelance web developer" },
};
for (const path of expected) {
  const en = path === "/en" || path.startsWith("/en/");
  const original = en ? path.slice(3) || "/" : path;
  const response = await get(path);
  assert.equal(response.status, 200, path);
  assert.ok(!response.headers.get("x-robots-tag")?.includes("noindex"), path);
  const html = await response.text();
  if (original === "/") {
    const records = [...html.matchAll(/url=%2Fimages%2Ftrust-evidence-(\d\d)(-en)?\.(png|jpg)/g)];
    assert.deepEqual([...new Set(records.map(m => m[1]))].sort(), ["01", "02", "03", "04", "05", "06", "07", "08"], path + " evidence count");
    for (const record of records) assert.equal(Boolean(record[2]), en, path + " evidence language");
    for (let n = 1; n <= 8; n++) {
      const file = `/images/trust-evidence-${String(n).padStart(2, "0")}${en ? "-en.png" : ".jpg"}`;
      const asset = await fetch(new URL(file, base), { method: "HEAD", signal: AbortSignal.timeout(15000) });
      assert.equal(asset.status, 200, file);
      assert.ok(asset.headers.get("content-type")?.startsWith("image/"), file);
    }
  }
  if (original.startsWith("/work/")) {
    const image = html.match(/<img\b[^>]*src="([^"]+)"/)?.[1]?.replaceAll("&amp;", "&");
    assert.ok(image?.startsWith("/_next/image?url=%2Fimages%2F"), path + " cover must use bundled image");
    const cover = await fetch(new URL(image, base), { headers: { accept: "image/webp" }, signal: AbortSignal.timeout(30000) });
    assert.equal(cover.status, 200, path + " cover unavailable");
    assert.ok(cover.headers.get("content-type")?.startsWith("image/"), path + " invalid image response");
    assert.ok((await cover.arrayBuffer()).byteLength > 0, path + " empty image");
  }
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  assert.ok(title && description, path + " missing metadata");
  if (en) {
    assert.ok(title.length < 70, path + " English search title is too long");
    assert.ok(description.length >= 25 && description.length <= 160, path + " English search description length");
  }
  assert.ok(!titles.has(title), path + " duplicate title");
  assert.ok(!descriptions.has(description), path + " duplicate description");
  titles.add(title); descriptions.add(description);
  const canonical = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual(canonical, [origin + (path === "/" ? "" : path)], path);
  assert.equal([...html.matchAll(/<h1[\s>]/g)].length, 1, path + " needs one H1");
  if (searchIntents[path]) {
    const intent = searchIntents[path];
    const heading = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]+>/g, "");
    assert.ok(title.toLowerCase().includes(intent.title), path + " title does not describe its service");
    assert.ok(heading?.toLowerCase().includes(intent.heading), path + " visible H1 does not describe its service");
  }
  assert.ok(!/<meta name="robots" content="[^"]*noindex/.test(html), path);
  assert.ok(html.includes(`property="og:url" content="${canonical[0]}"`), path + " wrong OG URL");
  const schema = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m => JSON.parse(m[1]));
  const entities = schema.flatMap(s => s["@graph"] || [s]);
  assert.ok(entities.some(e => e["@type"] === "Person" && e.name === (en ? "Liang Xikun" : "梁熙坤")), path);
  assert.ok(entities.some(e => e["@type"] === "WebSite"), path);
  if (original !== "/") assert.ok(entities.some(e => e["@type"] === "BreadcrumbList"), path);
  if (original.startsWith("/services/")) assert.ok(entities.some(e => e["@type"] === "Service"), path);
  if (original.startsWith("/work/")) assert.ok(entities.some(e => e["@type"] === "CreativeWork"), path);
  if (original.startsWith("/guides/")) {
    const article = entities.find(e => e["@type"] === "Article");
    assert.ok(article?.author["@id"].endsWith("#person"), path);
    assert.equal(article.datePublished, original.endsWith("website-developer-selection") ? "2026-11-05" : "2026-11-04", path + " original publication date changed");
    assert.ok(article.dateModified >= article.datePublished, path + " invalid article dates");
  }
  const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(m => m[1].split("#")[0]).filter(p => p.startsWith("/") && !p.startsWith("//"));
  assert.ok(html.includes(`lang="${en ? "en" : "zh-CN"}"`), path + " HTML language");
  assert.ok(html.includes(`hrefLang="zh-CN" href="${origin + (original === "/" ? "" : original)}"`) || html.includes(`hreflang="zh-CN" href="${origin + (original === "/" ? "" : original)}"`), path + " Chinese alternate");
  assert.ok(html.toLowerCase().includes(`hreflang="en" href="${origin}/en${original === "/" ? "" : original}"`.toLowerCase()), path + " English alternate");
  if (en) {
    const visible = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, "").replaceAll("中文", "");
    assert.ok(!/\p{Script=Han}/u.test(visible), path + " untranslated text: " + visible.match(/.{0,25}\p{Script=Han}.{0,60}/u)?.[0]);
    for (const href of links) assert.ok(!/^\/(?:services|work|guides|about)(?:[/?#]|$)/.test(href), path + " untranslated link " + href);
  }
  graph.set(path, new Set(links));
  console.log("PASS", path, title);
}
const found = new Set(["/"]);
const queue = ["/"];
while (queue.length) for (const path of graph.get(queue.shift()) || []) if (graph.has(path) && !found.has(path)) { found.add(path); queue.push(path); }
assert.deepEqual([...found].toSorted(), expected.toSorted(), "Some public pages are not discoverable from homepage HTML links");
for (const path of ["/en/missing-page", "/en/services/missing-service", "/missing-page", "/services/missing-service", "/work/missing-case", "/guides/missing-guide"]) assert.equal((await get(path)).status, 404, path);
const admin = await get("/admin/analytics/login");
assert.equal(admin.status, 200);
assert.ok(/<meta name="robots" content="[^"]*noindex/.test(await admin.text()), "Admin must remain noindex");
for (const path of ["/", "/services/company-website", "/work/ruihe-engineering"]) {
  const bot = await get(path, "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)");
  assert.equal(bot.status, 200, path);
  const html = await bot.text();
  assert.ok(html.includes("梁熙坤") && html.includes('application/ld+json'), path);
  assert.ok(html.includes(`rel="canonical" href="${origin + (path === "/" ? "" : path)}"`), path);
}
console.log(`PASS ${expected.length} pages: metadata, schema, HTML link discovery, sitemap, index rules, Googlebot access and unknown-route 404s`);

for (const [language, cookie, location] of [["en-US,en;q=.9", "", "/en"], ["zh-TW,en;q=.8", "", null], ["en-US", "portfolio-language=zh", null], ["zh-CN", "portfolio-language=en", "/en"], ["en;q=0,zh;q=.5", "", null]]) {
  const r = await fetch(new URL("/", base), { redirect: "manual", headers: { "accept-language": language, cookie } });
  assert.equal(r.status, location ? 307 : 200, `language ${language} / ${cookie}`);
  if (location) assert.equal(new URL(r.headers.get("location"), base).pathname, location);
  assert.ok(/no-store|no-cache/.test(r.headers.get("cache-control") || ""));
}
const manual = await fetch(new URL("/zh/services/company-website", base), { redirect: "manual", headers: { "accept-language": "en-US" } });
assert.equal(manual.status, 307);
assert.equal(new URL(manual.headers.get("location"), base).pathname, "/services/company-website");
assert.ok(manual.headers.get("set-cookie")?.includes("portfolio-language=zh"));
assert.equal((await fetch(new URL("/en", base), { headers: { "accept-language": "zh-CN", cookie: "portfolio-language=zh" } })).status, 200);
console.log("PASS locale priority, persistence, direct URLs, no redirect loops and cache isolation");
