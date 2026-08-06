ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "logo_url" text;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "logo_pathname" text;
