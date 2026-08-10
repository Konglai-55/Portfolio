"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./about-section.module.css";

export function CaseStudyDevice() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {
            setIsPlaying(false);
          });
          return;
        }

        video.pause();
      },
      { rootMargin: "12% 0px", threshold: 0.24 },
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  return (
    <div className={styles.deviceShell}>
      <div className={styles.deviceScreen}>
        <video
          ref={videoRef}
          className={styles.caseVideo}
          loop
          muted
          playsInline
          preload="none"
          poster="/images/low-altitude-economy-poster.jpg"
          aria-label="低空经济企业官网案例动态演示"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source
            src="/videos/low-altitude-economy-case.mp4"
            type="video/mp4"
          />
        </video>
        <span className={styles.screenGlass} aria-hidden="true" />
        <span className={styles.playState} aria-hidden="true">
          <i className={isPlaying ? styles.playStateLive : undefined} />
          {isPlaying ? "LIVE CASE" : "CASE PREVIEW"}
        </span>
      </div>
      <Image
        className={styles.deviceFrame}
        src="/images/case-study-laptop.png"
        alt=""
        fill
        sizes="(max-width: 680px) 100vw, (max-width: 1100px) 92vw, 1280px"
        priority={false}
      />
    </div>
  );
}
