"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MOTION_TOKENS } from "@lib/design/tokens";

type Props = {
  visible: boolean;
  durationMs?: number;
  children: React.ReactNode;
};

export default function CollapseSection({
  visible,
  durationMs = MOTION_TOKENS.slideMs,
  children,
}: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">(visible ? "auto" : 0);
  const firstRender = useRef(true);

  const measure = useCallback(() => {
    return contentRef.current?.scrollHeight ?? 0;
  }, []);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      setHeight(visible ? "auto" : 0);
      return;
    }

    if (visible) {
      setHeight(measure());
      const id = setTimeout(() => setHeight("auto"), durationMs);
      return () => clearTimeout(id);
    }

    setHeight(measure());
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setHeight(0);
      });
    });
  }, [visible, durationMs, measure]);

  return (
    <div
      style={{
        height: typeof height === "number" ? `${height}px` : "auto",
        transitionProperty: "height, opacity",
        transitionDuration: `${durationMs}ms`,
        transitionTimingFunction: MOTION_TOKENS.easeStandard,
        overflow: "hidden",
        opacity: visible ? 1 : 0,
      }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
