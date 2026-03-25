import { Music, User, Disc3, CalendarDays, CalendarCheck, Flame, Trophy, Zap, PieChart } from "lucide-react";
import RecentPlayList from "@/components/dashboard/RecentPlayList";
import { getTrackDetail, getTrackRecentPlays } from "@/lib/mock/lastfm";
import Card from "@components/Card/Card";
import TrackChartSection from "@/app/track/[id]/TrackChartSection";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function TrackDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [detail, recentPlays] = await Promise.all([
    getTrackDetail(id),
    getTrackRecentPlays(id, 10),
  ]);
  const defaultStart = new Date(detail.firstPlayedAt);
  const defaultEnd = new Date(detail.lastPlayedAt);

  return (
    <div className="mx-auto max-w-4xl pt-5 py-10">
      {/* 트랙 기본 정보 */}
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{detail.track}</h1>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4 text-gray-400" />
            {detail.artist}
          </span>
          <span className="flex items-center gap-1.5">
            <Disc3 className="h-4 w-4 text-gray-400" />
            {detail.album}
          </span>
          <span className="flex items-center gap-1.5">
            <Music className="h-4 w-4 text-gray-400" />
            총 {detail.totalPlays}회 재생
          </span>
        </div>
      </section>

      {/* 기록 요약 */}
      <section
        className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3"
        aria-label="기록 요약"
      >
        <StatGroup title="기간">
          <StatItem
            icon={<CalendarDays className="h-4 w-4 text-indigo-500" />}
            label="최초 기록일"
            value={formatDate(detail.firstPlayedAt)}
          />
          <StatItem
            icon={<CalendarCheck className="h-4 w-4 text-indigo-500" />}
            label="마지막 기록일"
            value={formatDate(detail.lastPlayedAt)}
          />
        </StatGroup>

        <StatGroup title="청취 기록">
          <StatItem
            icon={<Zap className="h-4 w-4 text-rose-500" />}
            label="하루 최다 재생"
            value={`${detail.maxDailyPlays}회`}
          />
          <StatItem
            icon={<Flame className="h-4 w-4 text-orange-500" />}
            label="최장 연속 재생일"
            value={`${detail.longestStreakDays}일`}
          />
          <StatItem
            icon={<PieChart className="h-4 w-4 text-teal-500" />}
            label="전체 스크로블 비중"
            value={`${detail.scrobbleSharePercent}%`}
          />
        </StatGroup>

        <StatGroup title="월간 순위 진입">
          <StatItem
            icon={<Trophy className="h-4 w-4 text-yellow-400" />}
            label="Top 1"
            value={`${detail.monthlyTop1Count}회`}
          />
          <StatItem
            icon={<Trophy className="h-4 w-4 text-gray-500" />}
            label="Top 3"
            value={`${detail.monthlyTop3Count}회`}
          />
          <StatItem
            icon={<Trophy className="h-4 w-4 text-amber-700" />}
            label="Top 10"
            value={`${detail.monthlyTop10Count}회`}
          />
        </StatGroup>
      </section>

      {/* 청취 횟수 추이 */}
      <TrackChartSection id={id} defaultStart={defaultStart} defaultEnd={defaultEnd} />

      {/* 최근 기록 내역 */}
      <section aria-label="최근 기록 내역">
        <div className="rounded-md border border-slate-200 bg-white">
          <div className="px-4 py-3 border-b border-slate-200">
            <h2 className="text-base font-semibold">최근 기록 내역</h2>
          </div>
          <RecentPlayList plays={recentPlays} />
        </div>
      </section>
    </div>
  );
}

function StatGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-4 pb-1">
      <p className="pb-2 text-md font-semibold tracking-wide text-gray-900">
        {title}
      </p>
      <div className="divide-y divide-slate-100">{children}</div>
    </Card>
  );
}

function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      {icon}
      <span className="text-sm text-gray-600 flex-[1_0_auto]">{label}</span>
      <span className="ml-auto text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}
