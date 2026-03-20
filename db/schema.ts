import {
  pgTable,
  uuid,
  text,
  timestamp,
  date,
  integer,
  index,
  unique,
  primaryKey,
  bigserial,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { albumArtistRoleEnum, trackArtistRoleEnum } from "./enums";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  username: text("username").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const artists = pgTable(
  "artists",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    externalId: text("external_id"),
    name: text("name").notNull(),
    /** 아티스트 이름 정렬을 위한 필드. "the", "a" 등 제거, 대소문자 통일, 악센트 제거 */
    sortName: text("sort_name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    unique("artist_sort_name_unique").on(t.sortName),
    uniqueIndex("artists_external_id_unique").on(t.externalId),
  ],
);

export const albums = pgTable(
  "albums",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    releaseAt: date("release_at"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
);

export const albumArtists = pgTable(
  "album_artists",
  {
    albumId: text("album_id")
      .notNull()
      .references(() => albums.id, { onDelete: "cascade" }),
    artistId: text("artist_id")
      .notNull()
      .references(() => artists.id, { onDelete: "cascade" }),
    role: albumArtistRoleEnum("role").notNull().default("main"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.albumId, t.artistId] }),
  ],
);

export const tracks = pgTable("tracks", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  albumId: uuid("album_id").references(() => albums.id),
  durationSec: integer("duration_sec"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const trackArtists = pgTable(
  "track_artists",
  {
    trackId: uuid("track_id")
      .notNull()
      .references(() => tracks.id, { onDelete: "cascade" }),
    artistId: uuid("artist_id")
      .notNull()
      .references(() => artists.id),
    role: trackArtistRoleEnum("role").notNull().default("main"),
  },
  (t) => [
    primaryKey({ columns: [t.trackId, t.artistId] }),
    index("track_artists_track_idx").on(t.trackId),
    index("track_artists_artist_idx").on(t.artistId),
  ],
);

/* Scrobble (TimescaleDB) */
export const scrobbles = pgTable(
  "scrobbles",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    trackId: uuid("track_id")
      .notNull()
      .references(() => tracks.id),
    playedAt: timestamp("played_at", { withTimezone: true }).notNull(),
    durationSec: integer("duration_sec"),
    source: text("source"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index("scrobble_user_time_idx").on(t.userId, t.playedAt),
    index("scrobble_track_time_idx").on(t.trackId, t.playedAt),
  ],
);
