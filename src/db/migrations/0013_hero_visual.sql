ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "hero_visual" varchar(16) DEFAULT 'mark' NOT NULL;
