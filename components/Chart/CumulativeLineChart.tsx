"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import HoverCard from "@components/Card/Card";
import { CustomTooltip } from "@components/Chart/CustomTooltip";
import { MOTION_TOKENS } from "@lib/design/tokens";
import type { CumulativePoint } from "@/lib/mock/lastfm";
import { useMediaQuery } from "@hooks/useMediaQuery";

type Props = {
  defaultStart: Date;
  defaultEnd: Date;
  getData: (start: Date, end: Date) => CumulativePoint[];
};

function toInputValue(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const X_AXIS_HIDE_MAX_WIDTH = 640;

export default function CumulativeLineChart({
  defaultStart,
  defaultEnd,
  getData,
}: Props) {
  const hideXAxisLabel = useMediaQuery(`(max-width: ${X_AXIS_HIDE_MAX_WIDTH}px)`);
  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);

  const data = useMemo(() => getData(start, end), [getData, start, end]);

  return (
    <HoverCard>
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-1.5 text-gray-600">
          <span>시작</span>
          <input
            type="date"
            value={toInputValue(start)}
            max={toInputValue(end)}
            onChange={(e) => {
              const d = new Date(e.target.value);
              if (!isNaN(d.getTime())) setStart(d);
            }}
            className="rounded border border-slate-300 px-2 py-1 text-sm text-gray-800 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
          />
        </label>
        <label className="flex items-center gap-1.5 text-gray-600">
          <span>종료</span>
          <input
            type="date"
            value={toInputValue(end)}
            min={toInputValue(start)}
            onChange={(e) => {
              const d = new Date(e.target.value);
              if (!isNaN(d.getTime())) setEnd(d);
            }}
            className="rounded border border-slate-300 px-2 py-1 text-sm text-gray-800 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200"
          />
        </label>
      </div>

      <div className="h-[240px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 8, right: 8, left: 3, bottom: 3 }}
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
              tick={{ fill: "#64748b", fontSize: 11 }}
              interval={data.length > 20 ? Math.floor(data.length / 8) : 0}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={40}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ stroke: "rgba(99, 102, 241, 0.3)" }}
              content={(props) => (
                <CustomTooltip {...props} unitLabel="회 (누적)" />
              )}
            />
            <Line
              type="monotone"
              dataKey="cumulative"
              stroke="#7a7cdb"
              strokeWidth={2}
              dot={{ r: 0, fill: "#7a7cdb" }}
              activeDot={{ r: 5, fill: "#7a7cdb" }}
              animationDuration={MOTION_TOKENS.chartAnimationMs}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </HoverCard>
  );
}
