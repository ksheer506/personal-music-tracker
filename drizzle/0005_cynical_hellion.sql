ALTER TABLE "scrobbles" DROP CONSTRAINT "scrobbles_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "users" CASCADE;
