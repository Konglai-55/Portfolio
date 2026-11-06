# 梁熙坤 · 形构 Form × Build

梁熙坤的设计与全栈开发作品集，基于 Next.js、TypeScript、App Router 与 Tailwind CSS。

**在线访问：[portfolio.mjjmc.xyz](https://portfolio.mjjmc.xyz/)**

Liang Xikun is an independent website designer and full-stack developer building business websites, international websites and custom Next.js applications. Explore [English services](https://portfolio.mjjmc.xyz/en/services), [project case studies](https://portfolio.mjjmc.xyz/en/work) and [how to work together](https://portfolio.mjjmc.xyz/en/about). Project enquiries: [351738705@qq.com](mailto:351738705@qq.com).

- [网站设计与开发服务](https://portfolio.mjjmc.xyz/services)：企业官网、外贸独立站与 Next.js 定制开发。
- [公开项目案例](https://portfolio.mjjmc.xyz/work)：医院官网、创意店、制造业官网与家具外贸站设计。
- [网站建设指南](https://portfolio.mjjmc.xyz/guides)：需求资料准备、报价与交付范围核对。
- [关于梁熙坤](https://portfolio.mjjmc.xyz/about)与[项目联系](https://portfolio.mjjmc.xyz/#contact)。

## 内容与搜索基础

公开服务、案例和指南页面预生成为 HTML，并提供独立标题、规范地址、结构化数据和站内链接。站点地图位于 [sitemap.xml](https://portfolio.mjjmc.xyz/sitemap.xml)。技术检查可以运行 `npm run check:seo`，默认检查本机 `http://127.0.0.1:4514`；设置 `CHECK_BASE_URL` 可检查对应预览或正式站点。

发布使用经过验证的 Linux 成品，保留源版本与成品校验；生产主机负责运行网站。实际 Google 收录、查询表现和排名需另外核对，不能由构建结果或测试分数推断。

## 本地开发

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看网站。

## 常用命令

```bash
npm run dev    # 启动开发服务器
npm run build  # 生成生产版本
npm run start  # 运行生产版本
npm run lint   # 代码检查
```

页面入口位于 `src/app/(zh)/page.tsx`，全局样式位于 `src/app/globals.css`。
# Portfolio analytics

访问统计后台位于 `/admin/analytics`。前台会以第一方方式采集页面访问、活跃停留、滚动深度、关键交互以及 Web Vitals；原始 IP 不会写入对象存储。

1. 将 `.env.example` 复制为 `.env.local`。
2. 在雨云对象存储中保持 Bucket 为私有，并填写 API Endpoint、Bucket、Access Key 与 Secret Key。
3. 分别生成后台密码、会话签名密钥和访客哈希盐；这些变量都只能存在于服务器，不要添加 `NEXT_PUBLIC_` 前缀。
4. 重启 Next.js 服务后访问 `/admin/analytics`。

数据按 `portfolio-analytics/events/YYYY/MM/DD/` 写成不可变 JSON 对象，避免并发覆盖。后台可查看 7、30、90 天数据。


## Languages

Chinese public URLs remain unchanged. English pages live under `/en` and share the same components, content structure and interactions, using the authored dictionary in `src/lib/i18n/en.json`. Both languages are rendered in HTML with reciprocal language alternates and included in the sitemap.

The homepage uses a saved language choice first, then supported browser languages in Accept-Language order. If neither Chinese nor English is offered, the existing local GeoIP database supplies a regional fallback (Chinese for China/Hong Kong/Macao/Taiwan, English elsewhere; Chinese when unavailable). Explicit content URLs do not auto-redirect. The language links preserve the corresponding page and remember the selection for one year; `/zh/...` is a no-JavaScript Chinese selection redirect. APIs, admin and assets are excluded from language negotiation.

Run `CHECK_BASE_URL=http://127.0.0.1:4516 node scripts/check-seo.mjs` for the 30-page language/SEO check, including language priority, saved preferences, direct URLs, missing routes, image loading, service identity and contact links.
