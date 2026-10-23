"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./velocity-marquee.module.css";

gsap.registerPlugin(ScrollTrigger);

type MarqueeRow = {
  items: readonly string[];
  variant: "display" | "serif";
};

function Row({ row }: { row: MarqueeRow }) {
  return (
    <div className={styles.row} data-variant={row.variant}>
      <div className={styles.track} data-marquee-track>
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className={styles.group}
            aria-hidden={copy === 1 ? true : undefined}
          >
            {row.items.map((item, index) => (
              <span key={`${copy}-${index}`} className={styles.item}>
                {item}
                <i aria-hidden="true">✦</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * A chapter divider whose rows drift continuously and react to scrolling:
 * faster scrolling speeds them up and skews the type; scrolling back
 * reverses their direction.
 */
export function VelocityMarquee({
  rows,
  label,
}: {
  rows: readonly MarqueeRow[];
  label: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tracks = gsap.utils.toArray<HTMLElement>("[data-marquee-track]", root);
    const offsets = tracks.map(() => 0);
    const setX = tracks.map((track) => gsap.quickSetter(track, "x", "px"));
    let halves = tracks.map((track) => track.scrollWidth / 2);
    const skew = gsap.quickTo(tracks, "skewX", {
      duration: 0.5,
      ease: "power3.out",
    });
    let direction = 1;
    let boost = 0;
    let active = false;

    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onRefresh: () => {
        halves = tracks.map((track) => track.scrollWidth / 2);
      },
      onToggle: (self) => {
        active = self.isActive;
      },
      onUpdate: (self) => {
        const velocity = self.getVelocity();
        direction = self.direction;
        boost = Math.min(Math.abs(velocity) / 9, 900);
        skew(gsap.utils.clamp(-9, 9, velocity / -320));
      },
    });

    const tick = (_time: number, deltaTime: number) => {
      if (!active) return;
      const seconds = Math.min(deltaTime, 64) / 1000;
      boost *= 0.92;
      tracks.forEach((_track, index) => {
        // Alternate rows run against each other.
        const sign = index % 2 === 0 ? -1 : 1;
        const half = halves[index];
        offsets[index] += sign * direction * (70 + boost) * seconds;
        offsets[index] = gsap.utils.wrap(-half, 0, offsets[index]);
        setX[index](offsets[index]);
      });
      if (boost < 1) skew(0);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      trigger.kill();
      gsap.set(tracks, { clearProps: "transform" });
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.marquee} role="img" aria-label={label}>
      {rows.map((row, index) => (
        <Row key={index} row={row} />
      ))}
    </div>
  );
}
