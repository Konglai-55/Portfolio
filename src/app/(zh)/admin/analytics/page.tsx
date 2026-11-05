import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  BarChart3,
  Clock3,
  Database,
  Eye,
  Gauge,
  Globe2,
  LogOut,
  MousePointerClick,
  RefreshCw,
  Smartphone,
  Users,
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { verifyAnalyticsSession } from "@/lib/analytics/auth";
import { getAnalyticsReport } from "@/lib/analytics/report";
import type {
  AnalyticsReport,
  MetricSummary,
  RankedMetric,
} from "@/lib/analytics/types";
import styles from "./analytics.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "数据看板 · 梁熙坤",
  description: "个人作品集访问分析后台",
  robots: { index: false, follow: false },
};

type IconComponent = typeof Eye;

function formatNumber(value: number) {
  return new Intl.NumberFormat("zh-CN").format(value);
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${Math.round(seconds)}秒`;
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.round(seconds % 60);
  return `${minutes}分${remainder ? `${remainder}秒` : ""}`;
}

function formatDate(value: string, includeTime = false) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    month: "2-digit",
    day: "2-digit",
    ...(includeTime
      ? { hour: "2-digit", minute: "2-digit", hour12: false }
      : {}),
  }).format(new Date(value));
}

function MetricCard({
  label,
  caption,
  metric,
  icon: Icon,
  format = formatNumber,
  inverse = false,
}: {
  label: string;
  caption: string;
  metric: MetricSummary;
  icon: IconComponent;
  format?: (value: number) => string;
  inverse?: boolean;
}) {
  const direction = metric.change === null ? "new" : metric.change >= 0 ? "up" : "down";
  const healthy =
    metric.change === null || metric.change === 0
      ? "neutral"
      : inverse
        ? metric.change < 0
          ? "positive"
          : "negative"
        : metric.change > 0
          ? "positive"
          : "negative";

  return (
    <article className={styles.metricCard}>
      <div className={styles.metricCardTop}>
        <span>
          <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
        </span>
        <small>{caption}</small>
      </div>
      <strong>{format(metric.value)}</strong>
      <footer>
        <span>{label}</span>
        <i data-health={healthy}>
          {direction === "new"
            ? "新增"
            : `${metric.change! >= 0 ? "+" : ""}${metric.change!.toFixed(1)}%`}
        </i>
      </footer>
    </article>
  );
}

function createLineGeometry(timeline: AnalyticsReport["timeline"]) {
  const width = 760;
  const height = 238;
  const paddingX = 18;
  const paddingTop = 20;
  const paddingBottom = 26;
  const maxValue = Math.max(1, ...timeline.map((point) => point.pageViews));
  const availableWidth = width - paddingX * 2;
  const availableHeight = height - paddingTop - paddingBottom;
  const points = timeline.map((point, index) => ({
    x:
      paddingX +
      (timeline.length <= 1 ? availableWidth / 2 : (index / (timeline.length - 1)) * availableWidth),
    y: paddingTop + availableHeight - (point.pageViews / maxValue) * availableHeight,
  }));

  if (!points.length) {
    return { line: "", area: "", width, height, points, maxValue };
  }

  let line = `M ${points[0].x} ${points[0].y}`;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const midpoint = (previous.x + current.x) / 2;
    line += ` C ${midpoint} ${previous.y}, ${midpoint} ${current.y}, ${current.x} ${current.y}`;
  }
  const baseY = height - paddingBottom;
  const area = `${line} L ${points.at(-1)!.x} ${baseY} L ${points[0].x} ${baseY} Z`;

  return { line, area, width, height, points, maxValue };
}

function TrafficChart({ timeline }: { timeline: AnalyticsReport["timeline"] }) {
  const chart = createLineGeometry(timeline);
  const labelIndexes = timeline.length
    ? [...new Set([0, Math.floor((timeline.length - 1) / 2), timeline.length - 1])]
    : [];

  return (
    <div className={styles.chartWrap}>
      <svg
        className={styles.trafficChart}
        viewBox={`0 0 ${chart.width} ${chart.height}`}
        role="img"
        aria-label="所选时间范围内的每日访问量趋势"
      >
        <defs>
          <linearGradient id="traffic-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c56f4d" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#c56f4d" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((line) => {
          const y = 20 + (line / 3) * 192;
          return (
            <line
              key={line}
              x1="18"
              x2="742"
              y1={y}
              y2={y}
              className={styles.chartGridLine}
            />
          );
        })}
        {chart.area ? <path d={chart.area} fill="url(#traffic-area)" /> : null}
        {chart.line ? <path d={chart.line} className={styles.chartLine} /> : null}
        {chart.points.map((point, index) =>
          timeline[index].pageViews > 0 ? (
            <circle
              key={timeline[index].date}
              cx={point.x}
              cy={point.y}
              r="3.6"
              className={styles.chartPoint}
            />
          ) : null,
        )}
      </svg>
      <div className={styles.chartLabels}>
        {labelIndexes.map((index) => (
          <span key={timeline[index].date}>{timeline[index].date.slice(5).replace("-", "/")}</span>
        ))}
      </div>
      {!timeline.some((point) => point.pageViews > 0) ? (
        <p className={styles.chartEmpty}>上线并产生访问后，趋势曲线会从这里开始生长。</p>
      ) : null}
    </div>
  );
}

function RankingList({
  items,
  emptyText,
}: {
  items: RankedMetric[];
  emptyText: string;
}) {
  if (!items.length) {
    return <p className={styles.emptyText}>{emptyText}</p>;
  }

  return (
    <ol className={styles.rankingList}>
      {items.map((item, index) => (
        <li key={`${item.label}-${index}`}>
          <span className={styles.rankIndex}>{String(index + 1).padStart(2, "0")}</span>
          <div>
            <p>
              <span title={item.label}>{item.label}</span>
              <strong>{formatNumber(item.value)}</strong>
            </p>
            <span className={styles.rankTrack}>
              <i style={{ width: `${Math.max(3, item.share)}%` }} />
            </span>
          </div>
          <small>{item.share}%</small>
        </li>
      ))}
    </ol>
  );
}

function VitalCards({ vitals }: { vitals: AnalyticsReport["vitals"] }) {
  const descriptions: Record<string, string> = {
    LCP: "主内容出现",
    INP: "交互响应",
    CLS: "视觉稳定",
    TTFB: "服务器响应",
  };
  const ratingLabels = {
    good: "良好",
    "needs-improvement": "可优化",
    poor: "需关注",
    unknown: "待采集",
  };

  return (
    <div className={styles.vitalGrid}>
      {vitals.map((vital) => (
        <article key={vital.name} className={styles.vitalCard} data-rating={vital.rating}>
          <header>
            <span>{vital.name}</span>
            <small>{descriptions[vital.name]}</small>
          </header>
          <strong>
            {vital.value === null
              ? "—"
              : vital.unit === "ms"
                ? `${formatNumber(vital.value)} ms`
                : vital.value.toFixed(3)}
          </strong>
          <footer>
            <span>{ratingLabels[vital.rating]}</span>
            <small>P75 · {vital.samples} 样本</small>
          </footer>
        </article>
      ))}
    </div>
  );
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  if (!(await verifyAnalyticsSession())) {
    redirect("/admin/analytics/login");
  }

  const params = await searchParams;
  const range = Number(params.range || 30);
  const report = await getAnalyticsReport(range);

  return (
    <main className={styles.dashboardPage}>
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.dashboardBrand} aria-label="返回作品集首页">
          <BrandMark className={styles.dashboardMark} />
          <span>
            <strong>LX / INSIGHT</strong>
            <small>Portfolio intelligence</small>
          </span>
        </Link>

        <nav aria-label="统计后台栏目">
          <a href="#overview" className={styles.sidebarActive}>
            <BarChart3 size={17} aria-hidden="true" />
            概览
          </a>
          <a href="#audience">
            <Users size={17} aria-hidden="true" />
            受众
          </a>
          <a href="#experience">
            <Gauge size={17} aria-hidden="true" />
            体验
          </a>
          <a href="#journeys">
            <Activity size={17} aria-hidden="true" />
            访问轨迹
          </a>
        </nav>

        <div className={styles.sidebarStorage} data-connected={report.configured}>
          <span><Database size={15} aria-hidden="true" /></span>
          <p>
            <strong>Rains3 storage</strong>
            <small>{report.configured ? "Private · Connected" : "Setup required"}</small>
          </p>
        </div>

        <form action="/api/admin/session/logout" method="post">
          <button type="submit">
            <LogOut size={16} aria-hidden="true" />
            安全退出
          </button>
        </form>
      </aside>

      <div className={styles.dashboardMain}>
        <header className={styles.dashboardHeader}>
          <div>
            <span className={styles.eyebrow}>Portfolio intelligence / 01</span>
            <h1>访问脉络</h1>
            <p>把感受变成可以行动的判断，而不是只看一个总访问数。</p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.rangePicker} aria-label="统计时间范围">
              {[7, 30, 90].map((days) => (
                <Link
                  key={days}
                  href={`/admin/analytics?range=${days}`}
                  data-active={report.rangeDays === days}
                >
                  {days} 天
                </Link>
              ))}
            </div>
            <Link className={styles.refreshButton} href={`/admin/analytics?range=${report.rangeDays}`}>
              <RefreshCw size={16} aria-hidden="true" />
              刷新
            </Link>
          </div>
        </header>

        {!report.configured ? (
          <section className={styles.setupNotice}>
            <Database size={21} aria-hidden="true" />
            <div>
              <strong>看板已经就绪，等待连接雨云对象存储</strong>
              <p>按照项目根目录的 .env.example 配置 7 个服务器变量，重新启动后即可开始记录真实数据。</p>
            </div>
          </section>
        ) : null}

        <section id="overview" className={styles.metricGrid}>
          <MetricCard label="页面浏览" caption="PAGE VIEWS" metric={report.overview.pageViews} icon={Eye} />
          <MetricCard label="独立访客" caption="UNIQUE VISITORS" metric={report.overview.visitors} icon={Users} />
          <MetricCard label="访问会话" caption="SESSIONS" metric={report.overview.sessions} icon={Activity} />
          <MetricCard label="平均活跃" caption="ACTIVE TIME" metric={report.overview.avgDuration} icon={Clock3} format={formatDuration} />
          <MetricCard label="跳出率" caption="BOUNCE RATE" metric={report.overview.bounceRate} icon={Globe2} format={(value) => `${value.toFixed(1)}%`} inverse />
          <MetricCard label="平均阅读深度" caption="SCROLL DEPTH" metric={report.overview.avgScroll} icon={Gauge} format={(value) => `${value.toFixed(1)}%`} />
        </section>

        <section className={styles.primaryGrid}>
          <article className={`${styles.panel} ${styles.trafficPanel}`}>
            <header className={styles.panelHeader}>
              <div>
                <span>01 / Traffic rhythm</span>
                <h2>访问趋势</h2>
              </div>
              <p>
                <strong>{formatNumber(report.overview.pageViews.value)}</strong>
                <span>次页面浏览</span>
              </p>
            </header>
            <TrafficChart timeline={report.timeline} />
          </article>

          <article className={`${styles.panel} ${styles.topPagePanel}`}>
            <header className={styles.panelHeader}>
              <div>
                <span>02 / Content pull</span>
                <h2>页面吸引力</h2>
              </div>
            </header>
            <RankingList items={report.topPages} emptyText="还没有页面访问数据。" />
          </article>
        </section>

        <section id="audience" className={styles.audienceGrid}>
          <article className={styles.panel}>
            <header className={styles.panelHeader}>
              <div><span>03 / Acquisition</span><h2>访客从哪里来</h2></div>
            </header>
            <RankingList items={report.referrers} emptyText="来源数据会在首次访问后出现。" />
          </article>
          <article className={styles.panel}>
            <header className={styles.panelHeader}>
              <div><span>04 / Device</span><h2>浏览设备</h2></div>
            </header>
            <RankingList items={report.devices} emptyText="暂无设备样本。" />
          </article>
          <article className={styles.panel}>
            <header className={styles.panelHeader}>
              <div><span>05 / Browser</span><h2>浏览器环境</h2></div>
            </header>
            <RankingList items={report.browsers} emptyText="暂无浏览器样本。" />
          </article>
          <article className={styles.panel}>
            <header className={styles.panelHeader}>
              <div><span>06 / Region</span><h2>访问地区</h2></div>
            </header>
            <RankingList items={report.countries} emptyText="收到真实公网 IP 后会由本地地理库自动解析。" />
          </article>
        </section>

        <section id="experience" className={`${styles.panel} ${styles.experiencePanel}`}>
          <header className={styles.panelHeader}>
            <div>
              <span>07 / Real experience</span>
              <h2>真实体验指标</h2>
            </div>
            <p className={styles.panelNote}>使用真实访客第 75 百分位衡量，避免平均值掩盖慢体验。</p>
          </header>
          <VitalCards vitals={report.vitals} />
        </section>

        <section className={styles.behaviorGrid}>
          <article className={styles.panel}>
            <header className={styles.panelHeader}>
              <div><span>08 / Intent signals</span><h2>高意向交互</h2></div>
              <MousePointerClick size={20} strokeWidth={1.45} aria-hidden="true" />
            </header>
            <RankingList items={report.interactions} emptyText="作品预览、导航和联系方式点击会显示在这里。" />
          </article>
          <article className={`${styles.panel} ${styles.insightPanel}`}>
            <span>Optimization prompt</span>
            <h2>下一步看什么？</h2>
            <ul>
              <li>若 50% 滚动深度骤降，优先压缩“了解我”段落。</li>
              <li>作品预览点击高但联系点击低，补强案例结果与行动入口。</li>
              <li>LCP 超过 2.5 秒时，优先优化首屏图片体积与加载顺序。</li>
            </ul>
          </article>
        </section>

        <section id="journeys" className={`${styles.panel} ${styles.sessionPanel}`}>
          <header className={styles.panelHeader}>
            <div>
              <span>09 / Recent journeys</span>
              <h2>最近访问轨迹</h2>
            </div>
            <small>{report.diagnostics.currentEventCount} EVENTS</small>
          </header>
          <div className={styles.sessionTableWrap}>
            <table className={styles.sessionTable}>
              <thead>
                <tr>
                  <th>访客</th><th>时间</th><th>入口页面</th><th>来源</th><th>环境</th><th>活跃</th><th>深度</th><th>交互</th>
                </tr>
              </thead>
              <tbody>
                {report.recentSessions.map((session) => (
                  <tr key={session.sessionId}>
                    <td><span className={styles.visitorBadge}>{session.visitor}</span></td>
                    <td>{formatDate(session.startedAt, true)}</td>
                    <td>{session.page}</td>
                    <td>{session.referrer}</td>
                    <td><span title={session.location}>{session.device}</span></td>
                    <td>{formatDuration(session.duration)}</td>
                    <td>{session.scrollDepth}%</td>
                    <td>{session.interactions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!report.recentSessions.length ? (
              <p className={styles.tableEmpty}>尚无访问轨迹。上线后的第一位访客会出现在这里。</p>
            ) : null}
          </div>
        </section>

        <footer className={styles.dashboardFooter}>
          <span>
            <i data-connected={report.configured} />
            {report.diagnostics.storageMessage}
          </span>
          <p>
            原始 IP 不入库 · 本地 GeoIP 数据来自{" "}
            <a href="https://www.maxmind.com" target="_blank" rel="noreferrer">
              MaxMind
            </a>{" "}
            · 更新于 {formatDate(report.generatedAt, true)}
          </p>
          <Smartphone size={16} aria-hidden="true" />
        </footer>
      </div>
    </main>
  );
}
