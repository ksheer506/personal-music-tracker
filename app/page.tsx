"use client";

import { useMemo, useState } from "react";

import Heatmap from "@/components/dashboard/Heatmap";
import KpiCard from "@/components/dashboard/KpiCard";
import PeriodFilter from "@/components/dashboard/PeriodFilter";
import SimpleBarChart from "@/components/dashboard/SimpleBarChart";
import type { PeriodOption } from "@/lib/design/tokens";
import { getDashboardData, getRecentPlays } from "@/lib/mock/lastfm";
import { formatRelativePlayedAt } from "@lib/date";

export default function Home() {
  const [period, setPeriod] = useState<PeriodOption>("30d");
  const data = useMemo(() => getDashboardData(period), [period]);
  const recentPlays = useMemo(() => getRecentPlays(10), []);

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

        <section className="w-full mt-6" aria-label="최근 기록된 음악">
          <div className="rounded-md border border-slate-200 bg-white">
            <div className="px-4 py-3 border-slate-200">
              <h2 className="text-base font-semibold">최근 기록된 음악</h2>
            </div>
            <ul className="divide-y divide-gray-100">
              {recentPlays.map((play) => (
                <li key={play.id} className="px-4 py-3 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{play.track}</p>
                    <p className="text-sm text-gray-600 truncate">{play.artist} · {play.album}</p>
                  </div>
                  <p className="text-sm text-gray-400 shrink-0">{formatRelativePlayedAt(play.playedAt)}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
