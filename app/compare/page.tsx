"use client";

import { useMemo, useState } from "react";

import type { ComparePreset } from "@/lib/mock/lastfm";
import { getCompareData } from "@/lib/mock/lastfm";
import Card from "@components/Card/Card";

const presetLabel: Record<ComparePreset, string> = {
  month: "이번 달 vs 지난 달",
  weekend: "평일 vs 주말",
  night: "주간 vs 야간",
};

export default function ComparePage() {
  const [preset, setPreset] = useState<ComparePreset>("month");
  const result = useMemo(() => getCompareData(preset), [preset]);

  return (
    <>
      <h1 className="m-0 text-[clamp(1.5rem,2vw,2rem)] font-semibold tracking-tight">비교 분석</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        상황별 비교와 자동 인사이트 문장으로 청취 습관의 차이를 파악합니다.
      </p>

      <section className="my-6 flex flex-wrap gap-2">
        {(Object.keys(presetLabel) as ComparePreset[]).map((key) => (
          <button
            key={key}
            type="button"
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors duration-150 ease-out ${
              key === preset
                ? "border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200"
            }`}
            onClick={() => setPreset(key)}
          >
            {presetLabel[key]}
          </button>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card.Hover>
          <h2 className="mb-3 text-base font-medium">{result.leftLabel}</h2>
          <p className="mt-2 text-[clamp(1.5rem,3vw,2.1rem)] font-bold tracking-tight">{result.leftValue.toLocaleString("ko-KR")}회</p>
        </Card.Hover>
        <Card.Hover>
          <h2 className="mb-3 text-base font-medium">{result.rightLabel}</h2>
          <p className="mt-2 text-[clamp(1.5rem,3vw,2.1rem)] font-bold tracking-tight">{result.rightValue.toLocaleString("ko-KR")}회</p>
          <p className={`mt-2 text-sm ${result.changeRate >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
            {result.changeRate >= 0 ? "▲" : "▼"} {Math.abs(result.changeRate)}%
          </p>
        </Card.Hover>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="mb-3 text-base font-medium">비교 인사이트</h3>
          <ul className="m-0 list-none p-0">
            {result.highlights.map((text) => (
              <li
                key={text}
                className="flex items-center justify-between gap-2 border-b border-slate-200 py-2 transition-colors duration-150 ease-out last:border-b-0 dark:border-slate-700"
              >
                {text}
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <h3 className="mb-3 text-base font-medium">요약</h3>
          <p className="text-slate-500 dark:text-slate-400">
            현재 프리셋은 <strong>{presetLabel[preset]}</strong>입니다.
            인터랙션은 240ms 슬라이드 기준으로 패널 전환되며, 차후 실제 차트 라이브러리 연결 시 동일 모션 토큰을 재사용합니다.
          </p>
        </article>
      </section>
    </>
  );
}
