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

export const trackArtistRoleEnum = pgEnum("track_artist_role", [
  "main",
  "feature",
]);
