import { BrandMark } from "./brand-mark";
import styles from "./hero-bridge.module.css";

const transitionPhrases = [
  "FORM",
  "BUILD",
  "CLARITY",
  "DELIVERY",
] as const;

export function HeroTransition() {
  return (
    <div className={styles.transition} aria-hidden="true">
      <div className={styles.revealTrigger} data-reveal="soft" />

      <div
        className={styles.orbit}
        data-scroll-shift="0.75"
        aria-hidden="true"
      />

      <div className={styles.bridgeMeta}>
        <span>Design gives form</span>
        <strong>形构 / One direction · Two disciplines</strong>
        <span>Engineering makes it work</span>
      </div>

      <div className={styles.marquee}>
        <div className={styles.track}>
          {[...transitionPhrases, ...transitionPhrases].map((phrase, index) => (
            <span key={`${phrase}-${index}`}>
              {phrase}
              <i>✦</i>
            </span>
          ))}
        </div>
      </div>

      <div className={styles.sheet}>
        <div className={styles.cue}>
          <span className={styles.cueMark}>
            <BrandMark />
          </span>
          <p>From form to function</p>
        </div>
      </div>
    </div>
  );
}
