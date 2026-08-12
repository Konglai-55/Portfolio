import {
  ArrowUpRight,
  MessageCircle,
  MoveUp,
  Phone,
} from "lucide-react";
import { BrandMark, BrandWordmark } from "./brand-mark";
import styles from "./contact-section.module.css";

const contactItems = [
  {
    index: "01",
    label: "微信 / WeChat",
    value: "as14246791",
    href: null,
    icon: "wechat",
  },
  {
    index: "02",
    label: "QQ",
    value: "351738705",
    href: null,
    icon: "qq",
  },
  {
    index: "03",
    label: "电话 / Phone",
    value: "17736551531",
    href: "tel:+8617736551531",
    icon: "phone",
  },
] as const;

function TencentQqIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M21.395 15.035a40 40 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 17.351 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a39 39 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673.54.065 2.103-2.472 2.103-2.472 0 1.469.756 3.387 2.394 4.771-.612.188-1.363.479-1.845.835-.434.32-.379.646-.301.778.343.578 5.883.369 7.482.189 1.6.18 7.14.389 7.483-.189.078-.132.132-.458-.301-.778-.483-.356-1.233-.646-1.846-.836 1.637-1.384 2.393-3.302 2.393-4.771 0 0 1.563 2.537 2.103 2.472.251-.03.581-1.39-.438-4.673" />
    </svg>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className={styles.section}>
      <div className={styles.container}>
        <header className={styles.sectionHeader} data-reveal="soft">
          <span>03 / Contact &amp; Profile</span>
          <p>
            <i aria-hidden="true" />
            Available for selected projects
          </p>
        </header>

        <div className={styles.statement}>
          <div className={styles.statementTitle}>
            <p data-reveal="soft">Let&apos;s make something meaningful.</p>
            <h2 data-reveal="title">
              让想法，
              <span>成为作品。</span>
            </h2>
          </div>

          <div className={styles.statementCopy} data-reveal="right">
            <span>从一次清晰的沟通开始</span>
            <p>
              如果你正在寻找兼顾视觉表达、开发质量与交付效率的合作方式，欢迎聊聊你的项目目标。
            </p>
          </div>
        </div>

        <div className={styles.profilePanel} data-reveal="card">
          <figure
            className={styles.signature}
            aria-label="梁熙坤 Liang Xikun 艺术签名"
          >
            <div className={styles.signatureCanvas} aria-hidden="true">
              <span className={styles.signatureOverline}>Liang / Xikun</span>
              <div className={styles.signatureChinese}>
                <span>梁</span>
                <span>熙坤</span>
              </div>
              <span className={styles.signatureLatin}>liangxikun</span>
              <svg
                className={styles.signatureStroke}
                viewBox="0 0 360 96"
                preserveAspectRatio="none"
              >
                <path d="M8 66C71 88 130 76 171 46C210 17 226 13 224 32C222 54 186 75 150 82C211 72 272 66 350 72" />
              </svg>
              <span className={styles.signatureSeal}>熙坤</span>
              <small>Designer · Developer</small>
            </div>
          </figure>

          <article className={styles.profileCopy}>
            <div className={styles.blockLabel}>
              <span>01</span>
              <p>个人简介 / Profile</p>
            </div>

            <h3>
              设计的感知，
              <br />
              工程的确定性。
            </h3>

            <p className={styles.biography}>
              美术出身，拥有 5 年以上独立开发经验，长期专注于 Web
              开发、前端视觉设计与全栈网站建设。能够从需求分析、视觉设计、技术架构到开发部署与后期维护，独立完成兼顾用户体验、视觉表现、性能与业务目标的网站项目。
            </p>

            <dl className={styles.identity}>
              <div>
                <dt>Name</dt>
                <dd>梁熙坤</dd>
              </div>
              <div>
                <dt>Based in</dt>
                <dd>唐山 · 中国</dd>
              </div>
            </dl>
          </article>

          <aside className={styles.contactBlock}>
            <div className={styles.blockLabel}>
              <span>02</span>
              <p>联系我 / Contact</p>
            </div>

            <div className={styles.contactList}>
              {contactItems.map((item) => {
                const content = (
                  <>
                    <span className={styles.contactIcon}>
                      {item.icon === "qq" ? (
                        <TencentQqIcon />
                      ) : item.icon === "phone" ? (
                        <Phone
                          size={18}
                          strokeWidth={1.35}
                          aria-hidden="true"
                        />
                      ) : (
                        <MessageCircle
                          size={18}
                          strokeWidth={1.35}
                          aria-hidden="true"
                        />
                      )}
                    </span>
                    <span className={styles.contactText}>
                      <small>
                        {item.index} · {item.label}
                      </small>
                      <strong>{item.value}</strong>
                    </span>
                    {item.href ? (
                      <ArrowUpRight
                        size={17}
                        strokeWidth={1.35}
                        aria-hidden="true"
                      />
                    ) : (
                      <i aria-hidden="true" />
                    )}
                  </>
                );

                return item.href ? (
                  <a
                    key={item.label}
                    className={styles.contactItem}
                    href={item.href}
                    data-analytics="contact:phone"
                    aria-label={`拨打电话 ${item.value}`}
                  >
                    {content}
                  </a>
                ) : (
                  <div key={item.label} className={styles.contactItem}>
                    {content}
                  </div>
                );
              })}
            </div>

            <p className={styles.contactHint}>
              <span aria-hidden="true" />
              优先推荐通过微信联系
            </p>
          </aside>
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerBrand}>
            <BrandMark className={styles.footerMark} />
            <span>
              <BrandWordmark
                className={styles.footerWordmark}
                title="梁熙坤中文品牌字标"
              />
              <small>以设计建立表达，以工程保证落地。</small>
            </span>
          </div>

          <p>© 2026 Portfolio · Tangshan, China</p>

          <a href="#home">
            返回顶部
            <MoveUp size={15} strokeWidth={1.4} aria-hidden="true" />
          </a>
        </footer>
      </div>
    </section>
  );
}
