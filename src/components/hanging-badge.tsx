"use client";

import { useEffect, useRef } from "react";
import styles from "./hanging-badge.module.css";

type Point = { x: number; y: number; px: number; py: number; w: number };

const SEGMENTS = 12;
const GRAVITY = 2600; // px / s²
const DAMPING = 0.988;
const STEP = 1 / 120;
const ITERATIONS = 14;
const ROPE_STIFFNESS = 0.55; // < 1 gives the strap a little bungee bounce
const ROPE_WEIGHT = 1;
const CARD_WEIGHT = 0.18; // inverse mass: the card is much heavier

function solve(a: Point, b: Point, length: number, stiffness: number) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const distance = Math.hypot(dx, dy) || 0.0001;
  const total = a.w + b.w;
  if (total === 0) return;
  const diff = ((distance - length) / distance) * stiffness;
  a.x += dx * diff * (a.w / total);
  a.y += dy * diff * (a.w / total);
  b.x -= dx * diff * (b.w / total);
  b.y -= dy * diff * (b.w / total);
}

/**
 * A staff badge on a lanyard, simulated with Verlet integration. It drops
 * in when scrolled into view, swings to rest with a slight sway, and can be
 * grabbed, dragged and flung.
 */
export function HangingBadge() {
  const stageRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const strapRef = useRef<SVGPathElement>(null);
  const strapEdgeRef = useRef<SVGPathElement>(null);
  const textPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const badge = badgeRef.current;
    const strap = strapRef.current;
    const strapEdge = strapEdgeRef.current;
    const textPath = textPathRef.current;
    if (!stage || !badge || !strap || !strapEdge || !textPath) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let ropeLength = 0;
    let cardWidth = 0;
    let cardHeight = 0;

    const measure = () => {
      width = stage.clientWidth;
      cardWidth = badge.offsetWidth;
      cardHeight = badge.offsetHeight;
      ropeLength =
        parseFloat(getComputedStyle(stage).getPropertyValue("--rope")) || 190;
    };
    measure();

    const anchor = { x: width / 2, y: 0 };
    const rope: Point[] = [];
    const tail: Point = { x: 0, y: 0, px: 0, py: 0, w: CARD_WEIGHT };
    const segment = () => ropeLength / SEGMENTS;

    // Hanging pose, optionally lifted above the stage and pushed sideways.
    const pose = (lift: number, shift: number) => {
      rope.length = 0;
      for (let i = 0; i <= SEGMENTS; i += 1) {
        const x = anchor.x + shift * (i / SEGMENTS);
        const y = anchor.y + i * segment() - lift;
        rope.push({ x, y, px: x, py: y, w: i === 0 ? 0 : ROPE_WEIGHT });
      }
      rope[SEGMENTS].w = CARD_WEIGHT;
      const top = rope[SEGMENTS];
      tail.x = tail.px = top.x + shift * 0.4;
      tail.y = tail.py = top.y + cardHeight;
    };

    // Drag state.
    let dragging = false;
    let grabAlong = 0;
    const target = { x: 0, y: 0 };

    // Drop-in: the anchor itself falls from above and stops abruptly, so
    // inertia produces the bounce and swing.
    let dropping = false;
    let dropTime = 0;
    const dropDuration = 0.62;
    const dropFrom = { x: 0, y: 0 };

    const render = () => {
      const top = rope[SEGMENTS];
      const angle = Math.atan2(tail.x - top.x, tail.y - top.y);
      const spin = (tail.x - tail.px) * 0.9;
      const tilt = Math.max(-28, Math.min(28, spin));
      badge.style.transform = `translate3d(${(top.x - cardWidth / 2).toFixed(2)}px, ${top.y.toFixed(2)}px, 0) rotate(${(-angle * 180) / Math.PI}deg) rotateY(${tilt.toFixed(2)}deg)`;
      badge.style.setProperty("--sheen", `${(50 + tilt * 2.4).toFixed(1)}%`);

      let d = `M${rope[0].x.toFixed(1)} ${rope[0].y.toFixed(1)}`;
      for (let i = 1; i < rope.length - 1; i += 1) {
        const mx = (rope[i].x + rope[i + 1].x) / 2;
        const my = (rope[i].y + rope[i + 1].y) / 2;
        d += ` Q${rope[i].x.toFixed(1)} ${rope[i].y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
      }
      d += ` L${top.x.toFixed(1)} ${top.y.toFixed(1)}`;
      strap.setAttribute("d", d);
      strapEdge.setAttribute("d", d);
      textPath.setAttribute("d", d);
    };

    const step = (time: number) => {
      if (dropping) {
        dropTime += STEP;
        const t = Math.min(dropTime / dropDuration, 1);
        const eased = t * t; // accelerate like a fall
        anchor.x = dropFrom.x + (width / 2 - dropFrom.x) * eased;
        anchor.y = dropFrom.y * (1 - eased);
        if (t >= 1) dropping = false;
      }

      // A faint breeze keeps the badge alive at rest.
      const breeze =
        (Math.sin(time * 0.0007) * 26 + Math.sin(time * 0.0019 + 1.3) * 10) *
        (width < 600 ? 0.35 : 1);

      const points = [...rope, tail];
      for (const p of points) {
        if (p.w === 0) continue;
        const vx = (p.x - p.px) * DAMPING;
        const vy = (p.y - p.py) * DAMPING;
        p.px = p.x;
        p.py = p.y;
        p.x += vx + breeze * STEP * STEP;
        p.y += vy + GRAVITY * STEP * STEP;
      }
      rope[0].x = rope[0].px = anchor.x;
      rope[0].y = rope[0].py = anchor.y;

      const top = rope[SEGMENTS];
      for (let k = 0; k < ITERATIONS; k += 1) {
        for (let i = 0; i < SEGMENTS; i += 1) {
          solve(rope[i], rope[i + 1], segment(), ROPE_STIFFNESS);
        }
        solve(top, tail, cardHeight, 1);

        if (dragging) {
          // Move the grabbed spot on the card's axis onto the pointer.
          const t = grabAlong / cardHeight;
          const qx = top.x + (tail.x - top.x) * t;
          const qy = top.y + (tail.y - top.y) * t;
          const dx = target.x - qx;
          const dy = target.y - qy;
          top.x += dx;
          top.y += dy;
          tail.x += dx;
          tail.y += dy;
        }
      }
    };

    let frame = 0;
    let last = 0;
    let accumulator = 0;
    let running = false;

    const loop = (now: number) => {
      if (!last) last = now;
      accumulator += Math.min((now - last) / 1000, 0.05);
      last = now;
      while (accumulator >= STEP) {
        step(now);
        accumulator -= STEP;
      }
      render();
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const toStage = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const clampTarget = (x: number, y: number) => {
      // The strap can't be pulled further than its own length.
      const reach = ropeLength * 1.08 + grabAlong;
      const dx = x - anchor.x;
      const dy = y - anchor.y;
      const distance = Math.hypot(dx, dy);
      if (distance <= reach) return { x, y };
      return {
        x: anchor.x + (dx / distance) * reach,
        y: anchor.y + (dy / distance) * reach,
      };
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      event.preventDefault();
      const point = toStage(event);
      const top = rope[SEGMENTS];
      const ax = tail.x - top.x;
      const ay = tail.y - top.y;
      const along =
        ((point.x - top.x) * ax + (point.y - top.y) * ay) / cardHeight;
      grabAlong = Math.max(0, Math.min(cardHeight, along));
      Object.assign(target, clampTarget(point.x, point.y));
      dragging = true;
      dropping = false;
      stage.dataset.dragging = "true";
      try {
        badge.setPointerCapture(event.pointerId);
      } catch {
        // Synthetic or already-released pointers can't be captured.
      }
      start();
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const point = toStage(event);
      Object.assign(target, clampTarget(point.x, point.y));
    };
    const onPointerUp = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      delete stage.dataset.dragging;
      if (badge.hasPointerCapture(event.pointerId)) {
        badge.releasePointerCapture(event.pointerId);
      }
    };

    badge.addEventListener("pointerdown", onPointerDown);
    badge.addEventListener("pointermove", onPointerMove);
    badge.addEventListener("pointerup", onPointerUp);
    badge.addEventListener("pointercancel", onPointerUp);

    anchor.x = width / 2;
    if (reduceMotion) {
      pose(0, 0);
      stage.dataset.live = "true";
      render();
    } else {
      // Park everything above the stage until it scrolls into view.
      dropFrom.x = width / 2 + width * (width < 600 ? 0.08 : 0.22);
      dropFrom.y = -(ropeLength + cardHeight + 120);
      anchor.x = dropFrom.x;
      anchor.y = dropFrom.y;
      pose(0, 0);
      stage.dataset.live = "true";
      render();
    }

    let dropped = reduceMotion;
    const visibility = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!dropped && entry.intersectionRatio >= 0.35) {
            dropped = true;
            dropping = true;
            dropTime = 0;
          }
          if (dropped && !reduceMotion) start();
        } else {
          stop();
        }
      },
      { threshold: [0, 0.35] },
    );
    visibility.observe(stage);

    const resize = new ResizeObserver(() => {
      const previousWidth = width;
      measure();
      if (!dropping && dropped) {
        const dx = width / 2 - previousWidth / 2;
        anchor.x = width / 2;
        for (const p of [...rope, tail]) {
          p.x += dx;
          p.px += dx;
        }
      }
      if (reduceMotion) {
        anchor.x = width / 2;
        pose(0, 0);
      }
      render();
    });
    resize.observe(stage);

    return () => {
      stop();
      visibility.disconnect();
      resize.disconnect();
      badge.removeEventListener("pointerdown", onPointerDown);
      badge.removeEventListener("pointermove", onPointerMove);
      badge.removeEventListener("pointerup", onPointerUp);
      badge.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return (
    <div ref={stageRef} className={styles.stage}>
      <svg className={styles.defs} aria-hidden="true">
        <filter id="badge-seal-rough">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.2"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <span className={styles.hook} aria-hidden="true" />

      <svg className={styles.strap} aria-hidden="true">
        <path ref={strapRef} className={styles.strapBand} />
        <path ref={strapEdgeRef} className={styles.strapStitch} />
        <path ref={textPathRef} id="badge-strap-path" fill="none" />
        <text className={styles.strapText} dy="3">
          <textPath href="#badge-strap-path" startOffset="6">
            FORM × BUILD · FORM × BUILD · FORM × BUILD · FORM × BUILD
          </textPath>
        </text>
      </svg>

      <div
        ref={badgeRef}
        className={styles.badge}
        data-lenis-prevent
        role="img"
        aria-label="梁熙坤的工牌：设计师 · 全栈开发者，唐山，5 年以上独立开发经验。可拖动。"
      >
        <span className={styles.clasp} aria-hidden="true">
          <i />
        </span>
        <div className={styles.card}>
          <span className={styles.slot} aria-hidden="true" />
          <header className={styles.cardHead}>
            <span>
              <b>形构</b> Form × Build
            </span>
            <span>Pass · 2026</span>
          </header>

          <div className={styles.who}>
            <p className={styles.role}>Designer &amp; Developer</p>
            <p className={styles.name}>梁熙坤</p>
            <p className={styles.latin}>Liang Xikun</p>
            <span className={styles.seal} aria-hidden="true">
              <i>熙</i>
              <i>坤</i>
            </span>
          </div>

          <dl className={styles.meta}>
            <div>
              <dt>Role</dt>
              <dd>设计师 · 全栈开发者</dd>
            </div>
            <div>
              <dt>Based</dt>
              <dd>唐山 · 中国</dd>
            </div>
            <div>
              <dt>Practice</dt>
              <dd>5+ 年独立开发</dd>
            </div>
          </dl>

          <footer className={styles.cardFoot}>
            <p>
              以设计建立表达，
              <br />
              以工程保证落地。
            </p>
            <span className={styles.barcode} aria-hidden="true" />
          </footer>
          <span className={styles.sheen} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
