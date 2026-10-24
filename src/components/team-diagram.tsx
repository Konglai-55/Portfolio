"use client";

import { useEffect, useRef } from "react";
import styles from "./about-section.module.css";

const RAMP = " .,:;=+*xX#%@";
const STAR_COUNT = 72;
const CELL_W = 9;
const CELL_H = 13;
const SUN_COLORS = [
  "#5a2412",
  "#7e3519",
  "#a24a28",
  "#c56f4d",
  "#d98a5f",
  "#eba874",
  "#f6c78f",
  "#ffe2b5",
];

type Star = {
  radius: number; // in sun radii
  ringRadius: number; // radius once orbits unify
  inclination: number;
  node: number;
  phase: number;
  speed: number;
};

// Deterministic so server and client agree and every visit looks the same.
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeStars(): Star[] {
  const random = seeded(55);
  const bands = [1.75, 2.3, 2.85];
  return Array.from({ length: STAR_COUNT }, (_, index) => ({
    radius: 1.6 + random() * 1.7,
    ringRadius: bands[index % bands.length] + (random() - 0.5) * 0.12,
    inclination: (random() - 0.5) * Math.PI * 1.6,
    node: random() * Math.PI * 2,
    phase: random() * Math.PI * 2,
    speed: (0.18 + random() * 0.32) * (random() > 0.5 ? 1 : -1),
  }));
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Character-rendered 3D scene: a sun (the lead) that gathers a growing field
 * of orbiting stars (specialists joining) as the reader scrolls, which then
 * settle into one shared orbital plane (unified delivery). Reads --progress
 * from the surrounding [data-scrub-progress] block.
 */
export function TeamDiagram() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const host = canvas.closest<HTMLElement>("[data-scrub-progress]");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const stars = makeStars();

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let chars: string[] = [];
    let colors: string[] = [];
    let depth: Float32Array = new Float32Array(0);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      cols = Math.floor(width / CELL_W);
      rows = Math.floor(height / CELL_H);
      chars = new Array(cols * rows);
      colors = new Array(cols * rows);
      depth = new Float32Array(cols * rows);
    };

    const readProgress = () => {
      const value = parseFloat(
        host?.style.getPropertyValue("--progress") ?? "",
      );
      return Number.isNaN(value) ? 1 : value;
    };

    const draw = (time: number) => {
      if (!cols || !rows) return;
      const p = readProgress();
      const gather = clamp01((p - 0.18) / 0.5);
      const unify = clamp01((p - 0.64) * 4);
      const t = time / 1000;

      chars.fill(" ");
      colors.fill("");
      depth.fill(-Infinity);

      const offsetX = (width - cols * CELL_W) / 2;
      const offsetY = (height - rows * CELL_H) / 2;
      const sunRadius =
        Math.min(width, height) * 0.15 * (1 + Math.sin(t * 1.4) * 0.015);
      const light = [Math.cos(t * 0.35) * 0.62, -0.48, 0.62];
      const lightLength = Math.hypot(light[0], light[1], light[2]);
      const spin = t * 0.3;

      // Sun and corona.
      for (let j = 0; j < rows; j += 1) {
        const py = offsetY + (j + 0.5) * CELL_H - height / 2;
        for (let i = 0; i < cols; i += 1) {
          const px = offsetX + (i + 0.5) * CELL_W - width / 2;
          const distance = Math.hypot(px, py);
          const cell = j * cols + i;
          if (distance < sunRadius) {
            const nx = px / sunRadius;
            const ny = py / sunRadius;
            const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
            const lambert = Math.max(
              0,
              (nx * light[0] + ny * light[1] + nz * light[2]) / lightLength,
            );
            // Surface "granulation" that rotates with the sun.
            const u = nx * Math.cos(spin) + nz * Math.sin(spin);
            const granulation =
              0.5 +
              0.5 * Math.sin(u * 9 + t * 0.8) * Math.sin(ny * 8 - t * 0.6);
            const brightness = clamp01(
              0.3 + lambert * 0.58 + granulation * 0.2,
            );
            chars[cell] =
              RAMP[Math.round(brightness * (RAMP.length - 1))] || ".";
            colors[cell] =
              SUN_COLORS[Math.round(brightness * (SUN_COLORS.length - 1))];
            depth[cell] = nz * sunRadius;
          } else if (distance < sunRadius * 2.3) {
            const angle = Math.atan2(py, px);
            const falloff = 1 - (distance - sunRadius) / (sunRadius * 1.3);
            const flicker =
              0.55 + 0.45 * Math.sin(angle * 7 + t * 2.2 + distance * 0.05);
            const glow = falloff * falloff * flicker * (0.75 + unify * 0.25);
            if (glow > 0.07) {
              chars[cell] = " .,:;"[Math.min(4, Math.ceil(glow * 5))];
              colors[cell] =
                `rgba(197,111,77,${(0.25 + glow * 0.6).toFixed(2)})`;
              depth[cell] = -sunRadius * 3;
            }
          }
        }
      }

      const sharedInclination = 1.2;
      const sharedNode = -0.28;
      const focal = Math.min(width, height) * 1.6;

      const place = (
        x: number,
        y: number,
        z: number,
        char: string,
        color: string,
      ) => {
        const scale = focal / (focal - z);
        const sx = x * scale;
        const sy = y * scale;
        // Hidden behind the sun.
        if (z < 0 && Math.hypot(sx, sy) < sunRadius) return scale;
        const i = Math.floor((sx + width / 2 - offsetX) / CELL_W);
        const j = Math.floor((sy + height / 2 - offsetY) / CELL_H);
        if (i < 0 || j < 0 || i >= cols || j >= rows) return scale;
        const cell = j * cols + i;
        if (z < depth[cell]) return scale;
        chars[cell] = char;
        colors[cell] = color;
        depth[cell] = z;
        return scale;
      };

      const orbitPoint = (
        radius: number,
        theta: number,
        inclination: number,
        node: number,
      ) => {
        const ox = radius * Math.cos(theta);
        const oy = radius * Math.sin(theta) * Math.sin(inclination);
        const oz = radius * Math.sin(theta) * Math.cos(inclination);
        return [
          ox * Math.cos(node) - oy * Math.sin(node),
          ox * Math.sin(node) + oy * Math.cos(node),
          oz,
        ] as const;
      };

      // Dotted orbit rings once everything shares one plane.
      if (unify > 0.02) {
        for (const band of [1.75, 2.3, 2.85]) {
          for (let k = 0; k < 140; k += 1) {
            const [x, y, z] = orbitPoint(
              band * sunRadius,
              (k / 140) * Math.PI * 2,
              sharedInclination,
              sharedNode,
            );
            place(
              x,
              y,
              z - 2,
              "·",
              `rgba(242,238,229,${(0.22 * unify).toFixed(2)})`,
            );
          }
        }
      }

      // Stars appear one by one, then settle into the shared plane.
      stars.forEach((star, index) => {
        const born = clamp01((gather * STAR_COUNT - index) / 3);
        if (born <= 0) return;
        const radius = lerp(star.radius, star.ringRadius, unify) * sunRadius;
        const inclination = lerp(star.inclination, sharedInclination, unify);
        const node = lerp(star.node, sharedNode, unify);
        const theta = star.phase + t * star.speed;
        const [x, y, z] = orbitPoint(radius, theta, inclination, node);
        const near = clamp01((z / radius + 1) / 2);
        const char = near > 0.7 ? "*" : near > 0.35 ? "+" : "·";
        const accent = index % 9 === 0;
        const alpha = (born * (0.45 + near * 0.55)).toFixed(2);
        place(
          x,
          y,
          z,
          char,
          accent ? `rgba(246,199,143,${alpha})` : `rgba(242,238,229,${alpha})`,
        );
      });

      // Draw grouped by colour to keep state changes low.
      context.clearRect(0, 0, width, height);
      context.font = `${CELL_H - 1}px ui-monospace, "Geist Mono", monospace`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      const groups = new Map<string, number[]>();
      for (let cell = 0; cell < chars.length; cell += 1) {
        if (chars[cell] === " " || !colors[cell]) continue;
        const list = groups.get(colors[cell]);
        if (list) list.push(cell);
        else groups.set(colors[cell], [cell]);
      }
      groups.forEach((cells, color) => {
        context.fillStyle = color;
        for (const cell of cells) {
          const i = cell % cols;
          const j = (cell - i) / cols;
          context.fillText(
            chars[cell],
            offsetX + (i + 0.5) * CELL_W,
            offsetY + (j + 0.5) * CELL_H,
          );
        }
      });
    };

    resize();
    const observer = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    observer.observe(canvas);

    let frame = 0;
    let running = false;
    const loop = (now: number) => {
      draw(now);
      frame = requestAnimationFrame(loop);
    };
    const onScroll = () => draw(0);

    const visibility = new IntersectionObserver(([entry]) => {
      if (reduceMotion) {
        if (entry.isIntersecting) {
          draw(0);
          window.addEventListener("scroll", onScroll, { passive: true });
        } else {
          window.removeEventListener("scroll", onScroll);
        }
        return;
      }
      if (entry.isIntersecting && !running) {
        running = true;
        frame = requestAnimationFrame(loop);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(frame);
      }
    });
    visibility.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className={styles.teamCard} aria-hidden="true">
      <div className={styles.teamPhases}>
        <span data-phase="1">01 · 个人主导</span>
        <span data-phase="2">02 · 按需协作</span>
        <span data-phase="3">03 · 统一交付</span>
      </div>
      <canvas ref={canvasRef} className={styles.teamCanvas} />
      <span className={styles.teamDeliveryTag}>统一交付 ✓</span>
      <div className={styles.teamLegend}>
        <span>
          <i data-kind="sun" />
          负责人 · 梁熙坤
        </span>
        <span>
          <i data-kind="star" />
          按需加入的专业协作者
        </span>
      </div>
    </div>
  );
}
