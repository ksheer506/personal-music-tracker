"use client";

import { useCallback, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  MouseHandlerDataParam,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DrillLevel, ListenHistoryPoint } from "@/lib/mock/lastfm";
import HoverCard from "@components/Card/Card";
import { CustomTooltip } from "@components/Chart/CustomTooltip";
import CollapseSection from "@components/CollapseSection";
import { MOTION_TOKENS } from "@lib/design/tokens";
import { useMediaQuery } from "@hooks/useMediaQuery";

type BreadcrumbItem = {
  label: string;
  level: DrillLevel;
  year?: number;
  month?: number;
};

type Props = {
  trackId: string;
  getData: (
    trackId: string,
    level: DrillLevel,
    year?: number,
    month?: number,
  ) => ListenHistoryPoint[];
};

const X_AXIS_HIDE_MAX_WIDTH = 640;

export default function DrillDownBarChart({ trackId, getData }: Props) {
  const hideXAxisLabel = useMediaQuery(`(max-width: ${X_AXIS_HIDE_MAX_WIDTH}px)`);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { label: "연도별", level: "year" },
  ]);

  const current = breadcrumbs[breadcrumbs.length - 1];
  const data = getData(trackId, current.level, current.year, current.month);

  const handleClickBarItem = (state: MouseHandlerDataParam) => {
    if (!hasDrill) return;
    const idx = Number(state?.activeTooltipIndex);
    const point = data[idx] ?? null;

    if (!point || !point.drillKey) return;
    if (current.level === "year") {
      const year = Number(point.drillKey);
      setBreadcrumbs((prev) => [
        ...prev,
        { label: `${year}년`, level: "month", year },
      ]);
    } else if (current.level === "month" && current.year != null) {
      const month = Number(point.drillKey.split("-")[1]);
      setBreadcrumbs((prev) => [
        ...prev,
        {
          label: `${current.year}년 ${month}월`,
          level: "day",
          year: current.year,
          month,
        },
      ]);
    }
  };

  const navigateTo = useCallback((index: number) => {
    setBreadcrumbs((prev) => prev.slice(0, index + 1));
  }, []);

  const hasDrill = current.level !== "day";

  return (
    <HoverCard>
      <div className="mb-3 flex items-center gap-1 text-sm">
        {breadcrumbs.map((crumb, i) => {
          const isLast = i === breadcrumbs.length - 1;
          return (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span className="text-slate-400">/</span>}
              {isLast ? (
                <span className="font-semibold text-slate-800">
                  {crumb.label}
                </span>
              ) : (
                <button
                  onClick={() => navigateTo(i)}
                  className="text-indigo-500 hover:underline"
                >
                  {crumb.label}
                </button>
              )}
            </span>
          );
        })}
      </div>

      <div className="h-[240px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: -2, bottom: 4 }}
            onClick={handleClickBarItem}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#cbd5e1"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              hide={hideXAxisLabel}
              tick={{ fill: "#64748b", fontSize: 12 }}
              interval={data.length > 15 ? Math.floor(data.length / 8) : 0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={32}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(99, 102, 241, 0.08)" }}
              content={(props) => <CustomTooltip {...props} />}
            />
            <Bar
              dataKey="value"
              radius={[10, 10, 0, 0]}
              animationDuration={MOTION_TOKENS.chartAnimationMs}
              animationEasing="ease-in-out"
            >
              {data.map((point) => (
                <Cell
                  key={point.label}
                  fill="#7a7cdb"
                  cursor={hasDrill && point.drillKey ? "pointer" : "default"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </HoverCard>
  );
}
