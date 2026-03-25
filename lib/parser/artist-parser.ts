import { TRACK_ARTIST_ROLE } from "@db/enums";
import { ArtistWithRole } from "@service/Spotify/types";

const parseMultiples = (v: string) => v.split(",").map((v) => v.trim()).filter(Boolean);

/**
 * 단일 곡이라도 featuring, duet 등 참여 아티스트가 2명 이상일 수 있기 때문에 
 * `track`과 `artist`에 표기된 아티스트를 파싱하여 `ArtistWithRole` 배열로 반환.
 */
export const parseArtists = (track: string, artist: string) => {
  const parsedArtists = new Set();
  const result: ArtistWithRole[] = [];
  const multiples = parseMultiples(artist)

  if (multiples.length > 1) {
    /* 1-1. artist: "A, B, C" */
    multiples.forEach((name) => {
      parsedArtists.add(name)
      result.push({ name, role: TRACK_ARTIST_ROLE.multiple })
    })
  } else {
    /* 1-2. artist: "A" */
    parsedArtists.add(artist)
    result.push({ name: artist, role: TRACK_ARTIST_ROLE.main });
  }
  const [, features] = track.match(/\(feat\.(.+?)\)/i) ?? []
  const [, withArtists] = track.match(/\(with\.(.+?)\)/i) ?? []

  if (!features && !withArtists) {
    return result
  }
  /* 2. track: "SomeSong(feat. C)" */
  if (features) {
    parseMultiples(features).forEach((name) => {
      if (!parsedArtists.has(name)) {
        parsedArtists.add(name)
        result.push({ name, role: TRACK_ARTIST_ROLE.feature })
      }
    })
  }
  /* 3. track: "SomeSong(with. C)" */
  if (withArtists) {
    parseMultiples(withArtists).forEach((name) => {
      if (!parsedArtists.has(name)) {
        parsedArtists.add(name)
        result.push({ name, role: TRACK_ARTIST_ROLE.with })
      }
    })
  }

  return result
};
