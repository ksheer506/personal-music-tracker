"use client";

import { useEffect, useMemo, useState } from "react";

import PeriodFilter from "@/components/dashboard/PeriodFilter";
import SimpleBarChart from "@/components/dashboard/SimpleBarChart";
import type { PeriodOption } from "@/lib/design/tokens";
import { getDashboardData } from "@/lib/mock/lastfm";

type SortOption = "plays" | "name";

export default function StatsPage() {
  const [period, setPeriod] = useState<PeriodOption>("30d");
  const [minPlays, setMinPlays] = useState(20);
  const [sortBy, setSortBy] = useState<SortOption>("plays");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const data = useMemo(() => getDashboardData(period), [period]);
  const filteredArtists = useMemo(() => {
    const sorted = [...data.artists]
      .filter((item) => item.value >= minPlays)
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.label.localeCompare(b.label, "ko");
        }
        return b.value - a.value;
      });
    return sorted;
  }, [data.artists, minPlays, sortBy]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, [period, minPlays, sortBy]);

  return (
    <>
      <h1 className="m-0 text-[clamp(1.5rem,2vw,2rem)] font-semibold tracking-tight">상세 통계</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        필터 패널과 차트-리스트 동기화로 아티스트별 변화를 세밀하게 탐색합니다.
      </p>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)_minmax(0,1fr)]">
        <aside className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-3 text-base font-medium">필터</h2>
          <p className="text-slate-500 dark:text-slate-400">기간</p>
          <PeriodFilter value={period} onChange={setPeriod} />
          <p className="mt-4 text-slate-500 dark:text-slate-400">최소 재생 수</p>
          <input
            type="range"
            min={10}
            max={120}
            value={minPlays}
            className="w-full accent-indigo-500"
            onChange={(event) => setMinPlays(Number(event.target.value))}
          />
          <p className="text-slate-500 dark:text-slate-400">{minPlays}회 이상</p>
          <p className="mt-4 text-slate-500 dark:text-slate-400">정렬</p>
          <select
            value={sortBy}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-950"
            onChange={(event) => setSortBy(event.target.value as SortOption)}
          >
            <option value="plays">재생수</option>
            <option value="name">이름</option>
          </select>
        </aside>

        <section className="lg:col-span-2">
          {loading ? (
            <div className="h-[220px] animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <SimpleBarChart
                title="아티스트 재생 분포"
                items={filteredArtists}
                highlightedId={hoveredId}
                onHighlightChange={setHoveredId}
              />
              <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <h3 className="mb-3 text-base font-medium">리스트</h3>
                <ul className="m-0 list-none p-0">
                  {filteredArtists.map((artist) => (
                    <li
                      key={artist.id}
                      className={`flex items-center justify-between gap-2 border-b border-slate-200 py-2 transition-colors duration-150 ease-out last:border-b-0 dark:border-slate-700 ${
                        hoveredId === artist.id ? "text-indigo-600 dark:text-indigo-300" : ""
                      }`}
                      onMouseEnter={() => setHoveredId(artist.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <span>{artist.label}</span>
                      <strong>{artist.value}회</strong>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          )}
        </section>
      </section>
    </>
  );
}
