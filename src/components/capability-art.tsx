import type { CSSProperties } from "react";
import styles from "./about-section.module.css";

const delay = (d: number) => ({ "--d": d }) as CSSProperties;

/** Code editor typing itself out, with a performance ring that fills. */
function EngineeringArt() {
  const lines = [
    { x: 24, w: 118, accent: true },
    { x: 40, w: 86 },
    { x: 40, w: 140 },
    { x: 56, w: 64, accent: true },
    { x: 24, w: 96 },
  ];
  return (
    <svg className={styles.art} viewBox="0 0 320 160" aria-hidden="true">
      <rect
        className={styles.artFrame}
        x="6"
        y="8"
        width="214"
        height="144"
        rx="12"
      />
      <line className={styles.artRule} x1="6" x2="220" y1="38" y2="38" />
      {[22, 34, 46].map((cx) => (
        <circle key={cx} className={styles.artDot} cx={cx} cy="23" r="3.5" />
      ))}
      {lines.map((line, index) => (
        <rect
          key={index}
          className={line.accent ? styles.codeLineAccent : styles.codeLine}
          style={delay(index)}
          x={line.x}
          y={54 + index * 17}
          width={line.w}
          height="7"
          rx="3.5"
        />
      ))}
      <rect className={styles.cursor} x="126" y="121" width="2.5" height="12" />

      <circle className={styles.ringTrack} cx="272" cy="58" r="30" />
      <circle
        className={styles.ringFill}
        cx="272"
        cy="58"
        r="30"
        pathLength="1"
      />
      <path className={styles.ringCheck} d="M259 58l9 9 16-18" pathLength="1" />
      {[0, 1, 2, 3].map((index) => (
        <rect
          key={index}
          className={styles.meter}
          style={delay(index)}
          x={246 + index * 15}
          y="108"
          width="9"
          height="40"
          rx="2"
        />
      ))}
    </svg>
  );
}

/** Pen tool drawing a Bézier curve, then colour swatches popping in. */
function DesignArt() {
  const curve = "M18 132 C 78 18, 150 18, 196 88 S 286 150, 302 46";
  return (
    <svg className={styles.art} viewBox="0 0 320 160" aria-hidden="true">
      {[40, 80, 120].map((y) => (
        <line
          key={y}
          className={styles.artGuide}
          x1="0"
          x2="320"
          y1={y}
          y2={y}
        />
      ))}
      {[80, 160, 240].map((x) => (
        <line
          key={x}
          className={styles.artGuide}
          x1={x}
          x2={x}
          y1="0"
          y2="160"
        />
      ))}
      <line className={styles.handle} x1="18" y1="132" x2="78" y2="18" />
      <line className={styles.handle} x1="150" y1="18" x2="242" y2="158" />
      <path className={styles.curve} d={curve} pathLength="1" />
      <circle className={styles.handleKnob} cx="78" cy="18" r="4" />
      <circle className={styles.handleKnob} cx="150" cy="18" r="4" />
      <rect className={styles.anchor} x="13" y="127" width="10" height="10" />
      <rect
        className={styles.anchorActive}
        x="191"
        y="83"
        width="10"
        height="10"
      />
      <rect className={styles.anchor} x="297" y="41" width="10" height="10" />
      {["#c56f4d", "#526c81", "#e2b29d", "#746b8d"].map((fill, index) => (
        <circle
          key={fill}
          className={styles.swatch}
          style={{ ...delay(index), fill }}
          cx={226 + index * 22}
          cy="20"
          r="8"
        />
      ))}
    </svg>
  );
}

/** A packet travelling a UI → API → DATA → LIVE pipeline. */
function DeliveryArt() {
  const nodes = ["UI", "API", "DATA", "LIVE"];
  const xs = [30, 117, 203, 290];
  return (
    <svg className={styles.art} viewBox="0 0 320 160" aria-hidden="true">
      <line className={styles.track} x1="30" x2="290" y1="72" y2="72" />
      <line
        className={styles.flow}
        x1="30"
        x2="290"
        y1="72"
        y2="72"
        pathLength="1"
      />
      {nodes.map((label, index) => (
        <g key={label}>
          <circle
            className={styles.node}
            style={delay(index)}
            cx={xs[index]}
            cy="72"
            r="15"
          />
          <text className={styles.nodeLabel} x={xs[index]} y="116">
            {label}
          </text>
        </g>
      ))}
      <circle className={styles.packet} cx="30" cy="72" r="5" />
      <path className={styles.liveCheck} d="M283 72l5 5 9-10" pathLength="1" />
      <text className={styles.deployTag} x="290" y="34">
        DEPLOYED
      </text>
    </svg>
  );
}

export function CapabilityArt({ index }: { index: string }) {
  if (index === "01") return <EngineeringArt />;
  if (index === "02") return <DesignArt />;
  return <DeliveryArt />;
}
