import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ArrowRight, BarChart3, LockKeyhole } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import {
  isAnalyticsAdminConfigured,
  verifyAnalyticsSession,
} from "@/lib/analytics/auth";
import styles from "../analytics.module.css";

export const metadata: Metadata = {
  title: "数据看板 · 梁熙坤",
  robots: { index: false, follow: false },
};

export default async function AnalyticsLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; setup?: string; locked?: string }>;
}) {
  if (await verifyAnalyticsSession()) {
    redirect("/admin/analytics");
  }

  const params = await searchParams;
  const configured = isAnalyticsAdminConfigured();

  return (
    <main className={styles.loginPage}>
      <div className={styles.loginAmbient} aria-hidden="true" />
      <section className={styles.loginPanel}>
        <header className={styles.loginBrand}>
          <BrandMark className={styles.loginMark} />
          <span>
            <strong>Liang Xikun</strong>
            <small>Portfolio intelligence</small>
          </span>
        </header>

        <div className={styles.loginIntro}>
          <span className={styles.eyebrow}>
            <BarChart3 size={14} aria-hidden="true" />
            Private analytics
          </span>
          <h1>网站观察室</h1>
          <p>
            看见访客从哪里来、在哪里停留，以及哪些作品真正促成了下一步行动。
          </p>
        </div>

        <form
          className={styles.loginForm}
          action="/api/admin/session"
          method="post"
        >
          <label htmlFor="analytics-password">
            <span>管理密码</span>
            <span className={styles.passwordField}>
              <LockKeyhole size={17} aria-hidden="true" />
              <input
                id="analytics-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="输入后台访问密码"
                required
                disabled={!configured}
              />
            </span>
          </label>

          {params.error ? (
            <p className={styles.loginMessage} role="alert">
              密码不正确，请重新输入。
            </p>
          ) : null}
          {params.locked ? (
            <p className={styles.loginMessage} role="alert">
              尝试次数过多，请在 15 分钟后再试。
            </p>
          ) : null}
          {params.setup || !configured ? (
            <p className={styles.loginMessage} role="alert">
              请先在服务器环境变量中配置后台密码与会话密钥。
            </p>
          ) : null}

          <button type="submit" disabled={!configured}>
            进入数据看板
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </form>

        <footer className={styles.loginFooter}>
          <span>Private access only</span>
          <span>Shanghai time · UTC+8</span>
        </footer>
      </section>
    </main>
  );
}
