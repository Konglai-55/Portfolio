"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

type RevealKind = "title" | "card" | "soft" | "left" | "right" | "default";

function getRevealKind(target: HTMLElement): RevealKind {
  const kind = target.dataset.reveal;
  if (
    kind === "title" ||
    kind === "card" ||
    kind === "soft" ||
    kind === "left" ||
    kind === "right"
  ) {
    return kind;
  }
  return "default";
}

function getRevealState(kind: RevealKind) {
  switch (kind) {
    case "title":
      return {
        from: {
          opacity: 1,
          clipPath: "inset(100% 0% 0% 0%)",
          y: "1.25rem",
        },
        to: {
          opacity: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          y: 0,
        },
        duration: 0.98,
        ease: "power3.out",
      };
    case "card":
      return {
        from: {
          opacity: 0,
          y: "3.5rem",
          rotationX: -24,
          transformPerspective: 1000,
          transformOrigin: "50% 0%",
        },
        to: { opacity: 1, y: 0, rotationX: 0 },
        duration: 1.1,
        ease: "expo.out",
      };
    case "left":
      return {
        from: { opacity: 0, x: "-1.6rem", y: 0, scale: 0.985 },
        to: { opacity: 1, x: 0, y: 0, scale: 1 },
        duration: 0.9,
        ease: "power3.out",
      };
    case "right":
      return {
        from: { opacity: 0, x: "1.6rem", y: 0, scale: 0.985 },
        to: { opacity: 1, x: 0, y: 0, scale: 1 },
        duration: 0.9,
        ease: "power3.out",
      };
    case "soft":
      return {
        from: { opacity: 0, y: "0.9rem", scale: 0.99 },
        to: { opacity: 1, y: 0, scale: 1 },
        duration: 0.72,
        ease: "power3.out",
      };
    default:
      return {
        from: { opacity: 0, y: "1.6rem", scale: 0.985 },
        to: { opacity: 1, y: 0, scale: 1 },
        duration: 0.85,
        ease: "power3.out",
      };
  }
}

export function EntranceEffects() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const scrollTargets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scroll-shift]"),
    );
    const countTargets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-count-to]"),
    );
    const triggers: ScrollTrigger[] = [];
    const revealTweens: gsap.core.Tween[] = [];
    const countTweens: gsap.core.Tween[] = [];
    const splitInstances: SplitText[] = [];
    const numberFormatter = new Intl.NumberFormat("zh-CN", {
      maximumFractionDigits: 0,
    });

    root.classList.add("has-reveal-js");

    function createRevealTrigger(target: HTMLElement, tween: gsap.core.Tween) {
      // Reveal once: replaying on every pass makes content flicker in and
      // out while visitors scroll back to re-read something.
      const trigger = ScrollTrigger.create({
        trigger: target,
        start: "top 88%",
        once: true,
        onEnter: () => {
          target.classList.add("is-revealed");
          tween.play();
        },
      });
      triggers.push(trigger);
    }

    revealTargets.forEach((target) => {
      const kind = getRevealKind(target);
      const state = getRevealState(kind);
      const delay = Number(target.dataset.revealDelay ?? 0) * 0.08;

      if (reduceMotion) {
        gsap.set(target, state.to);
        target.classList.add("is-revealed");
        return;
      }

      if (kind === "title") {
        const split = SplitText.create(target, {
          type: "lines",
          mask: "lines",
          aria: "auto",
        });
        splitInstances.push(split);
        gsap.set(target, {
          opacity: 1,
          clipPath: "none",
          x: 0,
          y: 0,
          scale: 1,
        });
        gsap.set(split.lines, {
          yPercent: 118,
          rotation: 3.5,
          transformOrigin: "0% 100%",
        });
        const tween = gsap.to(split.lines, {
          yPercent: 0,
          rotation: 0,
          duration: 1.2,
          stagger: 0.09,
          ease: "expo.out",
          delay,
          paused: true,
          overwrite: "auto",
        });
        revealTweens.push(tween);
        createRevealTrigger(target, tween);
        return;
      }

      gsap.set(target, state.from);
      const tween = gsap.to(target, {
        ...state.to,
        duration: state.duration,
        ease: state.ease,
        delay,
        paused: true,
        overwrite: "auto",
      });
      revealTweens.push(tween);
      createRevealTrigger(target, tween);
    });

    if (!reduceMotion) {
      countTargets.forEach((target) => {
        const startValue = Number(target.dataset.countFrom ?? 0);
        const targetValue = Number(target.dataset.countTo ?? 0);
        const prefix = target.dataset.countPrefix ?? "";
        const suffix = target.dataset.countSuffix ?? "";
        const duration = Number(target.dataset.countDuration ?? 1.2);
        const state = { value: startValue };

        const render = () => {
          target.textContent = `${prefix}${numberFormatter.format(
            Math.round(state.value),
          )}${suffix}`;
        };
        const tween = gsap.to(state, {
          value: targetValue,
          duration,
          ease: "power2.out",
          paused: true,
          onUpdate: render,
        });
        const trigger = ScrollTrigger.create({
          trigger: target,
          start: "top 90%",
          once: true,
          onEnter: () => tween.play(),
        });

        state.value = startValue;
        render();
        countTweens.push(tween);
        triggers.push(trigger);
      });
    }

    if (!reduceMotion) {
      scrollTargets.forEach((element) => {
        const strength = Number(element.dataset.scrollShift ?? 1);
        const state = { x: 0, y: 0, rotate: 0 };
        const update = () => {
          element.style.setProperty(
            "--scroll-shift-x",
            `${state.x.toFixed(2)}px`,
          );
          element.style.setProperty(
            "--scroll-shift-y",
            `${state.y.toFixed(2)}px`,
          );
          element.style.setProperty(
            "--scroll-shift-rotate",
            `${state.rotate.toFixed(3)}deg`,
          );
        };
        const setX = gsap.quickTo(state, "x", {
          duration: 0.75,
          ease: "power3.out",
          onUpdate: update,
        });
        const setY = gsap.quickTo(state, "y", {
          duration: 0.85,
          ease: "power3.out",
          onUpdate: update,
        });
        const setRotate = gsap.quickTo(state, "rotate", {
          duration: 0.9,
          ease: "power3.out",
          onUpdate: update,
        });

        const trigger = ScrollTrigger.create({
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const curve = self.progress * 2 - 1;
            const magnitude = Math.min(Math.abs(curve), 1);
            const eased = Math.sign(curve) * (1 - (1 - magnitude) ** 3);
            setX(Math.sin(eased * 1.45) * strength * -10);
            setY(eased * strength * -18);
            setRotate(Math.sin(eased * 1.1) * strength * -0.32);
          },
        });
        triggers.push(trigger);
      });
    }

    const cleanups: Array<() => void> = [];

    if (!reduceMotion) {
      // Editorial read-along: characters light up as the paragraph scrolls by.
      document
        .querySelectorAll<HTMLElement>("[data-scrub-text]")
        .forEach((target) => {
          const split = SplitText.create(target, {
            type: "chars",
            tag: "span",
            aria: "auto",
          });
          // Inline (not inline-block) chars keep CJK line-breaking rules,
          // so punctuation never starts a line.
          gsap.set(split.chars, { display: "inline" });
          splitInstances.push(split);
          const tween = gsap.fromTo(
            split.chars,
            { opacity: 0.16 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.02,
              scrollTrigger: {
                trigger: target,
                start: "top 82%",
                end: "bottom 48%",
                scrub: 0.6,
              },
            },
          );
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
          revealTweens.push(tween);
        });

      // Scroll-linked progress exposed as a CSS variable (0 → 1), for rails,
      // bars and anything else that should fill as the reader passes.
      document
        .querySelectorAll<HTMLElement>("[data-scrub-progress]")
        .forEach((target) => {
          target.style.setProperty("--progress", "0");
          triggers.push(
            ScrollTrigger.create({
              trigger: target,
              start: target.dataset.scrubStart || "top 78%",
              end: target.dataset.scrubEnd || "bottom 55%",
              scrub: 0.6,
              onUpdate: (self) =>
                target.style.setProperty(
                  "--progress",
                  self.progress.toFixed(4),
                ),
            }),
          );
        });

      // Hand-drawn strokes draw themselves in once.
      document
        .querySelectorAll<SVGPathElement>("[data-draw] path")
        .forEach((path) => {
          // pathLength normalises dashes, even with non-scaling strokes.
          path.setAttribute("pathLength", "1");
          gsap.set(path, { strokeDasharray: 1, strokeDashoffset: 1 });
          const tween = gsap.to(path, {
            strokeDashoffset: 0,
            duration: 1.8,
            ease: "power2.inOut",
            paused: true,
          });
          revealTweens.push(tween);
          triggers.push(
            ScrollTrigger.create({
              trigger: path.closest("[data-draw]") ?? path,
              start: "top 85%",
              once: true,
              onEnter: () => tween.play(),
            }),
          );
        });
    }

    // Magnetic controls lean towards the pointer, then spring back.
    if (
      !reduceMotion &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      document
        .querySelectorAll<HTMLElement>("[data-magnetic]")
        .forEach((element) => {
          const strength = Number(element.dataset.magnetic || 0.32);
          const moveX = gsap.quickTo(element, "x", {
            duration: 0.6,
            ease: "power3.out",
          });
          const moveY = gsap.quickTo(element, "y", {
            duration: 0.6,
            ease: "power3.out",
          });
          const handleMove = (event: PointerEvent) => {
            const bounds = element.getBoundingClientRect();
            moveX((event.clientX - bounds.left - bounds.width / 2) * strength);
            moveY((event.clientY - bounds.top - bounds.height / 2) * strength);
          };
          const handleLeave = () => {
            gsap.to(element, {
              x: 0,
              y: 0,
              duration: 0.9,
              ease: "elastic.out(1, 0.45)",
              overwrite: "auto",
            });
          };
          element.addEventListener("pointermove", handleMove);
          element.addEventListener("pointerleave", handleLeave);
          cleanups.push(() => {
            element.removeEventListener("pointermove", handleMove);
            element.removeEventListener("pointerleave", handleLeave);
            gsap.set(element, { clearProps: "transform" });
          });
        });
    }

    // Cards tilt in 3D under the pointer, with a soft light sheen.
    if (
      !reduceMotion &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((card) => {
        gsap.set(card, { transformPerspective: 900 });
        const rotateX = gsap.quickTo(card, "rotationX", {
          duration: 0.7,
          ease: "power3.out",
        });
        const rotateY = gsap.quickTo(card, "rotationY", {
          duration: 0.7,
          ease: "power3.out",
        });
        const handleMove = (event: PointerEvent) => {
          const bounds = card.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width;
          const y = (event.clientY - bounds.top) / bounds.height;
          rotateY((x - 0.5) * 10);
          rotateX((0.5 - y) * 8);
          card.style.setProperty("--sheen-x", `${x * 100}%`);
          card.style.setProperty("--sheen-y", `${y * 100}%`);
        };
        const handleLeave = () => {
          rotateX(0);
          rotateY(0);
        };
        card.addEventListener("pointermove", handleMove);
        card.addEventListener("pointerleave", handleLeave);
        cleanups.push(() => {
          card.removeEventListener("pointermove", handleMove);
          card.removeEventListener("pointerleave", handleLeave);
          gsap.set(card, { clearProps: "transform" });
        });
      });
    }

    ScrollTrigger.refresh();

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      triggers.forEach((trigger) => trigger.kill());
      revealTweens.forEach((tween) => tween.kill());
      countTweens.forEach((tween) => tween.kill());
      splitInstances.forEach((split) => split.revert());
      root.classList.remove("has-reveal-js");
    };
  }, []);

  return null;
}
