import { albumArtistRoleEnum, trackArtistRoleEnum } from "@db/enums";
import { artists, trackArtists } from "@db/schema";

export type AlbumArtistRole = (typeof albumArtistRoleEnum.enumValues)[number];

export type TrackArtistRole = (typeof trackArtistRoleEnum.enumValues)[number];

export type Artist = typeof artists.$inferSelect;

export type TrackArtist = typeof trackArtists.$inferInsert