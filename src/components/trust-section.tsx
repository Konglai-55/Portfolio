"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mediaUrl } from "@/lib/media";
import styles from "./trust-section.module.css";

gsap.registerPlugin(ScrollTrigger);

const evidence = [
  {
    index: "01",
    type: "长期合作",
    englishType: "Long-term partnership",
    statement: "一次交付之后，\n仍愿意把下一次项目交给我。",
    detail: "客户在项目推进后主动确认长期合作意向。",
    image: mediaUrl("images/trust-evidence-01.jpg"),
    alt: "客户确认长期合作的项目沟通记录",
  },
  {
    index: "02",
    type: "视觉认可",
    englishType: "Design recognition",
    statement: "设计判断，\n获得客户直接而明确的认可。",
    detail: "界面方案交付后，客户对 UI 表现给予积极评价。",
    image: mediaUrl("images/trust-evidence-02.jpg"),
    alt: "客户认可项目界面设计的沟通记录",
  },
  {
    index: "03",
    type: "商业质感",
    englishType: "Commercial quality",
    statement: "不止是能用，\n也要达到商业级的完成度。",
    detail: "从视觉方向到细节完成度，得到客户正向反馈。",
    image: mediaUrl("images/trust-evidence-03.jpg"),
    alt: "客户评价项目具有商业级设计质感的沟通记录",
  },
  {
    index: "04",
    type: "项目验收",
    englishType: "Delivery approval",
    statement: "真正的完成，\n是客户愿意确认它已经足够好。",
    detail: "网站修正完成后，客户确认体验符合预期。",
    image: mediaUrl("images/trust-evidence-04.jpg"),
    alt: "客户确认网站交付效果的沟通记录",
  },
  {
    index: "05",
    type: "重复委托",
    englishType: "Repeat commissions",
    statement: "同一位客户，\n跨月、多次、持续结算。",
    detail: "一段合作不是单笔交易，而是多次真实委托。",
    image: mediaUrl("images/trust-evidence-05.jpg"),
    alt: "同一客户多次项目结算的交易记录",
  },
  {
    index: "06",
    type: "稳定回款",
    englishType: "Ongoing settlements",
    statement: "稳定交付，\n最终会表现为稳定的合作记录。",
    detail: "同一合作方在短周期内产生多次项目结算。",
    image: mediaUrl("images/trust-evidence-06.jpg"),
    alt: "合作方连续多次结算的交易记录",
  },
  {
    index: "07",
    type: "七月记录",
    englishType: "July ledger",
    statement: "21 笔收入记录，\n不是一次偶然成交。",
    detail: "2026 年 7 月账单记录：21 笔收入，合计 ¥16,188。",
    image: mediaUrl("images/trust-evidence-07.jpg"),
    alt: "2026 年 7 月收入账单记录",
  },
  {
    index: "08",
    type: "八月记录",
    englishType: "August ledger",
    statement: "22 笔收入记录，\n持续发生，才构成可信度。",
    detail: "2026 年 8 月账单记录：22 笔收入，合计 ¥10,662。",
    image: mediaUrl("images/trust-evidence-08.jpg"),
    alt: "2026 年 8 月收入账单记录",
  },
] as const;

const flatStatement = (statement: string) => statement.replace("\n", "");

function PhoneScreen({
  item,
  sizes,
}: {
  item: (typeof evidence)[number];
  sizes: string;
}) {
  return (
    <span className={styles.phoneBody}>
      <span className={styles.phoneIsland} aria-hidden="true" />
      <span className={styles.phoneScreen}>
        <Image src={item.image} alt="" fill sizes={sizes} />
      </span>
    </span>
  );
}

export function TrustSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const fanRef = useRef<HTMLDivElement>(null);
  const ledgerRef = useRef<HTMLOListElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const activeItem = activeIndex === null ? null : evidence[activeIndex];
  const previewIndex = activeIndex ?? 0;

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null
            ? null
            : (current - 1 + evidence.length) % evidence.length,
        );
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? null : (current + 1) % evidence.length,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex]);

  // The phones start as one stack and fan out like evidence laid on a desk.
  useLayoutEffect(() => {
    const fan = fanRef.current;
    if (!fan) return;
    const phones = gsap.utils.toArray<HTMLElement>("[data-fan-phone]", fan);
    const centre = (phones.length - 1) / 2;
    const media = gsap.matchMedia();

    media.add(
      {
        wide: "(min-width: 721px)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { wide, reduce } = context.conditions as {
          wide: boolean;
          reduce: boolean;
        };
        const spread = wide ? 7 : 4.6;
        const fanned = (index: number) => ({
          rotation: (index - centre) * spread,
          y: Math.abs(index - centre) * (wide ? 6 : 3),
        });

        if (reduce) {
          phones.forEach((phone, index) => gsap.set(phone, fanned(index)));
          return;
        }

        phones.forEach((phone, index) => {
          gsap.fromTo(
            phone,
            {
              rotation: (index - centre) * 0.9,
              y: 70 + Math.abs(index - centre) * 4,
              scale: 0.92,
            },
            {
              ...fanned(index),
              scale: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: fan,
                start: "top 92%",
                end: "center 58%",
                scrub: 0.8,
              },
            },
          );
        });
      },
    );

    return () => media.revert();
  }, []);

  // Ledger rows reveal their phone beside the cursor, leaning with motion.
  useLayoutEffect(() => {
    const ledger = ledgerRef.current;
    const preview = previewRef.current;
    if (!ledger || !preview) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const layers = Array.from(
      preview.querySelectorAll<HTMLElement>("[data-preview-layer]"),
    );
    gsap.set(preview, {
      xPercent: -50,
      yPercent: -50,
      autoAlpha: 0,
      scale: 0.6,
    });
    const moveX = gsap.quickTo(preview, "x", {
      duration: 0.55,
      ease: "power3.out",
    });
    const moveY = gsap.quickTo(preview, "y", {
      duration: 0.55,
      ease: "power3.out",
    });
    const lean = gsap.quickTo(preview, "rotation", {
      duration: 0.6,
      ease: "power3.out",
    });
    let lastX = 0;
    let visible = false;

    const show = (index: number) => {
      layers.forEach((layer, layerIndex) => {
        layer.dataset.active = String(layerIndex === index);
      });
      if (visible) return;
      visible = true;
      gsap.to(preview, {
        autoAlpha: 1,
        scale: 1,
        duration: reduce ? 0 : 0.45,
        ease: "back.out(1.6)",
        overwrite: "auto",
      });
    };
    const hide = () => {
      visible = false;
      gsap.to(preview, {
        autoAlpha: 0,
        scale: 0.6,
        duration: reduce ? 0 : 0.25,
        ease: "power2.in",
        overwrite: "auto",
      });
      lean(0);
    };
    const handleMove = (event: PointerEvent) => {
      const row =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[data-ledger-row]")
          : null;
      if (!row) {
        if (visible) hide();
        return;
      }
      show(Number(row.dataset.ledgerRow));
      moveX(event.clientX + 150);
      moveY(event.clientY);
      lean(gsap.utils.clamp(-14, 14, (event.clientX - lastX) * 0.6));
      lastX = event.clientX;
    };

    ledger.addEventListener("pointermove", handleMove);
    ledger.addEventListener("pointerleave", hide);
    return () => {
      ledger.removeEventListener("pointermove", handleMove);
      ledger.removeEventListener("pointerleave", hide);
      gsap.killTweensOf(preview);
    };
  }, []);

  const preview =
    activeItem && typeof document !== "undefined"
      ? createPortal(
          <div
            className={styles.lightbox}
            role="dialog"
            aria-modal="true"
            aria-label={`${activeItem.type}原始凭证`}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setActiveIndex(null);
            }}
          >
            <div className={styles.lightboxPanel}>
              <header className={styles.lightboxHeader}>
                <div>
                  <span>{activeItem.index} / Evidence archive</span>
                  <strong>{activeItem.type}</strong>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setActiveIndex(null)}
                  aria-label="关闭原始凭证预览"
                >
                  <X size={19} strokeWidth={1.4} aria-hidden="true" />
                </button>
              </header>

              <div className={styles.lightboxBody}>
                <div className={styles.lightboxImage}>
                  <Image
                    src={activeItem.image}
                    alt={activeItem.alt}
                    fill
                    sizes="(max-width: 720px) 96vw, 72vw"
                  />
                </div>
                <aside>
                  <span>Context</span>
                  <h3>{activeItem.statement.replace("\n", "")}</h3>
                  <p>{activeItem.detail}</p>
                  <small>
                    原始材料仅截取与合作、交付及结算相关的部分。
                  </small>
                </aside>
              </div>

              <footer className={styles.lightboxFooter}>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex(
                      (previewIndex - 1 + evidence.length) % evidence.length,
                    )
                  }
                  aria-label="查看上一份凭证"
                >
                  <ArrowLeft size={15} strokeWidth={1.45} aria-hidden="true" />
                  上一份
                </button>
                <span>
                  {String(previewIndex + 1).padStart(2, "0")} / {evidence.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((previewIndex + 1) % evidence.length)
                  }
                  aria-label="查看下一份凭证"
                >
                  下一份
                  <ArrowRight size={15} strokeWidth={1.45} aria-hidden="true" />
                </button>
              </footer>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <section id="trust" className={styles.section}>
      <div className={styles.watermark} aria-hidden="true">
        PROOF
      </div>

      <div className={styles.container}>
        <header className={styles.sectionHeader} data-reveal="soft">
          <p>
            <span>02</span>
            Trust · Proof · Delivery
          </p>
          <small>Evidence archive / 2026</small>
        </header>

        <div className={styles.intro}>
          <div data-reveal="left">
            <p>信任背书 / Proof of work</p>
            <h2 data-reveal="title">
              好的交付，
              <span>会留下持续合作的痕迹。</span>
            </h2>
          </div>

          <div className={styles.introSide} data-reveal="right">
            <p>
              比自我介绍更有说服力的，是客户的真实反馈、项目完成后的再次合作，以及持续发生的结算记录。
            </p>
            <dl className={styles.stats}>
              <div>
                <dt>客户反馈</dt>
                <dd
                  data-count-from="0"
                  data-count-to="4"
                  data-count-duration="0.9"
                >
                  4
                </dd>
              </div>
              <div>
                <dt>结算记录</dt>
                <dd
                  data-count-from="0"
                  data-count-to="4"
                  data-count-duration="0.9"
                >
                  4
                </dd>
              </div>
              <div>
                <dt>两个月收入记录</dt>
                <dd
                  data-count-from="0"
                  data-count-to="43"
                  data-count-duration="1.2"
                >
                  43
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className={styles.fanWrap}>
        <div ref={fanRef} className={styles.fan} aria-label="原始凭证截图">
          {evidence.map((item, index) => (
            <button
              key={item.index}
              type="button"
              className={styles.phone}
              data-fan-phone
              style={{
                zIndex: index < 4 ? index + 1 : evidence.length - index,
              }}
              onClick={() => setActiveIndex(index)}
              data-analytics={`trust:phone:${item.index}`}
              aria-label={`放大查看 ${item.type} 原始凭证`}
            >
              <span className={styles.phoneTag} aria-hidden="true">
                {item.index} · {item.type}
              </span>
              <PhoneScreen item={item} sizes="(max-width: 720px) 26vw, 13rem" />
            </button>
          ))}
        </div>
        <p className={styles.fanCaption}>
          <span>08 份原始记录</span>
          点击任意一台手机，查看完整截图
        </p>
      </div>

      <div className={styles.container}>
        <ol ref={ledgerRef} className={styles.ledger} aria-label="凭证清单">
          {evidence.map((item, index) => (
            <li key={item.index} data-reveal="soft">
              <button
                type="button"
                className={styles.row}
                data-ledger-row={index}
                onClick={() => setActiveIndex(index)}
                data-analytics={`trust:row:${item.index}`}
              >
                <span className={styles.rowIndex}>{item.index}</span>
                <span className={styles.rowType}>
                  {item.type}
                  <small>{item.englishType}</small>
                </span>
                <span className={styles.rowStatement}>
                  {flatStatement(item.statement)}
                  <small>{item.detail}</small>
                </span>
                <span className={styles.rowThumb} aria-hidden="true">
                  <PhoneScreen item={item} sizes="4rem" />
                </span>
                <span className={styles.rowCta}>
                  查看原图
                  <ArrowUpRight size={15} strokeWidth={1.5} aria-hidden="true" />
                </span>
              </button>
            </li>
          ))}
        </ol>

        <footer className={styles.disclaimer} data-reveal="soft">
          <span>Proof, not promise.</span>
          <p>
            内容来自真实项目沟通与结算记录，仅作历史交付能力参考；金额不构成固定报价。
          </p>
        </footer>
      </div>

      <div ref={previewRef} className={styles.preview} aria-hidden="true">
        {evidence.map((item) => (
          <span
            key={item.index}
            className={styles.previewLayer}
            data-preview-layer
          >
            <PhoneScreen item={item} sizes="15rem" />
          </span>
        ))}
      </div>

      {preview}
    </section>
  );
}
