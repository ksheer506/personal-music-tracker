import { Artist } from "@db/types";
import { ArtistResolveRequest } from "@service/Artist/types";
/**
 * 이미 DB에 기록된 아티스트에 대해 Spotify API에 해당 아티스트가 추가된 경우, 
 * `externalId`가 `null`(이전 request) -> `string`(현재 request)으로 달라질 수 있기 때문에 
 * `externalId`가 있는 경우 `name` 필터를 같이 적용
 */
export const buildArtistLookupKeys = (request: ArtistResolveRequest[]) => {
  return request.reduce((a, c) => {
    if (c.externalId) {
      return { ...a, externalIds: [...(a.externalIds ?? []), c.externalId], names: [...(a.names ?? []), c.name] }
    }
    return { ...a, names: [...(a.names ?? []), c.name] };
  }, { externalIds: [] as string[], names: [] as string[] });
}

/** Spotify `artistId`가 포함된 요청 데이터와 DB에 기록된 `externalId`에서 최신의 `externalId`를 반환 */
export const getLatestExternalId = (
  req: ArtistResolveRequest[],
  artist: Artist
) => req.find((r) => r.name === artist.name)?.externalId ?? null;

export const getArtistSortName = (artist: string) => artist
  .trim()
  .toLowerCase()
  .replace(/^(the|a|an)\s+/i, "") // 앞 관사 제거
  .normalize("NFKD");
