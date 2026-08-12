"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import styles from "./trust-section.module.css";

const evidence = [
  {
    index: "01",
    type: "长期合作",
    englishType: "Long-term partnership",
    statement: "一次交付之后，\n仍愿意把下一次项目交给我。",
    detail: "客户在项目推进后主动确认长期合作意向。",
    image: "/images/trust-evidence-01.jpg",
    alt: "客户确认长期合作的项目沟通记录",
    tone: "slate",
  },
  {
    index: "02",
    type: "视觉认可",
    englishType: "Design recognition",
    statement: "设计判断，\n获得客户直接而明确的认可。",
    detail: "界面方案交付后，客户对 UI 表现给予积极评价。",
    image: "/images/trust-evidence-02.jpg",
    alt: "客户认可项目界面设计的沟通记录",
    tone: "paper",
  },
  {
    index: "03",
    type: "商业质感",
    englishType: "Commercial quality",
    statement: "不止是能用，\n也要达到商业级的完成度。",
    detail: "从视觉方向到细节完成度，得到客户正向反馈。",
    image: "/images/trust-evidence-03.jpg",
    alt: "客户评价项目具有商业级设计质感的沟通记录",
    tone: "clay",
  },
  {
    index: "04",
    type: "项目验收",
    englishType: "Delivery approval",
    statement: "真正的完成，\n是客户愿意确认它已经足够好。",
    detail: "网站修正完成后，客户确认体验符合预期。",
    image: "/images/trust-evidence-04.jpg",
    alt: "客户确认网站交付效果的沟通记录",
    tone: "violet",
  },
  {
    index: "05",
    type: "重复委托",
    englishType: "Repeat commissions",
    statement: "同一位客户，\n跨月、多次、持续结算。",
    detail: "一段合作不是单笔交易，而是多次真实委托。",
    image: "/images/trust-evidence-05.jpg",
    alt: "同一客户多次项目结算的交易记录",
    tone: "ink",
  },
  {
    index: "06",
    type: "稳定回款",
    englishType: "Ongoing settlements",
    statement: "稳定交付，\n最终会表现为稳定的合作记录。",
    detail: "同一合作方在短周期内产生多次项目结算。",
    image: "/images/trust-evidence-06.jpg",
    alt: "合作方连续多次结算的交易记录",
    tone: "paper",
  },
  {
    index: "07",
    type: "七月记录",
    englishType: "July ledger",
    statement: "21 笔收入记录，\n不是一次偶然成交。",
    detail: "2026 年 7 月账单记录：21 笔收入，合计 ¥16,188。",
    image: "/images/trust-evidence-07.jpg",
    alt: "2026 年 7 月收入账单记录",
    tone: "clay",
  },
  {
    index: "08",
    type: "八月记录",
    englishType: "August ledger",
    statement: "22 笔收入记录，\n持续发生，才构成可信度。",
    detail: "2026 年 8 月账单记录：22 笔收入，合计 ¥10,662。",
    image: "/images/trust-evidence-08.jpg",
    alt: "2026 年 8 月收入账单记录",
    tone: "slate",
  },
] as const;

type Evidence = (typeof evidence)[number];

function EvidenceCard({
  item,
  isFlipped,
  onFlip,
  onReset,
  onPreview,
}: {
  item: Evidence;
  isFlipped: boolean;
  onFlip: () => void;
  onReset: () => void;
  onPreview: () => void;
}) {
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const didDragRef = useRef(false);

  const handlePointerDown = (event: ReactPointerEvent) => {
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
    didDragRef.current = false;
  };

  const handlePointerMove = (event: ReactPointerEvent) => {
    const distance = Math.hypot(
      event.clientX - pointerStartRef.current.x,
      event.clientY - pointerStartRef.current.y,
    );
    if (distance > 9) didDragRef.current = true;
  };

  return (
    <div className={styles.cardReveal} data-reveal="card">
      <article
        className={styles.flipCard}
        data-tone={item.tone}
        data-flipped={isFlipped}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") onReset();
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        <div className={styles.cardInner}>
          <button
            type="button"
            className={`${styles.cardFace} ${styles.cardFront}`}
            aria-label={`${item.type}，翻转查看原始凭证`}
            onClick={() => {
              if (didDragRef.current) return;
              onFlip();
            }}
            data-analytics={`trust:flip:${item.index}`}
          >
            <div className={styles.cardMeta}>
              <span>{item.index}/08</span>
              <small>{item.englishType}</small>
            </div>

            <div className={styles.cardStatement}>
              <span>{item.type}</span>
              <h3>
                {item.statement.split("\n").map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <p>{item.detail}</p>
            </div>

            <div className={styles.flipHint}>
              <RotateCcw size={15} strokeWidth={1.45} aria-hidden="true" />
              <span>悬停或点击翻阅</span>
            </div>
          </button>

          <button
            type="button"
            className={`${styles.cardFace} ${styles.cardBack}`}
            onClick={() => {
              if (didDragRef.current) return;
              onReset();
              onPreview();
            }}
            data-analytics={`trust:preview:${item.index}`}
            aria-label={`放大查看${item.type}原始凭证`}
          >
            <div className={styles.evidenceImage}>
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width: 720px) 92vw, (max-width: 1100px) 44vw, 24vw"
              />
            </div>
          </button>
        </div>
      </article>
    </div>
  );
}

export function TrustSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const evidenceGridRef = useRef<HTMLDivElement>(null);
  const scrollFrameRef = useRef<number | null>(null);
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
          current === null ? null : (current - 1 + evidence.length) % evidence.length,
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

  useEffect(() => {
    return () => {
      if (scrollFrameRef.current !== null) {
        cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, []);

  const updateMobileIndex = () => {
    const grid = evidenceGridRef.current;
    if (!grid) return;

    if (scrollFrameRef.current !== null) {
      cancelAnimationFrame(scrollFrameRef.current);
    }

    scrollFrameRef.current = requestAnimationFrame(() => {
      const gridCenter = grid.scrollLeft + grid.clientWidth / 2;
      const cards = Array.from(grid.children) as HTMLElement[];
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - gridCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setMobileIndex(closestIndex);
      setFlippedIndex(null);
      scrollFrameRef.current = null;
    });
  };

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
            <span>03</span>
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

          <div className={styles.introCopy} data-reveal="right">
            <ShieldCheck size={24} strokeWidth={1.25} aria-hidden="true" />
            <p>
              比自我介绍更有说服力的，是客户的真实反馈、项目完成后的再次合作，
              以及持续发生的结算记录。
            </p>
          </div>
        </div>

        <div className={styles.proofIndex} data-reveal="soft">
          <div>
            <strong data-count-from="0" data-count-to="4" data-count-duration="0.9">
              4
            </strong>
            <span>份客户反馈</span>
          </div>
          <div>
            <strong data-count-from="0" data-count-to="4" data-count-duration="0.9">
              4
            </strong>
            <span>份结算记录</span>
          </div>
          <div>
            <strong data-count-from="0" data-count-to="43" data-count-duration="1.15">
              43
            </strong>
            <span>笔两月收入记录</span>
          </div>
          <p>先看结论，再翻阅原始记录。</p>
        </div>

        <div
          ref={evidenceGridRef}
          className={styles.evidenceGrid}
          onScroll={updateMobileIndex}
          aria-label="信任凭证，可左右滑动浏览"
        >
          {evidence.map((item, index) => (
            <EvidenceCard
              key={item.index}
              item={item}
              isFlipped={flippedIndex === index}
              onFlip={() => setFlippedIndex(index)}
              onReset={() => setFlippedIndex(null)}
              onPreview={() => {
                setFlippedIndex(null);
                setActiveIndex(index);
              }}
            />
          ))}
        </div>

        <div className={styles.mobileEvidenceControls}>
          <p>
            <span>左右滑动</span>
            轻点翻面 · 再点放大
          </p>
          <div className={styles.mobilePager}>
            <span>
              {String(mobileIndex + 1).padStart(2, "0")}
              <i />
              {String(evidence.length).padStart(2, "0")}
            </span>
            <div className={styles.mobileProgress} aria-hidden="true">
              {evidence.map((item, index) => (
                <i key={item.index} data-active={index === mobileIndex} />
              ))}
            </div>
          </div>
        </div>

        <footer className={styles.disclaimer} data-reveal="soft">
          <span>Proof, not promise.</span>
          <p>
            内容来自真实项目沟通与结算记录，仅作历史交付能力参考；金额不构成固定报价。
          </p>
        </footer>
      </div>

      {preview}
    </section>
  );
}
