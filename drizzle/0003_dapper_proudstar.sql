ALTER TABLE "artists" ADD COLUMN "external_id" text;--> statement-breakpoint
CREATE INDEX "artist_external_id_idx" ON "artists" USING btree ("external_id");