"use client";

import { useEffect, useRef, useState } from "react";
import { MOTION_TOKENS } from "@lib/design/tokens";

type Props = {
  visible: boolean;
  durationMs?: number;
  children: React.ReactNode;
};

const Collapsible = ({
  visible,
  durationMs = MOTION_TOKENS.slideMs,
  children,
}: Props) => {
  const [height, setHeight] = useState<number | "auto">(visible ? "auto" : 0);
  const contentRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    const measure = () => contentRef.current?.scrollHeight ?? 0;

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
  }, [visible, durationMs]);

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

export default Collapsible;
