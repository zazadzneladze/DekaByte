ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "invoice_supplier_signature_url" text;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "invoice_supplier_signature_pathname" text;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "invoice_supplier_signature_transform" jsonb;
