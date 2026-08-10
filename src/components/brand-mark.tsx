import styles from "./brand-mark.module.css";

type BrandAssetProps = {
  className?: string;
  title?: string;
};

export function BrandMark({ className = "", title }: BrandAssetProps) {
  const labelled = Boolean(title);

  return (
    <svg
      className={`${styles.mark} ${className}`}
      viewBox="0 0 148.71 123.47"
      role={labelled ? "img" : undefined}
      aria-label={title}
      aria-hidden={labelled ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <g fill="currentColor">
        <polygon
          data-logo-mark-part="node"
          points="26.94 83.66 26.92 83.66 26.94 83.67 26.94 83.66"
        />
        <polygon
          data-logo-mark-part="stem"
          points="15.27 95.31 26.92 83.66 11.8 83.66 11.8 0 0 0 0 95.31 11.8 95.31 15.27 95.31"
        />
        <polygon
          data-logo-mark-part="cross"
          points="148.71 121.81 112.68 82.93 144.83 48.59 129.08 48.59 104.4 73.99 85.27 53.36 125.45 10.97 107.93 10.97 76.6 44 44.17 9.01 26.65 9.01 26.62 9.05 67.7 53.38 1.22 123.47 18.81 123.47 76.38 62.74 95.4 83.26 82.76 96.26 82.76 101.66 82.76 122.81 95.15 122.81 95.15 101.66 103.85 92.37 131.13 121.81 148.71 121.81"
        />
      </g>
    </svg>
  );
}

export function BrandWordmark({ className = "", title }: BrandAssetProps) {
  const labelled = Boolean(title);

  return (
    <svg
      className={`${styles.wordmark} ${className}`}
      viewBox="0 0 502 144.64"
      role={labelled ? "img" : undefined}
      aria-label={title}
      aria-hidden={labelled ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <g fill="currentColor">
        <g data-logo-word-part="one">
          <polygon points="80.7 60.42 92.3 60.29 94.39 10.67 112.59 10.67 112.59 68.5 72.31 68.5 72.31 77.5 123.8 77.5 123.8 .04 41.48 .04 41.48 10.67 82.8 10.67 80.7 60.42" />
          <polygon points="64.64 38.84 64.63 38.83 64.64 38.83 69.11 18.87 57.3 18.93 53.68 35.1 34.05 78.04 46.31 78.04 64.64 38.84" />
          <polygon points="43.83 34.57 53.37 19.42 46 19.42 43.83 22.65 43.83 34.57" />
          <rect x="2.8" y=".04" width="25.55" height="10.58" />
          <polygon points="2.29 77.54 13.54 77.55 31.73 36.57 28.35 36.53 28.35 32.86 28.35 22.28 2.8 22.28 2.8 32.86 21.01 32.86 21.01 36.54 2.29 77.54" />
          <rect x="130.52" y="18.87" width="11.21" height="41.77" />
          <polygon points="141.74 92.31 77.21 92.31 77.21 82.97 65.8 82.97 65.8 92.31 1.38 92.31 1.38 101.85 65.8 101.85 65.8 144.64 77.21 144.64 77.21 101.85 141.74 101.85 141.74 92.31" />
          <polygon points="0 144.64 13.29 144.64 42.49 106.57 29.2 106.57 0 144.64" />
          <polygon points="100.55 106.57 129.75 144.64 143.04 144.64 113.84 106.57 100.55 106.57" />
        </g>
        <g data-logo-word-part="two">
          <path d="M181.33,96.13h73.77v-10.23h-23.9v-15.16h20.16V26.31h-20.16V9.28h23.9V0h-73.77v96.13ZM240.35,36.53v24.59h-27.93v-24.59h27.93ZM192.54,9.28h27.64v17.03h-18.98v44.43h18.98v15.16h-27.64V9.28Z" />
          <rect x="309.98" y="66.77" width="9.52" height="9.52" />
          <path d="M323.7,95.74v-9.84h-47.2v-33.15h42.98V0h-54.1v95.74h58.31ZM276.56,9.28h31.87v33.21h-31.87V9.28Z" />
          <polygon points="180.65 142.75 193.95 142.75 206.84 109.97 193.54 109.97 180.65 142.75" />
          <rect x="229.13" y="109.97" width="11.21" height="32.79" />
          <rect x="270.04" y="109.97" width="11.21" height="32.79" />
          <polygon points="302.98 109.97 312 142.75 325.3 142.75 316.28 109.97 302.98 109.97" />
        </g>
        <g data-logo-word-part="three">
          <polygon points="361.43 141.53 361.55 141.49 361.42 141.49 361.43 141.53" />
          <path d="M462.19,17.36V0h-10.42v17.36h-40.35v100.03h40.35v25.7h10.42v-25.7h39.81V17.36h-39.81ZM451.77,107.46h-28.7v-39.16h28.7v39.16ZM451.77,59.36h-28.7V26.31h28.7v33.05ZM490.89,107.46h-28.7v-39.16h28.7v39.16ZM490.89,59.36h-28.7V26.31h28.7v33.05Z" />
          <polygon points="388.23 27.02 402.68 27.02 402.68 17.36 388.23 17.36 388.23 0 377.45 0 377.45 17.36 361.96 17.36 361.96 27.02 377.45 27.02 377.45 123.7 361.55 129.92 361.55 141.49 402.77 125.36 402.77 113.79 388.23 119.48 388.23 27.02" />
        </g>
      </g>
    </svg>
  );
}
