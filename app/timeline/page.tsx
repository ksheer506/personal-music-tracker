export default function TimelinePage() {
  return (
    <>
      <h1 className="m-0 text-[clamp(1.5rem,2vw,2rem)] font-semibold tracking-tight">타임라인</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        v1에서는 핵심 통계에 집중하며, 타임라인은 다음 릴리스에서 확장합니다.
      </p>
      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-3 text-base font-medium">준비 중인 기능</h2>
        <ul className="m-0 list-none p-0">
          <li className="flex items-center justify-between gap-2 border-b border-slate-200 py-2 transition-colors duration-150 ease-out last:border-b-0 dark:border-slate-700">날짜별 스크로블 Drill-down</li>
          <li className="flex items-center justify-between gap-2 border-b border-slate-200 py-2 transition-colors duration-150 ease-out last:border-b-0 dark:border-slate-700">연속 청취 streak 시각화</li>
          <li className="flex items-center justify-between gap-2 border-b border-slate-200 py-2 transition-colors duration-150 ease-out last:border-b-0 dark:border-slate-700">주제별 회고 카드 생성</li>
        </ul>
      </section>
    </>
  );
}
