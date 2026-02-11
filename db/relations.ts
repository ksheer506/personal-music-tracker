import { relations } from "drizzle-orm";
import { albumArtists, albums, artists, scrobbles, trackArtists, tracks, users } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  scrobbles: many(scrobbles),
}));

export const artistsRelations = relations(artists, ({ many }) => ({
  trackArtists: many(trackArtists),
  albumArtists: many(albumArtists),
}));

export const albumsRelations = relations(albums, ({ many }) => ({
  tracks: many(tracks),
  albumArtists: many(albumArtists),
}));

export const albumArtistsRelations = relations(albumArtists, ({ one }) => ({
  album: one(albums, {
    fields: [albumArtists.albumId],
    references: [albums.id],
  }),
  artist: one(artists, {
    fields: [albumArtists.artistId],
    references: [artists.id],
  }),
}));

export const tracksRelations = relations(tracks, ({ one, many }) => ({
  album: one(albums, {
    fields: [tracks.albumId],
    references: [albums.id],
  }),
  trackArtists: many(trackArtists),
  scrobbles: many(scrobbles),
}));

export const trackArtistsRelations = relations(trackArtists, ({ one }) => ({
  track: one(tracks, {
    fields: [trackArtists.trackId],
    references: [tracks.id],
  }),
  artist: one(artists, {
    fields: [trackArtists.artistId],
    references: [artists.id],
  }),
}));

export const scrobblesRelations = relations(scrobbles, ({ one }) => ({
  user: one(users, {
    fields: [scrobbles.userId],
    references: [users.id],
  }),
  track: one(tracks, {
    fields: [scrobbles.trackId],
    references: [tracks.id],
  }),
}));