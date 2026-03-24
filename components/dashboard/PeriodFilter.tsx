"use client";

import type { PeriodOption } from "@/lib/design/tokens";
import { PERIOD_OPTIONS } from "@/lib/design/tokens";

type PeriodFilterProps = {
  value: PeriodOption;
  onChange: (period: PeriodOption) => void;
};

export default function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="기간 필터">
      {PERIOD_OPTIONS.map((p) => (
        <button
          key={p.value}
          type="button"
          className={`rounded-full border px-3 py-1.5 text-sm transition-colors duration-150 ease-out ${
            value === p.value
              ? "border-primary text-primary dark:bg-primary/60 dark:text-primary/30"
              : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200"
          }`}
          onClick={() => onChange(p.value)}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
