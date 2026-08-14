"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.085,
      wheelMultiplier: 0.88,
      touchMultiplier: 1,
      smoothWheel: true,
      anchors: { offset: -16 },
    });

    const root = document.documentElement;
    const syncScrollTrigger = () => {
      const scrollable = Math.max(root.scrollHeight - window.innerHeight, 1);
      root.style.setProperty(
        "--scroll-progress",
        String(Math.min(window.scrollY / scrollable, 1)),
      );
      ScrollTrigger.update();
    };
    const update = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", syncScrollTrigger);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    syncScrollTrigger();

    return () => {
      lenis.off("scroll", syncScrollTrigger);
      gsap.ticker.remove(update);
      lenis.destroy();
      root.style.removeProperty("--scroll-progress");
    };
  }, []);

  return null;
}
