import type { CSSProperties } from "react";
import styles from "./about-section.module.css";

const center = { x: 200, y: 186 };
const modules = [
  { label: "视觉", x: 86, y: 78 },
  { label: "前端", x: 314, y: 78 },
  { label: "后端", x: 86, y: 294 },
  { label: "部署", x: 314, y: 294 },
];

const phases = ["01 · 个人主导", "02 · 按需协作", "03 · 统一交付"];

/**
 * Scroll-driven diagram (reads --p from the process block): one lead,
 * specialists joining on demand, then everything closing into one delivery.
 */
export function TeamDiagram() {
  return (
    <div className={styles.teamCard} aria-hidden="true">
      <div className={styles.teamPhases}>
        {phases.map((phase, index) => (
          <span key={phase} data-phase={index + 1}>
            {phase}
          </span>
        ))}
      </div>

      <svg className={styles.teamSvg} viewBox="0 0 400 400">
        <circle
          className={styles.teamUnify}
          cx={center.x}
          cy={center.y}
          r="168"
          pathLength="1"
        />

        {modules.map((module, index) => (
          <line
            key={`link-${module.label}`}
            className={styles.teamLink}
            style={{ "--k": index } as CSSProperties}
            x1={center.x}
            y1={center.y}
            x2={module.x}
            y2={module.y}
            pathLength="1"
          />
        ))}

        {modules.map((module, index) => (
          <g
            key={module.label}
            className={styles.teamModule}
            style={{ "--k": index } as CSSProperties}
          >
            <circle cx={module.x} cy={module.y} r="27" />
            <text x={module.x} y={module.y + 5}>
              {module.label}
            </text>
          </g>
        ))}

        <circle
          className={styles.teamPulse}
          cx={center.x}
          cy={center.y}
          r="50"
        />
        <circle
          className={styles.teamLead}
          cx={center.x}
          cy={center.y}
          r="50"
        />
        <text className={styles.teamLeadRole} x={center.x} y={center.y - 12}>
          LEAD
        </text>
        <text className={styles.teamLeadName} x={center.x} y={center.y + 16}>
          梁熙坤
        </text>

        <g className={styles.teamDelivery}>
          <rect x="128" y="356" width="144" height="36" rx="18" />
          <text x="200" y="379">
            统一交付 ✓
          </text>
        </g>
      </svg>
    </div>
  );
}
