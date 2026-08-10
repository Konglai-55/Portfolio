# 个人网站

基于 Next.js、TypeScript、App Router 与 Tailwind CSS 的个人网站基础项目。

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

页面入口位于 `src/app/page.tsx`，全局样式位于 `src/app/globals.css`。
# Portfolio analytics

访问统计后台位于 `/admin/analytics`。前台会以第一方方式采集页面访问、活跃停留、滚动深度、关键交互以及 Web Vitals；原始 IP 不会写入对象存储。

1. 将 `.env.example` 复制为 `.env.local`。
2. 在雨云对象存储中保持 Bucket 为私有，并填写 API Endpoint、Bucket、Access Key 与 Secret Key。
3. 分别生成后台密码、会话签名密钥和访客哈希盐；这些变量都只能存在于服务器，不要添加 `NEXT_PUBLIC_` 前缀。
4. 重启 Next.js 服务后访问 `/admin/analytics`。

数据按 `portfolio-analytics/events/YYYY/MM/DD/` 写成不可变 JSON 对象，避免并发覆盖。后台可查看 7、30、90 天数据。
