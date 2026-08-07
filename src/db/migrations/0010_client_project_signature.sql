ALTER TABLE "client_projects" ADD COLUMN IF NOT EXISTS "client_signature_url" text;--> statement-breakpoint
ALTER TABLE "client_projects" ADD COLUMN IF NOT EXISTS "client_signature_pathname" text;--> statement-breakpoint
ALTER TABLE "client_projects" ADD COLUMN IF NOT EXISTS "client_signature_transform" jsonb;
