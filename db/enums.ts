import { toEnumValues } from "@lib/enum";
import { pgEnum } from "drizzle-orm/pg-core";

/**
 * - `"main"`: 대표 아티스트
 * - `"contributor"`: 참여 아티스트
 * - `"various"`: VariousArtist
 */
export const albumArtistRoleEnum = pgEnum("album_artist_role", [
  "main",
  "contributor",
  "various",
]);

export const ALBUM_ARTIST_ROLE = toEnumValues(albumArtistRoleEnum);

/**
 * - `"main"`: `"feature"`, `"with"`에 해당하는 곡의 대표 아티스트
 * - `"multiple"`: 아티스트에 표기된 참여 아티스트
 * - `"feature"`: 곡에 표기된 featuring 아티스트
 * - `"with"`: 곡에 표기된 참여 아티스트
 */
export const trackArtistRoleEnum = pgEnum("track_artist_role", [
  "main",
  "multiple",
  "feature",
  "with",
]);

export const TRACK_ARTIST_ROLE = toEnumValues(trackArtistRoleEnum);