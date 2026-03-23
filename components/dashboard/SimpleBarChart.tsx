"use client";

import HoverCard from "@components/Card/HoverCard";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type BarItem = {
  id: string;
  label: string;
  value: number;
};

type SimpleBarChartProps = {
  title: string;
  items: BarItem[];
  highlightedId?: string | null;
  onHighlightChange?: (id: string | null) => void;
};

export default function SimpleBarChart({
  title,
  items,
  highlightedId = null,
  onHighlightChange,
}: SimpleBarChartProps) {
  return (
    <HoverCard>
      <h3 className="mb-3 text-base font-medium">{title}</h3>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={items}
            margin={{
              top: 8,
              right: 8,
              left: -12,
              bottom: 4,
            }}
            onMouseMove={(state) => {
              const hoveredIndex = state?.activeTooltipIndex;
              if (typeof hoveredIndex === "number") {
                onHighlightChange?.(items[hoveredIndex]?.id ?? null);
                return;
              }
              onHighlightChange?.(null);
            }}
            onMouseLeave={() => onHighlightChange?.(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              interval={0}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={32}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(99, 102, 241, 0.08)" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #cbd5e1",
                background: "#ffffff",
              }}
              formatter={(value) => {
                const normalized = Array.isArray(value) ? value[0] : value;
                return [`${normalized ?? 0}회`, "재생수"];
              }}
            />
            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
              {items.map((item) => {
                const isDimmed = Boolean(highlightedId) && highlightedId !== item.id;
                return (
                  <Cell
                    key={item.id}
                    fill="#6366f1"
                    fillOpacity={isDimmed ? 0.45 : 1}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </HoverCard>
  );
}
