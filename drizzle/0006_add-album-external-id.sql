ALTER TABLE "albums" ADD COLUMN "external_id" text;--> statement-breakpoint
CREATE UNIQUE INDEX "albums_external_id_unique" ON "albums" USING btree ("external_id");