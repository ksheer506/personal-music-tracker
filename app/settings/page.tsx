export default function SettingsPage() {
  return (
    <>
      <h1 className="m-0 text-[clamp(1.5rem,2vw,2rem)] font-semibold tracking-tight">설정</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">
        v1 범위에서는 디자인 토큰과 뷰 설정을 중심으로 기본 옵션만 제공합니다.
      </p>
      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-3 text-base font-medium">뷰 기본값</h2>
          <ul className="m-0 list-none p-0">
            <li className="flex items-center justify-between gap-2 border-b border-slate-200 py-2 transition-colors duration-150 ease-out last:border-b-0 dark:border-slate-700">기본 기간: 30d</li>
            <li className="flex items-center justify-between gap-2 border-b border-slate-200 py-2 transition-colors duration-150 ease-out last:border-b-0 dark:border-slate-700">차트 애니메이션: on</li>
            <li className="flex items-center justify-between gap-2 border-b border-slate-200 py-2 transition-colors duration-150 ease-out last:border-b-0 dark:border-slate-700">증감 표시: 백분율</li>
          </ul>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-3 text-base font-medium">테마</h2>
          <p className="text-slate-500 dark:text-slate-400">
            시스템 다크 모드 설정을 자동으로 반영합니다.
          </p>
        </article>
      </section>
    </>
  );
}
