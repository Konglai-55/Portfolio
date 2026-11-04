import assert from "node:assert/strict";

const base = process.env.CHECK_BASE_URL || "http://127.0.0.1:4514";
const origin = "https://portfolio.mjjmc.xyz";
const expected = ["/", "/about", "/services", "/work", "/guides",
  "/services/company-website", "/services/international-website", "/services/nextjs-development",
  "/work/hill-nairobi", "/work/pixel-cafe-montreal", "/work/ruihe-engineering", "/work/suxin-furniture",
  "/guides/website-project-checklist", "/guides/website-cost-and-scope"];
async function get(path, userAgent) {
  return fetch(new URL(path, base), { headers: userAgent ? { "user-agent": userAgent } : {}, signal: AbortSignal.timeout(90000) });
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
for (const path of expected) {
  const response = await get(path);
  assert.equal(response.status, 200, path);
  assert.ok(!response.headers.get("x-robots-tag")?.includes("noindex"), path);
  const html = await response.text();
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  assert.ok(title && description, path + " missing metadata");
  assert.ok(!titles.has(title), path + " duplicate title");
  assert.ok(!descriptions.has(description), path + " duplicate description");
  titles.add(title); descriptions.add(description);
  const canonical = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual(canonical, [origin + (path === "/" ? "" : path)], path);
  assert.equal([...html.matchAll(/<h1[\s>]/g)].length, 1, path + " needs one H1");
  assert.ok(!/<meta name="robots" content="[^"]*noindex/.test(html), path);
  assert.ok(html.includes(`property="og:url" content="${canonical[0]}"`), path + " wrong OG URL");
  const schema = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m => JSON.parse(m[1]));
  const entities = schema.flatMap(s => s["@graph"] || [s]);
  assert.ok(entities.some(e => e["@type"] === "Person" && e.name === "梁熙坤"), path);
  assert.ok(entities.some(e => e["@type"] === "WebSite"), path);
  if (path !== "/") assert.ok(entities.some(e => e["@type"] === "BreadcrumbList"), path);
  if (path.startsWith("/services/")) assert.ok(entities.some(e => e["@type"] === "Service"), path);
  if (path.startsWith("/work/")) assert.ok(entities.some(e => e["@type"] === "CreativeWork"), path);
  if (path.startsWith("/guides/")) assert.ok(entities.some(e => e["@type"] === "Article" && e.author["@id"].endsWith("#person")), path);
  const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(m => m[1].split("#")[0]).filter(p => p.startsWith("/") && !p.startsWith("//"));
  graph.set(path, new Set(links));
  console.log("PASS", path, title);
}
const found = new Set(["/"]);
const queue = ["/"];
while (queue.length) for (const path of graph.get(queue.shift()) || []) if (graph.has(path) && !found.has(path)) { found.add(path); queue.push(path); }
assert.deepEqual([...found].toSorted(), expected.toSorted(), "Some public pages are not discoverable from homepage HTML links");
for (const path of ["/missing-page", "/services/missing-service", "/work/missing-case", "/guides/missing-guide"]) assert.equal((await get(path)).status, 404, path);
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
