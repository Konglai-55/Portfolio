"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, MoveUp, QrCode } from "lucide-react";
import { mediaUrl } from "@/lib/media";
import { BrandMark, BrandWordmark } from "./brand-mark";
import { HangingBadge } from "./hanging-badge";
import styles from "./contact-section.module.css";

type ContactItem = {
  id: "wechat" | "qq" | "phone";
  index: string;
  label: string;
  english: string;
  value: string;
  href?: string;
};

const contactItems: readonly ContactItem[] = [
  {
    id: "wechat",
    index: "01",
    label: "微信",
    english: "WeChat · 推荐",
    value: "as14246791",
  },
  {
    id: "qq",
    index: "02",
    label: "QQ",
    english: "Tencent QQ",
    value: "351738705",
  },
  {
    id: "phone",
    index: "03",
    label: "电话",
    english: "Phone",
    value: "177 3655 1531",
    href: "tel:+8617736551531",
  },
];

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    // Clipboard API is unavailable on insecure origins; fall back.
    const field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.append(field);
    field.select();
    const ok = document.execCommand("copy");
    field.remove();
    return ok;
  }
}

export function ContactSection() {
  const [copied, setCopied] = useState<string | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);
  const wechatRowRef = useRef<HTMLLIElement>(null);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  useEffect(() => {
    if (!qrOpen) return;
    const close = (event: PointerEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent) {
        if (event.key === "Escape") setQrOpen(false);
        return;
      }
      if (!wechatRowRef.current?.contains(event.target as Node)) {
        setQrOpen(false);
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [qrOpen]);

  const handleCopy = async (item: ContactItem) => {
    const ok = await copyText(item.value);
    if (!ok) return;
    setCopied(item.id);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(null), 1800);
  };

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.container}>
        <header className={styles.sectionHeader} data-reveal="soft">
          <span>
            <b>04</b> Contact
          </span>
          <p>
            <i aria-hidden="true" />
            Available for selected projects
          </p>
        </header>

        <div className={styles.hero}>
          <p className={styles.kicker} data-reveal="soft">
            Let&apos;s make something meaningful.
          </p>
          <h2 className={styles.title} data-reveal="title">
            让想法，
            <span>成为作品。</span>
          </h2>
          <p className={styles.heroCopy} data-reveal="soft">
            如果你正在寻找兼顾视觉表达、开发质量与交付效率的合作方式，欢迎聊聊你的项目目标。
            <small>从一次清晰的沟通开始 · 优先推荐通过微信联系</small>
          </p>
        </div>

        <ul className={styles.rows}>
          {contactItems.map((item, index) => {
            const isCopied = copied === item.id;
            const isWechat = item.id === "wechat";

            return (
              <li
                key={item.id}
                ref={isWechat ? wechatRowRef : undefined}
                className={styles.row}
                data-qr-open={isWechat && qrOpen ? "true" : undefined}
                data-reveal="soft"
                data-reveal-delay={String(index + 1)}
              >
                <span className={styles.rowIndex}>{item.index}</span>
                <span className={styles.rowLabel}>
                  {item.label}
                  <small>{item.english}</small>
                </span>

                {item.href ? (
                  <a
                    className={styles.rowValue}
                    href={item.href}
                    data-analytics="contact:phone"
                    aria-label={`拨打电话 ${item.value}`}
                  >
                    {item.value}
                  </a>
                ) : (
                  <button
                    type="button"
                    className={styles.rowValue}
                    data-analytics={`contact:${item.id}`}
                    aria-label={`复制${item.label}号 ${item.value}`}
                    onClick={() => void handleCopy(item)}
                  >
                    {item.value}
                  </button>
                )}

                <span className={styles.rowActions}>
                  {isWechat ? (
                    <button
                      type="button"
                      className={styles.action}
                      aria-expanded={qrOpen}
                      aria-controls="wechat-qr"
                      onClick={() => setQrOpen((open) => !open)}
                    >
                      <QrCode size={15} strokeWidth={1.5} aria-hidden="true" />
                      <span>二维码</span>
                    </button>
                  ) : null}
                  <span
                    className={styles.action}
                    data-state={isCopied ? "done" : undefined}
                    aria-hidden="true"
                  >
                    {item.href ? (
                      <>
                        <ArrowUpRight size={15} strokeWidth={1.5} />
                        <span>拨打</span>
                      </>
                    ) : isCopied ? (
                      <>
                        <Check size={15} strokeWidth={1.8} />
                        <span>已复制</span>
                      </>
                    ) : (
                      <>
                        <Copy size={15} strokeWidth={1.5} />
                        <span>复制</span>
                      </>
                    )}
                  </span>
                </span>

                {isWechat ? (
                  <div
                    id="wechat-qr"
                    className={styles.qrPanel}
                    inert={!qrOpen}
                  >
                    <div className={styles.qrInner}>
                      <div className={styles.qrFrame}>
                        <Image
                          className={styles.qrImage}
                          src={mediaUrl("images/wechat-qr-as14246791.png")}
                          width={377}
                          height={410}
                          sizes="12rem"
                          alt="梁熙坤微信二维码，微信号 as14246791"
                        />
                      </div>
                      <div className={styles.qrCopy}>
                        <span>Scan to connect</span>
                        <strong>打开微信，扫一扫添加</strong>
                        <p>
                          或点击上方微信号直接复制：<b>as14246791</b>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
        <p className={styles.srStatus} role="status" aria-live="polite">
          {copied ? "已复制到剪贴板" : ""}
        </p>

        <div className={styles.profile}>
          <article className={styles.profileCopy}>
            <p className={styles.kicker} data-reveal="soft">
              个人简介 / Profile
            </p>
            <h3 data-reveal="title">
              设计的感知，
              <span>工程的确定性。</span>
            </h3>
            <p className={styles.biography} data-reveal="soft">
              美术出身，拥有 5 年以上独立开发经验，长期专注于 Web
              开发、前端视觉设计与全栈网站建设。能够从需求分析、视觉设计、技术架构到开发部署与后期维护，独立完成兼顾用户体验、视觉表现、性能与业务目标的网站项目。
            </p>
          </article>

          <HangingBadge />

          <aside className={styles.profileSide}>
            <p className={styles.dragHint} aria-hidden="true">
              <span>←</span> 按住工牌，拖一下试试
            </p>
            <dl className={styles.facts}>
              <div data-reveal="soft" data-reveal-delay="1">
                <dt>擅长 / Focus</dt>
                <dd>
                  <ul>
                    <li>Web 开发</li>
                    <li>视觉设计</li>
                    <li>全栈交付</li>
                  </ul>
                </dd>
              </div>
              <div data-reveal="soft" data-reveal-delay="2">
                <dt>合作方式 / Process</dt>
                <dd>个人主导 → 按需协作 → 统一交付</dd>
              </div>
              <div data-reveal="soft" data-reveal-delay="3">
                <dt>品牌 / Brand</dt>
                <dd>形构 · Form × Build</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>

      <footer className={styles.footer}>
        <p
          className={styles.bigName}
          aria-hidden="true"
          data-scrub-progress
          data-scrub-start="top bottom"
          data-scrub-end="bottom bottom"
        >
          <span>Liang</span>
          <span>Xikun</span>
        </p>

        <div className={styles.footerBar}>
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

          <a href="#home" className={styles.toTop} data-magnetic="0.4">
            返回顶部
            <MoveUp size={15} strokeWidth={1.4} aria-hidden="true" />
          </a>
        </div>
      </footer>
    </section>
  );
}
