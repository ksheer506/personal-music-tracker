import { albumArtistRoleEnum, trackArtistRoleEnum } from "@db/enums";
import { artists, trackArtists, tracks } from "@db/schema";

/* Enum */

export type AlbumArtistRole = (typeof albumArtistRoleEnum.enumValues)[number];

export type TrackArtistRole = (typeof trackArtistRoleEnum.enumValues)[number];

/* Select */

export type Artist = typeof artists.$inferSelect;

export type Track = typeof tracks.$inferSelect;

export type TrackArtist = typeof trackArtists.$inferInsert;

/* Insert */

export type ArtistInsert = typeof artists.$inferInsert;

export type TrackInsert = typeof tracks.$inferInsert;

export type TrackArtistInsert = typeof trackArtists.$inferInsert;