"use client";

import { useEffect, useState } from "react";

type UseAnimatedMotionOptions = {
  duration: number;
};

export function useAnimatedMotion(targetValue: number, options: UseAnimatedMotionOptions) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setAnimatedValue(targetValue);
      return undefined;
    }

    const startedAt = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / options.duration);
      const eased = 1 - ((1 - progress) ** 3);
      setAnimatedValue(Math.round(targetValue * eased));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [options.duration, targetValue]);

  return animatedValue;
}
