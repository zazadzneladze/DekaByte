ALTER TYPE "public"."project_category" ADD VALUE IF NOT EXISTS 'systems';--> statement-breakpoint
ALTER TABLE "client_projects" ADD COLUMN IF NOT EXISTS "progress_percent" integer DEFAULT 0 NOT NULL;
