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
        from: { opacity: 0, y: "1rem", scale: 0.985 },
        to: { opacity: 1, y: 0, scale: 1 },
        duration: 0.78,
        ease: "power3.out",
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

    function createRevealTrigger(
      target: HTMLElement,
      tween: gsap.core.Tween,
    ) {
      const trigger = ScrollTrigger.create({
        trigger: target,
        start: "top 88%",
        end: "bottom 12%",
        onEnter: () => {
          target.classList.add("is-revealed");
          tween.restart();
        },
        onEnterBack: () => {
          target.classList.add("is-revealed");
          tween.restart();
        },
        onLeave: () => {
          target.classList.remove("is-revealed");
          tween.reverse();
        },
        onLeaveBack: () => {
          target.classList.remove("is-revealed");
          tween.reverse();
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
        gsap.set(split.lines, { yPercent: 112 });
        const tween = gsap.to(split.lines, {
          yPercent: 0,
          duration: 0.96,
          stagger: 0.08,
          ease: "power3.out",
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
        const replay = () => {
          state.value = startValue;
          render();
          tween.restart();
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
          end: "bottom 10%",
          onEnter: replay,
          onEnterBack: replay,
          onLeaveBack: () => {
            tween.pause(0);
            state.value = startValue;
            render();
          },
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

    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      revealTweens.forEach((tween) => tween.kill());
      countTweens.forEach((tween) => tween.kill());
      splitInstances.forEach((split) => split.revert());
      root.classList.remove("has-reveal-js");
    };
  }, []);

  return null;
}
