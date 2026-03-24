"use client";

import HoverCard from "@components/Card/HoverCard";
import { useMediaQuery } from "@hooks/useMediaQuery";
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

type CustomTooltipProps = {
  active?: boolean;
  payload?: ReadonlyArray<{
    value?: number | string | ReadonlyArray<number | string>;
    payload?: BarItem;
  }>;
};

const X_AXIS_HIDE_MAX_WIDTH = 640;

export default function SimpleBarChart({
  title,
  items,
  highlightedId = null,
  onHighlightChange,
}: SimpleBarChartProps) {
  const hideXAxisLabel = useMediaQuery(`(max-width: ${X_AXIS_HIDE_MAX_WIDTH}px)`);

  return (
    <HoverCard>
      <h3 className="mb-3 text-base font-medium">{title}</h3>
      <div className="h-[220px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 0, height: 220 }}>
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
              hide={hideXAxisLabel}
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
              content={(props) => <CustomTooltip {...props} />}
            />
            <Bar dataKey="value" radius={[10, 10, 0, 0]}>
              {items.map((item) => {
                const isDimmed = Boolean(highlightedId) && highlightedId !== item.id;
                return (
                  <Cell
                    key={item.id}
                    fill="#7a7cdb"
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

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }
  const firstItem = payload[0];
  const itemLabel = firstItem?.payload?.label ?? "";
  const rawValue = firstItem?.value;
  const normalizedValue = Array.isArray(rawValue) ? rawValue[0] : rawValue ?? 0;

  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
      <span className="font-medium text-slate-800">{itemLabel}</span>
      <span className="text-slate-600">{normalizedValue}회</span>
    </div>
  );
}