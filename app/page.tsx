"use client";

import { useMemo, useState } from "react";

import Heatmap from "@/components/dashboard/Heatmap";
import KpiCard from "@/components/dashboard/KpiCard";
import PeriodFilter from "@/components/dashboard/PeriodFilter";
import SimpleBarChart from "@/components/dashboard/SimpleBarChart";
import type { PeriodOption } from "@/lib/design/tokens";
import { getDashboardData } from "@/lib/mock/lastfm";

export default function Home() {
  const [period, setPeriod] = useState<PeriodOption>("30d");
  const data = useMemo(() => getDashboardData(period), [period]);

  return (
    <div className="items-center justify-items-center min-h-screen pb-20 gap-16">
      <div className="w-full flex flex-col gap-8 row-start-2 items-center">

        <section className="my-6">
          <PeriodFilter value={period} onChange={setPeriod} />
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 w-full" aria-label="KPI 카드">
          {data.metrics.map((metric) => (
            <KpiCard
              key={metric.id}
              label={metric.label}
              value={metric.value}
              unit={metric.unit}
              delta={metric.delta}
            />
          ))}
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 w-full">
          <SimpleBarChart title="Top Artists" items={data.artists} />
          <SimpleBarChart title="Top Tracks" items={data.tracks} />
          <SimpleBarChart title="요일별 패턴" items={data.weekdayPattern} />
          <Heatmap title="시간대 히트맵" values={data.hourlyHeatmap} />
        </section>
      </div>
    </div>
  );
}
