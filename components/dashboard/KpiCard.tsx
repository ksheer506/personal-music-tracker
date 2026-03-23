"use client";

import { MOTION_TOKENS } from "@/lib/design/tokens";
import { useAnimatedMotion } from "@/hooks/useAnimatedMotion";
import HoverCard from "@components/Card/HoverCard";

type KpiCardProps = {
  label: string;
  value: number;
  unit?: string;
  delta: number;
};

function formatNumber(value: number) {
  return Intl.NumberFormat("ko-KR").format(value);
}

export default function KpiCard({ label, value, unit, delta }: KpiCardProps) {
  const displayValue = useAnimatedMotion(value, { duration: MOTION_TOKENS.kpiCountDurationMs });

  return (
    <HoverCard>
      <h3 className="mb-3 text-base font-medium">{label}</h3>
      <p className="mt-2 text-[clamp(1.5rem,3vw,2.1rem)] font-bold tracking-tight">
        {formatNumber(displayValue)}
        {unit ? ` ${unit}` : ""}
      </p>
      <p className={`mt-2 text-sm ${delta >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
        {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}%
      </p>
    </HoverCard>
  );
}
