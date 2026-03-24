export function formatRelativePlayedAt(playedAt: string): string {
  const now = Date.now();
  const playedAtMs = new Date(playedAt).getTime();
  const diffMs = Math.max(0, now - playedAtMs);
  const minutes = Math.floor(diffMs / (1000 * 60));

  if (minutes < 1) {
    return "방금 전";
  }
  if (minutes < 60) {
    return `${minutes}분 전`;
  }
  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}시간 전`;
  }
  return `${Math.floor(hours / 24)}일 전`;
}
