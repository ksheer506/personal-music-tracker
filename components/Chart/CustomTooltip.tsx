"use client";
import { CustomTooltipProps } from "@components/Chart/SimpleBarChart";
import { formatNumber } from "@lib/number";

export function CustomTooltip({ active, payload, unitLabel = "회" }: CustomTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }
  const firstItem = payload[0];
  const itemLabel = (firstItem?.payload?.label as string) ?? "";
  const rawValue = firstItem?.value;
  const normalizedValue = Array.isArray(rawValue)
    ? rawValue[0]
    : (rawValue ?? 0);

  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
      <span className="font-medium text-slate-800">{itemLabel}</span>
      <span className="text-slate-600">{formatNumber(normalizedValue)}{unitLabel}</span>
    </div>
  );
}
