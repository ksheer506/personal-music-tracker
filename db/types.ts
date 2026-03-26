import { albumArtistRoleEnum, trackArtistRoleEnum } from "@db/enums";
import { albumArtists, albums, artists, trackArtists, tracks } from "@db/schema";

/* Enum */

export type AlbumArtistRole = (typeof albumArtistRoleEnum.enumValues)[number];

export type TrackArtistRole = (typeof trackArtistRoleEnum.enumValues)[number];

/* Select */

export type Artist = typeof artists.$inferSelect;

export type ArtistWithRole = Artist & Pick<TrackArtist, "role">;

export type Track = typeof tracks.$inferSelect;

export type Album = typeof albums.$inferSelect;

export type TrackArtist = typeof trackArtists.$inferSelect;

/* Insert */

export type ArtistInsert = typeof artists.$inferInsert;

export type TrackInsert = typeof tracks.$inferInsert;

export type AlbumInsert = typeof albums.$inferInsert;

export type AlbumArtistInsert = typeof albumArtists.$inferInsert;

export type TrackArtistInsert = typeof trackArtists.$inferInsert;