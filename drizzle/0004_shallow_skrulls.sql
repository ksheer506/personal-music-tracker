DROP INDEX "artist_external_id_idx";--> statement-breakpoint
CREATE UNIQUE INDEX "artists_external_id_unique" ON "artists" USING btree ("external_id");