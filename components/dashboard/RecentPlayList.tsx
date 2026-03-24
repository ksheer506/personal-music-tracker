import type { RecentPlay } from "@/lib/mock/lastfm";
import { formatRelativePlayedAt } from "@lib/date";

type Props = {
  plays: RecentPlay[];
};

export default function RecentPlayList({ plays }: Props) {
  return (
    <ul className="divide-gray-100">
      {plays.map((play) => (
        <li
          key={play.id}
          className="px-4 py-3 flex flex-col gap-1 md:flex-row md:items-center md:justify-between"
        >
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">{play.track}</p>
            <p className="text-sm text-gray-600 truncate">
              {play.artist} · {play.album}
            </p>
          </div>
          <p className="text-sm text-gray-400 shrink-0">
            {formatRelativePlayedAt(play.playedAt)}
          </p>
        </li>
      ))}
    </ul>
  );
}
