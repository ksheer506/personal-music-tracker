ALTER TABLE "tracks" ADD COLUMN "raw_artist" text;--> statement-breakpoint

UPDATE "tracks" t
SET "raw_artist" = (
  SELECT string_agg(a."name", ', ' ORDER BY ta."role")
  FROM "track_artists" ta
  JOIN "artists" a ON a."id" = ta."artist_id"
  WHERE ta."track_id" = t."id"
);--> statement-breakpoint

ALTER TABLE "tracks" ALTER COLUMN "raw_artist" SET NOT NULL;
