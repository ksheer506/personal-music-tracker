"use client";

import { getTrackCumulativePlays, getTrackListenHistory } from "@/lib/mock/lastfm";
import CumulativeLineChart from "@components/Chart/CumulativeLineChart";
import DrillDownBarChart from "@components/Chart/DrillDownBarChart";

interface TrackChartSectionProps {
  id: string;
  defaultStart: Date;
  defaultEnd: Date;
}

const TrackChartSection = ({ id, defaultStart, defaultEnd }: TrackChartSectionProps) => {
  return (
    <>
      {/* 청취 횟수 추이 */}
      <section className="mb-8" aria-label="기간별 청취 횟수">
        <h2 className="mb-3 text-base font-semibold text-gray-900">
          청취 횟수 추이
        </h2>
        <DrillDownBarChart getData={(...params) => getTrackListenHistory(id, ...params)} />
      </section>

      {/* 누적 청취 그래프 */}
      <section className="mb-8" aria-label="기간별 누적 청취">
        <h2 className="mb-3 text-base font-semibold text-gray-900">
          기간별 누적 청취
        </h2>
        <CumulativeLineChart
          defaultStart={defaultStart}
          defaultEnd={defaultEnd}
          getData={(start, end) => getTrackCumulativePlays(id, start, end)}
        />
      </section>
    </>
  )
}

export default TrackChartSection